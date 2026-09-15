import { useState, useEffect } from 'react'
import { SettingsRepository, resetAllData } from '@/repositories/index'
import { TaskRepository } from '@/repositories/TaskRepository'
import { ErrorRepository } from '@/repositories/ErrorRepository'
import { MasteryRepository } from '@/repositories/MasteryRepository'
import { MockRepository, DailyScoreRepository } from '@/repositories/index'
import { useToast } from '@/components/Toast'
import { todayKey } from '@/services/domain'
import { downloadScheduleICS } from '@/services/calendarExport'
import { isNative, requestNotificationPermission, setNotificationsEnabled } from '@/services/native'

interface Props { onBack: () => void }

export function SettingsPage({ onBack }: Props) {
  const [wake,          setWake]          = useState(false)
  const [quotes,        setQuotes]        = useState(true)
  const [sound,         setSound]         = useState(false)
  const [notifications, setNotifications] = useState(false)
  const { show: toast } = useToast()

  useEffect(() => {
    Promise.all([
      SettingsRepository.get('wake',          false),
      SettingsRepository.get('quotes',        true),
      SettingsRepository.get('sound',         false),
      SettingsRepository.get('notifications', false),
    ]).then(([w, q, s, n]) => {
      setWake(w as boolean)
      setQuotes(q as boolean)
      setSound(s as boolean)
      setNotifications(n as boolean)
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

  async function toggleNotifications() {
    const next = !notifications
    await SettingsRepository.set('notifications', next)
    setNotifications(next)
    if (isNative()) {
      // Requests the real Android 13+ runtime permission the first
      // time, and schedules/cancels the two daily WorkManager
      // reminders (09:00 mission, 21:00 error log) via the native
      // bridge — this toggle controls a real Android system, not a
      // stored preference that does nothing.
      if (next) requestNotificationPermission()
      else setNotificationsEnabled(false)
      toast(next ? 'Notifications on — grant the Android permission if prompted' : 'Notifications off')
    } else {
      toast('Native app only — open this in the Android app to receive real reminders', '#D97706')
    }
  }

  function exportCalendar() {
    downloadScheduleICS()
    toast('Calendar file downloaded — import it into Outlook, Google Calendar, or Apple Calendar')
  }

  async function exportData() {
    const [tasks, errors, masts, mocks, scores] = await Promise.all([
      TaskRepository.getAllHistorical(),
      ErrorRepository.getAll(),
      MasteryRepository.getAll(),
      MockRepository.getAll(),
      DailyScoreRepository.getAll(),
    ])
    const blob = new Blob(
      [JSON.stringify({ exportedAt: new Date().toISOString(), tasks, errors, masts, mocks, scores }, null, 2)],
      { type: 'application/json' }
    )
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `cat2026_export_${todayKey()}.json`
    a.click()
    toast('Data exported ✓')
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
    { key: 'sound',  label: 'Sounds',              sub: 'Block completion sounds',       val: sound,  setter: setSound },
  ]

  return (
    <div className="section-pad">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="page-header-title">Settings</div>
      </div>

      <div className="card">
        <div className="setting-row" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Daily Reminders</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>
              {isNative() ? 'Real notifications — 09:00 mission, 21:00 error log' : 'Android app only'}
            </div>
          </div>
          <div className={`toggle ${notifications ? 'on' : ''}`} onClick={toggleNotifications}>
            <div className="toggle-knob" />
          </div>
        </div>
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
        <div className="card-title">Data Management</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
          All data stored in IndexedDB on this device. Survives refresh + restart.
        </div>
        <button className="btn-ghost" onClick={exportData} style={{ marginBottom: 8 }}>
          📤 Export All Data (JSON)
        </button>
        <button className="btn-danger" onClick={confirmReset}>
          🗑️ Reset All Data
        </button>
      </div>

      <div className="card">
        <div className="card-title">About</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
          Stack: React 18 + TypeScript + Vite<br />
          Native: Android WebView host (WebViewAssetLoader)<br />
          Storage: IndexedDB (real persistence)<br />
          Phase: Dynamic (calculated from date)<br />
          Countdown: Live (seconds ticker)<br />
          75 days to CAT 2026 — one mission.
        </div>
      </div>
    </div>
  )
}
