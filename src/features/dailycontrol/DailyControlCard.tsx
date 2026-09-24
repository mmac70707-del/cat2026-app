import { useEffect, useMemo, useState } from 'react'
import { useTodayTasks } from '@/hooks/useTasks'
import { usePhase } from '@/hooks/usePhase'
import { getKolkataDateKey, getKolkataDateParts, getFirstPassDayNum } from '@/services/calendarEngine'
import { ROADMAP_44 } from '@/data/roadmap44'
import { getPercentylDailyTarget } from '@/data/percentylPlan2'

const DAYS = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY']
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

const PHASES = [
  ['REBUILD','2026-09-01','2026-09-15'],
  ['APPLICATION','2026-09-16','2026-10-04'],
  ['MOCK-DOMINATED','2026-10-05','2026-11-08'],
  ['CONSOLIDATION','2026-11-09','2026-11-20'],
  ['TAPER','2026-11-21','2026-11-28'],
] as const

const OMIA: Record<string,string> = {
  MONDAY:'Mock analysis + Error Log + Repair',
  TUESDAY:'VARC Sectional + deepest verified VARC weakness',
  WEDNESDAY:'VARC Analysis + Repair + Retest',
  THURSDAY:'DILR Sectional + set-selection/representation repair',
  FRIDAY:'DILR Analysis + Repair + Retest',
  SATURDAY:'Quant Sectional + weakest QA repair',
  SUNDAY:'Full CAT-length Mock + required analysis',
}

const schedule = [
  ['05:00–05:15','Morning Reset'],
  ['05:15–05:55','Daily Dose — LRDI test + VA test'],
  ['09:00–10:30','QA'],
  ['10:45–12:00','DILR'],
  ['12:15–01:15','VARC — 1 RC + VA'],
  ['01:15–03:00','Library Deep Work'],
  ['05:30–07:00','Coaching'],
  ['07:20–08:20','Gym'],
  ['08:30–09:00','Dinner'],
  ['09:00–09:45','Test Analysis + Error Log'],
  ['09:45–10:00','Revision — recap → revise → connect → preview'],
  ['10:00','Sleep'],
]

function todayIndia() {
  const now = new Date()
  const p = getKolkataDateParts(now)
  return {
    now,
    key: getKolkataDateKey(now),
    day: DAYS[p.dayOfWeek],
    date: p.date,
    month: MONTHS[p.month - 1],
    year: p.year,
  }
}

function currentPhase(key: string) {
  const found = PHASES.find(([,start,end]) => key >= start && key <= end)
  return found?.[0] ?? (key < PHASES[0][1] ? 'PRE-CAT' : 'POST-CAT')
}

export function DailyControlCard() {
  // Live daily engine: date/weekday is derived from Asia/Kolkata and refreshed while the app is open.
  const phase = usePhase()
  const { tasks, loading, done, pct } = useTodayTasks()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const refresh = () => setTick(v => v + 1)
    const id = window.setInterval(refresh, 30000)
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  const today = useMemo(() => todayIndia(), [tick])
  const phaseName = currentPhase(today.key)
  const dayNum = getFirstPassDayNum(today.key)
  const roadmap = ROADMAP_44.find(x => x.dayNum === dayNum)
  const dayAction = OMIA[today.day] ?? 'Execute the next verified CAT task.'
  const dailyTarget = getPercentylDailyTarget(today.key)
  const currentTaskLine = current ? `${current.blockId} — ${current.title}` : 'All 8 CAT blocks complete'

  const completed = tasks.filter(t => t.status === 'DONE').length
  const current = tasks.find(t => t.status !== 'DONE')
  const remaining = Math.max(0, tasks.length - completed - (current ? 1 : 0))

  if (loading) return null

  return (
    <section style={{ margin:'0 0 18px', border:'1px solid rgba(245,166,35,.55)', borderRadius:16, overflow:'hidden', background:'linear-gradient(180deg,#111827,#0B1220)', boxShadow:'0 12px 30px rgba(0,0,0,.28)' }}>
      <div style={{ padding:'16px 18px', background:'linear-gradient(90deg,rgba(245,166,35,.14),rgba(37,99,235,.08))', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
        <div style={{ fontSize:11, letterSpacing:1.4, fontWeight:900, color:'#F5A623' }}>BEST VERSION — DAILY CONTROL CARD</div>
        <div style={{ marginTop:5, fontSize:20, fontWeight:950, color:'#FFF' }}>{today.date} {today.month} {today.year} — {today.day}</div>
        <div style={{ marginTop:5, fontSize:11, color:'#94A3B8' }}>LOCKED SYSTEM • DO THE NEXT RIGHT THING • INDIA DATE AUTO-SYNC</div>
      </div>

      <div style={{ padding:'14px 18px', display:'grid', gap:12 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:10 }}>
          <div style={{ padding:12, borderRadius:10, background:'rgba(34,197,94,.08)', border:'1px solid rgba(34,197,94,.2)' }}>
            <div style={{ fontSize:10, color:'#86EFAC', fontWeight:900 }}>PRIMARY</div>
            <div style={{ marginTop:4, color:'#FFF', fontWeight:800 }}>CAT 2026 • {phaseName}</div>
            <div style={{ marginTop:3, color:'#94A3B8', fontSize:11 }}>{phase.purpose || phase.name}</div>
          </div>
          <div style={{ padding:12, borderRadius:10, background:'rgba(59,130,246,.08)', border:'1px solid rgba(59,130,246,.2)' }}>
            <div style={{ fontSize:10, color:'#93C5FD', fontWeight:900 }}>TODAY'S O.M.I.A.</div>
            <div style={{ marginTop:4, color:'#FFF', fontWeight:800 }}>{dayAction}</div>
            {roadmap && <div style={{ marginTop:3, color:'#94A3B8', fontSize:11 }}>Day {dayNum}/44 • {roadmap.chapter}</div>}
            <div style={{ marginTop:7, color:'#CBD5E1', fontSize:10, lineHeight:1.5 }}>Today: {dailyTarget.quantTopic} • {dailyTarget.dilrTopic} • {dailyTarget.varcTopic}</div>
          </div>
        </div>

        <div style={{ padding:12, borderRadius:10, background:'#0F172A', border:'1px solid rgba(255,255,255,.07)' }}>
          <div style={{ fontSize:10, color:'#F5A623', fontWeight:900, letterSpacing:.8 }}>MORNING GATE — START CLEAN</div>
          <div style={{ marginTop:5, color:'#E5E7EB', fontSize:12, lineHeight:1.65 }}>Wake/reset → water → gentle humming → gentle jaw mobility → gentle voice warm-up → comfortable neck mobility → phone away.</div>
          <div style={{ marginTop:5, color:'#86EFAC', fontSize:11, fontWeight:800 }}>Today is a new execution day.</div>
        </div>

        <div>
          <div style={{ fontSize:10, color:'#F5A623', fontWeight:900, letterSpacing:.8, marginBottom:7 }}>CAT EXECUTION — QA → DILR → VARC → TEST → ANALYSIS → REVISION → REPAIR → RETEST</div>
          <div style={{ display:'grid', gap:7 }}>
            <div style={{fontSize:10,color:'#CBD5E1'}}><strong style={{color:'#86EFAC'}}>QA:</strong> {dailyTarget.quantDetail} ({dailyTarget.quantTargetQs} Qs)</div>
            <div style={{fontSize:10,color:'#CBD5E1'}}><strong style={{color:'#93C5FD'}}>DILR:</strong> {dailyTarget.dilrDetail} ({dailyTarget.dilrTargetSets} sets)</div>
            <div style={{fontSize:10,color:'#DDD6FE'}}><strong style={{color:'#C4B5FD'}}>VARC:</strong> {dailyTarget.varcDetail} ({dailyTarget.varcTargetPsg} passages)</div>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginTop:8 }}>
            {['QA','DILR','VARC','TEST','ANALYSIS','REVISION','REPAIR','RETEST'].map((x,i) => {
              const isDone = tasks[i]?.status === 'DONE'
              return <span key={x} style={{ padding:'6px 9px', borderRadius:8, fontSize:10, fontWeight:900, background:isDone?'rgba(34,197,94,.14)':'rgba(148,163,184,.08)', border:isDone?'1px solid rgba(34,197,94,.35)':'1px solid rgba(148,163,184,.15)', color:isDone?'#86EFAC':'#CBD5E1' }}>{isDone?'✓ ':''}{x}</span>
            })}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
          <div style={{ textAlign:'center', padding:9, borderRadius:9, background:'rgba(34,197,94,.08)' }}><div style={{fontSize:9,color:'#86EFAC',fontWeight:900}}>🟢 COMPLETED</div><div style={{fontSize:18,color:'#FFF',fontWeight:950}}>{completed}</div></div>
          <div style={{ textAlign:'center', padding:9, borderRadius:9, background:'rgba(245,166,35,.08)' }}><div style={{fontSize:9,color:'#FCD34D',fontWeight:900}}>🟨 CURRENT</div><div style={{fontSize:11,color:'#FFF',fontWeight:800,marginTop:4}}>{current?.blockId ?? '—'}</div></div>
          <div style={{ textAlign:'center', padding:9, borderRadius:9, background:'rgba(148,163,184,.06)' }}><div style={{fontSize:9,color:'#CBD5E1',fontWeight:900}}>⬜ REMAINING</div><div style={{fontSize:18,color:'#FFF',fontWeight:950}}>{remaining}</div></div>
        </div>

        <div>
          <div style={{ fontSize:10, color:'#60A5FA', fontWeight:900, marginBottom:7 }}>LOCKED CLOCK BLOCKS</div>
          <div style={{ display:'grid', gap:5 }}>
            {schedule.map(([time,label]) => <div key={time} style={{ display:'grid', gridTemplateColumns:'90px 1fr', gap:8, fontSize:10 }}><span style={{color:'#F5A623',fontWeight:800}}>{time}</span><span style={{color:'#CBD5E1'}}>{label}</span></div>)}
          </div>
        </div>

        <div style={{ padding:12, borderRadius:10, border:'1px solid rgba(245,166,35,.2)', background:'rgba(245,166,35,.05)' }}>
          <div style={{ fontSize:10, color:'#F5A623', fontWeight:900 }}>ACTUAL TODAY TASK</div>
          <div style={{ marginTop:5, color:'#FFF', fontSize:11, fontWeight:800, lineHeight:1.5 }}>{currentTaskLine}</div>
        </div>

        <div style={{ padding:12, borderRadius:10, border:'1px solid rgba(168,85,247,.2)', background:'rgba(168,85,247,.06)' }}>
          <div style={{ fontSize:10, color:'#C4B5FD', fontWeight:900 }}>INNER STATE + CHARACTER</div>
          <div style={{ marginTop:5, color:'#E5E7EB', fontSize:11, lineHeight:1.6 }}>Gratitude → grounded positive action → faith + effort. Honesty → courage → respect → family → helpfulness → keeping promises.</div>
        </div>

        <div style={{ padding:12, borderRadius:10, border:'1px solid rgba(239,68,68,.18)', background:'rgba(239,68,68,.05)' }}>
          <div style={{ fontSize:10, color:'#FCA5A5', fontWeight:900 }}>DIGITAL SLIP RECOVERY GATE</div>
          <div style={{ marginTop:5, color:'#E5E7EB', fontSize:11, lineHeight:1.6 }}>Mistake ≠ verdict. Notice → stop → 3 calm breaths → “The lost time is gone; the next moment is mine” → one tiny useful action → begin. No guilt loop, punishment, panic, or catch-up marathon.</div>
        </div>

        <div style={{ padding:12, borderRadius:10, border:'1px solid rgba(245,166,35,.18)', background:'rgba(245,166,35,.05)' }}>
          <div style={{ fontSize:10, color:'#F5A623', fontWeight:900 }}>7-YEAR DIRECTION — BACKGROUND ONLY</div>
          <div style={{ marginTop:5, color:'#FFF', fontSize:11, fontWeight:800 }}>CAT → MBA/Career → Skills → Technology/Business → Wealth → Character → Family → Real-world impact</div>
          <div style={{ marginTop:4, color:'#94A3B8', fontSize:10 }}>Long-term vision stays in the background. TODAY = execute CAT well.</div>
        </div>

        <div style={{ padding:'10px 12px', borderRadius:9, background:'rgba(255,255,255,.035)', color:'#CBD5E1', fontSize:11, lineHeight:1.6 }}>
          <strong style={{color:'#FFF'}}>Rule:</strong> Basic → Advanced → Practice → Review → Connection → Next. If weak: repair → retest. Revision = 30-sec recap → 2-min revision → connection → preview.
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:3 }}>
          <span style={{fontSize:10,color:'#94A3B8'}}>Today: {done}/8 CAT blocks • {pct}% complete</span>
          <span style={{fontSize:10,color:'#86EFAC',fontWeight:900}}>CHECK → RESET → NEXT ACTION</span>
        </div>
      </div>
    </section>
  )
}
