import { SCHEDULE_ITEMS, APP_TIMEZONE } from '@/data/config'
import { getKolkataDateParts } from '@/services/calendarEngine'

const SENT_KEY = 'cat2026_notification_sent_v1'
let nextTimer: number | null = null
let schedulerStarted = false

function supported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function isWebNotificationSupported(): boolean {
  return supported()
}

export function getWebNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!supported()) return 'unsupported'
  return Notification.permission
}

export async function requestWebNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!supported()) return 'unsupported'
  return Notification.requestPermission()
}

function sentMap(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(SENT_KEY) || '{}')
  } catch {
    return {}
  }
}

function wasSent(key: string): boolean {
  const map = sentMap()
  const ts = map[key]
  if (!ts) return false
  return Date.now() - ts < 48 * 60 * 60 * 1000
}

function markSent(key: string): void {
  const map = sentMap()
  map[key] = Date.now()
  const cutoff = Date.now() - 72 * 60 * 60 * 1000
  for (const [k, ts] of Object.entries(map)) {
    if (ts < cutoff) delete map[k]
  }
  localStorage.setItem(SENT_KEY, JSON.stringify(map))
}

function indiaDateToTimestamp(year: number, month: number, date: number, hour: number, minute: number): number {
  // India Standard Time is UTC+05:30 and has no DST.
  return Date.UTC(year, month - 1, date, hour, minute) - 330 * 60 * 1000
}

function addDays(year: number, month: number, date: number, count: number) {
  const d = new Date(Date.UTC(year, month - 1, date))
  d.setUTCDate(d.getUTCDate() + count)
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, date: d.getUTCDate() }
}

function notifyItem(dateKey: string, item: typeof SCHEDULE_ITEMS[number]): void {
  if (!supported() || Notification.permission !== 'granted') return
  const key = `${dateKey}|${item.block}`
  if (wasSent(key)) return

  markSent(key)
  try {
    new Notification(`CAT 2026 • ${item.icon} ${item.block}`, {
      body: `${item.time} • ${item.detail}`,
      tag: `cat2026-${key}`,
      requireInteraction: false,
    })
  } catch (err) {
    console.warn('[CAT2026] Web notification failed:', err)
  }
}

function parseStartTime(time: string): { hour: number; minute: number } | null {
  const raw = time.split('–')[0]?.trim() || time.split('-')[0]?.trim()
  const match = raw.match(/^(\\d{2}):(\\d{2})$/)
  if (!match) return null
  return { hour: Number(match[1]), minute: Number(match[2]) }
}

function scheduleNext(): void {
  if (!schedulerStarted || !supported() || Notification.permission !== 'granted') return
  if (nextTimer !== null) {
    window.clearTimeout(nextTimer)
    nextTimer = null
  }

  const now = Date.now()
  const parts = getKolkataDateParts(new Date())
  let next: { ts: number; dateKey: string; item: typeof SCHEDULE_ITEMS[number] } | null = null

  for (let dayOffset = 0; dayOffset <= 1; dayOffset++) {
    const day = addDays(parts.year, parts.month, parts.date, dayOffset)
    const dateKey = `${day.year}-${String(day.month).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`

    for (const item of SCHEDULE_ITEMS) {
      const start = parseStartTime(item.time)
      if (!start) continue

      const ts = indiaDateToTimestamp(day.year, day.month, day.date, start.hour, start.minute)
      if (ts <= now + 1000) continue

      if (!next || ts < next.ts) next = { ts, dateKey, item }
    }
  }

  if (!next) return

  const delay = Math.max(1000, Math.min(next.ts - now, 24 * 60 * 60 * 1000))
  nextTimer = window.setTimeout(() => {
    notifyItem(next!.dateKey, next!.item)
    scheduleNext()
  }, delay)
}

export function enableWebNotificationScheduler(): void {
  schedulerStarted = true
  scheduleNext()
}

export function disableWebNotificationScheduler(): void {
  schedulerStarted = false
  if (nextTimer !== null) {
    window.clearTimeout(nextTimer)
    nextTimer = null
  }
}

export function sendWebNotificationTest(): boolean {
  if (!supported() || Notification.permission !== 'granted') return false
  try {
    new Notification('CAT 2026 • ✅ App notifications ON', {
      body: `Web/PWA alerts are enabled. Schedule: ${APP_TIMEZONE}. Use Outlook Calendar for alerts when the app is fully closed.`,
      tag: 'cat2026-notification-test',
      requireInteraction: false,
    })
    return true
  } catch {
    return false
  }
}
