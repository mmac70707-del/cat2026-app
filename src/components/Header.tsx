import { useCountdown } from '@/hooks/useCountdown'
import { usePhase } from '@/hooks/usePhase'

// Auth and the multi-exam switcher were removed: the sign-in was
// simulated (hardcoded a fake identity, called no real API), and
// switching exams only changed this header's colour — nothing else
// in the app read that state. Both were decorative, not functional.
// This app has one user and one mission: CAT 2026. Every element
// below does something real.

export function Header() {
  const phase = usePhase()
  const { days, hms } = useCountdown()

  return (
    <div className="app-header">
      <div>
        <div className="app-title">CAT 2026</div>
        <div className="app-subtitle">75-Day Execution System</div>
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
  )
}
