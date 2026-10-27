import { useEffect, useState } from 'react'
import { dbGetAll } from '@/db'
import { AppIcon } from '@/components/AppIcon'

type Props = { onBack: () => void }

const STORES = [
  'tasks', 'errors', 'masteryTopics', 'mocks', 'dailyScores', 'settings',
  'formulaReviews', 'roadmap44', 'dilrSets', 'varcLogs', 'artifacts', 'plans',
  'weeklySummaries', 'auditEvents', 'missionRuns', 'secureVault',
] as const

type Health = {
  online: boolean
  notifications: NotificationPermission | 'unsupported'
  serviceWorker: 'ready' | 'not registered' | 'unsupported'
  storage: string
}

export function SystemHealthPage({ onBack }: Props) {
  const [health, setHealth] = useState<Health>({
    online: navigator.onLine,
    notifications: 'Notification' in window ? Notification.permission : 'unsupported',
    serviceWorker: 'serviceWorker' in navigator ? 'not registered' : 'unsupported',
    storage: 'Checking…',
  })
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [lastBackup, setLastBackup] = useState<string>(() => localStorage.getItem('cat2026:last-backup') || 'No backup created on this device yet')

  useEffect(() => {
    let active = true
    const updateNetwork = () => setHealth(v => ({ ...v, online: navigator.onLine }))
    window.addEventListener('online', updateNetwork)
    window.addEventListener('offline', updateNetwork)
    void (async () => {
      let serviceWorker: Health['serviceWorker'] = 'unsupported'
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration()
          serviceWorker = registration?.active ? 'ready' : 'not registered'
        } catch { serviceWorker = 'not registered' }
      }
      let storage = 'Unavailable'
      try {
        const estimate = await navigator.storage?.estimate()
        if (estimate) {
          const used = estimate.usage ?? 0
          const quota = estimate.quota ?? 0
          storage = quota ? `${(used / 1024 / 1024).toFixed(1)} MB used of ${(quota / 1024 / 1024).toFixed(0)} MB` : 'Usage estimate unavailable'
        }
      } catch { storage = 'Usage estimate unavailable' }
      if (active) setHealth(v => ({ ...v, serviceWorker, storage }))
    })()
    return () => { active = false; window.removeEventListener('online', updateNetwork); window.removeEventListener('offline', updateNetwork) }
  }, [])

  async function exportBackup() {
    setBusy(true)
    setMessage('')
    try {
      const stores: Record<string, unknown[]> = {}
      for (const name of STORES) stores[name] = await dbGetAll(name)
      const backup = {
        format: 'chrono-vyu-backup',
        schemaVersion: 1,
        createdAt: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        stores,
      }
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `chrono-vyu-backup-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
      const stamp = new Date().toLocaleString()
      localStorage.setItem('cat2026:last-backup', stamp)
      setLastBackup(stamp)
      setMessage('Backup file created. Save it somewhere safe; it stays on your device until you move it.')
    } catch (error) {
      setMessage(`Backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally { setBusy(false) }
  }

  async function testNotification() {
    if (!('Notification' in window)) {
      setMessage('Browser notifications are not supported here. Use the calendar backup below instead.')
      return
    }
    try {
      const permission = Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission
      setHealth(v => ({ ...v, notifications: permission }))
      if (permission !== 'granted') {
        setMessage('Notifications are blocked or not allowed. Enable them in your browser/site settings, then test again.')
        return
      }
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration()
        if (registration?.showNotification) {
          await registration.showNotification('Chrono Vyu test', { body: 'Test passed: this browser can display a notification while the app is available.' })
        } else {
          new Notification('Chrono Vyu test', { body: 'Test passed in the current browser session.' })
        }
      } else {
        new Notification('Chrono Vyu test', { body: 'Test passed in the current browser session.' })
      }
      setMessage('Test notification requested. This verifies display permission only—not scheduled delivery while the app is closed.')
    } catch (error) {
      setMessage(`Notification test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  function downloadCalendar() {
    const events = [
      ['CAT Daily Command', '20261027T084500', '20261027T085000', 'Review today’s CAT plan and choose the first task.'],
      ['Daily CAT deep work', '20261027T090000', '20261027T103000', 'Quantitative Aptitude: follow the current official CAT plan.'],
      ['DILR deep work', '20261027T104500', '20261027T120000', 'Data Interpretation and Logical Reasoning practice.'],
      ['VARC deep work', '20261027T121500', '20261027T131500', 'Verbal Ability and Reading Comprehension practice.'],
      ['Mock analysis and error repair', '20261027T210000', '20261027T214500', 'Review mistakes and write root causes.'],
    ]
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Chrono Vyu//CAT 2026//EN',
      'CALSCALE:GREGORIAN', 'X-WR-TIMEZONE:Asia/Kolkata',
      ...events.flatMap(([title, start, end, description], i) => [
        'BEGIN:VEVENT', `UID:chrono-vyu-${i}-20261027@cat2026-app`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\\.\\d{3}/, '')}`,
        `DTSTART;TZID=Asia/Kolkata:${start}`, `DTEND;TZID=Asia/Kolkata:${end}`,
        `SUMMARY:${title}`, `DESCRIPTION:${description}`, 'END:VEVENT',
      ]),
      'END:VCALENDAR',
    ].join('\\r\\n')
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url; a.download = 'chrono-vyu-cat-reminder-template.ics'; a.click()
    URL.revokeObjectURL(url)
    setMessage('Calendar template downloaded. It contains sample events for 27 Oct 2026 only—review/edit before importing; it is not the full CAT schedule.')
  }

  const rows = [
    { title: 'Connection', value: health.online ? 'Online' : 'Offline', detail: health.online ? 'Network reachable' : 'Local features may still work' },
    { title: 'Browser notifications', value: health.notifications, detail: 'Permission/display check only; scheduled delivery is not guaranteed' },
    { title: 'Service worker', value: health.serviceWorker, detail: 'App shell/offline behaviour depends on registration and cache state' },
    { title: 'Local storage estimate', value: health.storage, detail: 'Browser estimate; not a backup or cloud sync' },
  ]

  return (
    <div className="section-pad" style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 36 }}>
      <button type="button" onClick={onBack} className="btn-secondary" style={{ marginBottom: 18 }}>← Back to command library</button>
      <header style={{ marginBottom: 22 }}>
        <div className="jarvis-library-kicker">CHRONO VYU // RELIABILITY</div>
        <h1 style={{ margin: '8px 0', fontSize: 'clamp(26px, 5vw, 38px)' }}>App Health & Backup</h1>
        <p style={{ color: 'var(--text-secondary, #94a3b8)', maxWidth: 650, lineHeight: 1.6 }}>
          One place to check this device, test notification permission, and protect your study data. No score or progress is changed by these checks.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12, marginBottom: 22 }}>
        {rows.map(row => <article key={row.title} style={{ border: '1px solid var(--border, #334155)', borderRadius: 16, padding: 16, background: 'var(--surface, rgba(15,23,42,.55))' }}>
          <div style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{row.title}</div>
          <div style={{ fontWeight: 750, fontSize: 19, margin: '10px 0 6px', overflowWrap: 'anywhere' }}>{String(row.value)}</div>
          <div style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: 12, lineHeight: 1.5 }}>{row.detail}</div>
        </article>)}
      </section>

      <section style={{ border: '1px solid var(--border, #334155)', borderRadius: 18, padding: 18, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><AppIcon name="shield" size={20} /><h2 style={{ margin: 0, fontSize: 18 }}>Protect your progress</h2></div>
        <p style={{ color: 'var(--text-secondary, #94a3b8)', lineHeight: 1.6 }}>Export tasks, mock results, settings, error logs, mastery and other supported local database stores into a JSON backup. Keep a copy outside this device. This does not create cloud sync.</p>
        <div style={{ fontSize: 12, marginBottom: 12 }}>Last backup: <strong>{lastBackup}</strong></div>
        <button type="button" className="btn-primary" onClick={() => void exportBackup()} disabled={busy}>{busy ? 'Preparing backup…' : '↓ Export all app data'}</button>
      </section>

      <section style={{ border: '1px solid var(--border, #334155)', borderRadius: 18, padding: 18, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><AppIcon name="bell" size={20} /><h2 style={{ margin: 0, fontSize: 18 }}>Reminder diagnostics</h2></div>
        <p style={{ color: 'var(--text-secondary, #94a3b8)', lineHeight: 1.6 }}>Run a real display-permission test. Browser notifications often need permission and may behave differently when the browser/app is closed. This test does not claim a future reminder is scheduled.</p>
        <button type="button" className="btn-primary" onClick={() => void testNotification()}>Test notification permission</button>
      </section>

      <section style={{ border: '1px solid var(--border, #334155)', borderRadius: 18, padding: 18, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><AppIcon name="calendar" size={20} /><h2 style={{ margin: 0, fontSize: 18 }}>Calendar fallback</h2></div>
        <p style={{ color: 'var(--text-secondary, #94a3b8)', lineHeight: 1.6 }}>Download a small editable calendar template. It is deliberately labelled as a sample—not the full official schedule. Review the times and dates before importing it into Outlook or Google Calendar.</p>
        <button type="button" className="btn-secondary" onClick={downloadCalendar}>↓ Download sample .ics</button>
      </section>

      {message && <div role="status" aria-live="polite" style={{ borderRadius: 12, padding: 14, marginTop: 16, background: 'var(--surface, rgba(15,23,42,.55))', border: '1px solid var(--border, #334155)', lineHeight: 1.6 }}>{message}</div>}
      <p style={{ marginTop: 18, fontSize: 12, color: 'var(--text-secondary, #94a3b8)', lineHeight: 1.6 }}>
        Safety note: importing or restoring backups is not enabled here yet. Keep the JSON file private because it may contain your personal study records.
      </p>
    </div>
  )
}
