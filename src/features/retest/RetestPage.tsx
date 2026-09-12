import { useErrors } from '@/hooks/index'
import { EmptyState } from '@/components/EmptyState'
import { useToast } from '@/components/Toast'

interface Props { onBack: () => void }

export function RetestPage({ onBack }: Props) {
  const { inRetest, retestPass, retestFail } = useErrors()
  const { show: toast } = useToast()

  return (
    <div className="section-pad">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="page-header-title">Retest Queue ({inRetest.length})</div>
      </div>

      <div className="card" style={{ background: 'rgba(14,159,159,.08)', borderColor: 'rgba(14,159,159,.3)' }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text)' }}>Retest = Fresh questions, no notes.</strong><br />
          3+/5 correct = mastered. Fail = back to Repair + flag C1.
        </div>
      </div>

      {inRetest.length === 0 ? (
        <EmptyState icon="✅" title="RETEST QUEUE EMPTY" sub="All repaired items have been retested. Great work!" />
      ) : (
        inRetest.map(e => (
          <div key={e.id} className="retest-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0E9F9F' }}>{e.errorType} · {e.subject}</span>
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>Repaired: {(e.repairedAt || '').slice(0, 10)}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{e.topic}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>
              Take 2–3 fresh questions without notes. Did you get 60%+?
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                style={{ flex: 1, background: '#0E9F9F', border: 'none', color: 'white', borderRadius: 8, padding: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                onClick={async () => { await retestPass(e.id); toast('Retest passed ✓ — Mastered!') }}
              >
                ✓ Passed — Mastered!
              </button>
              <button
                style={{ flex: 1, background: 'rgba(220,38,38,.2)', border: '1px solid rgba(220,38,38,.3)', color: '#F87171', borderRadius: 8, padding: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                onClick={async () => { await retestFail(e.id); toast('Back to Repair queue', '#D97706') }}
              >
                ✗ Failed — Repair Again
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
