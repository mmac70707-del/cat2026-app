import { useState, useEffect } from 'react'
import { speakJarvisResponse } from '@/services/voiceJarvisService'
import { playSuccessSound } from '@/services/audioService'

interface Props {
  isOpen: boolean
  onClose: () => void
  onLaunchJarvisVoice?: () => void
}

export function JarvisStartupHUD({ isOpen, onClose, onLaunchJarvisVoice }: Props) {
  const [bootProgress, setBootProgress] = useState(0)
  const [statusLog, setStatusLog]       = useState<string[]>([])
  const [bootComplete, setBootComplete] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setBootProgress(0)
      setStatusLog([])
      setBootComplete(false)
      return
    }

    // Play cybernetic audio chime
    playSuccessSound()
    speakJarvisResponse('Jarvis System Boot Initiated. All Systems Operational.')

    // Progressive Boot Animation Sequence
    const steps = [
      { pct: 15, msg: '⚡ ARC REACTOR CORE POWER: 100% ONLINE' },
      { pct: 35, msg: '📊 PERCENTYL 2.0 SYLLABUS MAP: LOADED (44 DAYS)' },
      { pct: 60, msg: '🔴 DIAGNOSTIC ERROR TRIAGE ENGINE: ACTIVE' },
      { pct: 85, msg: '🎙️ STT/TTS VOICE SYNTHESIS BRIDGE: SYNCED' },
      { pct: 100, msg: '🚀 JARVIS FULL COMMAND HUD OPERATIONAL' }
    ]

    steps.forEach((st, idx) => {
      setTimeout(() => {
        setBootProgress(st.pct)
        setStatusLog(prev => [...prev, st.msg])
        if (st.pct === 100) {
          setBootComplete(true)
        }
      }, (idx + 1) * 600)
    })
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(5,10,20,0.96)', backdropFilter: 'blur(16px)',
        zIndex: 3000, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 20
      }}
    >
      <div
        style={{
          width: '100%', maxWidth: 440, background: '#080E1E',
          border: '2px solid #00F0FF', borderRadius: 20, padding: 24,
          boxShadow: '0 0 40px rgba(0,240,255,0.35)', display: 'flex',
          flexDirection: 'column', alignItems: 'center', gap: 20,
          position: 'relative', overflow: 'hidden'
        }}
      >
        {/* Background Rotating Cyber Grid */}
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(0,240,255,0.08)', filter: 'blur(30px)', pointerEvents: 'none' }}></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: '#111D38', border: '1px solid #00F0FF', color: '#00F0FF', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontWeight: 900, fontSize: 14 }}
        >
          ✕
        </button>

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#00F0FF', letterSpacing: 2, fontFamily: 'monospace' }}>
            JARVIS // START UP SYSTEM
          </div>
          <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
            STANFORD ADVANCED AI HUD INTERFACE
          </div>
        </div>

        {/* Central Rotating Arc Reactor HUD Ring */}
        <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              position: 'absolute', width: 140, height: 140, borderRadius: '50%',
              border: '2px dashed #00F0FF', animation: 'spin 8s linear infinite',
              opacity: 0.8
            }}
          ></div>
          <div
            style={{
              position: 'absolute', width: 110, height: 110, borderRadius: '50%',
              border: '2px solid #F5A623', animation: 'pulse 1.5s infinite'
            }}
          ></div>
          <div
            style={{
              width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(#00F0FF, #080E1E)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 25px #00F0FF', cursor: 'pointer'
            }}
            onClick={() => {
              if (onLaunchJarvisVoice) {
                onClose()
                onLaunchJarvisVoice()
              }
            }}
          >
            <span style={{ fontSize: 20 }}>🤖</span>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#0A0F1E', fontFamily: 'monospace' }}>{bootProgress}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', background: '#111D38', borderRadius: 6, height: 8, overflow: 'hidden', border: '1px solid #00F0FF' }}>
          <div
            style={{
              width: `${bootProgress}%`, height: '100%',
              background: 'linear-gradient(90deg, #00F0FF, #22C55E)',
              transition: 'width 0.5s ease-out'
            }}
          ></div>
        </div>

        {/* Status Log Box */}
        <div
          style={{
            width: '100%', background: '#050A14', border: '1px solid #1E293B',
            borderRadius: 10, padding: 12, minHeight: 120, maxHeight: 160,
            overflowY: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            color: '#4ADE80', lineHeight: 1.6
          }}
        >
          {statusLog.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>

        {/* Action Controls */}
        <div style={{ width: '100%', display: 'flex', gap: 10 }}>
          {bootComplete && onLaunchJarvisVoice && (
            <button
              onClick={() => {
                onClose()
                onLaunchJarvisVoice()
              }}
              style={{
                flex: 1, background: 'linear-gradient(135deg, #00F0FF, #2563EB)',
                color: '#0A0F1E', border: 'none', borderRadius: 10, padding: 12,
                fontWeight: 900, fontSize: 13, cursor: 'pointer', letterSpacing: 0.5,
                boxShadow: '0 0 15px rgba(0,240,255,0.4)'
              }}
            >
              🎙️ LAUNCH VOICE JARVIS
            </button>
          )}

          <button
            onClick={onClose}
            style={{
              flex: bootComplete && onLaunchJarvisVoice ? 0.6 : 1,
              background: '#111D38', color: '#FFF', border: '1px solid #374151',
              borderRadius: 10, padding: 12, fontWeight: 800, fontSize: 12, cursor: 'pointer'
            }}
          >
            Close HUD
          </button>
        </div>
      </div>

      {/* Keyframe Animation Styles */}
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.7; } }
      `}</style>
    </div>
  )
}
