import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app/App'
import { ToastProvider } from './components/Toast'
import { registerSW } from 'virtual:pwa-register'
import './styles/globals.css'
import './styles/theme.css'
import { ThemeSwitcher } from './components/ThemeSwitcher'
import { syncUiPreferences } from './services/uiPreferences'
import { isNative } from './services/native'

// Real production service worker — replaces the previous Blob-based
// one. Only meaningful for the web/laptop install path; on the
// Android native build this module still loads harmlessly (it just
// registers a service worker the native WebView never needs, since
// assets are served straight from the APK).
const runningInsideAndroidCore = isNative() || window.location.hostname === 'appassets.androidplatform.net'

if (!runningInsideAndroidCore) {
  registerSW({ immediate: true })
}

// JARVIS remains the app skin; appearance is now controlled separately by the
// persistent Light / Dark / System display preference.
document.body.classList.add('jarvis-theme')

try {
  syncUiPreferences()
} catch {
  document.documentElement.dataset.themeMode = 'dark'
  document.documentElement.dataset.textSize = 'normal'
  document.documentElement.dataset.focusMode = 'off'
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <>
        <App />
        <ThemeSwitcher />
      </>
    </ToastProvider>
  </React.StrictMode>
)
