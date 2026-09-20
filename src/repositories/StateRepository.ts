import { dbGet, dbPut } from '@/db'
import { CAT_DATE } from '@/data/config'

export interface AppStateRecord {
  key: string;
  catCompleted: boolean;
  interviewPhaseStarted: boolean;
  mbaJoiningConfirmed: boolean;
  activeSevenYearNum: number;
}

export const StateRepository = {
  async getState(): Promise<AppStateRecord> {
    const existing = await dbGet<AppStateRecord>('settings', 'app_state')
    const now = new Date()
    const isCatDatePassed = now.getTime() >= CAT_DATE.getTime()

    if (existing) {
      return {
        ...existing,
        catCompleted: existing.catCompleted || isCatDatePassed
      }
    }

    const defaultState: AppStateRecord = {
      key: 'app_state',
      catCompleted: isCatDatePassed,
      interviewPhaseStarted: false,
      mbaJoiningConfirmed: false,
      activeSevenYearNum: 1,
    }

    await dbPut('settings', defaultState)
    return defaultState
  },

  async startInterviewPhase(): Promise<AppStateRecord> {
    const cur = await this.getState()
    const updated = { ...cur, interviewPhaseStarted: true }
    await dbPut('settings', updated)
    return updated
  },

  async confirmMbaJoining(): Promise<AppStateRecord> {
    const cur = await this.getState()
    const updated = { ...cur, mbaJoiningConfirmed: true, activeSevenYearNum: 2 }
    await dbPut('settings', updated)
    return updated
  },

  async updateActiveYear(yearNum: number): Promise<AppStateRecord> {
    const cur = await this.getState()
    const updated = { ...cur, activeSevenYearNum: yearNum }
    await dbPut('settings', updated)
    return updated
  }
}
