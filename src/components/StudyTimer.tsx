import { useEffect } from 'react'
import { useStudyTimer } from '@/hooks/index'

export function StudyTimer() {
  const { running, display, start, stop } = useStudyTimer()

  useEffect(() => {
    const onStart = () => start()
    const onStop = () => stop()
    window.addEventListener('jarvis:focus:start', onStart)
    window.addEventListener('jarvis:focus:stop', onStop)
    return () => {
      window.removeEventListener('jarvis:focus:start', onStart)
      window.removeEventListener('jarvis:focus:stop', onStop)
    }
  }, [start, stop])

  return (
    <div className="timer-fab">
      {running && (
        <div className="timer-display">{display}</div>
      )}
      <button
        className={`timer-btn ${running ? 'running' : ''}`}
        onClick={running ? stop : start}
        title={running ? 'Stop timer' : 'Start study timer'}
      >
        ⏱️
      </button>
    </div>
  )
}
