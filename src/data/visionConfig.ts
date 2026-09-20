export interface YearRoadmapItem {
  yearNum: number;
  yearRange: string;
  theme: string;
  identity: string;
  focus: string[];
  output: string;
  ruleOrLoop?: string;
  layer: 'BUILD + EXPLORE' | 'REGULATE + CONSOLIDATE + SCALE' | 'CLUTCH + IMPACT';
}

export interface PostCatCard {
  id: 'after_cat' | 'interview_prep' | 'mba_joining';
  title: string;
  subtitle: string;
  status: 'LOCKED_BEFORE_EXAM' | 'ACTIVE_POST_CAT';
  bullets: string[];
}

export const MASTER_VISION = {
  quote: 'BUILD THE MAN BEFORE BUILDING THE EMPIRE.',
  identity: 'A disciplined, highly capable, financially independent builder-leader who can learn fast, make good decisions under pressure, build businesses/products, lead people, and create meaningful impact without destroying health or character.',
  pillars: [
    { num: 1, name: 'CHARACTER', desc: 'Integrity, discipline, non-negotiable promises to oneself.' },
    { num: 2, name: 'HEALTH', desc: 'Physical energy, sleep, movement, mental clarity, non-negotiable health.' },
    { num: 3, name: 'KNOWLEDGE', desc: 'Deep business literacy, first-principles learning, mental models.' },
    { num: 4, name: 'CAPABILITY', desc: 'Execution, problem solving, decision quality, leadership under pressure.' },
    { num: 5, name: 'CREATION', desc: 'Building products, assets, customer value, revenue, and lasting impact.' },
    { num: 6, name: 'LEGACY & IMPACT', desc: 'Family pride, youth mentorship, nation building, and giving back.' }
  ],
  outcomeNote: 'Money and impact are outcomes, not identity.'
}

export const MASTER_LIFE_SEQUENCE = [
  { id: 'cat2026', label: 'CAT 2026', status: 'ACTIVE', desc: 'Current and ONLY mission until 29 November 2026.' },
  { id: 'mba', label: 'MBA / COLLEGE', status: 'LOCKED', desc: 'IIMs + Top B-Schools, Interviews, WAT, AWT.' },
  { id: 'biz_cap', label: 'BUSINESS CAPABILITY', status: 'LOCKED', desc: 'Learn strategy, marketing, finance, product.' },
  { id: 'build', label: 'BUILD', status: 'LOCKED', desc: 'Customer problem → Product → Validation → Revenue.' },
  { id: 'grow', label: 'GROW', status: 'LOCKED', desc: 'Team → Scale → Market expansion.' },
  { id: 'scale', label: 'SCALE', status: 'LOCKED', desc: 'Systems, operations, leadership.' },
  { id: 'impact', label: 'IMPACT', status: 'LOCKED', desc: 'Health, Wealth, Family & Legacy.' },
]

export const POST_CAT_ROADMAP: PostCatCard[] = [
  {
    id: 'after_cat',
    title: '1. IMMEDIATELY AFTER CAT',
    subtitle: 'Post-Exam Evaluation & Application Review',
    status: 'LOCKED_BEFORE_EXAM',
    bullets: [
      'Wait for result calmly — no panic',
      'Check/track official result when released',
      'Review score/section performance',
      'Prepare target-college/application list when relevant',
      'Begin Interview / WAT / AWT preparation when applicable'
    ]
  },
  {
    id: 'interview_prep',
    title: '2. INTERVIEW PREP PHASE',
    subtitle: 'WAT / GD / PI Execution',
    status: 'LOCKED_BEFORE_EXAM',
    bullets: [
      'General Awareness — Business + Economy',
      'Why MBA? & Why this college?',
      'Academic/background story',
      'Work experience / SOP narrative where applicable',
      'Communication practice',
      'Group Discussion practice where applicable'
    ]
  },
  {
    id: 'mba_joining',
    title: '3. MBA JOINING',
    subtitle: 'Campus Life & Ecosystem Building',
    status: 'LOCKED_BEFORE_EXAM',
    bullets: [
      'Evaluate college options using relevant factors',
      'Curriculum & Learning ecosystem',
      'Career opportunities & Network',
      'Entrepreneurship exposure',
      'Build network from Day 1',
      'Keep startup/business ideas in background'
    ]
  }
]

export const SEVEN_YEAR_ROADMAP: YearRoadmapItem[] = [
  {
    yearNum: 1,
    yearRange: '2026–27',
    theme: 'Crack CAT + Discipline',
    identity: 'Discipline + CAT → MBA Entry',
    focus: ['Discipline', 'CAT 2026', 'Communication', 'Basic Business Awareness', 'Health & Movement'],
    output: 'CAT attempt • MBA entry / next-best path • Strong routine • Communication improvement • Basic business literacy • Stable health',
    ruleOrLoop: 'Rule: Foundation first.',
    layer: 'BUILD + EXPLORE'
  },
  {
    yearNum: 2,
    yearRange: '2027–28',
    theme: 'MBA Entry + College Life',
    identity: 'MBA Foundation + Business Capability',
    focus: ['Finance', 'Marketing', 'Operations', 'Strategy', 'Data/Analytics', 'AI/Technology Literacy', 'Presentation & Networking'],
    output: 'Output: "I understand business."',
    layer: 'BUILD + EXPLORE'
  },
  {
    yearNum: 3,
    yearRange: '2028–29',
    theme: 'Learn Business Deeply',
    identity: 'MBA Mastery + Real-World Experiments',
    focus: ['Product', 'AI Workflows', 'Automation', 'Knowledge Assets', 'Small Business Experiments', 'Customer Problem Solving'],
    output: 'Output: "I can build, not only understand."',
    ruleOrLoop: 'Loop: LEARN → APPLY → PROJECT / INTERNSHIP → EXPERIMENT → FEEDBACK → IMPROVE',
    layer: 'BUILD + EXPLORE'
  },
  {
    yearNum: 4,
    yearRange: '2029–30',
    theme: 'Build MVP / Product',
    identity: 'Regulate + Consolidate + Serious Build',
    focus: ['Career Leverage', 'Specialization', 'Product/Business', 'Financial Discipline', 'Personal Systems', 'Decision Quality'],
    output: 'Highest leverage career positioning + consolidated capability.',
    ruleOrLoop: 'Question: "What creates the highest leverage?"',
    layer: 'REGULATE + CONSOLIDATE + SCALE'
  },
  {
    yearNum: 5,
    yearRange: '2030–31',
    theme: 'Grow Team + Revenue',
    identity: 'Asset / Product / Business Creation',
    focus: ['Product', 'Sales', 'Marketing', 'Distribution', 'Technology', 'Customer Understanding', 'Unit Economics', 'Systems'],
    output: 'One real asset/business/product with evidence of value.',
    ruleOrLoop: 'Flow: PROBLEM → PRODUCT → CUSTOMER → FEEDBACK → ITERATION → REVENUE',
    layer: 'REGULATE + CONSOLIDATE + SCALE'
  },
  {
    yearNum: 6,
    yearRange: '2031–32',
    theme: 'Scale + Expand',
    identity: 'Grow + Systemize + Lead',
    focus: ['Team', 'Delegation', 'Processes', 'Finance', 'Technology', 'Leadership', 'Scale Readiness'],
    output: 'Transition: I DO EVERYTHING → I BUILD SYSTEMS → SYSTEMS + PEOPLE EXECUTE',
    ruleOrLoop: 'Flow: GROW → SYSTEMIZE → LEAD',
    layer: 'REGULATE + CONSOLIDATE + SCALE'
  },
  {
    yearNum: 7,
    yearRange: '2032–33',
    theme: 'Health, Wealth, Family + Impact',
    identity: 'High Judgement + High Performance + Scale',
    focus: ['Strategic Decisions', 'Capital Allocation', 'High-Stakes Execution', 'Reputation', 'Mentorship', 'Lasting Impact'],
    output: 'Mastery • Renewal • New Challenges',
    ruleOrLoop: 'Know when to: PUSH • PAUSE • STOP • CHANGE • DELEGATE',
    layer: 'CLUTCH + IMPACT'
  }
]
