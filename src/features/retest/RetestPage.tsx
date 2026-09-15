import { useErrors } from '@/hooks/index'
import { EmptyState } from '@/components/EmptyState'
import { useToast } from '@/components/Toast'
import { RetestCard } from './RetestCard'

interface Props { onBack: () => void }

export function RetestPage({ onBack }: Props) {
  const { inRetest, retestPass, retestFail } = useErrors()
  const { show: toast } = useToast()

  async function handleSubmit(id: string, correct: number, total: number, passed: boolean) {
    if (passed) {
      await retestPass(id, correct, total)
      toast(`✓ Retest passed (${correct}/${total}) — Mastery updated!`)
    } else {
      await retestFail(id, correct, total)
      toast(`Back to Repair (${correct}/${total} — below 60%)`, '#D97706')
    }
  }

  return (
    <div className="section-pad">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="page-header-title">Retest Queue ({inRetest.length})</div>
      </div>

      <div className="card" style={{ background: 'rgba(14,159,159,.08)', borderColor: 'rgba(14,159,159,.3)' }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text)' }}>Retest = Fresh questions, no notes.</strong><br />
          Enter your real result — 60%+ correct updates mastery evidence for this topic. Below 60% sends it back to Repair.
        </div>
      </div>

      {inRetest.length === 0 ? (
        <EmptyState icon="✅" title="RETEST QUEUE EMPTY" sub="All repaired items have been retested. Great work!" />
      ) : (
        inRetest.map(e => <RetestCard key={e.id} error={e} onSubmit={handleSubmit} />)
      )}
    </div>
  )
}
