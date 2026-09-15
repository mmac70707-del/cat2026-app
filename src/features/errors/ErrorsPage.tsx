import { useState } from 'react'
import { useErrors } from '@/hooks/index'
import { EmptyState } from '@/components/EmptyState'
import { useToast } from '@/components/Toast'
import { MASTER_TOPICS } from '@/data/config'
import type { ErrorType } from '@/types'

const ERROR_DEFS = [
  { code: 'C1' as ErrorType, name: 'Concept Gap',    desc: 'Did not know / weak concept — most dangerous.',        bg: 'e1', col: '#F87171' },
  { code: 'C2' as ErrorType, name: 'Calculation',    desc: 'Formula or arithmetic mistake.',                       bg: 'e2', col: '#FCD34D' },
  { code: 'C3' as ErrorType, name: 'Misread Data',   desc: 'Wrong data / condition read from question.',            bg: 'e3', col: '#93C5FD' },
  { code: 'C4' as ErrorType, name: 'Wrong Approach', desc: 'Chose wrong method or option.',                       bg: 'e4', col: '#A78BFA' },
  { code: 'C5' as ErrorType, name: 'Time Mgmt',      desc: 'Too slow or too rushed.',                              bg: 'e5', col: '#F9A8D4' },
]

interface Props { onBack: () => void }

export function ErrorsPage({ onBack }: Props) {
  const { errors, counts, logError } = useErrors()
  const { show: toast } = useToast()

  const [type,    setType]    = useState<ErrorType>('C1')
  const [subject, setSubject] = useState<'QA' | 'DILR' | 'VARC'>('QA')
  const [topicId, setTopicId] = useState('')
  const [wrong,   setWrong]   = useState('')
  const [correct, setCorrect] = useState('')
  const [prev,    setPrev]    = useState('')

  const topicList = MASTER_TOPICS[subject] || []

  async function handleLog() {
    if (!topicId)         { toast('Select a topic', '#D97706');          return }
    if (!wrong.trim())    { toast('Describe what went wrong', '#D97706'); return }
    if (!correct.trim())  { toast('Write the correct method', '#D97706'); return }
    const topicName = topicList.find(t => t.id === topicId)?.name ?? topicId
    await logError({ errorType: type, subject, topicId, topic: topicName, wrongReason: wrong.trim(), correctMethod: correct.trim(), preventionRule: prev.trim() })
    setTopicId(''); setWrong(''); setCorrect(''); setPrev('')
    toast('Error logged + Repair task created ✓')
  }

  const recent = errors.slice(0, 10)

  return (
    <div className="section-pad">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="page-header-title">Error Log — C1 to C5</div>
      </div>

      {/* Count summary grid */}
      <div className="grid3" style={{ gap: 6, marginBottom: 12 }}>
        {ERROR_DEFS.map(e => (
          <div key={e.code} className={`card-sm ${e.bg}`} style={{ textAlign: 'center', padding: 10 }}>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'monospace', color: e.col }}>{e.code}</div>
            <div style={{ fontSize: 11, fontWeight: 700 }}>{e.name}</div>
            <div style={{ fontSize: 24, fontWeight: 900, fontFamily: 'monospace', color: e.col }}>{counts[e.code] || 0}</div>
          </div>
        ))}
      </div>

      {/* Log form */}
      <div className="card" style={{ borderColor: 'rgba(245,166,35,.3)' }}>
        <div className="card-title">Log a Specific Error</div>
        <select className="form-select" value={type} onChange={e => setType(e.target.value as ErrorType)} style={{ marginBottom: 8 }}>
          {ERROR_DEFS.map(e => <option key={e.code} value={e.code}>{e.code} — {e.name}</option>)}
        </select>
        <div className="grid2" style={{ gap: 8, marginBottom: 8 }}>
          <select
            className="form-select"
            value={subject}
            onChange={e => { setSubject(e.target.value as 'QA' | 'DILR' | 'VARC'); setTopicId('') }}
          >
            <option value="QA">QA</option><option value="DILR">DILR</option><option value="VARC">VARC</option>
          </select>
          <select className="form-select" value={topicId} onChange={e => setTopicId(e.target.value)}>
            <option value="">Select topic…</option>
            {topicList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <textarea className="textarea-input" placeholder="What went wrong?" value={wrong} onChange={e => setWrong(e.target.value)} style={{ marginBottom: 6 }} />
        <textarea className="textarea-input" placeholder="Correct method is…" value={correct} onChange={e => setCorrect(e.target.value)} style={{ marginBottom: 6 }} />
        <input type="text" className="form-input" placeholder="Prevention rule: Next time I will…" value={prev} onChange={e => setPrev(e.target.value)} style={{ marginBottom: 10 }} />
        <button className="btn-primary" onClick={handleLog}>📝 Log Error + Create Repair Task</button>
      </div>

      {/* Recent errors */}
      <div className="card">
        <div className="card-title">Recent Errors ({errors.length} total)</div>
        {recent.length === 0 ? (
          <EmptyState icon="✅" title="NO ERRORS YET" sub="No errors logged. Log errors as you study to build your repair queue." />
        ) : (
          recent.map(e => (
            <div key={e.id} style={{ background: 'var(--navy3)', borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8, background: 'rgba(220,38,38,.2)', color: '#F87171' }}>{e.errorType}</span>
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>{e.subject} · {e.topic}</span>
                <span style={{ fontSize: 9, color: 'var(--muted2)' }}>{e.createdAt.slice(0, 10)}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>❌ {e.wrongReason}</div>
              <div style={{ fontSize: 11, color: '#22C55E', marginBottom: 6 }}>✓ {e.correctMethod}</div>
              {e.preventionRule && <div style={{ fontSize: 10, color: 'var(--gold)', marginBottom: 6 }}>Rule: {e.preventionRule}</div>}
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 8, background: e.repairStatus === 'DONE' ? 'rgba(22,163,74,.2)' : 'rgba(219,39,119,.2)', color: e.repairStatus === 'DONE' ? '#22C55E' : '#DB2777' }}>Repair: {e.repairStatus}</span>
                <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 8, background: e.retestStatus === 'PASSED' ? 'rgba(22,163,74,.2)' : 'rgba(14,159,159,.2)', color: e.retestStatus === 'PASSED' ? '#22C55E' : '#0E9F9F' }}>Retest: {e.retestStatus}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
