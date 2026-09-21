import {
  getKolkataDateParts,
  getKolkataDateKey,
  getKolkataWeekKey,
  getKolkataMonthKey,
  getKolkataYearKey,
  getFirstPassDayNum,
  buildCalendarWeek,
  buildCalendarMonth,
  buildCalendarYear
} from '../calendarEngine'
import { generateDailyTargets } from '../dailyTargetEngine'
import { CAT_DATE } from '../../data/config'
import type { ErrorRecord } from '../../types'

export function runStage1VerificationTests() {
  const results: { test: string; status: 'PASS' | 'FAIL'; detail: string }[] = []

  function assert(name: string, condition: boolean, detail: string) {
    results.push({ test: name, status: condition ? 'PASS' : 'FAIL', detail })
  }

  // 1. Same date called repeatedly = no duplicate tasks
  const dateKey1 = '2026-09-18'
  const targets1 = generateDailyTargets({ dateIso: dateKey1 })
  const targets2 = generateDailyTargets({ dateIso: dateKey1 })
  const ids1 = targets1.map(t => t.id)
  const ids2 = targets2.map(t => t.id)
  const isIdempotent = targets1.length === 8 && JSON.stringify(ids1) === JSON.stringify(ids2)
  assert('1. Idempotency (Same date = identical tasks & IDs)', isIdempotent, `Generated ${targets1.length} tasks consistently`)

  // 2. 2026-09-18 generates Day 01
  const day1Num = getFirstPassDayNum('2026-09-18')
  assert('2. 2026-09-18 generates Day 01', day1Num === 1, `Calculated Day Num: ${day1Num}`)

  // 3. 2026-10-31 generates Day 44
  const day44Num = getFirstPassDayNum('2026-10-31')
  assert('3. 2026-10-31 generates Day 44', day44Num === 44, `Calculated Day Num: ${day44Num}`)

  // 4. 2026-11-29 uses CAT exam date
  const catDateStr = CAT_DATE.toISOString().slice(0, 10)
  assert('4. 2026-11-29 matches CAT exam date', catDateStr === '2026-11-29', `CAT Date ISO: ${catDateStr}`)

  // 5. Asia/Kolkata timezone verification across UTC boundaries
  // 2026-09-17 19:00:00 UTC = 2026-09-18 00:30:00 Asia/Kolkata
  const utcLateNight = new Date('2026-09-17T19:00:00Z')
  const kolkataKey = getKolkataDateKey(utcLateNight)
  assert('5. Asia/Kolkata date accurate across UTC offset', kolkataKey === '2026-09-18', `UTC 17th 19:00Z -> Kolkata Date Key: ${kolkataKey}`)

  // 6. Monday/Sunday week boundaries work
  const weekObj = buildCalendarWeek('2026-W38')
  const isMonToSun = weekObj.days[0].dayName === 'MON' && weekObj.days[6].dayName === 'SUN'
  assert('6. Monday/Sunday week boundaries', isMonToSun, `Week 38 starts ${weekObj.days[0].dayName} (${weekObj.days[0].dateKey}) to ${weekObj.days[6].dayName} (${weekObj.days[6].dateKey})`)

  // 7. September -> October month transition
  const sepMonth = buildCalendarMonth('2026-09')
  const octMonth = buildCalendarMonth('2026-10')
  assert('7. Sep -> Oct month transition', sepMonth.weeks.length > 0 && octMonth.weeks.length > 0, `Sep weeks: ${sepMonth.weeks.length}, Oct weeks: ${octMonth.weeks.length}`)

  // 8. December -> January year transition
  const decMonth = buildCalendarMonth('2026-12')
  const janMonth = buildCalendarMonth('2027-01')
  const yearObj = buildCalendarYear('2026')
  assert('8. Dec -> Jan transition & 12 Months', decMonth.monthNum === 12 && janMonth.monthNum === 1 && yearObj.months.length === 12, `Year 2026 has ${yearObj.months.length} months`)

  // 9. Pending errors feed Daily Target generation
  const fakeErrors: ErrorRecord[] = [
    {
      id: 'err_1', errorType: 'C1', subject: 'QA', topicId: 'qa-pct', topic: 'Percentages',
      wrongReason: 'Formula gap', correctMethod: 'A = P(1+r/100)^n', preventionRule: 'Check power',
      repairStatus: 'PENDING', retestStatus: 'PENDING', createdAt: '2026-09-18T00:00:00Z', repairedAt: null, retestedAt: null
    }
  ]
  const errorTargets = generateDailyTargets({ dateIso: '2026-09-18', pendingErrors: fakeErrors })
  const repairTask = errorTargets.find(t => t.blockId === 'REPAIR')
  assert('9. Pending C1 errors feed REPAIR block target', repairTask?.title.includes('HIGH PRIORITY REPAIR') ?? false, `Repair Task Title: ${repairTask?.title}`)

  return results
}
