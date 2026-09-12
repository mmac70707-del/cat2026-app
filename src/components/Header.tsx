import { useState, useEffect } from 'react'
import { useCountdown } from '@/hooks/useCountdown'
import { usePhase } from '@/hooks/usePhase'

const EXAMS = [
  { id: 'cat2026', name: 'CAT 2026', badge: 'Primary', col: '#F5A623' },
  { id: 'nmat',    name: 'NMAT',     badge: 'Speed',   col: '#38BDF8' },
  { id: 'snap',    name: 'SNAP',     badge: 'Speed',   col: '#22C55E' },
  { id: 'xat',     name: 'XAT',      badge: 'Decision',col: '#A78BFA' },
  { id: 'mat',     name: 'MAT',      badge: 'Aptitude',col: '#EC4899' },
  { id: 'cmat',    name: 'CMAT',     badge: 'General', col: '#10B981' },
]

export function Header() {
  const phase = usePhase()
  const { days, hms } = useCountdown()
  const [targetExam, setTargetExam] = useState<string>(() => {
    return localStorage.getItem('cat2026_target_exam') || 'cat2026'
  })

  useEffect(() => {
    localStorage.setItem('cat2026_target_exam', targetExam)
  }, [targetExam])

  const activeExamObj = EXAMS.find(e => e.id === targetExam) || EXAMS[0]

  return (
    <div className="app-header" style={{ flexDirection: 'column', gap: 8, padding: '12px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="app-title" style={{ fontSize: 18, color: activeExamObj.col }}>
              {activeExamObj.name}
            </div>
            <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: activeExamObj.col, color: '#000' }}>
              {activeExamObj.badge}
            </span>
          </div>
          <div className="app-subtitle" style={{ fontSize: 11 }}>
            MAT-Q Learning Platform Engine
          </div>
        </div>

        <div className="phase-badge" style={{ background: phase.color, fontSize: 11, padding: '4px 10px' }}>
          {phase.id} — {phase.name}
        </div>

        <div className="countdown-wrap" style={{ textAlign: 'right' }}>
          <div className="countdown-days" style={{ fontSize: 16 }}>{days}d</div>
          <div className="countdown-hms" style={{ fontSize: 10 }}>{hms}</div>
        </div>
      </div>

      {/* Target Exam Selector Bar */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', width: '100%', paddingBottom: 2 }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--muted)', alignSelf: 'center', whiteSpace: 'nowrap' }}>
          TARGET EXAM:
        </span>
        {EXAMS.map(e => (
          <button
            key={e.id}
            onClick={() => setTargetExam(e.id)}
            style={{
              padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700,
              border: targetExam === e.id ? `1px solid ${e.col}` : '1px solid #334155',
              background: targetExam === e.id ? 'rgba(245,166,35,0.15)' : '#1E293B',
              color: targetExam === e.id ? e.col : '#94A3B8',
              cursor: 'pointer', whiteSpace: 'nowrap'
            }}
          >
            {e.name}
          </button>
        ))}
      </div>
    </div>
  )
}
