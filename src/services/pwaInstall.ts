let deferredPrompt: any = null
let initialized = false

export function initPwaInstall() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt = event
    window.dispatchEvent(new Event('jarvis:pwa-installable'))
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    window.dispatchEvent(new Event('jarvis:pwa-installed'))
  })
}

export function canInstallPwa() {
  return !!deferredPrompt
}

export async function promptPwaInstall() {
  if (!deferredPrompt) return false
  const promptEvent = deferredPrompt
  deferredPrompt = null
  await promptEvent.prompt()
  const choice = await promptEvent.userChoice
  window.dispatchEvent(new Event('jarvis:pwa-installable'))
  return choice?.outcome === 'accepted'
}
