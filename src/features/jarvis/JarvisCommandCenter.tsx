import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { getKolkataDateKey } from '@/services/calendarEngine'
import { getPercentylDailyTarget } from '@/data/percentylPlan2'
import { useQuickStats } from '@/hooks/index'
import { isNative, getDeviceCapabilities, authenticateBiometric, launchNativeAction } from '@/services/native'

interface Props { onBack?: () => void; onNavigate?: (page: string) => void }

export function JarvisCommandCenter({ onBack, onNavigate }: Props) {
  const [now, setNow] = useState(new Date())
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)
  const [focus, setFocus] = useState(false)
  const [command, setCommand] = useState('')
  const [log, setLog] = useState<string[]>([
    'JARVIS CORE ONLINE',
    'Security gate verified',
    'CAT execution matrix loaded'
  ])
  const [memory, setMemory] = useState(() => localStorage.getItem('jarvis_quick_memory') || '')
  const [saved, setSaved] = useState(false)
  const [caps, setCaps] = useState<Record<string, boolean> | null>(null)
  const { stats } = useQuickStats()

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      clearInterval(id)
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  const dateKey = getKolkataDateKey()
  const target = getPercentylDailyTarget(dateKey)

  useEffect(() => {
    let active = true
    if (!isNative()) { setCaps(null); return () => { active = false } }
    void getDeviceCapabilities().then(value => { if (active) setCaps(value) })
    return () => { active = false }
  }, [])
  const time = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'Asia/Kolkata'
  }).format(now)
  const date = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long', day: '2-digit', month: 'short', year: 'numeric',
    timeZone: 'Asia/Kolkata'
  }).format(now)

  const missionHealth = useMemo(() => {
    if (!stats) return 0
    const blockScore = Math.min(100, Math.round((stats.blocksDone / 8) * 100))
    const accuracyScore = stats.lastAccuracy == null ? 60 : Math.max(0, Math.min(100, stats.lastAccuracy))
    const repairPenalty = Math.min(25, stats.repairPending * 3)
    return Math.max(0, Math.round(blockScore * 0.45 + accuracyScore * 0.40 + (100 - repairPenalty) * 0.15))
  }, [stats])

  const status = useMemo(() => [
    ['CORE', 'ONLINE', '#39FF88'],
    ['NETWORK', online ? 'ONLINE' : 'OFFLINE', online ? '#39FF88' : '#FFB000'],
    ['MODE', focus ? 'DEEP FOCUS' : 'EXECUTION', '#00F5FF'],
    ['HOST', isNative() ? 'ANDROID' : 'PWA', '#00F5FF'],
  ], [online, focus])

  function addLog(message: string) {
    setLog(v => [message, ...v].slice(0, 8))
  }

  function runCommand() {
    const q = command.trim().toLowerCase()
    if (!q) return

    if (q.includes('focus')) {
      setFocus(true)
      addLog('Deep Focus mode activated')
    } else if (q.includes('dashboard') && onNavigate) {
      onNavigate('dashboard')
      addLog('Opening executive dashboard')
    } else if ((q.includes('today') || q.includes('target')) && onNavigate) {
      onNavigate('today')
      addLog("Opening today's command")
    } else if (q.includes('mock') && onNavigate) {
      onNavigate('mockana')
      addLog('Opening mock analytics')
    } else if (q.includes('error') && onNavigate) {
      onNavigate('errors')
      addLog('Opening diagnostic error log')
    } else if (q.includes('voice')) {
      addLog('Voice interface ready from header')
    } else {
      addLog('Unknown command — no device action executed')
    }

    setCommand('')
  }

  function saveMemory() {
    localStorage.setItem('jarvis_quick_memory', memory)
    setSaved(true)
    addLog('Quick memory saved to this browser')
    window.setTimeout(() => setSaved(false), 1600)
  }

  return (
    <div className="jarvis-page">
      <div className="jarvis-topbar">
        <div>
          <div className="jarvis-kicker">JARVIS // COMMAND CENTER</div>
          <div className="jarvis-subcopy">
            Personal Intelligence • CAT Execution • Secure Device Layer
          </div>
        </div>
        <div style={{display:'flex',gap:7}}>
          <button
            className="jarvis-action"
            onClick={() => window.dispatchEvent(new Event('jarvis:lock'))}
            aria-label="Lock JARVIS"
          >🔒 LOCK</button>
          {onBack && <button className="jarvis-action" onClick={onBack}>← BACK</button>}
        </div>
      </div>

      <div className="jarvis-status-grid">
        {status.map(([label, value, color]) => (
          <div key={label} className="jarvis-status-cell">
            <div className="jarvis-status-label">{label}</div>
            <div className="jarvis-status-value" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      <div className="jarvis-main-grid">
        <Panel title="◉ JARVIS RADAR">
          <div className="jarvis-radar-wrap" aria-label="JARVIS mission radar">
            <div className="jarvis-radar">
              <div className="jarvis-radar-ring jarvis-radar-ring-a" />
              <div className="jarvis-radar-ring jarvis-radar-ring-b" />
              <div className="jarvis-radar-ring jarvis-radar-ring-c" />
              <div className="jarvis-radar-cross horizontal" />
              <div className="jarvis-radar-cross vertical" />
              <div className="jarvis-radar-sweep" />
              <span className="jarvis-radar-blip b1" />
              <span className="jarvis-radar-blip b2" />
              <span className="jarvis-radar-blip b3" />
              <span className="jarvis-radar-core">◉</span>
              <span className="jarvis-radar-label north">N</span>
              <span className="jarvis-radar-label east">E</span>
              <span className="jarvis-radar-label south">S</span>
              <span className="jarvis-radar-label west">W</span>
            </div>
            <div className="jarvis-radar-readout">
              <div><span>MISSION</span><b>{missionHealth}%</b></div>
              <div><span>BLOCKS</span><b>{stats ? `${stats.blocksDone}/8` : '--'}</b></div>
              <div><span>REPAIR</span><b>{stats ? stats.repairPending : '--'}</b></div>
              <div><span>NETWORK</span><b>{online ? 'LIVE' : 'OFFLINE'}</b></div>
            </div>
          </div>
        </Panel>

        <Panel title="⚡ LIVE CORE">
          <div className="jarvis-live-clock">
            <div className="jarvis-live-clock-time">{time}</div>
            <div className="jarvis-live-clock-date">{date}</div>
          </div>

          <div className="jarvis-core-stats">
            <CoreStat label="QA" value={target.quantTopic} />
            <CoreStat label="DILR" value={target.dilrTopic} />
            <CoreStat label="VARC" value={target.varcTopic} />
            <CoreStat label="HOST" value={isNative() ? 'ANDROID NATIVE' : 'WEB / PWA'} />
          </div>
        </Panel>

        <Panel title="🎯 ONE-TAP EXECUTION">
          <div className="jarvis-action-grid">
            <Action text="TODAY'S COMMAND" onClick={() => onNavigate?.('today')} />
            <Action text={focus ? 'EXIT DEEP FOCUS' : 'DEEP FOCUS'} onClick={() => {
              setFocus(v => !v)
              addLog(focus ? 'Focus mode ended' : 'Deep Focus activated')
            }} />
            <Action text="ERROR TRIAGE" onClick={() => onNavigate?.('errors')} />
            <Action text="MOCK ANALYTICS" onClick={() => onNavigate?.('mockana')} />
            <Action text="ADAPTIVE BRAIN" onClick={() => onNavigate?.('adaptive')} />
            <Action text="RESEARCH LAB" onClick={() => onNavigate?.('research')} />
          </div>

          {isNative() && (
            <div className="jarvis-native-actions">
              <Action text="🔐 BIOMETRIC" onClick={() => authenticateBiometric()} />
              <Action text="⚙ ANDROID SETTINGS" onClick={() => launchNativeAction('settings')} />
            </div>
          )}
        </Panel>

        <Panel title="⌘ COMMAND LINE">
          <div className="jarvis-command-row">
            <input
              value={command}
              onChange={e => setCommand(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && runCommand()}
              placeholder="try: dashboard / focus / mock"
              className="jarvis-command-input"
              aria-label="JARVIS command"
            />
            <button className="jarvis-run" onClick={runCommand}>RUN</button>
          </div>

          <div className="jarvis-helper">
            Allowlisted navigation only. Unknown commands never receive native device access.
          </div>

          <div className="jarvis-log">
            {log.map((entry, i) => <div key={`${entry}-${i}`}>› {entry}</div>)}
          </div>
        </Panel>

        <Panel title="🧠 QUICK MEMORY">
          <textarea
            value={memory}
            onChange={e => setMemory(e.target.value)}
            placeholder="One thing JARVIS should remember in this browser…"
            className="jarvis-command-input jarvis-memory"
          />
          <button className="jarvis-save" onClick={saveMemory}>
            {saved ? 'SAVED ✓' : 'SAVE MEMORY'}
          </button>
        </Panel>

        <Panel title="🛡️ DEVICE & SECURITY">
          <div className="jarvis-info-list">
            <div>Security gate: <b style={{ color: 'var(--jarvis-green)' }}>ACTIVE</b></div>
            <div>PIN scope: <b>this browser / installed PWA</b></div>
            <div>Native bridge: <b>{isNative() ? 'AVAILABLE' : 'NOT PRESENT'}</b></div>
            <div>Biometric: <b>{caps?.biometric ? 'SUPPORTED' : 'Native APK only'}</b></div>
            <div>Camera: <b>{caps?.camera ? 'AVAILABLE' : 'Permission controlled'}</b></div>
            <div>Microphone: <b>{caps?.microphone ? 'AVAILABLE' : 'Permission controlled'}</b></div>
          </div>
        </Panel>

        <Panel title="🤖 JARVIS ROADMAP">
          {[
            ['NOW', 'Command Center + PIN + voice + CAT intelligence'],
            ['NEXT', 'Passkey/WebAuthn + encrypted vault + secure native bridge'],
            ['NATIVE', 'Biometric unlock + notifications + allowlisted Android actions'],
            ['COMPANION', 'Authenticated Windows companion for approved laptop actions'],
            ['ADVANCED', 'User-started voice service / wake-word architecture within Android limits'],
          ].map(([tag, copy]) => (
            <div className="jarvis-roadmap-row" key={tag}>
              <span className="jarvis-roadmap-tag">{tag}</span>
              <span>{copy}</span>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="jarvis-panel">
      <div className="jarvis-panel-title">{title}</div>
      {children}
    </section>
  )
}

function CoreStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="jarvis-core-stat">
      <div className="jarvis-core-stat-label">{label}</div>
      <span className="jarvis-core-stat-value">{value}</span>
    </div>
  )
}

function Action({ text, onClick }: { text: string; onClick: () => void }) {
  return <button className="jarvis-action" onClick={onClick}>{text}</button>
}
