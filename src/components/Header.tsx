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
          <div className="app-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>CAT 2026</span>
            {onOpenVoiceJarvis && (
              <button
                onClick={onOpenVoiceJarvis}
                style={{
                  background: 'rgba(245,166,35,0.2)', border: '1px solid #F5A623',
                  color: '#F5A623', borderRadius: 12, padding: '2px 8px',
                  fontSize: 10, fontWeight: 800, cursor: 'pointer', display: 'flex',
                  alignItems: 'center', gap: 4
                }}
              >
                <span>🎙️</span> Jarvis
              </button>
            )}
            {onOpenJarvisHud && (
              <button
                onClick={onOpenJarvisHud}
                style={{
                  background: 'rgba(0,240,255,0.15)', border: '1px solid #00F0FF',
                  color: '#00F0FF', borderRadius: 12, padding: '2px 8px',
                  fontSize: 10, fontWeight: 800, cursor: 'pointer', display: 'flex',
                  alignItems: 'center', gap: 4
                }}
              >
                <span>🚀</span> HUD
              </button>
            )}
          </div>
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
