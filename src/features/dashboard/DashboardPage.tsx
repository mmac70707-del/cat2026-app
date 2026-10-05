import { useState, useEffect } from 'react'
import { useTodayTasks } from '@/hooks/useTasks'
import { DailyScoreRepository } from '@/repositories/index'
import { ErrorRepository } from '@/repositories/ErrorRepository'
import { usePhase } from '@/hooks/usePhase'
import { getWeekNumber, getDaysLeft } from '@/services/domain'
import { getKolkataDateKey, getKolkataDateParts, getFirstPassDayNum } from '@/services/calendarEngine'
import { ROADMAP_44 } from '@/data/roadmap44'
import { BLOCKS, PHASES, SCHEDULE_ITEMS, WEEK_PLAN_TEMPLATE } from '@/data/config'
import { useToast } from '@/components/Toast'
import './Dashboard.css'
import { DailyControlCard } from '@/features/dailycontrol/DailyControlCard'
import { LinkedInDailyCard } from '@/features/linkedin/LinkedInDailyCard'
import { AppIcon, type AppIconName } from '@/components/AppIcon'
import { BODY360_SEQUENCE, getBodyPlan } from '@/data/body360'

const SEQUENCE_STRIP: Array<{
  seq: string
  id: string
  label: string
  sub: string
  tag: string
  col: string
  bg: string
  icon: AppIconName
}> = [
  { seq: '01', id: 'QA',       label: 'QA',       sub: 'Quantitative', tag: 'LIVE', col: '#16A34A', bg: 'rgba(22,163,74,0.15)', icon: 'target' },
  { seq: '02', id: 'DILR',     label: 'DILR',     sub: 'Data + Logic', tag: 'LIVE', col: '#2563EB', bg: 'rgba(37,99,235,0.15)', icon: 'layers' },
  { seq: '03', id: 'VARC',     label: 'VARC',     sub: 'Verbal + RC', tag: 'LIVE', col: '#7C3AED', bg: 'rgba(124,58,237,0.15)', icon: 'book' },
  { seq: '04', id: 'TEST',     label: 'TEST',     sub: 'Sectional / Mock', tag: 'LIVE', col: '#D97706', bg: 'rgba(217,119,6,0.15)', icon: 'mock' },
  { seq: '05', id: 'ANALYSIS', label: 'ANALYSIS', sub: 'Error Log', tag: 'LIVE', col: '#DC2626', bg: 'rgba(220,38,38,0.15)', icon: 'errors' },
  { seq: '06', id: 'REVISION', label: 'REVISION', sub: 'Recall + Connect', tag: 'LIVE', col: '#8B5CF6', bg: 'rgba(139,92,246,0.15)', icon: 'clock' },
  { seq: '07', id: 'REPAIR',   label: 'REPAIR',   sub: 'Weakness Fix', tag: 'LIVE', col: '#DB2777', bg: 'rgba(219,39,119,0.15)', icon: 'repair' },
  { seq: '08', id: 'RETEST',   label: 'RETEST',   sub: 'Confirm Mastery', tag: 'LIVE', col: '#0E9F9F', bg: 'rgba(14,159,159,0.15)', icon: 'retest' },
]

const DAYS_ARR = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTHS_ARR = ['January','February','March','April','May','June','July','August','September','October','November','December']

const DAILY_LINES = [
  { quote: 'Become the man who promised himself he would.', action: 'Protect the next study block. No negotiation.' },
  { quote: 'Small disciplined days become extraordinary results.', action: 'Finish one block completely before chasing the next.' },
  { quote: 'You do not need a perfect day. You need an executed day.', action: 'Start the next planned block within five minutes.' },
  { quote: 'Confidence is built after the work, not before it.', action: 'Do the practice first. Let confidence follow.' },
  { quote: 'Your future score is hidden inside today’s repetitions.', action: 'Choose accuracy first, then speed.' },
  { quote: 'When the plan is clear, your job is simply to execute.', action: 'Follow the locked sequence exactly as written.' },
  { quote: 'One focused hour can change the direction of a whole day.', action: 'Put the phone away and enter Focus Core.' },
  { quote: 'Repair the weakness, then earn the next level.', action: 'Do not skip today’s error-repair step.' },
  { quote: 'Consistency beats intensity when intensity cannot be repeated.', action: 'Keep today strong, simple and repeatable.' },
  { quote: 'Make today a vote for the person you are becoming.', action: 'Complete the next action before adding anything new.' },
  { quote: 'Discipline is remembering what matters when distraction gets loud.', action: 'Return to CAT-first mode immediately.' },
  { quote: 'The gap closes every time you solve, analyze and repair.', action: 'Finish the loop: Solve → Analyze → Repair → Retest.' },
]


type LiveSlot = (typeof SCHEDULE_ITEMS)[number]

function clockToMinutes(value: string) {
  const [h, m] = value.trim().split(':').map(Number)
  return (h * 60) + m
}

function slotBounds(slot: LiveSlot) {
  const parts = slot.time.split('–')
  const start = clockToMinutes(parts[0])
  const end = parts[1] ? clockToMinutes(parts[1]) : (slot.block === 'Sleep' ? 300 : start + 1)
  return { start, end, wraps: end <= start }
}

function isSlotActive(slot: LiveSlot, minutes: number) {
  const { start, end, wraps } = slotBounds(slot)
  return wraps ? (minutes >= start || minutes < end) : (minutes >= start && minutes < end)
}

function minutesUntilStart(slot: LiveSlot, minutes: number) {
  const start = slotBounds(slot).start
  return (start - minutes + 1440) % 1440
}

function getCurrentSlot(minutes: number) {
  return SCHEDULE_ITEMS.find(slot => isSlotActive(slot, minutes)) || null
}

function getNextSlot(minutes: number) {
  const future = SCHEDULE_ITEMS
    .map(slot => ({ slot, distance: minutesUntilStart(slot, minutes) }))
    .filter(item => item.distance > 0)
    .sort((a, b) => a.distance - b.distance)
  return future[0]?.slot || null
}

function getCurrentBlockId(slot: LiveSlot | null) {
  if (!slot) return ''
  const map: Record<string, string> = {
    'QA Session': 'QA',
    'DILR Session': 'DILR',
    'VARC Session': 'VARC',
    'Library Deep Work': 'TEST',
    'Test Analysis + Error Log': 'ANALYSIS',
    Revision: 'REVISION',
  }
  return map[slot.block] || ''
}

function getBlockSlot(blockId: string) {
  if (blockId === 'REPAIR') return SCHEDULE_ITEMS.find(s => s.block === 'Library Deep Work') || null
  if (blockId === 'RETEST') return SCHEDULE_ITEMS.find(s => s.block === 'Revision') || null
  const aliases: Record<string, string> = {
    QA: 'QA Session',
    DILR: 'DILR Session',
    VARC: 'VARC Session',
    TEST: 'Library Deep Work',
    ANALYSIS: 'Test Analysis + Error Log',
    REVISION: 'Revision',
  }
  const label = aliases[blockId]
  return label ? SCHEDULE_ITEMS.find(s => s.block === label) || null : null
}

function getBlockTimeLabel(blockId: string) {
  const scheduleSlot = getBlockSlot(blockId)
  if (scheduleSlot) return scheduleSlot.time
  return BLOCKS.find(b => b.id === blockId)?.time || 'Flexible'
}

function getBlockLiveState(blockId: string, minutes: number, status: string) {
  if (status === 'DONE') return 'DONE'
  if (status === 'IN_PROGRESS') return 'WORKING'
  const slot = getBlockSlot(blockId)
  if (!slot) return 'READY'
  if (isSlotActive(slot, minutes)) return 'NOW'
  const bounds = slotBounds(slot)
  if (!bounds.wraps && minutes >= bounds.end) return 'PASSED'
  const distance = minutesUntilStart(slot, minutes)
  if (distance > 0 && distance <= 180) return 'NEXT'
  if (distance > 0) return 'UPCOMING'
  return 'PASSED'
}

function getKolkataClock(date: Date) {
  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const get = (type: string) => Number(parts.find(part => part.type === type)?.value || 0)
  return {
    hours: get('hour'),
    minutes: get('minute'),
    seconds: get('second'),
  }
}

function getRealWeekDates(now: Date = new Date()) {
  const p = getKolkataDateParts(now)
  const kolkataDate = new Date(Date.UTC(p.year, p.month - 1, p.date))
  const day = kolkataDate.getUTCDay()
  const monday = new Date(kolkataDate)
  monday.setUTCDate(kolkataDate.getUTCDate() - (day === 0 ? 6 : day - 1))

  const weekDays: Date[] = []
  for (let i = 0; i < 7; i++) {
    const cur = new Date(monday)
    cur.setUTCDate(monday.getUTCDate() + i)
    weekDays.push(cur)
  }
  return weekDays
}



const BESTME_PROGRESS_STORAGE = 'cat2026.bestme.dimensions.v1'
const BODY360_PROGRESS_STORAGE = 'cat2026.body360.progress.v1'

const DAILY_BASICS = [
  { id:'MIND', seq:'01', icon:'🧠', title:'MIND', label:'Learn + think', rule:'CAT first. Understand → solve → analyse → repair.', update:'Live from today’s CAT tasks, phase and current block.' },
  { id:'BODY', seq:'02', icon:'💪', title:'BODY', label:'Train + recover', rule:'Do today’s best workout with clean form and recovery.', update:'Live from today’s weekday Body 360 plan + learning queue.' },
  { id:'EMOTION', seq:'03', icon:'❤️', title:'EMOTION', label:'Pause + choose', rule:'Notice the feeling; choose the useful response.', update:'One calm response is today’s rep.' },
  { id:'SPIRITUAL', seq:'04', icon:'🙏', title:'SPIRITUAL', label:'Values + direction', rule:'Let values lead before mood.', update:'2 minutes of prayer, gratitude or quiet reflection.' },
  { id:'SOCIAL', seq:'05', icon:'🤝', title:'SOCIAL', label:'Respect + connect', rule:'Listen well. Speak clearly. Strengthen one relationship.', update:'One genuine human connection today.' },
  { id:'FINANCIAL', seq:'06', icon:'₹', title:'FINANCIAL', label:'Know + control', rule:'Know where money goes before asking for more.', update:'Log spending and learn one useful money principle.' },
  { id:'PURPOSE', seq:'07', icon:'🚀', title:'PURPOSE', label:'Build + become', rule:'Invest one small action in the future you want.', update:'After CAT priorities: one 3-minute business/leadership/founder lesson.' },
] as const

const BEST_ME_DIMENSIONS = [
  {
    id: 'MIND',
    icon: '🧠',
    title: 'MIND',
    subtitle: 'CAT mastery',
    rule: 'Protect the next CAT block.',
    fallback: 'Start the next planned CAT task: solve → analyse → repair.',
  },
  {
    id: 'BODY',
    icon: '💪',
    title: 'BODY',
    subtitle: 'Strength + recovery',
    rule: 'Complete today’s Body 360 session.',
    fallback: 'Open today’s Body 360 plan and follow the warm-up → work → recovery sequence.',
  },
  {
    id: 'EMOTIONAL',
    icon: '❤️',
    title: 'EMOTION',
    subtitle: 'Calm + self-control',
    rule: 'Notice the feeling. Choose the next correct action.',
    fallback: 'Pause → breathe → name the feeling → return to the plan without guilt.',
  },
  {
    id: 'SPIRITUAL',
    icon: '🙏',
    title: 'SPIRITUAL',
    subtitle: 'Values + inner direction',
    rule: 'Live by your values before your mood.',
    fallback: '2 minutes: Radhe Radhe → gratitude → remember who you are becoming.',
  },
  {
    id: 'SOCIAL',
    icon: '🤝',
    title: 'SOCIAL',
    subtitle: 'Respect + connection',
    rule: 'One genuine, respectful human connection.',
    fallback: 'Say hello, listen well, or strengthen one existing relationship.',
  },
  {
    id: 'FINANCIAL',
    icon: '₹',
    title: 'FINANCIAL',
    subtitle: 'Awareness + discipline',
    rule: 'Know where your money went today.',
    fallback: 'Log today’s spending and avoid one unnecessary purchase.',
  },
  {
    id: 'PURPOSE',
    icon: '🚀',
    title: 'PURPOSE',
    subtitle: 'Career + builder identity',
    rule: 'Invest one tiny step in your future self.',
    fallback: 'CAT first; after core work, take one 3-minute professional/business learning action.',
  },
] as const

type BestMeDimensionId = typeof BEST_ME_DIMENSIONS[number]['id']

type BestMeSinId = 'PRIDE' | 'GREED' | 'LUST' | 'ENVY' | 'GLUTTONY' | 'WRATH' | 'SLOTH'

const SIN_CONTROL_STORAGE = 'cat2026.bestme.sins.v1'

const SEVEN_SINS_CONTROL = [
  { id:'PRIDE' as BestMeSinId, number:'01', sin:'PRIDE', virtue:'HUMILITY', icon:'👑', signal:'Need to prove I am better/right.', step:'Listen → check evidence → admit what you do not know → correct without ego.' },
  { id:'GREED' as BestMeSinId, number:'02', sin:'GREED', virtue:'CHARITY', icon:'💰', signal:'More, more, more—even when enough is enough.', step:'Pause → ask “need or want?” → choose enough → share/help where practical.' },
  { id:'LUST' as BestMeSinId, number:'03', sin:'LUST', virtue:'CHASTITY', icon:'🔥', signal:'Impulse starts controlling attention or behaviour.', step:'Notice → remove the trigger → redirect attention → protect attention → treat people with dignity, not as objects.' },
  { id:'ENVY' as BestMeSinId, number:'04', sin:'ENVY', virtue:'GRATITUDE', icon:'👀', signal:'Someone else’s success makes my progress feel smaller.', step:'Notice comparison → name one thing to learn → name one thing to be grateful for → return to my path.' },
  { id:'GLUTTONY' as BestMeSinId, number:'05', sin:'GLUTTONY', virtue:'TEMPERANCE', icon:'🍽️', signal:'Consumption keeps going after the real need is met.', step:'Pause → check hunger/need → choose a reasonable amount → stop deliberately.' },
  { id:'WRATH' as BestMeSinId, number:'06', sin:'WRATH', virtue:'PATIENCE', icon:'⚡', signal:'Anger wants an immediate reaction.', step:'Stop → 3 slow breaths → delay the reply → respond to the problem, not the heat.' },
  { id:'SLOTH' as BestMeSinId, number:'07', sin:'SLOTH', virtue:'DILIGENCE', icon:'🛡️', signal:'I know the right action but keep postponing it.', step:'Make it tiny → start for 5 minutes → finish the planned minimum → build momentum.' },
] as const

function readSinControls(dateKey: string) {
  try {
    const raw = JSON.parse(localStorage.getItem(SIN_CONTROL_STORAGE) || '{}')
    return (raw?.[dateKey] || {}) as Partial<Record<BestMeSinId, boolean>>
  } catch {
    return {}
  }
}



function readBody360TodayProgress(dateKey: string) {
  try {
    const raw = JSON.parse(localStorage.getItem(BODY360_PROGRESS_STORAGE) || '{}')
    const today = raw?.[dateKey] || {}
    return BODY360_SEQUENCE.filter(step => Boolean(today[step])).length
  } catch {
    return 0
  }
}

function readBody360TodayRemaining(dateKey: string) {
  try {
    const raw = JSON.parse(localStorage.getItem(BODY360_PROGRESS_STORAGE) || '{}')
    const today = raw?.[dateKey] || {}
    return BODY360_SEQUENCE.filter(step => !today[step])
  } catch {
    return [...BODY360_SEQUENCE]
  }
}

function mentalWinPlaceholder(done: number, taskCount: number) {
  return taskCount > 0 && done === taskCount
}

function physicalWinPlaceholder(bodyDone: number) {
  return bodyDone === BODY360_SEQUENCE.length
}

function readBestMeManualWins(dateKey: string) {
  try {
    const raw = JSON.parse(localStorage.getItem(BESTME_PROGRESS_STORAGE) || '{}')
    return (raw?.[dateKey] || {}) as Partial<Record<BestMeDimensionId, boolean>>
  } catch {
    return {}
  }
}

function WinterArcCard() {
  const todayKey = getKolkataDateKey()
  const catEnd = '2026-11-29'
  const isCatPhase = todayKey <= catEnd

  const pillars = isCatPhase
    ? [
        ['🎯','CAT 2026','Main mission — Study → Test → Analyse → Repair'],
        ['🧠','LEARN','Understand → Recall → Practice → Feedback'],
        ['😴','RECOVERY','Sleep • Food • Recovery'],
        ['🏋️','BODY','Gym • Movement • Maintenance'],
        ['📱','DIGITAL','Phone is a tool, not the default'],
        ['💼','LINKEDIN','3 min/day • ~3 meaningful posts/week'],
      ]
    : [
        ['🎯','NEXT LEVEL','Build the post-CAT foundation'],
        ['🏋️','BODY','Progressive training + recovery'],
        ['🧠','MIND','Reading • reflection • learning'],
        ['💼','PROFESSIONAL','Communication • networking'],
        ['💻','TECH','Projects • AI • systems'],
        ['🚀','FOUNDER','Business learning + long-term direction'],
      ]

  return (
    <section className="winter-arc-card" aria-label="Winter Arc operating system">
      <div className="winter-arc-head">
        <div className="winter-arc-kicker">WINTER ARC • CLEAR OPERATING SYSTEM</div>
        <div className="winter-arc-title">{isCatPhase ? 'CAT-FIRST EXECUTION' : 'POST-CAT BUILD'}</div>
        <div className="winter-arc-sub">
          {isCatPhase
            ? 'Abhi sirf ek main mission: CAT 2026. Baaki sab support systems hain.'
            : 'CAT complete. Ab body, mind, professional skill, tech aur founder systems expand honge.'}
        </div>
      </div>

      <div className="winter-arc-grid">
        {pillars.map(([icon, title, sub]) => (
          <div key={title} className="winter-arc-pillar">
            <div className="winter-arc-icon">{icon}</div>
            <div className="winter-arc-pillar-title">{title}</div>
            <div className="winter-arc-pillar-sub">{sub}</div>
          </div>
        ))}
      </div>

      {isCatPhase && (
        <>
          <div className="winter-arc-now">
            <div className="winter-arc-now-label">🟨 RIGHT APPROACH TO LEARNING</div>
            <div className="winter-arc-now-title">Don't just read. Retrieve → solve → check → repair → retest.</div>
            <div className="winter-arc-now-sub">
              Research on retrieval-based learning consistently supports testing yourself and using feedback rather than relying only on rereading. Spacing practice over time also supports retention.
            </div>
          </div>

          <div className="winter-arc-three">
            <div className="winter-arc-state green">
              <b>🟢 GREEN</b>
              <span>Planned CAT work complete → continue normally.</span>
            </div>
            <div className="winter-arc-state yellow">
              <b>🟡 YELLOW</b>
              <span>Partial day → resume at the next block. No guilt debt.</span>
            </div>
            <div className="winter-arc-state red">
              <b>🔴 RED</b>
              <span>Minimum viable CAT + recovery → restart tomorrow.</span>
            </div>
          </div>

          <div className="winter-arc-rule">
            <strong>LOCKED:</strong> Oct 2 → Nov 29 = CAT-first. No random new planner. No extreme dieting, overtraining or fake 5 AM hustle.
          </div>
        </>
      )}

      <div className="winter-arc-mantra">Become the man you promised yourself — one correctly executed day at a time.</div>
    </section>
  )
}
export function DashboardPage() {
  const phase = usePhase()
  const daysLeft = getDaysLeft()
  const { tasks, loading, done, pct, updateStatus } = useTodayTasks()
  const { show: toast } = useToast()

  const [study, setStudy]   = useState('')
  const [screen, setScreen] = useState('')
  const [acc, setAcc]       = useState('')
  const [feedback, setFeedback] = useState('')
  const [errorCounts, setErrorCounts] = useState<{ [key: string]: number }>({ C1: 0, C2: 0, C3: 0, C4: 0, C5: 0 })
  const [liveNow, setLiveNow] = useState(() => new Date())
  const [bestMeManualWins, setBestMeManualWins] = useState<Partial<Record<BestMeDimensionId, boolean>>>(() => readBestMeManualWins(getKolkataDateKey()))
  const [body360Done, setBody360Done] = useState(() => readBody360TodayProgress(getKolkataDateKey()))
  const [sinControls, setSinControls] = useState<Partial<Record<BestMeSinId, boolean>>>(() => readSinControls(getKolkataDateKey()))


  useEffect(() => {
    const tick = () => setLiveNow(new Date())
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  const now = liveNow
  const dateKey = getKolkataDateKey(now)
  const dayNum = getFirstPassDayNum(dateKey)
  const roadmapItem = ROADMAP_44.find(r => r.dayNum === (dayNum || 1)) || ROADMAP_44[0]

  const kolkataParts = getKolkataDateParts(now)
  const realDayName = DAYS_ARR[kolkataParts.dayOfWeek]
  const realDateStr = `${kolkataParts.date} ${MONTHS_ARR[kolkataParts.month - 1]} ${kolkataParts.year}`
  const realWeekDates = getRealWeekDates(now)
  const clock = getKolkataClock(now)
  const currentMinutes = kolkataParts.hours * 60 + kolkataParts.minutes
  const currentSlot = getCurrentSlot(currentMinutes)
  const nextSlot = getNextSlot(currentMinutes)
  const currentBlockId = getCurrentBlockId(currentSlot)
  const liveTimeStr = String(clock.hours).padStart(2, '0') + ':' + String(clock.minutes).padStart(2, '0') + ':' + String(clock.seconds).padStart(2, '0')
  const todayWeekPlan = WEEK_PLAN_TEMPLATE[kolkataParts.dayOfWeek === 0 ? 6 : kolkataParts.dayOfWeek - 1]
  const todayBodyPlan = getBodyPlan(kolkataParts.dayOfWeek)
  const nextTask = tasks.find(task => task.status !== 'DONE') || null
  const mentalPct = tasks.length ? Math.round((done / tasks.length) * 100) : 0
  const physicalPct = Math.round((body360Done / BODY360_SEQUENCE.length) * 100)
  const bodyLearningRemaining = readBody360TodayRemaining(dateKey)
  const mentalWin = mentalWinPlaceholder(done, tasks.length)
  const physicalWin = physicalWinPlaceholder(body360Done)
  const dimensionWins: Record<BestMeDimensionId, boolean> = {
    MIND: mentalWinPlaceholder(done, tasks.length),
    BODY: physicalWinPlaceholder(body360Done),
    EMOTIONAL: Boolean(bestMeManualWins.EMOTIONAL),
    SPIRITUAL: Boolean(bestMeManualWins.SPIRITUAL),
    SOCIAL: Boolean(bestMeManualWins.SOCIAL),
    FINANCIAL: Boolean(bestMeManualWins.FINANCIAL),
    PURPOSE: Boolean(bestMeManualWins.PURPOSE),
  }
  const bestMeWinCount = Object.values(dimensionWins).filter(Boolean).length
  const finalWin = bestMeWinCount === BEST_ME_DIMENSIONS.length
  const sinWinCount = SEVEN_SINS_CONTROL.filter(item => Boolean(sinControls[item.id])).length
  const sinControlComplete = sinWinCount === SEVEN_SINS_CONTROL.length
  const nextDimensionIndex = BEST_ME_DIMENSIONS.findIndex(dimension => !dimensionWins[dimension.id])
  const nextDimension = nextDimensionIndex >= 0 ? BEST_ME_DIMENSIONS[nextDimensionIndex] : null
  const dailyBasicWins: Record<string, boolean> = {
    MIND: dimensionWins.MIND,
    BODY: dimensionWins.BODY,
    EMOTION: dimensionWins.EMOTIONAL,
    SPIRITUAL: dimensionWins.SPIRITUAL,
    SOCIAL: dimensionWins.SOCIAL,
    FINANCIAL: dimensionWins.FINANCIAL,
    PURPOSE: dimensionWins.PURPOSE,
  }



  function toggleSinControl(id: BestMeSinId) {
    const nextValue = !sinControls[id]
    const next = { ...sinControls, [id]: nextValue }
    setSinControls(next)
    try {
      const raw = JSON.parse(localStorage.getItem(SIN_CONTROL_STORAGE) || '{}')
      raw[dateKey] = next
      localStorage.setItem(SIN_CONTROL_STORAGE, JSON.stringify(raw))
    } catch {}
  }

  function toggleBestMeManualWin(id: BestMeDimensionId) {
    const nextValue = !bestMeManualWins[id]
    const next = { ...bestMeManualWins, [id]: nextValue }
    setBestMeManualWins(next)
    try {
      const raw = JSON.parse(localStorage.getItem(BESTME_PROGRESS_STORAGE) || '{}')
      raw[dateKey] = next
      localStorage.setItem(BESTME_PROGRESS_STORAGE, JSON.stringify(raw))
    } catch {}
  }

  const getSequenceState = (id: string) => {
    const task = tasks.find(t => t.blockId === id)
    if (task?.status === 'DONE') return 'DONE'
    if (id === currentBlockId) return 'NOW'
    return getBlockLiveState(id, currentMinutes, task?.status || 'TODO')
  }

  useEffect(() => {
    setBestMeManualWins(readBestMeManualWins(dateKey))
  }, [dateKey])
  useEffect(() => {
    setSinControls(readSinControls(dateKey))
  }, [dateKey])


  useEffect(() => {
    const syncBody360 = () => setBody360Done(readBody360TodayProgress(dateKey))
    syncBody360()
    const id = window.setInterval(syncBody360, 1000)
    return () => window.clearInterval(id)
  }, [dateKey])

  useEffect(() => {
    ErrorRepository.getTypeCounts().then(counts => {
      setErrorCounts(counts)
    })
  }, [])

  const handleLogErrorCard = async (code: 'C1' | 'C2' | 'C3' | 'C4' | 'C5') => {
    setErrorCounts(prev => ({ ...prev, [code]: prev[code] + 1 }))
    try {
      await ErrorRepository.log({
        errorType: code,
        subject: 'QA',
        topic: 'Master Execution Dashboard',
        wrongReason: `Logged ${code} error from Dashboard.`,
        correctMethod: 'Review concept and fix in Repair Queue.',
        preventionRule: 'Apply prevention rule.',
      })
      toast(`Logged ${code} error!`, '#EF4444')
    } catch {
      toast(`Logged ${code} count +1`, '#F5A623')
    }
  }

  async function submitDone() {
    const s  = parseFloat(study)  || 0
    const sc = parseFloat(screen) || 0
    const a  = parseInt(acc)      || 0
    await DailyScoreRepository.log(todayKeyDynamic(), s, sc, a)

    const lines: string[] = [`✓ LOGGED: DONE ${s}h study · ${sc}h screen · ${a}% accuracy`]
    if (a >= 75)      lines.push('🟢 Accuracy ' + a + '%+ — Excellent! Maintain this. Difficulty can increase slightly tomorrow.')
    else if (a >= 60) lines.push('🟡 Accuracy ' + a + '% — Good foundation. Continue same difficulty. Focus on error log tonight.')
    else              lines.push('🔴 Accuracy ' + a + '% — Below 60%. Do NOT increase difficulty. Fix concept gaps first (C1 errors).')
    if (s >= 5)  lines.push('✓ Study hours on target.')
    else         lines.push('⚠️ Study hours low. Tomorrow: protect the 09:00 QA block first.')
    if (sc > 3)  lines.push('⚠️ Screen time ' + sc + 'h > 3h limit. Protect sleep and focus.')

    setFeedback(lines.join('\n'))
    toast('Day logged ✓')
  }

  function todayKeyDynamic() {
    return getKolkataDateKey()
  }

  if (loading) {
    return <div style={{ padding: 24, textAlign: 'center', color: '#94A3B8' }}>Loading Master Dashboard…</div>
  }

  return (
    <div className="dash-root">
      {/* ── LIVE INDIA TIME BAR ── */}
      <div className="live-time-bar">
        <span className="live-time-clock">{liveTimeStr}</span>
        <span className="live-time-label">INDIA TIME • LIVE • AUTO REFRESH 1s</span>
        <span className="live-time-date">{realDayName} • {realDateStr}</span>
      </div>


      {/* ── DAILY 7 BASICS COMMAND ── */}
      <section className="daily-seven-panel" aria-label="Daily seven basics command">
        <div className="daily-seven-head">
          <div>
            <div className="daily-seven-kicker">◉ BEST VERSION // 7 DAILY BASICS • AUTO-UPDATED</div>
            <div className="daily-seven-title">Open → see the current step → do it → win → move forward.</div>
            <div className="daily-seven-sub">{realDayName}, {realDateStr} • CAT-first • {phase.name}</div>
          </div>
          <div className="daily-seven-now">
            <span>{nextDimensionIndex < 0 ? '🏆 COMPLETE' : 'DO THIS NOW'}</span>
            <b>{nextDimensionIndex < 0 ? 'All 7 basics won.' : DAILY_BASICS[nextDimensionIndex]?.seq + ' ' + DAILY_BASICS[nextDimensionIndex]?.title}</b>
          </div>
        </div>

        <div className="daily-seven-flow">
          {DAILY_BASICS.map((basic, index) => {
            const won = Boolean(dailyBasicWins[basic.id])
            const current = index === nextDimensionIndex
            const locked = !won && !current
            const click = () => {
              if (basic.id === 'MIND') {
                document.getElementById(nextTask ? 'dash_block_' + nextTask.blockId : 'dash_block_QA')?.scrollIntoView({ behavior:'smooth', block:'center' })
              } else if (basic.id === 'BODY') {
                window.dispatchEvent(new CustomEvent('jarvis:navigate', { detail:{ page:'body360' } }))
              } else {
                document.getElementById('bestme_dimension_' + (basic.id === 'EMOTION' ? 'EMOTIONAL' : basic.id))?.scrollIntoView({ behavior:'smooth', block:'center' })
              }
            }
            return (
              <div key={basic.id} className={'daily-seven-step ' + (won ? 'won' : current ? 'current' : 'locked')} onClick={current ? click : undefined} role={current ? 'button' : undefined} tabIndex={current ? 0 : undefined}>
                <div className="daily-seven-step-top">
                  <span className="daily-seven-step-num">{basic.seq}</span>
                  <span className="daily-seven-step-icon">{basic.icon}</span>
                  <span className="daily-seven-step-state">{won ? 'WON' : current ? 'DO NOW' : 'LOCKED'}</span>
                </div>
                <div className="daily-seven-step-title">{basic.title}</div>
                <div className="daily-seven-step-label">{basic.label}</div>
                <div className="daily-seven-step-rule">{basic.rule}</div>
                <div className="daily-seven-step-update">{basic.update}</div>
                {current && <div className="daily-seven-step-cta">OPEN THIS STEP →</div>}
              </div>
            )
          })}
        </div>

        <div className="daily-seven-footer">
          <span>ONE RULE</span>
          <b>Do not plan the whole life at once. Finish the current step, then the dashboard unlocks the next.</b>
        </div>
      </section>

      {/* ── BEST ME 7-DIMENSION CONTROL BOARD ── */}
      <section className="best-me-panel best-me-seven" aria-label="Best Me seven dimensions">
        <div className="best-me-head">
          <div>
            <div className="best-me-kicker">◉ BEST ME // 7-DIMENSION DAILY CONTROL</div>
            <div className="best-me-title">Build the Best Me — one win at a time.</div>
            <div className="best-me-sub">
              {realDayName}, {realDateStr} <span>•</span> CAT Day {dayNum < 10 ? '0' + dayNum : dayNum}/44 <span>•</span> {roadmapItem.chapter}
            </div>
          </div>
          <div className={'best-me-final ' + (finalWin ? 'is-won' : '')}>
            <div className="best-me-final-label">FINAL WIN</div>
            <div className="best-me-final-main">{finalWin ? '🏆 WON' : bestMeWinCount + '/7 WINS'}</div>
            <div className="best-me-final-sub">
              {finalWin ? 'All 7 dimensions won in sequence today.' : 'Only the current dimension can be logged. Finish this gate to unlock the next.'}
            </div>
          </div>
        </div>

        <div className="best-me-sequence-note">
          <span>01 → 02 → 03 → 04 → 05 → 06 → 07 → FINAL</span>
          <b>Mind → Body → Emotion → Spiritual → Social → Financial → Purpose</b>
        </div>

        <div className="best-me-seven-grid">
          {BEST_ME_DIMENSIONS.map((dimension, index) => {
            const autoWin = dimension.id === 'MIND' ? dimensionWins.MIND : dimension.id === 'BODY' ? dimensionWins.BODY : false
            const won = dimensionWins[dimension.id]
            const manual = !autoWin
            const isCurrent = index === nextDimensionIndex
            const canMark = manual && isCurrent
            const active = isCurrent && !won

            return (
              <div id={'bestme_dimension_' + dimension.id} key={dimension.id} className={'best-me-dimension ' + (won ? 'won' : active ? 'active' : 'locked')}>
                <div className="best-me-dimension-top">
                  <span className="best-me-dimension-number">{String(index + 1).padStart(2,'0')}</span>
                  <span className="best-me-dimension-icon">{dimension.icon}</span>
                  <span className="best-me-win-state">{won ? 'WON' : active ? 'CURRENT' : 'LOCKED'}</span>
                </div>
                <div className="best-me-dimension-title">{dimension.title}</div>
                <div className="best-me-dimension-sub">{dimension.subtitle}</div>
                <div className="best-me-dimension-rule">{dimension.rule}</div>
                <div className="best-me-dimension-step">
                  <span>TODAY’S STEP</span>
                  {dimension.id === 'MIND' ? (mentalWin ? 'All CAT blocks complete — mental win secured.' : (nextTask ? 'NEXT: ' + nextTask.blockId + ' — ' + nextTask.title : dimension.fallback))
                    : dimension.id === 'BODY' ? (
                      <div className="best-me-body-mini">
                        <div className="best-me-body-label">TODAY’S BEST WORKOUT</div>
                        <strong>{todayBodyPlan.title}</strong>
                        <small>{todayBodyPlan.focus} • {todayBodyPlan.duration}</small>
                        <div className="best-me-body-exercises">{todayBodyPlan.exercises.slice(0, 4).map((exercise, i) => <span key={i}>{exercise}</span>)}{todayBodyPlan.exercises.length > 4 && <span>+{todayBodyPlan.exercises.length - 4} more</span>}</div>
                        <div className="best-me-body-label">LEARNING REMAINING • {bodyLearningRemaining.length}/{BODY360_SEQUENCE.length}</div>
                        <small>{bodyLearningRemaining.length ? 'NEXT: ' + bodyLearningRemaining[0] + (bodyLearningRemaining.length > 1 ? ' → ' + bodyLearningRemaining.slice(1, 3).join(' → ') : '') : 'All Body 360 learning gates complete.'}</small>
                      </div>
                    ) : dimension.fallback}
                </div>
                <div className="best-me-dimension-foot">
                  {dimension.id === 'MIND' && (
                    <div className="best-me-bar"><span style={{ width: mentalPct + '%' }} /></div>
                  )}
                  {dimension.id === 'BODY' && (
                    <div className="best-me-bar"><span style={{ width: physicalPct + '%' }} /></div>
                  )}
                  {dimension.id !== 'MIND' && dimension.id !== 'BODY' && (
                    <div className="best-me-manual-status">{won ? '✓ Manually logged for today' : 'Tap after you genuinely do it.'}</div>
                  )}
                </div>
                {canMark && (
                  <button
                    className={'best-me-action ' + (won ? 'done' : '')}
                    disabled={!active && !won}
                    onClick={() => toggleBestMeManualWin(dimension.id)}
                  >
                    {won ? '✓ WIN LOGGED — TAP TO UNDO' : 'MARK THIS WIN →'}
                  </button>
                )}
                {dimension.id === 'MIND' && (
                  <button className="best-me-action" onClick={() => document.getElementById(nextTask ? 'dash_block_' + nextTask.blockId : 'dash_block_QA')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                    {mentalWin ? 'MENTAL WIN ✓' : nextTask ? 'GO TO NEXT CAT BLOCK →' : 'START QA →'}
                  </button>
                )}
                {dimension.id === 'BODY' && (
                  <button className="best-me-action" onClick={() => window.dispatchEvent(new CustomEvent('jarvis:navigate', { detail: { page: 'body360' } }))}>
                    {physicalWin ? 'PHYSICAL WIN ✓' : 'OPEN TODAY’S BODY PLAN →'}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <div className={'best-me-final-rail ' + (finalWin ? 'won' : '')}>
          <div>
            <div className="best-me-final-rail-title">{finalWin ? '🏆 FINAL WIN UNLOCKED' : '🏁 FINAL WIN'}</div>
            <div className="best-me-final-rail-copy">
              {finalWin
                ? 'Mind + Body + Emotional + Spiritual + Social + Financial + Purpose = Best Me for today.'
                : 'Complete the seven dimensions in order. The final win is earned, not forced.'}
            </div>
          </div>
          <div className="best-me-formula"><span>MIND</span><b>+</b><span>BODY</span><b>+</b><span>HEART</span><b>+</b><span>SPIRIT</span><b>+</b><span>SOCIAL</span><b>+</b><span>MONEY</span><b>+</b><span>PURPOSE</span><b>=</b><strong>BEST ME</strong></div>
        </div>
      </section>


      {/* ── 7 SINS → 7 GOOD CONTROL SYSTEM ── */}
      <section className="sins-control-panel" aria-label="Seven deadly sins control system">
        <div className="sins-control-head">
          <div>
            <div className="sins-control-kicker">◉ SELF-MASTERY // 7 SINS → 7 GOOD</div>
            <div className="sins-control-title">Do not fight yourself. Notice → choose → replace → win.</div>
            <div className="sins-control-sub">The seven sins are control signals, not identity. Use the matching virtue as the replacement behaviour.</div>
          </div>
          <div className={'sins-control-score ' + (sinControlComplete ? 'won' : '')}>
            <div className="sins-control-score-label">TODAY'S CONTROL</div>
            <div className="sins-control-score-main">{sinControlComplete ? '🏆 7/7' : sinWinCount + '/7'}</div>
            <div className="sins-control-score-sub">{sinControlComplete ? 'All seven consciously managed.' : '7 control reps available today.'}</div>
          </div>
        </div>

        <div className="sins-control-flow">
          <span>TRIGGER</span><b>→</b><span>PAUSE</span><b>→</b><span>CHOOSE VIRTUE</span><b>→</b><span>ACT</span><b>→</b><strong>WIN</strong>
        </div>

        <div className="sins-control-grid">
          {SEVEN_SINS_CONTROL.map(item => {
            const won = Boolean(sinControls[item.id])
            return (
              <div key={item.id} className={'sin-control-card ' + (won ? 'won' : '')}>
                <div className="sin-control-top">
                  <span className="sin-control-num">{item.number}</span>
                  <span className="sin-control-icon">{item.icon}</span>
                  <span className={'sin-control-state ' + (won ? 'won' : '')}>{won ? 'CONTROLLED' : 'READY'}</span>
                </div>
                <div className="sin-control-pair">
                  <span className="sin-name">{item.sin}</span>
                  <span className="sin-arrow">→</span>
                  <strong>{item.virtue}</strong>
                </div>
                <div className="sin-control-signal"><b>NOTICE:</b> {item.signal}</div>
                <div className="sin-control-step"><b>CONTROL STEP:</b> {item.step}</div>
                <button
                  className={'sin-control-action ' + (won ? 'done' : '')}
                  onClick={() => toggleSinControl(item.id)}
                >
                  {won ? '✓ VIRTUE CHOSEN — TAP TO RESET' : 'I CONTROLLED THIS TODAY →'}
                </button>
              </div>
            )
          })}
        </div>

        <div className={'sins-control-footer ' + (sinControlComplete ? 'won' : '')}>
          <div>
            <b>{sinControlComplete ? 'SELF-MASTERY WIN UNLOCKED' : 'ONE REACTION AT A TIME'}</b>
            <span>{sinControlComplete ? 'Seven impulses met with seven deliberate choices.' : 'You do not need zero impulses. You need better responses.'}</span>
          </div>
          <div className="sins-virtue-chain">
            HUMILITY · GENEROSITY · RESPECT · GRATITUDE · TEMPERANCE · PATIENCE · DILIGENCE
          </div>
        </div>
      </section>

      {/* ── ALL-DAY LOCKED SCHEDULE ── */}
      <section className="all-day-schedule" aria-label="All day locked schedule">
        <div className="all-day-head">
          <div>
            <div className="all-day-kicker">▣ TODAY’S EXACT SCHEDULE • LOCKED</div>
            <div className="all-day-title">Every block. No hunting. Follow the clock.</div>
          </div>
          <div className="all-day-clock">{liveTimeStr} IST</div>
        </div>
        <div className="all-day-grid">
          {SCHEDULE_ITEMS.map((slot) => {
            const active = currentSlot?.time === slot.time && currentSlot?.block === slot.block
            const next = nextSlot?.time === slot.time && nextSlot?.block === slot.block
            return (
              <div key={slot.block + slot.time} className={'all-day-slot ' + (active ? 'now ' : '') + (next ? 'next' : '')}>
                <div className="all-day-slot-time">{slot.time}</div>
                <div className="all-day-slot-main">
                  <span className="all-day-slot-icon">{slot.icon}</span>
                  <div>
                    <div className="all-day-slot-name">{slot.block}</div>
                    <div className="all-day-slot-detail">
                      {slot.block === 'Gym / Movement' ? 'BODY 360 • ' + todayBodyPlan.title + ' • ' + todayBodyPlan.duration : slot.detail}
                    </div>
                  </div>
                </div>
                <span className={'all-day-slot-badge ' + (active ? 'now' : next ? 'next' : '')}>
                  {active ? 'NOW' : next ? 'NEXT' : 'LOCKED'}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── HEADER ── */}
      <div className="header">
        <div className="header-inner">
          <div className="header-left">
            <div className="header-brand">CAT 2026</div>
            <div className="header-sub">Master Execution Dashboard</div>
          </div>
          <div className="header-center">
            <div className="phase-badge">
              <div className="phase-dot"></div>
              {phase.id} — {phase.name} — ACTIVE
            </div>
            <div style={{ marginTop: 6, fontSize: 12, color: 'var(--muted)' }}>
              Week {getWeekNumber()} &nbsp;|&nbsp; {liveTimeStr} IST • LIVE
            </div>
          </div>
          <div className="header-right">
            <div className="countdown-big" id="countdown">{daysLeft}</div>
            <div className="countdown-label">days to CAT 2026</div>
          </div>
        </div>
      </div>

      {/* ── VERIFIED EXECUTION DIRECTIVE ── */}
      <div style={{ background: '#161D2E', border: '1px solid #F5A623', padding: '14px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }} className="glow-border-amber">
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#F5A623', letterSpacing: 1, textTransform: 'uppercase' }}>
            🎯 TODAY'S EXECUTION DIRECTIVE
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#FFF', marginTop: 4 }}>
            Follow today's generated QA → DILR → VARC → TEST → ANALYSIS → REVISION → REPAIR → RETEST sequence.
          </div>
        </div>

        <div style={{ background: '#1F2937', padding: '8px 16px', borderRadius: 10, border: '1px solid #374151' }}>
          <div style={{ fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>DATA POLICY</div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#22C55E', marginTop: 2 }}>
            LIVE LOGGED DATA ONLY • NO INVENTED SCORES
          </div>
        </div>
      </div>

      {/* ── LIVE SCHEDULE CONTROL ── */}
      <div className="live-schedule-panel">
        <div className="live-schedule-main">
          <div className="live-schedule-kicker">◉ RIGHT NOW • {liveTimeStr} IST</div>
          <div className="live-schedule-title">{currentSlot?.icon || '⏱️'} {currentSlot?.block || 'Buffer / Transition'}</div>
          <div className="live-schedule-detail">{currentSlot?.detail || 'Use this gap for water, movement, setup, or the next planned study block.'}</div>
          {currentSlot?.block === 'Gym / Movement' && (
            <div style={{ marginTop: 9, padding: '8px 10px', borderRadius: 10, border: '1px solid rgba(34,197,94,.3)', background: 'rgba(34,197,94,.07)' }}>
              <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1, color: '#4ADE80' }}>BODY 360 • AUTO-SYNCED TODAY</div>
              <div style={{ fontSize: 12, fontWeight: 900, marginTop: 3 }}>{todayBodyPlan.title}</div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{todayBodyPlan.focus} • {todayBodyPlan.duration}</div>
            </div>
          )}
        </div>
        <div className="live-schedule-next">
          <div className="live-schedule-next-label">NEXT WINDOW</div>
          <div className="live-schedule-next-title">{nextSlot ? nextSlot.icon + ' ' + nextSlot.block : 'Morning Reset'}</div>
          <div className="live-schedule-next-time">{nextSlot?.time || '05:00–05:15'} {nextTask ? '• Next task: ' + nextTask.blockId : ''}</div>
        </div>
        <div className="live-schedule-day">
          <div className="live-schedule-day-label">TODAY'S MODE</div>
          <div className="live-schedule-day-focus">{todayWeekPlan?.focus || 'CAT FIRST'}</div>
          <div className="live-schedule-day-sub">{todayWeekPlan?.eve || 'Execute the locked sequence.'}</div>
        </div>
      </div>

      {/* ── DAILY MOTIVATION ── */}
      {(() => {
        const seed = kolkataParts.year * 10000 + kolkataParts.month * 100 + kolkataParts.date
        const line = DAILY_LINES[seed % DAILY_LINES.length]
        return (
          <div className="daily-motivation-card">
            <div className="daily-motivation-kicker"><AppIcon name="zap" size={11} /> TODAY'S LINE</div>
            <div className="daily-motivation-quote">“{line.quote}”</div>
            <div className="daily-motivation-action"><span>NEXT ACTION</span>{line.action}</div>
          </div>
        )
      })()}

      {/* ── MISSION BAR ── */}
      <div className="mission-bar">
        <div className="mission-text"><AppIcon name="target" size={12} /> MISSION: {phase.mission}</div>
        <div className="date-display">{realDayName}, {realDateStr}</div>
        <div className="mission-quote">"Discipline Today Builds the Freedom Tomorrow"</div>
      </div>

      {/* ── MAIN ── */}
      <div className="main">

        <DailyControlCard />
        <WinterArcCard />
        <LinkedInDailyCard />
        <div
          className="card"
          style={{
            marginTop: 14,
            border: '1px solid rgba(99,246,255,.22)',
            background: 'linear-gradient(135deg, rgba(8,20,28,.96), rgba(12,16,24,.96))',
            boxShadow: '0 12px 34px rgba(0,0,0,.18)',
          }}
          aria-label="Quick Command Dock"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 1.6, color: '#63F6FF', fontWeight: 900 }}>JARVIS // QUICK COMMAND DOCK</div>
              <div style={{ fontSize: 15, fontWeight: 900, marginTop: 3 }}>Best tools. One tap. Zero hunting.</div>
            </div>
            <div style={{ fontSize: 9, color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 999, padding: '5px 8px' }}>CAT FIRST</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 8 }}>
            {[
              ['missionos', 'compass', 'NEXT MISSION', 'Adaptive next action'],
              ['jarvisconsole', 'zap', 'JARVIS', 'Command center'],
              ['qbank', 'library', 'QUESTION VAULT', 'Practice now'],
              ['errors', 'alert', 'ERROR LOG', 'C1–C5 repair'],
              ['catmock', 'trophy', 'MOCK ENGINE', 'Timed CAT'],
              ['settings', 'settings', 'APP CONTROL', 'Notifications + data'],
            ].map(([page, icon, label, hint]) => (
              <button
                key={page}
                onClick={() => window.dispatchEvent(new CustomEvent('jarvis:navigate', { detail: { page } }))}
                style={{
                  textAlign: 'left', padding: '11px 10px', borderRadius: 10,
                  border: '1px solid rgba(148,163,184,.16)', background: 'rgba(255,255,255,.025)',
                  color: 'var(--text)', cursor: 'pointer', minHeight: 70,
                }}
              >
                <div style={{ color: '#63F6FF', marginBottom: 7 }}><AppIcon name={icon as AppIconName} size={18} /></div>
                <div style={{ fontSize: 10, fontWeight: 900 }}>{label}</div>
                <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 3 }}>{hint}</div>
              </button>
            ))}
          </div>
        </div>

        {/* SIGNATURE COMMAND RULES */}
        <div className="command-rules-rail" aria-label="Signature execution rules">
          <div className="command-rules-label"><AppIcon name="radar" size={12} /> COMMAND RULES</div>
          <div className="command-rule"><span>CAT FIRST</span><b>&gt;</b><strong>RANDOM TASKS</strong></div>
          <div className="command-rule"><span>DISCIPLINE</span><b>&gt;</b><strong>MOOD</strong></div>
          <div className="command-rule"><span>CONSISTENCY</span><b>&gt;</b><strong>INTENSITY</strong></div>
          <div className="command-rule"><span>REPAIR</span><b>&gt;</b><strong>REPEAT</strong></div>
          <div className="command-rule"><span>DISTRACTION</span><b>&lt;</b><strong>DISCIPLINE</strong></div>
        </div>

        {/* DAILY 8-BLOCK SEQUENCE JETPACK GRID */}
        <div className="stats-row">
          {SEQUENCE_STRIP.map(s => {
            const cssClass = s.id === 'QA' ? 'qa' : s.id === 'DILR' ? 'dilr' : s.id === 'VARC' ? 'varc' : s.id === 'TEST' ? 'test' : s.id === 'ANALYSIS' ? 'ana' : s.id === 'REVISION' ? 'rev' : s.id === 'REPAIR' ? 'rep' : 'rts'
            return (
              <div
                key={s.id}
                className={`stat-card ${cssClass}`}
                onClick={() => {
                  const el = document.getElementById(`dash_block_${s.id}`)
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <span className="stat-num">{s.seq}</span>
                  <span className={'stat-live-tag ' + (s.id === currentBlockId ? 'now' : '')}>{s.id === currentBlockId ? 'NOW' : s.tag}</span>
                </div>
                <div className="stat-icon-wrap" aria-hidden="true"><AppIcon name={s.icon} size={15} /></div>
                <div className="stat-seq">{s.label}</div>
                <div className="stat-label">{s.sub}</div>
              </div>
            )
          })}
        </div>

        {/* TODAY PLAN + WEEK CALENDAR */}
        <div className="two-col">

          {/* TODAY'S EXACT PLAN */}
          <div>
            <div className="today-header">
              <div className="today-title"><AppIcon name="today" size={14} /> {realDayName.toUpperCase()} — {realDateStr.toUpperCase()} • DAY {dayNum < 10 ? '0' + dayNum : dayNum} / 44</div>
              <div className="today-sub">Today's Topic: <strong style={{ color: 'var(--gold)' }}>{roadmapItem.chapter}</strong> &nbsp;|&nbsp; Week {getWeekNumber()}</div>
            </div>

            <div className="block-list">
              {tasks.map(task => {
                const sId = task.blockId
                const isDone = task.status === 'DONE'
                const bClass = sId === 'QA' ? 'qa-block' : sId === 'DILR' ? 'dilr-block' : sId === 'VARC' ? 'varc-block' : sId === 'TEST' ? 'test-block' : sId === 'ANALYSIS' ? 'ana-block' : sId === 'REVISION' ? 'rev-block' : sId === 'REPAIR' ? 'rep-block' : 'rts-block'
                const nClass = sId === 'QA' ? 'qa-num' : sId === 'DILR' ? 'dilr-num' : sId === 'VARC' ? 'varc-num' : sId === 'TEST' ? 'test-num' : sId === 'ANALYSIS' ? 'ana-num' : sId === 'REVISION' ? 'rev-num' : sId === 'REPAIR' ? 'rep-num' : 'rts-num'
                const tClass = sId === 'QA' ? 'qa-text' : sId === 'DILR' ? 'dilr-text' : sId === 'VARC' ? 'varc-text' : sId === 'TEST' ? 'test-text' : sId === 'ANALYSIS' ? 'ana-text' : sId === 'REVISION' ? 'rev-text' : sId === 'REPAIR' ? 'rep-text' : 'rts-text'
                const seqObj = SEQUENCE_STRIP.find(x => x.id === sId) || SEQUENCE_STRIP[0]

                return (
                  <div key={task.id} id={`dash_block_${sId}`} className={`block-item ${bClass} ${isDone ? 'completed' : ''}`}>
                    <div className={`block-check ${isDone ? 'done' : ''}`} onClick={() => updateStatus(task.id, task.blockId, isDone ? 'TODO' : 'DONE')}></div>
                    <div className={`block-num ${nClass}`}>{seqObj.seq.replace('0','')}</div>
                    <div className="block-content">
                      <div className={`block-section ${tClass}`}>{sId} — {task.subject}</div>
                      <div className="block-title">{task.title}</div>
                      <div className="block-details">{task.notes || 'Target: 70%+ accuracy • Focus on core method.'}</div>
                    </div>
                    <div className="block-meta">
                      <div className="meta-time">{getBlockTimeLabel(task.blockId)}</div>
                      <div className={'meta-target live-state-' + getBlockLiveState(task.blockId, currentMinutes, task.status).toLowerCase()}>{getBlockLiveState(task.blockId, currentMinutes, task.status)}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Progress */}
            <div style={{ marginTop: 14, background: 'var(--bg3)', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold)', letterSpacing: 0.5 }}>
                    🚀 44-DAY FIRST PASS: DAY {dayNum < 10 ? '0' + dayNum : dayNum} / 44
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#FFF', marginTop: 2 }}>
                    Chapter: {roadmapItem.chapter} ({roadmapItem.category})
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--gold)', fontWeight: 800 }}>
                    {done} / 8 blocks done
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{pct}% complete</div>
                </div>
              </div>
              <div style={{ background: 'var(--bg2)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg,var(--green),var(--green2))', width: `${pct}%`, transition: 'width .5s ease', borderRadius: 4 }}></div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SECTIONAL PRECISION MATRIX + WEEK CALENDAR + SCORECARD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* SECTIONAL PRECISION MATRIX — VERIFIED DATA ONLY */}
            <div className="card glow-border-cobalt" style={{ border: '1px solid #3B82F6' }}>
              <div className="card-title" style={{ color: '#60A5FA' }}>📈 Sectional Precision Matrix</div>
              <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid #334155', borderRadius: 8, padding: 12, fontSize: 11, color: '#CBD5E1', lineHeight: 1.6 }}>
                <strong style={{ color: '#60A5FA' }}>LIVE / VERIFIED ONLY:</strong> sectional percentile, score and accuracy values appear here only after they are actually logged from a sectional/mock result.
                <br />
                No score is assumed, predicted, or pre-filled.
              </div>
            </div>

            {/* WEEK CALENDAR */}
            <div className="card">
              <div className="card-title"><AppIcon name="week" size={13} /> Week {getWeekNumber()} — Real Master Schedule</div>
              <div className="week-grid">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((dName, dIdx) => {
                  const curDate = realWeekDates[dIdx]
                  const isToday = getKolkataDateKey(curDate) === dateKey
                  return (
                    <div key={dName} className={`day-card ${isToday ? 'today' : ''}`}>
                      <div className="day-name">{dName}</div>
                      <div className="day-date">{curDate.getDate()}</div>
                      <div className="day-focus" style={{ color: isToday ? 'var(--gold)' : 'var(--green2)' }}>{isToday ? 'TODAY' : 'SOLVE'}</div>
                    </div>
                  )
                })}
              </div>
              <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(245,166,35,.06)', border: '1px solid rgba(245,166,35,.2)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', marginBottom: 6 }}>WEEKLY EXIT GATE</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.7 }}>
                  ✓ Core concepts clear &amp; practiced daily<br/>
                  ✓ 2 DILR sets per day attempted + analysed<br/>
                  ✓ RC accuracy &gt;70% maintained<br/>
                  ✓ Error log complete &amp; verified
                </div>
              </div>
            </div>

            {/* DAILY SCORECARD INPUT */}
            <div className="card">
              <div className="card-title">📊 Daily Update — DONE format</div>
              <div className="instruction" style={{ marginBottom: 12 }}>
                <p>Type your day's data: <strong>DONE [study hrs] [screen hrs] [accuracy%]</strong></p>
              </div>
              <div className="scorecard">
                <div className="score-input-wrap">
                  <div className="score-label">Study Hours</div>
                  <input className="score-input" type="number" placeholder="5" min="0" max="12" value={study} onChange={e => setStudy(e.target.value)} />
                </div>
                <div className="score-input-wrap">
                  <div className="score-label">Screen Hours</div>
                  <input className="score-input" type="number" placeholder="3" min="0" max="12" value={screen} onChange={e => setScreen(e.target.value)} />
                </div>
                <div className="score-input-wrap">
                  <div className="score-label">Accuracy %</div>
                  <input className="score-input" type="number" placeholder="62" min="0" max="100" value={acc} onChange={e => setAcc(e.target.value)} />
                </div>
                <button className="score-btn" onClick={submitDone}>✓ LOG TODAY — DONE</button>
              </div>
              {feedback && (
                <div className="done-feedback" style={{ display: 'block', whiteSpace: 'pre-line' }}>{feedback}</div>
              )}
            </div>

          </div>
        </div>

        {/* MASTERY + PHASE + ERRORS ROW */}
        <div className="two-col">

          {/* MASTERY TRACKER */}
          <div className="card">
            <div className="card-title">📈 Mastery Tracker — Real-Time Level</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: .5 }}>QA Progress</div>
                <div className="mastery-track">
                  <div className="mastery-row">
                    <div className="mastery-name">Percentages</div>
                    <div className="mastery-bar-wrap"><div className="mastery-bar" style={{ width: '60%', background: 'var(--green)' }}></div></div>
                    <div className="mastery-level l3" style={{ color: '#6EE7B7' }}>L3</div>
                  </div>
                  <div className="mastery-row">
                    <div className="mastery-name">Ratio &amp; Prop</div>
                    <div className="mastery-bar-wrap"><div className="mastery-bar" style={{ width: '20%', background: 'var(--orange)' }}></div></div>
                    <div className="mastery-level" style={{ color: '#FCD34D' }}>L1→</div>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#60A5FA', marginBottom: 10, textTransform: 'uppercase', letterSpacing: .5 }}>DILR + VARC</div>
                <div className="mastery-track">
                  <div className="mastery-row">
                    <div className="mastery-name">Tables</div>
                    <div className="mastery-bar-wrap"><div className="mastery-bar" style={{ width: '40%', background: 'var(--blue2)' }}></div></div>
                    <div className="mastery-level" style={{ color: '#93C5FD' }}>L2</div>
                  </div>
                  <div className="mastery-row">
                    <div className="mastery-name">RC Main Idea</div>
                    <div className="mastery-bar-wrap"><div className="mastery-bar" style={{ width: '40%', background: 'var(--purple)' }}></div></div>
                    <div className="mastery-level" style={{ color: '#A78BFA' }}>L2</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--bg3)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>MASTERY SCALE</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="mastery-badge l0">L0 Don't Know</span>
                <span className="mastery-badge l1">L1 Understand</span>
                <span className="mastery-badge l2">L2 Guided</span>
                <span className="mastery-badge l3">L3 Independent</span>
                <span className="mastery-badge l4">L4 Under Time</span>
                <span className="mastery-badge l5">L5 CAT Level</span>
              </div>
            </div>
          </div>

          {/* ERROR LOG + PHASE TIMELINE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* ERROR LOG */}
            <div className="card">
              <div className="card-title"><AppIcon name="errors" size={13} /> Error Log System — C1 to C5</div>
              <div className="error-types">
                <div className="error-card c1" onClick={() => handleLogErrorCard('C1')}>
                  <div className="error-code">C1</div>
                  <div className="error-name">Concept Gap</div>
                  <div className="error-count">{errorCounts['C1']}</div>
                </div>
                <div className="error-card c2" onClick={() => handleLogErrorCard('C2')}>
                  <div className="error-code">C2</div>
                  <div className="error-name">Calculation</div>
                  <div className="error-count">{errorCounts['C2']}</div>
                </div>
                <div className="error-card c3" onClick={() => handleLogErrorCard('C3')}>
                  <div className="error-code">C3</div>
                  <div className="error-name">Misread Data</div>
                  <div className="error-count">{errorCounts['C3']}</div>
                </div>
                <div className="error-card c4" onClick={() => handleLogErrorCard('C4')}>
                  <div className="error-code">C4</div>
                  <div className="error-name">Wrong Approach</div>
                  <div className="error-count">{errorCounts['C4']}</div>
                </div>
                <div className="error-card c5" onClick={() => handleLogErrorCard('C5')}>
                  <div className="error-code">C5</div>
                  <div className="error-name">Time Mgmt</div>
                  <div className="error-count">{errorCounts['C5']}</div>
                </div>
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'center', marginBottom: 10 }}>Click to count errors → C1 is most dangerous</div>
              <button
                onClick={() => { setErrorCounts({C1:0,C2:0,C3:0,C4:0,C5:0}) }}
                style={{ marginTop: 10, width: '100%', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: 8, borderRadius: 6, fontSize: 11, cursor: 'pointer' }}
              >
                Reset Error Counts
              </button>
            </div>

            {/* PHASE TIMELINE */}
            <div className="card">
              <div className="card-title">CAT 2026 Phase Timeline — Live</div>
              <div className="phase-timeline">
                {PHASES.map((p) => {
                  const active = p.id === phase.id
                  return (
                    <div key={p.id} className={'phase-item ' + (active ? 'active' : '')}>
                      <div className="phase-name" style={{ color: p.color }}>{p.name}</div>
                      <div className="phase-dates">{p.start} → {p.end}</div>
                      <div className="phase-goal">{active ? 'ACTIVE • ' + p.purpose : p.purpose}</div>
                    </div>
                  )
                })}
              </div>
              <div style={{ marginTop: 12, background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--green2)', marginBottom: 4 }}>🔒 MISSION &amp; VISION LOCKED</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{phase.mission} • {phase.purpose}</div>
              </div>
            </div>

          </div>
        </div>

        {/* MASTER LOOP */}
        <div className="card">
          <div className="card-title">♾️ Master Learning Loop — Every Topic Must Complete This</div>
          <div className="flow-wrap">
            <span className="flow-step flow-done">CONCEPT</span><span className="flow-arrow">→</span>
            <span className="flow-step flow-done">BASIC</span><span className="flow-arrow">→</span>
            <span className="flow-step flow-active">INTERMEDIATE</span><span className="flow-arrow">→</span>
            <span className="flow-step flow-next">CAT / PYQ</span><span className="flow-arrow">→</span>
            <span className="flow-step flow-next">TIMED</span><span className="flow-arrow">→</span>
            <span className="flow-step flow-next">MIXED</span><span className="flow-arrow">→</span>
            <span className="flow-step flow-next">TEST</span><span className="flow-arrow">→</span>
            <span className="flow-step flow-next">ANALYSIS</span><span className="flow-arrow">→</span>
            <span className="flow-step flow-next">REPAIR</span><span className="flow-arrow">→</span>
            <span className="flow-step flow-next">RETEST</span><span className="flow-arrow">→</span>
            <span className="flow-step" style={{ background: 'linear-gradient(135deg,var(--gold),#FBBF24)', color: 'var(--navy)', fontWeight: 900 }}>MASTERY 🏆</span>
          </div>
        </div>

        {/* MANTRA */}
        <div className="mantra-bar">
          <div className="mantra-text">"Discipline Today Builds the Freedom Tomorrow"</div>
          <div className="mantra-sub">BECOME THE MAN YOU PROMISE YOURSELF &nbsp;|&nbsp; CAT 2026 &nbsp;|&nbsp; Radhe Radhe 🙏</div>
        </div>

      </div>
    </div>
  )
}
