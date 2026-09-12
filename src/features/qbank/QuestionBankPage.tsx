import { useState } from 'react'
import { useToast } from '@/components/Toast'
import { ErrorRepository } from '@/repositories/ErrorRepository'
import type { ErrorType } from '@/types'

interface QBankItem {
  id: string
  exam: 'CAT' | 'NMAT' | 'SNAP' | 'XAT' | 'MAT' | 'CMAT'
  subject: 'QA' | 'DILR' | 'VARC'
  topic: string
  difficulty: 'Easy' | 'Moderate' | 'CAT Level' | 'Hard'
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

const QBANK_DATA: QBankItem[] = [
  {
    id: 'qb-1', exam: 'CAT', subject: 'QA', topic: 'Percentages', difficulty: 'CAT Level',
    question: 'In a class, 60% of students passed in Math and 70% passed in English. If 20% failed in both subjects, what percentage of students passed in both subjects?',
    options: ['30%', '40%', '50%', '60%'], correctIndex: 2,
    explanation: '% Failed in Math = 40%, Failed in English = 30%. Failed in at least one = 40 + 30 - 20 = 50%. Passed in both = 100 - 50 = 50%.'
  },
  {
    id: 'qb-2', exam: 'MAT', subject: 'QA', topic: 'Profit & Loss', difficulty: 'Moderate',
    question: 'A trader marks his goods 40% above cost price and allows a discount of 20%. What is his net profit percentage?',
    options: ['12%', '15%', '18%', '20%'], correctIndex: 0,
    explanation: 'Net multiplier = 1.4 × 0.8 = 1.12 => 12% profit.'
  },
  {
    id: 'qb-3', exam: 'NMAT', subject: 'VARC', topic: 'Vocabulary & Analogy', difficulty: 'Easy',
    question: 'Choose the option that best expresses the meaning of EPHEMERAL:',
    options: ['Permanent', 'Transient', 'Substantial', 'Glorious'], correctIndex: 1,
    explanation: 'Ephemeral means lasting for a very short time (transient/fleeting).'
  },
  {
    id: 'qb-4', exam: 'SNAP', subject: 'DILR', topic: 'Analytical Reasoning', difficulty: 'Moderate',
    question: 'If A is to the West of B, B is to the South of C, and C is to the East of D, in which direction is A with respect to D?',
    options: ['North-West', 'South-East', 'South-West', 'Cannot be determined without distance'], correctIndex: 3,
    explanation: 'Since distances between the points are not specified, relative direction depends on distances and cannot be determined.'
  },
  {
    id: 'qb-5', exam: 'XAT', subject: 'QA', topic: 'Functions & Graphs', difficulty: 'Hard',
    question: 'Find the minimum value of f(x) = x² + 4/x² for all x > 0.',
    options: ['2', '4', '8', '16'], correctIndex: 1,
    explanation: 'By AM-GM inequality: (x² + 4/x²)/2 ≥ √(x² × 4/x²) = √4 = 2. So x² + 4/x² ≥ 4.'
  }
]

export function QuestionBankPage({ onBack }: { onBack?: () => void }) {
  const [selectedExam, setSelectedExam]             = useState<string>('ALL')
  const [selectedSubject, setSelectedSubject]       = useState<string>('ALL')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL')
  const [userAnswers, setUserAnswers]               = useState<Record<string, number>>({})
  const [showExplanation, setShowExplanation]       = useState<Record<string, boolean>>({})
  const { show: toast }                             = useToast()

  const filteredQ = QBANK_DATA.filter(q =>
    (selectedExam === 'ALL' || q.exam === selectedExam) &&
    (selectedSubject === 'ALL' || q.subject === selectedSubject) &&
    (selectedDifficulty === 'ALL' || q.difficulty === selectedDifficulty)
  )

  const handleAnswer = (qId: string, optIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [qId]: optIdx }))
    setShowExplanation(prev => ({ ...prev, [qId]: true }))
  }

  const handleLogError = async (q: QBankItem, errorType: ErrorType) => {
    try {
      await ErrorRepository.log({
        errorType,
        subject: q.subject,
        topic: `${q.exam} - ${q.topic}`,
        wrongReason: `Incorrect answer in ${q.exam} Question Bank.`,
        correctMethod: q.explanation,
        preventionRule: `Practice ${q.difficulty} problems on ${q.topic}.`,
      })
      toast(`Logged ${errorType} error to Repair Queue!`, '#EF4444')
    } catch {
      toast('Failed to log error', '#DC2626')
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: '0 auto', color: '#E2E8F0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#F5A623', margin: 0 }}>
            MAT-Q Exam & Adaptive Question Bank
          </h1>
          <p style={{ fontSize: 13, color: '#94A3B8', margin: '4px 0 0' }}>
            Filter questions by Exam (CAT, NMAT, SNAP, XAT, MAT), Subject, and Difficulty
          </p>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ background: 'none', border: '1px solid #334155', color: '#94A3B8', borderRadius: 20, padding: '6px 16px', fontSize: 12, cursor: 'pointer' }}>
            ← Back
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div style={{ background: '#0D1B2A', padding: 14, borderRadius: 12, border: '1px solid #1E293B', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#F5A623' }}>EXAM:</span>
          {['ALL', 'CAT', 'NMAT', 'SNAP', 'XAT', 'MAT', 'CMAT'].map(exam => (
            <button
              key={exam}
              onClick={() => setSelectedExam(exam)}
              style={{
                padding: '4px 12px', borderRadius: 16, fontSize: 11, fontWeight: 700,
                border: selectedExam === exam ? '1px solid #F5A623' : '1px solid #334155',
                background: selectedExam === exam ? '#1A56DB' : '#1E293B',
                color: selectedExam === exam ? '#FFF' : '#94A3B8', cursor: 'pointer'
              }}
            >
              {exam}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto' }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#38BDF8' }}>SUBJECT:</span>
          {['ALL', 'QA', 'DILR', 'VARC'].map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              style={{
                padding: '4px 12px', borderRadius: 16, fontSize: 11, fontWeight: 700,
                border: selectedSubject === sub ? '1px solid #38BDF8' : '1px solid #334155',
                background: selectedSubject === sub ? '#0284C7' : '#1E293B',
                color: selectedSubject === sub ? '#FFF' : '#94A3B8', cursor: 'pointer'
              }}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredQ.map((q, idx) => {
          const uAns = userAnswers[q.id]
          const isAns = uAns !== undefined
          const isCorr = uAns === q.correctIndex

          return (
            <div key={q.id} style={{ background: '#0D1B2A', padding: 16, borderRadius: 12, border: '1px solid #1E293B' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{ background: '#1A56DB', color: '#FFF', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}>
                  {q.exam}
                </span>
                <span style={{ background: '#0284C7', color: '#FFF', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}>
                  {q.subject} • {q.topic}
                </span>
                <span style={{ background: '#334155', color: '#F5A623', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>
                  {q.difficulty}
                </span>
              </div>

              <div style={{ fontSize: 14, color: '#F1F5F9', marginBottom: 12 }}>
                Question {idx + 1}: {q.question}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                {q.options.map((opt, oIdx) => {
                  let btnBg = '#1E293B'
                  let btnBorder = '#334155'
                  let btnCol = '#CBD5E1'

                  if (isAns) {
                    if (oIdx === q.correctIndex) {
                      btnBg = 'rgba(34,197,94,0.2)'
                      btnBorder = '#22C55E'
                      btnCol = '#4ADE80'
                    } else if (oIdx === uAns) {
                      btnBg = 'rgba(239,68,68,0.2)'
                      btnBorder = '#EF4444'
                      btnCol = '#FCA5A5'
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => !isAns && handleAnswer(q.id, oIdx)}
                      disabled={isAns}
                      style={{
                        textAlign: 'left', padding: '10px 14px', borderRadius: 8, fontSize: 13,
                        background: btnBg, border: `1px solid ${btnBorder}`, color: btnCol,
                        cursor: isAns ? 'default' : 'pointer'
                      }}
                    >
                      {String.fromCharCode(65 + oIdx)}. {opt}
                    </button>
                  )
                })}
              </div>

              {isAns && (
                <div style={{ padding: 12, borderRadius: 8, background: isCorr ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${isCorr ? '#22C55E' : '#EF4444'}` }}>
                  <div style={{ fontWeight: 800, color: isCorr ? '#22C55E' : '#EF4444', marginBottom: 4 }}>
                    {isCorr ? '✅ Correct Answer!' : '❌ Incorrect Answer'}
                  </div>
                  <div style={{ fontSize: 12, color: '#CBD5E1', marginBottom: 8 }}>
                    💡 <strong>Solution:</strong> {q.explanation}
                  </div>

                  {!isCorr && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: '#94A3B8' }}>Log mistake type:</span>
                      {(['C1','C2','C3','C4','C5'] as ErrorType[]).map(errType => (
                        <button
                          key={errType}
                          onClick={() => handleLogError(q, errType)}
                          style={{ background: '#EF4444', border: 'none', color: '#FFF', borderRadius: 4, padding: '2px 6px', fontSize: 10, fontWeight: 800, cursor: 'pointer' }}
                        >
                          + {errType}
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
    </div>
  )
}
