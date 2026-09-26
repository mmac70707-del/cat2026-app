import { useEffect, useState } from 'react'
import { useQuickStats } from '@/hooks/index'
import { canInstallPwa, promptPwaInstall } from '@/services/pwaInstall'

export type SubPage = 'dashboard' | 'jarvis' | 'mission' | 'vision' | 'mindset' | 'apexpro' | 'openjarvis' | 'roadmap' | 'catmock' | 'dailycapsule' | 'adaptive' | 'flashcards' | 'achievements' | 'qbank' | 'livesessions' | 'drills' | 'research' | 'errors' | 'repair' | 'retest' | 'mockana' | 'schedule' | 'syllabus' | 'security' | 'missionos' | 'settings'

interface Props { onNavigate: (page: SubPage) => void }

const TILES: { id: SubPage; icon: string; label: string; featured?: boolean }[] = [
  { id: 'jarvis',       icon: '🧠', label: 'JARVIS Command Center', featured: true },
  { id: 'dashboard',    icon: '📊', label: 'Master Execution Dashboard', featured: true },
  { id: 'openjarvis',   icon: '🤖', label: 'OpenJarvis Research Agent', featured: true },
  { id: 'apexpro',      icon: '⚡', label: 'Apex Pro Command Deck', featured: true },
  { id: 'mission',      icon: '🎯', label: 'Current Active Mission', featured: true },
  { id: 'vision',       icon: '👁️', label: 'Master Vision & 7-Year Roadmap', featured: true },
  { id: 'mindset',      icon: '🧠', label: 'Mindset & Discipline Protocol', featured: true },
  { id: 'roadmap',      icon: '🚀', label: '44-Day Roadmap' },
  { id: 'catmock',      icon: '🏆', label: 'CAT Full Exam Simulator' },
  { id: 'adaptive',     icon: '🧠', label: 'Adaptive Weakness Heatmap' },
  { id: 'dailycapsule', icon: '📰', label: 'Daily Execution Briefs' },
  { id: 'flashcards',   icon: '🎴', label: 'Formula Deck' },
  { id: 'achievements', icon: '🎖️', label: 'Streak & Badges' },
  { id: 'research',     icon: '🔬', label: 'Deep Research' },
  { id: 'security',     icon: '🛡️', label: 'Security Sentinel' },
  { id: 'missionos',    icon: '🧭', label: 'Mission OS • Adaptive Execution', featured: true },
  { id: 'livesessions', icon: '📺', label: 'Masterclasses' },
  { id: 'qbank',        icon: '📚', label: 'Question Vault' },
  { id: 'drills',       icon: '⚡', label: 'Calculation Drills' },
  { id: 'errors',       icon: '🔴', label: 'Error Log (C1–C5)' },
  { id: 'repair',       icon: '🔧', label: 'Repair Queue' },
  { id: 'retest',       icon: '✅', label: 'Retest System' },
  { id: 'mockana',      icon: '🧪', label: 'Mock Analytics' },
  { id: 'schedule',     icon: '⏰', label: 'Daily Schedule' },
  { id: 'syllabus',     icon: '📖', label: 'Full Syllabus' },
  { id: 'settings',     icon: '⚙️', label: 'Settings & Data Export' },
]

export function MorePage({ onNavigate }: Props) {
  const { stats } = useQuickStats()
  const [installable, setInstallable] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    setInstalled(standalone)
    setInstallable(canInstallPwa())

    const onInstallable = () => setInstallable(canInstallPwa())
    const onInstalled = () => {
      setInstallable(false)
      setInstalled(true)
    }

    window.addEventListener('jarvis:pwa-installable', onInstallable)
    window.addEventListener('jarvis:pwa-installed', onInstalled)
    return () => {
      window.removeEventListener('jarvis:pwa-installable', onInstallable)
      window.removeEventListener('jarvis:pwa-installed', onInstalled)
    }
  }, [])

  async function installApp() {
    const accepted = await promptPwaInstall()
    if (accepted) {
      setInstallable(false)
      setInstalled(true)
    }
  }

  return (
    <div className="section-pad">
      <div className="jarvis-more-title">
        <div>
          <div className="jarvis-more-title-main">Command Library</div>
          <div className="jarvis-more-title-sub">CAT execution core • tools • research</div>
        </div>
        <span className="pill pill-green">ONLINE</span>
      </div>

      <div className="jarvis-hub-grid">
        {TILES.map(t => (
          <div
            key={t.id}
            className={`jarvis-hub-tile${t.featured ? ' featured' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => onNavigate(t.id)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onNavigate(t.id) }}
          >
            <div className="jarvis-hub-icon" aria-hidden="true">{t.icon}</div>
            <div className="jarvis-hub-tile-label">{t.label}</div>
          </div>
        ))}
      </div>

      <div className="jarvis-app-control">
        <div>
          <div className="jarvis-app-control-kicker">DEVICE MODE</div>
          <div className="jarvis-app-control-title">{installed ? 'JARVIS APP INSTALLED' : 'JARVIS WEB EXPERIENCE'}</div>
          <div className="jarvis-app-control-copy">
            {installed ? 'Standalone app shell detected.' : 'Install the PWA for an app-like launcher, offline cache and faster startup.'}
          </div>
        </div>
        {!installed && installable && (
          <button className="jarvis-app-install" onClick={installApp}>INSTALL APP</button>
        )}
      </div>

      <div className="jarvis-stat-heading">Live execution telemetry</div>
      <div className="jarvis-stat-grid">
        {[
          { label: "Today's blocks", val: stats ? `${stats.blocksDone}/8` : '--', col: 'var(--jarvis-cyan)' },
          { label: 'Errors logged', val: stats ? `${stats.totalErrors}` : '--', col: 'var(--jarvis-red)' },
          { label: 'Mocks done', val: stats ? `${stats.mocksLogged}` : '--', col: 'var(--jarvis-cyan)' },
          { label: 'Last accuracy', val: stats?.lastAccuracy != null ? `${stats.lastAccuracy}%` : '--', col: 'var(--jarvis-green)' },
          { label: 'Repair pending', val: stats ? `${stats.repairPending}` : '--', col: 'var(--jarvis-amber)' },
          { label: 'Retest pending', val: stats ? `${stats.retestPending}` : '--', col: 'var(--jarvis-cyan)' },
        ].map(s => (
          <div key={s.label} className="card-sm jarvis-stat-card">
            <div className="jarvis-stat-label">{s.label}</div>
            <div className="jarvis-stat-value" style={{ color: s.col }}>{s.val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
