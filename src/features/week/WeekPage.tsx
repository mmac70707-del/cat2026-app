import { useWeekTasks } from '@/hooks/useTasks'
import { buildWeekPlan, getWeekLabel, getWeekNumber } from '@/services/domain'
import { usePhase } from '@/hooks/usePhase'
import { DailyScoreRepository } from '@/repositories/index'
import { EmptyState } from '@/components/EmptyState'
import { WEEK_EXIT_GATE } from '@/data/config'
import { useState, useEffect } from 'react'
import type { DailyScore } from '@/types'

export function WeekPage() {
  const phase   = usePhase()
  const weekPlan = buildWeekPlan()
  const { totalDone, total, pct, doneBySubject } = useWeekTasks()
  const [scores, setScores] = useState<DailyScore[]>([])

  useEffect(() => {
    DailyScoreRepository.getLast7().then(setScores)
  }, [])

  const avgAcc   = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b.accuracyPct, 0) / scores.length)
    : null
  const avgStudy = scores.length > 0
    ? (scores.reduce((a, b) => a + b.studyHrs, 0) / scores.length).toFixed(1)
    : null

  return (
    <div className="section-pad">
      {/* Week header */}
      <div className="card" style={{ background: 'linear-gradient(135deg,rgba(26,86,219,.15),rgba(124,58,237,.15))', borderColor: 'rgba(26,86,219,.4)' }}>
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>
          Week {getWeekNumber()} · {getWeekLabel()}
        </div>
        <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700, marginBottom: 4 }}>
          {phase.mission}
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>
          Sequence: QA→DILR→VARC→TEST→ANALYSIS→REVISION→REPAIR→RETEST
        </div>
      </div>

      {/* Real progress */}
      <div className="card">
        <div className="card-title">Week Progress (from real task data)</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Blocks completed</span>
          <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--gold)' }}>
            {totalDone}/{total || '—'}
          </span>
        </div>
        <div className="progress-wrap" style={{ height: 8, marginBottom: 12 }}>
          <div className="progress-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#1A56DB,#3B82F6)' }} />
        </div>
        <div className="grid3">
          {[
            { label: 'QA done',   val: doneBySubject('QA'),   col: '#16A34A' },
            { label: 'DILR done', val: doneBySubject('DILR'), col: '#2563EB' },
            { label: 'VARC done', val: doneBySubject('VARC'), col: '#7C3AED' },
          ].map(s => (
            <div key={s.label} className="card-sm" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.col, fontFamily: 'monospace' }}>{s.val}</div>
              <div style={{ fontSize: 9, color: 'var(--muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly performance from DONE logs */}
      <div className="card">
        <div className="card-title">Weekly Performance (from DONE logs)</div>
        {scores.length === 0 ? (
          <EmptyState icon="📊" title="NO DATA YET" sub="Log your daily DONE score to see weekly performance." />
        ) : (
          <>
            <div className="grid3" style={{ gap: 6, marginBottom: 10 }}>
              <div className="card-sm" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--gold)', fontFamily: 'monospace' }}>{avgAcc}%</div>
                <div style={{ fontSize: 9, color: 'var(--muted)' }}>Avg Accuracy</div>
              </div>
              <div className="card-sm" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--blue3)', fontFamily: 'monospace' }}>{avgStudy}h</div>
                <div style={{ fontSize: 9, color: 'var(--muted)' }}>Avg Study/day</div>
              </div>
              <div className="card-sm" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--green2)', fontFamily: 'monospace' }}>{scores.length}</div>
                <div style={{ fontSize: 9, color: 'var(--muted)' }}>Days logged</div>
              </div>
            </div>
            {scores.map(s => (
              <div key={s.date} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: 11 }}>
                <span style={{ color: 'var(--muted)' }}>{s.date}</span>
                <span style={{ color: s.accuracyPct >= 75 ? '#22C55E' : s.accuracyPct >= 60 ? '#F5A623' : '#EF4444' }}>
                  {s.accuracyPct}% · {s.studyHrs}h study · {s.screenHrs}h screen
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Day-by-day (dynamic dates) */}
      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Day-by-Day Plan</div>
      {weekPlan.map((d, i) => (
        <div
          key={i}
          className={`week-day-card ${d.isToday ? 'today-day' : ''} ${d.isPast ? 'past-day' : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: d.isToday ? '#F5A623' : d.isTest ? '#A78BFA' : 'var(--text)' }}>
              {d.dayName} {d.date}{d.isToday ? ' ← TODAY' : ''}
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, padding: '3px 10px', borderRadius: 10, background: d.fCol + '22', color: d.fCol }}>
              {d.focus}
            </div>
          </div>
          <div className="grid3">
            {[
              { label: 'QA',   val: d.qa,   col: '#16A34A' },
              { label: 'DILR', val: d.dilr, col: '#2563EB' },
              { label: 'VARC', val: d.varc, col: '#7C3AED' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--navy3)', borderRadius: 8, padding: '6px 8px' }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: s.col, marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{s.val}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 6, fontSize: 10, color: 'var(--muted)' }}>🌙 {d.eve}</div>
        </div>
      ))}

      {/* Exit gate */}
      <div style={{ background: 'rgba(245,166,35,.06)', border: '1px solid rgba(245,166,35,.2)', borderRadius: 12, padding: 14, marginTop: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold)', marginBottom: 8 }}>🔒 Weekly Exit Gate</div>
        {WEEK_EXIT_GATE.map((g, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5, fontSize: 12, color: 'var(--muted)' }}>
            <span style={{ color: '#22C55E' }}>✓</span>{g}
          </div>
        ))}
      </div>
    </div>
  )
}
