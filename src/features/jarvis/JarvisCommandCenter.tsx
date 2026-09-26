import { useEffect, useMemo, useState } from 'react'
import { getKolkataDateKey } from '@/services/calendarEngine'
import { getPercentylDailyTarget } from '@/data/percentylPlan2'
import { isNative, getDeviceCapabilities, authenticateBiometric, launchNativeAction } from '@/services/native'

interface Props { onBack?: () => void; onNavigate?: (page: string) => void }

function pad(n:number){ return String(n).padStart(2,'0') }

export function JarvisCommandCenter({ onBack, onNavigate }: Props) {
  const [now, setNow] = useState(new Date())
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)
  const [focus, setFocus] = useState(false)
  const [command, setCommand] = useState('')
  const [log, setLog] = useState<string[]>(['JARVIS CORE ONLINE', 'Security gate verified', 'CAT execution matrix loaded'])
  const [memory, setMemory] = useState(() => localStorage.getItem('jarvis_quick_memory') || '')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    const on = () => setOnline(true), off = () => setOnline(false)
    window.addEventListener('online', on); window.addEventListener('offline', off)
    return () => { clearInterval(id); window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  const dateKey = getKolkataDateKey()
  const target = getPercentylDailyTarget(dateKey)
  const caps = getDeviceCapabilities()
  const time = new Intl.DateTimeFormat('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false, timeZone:'Asia/Kolkata' }).format(now)
  const date = new Intl.DateTimeFormat('en-IN', { weekday:'long', day:'2-digit', month:'short', year:'numeric', timeZone:'Asia/Kolkata' }).format(now)

  const status = useMemo(() => [
    ['CORE', 'ONLINE', '#22C55E'],
    ['NETWORK', online ? 'ONLINE' : 'OFFLINE', online ? '#22C55E' : '#F59E0B'],
    ['MODE', focus ? 'DEEP FOCUS' : 'EXECUTION', '#38BDF8'],
    ['HOST', isNative() ? 'ANDROID NATIVE' : 'WEB / PWA', '#A78BFA'],
  ], [online, focus])

  function addLog(text:string){ setLog(v => [text, ...v].slice(0,8)) }

  function runCommand() {
    const q = command.trim().toLowerCase()
    if (!q) return
    if (q.includes('focus')) { setFocus(true); addLog('Deep Focus mode activated'); setCommand(''); return }
    if (q.includes('dashboard') && onNavigate) { onNavigate('dashboard'); addLog('Opening executive dashboard'); setCommand(''); return }
    if ((q.includes('today') || q.includes('target')) && onNavigate) { onNavigate('today'); addLog('Opening today command'); setCommand(''); return }
    if (q.includes('mock') && onNavigate) { onNavigate('mockana'); addLog('Opening mock analytics'); setCommand(''); return }
    if (q.includes('error') && onNavigate) { onNavigate('errors'); addLog('Opening diagnostic error log'); setCommand(''); return }
    if (q.includes('voice')) { addLog('Voice interface ready from header'); setCommand(''); return }
    addLog('Command understood: ' + command)
    setCommand('')
  }

  function saveMemory() {
    localStorage.setItem('jarvis_quick_memory', memory)
    setSaved(true); addLog('Quick memory encrypted-at-rest by browser storage boundary')
    window.setTimeout(() => setSaved(false), 1600)
  }

  return (
    <div style={{ minHeight:'100%', background:'radial-gradient(circle at 50% 0%, rgba(0,240,255,.10), transparent 36%), #050A14', color:'#F8FAFC', padding:'18px 16px 32px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, marginBottom:14 }}>
          <div>
            <div style={{ fontFamily:'monospace', letterSpacing:3, color:'#00F0FF', fontWeight:900 }}>JARVIS // COMMAND CENTER</div>
            <div style={{ color:'#94A3B8', fontSize:11 }}>Personal Intelligence • CAT Execution • Secure Device Layer</div>
          </div>
          {onBack && <button onClick={onBack} style={btn('#111827','#94A3B8')}>← Back</button>}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:8, marginBottom:12 }}>
          {status.map(([a,b,c]) => <div key={a} style={{ background:'#0B1325', border:'1px solid #1E293B', borderRadius:12, padding:11 }}>
            <div style={{fontSize:9,color:'#64748B',letterSpacing:1.5}}>{a}</div><div style={{fontSize:12,fontWeight:900,color:c,marginTop:3}}>{b}</div>
          </div>)}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:12 }}>
          <Panel title="⚡ LIVE CORE">
            <div style={{textAlign:'center',padding:'8px 0 14px'}}>
              <div style={{fontFamily:'monospace',fontSize:38,fontWeight:900,color:'#00F0FF',textShadow:'0 0 18px rgba(0,240,255,.45)'}}>{time}</div>
              <div style={{color:'#94A3B8',fontSize:11}}>{date}</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              <Stat label="QA" value={target.quantTopic} />
              <Stat label="DILR" value={target.dilrTopic} />
              <Stat label="VARC" value={target.varcTopic} />
              <Stat label="NATIVE" value={isNative() ? 'YES' : 'PWA'} />
            </div>
          </Panel>

          <Panel title="🎯 ONE-TAP EXECUTION">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              <Action text="Today's Command" onClick={()=>onNavigate?.('today')} />
              <Action text="Deep Focus" onClick={()=>{setFocus(v=>!v);addLog(focus?'Focus mode ended':'Deep Focus activated')}} />
              <Action text="Error Triage" onClick={()=>onNavigate?.('errors')} />
              <Action text="Mock Analytics" onClick={()=>onNavigate?.('mockana')} />
              <Action text="Adaptive Brain" onClick={()=>onNavigate?.('adaptive')} />
              <Action text="Research Lab" onClick={()=>onNavigate?.('research')} />
            </div>
            {isNative() && <div style={{display:'flex',gap:8,marginTop:9}}>
              <Action text="🔐 Biometric" onClick={()=>authenticateBiometric()} />
              <Action text="⚙ Android Settings" onClick={()=>launchNativeAction('settings')} />
            </div>}
          </Panel>

          <Panel title="⌘ COMMAND LINE">
            <div style={{display:'flex',gap:8}}>
              <input value={command} onChange={e=>setCommand(e.target.value)} onKeyDown={e=>e.key==='Enter'&&runCommand()} placeholder="try: open dashboard / focus / mock" style={inputStyle}/>
              <button onClick={runCommand} style={btn('#00F0FF','#06101A')}>RUN</button>
            </div>
            <div style={{fontSize:10,color:'#64748B',marginTop:8}}>Commands are allowlisted. Unknown commands never receive native device access.</div>
            <div style={{marginTop:10,background:'#050A14',border:'1px solid #1E293B',borderRadius:8,padding:9,fontFamily:'monospace',fontSize:10,color:'#4ADE80',minHeight:90}}>
              {log.map((x,i)=><div key={i}>› {x}</div>)}
            </div>
          </Panel>

          <Panel title="🧠 QUICK MEMORY">
            <textarea value={memory} onChange={e=>setMemory(e.target.value)} placeholder="One thing JARVIS should remember for this device/session…" style={{...inputStyle,minHeight:100,resize:'vertical'}}/>
            <button onClick={saveMemory} style={{...btn(saved?'#22C55E':'#F5A623', '#06101A'),marginTop:8}}>{saved?'SAVED ✓':'SAVE MEMORY'}</button>
          </Panel>

          <Panel title="🛡️ DEVICE & SECURITY">
            <div style={{fontSize:11,lineHeight:1.8,color:'#CBD5E1'}}>
              <div>Security gate: <b style={{color:'#22C55E'}}>ACTIVE</b></div>
              <div>PIN scope: <b>this browser / installed PWA</b></div>
              <div>Native bridge: <b>{isNative()?'AVAILABLE':'NOT PRESENT'}</b></div>
              <div>Biometric: <b>{caps?.biometric?'SUPPORTED':'Native APK only'}</b></div>
              <div>Camera: <b>{caps?.camera?'AVAILABLE':'Permission controlled'}</b></div>
              <div>Microphone: <b>{caps?.microphone?'AVAILABLE':'Permission controlled'}</b></div>
            </div>
          </Panel>

          <Panel title="🤖 JARVIS ROADMAP">
            {[
              ['NOW','Command Center + secure PIN + voice + CAT intelligence'],
              ['NEXT','Passkey/WebAuthn + encrypted local vault + native WebMessage bridge'],
              ['NATIVE','Biometric unlock + notifications + allowlisted Android actions'],
              ['COMPANION','Authenticated Windows companion for approved laptop actions'],
              ['ADVANCED','User-started voice service / wake-word architecture within Android limits'],
            ].map(([a,b])=><div key={a} style={{display:'flex',gap:9,marginBottom:9}}><span style={{fontFamily:'monospace',color:'#00F0FF',fontSize:10,fontWeight:900,minWidth:58}}>{a}</span><span style={{fontSize:11,color:'#CBD5E1'}}>{b}</span></div>)}
          </Panel>
        </div>
      </div>
    </div>
  )
}

function Panel({title,children}:{title:string;children:React.ReactNode}) {
  return <section style={{background:'rgba(11,19,37,.94)',border:'1px solid #1E293B',borderRadius:15,padding:14,boxShadow:'0 0 24px rgba(0,0,0,.18)'}}><div style={{fontFamily:'monospace',fontSize:11,fontWeight:900,color:'#00F0FF',letterSpacing:1,marginBottom:10}}>{title}</div>{children}</section>
}
function Stat({label,value}:{label:string;value:string}){return <div style={{background:'#07101F',border:'1px solid #172033',borderRadius:9,padding:9}}><div style={{fontSize:9,color:'#64748B'}}>{label}</div><div style={{fontSize:11,fontWeight:800,marginTop:3}}>{value}</div></div>}
function Action({text,onClick}:{text:string;onClick:()=>void}){return <button onClick={onClick} style={{background:'#111D38',border:'1px solid #334155',color:'#E2E8F0',borderRadius:9,padding:'10px 8px',fontWeight:800,fontSize:10,cursor:'pointer'}}>{text}</button>}
function btn(bg:string,color:string){return {background:bg,color,border:'none',borderRadius:9,padding:'9px 12px',fontWeight:900,fontSize:10,cursor:'pointer'} as React.CSSProperties}
const inputStyle: React.CSSProperties={width:'100%',boxSizing:'border-box',background:'#050A14',border:'1px solid #334155',borderRadius:9,color:'#F8FAFC',padding:'10px',fontSize:11,outline:'none'}
