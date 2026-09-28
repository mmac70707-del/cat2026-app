import { useEffect, useMemo, useState } from 'react'
import { useQuickStats } from '@/hooks/index'
import { canInstallPwa, promptPwaInstall } from '@/services/pwaInstall'

export type SubPage = 'dashboard' | 'jarvis' | 'mission' | 'vision' | 'mindset' | 'apexpro' | 'openjarvis' | 'roadmap' | 'catmock' | 'dailycapsule' | 'adaptive' | 'flashcards' | 'achievements' | 'qbank' | 'livesessions' | 'drills' | 'research' | 'errors' | 'repair' | 'retest' | 'mockana' | 'schedule' | 'syllabus' | 'security' | 'missionos' | 'settings'

interface Props { onNavigate: (page: SubPage) => void }
type Category = 'ALL' | 'EXECUTE' | 'LEARN' | 'REVIEW' | 'SYSTEM'

const TILES: { id: SubPage; icon: string; label: string; category: Exclude<Category, 'ALL'>; featured?: boolean; hint: string }[] = [
  { id: 'missionos', icon: '🧭', label: 'Mission OS', category: 'EXECUTE', featured: true, hint: 'Adaptive next action' },
  { id: 'mission', icon: '🎯', label: 'Active Mission', category: 'EXECUTE', featured: true, hint: 'What to do now' },
  { id: 'jarvis', icon: '🧠', label: 'JARVIS Command', category: 'EXECUTE', featured: true, hint: 'Control center' },
  { id: 'schedule', icon: '⏰', label: 'Daily Schedule', category: 'EXECUTE', hint: 'Time-block plan' },
  { id: 'dashboard', icon: '📊', label: 'Master Dashboard', category: 'EXECUTE', featured: true, hint: 'Full execution view' },
  { id: 'adaptive', icon: '🧬', label: 'Weakness Heatmap', category: 'LEARN', hint: 'Find weak areas' },
  { id: 'qbank', icon: '📚', label: 'Question Vault', category: 'LEARN', hint: 'Practice bank' },
  { id: 'drills', icon: '⚡', label: 'Calculation Drills', category: 'LEARN', hint: 'Build speed' },
  { id: 'livesessions', icon: '📺', label: 'Masterclasses', category: 'LEARN', hint: 'Deep learning' },
  { id: 'syllabus', icon: '📖', label: 'Full Syllabus', category: 'LEARN', hint: 'Coverage map' },
  { id: 'flashcards', icon: '🎴', label: 'Formula Deck', category: 'LEARN', hint: 'Fast recall' },
  { id: 'catmock', icon: '🏆', label: 'CAT Exam Simulator', category: 'REVIEW', featured: true, hint: 'Full-length test' },
  { id: 'mockana', icon: '🧪', label: 'Mock Analytics', category: 'REVIEW', hint: 'Score + time patterns' },
  { id: 'errors', icon: '🔴', label: 'Error Log C1–C5', category: 'REVIEW', hint: 'Capture root causes' },
  { id: 'repair', icon: '🔧', label: 'Repair Queue', category: 'REVIEW', hint: 'Fix before moving on' },
  { id: 'retest', icon: '✅', label: 'Retest System', category: 'REVIEW', hint: 'Prove the repair' },
  { id: 'achievements', icon: '🎖️', label: 'Streak & Badges', category: 'REVIEW', hint: 'Execution history' },
  { id: 'vision', icon: '👁️', label: 'Master Vision', category: 'SYSTEM', hint: 'Long-range direction' },
  { id: 'mindset', icon: '🧘', label: 'Discipline Protocol', category: 'SYSTEM', hint: 'Mental operating rules' },
  { id: 'roadmap', icon: '🚀', label: '44-Day Roadmap', category: 'SYSTEM', hint: 'Syllabus runway' },
  { id: 'apexpro', icon: '⚡', label: 'Apex Pro Deck', category: 'SYSTEM', hint: 'Advanced command layer' },
  { id: 'openjarvis', icon: '🤖', label: 'OpenJarvis Agent', category: 'SYSTEM', hint: 'Research workspace' },
  { id: 'dailycapsule', icon: '📰', label: 'Daily Briefs', category: 'SYSTEM', hint: 'Context capsule' },
  { id: 'research', icon: '🔬', label: 'Deep Research', category: 'SYSTEM', hint: 'Research tools' },
  { id: 'security', icon: '🛡️', label: 'Security Sentinel', category: 'SYSTEM', hint: 'Integrity + audit' },
  { id: 'settings', icon: '⚙️', label: 'Settings & Data', category: 'SYSTEM', hint: 'Preferences + export' },
]

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'ALL', label: 'ALL' },
  { id: 'EXECUTE', label: 'EXECUTE' },
  { id: 'LEARN', label: 'LEARN' },
  { id: 'REVIEW', label: 'REVIEW' },
  { id: 'SYSTEM', label: 'SYSTEM' },
]

export function MorePage({ onNavigate }: Props) {
  const { stats } = useQuickStats()
  const [installable, setInstallable] = useState(false)
  const [installed, setInstalled] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category>('ALL')

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    setInstalled(standalone)
    setInstallable(canInstallPwa())

    const onInstallable = () => setInstallable(canInstallPwa())
    const onInstalled = () => { setInstallable(false); setInstalled(true) }
    window.addEventListener('jarvis:pwa-installable', onInstallable)
    window.addEventListener('jarvis:pwa-installed', onInstalled)
    return () => {
      window.removeEventListener('jarvis:pwa-installable', onInstallable)
      window.removeEventListener('jarvis:pwa-installed', onInstalled)
    }
  }, [])

  async function installApp() {
    const accepted = await promptPwaInstall()
    if (accepted) { setInstallable(false); setInstalled(true) }
  }

  const filteredTiles = useMemo(() => {
    const q = query.trim().toLowerCase()
    return TILES.filter(t => {
      const categoryMatch = category === 'ALL' || t.category === category
      const textMatch = !q || `${t.label} ${t.hint} ${t.category}`.toLowerCase().includes(q)
      return categoryMatch && textMatch
    })
  }, [query, category])

  const featured = TILES.filter(t => t.featured)

  function openSearch() {
    document.getElementById('jarvis-library-search')?.focus()
  }

  return (
    <div className="section-pad jarvis-library">
      <section className="jarvis-library-hero" aria-label="Command Library">
        <div>
          <div className="jarvis-library-kicker">JARVIS // COMMAND LIBRARY</div>
          <h1>One system. <span>Every move.</span></h1>
          <p>CAT 2026 first. Choose the next action, execute it, then let the system guide the review.</p>
        </div>
        <button className="jarvis-library-search-button" onClick={openSearch} aria-label="Focus command search">⌕ <span>SEARCH</span></button>
      </section>

      <section className="jarvis-now-card" aria-label="Today at a glance">
        <div className="jarvis-now-top">
          <div>
            <div className="jarvis-library-kicker">NOW // EXECUTION SIGNAL</div>
            <div className="jarvis-now-title">Protect the next block.</div>
          </div>
          <span className="pill pill-green">CAT FIRST</span>
        </div>
        <div className="jarvis-now-grid">
          <div><b>{stats ? `${stats.blocksDone}/8` : '--'}</b><span>blocks done</span></div>
          <div><b>{stats ? stats.repairPending : '--'}</b><span>repairs open</span></div>
          <div><b>{stats?.lastAccuracy != null ? `${stats.lastAccuracy}%` : '--'}</b><span>last accuracy</span></div>
        </div>
        <button className="jarvis-now-action" onClick={() => onNavigate('missionos')}>OPEN NEXT MISSION <span>→</span></button>
      </section>

      <div className="jarvis-library-featured">
        {featured.map(t => (
          <button key={t.id} className="jarvis-feature-card" onClick={() => onNavigate(t.id)}>
            <span className="jarvis-feature-icon" aria-hidden="true">{t.icon}</span>
            <span><b>{t.label}</b><small>{t.hint}</small></span>
            <strong>→</strong>
          </button>
        ))}
      </div>

      <div className="jarvis-library-tools">
        <label className="jarvis-library-search">
          <span aria-hidden="true">⌕</span>
          <input
            id="jarvis-library-search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search mission, mock, repair, syllabus…"
            aria-label="Search command library"
          />
          {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
        </label>
        <div className="jarvis-library-filters" role="tablist" aria-label="Command categories">
          {CATEGORIES.map(c => (
            <button key={c.id} className={category === c.id ? 'active' : ''} onClick={() => setCategory(c.id)} role="tab" aria-selected={category === c.id}>{c.label}</button>
          ))}
        </div>
      </div>

      <div className="jarvis-library-result-meta">
        <span>{filteredTiles.length} COMMANDS</span>
        <span>{query ? `SEARCH: “${query}”` : 'LOCAL • FAST • NO DISTRACTION'}</span>
      </div>

      <div className="jarvis-hub-grid jarvis-library-grid">
        {filteredTiles.map(t => (
          <button key={t.id} className={`jarvis-hub-tile jarvis-library-tile${t.featured ? ' featured' : ''}`} onClick={() => onNavigate(t.id)}>
            <div className="jarvis-hub-icon" aria-hidden="true">{t.icon}</div>
            <div className="jarvis-hub-tile-label">{t.label}</div>
            <div className="jarvis-library-tile-hint">{t.hint}</div>
          </button>
        ))}
      </div>

      {filteredTiles.length === 0 && (
        <div className="jarvis-library-empty">NO COMMAND MATCHED. Try “mock”, “repair”, “quant”, or “mission”.</div>
      )}

      <div className="jarvis-app-control">
        <div>
          <div className="jarvis-app-control-kicker">DEVICE MODE</div>
          <div className="jarvis-app-control-title">{installed ? 'JARVIS APP INSTALLED' : 'JARVIS WEB EXPERIENCE'}</div>
          <div className="jarvis-app-control-copy">
            {installed ? 'Standalone app shell detected.' : 'Install the PWA for an app-like launcher, offline cache and faster startup.'}
          </div>
        </div>
        {!installed && installable && <button className="jarvis-app-install" onClick={installApp}>INSTALL APP</button>}
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
