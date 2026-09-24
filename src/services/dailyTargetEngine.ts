import { ROADMAP_44 } from '@/data/roadmap44'
import { getPercentylDailyTarget } from '@/data/percentylPlan2'
import { BLOCKS } from '@/data/config'
import { getCurrentPhase, localDateKey } from '@/services/domain'
import { getFirstPassDayNum } from '@/services/calendarEngine'
import type { Task, ErrorRecord, DailyScore, TaskStatus } from '@/types'

export interface DailyTargetInput {
  dateIso?: string;
  pendingErrors?: ErrorRecord[];
  allErrors?: ErrorRecord[];
  dailyScores?: DailyScore[];
  repairCount?: number;
  retestCount?: number;
}

export function generateDailyTargets(input: DailyTargetInput = {}): Task[] {
  const d = input.dateIso ? new Date(input.dateIso) : new Date()
  const dateKey = localDateKey(d)
  const phase = getCurrentPhase()

  // Find exact 44-Day First-Pass day & roadmap item
  const dayNum = getFirstPassDayNum(dateKey)
  const roadmapItem = ROADMAP_44.find(r => r.dayNum === (dayNum || 1)) || ROADMAP_44[0]
  const pt = getPercentylDailyTarget(dateKey)

  const pendingList = input.pendingErrors || []
  const allList     = input.allErrors || pendingList
  const scoreList   = (input.dailyScores || []).slice().sort((a, b) => a.date.localeCompare(b.date))

  // 1. Error Frequency & Classification
  const pendingC1Count = pendingList.filter(e => e.errorType === 'C1').length
  const pendingC2Count = pendingList.filter(e => e.errorType === 'C2').length
  const pendingC3Count = pendingList.filter(e => e.errorType === 'C3').length
  const pendingC4Count = pendingList.filter(e => e.errorType === 'C4').length
  const pendingC5Count = pendingList.filter(e => e.errorType === 'C5').length
  const totalPending   = pendingList.length

  // Find dominant error type from logged evidence
  const typeCounts = {
    C1: allList.filter(e => e.errorType === 'C1').length,
    C2: allList.filter(e => e.errorType === 'C2').length,
    C3: allList.filter(e => e.errorType === 'C3').length,
    C4: allList.filter(e => e.errorType === 'C4').length,
    C5: allList.filter(e => e.errorType === 'C5').length,
  }

  let dominantError: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | null = null
  if (allList.length > 0) {
    let maxCount = 0
    for (const [type, count] of Object.entries(typeCounts)) {
      if (count > maxCount) {
        maxCount = count
        dominantError = type as 'C1' | 'C2' | 'C3' | 'C4' | 'C5'
      }
    }
  }

  // 2. Accuracy Trend Analysis (Recent 7 days vs Preceding 7 days)
  const latestScore = scoreList.length > 0 ? scoreList[scoreList.length - 1] : null
  const lastAcc     = latestScore ? latestScore.accuracyPct : 70

  let trendMsg = ''
  if (scoreList.length >= 14) {
    const recent7 = scoreList.slice(-7)
    const prev7   = scoreList.slice(-14, -7)
    const avgRec  = Math.round(recent7.reduce((s, x) => s + x.accuracyPct, 0) / 7)
    const avgPrev = Math.round(prev7.reduce((s, x) => s + x.accuracyPct, 0) / 7)
    const diff    = avgRec - avgPrev
    trendMsg = diff >= 0 ? ` (7-day trend: +${diff}% accuracy)` : ` (7-day trend: ${diff}% accuracy)`
  }

  return BLOCKS.map(b => {
    let title = b.name
    let notes = ''

    if (b.id === 'QA') {
      title = `${pt.quantTopic} (${pt.quantTargetQs} Qs)`

      if (lastAcc < 60 || pendingC1Count >= 2) {
        notes = `${pt.quantDetail} • [ADAPTIVE: <60% Acc or C1 Gaps] Concept Repair Focus: Basic → Medium Qs.`
      } else if (lastAcc >= 60 && lastAcc < 75) {
        notes = `${pt.quantDetail} • [ADAPTIVE: 60–75% Acc] Medium Practice + Error Correction.`
      } else if (lastAcc >= 75 && lastAcc < 85) {
        notes = `${pt.quantDetail} • [ADAPTIVE: 75–85% Acc] Timed Practice + CAT/PYQs.`
      } else {
        notes = `${pt.quantDetail} • [ADAPTIVE: >85% Acc] Advanced Timed / Mixed PYQs.`
      }
      if (trendMsg) notes += trendMsg

    } else if (b.id === 'DILR') {
      title = `${pt.dilrTopic} (${pt.dilrTargetSets} Sets)`
      notes = `${pt.dilrDetail}`
      if (dominantError === 'C4') {
        notes += ' • [ADAPTIVE C4] Selection & Approach Drill Focus.'
      } else if (dominantError === 'C5') {
        notes += ' • [ADAPTIVE C5] Timed Micro-Sets & Skip Discipline Focus.'
      }

    } else if (b.id === 'VARC') {
      title = `${pt.varcTopic} (${pt.varcTargetPsg} Passages/Qs)`
      notes = `${pt.varcDetail}`
      if (dominantError === 'C3') {
        notes += ' • [ADAPTIVE C3] Keyword & Option Elimination Discipline.'
      }

    } else if (b.id === 'TEST') {
      const dayOfWeek = d.getDay() // 0=Sun, 1=Mon, ..., 6=Sat
      if (dayOfWeek === 0) {
        title = 'SUNDAY FULL MOCK EXAM'
        notes = 'Full 120-min exam condition • 100% analysis required.'
      } else if (dayOfWeek === 1) {
        title = 'MONDAY MOCK ANALYSIS + REPAIR'
        notes = 'Classify C1–C5 errors from Sunday Mock • Re-solve wrong Qs.'
      } else if (dayOfWeek === 2) {
        title = 'TUESDAY VARC SECTIONAL'
        notes = '40-min VARC Sectional Test under strict timed conditions.'
      } else if (dayOfWeek === 3) {
        title = 'WEDNESDAY VARC ANALYSIS + REPAIR/RETEST'
        notes = 'Deconstruct Tuesday VARC errors • Re-solve & Retest.'
      } else if (dayOfWeek === 4) {
        title = 'THURSDAY DILR SECTIONAL'
        notes = '40-min DILR Sectional Test • Practice set selection.'
      } else if (dayOfWeek === 5) {
        title = 'FRIDAY DILR ANALYSIS + REPAIR/RETEST'
        notes = 'Deconstruct Thursday DILR errors • Re-solve & Retest.'
      } else if (dayOfWeek === 6) {
        title = 'SATURDAY QA SECTIONAL'
        notes = '40-min QA Sectional Test • Speed + Accuracy benchmark.'
      } else {
        title = 'TIMED PRACTICE & ERROR REPAIR'
        notes = 'Timed condition • 100% analysis required.'
      }

    } else if (b.id === 'ANALYSIS') {
      title = `Error Analysis — Classify C1–C5 (${totalPending} Logged)`
      notes = 'Classify mistake → Why it happened → Correct method → Prevention rule.'

    } else if (b.id === 'REVISION') {
      title = `Formula & Concept Recap — ${roadmapItem.chapter}`
      notes = '30-sec recap → 2-min formula review → Today\'s biggest trap.'

    } else if (b.id === 'REPAIR') {
      if (pendingC1Count > 0) {
        title = `HIGH PRIORITY REPAIR: ${pendingC1Count} C1 Concept Gaps`
        notes = 'Re-solve failed questions without looking at solutions.'
      } else if (pendingC2Count > 0) {
        title = `CALCULATION DRILL REPAIR: ${pendingC2Count} C2 Calculation Slips`
        notes = 'Speed calculation drill + re-solve calculation errors.'
      } else if (pendingC3Count > 0) {
        title = `KEYWORD RE-READ REPAIR: ${pendingC3Count} C3 Misread Errors`
        notes = 'Re-read passage/question statement with keyword highlighting.'
      } else if (pendingC4Count > 0) {
        title = `APPROACH & SELECTION REPAIR: ${pendingC4Count} C4 Path Errors`
        notes = 'Re-evaluate set/question selection decisions.'
      } else if (pendingC5Count > 0) {
        title = `TIME TRAP REPAIR: ${pendingC5Count} C5 Sunk Time Errors`
        notes = 'Practice 2-minute abandonment rule on sunk time questions.'
      } else {
        title = `Targeted Weakness Repair (${totalPending} Pending)`
        notes = totalPending > 0 ? 'Re-solve failed questions without looking at solutions.' : '0 Pending Errors — Verified Clean!'
      }

    } else if (b.id === 'RETEST') {
      title = `Mastery Retest — ${input.retestCount || totalPending} Retests Pending`
      notes = '3–5 fresh questions on weak topics • 3+/5 correct = verified pass.'
    }

    return {
      id: `${dateKey}_${b.id}`,
      date: dateKey,
      blockId: b.id,
      subject: b.label,
      title,
      status: 'TODO' as TaskStatus,
      startedAt: null,
      completedAt: null,
      timeSpentMin: null,
      notes,
    }
  })
}
