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

const STITCH_THEMES = [
  { id: 'apex', name: 'Apex Protocol Obsidian', color: '#F5A623', border: '#16A34A' },
  { id: 'glacier', name: 'Glacier Cyan Cybernetic', color: '#38BDF8', border: '#2563EB' },
  { id: 'athenaeum', name: 'Athenaeum Editorial Gold', color: '#FBBF24', border: '#D97706' },
  { id: 'crimson', name: 'Cybernetic Crimson Command', color: '#EF4444', border: '#7C3AED' }
]

export function SettingsPage({ onBack }: Props) {
  const [wake,          setWake]          = useState(false)
  const [quotes,        setQuotes]        = useState(true)
  const [sound,         setSound]         = useState(true)
  const [notifications, setNotifications] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState('apex')
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
    toast(`Stitch Theme updated to ${themeId.toUpperCase()} ✓`)
  }

  async function toggleNotifications() {
    const next = !notifications
    await SettingsRepository.set('notifications', next)
    setNotifications(next)
    if (isNative()) {
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
        <div className="card-title" style={{ color: '#F5A623' }}>🎨 Stitch Design System Theme Accent</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>
          Select your tactical command theme from the Stitch Design System generator:
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
