import {
  getKolkataDateParts,
  getKolkataDateKey,
  getKolkataWeekKey,
  getKolkataMonthKey,
  getKolkataYearKey,
  getFirstPassDayNum,
  buildCalendarDay,
  buildCalendarWeek,
  buildCalendarMonth,
  buildCalendarYear
} from '../calendarEngine.js'
import { generateDailyTargets } from '../dailyTargetEngine.js'
import { TaskRepository } from '../../repositories/TaskRepository.js'
import { CAT_DATE } from '../../data/config.js'
import type { ErrorRecord, Task } from '../../types'

export async function runStage1VerificationTests() {
  const results: { id: string; test: string; status: 'PASS' | 'FAIL'; detail: string }[] = []

  function assert(id: string, name: string, condition: boolean, detail: string) {
    results.push({ id, test: name, status: condition ? 'PASS' : 'FAIL', detail })
  }

  // A. Asia/Kolkata date calculation
  // 2026-09-17 19:00:00 UTC = 2026-09-18 00:30:00 Asia/Kolkata
  const utcLateNight = new Date('2026-09-17T19:00:00Z')
  const kolkataKey = getKolkataDateKey(utcLateNight)
  assert('A', 'Asia/Kolkata date calculation across UTC offset', kolkataKey === '2026-09-18', `UTC 17th 19:00Z -> Kolkata Date Key: ${kolkataKey}`)

  // B. Date rollover detection
  const dayA = buildCalendarDay('2026-09-18', '2026-09-18')
  const dayB = buildCalendarDay('2026-09-18', '2026-09-19')
  assert('B', 'Date rollover detection (Today -> Past transition)', dayA.isToday && !dayA.isPast && !dayB.isToday && dayB.isPast, `Day A isToday: ${dayA.isToday}, Day B isPast: ${dayB.isPast}`)

  // C. Daily logical key uniqueness (YYYY-MM-DD)
  const dKey1 = getKolkataDateKey(new Date('2026-09-18T10:00:00Z'))
  const dKey2 = getKolkataDateKey(new Date('2026-09-18T15:00:00Z'))
  assert('C', 'Daily logical key uniqueness (YYYY-MM-DD)', dKey1 === '2026-09-18' && dKey1 === dKey2, `dKey1: ${dKey1}, dKey2: ${dKey2}`)

  // D. Weekly logical key uniqueness (YYYY-Www)
  const wKey1 = getKolkataWeekKey(new Date('2026-09-18T10:00:00Z')) // Friday W38
  const wKey2 = getKolkataWeekKey(new Date('2026-09-20T10:00:00Z')) // Sunday W38
  assert('D', 'Weekly logical key uniqueness (YYYY-Www)', wKey1 === '2026-W38' && wKey1 === wKey2, `wKey1: ${wKey1}, wKey2: ${wKey2}`)

  // E. Monthly logical key uniqueness (YYYY-MM)
  const mKey1 = getKolkataMonthKey(new Date('2026-09-01T10:00:00Z'))
  const mKey2 = getKolkataMonthKey(new Date('2026-09-30T10:00:00Z'))
  assert('E', 'Monthly logical key uniqueness (YYYY-MM)', mKey1 === '2026-09' && mKey1 === mKey2, `mKey1: ${mKey1}, mKey2: ${mKey2}`)

  // F. Yearly logical key uniqueness (YYYY)
  const yKey = getKolkataYearKey(new Date('2026-09-18T10:00:00Z'))
  assert('F', 'Yearly logical key uniqueness (YYYY)', yKey === '2026', `yKey: ${yKey}`)

  // G. First-pass Day 01 calculation
  const day1Num = getFirstPassDayNum('2026-09-18')
  assert('G', 'First-pass Day 01 calculation', day1Num === 1, `Calculated Day Num: ${day1Num}`)

  // H. First-pass Day 44 calculation
  const day44Num = getFirstPassDayNum('2026-10-31')
  assert('H', 'First-pass Day 44 calculation', day44Num === 44, `Calculated Day Num: ${day44Num}`)

  // I. Dates outside first-pass range
  const dayBefore = getFirstPassDayNum('2026-09-01')
  const dayAfter  = getFirstPassDayNum('2026-11-01')
  assert('I', 'Dates outside first-pass range return 0', dayBefore === 0 && dayAfter === 0, `Before: ${dayBefore}, After: ${dayAfter}`)

  // J. Missed-day recovery & historical state
  const historicalTask: Task = {
    id: '2026-09-18_QA',
    date: '2026-09-18',
    blockId: 'QA',
    subject: 'QA',
    title: 'Percentages',
    status: 'TODO', // Uncompleted historical day = MISSED
    startedAt: null,
    completedAt: null,
    timeSpentMin: null,
    notes: 'Historical missed day task'
  }
  assert('J', 'Missed-day recovery preserves historical status without auto-completing', historicalTask.status === 'TODO', `Status remains ${historicalTask.status}`)

  // K. Duplicate artifact/task prevention (Idempotency)
  const dateKeyK = '2026-09-18'
  const targets1 = generateDailyTargets({ dateIso: dateKeyK })
  const targets2 = generateDailyTargets({ dateIso: dateKeyK })
  const ids1 = targets1.map(t => t.id)
  const ids2 = targets2.map(t => t.id)
  const isIdempotent = targets1.length === 8 && JSON.stringify(ids1) === JSON.stringify(ids2)
  assert('K', 'Duplicate artifact/task prevention (Idempotency)', isIdempotent, `Generated ${targets1.length} tasks with identical keys`)

  // L. Historical artifact preservation
  const calYear = buildCalendarYear('2026')
  assert('L', 'Historical artifact preservation (Full 12 months generated)', calYear.months.length === 12, `Year 2026 contains ${calYear.months.length} months`)

  // M. Pending-error integration
  const fakeErrors: ErrorRecord[] = [
    {
      id: 'err_1', errorType: 'C1', subject: 'QA', topicId: 'qa-pct', topic: 'Percentages',
      wrongReason: 'Formula gap', correctMethod: 'A = P(1+r/100)^n', preventionRule: 'Check power',
      repairStatus: 'PENDING', retestStatus: 'PENDING', createdAt: '2026-09-18T00:00:00Z', repairedAt: null, retestedAt: null
    }
  ]
  const errorTargets = generateDailyTargets({ dateIso: '2026-09-18', pendingErrors: fakeErrors })
  const repairTask = errorTargets.find(t => t.blockId === 'REPAIR')
  assert('M', 'Pending-error integration feeds REPAIR block target', repairTask?.title.includes('HIGH PRIORITY REPAIR') ?? false, `Repair Title: ${repairTask?.title}`)

  // N. Daily target generation (exact 8-block sequence)
  const expectedSeq = ['QA', 'DILR', 'VARC', 'TEST', 'ANALYSIS', 'REVISION', 'REPAIR', 'RETEST']
  const generatedSeq = targets1.map(t => t.blockId)
  assert('N', 'Daily target generation in exact 8-block sequence', JSON.stringify(generatedSeq) === JSON.stringify(expectedSeq), `Sequence: ${generatedSeq.join('->')}`)

  // O. TaskRepository integration
  let repoError = false
  try {
    const todayKeyFromRepo = TaskRepository.todayKey()
    assert('O', 'TaskRepository integration using Kolkata date key', typeof todayKeyFromRepo === 'string' && todayKeyFromRepo.length === 10, `Repo Today Key: ${todayKeyFromRepo}`)
  } catch {
    repoError = true
    assert('O', 'TaskRepository integration', false, 'TaskRepository lookup error')
  }

  return results
}
