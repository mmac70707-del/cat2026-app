import { useState, useEffect } from 'react'
import { ErrorRepository } from '@/repositories/ErrorRepository'
import { MockRepository } from '@/repositories/index'
import { useTodayTasks } from '@/hooks/useTasks'
import { useToast } from '@/components/Toast'
import type { ErrorRecord, MockRecord } from '@/types'

export function ApexProSuite({ onBack }: { onBack?: () => void }) {
  const [activeSubTab, setActiveTab] = useState<'command' | 'triage' | 'mocktrajectory'>('command')
  const [errors, setErrors]           = useState<ErrorRecord[]>([])
  const [mocks, setMocks]             = useState<MockRecord[]>([])
  const { tasks, done, pct }          = useTodayTasks()
  const { show: toast }               = useToast()

  const total = tasks.length || 8

  useEffect(() => {
    async function loadData() {
      const errList  = await ErrorRepository.getPending()
      const mockList = await MockRepository.getAll()
      setErrors(errList)
      setMocks(mockList)
    }
    loadData()
  }, [])

  const totalErrorsCount = errors.length
  const c1Count = errors.filter(e => e.errorType === 'C1').length
  const c2Count = errors.filter(e => e.errorType === 'C2').length
  const c3Count = errors.filter(e => e.errorType === 'C3').length
  const c4Count = errors.filter(e => e.errorType === 'C4').length
  const c5Count = errors.filter(e => e.errorType === 'C5').length

  const handleExportLedger = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      ['ID,Type,Subject,Topic,WrongReason,RepairStatus,RetestStatus,CreatedAt']
        .concat(errors.map(e => `${e.id},${e.errorType},${e.subject},${e.topic},"${e.wrongReason}",${e.repairStatus},${e.retestStatus},${e.createdAt}`))
        .join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Apex_Triage_Ledger_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast('Triage Ledger CSV exported ✓')
  }

  return (
    <div style={{ padding: '16px 20px', maxWidth: 1000, margin: '0 auto', color: '#F1F5F9' }}>
      {/* Top Telemetry Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, background: '#161D2E', border: '1px solid #F5A623', borderRadius: 12, padding: 16 }} className="glow-border-amber">
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#F5A623', letterSpacing: 0.5 }}>
            ⚡ APEX PROTOCOL // PRO COMMAND SUITE
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2, fontFamily: 'monospace' }}>
            SYSTEM ONLINE • TELEMETRY ACTIVE • ZERO TOLERANCE EXECUTION
          </div>
        </div>

        {onBack && (
          <button onClick={onBack} style={{ background: '#1F2937', border: '1px solid #374151', color: '#94A3B8', padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
            ← Back
          </button>
        )}
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
        {[
          { id: 'command',        label: '🖥️ Executive Command Deck' },
          { id: 'triage',         label: '🔴 Diagnostic Error Triage' },
          { id: 'mocktrajectory', label: '📈 Mock Trajectory Analytics' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as unknown as 'command')}
            style={{
              background: activeSubTab === t.id ? '#F5A623' : '#161D2E',
              color: activeSubTab === t.id ? '#0A0F1E' : '#FFF',
              border: `1px solid ${activeSubTab === t.id ? '#F5A623' : '#2D3748'}`,
              padding: '8px 14px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer', flexShrink: 0
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: EXECUTIVE COMMAND DECK */}
      {activeSubTab === 'command' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Key Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
            <div style={{ background: '#161D2E', border: '1px solid #16A34A', borderRadius: 10, padding: 14 }} className="glow-border-emerald">
              <div style={{ fontSize: 10, fontWeight: 700, color: '#4ADE80', textTransform: 'uppercase' }}>Daily Blocks Done</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#FFF', fontFamily: 'monospace', marginTop: 4 }}>{done} / {total}</div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{pct}% Execution Rate</div>
            </div>

            <div style={{ background: '#161D2E', border: '1px solid #3B82F6', borderRadius: 10, padding: 14 }} className="glow-border-cobalt">
              <div style={{ fontSize: 10, fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase' }}>Triage Rate</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#FFF', fontFamily: 'monospace', marginTop: 4 }}>
                {totalErrorsCount > 0 ? `${Math.round(((totalErrorsCount - c1Count) / totalErrorsCount) * 100)}%` : '100%'}
              </div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>Errors Analyzed</div>
            </div>

            <div style={{ background: '#161D2E', border: '1px solid #EF4444', borderRadius: 10, padding: 14 }} className="glow-border-crimson">
              <div style={{ fontSize: 10, fontWeight: 700, color: '#F87171', textTransform: 'uppercase' }}>Recoverable Score</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#FFF', fontFamily: 'monospace', marginTop: 4 }}>+{totalErrorsCount * 3} PTS</div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>Potential Score Gap</div>
            </div>

            <div style={{ background: '#161D2E', border: '1px solid #F5A623', borderRadius: 10, padding: 14 }} className="glow-border-amber">
              <div style={{ fontSize: 10, fontWeight: 700, color: '#F5A623', textTransform: 'uppercase' }}>Dominant Cause</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#FFF', marginTop: 6 }}>
                {c1Count >= c2Count && c1Count >= c3Count ? 'C1 Concept Gap' : 'C2 Calc Slip'}
              </div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>Primary Leakage Point</div>
            </div>
          </div>

          {/* C1–C5 Diagnostic Error Matrix */}
          <div style={{ background: '#161D2E', border: '1px solid #2D3748', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#F5A623', marginBottom: 12 }}>
              🔴 C1–C5 DIAGNOSTIC ERROR MATRIX
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8 }}>
              {[
                { code: 'C1', name: 'Concept Gap', count: c1Count, col: '#EF4444' },
                { code: 'C2', name: 'Calculation Slip', count: c2Count, col: '#F59E0B' },
                { code: 'C3', name: 'Misread Condition', count: c3Count, col: '#3B82F6' },
                { code: 'C4', name: 'Inefficient Path', count: c4Count, col: '#8B5CF6' },
                { code: 'C5', name: 'Time Trap Sunk', count: c5Count, col: '#EC4899' },
              ].map(item => (
                <div key={item.code} style={{ background: '#1F2937', border: `1px solid ${item.col}`, borderRadius: 8, padding: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: item.col, fontFamily: 'monospace' }}>{item.code}</div>
                  <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{item.name}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#FFF', marginTop: 4 }}>{item.count} Pending</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleExportLedger} style={{ flex: 1, background: '#1F2937', border: '1px solid #3B82F6', color: '#60A5FA', padding: 12, borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
              📁 Export Triage Ledger (CSV)
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: DIAGNOSTIC ERROR TRIAGE */}
      {activeSubTab === 'triage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#161D2E', border: '1px solid #EF4444', borderRadius: 12, padding: 16 }} className="glow-border-crimson">
            <div style={{ fontSize: 14, fontWeight: 900, color: '#EF4444', marginBottom: 6 }}>
              🔴 ROOT-CAUSE REPAIR ENGINE
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 12 }}>
              Every logged error is a score leakage waiting to be sealed. Re-solve questions without looking at solutions!
            </div>

            {errors.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#22C55E', fontSize: 12, fontWeight: 700 }}>
                ✓ ZERO PENDING ERRORS! ALL ROOT CAUSES REPAIRED.
              </div>
            ) : (
              errors.map(err => (
                <div key={err.id} style={{ background: '#1F2937', borderLeft: '4px solid #EF4444', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: '#EF4444' }}>[{err.errorType}] {err.subject} • {err.topic}</span>
                    <span style={{ fontSize: 10, color: '#94A3B8' }}>{err.createdAt.slice(0, 10)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#FFF', fontWeight: 600 }}>{err.wrongReason}</div>
                  <div style={{ fontSize: 10, color: '#60A5FA', marginTop: 4 }}>✓ Correct Method: {err.correctMethod}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MOCK TRAJECTORY ANALYTICS */}
      {activeSubTab === 'mocktrajectory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#161D2E', border: '1px solid #3B82F6', borderRadius: 12, padding: 16 }} className="glow-border-cobalt">
            <div style={{ fontSize: 14, fontWeight: 900, color: '#3B82F6', marginBottom: 6 }}>
              📈 MOCK TRAJECTORY &amp; SECTIONAL ANALYTICS
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 12 }}>
              Historical mock trend analysis across Quant, DILR, and VARC:
            </div>

            {mocks.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#94A3B8', fontSize: 12 }}>
                No mocks logged yet. Log your first mock in Mock Analysis!
              </div>
            ) : (
              mocks.map(m => (
                <div key={m.id} style={{ background: '#1F2937', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#FFF' }}>{m.name}</span>
                    <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#F5A623', fontWeight: 900 }}>{m.total} PTS ({m.overall}% Acc)</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, fontSize: 11, textAlign: 'center' }}>
                    <div style={{ background: 'rgba(22,163,74,0.15)', padding: 6, borderRadius: 6, color: '#4ADE80' }}>QA: {m.qaAcc}%</div>
                    <div style={{ background: 'rgba(37,99,235,0.15)', padding: 6, borderRadius: 6, color: '#60A5FA' }}>DILR: {m.dlAcc}%</div>
                    <div style={{ background: 'rgba(124,58,237,0.15)', padding: 6, borderRadius: 6, color: '#C084FC' }}>VARC: {m.vcAcc}%</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
