import { useEffect, useMemo, useState } from 'react'
import { useTodayTasks } from '@/hooks/useTasks'
import { usePhase } from '@/hooks/usePhase'
import { getKolkataDateKey, getKolkataDateParts, getFirstPassDayNum, getPhaseForDateKey } from '@/services/calendarEngine'
import { ROADMAP_44 } from '@/data/roadmap44'
import { PHASES as CONFIG_PHASES } from '@/data/config'
import { getPercentylDailyTarget } from '@/data/percentylPlan2'
import { ErrorRepository } from '@/repositories/ErrorRepository'

const DAYS = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY']
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

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

export function DailyControlCard() {
  // Live daily engine: date/weekday is derived from Asia/Kolkata and refreshed while the app is open.
  const phase = usePhase()
  const { tasks, loading, done, pct } = useTodayTasks()
  const [tick, setTick] = useState(0)
  const [previewOffset, setPreviewOffset] = useState(0)
  const [errorCounts, setErrorCounts] = useState<Record<'C1'|'C2'|'C3'|'C4'|'C5', number>>({ C1: 0, C2: 0, C3: 0, C4: 0, C5: 0 })

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

  useEffect(() => {
    const loadErrors = () => ErrorRepository.getTypeCounts().then(setErrorCounts).catch(() => undefined)
    loadErrors()
    const id = window.setInterval(loadErrors, 30000)
    window.addEventListener('focus', loadErrors)
    document.addEventListener('visibilitychange', loadErrors)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('focus', loadErrors)
      document.removeEventListener('visibilitychange', loadErrors)
    }
  }, [])

  const preview = useMemo(() => {
    const base = new Date(Date.UTC(today.year, today.month - 1, today.date))
    base.setUTCDate(base.getUTCDate() + previewOffset)
    const p = getKolkataDateParts(base)
    const key = getKolkataDateKey(base)
    return {
      key,
      day: DAYS[p.dayOfWeek],
      date: p.date,
      month: MONTHS[p.month - 1],
      year: p.year,
      roadmap: ROADMAP_44.find(x => x.dateIso === key),
      target: getPercentylDailyTarget(key),
      phaseId: getPhaseForDateKey(key),
    }
  }, [today, previewOffset])

  const phaseForPreview = CONFIG_PHASES.find(p => p.id === preview.phaseId) ?? phase
  const phaseProgress = (() => {
    const start = new Date(phaseForPreview.start + 'T00:00:00Z').getTime()
    const end = new Date(phaseForPreview.end + 'T00:00:00Z').getTime()
    const cur = new Date(preview.key + 'T00:00:00Z').getTime()
    if (cur <= start) return 0
    if (cur >= end) return 100
    return Math.round(((cur - start) / Math.max(1, end - start)) * 100)
  })()
  const firstPassProgress = Math.max(0, Math.min(100, Math.round((dayNum / 44) * 100)))
  const totalLoggedErrors = Object.values(errorCounts).reduce((sum, n) => sum + n, 0)
  const phaseId = getPhaseForDateKey(today.key)
  const phaseInfo = CONFIG_PHASES.find(p => p.id === phaseId) ?? phase
  const dayNum = getFirstPassDayNum(today.key)
  const roadmap = ROADMAP_44.find(x => x.dayNum === dayNum)
  const dayAction = OMIA[today.day] ?? 'Execute the next verified CAT task.'
  const dailyTarget = getPercentylDailyTarget(today.key)
  const completed = tasks.filter(t => t.status === 'DONE').length
  const current = tasks.find(t => t.status !== 'DONE')
  const currentTaskLine = current ? `${current.blockId} — ${current.title}` : 'All 8 CAT blocks complete'
  const remaining = Math.max(0, tasks.length - completed - (current ? 1 : 0))

  if (loading) return null

  return (
    <section style={{ margin:'0 0 18px', border:'1px solid rgba(245,166,35,.55)', borderRadius:16, overflow:'hidden', background:'linear-gradient(180deg,#111827,#0B1220)', boxShadow:'0 12px 30px rgba(0,0,0,.28)' }}>
      <div style={{ padding:'16px 18px', background:'linear-gradient(90deg,rgba(245,166,35,.14),rgba(37,99,235,.08))', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
        <div style={{ fontSize:11, letterSpacing:1.4, fontWeight:900, color:'#F5A623' }}>BEST VERSION — DAILY CONTROL CARD</div>
        <div style={{ marginTop:5, fontSize:20, fontWeight:950, color:'#FFF' }}>{today.date} {today.month} {today.year} — {today.day}</div>
        <div style={{ marginTop:5, fontSize:11, color:'#94A3B8' }}>LOCKED SYSTEM • DO THE NEXT RIGHT THING • INDIA DATE AUTO-SYNC</div>
      </div>

        {/* SMART DATE + PROGRESS LAYER: additive, read-only; does not alter today's tasks */}
        <div style={{ display:'grid', gap:10 }}>
          <div style={{ padding:12, borderRadius:12, background:'linear-gradient(135deg,rgba(37,99,235,.10),rgba(245,166,35,.06))', border:'1px solid rgba(96,165,250,.22)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:10, flexWrap:'wrap' }}>
              <div>
                <div style={{ fontSize:10, color:'#93C5FD', fontWeight:900, letterSpacing:1 }}>DATE-DRIVEN CAT ENGINE</div>
                <div style={{ marginTop:4, fontSize:13, color:'#FFF', fontWeight:900 }}>{preview.date} {preview.month} {preview.year} · {preview.day}</div>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                {[-1,0,1].map(offset => (
                  <button key={offset} type="button" onClick={() => setPreviewOffset(offset)} style={{ border:'1px solid rgba(255,255,255,.12)', background:offset === previewOffset ? 'rgba(245,166,35,.16)' : 'rgba(255,255,255,.04)', color:offset === previewOffset ? '#FCD34D' : '#CBD5E1', borderRadius:8, padding:'6px 9px', fontSize:9, fontWeight:900, cursor:'pointer' }}>
                    {offset === -1 ? '← YESTERDAY' : offset === 0 ? 'TODAY' : 'TOMORROW →'}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginTop:9, display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(145px,1fr))', gap:8 }}>
              <div style={{ padding:9, borderRadius:9, background:'rgba(255,255,255,.035)' }}>
                <div style={{ fontSize:9, color:'#94A3B8', fontWeight:900 }}>44-DAY FIRST PASS</div>
                <div style={{ marginTop:4, color:'#FFF', fontWeight:900 }}>DAY {dayNum || '—'} / 44</div>
                <div style={{ height:5, marginTop:6, background:'rgba(255,255,255,.08)', borderRadius:99, overflow:'hidden' }}>
                  <div style={{ width:(firstPassProgress + '%'), height:'100%', background:'linear-gradient(90deg,#2563EB,#60A5FA)', borderRadius:99 }} />
                </div>
              </div>
              <div style={{ padding:9, borderRadius:9, background:'rgba(255,255,255,.035)' }}>
                <div style={{ fontSize:9, color:'#94A3B8', fontWeight:900 }}>CURRENT PHASE</div>
                <div style={{ marginTop:4, color:'#FFF', fontWeight:900 }}>{phaseForPreview.name}</div>
                <div style={{ marginTop:5, height:5, background:'rgba(255,255,255,.08)', borderRadius:99, overflow:'hidden' }}>
                  <div style={{ width:(phaseProgress + '%'), height:'100%', background:'linear-gradient(90deg,#F5A623,#FCD34D)', borderRadius:99 }} />
                </div>
              </div>
              <div style={{ padding:9, borderRadius:9, background:'rgba(255,255,255,.035)' }}>
                <div style={{ fontSize:9, color:'#94A3B8', fontWeight:900 }}>TEST RHYTHM</div>
                <div style={{ marginTop:4, color:'#FFF', fontWeight:900, lineHeight:1.35 }}>{dayAction}</div>
              </div>
            </div>
          </div>
          <div style={{ padding:12, borderRadius:12, background:'rgba(148,163,184,.045)', border:'1px solid rgba(148,163,184,.12)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8, marginBottom:8 }}>
              <div style={{ fontSize:10, color:'#CBD5E1', fontWeight:900, letterSpacing:.8 }}>VERIFIED ERROR ENGINE • C1–C5</div>
              <div style={{ fontSize:9, color:'#94A3B8' }}>{totalLoggedErrors} logged</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6 }}>
              {(['C1','C2','C3','C4','C5'] as const).map(code => {
                const labels: Record<string,string> = { C1:'Concept', C2:'Calc', C3:'Misread', C4:'Approach', C5:'Time' }
                const count = errorCounts[code] || 0
                const max = Math.max(1, ...Object.values(errorCounts))
                const pctBar = Math.min(100, Math.round((count / max) * 100))
                return (
                  <div key={code} style={{ padding:'8px 7px', borderRadius:9, background:'rgba(255,255,255,.035)', border:'1px solid rgba(255,255,255,.06)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', gap:4 }}><span style={{ fontSize:10, color:'#FFF', fontWeight:950 }}>{code}</span><span style={{ fontSize:10, color:'#FCD34D', fontWeight:900 }}>{count}</span></div>
                    <div style={{ marginTop:4, fontSize:8, color:'#94A3B8', fontWeight:700 }}>{labels[code]}</div>
                    <div style={{ marginTop:6, height:4, background:'rgba(255,255,255,.07)', borderRadius:99, overflow:'hidden' }}><div style={{ width:(pctBar + '%'), height:'100%', background:'linear-gradient(90deg,#7C3AED,#C4B5FD)', borderRadius:99 }} /></div>
                  </div>
                )
              })}
            </div>
          </div>
          {preview.roadmap && <div style={{ padding:12, borderRadius:12, background:'rgba(34,197,94,.055)', border:'1px solid rgba(34,197,94,.18)' }}>
            <div style={{ fontSize:10, color:'#86EFAC', fontWeight:900, letterSpacing:.8 }}>DATE-SPECIFIC TARGET MIRROR</div>
            <div style={{ marginTop:6, display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:7 }}>
              <div style={{ fontSize:10, color:'#CBD5E1' }}><strong style={{color:'#86EFAC'}}>QA</strong> · {preview.target.quantTopic} · {preview.target.quantTargetQs} Qs</div>
              <div style={{ fontSize:10, color:'#CBD5E1' }}><strong style={{color:'#93C5FD'}}>DILR</strong> · {preview.target.dilrTopic} · {preview.target.dilrTargetSets} sets</div>
              <div style={{ fontSize:10, color:'#DDD6FE' }}><strong style={{color:'#C4B5FD'}}>VARC</strong> · {preview.target.varcTopic} · {preview.target.varcTargetPsg} passages</div>
            </div>
            <div style={{ marginTop:7, fontSize:9, color:'#94A3B8' }}>Roadmap: Day {preview.roadmap.dayNum}/44 · {preview.roadmap.chapter} · {preview.roadmap.dilrFamily}</div>
          </div>}
        </div>
      <div style={{ padding:'14px 18px', display:'grid', gap:12 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:10 }}>
          <div style={{ padding:12, borderRadius:10, background:'rgba(34,197,94,.08)', border:'1px solid rgba(34,197,94,.2)' }}>
            <div style={{ fontSize:10, color:'#86EFAC', fontWeight:900 }}>PRIMARY</div>
            <div style={{ marginTop:4, color:'#FFF', fontWeight:800 }}>CAT 2026 • {phaseId}</div>
            <div style={{ marginTop:3, color:'#94A3B8', fontSize:11 }}>{phaseInfo.purpose || phaseInfo.name}</div>
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
            {['QA','DILR','VARC','TEST','ANALYSIS','REVISION','REPAIR','RETEST'].map(x => {
              const isDone = tasks.find(t => t.blockId === x)?.status === 'DONE'
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
