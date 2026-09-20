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

export const MASTER_VISION = {
  quote: 'BUILD THE MAN BEFORE BUILDING THE EMPIRE.',
  identity: 'A disciplined, highly capable, financially independent builder-leader who can learn fast, make good decisions under pressure, build businesses/products, lead people, and create meaningful impact without destroying health or character.',
  pillars: [
    { num: 1, name: 'CHARACTER', desc: 'Integrity, discipline, non-negotiable promises to oneself.' },
    { num: 2, name: 'HEALTH', desc: 'Physical energy, sleep, movement, mental clarity, non-negotiable health.' },
    { num: 3, name: 'KNOWLEDGE', desc: 'Deep business literacy, first-principles learning, mental models.' },
    { num: 4, name: 'CAPABILITY', desc: 'Execution, problem solving, decision quality, leadership under pressure.' },
    { num: 5, name: 'CREATION', desc: 'Building products, assets, customer value, revenue, and lasting impact.' }
  ],
  outcomeNote: 'Money and impact are outcomes, not identity.'
}

export const SEVEN_YEAR_ROADMAP: YearRoadmapItem[] = [
  {
    yearNum: 1,
    yearRange: '2026–27',
    theme: 'FOUNDATION',
    identity: 'Discipline + CAT → MBA Entry',
    focus: ['Discipline', 'CAT 2026', 'Communication', 'Basic Business Awareness', 'Health & Movement'],
    output: 'CAT attempt • MBA entry / next-best path • Strong routine • Communication improvement • Basic business literacy • Stable health',
    ruleOrLoop: 'Rule: Foundation first.',
    layer: 'BUILD + EXPLORE'
  },
  {
    yearNum: 2,
    yearRange: '2027–28',
    theme: 'CAPABILITY',
    identity: 'MBA Foundation + Business Capability',
    focus: ['Finance', 'Marketing', 'Operations', 'Strategy', 'Data/Analytics', 'AI/Technology Literacy', 'Presentation & Networking'],
    output: 'Output: "I understand business."',
    layer: 'BUILD + EXPLORE'
  },
  {
    yearNum: 3,
    yearRange: '2028–29',
    theme: 'EXPERIMENT',
    identity: 'MBA Mastery + Real-World Experiments',
    focus: ['Product', 'AI Workflows', 'Automation', 'Knowledge Assets', 'Small Business Experiments', 'Customer Problem Solving'],
    output: 'Output: "I can build, not only understand."',
    ruleOrLoop: 'Loop: LEARN → APPLY → PROJECT / INTERNSHIP → EXPERIMENT → FEEDBACK → IMPROVE',
    layer: 'BUILD + EXPLORE'
  },
  {
    yearNum: 4,
    yearRange: '2029–30',
    theme: 'LEVERAGE',
    identity: 'Regulate + Consolidate + Serious Build',
    focus: ['Career Leverage', 'Specialization', 'Product/Business', 'Financial Discipline', 'Personal Systems', 'Decision Quality'],
    output: 'Highest leverage career positioning + consolidated capability.',
    ruleOrLoop: 'Question: "What creates the highest leverage?"',
    layer: 'REGULATE + CONSOLIDATE + SCALE'
  },
  {
    yearNum: 5,
    yearRange: '2030–31',
    theme: 'BUILD',
    identity: 'Asset / Product / Business Creation',
    focus: ['Product', 'Sales', 'Marketing', 'Distribution', 'Technology', 'Customer Understanding', 'Unit Economics', 'Systems'],
    output: 'One real asset/business/product with evidence of value.',
    ruleOrLoop: 'Flow: PROBLEM → PRODUCT → CUSTOMER → FEEDBACK → ITERATION → REVENUE',
    layer: 'REGULATE + CONSOLIDATE + SCALE'
  },
  {
    yearNum: 6,
    yearRange: '2031–32',
    theme: 'SCALE',
    identity: 'Grow + Systemize + Lead',
    focus: ['Team', 'Delegation', 'Processes', 'Finance', 'Technology', 'Leadership', 'Scale Readiness'],
    output: 'Transition: I DO EVERYTHING → I BUILD SYSTEMS → SYSTEMS + PEOPLE EXECUTE',
    ruleOrLoop: 'Flow: GROW → SYSTEMIZE → LEAD',
    layer: 'REGULATE + CONSOLIDATE + SCALE'
  },
  {
    yearNum: 7,
    yearRange: '2032–33',
    theme: 'CLUTCH + IMPACT',
    identity: 'High Judgement + High Performance + Scale',
    focus: ['Strategic Decisions', 'Capital Allocation', 'High-Stakes Execution', 'Reputation', 'Mentorship', 'Lasting Impact'],
    output: 'Mastery • Renewal • New Challenges',
    ruleOrLoop: 'Know when to: PUSH • PAUSE • STOP • CHANGE • DELEGATE',
    layer: 'CLUTCH + IMPACT'
  }
]
