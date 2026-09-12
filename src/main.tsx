import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app/App'
import { ToastProvider } from './components/Toast'
import { setupStatusBar, hideSplashScreen } from './services/native'
import './styles/globals.css'

// Register PWA service worker — web build only. On native Android,
// Capacitor serves the bundled dist/ assets directly from the APK,
// so this is a no-op there (harmless: serviceWorker registration
// inside a Capacitor WebView simply has no effect either way).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swCode = `
const CACHE = 'cat2026-s4-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(e.request).then(cached =>
        cached || fetch(e.request).then(res => {
          cache.put(e.request, res.clone());
          return res;
        }).catch(() => new Response('Offline', { status: 200 }))
      )
    )
  );
});`
    const blob = new Blob([swCode], { type: 'application/javascript' })
    const url  = URL.createObjectURL(blob)
    navigator.serviceWorker.register(url).catch(() => {})
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>
)

// Native setup — no-ops automatically when running in a browser,
// so this never affects the existing Stage 4 web build.
setupStatusBar()
// Hide splash after first paint so the loading overlay in App.tsx
// (IndexedDB open + mastery seed) is what the user sees, not a
// blank flash between splash and React mount.
requestAnimationFrame(() => requestAnimationFrame(() => hideSplashScreen()))

