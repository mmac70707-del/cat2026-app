import { SCHEDULE_ITEMS } from '@/data/config'

interface Props { onBack: () => void }

export function SchedulePage({ onBack }: Props) {
  return (
    <div className="section-pad">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
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
                <span style={{ fontSize: 16 }}>{s.icon}</span>
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
