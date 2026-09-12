import { useState, useEffect, useCallback, useRef } from 'react'
import { TaskRepository } from '@/repositories/TaskRepository'
import type { Task, TaskStatus } from '@/types'

export function useTodayTasks() {
  const [tasks, setTasks]     = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const startTimes = useRef<Record<string, number>>({})

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const t = await TaskRepository.getTodayTasks()
      setTasks(t)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // Daily reset — check every 30s for new calendar day
  useEffect(() => {
    let lastDate = new Date().toDateString()
    const id = setInterval(async () => {
      const today = new Date().toDateString()
      if (today !== lastDate) {
        lastDate = today
        await load()
      }
    }, 30_000)
    return () => clearInterval(id)
  }, [load])

  // Refresh when tab regains focus (web) or app resumes (native)
  useEffect(() => {
    const handler = () => load()
    document.addEventListener('visibilitychange', () => { if (!document.hidden) handler() })
    window.addEventListener('focus', handler)
    window.addEventListener('pageshow', handler)
    window.addEventListener('cat2026:resume', handler)
    return () => {
      document.removeEventListener('visibilitychange', handler)
      window.removeEventListener('focus', handler)
      window.removeEventListener('pageshow', handler)
      window.removeEventListener('cat2026:resume', handler)
    }
  }, [load])

  const updateStatus = useCallback(async (taskId: string, blockId: string, status: TaskStatus) => {
    const patch: Partial<Task> = { status }
    if (status === 'IN_PROGRESS') {
      patch.startedAt = new Date().toISOString()
      startTimes.current[blockId] = Date.now()
    }
    if (status === 'DONE') {
      patch.completedAt = new Date().toISOString()
      const st = startTimes.current[blockId]
      if (st) patch.timeSpentMin = Math.round((Date.now() - st) / 60_000)
    }
    if (status === 'TODO') {
      patch.completedAt = null
      patch.startedAt   = null
    }
    if (status === 'SKIPPED') {
      patch.completedAt = new Date().toISOString()
    }
    await TaskRepository.updateTask(taskId, patch)
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...patch } : t))
  }, [])

  const saveNotes = useCallback(async (taskId: string, notes: string) => {
    await TaskRepository.updateTask(taskId, { notes })
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, notes } : t))
  }, [])

  const done    = tasks.filter(t => t.status === 'DONE').length
  const pct     = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0

  return { tasks, loading, done, pct, updateStatus, saveNotes, reload: load }
}

export function useWeekTasks() {
  const [tasks, setTasks]     = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    TaskRepository.getWeekTasks()
      .then(setTasks)
      .finally(() => setLoading(false))
  }, [])

  const doneBySubject = (subject: string) =>
    tasks.filter(t => t.subject === subject && t.status === 'DONE').length

  const totalDone  = tasks.filter(t => t.status === 'DONE').length
  const total      = tasks.length
  const pct        = total > 0 ? Math.round((totalDone / total) * 100) : 0

  return { tasks, loading, totalDone, total, pct, doneBySubject }
}
