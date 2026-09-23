export interface PercentylWeek {
  weekNum: number;
  dates: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  quantTarget: string;
  quantBreakdown: { topic: string; questions: number }[];
  dilrTarget: string;
  dilrBreakdown: { family: string; count: number; unit: 'sets' | 'qs' }[];
  varcTarget: string;
  varcBreakdown: { skill: string; count: number; unit: 'passages' | 'qs' }[];
}

export interface PercentylDailyTarget {
  dayNum: number;
  dateIso: string;
  dateStr: string;
  weekNum: number;
  quantTopic: string;
  quantTargetQs: number;
  quantDetail: string;
  dilrTopic: string;
  dilrTargetSets: number;
  dilrDetail: string;
  varcTopic: string;
  varcTargetPsg: number;
  varcDetail: string;
}

export const PERCENTYL_WEEKS: PercentylWeek[] = [
  {
    weekNum: 1, dates: '21 Sep – 27 Sep', startDate: '2026-09-21', endDate: '2026-09-27',
    quantTarget: '216 Qs',
    quantBreakdown: [
      { topic: 'Averages', questions: 100 },
      { topic: 'Percentages', questions: 60 },
      { topic: 'Mixtures & Alligations', questions: 40 },
      { topic: 'Ratio, Proportion & Variation', questions: 16 }
    ],
    dilrTarget: '51 sets',
    dilrBreakdown: [
      { family: 'Seating Arrangements', count: 25, unit: 'sets' },
      { family: 'Bar Graphs', count: 25, unit: 'sets' },
      { family: 'Caselets', count: 1, unit: 'sets' }
    ],
    varcTarget: '62 passages',
    varcBreakdown: [
      { skill: 'Reading Comprehension', count: 62, unit: 'passages' }
    ]
  },
  {
    weekNum: 2, dates: '28 Sep – 4 Oct', startDate: '2026-09-28', endDate: '2026-10-04',
    quantTarget: '216 Qs',
    quantBreakdown: [
      { topic: 'Ratio, Proportion & Variation', questions: 44 },
      { topic: 'Progressions', questions: 50 },
      { topic: 'Profit & Loss', questions: 80 },
      { topic: 'Time & Work', questions: 42 }
    ],
    dilrTarget: '51 sets',
    dilrBreakdown: [
      { family: 'Caselets', count: 24, unit: 'sets' },
      { family: 'Column Graphs', count: 25, unit: 'sets' },
      { family: 'Line Charts', count: 2, unit: 'sets' }
    ],
    varcTarget: '62 passages',
    varcBreakdown: [
      { skill: 'Reading Comprehension', count: 62, unit: 'passages' }
    ]
  },
  {
    weekNum: 3, dates: '5 Oct – 11 Oct', startDate: '2026-10-05', endDate: '2026-10-11',
    quantTarget: '216 Qs',
    quantBreakdown: [
      { topic: 'Time & Work', questions: 58 },
      { topic: 'Time Speed Distance', questions: 80 },
      { topic: 'Races', questions: 20 },
      { topic: 'Pipes, Trains & Boats', questions: 40 },
      { topic: 'Interest (SI/CI)', questions: 18 }
    ],
    dilrTarget: '51 sets',
    dilrBreakdown: [
      { family: 'Line Charts', count: 23, unit: 'sets' },
      { family: 'Cubes', count: 15, unit: 'sets' },
      { family: 'Pie Charts', count: 13, unit: 'sets' }
    ],
    varcTarget: '62 passages',
    varcBreakdown: [
      { skill: 'Reading Comprehension', count: 62, unit: 'passages' }
    ]
  },
  {
    weekNum: 4, dates: '12 Oct – 18 Oct', startDate: '2026-10-12', endDate: '2026-10-18',
    quantTarget: '216 Qs',
    quantBreakdown: [
      { topic: 'Interest (SI/CI)', questions: 42 },
      { topic: 'Linear & Quadratic Equations', questions: 100 },
      { topic: 'Inequalities', questions: 74 }
    ],
    dilrTarget: '51 sets',
    dilrBreakdown: [
      { family: 'Pie Charts', count: 27, unit: 'sets' },
      { family: 'Tables', count: 24, unit: 'sets' }
    ],
    varcTarget: '62 passages',
    varcBreakdown: [
      { skill: 'Reading Comprehension', count: 62, unit: 'passages' }
    ]
  },
  {
    weekNum: 5, dates: '19 Oct – 25 Oct', startDate: '2026-10-19', endDate: '2026-10-25',
    quantTarget: '216 Qs',
    quantBreakdown: [
      { topic: 'Inequalities', questions: 6 },
      { topic: 'Logarithms', questions: 25 },
      { topic: 'Maxima Minima', questions: 25 },
      { topic: 'Functions', questions: 80 },
      { topic: 'Set Theory', questions: 40 },
      { topic: 'Number System', questions: 40 }
    ],
    dilrTarget: '51 sets',
    dilrBreakdown: [
      { family: 'Tables', count: 11, unit: 'sets' },
      { family: 'Venn Diagrams', count: 35, unit: 'sets' },
      { family: 'Games & Tournaments', count: 5, unit: 'sets' }
    ],
    varcTarget: '62 units',
    varcBreakdown: [
      { skill: 'Reading Comprehension', count: 32, unit: 'passages' },
      { skill: 'Odd One Out', count: 30, unit: 'qs' }
    ]
  },
  {
    weekNum: 6, dates: '26 Oct – 1 Nov', startDate: '2026-10-26', endDate: '2026-11-01',
    quantTarget: '216 Qs',
    quantBreakdown: [
      { topic: 'Number System', questions: 160 },
      { topic: 'Geometry', questions: 56 }
    ],
    dilrTarget: '51 units',
    dilrBreakdown: [
      { family: 'Games & Tournaments', count: 20, unit: 'sets' },
      { family: 'Syllogisms', count: 20, unit: 'qs' },
      { family: 'Clocks', count: 11, unit: 'qs' }
    ],
    varcTarget: '62 units',
    varcBreakdown: [
      { skill: 'Odd One Out', count: 15, unit: 'qs' },
      { skill: 'Para Summary', count: 47, unit: 'qs' }
    ]
  },
  {
    weekNum: 7, dates: '2 Nov – 7 Nov', startDate: '2026-11-02', endDate: '2026-11-07',
    quantTarget: '214 Qs',
    quantBreakdown: [
      { topic: 'Geometry', questions: 44 },
      { topic: 'Coordinate Geometry', questions: 50 },
      { topic: 'Probability', questions: 40 },
      { topic: 'Permutations & Combinations', questions: 80 }
    ],
    dilrTarget: '49 units',
    dilrBreakdown: [
      { family: 'Clocks', count: 9, unit: 'qs' },
      { family: 'Logical Sequence & Series', count: 20, unit: 'qs' },
      { family: 'Logical Connectives & Reasoning', count: 20, unit: 'qs' }
    ],
    varcTarget: '58 units',
    varcBreakdown: [
      { skill: 'Para Summary', count: 13, unit: 'qs' },
      { skill: 'Para Jumbles', count: 45, unit: 'qs' }
    ]
  }
]

// Daily breakdown generated directly from Percentyl 2.0 Plan
export const PERCENTYL_DAILY_MAP: PercentylDailyTarget[] = [
  // Week 1 (21 Sep - 27 Sep)
  { dayNum: 1, dateIso: '2026-09-21', dateStr: '21 Sep', weekNum: 1, quantTopic: 'Averages', quantTargetQs: 30, quantDetail: 'Averages (30 Qs) • Concept + Basic + PYQ', dilrTopic: 'Seating Arrangements', dilrTargetSets: 8, dilrDetail: 'Seating Arrangements (4 sets) + Bar Graphs (4 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Main Idea & Inference' },
  { dayNum: 2, dateIso: '2026-09-22', dateStr: '22 Sep', weekNum: 1, quantTopic: 'Averages', quantTargetQs: 30, quantDetail: 'Averages (30 Qs) • Practice + Medium Qs', dilrTopic: 'Bar Graphs', dilrTargetSets: 8, dilrDetail: 'Bar Graphs (4 sets) + Seating Arrangements (4 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Tone & Structure' },
  { dayNum: 3, dateIso: '2026-09-23', dateStr: '23 Sep', weekNum: 1, quantTopic: 'Percentages', quantTargetQs: 30, quantDetail: 'Percentages (30 Qs) • Concept + Basic Qs', dilrTopic: 'Seating Arrangements', dilrTargetSets: 8, dilrDetail: 'Seating Arrangements (4 sets) + Bar Graphs (4 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Elimination focus' },
  { dayNum: 4, dateIso: '2026-09-24', dateStr: '24 Sep', weekNum: 1, quantTopic: 'Percentages', quantTargetQs: 30, quantDetail: 'Percentages (30 Qs) • Medium + Timed Qs', dilrTopic: 'Bar Graphs', dilrTargetSets: 8, dilrDetail: 'Bar Graphs (4 sets) + Caselet (1 set)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Author POV' },
  { dayNum: 5, dateIso: '2026-09-25', dateStr: '25 Sep', weekNum: 1, quantTopic: 'Mixtures & Alligations', quantTargetQs: 30, quantDetail: 'Mixtures & Alligations (20 Qs) + Ratio (10 Qs)', dilrTopic: 'Seating Arrangements', dilrTargetSets: 7, dilrDetail: 'Seating Arrangements (4 sets) + Bar Graphs (3 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Detail & Inference' },
  { dayNum: 6, dateIso: '2026-09-26', dateStr: '26 Sep', weekNum: 1, quantTopic: 'Ratio & Proportion', quantTargetQs: 30, quantDetail: 'Ratio, Proportion & Variation (20 Qs) + Mixtures (10 Qs)', dilrTopic: 'Bar Graphs', dilrTargetSets: 7, dilrDetail: 'Bar Graphs (4 sets) + Seating Arrangements (3 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Timed RC Sprint' },
  { dayNum: 7, dateIso: '2026-09-27', dateStr: '27 Sep', weekNum: 1, quantTopic: 'Arithmetic Sectional', quantTargetQs: 36, quantDetail: 'Full Week 1 Arithmetic Practice (36 Qs) + Error Repair', dilrTopic: 'Week 1 DILR Review', dilrTargetSets: 5, dilrDetail: 'Seating Arrangements (3 sets) + Bar Graphs (2 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 8, varcDetail: 'RC (8 Passages) + Full Week 1 VARC Review' },

  // Week 2 (28 Sep - 4 Oct)
  { dayNum: 8, dateIso: '2026-09-28', dateStr: '28 Sep', weekNum: 2, quantTopic: 'Profit & Loss', quantTargetQs: 30, quantDetail: 'Profit & Loss (30 Qs) • Concept + Basic Qs', dilrTopic: 'Caselets', dilrTargetSets: 8, dilrDetail: 'Caselets (4 sets) + Column Graphs (4 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Main Idea' },
  { dayNum: 9, dateIso: '2026-09-29', dateStr: '29 Sep', weekNum: 2, quantTopic: 'Profit & Loss', quantTargetQs: 30, quantDetail: 'Profit & Loss (30 Qs) • Medium + PYQs', dilrTopic: 'Column Graphs', dilrTargetSets: 8, dilrDetail: 'Column Graphs (4 sets) + Caselets (4 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Inference' },
  { dayNum: 10, dateIso: '2026-09-30', dateStr: '30 Sep', weekNum: 2, quantTopic: 'Profit & Loss', quantTargetQs: 20, quantDetail: 'Profit & Loss (20 Qs) + Progressions (10 Qs)', dilrTopic: 'Caselets', dilrTargetSets: 8, dilrDetail: 'Caselets (4 sets) + Column Graphs (4 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Tone' },
  { dayNum: 11, dateIso: '2026-10-01', dateStr: '01 Oct', weekNum: 2, quantTopic: 'Progressions', quantTargetQs: 30, quantDetail: 'Progressions / Series (30 Qs) • AP/GP Concept', dilrTopic: 'Column Graphs', dilrTargetSets: 8, dilrDetail: 'Column Graphs (4 sets) + Line Charts (2 sets) + Caselets (2 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Structure' },
  { dayNum: 12, dateIso: '2026-10-02', dateStr: '02 Oct', weekNum: 2, quantTopic: 'Time & Work', quantTargetQs: 30, quantDetail: 'Time & Work (30 Qs) • Efficiency & Pipes', dilrTopic: 'Caselets', dilrTargetSets: 7, dilrDetail: 'Caselets (4 sets) + Column Graphs (3 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Author POV' },
  { dayNum: 13, dateIso: '2026-10-03', dateStr: '03 Oct', weekNum: 2, quantTopic: 'Ratio & Variation', quantTargetQs: 34, quantDetail: 'Ratio, Proportion & Variation (24 Qs) + Time & Work (10 Qs)', dilrTopic: 'Column Graphs', dilrTargetSets: 7, dilrDetail: 'Column Graphs (4 sets) + Caselets (3 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Detail' },
  { dayNum: 14, dateIso: '2026-10-04', dateStr: '04 Oct', weekNum: 2, quantTopic: 'Week 2 Practice', quantTargetQs: 32, quantDetail: 'Ratio (20 Qs) + Progressions (10 Qs) + Repair', dilrTopic: 'Week 2 DILR Review', dilrTargetSets: 5, dilrDetail: 'Caselets (3 sets) + Column Graphs (2 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 8, varcDetail: 'RC (8 Passages) + Week 2 Summary' },

  // Week 3 (5 Oct - 11 Oct)
  { dayNum: 15, dateIso: '2026-10-05', dateStr: '05 Oct', weekNum: 3, quantTopic: 'Time Speed Distance', quantTargetQs: 30, quantDetail: 'Time Speed Distance (30 Qs) • TSD Basics', dilrTopic: 'Line Charts', dilrTargetSets: 8, dilrDetail: 'Line Charts (4 sets) + Cubes (4 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Elimination' },
  { dayNum: 16, dateIso: '2026-10-06', dateStr: '06 Oct', weekNum: 3, quantTopic: 'Time Speed Distance', quantTargetQs: 30, quantDetail: 'Time Speed Distance (30 Qs) + Races (10 Qs)', dilrTopic: 'Cubes', dilrTargetSets: 8, dilrDetail: 'Cubes (4 sets) + Pie Charts (4 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Inference' },
  { dayNum: 17, dateIso: '2026-10-07', dateStr: '07 Oct', weekNum: 3, quantTopic: 'Pipes, Trains & Boats', quantTargetQs: 30, quantDetail: 'Pipes, Trains & Boats (30 Qs) • Relative Speed', dilrTopic: 'Line Charts', dilrTargetSets: 8, dilrDetail: 'Line Charts (4 sets) + Pie Charts (4 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Main Idea' },
  { dayNum: 18, dateIso: '2026-10-08', dateStr: '08 Oct', weekNum: 3, quantTopic: 'Time & Work', quantTargetQs: 30, quantDetail: 'Time & Work (30 Qs) • Advanced Practice', dilrTopic: 'Pie Charts', dilrTargetSets: 7, dilrDetail: 'Pie Charts (4 sets) + Cubes (3 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Tone' },
  { dayNum: 19, dateIso: '2026-10-09', dateStr: '09 Oct', weekNum: 3, quantTopic: 'Time & Work', quantTargetQs: 28, quantDetail: 'Time & Work (28 Qs) + Races (10 Qs)', dilrTopic: 'Line Charts', dilrTargetSets: 7, dilrDetail: 'Line Charts (4 sets) + Cubes (3 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Detail' },
  { dayNum: 20, dateIso: '2026-10-10', dateStr: '10 Oct', weekNum: 3, quantTopic: 'Interest (SI/CI)', quantTargetQs: 28, quantDetail: 'Interest (18 Qs) + TSD (10 Qs)', dilrTopic: 'Pie Charts', dilrTargetSets: 8, dilrDetail: 'Pie Charts (5 sets) + Line Charts (3 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Structure' },
  { dayNum: 21, dateIso: '2026-10-11', dateStr: '11 Oct', weekNum: 3, quantTopic: 'TSD + Work Sectional', quantTargetQs: 32, quantDetail: 'TSD + Work Practice (32 Qs) + Error Repair', dilrTopic: 'Week 3 DILR Review', dilrTargetSets: 5, dilrDetail: 'Line Charts (2 sets) + Pie Charts (3 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 8, varcDetail: 'RC (8 Passages) + Week 3 Summary' },

  // Week 4 (12 Oct - 18 Oct)
  { dayNum: 22, dateIso: '2026-10-12', dateStr: '12 Oct', weekNum: 4, quantTopic: 'Linear & Quadratic Equations', quantTargetQs: 30, quantDetail: 'Linear & Quadratic Equations (30 Qs) • Concepts', dilrTopic: 'Pie Charts', dilrTargetSets: 8, dilrDetail: 'Pie Charts (4 sets) + Tables (4 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Elimination' },
  { dayNum: 23, dateIso: '2026-10-13', dateStr: '13 Oct', weekNum: 4, quantTopic: 'Linear & Quadratic Equations', quantTargetQs: 30, quantDetail: 'Linear & Quadratic Equations (30 Qs) • Practice', dilrTopic: 'Tables', dilrTargetSets: 8, dilrDetail: 'Tables (4 sets) + Pie Charts (4 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Inference' },
  { dayNum: 24, dateIso: '2026-10-14', dateStr: '14 Oct', weekNum: 4, quantTopic: 'Linear & Quadratic Equations', quantTargetQs: 40, quantDetail: 'Linear & Quadratic Equations (40 Qs) • PYQs', dilrTopic: 'Pie Charts', dilrTargetSets: 8, dilrDetail: 'Pie Charts (4 sets) + Tables (4 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Author POV' },
  { dayNum: 25, dateIso: '2026-10-15', dateStr: '15 Oct', weekNum: 4, quantTopic: 'Inequalities', quantTargetQs: 30, quantDetail: 'Inequalities (30 Qs) • AM-GM & Modulus', dilrTopic: 'Tables', dilrTargetSets: 8, dilrDetail: 'Tables (4 sets) + Pie Charts (4 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Detail' },
  { dayNum: 26, dateIso: '2026-10-16', dateStr: '16 Oct', weekNum: 4, quantTopic: 'Inequalities', quantTargetQs: 44, quantDetail: 'Inequalities (44 Qs) • Advanced Practice', dilrTopic: 'Pie Charts', dilrTargetSets: 7, dilrDetail: 'Pie Charts (4 sets) + Tables (3 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Tone' },
  { dayNum: 27, dateIso: '2026-10-17', dateStr: '17 Oct', weekNum: 4, quantTopic: 'Interest (SI/CI)', quantTargetQs: 42, quantDetail: 'Interest (42 Qs) • Compound Interest & Installments', dilrTopic: 'Tables', dilrTargetSets: 7, dilrDetail: 'Tables (5 sets) + Pie Charts (2 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 9, varcDetail: 'RC (9 Passages) • Structure' },
  { dayNum: 28, dateIso: '2026-10-18', dateStr: '18 Oct', weekNum: 4, quantTopic: 'Algebra Sectional', quantTargetQs: 30, quantDetail: 'Equations + Inequalities Sectional (30 Qs) + Repair', dilrTopic: 'Week 4 DILR Review', dilrTargetSets: 5, dilrDetail: 'Tables (3 sets) + Pie Charts (2 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 8, varcDetail: 'RC (8 Passages) + Week 4 Summary' },

  // Week 5 (19 Oct - 25 Oct)
  { dayNum: 29, dateIso: '2026-10-19', dateStr: '19 Oct', weekNum: 5, quantTopic: 'Functions', quantTargetQs: 30, quantDetail: 'Functions (30 Qs) • Domain, Range & Graphs', dilrTopic: 'Venn Diagrams', dilrTargetSets: 8, dilrDetail: 'Venn Diagrams (5 sets) + Tables (3 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 5, varcDetail: 'RC (5 Passages) + Odd One Out (5 Qs)' },
  { dayNum: 30, dateIso: '2026-10-20', dateStr: '20 Oct', weekNum: 5, quantTopic: 'Functions', quantTargetQs: 30, quantDetail: 'Functions (30 Qs) • Composite & Inverses', dilrTopic: 'Venn Diagrams', dilrTargetSets: 8, dilrDetail: 'Venn Diagrams (5 sets) + Tables (3 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 5, varcDetail: 'RC (5 Passages) + Odd One Out (5 Qs)' },
  { dayNum: 31, dateIso: '2026-10-21', dateStr: '21 Oct', weekNum: 5, quantTopic: 'Functions', quantTargetQs: 20, quantDetail: 'Functions (20 Qs) + Maxima Minima (10 Qs)', dilrTopic: 'Venn Diagrams', dilrTargetSets: 8, dilrDetail: 'Venn Diagrams (5 sets) + Tables (3 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 5, varcDetail: 'RC (5 Passages) + Odd One Out (5 Qs)' },
  { dayNum: 32, dateIso: '2026-10-22', dateStr: '22 Oct', weekNum: 5, quantTopic: 'Logarithms', quantTargetQs: 25, quantDetail: 'Logarithms (25 Qs) + Maxima Minima (15 Qs)', dilrTopic: 'Venn Diagrams', dilrTargetSets: 8, dilrDetail: 'Venn Diagrams (6 sets) + Tables (2 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 5, varcDetail: 'RC (5 Passages) + Odd One Out (5 Qs)' },
  { dayNum: 33, dateIso: '2026-10-23', dateStr: '23 Oct', weekNum: 5, quantTopic: 'Set Theory', quantTargetQs: 30, quantDetail: 'Set Theory (30 Qs) + Logarithms / Inequalities (12 Qs)', dilrTopic: 'Venn Diagrams', dilrTargetSets: 8, dilrDetail: 'Venn Diagrams (6 sets) + Games (2 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 5, varcDetail: 'RC (5 Passages) + Odd One Out (5 Qs)' },
  { dayNum: 34, dateIso: '2026-10-24', dateStr: '24 Oct', weekNum: 5, quantTopic: 'Number System', quantTargetQs: 30, quantDetail: 'Number System (30 Qs) + Set Theory (10 Qs)', dilrTopic: 'Venn Diagrams', dilrTargetSets: 6, dilrDetail: 'Venn Diagrams (4 sets) + Games (2 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 5, varcDetail: 'RC (5 Passages) + Odd One Out (5 Qs)' },
  { dayNum: 35, dateIso: '2026-10-25', dateStr: '25 Oct', weekNum: 5, quantTopic: 'Functions & Numbers Review', quantTargetQs: 31, quantDetail: 'Functions (20 Qs) + Number System (11 Qs) + Repair', dilrTopic: 'Games & Tournaments', dilrTargetSets: 5, dilrDetail: 'Games & Tournaments (3 sets) + Venn (2 sets)', varcTopic: 'Reading Comprehension', varcTargetPsg: 2, varcDetail: 'RC (2 Passages) + Odd One Out (5 Qs)' },

  // Week 6 (26 Oct - 1 Nov)
  { dayNum: 36, dateIso: '2026-10-26', dateStr: '26 Oct', weekNum: 6, quantTopic: 'Number System', quantTargetQs: 35, quantDetail: 'Number System (35 Qs) • Divisibility & Factors', dilrTopic: 'Games & Tournaments', dilrTargetSets: 8, dilrDetail: 'Games & Tournaments (4 sets) + Syllogisms (4 Qs)', varcTopic: 'Para Summary', varcTargetPsg: 10, varcDetail: 'Para Summary (8 Qs) + Odd One Out (2 Qs)' },
  { dayNum: 37, dateIso: '2026-10-27', dateStr: '27 Oct', weekNum: 6, quantTopic: 'Number System', quantTargetQs: 35, quantDetail: 'Number System (35 Qs) • Remainders & Units Digit', dilrTopic: 'Games & Tournaments', dilrTargetSets: 8, dilrDetail: 'Games & Tournaments (4 sets) + Syllogisms (4 Qs)', varcTopic: 'Para Summary', varcTargetPsg: 10, varcDetail: 'Para Summary (8 Qs) + Odd One Out (2 Qs)' },
  { dayNum: 38, dateIso: '2026-10-28', dateStr: '28 Oct', weekNum: 6, quantTopic: 'Number System', quantTargetQs: 40, quantDetail: 'Number System (40 Qs) • Base & Digits', dilrTopic: 'Games & Tournaments', dilrTargetSets: 8, dilrDetail: 'Games & Tournaments (4 sets) + Clocks (4 Qs)', varcTopic: 'Para Summary', varcTargetPsg: 10, varcDetail: 'Para Summary (8 Qs) + Odd One Out (2 Qs)' },
  { dayNum: 39, dateIso: '2026-10-29', dateStr: '29 Oct', weekNum: 6, quantTopic: 'Number System', quantTargetQs: 50, quantDetail: 'Number System (50 Qs) • PYQs & Advanced', dilrTopic: 'Syllogisms & Clocks', dilrTargetSets: 8, dilrDetail: 'Syllogisms (8 Qs) + Clocks (4 Qs)', varcTopic: 'Para Summary', varcTargetPsg: 10, varcDetail: 'Para Summary (8 Qs) + Odd One Out (2 Qs)' },
  { dayNum: 40, dateIso: '2026-10-30', dateStr: '30 Oct', weekNum: 6, quantTopic: 'Geometry', quantTargetQs: 30, quantDetail: 'Geometry (30 Qs) • Lines, Triangles & Circles', dilrTopic: 'Games & Syllogisms', dilrTargetSets: 7, dilrDetail: 'Games (4 sets) + Syllogisms (4 Qs)', varcTopic: 'Para Summary', varcTargetPsg: 10, varcDetail: 'Para Summary (8 Qs) + Odd One Out (2 Qs)' },
  { dayNum: 41, dateIso: '2026-10-31', dateStr: '31 Oct', weekNum: 6, quantTopic: 'Geometry', quantTargetQs: 26, quantDetail: 'Geometry (26 Qs) • Mensuration & Polygons', dilrTopic: 'Syllogisms & Clocks', dilrTargetSets: 7, dilrDetail: 'Syllogisms (4 Qs) + Clocks (3 Qs)', varcTopic: 'Para Summary', varcTargetPsg: 7, varcDetail: 'Para Summary (7 Qs) • FIRST-PASS CLOSURE' },
  { dayNum: 42, dateIso: '2026-11-01', dateStr: '01 Nov', weekNum: 6, quantTopic: 'Number System + Geometry Review', quantTargetQs: 30, quantDetail: 'Number System (20 Qs) + Geometry (10 Qs) + Repair', dilrTopic: 'Week 6 DILR Review', dilrTargetSets: 5, dilrDetail: 'Games & Tournaments (3 sets) + Syllogisms (2 sets)', varcTopic: 'Para Summary Review', varcTargetPsg: 5, varcDetail: 'Para Summary (5 Qs) + Week 6 Summary' },

  // Week 7 (2 Nov - 7 Nov)
  { dayNum: 43, dateIso: '2026-11-02', dateStr: '02 Nov', weekNum: 7, quantTopic: 'Geometry', quantTargetQs: 30, quantDetail: 'Geometry (30 Qs) • Circles & Triangles PYQs', dilrTopic: 'Logical Sequence', dilrTargetSets: 7, dilrDetail: 'Logical Sequence & Series (10 Qs) + Clocks (3 Qs)', varcTopic: 'Para Jumbles', varcTargetPsg: 10, varcDetail: 'Para Jumbles (8 Qs) + Para Summary (2 Qs)' },
  { dayNum: 44, dateIso: '2026-11-03', dateStr: '03 Nov', weekNum: 7, quantTopic: 'Coordinate Geometry', quantTargetQs: 30, quantDetail: 'Coordinate Geometry (30 Qs) • Slopes & Circles', dilrTopic: 'Logical Sequence', dilrTargetSets: 7, dilrDetail: 'Logical Sequence & Series (10 Qs) + Connectives (5 Qs)', varcTopic: 'Para Jumbles', varcTargetPsg: 10, varcDetail: 'Para Jumbles (8 Qs) + Para Summary (2 Qs)' },
  { dayNum: 45, dateIso: '2026-11-04', dateStr: '04 Nov', weekNum: 7, quantTopic: 'Probability', quantTargetQs: 30, quantDetail: 'Probability (30 Qs) • Basic & Conditional', dilrTopic: 'Logical Connectives', dilrTargetSets: 7, dilrDetail: 'Logical Connectives (10 Qs) + Clocks (3 Qs)', varcTopic: 'Para Jumbles', varcTargetPsg: 10, varcDetail: 'Para Jumbles (8 Qs) + Para Summary (2 Qs)' },
  { dayNum: 46, dateIso: '2026-11-05', dateStr: '05 Nov', weekNum: 7, quantTopic: 'Permutations & Combinations', quantTargetQs: 40, quantDetail: 'Permutations & Combinations (40 Qs) • Arrangements', dilrTopic: 'Logical Connectives', dilrTargetSets: 7, dilrDetail: 'Logical Connectives (5 Qs) + Reasoning Mix', varcTopic: 'Para Jumbles', varcTargetPsg: 10, varcDetail: 'Para Jumbles (8 Qs) + Para Summary (2 Qs)' },
  { dayNum: 47, dateIso: '2026-11-06', dateStr: '06 Nov', weekNum: 7, quantTopic: 'Permutations & Combinations', quantTargetQs: 40, quantDetail: 'Permutations & Combinations (40 Qs) • Selections & P&C', dilrTopic: 'Reasoning Mix', dilrTargetSets: 7, dilrDetail: 'Logical Connectives (5 Qs) + Sequence (5 Qs)', varcTopic: 'Para Jumbles', varcTargetPsg: 9, varcDetail: 'Para Jumbles (7 Qs) + Para Summary (2 Qs)' },
  { dayNum: 48, dateIso: '2026-11-07', dateStr: '07 Nov', weekNum: 7, quantTopic: 'Probability & Geometry PYQ', quantTargetQs: 44, quantDetail: 'Probability (10 Qs) + Geometry (14 Qs) + Coordinate (20 Qs)', dilrTopic: 'Full DILR Sweep', dilrTargetSets: 7, dilrDetail: 'Full DILR Sequence & Connectives Practice', varcTopic: 'Para Jumbles & Summary Sweep', varcTargetPsg: 9, varcDetail: 'Para Jumbles (9 Qs) • FINAL SYLLABUS CLOSURE' },
]

export const PERCENTYL_DAILY_MAP_MAP: Record<string, PercentylDailyTarget> = Object.fromEntries(
  PERCENTYL_DAILY_MAP.map(item => [item.dateIso, item])
)

export function getPercentylDailyTarget(dateIso: string): PercentylDailyTarget {
  if (PERCENTYL_DAILY_MAP_MAP[dateIso]) return PERCENTYL_DAILY_MAP_MAP[dateIso]

  // Default fallback if date is outside range
  return {
    dayNum: 1,
    dateIso,
    dateStr: '21 Sep',
    weekNum: 1,
    quantTopic: 'Averages & Percentages',
    quantTargetQs: 30,
    quantDetail: 'Arithmetic Core • Averages & Percentages (30 Qs)',
    dilrTopic: 'Seating Arrangements & Bar Graphs',
    dilrTargetSets: 8,
    dilrDetail: 'Seating Arrangements (4 sets) + Bar Graphs (4 sets)',
    varcTopic: 'Reading Comprehension',
    varcTargetPsg: 9,
    varcDetail: 'RC (9 Passages) • Main Idea & Inference'
  }
}
