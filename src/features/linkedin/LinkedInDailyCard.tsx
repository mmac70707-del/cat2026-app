import { useMemo, useState, useEffect } from 'react'
import { getKolkataDateParts } from '@/services/calendarEngine'

type Lesson = [string,string,string,string,string,string,string,string,string,string]
type BusinessLens = { lens:string; role:string; move:string; question:string; visual:string }

const LESSONS: Lesson[] = [
  ['Observe → Hypothesis → Test','Good decisions start with an observation, a possible explanation, and a small test.','Science lab: an idea is not a fact until tested.','A shop notices smaller packs are requested and tests a lower-price pack for a week.','Test assumptions before scaling effort.','What is the smallest test for an idea I have?','From Science to Business','A business idea is still a hypothesis until reality tests it.','I’m learning to connect scientific thinking with business: observe, form a hypothesis, test, learn, improve.','What assumption should be tested before a product is fully built?'],
  ['Customer Problem','A product creates value when it solves a real problem people care enough to act on.','A good umbrella solves getting wet, not “umbrella enthusiasm.”','A food app reducing checkout friction solves a concrete customer problem.','Start with the problem, not the feature.','What problem is this product actually solving?','Business in One Analogy','Before asking “What should we build?”, ask “What problem deserves solving?”','A useful business habit I’m learning: separate the customer problem from the solution we imagine.','What customer problem do you notice around you?'],
  ['Value Proposition','A value proposition explains who the product helps, what problem it solves, and why it is useful.','A movie trailer tells you why the film is worth two hours.','A budget airline sells affordable air travel, not simply seats.','Clarity beats complexity.','Can I explain a product’s value in one sentence?','3-Minute MBA Learning','A product can be complicated. Its value proposition should not be.','I’m learning to look at products through three questions: who, problem, value.','Which product has the clearest value proposition to you?'],
  ['Segmentation','Customers are not one identical group; useful segments share meaningful needs or behaviour.','A classroom has students who need different explanations.','A fitness company may serve beginners and experienced athletes differently.','Better segmentation can make the same product more relevant.','What meaningful difference separates these customers?','Network Notes','“Everyone is our customer” is often the beginning of unclear strategy.','I’m learning why businesses segment customers instead of treating a market as one giant group.','What is one useful way to segment a market?'],
  ['Positioning','Positioning is the place a product aims to occupy in a customer’s mind relative to alternatives.','In a toolbox, each tool has a job; confusion starts when every tool claims every job.','A brand can position itself around affordability, convenience, premium quality, or another clear dimension.','Positioning is about choice and trade-offs.','What would this product want to be remembered for?','Business in One Analogy','Positioning is less about saying everything and more about being remembered for something specific.','I’m learning to compare products by the space they try to own in a customer’s mind.','What product has a very clear position?'],
  ['Unit Economics','Unit economics looks at revenue and direct costs associated with one customer/order/unit.','A lemonade stand asks: what does one glass earn after its direct ingredients?','A subscription business can compare revenue per customer with direct service cost.','Growth is easier to understand when the economics of one unit make sense.','What earns or costs money per unit?','Funding & AI Learning Notes','Revenue can grow while economics remain weak.','I’m learning why founders need to understand what happens financially to one customer or order.','Which business would be interesting to break into unit economics?'],
  ['Opportunity Cost','Choosing one option means giving up the next-best alternative.','An hour spent on one book cannot simultaneously be spent on another.','A company allocating engineers to Feature A delays Feature B.','Every scarce resource has an opportunity cost.','What am I giving up by choosing this?','3-Minute MBA Learning','The cost of a decision is not only the money spent—it can be the best alternative you did not choose.','I’m learning to think about decisions through opportunity cost, especially when time and attention are limited.','Where do you see opportunity cost in business?'],
  ['Marginal Thinking','Marginal thinking asks what changes when one additional unit of effort or resource is added.','One extra lap can help training—or become wasted effort if recovery is already poor.','A business asks whether one more sales representative adds enough contribution to justify the cost.','Think about the next unit, not only the average.','What changes if I add one more unit?','What I Noticed Today','Averages can hide what happens at the margin.','I’m learning to ask a more practical question: what happens if we add one more unit of effort, cost or output?','Where could marginal thinking improve a decision?'],
  ['Fixed vs Variable Cost','Fixed costs stay relatively stable over a range; variable costs move with activity.','Rent is different from ingredients used for every pizza.','A factory may have rent as a fixed cost and packaging as a variable cost.','Cost structure changes business risk.','Which costs move when volume changes?','Business in One Analogy','Not all costs behave the same way when a business grows.','I’m learning to separate fixed and variable costs because growth changes their impact differently.','What example can you find in an everyday business?'],
  ['Funnel Thinking','A funnel tracks how many people move from one stage to another.','A sieve lets fewer items pass through each stage.','Marketing may track visitors → leads → trials → customers.','The biggest drop-off can reveal where investigation is needed.','Where does the largest drop happen?','Marketing Notes','A funnel turns a vague growth problem into a sequence of measurable steps.','I’m learning to look at customer journeys as stages rather than one final conversion number.','Which funnel stage would you investigate first?'],
  ['Conversion Rate','Conversion rate measures the share of people who take a desired action out of those exposed to the opportunity.','Out of 100 students invited, how many actually attend?','A landing page gets 1,000 visitors and 40 sign-ups: 4% conversion.','Always ask: conversion of what population?','What is the denominator?','Data & Decision Notes','A percentage is only useful when you know what it is a percentage of.','I’m learning that even simple business metrics can mislead if the denominator is unclear.','What conversion rate do you encounter in daily life?'],
  ['Retention','Retention measures how well a product keeps customers returning or remaining active.','A good library book gets opened again, not merely borrowed once.','A software product may track how many users remain active after 30 days.','Acquisition gets attention; retention reveals continued value.','Why would the customer come back?','What I Noticed Today','A first purchase shows interest. Returning behaviour can show continuing value.','I’m learning to distinguish getting a customer from creating enough value for them to stay.','What makes you return to a product?'],
  ['Network Effects','A network effect occurs when a product becomes more valuable as more relevant users join.','A phone is more useful when the people you need to call also have phones.','A professional network becomes more useful as relevant professionals participate.','More users can change the value of the product itself.','Does another user make this product more useful?','Technology & Strategy','Some products grow because their users increase the value available to other users.','I’m learning to ask whether growth changes the product’s value, not just its size.','Which product has a strong network effect?'],
  ['Switching Costs','Switching costs are the time, money, effort, learning or risk involved in moving to an alternative.','Changing a keyboard layout has a learning cost even if the new keyboard is free.','A company changing enterprise software may need training and migration.','Customers can stay because switching is costly, not only because satisfaction is high.','What makes switching difficult?','Business in One Analogy','“Customers stay” and “customers love us” are not automatically the same statement.','I’m learning to separate loyalty from the friction involved in changing providers.','What is a real switching cost you have experienced?'],
  ['Competitive Advantage','A competitive advantage is a meaningful capability or position that helps a business perform better than alternatives over time.','A shortcut is useful only if others cannot easily copy its benefit.','A strong distribution network can make a product easier to reach customers.','Advantage must be meaningful and defensible.','Why is this advantage hard to copy?','Strategy Notes','A feature is not automatically an advantage if every competitor can copy it tomorrow.','I’m learning to ask not only “What is different?” but “What is difficult to replicate?”','What advantage seems defensible in a business you know?'],
  ['Moat','A moat is a durable barrier that can protect a business from competitive pressure.','A castle moat makes direct entry harder.','Brand trust, scale advantages, network effects or switching costs can sometimes contribute to durability.','Durability matters more than temporary novelty.','What protects the business over time?','Strategy Notes','A temporary lead and a durable advantage are different things.','I’m learning to examine why some businesses keep an advantage after competitors notice them.','Which source of durability interests you most?'],
  ['Experiment Design','A useful experiment changes one important variable while measuring a defined outcome.','A science experiment is hard to interpret when five things change at once.','A product team tests two checkout designs while tracking completed purchases.','Clear variables make learning easier.','What exactly am I changing and measuring?','From Science to Business','Good experiments make the learning question clear before the test begins.','I’m learning to define the variable, outcome and comparison before judging a test.','What would you measure in a simple product experiment?'],
  ['A/B Testing','A/B testing compares two versions under controlled conditions to see whether a measured outcome differs.','Two identical classrooms try different study materials and compare results.','A website compares two headlines and measures sign-up rate.','Compare versions against the same target metric.','What outcome would make Version B better?','Data & Decision Notes','A/B testing is not “which design looks nicer”; it is a comparison against a defined outcome.','I’m learning to connect design decisions with measurable behaviour.','What could you A/B test in an app?'],
  ['Correlation vs Causation','Correlation means variables move together; causation means one change produces another under the relevant mechanism.','Umbrellas and traffic accidents may rise together because rain affects both.','Sales and advertising can correlate without proving advertising caused every sale.','Association is not proof of cause.','What alternative explanation exists?','Data & Decision Notes','Two lines moving together do not automatically tell us why.','I’m learning to pause before turning a correlation into a causal claim.','What third variable could explain a relationship?'],
  ['Base Rates','Base rates describe how common an outcome is before considering new evidence.','If only one in 100 boxes contains a rare item, one clue needs context.','A fraud model should consider how rare fraud is in the full transaction population.','Evidence needs a starting probability.','How common is this outcome normally?','Decision-Making Notes','A surprising signal can still point to an unlikely outcome when the base rate is very low.','I’m learning to combine new evidence with the starting rate instead of reacting to the signal alone.','Where might base rates matter in business?'],
  ['Expected Value','Expected value combines possible outcomes with their probabilities to estimate an average payoff over repeated similar decisions.','A game can have a small chance of a big prize and still have a calculable average value.','A company can compare a product experiment’s possible upside, cost and probability.','Good decisions can have uncertain outcomes.','What are the possible outcomes and their probabilities?','Decision-Making Notes','Uncertainty does not make a decision impossible; it makes assumptions visible.','I’m learning to break uncertain choices into outcomes, probabilities and consequences.','What decision could be framed this way?'],
  ['Pricing','Pricing is a value, cost and market decision—not simply adding a markup.','A concert ticket is priced around perceived value, demand and alternatives, not only printing cost.','A software company may offer different plans for different customer needs.','Price communicates and captures value.','What value is the customer paying for?','Business in One Analogy','The price of a product is part of its strategy, not just its arithmetic.','I’m learning to look at pricing through customer value, alternatives and business economics.','What product has interesting pricing?'],
  ['Product-Market Fit','Product-market fit describes strong evidence that a product solves an important problem for a defined market.','A key fits because it matches the lock—not because the key is beautifully designed.','Repeated use, retention and organic demand can provide evidence of fit.','Fit is demonstrated through behaviour, not a slogan.','What behaviour would prove customers truly value it?','Founder Learning Notes','A polished product is not proof of product-market fit.','I’m learning to look for behavioural evidence that a market actually wants a product.','What behaviour would convince you?'],
  ['Go-to-Market','Go-to-market is the system for reaching the right customers and turning the product into adoption.','A great book still needs a way to reach readers.','A B2B software company may combine sales, partnerships and content.','Distribution is part of product strategy.','How does the product reach its customer?','Founder Learning Notes','Building the product is only one half; reaching the right customer is another system.','I’m learning to map product, customer, channel and sales together.','Which channel would fit a product you know?'],
  ['Sales Pipeline','A sales pipeline tracks potential customers through defined stages toward a purchase.','A railway timetable shows where each train is in its journey.','Lead → qualified → demo → proposal → closed is one possible pipeline.','Pipeline stages help forecast and diagnose sales work.','Where are prospects getting stuck?','Sales Learning Notes','A sales number is easier to improve when you can see the stages behind it.','I’m learning to treat sales as a process with measurable stages, not just a final number.','Which stage would you measure first?'],
  ['AI Automation','AI automation combines models with workflows so repetitive decisions or tasks can be assisted or executed systematically.','A calculator automates arithmetic; AI can assist with more flexible information work.','A support team can classify incoming questions before a human handles complex cases.','Automation should solve a real workflow bottleneck.','What human task is repetitive enough to improve?','AI & Technology Notes','AI value is not “using AI”; it is improving a real workflow.','I’m learning to evaluate AI ideas by the task, bottleneck, human role and measurable outcome.','What workflow would you automate first?'],
  ['Data Quality','Bad inputs can produce bad decisions even when the analysis is technically correct.','A perfect calculator gives the wrong answer if the numbers entered are wrong.','A sales dashboard can mislead if duplicate customers are counted twice.','Data quality is part of decision quality.','Can I trust the input before trusting the output?','Data & Decision Notes','A sophisticated dashboard cannot rescue unreliable data.','I’m learning that data cleaning and definitions are part of business intelligence, not boring side work.','What data-quality problem might affect a metric?'],
  ['Decision Frameworks','A decision framework makes criteria and trade-offs explicit before choosing among options.','A checklist prevents a pilot from being judged only by emotion.','A founder can compare product ideas using customer need, feasibility, economics and strategic fit.','Explicit criteria make reasoning inspectable.','What criteria matter before I choose?','Decision-Making Notes','Good frameworks do not remove judgment; they make judgment easier to examine.','I’m learning to turn vague choices into explicit criteria and trade-offs.','What decision could use a framework?'],
  ['Founder Learning Loop','Founders repeatedly move through observation, decision, action, measurement and learning.','A pilot keeps adjusting its route after checking the map.','A product team learns from customers, changes the product, measures again and repeats.','The loop compounds learning.','What did the last action teach me?','Founder Learning Notes','The long-term advantage may come from learning faster, not simply working harder.','I’m learning to see entrepreneurship as a repeated learning loop rather than one giant idea.','What learning loop can I start with a real project?'],
]

const BUSINESS_LENSES: BusinessLens[] = [
  { lens:'CEO LENS', role:'Vision + allocation', move:'Turn a broad goal into one clear priority, then decide what NOT to fund, build or chase.', question:'If I had one quarter and limited people, what would I stop doing?', visual:'CEO desk: one north-star metric, three priorities, three crossed-out distractions.' },
  { lens:'PRODUCT MANAGER LENS', role:'Customer + product', move:'Start from the user problem, define the smallest useful outcome, then measure behaviour instead of opinions.', question:'What user behaviour would prove this feature is actually useful?', visual:'Product board: USER → PROBLEM → HYPOTHESIS → MVP → METRIC.' },
  { lens:'FOUNDER LENS', role:'Speed + learning', move:'Make the smallest credible bet, get reality feedback quickly, and use the result to change the next decision.', question:'What can I test in 7 days instead of debating for 7 weeks?', visual:'Founder loop: ASSUMPTION → TEST → SIGNAL → DECISION → NEXT BET.' },
  { lens:'STRATEGY LENS', role:'Advantage + trade-offs', move:'Choose where to win and accept the trade-offs that make the position credible.', question:'What will we deliberately be worse at so we can be much better at one thing?', visual:'Strategy map: CUSTOMER → CHOICE → TRADE-OFF → ADVANTAGE.' },
  { lens:'AI + TECHNOLOGY LENS', role:'Leverage + systems', move:'Use technology where it changes the economics or speed of a real workflow—not merely because it is impressive.', question:'Which bottleneck becomes cheaper, faster or better if technology is applied?', visual:'Workflow: HUMAN BOTTLENECK → AI ASSIST → HUMAN JUDGMENT → OUTCOME.' },
  { lens:'GROWTH LENS', role:'Distribution + retention', move:'Separate acquisition from retention and find the stage where the system loses the most value.', question:'Where is the biggest leak: discovery, activation, conversion or retention?', visual:'Funnel: REACH → ACTIVATE → CONVERT → RETAIN → REFER.' },
  { lens:'CAPITAL LENS', role:'Economics + runway', move:'Ask what one customer/unit contributes, what growth costs, and which assumption can break the model.', question:'If volume doubles, which cost or constraint becomes the problem?', visual:'Simple model: PRICE − DIRECT COST → CONTRIBUTION → SCALE CONSTRAINT.' },
]\n\nconst LEADER_CASES = [
  { leader:'SUNDAR / CEO LENS', context:'Scale a product people already use', lesson:'Start with user value, then scale the system behind it. At Google, product strategy connects user needs, technology, experimentation and measurable outcomes.', prompt:'If 1 million people used my product tomorrow, what would break first?', visual:['USER VALUE','PRODUCT','SYSTEM','SCALE'] },
  { leader:'PRODUCT MANAGER LENS', context:'A feature request arrives from a loud customer', lesson:'Do not automatically build the request. Identify the underlying user problem, define the success metric, test the smallest useful solution, then learn.', prompt:'What behaviour would prove the problem is actually solved?', visual:['USER','PROBLEM','HYPOTHESIS','METRIC'] },
  { leader:'ELON / FOUNDER LENS', context:'A process is slow and expensive', lesson:'Use first-principles thinking: question the requirement, remove unnecessary work, simplify, then accelerate and automate. Tesla explicitly describes first-principles thinking as part of how it approaches engineering.', prompt:'What part of this process should not exist at all?', visual:['QUESTION','DELETE','SIMPLIFY','SCALE'] },
  { leader:'FOUNDER / CAPITAL LENS', context:'You have ₹1 lakh and one month', lesson:'Capital is a constraint that forces prioritisation. Fund the smallest experiment that can change your next decision—not the biggest version of the dream.', prompt:'What evidence would make the next ₹1 lakh easier to justify?', visual:['CAPITAL','BET','SIGNAL','NEXT BET'] },
  { leader:'STRATEGY LENS', context:'Three competitors copy your feature', lesson:'A copied feature is not a durable advantage. Look for distribution, trust, switching costs, network effects, cost structure or a capability that compounds.', prompt:'What becomes harder to copy after we win?', visual:['CHOICE','TRADE-OFF','ADVANTAGE','MOAT'] },
  { leader:'GROWTH LENS', context:'Traffic is rising but customers are not staying', lesson:'Do not celebrate top-of-funnel growth blindly. Find the stage where value leaks: activation, conversion, retention or referral.', prompt:'Where is the biggest leak in the customer journey?', visual:['REACH','ACTIVATE','CONVERT','RETAIN'] },
  { leader:'AI PRODUCT LENS', context:'The team wants to add AI everywhere', lesson:'Start with the bottleneck, not the technology. Define the human task, where AI can assist, where human judgment stays necessary, and the outcome metric.', prompt:'What gets measurably better if AI is introduced here?', visual:['BOTTLENECK','AI ASSIST','HUMAN JUDGMENT','OUTCOME'] },
]

const ANCHOR = '2026-09-26'

function dateKeyIndia() {
  const p = getKolkataDateParts(new Date())
  return { p, key: `${p.year}-${String(p.month).padStart(2,'0')}-${String(p.date).padStart(2,'0')}` }
}

function daysBetween(a:string,b:string) {
  const aa = new Date(a+'T00:00:00Z').getTime()
  const bb = new Date(b+'T00:00:00Z').getTime()
  return Math.floor((bb-aa)/86400000)
}

function CardVisual({ title, synthesis=false }:{title:string;synthesis?:boolean}) {
  return <div style={{borderRadius:12,border:'1px solid rgba(103,232,249,.20)',background:'linear-gradient(145deg,#0B1114,#111827)',padding:10,marginTop:10,overflow:'hidden'}}>
    <svg viewBox="0 0 720 170" width="100%" role="img" aria-label={title}>
      <defs><linearGradient id="bizFlow" x1="0" x2="1"><stop offset="0%" stopColor="#164E63"/><stop offset="100%" stopColor="#1E293B"/></linearGradient></defs>
      <rect x="1" y="1" width="718" height="168" rx="12" fill="#0B1114" stroke="#334155"/>
      <text x="26" y="29" fill="#E2E8F0" fontSize="12" fontWeight="800">{synthesis ? 'WEEKLY BUSINESS MAP' : 'LIVE BUSINESS SIMULATION'}</text>
      <text x="26" y="51" fill="#94A3B8" fontSize="11">{title.length > 86 ? title.slice(0,83)+'…' : title}</text>
      <g fontFamily="Arial, sans-serif" fontSize="11" fontWeight="800">
        <rect x="24" y="75" width="132" height="38" rx="9" fill="url(#bizFlow)" stroke="#155E75"/><text x="43" y="99" fill="#CFFAFE">CUSTOMER</text>
        <text x="164" y="100" fill="#64748B" fontSize="18">→</text>
        <rect x="188" y="75" width="132" height="38" rx="9" fill="#172554" stroke="#334155"/><text x="209" y="99" fill="#DBEAFE">PROBLEM</text>
        <text x="328" y="100" fill="#64748B" fontSize="18">→</text>
        <rect x="352" y="75" width="132" height="38" rx="9" fill="url(#bizFlow)" stroke="#155E75"/><text x="371" y="99" fill="#CFFAFE">TEST / MVP</text>
        <text x="492" y="100" fill="#64748B" fontSize="18">→</text>
        <rect x="516" y="75" width="178" height="38" rx="9" fill="#1E293B" stroke="#334155"/><text x="536" y="99" fill="#E2E8F0">METRIC → DECISION</text>
      </g>
      <line x1="90" y1="137" x2="630" y2="137" stroke="#334155"/>
      <text x="26" y="156" fill="#67E8F9" fontSize="10" fontWeight="700">ASK: “What evidence would make me change my mind?”</text>
    </svg>
  </div>
}

export function LinkedInDailyCard() {
  const [tick,setTick] = useState(0)
  useEffect(() => {
    const f=()=>setTick(v=>v+1)
    const id=window.setInterval(f,60000)
    window.addEventListener('focus',f)
    return()=>{window.clearInterval(id);window.removeEventListener('focus',f)}
  },[])
  const today=useMemo(()=>dateKeyIndia(),[tick])
  const offset=Math.max(0,daysBetween(ANCHOR,today.key))
  const cycleDay=(offset%7)+1
  const row=LESSONS[offset%LESSONS.length]
  const lesson={concept:row[0],simple:row[1],analogy:row[2],example:row[3],takeaway:row[4],question:row[5],series:row[6],hook:row[7],body:row[8],cta:row[9]}
  // Rotate the executive lens every day so the lesson feels like a real mini business simulation.
  // The learner studies the decision pattern, not the celebrity.
  const businessLens=BUSINESS_LENSES[(offset+cycleDay-1)%BUSINESS_LENSES.length]
  const leaderCase=LEADER_CASES[(offset+cycleDay-1)%LEADER_CASES.length]
  const weekly=cycleDay===7
  const monthly=offset>0 && offset%30===0
  const postDay=!weekly && [1,3,5].includes(today.p.dayOfWeek)
  const action=weekly?'POST TODAY — WEEKLY SYNTHESIS':postDay?'POST TODAY':'SAVE DRAFT'
  const series=weekly?'ASHISH’S LEARNING NETWORK — Weekly Synthesis':lesson.series
  const weekRows=Array.from({length:5},(_,i)=>LESSONS[(Math.max(0,offset-4)+i)%LESSONS.length])
  const weekTitles=weekRows.map(r=>r[0])
  const synthesisBody=`This week’s connected ideas: ${weekTitles.join(' • ')}. The common thread is learning a concept, connecting it to a real business problem, and looking for evidence before making a strong claim.`
  const synthesisLearned='Separate observation, assumption, evidence, and decision.'
  const synthesisProof='Only count a real note, thoughtful comment, post, mini-analysis, or project actually completed this week.'
  const synthesisProject='Only promote work after a real, documented artifact exists.'
  const synthesisNext='Carry one concept → one analogy → one real example → one takeaway into next week.'

  return <section style={{margin:'0 0 18px',border:'1px solid rgba(59,130,246,.35)',borderRadius:16,overflow:'hidden',background:'linear-gradient(180deg,#0F172A,#0B1220)',boxShadow:'0 10px 28px rgba(0,0,0,.22)'}}>
    <div style={{padding:'15px 18px',background:'linear-gradient(90deg,rgba(37,99,235,.14),rgba(124,58,237,.08))',borderBottom:'1px solid rgba(255,255,255,.07)'}}>
      <div style={{fontSize:11,letterSpacing:1.3,fontWeight:900,color:'#93C5FD'}}>BUSINESS + LINKEDIN — DAILY 3-MINUTE CARD</div>
      <div style={{marginTop:5,fontSize:19,fontWeight:950,color:'#FFF'}}>{today.p.date} {today.p.month} {today.p.year} — {today.p.dayOfWeek===0?'SUNDAY':['','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'][today.p.dayOfWeek]}</div>
      <div style={{marginTop:4,fontSize:10,color:'#94A3B8'}}>CAT-FIRST • MAX 3 MIN • BUSINESS THINKING • {action}</div>
    </div>
    <div style={{padding:'13px 18px',display:'grid',gap:10}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:9}}>
        <div style={{padding:11,borderRadius:10,background:'rgba(34,197,94,.07)',border:'1px solid rgba(34,197,94,.16)'}}>
          <div style={{fontSize:9,color:'#86EFAC',fontWeight:900}}>3-MINUTE LESSON</div>
          <div style={{marginTop:4,color:'#FFF',fontWeight:850,fontSize:13}}>{lesson.concept}</div>
          <div style={{marginTop:5,color:'#CBD5E1',fontSize:10,lineHeight:1.55}}>{lesson.simple}</div>
        </div>
        <div style={{padding:11,borderRadius:10,background:'rgba(59,130,246,.07)',border:'1px solid rgba(59,130,246,.16)'}}>
          <div style={{fontSize:9,color:'#93C5FD',fontWeight:900}}>MEMORABLE ANALOGY</div>
          <div style={{marginTop:4,color:'#FFF',fontSize:11,lineHeight:1.55}}>{lesson.analogy}</div>
          <div style={{marginTop:6,color:'#CBD5E1',fontSize:10}}>Real example: {lesson.example}</div>
        </div>
      </div>
      <div style={{padding:12,borderRadius:11,background:'linear-gradient(135deg,rgba(14,116,144,.12),rgba(30,41,59,.72))',border:'1px solid rgba(103,232,249,.18)'}}>
        <div style={{display:'flex',justifyContent:'space-between',gap:8,alignItems:'center',flexWrap:'wrap'}}>
          <div style={{fontSize:9,color:'#67E8F9',fontWeight:900}}>BUSINESS SIMULATION • {businessLens.lens}</div>
          <div style={{fontSize:9,color:'#94A3B8'}}>ROLE: {businessLens.role}</div>
        </div>
        <div style={{marginTop:6,color:'#FFF',fontSize:11,fontWeight:850,lineHeight:1.5}}>{businessLens.move}</div>
        <div style={{marginTop:7,padding:8,borderRadius:8,background:'rgba(2,6,23,.55)',color:'#CFFAFE',fontSize:10,lineHeight:1.55}}><strong style={{color:'#67E8F9'}}>CEO / PM / FOUNDER QUESTION:</strong> {businessLens.question}</div>
        <div style={{marginTop:8,fontSize:9,color:'#A5F3FC',fontWeight:900}}>VISUALIZE THE BUSINESS</div>
        <div style={{marginTop:4,color:'#CBD5E1',fontSize:10,lineHeight:1.5}}>{businessLens.visual}</div>
      </div>
      <div style={{padding:11,borderRadius:10,background:'#111827',border:'1px solid rgba(255,255,255,.07)'}}>
        <div style={{fontSize:9,color:'#FCD34D',fontWeight:900}}>TAKEAWAY</div>
        <div style={{marginTop:4,color:'#FFF',fontSize:11,fontWeight:800}}>{lesson.takeaway}</div>
        <div style={{marginTop:6,color:'#C4B5FD',fontSize:10}}>Think: {lesson.question}</div>
      </div>
      <div style={{padding:11,borderRadius:10,background:'rgba(124,58,237,.06)',border:'1px solid rgba(124,58,237,.16)'}}>
        <div style={{fontSize:9,color:'#C4B5FD',fontWeight:900}}>{series}</div>
        <div style={{marginTop:5,color:'#FFF',fontSize:12,fontWeight:850}}>{weekly ? 'This week’s 5 connected lessons → one coherent idea.' : lesson.hook}</div>
        <div style={{marginTop:6,color:'#CBD5E1',fontSize:10,lineHeight:1.6}}>{weekly ? synthesisBody : lesson.body}</div>
        {weekly ? <div style={{marginTop:7,color:'#CBD5E1',fontSize:10,lineHeight:1.55}}>
          <div><strong style={{color:'#93C5FD'}}>Learned:</strong> {synthesisLearned}</div>
          <div style={{marginTop:4}}><strong style={{color:'#93C5FD'}}>Proof created:</strong> {synthesisProof}</div>
          <div style={{marginTop:4}}><strong style={{color:'#93C5FD'}}>Project / Featured:</strong> {synthesisProject}</div>
          <div style={{marginTop:4}}><strong style={{color:'#93C5FD'}}>Carry forward:</strong> {synthesisNext}</div>
        </div> : <div style={{marginTop:8,padding:8,borderRadius:8,background:'rgba(15,23,42,.85)',border:'1px solid rgba(148,163,184,.12)',color:'#E2E8F0',fontSize:10,lineHeight:1.6}}><strong style={{color:'#BFDBFE'}}>CAPTION:</strong><br/>{lesson.hook}<br/><br/>{lesson.body}<br/><br/><strong style={{color:'#BFDBFE'}}>Question:</strong> {lesson.cta}<br/><br/><span style={{color:'#94A3B8'}}>[PERSONALISE WITH YOUR REAL EXPERIENCE]</span></div>}
      </div>
      <div>
        <div style={{fontSize:9,color:'#93C5FD',fontWeight:900}}>REALISTIC IMAGE / VISUAL</div>
        {postDay || weekly ? <CardVisual title={weekly ? '3–5 lessons → one coherent idea' : lesson.concept} synthesis={weekly}/> : <div style={{marginTop:7,padding:10,borderRadius:9,background:'rgba(148,163,184,.05)',color:'#CBD5E1',fontSize:10}}>SAVE-DRAFT DAY — visual concept only: one real notebook/desk visual showing “{lesson.concept}”. Use your own real photo if it strengthens authenticity.</div>}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        <div style={{padding:10,borderRadius:9,background:'rgba(59,130,246,.06)'}}><div style={{fontSize:9,color:'#93C5FD',fontWeight:900}}>NETWORKING — 1 MIN</div><div style={{marginTop:4,color:'#E2E8F0',fontSize:10,lineHeight:1.55}}>One thoughtful comment on a relevant founder/product/data post. Weekly baseline: 3 comments • 2 relevant messages • 1 genuine conversation.</div></div>
        <div style={{padding:10,borderRadius:9,background:'rgba(34,197,94,.05)'}}><div style={{fontSize:9,color:'#86EFAC',fontWeight:900}}>ENGAGEMENT — 30 SEC</div><div style={{marginTop:4,color:'#E2E8F0',fontSize:10,lineHeight:1.55}}>Reply genuinely to one comment, save one useful post, or revisit one real conversation. No automation or engagement pods.</div></div>
      </div>
      <div style={{padding:10,borderRadius:9,border:'1px solid rgba(245,166,35,.16)',background:'rgba(245,166,35,.04)',fontSize:10,color:'#CBD5E1',lineHeight:1.55}}>
        <strong style={{color:'#FCD34D'}}>MBA/PDPI:</strong> structured thinking + communication. &nbsp; <strong style={{color:'#FCD34D'}}>7-year founder:</strong> repeated business observation + decision practice.
      </div>
      <div style={{padding:12,borderRadius:11,border:'1px solid rgba(96,165,250,.20)',background:'linear-gradient(135deg,rgba(15,23,42,.96),rgba(8,47,73,.34))'}}>
        <div style={{display:'flex',justifyContent:'space-between',gap:8,alignItems:'center',flexWrap:'wrap'}}>
          <div style={{fontSize:9,color:'#7DD3FC',fontWeight:900}}>REAL BUSINESS SIMULATOR • {leaderCase.leader{'}'}</div>
          <div style={{fontSize:9,color:'#94A3B8'}}>60-SECOND DECISION</div>
        </div>
        <div style={{marginTop:6,color:'#FFF',fontSize:12,fontWeight:900}}>{leaderCase.context{'}'}</div>
        <div style={{marginTop:5,color:'#CBD5E1',fontSize:10,lineHeight:1.55}}>{leaderCase.lesson{'}'}</div>
        <div style={{marginTop:8,display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:5}}>
          {leaderCase.visual.map((v,i)=><div key={v} style={{padding:'7px 4px',textAlign:'center',borderRadius:7,background:i===0?'rgba(34,211,238,.12)':'rgba(148,163,184,.07)',border:'1px solid rgba(148,163,184,.10)',color:i===0?'#A5F3FC':'#CBD5E1',fontSize:8,fontWeight:900}}>{v{'}'}</div>){'}'}
        </div>
        <div style={{marginTop:8,padding:8,borderRadius:8,background:'rgba(2,6,23,.65)',color:'#E0F2FE',fontSize:10,lineHeight:1.5}}>
          <strong style={{color:'#67E8F9'}}>YOUR DECISION:</strong> {leaderCase.prompt{'}'}<br/>
          <span style={{color:'#94A3B8'}}>Answer in one sentence. Then ask: “What evidence would change my mind?”</span>
        </div>
      </div>
      <div style={{padding:10,borderRadius:9,border:'1px solid rgba(34,211,238,.16)',background:'rgba(34,211,238,.035)',fontSize:10,color:'#CBD5E1',lineHeight:1.55}}>
        <strong style={{color:'#67E8F9'}}>LEADER CASE — {businessLens.lens}:</strong> Study the decision pattern, not the celebrity. Sundar Pichai’s public Google remarks emphasize mission, product usefulness, AI at scale and disciplined resource allocation; Tesla public materials describe first-principles, data-driven manufacturing and cost/quality optimisation. Use these as case-study prompts, not as a claim that one leader has a single secret formula.
      </div>
      <div style={{padding:10,borderRadius:9,border:'1px solid rgba(255,255,255,.07)',background:'rgba(255,255,255,.025)',fontSize:10,color:'#CBD5E1',lineHeight:1.55}}>
        <strong style={{color:'#FFF'}}>Truth gate:</strong> publish only genuine learning. Never claim an experience, result, project, credential, or expertise that was not actually completed.
      </div>
      {monthly && <div style={{padding:10,borderRadius:9,border:'1px solid rgba(168,85,247,.22)',background:'rgba(168,85,247,.05)',fontSize:10,color:'#E9D5FF',lineHeight:1.55}}><strong>MONTHLY PORTFOLIO COMPOUNDING:</strong> identify only completed, evidence-backed work that can genuinely become a Featured item, CV bullet, portfolio asset or MBA interview story.</div>}
      <div style={{fontSize:10,color:'#94A3B8',display:'flex',justifyContent:'space-between',gap:8,flexWrap:'wrap'}}><span>Series lesson {offset+1} • Weekly cycle {cycleDay}/7</span><strong style={{color:'#86EFAC'}}>LEARN → NOTE → CONNECT → {weekly||postDay?'POST':'SAVE'}</strong></div>
    </div>
  </section>
}
