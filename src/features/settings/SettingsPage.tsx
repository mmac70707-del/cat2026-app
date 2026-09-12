import { useState, useEffect } from 'react'
import { SettingsRepository, resetAllData } from '@/repositories/index'
import { TaskRepository } from '@/repositories/TaskRepository'
import { ErrorRepository } from '@/repositories/ErrorRepository'
import { MasteryRepository } from '@/repositories/MasteryRepository'
import { MockRepository, DailyScoreRepository } from '@/repositories/index'
import { useToast } from '@/components/Toast'

interface Props { onBack: () => void }

export function SettingsPage({ onBack }: Props) {
  const [wake,   setWake]   = useState(false)
  const [quotes, setQuotes] = useState(true)
  const [sound,  setSound]  = useState(false)
  const { show: toast } = useToast()

  useEffect(() => {
    Promise.all([
      SettingsRepository.get('wake',   false),
      SettingsRepository.get('quotes', true),
      SettingsRepository.get('sound',  false),
    ]).then(([w, q, s]) => {
      setWake(w as boolean)
      setQuotes(q as boolean)
      setSound(s as boolean)
    })
  }, [])

  async function toggleSetting(key: string, val: boolean, setter: (v: boolean) => void) {
    const next = !val
    await SettingsRepository.set(key, next)
    setter(next)
    toast(`${key} ${next ? 'on' : 'off'}`)
    if (key === 'wake' && next && 'wakeLock' in navigator) {
      try { await (navigator as any).wakeLock.request('screen') } catch (_) {}
    }
  }

  async function exportData() {
    const [tasks, errors, masts, mocks, scores] = await Promise.all([
      TaskRepository.getAllHistorical(),
      ErrorRepository.getAll(),
      MasteryRepository.getAll(),
      MockRepository.getAll(),
      DailyScoreRepository.getAll(),
    ])
    const blob = new Blob(
      [JSON.stringify({ exportedAt: new Date().toISOString(), tasks, errors, masts, mocks, scores }, null, 2)],
      { type: 'application/json' }
    )
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `cat2026_export_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    toast('Data exported ✓')
  }

  async function confirmReset() {
    if (!window.confirm('Reset ALL data? This cannot be undone.')) return
    await resetAllData()
    toast('All data reset', '#DC2626')
    window.location.reload()
  }

  const rows = [
    { key: 'wake',   label: 'Screen Awake',       sub: 'Keep screen on while studying', val: wake,   setter: setWake },
    { key: 'quotes', label: 'Motivational Quotes', sub: 'Show daily mantra',             val: quotes, setter: setQuotes },
    { key: 'sound',  label: 'Sounds',              sub: 'Block completion sounds',       val: sound,  setter: setSound },
  ]

  return (
    <div className="section-pad">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="page-header-title">Settings</div>
      </div>

      <div className="card">
        {rows.map(r => (
          <div key={r.key} className="setting-row" style={{ borderBottom: r.key !== 'sound' ? '1px solid var(--border)' : 'none' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{r.label}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{r.sub}</div>
            </div>
            <div
              className={`toggle ${r.val ? 'on' : ''}`}
              onClick={() => toggleSetting(r.key, r.val, r.setter)}
            >
              <div className="toggle-knob" />
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">Data Management</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
          All data stored in IndexedDB on this device. Survives refresh + restart.
        </div>
        <button className="btn-ghost" onClick={exportData} style={{ marginBottom: 8 }}>
          📤 Export All Data (JSON)
        </button>
        <button className="btn-danger" onClick={confirmReset}>
          🗑️ Reset All Data
        </button>
      </div>

      <div className="card">
        <div className="card-title">About · Stage 4</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
          Stack: React 18 + TypeScript + Vite<br />
          Storage: IndexedDB (real persistence)<br />
          Phase: Dynamic (calculated from date)<br />
          Countdown: Live (seconds ticker)<br />
          Architecture: Repository pattern<br />
          Next: Stage 5 — Capacitor Android
        </div>
      </div>
    </div>
  )
}
