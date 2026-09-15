// ═══════════════════════════════════════════════════
//  CAT 2026 — Native Bridge Service
//
//  This app's real native host is a hand-written Android
//  WebView (MainActivity.kt using WebViewAssetLoader), NOT
//  Capacitor — there are zero Capacitor dependencies in
//  build.gradle.kts. The previous version of this file checked
//  `Capacitor.isNativePlatform()`, which is always false here
//  since no Capacitor bridge is ever injected — every function
//  below silently no-opped on the actual shipped app. Fixed to
//  detect the real bridge that exists: `window.AndroidNativeHost`,
//  registered via `addJavascriptInterface(...)` in MainActivity.kt.
// ═══════════════════════════════════════════════════

declare global {
  interface Window {
    AndroidNativeHost?: {
      exitApp: () => void
      requestNotificationPermission: () => void
      setNotificationsEnabled: (enabled: boolean) => void
    }
  }
}

export const isNative = () => typeof window !== 'undefined' && !!window.AndroidNativeHost

// ── Android hardware back button ─────────────────────
// MainActivity.kt's OnBackPressedCallback dispatches a real
// `android:backbutton` window event on every back-press (it no
// longer trusts webView.canGoBack(), which is always false for
// this in-memory-routed SPA). This listener decides what happens:
// on a sub-page, hand it to the app's own back-navigation
// (App.tsx's onSubPageBack, same as the on-screen ← Back button);
// on a main tab, call back into Kotlin to actually exit.
export function registerBackButtonHandler(onSubPageBack: () => boolean): () => void {
  const handler = () => {
    const handled = onSubPageBack()
    if (!handled) window.AndroidNativeHost?.exitApp()
  }
  window.addEventListener('android:backbutton', handler)
  return () => window.removeEventListener('android:backbutton', handler)
}

// ── App resume (foreground) ──────────────────────────
// MainActivity.kt's onResume() dispatches `cat2026:resume`
// (mirrors the back-button pattern above). useCountdown / usePhase
// / useTodayTasks all listen for this alongside the web's own
// `visibilitychange`, so state is correct the instant the app
// reopens rather than stale until the next timer tick.
export function registerAppStateHandler(): () => void {
  // No-op registration needed on the JS side — Kotlin dispatches
  // directly to `window`, and the consuming hooks already listen
  // for it. This function exists so App.tsx has one consistent
  // native-lifecycle entry point to call, matching the back-button
  // handler's shape, and so future native events have one place
  // to plug into.
  return () => {}
}

// ── Notifications ─────────────────────────────────────
// Android 13+ requires a runtime POST_NOTIFICATIONS permission
// prompt — this can't be silently granted. Call this from a real
// user action (the Settings toggle), not on app load, so the
// permission dialog has context.
export function requestNotificationPermission(): void {
  if (!isNative()) return
  window.AndroidNativeHost?.requestNotificationPermission()
}

export function setNotificationsEnabled(enabled: boolean): void {
  if (!isNative()) return
  window.AndroidNativeHost?.setNotificationsEnabled(enabled)
}
