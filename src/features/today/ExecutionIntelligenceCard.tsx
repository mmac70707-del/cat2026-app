import { useEffect, useMemo, useState } from 'react'
import type { Task } from '@/types'
import type { ErrorRecord, DailyScore } from '@/types'
import { ErrorRepository } from '@/repositories/ErrorRepository'
import { DailyScoreRepository } from '@/repositories/index'
import { AppIcon } from '@/components/AppIcon'

interface Props {
  tasks: Task[]
  onNavigate?: (page: string) => void
}

type EngineMode = 'BUILD' | 'PRECISION' | 'PROTECT'

export function ExecutionIntelligenceCard({ tasks, onNavigate }: Props) {
  const [errors, setErrors] = useState<ErrorRecord[]>([])
  const [scores, setScores] = useState<DailyScore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    Promise.all([ErrorRepository.getAll(), DailyScoreRepository.getLast7()])
      .then(([nextErrors, nextScores]) => {
        if (!mounted) return
        setErrors(nextErrors)
        setScores(nextScores)
      })
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [tasks])

  const activeTask = tasks.find(t => t.status === 'IN_PROGRESS')
  const nextTask = tasks.find(t => t.status === 'TODO')

  const pendingRepair = errors.filter(e => e.repairStatus === 'PENDING')
  const pendingRepairCount = pendingRepair.length
  const pendingRetest = errors.filter(e => e.repairStatus === 'DONE' && e.retestStatus === 'PENDING')
  const pendingC1 = pendingRepair.filter(e => e.errorType === 'C1').length

  const latestScore = scores[0] ?? null
  const avgAccuracy = scores.length
    ? Math.round(scores.reduce((sum, s) => sum + s.accuracyPct, 0) / scores.length)
    : null
  const avgStudy = scores.length
    ? scores.reduce((sum, s) => sum + s.studyHrs, 0) / scores.length
    : null
  const previousAvg = scores.length > 1
    ? Math.round(scores.slice(1).reduce((sum, s) => sum + s.accuracyPct, 0) / (scores.length - 1))
    : null
  const trend = latestScore && previousAvg !== null ? latestScore.accuracyPct - previousAvg : null

  const mode: EngineMode = pendingC1 > 0 || (latestScore !== null && latestScore.accuracyPct < 60)
    ? 'PROTECT'
    : pendingRetest > 0
      ? 'PRECISION'
      : 'BUILD'

  const decision = useMemo(() => {
    if (activeTask) {
      return {
        eyebrow: 'CURRENT BLOCK',
        title: activeTask.title,
        detail: 'Finish the active block before opening another system.',
        action: 'CONTINUE CURRENT',
        icon: 'focus' as const,
        page: null,
      }
    }
    if (pendingC1 > 0) {
      return {
        eyebrow: 'REPAIR FIRST',
        title: 'Clear a C1 concept gap',
        detail: `${pendingC1} concept gap${pendingC1 > 1 ? 's' : ''} waiting. Do not increase difficulty yet.`,
        action: 'OPEN ERROR TRIAGE',
        icon: 'errors' as const,
        page: 'errors',
      }
    }
    if (pendingRetest > 0) {
      return {
        eyebrow: 'VERIFY MASTERY',
        title: 'Retest repaired weakness',
        detail: `${pendingRetest} repaired item${pendingRetest > 1 ? 's' : ''} still need evidence.`,
        action: 'OPEN RETEST',
        icon: 'retest' as const,
        page: 'retest',
      }
    }
    if (nextTask) {
      return {
        eyebrow: 'NEXT BLOCK',
        title: nextTask.title,
        detail: 'The plan is clear. Start the next scheduled block now.',
        action: 'START NEXT BLOCK',
        icon: 'rocket' as const,
        page: null,
      }
    }
    return {
      eyebrow: 'DAY CLOSED',
      title: 'Protect recovery',
      detail: 'All scheduled blocks are complete. Use the remaining time for a light recap, then recover.',
      action: 'OPEN TODAY',
      icon: 'checkCircle' as const,
      page: 'today',
    }
  }, [activeTask, nextTask, pendingC1, pendingRetest])

  const todayDone = tasks.filter(t => t.status === 'DONE').length
  const todayPct = tasks.length ? Math.round((todayDone / tasks.length) * 100) : 0
  const focusScore = Math.min(100, Math.round(
    todayPct * 0.45 +
    (avgAccuracy ?? 60) * 0.35 +
    Math.min(100, ((avgStudy ?? 0) / 5) * 100) * 0.20
  ))

  function executePrimary() {
    if (decision.page) {
      onNavigate?.(decision.page)
      return
    }
    const anchor = activeTask?.blockId ?? nextTask?.blockId
    if (anchor) {
      document.getElementById(`block_${anchor}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      if (!activeTask) window.dispatchEvent(new Event('jarvis:focus:start'))
    }
  }

  return (
    <section className="execution-intelligence" aria-label="Execution intelligence">
      <div className="execution-intelligence-head">
        <div>
          <div className="execution-intelligence-kicker">EXECUTION INTELLIGENCE</div>
          <div className="execution-intelligence-title">LOCAL DECISION ENGINE</div>
        </div>
        <div className={`execution-intelligence-mode mode-${mode.toLowerCase()}`}>
          {mode} MODE
        </div>
      </div>

      <div className="execution-intelligence-grid">
        <div className="execution-next-card">
          <div className="execution-next-eyebrow">
            <AppIcon name={decision.icon} size={15} />
            {decision.eyebrow}
          </div>
          <div className="execution-next-title">{decision.title}</div>
          <div className="execution-next-detail">{decision.detail}</div>
          <button className="execution-next-action" onClick={executePrimary}>
            <span>{decision.action}</span>
            <AppIcon name="arrowRight" size={16} />
          </button>
        </div>

        <div className="execution-metric-card">
          <div className="execution-metric-label">MOMENTUM</div>
          <div className="execution-metric-value">{focusScore}<small>/100</small></div>
          <div className="execution-metric-bar">
            <span style={{ width: `${focusScore}%` }} />
          </div>
          <div className="execution-metric-note">
            {trend === null
              ? 'Baseline is forming from your logged data.'
              : trend > 0
                ? `Accuracy trend +${trend} pts vs prior logged days.`
                : trend < 0
                  ? `Accuracy trend ${trend} pts. Slow down and repair.`
                  : 'Accuracy trend is stable.'}
          </div>
        </div>

        <div className="execution-metric-card">
          <div className="execution-metric-label">7-DAY SIGNAL</div>
          <div className="execution-signal-row">
            <div><b>{avgAccuracy ?? '—'}%</b><span>AVG ACC</span></div>
            <div><b>{avgStudy !== null ? avgStudy.toFixed(1) : '—'}h</b><span>AVG STUDY</span></div>
            <div><b>{pendingRepairCount}</b><span>REPAIR</span></div>
          </div>
          <div className="execution-gate">
            <span className="execution-gate-dot" />
            {loading ? 'READING LOCAL SIGNALS…' : mode === 'PROTECT' ? 'RECOVERY GATE ACTIVE' : mode === 'PRECISION' ? 'RETEST GATE ACTIVE' : 'BUILD GATE ACTIVE'}
          </div>
        </div>
      </div>

      <div className="execution-quick-actions">
        <button onClick={() => window.dispatchEvent(new Event('jarvis:focus:start'))}>
          <AppIcon name="focus" size={15} /> FOCUS
        </button>
        <button onClick={() => onNavigate?.('errors')}>
          <AppIcon name="errors" size={15} /> ERRORS
        </button>
        <button onClick={() => onNavigate?.('retest')}>
          <AppIcon name="retest" size={15} /> RETEST
        </button>
        <button onClick={() => onNavigate?.('adaptive')}>
          <AppIcon name="adaptive" size={15} /> ADAPT
        </button>
      </div>
    </section>
  )
}
