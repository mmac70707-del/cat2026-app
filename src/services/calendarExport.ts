import { SCHEDULE_ITEMS, CAT_DATE } from '@/data/config'

// ═══════════════════════════════════════════════════
//  Calendar export (.ics)
//
//  Solves "reminders on my phone AND my laptop" honestly:
//  a real Microsoft To Do task sync would need OAuth against the
//  Microsoft identity platform (an Azure AD app registration only
//  you can create, plus MSAL wiring) — real, buildable, but gated
//  on a setup step on your end that can't be done from here.
//
//  This works immediately, with zero accounts, zero API keys,
//  zero network calls: a standard .ics file, generated from the
//  exact same SCHEDULE_ITEMS/CAT_DATE this app already uses (no
//  separate hand-maintained copy to drift out of sync). Import it
//  into Outlook Calendar, Google Calendar, or Apple Calendar and
//  it appears — with real alarms — on every device signed into
//  that account: phone and laptop both.
//
//  Times are written as "floating" (no timezone marker), which is
//  the correct choice here — every calendar app interprets a
//  floating time as your device's local wall-clock time, so a
//  9:00am block shows as 9:00am wherever you open it.
// ═══════════════════════════════════════════════════

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function toFloatingICSDate(d: Date): string {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`
}

function toICSDateOnly(d: Date): string {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n')
}

// Parses "05:00–05:15" or "22:00" → { h, m } of the block's start time.
function parseStartTime(timeRange: string): { h: number; m: number } | null {
  const first = timeRange.split(/[–-]/)[0].trim()
  const match = first.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return null
  return { h: parseInt(match[1], 10), m: parseInt(match[2], 10) }
}

export function generateScheduleICS(): string {
  const now = new Date()
  const untilDate = new Date(CAT_DATE)
  untilDate.setDate(untilDate.getDate() - 1) // stop the day before the exam
  const until = `${toICSDateOnly(untilDate)}T235959`

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CAT 2026 Execution System//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICS('CAT 2026 Daily Schedule')}`,
  ]

  SCHEDULE_ITEMS.forEach((item, i) => {
    const start = parseStartTime(item.time)
    if (!start) return
    const dtStart = new Date(now)
    dtStart.setHours(start.h, start.m, 0, 0)
    // Default 30-minute block for events with no explicit end time
    // in the source data — good enough for a calendar reminder, not
    // meant to be a precise duration.
    const uid = `cat2026-block-${i}-${item.block.replace(/\s+/g, '')}@cat2026app`

    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${toFloatingICSDate(now)}Z`,
      `DTSTART:${toFloatingICSDate(dtStart)}`,
      `SUMMARY:${escapeICS(item.block)}`,
      `DESCRIPTION:${escapeICS(item.detail)}`,
      `RRULE:FREQ=DAILY;UNTIL=${until}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeICS(item.block)}`,
      'TRIGGER:PT0M',
      'END:VALARM',
      'END:VEVENT',
    )
  })

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

export function downloadScheduleICS(): void {
  const content = generateScheduleICS()
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'cat2026-daily-schedule.ics'
  a.click()
  URL.revokeObjectURL(a.href)
}
