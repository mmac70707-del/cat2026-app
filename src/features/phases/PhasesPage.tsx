import { PHASES } from '@/data/config'
import { getCurrentPhase } from '@/services/domain'

export function PhasesPage() {
  const current = getCurrentPhase()

  return (
    <div className="section-pad">
      <div className="card" style={{ background: 'linear-gradient(135deg,#0D1B2A,#1A2E45)', borderColor: 'rgba(245,166,35,.3)' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--gold)' }}>CAT 2026 · Phase Roadmap</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Exam: 29 November 2026 · 5 Phases Locked</div>
        <div style={{ fontSize: 10, color: '#EF4444', fontWeight: 700, marginTop: 6 }}>⚠️ Phase ORDER is LOCKED. Never redesign for one bad day.</div>
      </div>

      {PHASES.map(phase => {
        const isCurrent = phase.id === current.id
        return (
          <div
            key={phase.id}
            className={`phase-card ${isCurrent ? 'current' : ''}`}
            style={isCurrent ? { borderColor: phase.color, borderWidth: 2, background: phase.color + '11' } : { opacity: 0.75 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 10, background: phase.color + '22', color: phase.color, display: 'inline-block' }}>
                  {phase.id} · {phase.name}{isCurrent ? ' 🔴 NOW' : ''}
                </div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>{phase.start} → {phase.end}</div>
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: phase.color, marginBottom: 4 }}>{phase.name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>{phase.purpose}</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[
                { label: 'QA',   items: phase.qa,   col: '#16A34A' },
                { label: 'DILR', items: phase.dilr, col: '#2563EB' },
                { label: 'VARC', items: phase.varc, col: '#7C3AED' },
              ].map(s => (
                <div key={s.label} className="phase-subj-box">
                  <div className="phase-subj-title" style={{ color: s.col }}>{s.label}</div>
                  {s.items.map((t, i) => <div key={i} className="phase-subj-item">▸ {t}</div>)}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gold)', marginBottom: 4 }}>EXIT GATE</div>
              {phase.gate.map((g, i) => (
                <div key={i} style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 2 }}>✓ {g}</div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
