import { useEffect, useMemo, useState } from 'react'
import { dbGetAll, dbPut } from '@/db'
import type { MasteryTopic } from '@/types'
import { useTodayTasks } from '@/hooks/useTasks'

type MissionSubject = 'QA' | 'DILR' | 'VARC'
type MissionRun = {
  id: string
  date: string
  subject: MissionSubject
  topic: string
  minutes: number
  completedAt: string
  source: 'adaptive'
}

type ErrorRow = {
  id: string
  subject: MissionSubject
  topic: string
  repairStatus?: string
  retestStatus?: string
}

const todayKey = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })

export function MissionOSPage({
  onBack,
  onOpenToday,
}: {
  onBack?: () => void
  onOpenToday?: () => void
}) {
  const { tasks, loading: tasksLoading, done: todayDone, pct: todayPct, updateStatus } = useTodayTasks()
  const [topics, setTopics] = useState<MasteryTopic[]>([])
  const [errors, setErrors] = useState<ErrorRow[]>([])
  const [runs, setRuns] = useState<MissionRun[]>([])
  const [loading, setLoading] = useState(true)
  const [minutes, setMinutes] = useState(25)
  const [toast, setToast] = useState('')

  async function load() {
    setLoading(true)
    try {
      const [mastery, errorRows, missionRuns] = await Promise.all([
        dbGetAll<MasteryTopic>('masteryTopics'),
        dbGetAll<ErrorRow>('errors'),
        dbGetAll<MissionRun>('missionRuns'),
      ])
      setTopics(mastery)
      setErrors(errorRows)
      setRuns(missionRuns)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  const plan = useMemo(() => {
    const subjectOrder: MissionSubject[] = ['QA', 'DILR', 'VARC']
    return subjectOrder.map(subject => {
      const subjectTopics = topics.filter(t => t.subject === subject)
      const weak = [...subjectTopics].sort((a, b) => a.currentLevel - b.currentLevel)[0]
      const openErrors = errors.filter(e => e.subject === subject && e.repairStatus !== 'DONE').length
      const score = (weak ? (5 - weak.currentLevel) * 10 : 0) + openErrors * 7
      return {
        subject,
        topic: weak?.name ?? 'Foundation practice',
        level: weak?.currentLevel ?? 0,
        openErrors,
        score,
      }
    }).sort((a, b) => b.score - a.score)
  }, [topics, errors])

  const current = plan[0] ?? {
    subject: 'QA' as MissionSubject,
    topic: 'Foundation practice',
    level: 0,
    openErrors: 0,
    score: 0,
  }

  const nextTask = tasks.find(t => t.status !== 'DONE' && t.status !== 'SKIPPED')
  const openRepairTotal = errors.filter(e => e.repairStatus !== 'DONE').length
  const todayRuns = runs.filter(r => r.date === todayKey())
  const totalTodayMinutes = todayRuns.reduce((sum, r) => sum + r.minutes, 0)

  const streak = useMemo(() => {
    const days = new Set(runs.map(r => r.date))
    let cursor = todayKey()
    let count = 0
    while (days.has(cursor)) {
      count++
      const d = new Date(cursor + 'T00:00:00Z')
      d.setUTCDate(d.getUTCDate() - 1)
      cursor = d.toISOString().slice(0, 10)
    }
    return count
  }, [runs])

  const recommendation = current.openErrors > 0
    ? 'REPAIR SIGNAL • close the root cause before adding difficulty'
    : current.level <= 2
      ? 'FOUNDATION SIGNAL • concept → guided practice → recall'
      : 'MASTERY SIGNAL • timed practice → analysis → retest'

  async function completeMission() {
    const now = new Date()
    const run: MissionRun = {
      id: `mission-${now.getTime()}`,
      date: todayKey(),
      subject: current.subject,
      topic: current.topic,
      minutes,
      completedAt: now.toISOString(),
      source: 'adaptive',
    }
    await dbPut('missionRuns', run)
    setRuns(prev => [run, ...prev])
    setToast(`MISSION LOGGED • ${minutes} MIN • ${current.subject}`)
    window.setTimeout(() => setToast(''), 2200)
  }

  function startFocus() {
    if (nextTask && nextTask.status === 'TODO') {
      void updateStatus(nextTask.id, nextTask.blockId, 'IN_PROGRESS')
    }
    window.dispatchEvent(new Event('jarvis:focus:start'))
    setToast(nextTask ? `FOCUS LOCKED • ${nextTask.blockId} • ${nextTask.subject}` : 'FOCUS CORE ONLINE • MISSION LOCKED')
    window.setTimeout(() => setToast(''), 2200)
  }

  return (
    <div className="section-pad mission-os-page">
      <div className="page-header">
        {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
        <div>
          <div className="page-header-title">Mission OS</div>
          <div className="mission-os-header-sub">ONE DECISION → ONE ACTION → ONE VERIFIED RESULT</div>
        </div>
      </div>

      <div className="mission-os-hero">
        <div>
          <div className="jarvis-panel-title">◉ ADAPTIVE EXECUTION CORE</div>
          <h1>{nextTask ? `DO ${nextTask.blockId} NOW` : 'CHOOSE THE NEXT MISSION'}</h1>
          <p>{nextTask ? nextTask.title : `${current.subject} • ${current.topic}`}</p>
        </div>
        <div className="mission-os-hero-ring" aria-hidden="true">
          <span>{todayPct}%</span>
          <small>TODAY</small>
        </div>
      </div>

      <div className="mission-os-primary-actions">
        {onOpenToday && <button className="mission-os-primary" onClick={onOpenToday}>OPEN TODAY <span>→</span></button>}
        <button className="mission-os-secondary" onClick={startFocus}>▶ START FOCUS</button>
      </div>

      <div className="mission-os-signal">
        <span className="mission-os-signal-dot" />
        <span>{recommendation}</span>
      </div>

      <div className="jarvis-stat-grid mission-os-stats">
        <div className="card-sm jarvis-stat-card"><div className="jarvis-stat-label">Today focus</div><div className="jarvis-stat-value" style={{ color: 'var(--jarvis-cyan)' }}>{totalTodayMinutes}m</div></div>
        <div className="card-sm jarvis-stat-card"><div className="jarvis-stat-label">Daily blocks</div><div className="jarvis-stat-value" style={{ color: 'var(--jarvis-green)' }}>{todayDone}/8</div></div>
        <div className="card-sm jarvis-stat-card"><div className="jarvis-stat-label">Open repairs</div><div className="jarvis-stat-value" style={{ color: 'var(--jarvis-amber)' }}>{openRepairTotal}</div></div>
        <div className="card-sm jarvis-stat-card"><div className="jarvis-stat-label">Streak</div><div className="jarvis-stat-value" style={{ color: 'var(--jarvis-cyan)' }}>{streak}d</div></div>
      </div>

      <div className="mission-os-section">
        <div className="jarvis-panel-title">▣ TODAY'S EXECUTION QUEUE</div>
        {tasksLoading ? (
          <div className="jarvis-helper">Reading today's verified plan…</div>
        ) : (
          <div className="mission-os-queue">
            {tasks.map((task, i) => {
              const isDone = task.status === 'DONE'
              const isCurrent = nextTask?.id === task.id
              return (
                <div key={task.id} className={`mission-os-queue-row ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                  <div className="mission-os-queue-index">{String(i + 1).padStart(2, '0')}</div>
                  <div className="mission-os-queue-main">
                    <b>{task.blockId} <span>• {task.subject}</span></b>
                    <small>{task.title}</small>
                  </div>
                  <div className={`mission-os-queue-state ${isDone ? 'done' : isCurrent ? 'current' : ''}`}>
                    {isDone ? 'DONE' : isCurrent ? 'NEXT' : 'WAIT'}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="mission-os-section">
        <div className="jarvis-panel-title">🎯 SYSTEM RECOMMENDATION</div>
        <div className="mission-os-recommendation">
          <div className="mission-os-rec-top">
            <span>{current.subject} // PRIORITY {Math.max(1, Math.round(current.score))}</span>
            <strong>L{current.level}/5</strong>
          </div>
          <div className="mission-os-rec-topic">{current.topic}</div>
          <div className="mission-os-rec-meta">{current.openErrors} open repair{current.openErrors === 1 ? '' : 's'} • {current.level <= 2 ? 'build the base' : 'prove consistency'}</div>
          <div className="mission-os-time-row">
            {[15, 25, 40].map(m => (
              <button key={m} className={minutes === m ? 'selected' : ''} onClick={() => setMinutes(m)}>{m} MIN</button>
            ))}
          </div>
          <button className="mission-os-log" onClick={completeMission}>✓ LOG ADAPTIVE MISSION COMPLETE</button>
        </div>
      </div>

      <div className="mission-os-section">
        <div className="jarvis-panel-title">📡 PRIORITY RADAR</div>
        {loading ? <div className="jarvis-helper">Reading local mastery matrix…</div> : plan.map((p, i) => (
          <div key={p.subject} className="mission-os-radar-row">
            <span className={i === 0 ? 'hot' : ''}>0{i + 1}</span>
            <b>{p.subject}</b>
            <div><strong>{p.topic}</strong><small>Mastery L{p.level}/5</small></div>
            <em>{p.openErrors} ERR</em>
          </div>
        ))}
      </div>

      <div className="mission-os-section">
        <div className="jarvis-panel-title">▦ MISSION HISTORY</div>
        {todayRuns.length === 0 ? (
          <div className="jarvis-helper">No adaptive mission logged today. The queue above is your source of truth.</div>
        ) : todayRuns.slice(0, 6).map(r => (
          <div key={r.id} className="mission-os-history-row">
            <span>{r.subject} • {r.topic}</span>
            <b>+{r.minutes}m</b>
          </div>
        ))}
      </div>

      {toast && <div role="status" className="mission-os-toast">{toast}</div>}
    </div>
  )
}
