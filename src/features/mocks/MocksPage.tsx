import { useState, useEffect } from 'react'
import { MockRepository } from '@/repositories/index'
import { analyseMock, localDateKey, validateMockSectionScore } from '@/services/domain'
import { EmptyState } from '@/components/EmptyState'
import { useToast } from '@/components/Toast'
import type { MockRecord } from '@/types'

interface Props { onBack: () => void }

export function MocksPage({ onBack }: { onBack: () => void }) {
  const [mocks,    setMocks]    = useState<MockRecord[]>([])
  const [name,     setName]     = useState('')
  const [qa,       setQa]       = useState('')
  const [dilr,     setDilr]     = useState('')
  const [varc,     setVarc]     = useState('')
  const [qaat,     setQaat]     = useState('')
  const [dlat,     setDlat]     = useState('')
  const [vcat,     setVcat]     = useState('')
  const [qaCorrect, setQaCorrect] = useState('')
  const [qaWrong, setQaWrong] = useState('')
  const [dilrCorrect, setDilrCorrect] = useState('')
  const [dilrWrong, setDilrWrong] = useState('')
  const [varcCorrect, setVarcCorrect] = useState('')
  const [varcWrong, setVarcWrong] = useState('')
  const [feedback, setFeedback] = useState('')
  const { show: toast } = useToast()

  const load = async () => setMocks((await MockRepository.getAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
  useEffect(() => { load() }, [])

  async function handleLog() {
    const scoreValues = [qa, dilr, varc]
    const countValues = [qaat, dlat, vcat, qaCorrect, qaWrong, dilrCorrect, dilrWrong, varcCorrect, varcWrong]
    if (scoreValues.some(value => value.trim() === '' || !Number.isInteger(Number(value)))) {
      setFeedback('Enter a whole-number section score. A negative score is allowed by the MCQ marking scheme.')
      return
    }
    if (countValues.some(value => value.trim() === '' || !Number.isInteger(Number(value)) || Number(value) < 0)) {
      setFeedback('Enter non-negative whole numbers for attempts, correct and wrong counts.')
      return
    }
    const sectionCounts = [
      { name: 'QA', attempts: Number(qaat), correct: Number(qaCorrect), wrong: Number(qaWrong), maxQuestions: 22 },
      { name: 'DILR', attempts: Number(dlat), correct: Number(dilrCorrect), wrong: Number(dilrWrong), maxQuestions: 22 },
      { name: 'VARC', attempts: Number(vcat), correct: Number(varcCorrect), wrong: Number(varcWrong), maxQuestions: 24 },
    ]
    const inconsistent = sectionCounts.find(section =>
      section.correct + section.wrong !== section.attempts ||
      section.correct > section.attempts || section.wrong > section.attempts ||
      section.attempts > section.maxQuestions
    )
    if (inconsistent) {
      setFeedback(`${inconsistent.name}: correct + wrong must equal attempts, and attempts cannot exceed ${inconsistent.maxQuestions} questions.`)
      return
    }
    const scoreError = [
      validateMockSectionScore('QA', Number(qa), Number(qaCorrect), Number(qaWrong)),
      validateMockSectionScore('DILR', Number(dilr), Number(dilrCorrect), Number(dilrWrong)),
      validateMockSectionScore('VARC', Number(varc), Number(varcCorrect), Number(varcWrong)),
    ].find(Boolean)
    if (scoreError) {
      setFeedback(scoreError)
      return
    }
    const analysis = analyseMock({ qa, dilr, varc, qaat, dlat, vcat, qaCorrect, qaWrong, dilrCorrect, dilrWrong, varcCorrect, varcWrong })
    const mockName = name.trim() || `Mock ${mocks.length + 1}`
    await MockRepository.log({ name: mockName, date: localDateKey(), ...analysis })

    const lines = [
      `Total raw score: ${analysis.total} | Accuracy: ${analysis.overall}%`,
      `QA: ${analysis.qaAcc}% · DILR: ${analysis.dlAcc}% · VARC: ${analysis.vcAcc}%`,
      analysis.weak.length ? '\n⚠️ Repair Priorities:\n• ' + analysis.weak.join('\n• ') : '\n✓ Strong performance!',
    ]
    setFeedback(lines.join('\n'))
    setName(''); setQa(''); setDilr(''); setVarc(''); setQaat(''); setDlat(''); setVcat(''); setQaCorrect(''); setQaWrong(''); setDilrCorrect(''); setDilrWrong(''); setVarcCorrect(''); setVarcWrong('')
    toast(`Mock logged! Raw score: ${analysis.total} ✓`)
    await load()
  }

  return (
    <div className="section-pad">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="page-header-title">Mock Analysis &amp; Raw Score Tracker</div>
      </div>

      <div className="card" style={{ background: 'rgba(217,119,6,.08)', borderColor: 'rgba(217,119,6,.3)' }}>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>
          NO mock is DONE until ANALYSED.{' '}
          <strong style={{ color: 'var(--text)' }}>Analysis takes at least as long as the mock. Log attempts, correct, wrong and score for each section.</strong>
        </div>
      </div>

      {/* RAW SCORE INTEGRITY — no unsupported percentile prediction */}
      <div className="card" style={{ background: 'rgba(37,99,235,.07)', border: '1px solid rgba(59,130,246,.25)' }}>
        <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--text)', marginBottom: 7 }}>
          RAW SCORE ONLY — NO UNSUPPORTED PERCENTILE GUESS
        </div>
        <p style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
          Record the actual section marks and question outcomes. CAT percentile depends on the exam slot and official scaling; this tracker will not invent a percentile from a fixed score band.
        </p>
      </div>

      {/* MOCK LOG FORM */}
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
              <input type="number" step={1} className="form-input" placeholder="0"
                value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} />
            </div>
          ))}
        </div>
        <div className="grid3" style={{ gap: 6, marginBottom: 10 }}>
          {[[ 'QA Wrong', qaWrong, setQaWrong ], [ 'DILR Wrong', dilrWrong, setDilrWrong ], [ 'VARC Wrong', varcWrong, setVarcWrong ]].map(([label, val, setter]) => (
            <div key={label as string}>
              <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 3 }}>{label as string}</div>
              <input type="number" className="form-input" placeholder="0" min={0} value={val as string}
                onChange={e => (setter as (v: string) => void)(e.target.value)} />
            </div>
          ))}
        </div>
        <div className="grid3" style={{ gap: 6, marginBottom: 10 }}>
          {[['QA Attempts', qaat, setQaat], ['DILR Q Attempts', dlat, setDlat], ['VARC Attempts', vcat, setVcat]].map(([label, val, setter]) => (
            <div key={label as string}>
              <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 3 }}>{label as string}</div>
              <input type="number" className="form-input" placeholder="0" min={0}
                value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} />
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: 'var(--muted)', margin: '0 0 6px' }}>Each section: correct + wrong must equal attempted questions.</div>
        <div className="grid3" style={{ gap: 6, marginBottom: 6 }}>
          {[[ 'QA Correct', qaCorrect, setQaCorrect ], [ 'DILR Correct', dilrCorrect, setDilrCorrect ], [ 'VARC Correct', varcCorrect, setVarcCorrect ]].map(([label, val, setter]) => (
            <div key={label as string}>
              <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 3 }}>{label as string}</div>
              <input type="number" className="form-input" placeholder="0" min={0} value={val as string}
                onChange={e => (setter as (v: string) => void)(e.target.value)} />
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={handleLog}>📊 Log + Analyse Mock</button>
        {feedback && <div className="feedback-box" style={{ whiteSpace: 'pre-line' }}>{feedback}</div>}
      </div>

      {/* MOCK HISTORY */}
      <div className="card">
        <div className="card-title">Mock History ({mocks.length})</div>
        {mocks.length === 0 ? (
          <EmptyState icon="📝" title="NO MOCKS YET" sub="Log your first mock using the form above." />
        ) : (
          mocks.map((m, i) => {
            return (
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
                <div style={{ marginTop: 8, fontSize: 10, color: 'var(--muted)', lineHeight: 1.6 }}>
                  <div>VARC: {m.vcat} attempted · {m.varcCorrect ?? '—'} correct · {m.varcWrong ?? '—'} wrong · {m.varc} score</div>
                  <div>DILR: {m.dlat} attempted · {m.dilrCorrect ?? '—'} correct · {m.dilrWrong ?? '—'} wrong · {m.dilr} score</div>
                  <div>QA: {m.qaat} attempted · {m.qaCorrect ?? '—'} correct · {m.qaWrong ?? '—'} wrong · {m.qa} score</div>
                </div>
                {m.weak && m.weak.length > 0 && (
                  <div style={{ marginTop: 6, fontSize: 10, color: '#EF4444' }}>⚠️ {m.weak[0]}</div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
