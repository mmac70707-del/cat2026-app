import { useStudyTimer } from '@/hooks/index'

export function StudyTimer() {
  const { running, display, start, stop } = useStudyTimer()

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
