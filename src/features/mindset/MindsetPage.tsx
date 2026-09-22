import { useState } from 'react'

export function MindsetPage({ onBack }: { onBack?: () => void }) {
  const [lightboxImg, setLightboxImg] = useState<{ src: string; title: string } | null>(null)

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
            alt={lightboxImg.title}
            style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: 12, border: '2px solid #F5A623', objectFit: 'contain' }}
          />
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, background: '#161D2E', border: '1px solid #2D3748', borderRadius: 12, padding: 16 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#F5A623' }}>
            🧠 MINDSET &amp; DISCIPLINE PROTOCOL
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
            Anti-Laziness • Passion Anchor • Relentless Execution Engine
          </div>
        </div>

        {onBack && (
          <button onClick={onBack} style={{ background: '#1F2937', border: '1px solid #374151', color: '#94A3B8', padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
            ← Back
          </button>
        )}
      </div>

      {/* HERO BILLBOARD */}
      <div style={{ background: '#161D2E', border: '1px solid #F5A623', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }} className="glow-border-amber">
        <div style={{ position: 'relative', height: 260, width: '100%', overflow: 'hidden', cursor: 'pointer' }}
          onClick={() => setLightboxImg({ src: '/images/vision_future_impact.png', title: 'DREAM PLAN EXECUTE SUCCESS — FROM SMALL TOWN TO BIG VISION' })}
        >
          <img
            src="/images/vision_future_impact.png"
            alt="Dream Plan Execute Success"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(10,15,30,0.95))', padding: '16px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#F5A623', textTransform: 'uppercase', letterSpacing: 1 }}>
              REAL STORY • FROM SMALL TOWN TO BIG VISION
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#FFF' }}>
              DREAM • PLAN • EXECUTE • SUCCESS — MEHNAT KABHI BEKAR NAHI JAATI
            </div>
          </div>
        </div>
      </div>

      {/* POOR VS RICH MINDSET COMPARISON */}
      <div style={{ background: '#161D2E', border: '1px solid #2D3748', borderRadius: 12, padding: 18, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: '#F5A623', marginBottom: 12, textTransform: 'uppercase' }}>
          ⚔️ POOR MINDSET VS RICH MINDSET
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* POOR */}
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #EF4444', borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: '#EF4444', marginBottom: 8 }}>❌ POOR MINDSET (LIMITATIONS)</div>
            <ul style={{ paddingLeft: 16, margin: 0, fontSize: 11, color: '#CBD5E1', lineHeight: 1.8 }}>
              <li>Misses the old days</li>
              <li>Fear of missing out (FOMO)</li>
              <li>Thinks rich are evil</li>
              <li>Complains constantly</li>
              <li>Never likes to learn</li>
              <li>Afraid of investing in self</li>
              <li>Fears change &amp; hard work</li>
            </ul>
          </div>

          {/* RICH */}
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid #22C55E', borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: '#22C55E', marginBottom: 8 }}>✅ RICH MINDSET (GROWTH)</div>
            <ul style={{ paddingLeft: 16, margin: 0, fontSize: 11, color: '#CBD5E1', lineHeight: 1.8 }}>
              <li>Lives in the present</li>
              <li>Learns from mistakes</li>
              <li>Helps others succeed</li>
              <li>Doesn't complain</li>
              <li>Constantly learning</li>
              <li>Quits bad habits</li>
              <li>Takes immediate action!</li>
            </ul>
          </div>
        </div>
      </div>

      {/* AVERAGE VS RICH PEOPLE HOBBIES */}
      <div style={{ background: '#161D2E', border: '1px solid #2D3748', borderRadius: 12, padding: 18, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: '#38BDF8', marginBottom: 12, textTransform: 'uppercase' }}>
          🏋️ AVERAGE PEOPLE HOBBIES VS RICH PEOPLE HOBBIES
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: '#1F2937', padding: 12, borderRadius: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', marginBottom: 6 }}>AVERAGE HOBBIES</div>
            <div style={{ fontSize: 11, color: '#CBD5E1', lineHeight: 1.6 }}>
              • Television &amp; Doomscrolling<br/>
              • Party &amp; Distractions<br/>
              • Gaming for 4+ hours<br/>
              • Job without vision
            </div>
          </div>

          <div style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid #38BDF8', padding: 12, borderRadius: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#38BDF8', marginBottom: 6 }}>RICH HOBBIES</div>
            <div style={{ fontSize: 11, color: '#FFF', lineHeight: 1.6, fontWeight: 700 }}>
              • Gym &amp; Physical Fitness<br/>
              • Deep Knowledge Acquisition<br/>
              • Invest in Mentors &amp; Books<br/>
              • Building Business Assets
            </div>
          </div>
        </div>
      </div>

      {/* HOW TO START BUILDING DISCIPLINE (12 COMMANDMENTS) */}
      <div style={{ background: '#161D2E', border: '1px solid #22C55E', borderRadius: 12, padding: 18, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: '#22C55E', marginBottom: 12, textTransform: 'uppercase' }}>
          ⚡ HOW TO START BUILDING DISCIPLINE (THE 12 COMMANDMENTS)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8, fontSize: 11, color: '#FFF', fontWeight: 600 }}>
          {[
            '🌅 Wake up at a set time every day',
            '🔥 Do your hardest task FIRST thing in morning',
            '🥗 Eat healthier clean food',
            '🙏 Daily gratitude &amp; reflection',
            '🧘 Meditate 10 minutes',
            '🔄 Replace old bad habits with new ones',
            '🚿 Take cold showers',
            '😴 Go to bed on time (No screens)',
            '💪 Exercise daily (Gym / Movement)',
            '⏱️ Use the 3-2-1 action rule',
            '📱 Put phone in another room when studying!',
            '🔒 Protect 09:00 QA block non-negotiable'
          ].map((item, idx) => (
            <div key={idx} style={{ background: '#1F2937', border: '1px solid #374151', padding: '8px 10px', borderRadius: 6 }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* VALUE MATRIX: SELL THE BENEFIT */}
      <div style={{ background: '#161D2E', border: '1px solid #8B5CF6', borderRadius: 12, padding: 18, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: '#A78BFA', marginBottom: 10, textTransform: 'uppercase' }}>
          🖋️ SELL THE BENEFIT (VALUE CREATION MATRIX)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8, fontSize: 11 }}>
          <div style={{ background: '#1F2937', padding: 10, borderRadius: 8 }}>
            <div style={{ color: '#A78BFA', fontWeight: 800 }}>Functional</div>
            <div style={{ color: '#94A3B8', marginTop: 2 }}>"Solves problem smoothly &amp; effortlessly"</div>
          </div>
          <div style={{ background: '#1F2937', padding: 10, borderRadius: 8 }}>
            <div style={{ color: '#A78BFA', fontWeight: 800 }}>Sensorial</div>
            <div style={{ color: '#94A3B8', marginTop: 2 }}>"Feels refined &amp; luxurious in hand"</div>
          </div>
          <div style={{ background: '#1F2937', padding: 10, borderRadius: 8 }}>
            <div style={{ color: '#A78BFA', fontWeight: 800 }}>Social</div>
            <div style={{ color: '#94A3B8', marginTop: 2 }}>"Makes you look professional"</div>
          </div>
          <div style={{ background: '#1F2937', padding: 10, borderRadius: 8 }}>
            <div style={{ color: '#A78BFA', fontWeight: 800 }}>Emotive</div>
            <div style={{ color: '#94A3B8', marginTop: 2 }}>"Makes you feel confident"</div>
          </div>
          <div style={{ background: '#1F2937', padding: 10, borderRadius: 8 }}>
            <div style={{ color: '#A78BFA', fontWeight: 800 }}>Expressive</div>
            <div style={{ color: '#94A3B8', marginTop: 2 }}>"Reflects your unique style"</div>
          </div>
          <div style={{ background: '#1F2937', padding: 10, borderRadius: 8 }}>
            <div style={{ color: '#A78BFA', fontWeight: 800 }}>Symbolic</div>
            <div style={{ color: '#94A3B8', marginTop: 2 }}>"Turns your brand into who you want to be seen as"</div>
          </div>
        </div>
      </div>

      {/* FINAL QUOTE */}
      <div style={{ background: 'linear-gradient(135deg, #1A2E45, #0D1B2A)', border: '1px solid #F5A623', borderRadius: 12, padding: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#F5A623', marginBottom: 6 }}>
          "BECOME THE MAN YOU PROMISE YOURSELF"
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#38BDF8' }}>
          Discipline Today → Freedom Tomorrow • Radhe Radhe 🙏
        </div>
      </div>
    </div>
  )
}
