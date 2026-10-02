import { useEffect, useMemo, useRef, useState } from 'react'
import { AppIcon } from '@/components/AppIcon'
import {
  type ThemeMode,
  type TextSize,
  getThemeMode,
  getTextSize,
  isFocusMode,
  applyThemeMode,
  applyTextSize,
  applyFocusMode,
} from '@/services/uiPreferences'

function getSystemMode(): 'dark' | 'light' {
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function iconFor(mode: ThemeMode, resolved: 'dark' | 'light') {
  if (mode === 'light' || resolved === 'light') return <AppIcon name="sun" size={16} strokeWidth={1.9} />
  if (mode === 'dark') return <AppIcon name="moon" size={16} strokeWidth={1.9} />
  return <AppIcon name="monitor" size={16} strokeWidth={1.9} />
}

export function ThemeSwitcher() {
  const [mode, setMode] = useState<ThemeMode>(() => getThemeMode())
  const [resolved, setResolved] = useState<'dark' | 'light'>(() => {
    const saved = getThemeMode()
    return saved === 'system' ? getSystemMode() : saved
  })
  const [textSize, setTextSize] = useState<TextSize>(() => getTextSize())
  const [focusMode, setFocusMode] = useState(() => isFocusMode())
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const currentLabel = useMemo(() => {
    if (mode === 'system') return 'SYSTEM'
    return mode === 'light' ? 'LIGHT' : 'DARK'
  }, [mode])

  useEffect(() => {
    applyThemeMode(mode)
    setResolved(mode === 'system' ? getSystemMode() : mode)

    if (mode !== 'system' || !window.matchMedia) return
    const media = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => {
      const next = getSystemMode()
      setResolved(next)
      applyThemeMode('system')
    }
    media.addEventListener?.('change', onChange)
    return () => media.removeEventListener?.('change', onChange)
  }, [mode])

  useEffect(() => {
    applyTextSize(textSize)
  }, [textSize])

  useEffect(() => {
    applyFocusMode(focusMode)
  }, [focusMode])

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

  return (
    <div className="theme-switcher" ref={ref}>
      <button
        type="button"
        className="theme-switcher-trigger"
        aria-label={`Appearance: ${currentLabel}${focusMode ? ' • Focus Mode ON' : ''}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
      >
        <span className="theme-switcher-trigger-icon">{iconFor(mode, resolved)}</span>
        <span className="theme-switcher-trigger-label">{currentLabel}</span>
        {focusMode && <span className="theme-switcher-focus-dot" aria-label="Focus Mode on" />}
        <span className="theme-switcher-chevron" aria-hidden="true">{open ? '⌃' : '⌄'}</span>
      </button>

      {open && (
        <div className="theme-switcher-popover" role="menu" aria-label="Appearance and reading controls">
          <div className="theme-switcher-head">
            <div>
              <div className="theme-switcher-kicker">APPEARANCE</div>
              <div className="theme-switcher-title">Display controls</div>
            </div>
            <div className="theme-switcher-live">{resolved.toUpperCase()} LIVE</div>
          </div>

          <div className="theme-switcher-section-title">MODE</div>
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
                onClick={() => setMode(value)}
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

          <div className="theme-switcher-section-title">TEXT SIZE</div>
          <div className="theme-switcher-size-row" role="group" aria-label="Text size">
            {([
              ['normal', 'A', 'Normal'],
              ['large', 'A+', 'Large'],
              ['xlarge', 'A++', 'XL'],
            ] as const).map(([value, glyph, label]) => (
              <button
                key={value}
                type="button"
                className={`theme-switcher-size ${textSize === value ? 'is-active' : ''}`}
                aria-pressed={textSize === value}
                onClick={() => setTextSize(value)}
              >
                <strong>{glyph}</strong>
                <span>{label}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`theme-switcher-focus ${focusMode ? 'is-active' : ''}`}
            role="menuitemcheckbox"
            aria-checked={focusMode}
            onClick={() => setFocusMode(value => !value)}
          >
            <span className="theme-switcher-focus-icon"><AppIcon name="target" size={16} /></span>
            <span className="theme-switcher-option-copy">
              <strong>{focusMode ? 'Focus Mode ON' : 'Focus Mode'}</strong>
              <small>Reduce visual noise and keep CAT execution front-and-centre.</small>
            </span>
            <span className="theme-switcher-option-check" aria-hidden="true">{focusMode ? '✓' : ''}</span>
          </button>

          <div className="theme-switcher-foot">
            <AppIcon name="check" size={12} />
            <span>Saved on this device</span>
          </div>
        </div>
      )}
    </div>
  )
}
