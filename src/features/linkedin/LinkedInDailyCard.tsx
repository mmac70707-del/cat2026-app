import { useMemo, useState, useEffect } from 'react'
import { getKolkataDateParts } from '@/services/calendarEngine'

type Lesson = [string,string,string,string,string,string,string,string,string,string]

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
  return <div style={{borderRadius:12,border:'1px solid rgba(96,165,250,.22)',background:'#0B1220',padding:12,marginTop:10}}>
    <svg viewBox="0 0 720 150" width="100%" role="img" aria-label={title}>
      <rect x="1" y="1" width="718" height="148" rx="12" fill="#0F172A" stroke="#334155"/>
      <text x="28" y="34" fill="#F8FAFC" fontSize="16" fontWeight="800">{synthesis ? 'WEEKLY SYNTHESIS' : 'ASHISH’S LEARNING NETWORK'}</text>
      <text x="28" y="62" fill="#94A3B8" fontSize="13">{title.length > 72 ? title.slice(0,69)+'…' : title}</text>
      <g fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700">
        <rect x="28" y="88" width="135" height="34" rx="8" fill="#172554"/><text x="45" y="110" fill="#BFDBFE">OBSERVE</text>
        <text x="175" y="110" fill="#64748B" fontSize="18">→</text>
        <rect x="205" y="88" width="135" height="34" rx="8" fill="#1E293B"/><text x="222" y="110" fill="#E2E8F0">THINK</text>
        <text x="352" y="110" fill="#64748B" fontSize="18">→</text>
        <rect x="382" y="88" width="135" height="34" rx="8" fill="#172554"/><text x="399" y="110" fill="#BFDBFE">TEST / APPLY</text>
        <text x="529" y="110" fill="#64748B" fontSize="18">→</text>
        <rect x="558" y="88" width="134" height="34" rx="8" fill="#1E293B"/><text x="576" y="110" fill="#E2E8F0">LEARN</text>
      </g>
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
  const weekly=cycleDay===7
  const monthly=offset>0 && offset%30===0
  const postDay=!weekly && [1,3,5].includes(today.p.dayOfWeek)
  const action=weekly?'POST TODAY — WEEKLY SYNTHESIS':postDay?'POST TODAY':'SAVE DRAFT'
  const series=weekly?'ASHISH’S LEARNING NETWORK — Weekly Synthesis':lesson.series

  return <section style={{margin:'0 0 18px',border:'1px solid rgba(59,130,246,.35)',borderRadius:16,overflow:'hidden',background:'linear-gradient(180deg,#0F172A,#0B1220)',boxShadow:'0 10px 28px rgba(0,0,0,.22)'}}>
    <div style={{padding:'15px 18px',background:'linear-gradient(90deg,rgba(37,99,235,.14),rgba(124,58,237,.08))',borderBottom:'1px solid rgba(255,255,255,.07)'}}>
      <div style={{fontSize:11,letterSpacing:1.3,fontWeight:900,color:'#93C5FD'}}>LINKEDIN — DAILY 3-MINUTE CARD</div>
      <div style={{marginTop:5,fontSize:19,fontWeight:950,color:'#FFF'}}>{today.p.date} {today.p.month} {today.p.year} — {today.p.dayOfWeek===0?'SUNDAY':['','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'][today.p.dayOfWeek]}</div>
      <div style={{marginTop:4,fontSize:10,color:'#94A3B8'}}>CAT-FIRST • MAX 3 MIN • SECONDARY COMPOUNDING HABIT • {action}</div>
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
      <div style={{padding:11,borderRadius:10,background:'#111827',border:'1px solid rgba(255,255,255,.07)'}}>
        <div style={{fontSize:9,color:'#FCD34D',fontWeight:900}}>TAKEAWAY</div>
        <div style={{marginTop:4,color:'#FFF',fontSize:11,fontWeight:800}}>{lesson.takeaway}</div>
        <div style={{marginTop:6,color:'#C4B5FD',fontSize:10}}>Think: {lesson.question}</div>
      </div>
      <div style={{padding:11,borderRadius:10,background:'rgba(124,58,237,.06)',border:'1px solid rgba(124,58,237,.16)'}}>
        <div style={{fontSize:9,color:'#C4B5FD',fontWeight:900}}>{series}</div>
        <div style={{marginTop:5,color:'#FFF',fontSize:12,fontWeight:850}}>{weekly ? 'This week’s strongest lessons should become one coherent idea.' : lesson.hook}</div>
        <div style={{marginTop:6,color:'#CBD5E1',fontSize:10,lineHeight:1.6}}>{weekly ? 'Connect the strongest 3–5 lessons from the week. Do not invent results; use only what was actually learned or observed.' : lesson.body}</div>
        {!weekly && <div style={{marginTop:6,color:'#93C5FD',fontSize:10}}>Question/CTA: {lesson.cta}</div>}
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
      {monthly && <div style={{padding:10,borderRadius:9,border:'1px solid rgba(168,85,247,.22)',background:'rgba(168,85,247,.05)',fontSize:10,color:'#E9D5FF',lineHeight:1.55}}><strong>MONTHLY PORTFOLIO COMPOUNDING:</strong> identify only completed, evidence-backed work that can genuinely become a Featured item, CV bullet, portfolio asset or MBA interview story.</div>}
      <div style={{fontSize:10,color:'#94A3B8',display:'flex',justifyContent:'space-between',gap:8,flexWrap:'wrap'}}><span>Series lesson {offset+1} • Weekly cycle {cycleDay}/7</span><strong style={{color:'#86EFAC'}}>LEARN → NOTE → CONNECT → {weekly||postDay?'POST':'SAVE'}</strong></div>
    </div>
  </section>
}
