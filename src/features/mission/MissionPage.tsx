import { useState } from 'react'
import { useCountdown } from '@/hooks/useCountdown'
import { usePhase } from '@/hooks/usePhase'

export function MissionPage({ onBack }: { onBack?: () => void }) {
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

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, background: '#161D2E', border: '1px solid #2D3748', borderRadius: 12, padding: 16 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#F5A623' }}>
            🎯 CAT 2026 — CURRENT MISSION
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
            What I Am Doing Now • Active Execution Layer
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

      {/* MISSION HERO IMAGES */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: '#F5A623', letterSpacing: 1.5, marginBottom: 10, textTransform: 'uppercase' }}>
          📷 PERSONAL MISSION VISUALS
        </div>
        <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 14 }}>
          "Dream. Plan. Execute." • Visual Motivation &amp; Identity Anchor
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {/* PHOTO 1 */}
          <div style={{ background: '#161D2E', border: '1px solid #F5A623', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: 300, width: '100%', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setLightboxImg({ src: '/images/vision_dream_plan.png', title: 'DREAM PLAN EXECUTE', alt: 'Personal CAT to MBA and long-term mission' })}
            >
              <img
                src="/images/vision_dream_plan.png"
                alt="Personal CAT to MBA and long-term mission"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(10,15,30,0.95))', padding: '14px 16px' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#F5A623', textTransform: 'uppercase', letterSpacing: 1 }}>
                  PHOTO 01 • TAP TO ENLARGE
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#FFF' }}>
                  DREAM • PLAN • EXECUTE
                </div>
              </div>
            </div>
          </div>

          {/* PHOTO 2 */}
          <div style={{ background: '#161D2E', border: '1px solid #38BDF8', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: 300, width: '100%', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setLightboxImg({ src: '/images/vision_future_impact.png', title: 'FUTURE IMPACT', alt: 'Personal future, leadership and impact mission' })}
            >
              <img
                src="/images/vision_future_impact.png"
                alt="Personal future, leadership and impact mission"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(10,15,30,0.95))', padding: '14px 16px' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: 1 }}>
                  PHOTO 02 • TAP TO ENLARGE
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#FFF' }}>
                  FUTURE IMPACT • LEADERSHIP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE MISSION STATEMENT */}
      <div style={{ background: 'linear-gradient(135deg, #1A2E45, #0D1B2A)', border: '1px solid #22C55E', borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#22C55E', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
          CURRENT MISSION — ACTIVE
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#F5A623' }}>
          CAT 2026: MAXIMUM POSSIBLE PERFORMANCE
        </div>
        <div style={{ fontSize: 12, color: '#CBD5E1', marginTop: 8, lineHeight: 1.6 }}>
          "Know what to do. Do it. Measure it. Repair it. Retest it. Improve."
        </div>
        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 10, fontStyle: 'italic', background: '#111827', padding: 10, borderRadius: 8 }}>
          🎯 CAT 2026 is the ONLY active execution mission until 29 November 2026. Future MBA/interview tasks remain locked.
        </div>
      </div>

      {/* CURRENT EXECUTION FOCUS */}
      <div style={{ background: '#161D2E', border: '1px solid #2D3748', borderRadius: 12, padding: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#F5A623', marginBottom: 12, textTransform: 'uppercase' }}>
          ⚡ ACTIVE EXECUTION FOCUS ({phase.id} — {phase.name})
        </div>
        <div style={{ fontSize: 12, color: '#FFF', fontWeight: 700, marginBottom: 8 }}>
          Mission: {phase.mission}
        </div>
        <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.6 }}>
          Purpose: {phase.purpose}
        </div>
      </div>
    </div>
  )
}
