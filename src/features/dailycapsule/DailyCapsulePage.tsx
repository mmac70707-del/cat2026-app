import { useState } from 'react'
import { useToast } from '@/components/Toast'

interface DailyBrief {
  id: string
  briefNumber: number
  date: string
  subject: 'VARC' | 'LRDI' | 'QA'
  title: string
  targetTimeMin: number
  pdfName: string
  passageText?: string
  questions: {
    question: string
    options: string[]
    correctIndex: number
    explanation: string
  }[]
}

const BRIEFS: DailyBrief[] = [
  {
    id: 'db-35',
    briefNumber: 35,
    date: 'TODAY',
    subject: 'VARC',
    title: 'Daily Execution Brief #35 — RC Philosophy & Critical Reasoning',
    targetTimeMin: 15,
    pdfName: '1788495345869-EXECUTION-BRIEF-(35).pdf',
    passageText: 'Philosophical inquiry often challenges common sense by questioning fundamental assumptions about reality, knowledge, and morality. While common sense provides a pragmatic framework for daily survival, it frequently relies on unexamined biases and cultural conditioning. Philosophy subjects these tacit beliefs to rigorous logical scrutiny.',
    questions: [
      {
        question: 'According to the passage, why does philosophy challenge common sense?',
        options: [
          'Because common sense is completely useless for daily survival',
          'Because common sense relies on unexamined biases and tacit beliefs',
          'Because philosophy prefers pragmatic frameworks over logic',
          'Because cultural conditioning makes common sense morally superior'
        ],
        correctIndex: 1,
        explanation: 'The passage explicitly states that common sense relies on unexamined biases and cultural conditioning, which philosophy subjects to scrutiny.'
      }
    ]
  },
  {
    id: 'db-19',
    briefNumber: 19,
    date: 'Yesterday',
    subject: 'LRDI',
    title: 'Daily Execution Brief #19 — Matrix Distribution & Ranking Set',
    targetTimeMin: 20,
    pdfName: '1786941891031-EXECUTION-BRIEF-(19).pdf',
    questions: [
      {
        question: 'Five executives P, Q, R, S, T travel to 5 cities. P does not go to Delhi or Mumbai. Q goes to Bangalore. R goes to Mumbai. Which city does P go to if S goes to Delhi and T goes to Chennai?',
        options: ['Hyderabad', 'Delhi', 'Mumbai', 'Bangalore'],
        correctIndex: 0,
        explanation: 'Given cities: Delhi (S), Mumbai (R), Bangalore (Q), Chennai (T). The remaining city for P is Hyderabad.'
      }
    ]
  },
  {
    id: 'db-4',
    briefNumber: 4,
    date: '3 Days Ago',
    subject: 'QA',
    title: 'Daily Execution Brief #4 — Arithmetic & Ratio Shortcuts',
    targetTimeMin: 12,
    pdfName: '1785210819292-EXECUTION-BRIEF-(4).pdf',
    questions: [
      {
        question: 'A sum of money doubles itself at simple interest in 8 years. In how many years will it become 4 times itself?',
        options: ['16 years', '24 years', '32 years', '12 years'],
        correctIndex: 1,
        explanation: 'Simple interest earned in 8 yrs = 100% of P (to double). To become 4 times, interest needed = 300% of P. Time = 3 × 8 = 24 years.'
      }
    ]
  }
]

export function DailyCapsulePage({ onBack }: { onBack?: () => void }) {
  const [selectedSubject, setSelectedSubject] = useState<'ALL' | 'VARC' | 'LRDI' | 'QA'>('ALL')
  const [activeBriefId, setActiveBriefId]     = useState<string>('db-35')
  const [userAnswers, setUserAnswers]         = useState<Record<string, number>>({})
  const { show: toast }                       = useToast()

  const filteredBriefs = BRIEFS.filter(c => selectedSubject === 'ALL' || c.subject === selectedSubject)
  const activeBrief    = BRIEFS.find(c => c.id === activeBriefId) || BRIEFS[0]

  const handleAnswerSelect = (qIdx: number, optIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [`${activeBrief.id}_${qIdx}`]: optIdx }))
    toast('Response submitted! Solution unlocked.', '#38BDF8')
  }

  const handleDownloadPDF = (brief: DailyBrief) => {
    toast(`📥 Downloaded ${brief.title} PDF!`, '#22C55E')
  }

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: '0 auto', color: '#E2E8F0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>📰</span>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#F5A623', margin: 0 }}>
              Daily Execution Briefs & Practice Sprints
            </h1>
          </div>
          <p style={{ fontSize: 13, color: '#94A3B8', margin: '4px 0 0' }}>
            Daily curated RC passages, DILR logic sets, Quant speed briefs, and downloadable PDF study guides
          </p>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ background: 'none', border: '1px solid #334155', color: '#94A3B8', borderRadius: 20, padding: '6px 16px', fontSize: 12, cursor: 'pointer' }}>
            ← Back
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ background: '#0D1B2A', padding: 12, borderRadius: 12, border: '1px solid #1E293B', marginBottom: 16, display: 'flex', gap: 8, overflowX: 'auto' }}>
        {(['ALL', 'VARC', 'LRDI', 'QA'] as const).map(sub => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            style={{
              padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 800,
              border: selectedSubject === sub ? '1px solid #F5A623' : '1px solid #334155',
              background: selectedSubject === sub ? '#1A56DB' : '#1E293B',
              color: selectedSubject === sub ? '#FFF' : '#94A3B8', cursor: 'pointer'
            }}
          >
            {sub === 'ALL' ? '🌐 All Execution Briefs' : `${sub} Briefs`}
          </button>
        ))}
      </div>

      {/* Main Grid Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>
        {/* Left List Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#F5A623' }}>
            Briefs History ({filteredBriefs.length})
          </div>

          {filteredBriefs.map(c => (
            <div
              key={c.id}
              onClick={() => setActiveBriefId(c.id)}
              style={{
                background: c.id === activeBrief.id ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' : '#0D1B2A',
                border: c.id === activeBrief.id ? '1px solid #F5A623' : '1px solid #1E293B',
                padding: 12, borderRadius: 10, cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 800, background: '#1A56DB', color: '#FFF', padding: '2px 6px', borderRadius: 4 }}>
                  #{c.briefNumber} • {c.subject}
                </span>
                <span style={{ fontSize: 10, color: '#94A3B8' }}>{c.date}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#F1F5F9' }}>
                {c.title}
              </div>
            </div>
          ))}
        </div>

        {/* Right Active Brief Workspace */}
        <div style={{ background: '#0D1B2A', padding: 20, borderRadius: 12, border: '1px solid #1E293B' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#F5A623', background: 'rgba(245,166,35,0.1)', padding: '2px 8px', borderRadius: 4 }}>
                Daily Brief #{activeBrief.briefNumber} • {activeBrief.subject}
              </span>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#F1F5F9', margin: '6px 0 2px' }}>
                {activeBrief.title}
              </h2>
            </div>

            <button
              onClick={() => handleDownloadPDF(activeBrief)}
              style={{ background: '#22C55E', color: '#FFF', fontWeight: 800, border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}
            >
              📄 Download PDF Guide ({activeBrief.pdfName.slice(-12)})
            </button>
          </div>

          {/* Reading Passage snippet if VARC */}
          {activeBrief.passageText && (
            <div style={{ background: '#1E293B', padding: 14, borderRadius: 8, fontSize: 13, color: '#CBD5E1', lineHeight: 1.6, marginBottom: 16, borderLeft: '3px solid #38BDF8' }}>
              <strong>📖 Reading Comprehension Passage:</strong>
              <p style={{ margin: '6px 0 0' }}>{activeBrief.passageText}</p>
            </div>
          )}

          {/* Practice Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {activeBrief.questions.map((q, qIdx) => {
              const uAns = userAnswers[`${activeBrief.id}_${qIdx}`]
              const isAns = uAns !== undefined
              const isCorr = uAns === q.correctIndex

              return (
                <div key={qIdx} style={{ background: '#1E293B', padding: 16, borderRadius: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9', marginBottom: 10 }}>
                    Question {qIdx + 1}: {q.question}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                    {q.options.map((opt, oIdx) => {
                      let btnBg = '#0D1B2A'
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
                          onClick={() => !isAns && handleAnswerSelect(qIdx, oIdx)}
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
                      <div style={{ fontSize: 12, color: '#CBD5E1' }}>
                        💡 <strong>Explanation:</strong> {q.explanation}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
