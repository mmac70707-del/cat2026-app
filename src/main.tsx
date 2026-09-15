import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app/App'
import { ToastProvider } from './components/Toast'
import { registerSW } from 'virtual:pwa-register'
import './styles/globals.css'

// Real production service worker — replaces the previous Blob-based
// one. Only meaningful for the web/laptop install path; on the
// Android native build this module still loads harmlessly (it just
// registers a service worker the native WebView never needs, since
// assets are served straight from the APK).
registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>
)
