import { useQuickStats } from '@/hooks/index'

interface Badge {
  id: string
  title: string
  icon: string
  desc: string
  unlocked: boolean
  progressText: string
}

export function AchievementsPage({ onBack }: { onBack?: () => void }) {
  const { stats } = useQuickStats()

  const BADGES: Badge[] = [
    {
      id: 'b1', title: 'Execution Flame', icon: '🔥',
      desc: 'Maintained a 3-day consecutive study execution streak.',
      unlocked: true, progressText: 'Streak: 3 Days Active'
    },
    {
      id: 'b2', title: 'Accuracy Champion', icon: '🎯',
      desc: 'Achieved 70%+ overall accuracy on practice sessions.',
      unlocked: (stats?.lastAccuracy || 0) >= 70,
      progressText: stats?.lastAccuracy != null ? `Current: ${stats.lastAccuracy}%` : '0/70%'
    },
    {
      id: 'b3', title: 'Repair Master', icon: '🔧',
      desc: 'Logged and repaired at least 5 C1–C5 errors.',
      unlocked: (stats?.totalErrors || 0) >= 5,
      progressText: `${stats?.totalErrors || 0} / 5 Errors Logged`
    },
    {
      id: 'b4', title: 'Mock Dominator', icon: '🏆',
      desc: 'Completed and submitted 1 full CAT mock exam.',
      unlocked: (stats?.mocksLogged || 0) >= 1,
      progressText: `${stats?.mocksLogged || 0} / 1 Mocks Completed`
    },
    {
      id: 'b5', title: 'Speed Demon', icon: '⚡',
      desc: 'Mastered 10 fraction-percentage speed recall cards.',
      unlocked: true, progressText: 'Speed Drills Unlocked'
    }
  ]

  const unlockedCount = BADGES.filter(b => b.unlocked).length

  return (
    <div style={{ padding: 16, maxWidth: 800, margin: '0 auto', color: '#E2E8F0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>🎖️</span>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#F5A623', margin: 0 }}>
              Gamified Streak & Badges
            </h1>
          </div>
          <p style={{ fontSize: 13, color: '#94A3B8', margin: '4px 0 0' }}>
            Earn execution badges, maintain your daily streak, and unlock study rewards
          </p>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ background: 'none', border: '1px solid #334155', color: '#94A3B8', borderRadius: 20, padding: '6px 16px', fontSize: 12, cursor: 'pointer' }}>
            ← Back
          </button>
        )}
      </div>

      {/* Streak Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0D1B2A 100%)', padding: 20, borderRadius: 12, border: '1px solid #F5A623', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#F5A623' }}>DAILY STREAK</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#FFF', display: 'flex', alignItems: 'center', gap: 6 }}>
            🔥 3 Days Active Streak
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Keep completing daily blocks to maintain your streak!</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(245,166,35,0.1)', padding: '12px 18px', borderRadius: 10, border: '1px solid rgba(245,166,35,0.3)' }}>
          <div style={{ fontSize: 11, color: '#F5A623', fontWeight: 800 }}>UNLOCKED</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#FFF' }}>{unlockedCount} / {BADGES.length}</div>
        </div>
      </div>

      {/* Badges Grid */}
      <h2 style={{ fontSize: 16, fontWeight: 800, color: '#F1F5F9', marginBottom: 12 }}>
        Execution Badges & Milestones
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {BADGES.map(b => (
          <div
            key={b.id}
            style={{
              background: '#0D1B2A', padding: 16, borderRadius: 12,
              border: b.unlocked ? '1px solid #22C55E' : '1px solid #1E293B',
              opacity: b.unlocked ? 1 : 0.6
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>{b.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: b.unlocked ? '#4ADE80' : '#94A3B8' }}>
              {b.title} {b.unlocked && '✅'}
            </div>
            <p style={{ fontSize: 12, color: '#CBD5E1', margin: '4px 0 10px', lineHeight: 1.4 }}>
              {b.desc}
            </p>
            <div style={{ fontSize: 11, fontWeight: 700, color: b.unlocked ? '#22C55E' : '#F5A623', background: '#1E293B', padding: '4px 8px', borderRadius: 4, display: 'inline-block' }}>
              {b.progressText}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
