import { lvLabel, lvColor, lvPct } from '@/services/domain'
import type { MasteryTopic } from '@/types'

export function MasteryBar({ topic }: { topic: MasteryTopic }) {
  const lv  = topic.currentLevel
  const pct = lvPct(lv)
  const col = lvColor(lv)
  const acc = topic.attempts > 0
    ? Math.round((topic.correct / topic.attempts) * 100) + '%'
    : '—'

  return (
    <div className="mastery-row" title={`Attempts: ${topic.attempts} · Accuracy: ${acc}`}>
      <div className="mastery-name">{topic.name}</div>
      <div className="mastery-bar-bg">
        <div
          className="mastery-bar-fg"
          style={{ width: `${pct}%`, background: col }}
        />
      </div>
      <div className="mastery-lv" style={{ color: col }}>
        {lvLabel(lv)}
      </div>
    </div>
  )
}
