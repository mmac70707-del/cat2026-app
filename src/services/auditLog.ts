import { openDB, dbPut } from '@/db'

export type AuditEvent = {
  id: string
  ts: number
  type: string
  detail?: string
  source?: string
}

function makeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'audit-' + Date.now() + '-' + Math.random().toString(36).slice(2)
}

export async function recordAudit(type: string, detail?: string, source = 'web') {
  try {
    await openDB()
    await dbPut<AuditEvent>('auditEvents', { id: makeId(), ts: Date.now(), type, detail, source })
  } catch (error) {
    console.warn('[CAT2026][AUDIT] unable to persist event', error)
  }
}

export function installGlobalErrorAudit() {
  const onError = (event: ErrorEvent) => {
    void recordAudit('runtime_error', event.message || 'Unhandled runtime error')
  }
  const onRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason instanceof Error ? event.reason.message : String(event.reason ?? 'Unhandled rejection')
    void recordAudit('unhandled_rejection', reason)
  }
  window.addEventListener('error', onError)
  window.addEventListener('unhandledrejection', onRejection)
  return () => {
    window.removeEventListener('error', onError)
    window.removeEventListener('unhandledrejection', onRejection)
  }
}
