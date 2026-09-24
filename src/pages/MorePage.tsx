import { useQuickStats } from '@/hooks/index'

export type SubPage = 'dashboard' | 'mission' | 'vision' | 'mindset' | 'apexpro' | 'openjarvis' | 'roadmap' | 'catmock' | 'dailycapsule' | 'adaptive' | 'flashcards' | 'achievements' | 'qbank' | 'livesessions' | 'drills' | 'research' | 'errors' | 'repair' | 'retest' | 'mockana' | 'schedule' | 'syllabus' | 'settings'

interface Props { onNavigate: (page: SubPage) => void }

const TILES: { id: SubPage; icon: string; label: string; featured?: boolean }[] = [
  { id: 'dashboard',    icon: '📊', label: 'Master Execution Dashboard 1:1 View', featured: true },
  { id: 'openjarvis',   icon: '🤖', label: 'Stanford OpenJarvis AI Research Agent (openjarvis.stanford.edu)', featured: true },
  { id: 'apexpro',      icon: '⚡', label: 'Apex Pro Executive Command Deck & Triage Engine', featured: true },
  { id: 'mission',      icon: '🎯', label: 'Current Active Mission (Visuals & Focus)', featured: true },
  { id: 'vision',       icon: '👁️', label: 'Master Vision, 6 Pillars & 7-Year Roadmap', featured: true },
  { id: 'mindset',      icon: '🧠', label: 'Mindset, Anti-Laziness & Discipline Protocol', featured: true },
  { id: 'roadmap',      icon: '🚀', label: '44-Day First-Pass Roadmap' },
  { id: 'catmock',      icon: '🏆', label: 'CAT 2026 Full Exam Simulator' },
  { id: 'adaptive',     icon: '🧠', label: 'AI Adaptive Weakness Heatmap' },
  { id: 'dailycapsule', icon: '📰', label: 'Daily Execution Briefs & Practice Sprints' },
  { id: 'flashcards',   icon: '🎴', label: 'Spaced Repetition Formula Deck' },
  { id: 'achievements', icon: '🎖️', label: 'Streak Counter & Execution Badges' },
  { id: 'research',     icon: '🔬', label: 'Deep Research Protocol' },
  { id: 'livesessions', icon: '📺', label: 'Expert Masterclasses & Video Seminars' },
  { id: 'qbank',        icon: '📚', label: 'Adaptive Question Vault' },
  { id: 'drills',       icon: '⚡', label: 'Quantum Calculation Drills' },
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

  return (
    <div className="section-pad">
      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--gold)', marginBottom: 12 }}>
        CAT 2026 Master Execution &amp; Deep Research Suite
      </div>

      <div className="grid2" style={{ gap: 10, marginBottom: 12 }}>
        {TILES.map(t => (
          <div
            key={t.id}
            className="hub-tile"
            onClick={() => onNavigate(t.id)}
            style={{
              gridColumn: t.featured ? 'span 2' : 'span 1',
              background: t.featured ? 'linear-gradient(135deg, rgba(245,166,35,0.15) 0%, rgba(26,86,219,0.2) 100%)' : undefined,
              border: t.featured ? '1px solid var(--gold)' : undefined
            }}
          >
            <div style={{ fontSize: 28 }}>{t.icon}</div>
            <div className="hub-tile-label" style={{ fontWeight: t.featured ? 800 : 600, color: t.featured ? 'var(--gold)' : undefined }}>
              {t.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Quick Stats (live from IndexedDB)</div>
      <div className="grid2">
        {[
          { label: "Today's blocks", val: stats ? `${stats.blocksDone}/8` : '--',   col: 'var(--gold)'   },
          { label: 'Errors logged',   val: stats ? `${stats.totalErrors}` : '--',   col: 'var(--red2)'   },
          { label: 'Mocks done',      val: stats ? `${stats.mocksLogged}` : '--',   col: 'var(--blue3)'  },
          { label: 'Last accuracy',   val: stats?.lastAccuracy != null ? `${stats.lastAccuracy}%` : '--', col: 'var(--green2)' },
          { label: 'Repair pending',  val: stats ? `${stats.repairPending}` : '--', col: 'var(--pink)'   },
          { label: 'Retest pending',  val: stats ? `${stats.retestPending}` : '--', col: 'var(--teal)'   },
        ].map(s => (
          <div key={s.label} className="card-sm" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--muted)' }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.col, fontFamily: 'monospace' }}>{s.val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
