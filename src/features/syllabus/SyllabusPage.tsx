import { MASTER_TOPICS } from '@/data/config'

interface Props { onBack: () => void }

const TIERS = [
  { label: 'TIER 1 — MUST MASTER',   col: '#EF4444', tier: 1 as const },
  { label: 'TIER 2 — BUILD STRONGLY', col: '#F59E0B', tier: 2 as const },
  { label: 'TIER 3 — EXPOSURE',       col: '#3B82F6', tier: 3 as const },
]

export function SyllabusPage({ onBack }: Props) {
  return (
    <div className="section-pad">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="page-header-title">Full Syllabus</div>
      </div>

      {TIERS.map(tier => {
        const topics = (['QA', 'DILR', 'VARC'] as const).flatMap(subj =>
          MASTER_TOPICS[subj]
            .filter(t => t.tier === tier.tier)
            .map(t => ({ ...t, subj }))
        )
        return (
          <div key={tier.tier}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: tier.col, padding: '8px 12px', background: tier.col + '18', borderRadius: 8, marginBottom: 8 }}>
              {tier.label}
            </div>
            <div className="card" style={{ marginBottom: 14 }}>
              {topics.map((t, i) => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: i < topics.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: tier.col, flexShrink: 0 }} />
                  <div style={{ fontSize: 12, flex: 1 }}>{t.name}</div>
                  <div style={{ fontSize: 9, color: 'var(--muted)' }}>{t.subj}</div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
