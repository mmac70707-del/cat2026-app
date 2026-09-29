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
      background: 'linear-gradient(90deg, #0D1B2A, #1E293B)',
      borderBottom: '1px solid #F5A623',
      color: '#FFFFFF', padding: '6px 16px', fontSize: 11, fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 2px 10px rgba(0,0,0,0.4)', zIndex: 1100, fontFamily: 'JetBrains Mono, monospace'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#22C55E', animation: 'pulse 1.5s infinite' }}></span>
        <span>⚡ CAT 2026 LIVE ENGINE • v{APP_VERSION} • NOW {nowLabel} • RELEASE {LAST_UPDATED}</span>
      </div>
      <button
        onClick={handleForceRefresh}
        style={{
          background: '#F5A623', color: '#0A0F1E', border: 'none',
          padding: '3px 10px', borderRadius: 10, fontWeight: 900,
          fontSize: 10, cursor: 'pointer', letterSpacing: 0.5
        }}
      >
        🔄 CHECK FOR UPDATE
      </button>
    </div>
  )
}
