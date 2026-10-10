import { useEffect, useState } from 'react'
import { APP_VERSION, LAST_UPDATED } from '@/data/config'
import { getKolkataDateParts } from '@/services/calendarEngine'

export function UpdateNotifier() {

  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  const { year, month, date, hours, minutes } = getKolkataDateParts(now)
  const nowLabel = `${String(date).padStart(2, '0')} ${String(month).padStart(2, '0')} ${year} • ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} IST`

  const handleForceRefresh = async () => {
    try {
      const registration = await navigator.serviceWorker?.getRegistration()
      if (registration) await registration.update()
    } catch {
      // A refresh still gives the PWA loader a chance to reconcile the latest build.
    } finally {
      window.location.reload()
    }
  }

  return (
    <div style={{
      background: 'var(--ui-surface)',
      borderBottom: '1px solid var(--ui-border-strong)',
      color: 'var(--ui-text)', padding: '8px 12px', fontSize: 11, fontWeight: 700,
      display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8,
      boxShadow: '0 2px 10px var(--shadow-soft)', zIndex: 1100, fontFamily: 'JetBrains Mono, monospace'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: '1 1 220px', overflowWrap: 'anywhere' }}>
        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--ui-positive)', animation: 'pulse 1.5s infinite' }}></span>
        <span>⚡ CAT 2026 LIVE ENGINE • v{APP_VERSION} • NOW {nowLabel} • RELEASE {LAST_UPDATED}</span>
      </div>
      <button
        onClick={handleForceRefresh}
        style={{
          background: 'var(--ui-accent)', color: 'var(--ui-bg)', border: '1px solid var(--ui-border-strong)',
          padding: '5px 10px', borderRadius: 10, fontWeight: 800,
          fontSize: 10, cursor: 'pointer', letterSpacing: 0.4, flexShrink: 0
        }}
      >
        🔄 CHECK FOR UPDATE
      </button>
    </div>
  )
}
