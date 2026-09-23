import { useState, useEffect } from 'react'
import {
  MASTER_SPINE_44,
  RoadmapDayItem,
  QA_BLOCK_MAPS,
  QUESTION_LADDER_STAGES,
  FINAL_MENTOR_RULES,
  COVERAGE_DEADLINES
} from '@/data/roadmap44'
import { PERCENTYL_WEEKS } from '@/data/percentylPlan2'
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
  const [activeTab, setActiveTab]       = useState<'percentyl' | 'spine' | 'blocks' | 'milestones' | 'rules'>('percentyl')
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
            🔥 PERCENTYL 2.0 — WEEK-BY-WEEK STUDY ROADMAP
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
            21 SEP 2026 → 07 NOV 2026 • 7-Week Full Syllabus Target Map
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ background: '#1F2937', border: '1px solid #374151', color: '#94A3B8', padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
            ← Back
          </button>
        )}
      </div>

      {/* 44-DAY SYLLABUS BOARD BOX */}
      <div style={{ background: '#161D2E', border: '1px solid #F5A623', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: '#F5A623', marginBottom: 8, letterSpacing: 1 }}>
          📒 PERCENTYL 2.0 MASTER SYLLABUS BOARD
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, fontSize: 11, color: '#CBD5E1', fontFamily: 'monospace' }}>
          <div>START: <strong>21 SEP 2026</strong></div>
          <div>DEADLINE: <strong>07 NOV 2026</strong></div>
          <div>EXAM: <strong>29 NOV 2026</strong></div>
          <div>QA: <strong>{completedCount}/44</strong></div>
          <div>DILR: <strong>{completedCount}/44</strong></div>
          <div>VARC: <strong>{completedCount}/44</strong></div>
        </div>
        <div style={{ background: '#1F2937', height: 8, borderRadius: 4, overflow: 'hidden', marginTop: 12 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #16A34A, #22C55E)', transition: 'width 0.5s' }}></div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
        {[
          { id: 'percentyl', label: '📅 7-Week Percentyl 2.0 Plan' },
          { id: 'spine', label: '🧭 44-Day Master Spine' },
          { id: 'blocks', label: '📦 Blocks A–F (QA/DILR/VARC)' },
          { id: 'milestones', label: '⛳ Coverage Deadlines' },
          { id: 'rules', label: '🧠 Question Ladder & Rules' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as unknown as 'percentyl')}
            style={{
              background: activeTab === t.id ? '#F5A623' : '#161D2E',
              color: activeTab === t.id ? '#0A0F1E' : '#FFF',
              border: `1px solid ${activeTab === t.id ? '#F5A623' : '#2D3748'}`,
              padding: '8px 14px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer', flexShrink: 0
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 0: PERCENTYL 2.0 7-WEEK PLAN */}
      {activeTab === 'percentyl' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {PERCENTYL_WEEKS.map(w => (
            <div key={w.weekNum} style={{ background: '#161D2E', border: w.weekNum === 1 ? '1px solid #F5A623' : '1px solid #2D3748', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#F5A623' }}>Week {w.weekNum}</span>
                  <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 8 }}>({w.dates})</span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 10, background: w.weekNum === 1 ? 'rgba(245,166,35,0.2)' : 'rgba(59,130,246,0.15)', color: w.weekNum === 1 ? '#F5A623' : '#3B82F6' }}>
                  {w.weekNum === 1 ? 'THIS WEEK' : 'UPCOMING'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                {/* QUANT */}
                <div style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid #16A34A', borderRadius: 8, padding: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#4ADE80', marginBottom: 6 }}>
                    📐 QUANT ({w.quantTarget})
                  </div>
                  {w.quantBreakdown.map((q, idx) => (
                    <div key={idx} style={{ fontSize: 11, color: '#CBD5E1', display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>• {q.topic}</span>
                      <strong style={{ color: '#F5A623' }}>{q.questions}q</strong>
                    </div>
                  ))}
                </div>

                {/* DILR */}
                <div style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid #2563EB', borderRadius: 8, padding: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#60A5FA', marginBottom: 6 }}>
                    🧩 DILR ({w.dilrTarget})
                  </div>
                  {w.dilrBreakdown.map((d, idx) => (
                    <div key={idx} style={{ fontSize: 11, color: '#CBD5E1', display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>• {d.family}</span>
                      <strong style={{ color: '#60A5FA' }}>{d.count} {d.unit}</strong>
                    </div>
                  ))}
                </div>

                {/* VARC */}
                <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid #7C3AED', borderRadius: 8, padding: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#C084FC', marginBottom: 6 }}>
                    📖 VARC ({w.varcTarget})
                  </div>
                  {w.varcBreakdown.map((v, idx) => (
                    <div key={idx} style={{ fontSize: 11, color: '#CBD5E1', display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>• {v.skill}</span>
                      <strong style={{ color: '#C084FC' }}>{v.count} {v.unit}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 1: MASTER SPINE TABLE */}
      {activeTab === 'spine' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MASTER_SPINE_44.map((item: RoadmapDayItem) => {
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
                        DAY {item.dayNum < 10 ? `0${item.dayNum}` : item.dayNum} • {item.dateStr} • {item.blockName}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#FFF', marginTop: 2, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <span>📐 QA: <strong style={{ color: '#F5A623' }}>{item.chapter}</strong></span>
                        <span>🧩 DILR: <strong style={{ color: '#60A5FA' }}>{item.dilrFamily}</strong></span>
                        <span>📖 VARC: <strong style={{ color: '#A78BFA' }}>{item.varcSkill}</strong></span>
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
      )}

      {/* TAB 2: BLOCKS A-F */}
      {activeTab === 'blocks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {QA_BLOCK_MAPS.map((b, idx) => (
            <div key={idx} style={{ background: '#161D2E', border: '1px solid #2D3748', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#F5A623' }}>{b.block} — {b.name}</span>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#60A5FA' }}>{b.dates}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 6, marginTop: 8 }}>
                {b.topics.map((top, tIdx) => (
                  <div key={tIdx} style={{ background: '#1F2937', padding: '6px 10px', borderRadius: 6, fontSize: 11, color: '#CBD5E1' }}>
                    {top}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: COVERAGE DEADLINES */}
      {activeTab === 'milestones' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {COVERAGE_DEADLINES.map((cd, idx) => (
            <div key={idx} style={{ background: '#161D2E', border: '1px solid #38BDF8', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#38BDF8', marginBottom: 10 }}>⛳ {cd.date}</div>
              <ul style={{ paddingLeft: 20, margin: 0, fontSize: 12, color: '#E2E8F0', lineHeight: 1.7 }}>
                {cd.items.map((it, iIdx) => (
                  <li key={iIdx}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: RULES & QUESTION LADDER */}
      {activeTab === 'rules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Mentor Rules */}
          <div style={{ background: 'linear-gradient(135deg, #1A2E45, #0D1B2A)', border: '1px solid #F5A623', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#F5A623', marginBottom: 8 }}>🤝 MENTOR RULES</div>
            {FINAL_MENTOR_RULES.map((r, rIdx) => (
              <div key={rIdx} style={{ fontSize: 12, fontWeight: 700, color: '#FFF', marginBottom: 6 }}>
                ⚡ {r}
              </div>
            ))}
          </div>

          {/* Question Ladder */}
          <div style={{ background: '#161D2E', border: '1px solid #2D3748', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#22C55E', marginBottom: 10 }}>🧱 YOUR DAILY QA QUESTION LADDER</div>
            {QUESTION_LADDER_STAGES.map((ql, qIdx) => (
              <div key={qIdx} style={{ background: '#1F2937', padding: 10, borderRadius: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#F5A623' }}>{ql.stage} ({ql.total})</div>
                <div style={{ fontSize: 11, color: '#CBD5E1', marginTop: 4 }}>{ql.breakdown}</div>
              </div>
            ))}
          </div>

          {/* Video Gate */}
          <div style={{ background: '#161D2E', border: '1px solid #EF4444', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#EF4444', marginBottom: 8 }}>🔥 THE "VIDEO GATE" RULE</div>
            <div style={{ fontSize: 11, color: '#CBD5E1', lineHeight: 1.6 }}>
              Before opening a lecture ask: <strong>"CAN I SOLVE A BASIC QUESTION?"</strong><br/>
              • <strong>YES</strong> → SKIP VIDEO immediately &amp; solve Qs.<br/>
              • <strong>NO</strong> → WATCH TARGETED CONCEPT → CLOSE VIDEO → SOLVE.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
