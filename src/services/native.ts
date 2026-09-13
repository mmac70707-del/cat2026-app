// ═══════════════════════════════════════════════════
//  CAT 2026 — Native Bridge Service
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

// ── Splash screen ────────────────────────────────────
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
export async function registerBackButtonHandler(
  onSubPageBack: () => boolean
): Promise<() => void> {
  const handleAndroidBack = () => {
    const handled = onSubPageBack()
    if (!handled) {
      if ((window as any).AndroidNativeHost?.exitApp) {
        (window as any).AndroidNativeHost.exitApp()
      }
    }
  }

  window.addEventListener('android:backbutton', handleAndroidBack)

  if (!isNative()) {
    return () => window.removeEventListener('android:backbutton', handleAndroidBack)
  }

  try {
    const { App } = await import('@capacitor/app')
    const handle = App.addListener('backButton', () => {
      const handled = onSubPageBack()
      if (!handled) {
        if ((window as any).AndroidNativeHost?.exitApp) {
          (window as any).AndroidNativeHost.exitApp()
        } else {
          App.exitApp()
        }
      }
    })
    return () => {
      window.removeEventListener('android:backbutton', handleAndroidBack)
      handle.then(h => h.remove())
    }
  } catch (e) {
    console.warn('[native] Back button handler skipped:', e)
    return () => window.removeEventListener('android:backbutton', handleAndroidBack)
  }
}

// ── App state (background/foreground) ────────────────
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
