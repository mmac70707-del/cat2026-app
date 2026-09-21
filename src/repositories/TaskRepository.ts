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
    return this.getTasksForDate(this.todayKey())
  },

  async getTasksForDate(date: string): Promise<Task[]> {
    let existingTasks = await dbGetByIndex<Task>('tasks', 'byDate', date)
    const pendingErrors = await ErrorRepository.getPending()
    const freshTargets = generateDailyTargets({ dateIso: date, pendingErrors })

    if (existingTasks.length === 0) {
      for (const t of freshTargets) await dbPut('tasks', t)
      return freshTargets
    }

    // Merge fresh titles & notes with user's existing status & notes
    const merged: Task[] = []
    for (const fresh of freshTargets) {
      const existing = existingTasks.find(t => t.blockId === fresh.blockId)
      if (existing) {
        // Update title and notes to match the date's exact 44-day syllabus topic if title changed
        const updated: Task = {
          ...existing,
          title: fresh.title,
          notes: existing.notes || fresh.notes,
        }
        await dbPut('tasks', updated)
        merged.push(updated)
      } else {
        await dbPut('tasks', fresh)
        merged.push(fresh)
      }
    }

    return BLOCKS.map(b => merged.find(t => t.blockId === b.id)).filter(Boolean) as Task[]
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

    const result: Task[] = []
    for (const dKey of dates) {
      const dayTasks = await this.getTasksForDate(dKey)
      result.push(...dayTasks)
    }

    return result
  },

  async getAllHistorical(): Promise<Task[]> {
    return dbGetAll<Task>('tasks')
  },
}
