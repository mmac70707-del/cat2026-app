import { Component, type ErrorInfo, type ReactNode } from 'react'
import { recordAudit } from '@/services/auditLog'

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

const HOOK_RECOVERY_KEY = 'cat2026_hook_recovery_v1'

async function recoverStaleRuntime() {
  try {
    const registrations = await navigator.serviceWorker?.getRegistrations()
    await Promise.all((registrations || []).map(reg => reg.unregister()))
  } catch {}

  try {
    const keys = await globalThis.caches?.keys()
    await Promise.all((keys || []).map(key => globalThis.caches.delete(key)))
  } catch {}

  await new Promise(resolve => setTimeout(resolve, 120))
  window.location.reload()
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message || 'Unexpected application error.' }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[CAT2026][JARVIS][UI_ERROR]', error, info)
    void recordAudit('ui_error', error?.message || 'Unexpected application error', 'react-error-boundary')

    const hookMismatch = /Rendered (more|fewer) hooks|invalid hook call/i.test(error?.message || '')
    const recoveredAlready = sessionStorage.getItem(HOOK_RECOVERY_KEY) === '1'

    if (hookMismatch && !recoveredAlready) {
      sessionStorage.setItem(HOOK_RECOVERY_KEY, '1')
      void recordAudit('runtime_recovery_started', 'Clearing stale PWA runtime after React hook-order error')
      void recoverStaleRuntime()
    }
  }

  private hardReboot = async () => {
    sessionStorage.removeItem(HOOK_RECOVERY_KEY)
    await recoverStaleRuntime()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const hookMismatch = /Rendered (more|fewer) hooks|invalid hook call/i.test(this.state.message)

    return (
      <div className="jarvis-crash-screen">
        <div className="jarvis-crash-card">
          <div className="jarvis-kicker">JARVIS // FAILSAFE</div>
          <h1>{hookMismatch ? 'RUNTIME REPAIR' : 'CORE PAUSED'}</h1>
          <p>
            {hookMismatch
              ? 'A cached runtime mismatch was detected. JARVIS is clearing the stale web runtime and rebooting the core.'
              : 'The interface hit an unexpected error. Your persisted CAT data is kept in the app database.'}
          </p>
          <div className="jarvis-crash-code">{this.state.message}</div>
          <div className="jarvis-crash-actions">
            <button onClick={this.hardReboot}>{hookMismatch ? 'REPAIR + REBOOT' : 'REBOOT CORE'}</button>
            <button onClick={() => { sessionStorage.clear(); window.location.reload() }}>FULL RESET + REBOOT</button>
          </div>
          <div className="jarvis-crash-foot">
            {hookMismatch ? 'ONE-TIME CACHE RECOVERY • YOUR STUDY DATA IS NOT DELETED' : 'JARVIS FAILSAFE • PERSISTED STUDY DATA IS KEPT'}
          </div>
        </div>
      </div>
    )
  }
}
