import { useState, useEffect } from 'react'
import { useToast } from '@/components/Toast'
import { ErrorRepository } from '@/repositories/ErrorRepository'
import type { ErrorType } from '@/types'

interface Question {
  id: number
  section: 'VARC' | 'DILR' | 'QA'
  type: 'MCQ' | 'TITA'
  question: string
  options?: string[]
  correctAnswer: string // Index for MCQ ("0", "1", ...) or exact string for TITA
  explanation: string
}

const MOCK_QUESTIONS: Question[] = [
  // VARC
  {
    id: 1, section: 'VARC', type: 'MCQ',
    question: 'RC Passage snippet: "The rapid evolution of generative AI has reshaped creative industries, raising fundamental questions about copyright, originality, and the value of human authorship." What is the central thesis of the author?',
    options: ['Generative AI is illegal under copyright law', 'AI is transforming creative industries and challenging ideas of authorship', 'Human authorship will become completely obsolete', 'Copyright laws should prohibit AI development'],
    correctAnswer: '1',
    explanation: 'The passage highlights how generative AI is reshaping creative industries and raising questions on authorship and copyright.'
  },
  {
    id: 2, section: 'VARC', type: 'MCQ',
    question: 'Para Summary: "While renewable energy capacity is expanding globally, grid infrastructure limitations often prevent full utilization, leading to energy curtailment." Summarize in one sentence.',
    options: ['Renewable energy expansion is limited by inadequate grid infrastructure', 'Grid infrastructure is expanding faster than renewable energy', 'Energy curtailment is necessary for grid safety', 'Renewable energy is unreliable for power grids'],
    correctAnswer: '0',
    explanation: 'Option A accurately summarizes both key elements: expanding capacity vs. grid infrastructure limitations causing curtailment.'
  },
  // DILR
  {
    id: 3, section: 'DILR', type: 'MCQ',
    question: 'DILR Set: Four students A, B, C, D scored 40, 50, 60, 70 in a test. A scored more than B. D scored less than C. B scored more than D. Who scored the highest?',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: '2',
    explanation: 'Scores are 40, 50, 60, 70. Order from constraints: C (70) > A > B > D (40). Highest score is C (70).'
  },
  {
    id: 4, section: 'DILR', type: 'TITA',
    question: 'In a matrix of 3 rows and 3 columns, the sum of each row and column is 15. If row 1 entries are 8 and 3 in positions (1,1) and (1,2), what is entry (1,3)?',
    correctAnswer: '4',
    explanation: '8 + 3 + x = 15 => x = 4.'
  },
  // QA
  {
    id: 5, section: 'QA', type: 'MCQ',
    question: 'If the price of petrol increases by 20%, by what percentage must a driver reduce consumption to keep total expenditure constant?',
    options: ['16.67%', '20%', '25%', '15%'],
    correctAnswer: '0',
    explanation: 'Reduction = x / (100 + x) = 20 / 120 = 1/6 = 16.67%.'
  },
  {
    id: 6, section: 'QA', type: 'TITA',
    question: 'Find the log value: log₂ (64). Type your numerical answer.',
    correctAnswer: '6',
    explanation: '2⁶ = 64, so log₂ (64) = 6.'
  }
]

export function CatMockExamPage({ onBack }: { onBack?: () => void }) {
  const [activeSection, setActiveSection]   = useState<'VARC' | 'DILR' | 'QA'>('VARC')
  const [currentQIndex, setCurrentQIndex]   = useState<number>(0)
  const [userAnswers, setUserAnswers]       = useState<Record<number, string>>({})
  const [markedReview, setMarkedReview]     = useState<Record<number, boolean>>({})
  const [timeLeftSec, setTimeLeftSec]       = useState<number>(2400) // 40 minutes per section
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false)
  const { show: toast }                     = useToast()

  const currentQuestions = MOCK_QUESTIONS.filter(q => q.section === activeSection)
  const currentQ = currentQuestions[currentQIndex] || currentQuestions[0]

  // Timer countdown
  useEffect(() => {
    if (isExamSubmitted) return
    const id = setInterval(() => {
      setTimeLeftSec(prev => {
        if (prev <= 1) {
          clearInterval(id)
          handleAutoSubmitSection()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [isExamSubmitted, activeSection])

  const handleAutoSubmitSection = () => {
    if (activeSection === 'VARC') {
      setActiveSection('DILR')
      setCurrentQIndex(0)
      setTimeLeftSec(2400)
      toast('VARC Time Up! Switched to DILR section', '#F59E0B')
    } else if (activeSection === 'DILR') {
      setActiveSection('QA')
      setCurrentQIndex(0)
      setTimeLeftSec(2400)
      toast('DILR Time Up! Switched to QA section', '#F59E0B')
    } else {
      setIsExamSubmitted(true)
      toast('Exam Completed & Submitted!', '#22C55E')
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleSelectOption = (ans: string) => {
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: ans }))
  }

  const handleToggleMarkReview = () => {
    setMarkedReview(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))
  }

  const handleClearResponse = () => {
    setUserAnswers(prev => {
      const copy = { ...prev }
      delete copy[currentQ.id]
      return copy
    })
  }

  const handleSaveAndNext = () => {
    if (currentQIndex < currentQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1)
    } else {
      toast('End of current section. Use section tabs to switch or submit exam.', '#38BDF8')
    }
  }

  const handleLogError = async (q: Question, errorType: ErrorType) => {
    try {
      await ErrorRepository.log({
        errorType,
        subject: q.section,
        topic: `${q.section} Mock Exam Q${q.id}`,
        wrongReason: `Incorrect answer in CAT/MAT Full Mock Exam.`,
        correctMethod: q.explanation,
        preventionRule: `Review ${q.type} accuracy rules and time selection.`,
      })
      toast(`Logged ${errorType} error to Error Log & Repair Queue!`, '#EF4444')
    } catch {
      toast('Failed to log error', '#DC2626')
    }
  }

  // Calculate Scores
  const calculateResult = () => {
    let score = 0
    let correct = 0
    let wrong = 0
    let unattempted = 0

    MOCK_QUESTIONS.forEach(q => {
      const ans = userAnswers[q.id]
      if (ans === undefined || ans.trim() === '') {
        unattempted++
      } else if (ans.trim() === q.correctAnswer) {
        correct++
        score += 3
      } else {
        wrong++
        if (q.type === 'MCQ') score -= 1 // TITA has no negative marking in CAT
      }
    })

    const totalQ = MOCK_QUESTIONS.length
    const maxScore = totalQ * 3
    const accuracy = (correct + wrong) > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0
    const estPercentile = Math.min(99.9, Math.max(50, Math.round(50 + (score / maxScore) * 49.9)))

    return { score, correct, wrong, unattempted, maxScore, accuracy, estPercentile }
  }

  if (isExamSubmitted) {
    const res = calculateResult()
    return (
      <div style={{ padding: 16, maxWidth: 800, margin: '0 auto', color: '#E2E8F0' }}>
        <div style={{ background: '#0D1B2A', padding: 20, borderRadius: 12, border: '1px solid #22C55E', marginBottom: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#22C55E', margin: 0 }}>
            CAT / MAT Mock Test Complete
          </h2>
          <p style={{ fontSize: 13, color: '#94A3B8', margin: '4px 0 16px' }}>
            Instant Scorecard & Detailed Performance Analysis
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10 }}>
            <div style={{ background: '#1E293B', padding: 12, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Total Score</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#F5A623' }}>{res.score} / {res.maxScore}</div>
            </div>
            <div style={{ background: '#1E293B', padding: 12, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Est. Percentile</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#38BDF8' }}>{res.estPercentile}%ile</div>
            </div>
            <div style={{ background: '#1E293B', padding: 12, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Accuracy</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#22C55E' }}>{res.accuracy}%</div>
            </div>
            <div style={{ background: '#1E293B', padding: 12, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Correct / Wrong</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#F1F5F9' }}>
                <span style={{ color: '#22C55E' }}>{res.correct}</span> / <span style={{ color: '#EF4444' }}>{res.wrong}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Question Solutions & Error Logging */}
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F5A623', marginBottom: 12 }}>
          Detailed Solution & Error Log Engine
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MOCK_QUESTIONS.map((q, idx) => {
            const uAns = userAnswers[q.id]
            const isCorrect = uAns !== undefined && uAns.trim() === q.correctAnswer
            const isUnatt   = uAns === undefined || uAns.trim() === ''

            return (
              <div key={q.id} style={{ background: '#0D1B2A', padding: 14, borderRadius: 10, border: '1px solid #1E293B' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: '#1E293B', color: '#38BDF8' }}>
                    Q{idx + 1} • {q.section} • {q.type}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: isCorrect ? '#22C55E' : isUnatt ? '#94A3B8' : '#EF4444' }}>
                    {isCorrect ? '✅ +3 Marks' : isUnatt ? '⚪ Unattempted (0)' : '❌ -1 Mark'}
                  </span>
                </div>

                <div style={{ fontSize: 13, color: '#F1F5F9', marginBottom: 8 }}>{q.question}</div>

                <div style={{ fontSize: 12, color: '#CBD5E1', background: '#1E293B', padding: 10, borderRadius: 6, marginBottom: 8 }}>
                  💡 <strong>Explanation:</strong> {q.explanation}
                </div>

                {!isCorrect && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>Log mistake to Repair Queue:</span>
                    {(['C1','C2','C3','C4','C5'] as ErrorType[]).map(errType => (
                      <button
                        key={errType}
                        onClick={() => handleLogError(q, errType)}
                        style={{
                          background: '#EF4444', border: 'none', color: '#FFF',
                          borderRadius: 4, padding: '2px 6px', fontSize: 10, fontWeight: 800, cursor: 'pointer'
                        }}
                      >
                        + {errType}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <button
          onClick={() => setIsExamSubmitted(false)}
          style={{
            marginTop: 16, width: '100%', padding: '12px', borderRadius: 8,
            background: '#1A56DB', color: '#FFF', fontWeight: 800, border: 'none', cursor: 'pointer'
          }}
        >
          🔄 Retake CAT/MAT Mock Test
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: '0 auto', color: '#E2E8F0' }}>
      {/* Top Exam Header */}
      <div style={{ background: '#0D1B2A', padding: 14, borderRadius: 12, border: '1px solid #1E293B', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#F5A623' }}>
            CAT / MAT Full Pattern Exam Engine
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>
            Sectional Timers • MCQ + TITA Format • Real Exam Interface
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: '#1E293B', padding: '6px 14px', borderRadius: 8, textAlign: 'center', border: '1px solid #334155' }}>
            <div style={{ fontSize: 10, color: '#94A3B8' }}>Time Left ({activeSection})</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#EF4444', fontFamily: 'monospace' }}>
              ⏱️ {formatTime(timeLeftSec)}
            </div>
          </div>

          <button
            onClick={() => setIsExamSubmitted(true)}
            style={{
              background: '#DC2626', color: '#FFF', fontWeight: 800, padding: '8px 16px',
              borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12
            }}
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Section Selector Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['VARC', 'DILR', 'QA'] as const).map(sec => (
          <button
            key={sec}
            onClick={() => { setActiveSection(sec); setCurrentQIndex(0) }}
            style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 800,
              border: activeSection === sec ? '1px solid #F5A623' : '1px solid #334155',
              background: activeSection === sec ? '#1A56DB' : '#1E293B',
              color: activeSection === sec ? '#FFF' : '#94A3B8', cursor: 'pointer'
            }}
          >
            {sec} Section ({MOCK_QUESTIONS.filter(q => q.section === sec).length} Qs)
          </button>
        ))}
      </div>

      {/* Main Exam Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 16 }}>
        {/* Question Panel */}
        <div style={{ background: '#0D1B2A', padding: 16, borderRadius: 12, border: '1px solid #1E293B' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #1E293B' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#38BDF8' }}>
              Question {currentQIndex + 1} of {currentQuestions.length} ({currentQ.type})
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>
              Marking: +3 for Correct, {currentQ.type === 'MCQ' ? '-1 for Incorrect' : '0 for Incorrect (TITA)'}
            </div>
          </div>

          <div style={{ fontSize: 14, color: '#F1F5F9', marginBottom: 16, lineHeight: 1.5 }}>
            {currentQ.question}
          </div>

          {/* Options / Input */}
          {currentQ.type === 'MCQ' && currentQ.options && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {currentQ.options.map((opt, idx) => {
                const isSelected = userAnswers[currentQ.id] === String(idx)
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(String(idx))}
                    style={{
                      textAlign: 'left', padding: '10px 14px', borderRadius: 8, fontSize: 13,
                      border: isSelected ? '1px solid #22C55E' : '1px solid #334155',
                      background: isSelected ? 'rgba(34,197,94,0.15)' : '#1E293B',
                      color: isSelected ? '#4ADE80' : '#CBD5E1', cursor: 'pointer'
                    }}
                  >
                    <strong>{String.fromCharCode(65 + idx)}.</strong> {opt}
                  </button>
                )
              })}
            </div>
          )}

          {currentQ.type === 'TITA' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6 }}>Type your numerical response below:</div>
              <input
                type="text"
                value={userAnswers[currentQ.id] || ''}
                onChange={e => handleSelectOption(e.target.value)}
                placeholder="Enter answer (e.g. 4)"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8, background: '#1E293B',
                  border: '1px solid #38BDF8', color: '#FFF', fontSize: 14, outline: 'none'
                }}
              />
            </div>
          )}

          {/* Action Control Buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 12, borderTop: '1px solid #1E293B' }}>
            <button
              onClick={handleSaveAndNext}
              style={{ background: '#22C55E', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 800, cursor: 'pointer' }}
            >
              Save & Next
            </button>
            <button
              onClick={handleToggleMarkReview}
              style={{ background: markedReview[currentQ.id] ? '#F5A623' : '#1E293B', color: markedReview[currentQ.id] ? '#000' : '#F5A623', border: '1px solid #F5A623', padding: '8px 14px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}
            >
              {markedReview[currentQ.id] ? 'Unmark Review' : 'Mark for Review'}
            </button>
            <button
              onClick={handleClearResponse}
              style={{ background: '#1E293B', color: '#94A3B8', border: '1px solid #334155', padding: '8px 14px', borderRadius: 6, cursor: 'pointer' }}
            >
              Clear Response
            </button>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div style={{ background: '#0D1B2A', padding: 14, borderRadius: 12, border: '1px solid #1E293B' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#F5A623', marginBottom: 10 }}>
            Question Palette ({activeSection})
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {currentQuestions.map((q, idx) => {
              const ans = userAnswers[q.id]
              const isAns = ans !== undefined && ans.trim() !== ''
              const isRev = markedReview[q.id]

              let paletteBg = '#1E293B'
              let paletteBorder = '#334155'
              let paletteColor = '#CBD5E1'

              if (isAns && isRev) {
                paletteBg = '#8B5CF6'
                paletteBorder = '#A78BFA'
                paletteColor = '#FFF'
              } else if (isAns) {
                paletteBg = '#22C55E'
                paletteBorder = '#4ADE80'
                paletteColor = '#FFF'
              } else if (isRev) {
                paletteBg = '#F5A623'
                paletteBorder = '#FBBF24'
                paletteColor = '#000'
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQIndex(idx)}
                  style={{
                    padding: '8px 0', borderRadius: 6, fontSize: 12, fontWeight: 800,
                    background: paletteBg, border: `1px solid ${paletteBorder}`, color: paletteColor,
                    cursor: 'pointer'
                  }}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>

          <div style={{ marginTop: 16, fontSize: 10, color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div>🟢 Answered</div>
            <div>🟡 Marked for Review</div>
            <div>🟣 Answered & Marked</div>
            <div>⚪ Not Answered</div>
          </div>
        </div>
      </div>
    </div>
  )
}
