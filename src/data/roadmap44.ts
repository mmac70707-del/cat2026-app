export interface RoadmapDayItem {
  dayNum: number;
  dateStr: string; // e.g. "18 SEP 2026"
  dateIso: string; // "2026-09-18"
  chapter: string; // QA topic
  dilrFamily: string; // DILR family
  varcSkill: string; // VARC skill
  category: 'Arithmetic' | 'Algebra' | 'Number System' | 'Geometry' | 'Modern Math' | 'Revision/Repair';
  blockName?: string;
}

export const MASTER_SPINE_44: RoadmapDayItem[] = [
  { dayNum: 1,  dateStr: '18 Sep', dateIso: '2026-09-18', chapter: 'Percentages', dilrFamily: 'Tables', varcSkill: 'Main Idea', category: 'Arithmetic', blockName: 'Block A — Arithmetic Core' },
  { dayNum: 2,  dateStr: '19 Sep', dateIso: '2026-09-19', chapter: 'Ratio & Proportion', dilrFamily: 'Bar Graph', varcSkill: 'Inference', category: 'Arithmetic', blockName: 'Block A — Arithmetic Core' },
  { dayNum: 3,  dateStr: '20 Sep', dateIso: '2026-09-20', chapter: 'Averages', dilrFamily: 'Line Chart', varcSkill: 'Tone', category: 'Arithmetic', blockName: 'Block A — Arithmetic Core' },
  { dayNum: 4,  dateStr: '21 Sep', dateIso: '2026-09-21', chapter: 'Profit/Loss/Discount', dilrFamily: 'Pie Chart', varcSkill: 'Structure', category: 'Arithmetic', blockName: 'Block A — Arithmetic Core' },
  { dayNum: 5,  dateStr: '22 Sep', dateIso: '2026-09-22', chapter: 'SI + CI', dilrFamily: 'Caselet DI', varcSkill: 'Detail', category: 'Arithmetic', blockName: 'Block A — Arithmetic Core' },
  { dayNum: 6,  dateStr: '23 Sep', dateIso: '2026-09-23', chapter: 'Mixtures & Alligation', dilrFamily: 'Venn/Set DI', varcSkill: 'Elimination', category: 'Arithmetic', blockName: 'Block A — Arithmetic Core' },
  { dayNum: 7,  dateStr: '24 Sep', dateIso: '2026-09-24', chapter: 'Time-Speed-Distance', dilrFamily: 'Arrangement', varcSkill: 'Author POV', category: 'Arithmetic', blockName: 'Block A — Arithmetic Core' },
  { dayNum: 8,  dateStr: '25 Sep', dateIso: '2026-09-25', chapter: 'Time & Work', dilrFamily: 'Distribution', varcSkill: 'Purpose', category: 'Arithmetic', blockName: 'Block A — Arithmetic Core' },

  { dayNum: 9,  dateStr: '26 Sep', dateIso: '2026-09-26', chapter: 'Partnership + Variation', dilrFamily: 'Games/Tournaments', varcSkill: 'Inference', category: 'Arithmetic', blockName: 'Block B — Algebra Core' },
  { dayNum: 10, dateStr: '27 Sep', dateIso: '2026-09-27', chapter: 'Arithmetic Mixed', dilrFamily: 'Scheduling', varcSkill: 'VA Summary', category: 'Arithmetic', blockName: 'Block B — Algebra Core' },
  { dayNum: 11, dateStr: '28 Sep', dateIso: '2026-09-28', chapter: 'Linear Equations', dilrFamily: 'Ranking', varcSkill: 'Main Idea', category: 'Algebra', blockName: 'Block B — Algebra Core' },
  { dayNum: 12, dateStr: '29 Sep', dateIso: '2026-09-29', chapter: 'Quadratic Equations', dilrFamily: 'Routes/Networks', varcSkill: 'Inference', category: 'Algebra', blockName: 'Block B — Algebra Core' },
  { dayNum: 13, dateStr: '30 Sep', dateIso: '2026-09-30', chapter: 'Inequalities', dilrFamily: 'Grouping/Selection', varcSkill: 'Tone', category: 'Algebra', blockName: 'Block B — Algebra Core' },
  { dayNum: 14, dateStr: '1 Oct',  dateIso: '2026-10-01', chapter: 'Functions', dilrFamily: 'Table/DI Mixed', varcSkill: 'Author POV', category: 'Algebra', blockName: 'Block B — Algebra Core' },
  { dayNum: 15, dateStr: '2 Oct',  dateIso: '2026-10-02', chapter: 'Progressions/Series', dilrFamily: 'Chart Mixed', varcSkill: 'Summary', category: 'Algebra', blockName: 'Block B — Algebra Core' },
  { dayNum: 16, dateStr: '3 Oct',  dateIso: '2026-10-03', chapter: 'Algebraic Identities', dilrFamily: 'LR Mixed', varcSkill: 'Assumption', category: 'Algebra', blockName: 'Block B — Algebra Core' },
  { dayNum: 17, dateStr: '4 Oct',  dateIso: '2026-10-04', chapter: 'Arithmetic + Algebra PYQ', dilrFamily: 'Mixed Sets', varcSkill: 'PYQ RC', category: 'Algebra', blockName: 'Block B — Algebra Core' },

  { dayNum: 18, dateStr: '5 Oct',  dateIso: '2026-10-05', chapter: 'Divisibility', dilrFamily: 'Caselet', varcSkill: 'Main Idea', category: 'Number System', blockName: 'Block C — Number System' },
  { dayNum: 19, dateStr: '6 Oct',  dateIso: '2026-10-06', chapter: 'Factors & Multiples', dilrFamily: 'Venn', varcSkill: 'Inference', category: 'Number System', blockName: 'Block C — Number System' },
  { dayNum: 20, dateStr: '7 Oct',  dateIso: '2026-10-07', chapter: 'HCF & LCM', dilrFamily: 'Games', varcSkill: 'Tone', category: 'Number System', blockName: 'Block C — Number System' },
  { dayNum: 21, dateStr: '8 Oct',  dateIso: '2026-10-08', chapter: 'Remainders', dilrFamily: 'Distribution', varcSkill: 'Detail', category: 'Number System', blockName: 'Block C — Number System' },
  { dayNum: 22, dateStr: '9 Oct',  dateIso: '2026-10-09', chapter: 'Units Digit', dilrFamily: 'Ranking', varcSkill: 'Elimination', category: 'Number System', blockName: 'Block C — Number System' },
  { dayNum: 23, dateStr: '10 Oct', dateIso: '2026-10-10', chapter: 'Digits/Base Representation', dilrFamily: 'Routes', varcSkill: 'Author POV', category: 'Number System', blockName: 'Block C — Number System' },
  { dayNum: 24, dateStr: '11 Oct', dateIso: '2026-10-11', chapter: 'Indices/Surds/Logs', dilrFamily: 'Scheduling', varcSkill: 'Purpose', category: 'Number System', blockName: 'Block C — Number System' },

  { dayNum: 25, dateStr: '12 Oct', dateIso: '2026-10-12', chapter: 'Lines & Angles', dilrFamily: 'Arrangement', varcSkill: 'Inference', category: 'Geometry', blockName: 'Block D — Geometry' },
  { dayNum: 26, dateStr: '13 Oct', dateIso: '2026-10-13', chapter: 'Triangles', dilrFamily: 'Selection', varcSkill: 'Main Idea', category: 'Geometry', blockName: 'Block D — Geometry' },
  { dayNum: 27, dateStr: '14 Oct', dateIso: '2026-10-14', chapter: 'Quadrilaterals', dilrFamily: 'Mixed DI', varcSkill: 'Tone', category: 'Geometry', blockName: 'Block D — Geometry' },
  { dayNum: 28, dateStr: '15 Oct', dateIso: '2026-10-15', chapter: 'Circles', dilrFamily: 'Games', varcSkill: 'Detail', category: 'Geometry', blockName: 'Block D — Geometry' },
  { dayNum: 29, dateStr: '16 Oct', dateIso: '2026-10-16', chapter: 'Mensuration', dilrFamily: 'Caselet', varcSkill: 'Elimination', category: 'Geometry', blockName: 'Block D — Geometry' },
  { dayNum: 30, dateStr: '17 Oct', dateIso: '2026-10-17', chapter: 'Coordinate Geometry', dilrFamily: 'Charts', varcSkill: 'Author POV', category: 'Geometry', blockName: 'Block D — Geometry' },

  { dayNum: 31, dateStr: '18 Oct', dateIso: '2026-10-18', chapter: 'Set Theory', dilrFamily: 'Networks', varcSkill: 'Inference', category: 'Modern Math', blockName: 'Block E — Modern Math' },
  { dayNum: 32, dateStr: '19 Oct', dateIso: '2026-10-19', chapter: 'Permutation & Combination', dilrFamily: 'Tournament', varcSkill: 'Main Idea', category: 'Modern Math', blockName: 'Block E — Modern Math' },
  { dayNum: 33, dateStr: '20 Oct', dateIso: '2026-10-20', chapter: 'Probability', dilrFamily: 'Tables', varcSkill: 'Assumption', category: 'Modern Math', blockName: 'Block E — Modern Math' },
  { dayNum: 34, dateStr: '21 Oct', dateIso: '2026-10-21', chapter: 'Arithmetic Weakness Repair', dilrFamily: 'Distribution', varcSkill: 'VA Mix', category: 'Modern Math', blockName: 'Block E — Modern Math' },
  { dayNum: 35, dateStr: '22 Oct', dateIso: '2026-10-22', chapter: 'Algebra Weakness Repair', dilrFamily: 'Scheduling', varcSkill: 'RC Mix', category: 'Modern Math', blockName: 'Block E — Modern Math' },
  { dayNum: 36, dateStr: '23 Oct', dateIso: '2026-10-23', chapter: 'Number System Repair', dilrFamily: 'LR Mix', varcSkill: 'Elimination', category: 'Modern Math', blockName: 'Block E — Modern Math' },

  { dayNum: 37, dateStr: '24 Oct', dateIso: '2026-10-24', chapter: 'Geometry Repair', dilrFamily: 'DI Mix', varcSkill: 'Inference', category: 'Revision/Repair', blockName: 'Block F — PYQ Sweep' },
  { dayNum: 38, dateStr: '25 Oct', dateIso: '2026-10-25', chapter: 'Modern Math Mixed', dilrFamily: 'DILR Mixed', varcSkill: 'Tone', category: 'Revision/Repair', blockName: 'Block F — PYQ Sweep' },
  { dayNum: 39, dateStr: '26 Oct', dateIso: '2026-10-26', chapter: 'Arithmetic PYQ', dilrFamily: 'DILR PYQ', varcSkill: 'VARC PYQ', category: 'Revision/Repair', blockName: 'Block F — PYQ Sweep' },
  { dayNum: 40, dateStr: '27 Oct', dateIso: '2026-10-27', chapter: 'Algebra PYQ', dilrFamily: 'DILR PYQ', varcSkill: 'VARC PYQ', category: 'Revision/Repair', blockName: 'Block F — PYQ Sweep' },
  { dayNum: 41, dateStr: '28 Oct', dateIso: '2026-10-28', chapter: 'NS + Geometry PYQ', dilrFamily: 'DILR PYQ', varcSkill: 'VARC PYQ', category: 'Revision/Repair', blockName: 'Block F — PYQ Sweep' },
  { dayNum: 42, dateStr: '29 Oct', dateIso: '2026-10-29', chapter: 'QA Sectional + Repair', dilrFamily: 'DILR Sectional', varcSkill: 'VARC Sectional', category: 'Revision/Repair', blockName: 'Block F — PYQ Sweep' },
  { dayNum: 43, dateStr: '30 Oct', dateIso: '2026-10-30', chapter: 'Syllabus Gap Audit', dilrFamily: 'Weak Set Repair', varcSkill: 'Weak Skill Repair', category: 'Revision/Repair', blockName: 'Block F — PYQ Sweep' },
  { dayNum: 44, dateStr: '31 Oct', dateIso: '2026-10-31', chapter: 'FIRST-PASS CLOSURE', dilrFamily: 'FIRST-PASS CLOSURE', varcSkill: 'FIRST-PASS CLOSURE', category: 'Revision/Repair', blockName: 'Block F — PYQ Sweep' },
]

export const ROADMAP_44 = MASTER_SPINE_44

export const QA_BLOCK_MAPS = [
  { block: 'Block A', name: 'Arithmetic Core', dates: '18–25 Sep', topics: ['Percentages', 'Ratio & Proportion', 'Averages', 'Profit, Loss & Discount', 'Simple & Compound Interest', 'Mixtures & Alligation', 'Time, Speed & Distance', 'Time & Work'] },
  { block: 'Block B', name: 'Algebra Core', dates: '26 Sep–3 Oct', topics: ['Linear Equations', 'Quadratic Equations', 'Inequalities', 'Algebraic Identities', 'Functions', 'Graphs', 'Progressions / Series'] },
  { block: 'Block C', name: 'Number System', dates: '4–10 Oct', topics: ['Divisibility', 'Factors', 'HCF & LCM', 'Remainders', 'Units Digit', 'Digits / Number Representation', 'Indices / Surds / Logarithms'] },
  { block: 'Block D', name: 'Geometry', dates: '11–17 Oct', topics: ['Lines & Angles', 'Triangles', 'Quadrilaterals', 'Circles', 'Mensuration', 'Coordinate Geometry'] },
  { block: 'Block E', name: 'Modern Math + Remaining QA', dates: '18–24 Oct', topics: ['Set Theory', 'Permutation & Combination', 'Probability', 'Venn / counting-based applications', 'Leftover weak Arithmetic', 'Leftover weak Algebra'] },
  { block: 'Block F', name: 'QA Completion + PYQ Sweep', dates: '25–31 Oct', topics: ['All chapters marked: 🔴 Not understood → Repair', '🟡 Understood but weak → Strengthen', '🟢 Usable → PYQ/Test'] },
]

export const DILR_SET_FAMILIES = [
  'Tables', 'Bar Graphs', 'Line Graphs', 'Pie Charts', 'Caselets',
  'Venn / Set-based DI', 'Arrangements', 'Grouping & Assignment',
  'Distribution', 'Selection', 'Games & Tournaments', 'Scheduling / Ordering',
  'Ranking', 'Routes & Networks', 'Mixed DI-LR'
]

export const VARC_SKILL_SEQUENCE = [
  'Main Idea', 'Structure', 'Inference', 'Author POV', 'Tone', 'Purpose',
  'Detail', 'Assumption', 'Application', 'Elimination', 'Mixed RC'
]

export const QUESTION_LADDER_STAGES = [
  { stage: 'Stage 1 — First few days', total: '18 Qs', breakdown: '5 Basic • 5 Basic-Medium • 5 Medium • 3 Timed' },
  { stage: 'Stage 2 — When accuracy stabilises', total: '23 Qs', breakdown: '5 Basic • 8 Medium • 5 PYQ • 5 Timed' },
  { stage: 'Stage 3 — After repeated practice', total: '30 Qs', breakdown: '5 Warm-up • 10 Medium • 5 PYQ • 8–10 Timed/Mixed' },
]

export const FINAL_MENTOR_RULES = [
  'I WILL NOT FINISH EVERYTHING. I WILL MASTER WHAT CAN BE USED.',
  'CONCEPT → PRACTICE → PYQ → TIMED → TEST → ANALYSIS → REPAIR → RETEST',
  'PLAYLIST = RESOURCE • SYLLABUS = SKILLS • SCORE = EXECUTION'
]

export const COVERAGE_DEADLINES = [
  { date: 'By 30 Sep', items: ['Arithmetic foundation', 'Algebra foundation', 'Basic DI', 'Basic LR families', 'Daily RC habit'] },
  { date: 'By 4 Oct (Application phase ends)', items: ['Major Arithmetic base', 'Initial Algebra base', 'DILR set-selection habit', 'RC habit', 'PYQ exposure started'] },
  { date: 'By 15 Oct', items: ['Number System substantially covered', 'Geometry underway', 'Broad DILR coverage', 'VARC continuing daily', 'Mocks generating weakness data'] },
  { date: 'By 24 Oct', items: ['First-pass QA nearly complete', 'Main DILR families touched', 'VARC question types covered'] },
  { date: '31 Oct — SYLLABUS CLOSURE', items: ['QA → First pass complete', 'DILR → Major families covered', 'VARC → All major question types covered', 'PYQ → Integrated', 'ERROR → Active', 'MOCK → Active'] },
]
