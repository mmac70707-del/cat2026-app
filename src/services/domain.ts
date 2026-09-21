import { CAT_DATE, PHASES, WEEK_PLAN_TEMPLATE } from '@/data/config'
import { getKolkataDateKey, getFirstPassDayNum } from '@/services/calendarEngine'
import { MASTER_SPINE_44 } from '@/data/roadmap44'
import type { Phase, WeekDay, MockAnalysis, MasteryLevel, Task } from '@/types'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// ── Phase ────────────────────────────────────────────
export function getCurrentPhase(): Phase {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (const p of PHASES) {
    const s = new Date(p.start); s.setHours(0, 0, 0, 0)
    const e = new Date(p.end);   e.setHours(23, 59, 59, 999)
    if (today >= s && today <= e) return p
  }

  return today < new Date(PHASES[0].start)
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
  const p1Start = new Date(PHASES[0].start)
  const diff    = Math.max(0, Date.now() - p1Start.getTime())
  return Math.floor(diff / (7 * 86_400_000)) + 1
}

// ── Dynamic week plan (real dates & 44-Day First Pass topics) ─
export function buildWeekPlan(): WeekDay[] {
  const now = new Date()
  const day = now.getDay()
  const mon = new Date(now)
  mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
  mon.setHours(0, 0, 0, 0)

  return WEEK_PLAN_TEMPLATE.map((t, i) => {
    const d = new Date(mon)
    d.setDate(mon.getDate() + i)
    const dKey = getKolkataDateKey(d)
    const dNum = getFirstPassDayNum(dKey)
    const roadmapItem = MASTER_SPINE_44.find(r => r.dayNum === dNum)

    const isToday = d.toDateString() === now.toDateString()
    const isPast  = d < now && !isToday

    return {
      ...t,
      date:    `${d.getDate()} ${MONTHS[d.getMonth()]}`,
      qa:      roadmapItem ? roadmapItem.chapter : t.qa,
      dilr:    roadmapItem ? roadmapItem.dilrFamily : t.dilr,
      varc:    roadmapItem ? roadmapItem.varcSkill : t.varc,
      focus:   isToday ? 'TODAY' : t.focus,
      fCol:    isToday ? '#F5A623' : t.fCol,
      isToday,
      isPast,
    }
  })
}

// ── Week label (Mon X – Sun Y) ───────────────────────
export function getWeekLabel(): string {
  const now = new Date()
  const day = now.getDay()
  const mon = new Date(now)
  mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)
  return `${mon.getDate()} ${MONTHS[mon.getMonth()]} – ${sun.getDate()} ${MONTHS[sun.getMonth()]} ${sun.getFullYear()}`
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
}): MockAnalysis {
  const qa   = parseInt(raw.qa)   || 0
  const dilr = parseInt(raw.dilr) || 0
  const varc = parseInt(raw.varc) || 0
  const qaat = parseInt(raw.qaat) || 0
  const dlat = parseInt(raw.dlat) || 0
  const vcat = parseInt(raw.vcat) || 0

  const total   = qa + dilr + varc
  const att     = qaat + dlat + vcat
  const qaAcc   = qaat > 0 ? Math.round(qa   / (qaat * 3) * 100) : 0
  const dlAcc   = dlat > 0 ? Math.round(dilr / (dlat * 3) * 100) : 0
  const vcAcc   = vcat > 0 ? Math.round(varc / (vcat * 3) * 100) : 0
  const overall = att  > 0 ? Math.round(total / (att  * 3) * 100) : 0

  const weak: string[] = []
  if (qaAcc < 70) weak.push(`QA accuracy ${qaAcc}% — repair concept gaps (C1)`)
  if (dlAcc < 70) weak.push(`DILR accuracy ${dlAcc}% — work on set selection`)
  if (vcAcc < 70) weak.push(`VARC accuracy ${vcAcc}% — improve elimination`)
  if (qaat  < 14) weak.push(`QA attempts ${qaat} — build speed on Tier 1 topics`)
  if (dlat  < 3)  weak.push(`DILR attempts ${dlat} sets — practice set selection faster`)
  if (vcat  < 18) weak.push(`VARC attempts ${vcat} — increase RC reading speed`)

  return { total, att, overall, qaAcc, dlAcc, vcAcc, weak, qa, dilr, varc, qaat, dlat, vcat }
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
  const y   = d.getFullYear()
  const m   = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayKey(): string {
  return localDateKey(new Date())
}

export function formatDate(date: Date): string {
  const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}
