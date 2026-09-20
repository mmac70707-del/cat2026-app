import { useState } from 'react'
import { MASTER_VISION, MASTER_LIFE_SEQUENCE, POST_CAT_ROADMAP, SEVEN_YEAR_ROADMAP } from '@/data/visionConfig'
import { useCountdown } from '@/hooks/useCountdown'
import { usePhase } from '@/hooks/usePhase'

export function VisionPage({ onBack }: { onBack?: () => void }) {
  const phase = usePhase()
  const { days, hms } = useCountdown()
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

      {/* Top Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, background: '#161D2E', border: '1px solid #2D3748', borderRadius: 12, padding: 16 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#F5A623' }}>
            CAT 2026
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
            Master Vision &amp; Personal Mission Operating System
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

      {/* ════════════════════════════════════════════════════════════════
          SECTION A: MISSION — TWO PERSONAL IMAGES (VISUAL)
         ════════════════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: 30 }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: '#F5A623', letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🎯</span> MISSION — PERSONAL VISUALS
        </div>
        <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 14 }}>
          "Dream. Plan. Execute." • What I Am Working Toward
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {/* PHOTO 1 */}
          <div style={{ background: '#161D2E', border: '1px solid #F5A623', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: 280, width: '100%', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setLightboxImg({ src: '/images/vision_dream_plan.png', title: 'DREAM PLAN EXECUTE', alt: 'Personal CAT to MBA and long-term mission' })}
            >
              <img
                src="/images/vision_dream_plan.png"
                alt="Personal CAT to MBA and long-term mission"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(10,15,30,0.95))', padding: '14px 16px' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#F5A623', textTransform: 'uppercase', letterSpacing: 1 }}>
                  MISSION PHOTO 01 • TAP TO ENLARGE
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#FFF' }}>
                  DREAM • PLAN • EXECUTE
                </div>
              </div>
            </div>
          </div>

          {/* PHOTO 2 */}
          <div style={{ background: '#161D2E', border: '1px solid #38BDF8', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: 280, width: '100%', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setLightboxImg({ src: '/images/vision_future_impact.png', title: 'FUTURE IMPACT', alt: 'Personal future, leadership and impact mission' })}
            >
              <img
                src="/images/vision_future_impact.png"
                alt="Personal future, leadership and impact mission"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(10,15,30,0.95))', padding: '14px 16px' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: 1 }}>
                  MISSION PHOTO 02 • TAP TO ENLARGE
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#FFF' }}>
                  FUTURE IMPACT • LEADERSHIP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          SECTION B: VISION — DETAILED TEXT & CARDS
         ════════════════════════════════════════════════════════════════ */}
      <div>
        <div style={{ fontSize: 15, fontWeight: 900, color: '#F5A623', letterSpacing: 1.5, marginBottom: 16, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8, borderTop: '2px solid #2D3748', paddingTop: 20 }}>
          <span>👁️</span> VISION — DETAILED EXECUTION SYSTEM
        </div>

        {/* Current Active Mission Card */}
        <div style={{ background: 'linear-gradient(135deg, #1A2E45, #0D1B2A)', border: '1px solid #22C55E', borderRadius: 12, padding: 18, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#22C55E', textTransform: 'uppercase', letterSpacing: 1 }}>
              CURRENT MISSION — ACTIVE
            </span>
            <span style={{ fontSize: 11, fontWeight: 900, background: 'rgba(34,197,94,0.2)', color: '#22C55E', padding: '2px 8px', borderRadius: 6 }}>
              CAT 2026
            </span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#F5A623', margin: '6px 0' }}>
            "{MASTER_VISION.quote}"
          </div>
          <div style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.6 }}>
            {MASTER_VISION.identity}
          </div>
        </div>

        {/* 6 Permanent Pillars */}
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

        {/* Master Life Sequence */}
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

        {/* Post-CAT Roadmap (Locked Until Exam) */}
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

        {/* 7-Year Vision Timeline */}
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

        {/* Final Quote Card */}
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
    </div>
  )
}
