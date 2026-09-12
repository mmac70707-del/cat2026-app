import { dbGet, dbGetAll, dbPut, dbGetByIndex } from '@/db'
import { BLOCKS } from '@/data/config'
import type { Task, TaskStatus, BlockId } from '@/types'

export const TaskRepository = {
  todayKey(): string {
    return new Date().toISOString().slice(0, 10)
  },

  async getTodayTasks(): Promise<Task[]> {
    const date = this.todayKey()
    let tasks = await dbGetByIndex<Task>('tasks', 'byDate', date)

    if (tasks.length === 0) {
      const seeded: Task[] = BLOCKS.map(b => ({
        id: `${date}_${b.id}`,
        date,
        blockId: b.id as BlockId,
        subject: b.label,
        title: b.name,
        status: 'TODO' as TaskStatus,
        startedAt: null,
        completedAt: null,
        timeSpentMin: null,
        notes: '',
      }))
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
      return d.toISOString().slice(0, 10)
    })

    const all = await dbGetAll<Task>('tasks')
    return all.filter(t => dates.includes(t.date))
  },

  async getAllHistorical(): Promise<Task[]> {
    return dbGetAll<Task>('tasks')
  },
}
