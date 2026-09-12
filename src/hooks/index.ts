import { useState, useEffect, useCallback, useRef } from 'react'
import { ErrorRepository } from '@/repositories/ErrorRepository'
import { TaskRepository } from '@/repositories/TaskRepository'
import { MockRepository, DailyScoreRepository } from '@/repositories/index'
import type { ErrorRecord, ErrorType, QuickStats } from '@/types'

// ── useErrors ────────────────────────────────────────
export function useErrors() {
  const [errors, setErrors]   = useState<ErrorRecord[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const all = await ErrorRepository.getAll()
    setErrors(all.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const logError = useCallback(async (obj: {
    errorType: ErrorType
    subject: string
    topic: string
    wrongReason: string
    correctMethod: string
    preventionRule: string
  }) => {
    await ErrorRepository.log(obj)
    await load()
  }, [load])

  const markRepaired = useCallback(async (id: string) => {
    await ErrorRepository.markRepaired(id)
    await load()
  }, [load])

  const retestPass = useCallback(async (id: string) => {
    await ErrorRepository.markRetestPassed(id)
    await load()
  }, [load])

  const retestFail = useCallback(async (id: string) => {
    await ErrorRepository.markRetestFailed(id)
    await load()
  }, [load])

  const pending      = errors.filter(e => e.repairStatus === 'PENDING')
  const inRetest     = errors.filter(e => e.repairStatus === 'DONE' && e.retestStatus === 'PENDING')
  const counts       = errors.reduce((acc, e) => {
    acc[e.errorType] = (acc[e.errorType] || 0) + 1
    return acc
  }, {} as Record<ErrorType, number>)

  return { errors, loading, pending, inRetest, counts, logError, markRepaired, retestPass, retestFail, reload: load }
}

// ── useStudyTimer (session-only, not persisted) ───────
export function useStudyTimer() {
  const [running, setRunning]   = useState(false)
  const [elapsed, setElapsed]   = useState(0)   // seconds
  const startRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)

  const start = useCallback(() => {
    startRef.current = Date.now()
    setRunning(true)
    intervalRef.current = window.setInterval(() => {
      if (startRef.current) {
        setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
      }
    }, 1000)
  }, [])

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    stop()
    setElapsed(0)
    startRef.current = null
  }, [stop])

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }

  return { running, elapsed, display: fmt(elapsed), start, stop, reset }
}

// ── useQuickStats ─────────────────────────────────────
export function useQuickStats() {
  const [stats, setStats]   = useState<QuickStats | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const [tasks, errors, mocks, scores] = await Promise.all([
      TaskRepository.getTodayTasks(),
      ErrorRepository.getAll(),
      MockRepository.getAll(),
      DailyScoreRepository.getLast7(),
    ])
    const blocksDone    = tasks.filter(t => t.status === 'DONE').length
    const repairPending = errors.filter(e => e.repairStatus === 'PENDING').length
    const retestPending = errors.filter(e => e.repairStatus === 'DONE' && e.retestStatus === 'PENDING').length
    const lastAcc       = scores[0]?.accuracyPct ?? null

    setStats({ blocksDone, totalErrors: errors.length, mocksLogged: mocks.length, lastAccuracy: lastAcc, repairPending, retestPending })
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  return { stats, loading, reload: load }
}
