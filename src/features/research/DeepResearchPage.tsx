import { useState } from 'react'
import { useToast } from '@/components/Toast'
import { ErrorRepository } from '@/repositories/ErrorRepository'
import type { ErrorType } from '@/types'

interface ResearchTopic {
  id: string
  subject: 'QA' | 'DILR' | 'VARC'
  name: string
  category: string
  catFrequency: string
  expectedQuestions: string
  conceptSummary: string
  formulas: { title: string; formula: string; note: string }[]
  shortcuts: { title: string; desc: string; example: string }[]
  traps: { errorType: ErrorType; trap: string; preventionRule: string }[]
  practiceQuestions: {
    id: string
    question: string
    options: string[]
    correctIndex: number
    explanation: string
  }[]
}

const RESEARCH_DATA: ResearchTopic[] = [
  {
    id: 'qa-pct',
    subject: 'QA',
    name: 'Percentages & Fractional Equivalents',
    category: 'Arithmetic',
    catFrequency: 'High (3–4 Qs in CAT every year directly or in DILR)',
    expectedQuestions: '2–3 Direct + 2 DILR Sets',
    conceptSummary: 'Percentages are the core backbone of Arithmetic and DILR. Mastery of fraction-to-percentage conversion reduces calculation time by 80%.',
    formulas: [
      { title: 'Percentage Change', formula: 'Δ% = ((Final - Initial) / Initial) × 100', note: 'Always divide by the Initial base value.' },
      { title: 'Successive Change', formula: 'A + B + (A × B / 100)', note: 'Use positive for increase, negative for decrease.' },
      { title: 'Inverse Relation', formula: 'If price increases by x/y, consumption decreases by x / (y + x)', note: 'Crucial for TSD and Expenditure problems.' },
    ],
    shortcuts: [
      { title: 'Fraction Table Speed Recall', desc: '1/7 = 14.28%, 1/8 = 12.5%, 1/9 = 11.11%, 1/11 = 9.09%, 1/13 = 7.69%, 1/14 = 7.14%', example: 'Calculate 37.5% of 640 → 3 × (1/8) × 640 = 3 × 80 = 240.' },
      { title: 'Multiplying Factor Method', desc: '20% increase = ×1.2, 15% decrease = ×0.85', example: '100 → +20% → -10% = 100 × 1.2 × 0.9 = 108 (+8% net).' },
    ],
    traps: [
      { errorType: 'C3', trap: 'Confusing "A is x% more than B" with "B is x% less than A".', preventionRule: 'Base is always what comes after "than" or "of".' },
      { errorType: 'C2', trap: 'Adding percentages directly when bases are different.', preventionRule: 'Never add percentages unless the base amount is identical.' },
    ],
    practiceQuestions: [
      {
        id: 'q1',
        question: 'If the price of sugar increases by 25%, by what percentage must a household reduce its sugar consumption so that the total expenditure remains unchanged?',
        options: ['15%', '20%', '25%', '33.33%'],
        correctIndex: 1,
        explanation: 'Increase = 25% = 1/4 (x/y = 1/4). Reduction required = x / (y + x) = 1 / (4 + 1) = 1/5 = 20%.'
      },
      {
        id: 'q2',
        question: 'A salary is first increased by 20% and then decreased by 20%. What is the net percentage change in salary?',
        options: ['No change', '4% increase', '4% decrease', '2% decrease'],
        correctIndex: 2,
        explanation: 'Net change = A + B + AB/100 = 20 - 20 - (20×20)/100 = -4% (4% decrease).'
      }
    ]
  },
  {
    id: 'qa-tsd',
    subject: 'QA',
    name: 'Time, Speed & Distance (TSD)',
    category: 'Arithmetic',
    catFrequency: 'Very High (2–3 Qs per slot)',
    expectedQuestions: '2–3 Questions',
    conceptSummary: 'Distance = Speed × Time. Relative speed and average speed are the two most tested areas in CAT TSD problems.',
    formulas: [
      { title: 'Average Speed (Equal Distances)', formula: 'Avg Speed = (2 × S1 × S2) / (S1 + S2)', note: 'Do NOT take arithmetic average (S1+S2)/2!' },
      { title: 'Relative Speed', formula: 'Same dir = |S1 - S2|, Opposite dir = S1 + S2', note: 'Use when two objects are moving simultaneously.' },
      { title: 'Boats & Streams', formula: 'Downstream = B + S, Upstream = B - S', note: 'B = (Down + Up)/2, S = (Down - Up)/2' },
    ],
    shortcuts: [
      { title: 'Ratio of Time & Speed', desc: 'When Distance is constant, Speed ∝ 1/Time. If Speed ratio is 3:4, Time ratio is 4:3.', example: 'Time saved = 1 part of ratio.' },
    ],
    traps: [
      { errorType: 'C2', trap: 'Mixing km/h and m/s without unit conversion.', preventionRule: '1 km/h = 5/18 m/s. Always check units before adding/multiplying.' },
      { errorType: 'C4', trap: 'Taking average speed as simple average of speeds.', preventionRule: 'Avg Speed = Total Distance / Total Time. Use harmonic mean for equal distances.' },
    ],
    practiceQuestions: [
      {
        id: 'q3',
        question: 'A car travels from A to B at 60 km/h and returns from B to A at 40 km/h. What is the average speed for the entire journey?',
        options: ['50 km/h', '48 km/h', '45 km/h', '52 km/h'],
        correctIndex: 1,
        explanation: 'Avg Speed = (2 × 60 × 40) / (60 + 40) = 4800 / 100 = 48 km/h.'
      }
    ]
  },
  {
    id: 'dl-tbl',
    subject: 'DILR',
    name: 'Tables, Caselets & Logic-Heavy Sets',
    category: 'Data Interpretation',
    catFrequency: 'High (At least 1 full set in every CAT slot)',
    expectedQuestions: '1 Set (5 Questions)',
    conceptSummary: 'DILR Table sets require scanning, fast estimation, and identifying missing entries through row/column totals.',
    formulas: [
      { title: 'Column/Row Balancing', formula: 'Sum(Rows) = Sum(Columns) = Grand Total', note: 'Fill missing data first before answering.' },
      { title: 'Growth Rate Comparison', formula: 'Growth = (New - Old) / Old', note: 'Compare fractions quickly using cross-multiplication.' },
    ],
    shortcuts: [
      { title: 'Option Elimination in DILR', desc: 'Check extreme options first. Usually 2 options can be eliminated in 5 seconds.', example: 'If total is ~500, option 1200 is impossible.' },
    ],
    traps: [
      { errorType: 'C5', trap: 'Spending > 5 minutes on a set without completing 1 question.', preventionRule: 'Set selection strategy: Abandon set if 0 clues unlocked after 3 minutes!' },
    ],
    practiceQuestions: [
      {
        id: 'q4',
        question: 'In a table of 4 teams playing 3 matches each, if Team A has 2 wins and 1 draw, how many points do they have (Win=3, Draw=1, Loss=0)?',
        options: ['5', '6', '7', '8'],
        correctIndex: 2,
        explanation: 'Points = (2 × 3) + (1 × 1) = 6 + 1 = 7 points.'
      }
    ]
  },
  {
    id: 'vc-mi',
    subject: 'VARC',
    name: 'RC Main Idea & Elimination Strategy',
    category: 'Reading Comprehension',
    catFrequency: 'Very High (12–16 Qs in VARC)',
    expectedQuestions: '4 Passages (16 Qs)',
    conceptSummary: 'Main Idea questions ask for the central thesis of the passage. Eliminating distorted, too narrow, or too broad options is key.',
    formulas: [
      { title: 'Paragraph Mapping', formula: 'P1 (Topic) + P2 (Argument) + P3 (Counter) → Conclusion', note: 'Write a 3-word summary per paragraph in your mind.' },
    ],
    shortcuts: [
      { title: '4-Filter Elimination', desc: '1. Out of Scope (not mentioned), 2. Extreme (Always/Never/Only), 3. Opposite (Distorted), 4. Too Narrow (Detail, not Main Idea)', example: 'Correct option captures author\'s tone and primary argument.' },
    ],
    traps: [
      { errorType: 'C3', trap: 'Choosing an option that is true according to the passage but is only a minor detail.', preventionRule: 'A detail cannot be the Main Idea. Ask: "Does the author discuss this in the whole passage?"' },
    ],
    practiceQuestions: [
      {
        id: 'q5',
        question: 'Which of the following option types is most likely WRONG for a "Main Idea" RC question?',
        options: ['Captures overall thesis', 'Focuses on a single paragraph example', 'Reflects author\'s tone', 'Encompasses all major arguments'],
        correctIndex: 1,
        explanation: 'Single paragraph example is "Too Narrow" and represents a detail, not the overarching Main Idea.'
      }
    ]
  }
]

export function DeepResearchPage({ onBack }: { onBack?: () => void }) {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('qa-pct')
  const [activeTab, setActiveTab]             = useState<'concept' | 'shortcuts' | 'traps' | 'quiz'>('concept')
  const [searchQuery, setSearchQuery]         = useState<string>('')
  const [userAnswers, setUserAnswers]         = useState<Record<string, number>>({})
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({})
  const { show: toast }                       = useToast()

  const topic = RESEARCH_DATA.find(t => t.id === selectedTopicId) || RESEARCH_DATA[0]

  const filteredTopics = RESEARCH_DATA.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectAnswer = (qId: string, optionIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [qId]: optionIndex }))
    setShowExplanation(prev => ({ ...prev, [qId]: true }))
  }

  const handleLogError = async (qId: string, errorType: ErrorType) => {
    try {
      await ErrorRepository.log({
        errorType,
        subject: topic.subject,
        topic: topic.name,
        wrongReason: `Incorrect answer on practice question ${qId} in Deep Research.`,
        correctMethod: `Review Research concept and shortcuts for ${topic.name}.`,
        preventionRule: `Apply prevention rule from Deep Research traps table.`,
      })
      toast(`Logged ${errorType} error to Error Log & Repair Queue!`, '#EF4444')
    } catch {
      toast('Failed to log error', '#DC2626')
    }
  }

  return (
    <div style={{ padding: '16px', maxWidth: 900, margin: '0 auto', color: '#E2E8F0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>🔬</span>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#F5A623', margin: 0 }}>
              Deep Research & Concept Engine
            </h1>
          </div>
          <p style={{ fontSize: 13, color: '#94A3B8', margin: '4px 0 0' }}>
            AI-driven topic breakdowns, formula tricks, C1–C5 trap warnings, and CAT historical trends
          </p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: 'none', border: '1px solid #334155', color: '#94A3B8',
              borderRadius: 20, padding: '6px 16px', fontSize: 12, cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        )}
      </div>

      {/* Search & Topic Selector Bar */}
      <div style={{ background: '#0D1B2A', padding: 14, borderRadius: 12, border: '1px solid #1E293B', marginBottom: 16 }}>
        <input
          type="text"
          placeholder="🔍 Search any CAT topic, formula, or concept (e.g. Percentages, TSD, DILR Tables)..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: 8, background: '#1E293B',
            border: '1px solid #334155', color: '#FFF', fontSize: 13, outline: 'none', marginBottom: 12
          }}
        />

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {filteredTopics.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTopicId(t.id)}
              style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                border: t.id === selectedTopicId ? '1px solid #F5A623' : '1px solid #334155',
                background: t.id === selectedTopicId ? 'rgba(245,166,35,0.15)' : '#1E293B',
                color: t.id === selectedTopicId ? '#F5A623' : '#94A3B8',
                cursor: 'pointer', whiteSpace: 'nowrap'
              }}
            >
              [{t.subject}] {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active Topic Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', padding: 16, borderRadius: 12, border: '1px solid #334155', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: '#1A56DB', color: '#FFF' }}>
              {topic.subject} • {topic.category}
            </span>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#F1F5F9', margin: '6px 0 2px' }}>
              {topic.name}
            </h2>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>{topic.conceptSummary}</div>
          </div>
          <div style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.3)', padding: '8px 12px', borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#F5A623', fontWeight: 700 }}>CAT Weightage</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#FFF' }}>{topic.catFrequency}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: '1px solid #334155', paddingBottom: 8 }}>
        <button
          onClick={() => setActiveTab('concept')}
          style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
            background: activeTab === 'concept' ? '#1A56DB' : 'transparent',
            color: activeTab === 'concept' ? '#FFF' : '#94A3B8', border: 'none', cursor: 'pointer'
          }}
        >
          📘 Core Concepts & Formulas
        </button>
        <button
          onClick={() => setActiveTab('shortcuts')}
          style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
            background: activeTab === 'shortcuts' ? '#1A56DB' : 'transparent',
            color: activeTab === 'shortcuts' ? '#FFF' : '#94A3B8', border: 'none', cursor: 'pointer'
          }}
        >
          ⚡ Speed Shortcuts
        </button>
        <button
          onClick={() => setActiveTab('traps')}
          style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
            background: activeTab === 'traps' ? '#1A56DB' : 'transparent',
            color: activeTab === 'traps' ? '#FFF' : '#94A3B8', border: 'none', cursor: 'pointer'
          }}
        >
          ⚠️ C1–C5 Traps & Rules
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
            background: activeTab === 'quiz' ? '#1A56DB' : 'transparent',
            color: activeTab === 'quiz' ? '#FFF' : '#94A3B8', border: 'none', cursor: 'pointer'
          }}
        >
          🧪 CAT Practice Quiz
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'concept' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {topic.formulas.map((f, i) => (
            <div key={i} style={{ background: '#0D1B2A', padding: 14, borderRadius: 10, border: '1px solid #1E293B' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#38BDF8', marginBottom: 4 }}>
                {f.title}
              </div>
              <div style={{ background: '#1E293B', padding: '10px 14px', borderRadius: 6, fontFamily: 'monospace', fontSize: 14, color: '#F5A623', margin: '6px 0' }}>
                {f.formula}
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8', fontStyle: 'italic' }}>
                💡 Key Note: {f.note}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'shortcuts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {topic.shortcuts.map((s, i) => (
            <div key={i} style={{ background: '#0D1B2A', padding: 14, borderRadius: 10, border: '1px solid #1E293B' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#22C55E', marginBottom: 4 }}>
                ⚡ {s.title}
              </div>
              <div style={{ fontSize: 13, color: '#E2E8F0', margin: '4px 0' }}>
                {s.desc}
              </div>
              {s.example && (
                <div style={{ background: 'rgba(34,197,94,0.1)', padding: 10, borderRadius: 6, fontSize: 12, color: '#4ADE80', marginTop: 6 }}>
                  <strong>Example:</strong> {s.example}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'traps' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {topic.traps.map((t, i) => (
            <div key={i} style={{ background: '#0D1B2A', padding: 14, borderRadius: 10, border: '1px solid #1E293B' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ background: '#EF4444', color: '#FFF', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>
                  {t.errorType} Error Trap
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#F87171' }}>
                  {t.trap}
                </span>
              </div>
              <div style={{ background: 'rgba(239,68,68,0.1)', borderLeft: '3px solid #EF4444', padding: '8px 12px', borderRadius: 4, fontSize: 12, color: '#FCA5A5' }}>
                🛡️ <strong>Prevention Rule:</strong> {t.preventionRule}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'quiz' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {topic.practiceQuestions.map((q, qIndex) => {
            const selectedOpt = userAnswers[q.id]
            const isAnswered  = selectedOpt !== undefined
            const isCorrect   = selectedOpt === q.correctIndex

            return (
              <div key={q.id} style={{ background: '#0D1B2A', padding: 16, borderRadius: 12, border: '1px solid #1E293B' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9', marginBottom: 12 }}>
                  Question {qIndex + 1}: {q.question}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                  {q.options.map((opt, optIdx) => {
                    let btnBg = '#1E293B'
                    let btnBorder = '#334155'
                    let btnColor = '#CBD5E1'

                    if (isAnswered) {
                      if (optIdx === q.correctIndex) {
                        btnBg = 'rgba(34,197,94,0.2)'
                        btnBorder = '#22C55E'
                        btnColor = '#4ADE80'
                      } else if (optIdx === selectedOpt) {
                        btnBg = 'rgba(239,68,68,0.2)'
                        btnBorder = '#EF4444'
                        btnColor = '#FCA5A5'
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => !isAnswered && handleSelectAnswer(q.id, optIdx)}
                        disabled={isAnswered}
                        style={{
                          textAlign: 'left', padding: '10px 14px', borderRadius: 8,
                          background: btnBg, border: `1px solid ${btnBorder}`, color: btnColor,
                          fontSize: 13, cursor: isAnswered ? 'default' : 'pointer'
                        }}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt}
                      </button>
                    )
                  })}
                </div>

                {isAnswered && (
                  <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: isCorrect ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${isCorrect ? '#22C55E' : '#EF4444'}` }}>
                    <div style={{ fontWeight: 800, color: isCorrect ? '#22C55E' : '#EF4444', marginBottom: 4 }}>
                      {isCorrect ? '✅ Correct Answer!' : '❌ Incorrect Answer'}
                    </div>
                    <div style={{ fontSize: 12, color: '#CBD5E1', marginBottom: 8 }}>
                      <strong>Step-by-step Solution:</strong> {q.explanation}
                    </div>

                    {!isCorrect && (
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginTop: 8 }}>
                        <span style={{ fontSize: 11, color: '#94A3B8' }}>Log error as:</span>
                        {(['C1','C2','C3','C4','C5'] as ErrorType[]).map(type => (
                          <button
                            key={type}
                            onClick={() => handleLogError(q.id, type)}
                            style={{
                              background: '#EF4444', border: 'none', color: '#FFF',
                              borderRadius: 4, padding: '3px 8px', fontSize: 11, fontWeight: 700, cursor: 'pointer'
                            }}
                          >
                            + {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
