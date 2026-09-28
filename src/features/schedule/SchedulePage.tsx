import { SCHEDULE_ITEMS } from '@/data/config'
import { AppIcon } from '@/components/AppIcon'

interface Props { onBack: () => void }

function scheduleIcon(block: string) {
  const b = block.toLowerCase()
  if (b.includes('reset')) return <AppIcon name="today" size={17} />
  if (b.includes('dose')) return <AppIcon name="zap" size={17} />
  if (b.includes('qa') || b.includes('quant')) return <AppIcon name="mastery" size={17} />
  if (b.includes('dilr')) return <AppIcon name="layers" size={17} />
  if (b.includes('varc') || b.includes('rc')) return <AppIcon name="book" size={17} />
  if (b.includes('coaching')) return <AppIcon name="target" size={17} />
  if (b.includes('gym')) return <AppIcon name="focus" size={17} />
  if (b.includes('dinner')) return <AppIcon name="checkCircle" size={17} />
  if (b.includes('analysis') || b.includes('error')) return <AppIcon name="research" size={17} />
  if (b.includes('revision')) return <AppIcon name="layers" size={17} />
  return <AppIcon name="clock" size={17} />
}

export function SchedulePage({ onBack }: Props) {
  return (
    <div className="section-pad">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}><AppIcon name="back" size={17} /> Back</button>
        <div className="page-header-title">Daily Schedule</div>
      </div>
      <div className="card" style={{ background: 'linear-gradient(135deg,rgba(14,159,159,.1),rgba(37,99,235,.1))', borderColor: 'rgba(14,159,159,.3)', marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>
          Preserve priority structure even when exact times shift.
        </div>
      </div>
      {SCHEDULE_ITEMS.map((s, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
          <div style={{ width: 2, background: s.col, flexShrink: 0, borderRadius: 2 }} />
          <div className="card" style={{ marginBottom: 0, flex: 1, padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 16, display: 'inline-flex', color: s.col }}>{scheduleIcon(s.block)}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: s.col }}>{s.block}</span>
              </div>
              <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--muted)', background: 'var(--navy3)', padding: '2px 8px', borderRadius: 8 }}>
                {s.time}
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.detail}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
