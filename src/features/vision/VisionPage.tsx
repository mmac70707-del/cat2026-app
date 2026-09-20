import { useState, useEffect } from 'react'
import { MASTER_VISION, MASTER_LIFE_SEQUENCE, POST_CAT_ROADMAP, SEVEN_YEAR_ROADMAP } from '@/data/visionConfig'
import { StateRepository, AppStateRecord } from '@/repositories/StateRepository'
import { useCountdown } from '@/hooks/useCountdown'
import { usePhase } from '@/hooks/usePhase'
import { useToast } from '@/components/Toast'

export function VisionPage({ onBack }: { onBack?: () => void }) {
  const phase = usePhase()
  const { days, hms } = useCountdown()
  const [appState, setAppState] = useState<AppStateRecord | null>(null)
  const { show: toast } = useToast()

  useEffect(() => {
    StateRepository.getState().then(st => setAppState(st))
  }, [])

  const handleStartInterviewPhase = async () => {
    const updated = await StateRepository.startInterviewPhase()
    setAppState(updated)
    toast('Interview / Application Phase Activated! 🔓')
  }

  const handleConfirmMbaJoining = async () => {
    const updated = await StateRepository.confirmMbaJoining()
    setAppState(updated)
    toast('MBA Joining Confirmed! 🔓')
  }

  return (
    <div style={{ padding: '16px 20px', maxWidth: 1000, margin: '0 auto', color: '#F1F5F9' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, background: '#161D2E', border: '1px solid #2D3748', borderRadius: 12, padding: 16 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#F5A623' }}>
            👁️ VISION &amp; 7-YEAR ROADMAP
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

      {/* 6 PERMANENT PILLARS OF IDENTITY */}
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
          {MASTER_LIFE_SEQUENCE.map((seq, sIdx) => {
            const isActive = seq.id === 'cat2026' ? !appState?.catCompleted : false
            return (
              <span key={seq.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <div style={{ background: isActive ? '#22C55E' : '#1F2937', color: isActive ? '#0A0F1E' : '#94A3B8', border: '1px solid #374151', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800 }}>
                  {seq.label} {isActive ? '• ACTIVE' : ''}
                </div>
                {sIdx < MASTER_LIFE_SEQUENCE.length - 1 && <span style={{ color: '#94A3B8', fontSize: 12 }}>↓</span>}
              </span>
            )
          })}
        </div>
        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 12, lineHeight: 1.5, background: '#1F2937', padding: 10, borderRadius: 8 }}>
          <strong>Current Priority:</strong> CAT 2026 is the ONLY active execution mission before 29 November 2026.
        </div>
      </div>

      {/* 7-YEAR VISION TIMELINE */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#F5A623', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
          🗺️ 7-YEAR ROADMAP (2026–2033)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SEVEN_YEAR_ROADMAP.map(y => {
            const isCurrentYear = appState ? y.yearNum === appState.activeSevenYearNum : y.yearNum === 1
            return (
              <div key={y.yearNum} style={{ background: '#161D2E', border: isCurrentYear ? '1px solid #F5A623' : '1px solid #2D3748', borderRadius: 10, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 900, fontFamily: 'monospace', color: isCurrentYear ? '#F5A623' : '#FFF' }}>
                    YEAR {y.yearNum} ({y.yearRange}) → {y.theme}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6, background: isCurrentYear ? 'rgba(245,166,35,0.2)' : 'rgba(59,130,246,0.15)', color: isCurrentYear ? '#F5A623' : '#3B82F6' }}>
                    {isCurrentYear ? '🟨 CURRENT STAGE' : y.layer}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                  {y.output}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* PERFORMANCE OPERATING LAYER & REVIEW LOOP */}
      <div style={{ background: '#161D2E', border: '1px solid #2D3748', borderRadius: 12, padding: 18, marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#22C55E', marginBottom: 8 }}>
          🔄 PERFORMANCE OPERATING LAYER &amp; MASTER REVIEW LOOP
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

      {/* POST-CAT ROADMAP (LOCKED BEFORE EXAM, AUTO-UNLOCKED AFTER EXAM) */}
      <div style={{ background: '#161D2E', border: '1px solid #374151', borderRadius: 12, padding: 18, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: appState?.catCompleted ? '#22C55E' : '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>
            {appState?.catCompleted ? '🔓 POST-CAT ROADMAP (UNLOCKED)' : '🔒 POST-CAT ROADMAP (LOCKED UNTIL EXAM)'}
          </div>
          <span style={{ fontSize: 10, fontWeight: 800, background: appState?.catCompleted ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.15)', color: appState?.catCompleted ? '#22C55E' : '#94A3B8', padding: '2px 8px', borderRadius: 6 }}>
            {appState?.catCompleted ? 'POST-CAT MODE ACTIVE' : 'UNLOCKS AFTER 29 NOV 2026'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {POST_CAT_ROADMAP.map((pc, idx) => {
            const isUnlocked = idx === 0 ? Boolean(appState?.catCompleted) : idx === 1 ? Boolean(appState?.interviewPhaseStarted) : Boolean(appState?.mbaJoiningConfirmed)

            return (
              <div key={pc.id} style={{ background: '#1F2937', border: `1px solid ${isUnlocked ? '#22C55E' : '#374151'}`, borderRadius: 10, padding: 14, opacity: isUnlocked ? 1 : 0.65 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: isUnlocked ? '#22C55E' : '#F5A623' }}>{pc.title}</div>
                  <span style={{ fontSize: 9, fontWeight: 800, color: isUnlocked ? '#22C55E' : '#94A3B8' }}>
                    {isUnlocked ? '🔓 UNLOCKED' : '🔒 LOCKED'}
                  </span>
                </div>
                <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 8 }}>{pc.subtitle}</div>
                <ul style={{ paddingLeft: 16, margin: 0, fontSize: 11, color: '#CBD5E1', lineHeight: 1.6 }}>
                  {pc.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b}</li>
                  ))}
                </ul>

                {/* State Machine Manual Triggers */}
                {idx === 1 && appState?.catCompleted && !appState.interviewPhaseStarted && (
                  <button onClick={handleStartInterviewPhase} style={{ marginTop: 10, width: '100%', background: '#1A56DB', color: '#FFF', border: 'none', padding: '6px 10px', borderRadius: 6, fontSize: 10, fontWeight: 800, cursor: 'pointer' }}>
                    Start Interview / Application Phase
                  </button>
                )}
                {idx === 2 && appState?.interviewPhaseStarted && !appState.mbaJoiningConfirmed && (
                  <button onClick={handleConfirmMbaJoining} style={{ marginTop: 10, width: '100%', background: '#22C55E', color: '#0A0F1E', border: 'none', padding: '6px 10px', borderRadius: 6, fontSize: 10, fontWeight: 800, cursor: 'pointer' }}>
                    Confirm MBA Admission / Joining
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* FINAL VISION QUOTE CARD */}
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
