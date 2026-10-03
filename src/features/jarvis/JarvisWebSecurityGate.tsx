import { useEffect, useRef, useState, type ReactNode } from 'react'
import { recordAudit } from '@/services/auditLog'
import { createSpeechRecognizer } from '@/services/voiceJarvisService'
import { authenticateBiometric, isNative } from '@/services/native'
import { clearVaultKey, isVaultUnlocked, unlockVaultWithNative, unlockVaultWithPin } from '@/services/secureVault'

const PIN_KEY = 'jarvis_web_pin_v2'
const LEGACY_PIN_KEY = 'jarvis_web_pin_v1'
const ATTEMPTS_KEY = 'jarvis_failed_attempts_v1'
const LOCK_UNTIL_KEY = 'jarvis_lock_until_v1'
const INACTIVITY_MS = 30 * 60 * 1000
const PBKDF2_ITERATIONS = 600_000

type PinRecord = {
  version: 2
  algorithm: 'PBKDF2-SHA-256'
  iterations: number
  salt: string
  hash: string
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=')
  const binary = atob(normalized)
  return Uint8Array.from(binary, c => c.charCodeAt(0))
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  return copy.buffer
}

async function derivePin(pin: string, salt: ArrayBuffer, iterations = PBKDF2_ITERATIONS) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(pin),
    'PBKDF2',
    false,
    ['deriveBits']
  )

  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    256
  )

  return new Uint8Array(bits)
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

async function createRecord(pin: string): Promise<PinRecord> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const hash = await derivePin(pin, toArrayBuffer(salt))
  return {
    version: 2,
    algorithm: 'PBKDF2-SHA-256',
    iterations: PBKDF2_ITERATIONS,
    salt: bytesToBase64Url(salt),
    hash: bytesToBase64Url(hash)
  }
}

async function verifyRecord(pin: string, record: PinRecord) {
  const derived = await derivePin(pin, toArrayBuffer(base64UrlToBytes(record.salt)), record.iterations)
  return constantTimeEqual(derived, base64UrlToBytes(record.hash))
}

async function legacyDigest(pin: string) {
  const bytes = new TextEncoder().encode(pin)
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function getRecord(): PinRecord | null {
  const raw = localStorage.getItem(PIN_KEY)
  if (!raw) return null
  try {
    const value = JSON.parse(raw) as PinRecord
    if (value.version === 2 && value.algorithm === 'PBKDF2-SHA-256') return value
  } catch {}
  return null
}

function getLockRemainingMs() {
  const until = Number(localStorage.getItem(LOCK_UNTIL_KEY) || '0')
  return Math.max(0, until - Date.now())
}

export function JarvisWebSecurityGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [configured, setConfigured] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [pin, setPin] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [directiveIndex, setDirectiveIndex] = useState(0)
  const [lockedMs, setLockedMs] = useState(getLockRemainingMs())
  const [biometricState, setBiometricState] = useState<'idle' | 'scanning' | 'verified'>('idle')
  const [voiceListening, setVoiceListening] = useState(false)
  const idleTimer = useRef<number | null>(null)
  const voiceRecognizerRef = useRef<{ stop: () => void } | null>(null)
  const unlockedRef = useRef(false)

  useEffect(() => {
    const configuredNow = Boolean(getRecord() || localStorage.getItem(LEGACY_PIN_KEY))
    setConfigured(configuredNow)
    setReady(true)

    const onUnlock = async () => {
      try {
        await unlockVaultWithNative()
        unlockedRef.current = true
        setUnlocked(true)
        await recordAudit('jarvis_unlocked', 'Native Android verification accepted')
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Secure native vault unavailable')
        await recordAudit('jarvis_unlock_error', String(error))
      }
    }

    const onLock = async () => {
      clearVaultKey()
      unlockedRef.current = false
      setUnlocked(false)
      setPin('')
      setConfirm('')
      setMessage('JARVIS locked.')
      await recordAudit('jarvis_locked', 'Session locked')
    }

    const resetIdle = () => {
      if (!unlockedRef.current) return
      if (idleTimer.current) window.clearTimeout(idleTimer.current)
      idleTimer.current = window.setTimeout(onLock, INACTIVITY_MS)
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') resetIdle()
    }

    window.addEventListener('jarvis:unlocked', onUnlock as EventListener)
    window.addEventListener('jarvis:lock', onLock)
    window.addEventListener('pointerdown', resetIdle)
    window.addEventListener('keydown', resetIdle)
    document.addEventListener('visibilitychange', onVisibility)
    resetIdle()

    const interval = window.setInterval(() => setLockedMs(getLockRemainingMs()), 250)
    return () => {
      window.removeEventListener('jarvis:unlocked', onUnlock as EventListener)
      window.removeEventListener('jarvis:lock', onLock)
      window.removeEventListener('pointerdown', resetIdle)
      window.removeEventListener('keydown', resetIdle)
      document.removeEventListener('visibilitychange', onVisibility)
      window.clearInterval(interval)
      if (idleTimer.current) window.clearTimeout(idleTimer.current)
      if (voiceRecognizerRef.current) voiceRecognizerRef.current.stop()
    }
  }, [])

  const directives = [
    ['THE MAGIC', 'YOU ARE LOOKING FOR', 'IS IN THE WORK YOU ARE AVOIDING.'],
    ['THE WORK', 'YOU KEEP AVOIDING', 'IS THE DOOR YOU KEEP LOOKING FOR.'],
    ['DISCIPLINE', 'BEATS MOTIVATION', 'WHEN MOTIVATION DISAPPEARS.'],
    ['CONSISTENCY', 'BUILDS THE MAN', 'YOU WANT TO BECOME.'],
    ['FOCUS', 'ON WHAT MATTERS', 'AND LET THE NOISE LOSE.'],
    ['BECOME', 'THE MAN YOU PROMISED', 'ONE DECISION AT A TIME.'],
    ['START BEFORE', 'YOU FEEL READY', 'CLARITY COMES FROM ACTION.'],
    ['NO RANDOM MOVES', 'JUST THE NEXT BLOCK', 'EXECUTE. REVIEW. REPAIR. RETEST.'],
    ['DO THE WORK', 'BEFORE YOU SEEK', 'THE FEELING OF BEING READY.'],
    ['YOUR FUTURE', 'IS BUILT IN BORING MOMENTS', 'WHEN YOU CHOOSE TO SHOW UP AGAIN.'],
    ['FOCUS', 'IS A DECISION', 'NOT A MOOD YOU WAIT TO FEEL.'],
    ['MAKE THE PROMISE', 'THEN KEEP IT', 'ONE BLOCK AT A TIME.'],
  ] as const

  useEffect(() => {
    const id = window.setInterval(() => setDirectiveIndex(i => (i + 1) % directives.length), 7000)
    return () => window.clearInterval(id)
  }, [])

  if (!ready) return null

  async function submit() {
    if (lockedMs > 0) {
      setMessage(`Security cooldown active: ${Math.ceil(lockedMs / 1000)}s`)
      return
    }

    if (!/^\d{6}$/.test(pin)) {
      setMessage('PIN must be exactly 6 digits.')
      return
    }

    if (!configured) {
      if (pin !== confirm) {
        setMessage('PINs do not match. Enter the same PIN twice.')
        return
      }

      const record = await createRecord(pin)
      localStorage.setItem(PIN_KEY, JSON.stringify(record))
      localStorage.removeItem(LEGACY_PIN_KEY)
      localStorage.removeItem(ATTEMPTS_KEY)
      localStorage.removeItem(LOCK_UNTIL_KEY)
      await unlockVaultWithPin(pin, record.salt, record.iterations)
      unlockedRef.current = true
      setUnlocked(true)
      await recordAudit('jarvis_pin_created', 'Initial web PIN configured and secure vault unlocked')
      return
    }

    const record = getRecord()
    let valid = false

    if (record) {
      valid = await verifyRecord(pin, record)
      if (valid) await unlockVaultWithPin(pin, record.salt, record.iterations)
    } else {
      const legacy = localStorage.getItem(LEGACY_PIN_KEY)
      valid = legacy === (await legacyDigest(pin))
      if (valid) {
        const upgraded = await createRecord(pin)
        localStorage.setItem(PIN_KEY, JSON.stringify(upgraded))
        localStorage.removeItem(LEGACY_PIN_KEY)
        await unlockVaultWithPin(pin, upgraded.salt, upgraded.iterations)
      }
    }

    if (valid && isVaultUnlocked()) {
      localStorage.removeItem(ATTEMPTS_KEY)
      localStorage.removeItem(LOCK_UNTIL_KEY)
      unlockedRef.current = true
      setUnlocked(true)
      await recordAudit('jarvis_unlocked', 'PIN verified and secure vault unlocked')
      return
    }

    const attempts = Number(localStorage.getItem(ATTEMPTS_KEY) || '0') + 1
    localStorage.setItem(ATTEMPTS_KEY, String(attempts))

    // Exponential backoff begins gently, then becomes deliberately expensive.
    const cooldown = Math.min(15 * 60_000, 1000 * 2 ** Math.min(attempts - 1, 10))
    localStorage.setItem(LOCK_UNTIL_KEY, String(Date.now() + cooldown))
    void recordAudit('jarvis_unlock_failed', `PIN verification failed; cooldown ${Math.ceil(cooldown / 1000)}s`)
    setLockedMs(cooldown)
    setPin('')
    setMessage(`Incorrect PIN. Security cooldown: ${Math.ceil(cooldown / 1000)}s`)
  }

  const lockedSeconds = Math.ceil(lockedMs / 1000)

  async function startDeviceBiometric() {
    if (lockedMs > 0 || biometricState === 'scanning') return

    if (isNative()) {
      setBiometricState('scanning')
      setMessage('JARVIS is opening the real Android biometric prompt. Use your registered face, fingerprint, or device credential.')
      authenticateBiometric()
      setTimeout(() => setBiometricState('idle'), 900)
      return
    }
    // Browser WebAuthn credentials are intentionally not invoked here.
    // They are commonly presented by Android as a "passkey" flow and require
    // credential registration. The real Android app has a native BiometricPrompt
    // for Face / Fingerprint; the browser gate uses the secure 6-digit PIN.
    setMessage('Browser lock uses the secure 6-digit PIN. Install the Android app for the real Face / Fingerprint system prompt.')
    setBiometricState('idle')
  }

  function startVoiceUnlock() {
    if (lockedMs > 0) return
    if (voiceListening) {
      voiceRecognizerRef.current?.stop()
      voiceRecognizerRef.current = null
      setVoiceListening(false)
      setMessage('Voice unlock trigger stopped.')
      return
    }

    const rec = createSpeechRecognizer(
      (text) => {
        const normalized = text.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()
        setMessage('Heard: "' + text + '"')
        const unlockPhrase =
          (normalized.includes('hey jarvis') || normalized === 'jarvis' || normalized.includes('jarvis')) &&
          (normalized.includes('unlock') || normalized.includes('open'))

        if (!unlockPhrase) return

        voiceRecognizerRef.current?.stop()
        voiceRecognizerRef.current = null
        setVoiceListening(false)
        setMessage('Voice command accepted. Now confirm your identity with the real device biometric.')
        void startDeviceBiometric()
      },
      (error) => {
        voiceRecognizerRef.current = null
        setVoiceListening(false)
          setMessage('Voice trigger unavailable: ' + error + '. Use Passkey / Face / Fingerprint or PIN.')
      },
      () => {
        voiceRecognizerRef.current = null
        setVoiceListening(false)
      }
    )

    if (!rec) {
      setMessage('Speech recognition is not supported here. Use Passkey / Face / Fingerprint or PIN.')
      return
    }

    voiceRecognizerRef.current = rec
    setVoiceListening(true)
    setMessage('Listening for: “Hey Jarvis, unlock”')
    rec.start()
  }

  if (unlocked) return <>{children}</>

  return (
    <main className="jarvis-lock-v5" aria-label="JARVIS secure lock screen">
      <div className="jarvis-lock-v5__backdrop" aria-hidden="true" />
      <div className="jarvis-lock-v5__grid" aria-hidden="true" />
      <div className="jarvis-lock-v5__scan" aria-hidden="true" />
      <section className="jarvis-lock-v5__shell">
        <header className="jarvis-lock-v5__topbar">
          <div className="jarvis-lock-v5__brand"><span className="jarvis-lock-v5__orb" /><span>JARVIS</span><small>PRIVATE CORE</small></div>
          <div className="jarvis-lock-v5__status"><span className="jarvis-lock-v5__dot" /> LOCAL / LOCKED</div>
        </header>

        <section className="jarvis-lock-v5__hero">
          <div className="jarvis-lock-v5__identity">
            <div className="jarvis-lock-v5__portrait-frame">
              <img src="/images/ashish_billboard.webp" alt="Ashish" />
              <span className="jarvis-lock-v5__portrait-ring" />
              <span className="jarvis-lock-v5__portrait-tag">01</span>
            </div>
            <div className="jarvis-lock-v5__identity-copy">
              <span className="jarvis-lock-v5__eyebrow">EXECUTION PROTOCOL</span>
              <h1>WELCOME BACK, ASHISH</h1>
              <p>One secure gate between you and today&apos;s execution system.</p>
            </div>
          </div>
          <div className="jarvis-lock-v5__quote-zone">
            <span className="jarvis-lock-v5__quote-label">DAILY DIRECTIVE / {String(directiveIndex + 1).padStart(2, '0')} OF {String(directives.length).padStart(2, '0')}</span>
            <blockquote className="jarvis-lock-v5__quote" key={directiveIndex}>
              <span>{directives[directiveIndex][0]}</span>
              <strong>{directives[directiveIndex][1]}</strong>
              <em>{directives[directiveIndex][2]}</em>
            </blockquote>
            <div className="jarvis-lock-v5__signals">
              <span>SHOW UP</span><i /><span>DO THE HARD THING</span><i /><span>MOVE FORWARD</span>
            </div>
            <div className="jarvis-lock-v5__micro-quotes" aria-label="Personal directives">
              <span>DISCIPLINE &gt; MOOD</span>
              <span>CONSISTENCY &gt; INTENSITY</span>
              <span>DISCIPLINE &gt; MOOD</span>
              <span>CONSISTENCY &gt; INTENSITY</span>
              <span>DISTRACTION &lt; DISCIPLINE</span>
              <span>FOCUS &gt; NOISE</span>
              <span>BECOME THE MAN YOU PROMISED</span>
            </div>
          </div>
        </section>

        <section className="jarvis-lock-v5__auth-rail" aria-label="Quick JARVIS authentication">
          <div className="jarvis-lock-v5__auth-heading">
            <span className="jarvis-lock-v5__auth-kicker">JARVIS QUICK AUTH</span>
            <span className="jarvis-lock-v5__auth-note">PLATFORM AUTH • PIN PROTECTED</span>
          </div>

          <div className="jarvis-lock-v5__auth-grid">
            <button
              type="button"
              className={`jarvis-lock-v5__auth-card ${biometricState === 'verified' ? 'is-verified' : ''}`}
              onClick={startDeviceBiometric}
              disabled={lockedMs > 0 || biometricState === 'scanning'}
              aria-label="Use passkey, fingerprint, or face device verification"
            >
              <span className="jarvis-lock-v5__auth-glyph jarvis-lock-v5__auth-glyph--biometric" aria-hidden="true">◉</span>
              <span className="jarvis-lock-v5__auth-copy">
                <strong>{biometricState === 'scanning' ? 'VERIFYING DEVICE' : biometricState === 'verified' ? 'DEVICE VERIFIED' : 'FACE / FINGERPRINT'}</strong>
                <small>Real biometric prompt is available in the Android app; browser fallback stays PIN-only.</small>
              </span>
              <span className="jarvis-lock-v5__auth-action">{biometricState === 'scanning' ? '•••' : biometricState === 'verified' ? '✓' : 'SCAN'}</span>
            </button>

            <button
              type="button"
              className={`jarvis-lock-v5__auth-card ${voiceListening ? 'is-speaking' : ''}`}
              onClick={startVoiceUnlock}
              aria-label="Use voice to trigger biometric verification"
            >
              <span className="jarvis-lock-v5__auth-glyph jarvis-lock-v5__auth-glyph--voice" aria-hidden="true">◌</span>
              <span className="jarvis-lock-v5__auth-copy">
                <strong>{voiceListening ? 'VOICE → VERIFY' : 'VOICE UNLOCK TRIGGER'}</strong>
                <small>Say “Hey Jarvis, unlock” → real biometric check</small>
              </span>
              <span className="jarvis-lock-v5__auth-action">{voiceListening ? 'LISTENING' : 'START'}</span>
            </button>
          </div>

          <div className={`jarvis-lock-v5__voice-banner ${voiceListening ? 'is-active' : ''}`} role="status" aria-live="polite">
            <span className="jarvis-lock-v5__voice-dot" aria-hidden="true" />
            <span><strong>JARVIS:</strong> {voiceListening ? 'VOICE TRIGGER ACTIVE — SAY “HEY JARVIS, UNLOCK”.' : 'VOICE NEVER BYPASSES BIOMETRIC SECURITY.'}</span>
            <span className="jarvis-lock-v5__wave" aria-hidden="true"><i/><i/><i/><i/><i/></span>
          </div>
        </section>

        <section className="jarvis-lock-v5__console">
          <div className="jarvis-lock-v5__console-head">
            <div><span>SECURITY CORE</span><strong>{configured ? 'AUTHENTICATE TO CONTINUE' : 'INITIALISE PRIVATE CORE'}</strong></div>
            <div className="jarvis-lock-v5__shield">SECURE</div>
          </div>
          <p className="jarvis-lock-v5__hint">{configured ? 'Enter your private 6-digit PIN to unlock JARVIS.' : 'Create a private 6-digit PIN for this browser.'}</p>
          <div className="jarvis-lock-v5__input-wrap">
            <span>PIN</span>
            <input value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" autoComplete="off" type="password" maxLength={6} autoFocus placeholder="••••••" disabled={lockedMs>0} aria-label="JARVIS six digit PIN" />
            <span className="jarvis-lock-v5__pin-count">{pin.length}/6</span>
          </div>
          {!configured && <div className="jarvis-lock-v5__input-wrap jarvis-lock-v5__input-wrap--confirm">
            <span>CONFIRM</span>
            <input value={confirm} onChange={e=>setConfirm(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" autoComplete="off" type="password" maxLength={6} placeholder="••••••" disabled={lockedMs>0} aria-label="Confirm JARVIS six digit PIN" />
          </div>}
          <button className="jarvis-lock-v5__unlock" onClick={submit} disabled={lockedMs>0}>
            <span>{lockedMs>0 ? `LOCKED ${lockedSeconds}s` : configured ? 'UNLOCK JARVIS' : 'CREATE SECURE PIN'}</span><b>↗</b>
          </button>
          <div className="jarvis-lock-v5__message" role="status">{message}</div>
          <div className="jarvis-lock-v5__telemetry">
            <span>PBKDF2</span><i /><span>SALTED</span><i /><span>AUTO-LOCK 30M</span><i /><span>LOCAL VAULT</span><i /><span>READY</span>
          </div>
        </section>

        <footer className="jarvis-lock-v5__footer"><span>CAT 2026 / PERSONAL INTELLIGENCE OS</span><span>DEFENSE IN DEPTH</span></footer>
      </section>
    </main>
  )
}
