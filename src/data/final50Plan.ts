export interface Final50WeekPlan {
  number: number;
  title: string;
  dates: string;
  startDate: string;
  endDate: string;
  phaseNote: string;
  qaFocus: string;
  dilrFocus: string;
  varcFocus: string;
  weeklyPriority: string;
  gate: string;
}

export interface Final50DayPlan extends Final50WeekPlan {
  weekNum: number;
  dateIso: string;
  dayNum: number;
  testTitle: string;
  testNotes: string;
  isDayZero: boolean;
  isExamDay: boolean;
  final10Days: boolean;
  coverageFreeze: boolean;
}

export const FINAL_50_WEEK_PLANS: Final50WeekPlan[] = [
  {
    number: 1,
    title: 'Baseline + arithmetic core',
    dates: '11 Oct – 17 Oct',
    startDate: '2026-10-11',
    endDate: '2026-10-17',
    phaseNote: 'Mock-Dominated',
    qaFocus: 'Percentages · Ratio & Proportion · Averages · Profit & Loss (including discount)',
    dilrFocus: 'Tables and Bar / Column / Line graphs · Caselets',
    varcFocus: 'Use OCTAVES on every RC passage · Daily reading 15–20 min · Para Jumble basics',
    weeklyPriority: 'Mock 1 is a baseline: judge nothing, diagnose everything.',
    gate: 'Mock 1 fully analysed by Monday night; write three repair topics. Those topics outrank this week’s topic list.'
  },
  {
    number: 2,
    title: 'Arithmetic part 2 + speed',
    dates: '18 Oct – 24 Oct',
    startDate: '2026-10-18',
    endDate: '2026-10-24',
    phaseNote: 'Mock-Dominated',
    qaFocus: 'SI & CI · Mixtures & Alligation · Time-Speed-Distance · Time & Work (including pipes)',
    dilrFocus: 'Arrangements: linear, circular, seating · Distribution',
    varcFocus: 'RC inference and tone · Para Summary · Time every passage; 4 questions is roughly 6–7 min',
    weeklyPriority: 'Compare Mock 2 with Mock 1. If the biggest error type did not shrink, change the process (SOLVE / SCOPE / OCTAVES), not the topic list.',
    gate: 'Use mock evidence and the repeated error type to decide what gets repaired next.'
  },
  {
    number: 3,
    title: 'Algebra + Number System',
    dates: '25 Oct – 31 Oct',
    startDate: '2026-10-25',
    endDate: '2026-10-31',
    phaseNote: 'Mock-Dominated',
    qaFocus: 'Linear & Quadratic Equations · Inequalities · Number System (divisibility, HCF/LCM, remainders) · Progressions',
    dilrFocus: 'Selection and grouping · Games & Tournaments · Venn / set-based sets',
    varcFocus: 'RC themes: science, humanities, economics · Odd One Out · Three passages a day, timed',
    weeklyPriority: 'Use the error log to avoid dragging weak topics forward without evidence.',
    gate: 'Every topic studied this week has a retest result. A failed retest is flagged for Consolidation.'
  },
  {
    number: 4,
    title: 'Geometry + modern math — last new-content week',
    dates: '1 Nov – 7 Nov',
    startDate: '2026-11-01',
    endDate: '2026-11-07',
    phaseNote: 'Mock-Dominated · coverage freeze at the end of Saturday 7 Nov',
    qaFocus: 'Geometry: lines/angles, triangles, circles, mensuration · Functions and Logarithms · P&C, Probability, Set Theory (exposure only)',
    dilrFocus: 'Routes / networks and scheduling · Mixed sets; practise the 2-minute set-selection decision',
    varcFocus: 'Mixed VA daily: jumble, summary, completion, odd one out · RC accuracy through OCTAVES, not instinct',
    weeklyPriority: 'Finish the last new-content week. After Saturday 7 November, stop adding new topics.',
    gate: 'Coverage freeze. Exception: a Tier-1 concept gap (C1) that repeatedly costs marks.'
  },
  {
    number: 5,
    title: 'Consolidation begins',
    dates: '8 Nov – 14 Nov',
    startDate: '2026-11-08',
    endDate: '2026-11-14',
    phaseNote: 'Mock-Dominated ends Sunday 8 Nov; Consolidation begins Monday 9 Nov',
    qaFocus: 'Mixed sets from your five most frequent error topics · Trusted-source PYQs · Tier-1 formula revision (Revision Deck, due cards first)',
    dilrFocus: 'Two timed sets a day · Set-selection drill: decide in 2 minutes, then commit',
    varcFocus: 'Timed RC: 3–4 passages a day · VA: 8 questions daily, timed',
    weeklyPriority: 'Prioritise fixing process over adding volume.',
    gate: 'Accuracy on attempted questions rises in at least two sections. If not, cut volume and fix process.'
  },
  {
    number: 6,
    title: 'Strategy lock',
    dates: '15 Nov – 21 Nov',
    startDate: '2026-11-15',
    endDate: '2026-11-21',
    phaseNote: 'Consolidation through Friday 20 Nov; Taper begins Saturday 21 Nov',
    qaFocus: 'PYQs + mixed timed sets · One more retest of your weakest Tier-1 topic · Re-solve old correct Tier-1 questions faster',
    dilrFocus: 'Thursday sectional is a full 22-question / 40-minute simulation · Write your set attempt/skip rule',
    varcFocus: 'Tuesday sectional is a full 24-question / 40-minute simulation · Write your per-passage time cap',
    weeklyPriority: 'Lock the exam strategy; do not keep changing it after Saturday 21 November.',
    gate: 'One-page strategy: section timing, attempt rule, TITA rule, and the leave rule for questions and sets.'
  },
  {
    number: 7,
    title: 'Taper — protect what you have',
    dates: '22 Nov – 28 Nov',
    startDate: '2026-11-22',
    endDate: '2026-11-28',
    phaseNote: 'Taper',
    qaFocus: 'Tier-1 formula recall only · Re-read every C1 and C4 error-log entry',
    dilrFocus: 'One familiar-type set a day; keep the method familiar',
    varcFocus: 'One or two RC passages a day; review method, not volume',
    weeklyPriority: 'Sunday 22 November is the last full mock. Taper means doing less on purpose.',
    gate: 'Admit card, ID as instructed, route to centre and sleep aligned to the exam slot. No test on Friday 27 or Saturday 28 November.'
  }
];

const MOCK_DATES = [
  '2026-10-11',
  '2026-10-18',
  '2026-10-25',
  '2026-11-01',
  '2026-11-08',
  '2026-11-15',
  '2026-11-22'
];

function examDayPlan(dateIso: string): Final50DayPlan {
  return {
    number: 7,
    title: 'CAT 2026 exam day',
    dates: '29 Nov',
    startDate: '2026-11-29',
    endDate: '2026-11-29',
    phaseNote: 'EXAM DAY',
    qaFocus: 'Exam-day readiness only — no new topics or practice quota',
    dilrFocus: 'Exam-day readiness only — no new topics or practice quota',
    varcFocus: 'Exam-day readiness only — no new topics or practice quota',
    weeklyPriority: 'Stay calm. Follow the slot and instructions on the admit card.',
    gate: 'Admit card and ID ready; route planned; sleep aligned to the exam slot.',
    dateIso,
    weekNum: 0,
    dayNum: 50,
    testTitle: 'CAT 2026 EXAM DAY — NO MOCK',
    testNotes: 'Follow the admit-card slot and official centre instructions. No mock, new topic, or last-minute resource hunt.',
    isDayZero: false,
    isExamDay: true,
    coverageFreeze: true
  };
}

function testFor(dateIso: string): { title: string; notes: string } {
  if (dateIso === '2026-11-24') return {
    title: 'LIGHT VARC WARM-UP — 20 MINUTES',
    notes: 'Taper only. Keep it light; no full sectional and no new material.'
  };
  if (dateIso === '2026-11-25') return {
    title: 'LIGHT ANALYSIS + REPAIR',
    notes: 'Review only the highest-value known errors. Stop while fresh.'
  };
  if (dateIso === '2026-11-26') return {
    title: 'ONE DILR SET — UNTIMED',
    notes: 'One familiar-style set, untimed. Explain the method calmly.'
  };
  if (dateIso === '2026-11-27') return {
    title: 'NO TEST — ERROR-LOG SKIM',
    notes: 'No test. Briefly skim the error log and protect recovery.'
  };
  if (dateIso === '2026-11-28') return {
    title: 'NO TEST — REST + LOGISTICS',
    notes: 'No test. Check admit card, required ID and centre route; align sleep to the exam slot.'
  };

  const mockIndex = MOCK_DATES.indexOf(dateIso);
  if (mockIndex >= 0) {
    return {
      title: 'FULL MOCK ' + (mockIndex + 1) + (mockIndex === 6 ? ' — LAST FULL MOCK' : ''),
      notes: mockIndex === 0
        ? 'Baseline: judge nothing, diagnose everything. Record attempts, correct, wrong and score for each section. Full analysis is due Monday.'
        : mockIndex === 6
          ? 'Last full-length mock. Use the locked section order and exact 40-minute section limits; do not add another full mock after today.'
          : 'Full 120-minute mock in exam conditions. Record attempts, correct, wrong and score for each section; schedule analysis for Monday.'
    };
  }

  const weekday = new Date(dateIso + 'T12:00:00Z').getUTCDay();
  if (weekday === 1) return {
    title: 'MOCK ANALYSIS + ERROR LOG + REPAIR',
    notes: 'Analysis takes at least as long as the mock. Fill attempts/correct/wrong/score for each section; identify the weakest section after about 8+ attempts; classify C1–C5; write three repair topics.'
  };
  if (weekday === 2) return {
    title: 'VARC SECTIONAL — 24 QUESTIONS / 40 MINUTES',
    notes: 'Full timed sectional, no peeking. Fixed CAT section order remains VARC, DILR, QA.'
  };
  if (weekday === 3) return {
    title: 'VARC ANALYSIS + REPAIR + RETEST',
    notes: 'Analyse Tuesday’s sectional, classify the recurring errors, repair them, then retest.'
  };
  if (weekday === 4) return {
    title: 'DILR SECTIONAL — 22 QUESTIONS / 40 MINUTES',
    notes: 'Full timed sectional. Practise the 2-minute set-selection decision.'
  };
  if (weekday === 5) return {
    title: 'DILR ANALYSIS + REPAIR + RETEST',
    notes: 'Analyse Thursday’s sectional, fix the method/selection error, then retest.'
  };
  if (weekday === 6) return {
    title: 'QA SECTIONAL — 22 QUESTIONS / 40 MINUTES',
    notes: 'Full timed sectional. Complete same-evening analysis in the 21:00–21:45 slot.'
  };
  return {
    title: 'FULL MOCK',
    notes: 'Full 120-minute mock in exam conditions; complete section-level tracking and analysis.'
  };
}

export function getFinal50DayPlan(dateIso: string): Final50DayPlan | null {
  if (dateIso === '2026-10-10') {
    return {
      number: 0,
      title: 'Day 0 — sectional baseline and setup',
      dates: '10 Oct',
      startDate: '2026-10-10',
      endDate: '2026-10-10',
      phaseNote: 'DAY 0',
      qaFocus: 'QA sectional — 22 questions / 40 minutes',
      dilrFocus: 'No new topic today',
      varcFocus: 'No new topic today',
      weeklyPriority: 'Early sleep. Tomorrow is Mock 1.',
      gate: 'Same-evening sectional analysis in the 21:00–21:45 slot.',
      dateIso,
      weekNum: 0,
      dayNum: 0,
      testTitle: 'DAY 0 — QA SECTIONAL',
      testNotes: 'Complete same-evening analysis in the 21:00–21:45 slot. No new topic today. Early sleep; Mock 1 is tomorrow.',
      isDayZero: true,
      isExamDay: false,
      final10Days: false,
      coverageFreeze: false
    };
  }
  if (dateIso === '2026-11-29') return examDayPlan(dateIso);
  if (dateIso < '2026-10-11' || dateIso > '2026-11-28') return null;

  const offset = Math.floor((Date.parse(dateIso + 'T00:00:00Z') - Date.parse('2026-10-11T00:00:00Z')) / 86400000);
  const week = FINAL_50_WEEK_PLANS[Math.floor(offset / 7)];
  if (!week) return null;
  const test = testFor(dateIso);
  const phaseLabel = dateIso <= '2026-11-08'
    ? 'MOCK-DOMINATED'
    : dateIso <= '2026-11-20'
      ? 'CONSOLIDATION'
      : 'TAPER';

  // PDF page 8 explicitly overrides normal Week 6/7 study-focus wording from 19–28 Nov.
  const final10Days = dateIso >= '2026-11-19' && dateIso <= '2026-11-28';
  const final10Qa = 'Tier-1 formula recall only: Percentages · Averages · Ratio & Proportion · Mixtures & Alligation · Profit & Loss · Time & Work · Time-Speed-Distance · SI & CI · add only two real QA weak topics from your error log';
  const final10Dilr = 'Pattern recognition only: Seating / linear / circular arrangements · Bar / Column / Line graphs · Pie charts · Tables · Caselets · add only two real DILR weak topics from your error log';
  const final10Varc = 'Strategy recall only: RC main idea / inference / tone · elimination of close options · Para Summary · Para Jumble · add only two real VARC weak topics from your error log';
  const final10Priority = 'FINAL 10 DAYS — REVISION ONLY. No new material. Each item should take under 5 minutes to recall cold; if it does not, reopen its worked example, not a new topic. Keep the locked exam strategy unchanged.';
  const final10Gate = dateIso === '2026-11-28'
    ? 'NO TEST. Admit card, required ID, centre route and sleep aligned to the actual exam slot. No new material.'
    : 'No new material from 19–28 Nov. Use only the PDF Tier-1 recall lists and weak topics supported by your real error log. Do not invent weak topics or scores.';

  return {
    ...week,
    dateIso,
    weekNum: week.number,
    dayNum: offset + 1,
    qaFocus: final10Days ? final10Qa : week.qaFocus,
    dilrFocus: final10Days ? final10Dilr : week.dilrFocus,
    varcFocus: final10Days ? final10Varc : week.varcFocus,
    weeklyPriority: final10Days ? final10Priority : week.weeklyPriority,
    gate: final10Days ? final10Gate : week.gate,
    phaseNote: phaseLabel + ' · ' + week.phaseNote + (final10Days ? ' · FINAL 10 DAYS: REVISION ONLY' : ''),
    testTitle: test.title,
    testNotes: test.notes,
    isDayZero: false,
    isExamDay: false,
    final10Days,
    coverageFreeze: dateIso >= '2026-11-08'
  };
}
