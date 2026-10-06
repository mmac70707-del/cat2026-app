import { useState, useEffect } from 'react'
import { useTodayTasks } from '@/hooks/useTasks'
import { DailyScoreRepository } from '@/repositories/index'
import { ErrorRepository } from '@/repositories/ErrorRepository'
import { MasteryRepository } from '@/repositories/MasteryRepository'
import type { MasteryTopic } from '@/types'
import { usePhase } from '@/hooks/usePhase'
import { getWeekNumber, getDaysLeft, getCountdownParts } from '@/services/domain'
import { getKolkataDateKey, getKolkataDateParts, getFirstPassDayNum } from '@/services/calendarEngine'
import { ROADMAP_44 } from '@/data/roadmap44'
import { BLOCKS, PHASES, SCHEDULE_ITEMS, WEEK_PLAN_TEMPLATE } from '@/data/config'
import { SEVEN_YEAR_ROADMAP } from '@/data/visionConfig'
import { useToast } from '@/components/Toast'
import './Dashboard.css'
import { DailyControlCard } from '@/features/dailycontrol/DailyControlCard'
import { LinkedInDailyCard } from '@/features/linkedin/LinkedInDailyCard'
import { AppIcon, type AppIconName } from '@/components/AppIcon'
import { applyFocusMode } from '@/services/uiPreferences'
import { BODY360_SEQUENCE, getBodyPlan } from '@/data/body360'
import { FocusModeLauncher } from './FocusModeLauncher'

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

const VISION_QUOTES = [
  { quote: 'DREAM BIG. PLAN SMART. EXECUTE DAILY.', sub: 'Success is built one faithful day at a time.' },
  { quote: 'FROM SMALL TOWN TO BIG VISION.', sub: 'Think bigger. Work smaller. Execute today.' },
  { quote: 'YOUR STORY IS BUILT BY WHAT YOU REPEAT.', sub: 'Protect the next block. Let the results compound.' },
  { quote: 'DREAM → PLAN → EXECUTE → LEARN → GROW.', sub: 'A strong future starts with a clear next action.' },
  { quote: 'DISCIPLINE TURNS PLANS INTO PROGRESS.', sub: 'Do the work before asking how far you have come.' },
  { quote: 'BUILD THE MAN. BUILD THE MISSION.', sub: 'Character first. Capability next. Impact follows.' },
  { quote: 'MAKE TODAY WORTH REMEMBERING.', sub: 'Not through pressure—through clean execution.' },
  { quote: 'VISION GIVES DIRECTION. EXECUTION GIVES PROOF.', sub: 'One completed loop is evidence that you are moving.' },
  { quote: 'SUCCESS IS A SYSTEM, NOT A MOOD.', sub: 'Show up. Solve. Analyse. Repair. Retest.' },
  { quote: 'YOUR NEXT ACTION IS YOUR NEXT VOTE.', sub: 'Choose the action that your future self would respect.' },
  { quote: 'BELIEVE. WORK. LEARN. REPEAT.', sub: 'Keep faith grounded in effort and evidence.' },
  { quote: 'START TODAY. CHANGE TOMORROW.', sub: 'The future is shaped by what you execute now.' },
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
const BESTME_LESSON_STORAGE = 'cat2026.bestme.lessons.v1'
const BODY360_PROGRESS_STORAGE = 'cat2026.body360.progress.v1'

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

const DAILY_BEST_BASICS = [
  { id:'MIND' as BestMeDimensionId, n:'01', icon:'🧠', name:'MIND', purpose:'Learn + think', mentor:'CAT mastery is today’s main job.', dailyCheck:'Complete today’s planned CAT blocks: solve → analyse → repair.', sevenYear:'Foundation → MBA capability → decision quality → builder judgement.' },
  { id:'BODY' as BestMeDimensionId, n:'02', icon:'💪', name:'BODY', purpose:'Train + recover', mentor:'Train with form, recover well, repeat.', dailyCheck:'Complete today’s Body 360 workout + required learning/recovery gates.', sevenYear:'Energy engine → sustainable performance → leadership stamina.' },
  { id:'EMOTIONAL' as BestMeDimensionId, n:'03', icon:'❤️', name:'EMOTION', purpose:'Feel + regulate', mentor:'Pause before reaction. Choose the next right action.', dailyCheck:'Use one pause before reacting: breathe → name → choose.', sevenYear:'Self-control → pressure handling → high-stakes judgement.' },
  { id:'SPIRITUAL' as BestMeDimensionId, n:'04', icon:'🙏', name:'SPIRITUAL', purpose:'Values + direction', mentor:'Let values lead when mood is noisy.', dailyCheck:'2 minutes: Radhe Radhe → gratitude → choose one value to live today.', sevenYear:'Character → integrity → grounded leadership → legacy.' },
  { id:'SOCIAL' as BestMeDimensionId, n:'05', icon:'🤝', name:'SOCIAL', purpose:'Respect + connect', mentor:'One genuine connection is enough.', dailyCheck:'Have one genuine conversation: listen first, add value, follow through.', sevenYear:'Communication → network → team leadership → ecosystem.' },
  { id:'FINANCIAL' as BestMeDimensionId, n:'06', icon:'₹', name:'FINANCIAL', purpose:'Track + control', mentor:'Know where the money goes.', dailyCheck:'Log every spend and make one deliberate money decision.', sevenYear:'Financial literacy → capital discipline → business economics → allocation.' },
  { id:'PURPOSE' as BestMeDimensionId, n:'07', icon:'🚀', name:'PURPOSE', purpose:'Build + become', mentor:'Make one tiny deposit into your future.', dailyCheck:'After CAT priorities, make one 3-minute deposit into your builder future.', sevenYear:'MBA/business capability → experiments → product → scale → impact.' },
] as const

type DailyLesson = {
  title: string
  why: string
  mechanism: string
  example: string
  practice: string
  recall: string
}

const DAILY_BEST_BASIC_LESSONS: Record<BestMeDimensionId, DailyLesson[]> = {
  MIND: [
    { title:'Retrieval beats rereading', why:'Memory gets stronger when you pull the answer out instead of only looking at it.', mechanism:'Learn → close notes → recall → check → repair → retest.', example:'After Ratio theory, close the notes and explain proportional division from memory before solving.', practice:'2 minutes: write 3 things you remember from today’s CAT topic without looking.', recall:'What did I retrieve today that I could not recall yesterday?' },
    { title:'Question selection is a skill', why:'A high score is not just solving power; it is choosing where your limited time earns marks.', mechanism:'Scan → classify → commit → abandon early when the expected return is poor.', example:'In DILR, a clean familiar set can beat a brilliant but time-hungry set.', practice:'Before your next set, state the reason you chose it in one sentence.', recall:'Why did I choose this question first?' },
    { title:'Repair creates mastery', why:'Repeating the same mistake trains the mistake. Correction plus retest trains the skill.', mechanism:'Wrong → classify → find root cause → fix → fresh attempt → retest.', example:'If a VARC wrong answer came from misreading the author’s claim, repair the reading process—not just that question.', practice:'Take one wrong question and write one prevention rule.', recall:'What changed in my method after my last mistake?' },
  ],
  BODY: [
    { title:'Progressive overload, not ego', why:'Your body adapts to a training stimulus; progress comes from gradually increasing useful work while keeping technique.', mechanism:'Good form → repeatable reps → small progression → recover → adapt.', example:'When all bench sets reach the top of the rep range cleanly, add a small load instead of jumping dramatically.', practice:'Choose one exercise today and record load + reps + clean RIR.', recall:'What exactly am I progressing: load, reps, control, or consistency?' },
    { title:'Recovery is part of training', why:'Training is the stimulus; adaptation needs sleep, food and recovery time.', mechanism:'Stimulus → recovery → adaptation → stronger next session.', example:'A hard session followed by poor sleep can reduce the quality of the next workout.', practice:'Protect tonight’s sleep and do the planned cool-down instead of adding junk volume.', recall:'What recovery choice will improve tomorrow’s session?' },
    { title:'Technique makes strength useful', why:'A strong movement pattern is more repeatable and easier to progress safely.', mechanism:'Stable position → controlled range → target muscle → consistent reps.', example:'A slower clean row with a stable torso teaches more than swinging a heavier weight.', practice:'For your first working set, use a controlled tempo and stop before form breaks.', recall:'What part of my technique will I watch today?' },
  ],
  EMOTIONAL: [
    { title:'The pause creates choice', why:'An emotion can arrive before your deliberate decision. A brief pause gives your decision-making system room to catch up.', mechanism:'Trigger → pause → name it → choose response → act.', example:'A harsh message arrives; you breathe and draft the reply after the heat drops.', practice:'Before one difficult reply today, take 3 slow breaths and wait 10 seconds.', recall:'What did the pause change?' },
    { title:'Name the emotion, do not become it', why:'“I am angry” can turn into identity; “I notice anger” creates distance.', mechanism:'Notice sensation → label emotion → identify need → choose action.', example:'“I notice frustration because the problem is taking longer than expected.”', practice:'Use the sentence “I notice ___; the next useful action is ___.” once today.', recall:'What feeling was present, and what action did I choose?' },
    { title:'Discipline needs emotional flexibility', why:'A strong system must work on bad-mood days too.', mechanism:'Keep the standard → shrink the action → preserve the streak → resume full pace.', example:'On a low-energy day, you still do the minimum planned CAT block instead of abandoning the day.', practice:'When resistance appears, start for only 5 minutes.', recall:'Did I obey the plan or my temporary mood?' },
  ],
  SPIRITUAL: [
    { title:'Values before mood', why:'A value gives you a direction when motivation is unstable.', mechanism:'Choose value → define behaviour → act → reflect.', example:'If honesty is the value, you correct a false statement even when admitting the mistake is uncomfortable.', practice:'Pick one value for today and define one visible action that proves it.', recall:'What did I do today that matched my value?' },
    { title:'Gratitude changes the comparison frame', why:'Attention can default to what is missing; gratitude deliberately notices what is already working.', mechanism:'Notice good → name it specifically → appreciate → continue.', example:'Instead of measuring yourself only against someone ahead, notice the skill you have gained this month.', practice:'Write three specific things you are grateful for—no generic answers.', recall:'What did gratitude make easier to see?' },
    { title:'Quiet time improves direction', why:'A small period without noise lets you notice whether your actions still match your priorities.', mechanism:'Silence → reflect → reconnect with purpose → choose next action.', example:'Two minutes of prayer/reflection before the day begins can prevent a whole day of reactive behaviour.', practice:'2 minutes: Radhe Radhe → gratitude → one intention.', recall:'What mattered most today?' },
  ],
  SOCIAL: [
    { title:'Listen before solving', why:'People often need understanding before advice.', mechanism:'Listen → clarify → reflect → then advise only if useful.', example:'Ask “What is the real problem?” before giving a friend a solution.', practice:'In one conversation today, ask one extra question before giving your opinion.', recall:'What did I learn because I listened longer?' },
    { title:'Trust is built in small deposits', why:'Reliable small actions create more trust than occasional grand gestures.', mechanism:'Promise → execute → communicate → repeat.', example:'Reply when you said you would, arrive when you said you would, and admit quickly when you cannot.', practice:'Keep one small promise exactly today.', recall:'Did my behaviour make me more trustworthy?' },
    { title:'Network by being useful', why:'Strong professional relationships grow from genuine value, not collecting contacts.', mechanism:'Notice need → share useful insight → stay curious → follow up.', example:'A thoughtful comment on someone’s business idea can create a better connection than a generic “great post”.', practice:'Help one person with one useful piece of information today.', recall:'What value did I add?' },
  ],
  FINANCIAL: [
    { title:'Know your cash flow', why:'You cannot control what you do not observe.', mechanism:'Earn → spend → save/invest → review.', example:'A daily 30-second spending log can reveal repeated small leaks that feel invisible individually.', practice:'Log every expense today and label each need or want.', recall:'Where did my money actually go?' },
    { title:'Delay the purchase', why:'Time separates a real need from an emotional impulse.', mechanism:'Want → wait → question need → compare → decide.', example:'Waiting 24 hours before a non-essential purchase often exposes whether the desire lasts.', practice:'Delay one unnecessary purchase for 24 hours.', recall:'Was it a need, a useful want, or an impulse?' },
    { title:'Small advantages compound', why:'Repeated small improvements accumulate over long periods.', mechanism:'Save a little → learn → increase earning power → repeat.', example:'A consistent learning habit can become more valuable than chasing one dramatic financial shortcut.', practice:'Spend 3 minutes learning one business or money principle after CAT priorities.', recall:'What small financial advantage did I build today?' },
  ],
  PURPOSE: [
    { title:'Build from problems, not titles', why:'A builder becomes useful by solving real problems, not by collecting impressive labels.', mechanism:'Observe problem → understand user → test solution → measure result.', example:'Instead of “I want to be a founder,” ask which recurring problem you can solve better than today.', practice:'Write one real problem you observed today and who suffers from it.', recall:'What problem am I becoming capable of solving?' },
    { title:'Think in systems', why:'Goals describe an outcome; systems make the outcome repeatable.', mechanism:'Goal → process → measurement → feedback → improvement.', example:'“Get fit” is a goal; “train 4 days, track lifts, recover, review weekly” is a system.', practice:'Turn one goal into one repeatable daily process.', recall:'What process produces the result I want?' },
    { title:'Long-term identity is built today', why:'Your future reputation is the accumulation of today’s repeated behaviours.', mechanism:'Tiny action → repetition → capability → reputation → opportunity.', example:'Three focused minutes of business learning every day becomes a knowledge base over time.', practice:'Make one tiny deposit into your future identity after your core CAT work.', recall:'What did today’s action say about the person I am becoming?' },
  ],
}

type BestMeSinId = 'PRIDE' | 'GREED' | 'LUST' | 'ENVY' | 'GLUTTONY' | 'WRATH' | 'SLOTH'

const SIN_CONTROL_STORAGE = 'cat2026.bestme.sins.v1'
const EXECUTION_STREAK_STORAGE = 'cat2026.execution.streak.v1'

const SEVEN_SINS_CONTROL = [
  { id:'PRIDE' as BestMeSinId, number:'01', sin:'PRIDE', virtue:'HUMILITY', icon:'👑', signal:'Need to prove I am better/right.', step:'Listen → check evidence → admit what you do not know → correct without ego.' },
  { id:'GREED' as BestMeSinId, number:'02', sin:'GREED', virtue:'CHARITY', icon:'💰', signal:'More, more, more—even when enough is enough.', step:'Pause → ask “need or want?” → choose enough → share/help where practical.' },
  { id:'LUST' as BestMeSinId, number:'03', sin:'LUST', virtue:'CHASTITY', icon:'🔥', signal:'Impulse starts controlling attention or behaviour.', step:'Notice → remove the trigger → redirect attention → protect attention → treat people with dignity, not as objects.' },
  { id:'ENVY' as BestMeSinId, number:'04', sin:'ENVY', virtue:'GRATITUDE', icon:'👀', signal:'Someone else’s success makes my progress feel smaller.', step:'Notice comparison → name one thing to learn → name one thing to be grateful for → return to my path.' },
  { id:'GLUTTONY' as BestMeSinId, number:'05', sin:'GLUTTONY', virtue:'TEMPERANCE', icon:'🍽️', signal:'Consumption keeps going after the real need is met.', step:'Pause → check hunger/need → choose a reasonable amount → stop deliberately.' },
  { id:'WRATH' as BestMeSinId, number:'06', sin:'WRATH', virtue:'PATIENCE', icon:'⚡', signal:'Anger wants an immediate reaction.', step:'Stop → 3 slow breaths → delay the reply → respond to the problem, not the heat.' },
  { id:'SLOTH' as BestMeSinId, number:'07', sin:'SLOTH', virtue:'DILIGENCE', icon:'🛡️', signal:'I know the right action but keep postponing it.', step:'Make it tiny → start for 5 minutes → finish the planned minimum → build momentum.' },
] as const

function getConsecutiveStreak(completedDates: string[], todayKey: string) {
  const set = new Set(completedDates)
  let streak = 0
  const cursor = new Date(todayKey + 'T00:00:00Z')
  while (set.has(cursor.toISOString().slice(0,10))) {
    streak++
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }
  return streak
}

function getBestStreak(completedDates: string[]) {
  const days = [...new Set(completedDates)].sort()
  if (!days.length) return 0
  let best = 1
  let run = 1
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1] + 'T00:00:00Z')
    const cur = new Date(days[i] + 'T00:00:00Z')
    const diff = Math.round((cur.getTime() - prev.getTime()) / 86400000)
    if (diff === 1) {
      run++
      best = Math.max(best, run)
    } else {
      run = 1
    }
  }
  return best
}

function recordExecutionDay(dateKey: string, complete: boolean) {
  try {
    const raw = JSON.parse(localStorage.getItem(EXECUTION_STREAK_STORAGE) || '{}') as Record<string, boolean>
    if (complete) raw[dateKey] = true
    localStorage.setItem(EXECUTION_STREAK_STORAGE, JSON.stringify(raw))
    return Object.keys(raw)
  } catch {
    return []
  }
}

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

function readBestMeLessonWins(dateKey: string) {
  try {
    const raw = JSON.parse(localStorage.getItem(BESTME_LESSON_STORAGE) || '{}')
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
  const [lessonWins, setLessonWins] = useState<Partial<Record<BestMeDimensionId, boolean>>>(() => readBestMeLessonWins(getKolkataDateKey()))
  const [activeLessonId, setActiveLessonId] = useState<BestMeDimensionId | null>('MIND')
  const [masteryTopics, setMasteryTopics] = useState<MasteryTopic[]>([])


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
  const lessonLearnedCount = Object.values(lessonWins).filter(Boolean).length
  const finalWin = bestMeWinCount === BEST_ME_DIMENSIONS.length
  const sinWinCount = SEVEN_SINS_CONTROL.filter(item => Boolean(sinControls[item.id])).length
  const sinControlComplete = sinWinCount === SEVEN_SINS_CONTROL.length
  const coreDayComplete = done === tasks.length && tasks.length > 0 && bestMeWinCount === BEST_ME_DIMENSIONS.length
  const executionStreakDates = Object.keys((() => {
    try { return JSON.parse(localStorage.getItem(EXECUTION_STREAK_STORAGE) || '{}') as Record<string, boolean> } catch { return {} }
  })())
  const liveStreak = getConsecutiveStreak(executionStreakDates, dateKey)
  const executionScore = Math.round(
    ((done / Math.max(1, tasks.length)) * 60) +
    ((bestMeWinCount / BEST_ME_DIMENSIONS.length) * 25) +
    ((sinWinCount / SEVEN_SINS_CONTROL.length) * 10) +
    ((lessonLearnedCount / DAILY_BEST_BASICS.length) * 5)
  )
  const countdown = getCountdownParts()
  const nextDimensionIndex = BEST_ME_DIMENSIONS.findIndex(dimension => !dimensionWins[dimension.id])
  const nextDimension = nextDimensionIndex >= 0 ? BEST_ME_DIMENSIONS[nextDimensionIndex] : null
  const currentSevenYear = SEVEN_YEAR_ROADMAP[Math.min(6, Math.max(0, kolkataParts.year - 2026))] || SEVEN_YEAR_ROADMAP[0]
  const currentSevenYearLabel = 'Y' + currentSevenYear.yearNum + ' • ' + currentSevenYear.theme
  const bestStreak = getBestStreak(executionStreakDates)
  const currentTask = currentBlockId ? tasks.find(task => task.blockId === currentBlockId && task.status !== 'DONE') || null : null
  const actionTask = currentTask || nextTask
  const actionTitle = currentTask
    ? currentTask.blockId + ' • ' + currentTask.title
    : currentSlot
      ? currentSlot.block
      : actionTask
        ? actionTask.blockId + ' • ' + actionTask.title
        : 'CAT CORE COMPLETE'
  const actionStatus = currentTask
    ? 'DO THIS NOW'
    : currentSlot
      ? 'STAY ON SCHEDULE'
      : actionTask
        ? 'NEXT ACTION'
        : 'DAY CLOSED'
  const actionDetail = currentTask && currentSlot
    ? currentSlot.time + ' • Complete this block, then move to the next planned task.'
    : currentSlot && nextTask
      ? currentSlot.time + ' • ' + currentSlot.block + ' now. Next CAT task: ' + nextTask.blockId + ' • ' + nextTask.title + '.'
      : actionTask
        ? getBlockTimeLabel(actionTask.blockId) + ' • Follow the locked sequence. No random replanning.'
        : 'All planned CAT work is complete. Protect recovery and sleep.'
  const masteryTargets = [
    { key:'percentages', label:'Percentages', subject:'QA' as const, color:'#22C55E' },
    { key:'ratio', label:'Ratio & Prop', subject:'QA' as const, color:'#F59E0B' },
    { key:'tables', label:'Tables', subject:'DILR' as const, color:'#60A5FA' },
    { key:'rc-main-idea', label:'RC Main Idea', subject:'VARC' as const, color:'#A78BFA' },
  ].map(target => {
    const topic = masteryTopics.find(t => {
      if (t.subject !== target.subject) return false
      const name = t.name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim()
      const key = target.label.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim()
      return name === key || name.includes(key) || key.includes(name)
    }) || null
    return { ...target, topic }
  })
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

  function toggleLessonLearned(id: BestMeDimensionId) {
    const nextValue = !lessonWins[id]
    const next = { ...lessonWins, [id]: nextValue }
    setLessonWins(next)
    try {
      const raw = JSON.parse(localStorage.getItem(BESTME_LESSON_STORAGE) || '{}')
      raw[dateKey] = next
      localStorage.setItem(BESTME_LESSON_STORAGE, JSON.stringify(raw))
    } catch {}
    toast(nextValue ? 'Lesson saved ✓' : 'Lesson marked not done')
  }

  const getSequenceState = (id: string) => {
    const task = tasks.find(t => t.blockId === id)
    if (task?.status === 'DONE') return 'DONE'
    if (id === currentBlockId) return 'NOW'
    return getBlockLiveState(id, currentMinutes, task?.status || 'TODO')
  }

  useEffect(() => {
    setBestMeManualWins(readBestMeManualWins(dateKey))
    setLessonWins(readBestMeLessonWins(dateKey))
  }, [dateKey])

  useEffect(() => {
    recordExecutionDay(dateKey, coreDayComplete)
  }, [dateKey, coreDayComplete])
  useEffect(() => {
    setSinControls(readSinControls(dateKey))
  }, [dateKey])

  useEffect(() => {
    let alive = true
    MasteryRepository.init()
      .then(() => MasteryRepository.getAll())
      .then(data => { if (alive) setMasteryTopics(data) })
      .catch(() => {})
    return () => { alive = false }
  }, [])

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
      {/* ── ALWAYS-VISIBLE CAT COUNTDOWN + MASTER CHECKLIST ── */}
      <section className="master-command-rail" aria-label="CAT countdown and daily master checklist">
        <div className="master-command-top">
          <div>
            <div className="master-command-kicker">CAT 2026 • MASTER COMMAND</div>
            <div className="master-command-title">ONE DAY. ONE SEQUENCE. COMPLETE THE LOOP.</div>
            <div className="master-command-sub">
              {realDayName}, {realDateStr} • {currentSevenYearLabel}
              <br />{currentSevenYear.output}
            </div>
          </div>
          <div className="master-countdown">
            <span>COUNTDOWN TO CAT • 29 NOV 2026</span>
            <strong>{countdown.days}D <i>{String(countdown.hours).padStart(2,'0')}:{String(countdown.minutes).padStart(2,'0')}:{String(countdown.seconds).padStart(2,'0')}</i></strong>
          </div>
        </div>

        <div className="master-command-metrics">
          <div><span>🔥 EXECUTION STREAK</span><b>{liveStreak} DAY{liveStreak === 1 ? '' : 'S'}</b><small className="master-best-streak">BEST {bestStreak}</small></div>
          <div><span>TODAY SCORE</span><b>{executionScore}%</b></div>
          <div><span>CAT CORE</span><b>{done}/{tasks.length || 8}</b></div>
          <div><span>BEST ME</span><b>{bestMeWinCount}/7</b></div>
          <div><span>SELF-MASTERY</span><b>{sinWinCount}/7</b></div>
          <div><span>LESSONS</span><b>{lessonLearnedCount}/7</b></div>
        </div>

        <div className="master-next-action" aria-live="polite">
          <div className="master-next-action-copy">
            <span>{actionStatus}</span>
            <strong>{actionTitle}</strong>
            <small>{actionDetail}</small>
          </div>
          {actionTask && (
            <button
              type="button"
              className="master-next-action-btn"
              onClick={() => document.getElementById('dash_block_' + actionTask.blockId)?.scrollIntoView({ behavior:'smooth', block:'center' })}
            >OPEN ACTION</button>
          )}
        </div>

        <div className="master-checklist">
          <button type="button" className={'master-check master-check-main ' + (coreDayComplete ? 'done' : '')}
            onClick={() => document.querySelector('.daily-basics-rail')?.scrollIntoView({behavior:'smooth',block:'start'})}>
            <span className="master-box">{coreDayComplete ? '✓' : ''}</span>
            <span><b>01 • CAT-FIRST DAY</b><small>Complete every planned CAT block + all 7 Best Me daily actions.</small></span>
            <em>{coreDayComplete ? 'STREAK DAY EARNED' : 'IN PROGRESS'}</em>
          </button>
          <button type="button" className={'master-check ' + (sinControlComplete ? 'done' : '')}
            onClick={() => document.querySelector('.sins-control-panel')?.scrollIntoView({behavior:'smooth',block:'center'})}>
            <span className="master-box">{sinControlComplete ? '✓' : ''}</span>
            <span><b>02 • SELF-MASTERY BONUS</b><small>Trigger → Pause → Choose Virtue → Act → Win.</small></span>
            <em>{sinControlComplete ? 'DONE' : sinWinCount + '/7'}</em>
          </button>
          <button type="button" className={'master-check ' + (lessonLearnedCount === 7 ? 'done' : '')}
            onClick={() => document.querySelector('.daily-basics-rail')?.scrollIntoView({behavior:'smooth',block:'center'})}>
            <span className="master-box">{lessonLearnedCount === 7 ? '✓' : ''}</span>
            <span><b>03 • LEARN THE 7</b><small>Tap each dimension → learn → apply → recall → mark learned.</small></span>
            <em>{lessonLearnedCount === 7 ? 'DONE' : lessonLearnedCount + '/7'}</em>
          </button>
          <button type="button" className="master-check"
            onClick={() => document.querySelector('.linkedin-daily-card, [aria-label*="LinkedIn"]')?.scrollIntoView({behavior:'smooth',block:'center'})}>
            <span className="master-box">+</span>
            <span><b>04 • LINKEDIN 3-MINUTE BONUS</b><small>Lesson + useful networking/comment. Never before CAT.</small></span>
            <em>MAX 3 MIN</em>
          </button>
        </div>

        <div className="master-command-footer">
          <span>{coreDayComplete ? '🟢 GREEN DAY' : executionScore >= 70 ? '🟡 KEEP EXECUTING' : '🔵 START THE NEXT BLOCK'}</span>
          <b>STREAK RULE: CAT CORE + BEST ME = 1 EXECUTION DAY</b>
          <small>Missed block? Resume from the next task. No guilt debt. No random replanning.</small>
        </div>
      </section>

      {/* ── LIVE INDIA TIME BAR ── */}
      <div className="live-time-bar">
        <span className="live-time-clock">{liveTimeStr}</span>
        <span className="live-time-label">INDIA TIME • LIVE • AUTO REFRESH 1s</span>
        <span className="live-time-date">{realDayName} • {realDateStr}</span>
      </div>


      {/* ── FOCUS MODE: PRIMARY ONE-TAP LAUNCHER ── */}
      <FocusModeLauncher
        realDayName={realDayName}
        realDateStr={realDateStr}
        phaseId={phase.id}
        phaseName={phase.name}
        dayNum={dayNum}
        actionTitle={actionTitle}
        actionStatus={actionStatus}
        actionDetail={actionDetail}
        done={done}
        total={tasks.length || 8}
        pct={pct}
        onFullDashboard={() => applyFocusMode(false)}
        onStartFocus={() => window.dispatchEvent(new Event('jarvis:focus:start'))}
        modules={[
          {
            id: 'cat',
            label: 'CAT TODAY',
            sub: 'Today • execute',
            icon: 'today',
            onOpen: () => window.dispatchEvent(new CustomEvent('jarvis:navigate', { detail: { page: 'today' } })),
          },
          {
            id: 'bestme',
            label: 'BEST ME',
            sub: '7 dimensions',
            icon: 'target',
            onOpen: () => {
              applyFocusMode(false)
              window.setTimeout(() => document.querySelector('.daily-basics-rail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40)
            },
          },
          {
            id: 'body',
            label: 'BODY 360',
            sub: 'Train • recover',
            icon: 'zap',
            onOpen: () => window.dispatchEvent(new CustomEvent('jarvis:navigate', { detail: { page: 'body360' } })),
          },
          {
            id: 'mastery',
            label: 'MASTERY',
            sub: 'Real evidence',
            icon: 'mastery',
            onOpen: () => window.dispatchEvent(new CustomEvent('jarvis:navigate', { detail: { page: 'mastery' } })),
          },
          {
            id: 'brm',
            label: 'BUSINESS',
            sub: 'BRM • 3 min',
            icon: 'rocket',
            onOpen: () => window.dispatchEvent(new CustomEvent('jarvis:navigate', { detail: { page: 'brm' } })),
          },
          {
            id: 'week',
            label: 'WEEK PLAN',
            sub: 'Locked sequence',
            icon: 'week',
            onOpen: () => window.dispatchEvent(new CustomEvent('jarvis:navigate', { detail: { page: 'week' } })),
          },
        ]}
      />

      {/* ── START HERE: DAILY 7 BASICS ── */}
      <section className="daily-basics-rail" aria-label="Daily seven basics mentor sequence">
        <div className="daily-basics-head">
          <div>
            <div className="daily-basics-kicker">◉ START HERE // 7 DAILY BASICS</div>
            <div className="daily-basics-title">Do the next right thing. Let the system guide the rest.</div>
            <div className="daily-basics-sub">
              Auto-updated every India day: <b>{realDayName}, {realDateStr}</b> • {bestMeWinCount}/7 wins • {lessonLearnedCount}/7 lessons done • {sinWinCount}/7 self-control reps
              <br /><b>7-YEAR TRACK:</b> {currentSevenYearLabel}
            </div>
          </div>
          <div className={'daily-basics-now ' + (finalWin ? 'complete' : '')}>
            <span>{finalWin ? '🏆 FINAL' : '🟨 NEXT STEP'}</span>
            <strong>{finalWin ? 'BEST ME COMPLETE' : nextDimension ? String(nextDimensionIndex + 1).padStart(2,'0') + ' ' + nextDimension.title : 'START'}</strong>
            <small>{currentSlot ? 'NOW: ' + currentSlot.block : nextSlot ? 'NEXT: ' + nextSlot.block : 'Follow the first unfinished gate.'}</small>
          </div>
        </div>

        <div className="daily-basics-flow">
          {DAILY_BEST_BASICS.map((basic, index) => {
            const won = dimensionWins[basic.id]
            const isCurrent = !finalWin && index === nextDimensionIndex
            const bodyRemaining = bodyLearningRemaining.length
            let action: string = basic.mentor
            if (basic.id === 'MIND') {
              action = mentalWin ? 'CAT blocks complete — Mind win earned.' : nextTask ? 'NEXT: ' + nextTask.blockId + ' — ' + nextTask.title : basic.mentor
            } else if (basic.id === 'BODY') {
              action = todayBodyPlan.title + ' • ' + todayBodyPlan.duration + (bodyRemaining ? ' • ' + bodyRemaining + ' learning steps left' : ' • learning complete')
            } else if (basic.id === 'EMOTIONAL') {
              action = 'TODAY: 3 slow breaths before a difficult reply. Win = one deliberate response.'
            } else if (basic.id === 'SPIRITUAL') {
              action = 'TODAY: 2 min Radhe Radhe + gratitude + one value to live.'
            } else if (basic.id === 'SOCIAL') {
              action = 'TODAY: one genuine conversation. Listen first; advise only when useful.'
            } else if (basic.id === 'FINANCIAL') {
              action = 'TODAY: log every spend + stop one unnecessary purchase.'
            } else if (basic.id === 'PURPOSE') {
              action = 'TODAY: after CAT priorities, take one 3-minute business/leadership lesson.'
            }
            return (
              <div key={basic.id} role="button" tabIndex={0} className={'daily-basic ' + (won ? 'won' : isCurrent ? 'current' : 'ready') + (activeLessonId === basic.id ? ' lesson-open' : '')} onClick={() => setActiveLessonId(basic.id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setActiveLessonId(basic.id) } }} aria-label={'Open today’s ' + basic.name + ' mini-lesson'} aria-expanded={activeLessonId === basic.id}>
                <div className="daily-basic-top">
                  <span className="daily-basic-number">{basic.n}</span>
                  <span className="daily-basic-icon">{basic.icon}</span>
                  <span className="daily-basic-state">{won ? 'DONE' : isCurrent ? 'DO THIS' : 'LEARN'}</span><span className="daily-basic-learn-hint">TAP TO LEARN</span>
                </div>
                <b className="daily-basic-name">{basic.name}</b>
                <span className="daily-basic-purpose">{basic.purpose}</span>
                <span className="daily-basic-mentor">{action}</span>
                {isCurrent && !won && basic.id !== 'MIND' && basic.id !== 'BODY' && (
                  <button className="daily-basic-btn" onClick={event => { event.stopPropagation(); toggleBestMeManualWin(basic.id) }}>MARK STEP DONE →</button>
                )}
                {basic.id === 'MIND' && !mentalWin && isCurrent && (
                  <button className="daily-basic-btn" onClick={event => { event.stopPropagation(); document.getElementById(nextTask ? 'dash_block_' + nextTask.blockId : 'dash_block_QA')?.scrollIntoView({ behavior:'smooth', block:'center' }) }}>GO TO CAT →</button>
                )}
                {basic.id === 'BODY' && isCurrent && (
                  <button className="daily-basic-btn" onClick={event => { event.stopPropagation(); window.dispatchEvent(new CustomEvent('jarvis:navigate', { detail:{ page:'body360' } })) }}>OPEN BODY 360 →</button>
                )}
              </div>
            )
          })}
        </div>

        {activeLessonId && (() => {
          const seed = kolkataParts.year * 10000 + kolkataParts.month * 100 + kolkataParts.date
          const lessonSet = DAILY_BEST_BASIC_LESSONS[activeLessonId]
          const lessonIndex = seed % lessonSet.length
          const lesson = lessonSet[lessonIndex]
          const lessonMeta = DAILY_BEST_BASICS.find(basic => basic.id === activeLessonId)!
          const lessonIsCurrent = nextDimensionIndex === DAILY_BEST_BASICS.findIndex(basic => basic.id === activeLessonId)
          return (
            <div className="daily-lesson-panel" aria-label={lessonMeta.name + ' daily lesson'} onClick={event => event.stopPropagation()}>
              <div className="daily-lesson-head">
                <div>
                  <span className="daily-lesson-kicker">TODAY’S MICRO-LESSON • {lessonMeta.n} / 07 • LESSON {lessonIndex + 1} / {lessonSet.length}</span>
                  <strong>{lesson.title}</strong>
                </div>
                <button type="button" className="daily-lesson-close" onClick={() => setActiveLessonId(null)} aria-label="Close lesson">×</button>
              </div>
              <div className="daily-lesson-grid">
                <div><span>WHY IT MATTERS</span><p>{lesson.why}</p></div>
                <div><span>HOW IT WORKS</span><p>{lesson.mechanism}</p></div>
                <div><span>REAL EXAMPLE</span><p>{lesson.example}</p></div>
                <div><span>DO IT TODAY</span><p>{lesson.practice}</p></div>
                <div className="daily-lesson-recall"><span>10-SEC RECALL</span><b>{lesson.recall}</b></div>
              </div>
              <div className="daily-lesson-loop" aria-label="Three minute learning loop">
                <span><b>01</b> LEARN <em>60s</em></span>
                <span><b>02</b> APPLY <em>90s</em></span>
                <span><b>03</b> RECALL <em>30s</em></span>
              </div>
              <div className="daily-lesson-footer">
                <div className="daily-lesson-footer-copy">
                  <span>{lessonWins[activeLessonId] ? 'LESSON DONE ✓' : lessonIsCurrent ? 'CURRENT STEP' : 'LEARNING IS ALWAYS OPEN'}</span>
                  <b>{lessonMeta.mentor}</b>
                </div>
                <button
                  type="button"
                  className={'daily-lesson-done ' + (lessonWins[activeLessonId] ? 'done' : '')}
                  onClick={() => toggleLessonLearned(activeLessonId)}
                  aria-pressed={Boolean(lessonWins[activeLessonId])}
                >
                  {lessonWins[activeLessonId] ? 'LEARNED TODAY ✓' : 'MARK LESSON LEARNED →'}
                </button>
              </div>
            </div>
          )
        })()}

        <div className="daily-basics-footer">
          <span>MENTOR RULE</span>
          <b>CAT FIRST • BODY SECOND • CHARACTER EVERYWHERE ELSE</b>
          <em>Sequence: 01 → 07. All seven are open to learn; do the highlighted step first, then move forward.</em>
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
              {finalWin ? 'All 7 dimensions won in sequence today.' : 'All 7 stay open. The sequence shows the recommended order; your current step is highlighted.'}
              <br />Today’s 7-year layer: {currentSevenYear.theme}.
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
            const canMark = manual
            const active = isCurrent && !won

            return (
              <div id={'bestme_dimension_' + dimension.id} key={dimension.id} className={'best-me-dimension ' + (won ? 'won' : active ? 'active' : 'ready')}>
                <div className="best-me-dimension-top">
                  <span className="best-me-dimension-number">{String(index + 1).padStart(2,'0')}</span>
                  <span className="best-me-dimension-icon">{dimension.icon}</span>
                  <span className="best-me-win-state">{won ? 'WON' : active ? 'CURRENT' : 'READY'}</span>
                </div>
                <div className="best-me-dimension-title">{dimension.title}</div>
                <div className="best-me-dimension-sub">{dimension.subtitle}</div>
                <div className="best-me-dimension-rule">{dimension.rule}</div>
                <div className="best-me-dimension-check">
                  <span className={'best-me-checkbox ' + (won ? 'checked' : '') + ((dimension.id === 'MIND' || dimension.id === 'BODY') ? ' auto' : '')}
                    role="checkbox"
                    aria-checked={won}
                    aria-readonly={dimension.id === 'MIND' || dimension.id === 'BODY'}
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation()
                      if (dimension.id === 'MIND') {
                        document.getElementById(nextTask ? 'dash_block_' + nextTask.blockId : 'dash_block_QA')?.scrollIntoView({ behavior:'smooth', block:'center' })
                      } else if (dimension.id === 'BODY') {
                        window.dispatchEvent(new CustomEvent('jarvis:navigate', { detail: { page:'body360' } }))
                      } else {
                        toggleBestMeManualWin(dimension.id)
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== 'Enter' && event.key !== ' ') return
                      event.preventDefault()
                      event.stopPropagation()
                      if (dimension.id === 'MIND') {
                        document.getElementById(nextTask ? 'dash_block_' + nextTask.blockId : 'dash_block_QA')?.scrollIntoView({ behavior:'smooth', block:'center' })
                      } else if (dimension.id === 'BODY') {
                        window.dispatchEvent(new CustomEvent('jarvis:navigate', { detail: { page:'body360' } }))
                      } else {
                        toggleBestMeManualWin(dimension.id)
                      }
                    }}
                  >{won ? '✓' : ''}</span>
                  <div>
                    <b>CHECK TODAY</b>
                    <span>{DAILY_BEST_BASICS.find(basic => basic.id === dimension.id)?.dailyCheck || dimension.fallback}</span>
                  </div>
                </div>
                <div className="best-me-seven-link">
                  <span>7-YEAR LINK • {currentSevenYearLabel}</span>
                  <b>{DAILY_BEST_BASICS.find(basic => basic.id === dimension.id)?.sevenYear || 'Build capability that compounds.'}</b>
                </div>
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
                    disabled={false}
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
                : 'Use 01→07 as your daily sequence. Every dimension stays open; finish the final formula honestly.'}
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
      {(() => {
        const seed = kolkataParts.year * 10000 + kolkataParts.month * 100 + kolkataParts.date
        const vision = VISION_QUOTES[seed % VISION_QUOTES.length]
        return (
          <div className="mission-bar">
            <div className="mission-text"><AppIcon name="target" size={12} /> MISSION: {phase.mission}</div>
            <div className="date-display">{realDayName}, {realDateStr}</div>
            <div className="mission-vision" aria-live="polite">
              <span className="mission-vision-label"><AppIcon name="rocket" size={11} /> DAILY VISION</span>
              <strong>“{vision.quote}”</strong>
              <em>{vision.sub}</em>
            </div>
          </div>
        )
      })()}

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

          {/* LIVE MASTERY TRACKER */}
          <div className="card">
            <div className="card-title">📈 Mastery Tracker — Real Evidence</div>
            <div className="mastery-live-note">
              <strong>VERIFIED DATA:</strong> level, attempts and accuracy come only from the stored mastery profile. No placeholder percentages.
            </div>
            <div className="mastery-live-grid">
              {masteryTargets.map(target => {
                const topic = target.topic
                const level = topic?.currentLevel ?? 0
                const attempts = topic?.attempts ?? 0
                const accuracy = attempts > 0 ? Math.round(((topic?.correct ?? 0) / attempts) * 100) : null
                const progress = Math.round((level / 5) * 100)
                return (
                  <div key={target.key} className="mastery-live-row">
                    <div className="mastery-live-name">{target.label}<small>{target.subject}</small></div>
                    <div className="mastery-live-bar-wrap"><div className="mastery-live-bar" style={{ width: progress + '%', background: target.color }} /></div>
                    <div className="mastery-live-score">
                      <b>L{level}</b>
                      <span>{accuracy === null ? 'NO EVIDENCE' : accuracy + '% • ' + attempts + ' Q'}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mastery-live-foot">
              <span>L0 Don’t Know → L5 CAT Mastery</span>
              <span>Evidence beats appearance.</span>
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
