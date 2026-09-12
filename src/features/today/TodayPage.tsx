import { useState } from 'react'
import { useTodayTasks } from '@/hooks/useTasks'
import { DailyScoreRepository } from '@/repositories/index'
import { usePhase } from '@/hooks/usePhase'
import { formatDate, todayKey, getWeekNumber } from '@/services/domain'
import { BlockCard } from './BlockCard'
import { useToast } from '@/components/Toast'

export function TodayPage() {
  const phase   = usePhase()
  const { tasks, loading, done, pct, updateStatus, saveNotes } = useTodayTasks()
  const { show: toast } = useToast()

  const [study,  setStudy]  = useState('')
  const [screen, setScreen] = useState('')
  const [acc,    setAcc]    = useState('')
  const [feedback, setFeedback] = useState('')

  const now = new Date()

  async function submitDone() {
    const s  = parseFloat(study)  || 0
    const sc = parseFloat(screen) || 0
    const a  = parseInt(acc)      || 0
    await DailyScoreRepository.log(todayKey(), s, sc, a)

    const lines: string[] = [`✓ DONE logged: ${s}h study · ${sc}h screen · ${a}% accuracy`]
    if (a >= 75)      lines.push('🟢 Accuracy ' + a + '%+ — Excellent! Increase difficulty slightly tomorrow.')
    else if (a >= 60) lines.push('🟡 Accuracy ' + a + '% — Good. Hold difficulty. Fix C1 errors tonight.')
    else              lines.push('🔴 Accuracy ' + a + '% — Below 60%. Do NOT increase difficulty. Repair C1 gaps first.')
    if (s >= 5)  lines.push('✓ Study hours on target.')
    else         lines.push('⚠️ Low study hours. Protect morning QA block first tomorrow.')
    if (sc > 3)  lines.push('⚠️ Screen ' + sc + 'h > 3h limit. Protect focus + sleep.')

    setFeedback(lines.join('\n'))
    toast('Day logged ✓')
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
      {/* Mission banner */}
      <div style={{ background: 'linear-gradient(135deg,#0D1B2A,#1A2E45)', borderBottom: '1px solid rgba(245,166,35,.2)', padding: '12px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)' }}>
          🎯 MISSION: {phase.mission}
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>
          {formatDate(now)} · Week {getWeekNumber()} · {phase.id} {phase.name}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700 }}>Today's Progress</span>
          <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--gold)' }}>{done}/8</span>
        </div>
        <div className="progress-wrap">
          <div
            className="progress-fill"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#16A34A,#22C55E)' }}
          />
        </div>
      </div>

      {/* Block cards */}
      <div style={{ padding: '10px 16px 0' }}>
        {tasks.map(task => (
          <BlockCard
            key={task.id}
            task={task}
            onStart={(tid, bid)        => { updateStatus(tid, bid, 'IN_PROGRESS'); toast(`▶ ${bid} started`, '#D97706') }}
            onDone={(tid, bid)         => { updateStatus(tid, bid, 'DONE');        toast(`✓ ${bid} complete!`) }}
            onUndo={(tid, bid)         => { updateStatus(tid, bid, 'TODO');        toast(`↩ ${bid} reset`, '#D97706') }}
            onSkip={(tid, bid)         => { updateStatus(tid, bid, 'SKIPPED');     toast(`↷ ${bid} skipped`, '#64748B') }}
            onNotes={(tid, notes)      => { saveNotes(tid, notes);                 toast('Notes saved ✓') }}
          />
        ))}
      </div>

      {/* DONE logger */}
      <div style={{ padding: '0 16px 16px' }}>
        <div className="done-card-wrap">
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>📊 Log Today — DONE</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
            Study hrs · Screen hrs · Accuracy%
          </div>
          <div className="done-grid">
            <div className="done-field">
              <label>Study hrs</label>
              <input type="number" placeholder="0" min={0} max={16} value={study} onChange={e => setStudy(e.target.value)} />
            </div>
            <div className="done-field">
              <label>Screen hrs</label>
              <input type="number" placeholder="0" min={0} max={16} value={screen} onChange={e => setScreen(e.target.value)} />
            </div>
            <div className="done-field">
              <label>Accuracy%</label>
              <input type="number" placeholder="0" min={0} max={100} value={acc} onChange={e => setAcc(e.target.value)} />
            </div>
          </div>
          <button className="btn-primary" onClick={submitDone}>✓ LOG — DONE</button>
          {feedback && <div className="feedback-box">{feedback}</div>}
        </div>
      </div>
    </div>
  )
}
