import { useEffect, useMemo, useState } from 'react'
import { AppIcon } from '@/components/AppIcon'
import type { DailyScore, ErrorRecord, MasteryTopic } from '@/types'
import { DailyScoreRepository } from '@/repositories'
import { ErrorRepository } from '@/repositories/ErrorRepository'
import { MasteryRepository } from '@/repositories/MasteryRepository'
import { QuestionEvidenceRepository } from '@/repositories'

interface Props { onNavigate?: (page: string) => void }
const SUBJECTS = ['QA', 'DILR', 'VARC'] as const

export function LearningIntelligenceCard({ onNavigate }: Props) {
  const [scores, setScores] = useState<DailyScore[]>([])
  const [errors, setErrors] = useState<ErrorRecord[]>([])
  const [topics, setTopics] = useState<MasteryTopic[]>([])
  const [evidence, setEvidence] = useState<import('@/types').QuestionEvidence[]>([])
  useEffect(() => {
    let mounted = true
    Promise.all([DailyScoreRepository.getLast7(), ErrorRepository.getAll(), MasteryRepository.getAll(), QuestionEvidenceRepository.getRecent(100)]).then(([s, e, t, q]) => {
      if (!mounted) return
      setScores(s); setErrors(e); setTopics(t); setEvidence(q)
    })
    return () => { mounted = false }
  }, [])
  const velocity = useMemo(() => {
    if (scores.length < 2) return null
    const baseline = scores.slice(1).reduce((sum, s) => sum + s.accuracyPct, 0) / (scores.length - 1)
    return Math.round(scores[0].accuracyPct - baseline)
  }, [scores])
  const mastery = useMemo(() => {
    const ready = topics.filter(t => t.currentLevel >= 3).length
    const active = topics.filter(t => t.attempts > 0).length
    return { ready, active, total: topics.length, pct: topics.length ? Math.round((ready / topics.length) * 100) : 0 }
  }, [topics])
  const pendingErrors = errors.filter(e => e.repairStatus === 'PENDING')
  const leaks = useMemo(() => {
    const counts = new Map<string, number>()
    pendingErrors.forEach(e => { const key = e.topic || e.subject; counts.set(key, (counts.get(key) || 0) + 1) })
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
  }, [errors])
  const calibration = useMemo(() => { const answered = evidence.length; const over = evidence.filter(q => !q.correct && q.confidence >= 75).length; const under = evidence.filter(q => q.correct && q.confidence <= 50).length; return { answered, over, under } }, [evidence])
  const subjectStats = SUBJECTS.map(subject => {
    const rows = topics.filter(t => t.subject === subject)
    return { subject, mastered: rows.filter(t => t.currentLevel >= 3).length, total: rows.length }
  })
  return <section className='learning-intelligence' aria-label='Learning intelligence'>
    <div className='learning-intelligence-head'><div><div className='learning-intelligence-kicker'>LEARNING INTELLIGENCE</div><div className='learning-intelligence-title'>MASTERY · VELOCITY · LEAKS</div></div><div className='learning-intelligence-note'>EVIDENCE OVER HOURS</div></div>
    <div className='learning-intelligence-metrics'>
      <div className='learning-intel-metric'><span>VELOCITY</span><strong>{velocity === null ? '—' : (velocity > 0 ? '+' : '') + velocity + ' pts'}</strong><small>7-day accuracy delta</small></div>
      <div className='learning-intel-metric'><span>MASTERY</span><strong>{mastery.pct}%</strong><small>{mastery.ready}/{mastery.total || '—'} topics level 3+</small></div>
      <div className='learning-intel-metric'><span>ACTIVE</span><strong>{mastery.active}</strong><small>topics with practice evidence</small></div>
      <div className='learning-intel-metric'><span>REPAIR QUEUE</span><strong>{pendingErrors.length}</strong><small>unresolved errors</small></div>
    </div>
    <div className='learning-intelligence-body'>
      <div className='learning-mastery-map'><div className='learning-panel-label'>MASTERY MAP</div>{subjectStats.map(s => <button key={s.subject} className='learning-subject-row' onClick={() => onNavigate?.('mastery')}><span className='learning-subject-name'>{s.subject}</span><span className='learning-subject-track'><i style={{ width: (s.total ? Math.round((s.mastered / s.total) * 100) : 0) + '%' }} /></span><b>{s.mastered}/{s.total || '—'}</b></button>)}</div>
      <div className='learning-leaks'><div className='learning-panel-label'>TOP LEAKS</div>{leaks.length ? leaks.map(([topic, count]) => <button key={topic} className='learning-leak-row' onClick={() => onNavigate?.('errors')}><span><AppIcon name='errors' size={14} />{topic}</span><b>{count}</b></button>) : <div className='learning-empty'>No pending leak pattern. Keep building evidence.</div>}</div>
    </div>
    <div className='learning-intelligence-footer'><span><AppIcon name='shield' size={14} /> Mastery is earned by repeated evidence, not time spent.</span><button onClick={() => onNavigate?.('mastery')}>OPEN MASTERY <AppIcon name='arrowRight' size={14} /></button></div>
  </section>
}