import { useState, useEffect } from 'react'
import { MasteryRepository } from '@/repositories/MasteryRepository'
import type { MasteryTopic } from '@/types'

export function AdaptiveLearningPage({ onBack }: { onBack?: () => void }) {
  const [topics, setTopics]   = useState<MasteryTopic[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await MasteryRepository.getAll()
        setTopics(data)
      } catch (e) {
        console.error('Failed to load mastery topics', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const qaTopics   = topics.filter(t => t.subject === 'QA')
  const dilrTopics = topics.filter(t => t.subject === 'DILR')
  const varcTopics = topics.filter(t => t.subject === 'VARC')

  // Find lowest mastery topics for AI recommendations
  const weakTopics = [...topics].sort((a, b) => a.currentLevel - b.currentLevel).slice(0, 3)

  const getHeatmapColor = (level: number) => {
    if (level >= 4) return '#22C55E' // Green
    if (level >= 2) return '#F5A623' // Amber
    return '#EF4444' // Red
  }

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: '0 auto', color: '#E2E8F0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>🧠</span>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#F5A623', margin: 0 }}>
              AI Adaptive Weakness Heatmap
            </h1>
          </div>
          <p style={{ fontSize: 13, color: '#94A3B8', margin: '4px 0 0' }}>
            Real-time subject proficiency analysis and AI-recommended daily targets
          </p>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ background: 'none', border: '1px solid #334155', color: '#94A3B8', borderRadius: 20, padding: '6px 16px', fontSize: 12, cursor: 'pointer' }}>
            ← Back
          </button>
        )}
      </div>

      {/* AI Smart Recommendation Box */}
      <div style={{ background: 'linear-gradient(135deg, rgba(26,86,219,0.2) 0%, rgba(245,166,35,0.15) 100%)', padding: 16, borderRadius: 12, border: '1px solid #1A56DB', marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#38BDF8', marginBottom: 6 }}>
          🎯 AI Personalized Priority Plan for Today
        </div>
        <div style={{ fontSize: 12, color: '#CBD5E1', marginBottom: 12 }}>
          Based on your latest practice accuracy, the AI engine has prioritized these 3 topics for maximum score improvement:
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
          {weakTopics.map((t, idx) => (
            <div key={t.id} style={{ background: '#0D1B2A', padding: 12, borderRadius: 8, border: '1px solid #334155' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#F5A623' }}>PRIORITY {idx + 1} • {t.subject}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#F1F5F9', margin: '4px 0' }}>{t.name}</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Current Mastery: Level {t.currentLevel}/5</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weakness Heatmap Grid */}
      <h2 style={{ fontSize: 16, fontWeight: 800, color: '#F1F5F9', marginBottom: 12 }}>
        Topic Proficiency Heatmap (All Subjects)
      </h2>

      {loading ? (
        <div style={{ color: '#94A3B8', fontSize: 13 }}>Analyzing topic mastery data...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Quantitative Aptitude */}
          <div style={{ background: '#0D1B2A', padding: 16, borderRadius: 12, border: '1px solid #1E293B' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#22C55E', marginBottom: 12 }}>
              📐 Quantitative Aptitude (QA)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {qaTopics.map(t => (
                <div key={t.id} style={{ background: '#1E293B', padding: 10, borderRadius: 8, borderLeft: `4px solid ${getHeatmapColor(t.currentLevel)}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#F1F5F9' }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: getHeatmapColor(t.currentLevel), fontWeight: 800, marginTop: 4 }}>
                    Level {t.currentLevel} / 5
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DILR */}
          <div style={{ background: '#0D1B2A', padding: 16, borderRadius: 12, border: '1px solid #1E293B' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#38BDF8', marginBottom: 12 }}>
              🧩 Data Interpretation & Logical Reasoning (DILR)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {dilrTopics.map(t => (
                <div key={t.id} style={{ background: '#1E293B', padding: 10, borderRadius: 8, borderLeft: `4px solid ${getHeatmapColor(t.currentLevel)}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#F1F5F9' }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: getHeatmapColor(t.currentLevel), fontWeight: 800, marginTop: 4 }}>
                    Level {t.currentLevel} / 5
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VARC */}
          <div style={{ background: '#0D1B2A', padding: 16, borderRadius: 12, border: '1px solid #1E293B' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#A78BFA', marginBottom: 12 }}>
              📖 Verbal Ability & Reading Comprehension (VARC)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {varcTopics.map(t => (
                <div key={t.id} style={{ background: '#1E293B', padding: 10, borderRadius: 8, borderLeft: `4px solid ${getHeatmapColor(t.currentLevel)}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#F1F5F9' }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: getHeatmapColor(t.currentLevel), fontWeight: 800, marginTop: 4 }}>
                    Level {t.currentLevel} / 5
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
