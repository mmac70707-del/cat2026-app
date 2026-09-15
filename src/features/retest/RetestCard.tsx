import { useState } from 'react'
import type { ErrorRecord } from '@/types'

interface Props {
  error: ErrorRecord
  onSubmit: (id: string, correct: number, total: number, passed: boolean) => void
}

const PASS_THRESHOLD = 0.6

export function RetestCard({ error, onSubmit }: Props) {
  const [correct, setCorrect] = useState('')
  const [total,   setTotal]   = useState('')
  const [err,     setErr]     = useState('')

  function handleSubmit() {
    const c = parseInt(correct)
    const t = parseInt(total)
    if (isNaN(t) || t <= 0) { setErr('Enter how many questions you attempted'); return }
    if (isNaN(c) || c < 0)  { setErr('Enter how many you got correct'); return }
    if (c > t)              { setErr('Correct can\'t exceed total attempted'); return }
    setErr('')
    onSubmit(error.id, c, t, c / t >= PASS_THRESHOLD)
  }

  return (
    <div className="retest-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#0E9F9F' }}>{error.errorType} · {error.subject}</span>
        <span style={{ fontSize: 10, color: 'var(--muted)' }}>Repaired: {(error.repairedAt || '').slice(0, 10)}</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{error.topic}</div>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>
        Take 2–5 fresh questions without notes, then enter your real result. 60%+ = mastered.
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: err ? 6 : 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 3, textTransform: 'uppercase' }}>Correct</div>
          <input type="number" className="form-input" placeholder="e.g. 3" min={0} value={correct} onChange={e => setCorrect(e.target.value)} />
        </div>
        <div style={{ fontSize: 16, color: 'var(--muted)', paddingBottom: 10 }}>/</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 3, textTransform: 'uppercase' }}>Out of</div>
          <input type="number" className="form-input" placeholder="e.g. 5" min={1} value={total} onChange={e => setTotal(e.target.value)} />
        </div>
      </div>

      {err && <div style={{ fontSize: 11, color: '#F87171', marginBottom: 8 }}>{err}</div>}

      <button
        style={{ width: '100%', background: '#0E9F9F', border: 'none', color: 'white', borderRadius: 8, padding: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
        onClick={handleSubmit}
      >
        Submit Retest Result
      </button>
    </div>
  )
}
