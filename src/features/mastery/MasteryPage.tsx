import { useState, useEffect } from 'react'
import { MasteryRepository } from '@/repositories/MasteryRepository'
import { MasteryBar } from '@/components/MasteryBar'
import { EmptyState } from '@/components/EmptyState'
import { MASTER_TOPICS } from '@/data/config'
import { useToast } from '@/components/Toast'
import type { MasteryTopic, MasteryLevel } from '@/types'

const LOOP_STEPS = ['CONCEPT','BASIC','INTERMEDIATE','CAT/PYQ','TIMED','MIXED','TEST','ANALYSIS','REPAIR','RETEST','RECALL','MASTERY 🏆']
const CURRENT_STEP = 2

export function MasteryPage() {
  const [topics,  setTopics]  = useState<MasteryTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [subject, setSubject] = useState('')
  const [topicId, setTopicId] = useState('')
  const [level,   setLevel]   = useState<MasteryLevel>(0)
  const [evidence,setEvidence]= useState('')
  const { show: toast } = useToast()

  const load = async () => {
    await MasteryRepository.init()
    setTopics(await MasteryRepository.getAll())
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const withData  = topics.filter(t => t.attempts > 0).length
  const l5count   = topics.filter(t => t.currentLevel === 5).length
  const l4count   = topics.filter(t => t.currentLevel === 4).length
  const l0count   = topics.filter(t => t.currentLevel === 0).length
  const subjTopics= subject ? topics.filter(t => t.subject === subject) : []
  const topicList = subject ? (MASTER_TOPICS[subject as 'QA'|'DILR'|'VARC'] || []) : []

  async function handleUpdate() {
    if (!topicId) { toast('Select a topic', '#D97706'); return }
    if (!evidence.trim()) { toast('Evidence required — be honest', '#D97706'); return }
    await MasteryRepository.updateLevel(topicId, level, evidence.trim())
    toast('Mastery updated ✓')
    setEvidence('')
    await load()
  }

  if (loading) return <div className="section-pad"><div style={{ color: 'var(--muted)', fontSize: 13 }}>Loading…</div></div>

  return (
    <div className="section-pad">
      {/* Scale */}
      <div className="card">
        <div className="card-title">Mastery Scale</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {['L0 Don\'t Know','L1 Understand','L2 Guided','L3 Independent','L4 Under Time','L5 CAT Mastery'].map((l, i) => (
            <span key={i} className={`lv-badge lv${i}`}>{l}</span>
          ))}
        </div>
        <div style={{ fontSize: 10, color: 'var(--muted)' }}>
          Levels advance based on <strong style={{ color: 'var(--text)' }}>your actual evidence</strong>. No auto-advancement without proof.
        </div>
      </div>

      {/* Summary */}
      <div className="card">
        <div className="card-title">Overall Summary</div>
        {withData === 0 ? (
          <EmptyState icon="📈" title="NO DATA YET" sub="Practice topics and log DONE daily to build your mastery profile." />
        ) : (
          <div className="grid3" style={{ gap: 6 }}>
            <div className="card-sm" style={{ textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 800, color: '#F5A623' }}>{l5count}</div><div style={{ fontSize: 9, color: 'var(--muted)' }}>L5 Mastered</div></div>
            <div className="card-sm" style={{ textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 800, color: '#6EE7B7' }}>{l4count}</div><div style={{ fontSize: 9, color: 'var(--muted)' }}>L4 Under Time</div></div>
            <div className="card-sm" style={{ textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 800, color: '#F87171' }}>{l0count}</div><div style={{ fontSize: 9, color: 'var(--muted)' }}>L0 Not Started</div></div>
          </div>
        )}
      </div>

      {/* Per-subject mastery */}
      {(['QA','DILR','VARC'] as const).map(subj => {
        const subTopics = topics.filter(t => t.subject === subj)
        const colors: Record<string, string> = { QA: '#22C55E', DILR: '#60A5FA', VARC: '#A78BFA' }
        const pills: Record<string, string>  = { QA: 'pill-green', DILR: 'pill-blue', VARC: 'pill-purple' }
        return (
          <div key={subj} className="card">
            <div className="card-title">
              <span style={{ color: colors[subj] }}>{subj}</span>
              <span className={`pill ${pills[subj]}`}>{subj === 'QA' ? 'Tier 1 Priority' : subj === 'DILR' ? 'Set Selection = Key' : 'RC 70% + VA 30%'}</span>
            </div>
            {subTopics.length > 0
              ? subTopics.map(t => <MasteryBar key={t.id} topic={t} />)
              : <EmptyState icon="📊" title="NO DATA" sub="—" />
            }
          </div>
        )
      })}

      {/* Update form */}
      <div className="card" style={{ borderColor: 'rgba(245,166,35,.3)' }}>
        <div className="card-title">Update Topic Mastery (Evidence Required)</div>
        <select className="form-select" value={subject} onChange={e => { setSubject(e.target.value); setTopicId('') }} style={{ marginBottom: 8 }}>
          <option value="">Select subject…</option>
          <option value="QA">QA</option>
          <option value="DILR">DILR</option>
          <option value="VARC">VARC</option>
        </select>
        <select className="form-select" value={topicId} onChange={e => setTopicId(e.target.value)} style={{ marginBottom: 8 }}>
          <option value="">Select topic…</option>
          {topicList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select className="form-select" value={level} onChange={e => setLevel(parseInt(e.target.value) as MasteryLevel)} style={{ marginBottom: 8 }}>
          {['L0 — Don\'t Know','L1 — Understand','L2 — Guided Solving','L3 — Independent','L4 — Accurate Under Time','L5 — CAT Mastery'].map((l, i) => (
            <option key={i} value={i}>{l}</option>
          ))}
        </select>
        <input
          type="text"
          className="form-input"
          placeholder="Evidence: e.g. Solved 20 Qs at 80% accuracy in 45 min"
          value={evidence}
          onChange={e => setEvidence(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <button className="btn-primary" onClick={handleUpdate}>Update Mastery Level</button>
      </div>

      {/* Master loop */}
      <div className="card">
        <div className="card-title">♾️ Master Learning Loop</div>
        <div style={{ lineHeight: 2.2 }}>
          {LOOP_STEPS.map((s, i) => {
            const cls = i < CURRENT_STEP ? 'loop-done' : i === CURRENT_STEP ? 'loop-active' : i === LOOP_STEPS.length - 1 ? 'loop-master' : 'loop-next'
            return (
              <span key={i}>
                <span className={`loop-pill ${cls}`}>{s}</span>
                {i < LOOP_STEPS.length - 1 && <span style={{ color: 'var(--muted2)', margin: '0 1px' }}>→</span>}
              </span>
            )
          })}
        </div>
        <div style={{ marginTop: 8, fontSize: 10, color: 'var(--red2)', fontWeight: 700 }}>
          Lecture watched ≠ Mastery · Chapter done ≠ Mastery · Question count ≠ Mastery
        </div>
      </div>
    </div>
  )
}
