import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app/App'
import { ToastProvider } from './components/Toast'
import { registerSW } from 'virtual:pwa-register'
import './styles/globals.css'
import './styles/theme.css'
import { ThemeSwitcher } from './components/ThemeSwitcher'

// Real production service worker — replaces the previous Blob-based
// one. Only meaningful for the web/laptop install path; on the
// Android native build this module still loads harmlessly (it just
// registers a service worker the native WebView never needs, since
// assets are served straight from the APK).
registerSW({ immediate: true })

// JARVIS remains the app skin; appearance is now controlled separately by the
// persistent Light / Dark / System display preference.
document.body.classList.add('jarvis-theme')

try {
  const saved = localStorage.getItem('cat2026_theme_mode')
  const mode = saved === 'light' || saved === 'system' || saved === 'dark' ? saved : 'dark'
  const resolved = mode === 'system'
    ? (window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    : mode
  document.documentElement.dataset.theme = resolved
  document.documentElement.style.colorScheme = resolved
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) meta.content = resolved === 'light' ? '#F5F7FA' : '#0A0F14'
} catch {
  document.documentElement.dataset.theme = 'dark'
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
