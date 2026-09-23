import { ROADMAP_44 } from '@/data/roadmap44'
import { getPercentylDailyTarget } from '@/data/percentylPlan2'
import { BLOCKS } from '@/data/config'
import { getCurrentPhase, localDateKey } from '@/services/domain'
import { getFirstPassDayNum } from '@/services/calendarEngine'
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

  // Find exact 44-Day First-Pass day & roadmap item
  const dayNum = getFirstPassDayNum(dateKey)
  const roadmapItem = ROADMAP_44.find(r => r.dayNum === (dayNum || 1)) || ROADMAP_44[0]
  const pt = getPercentylDailyTarget(dateKey)

  const pendingC1Errors = (input.pendingErrors || []).filter(e => e.errorType === 'C1').length
  const totalPendingErrors = (input.pendingErrors || []).length

  return BLOCKS.map(b => {
    let title = b.name
    let notes = ''

    if (b.id === 'QA') {
      title = `${pt.quantTopic} (${pt.quantTargetQs} Qs)`
      notes = `${pt.quantDetail} • Phase: ${phase.name}`
    } else if (b.id === 'DILR') {
      title = `${pt.dilrTopic} (${pt.dilrTargetSets} Sets)`
      notes = `${pt.dilrDetail}`
    } else if (b.id === 'VARC') {
      title = `${pt.varcTopic} (${pt.varcTargetPsg} Passages/Qs)`
      notes = `${pt.varcDetail}`
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
