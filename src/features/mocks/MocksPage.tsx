import { useState, useEffect } from 'react'
import { MockRepository } from '@/repositories/index'
import { analyseMock } from '@/services/domain'
import { EmptyState } from '@/components/EmptyState'
import { useToast } from '@/components/Toast'
import type { MockRecord } from '@/types'

interface Props { onBack: () => void }

export function MocksPage({ onBack }: Props) {
  const [mocks,    setMocks]    = useState<MockRecord[]>([])
  const [name,     setName]     = useState('')
  const [qa,       setQa]       = useState('')
  const [dilr,     setDilr]     = useState('')
  const [varc,     setVarc]     = useState('')
  const [qaat,     setQaat]     = useState('')
  const [dlat,     setDlat]     = useState('')
  const [vcat,     setVcat]     = useState('')
  const [feedback, setFeedback] = useState('')
  const { show: toast } = useToast()

  const load = async () => setMocks((await MockRepository.getAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
  useEffect(() => { load() }, [])

  async function handleLog() {
    const analysis = analyseMock({ qa, dilr, varc, qaat, dlat, vcat })
    const mockName = name.trim() || `Mock ${mocks.length + 1}`
    await MockRepository.log({ name: mockName, date: new Date().toISOString().slice(0, 10), ...analysis })

    const lines = [
      `Total: ${analysis.total} | Attempts: ${analysis.att} | Accuracy: ${analysis.overall}%`,
      `QA: ${analysis.qaAcc}% · DILR: ${analysis.dlAcc}% · VARC: ${analysis.vcAcc}%`,
      analysis.weak.length ? '\n⚠️ Repair Priorities:\n• ' + analysis.weak.join('\n• ') : '\n✓ Strong performance!',
    ]
    setFeedback(lines.join('\n'))
    setName(''); setQa(''); setDilr(''); setVarc(''); setQaat(''); setDlat(''); setVcat('')
    toast('Mock logged + analysed ✓')
    await load()
  }

  return (
    <div className="section-pad">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="page-header-title">Mock Analysis</div>
      </div>

      <div className="card" style={{ background: 'rgba(217,119,6,.08)', borderColor: 'rgba(217,119,6,.3)' }}>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>
          NO mock is DONE until ANALYSED.{' '}
          <strong style={{ color: 'var(--text)' }}>Minimum 2 hours analysis per mock.</strong>
        </div>
      </div>

      <div className="card" style={{ borderColor: 'rgba(245,166,35,.3)' }}>
        <div className="card-title">Log New Mock</div>
        <input
          type="text" className="form-input"
          placeholder="Mock name (e.g. SimCAT 1)"
          value={name} onChange={e => setName(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <div className="grid3" style={{ gap: 6, marginBottom: 6 }}>
          {[['QA Score', qa, setQa], ['DILR Score', dilr, setDilr], ['VARC Score', varc, setVarc]].map(([label, val, setter]) => (
            <div key={label as string}>
              <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 3 }}>{label as string}</div>
              <input type="number" className="form-input" placeholder="0" min={0}
                value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} />
            </div>
          ))}
        </div>
        <div className="grid3" style={{ gap: 6, marginBottom: 10 }}>
          {[['QA Attempts', qaat, setQaat], ['DILR Attempts', dlat, setDlat], ['VARC Attempts', vcat, setVcat]].map(([label, val, setter]) => (
            <div key={label as string}>
              <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 3 }}>{label as string}</div>
              <input type="number" className="form-input" placeholder="0" min={0}
                value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} />
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={handleLog}>📊 Log + Analyse Mock</button>
        {feedback && <div className="feedback-box">{feedback}</div>}
      </div>

      <div className="card">
        <div className="card-title">Mock History ({mocks.length})</div>
        {mocks.length === 0 ? (
          <EmptyState icon="📝" title="NO MOCKS YET" sub="Log your first mock using the form above." />
        ) : (
          mocks.map((m, i) => (
            <div key={m.id} style={{ background: 'var(--navy3)', borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{m.name || `Mock ${mocks.length - i}`}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{m.date}</div>
              </div>
              <div className="mock-score-grid">
                <div className="mock-score-box"><div className="mock-score-val" style={{ color: '#F5A623' }}>{m.total}</div><div className="mock-score-lbl">Score</div></div>
                <div className="mock-score-box"><div className="mock-score-val" style={{ color: '#22C55E' }}>{m.overall}%</div><div className="mock-score-lbl">Accuracy</div></div>
                <div className="mock-score-box"><div className="mock-score-val" style={{ color: '#3B82F6' }}>{m.att}</div><div className="mock-score-lbl">Attempts</div></div>
              </div>
              <div className="grid3" style={{ gap: 4, marginTop: 6 }}>
                {[['QA', m.qaAcc, '#16A34A'], ['DILR', m.dlAcc, '#2563EB'], ['VARC', m.vcAcc, '#7C3AED']].map(([label, acc, col]) => (
                  <div key={label as string} style={{ textAlign: 'center', fontSize: 10 }}>
                    <div style={{ color: col as string, fontWeight: 700 }}>{acc}%</div>
                    <div style={{ color: 'var(--muted)' }}>{label as string}</div>
                  </div>
                ))}
              </div>
              {m.weak && m.weak.length > 0 && (
                <div style={{ marginTop: 6, fontSize: 10, color: '#EF4444' }}>⚠️ {m.weak[0]}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
