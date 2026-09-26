import { useEffect, useMemo, useState } from 'react'
import { dbGetAll, dbPut } from '@/db'
import type { MasteryTopic } from '@/types'

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

function dayDiff(a: string, b: string) {
  const aa = new Date(a + 'T00:00:00Z').getTime()
  const bb = new Date(b + 'T00:00:00Z').getTime()
  return Math.round((bb - aa) / 86400000)
}

export function MissionOSPage({ onBack }: { onBack?: () => void }) {
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
    const candidates = subjectOrder.map(subject => {
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

    return candidates
  }, [topics, errors])

  const current = plan[0] ?? { subject: 'QA' as MissionSubject, topic: 'Foundation practice', level: 0, openErrors: 0, score: 0 }

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
    window.dispatchEvent(new Event('jarvis:focus:start'))
    setToast('FOCUS CORE ONLINE • MISSION LOCKED')
    window.setTimeout(() => setToast(''), 2200)
  }

  return (
    <div className="section-pad">
      <div className="page-header">
        {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
        <div className="page-header-title">Mission OS</div>
      </div>

      <div className="jarvis-panel" style={{ marginBottom: 10 }}>
        <div className="jarvis-panel-title">◉ ADAPTIVE MISSION ENGINE</div>
        <div style={{ fontSize: 9, color: 'var(--jarvis-muted)', lineHeight: 1.5 }}>
          Local-first prioritisation from mastery + open repairs. No fake AI score: every priority is derived from your stored study data.
        </div>
      </div>

      <div className="jarvis-stat-grid" style={{ marginBottom: 10 }}>
        <div className="card-sm jarvis-stat-card">
          <div className="jarvis-stat-label">Today</div>
          <div className="jarvis-stat-value" style={{ color: 'var(--jarvis-cyan)' }}>{totalTodayMinutes}m</div>
        </div>
        <div className="card-sm jarvis-stat-card">
          <div className="jarvis-stat-label">Streak</div>
          <div className="jarvis-stat-value" style={{ color: 'var(--jarvis-green)' }}>{streak}d</div>
        </div>
        <div className="card-sm jarvis-stat-card">
          <div className="jarvis-stat-label">Open repairs</div>
          <div className="jarvis-stat-value" style={{ color: 'var(--jarvis-amber)' }}>{errors.filter(e => e.repairStatus !== 'DONE').length}</div>
        </div>
        <div className="card-sm jarvis-stat-card">
          <div className="jarvis-stat-label">Mastery topics</div>
          <div className="jarvis-stat-value" style={{ color: 'var(--jarvis-cyan)' }}>{topics.length}</div>
        </div>
      </div>

      <div className="jarvis-panel" style={{ marginBottom: 10, borderColor: 'rgba(57,255,136,.28)' }}>
        <div className="jarvis-panel-title">🎯 NEXT MISSION</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
          <div>
            <div style={{ color: 'var(--jarvis-green)', font: '900 9px ui-monospace', letterSpacing: 1 }}>{current.subject} // PRIORITY {Math.max(1, Math.round(current.score))}</div>
            <div style={{ color: 'var(--jarvis-text)', fontSize: 18, fontWeight: 900, marginTop: 5 }}>{current.topic}</div>
            <div style={{ color: 'var(--jarvis-muted)', fontSize: 9, marginTop: 5 }}>
              Mastery L{current.level}/5 • {current.openErrors} open repair{current.openErrors === 1 ? '' : 's'}
            </div>
          </div>
          <div style={{ color: 'var(--jarvis-cyan)', font: '900 24px ui-monospace' }}>{minutes}m</div>
        </div>

        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
          {[15, 25, 40].map(m => (
            <button key={m} className="jarvis-action" style={{ aspectRatio: 'auto', minHeight: 38 }} onClick={() => setMinutes(m)}>
              {m} MIN
            </button>
          ))}
        </div>

        <div className="jarvis-native-actions">
          <button className="jarvis-action" onClick={startFocus}>▶ START FOCUS</button>
          <button className="jarvis-action" onClick={completeMission}>✓ LOG COMPLETE</button>
        </div>
      </div>

      <div className="jarvis-panel">
        <div className="jarvis-panel-title">📡 PRIORITY RADAR</div>
        {loading ? <div className="jarvis-helper">Reading local mastery matrix…</div> : plan.map((p, i) => (
          <div key={p.subject} style={{ display: 'grid', gridTemplateColumns: '24px 52px minmax(0,1fr) 42px', gap: 7, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(0,245,255,.08)' }}>
            <span style={{ color: i === 0 ? 'var(--jarvis-green)' : 'var(--jarvis-muted)', font: '900 10px ui-monospace' }}>0{i + 1}</span>
            <span style={{ color: 'var(--jarvis-cyan)', font: '800 8px ui-monospace' }}>{p.subject}</span>
            <span style={{ color: 'var(--jarvis-text)', fontSize: 9 }}>{p.topic}</span>
            <span style={{ color: p.openErrors ? 'var(--jarvis-amber)' : 'var(--jarvis-muted)', font: '800 8px ui-monospace', textAlign: 'right' }}>{p.openErrors} ERR</span>
          </div>
        ))}
      </div>

      <div className="jarvis-panel" style={{ marginTop: 10 }}>
        <div className="jarvis-panel-title">▣ MISSION HISTORY</div>
        {todayRuns.length === 0 ? (
          <div className="jarvis-helper">No mission logged today. Execute one focused block and log it.</div>
        ) : todayRuns.slice(0, 6).map(r => (
          <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '7px 0', borderBottom: '1px solid rgba(0,245,255,.07)', fontSize: 9 }}>
            <span>{r.subject} • {r.topic}</span>
            <span style={{ color: 'var(--jarvis-green)', fontFamily: 'ui-monospace' }}>+{r.minutes}m</span>
          </div>
        ))}
      </div>

      {toast && <div role="status" style={{ position: 'fixed', left: '50%', bottom: 86, transform: 'translateX(-50%)', zIndex: 2000, padding: '10px 14px', border: '1px solid rgba(0,245,255,.4)', borderRadius: 10, background: '#02090B', color: 'var(--jarvis-cyan)', font: '900 9px ui-monospace', whiteSpace: 'nowrap' }}>{toast}</div>}
    </div>
  )
}
