// ═══════════════════════════════════════════════════
//  CAT 2026 — Domain Types (migrated from Stage 1)
// ═══════════════════════════════════════════════════

// ── Phase ───────────────────────────────────────────
export interface Phase {
  id: 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
  name: string;
  start: string;       // ISO date string YYYY-MM-DD
  end: string;
  color: string;
  purpose: string;
  mission: string;
  qa: string[];
  dilr: string[];
  varc: string[];
  gate: string[];
}

// ── Block (daily study sequence item) ───────────────
export type BlockId = 'QA' | 'DILR' | 'VARC' | 'TEST' | 'ANALYSIS' | 'REVISION' | 'REPAIR' | 'RETEST';

export interface Block {
  id: BlockId;
  seq: number;
  label: string;
  name: string;
  color: string;
  bg: string;
  time: string;
  dur: string;
  target: string;
  tasks: string[];
}

// ── Task (daily execution record, stored in IndexedDB) ─
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'SKIPPED';

export interface Task {
  id: string;              // `${date}_${blockId}`
  date: string;            // YYYY-MM-DD
  blockId: BlockId;
  subject: string;         // QA | DILR | VARC | …
  title: string;
  status: TaskStatus;
  startedAt: string | null;
  completedAt: string | null;
  timeSpentMin: number | null;
  notes: string;
}

// ── Error record ─────────────────────────────────────
export type ErrorType = 'C1' | 'C2' | 'C3' | 'C4' | 'C5';
export type RepairStatus = 'PENDING' | 'DONE';
export type RetestStatus = 'PENDING' | 'PASSED' | 'FAILED';

export interface ErrorRecord {
  id: string;
  errorType: ErrorType;
  subject: string;
  topicId: string | null;   // links to MasteryTopic.id — lets Retest actually update mastery evidence
  topic: string;            // display name
  wrongReason: string;
  correctMethod: string;
  preventionRule: string;
  repairStatus: RepairStatus;
  retestStatus: RetestStatus;
  createdAt: string;
  repairedAt: string | null;
  retestedAt: string | null;
}

// ── Mastery topic ─────────────────────────────────────
export type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface MasteryEvidence {
  date: string;
  level: MasteryLevel;
  description: string;
}

export interface MasteryTopic {
  id: string;
  subject: 'QA' | 'DILR' | 'VARC';
  name: string;
  tier: 1 | 2 | 3;
  currentLevel: MasteryLevel;
  evidence: MasteryEvidence[];
  attempts: number;
  correct: number;
  lastPracticed: string | null;
  lastTested: string | null;
}

// ── Mock ─────────────────────────────────────────────
export interface MockAnalysis {
  total: number;
  att: number;
  overall: number;
  qaAcc: number;
  dlAcc: number;
  vcAcc: number;
  weak: string[];
  qa: number;
  dilr: number;
  varc: number;
  qaat: number;
  dlat: number;
  vcat: number;
}

export interface MockRecord extends MockAnalysis {
  id: string;
  name: string;
  date: string;
  createdAt: string;
}

// ── Daily Score (DONE log) ───────────────────────────
export interface DailyScore {
  date: string;          // YYYY-MM-DD (primary key)
  studyHrs: number;
  screenHrs: number;
  accuracyPct: number;
  loggedAt: string;
}

// ── Settings ─────────────────────────────────────────
export interface Settings {
  key: string;
  value: boolean | string | number;
}

// ── Week plan day ─────────────────────────────────────
export interface WeekDay {
  dayName: string;
  date: string;
  focus: string;
  fCol: string;
  qa: string;
  dilr: string;
  varc: string;
  eve: string;
  isToday: boolean;
  isPast: boolean;
  isTest?: boolean;
}

// ── Formula/revision card spaced-repetition state ─────
export interface FormulaReview {
  cardId: string;          // matches FormulaCard.id
  boxLevel: number;        // 1 = review soon, higher = longer interval
  nextReviewDate: string;  // YYYY-MM-DD, local date
  lastRating: 'Hard' | 'Medium' | 'Easy' | null;
  reviewCount: number;
}

// ── Quick stats aggregate ─────────────────────────────
export interface QuickStats {
  blocksDone: number;
  totalErrors: number;
  mocksLogged: number;
  lastAccuracy: number | null;
  repairPending: number;
  retestPending: number;
}
