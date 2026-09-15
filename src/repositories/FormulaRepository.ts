import { dbGet, dbGetAll, dbPut } from '@/db'
import { localDateKey, todayKey } from '@/services/domain'
import type { FormulaReview } from '@/types'

// Simple, honest Leitner-style intervals — not a research-grade
// algorithm, but real: ratings actually change when a card is next
// shown, persisted to IndexedDB, and survive refresh/restart.
const INTERVAL_DAYS: Record<number, number> = {
  1: 1,   // Hard  → tomorrow
  2: 3,   // Medium → 3 days
  3: 7,   // Easy (first time) → 1 week
  4: 14,
  5: 30,
}

export const FormulaRepository = {
  async getAll(): Promise<FormulaReview[]> {
    return dbGetAll<FormulaReview>('formulaReviews')
  },

  async getForCard(cardId: string): Promise<FormulaReview | null> {
    return dbGet<FormulaReview>('formulaReviews', cardId)
  },

  // A card with no review record yet is due today by definition —
  // callers merge that with getAll() to build the "due today" list.
  async recordRating(cardId: string, rating: 'Hard' | 'Medium' | 'Easy'): Promise<FormulaReview> {
    const existing = await this.getForCard(cardId)
    let boxLevel = existing?.boxLevel ?? 1

    if (rating === 'Hard') boxLevel = 1
    else if (rating === 'Medium') boxLevel = Math.max(2, Math.min(boxLevel, 2))
    else boxLevel = Math.min((existing?.boxLevel ?? 2) + 1, 5) // Easy advances a box, capped

    const intervalDays = INTERVAL_DAYS[boxLevel] ?? 1
    const next = new Date()
    next.setDate(next.getDate() + intervalDays)

    const record: FormulaReview = {
      cardId,
      boxLevel,
      nextReviewDate: localDateKey(next),
      lastRating: rating,
      reviewCount: (existing?.reviewCount ?? 0) + 1,
    }
    await dbPut('formulaReviews', record)
    return record
  },

  async isDueToday(cardId: string, allReviews: FormulaReview[]): Promise<boolean> {
    const review = allReviews.find(r => r.cardId === cardId)
    if (!review) return true // never reviewed = due now
    return review.nextReviewDate <= todayKey()
  },
}
