import { dbGet, dbGetAll, dbPut, dbGetByIndex } from '@/db'
import { BLOCKS } from '@/data/config'
import { todayKey, localDateKey } from '@/services/domain'
import { generateDailyTargets } from '@/services/dailyTargetEngine'
import { ErrorRepository } from '@/repositories/ErrorRepository'
import type { Task, TaskStatus, BlockId } from '@/types'

export const TaskRepository = {
  todayKey(): string {
    return todayKey()
  },

  async getTodayTasks(): Promise<Task[]> {
    const date = this.todayKey()
    let tasks = await dbGetByIndex<Task>('tasks', 'byDate', date)

    if (tasks.length === 0) {
      const pendingErrors = await ErrorRepository.getPending()
      const seeded = generateDailyTargets({ dateIso: date, pendingErrors })
      for (const t of seeded) await dbPut('tasks', t)
      return seeded
    }

    return BLOCKS.map(b => tasks.find(t => t.blockId === b.id)).filter(Boolean) as Task[]
  },

  async updateTask(id: string, patch: Partial<Task>): Promise<void> {
    const existing = await dbGet<Task>('tasks', id)
    if (!existing) return
    await dbPut('tasks', { ...existing, ...patch })
  },

  async getWeekTasks(): Promise<Task[]> {
    const now = new Date()
    const day = now.getDay()
    const mon = new Date(now)
    mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
    mon.setHours(0, 0, 0, 0)

    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(mon)
      d.setDate(mon.getDate() + i)
      return localDateKey(d)
    })

    const all = await dbGetAll<Task>('tasks')
    return all.filter(t => dates.includes(t.date))
  },

  async getAllHistorical(): Promise<Task[]> {
    return dbGetAll<Task>('tasks')
  },
}
