import { useState } from 'react'
import { MASTER_VISION, SEVEN_YEAR_ROADMAP } from '@/data/visionConfig'

export function VisionPage({ onBack }: { onBack?: () => void }) {
  const [lightboxImg, setLightboxImg] = useState<{ src: string; title: string; alt: string } | null>(null)

  return (
    <div style={{ padding: '16px 20px', maxWidth: 1000, margin: '0 auto', color: '#F1F5F9' }}>
      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(10,15,30,0.95)', zIndex: 2000, display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: 20, cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: 14, color: '#F5A623', fontWeight: 800, marginBottom: 10 }}>
            {lightboxImg.title} (Tap anywhere to close)
          </div>
          <img
            src={lightboxImg.src}
            alt={lightboxImg.alt}
            style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: 12, border: '2px solid #F5A623', objectFit: 'contain' }}
          />
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#F5A623' }}>
            🎯 Master Vision &amp; 7-Year Roadmap
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
            Long-Term Execution Operating System (2026–2033)
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ background: '#1F2937', border: '1px solid #374151', color: '#94A3B8', padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
            ← Back
          </button>
        )}
      </div>

      {/* IMAGE 1: DREAM PLAN EXECUTE Hero Cover */}
      <div style={{ background: '#161D2E', border: '1px solid #F5A623', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ position: 'relative', height: 260, width: '100%', overflow: 'hidden', cursor: 'pointer' }}
          onClick={() => setLightboxImg({ src: '/images/vision_dream_plan.png', title: 'DREAM PLAN EXECUTE', alt: 'Personal CAT to MBA and seven-year vision' })}
        >
          <img
            src="/images/vision_dream_plan.png"
            alt="Personal CAT to MBA and seven-year vision"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(10,15,30,0.95))', padding: '16px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#F5A623', textTransform: 'uppercase', letterSpacing: 1 }}>
              VISION HERO COVER • TAP TO ENLARGE
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#FFF' }}>
              DREAM • PLAN • EXECUTE — SAME BOY, BIGGER PLANS
            </div>
          </div>
        </div>
      </div>

      {/* Main Quote Card */}
      <div style={{ background: 'linear-gradient(135deg, #1A2E45, #0D1B2A)', border: '1px solid #F5A623', borderRadius: 12, padding: 20, marginBottom: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#F5A623', letterSpacing: 0.5 }}>
          "{MASTER_VISION.quote}"
        </div>
        <div style={{ fontSize: 12, color: '#CBD5E1', marginTop: 10, lineHeight: 1.6, maxWidth: 800, margin: '10px auto 0' }}>
          {MASTER_VISION.identity}
        </div>
        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 8, fontWeight: 700, fontStyle: 'italic' }}>
          {MASTER_VISION.outcomeNote}
        </div>
      </div>

      {/* 5 Permanent Pillars */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#F5A623', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
          🏛️ 5 Permanent Pillars of Identity
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          {MASTER_VISION.pillars.map(p => (
            <div key={p.num} style={{ background: '#161D2E', border: '1px solid #2D3748', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#38BDF8', fontFamily: 'monospace' }}>
                PILLAR 0{p.num}
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#FFF', margin: '4px 0' }}>
                {p.name}
              </div>
              <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.5 }}>
                {p.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Master Review Loop */}
      <div style={{ background: '#161D2E', border: '1px solid #2D3748', borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#22C55E', marginBottom: 8 }}>
          🔄 Master Review Loop (Universal Execution Flow)
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', fontSize: 11, fontWeight: 700 }}>
          {['GOAL', 'ACTION', 'RESULT', 'FEEDBACK', 'REFLECTION', 'REPAIR', 'NEW ACTION'].map((step, idx) => (
            <span key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ background: idx === 0 || idx === 6 ? '#F5A623' : '#1F2937', color: idx === 0 || idx === 6 ? '#0A0F1E' : '#FFF', padding: '4px 10px', borderRadius: 12, border: '1px solid #374151' }}>
                {step}
              </span>
              {idx < 6 && <span style={{ color: '#94A3B8' }}>→</span>}
            </span>
          ))}
        </div>
      </div>

      {/* IMAGE 2: FUTURE IMPACT / 7-YEAR ROADMAP HERO */}
      <div style={{ background: '#161D2E', border: '1px solid #38BDF8', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ position: 'relative', height: 260, width: '100%', overflow: 'hidden', cursor: 'pointer' }}
          onClick={() => setLightboxImg({ src: '/images/vision_future_impact.png', title: 'FUTURE IMPACT', alt: 'Personal seven-year future and leadership vision' })}
        >
          <img
            src="/images/vision_future_impact.png"
            alt="Personal seven-year future and leadership vision"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(10,15,30,0.95))', padding: '16px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: 1 }}>
              7-YEAR ROADMAP HERO • TAP TO ENLARGE
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#FFF' }}>
              FUTURE IMPACT • LEADERSHIP • NATION BUILDING
            </div>
          </div>
        </div>
      </div>

      {/* 7-Year Roadmap Cards */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#F5A623', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
          🗺️ 7-Year Roadmap (Year 1 to Year 7)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {SEVEN_YEAR_ROADMAP.map(y => (
            <div key={y.yearNum} style={{ background: '#161D2E', border: y.yearNum === 1 ? '1px solid #F5A623' : '1px solid #2D3748', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 900, fontFamily: 'monospace', color: '#F5A623', background: 'rgba(245,166,35,0.15)', padding: '2px 8px', borderRadius: 6 }}>
                    YEAR {y.yearNum} • {y.yearRange}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#FFF' }}>
                    {y.theme}
                  </span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10, background: y.layer === 'BUILD + EXPLORE' ? 'rgba(34,197,94,0.15)' : y.layer === 'CLUTCH + IMPACT' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)', color: y.layer === 'BUILD + EXPLORE' ? '#22C55E' : y.layer === 'CLUTCH + IMPACT' ? '#EF4444' : '#3B82F6' }}>
                  {y.layer}
                </span>
              </div>

              <div style={{ fontSize: 12, fontWeight: 700, color: '#38BDF8', marginBottom: 6 }}>
                Identity: {y.identity}
              </div>

              <div style={{ fontSize: 11, color: '#CBD5E1', marginBottom: 8, lineHeight: 1.5 }}>
                <strong>Key Focus Areas:</strong> {y.focus.join(' • ')}
              </div>

              <div style={{ fontSize: 11, color: '#22C55E', background: '#111827', padding: '8px 10px', borderRadius: 6, lineHeight: 1.5 }}>
                🎯 {y.output}
              </div>

              {y.ruleOrLoop && (
                <div style={{ fontSize: 10, color: '#F5A623', fontWeight: 700, marginTop: 6, fontStyle: 'italic' }}>
                  ⚡ {y.ruleOrLoop}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
