import { useEffect, useMemo, useRef, useState } from 'react'
import { AppIcon } from '@/components/AppIcon'

type ThemeMode = 'dark' | 'light' | 'system'

const STORAGE_KEY = 'cat2026_theme_mode'

function getSystemMode(): 'dark' | 'light' {
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function getSavedMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'dark' || saved === 'light' || saved === 'system') return saved
  } catch {}
  return 'dark'
}

function applyTheme(mode: ThemeMode) {
  const resolved = mode === 'system' ? getSystemMode() : mode
  const root = document.documentElement
  root.dataset.theme = resolved
  root.style.colorScheme = resolved

  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) meta.content = resolved === 'light' ? '#F4F1EA' : '#121411'
}

function iconFor(mode: ThemeMode, resolved: 'dark' | 'light') {
  if (mode === 'light' || resolved === 'light') return <AppIcon name="sun" size={16} strokeWidth={1.9} />
  if (mode === 'dark') return <AppIcon name="moon" size={16} strokeWidth={1.9} />
  return <AppIcon name="monitor" size={16} strokeWidth={1.9} />
}

export function ThemeSwitcher() {
  const [mode, setMode] = useState<ThemeMode>(() => getSavedMode())
  const [resolved, setResolved] = useState<'dark' | 'light'>(() => {
    const saved = getSavedMode()
    return saved === 'system' ? getSystemMode() : saved
  })
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const currentLabel = useMemo(() => {
    if (mode === 'system') return 'SYSTEM'
    return mode === 'light' ? 'LIGHT' : 'DARK'
  }, [mode])

  useEffect(() => {
    applyTheme(mode)
    setResolved(mode === 'system' ? getSystemMode() : mode)

    try { localStorage.setItem(STORAGE_KEY, mode) } catch {}

    if (mode !== 'system' || !window.matchMedia) return
    const media = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => {
      const next = getSystemMode()
      setResolved(next)
      applyTheme('system')
    }
    media.addEventListener?.('change', onChange)
    return () => media.removeEventListener?.('change', onChange)
  }, [mode])

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  function choose(next: ThemeMode) {
    setMode(next)
    setOpen(false)
  }

  return (
    <div className="theme-switcher" ref={ref}>
      <button
        type="button"
        className="theme-switcher-trigger"
        aria-label={`Theme: ${currentLabel}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
      >
        <span className="theme-switcher-trigger-icon">{iconFor(mode, resolved)}</span>
        <span className="theme-switcher-trigger-label">{currentLabel}</span>
        <span className="theme-switcher-chevron" aria-hidden="true">{open ? '⌃' : '⌄'}</span>
      </button>

      {open && (
        <div className="theme-switcher-popover" role="menu" aria-label="Theme options">
          <div className="theme-switcher-head">
            <div>
              <div className="theme-switcher-kicker">APPEARANCE</div>
              <div className="theme-switcher-title">Appearance</div>
            </div>
            <div className="theme-switcher-live">{resolved.toUpperCase()} LIVE</div>
          </div>

          <div className="theme-switcher-options">
            {([
              ['dark', 'Dark', 'Graphite', 'moon'],
              ['light', 'Light', 'Ivory', 'sun'],
              ['system', 'System', 'Follow device', 'monitor'],
            ] as const).map(([value, label, sub, icon]) => (
              <button
                key={value}
                type="button"
                role="menuitemradio"
                aria-checked={mode === value}
                className={`theme-switcher-option ${mode === value ? 'is-active' : ''}`}
                onClick={() => choose(value)}
              >
                <span className="theme-switcher-option-icon" aria-hidden="true"><AppIcon name={icon} size={17} strokeWidth={1.8} /></span>
                <span className="theme-switcher-option-copy">
                  <strong>{label}</strong>
                  <small>{sub}</small>
                </span>
                <span className="theme-switcher-option-check" aria-hidden="true">{mode === value ? '✓' : ''}</span>
              </button>
            ))}
          </div>

          <div className="theme-switcher-foot">
            <AppIcon name="check" size={12} />
            <span>Saved on this device</span>
          </div>
        </div>
      )}
    </div>
  )
}
