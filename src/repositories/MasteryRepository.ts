import { dbGet, dbGetAll, dbPut } from '@/db'
import { MASTER_TOPICS } from '@/data/config'
import type { MasteryTopic, MasteryLevel } from '@/types'

export const MasteryRepository = {
  async init(): Promise<void> {
    const existing = await dbGetAll<MasteryTopic>('masteryTopics')
    if (existing.length > 0) return

    const topics: MasteryTopic[] = []
    for (const [subject, list] of Object.entries(MASTER_TOPICS) as ['QA'|'DILR'|'VARC', typeof MASTER_TOPICS['QA']][]) {
      list.forEach(t =>
        topics.push({
          id: t.id,
          subject,
          name: t.name,
          tier: t.tier,
          currentLevel: 0,
          evidence: [],
          attempts: 0,
          correct: 0,
          lastPracticed: null,
          lastTested: null,
        })
      )
    }
    for (const t of topics) await dbPut('masteryTopics', t)
  },

  async getAll(): Promise<MasteryTopic[]> {
    return dbGetAll<MasteryTopic>('masteryTopics')
  },

  async getBySubject(subject: 'QA' | 'DILR' | 'VARC'): Promise<MasteryTopic[]> {
    const all = await this.getAll()
    return all.filter(t => t.subject === subject)
  },

  async updateLevel(id: string, level: MasteryLevel, evidenceDesc: string): Promise<void> {
    const t = await dbGet<MasteryTopic>('masteryTopics', id)
    if (!t) return
    await dbPut('masteryTopics', {
      ...t,
      currentLevel: level,
      lastTested: new Date().toISOString(),
      evidence: [...(t.evidence || []), {
        date: new Date().toISOString(),
        level,
        description: evidenceDesc,
      }],
    })
  },

  async recordPractice(id: string, attempts: number, correct: number): Promise<void> {
    const t = await dbGet<MasteryTopic>('masteryTopics', id)
    if (!t) return
    const newAttempts = (t.attempts || 0) + attempts
    const newCorrect  = (t.correct  || 0) + correct
    const acc = newAttempts > 0 ? Math.round(newCorrect / newAttempts * 100) : 0

    let autoLevel = t.currentLevel
    if (acc >= 85 && newAttempts >= 30 && autoLevel < 4) autoLevel = 4
    else if (acc >= 75 && newAttempts >= 20 && autoLevel < 3) autoLevel = 3
    else if (acc >= 60 && newAttempts >= 10 && autoLevel < 2) autoLevel = 2
    else if (newAttempts >= 5 && autoLevel < 1) autoLevel = 1

    await dbPut('masteryTopics', {
      ...t,
      attempts: newAttempts,
      correct: newCorrect,
      currentLevel: autoLevel,
      lastPracticed: new Date().toISOString(),
    })
  },
}
