import { useEffect, useMemo, useState } from 'react'
import type { SubPage } from '@/app/App'

type Command = {
  id: string
  label: string
  hint: string
  keywords: string
  run: () => void
}

interface Props {
  onNavigate: (page: SubPage | 'today') => void
}

export function JarvisCommandPalette({ onNavigate }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }

    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('jarvis:command-palette', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('jarvis:command-palette', onOpen)
    }
  }, [])

  const commands = useMemo<Command[]>(() => [
    { id: 'today', label: "Open Today's Command", hint: 'CAT mission', keywords: 'today mission command cat', run: () => onNavigate('today') },
    { id: 'jarvis', label: 'JARVIS Command Center', hint: 'system core', keywords: 'jarvis radar core command center', run: () => onNavigate('jarvis') },
    { id: 'focus', label: 'Start Focus Core', hint: 'timer + Today', keywords: 'focus timer study deep work', run: () => {
      window.dispatchEvent(new Event('jarvis:focus:start'))
      onNavigate('today')
    }},
    { id: 'errors', label: 'Open Error Diagnostics', hint: 'C1–C5', keywords: 'errors error log c1 c2 c3 c4 c5 repair', run: () => onNavigate('errors') },
    { id: 'repair', label: 'Open Repair Queue', hint: 'fix weaknesses', keywords: 'repair queue weak fix', run: () => onNavigate('repair') },
    { id: 'retest', label: 'Open Retest System', hint: 'confirm mastery', keywords: 'retest mastery test', run: () => onNavigate('retest') },
    { id: 'mock', label: 'Open Mock Analytics', hint: 'performance', keywords: 'mock analytics score performance', run: () => onNavigate('mockana') },
    { id: 'adaptive', label: 'Open Adaptive Brain', hint: 'weakness engine', keywords: 'adaptive brain heatmap', run: () => onNavigate('adaptive') },
    { id: 'research', label: 'Open Research Lab', hint: 'deep research', keywords: 'research lab web knowledge', run: () => onNavigate('research') },
    { id: 'more', label: 'Open Command Library', hint: 'all systems', keywords: 'more menu command library', run: () => onNavigate('more') },
    { id: 'lock', label: 'Lock JARVIS', hint: 'security', keywords: 'lock security panic', run: () => window.dispatchEvent(new Event('jarvis:lock')) },
  ], [onNavigate])

  const visible = commands.filter(c => {
    const q = query.trim().toLowerCase()
    return !q || `${c.label} ${c.hint} ${c.keywords}`.toLowerCase().includes(q)
  })

  function choose(command: Command) {
    setOpen(false)
    setQuery('')
    command.run()
  }

  return (
    <>
      <button
        className="jarvis-command-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open JARVIS command palette"
        title="JARVIS Command Palette"
      >
        <span>⌘</span>
        <small>CMD</small>
      </button>

      {open && (
        <div className="jarvis-command-backdrop" onMouseDown={() => setOpen(false)}>
          <div className="jarvis-command-palette" role="dialog" aria-modal="true" aria-label="JARVIS command palette" onMouseDown={e => e.stopPropagation()}>
            <div className="jarvis-command-header">
              <div>
                <div className="jarvis-command-kicker">JARVIS // COMMAND BUS</div>
                <div className="jarvis-command-sub">Choose an action. No unrestricted device commands.</div>
              </div>
              <button className="jarvis-command-close" onClick={() => setOpen(false)} aria-label="Close">ESC</button>
            </div>

            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search mission, errors, focus, radar…"
              className="jarvis-command-search"
            />

            <div className="jarvis-command-list">
              {visible.map((command, index) => (
                <button key={command.id} className="jarvis-command-item" onClick={() => choose(command)}>
                  <span className="jarvis-command-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="jarvis-command-copy">
                    <b>{command.label}</b>
                    <small>{command.hint}</small>
                  </span>
                  <span className="jarvis-command-arrow">↵</span>
                </button>
              ))}
              {visible.length === 0 && (
                <div className="jarvis-command-empty">NO COMMAND MATCHES</div>
              )}
            </div>

            <div className="jarvis-command-footer">
              <span>CTRL / CMD + K</span>
              <span>ESC CLOSE</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
