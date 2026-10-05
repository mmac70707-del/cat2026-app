import { useEffect, useMemo, useState } from 'react'
import { useTodayTasks } from '@/hooks/useTasks'
import { usePhase } from '@/hooks/usePhase'
import { getKolkataDateKey, getKolkataDateParts, getFirstPassDayNum, getPhaseForDateKey } from '@/services/calendarEngine'
import { ROADMAP_44 } from '@/data/roadmap44'
import { PHASES as CONFIG_PHASES } from '@/data/config'
import { getPercentylDailyTarget } from '@/data/percentylPlan2'

const DAYS = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY']
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

const OMIA: Record<string,string> = {
  MONDAY:'Mock analysis + Error Log + Repair',
  TUESDAY:'VARC Sectional + deepest verified VARC weakness',
  WEDNESDAY:'DILR Sectional + link building from topics',
  THURSDAY:'QA Sectional + verify core rules + solve 1 unsolved set',
  FRIDAY:'Full Mock Test + deep analysis by question',
  SATURDAY:'Error Log review + repair 5 high-frequency errors',
  SUNDAY:'Percentile & mock review + forecast next week',
}

const schedule = [
  ['05:30–06:00','Yoga'],
  ['06:00–06:30','Breathing + Throat warm up'],
  ['06:30–07:00','Shower + Light breakfast'],
  ['07:00–09:00','Morning blocks (QA/DILR/VARC)'],
  ['09:00–09:15','Break + hydration'],
  ['09:15–09:45','Test/Analysis (unburden)'],
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


function HairHealthCard() {
  const STORAGE = 'cat2026_hair_health_v1'
  type HairState = {
    baselineDate?: string
    baselinePhotoNames?: string[]
    doctorSeen?: boolean
    daily?: Record<string, { nutrition:boolean; gentle:boolean; sleep:boolean }>
  }
  const [state, setState] = useState<HairState>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE) || '{}') } catch { return {} }
  })
  const [photoNames, setPhotoNames] = useState<string[]>(state.baselinePhotoNames || [])
  const today = todayIndia()
  const todayKey = today.key
  const day0 = state.baselineDate ? new Date(state.baselineDate + 'T00:00:00') : null
  const now = new Date(todayKey + 'T00:00:00')
  const elapsed = day0 ? Math.max(0, Math.floor((now.getTime() - day0.getTime()) / 86400000)) : 0
  const milestone = elapsed >= 365 ? '12M' : elapsed >= 150 ? '6M' : elapsed >= 75 ? '3M' : '0M'
  const daily = state.daily?.[todayKey] || { nutrition:false, gentle:false, sleep:false }
  const save = (next: HairState) => {
    setState(next)
    try { localStorage.setItem(STORAGE, JSON.stringify(next)) } catch {}
  }
  const toggleDaily = (key: 'nutrition'|'gentle'|'sleep') => {
    save({ ...state, daily: { ...(state.daily || {}), [todayKey]: { ...daily, [key]: !daily[key] } } })
  }
  const setBaseline = () => save({ ...state, baselineDate: todayKey, baselinePhotoNames: photoNames })
  const markDoctor = () => save({ ...state, doctorSeen: !state.doctorSeen })

  const milestones = [
    ['0M','BASELINE','Front • Left temple • Right temple • Top • Crown'],
    ['3M','STABILITY','Compare same-angle photos; look for progression/shedding trend'],
    ['6M','DENSITY','Compare frontal/temple coverage; review treatment with dermatologist'],
    ['12M','YEAR REVIEW','Stable vs improving vs progressing; decide next medical step'],
  ]

  return (
    <section aria-label="Hair Health Engine" style={{
      marginTop: 16, borderRadius: 16, overflow:'hidden',
      border:'1px solid rgba(99,246,255,.24)',
      background:'linear-gradient(145deg,rgba(10,20,32,.98),rgba(15,23,42,.98))',
      boxShadow:'0 14px 40px rgba(0,0,0,.28)'
    }}>
      <div style={{padding:'15px 16px',background:'linear-gradient(90deg,rgba(99,246,255,.08),rgba(124,58,237,.08))',borderBottom:'1px solid rgba(255,255,255,.06)'}}>
        <div style={{fontSize:10,fontWeight:900,letterSpacing:1.2,color:'#63F6FF'}}>BEST VERSION • HAIR HEALTH ENGINE</div>
        <div style={{fontSize:20,fontWeight:950,color:'#FFF',marginTop:4}}>Protect what you have. Measure. Diagnose. Improve.</div>
        <div style={{fontSize:10,color:'#94A3B8',marginTop:5,lineHeight:1.5}}>CAT stays primary. Hair care is a small support system — not another source of pressure.</div>
      </div>

      <div style={{padding:14,display:'grid',gap:12}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(125px,1fr))',gap:8}}>
          {milestones.map(([code,title,sub],i) => {
            const active = milestone === code
            const complete = (code==='0M' && !!state.baselineDate) || (code==='3M' && elapsed>=75) || (code==='6M' && elapsed>=150) || (code==='12M' && elapsed>=365)
            return <div key={code} style={{padding:'10px 9px',borderRadius:10,border:active?'1px solid rgba(99,246,255,.65)':'1px solid rgba(255,255,255,.07)',background:active?'rgba(99,246,255,.08)':'rgba(255,255,255,.025)'}}>
              <div style={{fontSize:9,fontWeight:900,color:active?'#63F6FF':'#94A3B8'}}>{complete?'✓ ':''}{code}</div>
              <div style={{fontSize:10,fontWeight:900,color:'#FFF',marginTop:3}}>{title}</div>
              <div style={{fontSize:8,color:'#94A3B8',lineHeight:1.4,marginTop:3}}>{sub}</div>
            </div>
          })}
        </div>

        <div style={{padding:12,borderRadius:11,background:'rgba(255,255,255,.025)',border:'1px solid rgba(255,255,255,.07)'}}>
          <div style={{fontSize:10,fontWeight:900,color:'#63F6FF',letterSpacing:.7}}>📸 M0 BASELINE — FIVE ANGLES</div>
          <div style={{fontSize:9,color:'#CBD5E1',marginTop:5,lineHeight:1.5}}>Front → Left temple → Right temple → Top → Crown. Same lighting, dry hair, same distance. This is tracking — not diagnosis.</div>
          <input
            type="file" accept="image/*" multiple
            onChange={e => setPhotoNames(Array.from(e.target.files || []).map(x => x.name).slice(0,5))}
            style={{marginTop:9,width:'100%',fontSize:9,color:'#CBD5E1'}}
          />
          <div style={{display:'flex',gap:8,alignItems:'center',marginTop:9,flexWrap:'wrap'}}>
            <button onClick={setBaseline} style={{padding:'8px 11px',borderRadius:8,border:'1px solid rgba(99,246,255,.35)',background:'rgba(99,246,255,.08)',color:'#63F6FF',fontWeight:900,fontSize:9,cursor:'pointer'}}>SAVE M0 BASELINE</button>
            <span style={{fontSize:9,color:state.baselineDate?'#86EFAC':'#FCD34D'}}>{state.baselineDate ? 'Baseline: '+state.baselineDate : 'Baseline not locked yet'}</span>
          </div>
          {photoNames.length>0 && <div style={{fontSize:8,color:'#64748B',marginTop:6}}>{photoNames.length} photo(s) selected: {photoNames.join(' • ')}</div>}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:8}}>
          {[
            ['nutrition','🥗','FOOD','Regular balanced meals + protein source; no crash dieting.'],
            ['gentle','🧴','HAIR CARE','Gentle washing/drying; no pulling, scratching or unnecessary heat.'],
            ['sleep','😴','RECOVERY','Protect regular sleep and recovery; hair is not a separate emergency every day.'],
          ].map(([key,icon,title,desc]) => (
            <button key={key} onClick={() => toggleDaily(key as 'nutrition'|'gentle'|'sleep')} style={{textAlign:'left',padding:11,borderRadius:10,cursor:'pointer',border:daily[key as keyof typeof daily]?'1px solid rgba(34,197,94,.4)':'1px solid rgba(255,255,255,.07)',background:daily[key as keyof typeof daily]?'rgba(34,197,94,.08)':'rgba(255,255,255,.025)',color:'#FFF'}}>
              <div style={{fontSize:14}}>{icon}</div>
              <div style={{fontSize:9,fontWeight:900,marginTop:4}}>{daily[key as keyof typeof daily]?'✓ ':''}{title}</div>
              <div style={{fontSize:8,color:'#94A3B8',lineHeight:1.4,marginTop:3}}>{desc}</div>
            </button>
          ))}
        </div>

        <div style={{padding:12,borderRadius:11,border:'1px solid rgba(245,166,35,.22)',background:'rgba(245,166,35,.045)'}}>
          <div style={{fontSize:10,fontWeight:900,color:'#FCD34D'}}>🩺 DOCTOR GATE — SOURCE OF TRUTH</div>
          <div style={{fontSize:9,color:'#CBD5E1',lineHeight:1.5,marginTop:5}}>Ask a dermatologist for scalp examination/dermoscopy if the hairline is changing. The app will track the doctor's plan; it will not prescribe finasteride, minoxidil, PRP or supplements.</div>
          <button onClick={markDoctor} style={{marginTop:8,padding:'7px 10px',borderRadius:8,border:'1px solid rgba(245,166,35,.28)',background:'transparent',color:state.doctorSeen?'#86EFAC':'#FCD34D',fontWeight:900,fontSize:9,cursor:'pointer'}}>{state.doctorSeen?'✓ DERMATOLOGY VISIT LOGGED':'LOG DERMATOLOGY VISIT'}</button>
        </div>

        <div style={{fontSize:8,color:'#64748B',lineHeight:1.5}}>Safety rule: sudden/patchy loss, significant scalp inflammation/pain, or rapid worsening → tell a parent/guardian and seek medical evaluation. Photos cannot determine the exact diagnosis or follicle viability.</div>
      </div>
    </section>
  )
}


function HairFoodCard() {
  const KEY = 'cat2026_hair_food_v1'
  type FoodState = { done?: Record<string, Record<string, boolean>> }
  const [state, setState] = useState<FoodState>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
  })
  const today = todayIndia()
  const dayKey = today.key
  const dayMenus: Record<string, { day:string; breakfast:string; lunch:string; snack:string; dinner:string }> = {
    MONDAY: { day:'MON', breakfast:'Moong/besan chilla + curd + fruit', lunch:'Dal + paneer/tofu + roti + sabzi + curd', snack:'Roasted chana + fruit', dinner:'Rajma + rice/roti + vegetables' },
    TUESDAY: { day:'TUE', breakfast:'Oats with milk/curd + nuts/seeds + fruit', lunch:'Chana + roti + sabzi + curd', snack:'Milk/curd + nuts', dinner:'Soy/tofu + dal + roti + vegetables' },
    WEDNESDAY: { day:'WED', breakfast:'Paneer/tofu sandwich or poha + curd + fruit', lunch:'Rajma + rice + vegetables + curd', snack:'Roasted chana + fruit', dinner:'Dal + paneer + roti + vegetables' },
    THURSDAY: { day:'THU', breakfast:'Moong chilla + curd + fruit', lunch:'Dal + soy/tofu + roti + sabzi', snack:'Milk/curd + nuts/seeds', dinner:'Chole + rice/roti + vegetables' },
    FRIDAY: { day:'FRI', breakfast:'Oats + milk + nuts/seeds + banana', lunch:'Rajma/chole + roti + curd + vegetables', snack:'Roasted chana + fruit', dinner:'Tofu/paneer + dal + roti + vegetables' },
    SATURDAY: { day:'SAT', breakfast:'Besan chilla + paneer/curd + fruit', lunch:'Mixed dal + soy/tofu + rice/roti + vegetables', snack:'Curd + nuts/seeds + fruit', dinner:'Chana + paneer + roti + vegetables' },
    SUNDAY: { day:'SUN', breakfast:'Moong/besan chilla + curd + fruit', lunch:'Dal + paneer/tofu + rice/roti + vegetables + curd', snack:'Roasted chana + fruit', dinner:'Rajma/chole + roti/rice + vegetables' },
  }
  const menu = dayMenus[today.day] || dayMenus.MONDAY
  const checks = state.done?.[dayKey] || {}
  const save = (next: FoodState) => {
    setState(next)
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {}
  }
  const toggle = (id:string) => save({ ...state, done: { ...(state.done || {}), [dayKey]: { ...checks, [id]: !checks[id] } } })
  const meals = [
    ['breakfast','08:00','BREAKFAST',menu.breakfast],
    ['lunch','13:30','LUNCH',menu.lunch],
    ['snack','17:00','SNACK',menu.snack],
    ['dinner','20:30','DINNER',menu.dinner],
  ] as const
  const completed = meals.filter(([id]) => checks[id]).length
  return (
    <section aria-label="Daily Hair Food Card" style={{marginTop:16,borderRadius:16,overflow:'hidden',border:'1px solid rgba(34,197,94,.22)',background:'linear-gradient(145deg,#0b1712,#111827)',boxShadow:'0 12px 34px rgba(0,0,0,.22)'}}>
      <div style={{padding:'14px 16px',borderBottom:'1px solid rgba(255,255,255,.06)',background:'linear-gradient(90deg,rgba(34,197,94,.10),rgba(245,166,35,.06))'}}>
        <div style={{fontSize:10,fontWeight:900,letterSpacing:1.2,color:'#86EFAC'}}>BEST VERSION • DAILY HAIR FOOD</div>
        <div style={{fontSize:19,fontWeight:950,color:'#FFF',marginTop:4}}>Eat well. Feed the body. Support healthy hair.</div>
        <div style={{fontSize:9,color:'#94A3B8',marginTop:4}}>CAT stays primary. This is a simple vegetarian food reminder, not a medical treatment.</div>
      </div>
      <div style={{padding:14,display:'grid',gap:10}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8,flexWrap:'wrap'}}>
          <div style={{fontSize:10,fontWeight:900,color:'#FCD34D'}}>TODAY • {today.day}</div>
          <div style={{fontSize:9,color:'#86EFAC',fontWeight:900}}>{completed}/4 meals checked</div>
        </div>
        <div style={{display:'grid',gap:7}}>
          {meals.map(([id,time,title,food]) => (
            <button key={id} onClick={()=>toggle(id)} style={{textAlign:'left',padding:11,borderRadius:10,cursor:'pointer',border:checks[id]?'1px solid rgba(34,197,94,.45)':'1px solid rgba(255,255,255,.07)',background:checks[id]?'rgba(34,197,94,.08)':'rgba(255,255,255,.025)',color:'#FFF'}}>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <span style={{fontSize:9,fontWeight:900,color:'#FCD34D',minWidth:42}}>{time}</span>
                <span style={{fontSize:9,fontWeight:900,color:checks[id]?'#86EFAC':'#CBD5E1'}}>{checks[id]?'✓ ':''}{title}</span>
              </div>
              <div style={{fontSize:10,fontWeight:800,lineHeight:1.45,marginTop:5}}>{food}</div>
            </button>
          ))}
        </div>
        <div style={{padding:11,borderRadius:10,border:'1px solid rgba(96,165,250,.16)',background:'rgba(59,130,246,.045)'}}>
          <div style={{fontSize:9,fontWeight:900,color:'#93C5FD'}}>HAIR-SUPPORT RULES</div>
          <div style={{fontSize:9,color:'#CBD5E1',lineHeight:1.55,marginTop:5}}>
            Protein source at meals • vegetables + fruit daily • regular meals • enough overall food • water through the day • no crash dieting • no random biotin/iron/zinc supplements.
          </div>
        </div>
        <div style={{fontSize:8,color:'#64748B',lineHeight:1.5}}>
          Food supports nutrition and normal hair growth but cannot diagnose or reverse genetic hair loss by itself. If a doctor has prescribed a diet or treatment, follow that plan.
        </div>
      </div>
    </section>
  )
}


function RealLifeEngine() {
  const KEY = 'cat2026_real_life_v1'
  type State = { energy?: 'LOW'|'NORMAL'|'HIGH'; wins?: Record<string, number>; week?: Record<string, { planned:number; done:number }> }
  const [state, setState] = useState<State>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
  })
  const today = todayIndia()
  const dayKey = today.key
  const hour = new Date().getHours()
  const phase = hour < 12 ? 'MORNING' : hour < 17 ? 'STUDY' : hour < 21 ? 'GYM / EVENING' : 'NIGHT'
  const save = (next: State) => {
    setState(next)
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {}
  }
  const energy = state.energy || 'NORMAL'
  const energyText = energy === 'LOW' ? 'Protect the essentials. Do one deep CAT block, then recover.' : energy === 'HIGH' ? 'Use the extra energy for one repair/retest block — not random extra work.' : 'Stay with the locked sequence. Depth beats volume.'
  const setEnergy = (e: State['energy']) => save({ ...state, energy: e })
  const wins = state.wins?.[dayKey] || 0
  const addWin = () => save({ ...state, wins: { ...(state.wins || {}), [dayKey]: Math.min(3, wins + 1) } })
  const weekKey = dayKey.slice(0, 7)
  const week = state.week?.[weekKey] || { planned: 0, done: 0 }
  const addPlanned = () => save({ ...state, week: { ...(state.week || {}), [weekKey]: { ...week, planned: week.planned + 1 } } })
  const addDone = () => save({ ...state, week: { ...(state.week || {}), [weekKey]: { ...week, done: week.done + 1 } } })
  return (
    <section aria-label="Real Life Engine" style={{marginTop:16,borderRadius:16,overflow:'hidden',border:'1px solid rgba(96,165,250,.22)',background:'linear-gradient(145deg,#0b1220,#111827)',boxShadow:'0 12px 34px rgba(0,0,0,.24)'}}>
      <div style={{padding:'14px 16px',borderBottom:'1px solid rgba(255,255,255,.06)',background:'linear-gradient(90deg,rgba(59,130,246,.10),rgba(34,197,94,.06))'}}>
        <div style={{fontSize:10,fontWeight:900,letterSpacing:1.2,color:'#93C5FD'}}>REAL-LIFE ENGINE • LOW FRICTION</div>
        <div style={{fontSize:19,fontWeight:950,color:'#FFF',marginTop:4}}>Today → Next → Done</div>
        <div style={{fontSize:9,color:'#94A3B8',marginTop:4}}>Real progress, not a perfect-day scoreboard. CAT stays the priority.</div>
      </div>
      <div style={{padding:14,display:'grid',gap:10}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(145px,1fr))',gap:8}}>
          <div style={{padding:11,borderRadius:10,background:'rgba(59,130,246,.07)',border:'1px solid rgba(59,130,246,.18)'}}>
            <div style={{fontSize:9,fontWeight:900,color:'#93C5FD'}}>NOW • {phase}</div>
            <div style={{fontSize:11,color:'#FFF',fontWeight:800,marginTop:5}}>Finish the current CAT block before opening anything new.</div>
          </div>
          <div style={{padding:11,borderRadius:10,background:'rgba(34,197,94,.07)',border:'1px solid rgba(34,197,94,.18)'}}>
            <div style={{fontSize:9,fontWeight:900,color:'#86EFAC'}}>NEXT</div>
            <div style={{fontSize:11,color:'#FFF',fontWeight:800,marginTop:5}}>Repair the weakest verified error → retest → move on.</div>
          </div>
          <div style={{padding:11,borderRadius:10,background:'rgba(148,163,184,.06)',border:'1px solid rgba(148,163,184,.16)'}}>
            <div style={{fontSize:9,fontWeight:900,color:'#CBD5E1'}}>IF MISSED</div>
            <div style={{fontSize:11,color:'#FFF',fontWeight:800,marginTop:5}}>No guilt. Shrink the task to the next 20–30 minute useful action.</div>
          </div>
        </div>
        <div style={{padding:11,borderRadius:10,border:'1px solid rgba(245,166,35,.18)',background:'rgba(245,166,35,.045)'}}>
          <div style={{fontSize:9,fontWeight:900,color:'#FCD34D'}}>ENERGY CHECK</div>
          <div style={{display:'flex',gap:7,flexWrap:'wrap',marginTop:7}}>
            {(['LOW','NORMAL','HIGH'] as const).map(e => <button key={e} onClick={()=>setEnergy(e)} style={{padding:'7px 10px',borderRadius:8,cursor:'pointer',fontSize:9,fontWeight:900,border:energy===e?'1px solid rgba(252,211,77,.55)':'1px solid rgba(255,255,255,.08)',background:energy===e?'rgba(252,211,77,.10)':'rgba(255,255,255,.025)',color:energy===e?'#FCD34D':'#CBD5E1'}}>{energy===e?'✓ ':''}{e}</button>)}
          </div>
          <div style={{fontSize:9,color:'#CBD5E1',marginTop:7,lineHeight:1.45}}>{energyText}</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <div style={{padding:11,borderRadius:10,background:'rgba(255,255,255,.025)',border:'1px solid rgba(255,255,255,.07)'}}>
            <div style={{fontSize:9,fontWeight:900,color:'#CBD5E1'}}>TODAY'S 3 WINS</div>
            <div style={{fontSize:20,fontWeight:950,color:'#FFF',marginTop:4}}>{wins}/3</div>
            <button onClick={addWin} disabled={wins>=3} style={{marginTop:6,padding:'6px 9px',borderRadius:7,border:'1px solid rgba(34,197,94,.25)',background:'rgba(34,197,94,.07)',color:'#86EFAC',fontSize:8,fontWeight:900,cursor:'pointer'}}>MARK ONE WIN</button>
          </div>
          <div style={{padding:11,borderRadius:10,background:'rgba(255,255,255,.025)',border:'1px solid rgba(255,255,255,.07)'}}>
            <div style={{fontSize:9,fontWeight:900,color:'#CBD5E1'}}>WEEKLY REALITY</div>
            <div style={{fontSize:11,fontWeight:900,color:'#FFF',marginTop:6}}>{week.done} done / {week.planned} planned</div>
            <div style={{display:'flex',gap:5,marginTop:6}}>
              <button onClick={addPlanned} style={{padding:'5px 7px',borderRadius:7,border:'1px solid rgba(148,163,184,.2)',background:'transparent',color:'#CBD5E1',fontSize:8,fontWeight:900}}>+ PLAN</button>
              <button onClick={addDone} style={{padding:'5px 7px',borderRadius:7,border:'1px solid rgba(34,197,94,.25)',background:'transparent',color:'#86EFAC',fontSize:8,fontWeight:900}}>+ DONE</button>
            </div>
          </div>
        </div>
        <div style={{padding:10,borderRadius:9,background:'rgba(59,130,246,.045)',border:'1px solid rgba(59,130,246,.12)',fontSize:9,color:'#CBD5E1',lineHeight:1.5}}>
          <strong style={{color:'#93C5FD'}}>REALITY STATUS:</strong> {wins>=3 ? 'On Track' : wins>0 ? 'Moving' : week.done<week.planned && week.planned>0 ? 'Needs Repair' : 'Ready'} • The goal is the next correct action, not 100% perfection.
        </div>
      </div>
    </section>
  )
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
  const phaseId = getPhaseForDateKey(today.key)
  const phaseInfo = CONFIG_PHASES.find(p => p.id === phaseId) ?? phase
  const dayNum = getFirstPassDayNum(today.key)
  const roadmap = ROADMAP_44.find(x => x.dayNum === dayNum) ?? ROADMAP_44[0]
  const dayAction = OMIA[today.day] ?? 'Execute the next verified CAT task.'
  const dailyTarget = getPercentylDailyTarget(today.key)
  const completed = tasks.filter(t => t.status === 'DONE').length
  const current = tasks.find(t => t.status !== 'DONE') ?? null
  const currentTaskLine = current ? `${current.blockId} — ${current.title}` : 'All 8 CAT blocks complete'
  const remaining = Math.max(0, tasks.length - completed - (current ? 1 : 0))
  const progressWidth = typeof pct === 'number' && Number.isFinite(pct) ? Math.max(0, Math.min(100, pct)) : 0

  if (loading) return null

  return (
    <section style={{
      margin: 'clamp(12px, 4vw, 18px) 0',
      border: '1px solid rgba(245,166,35,.55)',
      borderRadius: 'clamp(14px, 3vw, 16px)',
      overflow: 'hidden',
      background: 'linear-gradient(180deg,#111827,#0B1220)',
      boxShadow: '0 12px 30px rgba(15,23,42,.55)',
    }}>
      {/* HEADER */}
      <div style={{
        padding: 'clamp(12px, 3vw, 16px) clamp(14px, 4vw, 18px)',
        background: 'linear-gradient(90deg,rgba(245,166,35,.14),rgba(37,99,235,.08))',
        borderBottom: '1px solid rgba(255,255,255,.08)',
      }}>
        <div style={{
          fontSize: 'clamp(10px, 2.5vw, 11px)',
          letterSpacing: 1.4,
          fontWeight: 900,
          color: '#F5A623',
        }}>BEST VERSION — DAILY CONTROL CARD</div>
        <div style={{
          marginTop: 'clamp(3px, 1.5vw, 5px)',
          fontSize: 'clamp(18px, 5vw, 20px)',
          fontWeight: 950,
          color: '#FFF',
        }}>{today.date} {today.month} {today.year} — {today.day}</div>
        <div style={{
          display: 'flex',
          gap: 'clamp(6px, 2vw, 10px)',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          marginTop: 'clamp(6px, 2vw, 10px)',
        }}>
          <span style={{
            padding: 'clamp(4px, 1.5vw, 5px) clamp(6px, 2vw, 8px)',
            borderRadius: 8,
            background: 'rgba(34,197,94,.12)',
            border: '1px solid rgba(34,197,94,.24)',
            color: '#86EFAC',
            fontSize: 'clamp(8px, 2vw, 9px)',
            fontWeight: 900,
            whiteSpace: 'nowrap',
          }}>AUTO INDIA DATE</span>
          <span style={{
            padding: 'clamp(4px, 1.5vw, 5px) clamp(6px, 2vw, 8px)',
            borderRadius: 8,
            background: 'rgba(245,166,35,.12)',
            border: '1px solid rgba(245,166,35,.24)',
            color: '#FCD34D',
            fontSize: 'clamp(8px, 2vw, 9px)',
            fontWeight: 900,
            whiteSpace: 'nowrap',
          }}>{phaseId}</span>
          <span style={{
            padding: 'clamp(4px, 1.5vw, 5px) clamp(6px, 2vw, 8px)',
            borderRadius: 8,
            background: 'rgba(124,58,237,.12)',
            border: '1px solid rgba(124,58,237,.24)',
            color: '#C4B5FD',
            fontSize: 'clamp(8px, 2vw, 9px)',
            fontWeight: 900,
            whiteSpace: 'nowrap',
          }}>DAY {dayNum}/44</span>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div style={{
        padding: 'clamp(12px, 3vw, 14px) clamp(14px, 4vw, 18px)',
        borderBottom: '1px solid rgba(255,255,255,.05)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'center',
          gap: 'clamp(8px, 2vw, 10px)',
        }}>
          <div style={{
            height: '7px',
            background: 'rgba(255,255,255,.08)',
            borderRadius: 99,
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${progressWidth}%`,
              height: '100%',
              background: 'linear-gradient(90deg,#2563EB,#60A5FA,#F5A623)',
              borderRadius: 99,
              transition: 'width .3s ease',
            }} />
          </div>
          <div style={{
            color: '#FFF',
            fontSize: 'clamp(10px, 2.5vw, 11px)',
            fontWeight: 900,
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
          }}>{done}/8 • {progressWidth.toFixed(0)}%</div>
        </div>
        <div style={{
          marginTop: 'clamp(6px, 2vw, 6px)',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 'clamp(6px, 2vw, 8px)',
          fontSize: 'clamp(8px, 2vw, 9px)',
          color: '#94A3B8',
          flexWrap: 'wrap',
        }}>
          <span>All existing daily blocks stay intact.</span>
          <span style={{ color: '#86EFAC', fontWeight: 800 }}>TODAY → EXECUTE</span>
        </div>
      </div>

      {/* STATS GRID */}
      <div style={{
        padding: 'clamp(12px, 3vw, 14px) clamp(14px, 4vw, 18px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(clamp(140px, 30vw, 190px),1fr))',
        gap: 'clamp(8px, 2vw, 10px)',
        borderBottom: '1px solid rgba(255,255,255,.05)',
      }}>
        <div style={{
          textAlign: 'center',
          padding: 'clamp(8px, 2vw, 9px)',
          borderRadius: 9,
          background: 'rgba(34,197,94,.08)',
          border: '1px solid rgba(34,197,94,.2)',
        }}>
          <div style={{
            fontSize: 'clamp(8px, 2vw, 9px)',
            color: '#86EFAC',
            fontWeight: 900,
          }}>🟢 COMPLETED</div>
          <div style={{
            marginTop: 'clamp(4px, 1.5vw, 6px)',
            color: '#FFF',
            fontWeight: 900,
            fontSize: 'clamp(16px, 4vw, 18px)',
          }}>{completed}</div>
        </div>
        <div style={{
          textAlign: 'center',
          padding: 'clamp(8px, 2vw, 9px)',
          borderRadius: 9,
          background: 'rgba(245,166,35,.08)',
          border: '1px solid rgba(245,166,35,.2)',
        }}>
          <div style={{
            fontSize: 'clamp(8px, 2vw, 9px)',
            color: '#FCD34D',
            fontWeight: 900,
          }}>🟨 CURRENT</div>
          <div style={{
            marginTop: 'clamp(4px, 1.5vw, 6px)',
            color: '#FFF',
            fontWeight: 900,
            fontSize: 'clamp(16px, 4vw, 18px)',
          }}>{current ? 1 : 0}</div>
        </div>
        <div style={{
          textAlign: 'center',
          padding: 'clamp(8px, 2vw, 9px)',
          borderRadius: 9,
          background: 'rgba(148,163,184,.06)',
          border: '1px solid rgba(148,163,184,.2)',
        }}>
          <div style={{
            fontSize: 'clamp(8px, 2vw, 9px)',
            color: '#CBD5E1',
            fontWeight: 900,
          }}>⬜ REMAINING</div>
          <div style={{
            marginTop: 'clamp(4px, 1.5vw, 6px)',
            color: '#FFF',
            fontWeight: 900,
            fontSize: 'clamp(16px, 4vw, 18px)',
          }}>{remaining}</div>
        </div>
      </div>

      {/* BLOCKS */}
      <div style={{
        padding: 'clamp(12px, 3vw, 14px) clamp(14px, 4vw, 18px)',
        display: 'grid',
        gap: 'clamp(12px, 3vw, 12px)',
      }}>
        {/* PHASE & ACTION */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(clamp(140px, 30vw, 200px),1fr))',
          gap: 'clamp(8px, 2vw, 10px)',
        }}>
          <div style={{
            padding: 'clamp(10px, 2.5vw, 12px)',
            borderRadius: 10,
            background: 'rgba(34,197,94,.08)',
            border: '1px solid rgba(34,197,94,.2)',
          }}>
            <div style={{
              fontSize: 'clamp(9px, 2vw, 10px)',
              color: '#86EFAC',
              fontWeight: 900,
            }}>PRIMARY</div>
            <div style={{
              marginTop: 'clamp(3px, 1.5vw, 4px)',
              color: '#FFF',
              fontWeight: 800,
              fontSize: 'clamp(11px, 2.5vw, 12px)',
            }}>CAT 2026 • {phaseId}</div>
            <div style={{
              marginTop: 'clamp(2px, 1vw, 3px)',
              color: '#94A3B8',
              fontSize: 'clamp(9px, 2vw, 11px)',
            }}>{phaseInfo?.purpose || phaseInfo?.name}</div>
          </div>
          <div style={{
            padding: 'clamp(10px, 2.5vw, 12px)',
            borderRadius: 10,
            background: 'rgba(59,130,246,.08)',
            border: '1px solid rgba(59,130,246,.2)',
          }}>
            <div style={{
              fontSize: 'clamp(9px, 2vw, 10px)',
              color: '#93C5FD',
              fontWeight: 900,
            }}>TODAY'S O.M.I.A.</div>
            <div style={{
              marginTop: 'clamp(3px, 1.5vw, 4px)',
              color: '#FFF',
              fontWeight: 800,
              fontSize: 'clamp(11px, 2.5vw, 12px)',
            }}>{dayAction}</div>
            {roadmap && <div style={{
              marginTop: 'clamp(2px, 1vw, 3px)',
              color: '#94A3B8',
              fontSize: 'clamp(9px, 2vw, 11px)',
            }}>Day {dayNum}/44 • {roadmap.chapter}</div>}
          </div>
        </div>

        {/* TARGETS */}
        <div style={{
          padding: 'clamp(10px, 2.5vw, 12px)',
          borderRadius: 10,
          background: '#0F172A',
          border: '1px solid rgba(255,255,255,.07)',
        }}>
          <div style={{
            fontSize: 'clamp(9px, 2vw, 10px)',
            color: '#F5A623',
            fontWeight: 900,
            letterSpacing: 0.8,
            marginBottom: 'clamp(6px, 2vw, 7px)',
          }}>CAT EXECUTION — QA → DILR → VARC → TEST → ANALYSIS → REVISION → REPAIR → RETEST</div>
          <div style={{
            display: 'grid',
            gap: 'clamp(6px, 2vw, 7px)',
          }}>
            <div style={{
              fontSize: 'clamp(9px, 2vw, 10px)',
              color: '#CBD5E1',
              lineHeight: 1.4,
            }}>
              <strong style={{ color: '#86EFAC' }}>QA:</strong> {dailyTarget.quantDetail} ({dailyTarget.quantTargetQs} Qs)
            </div>
            <div style={{
              fontSize: 'clamp(9px, 2vw, 10px)',
              color: '#CBD5E1',
              lineHeight: 1.4,
            }}>
              <strong style={{ color: '#93C5FD' }}>DILR:</strong> {dailyTarget.dilrDetail} ({dailyTarget.dilrTargetSets} sets)
            </div>
            <div style={{
              fontSize: 'clamp(9px, 2vw, 10px)',
              color: '#DDD6FE',
              lineHeight: 1.4,
            }}>
              <strong style={{ color: '#C4B5FD' }}>VARC:</strong> {dailyTarget.varcDetail} ({dailyTarget.varcTargetPsg} passages)
            </div>
            <div style={{
              marginTop: 'clamp(4px, 1.5vw, 5px)',
              color: '#CBD5E1',
              fontSize: 'clamp(8px, 2vw, 9px)',
              lineHeight: 1.4,
            }}>Today: {dailyTarget.quantTopic} • {dailyTarget.dilrTopic} • {dailyTarget.varcTopic}</div>
          </div>
        </div>

        {/* BLOCK TAGS */}
        <div>
          <div style={{
            fontSize: 'clamp(9px, 2vw, 10px)',
            color: '#F5A623',
            fontWeight: 900,
            letterSpacing: 0.8,
            marginBottom: 'clamp(6px, 2vw, 7px)',
          }}>8-BLOCK SEQUENCE</div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(6px, 2vw, 7px)',
          }}>
            {['QA', 'DILR', 'VARC', 'TEST', 'ANALYSIS', 'REVISION', 'REPAIR', 'RETEST'].map(x => {
              const isDone = tasks.find(t => t.blockId === x)?.status === 'DONE'
              return (
                <span
                  key={x}
                  style={{
                    padding: 'clamp(5px, 1.5vw, 6px) clamp(7px, 2vw, 9px)',
                    borderRadius: 8,
                    fontSize: 'clamp(8px, 2vw, 10px)',
                    fontWeight: 900,
                    background: isDone ? 'rgba(34,197,94,.14)' : 'rgba(148,163,184,.08)',
                    border: isDone ? '1px solid rgba(34,197,94,.3)' : '1px solid rgba(255,255,255,.08)',
                    color: isDone ? '#86EFAC' : '#CBD5E1',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {x}
                </span>
              )
            })}
          </div>
        </div>

        {/* MORNING GATE */}
        <div style={{
          padding: 'clamp(10px, 2.5vw, 12px)',
          borderRadius: 10,
          background: '#0F172A',
          border: '1px solid rgba(255,255,255,.07)',
        }}>
          <div style={{
            fontSize: 'clamp(9px, 2vw, 10px)',
            color: '#F5A623',
            fontWeight: 900,
            letterSpacing: 0.8,
          }}>MORNING GATE — START CLEAN</div>
          <div style={{
            marginTop: 'clamp(4px, 1.5vw, 5px)',
            color: '#E5E7EB',
            fontSize: 'clamp(11px, 2.5vw, 12px)',
            lineHeight: 1.65,
          }}>Wake/reset → water → gentle humming → gentle jaw mobility → gentle voice warm-up → comfortable neck tension release.</div>
          <div style={{
            marginTop: 'clamp(4px, 1.5vw, 5px)',
            color: '#86EFAC',
            fontSize: 'clamp(10px, 2.5vw, 11px)',
            fontWeight: 800,
          }}>Today is a new execution day.</div>
        </div>

        {/* CURRENT TASK */}
        <div style={{
          padding: 'clamp(10px, 2.5vw, 12px)',
          borderRadius: 10,
          border: '1px solid rgba(245,166,35,.2)',
          background: 'rgba(245,166,35,.05)',
        }}>
          <div style={{
            fontSize: 'clamp(9px, 2vw, 10px)',
            color: '#F5A623',
            fontWeight: 900,
          }}>ACTUAL TODAY TASK</div>
          <div style={{
            marginTop: 'clamp(4px, 1.5vw, 5px)',
            color: '#FFF',
            fontSize: 'clamp(10px, 2.5vw, 11px)',
            fontWeight: 800,
            lineHeight: 1.5,
          }}>{currentTaskLine}</div>
        </div>

        {/* CHARACTER STATE */}
        <div style={{
          padding: 'clamp(10px, 2.5vw, 12px)',
          borderRadius: 10,
          border: '1px solid rgba(168,85,247,.2)',
          background: 'rgba(168,85,247,.06)',
        }}>
          <div style={{
            fontSize: 'clamp(9px, 2vw, 10px)',
            color: '#C4B5FD',
            fontWeight: 900,
          }}>INNER STATE + CHARACTER</div>
          <div style={{
            marginTop: 'clamp(4px, 1.5vw, 5px)',
            color: '#DDD6FE',
            fontSize: 'clamp(10px, 2.5vw, 11px)',
            lineHeight: 1.6,
          }}>You are a unified thinker who masters precision, logical networks, and written language. You solve deeply verified errors with focused repair. You read to connect → question → choose → link. You own every result.</div>
        </div>

        {/* CLOCK BLOCKS */}
        <div>
          <div style={{
            fontSize: 'clamp(9px, 2vw, 10px)',
            color: '#60A5FA',
            fontWeight: 900,
            marginBottom: 'clamp(6px, 2vw, 7px)',
          }}>LOCKED CLOCK BLOCKS</div>
          <div style={{
            display: 'grid',
            gap: 'clamp(4px, 1.5vw, 5px)',
          }}>
            {schedule.map(([time, label]) => (
              <div
                key={time}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'clamp(70px, 20vw, 90px) 1fr',
                  gap: 'clamp(6px, 2vw, 8px)',
                  fontSize: 'clamp(8px, 2vw, 10px)',
                }}
              >
                <span style={{ color: '#F5A623', fontWeight: 800 }}>{time}</span>
                <span style={{ color: '#CBD5E1' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div style={{
          padding: 'clamp(10px, 2vw, 12px)',
          borderRadius: 10,
          background: 'rgba(255,255,255,.02)',
          border: '1px solid rgba(255,255,255,.05)',
        }}>
          <div style={{
            fontSize: 'clamp(9px, 2vw, 10px)',
            color: '#60A5FA',
            fontWeight: 900,
            marginBottom: 'clamp(5px, 1.5vw, 6px)',
          }}>DAILY EXECUTION RULES</div>
          <div style={{
            color: '#E5E7EB',
            fontSize: 'clamp(9px, 2vw, 10px)',
            lineHeight: 1.6,
          }}>
            <strong style={{ color: '#FFF' }}>Rule:</strong> Basic → Advanced → Practice → Review → Connection → Next. If weak: repair → retest. Revision = 30-sec recap → 2-min revision → 1-min connection.
          </div>
        </div>
      </div>

      <HairHealthCard />
      <HairFoodCard />
      <RealLifeEngine />

      {/* BOTTOM FOOTER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 14px)',
        borderTop: '1px solid rgba(255,255,255,.05)',
        fontSize: 'clamp(8px, 2vw, 10px)',
        gap: 'clamp(8px, 2vw, 12px)',
        flexWrap: 'wrap',
      }}>
        <span style={{ color: '#94A3B8' }}>Today: {done}/8 CAT blocks • {progressWidth.toFixed(0)}% complete</span>
        <span style={{ color: '#86EFAC', fontWeight: 900 }}>CHECK → RESET → NEXT ACTION</span>
      </div>
    </section>
  )
}