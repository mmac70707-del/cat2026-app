import { useEffect, useMemo, useState } from 'react'
import { AppIcon } from '@/components/AppIcon'
import { BODY360_SEQUENCE, getBodyPlan } from '@/data/body360'
import { getKolkataDateKey, getKolkataDateParts } from '@/services/calendarEngine'

type StepId = typeof BODY360_SEQUENCE[number]
const STORAGE = 'cat2026.body360.progress.v1'
const START_KEY = 'cat2026.body360.startDate.v1'
const LOCK_KEY = 'cat2026.body360.lockedDays.v1'

function daysSince(start: string, end: string) {
  const a = new Date(start + 'T00:00:00+05:30').getTime()
  const b = new Date(end + 'T00:00:00+05:30').getTime()
  return Math.max(0, Math.floor((b - a) / 86400000))
}

function todayName() {
  const p = getKolkataDateParts(new Date())
  return { p, key: getKolkataDateKey(new Date()) }
}

export function Body360Page({ onBack }: { onBack: () => void }) {
  const { p, key } = todayName()
  const plan = useMemo(() => getBodyPlan(p.dayOfWeek), [p.dayOfWeek])
  const [stepDone, setStepDone] = useState<Partial<Record<StepId, boolean>>>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE) || '{}')
      return raw[key] || {}
    } catch { return {} }
  })
  const [weekStart, setWeekStart] = useState(key)
  const [programStart, setProgramStart] = useState(() => localStorage.getItem(START_KEY) || key)
  const [lockedDays, setLockedDays] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(LOCK_KEY) || '[]') } catch { return [] }
  })

  useEffect(() => {
    if (!programStart) {
      localStorage.setItem(START_KEY, key)
      setProgramStart(key)
    }
  }, [key, programStart])

  useEffect(() => {
    if (weekStart !== key) {
      setWeekStart(key)
      try {
        const raw = JSON.parse(localStorage.getItem(STORAGE) || '{}')
        setStepDone(raw[key] || {})
      } catch { setStepDone({}) }
    }
  }, [key, weekStart])

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE) || '{}')
      raw[key] = stepDone
      localStorage.setItem(STORAGE, JSON.stringify(raw))
    } catch {}
  }, [key, stepDone])

  const done = BODY360_SEQUENCE.filter(s => stepDone[s]).length
  const pct = Math.round((done / BODY360_SEQUENCE.length) * 100)
  const programDay = Math.min(100, daysSince(programStart || key, key) + 1)
  const programDaysLeft = Math.max(0, 100 - programDay)
  const isTodayLocked = lockedDays.includes(programDay)
  const remainingLearning = BODY360_SEQUENCE.filter(step => !stepDone[step])
  const nextLearningStep = remainingLearning[0] || null

  function lockToday() {
    if (done !== BODY360_SEQUENCE.length || isTodayLocked) return
    const next = Array.from(new Set([...lockedDays, programDay])).sort((a,b) => a-b)
    localStorage.setItem(LOCK_KEY, JSON.stringify(next))
    setLockedDays(next)
  }

  function toggle(id: StepId) {
    const next = BODY360_SEQUENCE.find(step => !stepDone[step])
    if (isTodayLocked) return
    if (!stepDone[id] && id !== next) return
    const idx = BODY360_SEQUENCE.indexOf(id)
    setStepDone(prev => {
      const out = { ...prev }
      if (prev[id]) {
        BODY360_SEQUENCE.forEach((step, stepIndex) => {
          if (stepIndex >= idx) delete out[step]
        })
      } else {
        out[id] = true
      }
      return out
    })
  }

  return (
    <div className="section-pad">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}><AppIcon name="back" size={17} /> Back</button>
        <div>
          <div className="page-header-title">Body 360</div>
          <div style={{ fontSize:10,color:'var(--muted)',marginTop:3 }}>AUTO-SYNCED WITH DAILY SCHEDULE • ASIA/KOLKATA</div>
        </div>
      </div>

      <section className="card" style={{background:'linear-gradient(135deg,rgba(34,197,94,.11),rgba(14,159,159,.08))',borderColor:'rgba(34,197,94,.3)'}}>
        <div style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
          <div>
            <div style={{fontSize:10,fontWeight:900,letterSpacing:1.5,color:'#4ADE80'}}>BODY 360 // DAY-SYNC</div>
            <div style={{fontSize:10,color:'var(--muted)',marginTop:5,fontWeight:800,letterSpacing:1}}>PROGRAM DAY {String(programDay).padStart(3,'0')} / 100 • {programDaysLeft} DAYS LEFT</div>
            <h1 style={{margin:'7px 0 5px',fontSize:28}}>{plan.title}</h1>
            <div style={{fontSize:12,color:'var(--muted)'}}>{plan.focus} • {plan.duration}</div>
            <div style={{fontSize:10,color:'var(--muted)',marginTop:6}}>Today: {key} • Weekday index {p.dayOfWeek}</div>
          </div>
          <div style={{minWidth:115,textAlign:'right'}}>
            <div style={{fontSize:30,fontWeight:900}}>{pct}%</div>
            <div style={{fontSize:10,color:'var(--muted)'}}>{done}/{BODY360_SEQUENCE.length} gates</div>
            <div style={{fontSize:9,color:isTodayLocked?'#4ADE80':'#F59E0B',fontWeight:900,marginTop:5}}>{isTodayLocked?'DAY LOCKED':'DAY IN PROGRESS'}</div>
          </div>
        </div>
        <div style={{marginTop:12,height:7,borderRadius:99,background:'rgba(255,255,255,.06)',overflow:'hidden'}}>
          <div style={{width:`${pct}%`,height:'100%',background:'linear-gradient(90deg,#22C55E,#0EA5A4)',borderRadius:99}} />
        </div>
      </section>

      <section style={{marginTop:12}} className="card">
        <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) auto',gap:10,alignItems:'start'}}>
          <div>
            <div style={{fontSize:10,fontWeight:900,letterSpacing:1.2,color:'#4ADE80'}}>🏋️ TODAY’S BEST WORKOUT</div>
            <div style={{fontSize:17,fontWeight:900,marginTop:5}}>{plan.title}</div>
            <div style={{fontSize:10,color:'var(--muted)',marginTop:3}}>{plan.focus} • {plan.duration}</div>
          </div>
          <div style={{textAlign:'right',minWidth:82}}>
            <div style={{fontSize:9,fontWeight:900,color:'#4ADE80'}}>LEARNING</div>
            <div style={{fontSize:18,fontWeight:900,marginTop:2}}>{remainingLearning.length}</div>
            <div style={{fontSize:8,color:'var(--muted)'}}>remaining</div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:6,marginTop:10}}>
          {plan.exercises.map((e,i)=><div key={i} style={{padding:'8px 9px',border:'1px solid var(--border)',borderRadius:9,fontSize:9,color:'var(--muted)',background:'var(--card)'}}><b style={{color:'var(--text)'}}>{String(i+1).padStart(2,'0')}</b> • {e}</div>)}
        </div>
        <div style={{marginTop:10,padding:'9px 10px',border:'1px solid rgba(96,165,250,.22)',borderRadius:10,background:'rgba(96,165,250,.05)',fontSize:10,color:'var(--muted)'}}>
          <b style={{color:'#60A5FA'}}>REMAINING LEARNING:</b> {nextLearningStep ? nextLearningStep + (remainingLearning.length > 1 ? ' → ' + remainingLearning.slice(1,4).join(' → ') : '') : 'All 13 learning gates complete.'}
        </div>
      </section>

      <section style={{marginTop:12}} className="card">
        <div style={{fontSize:10,fontWeight:900,letterSpacing:1.2,color:'var(--muted)'}}>🔒 SEQUENCE LEARNING GATE</div>
        <div style={{display:'grid',gap:7,marginTop:10}}>
          {BODY360_SEQUENCE.map((s,i)=>(
            <button key={s} onClick={()=>toggle(s)} disabled={!stepDone[s] && s !== nextLearningStep} style={{display:'grid',gridTemplateColumns:'34px 1fr 26px',alignItems:'center',gap:9,textAlign:'left',padding:'10px 11px',borderRadius:12,border:'1px solid var(--border)',background:stepDone[s]?'rgba(34,197,94,.08)':'var(--card)',color:'inherit',cursor:stepDone[s] || s === nextLearningStep?'pointer':'not-allowed',opacity:(!stepDone[s] && s !== nextLearningStep) ? .55 : 1}}>
              <span style={{width:27,height:27,borderRadius:9,display:'grid',placeItems:'center',background:stepDone[s]?'rgba(34,197,94,.18)':'rgba(255,255,255,.05)',fontSize:9,fontWeight:900}}>{stepDone[s]?'✓':String(i+1).padStart(2,'0')}</span>
              <span><b style={{fontSize:11,letterSpacing:.5}}>{s}</b><small style={{display:'block',fontSize:10,color:'var(--muted)',marginTop:2}}>
                {s===nextLearningStep ? 'CURRENT GATE • ' : stepDone[s] ? 'COMPLETED • ' : 'LOCKED • '}{s==='CONNECT'?'Energy • pain • readiness':s==='REVISION'?'Recall the previous session':s==='RECAP'?'3–5 key facts':s==='MISSION'?'Today’s exact target':s==='THEORY'?'Anatomy + movement logic':s==='VISUALIZATION'?'See the movement before the set':s==='PRACTICAL'?'Demonstrate → practice → work sets':s==='MIND–MUSCLE'?'Feel target muscle without chasing burn':s==='MISTAKES'?'Technique leaks → correction':s==='SCIENCE'?'Evidence → action rule':s==='QUIZ'?'Recall before moving on':s==='HOMEWORK'?'Small recovery/habit action':'One lesson for next time'}
              </small></span>
              <span style={{fontSize:12,color:stepDone[s]?'#4ADE80':'var(--muted)'}}>{stepDone[s]?'DONE':'→'}</span>
            </button>
          ))}
        </div>
      </section>

      <section style={{marginTop:12}} className="card">
        <div style={{fontSize:10,fontWeight:900,letterSpacing:1.2,color:'var(--muted)'}}>🔄 REVISION + RECAP</div>
        <div style={{marginTop:8,display:'grid',gap:7}}>
          <div style={{padding:9,border:'1px solid var(--border)',borderRadius:10,fontSize:11}}><b>Previous foundation:</b> warm-up → compound first → controlled form → progression → recovery.</div>
          <div style={{padding:9,border:'1px solid var(--border)',borderRadius:10,fontSize:11}}><b>Today’s recall:</b> remember the last session’s target, one mistake, and one correction before starting.</div>
        </div>
      </section>

      <section style={{marginTop:12}} className="card">
        <div style={{fontSize:10,fontWeight:900,letterSpacing:1.2,color:'var(--muted)'}}>🔥 WARM-UP GATE</div>
        <div style={{display:'grid',gap:7,marginTop:9}}>
          {plan.warmup.map((w,i)=><div key={i} style={{padding:'9px 10px',border:'1px solid var(--border)',borderRadius:10,fontSize:11}}>{String(i+1).padStart(2,'0')} • {w}</div>)}
        </div>
      </section>

      <section style={{marginTop:12}} className="card">
        <div style={{fontSize:10,fontWeight:900,letterSpacing:1.2,color:'var(--muted)'}}>🏋️ TODAY’S PRACTICAL</div>
        <div style={{display:'grid',gap:7,marginTop:10}}>
          {plan.exercises.map((e,i)=><div key={i} style={{padding:'9px 10px',border:'1px solid var(--border)',borderRadius:10,fontSize:11}}>{String(i+1).padStart(2,'0')} • {e}</div>)}
        </div>
        <div style={{marginTop:10,padding:'9px 10px',borderRadius:10,border:'1px solid rgba(96,165,250,.22)',background:'rgba(96,165,250,.05)',fontSize:10,color:'var(--muted)'}}>
          <b style={{color:'#60A5FA'}}>TRAINING RULE:</b> Most sets stop with ~2–3 clean reps left. No ego lifting. Pain is not a target.
        </div>
        <div style={{marginTop:8,padding:'9px 10px',borderRadius:10,border:'1px solid rgba(34,197,94,.22)',background:'rgba(34,197,94,.05)',fontSize:10,color:'var(--muted)'}}>
          <b style={{color:'#4ADE80'}}>PROGRESSION:</b> {plan.progression}
        </div>
      </section>

      <section style={{marginTop:12}} className="card">
        <div style={{fontSize:10,fontWeight:900,letterSpacing:1.2,color:'var(--muted)'}}>📊 PERFORMANCE LOG</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:7,marginTop:9}}>
          {['Load','Reps','RIR','Form','Energy','Pain/comfort'].map(x=><div key={x} style={{padding:'10px',border:'1px solid var(--border)',borderRadius:10,fontSize:10,color:'var(--muted)'}}>{x}<div style={{fontSize:12,color:'var(--text)',marginTop:5}}>Tap after set</div></div>)}
        </div>
      </section>

      <section style={{marginTop:12}} className="card">
        <div style={{fontSize:10,fontWeight:900,letterSpacing:1.2,color:'var(--muted)'}}>🧠 VISUALIZATION + MIND–MUSCLE</div>
        <div style={{marginTop:8,display:'grid',gap:8}}>
          {[
            ['SEE','Picture the movement path before lifting.'],
            ['SET','Stable feet, controlled body, neutral neck.'],
            ['MOVE','Smooth range of motion; no bouncing or swinging.'],
            ['FEEL','Notice the target muscle working; skill supports technique, not ego.'],
          ].map(([a,b])=><div key={a} style={{display:'flex',gap:9,alignItems:'center'}}><span style={{fontSize:9,fontWeight:900,minWidth:40,color:'#60A5FA'}}>{a}</span><span style={{fontSize:11,color:'var(--muted)'}}>{b}</span></div>)}
        </div>
      </section>

      <section style={{marginTop:12}} className="card">
        <div style={{fontSize:10,fontWeight:900,letterSpacing:1.2,color:'var(--muted)'}}>📅 AUTOMATIC WEEKLY ROTATION</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:7,marginTop:9}}>
          {['MON','TUE','WED','THU','FRI','SAT','SUN'].map((d,i)=>{
            const x=getBodyPlan(i===6?0:i+1)
            return <div key={d} style={{padding:9,border:'1px solid var(--border)',borderRadius:10,background:d===plan.dayKey?'rgba(59,130,246,.08)':'var(--card)'}}><b style={{fontSize:10}}>{d}</b><div style={{fontSize:10,color:'var(--muted)',marginTop:3}}>{x.title}</div></div>
          })}
        </div>
      </section>

      <section style={{marginTop:12}} className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}>
          <div>
            <div style={{fontSize:10,fontWeight:900,letterSpacing:1.2,color:'var(--muted)'}}>🏁 DAILY LOCK GATE</div>
            <div style={{fontSize:11,color:'var(--muted)',marginTop:4}}>Finish the sequence → lock today → tomorrow auto-loads the next weekday plan.</div>
          </div>
          <button className="body360-chip" disabled={done !== BODY360_SEQUENCE.length || isTodayLocked} onClick={lockToday} style={{cursor:done === BODY360_SEQUENCE.length && !isTodayLocked?'pointer':'not-allowed',opacity:done === BODY360_SEQUENCE.length && !isTodayLocked?1:.45}}>
            {isTodayLocked ? 'LOCKED' : 'LOCK TODAY'}
          </button>
        </div>
      </section>

      <section style={{marginTop:12}} className="card">
        <div style={{fontSize:10,fontWeight:900,letterSpacing:1.2,color:'var(--muted)'}}>🏁 RECOVERY RULE</div>
        <p style={{fontSize:11,color:'var(--muted)',lineHeight:1.55,margin:'8px 0 0'}}>{plan.recovery}. Sharp/unusual pain, dizziness, chest pain or concerning symptoms = stop the exercise and seek appropriate medical guidance.</p>
      </section>
    </div>
  )
}
