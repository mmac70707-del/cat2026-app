import { useState, useEffect } from 'react'
import { getCurrentPhase } from '@/services/domain'
import type { Phase } from '@/types'

export function usePhase(): Phase {
  const [phase, setPhase] = useState<Phase>(getCurrentPhase)

  useEffect(() => {
    const check = () => {
      const cur = getCurrentPhase()
      setPhase(prev => (prev.id !== cur.id ? cur : prev))
    }
    // Re-check phase every minute (catches midnight phase transitions),
    // and immediately on resume so a phase boundary crossed while the
    // app was backgrounded/asleep is reflected the instant it reopens.
    const id = setInterval(check, 60_000)
    document.addEventListener('visibilitychange', check)
    window.addEventListener('cat2026:resume', check)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', check)
      window.removeEventListener('cat2026:resume', check)
    }
  }, [])

  return phase
}
