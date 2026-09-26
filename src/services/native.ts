// CAT 2026 — Secure Android WebMessage bridge client.
// Native transport is origin-restricted in MainActivity.kt; no addJavascriptInterface.
// All privileged calls are explicit, allowlisted actions.
declare global {
  interface Window {
    AndroidNativeHost?: {
      postMessage: (message: string) => void
      onmessage?: (event: MessageEvent<string>) => void
    }
  }
}

type NativeResponse = {
  id: string
  ok: boolean
  error?: string
  locked?: boolean
  capabilities?: Record<string, boolean>
}

type NativeRequest = {
  action: string
  args?: Record<string, unknown>
}

const pending = new Map<string, (response: NativeResponse) => void>()
let requestSeq = 0
let listenerInstalled = false

function installReplyListener() {
  if (listenerInstalled || !isNative()) return
  listenerInstalled = true
  window.AndroidNativeHost!.onmessage = (event) => {
    try {
      const response = JSON.parse(String(event.data)) as NativeResponse
      const resolve = pending.get(response.id)
      if (!resolve) return
      pending.delete(response.id)
      resolve(response)
    } catch {
      // Ignore malformed native replies.
    }
  }
}

export const isNative = () => typeof window !== 'undefined' && !!window.AndroidNativeHost?.postMessage

export function nativeRequest(request: NativeRequest): Promise<NativeResponse> {
  if (!isNative()) return Promise.resolve({ id: '', ok: false, error: 'Not running in Android host' })
  installReplyListener()
  return new Promise(resolve => {
    const id = `native-${Date.now()}-${++requestSeq}`
    pending.set(id, resolve)
    window.AndroidNativeHost!.postMessage(JSON.stringify({ id, action: request.action, args: request.args ?? {} }))
    window.setTimeout(() => {
      if (!pending.has(id)) return
      pending.delete(id)
      resolve({ id, ok: false, error: 'Native request timeout' })
    }, 5000)
  })
}

export function registerBackButtonHandler(onSubPageBack: () => boolean): () => void {
  const handler = () => {
    const handled = onSubPageBack()
    if (!handled) void nativeRequest({ action: 'exitApp' })
  }
  window.addEventListener('android:backbutton', handler)
  return () => window.removeEventListener('android:backbutton', handler)
}

export function registerAppStateHandler(): () => void {
  return () => {}
}

export function requestNotificationPermission(): void {
  void nativeRequest({ action: 'requestNotificationPermission' })
}

export function setNotificationsEnabled(enabled: boolean): void {
  void nativeRequest({ action: 'setNotificationsEnabled', args: { enabled } })
}

export function authenticateBiometric(): void {
  void nativeRequest({ action: 'authenticateBiometric' })
}

export function launchNativeAction(action: string): void {
  void nativeRequest({ action: 'launchNativeAction', args: { action } })
}

export async function getDeviceCapabilities(): Promise<Record<string, boolean> | null> {
  const response = await nativeRequest({ action: 'getDeviceCapabilities' })
  return response.ok ? (response.capabilities ?? null) : null
}
