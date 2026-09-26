import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { dbGetAll, openDB } from '@/db'
import { listRecentAudit, recordAudit, type AuditEvent } from '@/services/auditLog'
import { getDeviceCapabilities, isNative } from '@/services/native'

interface Props { onBack?: () => void }
type Check = { label: string; value: string; ok: boolean }

export function SecuritySentinelPage({ onBack }: Props) {
  const [events, setEvents] = useState<AuditEvent[]>([])
  const [checks, setChecks] = useState<Check[]>([])
  const [status, setStatus] = useState<'checking' | 'nominal' | 'attention'>('checking')
  const [nativeCaps, setNativeCaps] = useState<Record<string, boolean> | null>(null)

  const runIntegrityCheck = useCallback(async () => {
    setStatus('checking')
    const next: Check[] = []
    const cryptoReady = typeof crypto !== 'undefined' && !!crypto.subtle
    next.push({ label: 'WEB CRYPTO', value: cryptoReady ? 'AVAILABLE' : 'UNAVAILABLE', ok: cryptoReady })

    let dbOk = false
    let storeCount = 0
    try {
      const db = await openDB()
      storeCount = db.objectStoreNames.length
      await dbGetAll('auditEvents')
      dbOk = db.objectStoreNames.contains('auditEvents')
    } catch {
      dbOk = false
    }
    next.push({ label: 'INDEXEDDB VAULT', value: dbOk ? `${storeCount} STORES • ONLINE` : 'UNAVAILABLE', ok: dbOk })

    const pinConfigured =
      localStorage.getItem('jarvis_web_pin_v2') != null ||
      localStorage.getItem('jarvis_web_pin_v1') != null
    next.push({ label: 'WEB PIN', value: pinConfigured ? 'CONFIGURED' : 'NOT CONFIGURED', ok: pinConfigured })

    next.push({
      label: 'TRANSPORT',
      value: isNative() ? 'ANDROID WEBMESSAGE' : 'PWA HTTPS',
      ok: true
    })

    if (isNative()) {
      const caps = await getDeviceCapabilities()
      setNativeCaps(caps)
      next.push({
        label: 'NATIVE GATE',
        value: caps ? (caps.secureUnlock ? 'SECURE UNLOCK AVAILABLE' : 'LIMITED') : 'NO RESPONSE',
        ok: !!caps
      })
    } else {
      setNativeCaps(null)
      next.push({ label: 'NATIVE GATE', value: 'N/A IN BROWSER', ok: true })
    }

    setChecks(next)
    setStatus(next.every(c => c.ok) ? 'nominal' : 'attention')
    setEvents(await listRecentAudit(32))
    await recordAudit('security_integrity_check', next.map(c => `${c.label}=${c.value}`).join(' | '))
  }, [])

  useEffect(() => { void runIntegrityCheck() }, [runIntegrityCheck])

  const fmt = (ts: number) => new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'Asia/Kolkata'
  }).format(new Date(ts))

  const statusLabel = status === 'checking' ? 'CHECKING' : status === 'nominal' ? 'NOMINAL' : 'ATTENTION'

  return (
    <div className="jarvis-page">
      <div className="jarvis-topbar">
        <div>
          <div className="jarvis-kicker">JARVIS // SECURITY SENTINEL</div>
          <div className="jarvis-subcopy">Integrity checks • local security state • audit telemetry</div>
        </div>
        <div className="jarvis-sentinel-status">{statusLabel}</div>
      </div>

      <div className="jarvis-status-grid">
        {checks.slice(0, 4).map(check => (
          <div className="jarvis-status-cell" key={check.label}>
            <div className="jarvis-status-label">{check.label}</div>
            <div className="jarvis-status-value" style={{color: check.ok ? 'var(--jarvis-green)' : 'var(--jarvis-red)'}}>
              {check.ok ? 'OK' : 'CHECK'}
            </div>
          </div>
        ))}
      </div>

      <div className="jarvis-main-grid">
        <Panel title="◉ INTEGRITY CHECK">
          <div className="jarvis-sentinel-checks">
            {checks.map(check => (
              <div className="jarvis-sentinel-row" key={check.label}>
                <span>{check.label}</span>
                <b className={check.ok ? 'good' : 'bad'}>{check.value}</b>
              </div>
            ))}
          </div>
          <div className="jarvis-sentinel-actions">
            <button className="jarvis-action" onClick={() => void runIntegrityCheck()}>↻ RECHECK</button>
            <button className="jarvis-action" onClick={() => window.dispatchEvent(new Event('jarvis:lock'))}>🔒 LOCK</button>
          </div>
        </Panel>

        <Panel title="◉ NATIVE CAPABILITIES">
          <div className="jarvis-info-list">
            <div>HOST: <b>{isNative() ? 'ANDROID' : 'PWA / BROWSER'}</b></div>
            <div>PIN GATE: <b>{nativeCaps?.pinGate ? 'NATIVE + WEB' : 'WEB SESSION'}</b></div>
            <div>BIOMETRIC: <b>{nativeCaps?.biometric ? 'AVAILABLE' : isNative() ? 'UNAVAILABLE' : 'BROWSER'}</b></div>
            <div>NATIVE INTENTS: <b>{nativeCaps?.nativeIntents ? 'ALLOWLISTED' : isNative() ? 'CHECKING' : 'N/A'}</b></div>
          </div>
        </Panel>

        <Panel title={`◉ AUDIT STREAM • ${events.length}`}>
          <div className="jarvis-sentinel-events">
            {events.length === 0 && <div className="jarvis-command-empty">NO AUDIT EVENTS YET</div>}
            {events.map(event => (
              <div className="jarvis-sentinel-event" key={event.id}>
                <div className="jarvis-sentinel-event-top">
                  <b>{event.type}</b><span>{fmt(event.ts)}</span>
                </div>
                {event.detail && <div>{event.detail}</div>}
                <small>{event.source || 'web'}</small>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      {onBack && <button className="jarvis-action" style={{marginTop:10}} onClick={onBack}>← BACK TO COMMAND LIBRARY</button>}
    </div>
  )
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="jarvis-panel">
      <div className="jarvis-panel-title">{title}</div>
      <div className="jarvis-panel-body">{children}</div>
    </section>
  )
}
