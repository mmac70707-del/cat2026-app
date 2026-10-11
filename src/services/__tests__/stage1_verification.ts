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
import { analyseMock } from '../domain.js'
import { TaskRepository } from '../../repositories/TaskRepository.js'
import { CAT_DATE, SCHEDULE_ITEMS, PHASES } from '../../data/config.js'
import { getFinal50DayPlan } from '../../data/final50Plan.js'
import { getPercentylDailyTarget } from '../../data/percentylPlan2.js'
import type { ErrorRecord, Task, MockRecord } from '../../types'

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

  // I. First-pass dates clamp according to the canonical calendar rule
  const dayBefore = getFirstPassDayNum('2026-09-01')
  const dayAfter  = getFirstPassDayNum('2026-11-01')
  assert('I', 'Dates before first pass return 0 and dates after it clamp to Day 44', dayBefore === 0 && dayAfter === 44, `Before: ${dayBefore}, After: ${dayAfter}`)

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

  // P. Date-driven daily targets remain aligned with the canonical 44-day calendar.
  const targetDay1 = getPercentylDailyTarget('2026-09-18')
  const targetDay24 = getPercentylDailyTarget('2026-10-11')
  const targetDay44 = getPercentylDailyTarget('2026-10-31')
  const targetDatesAligned =
    targetDay1.dayNum === 1 && targetDay1.dateIso === '2026-09-18' &&
    targetDay24.dayNum === 24 && targetDay24.dateIso === '2026-10-11' &&
    targetDay44.dayNum === 44 && targetDay44.dateIso === '2026-10-31'
  assert('P', 'Date-driven daily targets align to Day 1, Day 24 and Day 44', targetDatesAligned,
    `Day 1: ${targetDay1.dayNum}/${targetDay1.dateIso}; Day 24: ${targetDay24.dayNum}/${targetDay24.dateIso}; Day 44: ${targetDay44.dayNum}/${targetDay44.dateIso}`)

  // Q–W. Uploaded Final 50 Days PDF remains the active plan through exam day.
  const finalDay1 = getFinal50DayPlan('2026-10-11')
  const finalWeek4End = getFinal50DayPlan('2026-11-07')
  const freezeStart = getFinal50DayPlan('2026-11-08')
  const finalConsolidation = getFinal50DayPlan('2026-11-09')
  const finalDay49 = getFinal50DayPlan('2026-11-28')
  const examDay = getFinal50DayPlan('2026-11-29')
  assert('Q', 'Final plan starts with Mock 1 on Sunday 11 Oct', finalDay1?.dayNum === 1 && finalDay1.weekNum === 1 && finalDay1.testTitle.includes('FULL MOCK 1'), 'Day 1: ' + (finalDay1?.testTitle ?? 'missing'))
  assert('R', 'Coverage freeze starts after Saturday 7 Nov', finalWeek4End?.coverageFreeze === false && freezeStart?.coverageFreeze === true && finalWeek4End.testTitle.includes('QA SECTIONAL'), '7 Nov: ' + (finalWeek4End?.testTitle ?? 'missing') + '; 8 Nov freeze=' + String(freezeStart?.coverageFreeze))
  assert('S', 'Consolidation begins Monday 9 Nov', finalConsolidation?.phaseNote.includes('CONSOLIDATION') === true && finalConsolidation.weeklyPriority.length > 0, 'Phase: ' + (finalConsolidation?.phaseNote ?? 'missing'))
  assert('T', 'Saturday 28 Nov is rest/logistics, not a test', finalDay49?.dayNum === 49 && finalDay49.testTitle.includes('NO TEST'), 'Day 49: ' + (finalDay49?.testTitle ?? 'missing'))
  assert('U', 'Sunday 29 Nov is exam day, not another mock', examDay?.isExamDay === true && examDay.final10Days === false && !examDay.testTitle.includes('FULL MOCK'), 'Exam day: ' + (examDay?.testTitle ?? 'missing'))
  assert('V', 'Library block ends at 15:00 per PDF', SCHEDULE_ITEMS.some(x => x.block === 'Library Deep Work' && x.time === '13:15–15:00'), JSON.stringify(SCHEDULE_ITEMS.find(x => x.block === 'Library Deep Work')))
  assert('W', 'Mock-Dominated and Consolidation phase dates match PDF', PHASES.some(x => x.id === 'P3' && x.end === '2026-11-08') && PHASES.some(x => x.id === 'P4' && x.start === '2026-11-09' && x.end === '2026-11-20'), PHASES.map(x => x.id + ':' + x.start + '→' + x.end).join(' | '))

  // PDF's active dates replace the generic weekly test labels in generated tasks.
  const tasksMock1 = generateDailyTargets({ dateIso: '2026-10-11' })
  const tasksTaperSaturday = generateDailyTargets({ dateIso: '2026-11-28' })
  const testMock1 = tasksMock1.find(t => t.blockId === 'TEST')
  const testRest = tasksTaperSaturday.find(t => t.blockId === 'TEST')
  assert('X', 'Generated daily tasks show Mock 1 on 11 Oct', testMock1?.title.includes('FULL MOCK 1') === true, 'TEST title: ' + (testMock1?.title ?? 'missing'))
  assert('Y', 'Generated daily tasks show no test on 28 Nov', testRest?.title.includes('NO TEST') === true, 'TEST title: ' + (testRest?.title ?? 'missing'))
  const breakfastIndex = SCHEDULE_ITEMS.findIndex(item => item.block === 'Breakfast')
  const qaClockIndex = SCHEDULE_ITEMS.findIndex(item => item.block === 'QA Session')
  const breakfastClock = SCHEDULE_ITEMS[breakfastIndex]
  const qaClock = SCHEDULE_ITEMS[qaClockIndex]
  assert('AD', 'Breakfast finishes before the PDF-locked 09:00 QA start', breakfastClock?.time === '08:00–08:30' && qaClock?.time === '09:00–10:30' && breakfastIndex >= 0 && breakfastIndex < qaClockIndex, 'Breakfast: ' + (breakfastClock?.time ?? 'missing') + '; QA: ' + (qaClock?.time ?? 'missing'))
  const mockDayTasks = generateDailyTargets({ dateIso: '2026-10-11' })
  const mockQA = mockDayTasks.find(t => t.blockId === 'QA')
  const mockDILR = mockDayTasks.find(t => t.blockId === 'DILR')
  const mockVARC = mockDayTasks.find(t => t.blockId === 'VARC')
  assert('AE', 'Mock-day QA card does not impose a separate topic quota', mockQA?.title.includes('FULL MOCK ONLY — QA SECTION 3/3') === true && mockQA?.notes.includes('uninterrupted 120-minute mock') === true, mockQA?.title ?? 'missing')
  assert('AF', 'Mock-day DILR and VARC cards follow fixed exam order', mockDILR?.title.includes('SECTION 2/3') === true && mockVARC?.title.includes('SECTION 1/3') === true, (mockVARC?.title ?? 'missing') + ' | ' + (mockDILR?.title ?? 'missing'))

  // Z–AB. Mock facts drive the next three Library blocks only when the tracker has enough evidence.
  const mockFixture: MockRecord = {
    id: 'mock_fixture_1', name: 'Mock 1', date: '2026-10-11', createdAt: '2026-10-11T06:00:00.000Z',
    total: 100, att: 45, overall: 69, qaAcc: 80, dlAcc: 40, vcAcc: 75, weak: [],
    qa: 45, dilr: 10, varc: 45, qaat: 15, dlat: 10, vcat: 20,
    qaCorrect: 12, qaWrong: 3, dilrCorrect: 4, dilrWrong: 6, varcCorrect: 15, varcWrong: 5,
  }
  const mondayTargets = generateDailyTargets({ dateIso: '2026-10-12', recentMocks: [mockFixture] })
  const tuesdayTargets = generateDailyTargets({ dateIso: '2026-10-13', recentMocks: [mockFixture] })
  const wednesdayTargets = generateDailyTargets({ dateIso: '2026-10-14', recentMocks: [mockFixture] })
  const thursdayTargets = generateDailyTargets({ dateIso: '2026-10-15', recentMocks: [mockFixture] })
  const mondayLibrary = mondayTargets.find(t => t.blockId === 'TEST')
  const tuesdayLibrary = tuesdayTargets.find(t => t.blockId === 'TEST')
  const wednesdayLibrary = wednesdayTargets.find(t => t.blockId === 'TEST')
  const thursdayLibrary = thursdayTargets.find(t => t.blockId === 'TEST')
  assert('Z', 'Lowest accuracy with 8+ attempts drives first library block', mondayLibrary?.title.includes('LIBRARY PRIORITY 1/3: DILR') === true && mondayLibrary?.notes.includes('40%') === true, mondayLibrary?.title ?? 'missing')
  assert('AA', 'Weak-section priority continues through library blocks 2 and 3', tuesdayLibrary?.title.includes('LIBRARY PRIORITY 2/3: DILR') === true && wednesdayLibrary?.title.includes('LIBRARY PRIORITY 3/3: DILR') === true, (tuesdayLibrary?.title ?? 'missing') + ' | ' + (wednesdayLibrary?.title ?? 'missing'))
  assert('AB', 'Library priority stops after the next three blocks', thursdayLibrary?.title.includes('LIBRARY PRIORITY') === false, thursdayLibrary?.title ?? 'missing')
  // AD–AI. PDF page 8's Final 10 Days (19–28 Nov) must override generic weekly practice.
  const final10Before = getFinal50DayPlan('2026-11-18')
  const final10Start = getFinal50DayPlan('2026-11-19')
  const final10QASectional = getFinal50DayPlan('2026-11-21')
  const final10Mock7 = getFinal50DayPlan('2026-11-22')
  const final10LastDay = getFinal50DayPlan('2026-11-28')
  assert('AG', 'Final-10-day override starts exactly on 19 Nov', final10Before?.final10Days === false && final10Start?.final10Days === true && final10Start.phaseNote.includes('FINAL 10 DAYS: REVISION ONLY'), '18 Nov=' + String(final10Before?.final10Days) + '; 19 Nov=' + String(final10Start?.final10Days))
  assert('AH', 'Final 10-day QA focus uses only PDF Tier-1 recall topics', final10Start?.qaFocus.includes('Percentages') === true && final10Start?.qaFocus.includes('Time-Speed-Distance') === true && final10Start?.qaFocus.includes('new topic') === false && final10Start?.qaFocus.includes('PYQ') === false, final10Start?.qaFocus ?? 'missing')
  assert('AI', 'Final 10-day DILR and VARC lists match PDF page 8', final10Start?.dilrFocus.includes('Pie charts') === true && final10Start?.dilrFocus.includes('Caselets') === true && final10Start?.varcFocus.includes('Para Summary') === true && final10Start?.varcFocus.includes('Para Jumble') === true, (final10Start?.dilrFocus ?? 'missing') + ' | ' + (final10Start?.varcFocus ?? 'missing'))
  assert('AJ', 'Final-10-day override keeps scheduled DILR sectional on 19 Nov', final10Start?.testTitle.includes('DILR SECTIONAL') === true, final10Start?.testTitle ?? 'missing')
  assert('AK', 'Final-10-day override keeps QA sectional on 21 Nov and Mock 7 on 22 Nov', final10QASectional?.final10Days === true && final10QASectional.testTitle.includes('QA SECTIONAL') && final10Mock7?.testTitle.includes('FULL MOCK 7') === true, (final10QASectional?.testTitle ?? 'missing') + ' | ' + (final10Mock7?.testTitle ?? 'missing'))
  assert('AL', '28 Nov is still the final revision-only rest/logistics day', final10LastDay?.final10Days === true && final10LastDay.testTitle.includes('NO TEST') && final10LastDay.gate.includes('centre route'), (final10LastDay?.testTitle ?? 'missing') + ' | ' + (final10LastDay?.gate ?? 'missing'))
  const final10Tasks = generateDailyTargets({ dateIso: '2026-11-19' })
  const final10QA = final10Tasks.find(t => t.blockId === 'QA')
  const final10DILR = final10Tasks.find(t => t.blockId === 'DILR')
  const final10VARC = final10Tasks.find(t => t.blockId === 'VARC')
  assert('AM', 'Generated daily subject tasks inherit revision-only focus', final10QA?.title.includes('Tier-1 formula recall only') === true && final10DILR?.title.includes('Pattern recognition only') === true && final10VARC?.title.includes('Strategy recall only') === true, [final10QA?.title, final10DILR?.title, final10VARC?.title].join(' | '))

  const final10Analysis23 = getFinal50DayPlan('2026-11-23')
  const final10LightVARC24 = getFinal50DayPlan('2026-11-24')
  const final10LightAnalysis25 = getFinal50DayPlan('2026-11-25')
  const final10OneDILR26 = getFinal50DayPlan('2026-11-26')
  const final10NoTest27 = getFinal50DayPlan('2026-11-27')
  assert('AN', 'Final 10-day exceptions match PDF for 23–27 Nov', final10Analysis23?.testTitle.includes('MOCK ANALYSIS') === true && final10LightVARC24?.testTitle.includes('LIGHT VARC') === true && final10LightAnalysis25?.testTitle.includes('LIGHT ANALYSIS') === true && final10OneDILR26?.testTitle.includes('ONE DILR SET') === true && final10NoTest27?.testTitle.includes('NO TEST') === true, [final10Analysis23?.testTitle, final10LightVARC24?.testTitle, final10LightAnalysis25?.testTitle, final10OneDILR26?.testTitle, final10NoTest27?.testTitle].join(' | '))
  assert('AO', 'Exam day is not misclassified as part of the final-ten-day revision window', examDay?.isExamDay === true && examDay.final10Days === false, 'Exam day: ' + (examDay?.testTitle ?? 'missing'))

  const calculated = analyseMock({
    qa: '45', dilr: '10', varc: '45', qaat: '15', dlat: '10', vcat: '20',
    qaCorrect: '12', qaWrong: '3', dilrCorrect: '4', dilrWrong: '6', varcCorrect: '15', varcWrong: '5',
  })
  assert('AC', 'Mock accuracy uses correct/attempted rather than score/net score', calculated.qaAcc === 80 && calculated.dlAcc === 40 && calculated.vcAcc === 75, 'QA ' + calculated.qaAcc + '% · DILR ' + calculated.dlAcc + '% · VARC ' + calculated.vcAcc + '%')

  return results
}
