export type ThemeMode = 'dark' | 'light' | 'system'
export type TextSize = 'normal' | 'large' | 'xlarge'

export const THEME_MODE_KEY = 'cat2026_theme_mode'
export const STITCH_THEME_KEY = 'stitchTheme'
export const TEXT_SIZE_KEY = 'cat2026_text_size'
export const FOCUS_MODE_KEY = 'cat2026_focus_mode'

function getSystemMode(): 'dark' | 'light' {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark'
}

function notifyUiPreferenceChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cat2026:ui-preferences-changed'))
  }
}

export function getThemeMode(): ThemeMode {
  try {
    const value = localStorage.getItem(THEME_MODE_KEY)
    if (value === 'dark' || value === 'light' || value === 'system') return value
  } catch {}
  return 'dark'
}

export function getTextSize(): TextSize {
  try {
    const value = localStorage.getItem(TEXT_SIZE_KEY)
    if (value === 'normal' || value === 'large' || value === 'xlarge') return value
  } catch {}
  return 'normal'
}

export function isFocusMode(): boolean {
  try {
    const saved = localStorage.getItem(FOCUS_MODE_KEY)
    // Focus is the default operating state for CAT-first execution.
    // An explicit user choice of "off" is always respected.
    return saved !== 'off'
  } catch {
    return true
  }
}

export function applyThemeMode(mode: ThemeMode): void {
  const resolved = mode === 'system' ? getSystemMode() : mode
  const root = document.documentElement
  root.dataset.themeMode = resolved
  root.style.colorScheme = resolved
  try { localStorage.setItem(THEME_MODE_KEY, mode) } catch {}
  notifyUiPreferenceChange()

  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) meta.content = resolved === 'light' ? '#F4F1EA' : '#121411'
}

export function applyTextSize(size: TextSize): void {
  document.documentElement.dataset.textSize = size
  try { localStorage.setItem(TEXT_SIZE_KEY, size) } catch {}
  notifyUiPreferenceChange()
}

export function applyStitchTheme(themeId: string): void {
  document.documentElement.dataset.stitchTheme = themeId
  try { localStorage.setItem(STITCH_THEME_KEY, themeId) } catch {}
  notifyUiPreferenceChange()
}

export function applyFocusMode(enabled: boolean): void {
  document.documentElement.dataset.focusMode = enabled ? 'on' : 'off'
  try { localStorage.setItem(FOCUS_MODE_KEY, enabled ? 'on' : 'off') } catch {}
  notifyUiPreferenceChange()
}

export function syncUiPreferences(): void {
  applyThemeMode(getThemeMode())
  applyTextSize(getTextSize())
  applyFocusMode(isFocusMode())

  try {
    const savedAccent = localStorage.getItem(STITCH_THEME_KEY)
    if (savedAccent) applyStitchTheme(savedAccent)
  } catch {}
}
