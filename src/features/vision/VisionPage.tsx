import { MASTER_VISION, MASTER_LIFE_SEQUENCE, POST_CAT_ROADMAP, SEVEN_YEAR_ROADMAP } from '@/data/visionConfig'
import { useCountdown } from '@/hooks/useCountdown'
import { usePhase } from '@/hooks/usePhase'

export function VisionPage({ onBack }: { onBack?: () => void }) {
  const phase = usePhase()
  const { days, hms } = useCountdown()

  return (
    <div style={{ padding: '16px 20px', maxWidth: 1000, margin: '0 auto', color: '#F1F5F9' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, background: '#161D2E', border: '1px solid #2D3748', borderRadius: 12, padding: 16 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#F5A623' }}>
            👁️ CAT 2026 MASTER VISION
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
            Long-Term Execution Operating System (2026–2033)
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 12, background: phase.color, color: '#FFFFFF' }}>
            {phase.id} — {phase.name}
          </span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#F5A623', fontFamily: 'monospace', lineHeight: 1 }}>
            {days}
          </div>
          <div style={{ fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', marginTop: 2 }}>
            days left • {hms}
          </div>
        </div>

        {onBack && (
          <button onClick={onBack} style={{ background: '#1F2937', border: '1px solid #374151', color: '#94A3B8', padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer', marginLeft: 10 }}>
            ← Back
          </button>
        )}
      </div>

      {/* CORE STATEMENT */}
      <div style={{ background: 'linear-gradient(135deg, #1A2E45, #0D1B2A)', border: '1px solid #F5A623', borderRadius: 12, padding: 20, marginBottom: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#F5A623', letterSpacing: 0.5 }}>
          "{MASTER_VISION.quote}"
        </div>
        <div style={{ fontSize: 12, color: '#CBD5E1', marginTop: 10, lineHeight: 1.6, maxWidth: 800, margin: '10px auto 0' }}>
          {MASTER_VISION.identity}
        </div>
        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 8, fontWeight: 700, fontStyle: 'italic' }}>
          {MASTER_VISION.outcomeNote}
        </div>
      </div>

      {/* 6 PERMANENT PILLARS */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#F5A623', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
          🏛️ 6 PERMANENT PILLARS OF IDENTITY
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
          {MASTER_VISION.pillars.map(p => (
            <div key={p.num} style={{ background: '#161D2E', border: '1px solid #2D3748', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#38BDF8', fontFamily: 'monospace' }}>
                PILLAR 0{p.num}
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#FFF', margin: '4px 0' }}>
                {p.name}
              </div>
              <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.4 }}>
                {p.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MASTER LIFE SEQUENCE */}
      <div style={{ background: '#161D2E', border: '1px solid #2D3748', borderRadius: 12, padding: 18, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#F5A623', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
          ⛓️ MASTER LIFE SEQUENCE
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {MASTER_LIFE_SEQUENCE.map((seq, sIdx) => (
            <span key={seq.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <div style={{ background: seq.status === 'ACTIVE' ? '#22C55E' : '#1F2937', color: seq.status === 'ACTIVE' ? '#0A0F1E' : '#94A3B8', border: '1px solid #374151', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800 }}>
                {seq.label} {seq.status === 'ACTIVE' ? '• ACTIVE' : ''}
              </div>
              {sIdx < MASTER_LIFE_SEQUENCE.length - 1 && <span style={{ color: '#94A3B8', fontSize: 12 }}>↓</span>}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 12, lineHeight: 1.5, background: '#1F2937', padding: 10, borderRadius: 8 }}>
          <strong>Current Priority:</strong> CAT 2026 is the ONLY active mission before 29 November 2026. Future stages remain locked.
        </div>
      </div>

      {/* POST-CAT ROADMAP (LOCKED BEFORE EXAM, UNLOCKED AFTER EXAM) */}
      <div style={{ background: '#161D2E', border: '1px solid #374151', borderRadius: 12, padding: 18, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>
            🔒 POST-CAT ROADMAP (LOCKED UNTIL EXAM)
          </div>
          <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(148,163,184,0.15)', color: '#94A3B8', padding: '2px 8px', borderRadius: 6 }}>
            UNLOCKS AFTER 29 NOV 2026
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {POST_CAT_ROADMAP.map(pc => (
            <div key={pc.id} style={{ background: '#1F2937', border: '1px solid #374151', borderRadius: 10, padding: 14, opacity: 0.7 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#F5A623', marginBottom: 2 }}>{pc.title}</div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 8 }}>{pc.subtitle}</div>
              <ul style={{ paddingLeft: 16, margin: 0, fontSize: 11, color: '#CBD5E1', lineHeight: 1.6 }}>
                {pc.bullets.map((b, bIdx) => (
                  <li key={bIdx}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 7-YEAR VISION TIMELINE */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#F5A623', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
          🗺️ 7-YEAR VISION (2026–2033)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SEVEN_YEAR_ROADMAP.map(y => (
            <div key={y.yearNum} style={{ background: '#161D2E', border: y.yearNum === 1 ? '1px solid #F5A623' : '1px solid #2D3748', borderRadius: 10, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 900, fontFamily: 'monospace', color: '#F5A623' }}>
                  {y.yearRange} → {y.theme}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6, background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}>
                  {y.layer}
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                {y.output}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PERFORMANCE OPERATING LAYER & REVIEW LOOP */}
      <div style={{ background: '#161D2E', border: '1px solid #2D3748', borderRadius: 12, padding: 18, marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#22C55E', marginBottom: 8 }}>
          🔄 MASTER REVIEW LOOP &amp; PERFORMANCE OPERATING LAYER
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', fontSize: 11, fontWeight: 700, marginBottom: 10 }}>
          {['GOAL', 'ACTION', 'RESULT', 'FEEDBACK', 'REFLECTION', 'REPAIR', 'NEW ACTION'].map((step, idx) => (
            <span key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ background: idx === 0 || idx === 6 ? '#F5A623' : '#1F2937', color: idx === 0 || idx === 6 ? '#0A0F1E' : '#FFF', padding: '4px 10px', borderRadius: 12, border: '1px solid #374151' }}>
                {step}
              </span>
              {idx < 6 && <span style={{ color: '#94A3B8' }}>→</span>}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.5 }}>
          • Years 1–3: BUILD + EXPLORE (Learn → Do → Experiment → Fail → Reflect → Improve)<br/>
          • Years 4–6: REGULATE + CONSOLIDATE + SCALE (Build systems → Manage pressure → Protect health)<br/>
          • Year 7+: CLUTCH + IMPACT (High judgement → High performance → Leadership)
        </div>
      </div>

      {/* FINAL QUOTE CARD */}
      <div style={{ background: 'linear-gradient(135deg, #1A2E45, #0D1B2A)', border: '1px solid #F5A623', borderRadius: 12, padding: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#F5A623', marginBottom: 8 }}>
          "Discipline Today Builds the Freedom Tomorrow"
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#38BDF8', marginBottom: 10 }}>
          Discipline → CAT → MBA → Build → Grow → Scale → Impact
        </div>
        <div style={{ fontSize: 14, fontWeight: 900, color: '#FFF', letterSpacing: 0.5 }}>
          BECOME THE MAN YOU PROMISE YOURSELF
        </div>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#F5A623', marginTop: 8 }}>
          राधे राधे 🙏
        </div>
      </div>
    </div>
  )
}
