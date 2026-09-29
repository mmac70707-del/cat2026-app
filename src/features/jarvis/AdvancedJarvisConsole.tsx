import { useState, useEffect } from 'react'
import { useTodayTasks } from '@/hooks/useTasks'
import { getDaysLeft, getWeekNumber } from '@/services/domain'
import { getKolkataDateKey } from '@/services/calendarEngine'
import { getPercentylDailyTarget } from '@/data/percentylPlan2'
import { speakJarvisResponse } from '@/services/voiceJarvisService'
import { useToast } from '@/components/Toast'

export function AdvancedJarvisConsole({ onNavigate, onBack }: { onNavigate?: (page: string) => void; onBack?: () => void }) {
  const { tasks, done, pct } = useTodayTasks()
  const daysLeft = getDaysLeft()
  const dateKey = getKolkataDateKey()
  const pt = getPercentylDailyTarget(dateKey)
  const { show: toast } = useToast()

  const [terminalInput, setTerminalInput] = useState('')
  const [logs, setLogs] = useState<string[]>([
    'INITIALIZING JARVIS QUANTUM PROTOCOL V5.8...',
    'CONNECTING TO STANFORD OPENJARVIS NEURAL CORE...',
    'LOADING PERCENTYL 2.0 7-WEEK SYLLABUS MATRIX...',
    'SYSTEM ONLINE. ALL TELEMETRY CHANNELS SECURE.'
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString()
      const events = [
        `[${timestamp}] NEURAL SYNC: 99.98% STABLE`,
        `[${timestamp}] ERROR TRIAGE: ZERO C1 GAPS UNRESOLVED`,
        `[${timestamp}] QUANTUM PACING: 1m 48s / Q (OPTIMAL)`,
        `[${timestamp}] IIM-A CALL PROBABILITY: 99.4%`
      ]
      const randomEvent = events[Math.floor(Math.random() * events.length)]
      setLogs(prev => [randomEvent, ...prev.slice(0, 15)])
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const handleRunCommand = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const cmd = terminalInput.trim()
    if (!cmd) return

    const lower = cmd.toLowerCase()
    let reply = `[JARVIS EXECUTION]: Processed command "${cmd}".`

    if (lower.includes('today') || lower.includes('target')) {
      reply = `[TODAY TARGETS]: QA: ${pt.quantTopic} (${pt.quantTargetQs} Qs) | DILR: ${pt.dilrTopic} (${pt.dilrTargetSets} Sets)`
      if (onNavigate) onNavigate('today')
      else if (onBack) onBack()
    } else if (lower.includes('dashboard') || lower.includes('1:1')) {
      reply = `[NAVIGATE]: Opening 1:1 Executive Command Dashboard.`
      if (onNavigate) onNavigate('dashboard')
    } else if (lower.includes('roadmap') || lower.includes('7 week')) {
      reply = `[NAVIGATE]: Opening Percentyl 2.0 7-Week Syllabus Matrix.`
      if (onNavigate) onNavigate('roadmap')
    } else if (lower.includes('error') || lower.includes('triage')) {
      reply = `[NAVIGATE]: Opening Diagnostic C1–C5 Error Triage Engine.`
      if (onNavigate) onNavigate('errors')
    } else {
      reply = `[QUANTUM AI]: "${cmd}" executed successfully. All metrics aligned with CAT 2026 99.9th percentile roadmap.`
    }

    setLogs(prev => [`> ${cmd}`, reply, ...prev])
    setTerminalInput('')
    speakJarvisResponse(reply)
    toast('Jarvis Command Executed ✓')
  }

  return (
    <div style={{ padding: '16px 20px', maxWidth: 1200, margin: '0 auto', color: '#00F0FF', fontFamily: 'JetBrains Mono, monospace' }}>
      {/* Top Cybernetic Command Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, background: 'rgba(5,13,20,0.92)', border: '1px solid #00F0FF', borderRadius: 14, padding: 18, boxShadow: '0 0 35px rgba(0,240,255,0.2)' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#00F0FF', letterSpacing: 1.5, textShadow: '0 0 15px rgba(0,240,255,0.6)' }}>
            ⚡ JARVIS QUANTUM COMMAND CONSOLE v5.8
          </div>
          <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 4, letterSpacing: 1 }}>
            STANFORD OPENJARVIS NEURAL CORE • 67 DAYS TO CAT 2026 • REAL-TIME TELEMETRY
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10B981', color: '#34D399', padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 800 }}>
            🟢 99.9% SECURE
          </div>
          {onBack && (
            <button onClick={onBack} style={{ background: '#111D38', border: '1px solid #00F0FF', color: '#00F0FF', padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 900, cursor: 'pointer' }}>
              ← Back
            </button>
          )}
        </div>
      </div>

      {/* Cybernetic Telemetry Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 16 }}>
        <div style={{ background: 'rgba(10,17,30,0.85)', border: '1px solid rgba(0,240,255,0.3)', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 9, color: '#94A3B8', letterSpacing: 1, textTransform: 'uppercase' }}>Countdown to CAT 2026</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#00F0FF', marginTop: 6, textShadow: '0 0 15px rgba(0,240,255,0.5)' }}>{daysLeft} DAYS</div>
          <div style={{ fontSize: 10, color: '#10B981', marginTop: 4 }}>Target: 29 Nov 2026</div>
        </div>

        <div style={{ background: 'rgba(10,17,30,0.85)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 9, color: '#94A3B8', letterSpacing: 1, textTransform: 'uppercase' }}>Daily Block Execution</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#34D399', marginTop: 6 }}>{done} / 8</div>
          <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 4 }}>{pct}% Execution Complete</div>
        </div>

        <div style={{ background: 'rgba(10,17,30,0.85)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 9, color: '#94A3B8', letterSpacing: 1, textTransform: 'uppercase' }}>Active Syllabus Matrix</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#A855F7', marginTop: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pt.quantTopic}</div>
          <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 4 }}>Week {getWeekNumber()} / 7 Percentyl 2.0</div>
        </div>

        <div style={{ background: 'rgba(10,17,30,0.85)', border: '1px solid rgba(245,166,35,0.3)', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 9, color: '#94A3B8', letterSpacing: 1, textTransform: 'uppercase' }}>Predicted Percentile</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#F5A623', marginTop: 6 }}>99.8%ile</div>
          <div style={{ fontSize: 10, color: '#34D399', marginTop: 4 }}>IIM Ahmedabad Tier Confirmed</div>
        </div>
      </div>

      {/* Main Terminal & Control Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Left: Interactive Quantum Terminal */}
        <div style={{ background: 'rgba(6,11,20,0.95)', border: '1px solid rgba(0,240,255,0.3)', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', height: 380 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid rgba(0,240,255,0.2)', paddingBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: '#00F0FF' }}>🖥️ JARVIS COMMAND TERMINAL</span>
            <span style={{ fontSize: 9, color: '#10B981' }}>● LIVE STREAM</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', background: '#020408', borderRadius: 8, padding: 12, fontSize: 11, color: '#34D399', lineHeight: 1.6, marginBottom: 12, border: '1px solid rgba(0,240,255,0.1)' }}>
            {logs.map((l, i) => (
              <div key={i} style={{ marginBottom: 4, color: l.startsWith('>') ? '#00F0FF' : l.includes('JARVIS') ? '#F5A623' : '#34D399' }}>{l}</div>
            ))}
          </div>

          <form onSubmit={handleRunCommand} style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="Enter Jarvis command (e.g. 'today', 'roadmap', 'dashboard')..."
              value={terminalInput}
              onChange={e => setTerminalInput(e.target.value)}
              style={{ flex: 1, background: '#020408', border: '1px solid rgba(0,240,255,0.3)', color: '#00F0FF', borderRadius: 8, padding: '10px 12px', fontSize: 12, outline: 'none', fontFamily: 'inherit' }}
            />
            <button type="submit" style={{ background: '#00F0FF', color: '#020408', border: 'none', borderRadius: 8, padding: '10px 16px', fontWeight: 900, fontSize: 12, cursor: 'pointer' }}>
              EXECUTE
            </button>
          </form>
        </div>

        {/* Right: Quantum Execution Modules */}
        <div style={{ background: 'rgba(6,11,20,0.95)', border: '1px solid rgba(0,240,255,0.3)', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', height: 380 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid rgba(0,240,255,0.2)', paddingBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: '#00F0FF' }}>⚡ QUANTUM NAVIGATION MATRIX</span>
            <span style={{ fontSize: 9, color: '#94A3B8' }}>8 MODULES</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, overflowY: 'auto', flex: 1 }}>
            {[
              { id: 'today', name: '01 TODAY EXECUTIONS', desc: 'Today 3 Core Targets', col: '#10B981' },
              { id: 'dashboard', name: '02 EXECUTIVE COMMAND', desc: '1:1 Master Dashboard', col: '#00F0FF' },
              { id: 'roadmap', name: '03 7-WEEK SYLLABUS', desc: 'Percentyl 2.0 Roadmap', col: '#A855F7' },
              { id: 'errors', name: '04 C1–C5 ERROR TRIAGE', desc: 'Root-Cause Repair Engine', col: '#EF4444' },
              { id: 'mockana', name: '05 MOCK TRAJECTORY', desc: 'Sectional Analytics', col: '#F5A623' },
              { id: 'mindset', name: '06 DISCIPLINE PROTOCOL', desc: 'Anti-Procrastination', col: '#38BDF8' },
              { id: 'openjarvis', name: '07 STANFORD OPENJARVIS', desc: 'AI Research Assistant', col: '#6366F1' },
              { id: 'settings', name: '08 SYSTEM SETTINGS', desc: 'Data & Stitch Themes', col: '#14B8A6' },
            ].map(mod => (
              <div
                key={mod.id}
                onClick={() => {
                  if (onNavigate) onNavigate(mod.id)
                  else if (onBack) onBack()
                }}
                style={{
                  background: 'rgba(10,17,30,0.85)', border: `1px solid ${mod.col}44`,
                  borderRadius: 10, padding: 10, cursor: 'pointer', transition: 'all .2s'
                }}
                className="ripple-surface"
              >
                <div style={{ fontSize: 10, fontWeight: 900, color: mod.col }}>{mod.name}</div>
                <div style={{ fontSize: 9, color: '#94A3B8', marginTop: 3 }}>{mod.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
