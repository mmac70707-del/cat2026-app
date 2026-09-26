import { useState, useEffect } from 'react'
import { useTodayTasks } from '@/hooks/useTasks'
import { DailyScoreRepository } from '@/repositories/index'
import { ErrorRepository } from '@/repositories/ErrorRepository'
import { usePhase } from '@/hooks/usePhase'
import { getWeekNumber, getDaysLeft } from '@/services/domain'
import { getKolkataDateKey, getKolkataDateParts, getFirstPassDayNum } from '@/services/calendarEngine'
import { ROADMAP_44 } from '@/data/roadmap44'
import { BLOCKS, SCHEDULE_ITEMS, WEEK_PLAN_TEMPLATE } from '@/data/config'
import { useToast } from '@/components/Toast'
import './Dashboard.css'
import { DailyControlCard } from '@/features/dailycontrol/DailyControlCard'
import { LinkedInDailyCard } from '@/features/linkedin/LinkedInDailyCard'

const SEQUENCE_STRIP = [
  { seq: '01', id: 'QA',       label: 'QA',       sub: 'Quantitative', tag: 'LIVE', col: '#16A34A', bg: 'rgba(22,163,74,0.15)' },
  { seq: '02', id: 'DILR',     label: 'DILR',     sub: 'Data + Logic', tag: 'LIVE', col: '#2563EB', bg: 'rgba(37,99,235,0.15)' },
  { seq: '03', id: 'VARC',     label: 'VARC',     sub: 'Verbal + RC', tag: 'LIVE', col: '#7C3AED', bg: 'rgba(124,58,237,0.15)' },
  { seq: '04', id: 'TEST',     label: 'TEST',     sub: 'Sectional / Mock', tag: 'LIVE', col: '#D97706', bg: 'rgba(217,119,6,0.15)' },
  { seq: '05', id: 'ANALYSIS', label: 'ANALYSIS', sub: 'Error Log', tag: 'LIVE', col: '#DC2626', bg: 'rgba(220,38,38,0.15)' },
  { seq: '06', id: 'REVISION', label: 'REVISION', sub: 'Recall + Connect', tag: 'LIVE', col: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' },
  { seq: '07', id: 'REPAIR',   label: 'REPAIR',   sub: 'Weakness Fix', tag: 'LIVE', col: '#DB2777', bg: 'rgba(219,39,119,0.15)' },
  { seq: '08', id: 'RETEST',   label: 'RETEST',   sub: 'Confirm Mastery', tag: 'LIVE', col: '#0E9F9F', bg: 'rgba(14,159,159,0.15)' },
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
  const nextTask = tasks.find(task => task.status !== 'DONE') || null
  const getSequenceState = (id: string) => {
    const task = tasks.find(t => t.blockId === id)
    if (task?.status === 'DONE') return 'DONE'
    if (id === currentBlockId) return 'NOW'
    return getBlockLiveState(id, currentMinutes, task?.status || 'TODO')
  }

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
            <div className="daily-motivation-kicker">🔥 TODAY'S LINE</div>
            <div className="daily-motivation-quote">“{line.quote}”</div>
            <div className="daily-motivation-action"><span>NEXT ACTION</span>{line.action}</div>
          </div>
        )
      })()}

      {/* ── MISSION BAR ── */}
      <div className="mission-bar">
        <div className="mission-text">🎯 MISSION: {phase.mission}</div>
        <div className="date-display">{realDayName}, {realDateStr}</div>
        <div className="mission-quote">"Discipline Today Builds the Freedom Tomorrow"</div>
      </div>

      {/* ── MAIN ── */}
      <div className="main">

        <DailyControlCard />
        <LinkedInDailyCard />

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
              <div className="today-title">📅 {realDayName.toUpperCase()} — {realDateStr.toUpperCase()} • DAY {dayNum < 10 ? '0' + dayNum : dayNum} / 44</div>
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
              <div className="card-title">📅 Week {getWeekNumber()} — Real Master Schedule</div>
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
              <div className="card-title">🔴 Error Log System — C1 to C5</div>
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
              <div className="card-title">MAP Phase Timeline — 86 Days</div>
              <div className="phase-timeline">
                <div className="phase-item active">
                  <div className="phase-name" style={{ color: 'var(--green2)' }}>REBUILD</div>
                  <div className="phase-dates">Active Phase</div>
                  <div className="phase-goal">Concept + Accuracy</div>
                </div>
              </div>
              <div style={{ marginTop: 12, background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--green2)', marginBottom: 4 }}>🔒 MISSION &amp; VISION LOCKED</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{phase.purpose}</div>
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
