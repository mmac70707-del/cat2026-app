import { ROADMAP_44 } from '@/data/roadmap44'
import { getPercentylDailyTarget } from '@/data/percentylPlan2'
import { BLOCKS } from '@/data/config'
import { getFirstPassDayNum, getKolkataDateKey } from '@/services/calendarEngine'
import { getFinal50DayPlan } from '@/data/final50Plan'
import type { Task, ErrorRecord, DailyScore, TaskStatus, MockRecord } from '@/types'

export interface DailyTargetInput {
  dateIso?: string;
  pendingErrors?: ErrorRecord[];
  allErrors?: ErrorRecord[];
  dailyScores?: DailyScore[];
  recentMocks?: MockRecord[];
  repairCount?: number;
  retestCount?: number;
}

export function generateDailyTargets(input: DailyTargetInput = {}): Task[] {
  const d = input.dateIso ? new Date(input.dateIso + 'T12:00:00Z') : new Date()
  const dateKey = input.dateIso && /^\d{4}-\d{2}-\d{2}$/.test(input.dateIso) ? input.dateIso : getKolkataDateKey(d)
  const finalPlan = getFinal50DayPlan(dateKey)

  // Preserve 44-day first-pass history; the uploaded PDF wins for active dates.
  const dayNum = getFirstPassDayNum(dateKey)
  const roadmapItem = ROADMAP_44.find(r => r.dateIso === dateKey) || ROADMAP_44.find(r => r.dayNum === (dayNum || 1)) || ROADMAP_44[0]
  const pt = getPercentylDailyTarget(dateKey)
  const latestMock = (input.recentMocks || [])
    .filter(mock => mock.date <= dateKey)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))[0] || null
  const daysAfterLatestMock = latestMock
    ? Math.floor((Date.parse(dateKey + 'T00:00:00Z') - Date.parse(latestMock.date + 'T00:00:00Z')) / 86400000)
    : 0
  const hasLatestMockCounts = Boolean(latestMock && [
    latestMock.qaCorrect, latestMock.qaWrong, latestMock.dilrCorrect,
    latestMock.dilrWrong, latestMock.varcCorrect, latestMock.varcWrong,
  ].every(value => typeof value === 'number'))
  const sectionAccuracy = latestMock && hasLatestMockCounts ? [
    { label: 'QA', accuracy: latestMock.qaAcc, attempts: latestMock.qaat },
    { label: 'DILR', accuracy: latestMock.dlAcc, attempts: latestMock.dlat },
    { label: 'VARC', accuracy: latestMock.vcAcc, attempts: latestMock.vcat },
  ].filter(section => section.attempts >= 8) : []
  const weakestMockSection = sectionAccuracy.length > 0
    ? sectionAccuracy.slice().sort((a, b) => a.accuracy - b.accuracy)[0]
    : null
  const postMockLibraryBlock = Boolean(latestMock && daysAfterLatestMock >= 1 && daysAfterLatestMock <= 3)

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
      if (finalPlan?.isExamDay) {
        title = 'EXAM DAY — NO NEW QA PRACTICE'
        notes = 'No topic expansion or separate QA quota. Follow official exam-day instructions.'
      } else if (finalPlan?.isDayZero) {
        title = finalPlan.qaFocus
        notes = finalPlan.testNotes
      } else if (finalPlan?.testTitle.includes('FULL MOCK')) {
        title = 'FULL MOCK ONLY — QA SECTION 3/3'
        notes = 'QA is the third 40-minute section of one uninterrupted 120-minute mock. Fixed order: VARC → DILR → QA. Do not add a separate QA topic quota today; log the section score and attempts/correct/wrong in the mock tracker.'
      } else if (finalPlan?.testTitle.includes('MOCK ANALYSIS')) {
        title = 'MOCK ANALYSIS — QA'
        notes = 'Review QA attempts, correct, wrong and score. Classify errors C1–C5; choose repair topics from evidence, not the weekly topic list.'
      } else if (finalPlan) {
        title = finalPlan.qaFocus
        notes = finalPlan.weeklyPriority + ' • Let the latest mock’s weakest section and three repair topics outrank the fixed topic list.'
      } else {
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
      }

    } else if (b.id === 'DILR') {
      if (finalPlan?.isExamDay) {
        title = 'EXAM DAY — NO NEW DILR PRACTICE'
        notes = 'No new sets or separate DILR quota. Follow official exam-day instructions.'
      } else if (finalPlan?.isDayZero) {
        title = finalPlan.dilrFocus
        notes = finalPlan.testNotes
      } else if (finalPlan?.testTitle.includes('FULL MOCK')) {
        title = 'FULL MOCK ONLY — DILR SECTION 2/3'
        notes = 'DILR is the second 40-minute section of one uninterrupted 120-minute mock. Fixed order: VARC → DILR → QA. No separate DILR set quota today; log attempts, correct, wrong and score.'
      } else if (finalPlan?.testTitle.includes('MOCK ANALYSIS')) {
        title = 'MOCK ANALYSIS — DILR'
        notes = 'Review question attempts and set choices, correct, wrong and score. Classify C1–C5; identify selection errors without guessing beyond the evidence.'
      } else if (finalPlan) {
        title = finalPlan.dilrFocus
        notes = finalPlan.weeklyPriority
      } else {
        title = `${pt.dilrTopic} (${pt.dilrTargetSets} Sets)`
        notes = `${pt.dilrDetail}`
        if (dominantError === 'C4') {
          notes += ' • [ADAPTIVE C4] Selection & Approach Drill Focus.'
        } else if (dominantError === 'C5') {
          notes += ' • [ADAPTIVE C5] Timed Micro-Sets & Skip Discipline Focus.'
        }
      }

    } else if (b.id === 'VARC') {
      if (finalPlan?.isExamDay) {
        title = 'EXAM DAY — NO NEW VARC PRACTICE'
        notes = 'No new passages or separate VARC quota. Follow official exam-day instructions.'
      } else if (finalPlan?.isDayZero) {
        title = finalPlan.varcFocus
        notes = finalPlan.testNotes
      } else if (finalPlan?.testTitle.includes('FULL MOCK')) {
        title = 'FULL MOCK ONLY — VARC SECTION 1/3'
        notes = 'VARC is the first 40-minute section of one uninterrupted 120-minute mock. Fixed order: VARC → DILR → QA. No separate RC/VA practice quota today; log attempts, correct, wrong and score.'
      } else if (finalPlan?.testTitle.includes('MOCK ANALYSIS')) {
        title = 'MOCK ANALYSIS — VARC'
        notes = 'Review RC/VA attempts, correct, wrong and score. Classify C1–C5 and write evidence-based repair topics; do not treat the weekly focus list as new practice quota.'
      } else if (finalPlan) {
        title = finalPlan.varcFocus
        notes = finalPlan.weeklyPriority
      } else {
        title = `${pt.varcTopic} (${pt.varcTargetPsg} Passages/Qs)`
        notes = `${pt.varcDetail}`
        if (dominantError === 'C3') {
          notes += ' • [ADAPTIVE C3] Keyword & Option Elimination Discipline.'
        }
      }

    } else if (b.id === 'TEST') {
      if (finalPlan) {
        title = finalPlan.testTitle
        notes = finalPlan.testNotes
      } else {
        const dayOfWeek = new Date(dateKey + 'T12:00:00Z').getUTCDay()
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
        } else {
          title = 'SATURDAY QA SECTIONAL'
          notes = '40-min QA Sectional Test • Speed + Accuracy benchmark.'
        }
      }

    } else if (b.id === 'ANALYSIS') {
      if (finalPlan?.isExamDay) {
        title = 'EXAM DAY — CALM CHECKLIST ONLY'
        notes = 'No analysis or new work. Follow the admit card and centre instructions.'
      } else if (finalPlan?.isDayZero) {
        title = 'DAY 0 — QA SECTIONAL SAME-EVENING ANALYSIS'
        notes = 'Use 21:00–21:45 to review the 40-minute QA sectional, mark mistakes, and write a short error note. No new topic today.'
      } else if (finalPlan?.testTitle.includes('FULL MOCK')) {
        title = 'SAME-NIGHT MOCK TRACKER — ATTEMPTS / CORRECT / WRONG / SCORE'
        notes = 'Fill the Mock Tracker tonight for VARC, DILR and QA. Full mock analysis is Monday and must take at least as long as the 120-minute mock.'
      } else if (finalPlan?.testTitle.includes('QA SECTIONAL')) {
        title = 'QA SECTIONAL — SAME-EVENING ANALYSIS'
        notes = 'Use the 21:00–21:45 slot tonight. Record attempts, correct, wrong and score; classify C1–C5 and identify what needs repair.'
      } else if (finalPlan?.testTitle.includes('VARC SECTIONAL')) {
        title = 'VARC SECTIONAL — SCORE LOG TONIGHT'
        notes = 'Record attempts, correct, wrong and score tonight. The full analysis, repair and retest are Wednesday.'
      } else if (finalPlan?.testTitle.includes('DILR SECTIONAL')) {
        title = 'DILR SECTIONAL — SCORE LOG TONIGHT'
        notes = 'Record attempts, correct, wrong and score tonight. The full analysis, repair and retest are Friday.'
      } else if (finalPlan?.testTitle.includes('LIGHT ANALYSIS')) {
        title = 'LIGHT ANALYSIS + REPAIR — TAPER'
        notes = 'Keep this short and calm. Review only known high-value errors, then stop while fresh. No new material.'
      } else if (finalPlan?.testTitle.includes('ANALYSIS')) {
        title = 'PDF ANALYSIS GATE — ' + finalPlan.testTitle
        notes = finalPlan.testTitle.includes('MOCK ANALYSIS')
          ? 'Analysis takes at least as long as the mock. Complete section-wise attempts/correct/wrong/score; select the weakest section only with about 8+ attempts; classify C1–C5; write three repair topics for Monday–Wednesday and the next three Library blocks.'
          : finalPlan.testNotes
      } else {
        title = `Error Analysis — Classify C1–C5 (${totalPending} Logged)`
        notes = 'Classify mistake → Why it happened → Correct method → Prevention rule.'
      }

    } else if (b.id === 'REVISION') {
      if (finalPlan?.isExamDay) {
        title = 'EXAM CHECKLIST — ADMIT CARD, ID, ROUTE, SLEEP'
        notes = 'No new material. Align sleep to the exam slot and follow the admit card.'
      } else if (finalPlan) {
        title = finalPlan.isDayZero ? 'DAY 0 — NO NEW TOPICS' : 'PDF-LOCKED REVISION — ' + finalPlan.title
        notes = finalPlan.isDayZero ? finalPlan.testNotes : '30-sec recap → 2-min revision → connect to a previous concept → preview tomorrow. Use only your error log, Tier-1 formulas and familiar strategies.'
      } else {
        title = `Formula & Concept Recap — ${roadmapItem.chapter}`
        notes = '30-sec recap → 2-min formula review → Today\'s biggest trap.'
      }

    } else if (b.id === 'REPAIR') {
      if (finalPlan?.isExamDay) {
        title = 'EXAM DAY — NO NEW REPAIR WORK'
        notes = 'Trust the preparation. Follow official exam-day instructions.'
      } else if (pendingC1Count > 0) {
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
      title = finalPlan?.isExamDay ? 'EXAM DAY — NO RETEST' : `Mastery Retest — ${input.retestCount || totalPending} Retests Pending`
      notes = finalPlan?.isExamDay ? 'No practice test today.' : '3–5 fresh questions on weak topics • 3+/5 correct = verified pass.'
    }

    if (b.id === 'TEST' && postMockLibraryBlock && latestMock) {
      if (weakestMockSection) {
        title += ` · LIBRARY PRIORITY ${daysAfterLatestMock}/3: ${weakestMockSection.label}`
        notes += `\n\nPDF LIBRARY RULE: In block ${daysAfterLatestMock}/3 after ${latestMock.name} (${latestMock.date}), prioritise ${weakestMockSection.label} in the 13:15–15:00 Library Deep Work slot. Its accuracy was ${weakestMockSection.accuracy}% from ${weakestMockSection.attempts} attempts. Record three repair topics and let them outrank the weekly topic list.`
      } else {
        title += ` · LIBRARY PRIORITY ${daysAfterLatestMock}/3: REVIEW MOCK DATA`
        notes += `\n\nPDF LIBRARY RULE: This is one of the next three Library blocks after ${latestMock.name}. The stored mock does not have complete correct/wrong counts or at least 8 attempts in a section, so do not guess the weakest section. Complete the tracker and choose three evidence-based repair topics.`
      }
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
