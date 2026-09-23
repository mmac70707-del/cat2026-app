export interface RoadmapDayItem {
  dayNum: number;
  dateStr: string; // e.g. "21 Sep"
  dateIso: string; // "2026-09-21"
  chapter: string; // QA topic
  dilrFamily: string; // DILR family
  varcSkill: string; // VARC skill
  category: 'Arithmetic' | 'Algebra' | 'Number System' | 'Geometry' | 'Modern Math' | 'Revision/Repair';
  blockName?: string;
}

export const MASTER_SPINE_44: RoadmapDayItem[] = [
  // Week 1 (21 Sep - 27 Sep)
  { dayNum: 1,  dateStr: '21 Sep', dateIso: '2026-09-21', chapter: 'Averages', dilrFamily: 'Seating Arrangements', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 1 — Arithmetic Core' },
  { dayNum: 2,  dateStr: '22 Sep', dateIso: '2026-09-22', chapter: 'Averages', dilrFamily: 'Bar Graphs', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 1 — Arithmetic Core' },
  { dayNum: 3,  dateStr: '23 Sep', dateIso: '2026-09-23', chapter: 'Percentages', dilrFamily: 'Seating Arrangements', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 1 — Arithmetic Core' },
  { dayNum: 4,  dateStr: '24 Sep', dateIso: '2026-09-24', chapter: 'Percentages', dilrFamily: 'Bar Graphs', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 1 — Arithmetic Core' },
  { dayNum: 5,  dateStr: '25 Sep', dateIso: '2026-09-25', chapter: 'Mixtures & Alligations', dilrFamily: 'Seating Arrangements', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 1 — Arithmetic Core' },
  { dayNum: 6,  dateStr: '26 Sep', dateIso: '2026-09-26', chapter: 'Ratio, Proportion & Variation', dilrFamily: 'Bar Graphs', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 1 — Arithmetic Core' },
  { dayNum: 7,  dateStr: '27 Sep', dateIso: '2026-09-27', chapter: 'Arithmetic Sectional', dilrFamily: 'Week 1 DILR Review', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 1 — Arithmetic Core' },

  // Week 2 (28 Sep - 4 Oct)
  { dayNum: 8,  dateStr: '28 Sep', dateIso: '2026-09-28', chapter: 'Profit & Loss', dilrFamily: 'Caselets', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 2 — Arithmetic & Algebra' },
  { dayNum: 9,  dateStr: '29 Sep', dateIso: '2026-09-29', chapter: 'Profit & Loss', dilrFamily: 'Column Graphs', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 2 — Arithmetic & Algebra' },
  { dayNum: 10, dateStr: '30 Sep', dateIso: '2026-09-30', chapter: 'Profit & Loss', dilrFamily: 'Caselets', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 2 — Arithmetic & Algebra' },
  { dayNum: 11, dateStr: '01 Oct', dateIso: '2026-10-01', chapter: 'Progressions / Series', dilrFamily: 'Column Graphs', varcSkill: 'Reading Comprehension', category: 'Algebra', blockName: 'Week 2 — Arithmetic & Algebra' },
  { dayNum: 12, dateStr: '02 Oct', dateIso: '2026-10-02', chapter: 'Time & Work', dilrFamily: 'Caselets', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 2 — Arithmetic & Algebra' },
  { dayNum: 13, dateStr: '03 Oct', dateIso: '2026-10-03', chapter: 'Ratio & Variation', dilrFamily: 'Column Graphs', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 2 — Arithmetic & Algebra' },
  { dayNum: 14, dateStr: '04 Oct', dateIso: '2026-10-04', chapter: 'Week 2 Practice', dilrFamily: 'Week 2 DILR Review', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 2 — Arithmetic & Algebra' },

  // Week 3 (5 Oct - 11 Oct)
  { dayNum: 15, dateStr: '05 Oct', dateIso: '2026-10-05', chapter: 'Time Speed Distance', dilrFamily: 'Line Charts', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 3 — TSD & Work' },
  { dayNum: 16, dateStr: '06 Oct', dateIso: '2026-10-06', chapter: 'Time Speed Distance', dilrFamily: 'Cubes', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 3 — TSD & Work' },
  { dayNum: 17, dateStr: '07 Oct', dateIso: '2026-10-07', chapter: 'Pipes, Trains & Boats', dilrFamily: 'Line Charts', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 3 — TSD & Work' },
  { dayNum: 18, dateStr: '08 Oct', dateIso: '2026-10-08', chapter: 'Time & Work', dilrFamily: 'Pie Charts', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 3 — TSD & Work' },
  { dayNum: 19, dateStr: '09 Oct', dateIso: '2026-10-09', chapter: 'Time & Work', dilrFamily: 'Line Charts', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 3 — TSD & Work' },
  { dayNum: 20, dateStr: '10 Oct', dateIso: '2026-10-10', chapter: 'Interest (SI/CI)', dilrFamily: 'Pie Charts', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 3 — TSD & Work' },
  { dayNum: 21, dateStr: '11 Oct', dateIso: '2026-10-11', chapter: 'TSD + Work Sectional', dilrFamily: 'Week 3 DILR Review', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 3 — TSD & Work' },

  // Week 4 (12 Oct - 18 Oct)
  { dayNum: 22, dateStr: '12 Oct', dateIso: '2026-10-12', chapter: 'Linear & Quadratic Equations', dilrFamily: 'Pie Charts', varcSkill: 'Reading Comprehension', category: 'Algebra', blockName: 'Week 4 — Algebra Core' },
  { dayNum: 23, dateStr: '13 Oct', dateIso: '2026-10-13', chapter: 'Linear & Quadratic Equations', dilrFamily: 'Tables', varcSkill: 'Reading Comprehension', category: 'Algebra', blockName: 'Week 4 — Algebra Core' },
  { dayNum: 24, dateStr: '14 Oct', dateIso: '2026-10-14', chapter: 'Linear & Quadratic Equations', dilrFamily: 'Pie Charts', varcSkill: 'Reading Comprehension', category: 'Algebra', blockName: 'Week 4 — Algebra Core' },
  { dayNum: 25, dateStr: '15 Oct', dateIso: '2026-10-15', chapter: 'Inequalities', dilrFamily: 'Tables', varcSkill: 'Reading Comprehension', category: 'Algebra', blockName: 'Week 4 — Algebra Core' },
  { dayNum: 26, dateStr: '16 Oct', dateIso: '2026-10-16', chapter: 'Inequalities', dilrFamily: 'Pie Charts', varcSkill: 'Reading Comprehension', category: 'Algebra', blockName: 'Week 4 — Algebra Core' },
  { dayNum: 27, dateStr: '17 Oct', dateIso: '2026-10-17', chapter: 'Interest (SI/CI)', dilrFamily: 'Tables', varcSkill: 'Reading Comprehension', category: 'Arithmetic', blockName: 'Week 4 — Algebra Core' },
  { dayNum: 28, dateStr: '18 Oct', dateIso: '2026-10-18', chapter: 'Algebra Sectional', dilrFamily: 'Week 4 DILR Review', varcSkill: 'Reading Comprehension', category: 'Algebra', blockName: 'Week 4 — Algebra Core' },

  // Week 5 (19 Oct - 25 Oct)
  { dayNum: 29, dateStr: '19 Oct', dateIso: '2026-10-19', chapter: 'Functions', dilrFamily: 'Venn Diagrams', varcSkill: 'RC + Odd One Out', category: 'Algebra', blockName: 'Week 5 — Advanced Algebra' },
  { dayNum: 30, dateStr: '20 Oct', dateIso: '2026-10-20', chapter: 'Functions', dilrFamily: 'Venn Diagrams', varcSkill: 'RC + Odd One Out', category: 'Algebra', blockName: 'Week 5 — Advanced Algebra' },
  { dayNum: 31, dateStr: '21 Oct', dateIso: '2026-10-21', chapter: 'Functions & Maxima', dilrFamily: 'Venn Diagrams', varcSkill: 'RC + Odd One Out', category: 'Algebra', blockName: 'Week 5 — Advanced Algebra' },
  { dayNum: 32, dateStr: '22 Oct', dateIso: '2026-10-22', chapter: 'Logarithms', dilrFamily: 'Venn Diagrams', varcSkill: 'RC + Odd One Out', category: 'Algebra', blockName: 'Week 5 — Advanced Algebra' },
  { dayNum: 33, dateStr: '23 Oct', dateIso: '2026-10-23', chapter: 'Set Theory', dilrFamily: 'Venn Diagrams', varcSkill: 'RC + Odd One Out', category: 'Modern Math', blockName: 'Week 5 — Advanced Algebra' },
  { dayNum: 34, dateStr: '24 Oct', dateIso: '2026-10-24', chapter: 'Number System', dilrFamily: 'Venn Diagrams', varcSkill: 'RC + Odd One Out', category: 'Number System', blockName: 'Week 5 — Advanced Algebra' },
  { dayNum: 35, dateStr: '25 Oct', dateIso: '2026-10-25', chapter: 'Functions & Numbers Review', dilrFamily: 'Games & Tournaments', varcSkill: 'RC + Odd One Out', category: 'Algebra', blockName: 'Week 5 — Advanced Algebra' },

  // Week 6 (26 Oct - 1 Nov)
  { dayNum: 36, dateStr: '26 Oct', dateIso: '2026-10-26', chapter: 'Number System', dilrFamily: 'Games & Tournaments', varcSkill: 'Para Summary', category: 'Number System', blockName: 'Week 6 — Number System & Geometry' },
  { dayNum: 37, dateStr: '27 Oct', dateIso: '2026-10-27', chapter: 'Number System', dilrFamily: 'Games & Tournaments', varcSkill: 'Para Summary', category: 'Number System', blockName: 'Week 6 — Number System & Geometry' },
  { dayNum: 38, dateStr: '28 Oct', dateIso: '2026-10-28', chapter: 'Number System', dilrFamily: 'Games & Tournaments', varcSkill: 'Para Summary', category: 'Number System', blockName: 'Week 6 — Number System & Geometry' },
  { dayNum: 39, dateStr: '29 Oct', dateIso: '2026-10-29', chapter: 'Number System PYQs', dilrFamily: 'Syllogisms & Clocks', varcSkill: 'Para Summary', category: 'Number System', blockName: 'Week 6 — Number System & Geometry' },
  { dayNum: 40, dateStr: '30 Oct', dateIso: '2026-10-30', chapter: 'Geometry', dilrFamily: 'Games & Syllogisms', varcSkill: 'Para Summary', category: 'Geometry', blockName: 'Week 6 — Number System & Geometry' },
  { dayNum: 41, dateStr: '31 Oct', dateIso: '2026-10-31', chapter: 'Geometry Mensuration', dilrFamily: 'Syllogisms & Clocks', varcSkill: 'Para Summary', category: 'Geometry', blockName: 'Week 6 — Number System & Geometry' },
  { dayNum: 42, dateStr: '01 Nov', dateIso: '2026-11-01', chapter: 'NS & Geometry Review', dilrFamily: 'Week 6 DILR Review', varcSkill: 'Para Summary Review', category: 'Revision/Repair', blockName: 'Week 6 — Number System & Geometry' },
  { dayNum: 43, dateStr: '02 Nov', dateIso: '2026-11-02', chapter: 'Geometry Circles/Triangles', dilrFamily: 'Logical Sequence', varcSkill: 'Para Jumbles', category: 'Geometry', blockName: 'Week 7 — Geometry & Modern Math' },
  { dayNum: 44, dateStr: '03 Nov', dateIso: '2026-11-03', chapter: 'Coordinate Geometry', dilrFamily: 'Logical Sequence', varcSkill: 'Para Jumbles', category: 'Geometry', blockName: 'Week 7 — Geometry & Modern Math' },
]

export const ROADMAP_44 = MASTER_SPINE_44

export const QA_BLOCK_MAPS = [
  { block: 'Week 1', name: 'Arithmetic Core (216q)', dates: '21–27 Sep', topics: ['Averages (100q)', 'Percentages (60q)', 'Mixtures & Alligations (40q)', 'Ratio, Proportion & Variation (16q)'] },
  { block: 'Week 2', name: 'Algebra & Arithmetic (216q)', dates: '28 Sep–4 Oct', topics: ['Profit & Loss (80q)', 'Progressions (50q)', 'Ratio & Variation (44q)', 'Time & Work (42q)'] },
  { block: 'Week 3', name: 'TSD & Work Core (216q)', dates: '5–11 Oct', topics: ['Time Speed Distance (80q)', 'Time & Work (58q)', 'Pipes, Trains & Boats (40q)', 'Races (20q)', 'Interest (18q)'] },
  { block: 'Week 4', name: 'Equations & Inequalities (216q)', dates: '12–18 Oct', topics: ['Linear & Quadratic Equations (100q)', 'Inequalities (74q)', 'Interest (42q)'] },
  { block: 'Week 5', name: 'Functions & Logarithms (216q)', dates: '19–25 Oct', topics: ['Functions (80q)', 'Set Theory (40q)', 'Number System (40q)', 'Logarithms (25q)', 'Maxima Minima (25q)', 'Inequalities (6q)'] },
  { block: 'Week 6', name: 'Number System & Geometry (216q)', dates: '26 Oct–1 Nov', topics: ['Number System (160q)', 'Geometry (56q)'] },
  { block: 'Week 7', name: 'Geometry & Modern Math (214q)', dates: '2–7 Nov', topics: ['Permutations & Combinations (80q)', 'Coordinate Geometry (50q)', 'Geometry (44q)', 'Probability (40q)'] },
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
  { date: 'By 30 Sep', items: ['Arithmetic foundation (Averages 100q, Percentages 60q)', 'Algebra foundation', 'Basic DI (Bar Graphs 25 sets, Seating 25 sets)', 'Daily RC habit (62 passages)'] },
  { date: 'By 4 Oct (Application phase ends)', items: ['Major Arithmetic base (Profit & Loss 80q)', 'Initial Algebra base (Progressions 50q)', 'Caselets & Column Graphs (49 sets)', 'RC habit (62 passages)', 'PYQ exposure started'] },
  { date: 'By 15 Oct', items: ['TSD & Work covered (TSD 80q, Work 58q, Pipes 40q)', 'Equations & Inequalities underway', 'Broad DILR coverage (Line Charts 23 sets, Cubes 15 sets)', 'VARC continuing daily', 'Mocks generating weakness data'] },
  { date: 'By 24 Oct', items: ['Equations & Inequalities complete (Equations 100q, Inequalities 80q)', 'Functions & Logarithms (Functions 80q, Set Theory 40q)', 'Venn Diagrams (35 sets)', 'VARC question types covered'] },
  { date: '31 Oct — SYLLABUS CLOSURE', items: ['QA → First pass complete (Number System 160q, Geometry 56q)', 'DILR → Major families covered (Games & Tournaments 20 sets, Syllogisms 20q)', 'VARC → All major question types covered (Para Summary 47q)', 'PYQ → Integrated', 'ERROR → Active', 'MOCK → Active'] },
]
