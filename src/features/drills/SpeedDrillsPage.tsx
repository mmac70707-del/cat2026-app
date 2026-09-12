import { useState } from 'react'
import { useToast } from '@/components/Toast'

interface DrillCard {
  prompt: string
  answer: string
  hint: string
}

const FRACTION_DRILLS: DrillCard[] = [
  { prompt: '1 / 7 = ? %', answer: '14.28%', hint: 'Think: 14 × 2 = 28' },
  { prompt: '1 / 8 = ? %', answer: '12.5%', hint: 'Half of 1/4 (25%)' },
  { prompt: '1 / 9 = ? %', answer: '11.11%', hint: 'Recurring 1s' },
  { prompt: '1 / 11 = ? %', answer: '9.09%', hint: '9s table' },
  { prompt: '1 / 13 = ? %', answer: '7.69%', hint: 'Around 7.7%' },
  { prompt: '1 / 14 = ? %', answer: '7.14%', hint: 'Half of 1/7' },
  { prompt: '1 / 16 = ? %', answer: '6.25%', hint: 'Half of 1/8' }
]

const SQUARE_DRILLS: DrillCard[] = [
  { prompt: '19² = ?', answer: '361', hint: '(20-1)² = 400 - 40 + 1' },
  { prompt: '23² = ?', answer: '529', hint: 'Around 530' },
  { prompt: '29² = ?', answer: '841', hint: '(30-1)² = 900 - 60 + 1' },
  { prompt: '31² = ?', answer: '961', hint: 'Just over 900' },
  { prompt: '12³ = ?', answer: '1728', hint: 'Ramanujan taxicab number!' },
  { prompt: '15³ = ?', answer: '3375', hint: 'Ends in 375' }
]

export function SpeedDrillsPage({ onBack }: { onBack?: () => void }) {
  const [category, setCategory]       = useState<'fractions' | 'squares'>('fractions')
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [showAnswer, setShowAnswer]   = useState<boolean>(false)
  const { show: toast }               = useToast()

  const list = category === 'fractions' ? FRACTION_DRILLS : SQUARE_DRILLS
  const currentCard = list[currentIndex] || list[0]

  const handleNext = () => {
    setShowAnswer(false)
    setCurrentIndex(prev => (prev + 1) % list.length)
  }

  const handleKnown = () => {
    toast('⚡ Mastered card! Keep speeding up.', '#22C55E')
    handleNext()
  }

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: '0 auto', color: '#E2E8F0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#22C55E', margin: 0 }}>
            ⚡ MAT-Q Daily Speed Drills
          </h1>
          <p style={{ fontSize: 13, color: '#94A3B8', margin: '4px 0 0' }}>
            5-minute daily mental math & calculation speed flashcards
          </p>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ background: 'none', border: '1px solid #334155', color: '#94A3B8', borderRadius: 20, padding: '6px 16px', fontSize: 12, cursor: 'pointer' }}>
            ← Back
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => { setCategory('fractions'); setCurrentIndex(0); setShowAnswer(false) }}
          style={{
            flex: 1, padding: '10px', borderRadius: 8, fontSize: 12, fontWeight: 800,
            background: category === 'fractions' ? '#22C55E' : '#1E293B',
            color: category === 'fractions' ? '#FFF' : '#94A3B8', border: 'none', cursor: 'pointer'
          }}
        >
          % Fractions (1/7 to 1/16)
        </button>
        <button
          onClick={() => { setCategory('squares'); setCurrentIndex(0); setShowAnswer(false) }}
          style={{
            flex: 1, padding: '10px', borderRadius: 8, fontSize: 12, fontWeight: 800,
            background: category === 'squares' ? '#22C55E' : '#1E293B',
            color: category === 'squares' ? '#FFF' : '#94A3B8', border: 'none', cursor: 'pointer'
          }}
        >
          Squares & Cubes
        </button>
      </div>

      {/* Interactive Flashcard */}
      <div style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1E293B 100%)', padding: 24, borderRadius: 16, border: '1px solid #334155', textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8 }}>
          Card {currentIndex + 1} of {list.length}
        </div>

        <div style={{ fontSize: 32, fontWeight: 900, color: '#F1F5F9', margin: '16px 0' }}>
          {currentCard.prompt}
        </div>

        {showAnswer ? (
          <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid #22C55E', padding: 16, borderRadius: 10, margin: '16px 0' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#4ADE80' }}>
              {currentCard.answer}
            </div>
            <div style={{ fontSize: 12, color: '#CBD5E1', marginTop: 4 }}>
              💡 Hint: {currentCard.hint}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAnswer(true)}
            style={{
              padding: '10px 20px', borderRadius: 20, background: '#F5A623',
              color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer', margin: '16px 0'
            }}
          >
            👁️ Reveal Answer
          </button>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 12 }}>
          <button
            onClick={handleKnown}
            style={{ padding: '8px 16px', borderRadius: 8, background: '#22C55E', color: '#FFF', fontWeight: 800, border: 'none', cursor: 'pointer' }}
          >
            ✅ I Knew This
          </button>
          <button
            onClick={handleNext}
            style={{ padding: '8px 16px', borderRadius: 8, background: '#334155', color: '#94A3B8', fontWeight: 700, border: 'none', cursor: 'pointer' }}
          >
            ➡️ Next Card
          </button>
        </div>
      </div>
    </div>
  )
}
