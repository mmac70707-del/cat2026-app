import { dbGet, dbGetAll, dbPut, dbGetByIndex } from '@/db'
import type { ErrorRecord, ErrorType } from '@/types'

export const ErrorRepository = {
  async log(obj: {
    errorType: ErrorType
    subject: string
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

  async markRetestPassed(id: string): Promise<void> {
    const e = await dbGet<ErrorRecord>('errors', id)
    if (!e) return
    await dbPut('errors', {
      ...e,
      retestStatus: 'PASSED',
      retestedAt: new Date().toISOString(),
    })
  },

  async markRetestFailed(id: string): Promise<void> {
    const e = await dbGet<ErrorRecord>('errors', id)
    if (!e) return
    await dbPut('errors', {
      ...e,
      repairStatus: 'PENDING',
      retestStatus: 'FAILED',
      retestedAt: new Date().toISOString(),
    })
  },

  async getTypeCounts(): Promise<Record<ErrorType, number>> {
    const all = await this.getAll()
    const counts: Record<ErrorType, number> = { C1: 0, C2: 0, C3: 0, C4: 0, C5: 0 }
    all.forEach(e => { if (counts[e.errorType] !== undefined) counts[e.errorType]++ })
    return counts
  },
}
