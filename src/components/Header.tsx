import { useCountdown } from '@/hooks/useCountdown'
import { usePhase } from '@/hooks/usePhase'
import { UpdateNotifier } from '@/components/UpdateNotifier'

export function Header() {
  const phase = usePhase()
  const { days, hms } = useCountdown()

  return (
    <>
      <UpdateNotifier />
      <div className="app-header">
        <div>
          <div className="app-title">CAT 2026</div>
          <div className="app-subtitle">
            <span style={{ color: '#22C55E', fontWeight: 800 }}>🟢 Synced</span> • Offline Ready
          </div>
        </div>
        <div
          className="phase-badge"
          style={{ background: phase.color }}
        >
          {phase.id} — {phase.name}
        </div>
        <div className="countdown-wrap">
          <div className="countdown-days">{days}</div>
          <div className="countdown-label">days left</div>
          <div className="countdown-hms">{hms}</div>
        </div>
      </div>
    </>
  )
}
