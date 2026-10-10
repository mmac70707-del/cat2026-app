import { useEffect, useState } from 'react'
import { AppIcon } from '@/components/AppIcon'

type Lesson = {
  day: number
  title: string
  paragraph: string
  takeaway: string
  visual: string[]
}

const LESSONS: Lesson[] = [
  {
    "day": 1,
    "title": "A Business Is a Problem-Solving Machine",
    "paragraph": "A business creates value by solving a real problem repeatedly and earning enough to keep delivering the solution. Trace the system: problem → solution → value → customer → money → scale. Founder view: name the problem before you name the company.",
    "takeaway": "PROBLEM → SOLUTION → VALUE → MONEY → SCALE",
    "visual": [
      "PROBLEM",
      "SOLUTION",
      "VALUE",
      "MONEY",
      "SCALE"
    ]
  },
  {
    "day": 2,
    "title": "Find the Pain Before Building",
    "paragraph": "Look for a problem that is frequent, costly, frustrating, or urgent. Observe what people do today, what it costs them, and why the current fix is unsatisfying; only then consider a product. Founder view: collect evidence before falling in love with an idea. Connection: this builds on Day 1 — A Business Is a Problem-Solving Machine.",
    "takeaway": "OBSERVE PAIN BEFORE BUILDING",
    "visual": [
      "OBSERVE",
      "PAIN",
      "CURRENT FIX",
      "EVIDENCE"
    ]
  },
  {
    "day": 3,
    "title": "User, Buyer, and Decision-Maker",
    "paragraph": "The user experiences the product, the buyer pays, and the decision-maker approves; sometimes one person fills all three roles, sometimes not. A school tool may be used by students, paid for by parents, and approved by a school. Founder view: design and sell to the right people. Connection: this builds on Day 2 — Find the Pain Before Building.",
    "takeaway": "USER ≠ BUYER ≠ DECIDER",
    "visual": [
      "USER",
      "BUYER",
      "DECIDER",
      "VALUE"
    ]
  },
  {
    "day": 4,
    "title": "Map the Customer’s Real Alternatives",
    "paragraph": "Competition includes other products, manual work, doing nothing, or tolerating the problem. Customers switch only when your option is meaningfully better on an outcome they care about. Founder view: ask what the customer would do if your product vanished tomorrow. Connection: this builds on Day 3 — User, Buyer, and Decision-Maker.",
    "takeaway": "THE REAL COMPETITOR IS THE BEST ALTERNATIVE",
    "visual": [
      "PROBLEM",
      "ALTERNATIVES",
      "TRADE-OFF",
      "CHOICE"
    ]
  },
  {
    "day": 5,
    "title": "Build a Clear Value Proposition",
    "paragraph": "A value proposition states who you help, what important outcome improves, and why your approach is better than the alternatives. “Save a busy shopkeeper time on stock counting” is clearer than “smart AI platform.” Founder view: make the benefit testable in one sentence. Connection: this builds on Day 4 — Map the Customer’s Real Alternatives.",
    "takeaway": "WHO + OUTCOME + DIFFERENCE",
    "visual": [
      "CUSTOMER",
      "OUTCOME",
      "DIFFERENCE",
      "PROOF"
    ]
  },
  {
    "day": 6,
    "title": "Revenue: How the Business Gets Paid",
    "paragraph": "Revenue is money received from customers; the key is who pays, what they pay for, how often, and why they continue. Businesses may charge once, subscribe, take a commission, license, or combine models. Founder view: draw the money path from customer to company. Connection: this builds on Day 5 — Build a Clear Value Proposition.",
    "takeaway": "ALWAYS FOLLOW THE MONEY",
    "visual": [
      "CUSTOMER",
      "OFFER",
      "PRICE",
      "PAYMENT",
      "REPEAT"
    ]
  },
  {
    "day": 7,
    "title": "Choose the Right Business Model",
    "paragraph": "A business model connects the customer, value delivered, delivery system, revenue, and costs. A subscription fits recurring value; a marketplace may earn a transaction fee; a service may charge per project. Founder view: choose a model that fits how value is created and consumed. Connection: this builds on Day 6 — Revenue: How the Business Gets Paid.",
    "takeaway": "VALUE DELIVERY MUST MATCH HOW YOU EARN",
    "visual": [
      "CUSTOMER",
      "VALUE",
      "DELIVERY",
      "REVENUE",
      "COST"
    ]
  },
  {
    "day": 8,
    "title": "Pricing Is a Strategic Choice",
    "paragraph": "Price affects demand, positioning, margin, and who sees the offer as credible. Cost gives a floor, alternatives provide context, and customer value helps set the ceiling. Founder view: do not copy a rival’s price without knowing your own costs and customer outcome. Connection: this builds on Day 7 — Choose the Right Business Model.",
    "takeaway": "PRICE = VALUE SIGNAL + ECONOMIC CHOICE",
    "visual": [
      "COST",
      "ALTERNATIVES",
      "VALUE",
      "PRICE"
    ]
  },
  {
    "day": 9,
    "title": "Test Willingness to Pay",
    "paragraph": "Compliments are weak evidence; a real commitment, paid pilot, deposit, or repeat purchase is stronger. Ask about the customer’s budget, current spending, urgency, and approval process. Founder view: test a specific offer with a real price before scaling. Connection: this builds on Day 8 — Pricing Is a Strategic Choice.",
    "takeaway": "PAYMENT BEHAVIOUR BEATS POLITE PRAISE",
    "visual": [
      "INTEREST",
      "OFFER",
      "PRICE",
      "COMMITMENT"
    ]
  },
  {
    "day": 10,
    "title": "Unit Economics: One Customer at a Time",
    "paragraph": "Unit economics asks whether one customer, order, or subscription can make economic sense. Compare revenue per unit with the direct costs to acquire and serve it, then include how often customers return. Founder view: understand one healthy unit before multiplying it. Connection: this builds on Day 9 — Test Willingness to Pay.",
    "takeaway": "MAKE ONE UNIT WORK BEFORE SCALING",
    "visual": [
      "REVENUE",
      "DIRECT COST",
      "CUSTOMER",
      "REPEAT"
    ]
  },
  {
    "day": 11,
    "title": "Contribution Margin: What Each Sale Leaves",
    "paragraph": "Contribution margin is revenue minus variable costs; it shows how much each sale contributes toward fixed costs and profit. If a ₹500 order costs ₹320 to fulfil, ₹180 remains before fixed overhead. Founder view: improve price, mix, or variable cost without harming customer value. Connection: this builds on Day 10 — Unit Economics: One Customer at a Time.",
    "takeaway": "REVENUE − VARIABLE COST = CONTRIBUTION",
    "visual": [
      "REVENUE",
      "VARIABLE COST",
      "CONTRIBUTION",
      "FIXED COST"
    ]
  },
  {
    "day": 12,
    "title": "Customer Acquisition Cost (CAC)",
    "paragraph": "CAC is the cost of winning a new customer across the relevant sales and marketing effort. Compare it with contribution and the time needed to recover that cost; cheap leads are not useful if they never buy. Founder view: scale only channels that acquire the right customers economically. Connection: this builds on Day 11 — Contribution Margin: What Each Sale Leaves.",
    "takeaway": "ACQUISITION COST MUST FIT THE VALUE CREATED",
    "visual": [
      "SPEND",
      "LEADS",
      "CUSTOMERS",
      "CAC",
      "PAYBACK"
    ]
  },
  {
    "day": 13,
    "title": "Retention and Lifetime Value",
    "paragraph": "Retention measures whether customers continue using or buying; lifetime value estimates the value earned over the relationship. Repeat purchase, renewal, and expansion can make a customer more valuable, but estimates need real cohort evidence. Founder view: improve the reason customers stay, not just the signup count. Connection: this builds on Day 12 — Customer Acquisition Cost (CAC).",
    "takeaway": "KEEPING THE RIGHT CUSTOMER CAN COMPOUND VALUE",
    "visual": [
      "FIRST USE",
      "VALUE",
      "REPEAT",
      "LTV"
    ]
  },
  {
    "day": 14,
    "title": "Churn: Why Customers Leave",
    "paragraph": "Churn is the loss of customers or recurring revenue over a period. Segment exits by reason—poor fit, weak onboarding, price, reliability, or a better alternative—then test the largest driver. Founder view: interview lost customers instead of guessing why they left. Connection: this builds on Day 13 — Retention and Lifetime Value.",
    "takeaway": "EVERY EXIT IS A CLUE, NOT JUST A NUMBER",
    "visual": [
      "JOIN",
      "EXPERIENCE",
      "FRICTION",
      "EXIT"
    ]
  },
  {
    "day": 15,
    "title": "Cash Flow: Survival Before Scale",
    "paragraph": "Profit and cash are different: sales may be recorded before payment arrives, while salaries and suppliers still need cash now. Forecast timing of money in and out to see runway and upcoming shortfalls. Founder view: protect enough cash to survive a bad month and keep learning. Connection: this builds on Day 14 — Churn: Why Customers Leave.",
    "takeaway": "PROFIT TELLS A STORY; CASH BUYS TIME",
    "visual": [
      "MONEY IN",
      "TIMING",
      "MONEY OUT",
      "RUNWAY"
    ]
  },
  {
    "day": 16,
    "title": "Working Capital: Money Trapped in the Cycle",
    "paragraph": "Working capital is affected by inventory, customer payment delays, and supplier terms. Growth can consume cash when you pay suppliers before customers pay you. Founder view: shorten the cash cycle without damaging service or trust. Connection: this builds on Day 15 — Cash Flow: Survival Before Scale.",
    "takeaway": "GROWTH CAN USE CASH BEFORE IT CREATES CASH",
    "visual": [
      "INVENTORY",
      "SELL",
      "COLLECT",
      "PAY"
    ]
  },
  {
    "day": 17,
    "title": "Profit & Loss: Is the Model Working?",
    "paragraph": "A P&L shows revenue, expenses, and profit over a period. Read it by asking what changed, why it changed, and whether the change is repeatable; revenue growth alone can hide worsening costs. Founder view: investigate the driver behind each major movement. Connection: this builds on Day 16 — Working Capital: Money Trapped in the Cycle.",
    "takeaway": "REVENUE − EXPENSES = PROFIT OR LOSS",
    "visual": [
      "REVENUE",
      "COSTS",
      "OPERATING RESULT",
      "LEARNING"
    ]
  },
  {
    "day": 18,
    "title": "Balance Sheet: What the Business Owns and Owes",
    "paragraph": "A balance sheet snapshots assets, liabilities, and owners’ equity. It reveals resources, obligations, debt, and where cash may be tied up; it complements the P&L rather than replacing it. Founder view: check whether growth is being financed safely. Connection: this builds on Day 17 — Profit & Loss: Is the Model Working?.",
    "takeaway": "ASSETS = LIABILITIES + EQUITY",
    "visual": [
      "ASSETS",
      "LIABILITIES",
      "EQUITY",
      "RESILIENCE"
    ]
  },
  {
    "day": 19,
    "title": "Break-Even: When the Model Covers Itself",
    "paragraph": "Break-even occurs when total contribution covers fixed costs. The required volume depends on fixed cost and contribution per unit, so a price cut can increase the number of sales needed. Founder view: calculate the target before committing to rent, staff, or equipment. Connection: this builds on Day 18 — Balance Sheet: What the Business Owns and Owes.",
    "takeaway": "BREAK-EVEN VOLUME = FIXED COST ÷ CONTRIBUTION PER UNIT",
    "visual": [
      "FIXED COST",
      "CONTRIBUTION",
      "VOLUME",
      "BREAK-EVEN"
    ]
  },
  {
    "day": 20,
    "title": "Capital Allocation: Where the Next Rupee Goes",
    "paragraph": "Capital allocation decides which project, hire, channel, or capability deserves limited money and attention. Compare expected impact, evidence, downside, time to learn, and what you must stop funding. Founder view: choose the highest-value use of the next rupee—not the loudest idea. Connection: this builds on Day 19 — Break-Even: When the Model Covers Itself.",
    "takeaway": "FUND PRIORITIES; STOP FUNDING DISTRACTIONS",
    "visual": [
      "OPTIONS",
      "EVIDENCE",
      "TRADE-OFF",
      "INVEST"
    ]
  },
  {
    "day": 21,
    "title": "Market Size: How Big Is the Opportunity?",
    "paragraph": "A market estimate starts with a defined customer and buying situation, not a giant industry headline. Estimate how many relevant buyers exist and how much they plausibly spend. Founder view: make assumptions visible so the estimate can be challenged. Connection: this builds on Day 20 — Capital Allocation: Where the Next Rupee Goes.",
    "takeaway": "DEFINE THE BUYER BEFORE COUNTING THE MARKET",
    "visual": [
      "BUYER",
      "COUNT",
      "SPEND",
      "OPPORTUNITY"
    ]
  },
  {
    "day": 22,
    "title": "TAM, SAM, and SOM",
    "paragraph": "TAM is the broad total market, SAM is the portion your offer can serve, and SOM is the share you can realistically win. The narrowing assumptions matter more than impressive top-line numbers. Founder view: show the reachable wedge and the evidence for it. Connection: this builds on Day 21 — Market Size: How Big Is the Opportunity?.",
    "takeaway": "BIG MARKET → SERVABLE MARKET → WINNABLE SHARE",
    "visual": [
      "TAM",
      "SAM",
      "SOM",
      "EVIDENCE"
    ]
  },
  {
    "day": 23,
    "title": "Market Timing: Why Now?",
    "paragraph": "A good idea can fail if customers, technology, regulation, or distribution are not ready. Look for changed behaviour, new enabling technology, falling costs, or a new constraint that makes adoption timely. Founder view: identify the signal that says “now,” not merely “someday.” Connection: this builds on Day 22 — TAM, SAM, and SOM.",
    "takeaway": "OPPORTUNITY = NEED × READINESS × TIMING",
    "visual": [
      "NEED",
      "CHANGE",
      "READINESS",
      "NOW"
    ]
  },
  {
    "day": 24,
    "title": "Competition: Understand the Full Field",
    "paragraph": "Map direct rivals, substitutes, internal workarounds, and the option to do nothing. Compare the customer outcome, price, trust, convenience, and switching effort rather than counting competitors. Founder view: choose a specific customer segment where you can win on something that matters. Connection: this builds on Day 23 — Market Timing: Why Now?.",
    "takeaway": "MAP SUBSTITUTES, NOT JUST SIMILAR PRODUCTS",
    "visual": [
      "DIRECT RIVALS",
      "SUBSTITUTES",
      "STATUS QUO",
      "GAP"
    ]
  },
  {
    "day": 25,
    "title": "Positioning: Own a Clear Place in the Customer’s Mind",
    "paragraph": "Positioning explains who the offer is for, the category it belongs to, the main benefit, and why it is credible. If every message targets everyone, customers cannot quickly understand when to choose you. Founder view: choose one clear promise for one valuable segment. Connection: this builds on Day 24 — Competition: Understand the Full Field.",
    "takeaway": "BE CLEAR ABOUT WHO YOU SERVE AND WHY YOU WIN",
    "visual": [
      "SEGMENT",
      "CATEGORY",
      "PROMISE",
      "PROOF"
    ]
  },
  {
    "day": 26,
    "title": "Moats: What Gets Harder to Copy?",
    "paragraph": "A feature can be copied; a durable advantage may come from trust, switching costs, network effects, distribution, data, scale, or a capability that improves with use. A moat must help customers or economics, not just sound impressive. Founder view: ask what becomes stronger after every successful customer. Connection: this builds on Day 25 — Positioning: Own a Clear Place in the Customer’s Mind.",
    "takeaway": "BUILD AN ADVANTAGE THAT COMPOUNDS",
    "visual": [
      "FEATURE",
      "ADVANTAGE",
      "REPEAT",
      "MOAT"
    ]
  },
  {
    "day": 27,
    "title": "Product Discovery: Learn Before You Build",
    "paragraph": "Product discovery tests whether a real user has a meaningful problem and whether a proposed solution could help. Observe behaviour, interview without leading questions, inspect workarounds, and look for repeated evidence. Founder view: write the riskiest assumption before drawing screens. Connection: this builds on Day 26 — Moats: What Gets Harder to Copy?.",
    "takeaway": "OBSERVE → HYPOTHESIZE → VALIDATE",
    "visual": [
      "OBSERVE",
      "PAIN",
      "HYPOTHESIS",
      "EVIDENCE"
    ]
  },
  {
    "day": 28,
    "title": "MVP: The Smallest Test of Real Value",
    "paragraph": "An MVP is the smallest credible way to test a key assumption, not a low-quality version of the whole product. A manual service, clickable prototype, or limited pilot can reveal whether customers care before heavy investment. Founder view: remove everything that does not test the main risk. Connection: this builds on Day 27 — Product Discovery: Learn Before You Build.",
    "takeaway": "SMALLEST TEST THAT CAN CHANGE A DECISION",
    "visual": [
      "RISK",
      "SMALL TEST",
      "USER RESULT",
      "DECISION"
    ]
  },
  {
    "day": 29,
    "title": "Metrics: Measure Outcomes, Not Vanity",
    "paragraph": "A metric is useful when it connects an action to a customer or business outcome. Views and downloads may look impressive while activation, retention, or contribution stays weak. Founder view: choose one primary outcome and a few guardrails that prevent gaming it. Connection: this builds on Day 28 — MVP: The Smallest Test of Real Value.",
    "takeaway": "MEASURE THE RESULT, NOT THE APPLAUSE",
    "visual": [
      "INPUT",
      "BEHAVIOUR",
      "OUTCOME",
      "GUARDRAIL"
    ]
  },
  {
    "day": 30,
    "title": "Experimentation: Learn With Evidence",
    "paragraph": "A useful experiment states a hypothesis, changes one meaningful factor, defines a success measure, and sets a decision rule before results arrive. Small, honest tests reduce debate driven by opinion. Founder view: decide in advance what result would make you continue, change, or stop. Connection: this builds on Day 29 — Metrics: Measure Outcomes, Not Vanity.",
    "takeaway": "HYPOTHESIS → TEST → EVIDENCE → DECISION",
    "visual": [
      "HYPOTHESIS",
      "TEST",
      "RESULT",
      "DECISION"
    ]
  },
  {
    "day": 31,
    "title": "Distribution: How Customers Find You",
    "paragraph": "Distribution is the repeatable path through which the right customer discovers, trusts, buys, and receives the offer. A strong product without a reliable channel can remain invisible. Founder view: test one channel with measurable economics before spreading effort everywhere. Connection: this builds on Day 30 — Experimentation: Learn With Evidence.",
    "takeaway": "A PRODUCT NEEDS A RELIABLE PATH TO CUSTOMERS",
    "visual": [
      "DISCOVER",
      "TRUST",
      "BUY",
      "DELIVER"
    ]
  },
  {
    "day": 32,
    "title": "Marketing Funnel: Turn Attention Into Action",
    "paragraph": "A funnel tracks stages such as awareness, interest, consideration, purchase, and retention. Measure conversion and drop-off at each stage to find where people lose confidence or face friction. Founder view: improve the biggest verified leak before buying more traffic. Connection: this builds on Day 31 — Distribution: How Customers Find You.",
    "takeaway": "FIND THE BIGGEST DROP-OFF FIRST",
    "visual": [
      "AWARENESS",
      "INTEREST",
      "PURCHASE",
      "RETENTION"
    ]
  },
  {
    "day": 33,
    "title": "Sales: Diagnose Before You Pitch",
    "paragraph": "Good selling uncovers the customer’s situation, cost of the problem, decision process, alternatives, and success criteria before recommending a solution. A pitch that ignores these facts creates resistance. Founder view: ask questions that help the customer decide, not pressure them to agree. Connection: this builds on Day 32 — Marketing Funnel: Turn Attention Into Action.",
    "takeaway": "DIAGNOSE → FIT → PROOF → COMMITMENT",
    "visual": [
      "DISCOVER",
      "DIAGNOSE",
      "PROVE",
      "AGREE"
    ]
  },
  {
    "day": 34,
    "title": "Brand and Trust: Reduce Customer Risk",
    "paragraph": "Brand is the expectation people form from repeated experiences, not only a logo or slogan. Reliability, clear promises, fair handling of problems, and credible proof reduce perceived risk. Founder view: make the promise you can consistently keep. Connection: this builds on Day 33 — Sales: Diagnose Before You Pitch.",
    "takeaway": "TRUST IS BUILT BY REPEATED DELIVERY",
    "visual": [
      "PROMISE",
      "EXPERIENCE",
      "PROOF",
      "TRUST"
    ]
  },
  {
    "day": 35,
    "title": "Operations: Deliver Reliably",
    "paragraph": "Operations turns a promise into a repeatable process involving people, tools, quality checks, and handoffs. A founder should map the work from order to outcome and identify where delays or errors enter. Founder view: make the best result repeatable, not dependent on heroics. Connection: this builds on Day 34 — Brand and Trust: Reduce Customer Risk.",
    "takeaway": "RELIABLE PROCESS → RELIABLE CUSTOMER VALUE",
    "visual": [
      "REQUEST",
      "PROCESS",
      "CHECK",
      "DELIVER"
    ]
  },
  {
    "day": 36,
    "title": "Bottlenecks: Improve the Constraint",
    "paragraph": "A system’s throughput is limited by its main constraint. Improving a non-bottleneck may create more work-in-progress without improving the overall result. Founder view: measure the flow, find the constraint, improve it, and then reassess what limits the system next. Connection: this builds on Day 35 — Operations: Deliver Reliably.",
    "takeaway": "IMPROVE THE CONSTRAINT, THEN RECHECK",
    "visual": [
      "FLOW",
      "BOTTLENECK",
      "IMPROVE",
      "REMEASURE"
    ]
  },
  {
    "day": 37,
    "title": "Quality: Prevent Defects at the Source",
    "paragraph": "Quality means meeting the customer’s important requirements consistently. Detecting defects late costs more than designing checks and clear standards into the process. Founder view: track recurring failures and fix the process that creates them. Connection: this builds on Day 36 — Bottlenecks: Improve the Constraint.",
    "takeaway": "PREVENT REPEAT FAILURES; DON’T JUST PATCH THEM",
    "visual": [
      "STANDARD",
      "PROCESS",
      "CHECK",
      "LEARN"
    ]
  },
  {
    "day": 38,
    "title": "Scaling: Grow Without Breaking the System",
    "paragraph": "Scaling means increasing output without costs, complexity, or failures rising at the same rate. Standard processes, automation, clear ownership, and healthy unit economics help; growth before readiness can magnify defects. Founder view: identify what breaks first at twice the volume. Connection: this builds on Day 37 — Quality: Prevent Defects at the Source.",
    "takeaway": "PROVE THE MODEL BEFORE MULTIPLYING IT",
    "visual": [
      "PROVE",
      "STANDARDIZE",
      "AUTOMATE",
      "SCALE"
    ]
  },
  {
    "day": 39,
    "title": "Organisation and Decision Rights",
    "paragraph": "An organisation needs clarity about who owns outcomes, who decides, who contributes, and when escalation is needed. Ambiguity slows work; too many approvals create bottlenecks. Founder view: assign one accountable owner and make decision boundaries explicit. Connection: this builds on Day 38 — Scaling: Grow Without Breaking the System.",
    "takeaway": "CLEAR OWNER + CLEAR AUTHORITY = FASTER EXECUTION",
    "visual": [
      "OUTCOME",
      "OWNER",
      "DECISION",
      "FEEDBACK"
    ]
  },
  {
    "day": 40,
    "title": "Leadership: Allocate Resources to Priorities",
    "paragraph": "Leadership is visible in how time, money, talent, and attention are allocated. A leader cannot fund every good idea, so priorities need explicit trade-offs and follow-through. Founder view: explain what matters now, what will wait, and why. Connection: this builds on Day 39 — Organisation and Decision Rights.",
    "takeaway": "WHAT YOU RESOURCE BECOMES YOUR REAL STRATEGY",
    "visual": [
      "MISSION",
      "PRIORITY",
      "RESOURCES",
      "EXECUTION"
    ]
  },
  {
    "day": 41,
    "title": "Hiring: Select for the Work and the Team",
    "paragraph": "Hiring starts with the outcome the role must own, the skills required, and the behaviours that fit the team’s values. Structured interviews and work samples reduce reliance on charm or vague impressions. Founder view: define success for the role before meeting candidates. Connection: this builds on Day 40 — Leadership: Allocate Resources to Priorities.",
    "takeaway": "HIRE FOR EVIDENCE OF THE WORK, NOT JUST IMPRESSION",
    "visual": [
      "OUTCOME",
      "SKILLS",
      "EVIDENCE",
      "FIT"
    ]
  },
  {
    "day": 42,
    "title": "Culture and Incentives: What Gets Repeated?",
    "paragraph": "Culture is shaped by what leaders reward, tolerate, measure, and model. Incentives can unintentionally encourage gaming a metric or hiding bad news. Founder view: ask what behaviour your current reward system makes rational. Connection: this builds on Day 41 — Hiring: Select for the Work and the Team.",
    "takeaway": "PEOPLE REPEAT WHAT THE SYSTEM REWARDS",
    "visual": [
      "VALUES",
      "INCENTIVE",
      "BEHAVIOUR",
      "RESULT"
    ]
  },
  {
    "day": 43,
    "title": "Negotiation: Trade Value, Not Just Price",
    "paragraph": "Negotiation improves when you understand interests, alternatives, constraints, and what each side values differently. Prepare your best alternative, desired outcome, walk-away point, and possible trades. Founder view: seek an agreement that works economically and preserves trust. Connection: this builds on Day 42 — Culture and Incentives: What Gets Repeated?.",
    "takeaway": "PREPARE YOUR ALTERNATIVE BEFORE YOU BARGAIN",
    "visual": [
      "INTERESTS",
      "OPTIONS",
      "TRADE",
      "AGREEMENT"
    ]
  },
  {
    "day": 44,
    "title": "Risk and Governance: Protect the Company",
    "paragraph": "Risk management identifies what could cause material harm, estimates likelihood and impact, and assigns controls and owners. Governance clarifies accountability, records important decisions, and protects customers and stakeholders. Founder view: address high-impact risks before they become emergencies. Connection: this builds on Day 43 — Negotiation: Trade Value, Not Just Price.",
    "takeaway": "NAME THE RISK, OWNER, CONTROL, AND TRIGGER",
    "visual": [
      "RISK",
      "IMPACT",
      "CONTROL",
      "OWNER"
    ]
  },
  {
    "day": 45,
    "title": "AI for Business Bottlenecks",
    "paragraph": "AI creates value when it improves a real bottleneck such as slow support, repetitive analysis, or hard-to-find information. Define the baseline, human review needs, privacy constraints, failure modes, and measurable outcome before choosing a model. Founder view: calculate the benefit and the risk before automating. Connection: this builds on Day 44 — Risk and Governance: Protect the Company.",
    "takeaway": "START WITH THE BOTTLENECK, THEN CHOOSE AI",
    "visual": [
      "BOTTLENECK",
      "AI ASSIST",
      "HUMAN CHECK",
      "OUTCOME"
    ]
  },
  {
    "day": 46,
    "title": "Founder Decision-Making Under Uncertainty",
    "paragraph": "Founders rarely have complete information, so good decisions separate reversible experiments from hard-to-reverse commitments. State the hypothesis, evidence, downside, deadline, and signal that would change your mind. Founder view: make the smallest decision that creates useful learning. Connection: this builds on Day 45 — AI for Business Bottlenecks.",
    "takeaway": "DECIDE, MEASURE, LEARN, UPDATE",
    "visual": [
      "QUESTION",
      "EVIDENCE",
      "DECISION",
      "REVIEW"
    ]
  },
  {
    "day": 47,
    "title": "Case Thinking: Diagnose Before Recommending",
    "paragraph": "A business case is a structured diagnosis, not a list of clever ideas. Clarify the goal, segment the problem, inspect the economics, identify the constraint, and compare options against evidence and risks. Founder view: give one recommendation, the reason, the trade-off, and the metric that will test it. Connection: this builds on Day 46 — Founder Decision-Making Under Uncertainty.",
    "takeaway": "GOAL → DIAGNOSIS → OPTIONS → DECISION",
    "visual": [
      "GOAL",
      "DIAGNOSE",
      "OPTIONS",
      "DECIDE"
    ]
  },
  {
    "day": 48,
    "title": "Wealth, Ownership, and Compounding",
    "paragraph": "Wealth grows through ownership of valuable assets, disciplined reinvestment, time, and risk management—not income alone. Compounding works when returns are retained and reinvested, while concentration and leverage can also magnify losses. Founder view: build durable value and protect the ability to keep playing. Connection: this builds on Day 47 — Case Thinking: Diagnose Before Recommending.",
    "takeaway": "OWN VALUE, REINVEST WISELY, PROTECT THE DOWNSIDE",
    "visual": [
      "CREATE VALUE",
      "OWN",
      "REINVEST",
      "COMPOUND"
    ]
  }
]


type StreakState = {
  completedDates: string[]
  completedLessons: number[]
  current: number
  best: number
}

const STREAK_KEY = 'brm-streak-v1'
const PROGRESS_KEY = 'brm-lesson-progress-v3'
const LEGACY_PROGRESS_KEY = 'brm-lesson-progress-v2'
function getKolkataDateKey() {
  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const get = (type: string) => parts.find(p => p.type === type)?.value || ''
  return `${get('year')}-${get('month')}-${get('day')}`
}

function dateFromKey(key: string) {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

function getBusinessLessonNumberForDate(key: string) {
  const startKey = '2026-10-05'
  if (key < startKey) return 0
  let count = 0
  const cursor = dateFromKey(startKey)
  const end = dateFromKey(key)
  while (cursor <= end) {
    if (cursor.getUTCDay() !== 0) count += 1
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return count
}

function getLessonByNumber(day: number): Lesson {
  const core = LESSONS[day - 1]
  if (core) return core
  const base = LESSONS[(day - 49) % LESSONS.length]
  return {
    ...base,
    day,
    title: `ADVANCED STAGE • ${base.title}`,
    paragraph: `Advanced application: apply this concept to a real company or your own project. State the hypothesis, evidence, trade-off, downside, and metric that would change your decision. ${base.paragraph} This advanced pass follows the same 48-domain order.`,
    takeaway: `TEST IN REALITY: ${base.takeaway}`,
    visual: ['HYPOTHESIS', 'EVIDENCE', 'TRADE-OFF', 'METRIC'],
  }
}

function getTodaySchedule(completedLessons: number[], today = getKolkataDateKey()) {
  const dayOfWeek = dateFromKey(today).getUTCDay()
  const completed = new Set(completedLessons)
  let nextLesson = 1
  while (completed.has(nextLesson)) nextLesson += 1

  // Sunday reviews the six lessons scheduled in the just-completed Monday–Saturday
  // week. It never marks a lesson complete or advances the sequence.
  if (dayOfWeek === 0) {
    const scheduledThroughYesterday = getBusinessLessonNumberForDate(today)
    const firstDay = Math.max(1, scheduledThroughYesterday - 5)
    const reviewed: Lesson[] = []
    for (let day = firstDay; day <= scheduledThroughYesterday; day += 1) {
      reviewed.push(getLessonByNumber(day))
    }
    return { type: 'revision' as const, lessons: reviewed, lessonNumber: nextLesson }
  }

  return { type: 'lesson' as const, lesson: getLessonByNumber(nextLesson), lessonNumber: nextLesson }
}


function daysBetween(a: string, b: string) {
  const [ay, am, ad] = a.split('-').map(Number)
  const [by, bm, bd] = b.split('-').map(Number)
  const ms = Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)
  return Math.round(ms / 86400000)
}

function buildStreak(dates: string[], completedLessons: number[] = []): StreakState {
  const completedDates = Array.from(new Set(dates)).sort()
  const lessons = Array.from(new Set(completedLessons.filter(n => Number.isInteger(n) && n >= 1))).sort((a,b) => a-b)
  if (!completedDates.length) return { completedDates: [], completedLessons: lessons, current: 0, best: 0 }

  let best = 1
  let run = 1
  for (let i = 1; i < completedDates.length; i += 1) {
    if (daysBetween(completedDates[i - 1], completedDates[i]) === 1) {
      run += 1
      best = Math.max(best, run)
    } else {
      run = 1
    }
  }

  const today = getKolkataDateKey()
  let current = 0
  let cursor = today
  for (let i = completedDates.length - 1; i >= 0; i -= 1) {
    if (completedDates[i] === cursor) {
      current += 1
      const [y, m, d] = cursor.split('-').map(Number)
      cursor = new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10)
    } else if (completedDates[i] < cursor) {
      break
    }
  }
  return { completedDates, completedLessons: lessons, current, best }
}
export function BRMPage({ onBack }: { onBack?: () => void }) {
  const [today, setToday] = useState(getKolkataDateKey())
  const [streak, setStreak] = useState<StreakState>({ completedDates: [], completedLessons: [], current: 0, best: 0 })

  useEffect(() => {
    const syncDate = () => {
      const next = getKolkataDateKey()
      setToday(prev => prev === next ? prev : next)
    }
    syncDate()
    const interval = window.setInterval(syncDate, 30000)
    window.addEventListener('focus', syncDate)
    document.addEventListener('visibilitychange', syncDate)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', syncDate)
      document.removeEventListener('visibilitychange', syncDate)
    }
  }, [])

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STREAK_KEY)
      const savedProgress = window.localStorage.getItem(PROGRESS_KEY)
      const legacyProgress = window.localStorage.getItem(LEGACY_PROGRESS_KEY)
      const parsed = saved ? JSON.parse(saved) as Partial<StreakState> : {}
      const completedDates = Array.isArray(parsed.completedDates) ? parsed.completedDates : []
      const explicitLessons = savedProgress ? JSON.parse(savedProgress) : []
      let completedLessons: number[]
      if (savedProgress && Array.isArray(explicitLessons)) {
        completedLessons = explicitLessons
      } else {
        const legacy = legacyProgress ? JSON.parse(legacyProgress) : (Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [])
        const legacyMap: Record<number, number[]> = {
          1:[1], 2:[2], 3:[3], 4:[4], 5:[6], 6:[10], 7:[15],
          8:[20], 9:[27], 10:[31], 11:[26], 12:[40], 13:[45], 14:[46],
        }
        completedLessons = Array.isArray(legacy)
          ? Array.from(new Set(legacy.flatMap((n: number) => legacyMap[n] || []))).sort((a,b) => a-b)
          : []
        window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(completedLessons))
      }
      setStreak(buildStreak(completedDates, completedLessons))
    } catch {
      // Keep the UI usable even when local storage is unavailable.
    }
  }, [])

  const schedule = getTodaySchedule(streak.completedLessons, today)
  const lesson = schedule.type === 'lesson' ? schedule.lesson : (schedule.lessons[schedule.lessons.length - 1] || getLessonByNumber(1))
  const progress = lesson ? (lesson.day <= 48 ? ((lesson.day - 1) / 47) * 100 : (((lesson.day - 49) % 48) / 47) * 100) : 0
  const isDoneToday = streak.completedDates.includes(today)

  const markDone = () => {
    if (isDoneToday) return
    // Sunday is revision-only: it may count toward the streak, but must never
    // mark an unseen next lesson as complete or advance the curriculum.
    const nextLessons = schedule.type === 'lesson'
      ? Array.from(new Set([...streak.completedLessons, schedule.lessonNumber])).sort((a,b) => a-b)
      : streak.completedLessons
    const next = buildStreak([...streak.completedDates, today], nextLessons)
    setStreak(next)
    try {
      window.localStorage.setItem(STREAK_KEY, JSON.stringify(next))
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(nextLessons))
    } catch {
      // Streak remains visible for this session.
    }
  }

  return (
    <div style={{ minHeight: '100%', padding: '18px 16px 110px', maxWidth: 980, margin: '0 auto', color: 'var(--ui-text, #F8FAFC)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 1.6, fontWeight: 900, color: 'var(--jarvis-cyan, #63F6FF)' }}>BRM // BUSINESS READING & MINDSET</div>
          <h1 style={{ margin: '4px 0 0', fontSize: 26, lineHeight: 1.15 }}>Business School in One Daily Lesson</h1>
        </div>
        {onBack && <button onClick={onBack} aria-label="Back" style={{ border: '1px solid var(--ui-border, #334155)', background: 'var(--ui-surface, #111827)', color: 'var(--ui-muted, #94A3B8)', borderRadius: 999, padding: '8px 12px', cursor: 'pointer' }}>←</button>}
      </div>

      <section style={{ border: '1px solid rgba(99,246,255,.35)', background: 'linear-gradient(135deg, rgba(14,31,45,.96), rgba(20,18,33,.96))', borderRadius: 18, padding: 18, boxShadow: '0 16px 50px rgba(0,0,0,.25)', marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 900, color: '#F5A623', letterSpacing: 1.2 }}>
              {schedule.type === 'revision' ? 'SUNDAY • WEEKLY REVISION' : lesson && lesson.day <= 48 ? `CORE DAY ${lesson.day}/48 • READ TODAY` : `ADVANCED DAY ${lesson?.day} • READ TODAY`}
            </div>
            <div style={{ fontSize: 13, color: '#A5B4FC', marginTop: 5 }}>No PDF hunting • No article hunting • Just read</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 8, marginLeft: 'auto' }}>
            <div style={{ minWidth: 126, padding: '9px 10px', borderRadius: 13, border: '1px solid rgba(245,166,35,.38)', background: 'rgba(245,166,35,.10)', textAlign: 'right', boxShadow: '0 8px 24px rgba(245,166,35,.08)' }}>
              <div style={{ fontSize: 9, fontWeight: 950, letterSpacing: 1, color: '#FDBA4B' }}>🔥 BEST STREAK</div>
              <div style={{ marginTop: 2, fontSize: 21, fontWeight: 950, lineHeight: 1 }}>{streak.completedDates.length ? streak.best : '—'} <span style={{ fontSize: 10, color: '#CBD5E1' }}>{streak.completedDates.length ? 'days' : 'not verified'}</span></div>
              <div style={{ marginTop: 4, fontSize: 9, color: '#CBD5E1' }}>CURRENT {streak.completedDates.length ? streak.current : 'NOT VERIFIED'}</div>
            </div>
            <div style={{ minWidth: 120 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94A3B8', marginBottom: 5 }}><span>CURRICULUM</span><span>{schedule.type === 'revision' && schedule.lessons.length === 0 ? 'REVISION · NO DATA' : lesson.day <= 48 ? `CORE ${lesson.day}/48` : `ADVANCED ${lesson.day}`}</span></div>
              <div style={{ height: 7, borderRadius: 999, background: 'rgba(255,255,255,.08)', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg,#22C55E,#63F6FF)' }} />
              </div>
            </div>
          </div>
        </div>

        {schedule.type === 'revision' ? (
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 24, fontWeight: 950, lineHeight: 1.15 }}>This Week → Lock It In</div>
            <div style={{ marginTop: 8, color: '#94A3B8', fontSize: 13 }}>Sunday is not a new lesson. It is the memory-and-connection day for the six lessons you just studied.</div>
            <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
              {schedule.lessons.length === 0 && <div style={{ padding: 12, borderRadius: 12, color: '#CBD5E1', background: 'rgba(255,255,255,.035)', fontSize: 13, lineHeight: 1.6 }}>No BRM lesson completion is recorded yet. Sunday stays revision-only; start Day 1 on the next lesson day.</div>}
              {schedule.lessons.map((item) => (
                <div key={item.day} style={{ padding: 11, borderRadius: 12, border: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.035)' }}>
                  <div style={{ fontSize: 10, color: '#63F6FF', fontWeight: 900 }}>DAY {item.day}</div>
                  <div style={{ marginTop: 3, fontSize: 14, fontWeight: 850 }}>{item.title}</div>
                  <div style={{ marginTop: 4, fontSize: 12, lineHeight: 1.5, color: '#CBD5E1' }}>{item.takeaway}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginTop: 18, fontSize: 24, fontWeight: 950, lineHeight: 1.15 }}>{lesson.title}</div>
            <div style={{ marginTop: 16, fontSize: 15, lineHeight: 1.85, color: '#E2E8F0' }}>
              {lesson.paragraph}
            </div>
          </>
        )}

        <div style={{ marginTop: 16, padding: 14, borderRadius: 14, border: '1px solid rgba(245,166,35,.28)', background: 'rgba(245,166,35,.07)' }}>
          <div style={{ fontSize: 10, fontWeight: 900, color: '#F5A623', letterSpacing: 1 }}>{schedule.type === 'revision' ? 'REVISION MEMORY' : 'MEMORY LINE'}</div>
          <div style={{ marginTop: 5, fontSize: 16, fontWeight: 900, lineHeight: 1.45 }}>
            {schedule.type === 'revision'
              ? 'READ → RECALL → CONNECT → APPLY'
              : lesson.takeaway}
          </div>
        </div>

        {schedule.type === 'lesson' ? (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1, color: '#63F6FF', marginBottom: 8 }}>BUSINESS VISUAL</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(82px, 1fr))', gap: 7 }}>
              {lesson.visual.map((step, i) => (
                <div key={step} style={{ minHeight: 58, padding: '10px 8px', borderRadius: 11, border: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.035)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', fontSize: 10, fontWeight: 900, minWidth: 0, overflowWrap: 'anywhere' }}>
                  <span style={{ fontSize: 17, opacity: .55 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ marginTop: 4 }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
            {schedule.lessons.map((item) => (
              <div key={item.day} style={{ padding: 13, borderRadius: 14, border: '1px solid rgba(99,246,255,.16)', background: 'rgba(255,255,255,.028)' }}>
                <div style={{ fontSize: 10, color: '#63F6FF', fontWeight: 900 }}>DAY {item.day}</div>
                <div style={{ marginTop: 4, fontSize: 16, fontWeight: 900 }}>{item.title}</div>
                <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.7, color: '#CBD5E1' }}>{item.paragraph}</div>
                <div style={{ marginTop: 9, fontSize: 11, fontWeight: 900, color: '#FDBA4B' }}>{item.takeaway}</div>
                <div style={{ marginTop: 8, fontSize: 11, lineHeight: 1.5, color: '#A5F3FC' }}>TINY RECALL: Explain this idea in one sentence, give one example, and name one decision it changes.</div>
              </div>
            ))}
            {schedule.type === 'revision' && schedule.lessons.length > 0 && (
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ padding: 12, borderRadius: 12, border: '1px solid rgba(99,246,255,.18)', background: 'rgba(99,246,255,.04)' }}>
                  <div style={{ fontSize: 10, fontWeight: 900, color: '#63F6FF' }}>CONNECTED BUSINESS CHAIN</div>
                  <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.6, color: '#CBD5E1' }}>{schedule.lessons.map(item => item.title).join(' → ')}</div>
                </div>
                <div style={{ padding: 12, borderRadius: 12, border: '1px solid rgba(245,166,35,.22)', background: 'rgba(245,166,35,.05)' }}>
                  <div style={{ fontSize: 10, fontWeight: 900, color: '#FDBA4B' }}>FOUNDER / CEO DECISION SCENARIO</div>
                  <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.6, color: '#CBD5E1' }}>You have limited time and money. Choose one priority from these six concepts, state the customer/business evidence, name the trade-off, and pick the metric that would make you continue, change, or stop.</div>
                </div>
              </div>
            )}
          </div>
        )}

        <button onClick={markDone} disabled={isDoneToday} style={{ marginTop: 18, width: '100%', border: isDoneToday ? '1px solid rgba(34,197,94,.32)' : '1px solid rgba(99,246,255,.34)', background: isDoneToday ? 'rgba(34,197,94,.10)' : 'rgba(99,246,255,.08)', color: isDoneToday ? '#86EFAC' : '#A5F3FC', borderRadius: 13, padding: '12px 14px', cursor: isDoneToday ? 'default' : 'pointer', fontWeight: 950, letterSpacing: .8 }}>
          {isDoneToday ? `✅ TODAY COMPLETE • CURRENT STREAK ${streak.current}` : schedule.type === 'revision' ? 'MARK SUNDAY REVISION DONE → KEEP YOUR STREAK' : 'MARK TODAY DONE → UNLOCK NEXT LESSON'}
        </button>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10 }}>
        <div style={{ border: '1px solid var(--ui-border, #334155)', background: 'var(--ui-surface, #111827)', borderRadius: 15, padding: 15 }}>
          <div style={{ color: '#22C55E', fontWeight: 900, fontSize: 11 }}>HOW TO READ</div>
          <div style={{ marginTop: 7, fontSize: 13, lineHeight: 1.65, color: '#CBD5E1' }}>Read slowly. Imagine you are the founder making the decision. Understand the business logic; you do not need to memorize everything.</div>
        </div>
        <div style={{ border: '1px solid var(--ui-border, #334155)', background: 'var(--ui-surface, #111827)', borderRadius: 15, padding: 15 }}>
          <div style={{ color: '#A78BFA', fontWeight: 900, fontSize: 11 }}>YOUR ONLY ACTION</div>
          <div style={{ marginTop: 7, fontSize: 13, lineHeight: 1.65, color: '#CBD5E1' }}>Finish this lesson. Then return to your CAT-first work. BRM is a small daily investment in your long-term business mind.</div>
        </div>
      </section>

      <div style={{ marginTop: 14, textAlign: 'center', fontSize: 11, color: '#64748B' }}>
        {schedule.type === 'revision'
          ? 'SUNDAY REVISION → COMPLETE THE PENDING LESSON → NEXT LESSON UNLOCKS'
          : isDoneToday
            ? `DAY ${lesson?.day} COMPLETE → NEXT LESSON UNLOCKED`
            : `DAY ${lesson?.day} LOCKED → MARK DONE TO UNLOCK NEXT LESSON`} • CAT FIRST 🔒
      </div>

      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ marginTop: 12, width: '100%', border: '1px solid rgba(99,246,255,.22)', background: 'rgba(99,246,255,.05)', color: '#A5F3FC', borderRadius: 12, padding: '10px 12px', cursor: 'pointer' }}>
        ↑ BACK TO TOP
      </button>
    </div>
  )
}
