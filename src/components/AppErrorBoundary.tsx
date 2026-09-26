import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message || 'Unexpected application error.' }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[CAT2026][JARVIS][UI_ERROR]', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="jarvis-crash-screen">
        <div className="jarvis-crash-card">
          <div className="jarvis-kicker">JARVIS // FAILSAFE</div>
          <h1>CORE PAUSED</h1>
          <p>The interface hit an unexpected error. Your persisted CAT data is kept in the app database.</p>
          <div className="jarvis-crash-code">{this.state.message}</div>
          <div className="jarvis-crash-actions">
            <button onClick={() => window.location.reload()}>REBOOT CORE</button>
            <button onClick={() => { sessionStorage.removeItem('jarvis_unlocked'); window.location.reload() }}>LOCK + REBOOT</button>
          </div>
        </div>
      </div>
    )
  }
}
