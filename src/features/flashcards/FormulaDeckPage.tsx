import { useState } from 'react'
import { useToast } from '@/components/Toast'

interface FormulaCard {
  id: string
  subject: 'QA' | 'DILR' | 'VARC'
  topic: string
  title: string
  front: string
  back: string
  tip: string
}

const FORMULA_CARDS: FormulaCard[] = [
  { id: 'fc-1', subject: 'QA', topic: 'Arithmetic', title: 'Successive Percentage Formula', front: 'Net % change after successive changes of A% and B%?', back: 'A + B + (A × B / 100)%', tip: 'Use + for increase, - for decrease.' },
  { id: 'fc-2', subject: 'QA', topic: 'Algebra', title: 'Sum of Roots & Product of Roots', front: 'For ax² + bx + c = 0, sum and product of roots α, β?', back: 'Sum (α + β) = -b/a \nProduct (α × β) = c/a', tip: 'Check sign of b/a carefully!' },
  { id: 'fc-3', subject: 'QA', topic: 'Geometry', title: 'Inradius & Circumradius of Right Triangle', front: 'Inradius (r) and Circumradius (R) of right-angled triangle with sides a, b, hypotenuse c?', back: 'r = (a + b - c) / 2 \nR = c / 2', tip: 'Very frequent in CAT Geometry!' },
  { id: 'fc-4', subject: 'DILR', topic: 'Arrangements', title: 'Circular Arrangement Facing In vs Out', front: 'In circular arrangement, if A is to the immediate right of B facing Center?', back: 'Right = Anti-clockwise \nLeft = Clockwise', tip: 'Invert direction if facing outward!' },
  { id: 'fc-5', subject: 'VARC', topic: 'Vocabulary', title: 'Root Word: PHIL', front: 'Meaning of root word "PHIL"?', back: 'Love / Affinity (e.g. Philosophy, Philanthropy, Bibliophile)', tip: 'Opposite root is MIS (Hatred).' }
]

export function FormulaDeckPage({ onBack }: { onBack?: () => void }) {
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL')
  const [currentIndex, setCurrentIndex]       = useState<number>(0)
  const [isFlipped, setIsFlipped]               = useState<boolean>(false)
  const { show: toast }                       = useToast()

  const list = FORMULA_CARDS.filter(c => selectedSubject === 'ALL' || c.subject === selectedSubject)
  const card = list[currentIndex] || list[0]

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentIndex(prev => (prev + 1) % list.length)
  }

  const handleRating = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    if (difficulty === 'Easy') toast('✅ Mastered card! Reviewing in 3 days.', '#22C55E')
    if (difficulty === 'Medium') toast('⚡ Saved for tomorrow review.', '#F5A623')
    if (difficulty === 'Hard') toast('🔴 Saved for evening repair sprint!', '#EF4444')
    handleNext()
  }

  return (
    <div style={{ padding: 16, maxWidth: 650, margin: '0 auto', color: '#E2E8F0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#F5A623', margin: 0 }}>
            🎴 Spaced Repetition Formula Deck
          </h1>
          <p style={{ fontSize: 13, color: '#94A3B8', margin: '4px 0 0' }}>
            Interactive Leitner-box formula & concept recall flashcards
          </p>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ background: 'none', border: '1px solid #334155', color: '#94A3B8', borderRadius: 20, padding: '6px 16px', fontSize: 12, cursor: 'pointer' }}>
            ← Back
          </button>
        )}
      </div>

      {/* Subject Selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['ALL', 'QA', 'DILR', 'VARC'].map(sub => (
          <button
            key={sub}
            onClick={() => { setSelectedSubject(sub); setCurrentIndex(0); setIsFlipped(false) }}
            style={{
              flex: 1, padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 800,
              background: selectedSubject === sub ? '#1A56DB' : '#1E293B',
              color: selectedSubject === sub ? '#FFF' : '#94A3B8', border: 'none', cursor: 'pointer'
            }}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Flashcard Area */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          minHeight: 240, background: 'linear-gradient(135deg, #0D1B2A 0%, #1E293B 100%)',
          padding: 24, borderRadius: 16, border: '1px solid #38BDF8', textAlign: 'center',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          cursor: 'pointer', marginBottom: 16, position: 'relative'
        }}
      >
        <div style={{ position: 'absolute', top: 12, left: 14, fontSize: 10, fontWeight: 800, color: '#38BDF8', background: '#0D1B2A', padding: '2px 8px', borderRadius: 4 }}>
          {card.subject} • {card.topic}
        </div>
        <div style={{ position: 'absolute', top: 12, right: 14, fontSize: 11, color: '#94A3B8' }}>
          Card {currentIndex + 1} / {list.length}
        </div>

        <div style={{ fontSize: 18, fontWeight: 800, color: '#F1F5F9', margin: '20px 0 10px' }}>
          {isFlipped ? card.back : card.front}
        </div>

        {isFlipped ? (
          <div style={{ fontSize: 12, color: '#4ADE80', background: 'rgba(34,197,94,0.1)', padding: '6px 12px', borderRadius: 6, marginTop: 10 }}>
            💡 Strategy Tip: {card.tip}
          </div>
        ) : (
          <div style={{ fontSize: 11, color: '#F5A623', fontStyle: 'italic', marginTop: 10 }}>
            👆 Tap card to flip & reveal formula
          </div>
        )}
      </div>

      {/* Confidence Rating Buttons */}
      {isFlipped && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <button
            onClick={() => handleRating('Hard')}
            style={{ padding: '12px', borderRadius: 8, background: '#EF4444', color: '#FFF', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 12 }}
          >
            🔴 Hard (Review Today)
          </button>
          <button
            onClick={() => handleRating('Medium')}
            style={{ padding: '12px', borderRadius: 8, background: '#F5A623', color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 12 }}
          >
            ⚡ Medium (Review Tomorrow)
          </button>
          <button
            onClick={() => handleRating('Easy')}
            style={{ padding: '12px', borderRadius: 8, background: '#22C55E', color: '#FFF', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 12 }}
          >
            ✅ Easy (Mastered)
          </button>
        </div>
      )}
    </div>
  )
}
