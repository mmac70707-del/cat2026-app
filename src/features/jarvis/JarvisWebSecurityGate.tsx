import { useEffect, useRef, useState, type ReactNode } from 'react'

const PIN_KEY = 'jarvis_web_pin_v2'
const LEGACY_PIN_KEY = 'jarvis_web_pin_v1'
const ATTEMPTS_KEY = 'jarvis_failed_attempts_v1'
const LOCK_UNTIL_KEY = 'jarvis_lock_until_v1'
const SESSION_KEY = 'jarvis_unlocked'
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

async function derivePin(pin: string, salt: Uint8Array, iterations = PBKDF2_ITERATIONS) {
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
  const hash = await derivePin(pin, salt)
  return {
    version: 2,
    algorithm: 'PBKDF2-SHA-256',
    iterations: PBKDF2_ITERATIONS,
    salt: bytesToBase64Url(salt),
    hash: bytesToBase64Url(hash)
  }
}

async function verifyRecord(pin: string, record: PinRecord) {
  const derived = await derivePin(pin, base64UrlToBytes(record.salt), record.iterations)
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
  const [pin, setPin] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [lockedMs, setLockedMs] = useState(getLockRemainingMs())
  const idleTimer = useRef<number | null>(null)

  useEffect(() => {
    const configuredNow = Boolean(getRecord() || localStorage.getItem(LEGACY_PIN_KEY))
    setConfigured(configuredNow)
    setReady(true)

    const onLock = () => {
      sessionStorage.removeItem(SESSION_KEY)
      window.location.reload()
    }

    const resetIdle = () => {
      if (sessionStorage.getItem(SESSION_KEY) !== '1') return
      if (idleTimer.current) window.clearTimeout(idleTimer.current)
      idleTimer.current = window.setTimeout(onLock, INACTIVITY_MS)
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') resetIdle()
    }

    window.addEventListener('jarvis:lock', onLock)
    window.addEventListener('pointerdown', resetIdle)
    window.addEventListener('keydown', resetIdle)
    document.addEventListener('visibilitychange', onVisibility)
    resetIdle()

    const interval = window.setInterval(() => setLockedMs(getLockRemainingMs()), 250)
    return () => {
      window.removeEventListener('jarvis:lock', onLock)
      window.removeEventListener('pointerdown', resetIdle)
      window.removeEventListener('keydown', resetIdle)
      document.removeEventListener('visibilitychange', onVisibility)
      window.clearInterval(interval)
      if (idleTimer.current) window.clearTimeout(idleTimer.current)
    }
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

      localStorage.setItem(PIN_KEY, JSON.stringify(await createRecord(pin)))
      localStorage.removeItem(LEGACY_PIN_KEY)
      localStorage.removeItem(ATTEMPTS_KEY)
      localStorage.removeItem(LOCK_UNTIL_KEY)
      sessionStorage.setItem(SESSION_KEY, '1')
      window.location.reload()
      return
    }

    const record = getRecord()
    let valid = false

    if (record) {
      valid = await verifyRecord(pin, record)
    } else {
      const legacy = localStorage.getItem(LEGACY_PIN_KEY)
      valid = legacy === (await legacyDigest(pin))
      if (valid) {
        localStorage.setItem(PIN_KEY, JSON.stringify(await createRecord(pin)))
        localStorage.removeItem(LEGACY_PIN_KEY)
      }
    }

    if (valid) {
      localStorage.removeItem(ATTEMPTS_KEY)
      localStorage.removeItem(LOCK_UNTIL_KEY)
      sessionStorage.setItem(SESSION_KEY, '1')
      window.location.reload()
      return
    }

    const attempts = Number(localStorage.getItem(ATTEMPTS_KEY) || '0') + 1
    localStorage.setItem(ATTEMPTS_KEY, String(attempts))

    // Exponential backoff begins gently, then becomes deliberately expensive.
    const cooldown = Math.min(15 * 60_000, 1000 * 2 ** Math.min(attempts - 1, 10))
    localStorage.setItem(LOCK_UNTIL_KEY, String(Date.now() + cooldown))
    setLockedMs(cooldown)
    setPin('')
    setMessage(`Incorrect PIN. Security cooldown: ${Math.ceil(cooldown / 1000)}s`)
  }

  if (sessionStorage.getItem(SESSION_KEY) === '1') return <>{children}</>

  const lockedSeconds = Math.ceil(lockedMs / 1000)

  return (
    <div style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'radial-gradient(circle at 50% 15%,rgba(0,245,255,.10),transparent 36%),#03070A',color:'#E7FDFB',fontFamily:'Inter,Arial,sans-serif',padding:20}}>
      <div style={{width:'min(430px,94vw)',padding:'30px 22px',border:'1px solid rgba(0,245,255,.28)',borderRadius:24,background:'rgba(4,13,16,.96)',boxShadow:'0 0 50px rgba(0,245,255,.10)',textAlign:'center'}}>
        <div style={{width:86,height:86,margin:'0 auto 16px',borderRadius:'50%',border:'2px solid #00F5FF',boxShadow:'0 0 30px rgba(0,245,255,.28)',display:'grid',placeItems:'center',fontSize:30,color:'#00F5FF'}}>◉</div>
        <div style={{fontSize:10,letterSpacing:1.6,color:'#39FF88',marginBottom:10}}>JARVIS // SECURITY CORE</div>
        <h1 style={{fontSize:23,color:'#00F5FF',margin:'8px 0'}}>{configured ? 'WELCOME BACK, ASHISH' : 'INITIAL JARVIS SETUP'}</h1>
        <p style={{fontSize:12,color:'#7E9EA0',lineHeight:1.5}}>{configured ? 'Enter your private 6-digit PIN to unlock the execution system.' : 'Create a private 6-digit PIN. It is protected with a salted slow derivation on this browser.'}</p>
        <input value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" autoComplete="off" type="password" maxLength={6} autoFocus placeholder="••••••" disabled={lockedMs>0} style={{width:'100%',padding:15,borderRadius:12,border:'1px solid rgba(0,245,255,.20)',background:'#010608',color:'#E7FDFB',textAlign:'center',fontSize:23,letterSpacing:9,outline:'none'}} />
        {!configured && <input value={confirm} onChange={e=>setConfirm(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" autoComplete="off" type="password" maxLength={6} placeholder="CONFIRM PIN" disabled={lockedMs>0} style={{width:'100%',padding:15,marginTop:10,borderRadius:12,border:'1px solid rgba(0,245,255,.20)',background:'#010608',color:'#E7FDFB',textAlign:'center',fontSize:20,letterSpacing:7,outline:'none'}} />}
        <button onClick={submit} disabled={lockedMs>0} style={{width:'100%',padding:14,marginTop:12,border:0,borderRadius:12,fontWeight:900,background:lockedMs>0?'#334155':'#00F5FF',color:'#001114',cursor:lockedMs>0?'not-allowed':'pointer'}}>{lockedMs>0?`LOCKED ${lockedSeconds}s`:configured?'UNLOCK JARVIS':'CREATE SECURE PIN'}</button>
        <div style={{minHeight:40,marginTop:12,fontSize:12,color:'#CBD5E1'}}>{message}</div>
        <div style={{fontSize:10,color:'#4F6669'}}>Defense-in-depth • PBKDF2 • salted PIN • cooldown • auto-lock</div>
      </div>
    </div>
  )
}
