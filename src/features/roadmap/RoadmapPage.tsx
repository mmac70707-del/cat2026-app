import { useState, useEffect } from 'react'
import { ROADMAP_44, RoadmapDayItem } from '@/data/roadmap44'
import { RoadmapRepository, ChapterProgress } from '@/repositories/RoadmapRepository'
import { useToast } from '@/components/Toast'

const STATUS_CONFIG = {
  NOT_STARTED:         { label: 'Not Started',         color: '#9CA3AF', icon: '⬜', bg: 'rgba(156,163,175,0.1)' },
  CURRENT:             { label: 'Current',             color: '#F5A623', icon: '🟨', bg: 'rgba(245,166,35,0.15)' },
  FIRST_PASS_COMPLETE: { label: 'First Pass Complete', color: '#22C55E', icon: '🟢', bg: 'rgba(34,197,94,0.15)' },
  MASTERED:            { label: 'Mastered',            color: '#3B82F6', icon: '🔵', bg: 'rgba(59,130,246,0.15)' },
  EXAM_READY:          { label: 'Exam Ready',          color: '#8B5CF6', icon: '🟣', bg: 'rgba(139,92,246,0.15)' },
}

export function RoadmapPage({ onBack }: { onBack?: () => void }) {
  const [progressList, setProgressList] = useState<ChapterProgress[]>([])
  const [selectedDay, setSelectedDay]   = useState<number | null>(null)
  const [loading, setLoading]           = useState(true)
  const { show: toast }                 = useToast()

  useEffect(() => {
    async function load() {
      const stored = await RoadmapRepository.getAllProgress()
      setProgressList(stored)
      setLoading(false)
    }
    load()
  }, [])

  const handleToggleCheck = async (dayNum: number, field: keyof Omit<ChapterProgress, 'dayNum' | 'status'>) => {
    const cur = progressList.find(p => p.dayNum === dayNum)
    if (!cur) return

    const updated: ChapterProgress = { ...cur, [field]: !cur[field] }
    await RoadmapRepository.updateProgress(updated)
    const refreshed = await RoadmapRepository.getAllProgress()
    setProgressList(refreshed)
    toast('Chapter progress updated ✓')
  }

  const handleSetStatus = async (dayNum: number, status: ChapterProgress['status']) => {
    const cur = progressList.find(p => p.dayNum === dayNum)
    if (!cur) return

    const updated: ChapterProgress = { ...cur, status }
    await RoadmapRepository.updateProgress(updated)
    const refreshed = await RoadmapRepository.getAllProgress()
    setProgressList(refreshed)
    toast(`Status set to ${STATUS_CONFIG[status].label} ✓`)
  }

  if (loading) {
    return <div style={{ padding: 24, textAlign: 'center', color: '#94A3B8' }}>Loading 44-Day First-Pass Roadmap…</div>
  }

  const completedCount = progressList.filter(p => p.status === 'FIRST_PASS_COMPLETE' || p.status === 'MASTERED' || p.status === 'EXAM_READY').length
  const pct = Math.round((completedCount / 44) * 100)

  return (
    <div style={{ padding: '16px 20px', maxWidth: 1000, margin: '0 auto', color: '#F1F5F9' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#F5A623' }}>
            🚀 44-Day First-Pass Roadmap
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
            18 SEP 2026 → 31 OCT 2026 • 1 Major QA Unit Per Day
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ background: '#1F2937', border: '1px solid #374151', color: '#94A3B8', padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
            ← Back
          </button>
        )}
      </div>

      {/* Progress Card */}
      <div style={{ background: '#161D2E', border: '1px solid #2D3748', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Overall First-Pass Progress</span>
          <span style={{ fontSize: 13, fontFamily: 'monospace', color: '#F5A623', fontWeight: 800 }}>{completedCount} / 44 Days ({pct}%)</span>
        </div>
        <div style={{ background: '#1F2937', height: 10, borderRadius: 5, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #16A34A, #22C55E)', transition: 'width 0.5s' }}></div>
        </div>
      </div>

      {/* 44-Day Scrollable Grid / List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ROADMAP_44.map((item: RoadmapDayItem) => {
          const prog = progressList.find(p => p.dayNum === item.dayNum) || {
            dayNum: item.dayNum, concept: false, basic: false, medium: false, pyq: false, timed: false, errorAnalysis: false, retest: false, status: 'NOT_STARTED' as const
          }
          const st = STATUS_CONFIG[prog.status]
          const isExpanded = selectedDay === item.dayNum

          return (
            <div
              key={item.dayNum}
              style={{
                background: '#161D2E', border: `1px solid ${st.color}`,
                borderRadius: 12, padding: 14, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <div
                onClick={() => setSelectedDay(isExpanded ? null : item.dayNum)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: st.bg, color: st.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13 }}>
                    {item.dayNum < 10 ? `0${item.dayNum}` : item.dayNum}
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 0.5 }}>
                      DAY {item.dayNum < 10 ? `0${item.dayNum}` : item.dayNum} • {item.dateStr} • {item.category}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#FFF', marginTop: 2 }}>
                      {item.chapter}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: st.bg, color: st.color }}>
                    {st.icon} {st.label}
                  </span>
                  <span style={{ color: '#94A3B8', fontSize: 12 }}>{isExpanded ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Expanded Checklist details */}
              {isExpanded && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #2D3748' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#F5A623', marginBottom: 10 }}>
                    CHECKLIST (7 STEPS TO FIRST PASS COMPLETION):
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8, marginBottom: 14 }}>
                    {[
                      { key: 'concept', label: 'Concept' },
                      { key: 'basic', label: 'Basic Practice' },
                      { key: 'medium', label: 'Medium Practice' },
                      { key: 'pyq', label: 'CAT / PYQ' },
                      { key: 'timed', label: 'Timed Solving' },
                      { key: 'errorAnalysis', label: 'Error Analysis' },
                      { key: 'retest', label: 'Retest' },
                    ].map(chk => {
                      const fieldKey = chk.key as keyof Omit<ChapterProgress, 'dayNum' | 'status'>
                      const isChecked = Boolean(prog[fieldKey])
                      return (
                        <div
                          key={chk.key}
                          onClick={(e) => { e.stopPropagation(); handleToggleCheck(item.dayNum, fieldKey) }}
                          style={{
                            background: isChecked ? 'rgba(34,197,94,0.15)' : '#1F2937',
                            border: `1px solid ${isChecked ? '#22C55E' : '#374151'}`,
                            borderRadius: 8, padding: '8px 10px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600
                          }}
                        >
                          <span style={{ fontSize: 14, color: isChecked ? '#22C55E' : '#94A3B8' }}>
                            {isChecked ? '✅' : '☐'}
                          </span>
                          <span>{chk.label}</span>
                        </div>
                      )
                    })}
                  </div>

                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>
                    MANUAL STATUS OVERRIDE:
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(['NOT_STARTED', 'CURRENT', 'FIRST_PASS_COMPLETE', 'MASTERED', 'EXAM_READY'] as const).map(s => {
                      const cfg = STATUS_CONFIG[s]
                      return (
                        <button
                          key={s}
                          onClick={(e) => { e.stopPropagation(); handleSetStatus(item.dayNum, s) }}
                          style={{
                            background: prog.status === s ? cfg.color : '#1F2937',
                            color: prog.status === s ? '#0A0F1E' : cfg.color,
                            border: `1px solid ${cfg.color}`,
                            padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 800, cursor: 'pointer'
                          }}
                        >
                          {cfg.icon} {cfg.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
