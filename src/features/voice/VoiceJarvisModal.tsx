import { useState, useEffect, useRef } from 'react'
import { speakJarvisResponse, createSpeechRecognizer } from '@/services/voiceJarvisService'
import { getKolkataDateKey } from '@/services/calendarEngine'
import { getPercentylDailyTarget } from '@/data/percentylPlan2'
import { useToast } from '@/components/Toast'

interface Props {
  isOpen: boolean
  onClose: () => void
  onNavigate?: (page: string) => void
}

export function VoiceJarvisModal({ isOpen, onClose, onNavigate }: Props) {
  const [transcript, setTranscript] = useState('Tap mic and speak')
  const [inputText, setInputText]   = useState('')
  const [response, setResponse]     = useState('Assistant reply will appear here')
  const [isListening, setIsListening] = useState(false)
  const recognizerRef               = useRef<any>(null)
  const { show: toast }             = useToast()

  const dateKey = getKolkataDateKey()
  const pt = getPercentylDailyTarget(dateKey)

  useEffect(() => {
    if (!isOpen) {
      if (recognizerRef.current) recognizerRef.current.stop()
      setIsListening(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleStartMic = () => {
    if (isListening) {
      if (recognizerRef.current) recognizerRef.current.stop()
      setIsListening(false)
      return
    }

    setTranscript('Listening... Speak now 🎙️')
    setIsListening(true)

    const rec = createSpeechRecognizer(
      (text) => {
        setTranscript(text)
        setInputText(text)
      },
      (err) => {
        setTranscript(`Mic error: ${err}. Try typing below.`)
        setIsListening(false)
      },
      () => {
        setIsListening(false)
      }
    )

    if (rec) {
      recognizerRef.current = rec
      rec.start()
    } else {
      setTranscript('Speech recognition not supported in browser. Type command below.')
      setIsListening(false)
    }
  }

  const handleSendCommand = (cmdText?: string) => {
    const command = (cmdText || inputText || transcript).trim()
    if (!command || command === 'Tap mic and speak') return

    const lower = command.toLowerCase()
    let reply = ''

    if (lower.includes('today') || lower.includes('target') || lower.includes('focus')) {
      reply = `🎯 TODAY'S CORE TARGETS:
📐 QA: ${pt.quantTopic} (${pt.quantTargetQs} Qs)
🧩 DILR: ${pt.dilrTopic} (${pt.dilrTargetSets} Sets)
📖 VARC: ${pt.varcTopic} (${pt.varcTargetPsg} Passages)`
      if (onNavigate && lower.includes('open')) onNavigate('today')

    } else if (lower.includes('dashboard') || lower.includes('command')) {
      reply = `📊 Opening 1:1 Executive Command Dashboard.`
      if (onNavigate) onNavigate('dashboard')

    } else if (lower.includes('roadmap') || lower.includes('syllabus')) {
      reply = `🚀 Opening Percentyl 2.0 7-Week Syllabus Roadmap.`
      if (onNavigate) onNavigate('roadmap')

    } else if (lower.includes('mindset') || lower.includes('lazy')) {
      reply = `🧠 Opening Mindset & Anti-Laziness Protocol. Become the man you promise yourself!`
      if (onNavigate) onNavigate('mindset')

    } else if (lower.includes('percentage') || lower.includes('profit') || lower.includes('ratio')) {
      reply = `🤖 [STANFORD JARVIS REASONING]: For Profit/Loss/Discount, set Cost Price = 100x. SP = 100x + Profit%. Discount = MP * (1 - d%). Ratio MP:CP = 8:5.`

    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('jarvis')) {
      reply = `🤖 Hello! I am Jarvis, your CAT 2026 Voice Assistant. Tell me what you want to practice or navigate to!`

    } else {
      reply = `🤖 [JARVIS VOICE AGENT]: Processing "${command}". Today's scheduled focus is ${pt.quantTopic} (${pt.quantTargetQs} Qs). Keep executing!`
    }

    setResponse(reply)
    speakJarvisResponse(reply)
    toast('Jarvis Voice Command Executed ✓')
  }

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(10,15,30,0.92)', backdropFilter: 'blur(12px)',
        zIndex: 2500, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 20
      }}
    >
      <div
        style={{
          width: '100%', maxWidth: 420, background: '#0B1325',
          border: '1px solid #F5A623', borderRadius: 16, padding: 24,
          boxShadow: '0 0 30px rgba(245,166,35,0.3)', display: 'flex',
          flexDirection: 'column', gap: 16
        }}
        className="glow-border-amber"
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#F5A623', display: 'flex', alignItems: 'center', gap: 8 }}>
            🎙️ STANFORD VOICE JARVIS
          </div>
          <button onClick={onClose} style={{ background: '#1F2937', border: '1px solid #374151', color: '#FFF', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontWeight: 800 }}>
            ✕
          </button>
        </div>

        {/* tvTranscript */}
        <div
          id="tvTranscript"
          style={{
            background: '#161D2E', border: '1px solid #2D3748',
            borderRadius: 10, padding: 12, fontSize: 14, color: '#FFF',
            fontWeight: 600, minHeight: 60, display: 'flex', alignItems: 'center'
          }}
        >
          {transcript}
        </div>

        {/* etInput */}
        <input
          id="etInput"
          type="text"
          placeholder="Type or speak a command"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendCommand()}
          style={{
            background: '#1F2937', border: '1px solid #374151',
            borderRadius: 8, padding: '12px 14px', color: '#FFF',
            fontSize: 14, outline: 'none'
          }}
        />

        {/* Button Row */}
        <div style={{ display: 'flex', gap: 12 }}>
          {/* btnMic */}
          <button
            id="btnMic"
            onClick={handleStartMic}
            style={{
              flex: 1, background: isListening ? '#EF4444' : '#16A34A',
              color: '#FFF', border: 'none', borderRadius: 10,
              padding: '12px', fontWeight: 900, fontSize: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 6,
              boxShadow: isListening ? '0 0 15px #EF4444' : 'none'
            }}
          >
            <span>🎙️</span> {isListening ? 'Stop' : 'Mic'}
          </button>

          {/* btnSend */}
          <button
            id="btnSend"
            onClick={() => handleSendCommand()}
            style={{
              flex: 1, background: '#F5A623', color: '#0A0F1E',
              border: 'none', borderRadius: 10, padding: '12px',
              fontWeight: 900, fontSize: 14, cursor: 'pointer'
            }}
          >
            Send
          </button>
        </div>

        {/* tvResponse */}
        <div
          id="tvResponse"
          style={{
            background: 'rgba(34,197,94,0.12)', border: '1px solid #22C55E',
            borderRadius: 10, padding: 14, fontSize: 13, color: '#4ADE80',
            fontWeight: 600, minHeight: 80, whiteSpace: 'pre-line', lineHeight: 1.6
          }}
        >
          {response}
        </div>
      </div>
    </div>
  )
}
