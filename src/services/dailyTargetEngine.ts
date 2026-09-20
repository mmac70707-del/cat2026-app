import { ROADMAP_44 } from '@/data/roadmap44'
import { BLOCKS } from '@/data/config'
import { getCurrentPhase, localDateKey } from '@/services/domain'
import type { Task, ErrorRecord, TaskStatus } from '@/types'

export interface DailyTargetInput {
  dateIso?: string;
  pendingErrors?: ErrorRecord[];
  repairCount?: number;
  retestCount?: number;
}

export function generateDailyTargets(input: DailyTargetInput = {}): Task[] {
  const d = input.dateIso ? new Date(input.dateIso) : new Date()
  const dateKey = localDateKey(d)
  const phase = getCurrentPhase()

  // Find 44-Day First-Pass day if applicable
  const p1Start = new Date('2026-09-18T00:00:00')
  const diffDays = Math.floor((d.getTime() - p1Start.getTime()) / 86_400_000) + 1
  const dayNum = Math.max(1, Math.min(44, diffDays))
  const roadmapItem = ROADMAP_44.find(r => r.dayNum === dayNum) || ROADMAP_44[0]

  const pendingC1Errors = (input.pendingErrors || []).filter(e => e.errorType === 'C1').length
  const totalPendingErrors = (input.pendingErrors || []).length

  return BLOCKS.map(b => {
    let title = b.name
    let notes = ''

    if (b.id === 'QA') {
      title = `${roadmapItem.chapter} (Day ${dayNum < 10 ? '0' + dayNum : dayNum}/44)`
      notes = `Phase: ${phase.name} • Target: 15–20 questions Easy → Moderate.`
    } else if (b.id === 'DILR') {
      title = `DILR Set-Solving — ${dayNum % 2 === 1 ? 'Tables & Bar Graphs' : 'Arrangements & Selection'}`
      notes = '1 quality set attempt • 2nd set ONLY if 1st fully analysed.'
    } else if (b.id === 'VARC') {
      title = `VARC RC Sprint — ${dayNum % 2 === 1 ? 'Main Idea & Argument' : 'Inference & Elimination'}`
      notes = '2 RC passages + 3 VA questions • 15–20 min reading target.'
    } else if (b.id === 'TEST') {
      const dayOfWeek = d.getDay()
      if (dayOfWeek === 0) title = 'SUNDAY FULL MOCK EXAM'
      else if (dayOfWeek === 2) title = 'TUESDAY VARC SECTIONAL'
      else if (dayOfWeek === 4) title = 'THURSDAY DILR SECTIONAL'
      else if (dayOfWeek === 6) title = 'SATURDAY QA SECTIONAL'
      else title = 'TIMED PRACTICE & ERROR REPAIR'
      notes = 'Timed condition • 100% analysis required.'
    } else if (b.id === 'ANALYSIS') {
      title = `Error Analysis — Classify C1–C5 (${totalPendingErrors} Logged)`
      notes = 'Classify mistake → Why it happened → Correct method → Prevention rule.'
    } else if (b.id === 'REVISION') {
      title = `Formula & Concept Recap — ${roadmapItem.chapter}`
      notes = '30-sec recap → 2-min formula review → Today\'s biggest trap.'
    } else if (b.id === 'REPAIR') {
      title = pendingC1Errors > 0
        ? `HIGH PRIORITY REPAIR: ${pendingC1Errors} C1 Concept Gaps`
        : `Targeted Weakness Repair (${input.repairCount || 0} Pending)`
      notes = 'Re-solve failed questions without looking at solutions.'
    } else if (b.id === 'RETEST') {
      title = `Mastery Retest — ${input.retestCount || 0} Retests Pending`
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
