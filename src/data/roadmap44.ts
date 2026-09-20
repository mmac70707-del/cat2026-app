export interface RoadmapDayItem {
  dayNum: number;
  dateStr: string; // e.g. "18 SEP 2026"
  dateIso: string; // "2026-09-18"
  chapter: string;
  category: 'Arithmetic' | 'Algebra' | 'Number System' | 'Geometry' | 'Modern Math' | 'Revision/Repair';
}

export const ROADMAP_44: RoadmapDayItem[] = [
  { dayNum: 1,  dateStr: '18 SEP 2026', dateIso: '2026-09-18', chapter: 'Percentages', category: 'Arithmetic' },
  { dayNum: 2,  dateStr: '19 SEP 2026', dateIso: '2026-09-19', chapter: 'Ratio & Proportion', category: 'Arithmetic' },
  { dayNum: 3,  dateStr: '20 SEP 2026', dateIso: '2026-09-20', chapter: 'Averages', category: 'Arithmetic' },
  { dayNum: 4,  dateStr: '21 SEP 2026', dateIso: '2026-09-21', chapter: 'Profit, Loss & Discount', category: 'Arithmetic' },
  { dayNum: 5,  dateStr: '22 SEP 2026', dateIso: '2026-09-22', chapter: 'Simple Interest + Compound Interest', category: 'Arithmetic' },
  { dayNum: 6,  dateStr: '23 SEP 2026', dateIso: '2026-09-23', chapter: 'Mixtures & Alligation', category: 'Arithmetic' },
  { dayNum: 7,  dateStr: '24 SEP 2026', dateIso: '2026-09-24', chapter: 'Arithmetic Integration', category: 'Arithmetic' },
  { dayNum: 8,  dateStr: '25 SEP 2026', dateIso: '2026-09-25', chapter: 'Time-Speed-Distance Basics', category: 'Arithmetic' },
  { dayNum: 9,  dateStr: '26 SEP 2026', dateIso: '2026-09-26', chapter: 'Time-Speed-Distance Applications', category: 'Arithmetic' },
  { dayNum: 10, dateStr: '27 SEP 2026', dateIso: '2026-09-27', chapter: 'Time & Work Basics', category: 'Arithmetic' },
  { dayNum: 11, dateStr: '28 SEP 2026', dateIso: '2026-09-28', chapter: 'Time & Work Applications', category: 'Arithmetic' },
  { dayNum: 12, dateStr: '29 SEP 2026', dateIso: '2026-09-29', chapter: 'Partnership + Variation', category: 'Arithmetic' },
  { dayNum: 13, dateStr: '30 SEP 2026', dateIso: '2026-09-30', chapter: 'Arithmetic Mixed / PYQ', category: 'Arithmetic' },
  { dayNum: 14, dateStr: '01 OCT 2026', dateIso: '2026-10-01', chapter: 'Arithmetic Sectional + Repair', category: 'Arithmetic' },

  { dayNum: 15, dateStr: '02 OCT 2026', dateIso: '2026-10-02', chapter: 'Linear Equations', category: 'Algebra' },
  { dayNum: 16, dateStr: '03 OCT 2026', dateIso: '2026-10-03', chapter: 'Quadratic Equations', category: 'Algebra' },
  { dayNum: 17, dateStr: '04 OCT 2026', dateIso: '2026-10-04', chapter: 'Inequalities', category: 'Algebra' },
  { dayNum: 18, dateStr: '05 OCT 2026', dateIso: '2026-10-05', chapter: 'Algebraic Expressions + Identities', category: 'Algebra' },
  { dayNum: 19, dateStr: '06 OCT 2026', dateIso: '2026-10-06', chapter: 'Functions', category: 'Algebra' },
  { dayNum: 20, dateStr: '07 OCT 2026', dateIso: '2026-10-07', chapter: 'Logarithms', category: 'Algebra' },
  { dayNum: 21, dateStr: '08 OCT 2026', dateIso: '2026-10-08', chapter: 'Sequences + Progressions', category: 'Algebra' },
  { dayNum: 22, dateStr: '09 OCT 2026', dateIso: '2026-10-09', chapter: 'Algebra Mixed', category: 'Algebra' },
  { dayNum: 23, dateStr: '10 OCT 2026', dateIso: '2026-10-10', chapter: 'Algebra PYQ', category: 'Algebra' },
  { dayNum: 24, dateStr: '11 OCT 2026', dateIso: '2026-10-11', chapter: 'Timed Algebra Application', category: 'Algebra' },
  { dayNum: 25, dateStr: '12 OCT 2026', dateIso: '2026-10-12', chapter: 'Algebra Sectional + Repair', category: 'Algebra' },

  { dayNum: 26, dateStr: '13 OCT 2026', dateIso: '2026-10-13', chapter: 'Divisibility', category: 'Number System' },
  { dayNum: 27, dateStr: '14 OCT 2026', dateIso: '2026-10-14', chapter: 'Factors + Multiples + HCF/LCM', category: 'Number System' },
  { dayNum: 28, dateStr: '15 OCT 2026', dateIso: '2026-10-15', chapter: 'Remainders + Units Digit', category: 'Number System' },
  { dayNum: 29, dateStr: '16 OCT 2026', dateIso: '2026-10-16', chapter: 'Number System Mixed/PYQ', category: 'Number System' },

  { dayNum: 30, dateStr: '17 OCT 2026', dateIso: '2026-10-17', chapter: 'Lines + Angles', category: 'Geometry' },
  { dayNum: 31, dateStr: '18 OCT 2026', dateIso: '2026-10-18', chapter: 'Triangles', category: 'Geometry' },
  { dayNum: 32, dateStr: '19 OCT 2026', dateIso: '2026-10-19', chapter: 'Quadrilaterals + Polygons', category: 'Geometry' },
  { dayNum: 33, dateStr: '20 OCT 2026', dateIso: '2026-10-20', chapter: 'Circles', category: 'Geometry' },
  { dayNum: 34, dateStr: '21 OCT 2026', dateIso: '2026-10-21', chapter: 'Mensuration + Coordinate Geometry', category: 'Geometry' },

  { dayNum: 35, dateStr: '22 OCT 2026', dateIso: '2026-10-22', chapter: 'Set Theory + P&C Basics', category: 'Modern Math' },
  { dayNum: 36, dateStr: '23 OCT 2026', dateIso: '2026-10-23', chapter: 'Probability + Modern Math Mixed', category: 'Modern Math' },

  { dayNum: 37, dateStr: '24 OCT 2026', dateIso: '2026-10-24', chapter: 'Arithmetic PYQ', category: 'Revision/Repair' },
  { dayNum: 38, dateStr: '25 OCT 2026', dateIso: '2026-10-25', chapter: 'Algebra PYQ', category: 'Revision/Repair' },
  { dayNum: 39, dateStr: '26 OCT 2026', dateIso: '2026-10-26', chapter: 'Number System PYQ', category: 'Revision/Repair' },
  { dayNum: 40, dateStr: '27 OCT 2026', dateIso: '2026-10-27', chapter: 'Geometry PYQ', category: 'Revision/Repair' },
  { dayNum: 41, dateStr: '28 OCT 2026', dateIso: '2026-10-28', chapter: 'Arithmetic Weakness Repair', category: 'Revision/Repair' },
  { dayNum: 42, dateStr: '29 OCT 2026', dateIso: '2026-10-29', chapter: 'Algebra/Numbers Weakness Repair', category: 'Revision/Repair' },
  { dayNum: 43, dateStr: '30 OCT 2026', dateIso: '2026-10-30', chapter: 'QA Syllabus Gap Audit', category: 'Revision/Repair' },
  { dayNum: 44, dateStr: '31 OCT 2026', dateIso: '2026-10-31', chapter: 'QA Mixed Test + First-Pass Closure', category: 'Revision/Repair' },
]
