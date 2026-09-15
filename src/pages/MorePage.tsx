import { useQuickStats } from '@/hooks/index'

export type SubPage = 'dashboard' | 'catmock' | 'dailycapsule' | 'adaptive' | 'flashcards' | 'achievements' | 'qbank' | 'livesessions' | 'drills' | 'research' | 'errors' | 'repair' | 'retest' | 'mockana' | 'schedule' | 'vision' | 'syllabus' | 'settings'

interface Props { onNavigate: (page: SubPage) => void }

const TILES: { id: SubPage; icon: string; label: string; featured?: boolean }[] = [
  { id: 'dashboard',    icon: '📊', label: 'Master Execution Dashboard 1:1 View', featured: true },
  { id: 'catmock',      icon: '🏆', label: 'CAT 2026 Full Exam Simulator', featured: true },
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
  { id: 'vision',       icon: '🚀', label: 'Vision & Mission' },
  { id: 'syllabus',     icon: '📖', label: 'Full Syllabus' },
  { id: 'settings',     icon: '⚙️', label: 'Settings & Data Export' },
]

export function MorePage({ onNavigate }: Props) {
  const { stats } = useQuickStats()

  return (
    <div className="section-pad">
      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--gold)', marginBottom: 12 }}>
        CAT 2026 Master Execution & Deep Research Suite
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
