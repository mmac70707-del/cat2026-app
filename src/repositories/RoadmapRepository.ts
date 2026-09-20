import { dbGet, dbPut, dbGetAll } from '@/db'
import { ROADMAP_44 } from '@/data/roadmap44'

export interface ChapterProgress {
  dayNum: number;
  concept: boolean;
  basic: boolean;
  medium: boolean;
  pyq: boolean;
  timed: boolean;
  errorAnalysis: boolean;
  retest: boolean;
  status: 'NOT_STARTED' | 'CURRENT' | 'FIRST_PASS_COMPLETE' | 'MASTERED' | 'EXAM_READY';
}

export const RoadmapRepository = {
  async getChapterProgress(dayNum: number): Promise<ChapterProgress> {
    const existing = await dbGet<ChapterProgress>('roadmap44', dayNum)
    if (existing) return existing

    const item = ROADMAP_44.find(r => r.dayNum === dayNum)
    const todayIso = new Date().toISOString().slice(0, 10)
    const isToday = item ? item.dateIso === todayIso : false

    return {
      dayNum,
      concept: false,
      basic: false,
      medium: false,
      pyq: false,
      timed: false,
      errorAnalysis: false,
      retest: false,
      status: isToday ? 'CURRENT' : 'NOT_STARTED',
    }
  },

  async getAllProgress(): Promise<ChapterProgress[]> {
    const stored = await dbGetAll<ChapterProgress>('roadmap44')
    const storedMap = new Map(stored.map(s => [s.dayNum, s]))

    const todayIso = new Date().toISOString().slice(0, 10)

    return ROADMAP_44.map(r => {
      const s = storedMap.get(r.dayNum)
      if (s) return s
      const isToday = r.dateIso === todayIso
      return {
        dayNum: r.dayNum,
        concept: false,
        basic: false,
        medium: false,
        pyq: false,
        timed: false,
        errorAnalysis: false,
        retest: false,
        status: isToday ? 'CURRENT' : 'NOT_STARTED',
      }
    })
  },

  async updateProgress(prog: ChapterProgress): Promise<void> {
    // Auto calculate status if first pass complete
    const checkCount = [
      prog.concept, prog.basic, prog.medium, prog.pyq,
      prog.timed, prog.errorAnalysis, prog.retest
    ].filter(Boolean).length

    let autoStatus = prog.status
    if (checkCount === 7) {
      if (prog.status !== 'MASTERED' && prog.status !== 'EXAM_READY') {
        autoStatus = 'FIRST_PASS_COMPLETE'
      }
    } else if (checkCount > 0 && prog.status === 'NOT_STARTED') {
      autoStatus = 'CURRENT'
    }

    const updated = { ...prog, status: autoStatus }
    await dbPut('roadmap44', updated)
  }
}
