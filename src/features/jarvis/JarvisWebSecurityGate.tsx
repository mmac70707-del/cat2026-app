import { useEffect, useState, type ReactNode } from 'react'

const PIN_KEY = 'jarvis_web_pin_v1'

async function digest(pin: string) {
  const bytes = new TextEncoder().encode(pin)
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export function JarvisWebSecurityGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [configured, setConfigured] = useState(false)
  const [pin, setPin] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    setConfigured(Boolean(localStorage.getItem(PIN_KEY)))
    setReady(true)
  }, [])

  if (!ready) return null

  async function submit() {
    if (!/^\d{6}$/.test(pin)) {
      setMessage('PIN must be exactly 6 digits.')
      return
    }
    if (!configured) {
      if (pin !== confirm) {
        setMessage('PINs do not match. Enter the same PIN twice.')
        return
      }
      localStorage.setItem(PIN_KEY, await digest(pin))
      sessionStorage.setItem('jarvis_unlocked', '1')
      window.location.reload()
      return
    }

    const expected = localStorage.getItem(PIN_KEY)
    const actual = await digest(pin)
    if (expected === actual) {
      sessionStorage.setItem('jarvis_unlocked', '1')
      window.location.reload()
    } else {
      setPin('')
      setMessage('Incorrect PIN. Try again.')
    }
  }

  if (sessionStorage.getItem('jarvis_unlocked') === '1') return <>{children}</>

  return (
    <div style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'radial-gradient(circle at 50% 15%,#173a63 0,#091423 45%,#04080e 100%)',color:'#fff',fontFamily:'Arial,sans-serif',padding:20}}>
      <div style={{width:'min(430px,94vw)',padding:'30px 22px',border:'1px solid rgba(245,166,35,.65)',borderRadius:24,background:'rgba(8,15,27,.95)',boxShadow:'0 0 50px rgba(245,166,35,.15)',textAlign:'center'}}>
        <div style={{width:86,height:86,margin:'0 auto 16px',borderRadius:'50%',border:'2px solid #F5A623',boxShadow:'0 0 30px rgba(245,166,35,.55)',display:'grid',placeItems:'center',fontSize:30,color:'#F5A623'}}>◉</div>
        <div style={{fontSize:10,letterSpacing:1.6,color:'#6EE7B7',marginBottom:10}}>JARVIS SECURITY LAYER</div>
        <h1 style={{fontSize:23,color:'#F5A623',margin:'8px 0'}}>{configured ? 'WELCOME BACK, ASHISH' : 'INITIAL JARVIS SETUP'}</h1>
        <p style={{fontSize:12,color:'#A5B4C7',lineHeight:1.5}}>{configured ? 'Enter your private 6-digit PIN to unlock your JARVIS dashboard.' : 'Create your private 6-digit PIN. This PIN stays on this browser/device.'}</p>
        <input value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" type="password" maxLength={6} autoFocus placeholder="••••••" style={{width:'100%',padding:15,borderRadius:12,border:'1px solid #34445A',background:'#0F1A2B',color:'#fff',textAlign:'center',fontSize:23,letterSpacing:9,outline:'none'}} />
        {!configured && <input value={confirm} onChange={e=>setConfirm(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" type="password" maxLength={6} placeholder="CONFIRM PIN" style={{width:'100%',padding:15,marginTop:10,borderRadius:12,border:'1px solid #34445A',background:'#0F1A2B',color:'#fff',textAlign:'center',fontSize:20,letterSpacing:7,outline:'none'}} />}
        <button onClick={submit} style={{width:'100%',padding:14,marginTop:12,border:0,borderRadius:12,fontWeight:900,background:'#F5A623',color:'#08101D',cursor:'pointer'}}>{configured ? 'UNLOCK JARVIS' : 'CREATE SECURE PIN'}</button>
        <div style={{minHeight:34,marginTop:12,fontSize:12,color:'#CBD5E1'}}>{message}</div>
        <div style={{fontSize:10,color:'#64748B'}}>Web/PWA security gate • CAT 2026 JARVIS</div>
      </div>
    </div>
  )
}
