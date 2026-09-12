import { useState } from 'react'
import { useToast } from '@/components/Toast'

interface LiveSession {
  id: string
  title: string
  instructor: string
  credentials: string
  subject: 'VARC' | 'LRDI' | 'QA'
  status: 'LIVE' | 'UPCOMING' | 'RECORDED'
  date: string
  time: string
  durationMin: number
  description: string
  videoUrl?: string
  notesUrl?: string
}

const LIVE_SESSIONS: LiveSession[] = [
  {
    id: 'ls-1',
    title: 'How to Ace VARC in CAT 2026 | Strategy & Speed Secrets',
    instructor: 'Aniket Dhiman',
    credentials: '99.44%iler, IIM Mumbai',
    subject: 'VARC',
    status: 'RECORDED',
    date: '21 Jun 2026',
    time: '19:00 IST',
    durationMin: 60,
    description: 'RC passage approach under time pressure, options elimination matrix, and Para-jumble speed solving.',
    videoUrl: 'https://youtube.com',
    notesUrl: '#'
  },
  {
    id: 'ls-2',
    title: 'Reading Comprehension 3-Hour Marathon | CAT 2026',
    instructor: 'Jyoti Kathju',
    credentials: '25+ Years VARC Specialist',
    subject: 'VARC',
    status: 'RECORDED',
    date: '21 Jun 2026',
    time: '19:00 - 22:00 IST',
    durationMin: 180,
    description: '3-hour non-stop RC marathon covering central ideas, inference questions, and author tone traps.',
    videoUrl: 'https://youtube.com',
    notesUrl: '#'
  },
  {
    id: 'ls-3',
    title: 'DILR Unfamiliar Sets & Arrangement Masterclass',
    instructor: 'Rohan Sharma',
    credentials: 'CAT 99.85%iler, IIM Ahmedabad',
    subject: 'LRDI',
    status: 'UPCOMING',
    date: 'Tomorrow',
    time: '20:00 IST',
    durationMin: 90,
    description: 'Mastering selection of unfamiliar DILR sets, games & tournaments, and row/column balancing.',
    notesUrl: '#'
  },
  {
    id: 'ls-4',
    title: 'QA Arithmetic Speed & Modern Math Tricks',
    instructor: 'Vikramaditya',
    credentials: 'CAT QA 100%iler',
    subject: 'QA',
    status: 'LIVE',
    date: 'TODAY',
    time: 'Live Right Now',
    durationMin: 60,
    description: 'Live interactive solving of Percentages, Ratio, TSD, and Modern Math short cuts.',
    videoUrl: 'https://youtube.com',
    notesUrl: '#'
  }
]

export function LiveSessionsPage({ onBack }: { onBack?: () => void }) {
  const [statusFilter, setStatusFilter]   = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'RECORDED'>('ALL')
  const [subjectFilter, setSubjectFilter] = useState<'ALL' | 'VARC' | 'LRDI' | 'QA'>('ALL')
  const [activeModalSession, setActiveModalSession] = useState<LiveSession | null>(null)
  const { show: toast }                   = useToast()

  const filteredSessions = LIVE_SESSIONS.filter(s =>
    (statusFilter === 'ALL' || s.status === statusFilter) &&
    (subjectFilter === 'ALL' || s.subject === subjectFilter)
  )

  const liveCount     = LIVE_SESSIONS.filter(s => s.status === 'LIVE').length
  const upcomingCount = LIVE_SESSIONS.filter(s => s.status === 'UPCOMING').length
  const recordedCount = LIVE_SESSIONS.filter(s => s.status === 'RECORDED').length

  const handleReminder = (s: LiveSession) => {
    toast(`🔔 Reminder set for ${s.title}!`, '#38BDF8')
  }

  const handleDownloadNotes = (s: LiveSession) => {
    toast(`📥 Handout PDF downloaded for ${s.subject} Live Session!`, '#22C55E')
  }

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: '0 auto', color: '#E2E8F0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>📺</span>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#F5A623', margin: 0 }}>
              Live Sessions & Recorded Classes
            </h1>
          </div>
          <p style={{ fontSize: 13, color: '#94A3B8', margin: '4px 0 0' }}>
            Join live expert masterclasses, video lectures, marathons, and class notes
          </p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: 'none', border: '1px solid #334155', color: '#94A3B8',
              borderRadius: 20, padding: '6px 16px', fontSize: 12, cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        )}
      </div>

      {/* Metrics Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 16 }}>
        <div style={{ background: '#0D1B2A', padding: 12, borderRadius: 10, border: '1px solid #1E293B', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>Total Sessions</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#F1F5F9' }}>{LIVE_SESSIONS.length}</div>
        </div>
        <div style={{ background: '#0D1B2A', padding: 12, borderRadius: 10, border: '1px solid #EF4444', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#EF4444', fontWeight: 800 }}>🔴 Live Now</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#EF4444' }}>{liveCount}</div>
        </div>
        <div style={{ background: '#0D1B2A', padding: 12, borderRadius: 10, border: '1px solid #F5A623', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#F5A623', fontWeight: 800 }}>⏰ Upcoming</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#F5A623' }}>{upcomingCount}</div>
        </div>
        <div style={{ background: '#0D1B2A', padding: 12, borderRadius: 10, border: '1px solid #22C55E', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#22C55E', fontWeight: 800 }}>📼 Recorded</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#22C55E' }}>{recordedCount}</div>
        </div>
      </div>

      {/* Filter Options */}
      <div style={{ background: '#0D1B2A', padding: 14, borderRadius: 12, border: '1px solid #1E293B', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#F5A623' }}>STATUS:</span>
          {(['ALL', 'LIVE', 'UPCOMING', 'RECORDED'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '4px 12px', borderRadius: 16, fontSize: 11, fontWeight: 700,
                border: statusFilter === st ? '1px solid #F5A623' : '1px solid #334155',
                background: statusFilter === st ? '#1A56DB' : '#1E293B',
                color: statusFilter === st ? '#FFF' : '#94A3B8', cursor: 'pointer'
              }}
            >
              {st === 'LIVE' ? '🔴 Live Now' : st}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto' }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#38BDF8' }}>SECTION:</span>
          {(['ALL', 'VARC', 'LRDI', 'QA'] as const).map(sec => (
            <button
              key={sec}
              onClick={() => setSubjectFilter(sec)}
              style={{
                padding: '4px 12px', borderRadius: 16, fontSize: 11, fontWeight: 700,
                border: subjectFilter === sec ? '1px solid #38BDF8' : '1px solid #334155',
                background: subjectFilter === sec ? '#0284C7' : '#1E293B',
                color: subjectFilter === sec ? '#FFF' : '#94A3B8', cursor: 'pointer'
              }}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Session Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filteredSessions.map(s => (
          <div
            key={s.id}
            style={{
              background: '#0D1B2A', padding: 16, borderRadius: 12,
              border: s.status === 'LIVE' ? '2px solid #EF4444' : '1px solid #1E293B'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 4,
                  background: s.status === 'LIVE' ? '#EF4444' : s.status === 'UPCOMING' ? '#F5A623' : '#22C55E',
                  color: '#FFF'
                }}>
                  {s.status === 'LIVE' ? '🔴 LIVE NOW' : s.status}
                </span>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#38BDF8', background: '#1E293B', padding: '2px 8px', borderRadius: 4 }}>
                  {s.subject}
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>
                📅 {s.date} • {s.time} ({s.durationMin} min)
              </div>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F1F5F9', margin: '4px 0 6px' }}>
              {s.title}
            </h3>

            <div style={{ fontSize: 12, color: '#F5A623', fontWeight: 700, marginBottom: 8 }}>
              👨‍🏫 {s.instructor} <span style={{ color: '#94A3B8', fontWeight: 400 }}>({s.credentials})</span>
            </div>

            <p style={{ fontSize: 12, color: '#CBD5E1', margin: '0 0 12px', lineHeight: 1.4 }}>
              {s.description}
            </p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid #1E293B' }}>
              {s.status === 'LIVE' && (
                <button
                  onClick={() => toast('🔴 Joining Live Masterclass Video Stream...', '#EF4444')}
                  style={{ background: '#EF4444', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 800, cursor: 'pointer', fontSize: 12 }}
                >
                  ▶ Join Live Stream
                </button>
              )}

              {s.status === 'RECORDED' && (
                <button
                  onClick={() => setActiveModalSession(s)}
                  style={{ background: '#1A56DB', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 800, cursor: 'pointer', fontSize: 12 }}
                >
                  ▶ Watch Recording
                </button>
              )}

              {s.status === 'UPCOMING' && (
                <button
                  onClick={() => handleReminder(s)}
                  style={{ background: '#F5A623', color: '#000', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 800, cursor: 'pointer', fontSize: 12 }}
                >
                  🔔 Set Session Reminder
                </button>
              )}

              <button
                onClick={() => handleDownloadNotes(s)}
                style={{ background: '#1E293B', color: '#38BDF8', border: '1px solid #334155', padding: '8px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}
              >
                📄 Class Notes PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      {activeModalSession && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16, zIndex: 1000
        }}>
          <div style={{ background: '#0D1B2A', padding: 20, borderRadius: 12, maxWidth: 600, width: '100%', border: '1px solid #38BDF8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#38BDF8' }}>
                📺 Recorded Masterclass
              </div>
              <button onClick={() => setActiveModalSession(null)} style={{ background: 'none', border: 'none', color: '#FFF', fontSize: 18, cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <div style={{ background: '#1E293B', padding: 40, borderRadius: 8, textAlign: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🎥</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#FFF' }}>{activeModalSession.title}</div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Instructor: {activeModalSession.instructor} ({activeModalSession.credentials})</div>
            </div>

            <button
              onClick={() => { toast('Video player launched in HD quality!', '#22C55E'); setActiveModalSession(null) }}
              style={{ width: '100%', padding: '12px', background: '#22C55E', color: '#FFF', fontWeight: 800, border: 'none', borderRadius: 8, cursor: 'pointer' }}
            >
              ▶ Play Full HD Video Lecture
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
