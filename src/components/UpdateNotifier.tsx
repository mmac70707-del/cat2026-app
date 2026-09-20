import { useState, useEffect } from 'react'
import { APP_VERSION, LAST_UPDATED } from '@/data/config'

export function UpdateNotifier() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShow(true)
      })
    }

    const storedVer = localStorage.getItem('cat2026_app_version')
    if (storedVer && storedVer !== APP_VERSION) {
      setShow(true)
    }
    localStorage.setItem('cat2026_app_version', APP_VERSION)
  }, [])

  const handleForceRefresh = () => {
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name))
      })
    }
    window.location.reload()
  }

  if (!show) return null

  return (
    <div style={{
      background: 'linear-gradient(90deg, #1A56DB, #7C3AED)',
      color: '#FFFFFF', padding: '8px 16px', fontSize: 12, fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)', zIndex: 1100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14 }}>⚡</span>
        <span>CAT 2026 Master Engine Updated (v{APP_VERSION} • {LAST_UPDATED})</span>
      </div>
      <button
        onClick={handleForceRefresh}
        style={{
          background: '#F5A623', color: '#0A0F1E', border: 'none',
          padding: '4px 12px', borderRadius: 12, fontWeight: 900,
          fontSize: 11, cursor: 'pointer', letterSpacing: 0.5
        }}
      >
        RELOAD NOW
      </button>
    </div>
  )
}
