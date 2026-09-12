interface Props { onBack: () => void }

const LIFE_SEQ = [
  { step: 'CAT 2026 ← ACTIVE', col: '#F5A623', desc: 'Current and ONLY mission. 29 November 2026.' },
  { step: 'MBA / College',       col: '#3B82F6', desc: 'IIMs + Top B-Schools. Interviews, WAT, AWT.' },
  { step: 'Business Capability', col: '#0E9F9F', desc: 'Learn strategy, marketing, finance, product.' },
  { step: 'Build MVP / Product', col: '#D97706', desc: 'Customer problem → Product → Validation → Revenue.' },
  { step: 'Grow Team + Revenue', col: '#DC2626', desc: 'Team → Scale → Market expansion.' },
  { step: 'Scale + Expand',      col: '#7C3AED', desc: 'Systems, operations, leadership.' },
  { step: 'Health, Wealth, Family + Impact', col: '#F5A623', desc: 'Long-term legacy.' },
]

const YEAR_VISION = [
  ['2026–27', 'Crack CAT + Discipline',          '#2563EB'],
  ['2027–28', 'MBA Entry + College',              '#16A34A'],
  ['2028–29', 'Learn Business Deeply',            '#0E9F9F'],
  ['2029–30', 'Build MVP / Product',              '#D97706'],
  ['2030–31', 'Grow Team + Revenue',              '#DC2626'],
  ['2031–32', 'Scale + Expand',                  '#7C3AED'],
  ['2032–33', 'Health, Wealth, Family + Impact', '#F5A623'],
] as const

export function VisionPage({ onBack }: Props) {
  return (
    <div className="section-pad">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="page-header-title">Vision & Mission</div>
      </div>

      <div className="card" style={{ background: 'linear-gradient(135deg,rgba(26,86,219,.15),rgba(124,58,237,.15))', borderColor: 'rgba(26,86,219,.4)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 4 }}>Current Mission — ACTIVE</div>
        <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>CAT 2026</div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>99+ Percentile · No Ceiling · 29 November 2026</div>
        <div style={{ marginTop: 10, fontSize: 11, color: 'var(--gold)', fontWeight: 700 }}>
          DO NOT ACTIVATE ANY OTHER PROJECT UNTIL CAT IS DONE.
        </div>
      </div>

      <div className="card">
        <div className="card-title">Master Life Sequence</div>
        {LIFE_SEQ.map((s, i) => (
          <div key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.col, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: s.col }}>{s.step}</div>
                <div style={{ fontSize: 11, color: 'var(--muted2)' }}>{s.desc}</div>
              </div>
            </div>
            {i < LIFE_SEQ.length - 1 && (
              <div style={{ width: 1, height: 10, background: 'var(--border)', marginLeft: 3, marginBottom: 4 }} />
            )}
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">7-Year Vision</div>
        {YEAR_VISION.map(([year, goal, col]) => (
          <div key={year} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: col, flexShrink: 0 }} />
            <div style={{ fontSize: 11, fontWeight: 700, color: col, width: 68 }}>{year}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{goal}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'linear-gradient(135deg,#0D1B2A,#1A2E45)', border: '1px solid rgba(245,166,35,.3)', borderRadius: 14, padding: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--gold)' }}>
          "Discipline Today → Dream College Tomorrow → Bigger Impact in Future"
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', marginTop: 8 }}>
          BECOME THE MAN YOU PROMISE YOURSELF
        </div>
        <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--gold)', marginTop: 8 }}>Radhe Radhe 🙏</div>
      </div>
    </div>
  )
}
