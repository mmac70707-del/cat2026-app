import { useState, useEffect, useRef, type ChangeEvent } from 'react'
import { SettingsRepository, resetAllData } from '@/repositories/index'
import { dbGetAll, dbPut, openDB } from '@/db'
import { encryptBackup, decryptBackup, type EncryptedBackupEnvelope } from '@/services/portableBackup'
import { exportSecureMemory, importSecureMemory } from '@/services/secureVault'
import { recordAudit } from '@/services/auditLog'
import { TaskRepository } from '@/repositories/TaskRepository'
import { ErrorRepository } from '@/repositories/ErrorRepository'
import { MasteryRepository } from '@/repositories/MasteryRepository'
import { MockRepository, DailyScoreRepository } from '@/repositories/index'
import { useToast } from '@/components/Toast'
import { todayKey } from '@/services/domain'
import { downloadScheduleICS } from '@/services/calendarExport'
import { isNative, requestNotificationPermission, setNotificationsEnabled } from '@/services/native'
import { enableWebNotificationScheduler, disableWebNotificationScheduler, isWebNotificationSupported, requestWebNotificationPermission, getWebNotificationPermission, sendWebNotificationTest } from '@/services/webNotifications'
import { type TextSize, type ThemeMode, getTextSize, getThemeMode, isFocusMode, applyTextSize, applyThemeMode, applyFocusMode, applyStitchTheme } from '@/services/uiPreferences'

interface Props { onBack: () => void }

const STITCH_THEMES = [
  { id: 'apex', name: 'Graphite + Champagne', color: '#CBB780', border: '#8FB5AA' },
  { id: 'glacier', name: 'Steel + Sage', color: '#8FAEAC', border: '#557C80' },
  { id: 'athenaeum', name: 'Editorial Ivory', color: '#927238', border: '#D8C9A0' },
  { id: 'crimson', name: 'Muted Rosewood', color: '#B86E70', border: '#7D5556' }
]

export function SettingsPage({ onBack }: Props) {
  const [wake,          setWake]          = useState(false)
  const [quotes,        setQuotes]        = useState(true)
  const [sound,         setSound]         = useState(true)
  const [notifications, setNotifications] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState('apex')
  const [textSize, setTextSize] = useState<TextSize>(() => getTextSize())
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => getThemeMode())
  const [focusMode, setFocusMode] = useState(() => isFocusMode())
  const backupInputRef = useRef<HTMLInputElement>(null)
  const { show: toast } = useToast()

  useEffect(() => {
    Promise.all([
      SettingsRepository.get('wake',          false),
      SettingsRepository.get('quotes',        true),
      SettingsRepository.get('sound',         true),
      SettingsRepository.get('notifications', false),
      SettingsRepository.get('stitchTheme',    'apex'),
    ]).then(([w, q, s, n, th]) => {
      setWake(w as boolean)
      setQuotes(q as boolean)
      setSound(s as boolean)
      setNotifications(n as boolean)
      setSelectedTheme(th as string || 'apex')
    })
  }, [])

  async function toggleSetting(key: string, val: boolean, setter: (v: boolean) => void) {
    const next = !val
    await SettingsRepository.set(key, next)
    setter(next)
    toast(`${key} ${next ? 'on' : 'off'}`)
    if (key === 'wake' && next && 'wakeLock' in navigator) {
      try { await (navigator as any).wakeLock.request('screen') } catch (_) {}
    }
  }

  async function handleSelectTheme(themeId: string) {
    setSelectedTheme(themeId)
    await SettingsRepository.set('stitchTheme', themeId)
    applyStitchTheme(themeId)
    toast(`Accent color updated to ${themeId.toUpperCase()} ✓`)
  }

  async function toggleNotifications() {
    const next = !notifications

    if (isNative()) {
      await SettingsRepository.set('notifications', next)
      setNotifications(next)
      if (next) requestNotificationPermission()
      else setNotificationsEnabled(false)
      toast(next ? 'Android notifications on — allow the permission if prompted' : 'Notifications off')
      return
    }

    if (!isWebNotificationSupported()) {
      toast('This browser does not support app notifications', '#D97706')
      return
    }

    if (next) {
      const permission = await requestWebNotificationPermission()
      if (permission !== 'granted') {
        await SettingsRepository.set('notifications', false)
        setNotifications(false)
        toast('Notification permission was not granted', '#D97706')
        return
      }
      await SettingsRepository.set('notifications', true)
      setNotifications(true)
      enableWebNotificationScheduler()
      toast('App alerts ON — timed block reminders run while this app is open; import the calendar for alerts when closed')
    } else {
      await SettingsRepository.set('notifications', false)
      setNotifications(false)
      disableWebNotificationScheduler()
      toast('App alerts off')
    }
  }

  function testNotification() {
    const ok = sendWebNotificationTest()
    toast(ok ? 'Test notification sent ✓' : 'Allow notifications first', ok ? '#16A34A' : '#D97706')
  }

  function exportCalendar() {
    downloadScheduleICS()
    toast('Calendar file downloaded — import it into Outlook, Google Calendar, or Apple Calendar')
  }

  async function exportData() {
    try {
      const password = window.prompt('Create a backup password (10+ characters). You will need it to restore this backup.')
      if (!password) return
      const confirm = window.prompt('Confirm the backup password.')
      if (password !== confirm) {
        toast('Backup passwords do not match', '#D97706')
        return
      }

      const db = await openDB()
      const stores: Record<string, unknown[]> = {}
      for (const name of Array.from(db.objectStoreNames)) {
        if (name === 'secureVault') continue
        stores[name] = await dbGetAll<unknown>(name)
      }

      const secureMemory = await exportSecureMemory()
      const envelope = await encryptBackup({
        format: 'CAT2026_FULL_VAULT',
        version: 1,
        exportedAt: new Date().toISOString(),
        stores,
        secureMemory,
      }, password)

      const blob = new Blob([JSON.stringify(envelope, null, 2)], { type: 'application/json' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `cat2026_secure_backup_${todayKey()}.cat2026backup.json`
      a.click()
      URL.revokeObjectURL(a.href)
      await recordAudit('secure_backup_exported', 'Encrypted portable backup created')
      toast('Encrypted backup exported ✓')
    } catch (error) {
      await recordAudit('secure_backup_export_failed', error instanceof Error ? error.message : String(error))
      toast(error instanceof Error ? error.message : 'Secure backup export failed', '#DC2626')
    }
  }

  async function restoreData(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const password = window.prompt('Enter the backup password.')
      if (!password) return

      const raw = await file.text()
      const envelope = JSON.parse(raw) as EncryptedBackupEnvelope
      const payload = await decryptBackup<{
        format: string
        version: number
        stores: Record<string, unknown[]>
        secureMemory: Array<{ keyId: string; value: string }>
      }>(envelope, password)

      if (payload.format !== 'CAT2026_FULL_VAULT' || payload.version !== 1 || !payload.stores || !Array.isArray(payload.secureMemory)) {
        throw new Error('Invalid CAT 2026 backup payload.')
      }

      if (!window.confirm('Restore this backup? Existing matching records will be overwritten; unrelated records will remain.')) return

      const db = await openDB()
      for (const [storeName, records] of Object.entries(payload.stores)) {
        if (!db.objectStoreNames.contains(storeName) || !Array.isArray(records)) continue
        for (const record of records) {
          await dbPut(storeName, record)
        }
      }
      const secureCount = await importSecureMemory(payload.secureMemory)
      await recordAudit('secure_backup_restored', `Restored app data + ${secureCount} encrypted memory records`)
      toast('Backup restored ✓ — refreshing the app')
      window.setTimeout(() => window.location.reload(), 450)
    } catch (error) {
      await recordAudit('secure_backup_restore_failed', error instanceof Error ? error.message : String(error))
      toast('Restore failed: wrong password or damaged backup', '#DC2626')
    }
  }


  async function confirmReset() {
    if (!window.confirm('Reset ALL data? This cannot be undone.')) return
    await resetAllData()
    toast('All data reset', '#DC2626')
    window.location.reload()
  }

  const rows = [
    { key: 'wake',   label: 'Screen Awake',       sub: 'Keep screen on while studying', val: wake,   setter: setWake },
    { key: 'quotes', label: 'Motivational Quotes', sub: 'Show daily mantra',             val: quotes, setter: setQuotes },
    { key: 'sound',  label: 'Audio Feedback & Chimes', sub: 'Play chime tone on block completion', val: sound,  setter: setSound },
  ]

  return (
    <div className="section-pad">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="page-header-title">Settings &amp; Stitch Theme System</div>
      </div>

      {/* STITCH DESIGN SYSTEM THEME SELECTOR */}
      <div className="card" style={{ border: '1px solid #F5A623' }}>
        <div className="card-title" style={{ color: '#F5A623' }}>🎨 Appearance & Accent Palette</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>
          Choose a restrained accent palette. Light / Dark / System mode stays independent:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
          {STITCH_THEMES.map(th => (
            <div
              key={th.id}
              onClick={() => handleSelectTheme(th.id)}
              style={{
                background: selectedTheme === th.id ? 'rgba(245,166,35,0.2)' : 'var(--navy3)',
                border: `1px solid ${selectedTheme === th.id ? th.color : 'var(--border2)'}`,
                borderRadius: 8, padding: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10
              }}
            >
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: th.color }}></div>
              <div style={{ fontSize: 11, fontWeight: selectedTheme === th.id ? 800 : 600, color: selectedTheme === th.id ? '#FFF' : 'var(--muted)' }}>
                {th.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card appearance-settings-card">
        <div className="card-title">◐ Appearance &amp; Readability</div>
        <div className="appearance-setting">
          <div>
            <div className="appearance-label">Theme mode</div>
            <div className="appearance-sub">Dark, Light, or follow your device.</div>
          </div>
          <div className="appearance-segment" role="group" aria-label="Theme mode">
            {([
              ['dark', 'Dark'],
              ['light', 'Light'],
              ['system', 'System'],
            ] as const).map(([value, label]) => (
              <button key={value} type="button" className={`appearance-segment-btn ${themeMode === value ? 'is-active' : ''}`} aria-pressed={themeMode === value}
                onClick={() => { setThemeMode(value); applyThemeMode(value) }}>{label}</button>
            ))}
          </div>
        </div>
        <div className="appearance-setting">
          <div>
            <div className="appearance-label">Text size</div>
            <div className="appearance-sub">Larger text improves readability without changing your CAT data.</div>
          </div>
          <div className="appearance-size-row" role="group" aria-label="Text size">
            {([
              ['normal', 'A', 'Normal'],
              ['large', 'A+', 'Large'],
              ['xlarge', 'A++', 'XL'],
            ] as const).map(([value, glyph, label]) => (
              <button key={value} type="button" className={`appearance-size-btn ${textSize === value ? 'is-active' : ''}`} aria-pressed={textSize === value}
                onClick={() => { setTextSize(value); applyTextSize(value) }}>
                <strong>{glyph}</strong><span>{label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="appearance-setting appearance-setting--focus">
          <div>
            <div className="appearance-label">Focus Mode</div>
            <div className="appearance-sub">Reduce visual noise and put CAT execution first.</div>
          </div>
          <button type="button" className={`appearance-toggle ${focusMode ? 'is-active' : ''}`} aria-pressed={focusMode}
            onClick={() => { const next = !focusMode; setFocusMode(next); applyFocusMode(next) }}>
            {focusMode ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="appearance-note">Your display choices are saved on this device.</div>
      </div>

      <div className="card">
        <div className="setting-row" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Daily Reminders</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>
              {isNative() ? 'Native reminders — permission-controlled Android alerts' : isWebNotificationSupported() ? 'Web/PWA alerts — two daily app reminders while app is open' : 'Notifications are not supported in this browser'}
            </div>
          </div>
          <div className={`toggle ${notifications ? 'on' : ''}`} onClick={toggleNotifications}>
            <div className="toggle-knob" />
          </div>
        </div>
        {!isNative() && isWebNotificationSupported() && notifications && getWebNotificationPermission() === 'granted' && (
          <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <button className="btn-ghost" onClick={testNotification} style={{ width: '100%' }}>
              🔔 Send Test App Notification
            </button>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 6, lineHeight: 1.5 }}>
              Browser/PWA alerts work while the app is open. For closed-app alerts, use the Android native app or the existing Outlook Calendar reminders.
            </div>
          </div>
        )}
        {rows.map((r, i) => (
          <div key={r.key} className="setting-row" style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{r.label}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{r.sub}</div>
            </div>
            <div
              className={`toggle ${r.val ? 'on' : ''}`}
              onClick={() => toggleSetting(r.key, r.val, r.setter)}
            >
              <div className="toggle-knob" />
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ borderColor: 'rgba(245,166,35,.3)' }}>
        <div className="card-title">📅 Calendar — Phone + Laptop Reminders</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.6 }}>
          Exports your real daily schedule as a calendar file. Import it into <strong style={{ color: 'var(--text)' }}>Outlook</strong>,{' '}
          <strong style={{ color: 'var(--text)' }}>Google Calendar</strong>, or <strong style={{ color: 'var(--text)' }}>Apple Calendar</strong> and
          every block gets a real alarm — on your phone and your laptop, wherever that account is signed in. Repeats daily until 29 Nov 2026.
        </div>
        <button className="btn-primary" onClick={exportCalendar}>
          📥 Download Calendar File (.ics)
        </button>
      </div>

      <div className="card">
        <div className="card-title">Backup &amp; Recovery</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.6 }}>
          Full CAT execution data plus private JARVIS memory can be exported as a password-protected AES-256-GCM backup.
          The backup is portable; it does not contain your PIN.
        </div>
        <button className="btn-primary" onClick={() => void exportData()} style={{ width: '100%', marginBottom: 8 }}>
          🔐 Export Encrypted Backup
        </button>
        <input ref={backupInputRef} type="file" accept=".cat2026backup.json,application/json" onChange={restoreData} style={{ display: 'none' }} />
        <button className="btn-ghost" onClick={() => backupInputRef.current?.click()} style={{ width: '100%', marginBottom: 8 }}>
          ♻️ Restore Encrypted Backup
        </button>
        <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.5 }}>
          Uses a separate backup password and PBKDF2 + AES-256-GCM. Keep the password safe; there is no recovery copy.
        </div>
      </div>

      <div className="card">
        <div className="card-title">Data Reset</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
          Permanently erase all local CAT data from this device.
        </div>
        <button className="btn-danger" onClick={confirmReset}>
          🗑️ Reset All Data
        </button>
      </div>

      <div className="card">
        <div className="card-title">About Stitch Design Engine</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
          Engine: Stitch H612 Apex Protocol Design System<br />
          Stack: React 18 + TypeScript + Vite + Web Audio API<br />
          Native: Android WebView host (WebViewAssetLoader)<br />
          Storage: IndexedDB (real persistence)<br />
          Phase: Dynamic (calculated from date)<br />
          Countdown: Live (seconds ticker)
        </div>
      </div>
    </div>
  )
}
