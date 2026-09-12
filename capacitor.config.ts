import type { CapacitorConfig } from '@capacitor/cli'

// ═══════════════════════════════════════════════════
//  CAT 2026 — Capacitor Configuration
//
//  ⚠️ appId is PERMANENT once published to Google Play.
//  It cannot be changed after your first Play Store upload.
//  "com.cat2026.app" is a placeholder using a generic domain —
//  reverse-DNS convention is normally your own domain
//  (e.g. com.yourname.cat2026). Change appId below BEFORE
//  running `npx cap add android` if you own a domain you'd
//  rather use. Once you run `cap add android` and open the
//  project in Android Studio, changing appId requires manually
//  renaming the Java/Kotlin package folder structure too —
//  so lock this in now, not later.
// ═══════════════════════════════════════════════════

const config: CapacitorConfig = {
  appId: 'com.cat2026.app',
  appName: 'CAT 2026',
  webDir: 'dist',

  // Bundle the built web assets into the APK (no remote server call
  // needed for the app shell — matches the offline-first requirement).
  server: {
    androidScheme: 'https',
  },

  android: {
    // Keep default Capacitor WebView behaviour; no cleartext traffic
    // needed since this app makes no network calls of its own.
    allowMixedContent: false,
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: '#0A0F1E',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',        // dark icons hidden -> use light content on dark bg
      backgroundColor: '#0A0F1E',
      overlaysWebView: false,
    },
  },
}

export default config
