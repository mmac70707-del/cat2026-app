import { CAT_DATE, PHASES, WEEK_PLAN_TEMPLATE } from '@/data/config'
import { getKolkataDateKey, getKolkataDateParts, getFirstPassDayNum } from '@/services/calendarEngine'
import { MASTER_SPINE_44 } from '@/data/roadmap44'
import { FINAL_50_WEEK_PLANS, getFinal50DayPlan } from '@/data/final50Plan'
import type { Phase, WeekDay, MockAnalysis, MasteryLevel, Task } from '@/types'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// ── Phase ────────────────────────────────────────────
export function getCurrentPhase(): Phase {
  const todayKey = getKolkataDateKey()

  for (const p of PHASES) {
    if (todayKey >= p.start && todayKey <= p.end) return p
  }

  return todayKey < PHASES[0].start
    ? PHASES[0]
    : PHASES[PHASES.length - 1]
}

// ── Countdown ────────────────────────────────────────
export function getDaysLeft(): number {
  const target = CAT_DATE.getTime()
  const now = Date.now()
  const p1ActiveDay = new Date('2026-09-17T09:00:00').getTime()
  const effectiveNow = now < new Date('2026-09-01').getTime() ? p1ActiveDay : now
  return Math.max(0, Math.ceil((target - effectiveNow) / 86_400_000))
}

export function getCountdownParts(): { days: number; hours: number; minutes: number; seconds: number } {
  const ms = Math.max(0, CAT_DATE.getTime() - Date.now())
  return {
    days:    Math.floor(ms / 86_400_000),
    hours:   Math.floor((ms % 86_400_000) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
    seconds: Math.floor((ms % 60_000) / 1_000),
  }
}

// ── Week number (from Phase 1 start) ─────────────────
export function getWeekNumber(): number {
  const todayPlan = getFinal50DayPlan(getKolkataDateKey())
  if (todayPlan && todayPlan.weekNum > 0 && !todayPlan.isExamDay) return todayPlan.weekNum
  const parts = getKolkataDateParts()
  const todayKolkata = new Date(Date.UTC(parts.year, parts.month - 1, parts.date))
  const p1Start = new Date(Date.UTC(2026, 8, 1))
  const diff = Math.max(0, todayKolkata.getTime() - p1Start.getTime())
  return Math.floor(diff / (7 * 86_400_000)) + 1
}

// ── Dynamic week plan: PDF-locked Sunday–Saturday cycle during the Final 50 Days ─
export function buildWeekPlan(): WeekDay[] {
  const parts = getKolkataDateParts()
  const todayKolkata = new Date(Date.UTC(parts.year, parts.month - 1, parts.date))
  const todayKey = getKolkataDateKey()
  const day = parts.dayOfWeek
  const todayFinalPlan = getFinal50DayPlan(todayKey)
  const finalCycleActive = Boolean(todayFinalPlan && !todayFinalPlan.isDayZero && !todayFinalPlan.isExamDay)
  const weekStart = new Date(todayKolkata)
  weekStart.setUTCDate(todayKolkata.getUTCDate() - (finalCycleActive ? day : (day === 0 ? 6 : day - 1)))

  return Array.from({ length: 7 }, (_, i) => {
    const t = WEEK_PLAN_TEMPLATE[finalCycleActive ? (i + 6) % 7 : i]
    const d = new Date(weekStart)
    d.setUTCDate(weekStart.getUTCDate() + i)
    const dKey = d.toISOString().slice(0, 10)
    const firstPassNum = getFirstPassDayNum(dKey)
    const roadmapItem = MASTER_SPINE_44.find(r => r.dayNum === firstPassNum)
    const finalPlan = getFinal50DayPlan(dKey)
    const usingFinalPlan = Boolean(finalPlan && !finalPlan.isDayZero && !finalPlan.isExamDay)
    const isToday = dKey === todayKey
    const isPast = dKey < todayKey
    const testTitle = finalPlan?.testTitle || ''
    const isTestDay = testTitle.includes('MOCK') || testTitle.includes('SECTIONAL') || testTitle.includes('NO TEST')

    return {
      ...t,
      date: d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()],
      qa: usingFinalPlan ? finalPlan!.qaFocus : roadmapItem ? roadmapItem.chapter : t.qa,
      dilr: usingFinalPlan ? finalPlan!.dilrFocus : roadmapItem ? roadmapItem.dilrFamily : t.dilr,
      varc: usingFinalPlan ? finalPlan!.varcFocus : roadmapItem ? roadmapItem.varcSkill : t.varc,
      focus: finalPlan ? testTitle : isToday ? 'TODAY' : t.focus,
      eve: finalPlan ? finalPlan.testNotes : t.eve,
      fCol: isToday ? '#F5A623' : isTestDay ? '#A78BFA' : t.fCol,
      isTest: finalPlan ? isTestDay : t.isTest,
      isToday,
      isPast,
    }
  })
}

// ── Week label (Mon X – Sun Y) ───────────────────────
export function getWeekLabel(): string {
  const todayPlan = getFinal50DayPlan(getKolkataDateKey())
  if (todayPlan && todayPlan.weekNum > 0 && !todayPlan.isExamDay) {
    const activeWeek = FINAL_50_WEEK_PLANS.find(w => w.number === todayPlan.weekNum)
    if (activeWeek) return activeWeek.dates + ' 2026 (Sun–Sat)'
  }
  const parts = getKolkataDateParts()
  const todayKolkata = new Date(Date.UTC(parts.year, parts.month - 1, parts.date))
  const day = parts.dayOfWeek
  const mon = new Date(todayKolkata)
  mon.setUTCDate(todayKolkata.getUTCDate() - (day === 0 ? 6 : day - 1))
  const sun = new Date(mon)
  sun.setUTCDate(mon.getUTCDate() + 6)
  return mon.getUTCDate() + ' ' + MONTHS[mon.getUTCMonth()] + ' – ' +
    sun.getUTCDate() + ' ' + MONTHS[sun.getUTCMonth()] + ' ' + sun.getUTCFullYear()
}

// ── Task progress ─────────────────────────────────────
export function calcTaskProgress(tasks: Task[]): { total: number; done: number; pct: number } {
  const total = tasks.length
  const done  = tasks.filter(t => t.status === 'DONE').length
  return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 }
}

// ── Mock analysis ─────────────────────────────────────
export function analyseMock(raw: {
  qa: string; dilr: string; varc: string
  qaat: string; dlat: string; vcat: string
  qaCorrect?: string; qaWrong?: string
  dilrCorrect?: string; dilrWrong?: string
  varcCorrect?: string; varcWrong?: string
}): MockAnalysis {
  const qa   = parseInt(raw.qa)   || 0
  const dilr = parseInt(raw.dilr) || 0
  const varc = parseInt(raw.varc) || 0
  const qaat = parseInt(raw.qaat) || 0
  const dlat = parseInt(raw.dlat) || 0
  const vcat = parseInt(raw.vcat) || 0
  const parseOptionalCount = (value?: string): number | undefined =>
    value !== undefined && value.trim() !== '' ? Number.parseInt(value, 10) : undefined
  const qaCorrect = parseOptionalCount(raw.qaCorrect)
  const qaWrong = parseOptionalCount(raw.qaWrong)
  const dilrCorrect = parseOptionalCount(raw.dilrCorrect)
  const dilrWrong = parseOptionalCount(raw.dilrWrong)
  const varcCorrect = parseOptionalCount(raw.varcCorrect)
  const varcWrong = parseOptionalCount(raw.varcWrong)
  const hasAllOutcomeCounts = [qaCorrect, qaWrong, dilrCorrect, dilrWrong, varcCorrect, varcWrong].every(v => v !== undefined)

  const total = qa + dilr + varc
  const att = qaat + dlat + vcat
  const qaAcc = qaat > 0 ? (qaCorrect !== undefined ? Math.round(qaCorrect / qaat * 100) : Math.round(qa / (qaat * 3) * 100)) : 0
  const dlAcc = dlat > 0 ? (dilrCorrect !== undefined ? Math.round(dilrCorrect / dlat * 100) : Math.round(dilr / (dlat * 3) * 100)) : 0
  const vcAcc = vcat > 0 ? (varcCorrect !== undefined ? Math.round(varcCorrect / vcat * 100) : Math.round(varc / (vcat * 3) * 100)) : 0
  const correctTotal = (qaCorrect ?? 0) + (dilrCorrect ?? 0) + (varcCorrect ?? 0)
  const overall = att > 0
    ? hasAllOutcomeCounts ? Math.round(correctTotal / att * 100) : Math.round(total / (att * 3) * 100)
    : 0

  const weak: string[] = []
  if (qaat >= 8 && qaAcc < 70) weak.push(`QA accuracy ${qaAcc}% — repair concept gaps (C1)`)
  else if (qaat < 8) weak.push(`QA has ${qaat} attempts; wait for about 8 attempts before judging section accuracy`)
  if (dlat >= 8 && dlAcc < 70) weak.push(`DILR accuracy ${dlAcc}% — work on set selection`)
  else if (dlat < 8) weak.push(`DILR has ${dlat} question attempts; wait for about 8 before judging section accuracy`)
  if (vcat >= 8 && vcAcc < 70) weak.push(`VARC accuracy ${vcAcc}% — improve elimination`)
  else if (vcat < 8) weak.push(`VARC has ${vcat} attempts; wait for about 8 before judging section accuracy`)
  if (qaat < 14) weak.push(`QA attempts ${qaat} — build speed on Tier 1 topics`)
  if (dlat < 14) weak.push(`DILR question attempts ${dlat} — practise set selection and commitment`)
  if (vcat < 18) weak.push(`VARC attempts ${vcat} — increase RC reading speed`)

  return {
    total, att, overall, qaAcc, dlAcc, vcAcc, weak, qa, dilr, varc, qaat, dlat, vcat,
    qaCorrect, qaWrong, dilrCorrect, dilrWrong, varcCorrect, varcWrong
  }
}

// ── Mastery helpers ───────────────────────────────────
export const LV_LABELS = ['L0','L1','L2','L3','L4','L5'] as const
export const LV_COLORS = ['#9CA3AF','#F87171','#FCD34D','#93C5FD','#6EE7B7','#F5A623']
export const LV_PCT    = [0, 20, 40, 60, 80, 100]

export function lvLabel(lv: MasteryLevel): string { return LV_LABELS[lv] ?? 'L0' }
export function lvColor(lv: MasteryLevel): string { return LV_COLORS[lv] ?? '#9CA3AF' }
export function lvPct(lv: MasteryLevel):   number { return LV_PCT[lv]    ?? 0 }

// ── Date helpers ──────────────────────────────────────
export function localDateKey(d: Date = new Date()): string {
  return getKolkataDateKey(d)
}

export function todayKey(): string {
  return getKolkataDateKey()
}

export function formatDate(date: Date): string {
  const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}
