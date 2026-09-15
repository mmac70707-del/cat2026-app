import { useState } from 'react'
import { useTodayTasks } from '@/hooks/useTasks'
import { DailyScoreRepository } from '@/repositories/index'
import { ErrorRepository } from '@/repositories/ErrorRepository'
import { usePhase } from '@/hooks/usePhase'
import { formatDate, todayKey, getWeekNumber, getDaysLeft } from '@/services/domain'
import { useToast } from '@/components/Toast'

const SEQUENCE_STRIP = [
  { seq: '01', id: 'QA',       label: 'QA',       sub: 'Quantitative', col: '#16A34A', bg: 'rgba(22,163,74,.15)' },
  { seq: '02', id: 'DILR',     label: 'DILR',     sub: 'Data + Logic', col: '#2563EB', bg: 'rgba(37,99,235,.15)' },
  { seq: '03', id: 'VARC',     label: 'VARC',     sub: 'Verbal + RC',  col: '#7C3AED', bg: 'rgba(124,58,237,.15)' },
  { seq: '04', id: 'TEST',     label: 'TEST',     sub: 'Sectional',    col: '#D97706', bg: 'rgba(217,119,6,.15)' },
  { seq: '05', id: 'ANALYSIS', label: 'ANALYSIS', sub: 'Error Log',    col: '#DC2626', bg: 'rgba(220,38,38,.15)' },
  { seq: '06', id: 'REVISION', label: 'REVISION', sub: 'Formula + RC', col: '#8B5CF6', bg: 'rgba(139,92,246,.15)' },
  { seq: '07', id: 'REPAIR',   label: 'REPAIR',   sub: 'Wrong Qs',     col: '#DB2777', bg: 'rgba(219,39,119,.15)' },
  { seq: '08', id: 'RETEST',   label: 'RETEST',   sub: 'Confirm',      col: '#0E9F9F', bg: 'rgba(14,159,159,.15)' },
]

export function DashboardPage({ onBack }: { onBack?: () => void }) {
  const phase = usePhase()
  const daysLeft = getDaysLeft()
  const { tasks, loading, done, pct, updateStatus } = useTodayTasks()
  const { show: toast } = useToast()

  const [study, setStudy]   = useState('')
  const [screen, setScreen] = useState('')
  const [acc, setAcc]       = useState('')
  const [feedback, setFeedback] = useState('')
  const [errorCounts, setErrorCounts] = useState<{ [key: string]: number }>({ C1: 0, C2: 0, C3: 0, C4: 0, C5: 0 })

  const now = new Date()

  const handleLogErrorCard = async (code: 'C1' | 'C2' | 'C3' | 'C4' | 'C5') => {
    setErrorCounts(prev => ({ ...prev, [code]: prev[code] + 1 }))
    try {
      await ErrorRepository.log({
        errorType: code,
        subject: 'QA',
        topic: 'Master Execution Dashboard',
        wrongReason: `Logged ${code} error from Dashboard.`,
        correctMethod: 'Review concept and fix in Repair Queue.',
        preventionRule: 'Apply prevention rule.',
      })
      toast(`Logged ${code} error!`, '#EF4444')
    } catch {
      toast(`Logged ${code} count +1`, '#F5A623')
    }
  }

  async function submitDone() {
    const s  = parseFloat(study)  || 0
    const sc = parseFloat(screen) || 0
    const a  = parseInt(acc)      || 0
    await DailyScoreRepository.log(todayKey(), s, sc, a)

    const lines: string[] = [`✓ LOGGED: DONE ${s}h study · ${sc}h screen · ${a}% accuracy`]
    if (a >= 75)      lines.push('🟢 Accuracy ' + a + '%+ — Excellent! Maintain this. Difficulty can increase slightly tomorrow.')
    else if (a >= 60) lines.push('🟡 Accuracy ' + a + '% — Good foundation. Continue same difficulty. Focus on error log tonight.')
    else              lines.push('🔴 Accuracy ' + a + '% — Below 60%. Do NOT increase difficulty. Fix concept gaps first (C1 errors).')
    if (s >= 5)  lines.push('✓ Study hours on target.')
    else         lines.push('⚠️ Study hours low. Tomorrow: protect the 09:00 QA block first.')
    if (sc > 3)  lines.push('⚠️ Screen time ' + sc + 'h > 3h limit. Protect sleep and focus.')

    setFeedback(lines.join('\n'))
    toast('Day logged ✓')
  }

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#94A3B8' }}>
        Loading Master Execution Dashboard…
      </div>
    )
  }

  return (
    <div style={{ background: '#0A0F1E', color: '#F1F5F9', minHeight: '100vh', padding: '16px 20px', maxWidth: 1400, margin: '0 auto' }}>

      {/* ── TOP HEADER ── */}
      <div style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1A2E45 50%, #0D1B2A 100%)', borderBottom: '2px solid #F5A623', borderRadius: 12, padding: '14px 20px', marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(90deg, #F5A623, #FBBF24, #F5A623)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              CAT 2026
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
              Master Execution Dashboard
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #16A34A, #22C55E)', color: 'white', padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
              <span style={{ width: 8, height: 8, background: 'white', borderRadius: '50%' }}></span>
              {phase.id} — {phase.name} — LOCKED
            </div>
            <div style={{ marginTop: 4, fontSize: 12, color: '#94A3B8' }}>
              Week {getWeekNumber()} • 7–13 September 2026
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#F5A623', fontFamily: 'monospace' }}>
              {daysLeft}
            </div>
            <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>
              days to CAT 2026
            </div>
          </div>
        </div>
      </div>

      {/* ── MISSION BAR ── */}
      <div style={{ background: 'linear-gradient(90deg, #0D1B2A, #1e3a5f, #0D1B2A)', border: '1px solid #2D3748', borderRadius: 10, padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: '#F5A623', fontWeight: 700 }}>
          🎯 MISSION: {phase.mission}
        </div>
        <div style={{ fontSize: 12, color: '#F1F5F9', fontFamily: 'monospace', background: '#1F2937', padding: '4px 12px', borderRadius: 6 }}>
          {formatDate(now)}
        </div>
        <div style={{ fontSize: 11, color: '#94A3B8', fontStyle: 'italic' }}>
          "Discipline Today Builds the Freedom Tomorrow"
        </div>
      </div>

      {/* ── DAILY SEQUENCE STRIP ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10, marginBottom: 20 }}>
        {SEQUENCE_STRIP.map(s => (
          <div
            key={s.id}
            onClick={() => {
              const el = document.getElementById(`dash_block_${s.id}`)
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }}
            style={{
              background: '#161D2E', border: '1px solid #2D3748', borderRadius: 10,
              padding: '12px 10px', textAlign: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.col }}></div>
            <div style={{ fontSize: 11, fontWeight: 800, fontFamily: 'monospace', color: s.col }}>{s.seq}</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: 'white', margin: '2px 0' }}>{s.label}</div>
            <div style={{ fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── TWO COLUMN MAIN WORKSPACE ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* LEFT: TODAY'S EXACT PLAN */}
        <div>
          <div style={{ background: 'linear-gradient(135deg, #1A2E45, #0D1B2A)', border: '1px solid #F5A623', borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#F5A623' }}>
              📅 TODAY'S PLAN ({done}/8 Blocks Completed)
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>
              Focus: Ratio & Proportion + Main Idea + Bar Graph • Phase 1 Week {getWeekNumber()}
            </div>
            <div style={{ marginTop: 8, background: '#111827', borderRadius: 4, height: 8, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #16A34A, #22C55E)', transition: 'width 0.5s' }}></div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tasks.map((task) => {
              const seqItem = SEQUENCE_STRIP.find(s => s.id === task.blockId) || SEQUENCE_STRIP[0]
              const isDone = task.status === 'DONE'

              return (
                <div
                  id={`dash_block_${task.blockId}`}
                  key={task.id}
                  style={{
                    background: '#1F2937', borderRadius: 10, padding: '14px 16px',
                    borderLeft: `4px solid ${seqItem.col}`, display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto', gap: 12, alignItems: 'start',
                    opacity: isDone ? 0.6 : 1
                  }}
                >
                  <div
                    onClick={() => updateStatus(task.id, task.blockId, isDone ? 'TODO' : 'DONE')}
                    style={{
                      width: 24, height: 24, border: `2px solid ${isDone ? '#16A34A' : '#2D3748'}`,
                      borderRadius: 6, background: isDone ? '#16A34A' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      color: 'white', fontWeight: 800, fontSize: 13, marginTop: 4
                    }}
                  >
                    {isDone && '✓'}
                  </div>

                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: seqItem.col, textTransform: 'uppercase' }}>
                      {seqItem.seq} • {task.subject}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'white', textDecoration: isDone ? 'line-through' : 'none' }}>
                      {task.title}
                    </div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, lineHeight: 1.5 }}>
                      Target: 70%+ accuracy • Focus on core elimination method and concept verification.
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'monospace' }}>
                      {task.blockId === 'QA' ? '09:00–10:30' : task.blockId === 'DILR' ? '10:45–12:00' : task.blockId === 'VARC' ? '12:15–13:15' : 'Scheduled'}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#F5A623', marginTop: 4 }}>
                      {task.status}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* RIGHT: WEEK CALENDAR + PRIORITIES + DONE LOGGER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* WEEK CALENDAR */}
          <div style={{ background: '#161D2E', border: '1px solid #2D3748', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: '#FFF' }}>
              📅 Week {getWeekNumber()} Calendar Overview
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, dIdx) => (
                <div
                  key={day}
                  style={{
                    background: dIdx === 1 ? 'rgba(245,166,35,0.15)' : '#1F2937',
                    border: dIdx === 1 ? '1px solid #F5A623' : '1px solid #2D3748',
                    borderRadius: 8, padding: '8px 4px', textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: 9, color: '#94A3B8', fontWeight: 600 }}>{day}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: dIdx === 1 ? '#F5A623' : '#FFF', margin: '2px 0' }}>{7 + dIdx}</div>
                  <div style={{ fontSize: 8, fontWeight: 700, color: dIdx === 1 ? '#F5A623' : '#22C55E' }}>
                    {dIdx === 1 ? 'TODAY' : dIdx === 6 ? 'MOCK' : 'SOLVE'}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12, padding: 10, background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#F5A623', marginBottom: 4 }}>WEEKLY EXIT GATE</div>
              <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.6 }}>
                ✓ Percentage + Ratio + Average + P&L concepts clear<br/>
                ✓ 2 DILR sets per day attempted + analysed<br/>
                ✓ Main Idea + Inference + Tone — 70%+ accuracy<br/>
                ✓ Error log complete for every day
              </div>
            </div>
          </div>

          {/* SUBJECT PRIORITIES */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <div style={{ background: '#161D2E', border: '1px solid #2D3748', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#22C55E', marginBottom: 8 }}>QA Priorities</div>
              <div style={{ fontSize: 11, color: '#FFF' }}>1. Ratio & Proportion ★★★</div>
              <div style={{ fontSize: 11, color: '#FFF', marginTop: 4 }}>2. Averages ★★★</div>
              <div style={{ fontSize: 11, color: '#FFF', marginTop: 4 }}>3. Profit & Loss ★★☆</div>
            </div>

            <div style={{ background: '#161D2E', border: '1px solid #2D3748', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#38BDF8', marginBottom: 8 }}>DILR Priorities</div>
              <div style={{ fontSize: 11, color: '#FFF' }}>1. Tables & Charts ★★★</div>
              <div style={{ fontSize: 11, color: '#FFF', marginTop: 4 }}>2. Arrangements ★★★</div>
              <div style={{ fontSize: 11, color: '#FFF', marginTop: 4 }}>3. Selection ★★☆</div>
            </div>

            <div style={{ background: '#161D2E', border: '1px solid #2D3748', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#A78BFA', marginBottom: 8 }}>VARC Priorities</div>
              <div style={{ fontSize: 11, color: '#FFF' }}>1. Main Idea ★★★</div>
              <div style={{ fontSize: 11, color: '#FFF', marginTop: 4 }}>2. Inference ★★★</div>
              <div style={{ fontSize: 11, color: '#FFF', marginTop: 4 }}>3. Tone & Elimination ★★☆</div>
            </div>
          </div>

          {/* DAILY SCORECARD INPUT */}
          <div style={{ background: 'linear-gradient(135deg, rgba(26,86,219,0.1), rgba(124,58,237,0.1))', border: '1px solid rgba(245,166,35,0.3)', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#FFF', marginBottom: 4 }}>📊 Daily Update — DONE format</div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 10 }}>Type your day's study data: DONE [study hrs] [screen hrs] [accuracy%]</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
              <div>
                <label style={{ fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>Study Hrs</label>
                <input type="number" placeholder="5" value={study} onChange={e => setStudy(e.target.value)} style={{ width: '100%', background: '#1F2937', border: '1px solid #374151', color: '#FFF', padding: 8, borderRadius: 6, textAlign: 'center', fontWeight: 800 }} />
              </div>
              <div>
                <label style={{ fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>Screen Hrs</label>
                <input type="number" placeholder="3" value={screen} onChange={e => setScreen(e.target.value)} style={{ width: '100%', background: '#1F2937', border: '1px solid #374151', color: '#FFF', padding: 8, borderRadius: 6, textAlign: 'center', fontWeight: 800 }} />
              </div>
              <div>
                <label style={{ fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>Accuracy%</label>
                <input type="number" placeholder="62" value={acc} onChange={e => setAcc(e.target.value)} style={{ width: '100%', background: '#1F2937', border: '1px solid #374151', color: '#FFF', padding: 8, borderRadius: 6, textAlign: 'center', fontWeight: 800 }} />
              </div>
            </div>

            <button onClick={submitDone} style={{ width: '100%', background: '#1A56DB', color: '#FFF', border: 'none', padding: 10, borderRadius: 8, fontWeight: 800, cursor: 'pointer', fontSize: 12 }}>
              ✓ LOG TODAY — DONE
            </button>

            {feedback && (
              <div style={{ marginTop: 10, background: 'rgba(22,163,74,0.1)', border: '1px solid #22C55E', padding: 10, borderRadius: 8, fontSize: 11, color: '#22C55E', whiteSpace: 'pre-line' }}>
                {feedback}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── TWO COLUMN: ERROR LOG + MASTER LOOP ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* ERROR LOG COUNTERS */}
        <div style={{ background: '#161D2E', border: '1px solid #2D3748', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#FFF', marginBottom: 12 }}>
            🔴 Error Log System — C1 to C5
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 12 }}>
            {[
              { code: 'C1', name: 'Concept Gap', col: '#F87171', bg: 'rgba(220,38,38,0.1)' },
              { code: 'C2', name: 'Calculation', col: '#FCD34D', bg: 'rgba(217,119,6,0.1)' },
              { code: 'C3', name: 'Misread Data', col: '#93C5FD', bg: 'rgba(37,99,235,0.1)' },
              { code: 'C4', name: 'Wrong Approach', col: '#A78BFA', bg: 'rgba(124,58,237,0.1)' },
              { code: 'C5', name: 'Time Mgmt', col: '#F9A8D4', bg: 'rgba(219,39,119,0.1)' },
            ].map(errItem => (
              <div
                key={errItem.code}
                onClick={() => handleLogErrorCard(errItem.code as any)}
                style={{
                  background: errItem.bg, border: `1px solid ${errItem.col}`, borderRadius: 8,
                  padding: '10px 4px', textAlign: 'center', cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 900, color: errItem.col, fontFamily: 'monospace' }}>{errItem.code}</div>
                <div style={{ fontSize: 8, color: '#94A3B8', margin: '2px 0' }}>{errItem.name}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'white' }}>{errorCounts[errItem.code]}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 11, color: '#94A3B8', background: '#1F2937', padding: 10, borderRadius: 8 }}>
            Analysis Flow: WHY it happened → FIX (strategy/notes) → REPAIR (practice) → RETEST (confirm)
          </div>
        </div>

        {/* PHASE TIMELINE */}
        <div style={{ background: '#161D2E', border: '1px solid #2D3748', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#FFF', marginBottom: 12 }}>
            🗺️ Phase Timeline — 86 Days
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 12 }}>
            {[
              { name: 'REBUILD', dates: '1–15 Sep', goal: 'Concept', active: true, col: '#22C55E' },
              { name: 'APPLICATION', dates: '16 Sep–4 Oct', goal: 'Timed', active: false, col: '#38BDF8' },
              { name: 'MOCKS', dates: '5 Oct–8 Nov', goal: 'Repair', active: false, col: '#EF4444' },
              { name: 'CONSOL.', dates: '9–20 Nov', goal: 'Revision', active: false, col: '#A78BFA' },
              { name: 'TAPER', dates: '21–28 Nov', goal: 'Readiness', active: false, col: '#F5A623' },
            ].map(ph => (
              <div
                key={ph.name}
                style={{
                  background: ph.active ? 'rgba(34,197,94,0.1)' : '#1F2937',
                  border: ph.active ? `1px solid ${ph.col}` : '1px solid #2D3748',
                  borderRadius: 8, padding: '8px 4px', textAlign: 'center', opacity: ph.active ? 1 : 0.6
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 800, color: ph.col }}>{ph.name}</div>
                <div style={{ fontSize: 8, color: '#94A3B8', margin: '2px 0' }}>{ph.dates}</div>
                <div style={{ fontSize: 8, color: '#94A3B8' }}>{ph.goal}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 10, color: '#22C55E', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', padding: 10, borderRadius: 8 }}>
            🔒 PHASE ORDER IS LOCKED: Only practice volume and weak-area priorities adapt.
          </div>
        </div>
      </div>

      {/* ── MANTRA BAR ── */}
      <div style={{ background: 'linear-gradient(135deg, #1A2E45, #0D1B2A)', border: '1px solid rgba(245,166,35,0.3)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#F5A623' }}>
          "Discipline Today → Dream College Tomorrow → Bigger Impact in Future"
        </div>
        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 6 }}>
          BECOME THE MAN YOU PROMISE YOURSELF • CAT 2026 • 29 November 2026 • Radhe Radhe 🙏
        </div>
      </div>
    </div>
  )
}
