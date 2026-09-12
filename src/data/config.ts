import type { Phase, Block, MasteryTopic } from '@/types'

// ═══════════════════════════════════════════════════
//  CAT 2026 — Static Configuration
//  Single source of truth for all locked CAT data.
//  Migrated 1:1 from Stage 1 Config object.
// ═══════════════════════════════════════════════════

export const CAT_DATE = new Date('2026-11-29T09:00:00')

export const PHASES: Phase[] = [
  {
    id: 'P1', name: 'REBUILD', start: '2026-09-01', end: '2026-09-15',
    color: '#22C55E', purpose: 'Concept + Accuracy + Basic Speed',
    mission: 'Build accuracy before speed.',
    qa:   ['Percentages','Ratio & Proportion','Averages','Profit/Loss','TSD','Time & Work','SI/CI','Mixtures'],
    dilr: ['Tables','Bar Graphs','Line Graphs','Pie Charts','Linear Arrangements','Circular Arrangements'],
    varc: ['RC Main Idea','RC Inference','RC Tone','Para Summary','Para Jumble'],
    gate: ['Concept clear for each topic','Basic questions solved','Moderate questions solved','Mistakes classified C1–C5','Basic timed solving done'],
  },
  {
    id: 'P2', name: 'APPLICATION', start: '2026-09-16', end: '2026-10-04',
    color: '#3B82F6', purpose: 'Mixed Practice + Timed Solving + PYQs',
    mission: 'Apply concepts under time pressure.',
    qa:   ['Algebra','Geometry','Number System CAT-level','Modern Math'],
    dilr: ['Unfamiliar sets','Hybrid sets','Selection under time','Logic-heavy sets'],
    varc: ['Passage selection','Elimination mastery','Speed building','Difficult RC'],
    gate: ['Approach decided before solving','Solve + Verify habit','Better question selection','Accuracy improving under time'],
  },
  {
    id: 'P3', name: 'MOCK-DOMINATED', start: '2026-10-05', end: '2026-11-08',
    color: '#EF4444', purpose: 'Mocks + Deep Analysis + Weakness Repair',
    mission: 'Convert practice into mock performance.',
    qa:   ['Mixed CAT practice','High-return chapters','Speed + Selection'],
    dilr: ['Set selection strategy','4 sets per mock — pick 3','Abandonment discipline'],
    varc: ['3 passages/day','VA accuracy 90%+','Elimination speed'],
    gate: ['Mock performance improving','Mistakes → marks','Percentile trending up'],
  },
  {
    id: 'P4', name: 'CONSOLIDATION', start: '2026-11-09', end: '2026-11-20',
    color: '#8B5CF6', purpose: 'Mocks + PYQs + Revision + Strategy',
    mission: 'Lock strategy, consolidate strengths.',
    qa:   ['PYQs 2019–2024','Formula revision','High-return only'],
    dilr: ['Best-performing set types','PYQs DILR','Speed optimization'],
    varc: ['RC + VA strategy locked','Passage selection mastered','Accuracy stabilized'],
    gate: ['Exam strategy finalized','Section order locked','Accuracy stable'],
  },
  {
    id: 'P5', name: 'TAPER', start: '2026-11-21', end: '2026-11-28',
    color: '#F59E0B', purpose: 'Light Revision + Error Log + Exam Readiness',
    mission: 'Light revision. Trust the work. Stay fresh.',
    qa:   ['Formula flash revision only','30 min/day max'],
    dilr: ['2 sets max/day','Familiar types only'],
    varc: ['2 RC/day max','Strategy review only'],
    gate: ['Mind clear','Sleep 8 hrs/night','Exam-day checklist ready','Confidence based on evidence'],
  },
]

export const BLOCKS: Block[] = [
  { id:'QA',       seq:1, label:'QA',       name:'Ratio & Proportion',           color:'#16A34A', bg:'rgba(22,163,74,.15)',   time:'09:00–10:30', dur:'90 min',     target:'70%+ accuracy',
    tasks:['<strong>Topic:</strong> Ratio basics → part-to-part → proportional division','<strong>Task:</strong> 15–20 questions, Easy → Moderate','<strong>Exit:</strong> 70%+ accuracy on 15 questions'] },
  { id:'DILR',     seq:2, label:'DILR',     name:'Bar / Line Graph Set',          color:'#2563EB', bg:'rgba(37,99,235,.15)',   time:'10:45–12:00', dur:'75 min',     target:'1–2 quality sets',
    tasks:['<strong>Task:</strong> 1 quality Bar or Line Graph set (4–6 questions)','<strong>Rule:</strong> 2nd set ONLY if 1st fully analysed','<strong>Exit:</strong> 3+ correct with method explained'] },
  { id:'VARC',     seq:3, label:'VARC',     name:'Main Idea + Inference',         color:'#7C3AED', bg:'rgba(124,58,237,.15)',  time:'12:15–13:15', dur:'60 min',     target:'4/6 correct',
    tasks:['<strong>Task:</strong> 2 RC passages, 3 questions each','<strong>Flow:</strong> Read → Structure → Argument → Predict → Eliminate','<strong>Exit:</strong> 4+ correct across 6 questions'] },
  { id:'TEST',     seq:4, label:'TEST',     name:'Library Deep Work + Repair',    color:'#D97706', bg:'rgba(217,119,6,.15)',   time:'13:15–17:00', dur:'Deep Work',  target:'0 pending errors',
    tasks:['<strong>Task:</strong> Fix all logged C1–C5 errors','<strong>Rule:</strong> Error log material only — no random resources','<strong>Exit:</strong> Every logged error re-solved'] },
  { id:'ANALYSIS', seq:5, label:'ANALYSIS', name:'Error Log — Classify C1–C5',   color:'#DC2626', bg:'rgba(220,38,38,.15)',   time:'21:00–21:45', dur:'45 min',     target:'100% classified',
    tasks:['<strong>C1</strong>=Concept · <strong>C2</strong>=Calc · <strong>C3</strong>=Misread · <strong>C4</strong>=Approach · <strong>C5</strong>=Time','<strong>For each:</strong> Why → Correct method → Prevention rule','<strong>Exit:</strong> Every wrong Q classified + rule written'] },
  { id:'REVISION', seq:6, label:'REVISION', name:'Formula + Concept Recap',      color:'#7C3AED', bg:'rgba(124,58,237,.15)',  time:'21:45–22:00', dur:'15 min',     target:'Fluent recall',
    tasks:['<strong>30-sec recap:</strong> What did I learn today?','<strong>2-min:</strong> Formula → trap → today\'s biggest mistake','<strong>Preview:</strong> Tomorrow\'s first topic'] },
  { id:'REPAIR',   seq:7, label:'REPAIR',   name:'Re-solve Every Wrong Question', color:'#DB2777', bg:'rgba(219,39,119,.15)', time:'Library block', dur:'Ongoing',   target:'0 unresolved',
    tasks:['<strong>Source:</strong> Today\'s + previous error log','<strong>Method:</strong> Close solution → fresh attempt → verify','<strong>Exit:</strong> 100% of logged errors re-solved'] },
  { id:'RETEST',   seq:8, label:'RETEST',   name:'Confirm Mastery',              color:'#0E9F9F', bg:'rgba(14,159,159,.15)', time:'End of day',   dur:'5 questions', target:'3/5 minimum',
    tasks:['<strong>Task:</strong> 3–5 fresh questions on today\'s topics (no notes)','<strong>3+/5 correct</strong> = learning confirmed','<strong>Still wrong</strong> = C1, repair tomorrow morning'] },
]

export const MASTER_TOPICS: Record<'QA'|'DILR'|'VARC', Omit<MasteryTopic,'subject'|'currentLevel'|'evidence'|'attempts'|'correct'|'lastPracticed'|'lastTested'>[]> = {
  QA: [
    {id:'qa-pct', name:'Percentages',          tier:1},{id:'qa-rat', name:'Ratio & Proportion',  tier:1},
    {id:'qa-avg', name:'Averages',             tier:1},{id:'qa-pl',  name:'Profit / Loss',       tier:1},
    {id:'qa-tsd', name:'TSD',                  tier:1},{id:'qa-tw',  name:'Time & Work',         tier:1},
    {id:'qa-sici',name:'SI / CI',              tier:1},{id:'qa-mix', name:'Mixture / Alligation',tier:1},
    {id:'qa-leq', name:'Linear Equations',     tier:2},{id:'qa-qeq', name:'Quadratic Equations', tier:2},
    {id:'qa-ineq',name:'Inequalities',         tier:2},{id:'qa-prog',name:'Progressions',        tier:2},
    {id:'qa-log', name:'Logarithms',           tier:2},{id:'qa-geo', name:'Geometry',            tier:2},
    {id:'qa-ns',  name:'Number System',        tier:2},{id:'qa-pc',  name:'P&C / Probability',   tier:3},
  ],
  DILR: [
    {id:'dl-tbl', name:'Tables',               tier:1},{id:'dl-bar', name:'Bar Graphs',          tier:1},
    {id:'dl-line',name:'Line Graphs',           tier:1},{id:'dl-pie', name:'Pie Charts',          tier:1},
    {id:'dl-cas', name:'Caselets',              tier:1},{id:'dl-lin', name:'Linear Arrangement',  tier:1},
    {id:'dl-cir', name:'Circular Arrangement',  tier:1},{id:'dl-dist',name:'Distribution',        tier:1},
    {id:'dl-sel', name:'Selection',             tier:1},{id:'dl-rank',name:'Ranking / Order',     tier:2},
    {id:'dl-game',name:'Games / Tournaments',   tier:2},{id:'dl-net', name:'Networks',            tier:2},
    {id:'dl-hyb', name:'Hybrid Sets',           tier:2},
  ],
  VARC: [
    {id:'vc-mi',  name:'RC Main Idea',          tier:1},{id:'vc-arg', name:'RC Central Argument', tier:1},
    {id:'vc-inf', name:'RC Inference',           tier:1},{id:'vc-tone',name:'RC Tone',             tier:1},
    {id:'vc-elim',name:'RC Elimination',         tier:1},{id:'vc-sum', name:'VA Para Summary',     tier:1},
    {id:'vc-jum', name:'VA Para Jumble',         tier:1},{id:'vc-comp',name:'VA Para Completion',  tier:2},
    {id:'vc-odd', name:'VA Odd One Out',         tier:2},
  ],
}

export const SCHEDULE_ITEMS = [
  {time:'05:00–05:15', block:'Morning Reset',            icon:'🌅', col:'#F5A623', detail:'Water · Stretch · No phone · Read mission'},
  {time:'05:15–05:55', block:'Daily Dose',               icon:'⚡', col:'#F59E0B', detail:'QA test (10 Q) + RC test (1 passage) · Mark mistakes immediately'},
  {time:'09:00–10:30', block:'QA Session',               icon:'📐', col:'#16A34A', detail:'Concept 10 min → 15–20 quality Qs · Easy → Moderate · Accuracy first'},
  {time:'10:45–12:00', block:'DILR Session',             icon:'🧩', col:'#2563EB', detail:'1 quality set · 2nd only if 1st fully analysed · 20-25 min per set'},
  {time:'12:15–13:15', block:'VARC Session',             icon:'📖', col:'#7C3AED', detail:'2 RC passages · Main Idea + Inference + Tone · Elimination focus'},
  {time:'13:15–17:00', block:'Library Deep Work',        icon:'🏛️', col:'#3B82F6', detail:'Pending QA/DILR/VARC · Wrong Qs · Repair work · No random resources'},
  {time:'17:30–19:00', block:'Coaching',                 icon:'🎓', col:'#8B5CF6', detail:'Attend coaching · Notes · Mark doubts immediately'},
  {time:'19:20–20:20', block:'Gym / Movement',           icon:'💪', col:'#22C55E', detail:'Non-negotiable physical movement · Brain needs blood flow'},
  {time:'20:30–21:00', block:'Dinner',                   icon:'🍽️', col:'#94A3B8', detail:'Eat well · No screens'},
  {time:'21:00–21:45', block:'Test Analysis + Error Log',icon:'🔍', col:'#EF4444', detail:'Every mistake → C1–C5 → Why → Fix → Repair → Retest'},
  {time:'21:45–22:00', block:'Revision',                 icon:'🔄', col:'#7C3AED', detail:'Formulas · DILR frameworks · RC strategy · Today\'s error recap'},
  {time:'22:00',       block:'Sleep',                    icon:'😴', col:'#0E9F9F', detail:'8 hours minimum · No screens after 22:00'},
]

export const WEEK_PLAN_TEMPLATE = [
  {dayName:'MON', focus:'BASICS',   fCol:'#22C55E', qa:'Percentage basics + 15 Q',        dilr:'Tables set',             varc:'2 RC — Main Idea',      eve:'Error review 20 min'},
  {dayName:'TUE', focus:'SOLVING',  fCol:'#F5A623', qa:'Ratio & Proportion + 15–20 Q',    dilr:'Bar/Line Graph',         varc:'Main Idea + Inference', eve:'Repair previous errors'},
  {dayName:'WED', focus:'ACCURACY', fCol:'#3B82F6', qa:'Averages + 15–20 Q',              dilr:'Arrangement set',        varc:'Tone / Purpose',        eve:'Timed mini test 30 min'},
  {dayName:'THU', focus:'ANALYSIS', fCol:'#EF4444', qa:'P&L + 15–20 Q',                   dilr:'Distribution/Selection', varc:'Elimination',           eve:'Repair + Retest 30 min'},
  {dayName:'FRI', focus:'TIMING',   fCol:'#F59E0B', qa:'Mixed Arithmetic + 15–20 Q',      dilr:'Mixed set',              varc:'Difficult RC',          eve:'Timed Practice 40 min'},
  {dayName:'SAT', focus:'IMPROVE',  fCol:'#8B5CF6', qa:'Weak-topic repair + 10–15 Q',     dilr:'Best 2 set types',       varc:'Mixed RC + VA',         eve:'Repair Sprint 45 min'},
  {dayName:'SUN', focus:'TEST DAY', fCol:'#A78BFA', qa:'Weekly Mock',                      dilr:'Full Sectional',         varc:'Full Analysis',         eve:'Weekly Review + C1–C5', isTest:true},
]

export const WEEK_EXIT_GATE = [
  'Concept clear for each topic covered this week',
  '2 DILR quality sets/day attempted + fully analysed',
  '70%+ accuracy on RC Main Idea + Inference questions',
  'Error log with C1–C5 for every wrong question every day',
  'Sunday sectional/mock completed + fully analysed',
]
