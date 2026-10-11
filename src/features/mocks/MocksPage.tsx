import { useState, useEffect } from 'react'
import { MockRepository } from '@/repositories/index'
import { analyseMock, localDateKey } from '@/services/domain'
import { EmptyState } from '@/components/EmptyState'
import { useToast } from '@/components/Toast'
import type { MockRecord } from '@/types'

interface Props { onBack: () => void }

function estimateCatPercentile(totalScore: number): { percentile: string; tier: string } {
  if (totalScore >= 105) return { percentile: '99.9+ %ile', tier: 'Very high score band; percentile varies with scaling 🎯' }
  if (totalScore >= 85)  return { percentile: '99.5+ %ile', tier: 'High score band; treat the estimate cautiously 🚀' }
  if (totalScore >= 75)  return { percentile: '99.0+ %ile', tier: 'Strong raw-score band; not an admission prediction 🏆' }
  if (totalScore >= 60)  return { percentile: '95.0+ %ile', tier: 'Score band only; calls depend on many other factors 📈' }
  if (totalScore >= 48)  return { percentile: '90.0+ %ile', tier: 'Score band only; use for rough trend tracking ⚡' }
  if (totalScore >= 36)  return { percentile: '80.0+ %ile', tier: 'Focus on section accuracy and repair priorities 🔧' }
  return { percentile: '< 80.0 %ile', tier: 'Rebuild concepts; review errors before adding volume 📚' }
}

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
  const [testScoreInput, setTestScoreInput] = useState('75')
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
      { name: 'QA', attempts: Number(qaat), correct: Number(qaCorrect), wrong: Number(qaWrong) },
      { name: 'DILR', attempts: Number(dlat), correct: Number(dilrCorrect), wrong: Number(dilrWrong) },
      { name: 'VARC', attempts: Number(vcat), correct: Number(varcCorrect), wrong: Number(varcWrong) },
    ]
    const inconsistent = sectionCounts.find(section =>
      section.correct + section.wrong !== section.attempts ||
      section.correct > section.attempts || section.wrong > section.attempts
    )
    if (inconsistent) {
      setFeedback(`${inconsistent.name}: correct + wrong must equal attempts. Check this section before saving.`)
      return
    }
    const analysis = analyseMock({ qa, dilr, varc, qaat, dlat, vcat, qaCorrect, qaWrong, dilrCorrect, dilrWrong, varcCorrect, varcWrong })
    const mockName = name.trim() || `Mock ${mocks.length + 1}`
    await MockRepository.log({ name: mockName, date: localDateKey(), ...analysis })

    const est = estimateCatPercentile(analysis.total)
    const lines = [
      `Total: ${analysis.total} | Accuracy: ${analysis.overall}% | Estimated: ${est.percentile}`,
      `QA: ${analysis.qaAcc}% · DILR: ${analysis.dlAcc}% · VARC: ${analysis.vcAcc}%`,
      analysis.weak.length ? '\n⚠️ Repair Priorities:\n• ' + analysis.weak.join('\n• ') : '\n✓ Strong performance!',
    ]
    setFeedback(lines.join('\n'))
    setName(''); setQa(''); setDilr(''); setVarc(''); setQaat(''); setDlat(''); setVcat(''); setQaCorrect(''); setQaWrong(''); setDilrCorrect(''); setDilrWrong(''); setVarcCorrect(''); setVarcWrong('')
    toast(`Mock logged! Estimated Percentile: ${est.percentile} ✓`)
    await load()
  }

  const userEst = estimateCatPercentile(parseInt(testScoreInput) || 0)

  return (
    <div className="section-pad">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="page-header-title">Mock Analysis &amp; Percentile Predictor</div>
      </div>

      <div className="card" style={{ background: 'rgba(217,119,6,.08)', borderColor: 'rgba(217,119,6,.3)' }}>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>
          NO mock is DONE until ANALYSED.{' '}
          <strong style={{ color: 'var(--text)' }}>Analysis takes at least as long as the mock. Log attempts, correct, wrong and score for each section.</strong>
        </div>
      </div>

      {/* CAT PERCENTILE PREDICTOR TOOL */}
      <div className="card" style={{ background: '#161D2E', border: '1px solid #F5A623' }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: '#F5A623', marginBottom: 8 }}>
          📊 CAT 2026 SCORE VS PERCENTILE ESTIMATOR
        </div>
        <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 12 }}>
          Enter target or actual mock score (max 204 from 68 × 3; percentile is only a rough estimate):
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <input
            type="number"
            className="form-input"
            value={testScoreInput}
            onChange={e => setTestScoreInput(e.target.value)}
            style={{ width: 100, fontSize: 18, fontWeight: 900, textAlign: 'center', color: '#F5A623', fontFamily: 'monospace' }}
          />
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#22C55E' }}>
              {userEst.percentile}
            </div>
            <div style={{ fontSize: 11, color: '#CBD5E1', marginTop: 2 }}>
              {userEst.tier}
            </div>
          </div>
        </div>
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
              <input type="number" className="form-input" placeholder="0" min={0}
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
            const est = estimateCatPercentile(m.total)
            return (
              <div key={m.id} style={{ background: 'var(--navy3)', borderRadius: 10, padding: 12, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{m.name || `Mock ${mocks.length - i}`}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{m.date}</div>
                </div>
                <div className="mock-score-grid">
                  <div className="mock-score-box"><div className="mock-score-val" style={{ color: '#F5A623' }}>{m.total}</div><div className="mock-score-lbl">Score</div></div>
                  <div className="mock-score-box"><div className="mock-score-val" style={{ color: '#22C55E' }}>{m.overall}%</div><div className="mock-score-lbl">Accuracy</div></div>
                  <div className="mock-score-box"><div className="mock-score-val" style={{ color: '#3B82F6' }}>{est.percentile}</div><div className="mock-score-lbl">Est. %ile</div></div>
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
