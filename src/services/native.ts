// ═══════════════════════════════════════════════════
//  CAT 2026 — Native Bridge Service
//
//  Wraps Capacitor plugin calls so the SAME React code
//  works identically in:
//    - the browser (Stage 4 web app — plugins no-op)
//    - the Android app (Stage 5 — plugins call real native APIs)
//
//  Every function checks Capacitor.isNativePlatform() before
//  touching a native API, so this file is safe to import from
//  anywhere without breaking the existing web build.
// ═══════════════════════════════════════════════════

import { Capacitor } from '@capacitor/core'

export const isNative = () => Capacitor.isNativePlatform()

// ── Status bar (dark theme to match app shell) ───────
export async function setupStatusBar(): Promise<void> {
  if (!isNative()) return
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar')
    await StatusBar.setStyle({ style: Style.Dark })
    await StatusBar.setBackgroundColor({ color: '#0A0F1E' })
    await StatusBar.setOverlaysWebView({ overlay: false })
  } catch (e) {
    console.warn('[native] StatusBar setup skipped:', e)
  }
}

// ── Splash screen (hide once React has mounted + first paint done) ──
export async function hideSplashScreen(): Promise<void> {
  if (!isNative()) return
  try {
    const { SplashScreen } = await import('@capacitor/splash-screen')
    await SplashScreen.hide()
  } catch (e) {
    console.warn('[native] SplashScreen hide skipped:', e)
  }
}

// ── Android hardware back button ─────────────────────
// Behaviour required by Stage 5:
//   - on a sub-page (Errors/Repair/Retest/Mocks/Schedule/Vision/
//     Syllabus/Settings) → back button returns to "More", same as
//     the on-screen Back button.
//   - on a main tab (Today/Week/Mastery/Phases/More) → back button
//     exits the app (default Android behaviour), matching user
//     expectation instead of a dead end with no exit.
export async function registerBackButtonHandler(
  onSubPageBack: () => boolean // return true if a subpage was open and handled
): Promise<() => void> {
  if (!isNative()) return () => {}
  try {
    const { App } = await import('@capacitor/app')
    const handle = App.addListener('backButton', () => {
      const handled = onSubPageBack()
      if (!handled) {
        App.exitApp()
      }
    })
    return () => { handle.then(h => h.remove()) }
  } catch (e) {
    console.warn('[native] Back button handler skipped:', e)
    return () => {}
  }
}

// ── App state (background/foreground) ────────────────
// Dispatches a `cat2026:resume` window event on native foreground,
// mirroring the DOM `visibilitychange` event the web build already
// relies on (see useTodayTasks, useCountdown, usePhase). Any hook
// that listens for one now also listens for the other, so resume
// behaviour is identical on web and native without special-casing
// call sites.
export async function registerAppStateHandler(): Promise<() => void> {
  if (!isNative()) return () => {}
  try {
    const { App } = await import('@capacitor/app')
    const handle = App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) window.dispatchEvent(new Event('cat2026:resume'))
    })
    return () => { handle.then(h => h.remove()) }
  } catch (e) {
    console.warn('[native] App state handler skipped:', e)
    return () => {}
  }
}
