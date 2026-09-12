import { useState, useEffect } from 'react'
import { getCountdownParts, getDaysLeft } from '@/services/domain'

export interface CountdownState {
  days: number
  hours: number
  minutes: number
  seconds: number
  hms: string
}

export function useCountdown(): CountdownState {
  const [state, setState] = useState<CountdownState>(() => {
    const p = getCountdownParts()
    return {
      ...p,
      hms: fmt(p.hours) + ':' + fmt(p.minutes) + ':' + fmt(p.seconds),
    }
  })

  useEffect(() => {
    const tick = () => {
      const p = getCountdownParts()
      setState({
        ...p,
        hms: fmt(p.hours) + ':' + fmt(p.minutes) + ':' + fmt(p.seconds),
      })
    }
    const id = setInterval(tick, 1000)
    // Recompute immediately on resume — Android suspends JS timers
    // while backgrounded, so `days` can otherwise show a stale value
    // for up to a second after the user reopens the app.
    document.addEventListener('visibilitychange', tick)
    window.addEventListener('cat2026:resume', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
      window.removeEventListener('cat2026:resume', tick)
    }
  }, [])

  return state
}

function fmt(n: number): string {
  return String(n).padStart(2, '0')
}

// Simple hook for just the days count
export function useDaysLeft(): number {
  const [days, setDays] = useState(getDaysLeft)
  useEffect(() => {
    const id = setInterval(() => setDays(getDaysLeft()), 60_000)
    return () => clearInterval(id)
  }, [])
  return days
}
