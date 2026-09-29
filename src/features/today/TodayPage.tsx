import { useState } from 'react'
import { useTodayTasks } from '@/hooks/useTasks'
import { DailyScoreRepository } from '@/repositories/index'
import { usePhase } from '@/hooks/usePhase'
import { formatDate, todayKey, getWeekNumber } from '@/services/domain'
import { getKolkataDateKey, getFirstPassDayNum } from '@/services/calendarEngine'
import { getPercentylDailyTarget } from '@/data/percentylPlan2'
import { playSuccessSound } from '@/services/audioService'
import { BlockCard } from './BlockCard'
import { ExecutionIntelligenceCard } from './ExecutionIntelligenceCard'
import { LearningIntelligenceCard } from './LearningIntelligenceCard'
import { useToast } from '@/components/Toast'

const SEQUENCE_STRIP = [
  { seq: '01', id: 'QA',       label: 'QA',       col: '#16A34A' },
  { seq: '02', id: 'DILR',     label: 'DILR',     col: '#2563EB' },
  { seq: '03', id: 'VARC',     label: 'VARC',     col: '#7C3AED' },
  { seq: '04', id: 'TEST',     label: 'TEST',     col: '#D97706' },
  { seq: '05', id: 'ANALYSIS', label: 'ANALYSIS', col: '#DC2626' },
  { seq: '06', id: 'REVISION', label: 'REVISION', col: '#8B5CF6' },
  { seq: '07', id: 'REPAIR',   label: 'REPAIR',   col: '#DB2777' },
  { seq: '08', id: 'RETEST',   label: 'RETEST',   col: '#0E9F9F' },
]

export function TodayPage({ onNavigate }: { onNavigate?: (page: string) => void } = {}) {
  const phase   = usePhase()
  const { tasks, loading, done, pct, updateStatus, saveNotes } = useTodayTasks()
  const { show: toast } = useToast()

  const [study,  setStudy]  = useState('')
  const [screen, setScreen] = useState('')
  const [acc,    setAcc]    = useState('')
  const [feedback, setFeedback] = useState('')

  const now = new Date()
  const dateKey = getKolkataDateKey(now)
  const pt = getPercentylDailyTarget(dateKey)
  const dayNum = pt.dayNum || getFirstPassDayNum(dateKey)

  const activeTask = tasks.find(t => t.status === 'IN_PROGRESS')
  const nextTask = tasks.find(t => t.status === 'TODO')
  const currentBlock = activeTask ? SEQUENCE_STRIP.find(s => s.id === activeTask.blockId) : null
  const nextBlock = nextTask ? SEQUENCE_STRIP.find(s => s.id === nextTask.blockId) : null
  const executionState = activeTask
    ? 'IN PROGRESS'
    : nextTask
      ? 'READY'
      : 'DAY COMPLETE'

  async function submitDone() {
    const s  = parseFloat(study)  || 0
    const sc = parseFloat(screen) || 0
    const a  = parseInt(acc)      || 0
    await DailyScoreRepository.log(todayKey(), s, sc, a)

    playSuccessSound()

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

  const handleSequenceClick = (blockId: string) => {
    const el = document.getElementById(`block_${blockId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  if (loading) {
    return (
      <div className="section-pad" style={{ textAlign: 'center', paddingTop: 40 }}>
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>Loading today's plan…</div>
      </div>
    )
  }

  return (
    <div>
      {/* Command Center */}
      <div className="today-command-center">
        <div className="today-command-kicker">TODAY · COMMAND CENTER</div>
        <div className="today-command-grid">
          <div className="today-command-main">
            <div className="today-command-state">{executionState}</div>
            <div className="today-command-title">{currentBlock?.label || nextBlock?.label || 'ALL CLEAR'}</div>
            <div className="today-command-detail">
              {activeTask?.title || nextTask?.title || 'All scheduled blocks are complete. Protect recovery and review the day.'}
            </div>
          </div>
          <div className="today-command-side">
            <div><span>DONE</span><strong>{done}/8</strong></div>
            <div><span>PROGRESS</span><strong>{pct}%</strong></div>
            <div><span>NEXT</span><strong>{nextBlock?.label || '—'}</strong></div>
          </div>
        </div>
        <div className="today-command-mission">Mission: {phase.mission}</div>
        <div className="today-command-meta">{formatDate(now)} · Week {getWeekNumber()} · {phase.id} {phase.name}</div>
      </div>

      <ExecutionIntelligenceCard tasks={tasks} onNavigate={onNavigate} />
      <LearningIntelligenceCard onNavigate={onNavigate} />

      {/* 8-Block Sequence Strip */}
      <div style={{ padding: '12px 16px 0', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 6, paddingBottom: 4 }}>
          {SEQUENCE_STRIP.map(s => (
            <div
              key={s.id}
              onClick={() => handleSequenceClick(s.id)}
              style={{
                background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8,
                padding: '6px 8px', minWidth: 62, textAlign: 'center', cursor: 'pointer', flexShrink: 0
              }}
            >
              <div style={{ fontSize: 9, fontWeight: 800, color: s.col, fontFamily: 'monospace' }}>{s.seq}</div>
              <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--ql-text)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's 3 Core Targets Card */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ background: 'var(--ql-surface)', border: '1px solid var(--ql-accent)', borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ql-accent-strong)', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>
            🎯 TODAY'S 3 CORE TARGETS (DAY {dayNum < 10 ? '0' + dayNum : dayNum} / 44)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, fontSize: 12, fontWeight: 700 }}>
            <div style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid #16A34A', padding: '8px 10px', borderRadius: 6, color: 'var(--ql-accent-strong)' }}>
              📐 QA &nbsp;→&nbsp; <span style={{ color: '#FFF' }}>{pt.quantTopic.toUpperCase()} ({pt.quantTargetQs} Qs)</span>
            </div>
            <div style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid #2563EB', padding: '8px 10px', borderRadius: 6, color: 'var(--ql-sub)' }}>
              🧩 DILR &nbsp;→&nbsp; <span style={{ color: '#FFF' }}>{pt.dilrTopic.toUpperCase()} ({pt.dilrTargetSets} Sets)</span>
            </div>
            <div style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid #7C3AED', padding: '8px 10px', borderRadius: 6, color: 'var(--ql-sub)' }}>
              📖 VARC &nbsp;→&nbsp; <span style={{ color: '#FFF' }}>{pt.varcTopic.toUpperCase()} ({pt.varcTargetPsg} Psg)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 44-Day First-Pass Day & Progress Bar */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold)', letterSpacing: 0.5 }}>
                🚀 44-DAY FIRST PASS: DAY {dayNum < 10 ? '0' + dayNum : dayNum} / 44
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ql-text)', marginTop: 2 }}>
                Target Topic: {pt.quantTopic} ({pt.quantTargetQs} Qs)
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--gold)', fontWeight: 800 }}>
                {done}/8 blocks done
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>{pct}% complete</div>
            </div>
          </div>
          <div className="progress-wrap" style={{ marginTop: 8 }}>
            <div
              className="progress-fill"
              style={{ width: `${pct}%`, background: 'var(--ql-accent)' }}
            />
          </div>
        </div>
      </div>

      {/* Block cards */}
      <div style={{ padding: '10px 16px 0' }}>
        {tasks.map(task => (
          <div id={`block_${task.blockId}`} key={task.id}>
            <BlockCard
              task={task}
              onStart={(tid, bid)        => { updateStatus(tid, bid, 'IN_PROGRESS'); toast(`▶ ${bid} started`, '#D97706') }}
              onDone={(tid, bid)         => { updateStatus(tid, bid, 'DONE');        playSuccessSound(); toast(`✓ ${bid} complete!`) }}
              onUndo={(tid, bid)         => { updateStatus(tid, bid, 'TODO');        toast(`↩ ${bid} reset`, '#D97706') }}
              onSkip={(tid, bid)         => { updateStatus(tid, bid, 'SKIPPED');     toast(`↷ ${bid} skipped`, '#64748B') }}
              onNotes={(tid, notes)      => { saveNotes(tid, notes);                 toast('Notes saved ✓') }}
            />
          </div>
        ))}
      </div>

      {/* DONE Logger Card */}
      <div style={{ padding: '0 16px 16px' }}>
        <div className="done-card-wrap">
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>📊 Daily Update — DONE format</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
            Type your day's data: DONE [study hrs] [screen hrs] [accuracy%]
          </div>
          <div className="done-grid">
            <div className="done-field">
              <label>Study hrs</label>
              <input type="number" placeholder="5" min={0} max={16} value={study} onChange={e => setStudy(e.target.value)} />
            </div>
            <div className="done-field">
              <label>Screen hrs</label>
              <input type="number" placeholder="3" min={0} max={16} value={screen} onChange={e => setScreen(e.target.value)} />
            </div>
            <div className="done-field">
              <label>Accuracy%</label>
              <input type="number" placeholder="62" min={0} max={100} value={acc} onChange={e => setAcc(e.target.value)} />
            </div>
          </div>
          <button className="btn-primary" onClick={submitDone}>✓ LOG TODAY — DONE</button>
          {feedback && <div className="feedback-box">{feedback}</div>}
        </div>
      </div>
    </div>
  )
}
