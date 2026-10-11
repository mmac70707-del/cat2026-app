import { useState } from 'react'
import type { Task } from '@/types'
import { BLOCKS } from '@/data/config'
import { getFinal50DayPlan } from '@/data/final50Plan'

interface Props {
  task: Task
  onStart:  (taskId: string, blockId: string) => void
  onDone:   (taskId: string, blockId: string) => void
  onUndo:   (taskId: string, blockId: string) => void
  onSkip:   (taskId: string, blockId: string) => void
  onNotes:  (taskId: string, notes: string) => void
}

export function BlockCard({ task, onStart, onDone, onUndo, onSkip, onNotes }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [notes,    setNotes]    = useState(task.notes ?? '')

  const b = BLOCKS.find(x => x.id === task.blockId)
  if (!b) return null

  const finalPlan = b.id === 'TEST' ? getFinal50DayPlan(task.date) : null
  const plannedTestTitle = finalPlan?.testTitle ?? ''
  const isFullMock = plannedTestTitle.includes('FULL MOCK')
  const isSectional = plannedTestTitle.includes('SECTIONAL')
  const isNoTestDay = plannedTestTitle.includes('NO TEST')
  const isAnalysisBlock = plannedTestTitle.includes('ANALYSIS')
  let displayName = finalPlan ? task.title : b.name
  let displayTime = b.time
  let displayDuration = b.dur
  let displayTarget = b.target

  if (finalPlan?.isExamDay) {
    displayTime = 'Follow admit-card slot'
    displayDuration = 'Exam day · no mock'
    displayTarget = 'ID · admit card · route · calm start'
  } else if (isFullMock) {
    displayTime = 'Same fixed weekly mock slot'
    displayDuration = '120 minutes · no pause'
    displayTarget = 'Match official CAT slot when released'
  } else if (isSectional) {
    displayTime = 'Locked sectional day'
    displayDuration = '40 minutes · no peeking'
    displayTarget = 'Use the full section time limit'
  } else if (finalPlan?.isDayZero) {
    displayTime = 'QA sectional slot'
    displayDuration = '40 minutes'
    displayTarget = 'Analysis 21:00–21:45 · no new topic'
  } else if (isNoTestDay) {
    displayTime = 'No test today'
    displayDuration = 'Rest / logistics'
    displayTarget = 'Protect recovery'
  } else if (finalPlan && isAnalysisBlock) {
    displayTime = 'Library 13:15–15:00 + evening block'
    displayDuration = plannedTestTitle.includes('MOCK') ? 'Analysis ≥ mock duration' : 'Analyse · repair · retest'
    displayTarget = 'Update C1–C5 log and repair topics'
  } else if (plannedTestTitle.includes('LIGHT VARC')) {
    displayTime = 'Light warm-up'
    displayDuration = '20 minutes'
    displayTarget = 'No new material'
  } else if (plannedTestTitle.includes('ONE DILR SET')) {
    displayTime = 'Single familiar set'
    displayDuration = 'Untimed'
    displayTarget = 'Explain the method'
  } else if (plannedTestTitle.includes('LIGHT ANALYSIS')) {
    displayTime = 'Light review'
    displayDuration = 'Short and calm'
    displayTarget = 'Repair only known high-value errors'
  }

  const isDone  = task.status === 'DONE'
  const isIP    = task.status === 'IN_PROGRESS'
  const isSkip  = task.status === 'SKIPPED'

  let cardClass = 'block-card'
  if (isDone) cardClass += ' done-card'
  if (isIP)   cardClass += ' inprog-card'
  if (isSkip) cardClass += ' skipped-card'

  return (
    <div className={cardClass}>
      <div className="block-header">
        <div
          className="block-num"
          style={{ background: b.bg, color: b.color }}
        >
          {b.seq}
        </div>

        <div className="block-info">
          <div className="block-seq" style={{ color: b.color }}>{b.label}</div>
          <div className="block-name">{displayName}</div>
          <div className="block-meta">
            {displayTime} · {displayDuration} · <strong>{displayTarget}</strong>
            {isDone && <span style={{ color: '#22C55E', marginLeft: 4 }}> ✓ Done</span>}
            {isIP   && <span style={{ color: '#F5A623', marginLeft: 4 }}> ● In progress</span>}
            {isSkip && <span style={{ color: '#94A3B8', marginLeft: 4 }}> ↷ Skipped</span>}
          </div>
        </div>

        <div className="block-actions">
          {!isDone && !isIP && !isSkip && (
            <button
              className="act-btn start-btn"
              title="Start"
              onClick={() => onStart(task.id, b.id)}
            >▶</button>
          )}
          {isIP && (
            <button
              className="act-btn"
              style={{ borderColor: '#22C55E', color: '#22C55E' }}
              title="Mark done"
              onClick={() => onDone(task.id, b.id)}
            >✓</button>
          )}
          {isDone && (
            <button
              className="act-btn done-btn"
              title="Undo"
              onClick={() => onUndo(task.id, b.id)}
            >✓</button>
          )}
          {!isDone && !isSkip && (
            <button
              className="act-btn"
              style={{ color: 'var(--muted)', fontSize: 12 }}
              title="Skip"
              onClick={() => onSkip(task.id, b.id)}
            >↷</button>
          )}
        </div>
      </div>

      <button
        className="expand-btn"
        onClick={() => setExpanded(e => !e)}
      >
        {expanded ? '▲ Hide' : '▼ Tasks + Notes'}
      </button>

      {expanded && (
        <div className="block-body">
          <div className="block-body-inner">
            {b.tasks.map((t, i) => (
              <div className="task-row" key={i}>
                <div className="task-dot" style={{ background: b.color }} />
                <div
                  className="task-text"
                  dangerouslySetInnerHTML={{ __html: t }}
                />
              </div>
            ))}
            <textarea
              className="textarea-input"
              style={{ marginTop: 10 }}
              placeholder="Notes for this block…"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            <button
              className="save-notes-btn"
              style={{ marginTop: 4, background: 'var(--blue2)', border: 'none', color: 'white', borderRadius: 6, padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
              onClick={() => onNotes(task.id, notes)}
            >
              Save Notes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
