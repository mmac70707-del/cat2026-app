import { useState, useEffect, useMemo } from 'react'
import { useToast } from '@/components/Toast'
import { FORMULA_CARDS } from '@/data/formulaCards'
import { FormulaRepository } from '@/repositories/FormulaRepository'
import { todayKey } from '@/services/domain'
import type { FormulaReview } from '@/types'

export function FormulaDeckPage({ onBack }: { onBack?: () => void }) {
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL')
  const [currentIndex, setCurrentIndex]       = useState<number>(0)
  const [isFlipped, setIsFlipped]             = useState<boolean>(false)
  const [reviews, setReviews]                 = useState<FormulaReview[]>([])
  const [loading, setLoading]                 = useState(true)
  const { show: toast }                       = useToast()

  useEffect(() => {
    FormulaRepository.getAll().then(r => { setReviews(r); setLoading(false) })
  }, [])

  const reviewMap = useMemo(() => {
    const m = new Map<string, FormulaReview>()
    reviews.forEach(r => m.set(r.cardId, r))
    return m
  }, [reviews])

  const isDue = (cardId: string) => {
    const r = reviewMap.get(cardId)
    return !r || r.nextReviewDate <= todayKey()
  }

  const subjectFiltered = FORMULA_CARDS.filter(c => selectedSubject === 'ALL' || c.subject === selectedSubject)
  // Due-today cards surface first — this is what makes it real spaced
  // repetition rather than a fixed loop through every card every time.
  const dueList  = subjectFiltered.filter(c => isDue(c.id))
  const restList = subjectFiltered.filter(c => !isDue(c.id))
  const list = [...dueList, ...restList]
  const card = list[currentIndex] || list[0]
  const dueTodayCount = dueList.length

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentIndex(prev => (prev + 1) % list.length)
  }

  async function handleRating(difficulty: 'Easy' | 'Medium' | 'Hard') {
    if (!card) return
    const updated = await FormulaRepository.recordRating(card.id, difficulty)
    setReviews(prev => [...prev.filter(r => r.cardId !== card.id), updated])
    const days = updated.boxLevel === 1 ? 'tomorrow' : `in ${updated.boxLevel >= 5 ? 30 : updated.boxLevel >= 4 ? 14 : updated.boxLevel >= 3 ? 7 : 3} days`
    if (difficulty === 'Easy')   toast(`✅ Saved — next review ${days}`, '#22C55E')
    if (difficulty === 'Medium') toast(`⚡ Saved — next review ${days}`, '#F5A623')
    if (difficulty === 'Hard')   toast('🔴 Saved — back in the deck tomorrow', '#EF4444')
    handleNext()
  }

  if (loading) {
    return <div style={{ padding: 16, color: '#94A3B8', textAlign: 'center' }}>Loading revision deck…</div>
  }

  return (
    <div style={{ padding: 16, maxWidth: 650, margin: '0 auto', color: '#E2E8F0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#F5A623', margin: 0 }}>
            🎴 Revision Deck — Spaced Repetition
          </h1>
          <p style={{ fontSize: 13, color: '#94A3B8', margin: '4px 0 0' }}>
            All 38 Tier-1/Tier-2 syllabus topics · {dueTodayCount} due today
          </p>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ background: 'none', border: '1px solid #334155', color: '#94A3B8', borderRadius: 20, padding: '6px 16px', fontSize: 12, cursor: 'pointer' }}>
            ← Back
          </button>
        )}
      </div>

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

      {!card ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}>No cards in this filter.</div>
      ) : (
        <>
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              minHeight: 240, background: 'linear-gradient(135deg, #0D1B2A 0%, #1E293B 100%)',
              padding: 24, borderRadius: 16,
              border: `1px solid ${isDue(card.id) ? '#F5A623' : '#38BDF8'}`, textAlign: 'center',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              cursor: 'pointer', marginBottom: 16, position: 'relative', whiteSpace: 'pre-line'
            }}
          >
            <div style={{ position: 'absolute', top: 12, left: 14, fontSize: 10, fontWeight: 800, color: '#38BDF8', background: '#0D1B2A', padding: '2px 8px', borderRadius: 4 }}>
              {card.subject} • {card.topic}
            </div>
            {isDue(card.id) && (
              <div style={{ position: 'absolute', top: 12, right: 14, fontSize: 9, fontWeight: 800, color: '#0A0F1E', background: '#F5A623', padding: '2px 8px', borderRadius: 4 }}>
                DUE TODAY
              </div>
            )}

            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 20 }}>{card.title}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#F1F5F9', margin: '10px 0' }}>
              {isFlipped ? card.back : card.front}
            </div>

            {isFlipped ? (
              <div style={{ fontSize: 12, color: '#4ADE80', background: 'rgba(34,197,94,0.1)', padding: '6px 12px', borderRadius: 6, marginTop: 10 }}>
                💡 {card.tip}
              </div>
            ) : (
              <div style={{ fontSize: 11, color: '#F5A623', fontStyle: 'italic', marginTop: 10 }}>
                👆 Tap to reveal
              </div>
            )}
          </div>

          <div style={{ fontSize: 11, color: '#64748B', textAlign: 'center', marginBottom: 10 }}>
            Card {currentIndex + 1} / {list.length}
          </div>

          {isFlipped && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <button onClick={() => handleRating('Hard')}   style={{ padding: 12, borderRadius: 8, background: '#EF4444', color: '#FFF', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 12 }}>🔴 Hard</button>
              <button onClick={() => handleRating('Medium')} style={{ padding: 12, borderRadius: 8, background: '#F5A623', color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 12 }}>⚡ Medium</button>
              <button onClick={() => handleRating('Easy')}   style={{ padding: 12, borderRadius: 8, background: '#22C55E', color: '#FFF', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 12 }}>✅ Easy</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
