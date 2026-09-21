import { APP_TIMEZONE, CAT_DATE, FIRST_PASS_START, FIRST_PASS_END, PHASES } from '@/data/config'
import type { CalendarDay, CalendarWeek, CalendarMonth, CalendarYear } from '@/types'

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_SHORT   = ['SUN','MON','TUE','WED','THU','FRI','SAT']

// ── 1. Timezone-Aware Kolkata Date Parts ──────────────
export function getKolkataDateParts(d: Date = new Date()): { year: number; month: number; date: number; dayOfWeek: number; hours: number; minutes: number } {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: APP_TIMEZONE,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'narrow',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    })
    const parts = formatter.formatToParts(d)
    let year = d.getFullYear(), month = d.getMonth() + 1, date = d.getDate(), hours = d.getHours(), minutes = d.getMinutes()
    for (const p of parts) {
      if (p.type === 'year') year = parseInt(p.value, 10)
      if (p.type === 'month') month = parseInt(p.value, 10)
      if (p.type === 'day') date = parseInt(p.value, 10)
      if (p.type === 'hour') hours = parseInt(p.value, 10)
      if (p.type === 'minute') minutes = parseInt(p.value, 10)
    }
    // Calculate dayOfWeek in local Kolkata time (0=Sun, 1=Mon, ..., 6=Sat)
    const kolkataUtcDate = new Date(Date.UTC(year, month - 1, date, hours, minutes))
    const dayOfWeek = kolkataUtcDate.getUTCDay()
    return { year, month, date, dayOfWeek, hours, minutes }
  } catch {
    // Fallback if Intl fails
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      date: d.getDate(),
      dayOfWeek: d.getDay(),
      hours: d.getHours(),
      minutes: d.getMinutes()
    }
  }
}

// ── 2. Deterministic Date Keys in Asia/Kolkata ────────
export function getKolkataDateKey(d: Date = new Date()): string {
  const { year, month, date } = getKolkataDateParts(d)
  const mStr = String(month).padStart(2, '0')
  const dStr = String(date).padStart(2, '0')
  return `${year}-${mStr}-${dStr}`
}

export function getKolkataMonthKey(d: Date = new Date()): string {
  const { year, month } = getKolkataDateParts(d)
  const mStr = String(month).padStart(2, '0')
  return `${year}-${mStr}`
}

export function getKolkataYearKey(d: Date = new Date()): string {
  const { year } = getKolkataDateParts(d)
  return `${year}`
}

export function getKolkataWeekKey(d: Date = new Date()): string {
  const dateKey = getKolkataDateKey(d)
  const [y, m, dayNum] = dateKey.split('-').map(Number)
  const kolkataDate = new Date(Date.UTC(y, m - 1, dayNum))

  // ISO Week calculation
  const target = new Date(kolkataDate.valueOf())
  const dayNr = (kolkataDate.getUTCDay() + 6) % 7
  target.setUTCDate(target.getUTCDate() - dayNr + 3)
  const firstThursday = target.valueOf()
  target.setUTCMonth(0, 1)
  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay() + 7) % 7))
  }
  const weekNum = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000)
  const wStr = String(weekNum).padStart(2, '0')
  return `${target.getUTCFullYear()}-W${wStr}`
}

// ── 3. 44-Day First Pass Day Calculation ──────────────
export function getFirstPassDayNum(dateKey: string): number {
  const startMs = new Date(`${FIRST_PASS_START}T00:00:00`).getTime()
  const endMs   = new Date(`${FIRST_PASS_END}T23:59:59`).getTime()
  const targetMs= new Date(`${dateKey}T12:00:00`).getTime()

  if (targetMs < startMs || targetMs > endMs) return 0

  const diffDays = Math.floor((targetMs - startMs) / 86_400_000) + 1
  return Math.max(1, Math.min(44, diffDays))
}

// ── 4. Phase Detection for Date Key ───────────────────
export function getPhaseForDateKey(dateKey: string) {
  for (const p of PHASES) {
    if (dateKey >= p.start && dateKey <= p.end) return p.id
  }
  if (dateKey < PHASES[0].start) return PHASES[0].id
  return PHASES[PHASES.length - 1].id
}

// ── 5. Calendar Hierarchy Builders ─────────────────────
export function buildCalendarDay(dateKey: string, todayKey: string = getKolkataDateKey()): CalendarDay {
  const [y, m, d] = dateKey.split('-').map(Number)
  const utcDate = new Date(Date.UTC(y, m - 1, d))
  const dayName = DAY_SHORT[utcDate.getUTCDay()]
  const dateFormatted = `${d} ${MONTH_SHORT[m - 1]} ${y}`
  const dayNum = getFirstPassDayNum(dateKey)
  const phaseId = getPhaseForDateKey(dateKey)

  return {
    dateKey,
    dayNum,
    dayName,
    dateFormatted,
    isPast: dateKey < todayKey,
    isToday: dateKey === todayKey,
    isFuture: dateKey > todayKey,
    phaseId,
  }
}

export function buildCalendarWeek(weekKey: string, todayKey: string = getKolkataDateKey()): CalendarWeek {
  // Parse YYYY-Www
  const [yearStr, wStr] = weekKey.split('-W')
  const year = parseInt(yearStr, 10) || 2026
  const weekNum = parseInt(wStr, 10) || 1

  // Find Monday of this ISO week
  const simpleDate = new Date(Date.UTC(year, 0, 1 + (weekNum - 1) * 7))
  const dayOfWeek = simpleDate.getUTCDay()
  const isoMonday = new Date(simpleDate)
  if (dayOfWeek <= 4) {
    isoMonday.setUTCDate(simpleDate.getUTCDate() - (simpleDate.getUTCDay() || 7) + 1)
  } else {
    isoMonday.setUTCDate(simpleDate.getUTCDate() + (8 - simpleDate.getUTCDay()))
  }

  const days: CalendarDay[] = []
  for (let i = 0; i < 7; i++) {
    const cur = new Date(isoMonday)
    cur.setUTCDate(isoMonday.getUTCDate() + i)
    const dKey = cur.toISOString().slice(0, 10)
    days.push(buildCalendarDay(dKey, todayKey))
  }

  return {
    weekKey,
    year,
    weekNum,
    startDateKey: days[0].dateKey,
    endDateKey: days[6].dateKey,
    days,
  }
}

export function buildCalendarMonth(monthKey: string, todayKey: string = getKolkataDateKey()): CalendarMonth {
  const [yStr, mStr] = monthKey.split('-')
  const year = parseInt(yStr, 10) || 2026
  const monthNum = parseInt(mStr, 10) || 9
  const monthName = MONTH_NAMES[monthNum - 1] || 'September'

  // Get total days in month
  const totalDays = new Date(Date.UTC(year, monthNum, 0)).getUTCDate()

  const weekKeys = new Set<string>()
  for (let d = 1; d <= totalDays; d++) {
    const dStr = String(d).padStart(2, '0')
    const dateObj = new Date(Date.UTC(year, monthNum - 1, d))
    weekKeys.add(getKolkataWeekKey(dateObj))
  }

  const weeks = Array.from(weekKeys).map(wk => buildCalendarWeek(wk, todayKey))

  return {
    monthKey,
    year,
    monthNum,
    monthName,
    weeks,
  }
}

export function buildCalendarYear(yearKey: string, todayKey: string = getKolkataDateKey()): CalendarYear {
  const yearNum = parseInt(yearKey, 10) || 2026
  const months: CalendarMonth[] = []
  for (let m = 1; m <= 12; m++) {
    const mStr = String(m).padStart(2, '0')
    months.push(buildCalendarMonth(`${yearNum}-${mStr}`, todayKey))
  }

  return {
    yearKey,
    yearNum,
    months,
  }
}
