import { useCountdown } from '@/hooks/useCountdown'
import { usePhase } from '@/hooks/usePhase'
import { UpdateNotifier } from '@/components/UpdateNotifier'
import { getKolkataDateKey } from '@/services/calendarEngine'
import { PERCENTYL_WEEKS } from '@/data/percentylPlan2'

export function Header() {
  const phase = usePhase()
  const { days, hms } = useCountdown()
  const nowKey = getKolkataDateKey()
  const curWeek = PERCENTYL_WEEKS.find(w => nowKey >= w.startDate && nowKey <= w.endDate) || PERCENTYL_WEEKS[0]

  return (
    <>
      <UpdateNotifier />
      <div className="app-header">
        <div>
          <div className="app-title">CAT 2026</div>
          <div className="app-subtitle">
            <span style={{ color: '#F5A623', fontWeight: 800 }}>🔥 Week {curWeek.weekNum}/7</span> • {curWeek.dates}
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
