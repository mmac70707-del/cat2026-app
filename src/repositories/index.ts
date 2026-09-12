import { dbGet, dbGetAll, dbPut, dbClear } from '@/db'
import type { MockRecord, MockAnalysis, DailyScore } from '@/types'

// ── Mock Repository ──────────────────────────────────
export const MockRepository = {
  async log(obj: { name: string; date: string } & MockAnalysis): Promise<MockRecord> {
    const record: MockRecord = {
      id: `mock_${Date.now()}`,
      ...obj,
      createdAt: new Date().toISOString(),
    }
    await dbPut('mocks', record)
    return record
  },

  async getAll(): Promise<MockRecord[]> {
    return dbGetAll<MockRecord>('mocks')
  },
}

// ── Daily Score Repository ───────────────────────────
export const DailyScoreRepository = {
  async log(date: string, studyHrs: number, screenHrs: number, accuracyPct: number): Promise<void> {
    const record: DailyScore = {
      date,
      studyHrs,
      screenHrs,
      accuracyPct,
      loggedAt: new Date().toISOString(),
    }
    await dbPut('dailyScores', record)
  },

  async get(date: string): Promise<DailyScore | null> {
    return dbGet<DailyScore>('dailyScores', date)
  },

  async getAll(): Promise<DailyScore[]> {
    return dbGetAll<DailyScore>('dailyScores')
  },

  async getLast7(): Promise<DailyScore[]> {
    const all = await this.getAll()
    return all.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7)
  },
}

// ── Settings Repository ──────────────────────────────
export const SettingsRepository = {
  async get<T = boolean>(key: string, defaultVal: T): Promise<T> {
    const r = await dbGet<{ key: string; value: T }>('settings', key)
    return r ? r.value : defaultVal
  },

  async set<T>(key: string, value: T): Promise<void> {
    await dbPut('settings', { key, value })
  },
}

// ── Reset all stores (Settings page) ─────────────────
export async function resetAllData(): Promise<void> {
  for (const store of ['tasks', 'errors', 'masteryTopics', 'mocks', 'dailyScores', 'settings']) {
    await dbClear(store)
  }
}
