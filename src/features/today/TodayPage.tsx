import { useState } from 'react'
import { useTodayTasks } from '@/hooks/useTasks'
import { DailyScoreRepository } from '@/repositories/index'
import { usePhase } from '@/hooks/usePhase'
import { formatDate, todayKey, getWeekNumber } from '@/services/domain'
import { getKolkataDateKey, getFirstPassDayNum } from '@/services/calendarEngine'
import { getPercentylDailyTarget } from '@/data/percentylPlan2'
import { getFinal50DayPlan } from '@/data/final50Plan'
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
  const finalPlan = getFinal50DayPlan(dateKey)
  const firstPassDayNum = getFirstPassDayNum(dateKey)
  const dayNum = finalPlan ? finalPlan.dayNum : firstPassDayNum
  const isFullMockDay = Boolean(finalPlan?.testTitle.includes('FULL MOCK'))
  const isMockAnalysisDay = Boolean(finalPlan?.testTitle.includes('MOCK ANALYSIS'))
  const qaTargetLabel = isFullMockDay
    ? 'Full mock • QA section 3/3 · 40 min · no separate quota'
    : isMockAnalysisDay
      ? 'Analyse attempts / correct / wrong / score; classify C1–C5'
      : finalPlan ? finalPlan.qaFocus : pt.quantTopic + ' (' + pt.quantTargetQs + ' Qs)'
  const dilrTargetLabel = isFullMockDay
    ? 'Full mock • DILR section 2/3 · 40 min'
    : isMockAnalysisDay
      ? 'Check set-selection, accuracy and C1–C5 errors'
      : finalPlan ? finalPlan.dilrFocus : pt.dilrTopic + ' (' + pt.dilrTargetSets + ' sets)'
  const varcTargetLabel = isFullMockDay
    ? 'Full mock • VARC section 1/3 · 40 min'
    : isMockAnalysisDay
      ? 'Check RC / VA accuracy and C1–C5 errors'
      : finalPlan ? finalPlan.varcFocus : pt.varcTopic + ' (' + pt.varcTargetPsg + ' passages)'
  const coreTargetCards = isFullMockDay
    ? [
        { label: 'VARC', icon: '📖', value: varcTargetLabel, background: 'rgba(124,58,237,0.15)', border: '#7C3AED', color: 'var(--ql-sub)' },
        { label: 'DILR', icon: '🧩', value: dilrTargetLabel, background: 'rgba(37,99,235,0.15)', border: '#2563EB', color: 'var(--ql-sub)' },
        { label: 'QA', icon: '📐', value: qaTargetLabel, background: 'rgba(22,163,74,0.15)', border: '#16A34A', color: 'var(--ql-accent-strong)' },
      ]
    : [
        { label: 'QA', icon: '📐', value: qaTargetLabel, background: 'rgba(22,163,74,0.15)', border: '#16A34A', color: 'var(--ql-accent-strong)' },
        { label: 'DILR', icon: '🧩', value: dilrTargetLabel, background: 'rgba(37,99,235,0.15)', border: '#2563EB', color: 'var(--ql-sub)' },
        { label: 'VARC', icon: '📖', value: varcTargetLabel, background: 'rgba(124,58,237,0.15)', border: '#7C3AED', color: 'var(--ql-sub)' },
      ]

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
        <div className="today-command-meta">{formatDate(now)} · {finalPlan && finalPlan.weekNum > 0 ? 'Final Plan Week ' + finalPlan.weekNum + '/7' : 'Week ' + getWeekNumber()} · {phase.id} {phase.name}</div>
      </div>

      <ExecutionIntelligenceCard tasks={tasks} onNavigate={onNavigate} />
      <LearningIntelligenceCard onNavigate={onNavigate} />

      {/* 8-Block Sequence Strip */}
      <div className="today-sequence" style={{ padding: '12px 16px 0', overflowX: 'auto' }}>
        <div className="today-sequence-strip" style={{ display: 'flex', gap: 6, paddingBottom: 4 }}>
          {SEQUENCE_STRIP.map(s => (
            <div
              key={s.id}
              onClick={() => handleSequenceClick(s.id)}
              className="today-sequence-item" style={{
                background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8,
                padding: '6px 8px', minWidth: 62, textAlign: 'center', cursor: 'pointer', flexShrink: 0
              }}
            >
              <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--ui-accent)', fontFamily: 'monospace' }}>{s.seq}</div>
              <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--ql-text)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's 3 Core Targets Card */}
      <div className="today-core-targets" style={{ padding: '12px 16px 0' }}>
        <div style={{ background: 'var(--ql-surface)', border: '1px solid var(--ql-accent)', borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ql-accent-strong)', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>
            {finalPlan?.isExamDay ? '🎯 CAT EXAM DAY — FOLLOW ADMIT-CARD INSTRUCTIONS' : finalPlan && !finalPlan.isDayZero ? '🎯 FINAL 50-DAY PDF PLAN · DAY ' + dayNum + '/49 · WEEK ' + finalPlan.weekNum + '/7' : finalPlan?.isDayZero ? '🎯 FINAL 50-DAY PLAN · DAY 0' : '🎯 TODAY’S 3 CORE TARGETS · FIRST-PASS DAY ' + firstPassDayNum + '/44'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, fontSize: 12, fontWeight: 700 }}>
            {coreTargetCards.map(card => (
              <div key={card.label} style={{ background: card.background, border: '1px solid ' + card.border, padding: '8px 10px', borderRadius: 6, color: card.color }}>
                {card.icon} {card.label} &nbsp;→&nbsp; <span style={{ color: '#FFF' }}>{card.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {finalPlan && (
        <div style={{ padding: '12px 16px 0' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
            {finalPlan.final10Days && <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--gold)', letterSpacing: 1, marginBottom: 5 }}>FINAL 10 DAYS · REVISION ONLY · NO NEW MATERIAL</div>}
            <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--gold)', letterSpacing: 1 }}>TODAY’S LOCKED TEST / GATE</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--ql-text)', marginTop: 5 }}>{finalPlan.testTitle}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5, lineHeight: 1.5 }}>{finalPlan.testNotes}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 7 }}>Week {finalPlan.weekNum || '—'} priority: {finalPlan.weeklyPriority}</div>
            {finalPlan.final10Days ? <div style={{ fontSize: 10, color: '#F59E0B', fontWeight: 800, marginTop: 6 }}>Every recall item under 5 min. If stuck, reopen its worked example — no new topic or new resource.</div> : finalPlan.coverageFreeze && <div style={{ fontSize: 10, color: '#F59E0B', fontWeight: 800, marginTop: 6 }}>COVERAGE FREEZE: no new topics except repeated Tier-1 C1 gaps.</div>}
          </div>
        </div>
      )}

      {/* Daily execution progress. Historical first-pass syllabus progress remains in Roadmap. */}
      <div className="today-first-pass" style={{ padding: '12px 16px 0' }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold)', letterSpacing: 0.5 }}>
                🚀 TODAY’S 8-BLOCK EXECUTION
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ql-text)', marginTop: 2 }}>
                {finalPlan ? finalPlan.testTitle : 'Syllabus focus: ' + pt.quantTopic}
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
      <div className="today-block-list" style={{ padding: '10px 16px 0' }}>
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
      <div className="today-done" style={{ padding: '0 16px 16px' }}>
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
