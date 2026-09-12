import { useErrors } from '@/hooks/index'
import { EmptyState } from '@/components/EmptyState'
import { useToast } from '@/components/Toast'

interface Props { onBack: () => void }

export function RepairPage({ onBack }: Props) {
  const { pending, markRepaired } = useErrors()
  const { show: toast } = useToast()

  async function handleRepaired(id: string, topic: string) {
    await markRepaired(id)
    toast(`✓ ${topic} moved to Retest queue`)
  }

  return (
    <div className="section-pad">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="page-header-title">Repair Queue ({pending.length})</div>
      </div>

      <div className="card" style={{ background: 'rgba(219,39,119,.08)', borderColor: 'rgba(219,39,119,.3)' }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text)' }}>Repair = Re-solve without looking at the solution.</strong><br />
          Close solution → think fresh → attempt alone → verify → then mark repaired.
        </div>
      </div>

      {pending.length === 0 ? (
        <EmptyState icon="✅" title="REPAIR QUEUE EMPTY" sub="No pending repairs. Keep logging errors as you study." />
      ) : (
        pending.map(e => (
          <div key={e.id} className="repair-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#DB2777' }}>{e.errorType} · {e.subject}</span>
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>{e.createdAt.slice(0, 10)}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{e.topic}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>❌ {e.wrongReason}</div>
            <div style={{ fontSize: 11, color: '#22C55E', marginBottom: 4 }}>✓ {e.correctMethod}</div>
            {e.preventionRule && (
              <div style={{ fontSize: 10, color: 'var(--gold)', marginBottom: 8 }}>Rule: {e.preventionRule}</div>
            )}
            <div style={{ fontSize: 10, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 10 }}>
              Close solution → attempt fresh → verify → mark repaired below.
            </div>
            <button
              style={{ background: '#DB2777', border: 'none', color: 'white', borderRadius: 8, padding: '10px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', width: '100%' }}
              onClick={() => handleRepaired(e.id, e.topic)}
            >
              ✓ Repaired — Move to Retest
            </button>
          </div>
        ))
      )}
    </div>
  )
}
