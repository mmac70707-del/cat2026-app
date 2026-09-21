export interface RoadmapDayItem {
  dayNum: number;
  dateStr: string; // e.g. "18 SEP 2026"
  dateIso: string; // "2026-09-18"
  chapter: string;
  category: 'Arithmetic' | 'Algebra' | 'Number System' | 'Geometry' | 'Modern Math' | 'Revision/Repair';
  blockName?: string;
}

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

export const VIDEO_GATE_RULES = [
  { question: 'CAN I SOLVE A BASIC QUESTION?', answerYes: 'YES → SKIP VIDEO', answerNo: 'NO → WATCH TARGETED CONCEPT → CLOSE VIDEO → SOLVE' }
]

export const ROADMAP_44: RoadmapDayItem[] = [
  { dayNum: 1,  dateStr: '18 SEP 2026', dateIso: '2026-09-18', chapter: 'Percentages', category: 'Arithmetic', blockName: 'Block A — Arithmetic Core' },
  { dayNum: 2,  dateStr: '19 SEP 2026', dateIso: '2026-09-19', chapter: 'Ratio & Proportion', category: 'Arithmetic', blockName: 'Block A — Arithmetic Core' },
  { dayNum: 3,  dateStr: '20 SEP 2026', dateIso: '2026-09-20', chapter: 'Averages', category: 'Arithmetic', blockName: 'Block A — Arithmetic Core' },
  { dayNum: 4,  dateStr: '21 SEP 2026', dateIso: '2026-09-21', chapter: 'Profit, Loss & Discount', category: 'Arithmetic', blockName: 'Block A — Arithmetic Core' },
  { dayNum: 5,  dateStr: '22 SEP 2026', dateIso: '2026-09-22', chapter: 'Simple Interest + Compound Interest', category: 'Arithmetic', blockName: 'Block A — Arithmetic Core' },
  { dayNum: 6,  dateStr: '23 SEP 2026', dateIso: '2026-09-23', chapter: 'Mixtures & Alligation', category: 'Arithmetic', blockName: 'Block A — Arithmetic Core' },
  { dayNum: 7,  dateStr: '24 SEP 2026', dateIso: '2026-09-24', chapter: 'Time, Speed & Distance', category: 'Arithmetic', blockName: 'Block A — Arithmetic Core' },
  { dayNum: 8,  dateStr: '25 SEP 2026', dateIso: '2026-09-25', chapter: 'Time & Work', category: 'Arithmetic', blockName: 'Block A — Arithmetic Core' },

  { dayNum: 9,  dateStr: '26 SEP 2026', dateIso: '2026-09-26', chapter: 'Linear Equations', category: 'Algebra', blockName: 'Block B — Algebra Core' },
  { dayNum: 10, dateStr: '27 SEP 2026', dateIso: '2026-09-27', chapter: 'Quadratic Equations', category: 'Algebra', blockName: 'Block B — Algebra Core' },
  { dayNum: 11, dateStr: '28 SEP 2026', dateIso: '2026-09-28', chapter: 'Inequalities', category: 'Algebra', blockName: 'Block B — Algebra Core' },
  { dayNum: 12, dateStr: '29 SEP 2026', dateIso: '2026-09-29', chapter: 'Algebraic Identities', category: 'Algebra', blockName: 'Block B — Algebra Core' },
  { dayNum: 13, dateStr: '30 SEP 2026', dateIso: '2026-09-30', chapter: 'Functions', category: 'Algebra', blockName: 'Block B — Algebra Core' },
  { dayNum: 14, dateStr: '01 OCT 2026', dateIso: '2026-10-01', chapter: 'Graphs', category: 'Algebra', blockName: 'Block B — Algebra Core' },
  { dayNum: 15, dateStr: '02 OCT 2026', dateIso: '2026-10-02', chapter: 'Progressions / Series', category: 'Algebra', blockName: 'Block B — Algebra Core' },

  { dayNum: 16, dateStr: '03 OCT 2026', dateIso: '2026-10-03', chapter: 'Divisibility', category: 'Number System', blockName: 'Block C — Number System' },
  { dayNum: 17, dateStr: '04 OCT 2026', dateIso: '2026-10-04', chapter: 'Factors', category: 'Number System', blockName: 'Block C — Number System' },
  { dayNum: 18, dateStr: '05 OCT 2026', dateIso: '2026-10-05', chapter: 'HCF & LCM', category: 'Number System', blockName: 'Block C — Number System' },
  { dayNum: 19, dateStr: '06 OCT 2026', dateIso: '2026-10-06', chapter: 'Remainders', category: 'Number System', blockName: 'Block C — Number System' },
  { dayNum: 20, dateStr: '07 OCT 2026', dateIso: '2026-10-07', chapter: 'Units Digit', category: 'Number System', blockName: 'Block C — Number System' },
  { dayNum: 21, dateStr: '08 OCT 2026', dateIso: '2026-10-08', chapter: 'Digits / Number Representation', category: 'Number System', blockName: 'Block C — Number System' },
  { dayNum: 22, dateStr: '09 OCT 2026', dateIso: '2026-10-09', chapter: 'Indices / Surds / Logarithms', category: 'Number System', blockName: 'Block C — Number System' },

  { dayNum: 23, dateStr: '10 OCT 2026', dateIso: '2026-10-10', chapter: 'Lines & Angles', category: 'Geometry', blockName: 'Block D — Geometry' },
  { dayNum: 24, dateStr: '11 OCT 2026', dateIso: '2026-10-11', chapter: 'Triangles', category: 'Geometry', blockName: 'Block D — Geometry' },
  { dayNum: 25, dateStr: '12 OCT 2026', dateIso: '2026-10-12', chapter: 'Quadrilaterals', category: 'Geometry', blockName: 'Block D — Geometry' },
  { dayNum: 26, dateStr: '13 OCT 2026', dateIso: '2026-10-13', chapter: 'Circles', category: 'Geometry', blockName: 'Block D — Geometry' },
  { dayNum: 27, dateStr: '14 OCT 2026', dateIso: '2026-10-14', chapter: 'Mensuration', category: 'Geometry', blockName: 'Block D — Geometry' },
  { dayNum: 28, dateStr: '15 OCT 2026', dateIso: '2026-10-15', chapter: 'Coordinate Geometry', category: 'Geometry', blockName: 'Block D — Geometry' },

  { dayNum: 29, dateStr: '16 OCT 2026', dateIso: '2026-10-16', chapter: 'Set Theory', category: 'Modern Math', blockName: 'Block E — Modern Math' },
  { dayNum: 30, dateStr: '17 OCT 2026', dateIso: '2026-10-17', chapter: 'Permutation & Combination', category: 'Modern Math', blockName: 'Block E — Modern Math' },
  { dayNum: 31, dateStr: '18 OCT 2026', dateIso: '2026-10-18', chapter: 'Probability', category: 'Modern Math', blockName: 'Block E — Modern Math' },
  { dayNum: 32, dateStr: '19 OCT 2026', dateIso: '2026-10-19', chapter: 'Venn / counting-based applications', category: 'Modern Math', blockName: 'Block E — Modern Math' },
  { dayNum: 33, dateStr: '20 OCT 2026', dateIso: '2026-10-20', chapter: 'Leftover weak Arithmetic', category: 'Modern Math', blockName: 'Block E — Modern Math' },
  { dayNum: 34, dateStr: '21 OCT 2026', dateIso: '2026-10-21', chapter: 'Leftover weak Algebra', category: 'Modern Math', blockName: 'Block E — Modern Math' },

  { dayNum: 35, dateStr: '22 OCT 2026', dateIso: '2026-10-22', chapter: 'Arithmetic PYQ Sweep', category: 'Revision/Repair', blockName: 'Block F — PYQ Sweep' },
  { dayNum: 36, dateStr: '23 OCT 2026', dateIso: '2026-10-23', chapter: 'Algebra PYQ Sweep', category: 'Revision/Repair', blockName: 'Block F — PYQ Sweep' },
  { dayNum: 37, dateStr: '24 OCT 2026', dateIso: '2026-10-24', chapter: 'Number System PYQ Sweep', category: 'Revision/Repair', blockName: 'Block F — PYQ Sweep' },
  { dayNum: 38, dateStr: '25 OCT 2026', dateIso: '2026-10-25', chapter: 'Geometry PYQ Sweep', category: 'Revision/Repair', blockName: 'Block F — PYQ Sweep' },
  { dayNum: 39, dateStr: '26 OCT 2026', dateIso: '2026-10-26', chapter: 'Arithmetic Weakness Repair', category: 'Revision/Repair', blockName: 'Block F — PYQ Sweep' },
  { dayNum: 40, dateStr: '27 OCT 2026', dateIso: '2026-10-27', chapter: 'Algebra/Numbers Weakness Repair', category: 'Revision/Repair', blockName: 'Block F — PYQ Sweep' },
  { dayNum: 41, dateStr: '28 OCT 2026', dateIso: '2026-10-28', chapter: 'Geometry Weakness Repair', category: 'Revision/Repair', blockName: 'Block F — PYQ Sweep' },
  { dayNum: 42, dateStr: '29 OCT 2026', dateIso: '2026-10-29', chapter: 'QA Syllabus Gap Audit', category: 'Revision/Repair', blockName: 'Block F — PYQ Sweep' },
  { dayNum: 43, dateStr: '30 OCT 2026', dateIso: '2026-10-30', chapter: 'Full QA First-Pass Sweep', category: 'Revision/Repair', blockName: 'Block F — PYQ Sweep' },
  { dayNum: 44, dateStr: '31 OCT 2026', dateIso: '2026-10-31', chapter: 'QA Mixed Test + First-Pass Closure', category: 'Revision/Repair', blockName: 'Block F — PYQ Sweep' },
]
