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
    day: 1,
    title: 'A Business Is a Problem-Solving Machine',
    paragraph: 'A business becomes valuable when it solves a real problem for people in a way they care about and can deliver repeatedly. Do not start with “How will I become rich?” Start with “What valuable problem can I solve?” A strong business understands the customer problem, creates a useful solution, delivers value, earns money from that value, and then learns how to scale. The founder mindset is to look at any company and ask what problem it noticed, who has the problem, why the solution matters, how the company makes money, and what could make the model grow.',
    takeaway: 'PROBLEM → SOLUTION → VALUE → CUSTOMER → MONEY → SCALE',
    visual: ['PROBLEM', 'SOLUTION', 'VALUE', 'MONEY', 'SCALE']
  },
  {
    day: 2,
    title: 'Find the Pain Before Building the Product',
    paragraph: 'Great founders do not fall in love with a product before understanding the customer. They look for a painful, frequent, or expensive problem and learn how people currently solve it. A weak idea says, “I built this, please use it.” A stronger idea says, “I understand this problem, and my solution makes the customer’s life meaningfully better.” This changes how you think about startups: observation comes before construction, and customer reality comes before founder excitement.',
    takeaway: 'DON’T START WITH THE PRODUCT. START WITH THE PAIN.',
    visual: ['OBSERVE', 'PAIN', 'CURRENT FIX', 'BETTER FIX']
  },
  {
    day: 3,
    title: 'Who Actually Pays?',
    paragraph: 'The person who uses a product is not always the person who pays for it. A student may use software while a company pays for it; a child may use a product while a parent buys it. This matters because a business must understand the decision-maker, the user, and the person who captures value. Thinking this way makes you sharper about customers, sales, pricing, and product design.',
    takeaway: 'USER ≠ BUYER ≠ DECISION-MAKER in every business.',
    visual: ['USER', 'BUYER', 'DECIDER', 'VALUE']
  },
  {
    day: 4,
    title: 'Why People Choose One Company Over Another',
    paragraph: 'Customers compare alternatives even when you do not see the competition directly. Your competitor may be another company, a cheaper product, doing nothing, or using an old manual process. A winning business gives customers a reason to switch or choose it: lower cost, better experience, speed, trust, convenience, status, or a result that matters more. Competitive thinking begins when you ask not only “Who competes with me?” but “What alternative does the customer use today?”',
    takeaway: 'YOUR REAL COMPETITION IS THE CUSTOMER’S BEST ALTERNATIVE.',
    visual: ['CUSTOMER', 'ALTERNATIVE', 'DIFFERENCE', 'CHOICE']
  },
  {
    day: 5,
    title: 'Revenue: How the Business Gets Paid',
    paragraph: 'Revenue is the money a business receives from customers, but the important question is why and when customers pay. Some businesses charge once, some use subscriptions, some take a commission, some sell advertising, and some combine models. Business thinking improves when you can explain the money path clearly: who pays, what they pay for, how often they pay, and what makes them continue paying.',
    takeaway: 'ALWAYS FOLLOW THE MONEY.',
    visual: ['CUSTOMER', 'OFFER', 'PRICE', 'PAYMENT', 'REPEAT']
  },
  {
    day: 6,
    title: 'Unit Economics: One Customer at a Time',
    paragraph: 'Before celebrating growth, understand the economics of one customer or one order. If a company receives ₹1,000 from a customer but spends ₹1,200 in direct costs to serve that customer, adding more customers does not magically fix the problem. Unit economics helps a founder see whether the basic transaction makes sense and where value is leaking. Growth is powerful when each unit is healthy enough to support the larger system.',
    takeaway: 'MAKE THE UNIT WORK BEFORE YOU SCALE THE SYSTEM.',
    visual: ['REVENUE', 'DIRECT COST', 'CONTRIBUTION', 'REPEAT']
  },
  {
    day: 7,
    title: 'Cash Is the Oxygen of a Business',
    paragraph: 'Profit and cash are not the same thing. A company can show accounting profit while still struggling to pay bills if cash is tied up in inventory, unpaid customer invoices, or other working-capital needs. A founder therefore watches not only sales and profit but also when money comes in and when money must go out. Cash discipline gives a business time to survive mistakes, invest in growth, and make better decisions without panic.',
    takeaway: 'PROFIT TELLS A STORY. CASH KEEPS THE BUSINESS ALIVE.',
    visual: ['MONEY IN', 'MONEY OUT', 'TIMING', 'RUNWAY']
  },
  {
    day: 8,
    title: 'Strategy Is Choosing What Not to Do',
    paragraph: 'Strategy is not a long list of goals. It is a set of choices about where to play and what you will deliberately not pursue. A company has limited people, time, money, attention, and technology. If it tries to win everywhere, it often wins nowhere. Strong leaders choose a priority, align resources behind it, accept the trade-off, and keep the organization focused long enough to produce a meaningful result.',
    takeaway: 'STRATEGY = PRIORITY + TRADE-OFF + CONSISTENT EXECUTION.',
    visual: ['OPTIONS', 'CHOICE', 'RESOURCES', 'FOCUS', 'RESULT']
  },
  {
    day: 9,
    title: 'Product Managers Think in Trade-offs',
    paragraph: 'A product team rarely gets everything it wants. More features can mean more complexity; more speed can mean more risk; more customization can make a product harder to scale. Good product thinking asks which customer problem matters most right now and what trade-off produces the best outcome. The skill is not adding everything—it is choosing the smallest useful improvement and measuring whether it actually helped.',
    takeaway: 'BUILD THE MOST IMPORTANT THING, NOT THE MOST THINGS.',
    visual: ['USER PAIN', 'CHOICE', 'TRADE-OFF', 'METRIC']
  },
  {
    day: 10,
    title: 'Distribution Can Beat a Brilliant Idea',
    paragraph: 'Two companies can build similar products and still achieve completely different outcomes because one reaches customers more effectively. Distribution means the system through which a product is discovered, trusted, bought, and delivered. Search, sales teams, partnerships, communities, stores, platforms, and referrals are all distribution mechanisms. A founder must therefore ask not only “Can we build it?” but “How will the right people reliably find and adopt it?”',
    takeaway: 'A GREAT PRODUCT WITHOUT DISTRIBUTION CAN STAY INVISIBLE.',
    visual: ['PRODUCT', 'REACH', 'TRUST', 'ADOPTION', 'RETENTION']
  },
  {
    day: 11,
    title: 'A Moat Is What Gets Harder to Copy',
    paragraph: 'A temporary advantage is not the same as a durable advantage. A competitor can copy a feature, design, or marketing message quickly. A stronger moat may come from network effects, trusted brand, switching costs, proprietary data, cost advantages, distribution, scale, or a capability that improves with time. The founder question is simple: “What becomes harder to copy after we win?”',
    takeaway: 'WINNING ONCE IS NOT ENOUGH; BUILD SOMETHING THAT COMPOUNDS.',
    visual: ['FEATURE', 'ADVANTAGE', 'REPEAT', 'MOAT']
  },
  {
    day: 12,
    title: 'Leadership Is Resource Allocation',
    paragraph: 'A CEO cannot personally do every important task. Leadership becomes real when the leader decides where the organization’s people, money, attention, and time should go. Putting resources behind the right priorities means saying no to good ideas that are less important. Great leadership is therefore partly a discipline of focus: the team should understand what matters now, why it matters, and what will not receive attention.',
    takeaway: 'WHAT YOU FUND, STAFF, AND FOCUS ON BECOMES YOUR REAL STRATEGY.',
    visual: ['VISION', 'PRIORITY', 'RESOURCES', 'EXECUTION']
  },
  {
    day: 13,
    title: 'AI Should Solve a Bottleneck, Not Decorate a Product',
    paragraph: 'Adding AI everywhere is not the same as creating value with AI. Start with the human task or business bottleneck: slow analysis, repetitive support, difficult forecasting, poor search, or expensive operations. Then decide where AI can assist, where human judgment must remain, and which outcome should improve. This keeps technology connected to business value instead of turning it into a feature looking for a purpose.',
    takeaway: 'START WITH THE BOTTLENECK. THEN CHOOSE THE TECHNOLOGY.',
    visual: ['BOTTLENECK', 'AI ASSIST', 'HUMAN JUDGMENT', 'OUTCOME']
  },
  {
    day: 14,
    title: 'Founder Thinking: Learn Faster Than the Problem Changes',
    paragraph: 'Entrepreneurship is uncertainty managed through learning. A founder rarely knows the perfect answer at the beginning, so the skill is to form a sensible hypothesis, test it in the real world, observe the result, and improve the next decision. Speed matters, but blind speed does not. The strongest loop is fast learning: idea → test → evidence → decision → next test.',
    takeaway: 'DON’T TRY TO BE RIGHT IMMEDIATELY. BUILD A SYSTEM THAT LEARNS QUICKLY.',
    visual: ['IDEA', 'TEST', 'EVIDENCE', 'DECISION', 'NEXT']
  }
]


type StreakState = {
  completedDates: string[]
  current: number
  best: number
}

const STREAK_KEY = 'brm-streak-v1'
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

function getLessonForToday() {
  const start = Date.UTC(2026, 9, 5)
  const [year, month, day] = getKolkataDateKey().split('-').map(Number)
  const current = Date.UTC(year, month - 1, day)
  const diff = Math.max(0, Math.floor((current - start) / 86400000))
  const index = diff % LESSONS.length
  return LESSONS[index]
}


function daysBetween(a: string, b: string) {
  const [ay, am, ad] = a.split('-').map(Number)
  const [by, bm, bd] = b.split('-').map(Number)
  const ms = Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)
  return Math.round(ms / 86400000)
}

function buildStreak(dates: string[]): StreakState {
  const completedDates = Array.from(new Set(dates)).sort()
  if (!completedDates.length) return { completedDates: [], current: 0, best: 0 }

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
  return { completedDates, current, best }
}
export function BRMPage({ onBack }: { onBack?: () => void }) {
  const lesson = getLessonForToday()
  const progress = ((lesson.day - 1) / (LESSONS.length - 1)) * 100
  const today = getKolkataDateKey()
  const [streak, setStreak] = useState<StreakState>({ completedDates: [], current: 0, best: 0 })

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STREAK_KEY)
      if (!saved) return
      const parsed = JSON.parse(saved) as Partial<StreakState>
      if (Array.isArray(parsed.completedDates)) setStreak(buildStreak(parsed.completedDates))
    } catch {
      // Keep the UI usable even when local storage is unavailable.
    }
  }, [])

  const isDoneToday = streak.completedDates.includes(today)

  const markDone = () => {
    if (isDoneToday) return
    const next = buildStreak([...streak.completedDates, today])
    setStreak(next)
    try {
      window.localStorage.setItem(STREAK_KEY, JSON.stringify(next))
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
            <div style={{ fontSize: 10, fontWeight: 900, color: '#F5A623', letterSpacing: 1.2 }}>DAY {lesson.day} • READ TODAY</div>
            <div style={{ fontSize: 13, color: '#A5B4FC', marginTop: 5 }}>No PDF hunting • No article hunting • Just read</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 8, marginLeft: 'auto' }}>
            <div style={{ minWidth: 126, padding: '9px 10px', borderRadius: 13, border: '1px solid rgba(245,166,35,.38)', background: 'rgba(245,166,35,.10)', textAlign: 'right', boxShadow: '0 8px 24px rgba(245,166,35,.08)' }}>
              <div style={{ fontSize: 9, fontWeight: 950, letterSpacing: 1, color: '#FDBA4B' }}>🔥 BEST STREAK</div>
              <div style={{ marginTop: 2, fontSize: 21, fontWeight: 950, lineHeight: 1 }}>{streak.best} <span style={{ fontSize: 10, color: '#CBD5E1' }}>days</span></div>
              <div style={{ marginTop: 4, fontSize: 9, color: '#CBD5E1' }}>CURRENT {streak.current}</div>
            </div>
            <div style={{ minWidth: 120 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94A3B8', marginBottom: 5 }}><span>CURRICULUM</span><span>{lesson.day}/{LESSONS.length}</span></div>
              <div style={{ height: 7, borderRadius: 999, background: 'rgba(255,255,255,.08)', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg,#22C55E,#63F6FF)' }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, fontSize: 24, fontWeight: 950, lineHeight: 1.15 }}>{lesson.title}</div>

        <div style={{ marginTop: 16, fontSize: 15, lineHeight: 1.85, color: '#E2E8F0' }}>
          {lesson.paragraph}
        </div>

        <div style={{ marginTop: 16, padding: 14, borderRadius: 14, border: '1px solid rgba(245,166,35,.28)', background: 'rgba(245,166,35,.07)' }}>
          <div style={{ fontSize: 10, fontWeight: 900, color: '#F5A623', letterSpacing: 1 }}>MEMORY LINE</div>
          <div style={{ marginTop: 5, fontSize: 18, fontWeight: 900, lineHeight: 1.35 }}>{lesson.takeaway}</div>
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1, color: '#63F6FF', marginBottom: 8 }}>BUSINESS VISUAL</div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${lesson.visual.length}, minmax(0,1fr))`, gap: 7 }}>
            {lesson.visual.map((step, i) => (
              <div key={step} style={{ minHeight: 58, padding: '10px 8px', borderRadius: 11, border: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.035)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', fontSize: 10, fontWeight: 900 }}>
                <span style={{ fontSize: 17, opacity: .55 }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ marginTop: 4 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={markDone} disabled={isDoneToday} style={{ marginTop: 18, width: '100%', border: isDoneToday ? '1px solid rgba(34,197,94,.32)' : '1px solid rgba(99,246,255,.34)', background: isDoneToday ? 'rgba(34,197,94,.10)' : 'rgba(99,246,255,.08)', color: isDoneToday ? '#86EFAC' : '#A5F3FC', borderRadius: 13, padding: '12px 14px', cursor: isDoneToday ? 'default' : 'pointer', fontWeight: 950, letterSpacing: .8 }}>
          {isDoneToday ? `✅ TODAY COMPLETE • CURRENT STREAK ${streak.current}` : 'MARK TODAY DONE → BUILD THE STREAK'}
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
        DAY {lesson.day} → NEXT BUSINESS LESSON TOMORROW • CAT FIRST 🔒
      </div>

      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ marginTop: 12, width: '100%', border: '1px solid rgba(99,246,255,.22)', background: 'rgba(99,246,255,.05)', color: '#A5F3FC', borderRadius: 12, padding: '10px 12px', cursor: 'pointer' }}>
        ↑ BACK TO TOP
      </button>
    </div>
  )
}
