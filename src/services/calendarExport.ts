import { SCHEDULE_ITEMS, CAT_EXAM_DATE_STR } from '@/data/config'
import { getKolkataDateParts } from '@/services/calendarEngine'

// Calendar export uses UTC timestamps calculated from the fixed India Standard
// Time schedule. This avoids device-timezone drift and keeps alerts consistent
// across Google Calendar, Outlook, Apple Calendar, Android and desktop clients.

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function toUTCICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\r?\n/g, '\\n')
}

function parseTimes(timeRange: string): { startHour: number; startMinute: number; endHour?: number; endMinute?: number } | null {
  const parts = timeRange.split(/[–-]/).map(part => part.trim())
  const start = parts[0]?.match(/^(\d{1,2}):(\d{2})$/)
  if (!start) return null
  const end = parts[1]?.match(/^(\d{1,2}):(\d{2})$/)
  return {
    startHour: Number(start[1]),
    startMinute: Number(start[2]),
    ...(end ? { endHour: Number(end[1]), endMinute: Number(end[2]) } : {}),
  }
}

function indiaLocalToUtc(year: number, month: number, day: number, hour: number, minute: number, second = 0): Date {
  // IST is UTC+05:30 and does not observe daylight saving time.
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second) - 330 * 60 * 1000)
}

function addIndiaDays(year: number, month: number, day: number, amount: number) {
  const d = new Date(Date.UTC(year, month - 1, day + amount))
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() }
}

function dateKeyParts(key: string): { year: number; month: number; day: number } {
  const [year, month, day] = key.split('-').map(Number)
  return { year, month, day }
}

export function generateScheduleICS(): string {
  const now = new Date()
  const today = getKolkataDateParts(now)
  const exam = dateKeyParts(CAT_EXAM_DATE_STR)
  const until = indiaLocalToUtc(exam.year, exam.month, exam.day, 23, 59, 59)
  const stamp = toUTCICSDate(now)

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CAT 2026 Execution System//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:CAT 2026 Daily Schedule',
    'X-WR-TIMEZONE:Asia/Kolkata',
  ]

  SCHEDULE_ITEMS.forEach((item, i) => {
    const times = parseTimes(item.time)
    if (!times) return

    let day = { year: today.year, month: today.month, day: today.date }
    let start = indiaLocalToUtc(day.year, day.month, day.day, times.startHour, times.startMinute)

    // Never create a first occurrence in the past. A missed block starts with
    // its next scheduled occurrence; it is not backfilled into today's calendar.
    if (start.getTime() <= now.getTime()) {
      day = addIndiaDays(day.year, day.month, day.day, 1)
      start = indiaLocalToUtc(day.year, day.month, day.day, times.startHour, times.startMinute)
    }
    if (start.getTime() > until.getTime()) return

    let end: Date
    if (times.endHour !== undefined && times.endMinute !== undefined) {
      end = indiaLocalToUtc(day.year, day.month, day.day, times.endHour, times.endMinute)
      if (end.getTime() <= start.getTime()) end = new Date(start.getTime() + 30 * 60 * 1000)
    } else {
      end = new Date(start.getTime() + 30 * 60 * 1000)
    }

    const uid = `cat2026-${i}-${item.block.toLowerCase().replace(/[^a-z0-9]+/g, '-') }@cat2026app`
    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${toUTCICSDate(start)}`,
      `DTEND:${toUTCICSDate(end)}`,
      `SUMMARY:${escapeICS(item.icon + ' ' + item.block)}`,
      `DESCRIPTION:${escapeICS(item.detail + ' | CAT 2026 execution system')}`,
      `RRULE:FREQ=DAILY;UNTIL=${toUTCICSDate(until)}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeICS(item.block + ' starts soon')}`,
      'TRIGGER:-PT5M',
      'END:VALARM',
      'END:VEVENT',
    )
  })

  lines.push('END:VCALENDAR')
  return lines.join('\\r\\n') + '\\r\\n'
}

export function downloadScheduleICS(): void {
  const content = generateScheduleICS()
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'cat2026-daily-schedule.ics'
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
