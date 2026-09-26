import { useCountdown } from '@/hooks/useCountdown'
import { usePhase } from '@/hooks/usePhase'
import { UpdateNotifier } from '@/components/UpdateNotifier'
import { getKolkataDateKey } from '@/services/calendarEngine'
import { PERCENTYL_WEEKS } from '@/data/percentylPlan2'

export function Header({
  onOpenVoiceJarvis,
  onOpenJarvisHud
}: {
  onOpenVoiceJarvis?: () => void
  onOpenJarvisHud?: () => void
}) {
  const phase = usePhase()
  const { days, hms } = useCountdown()
  const nowKey = getKolkataDateKey()
  const curWeek = PERCENTYL_WEEKS.find(w => nowKey >= w.startDate && nowKey <= w.endDate) || PERCENTYL_WEEKS[0]

  return (
    <>
      <UpdateNotifier />
      <div className="app-header">
        <div>
          <div className="app-title app-title-row">
            <span>CAT 2026</span>
            {onOpenVoiceJarvis && (
              <button
                onClick={onOpenVoiceJarvis}
                className="header-utility header-utility-voice"
                aria-label="Open JARVIS voice"
              >
                <span aria-hidden="true">●</span><span className="header-utility-label">JARVIS</span>
              </button>
            )}
            {onOpenJarvisHud && (
              <button
                onClick={onOpenJarvisHud}
                className="header-utility header-utility-hud"
                aria-label="Open JARVIS HUD"
              >
                <span aria-hidden="true">◉</span><span className="header-utility-label">HUD</span>
              </button>
            )}
          </div>
          <div className="app-subtitle">
            <span className="app-week">Week {curWeek.weekNum}/7</span> <span aria-hidden="true">•</span> {curWeek.dates}
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
