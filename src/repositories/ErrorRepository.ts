import { dbGet, dbGetAll, dbPut, dbGetByIndex } from '@/db'
import { MasteryRepository } from '@/repositories/MasteryRepository'
import type { ErrorRecord, ErrorType } from '@/types'

export const ErrorRepository = {
  async log(obj: {
    errorType: ErrorType
    subject: string
    topicId: string | null
    topic: string
    wrongReason: string
    correctMethod: string
    preventionRule: string
  }): Promise<ErrorRecord> {
    const id = `err_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`
    const record: ErrorRecord = {
      id,
      errorType: obj.errorType,
      subject: obj.subject,
      topicId: obj.topicId,
      topic: obj.topic,
      wrongReason: obj.wrongReason,
      correctMethod: obj.correctMethod,
      preventionRule: obj.preventionRule,
      repairStatus: 'PENDING',
      retestStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      repairedAt: null,
      retestedAt: null,
    }
    await dbPut('errors', record)
    return record
  },

  async getAll(): Promise<ErrorRecord[]> {
    return dbGetAll<ErrorRecord>('errors')
  },

  async getPending(): Promise<ErrorRecord[]> {
    return dbGetByIndex<ErrorRecord>('errors', 'byRepair', 'PENDING')
  },

  async markRepaired(id: string): Promise<void> {
    const e = await dbGet<ErrorRecord>('errors', id)
    if (!e) return
    await dbPut('errors', {
      ...e,
      repairStatus: 'DONE',
      retestStatus: 'PENDING',
      repairedAt: new Date().toISOString(),
    })
  },

  // Retest now carries REAL evidence (correct / total attempted) instead
  // of a bare pass/fail tap. If the error has a linked topicId (the
  // Error Log form always selects one from the real syllabus now),
  // that evidence is recorded against the actual mastery topic —
  // this is what makes "Retest PASS updates mastery" true rather than
  // decorative. recordPractice's own accuracy+attempt thresholds mean
  // one retest can never fabricate a jump straight to L5.
  async markRetestPassed(id: string, correct: number, total: number): Promise<void> {
    const e = await dbGet<ErrorRecord>('errors', id)
    if (!e) return
    await dbPut('errors', {
      ...e,
      retestStatus: 'PASSED',
      retestedAt: new Date().toISOString(),
    })
    if (e.topicId) {
      await MasteryRepository.recordPractice(e.topicId, total, correct)
    }
  },

  async markRetestFailed(id: string, correct: number, total: number): Promise<void> {
    const e = await dbGet<ErrorRecord>('errors', id)
    if (!e) return
    await dbPut('errors', {
      ...e,
      repairStatus: 'PENDING',
      retestStatus: 'FAILED',
      retestedAt: new Date().toISOString(),
    })
    // A failed retest is still real practice evidence worth recording —
    // low accuracy can't itself trigger a level-up, so this can't
    // fabricate mastery; it just keeps the denominator honest.
    if (e.topicId) {
      await MasteryRepository.recordPractice(e.topicId, total, correct)
    }
  },

  async getTypeCounts(): Promise<Record<ErrorType, number>> {
    const all = await this.getAll()
    const counts: Record<ErrorType, number> = { C1: 0, C2: 0, C3: 0, C4: 0, C5: 0 }
    all.forEach(e => { if (counts[e.errorType] !== undefined) counts[e.errorType]++ })
    return counts
  },
}
