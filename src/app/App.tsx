import { useState, useEffect, useRef, useCallback } from 'react'
import { Header }       from '@/components/Header'
import { BottomNav }    from '@/components/BottomNav'
import { StudyTimer }   from '@/components/StudyTimer'
import { useToast }     from '@/components/Toast'

import { TodayPage }            from '@/features/today/TodayPage'
import { WeekPage }             from '@/features/week/WeekPage'
import { MasteryPage }          from '@/features/mastery/MasteryPage'
import { PhasesPage }           from '@/features/phases/PhasesPage'
import { MorePage }             from '@/pages/MorePage'
import { DashboardPage }        from '@/features/dashboard/DashboardPage'
import { MissionPage }          from '@/features/mission/MissionPage'
import { VisionPage }           from '@/features/vision/VisionPage'
import { MindsetPage }          from '@/features/mindset/MindsetPage'
import { ApexProSuite }         from '@/features/apexpro/ApexProSuite'
import { OpenJarvisTerminal }   from '@/features/openjarvis/OpenJarvisTerminal'
import { VoiceJarvisModal }     from '@/features/voice/VoiceJarvisModal'
import { JarvisStartupHUD }     from '@/features/jarvis/JarvisStartupHUD'
import { RoadmapPage }          from '@/features/roadmap/RoadmapPage'
import { CatMockExamPage }      from '@/features/mockengine/CatMockExamPage'
import { AdaptiveLearningPage } from '@/features/adaptive/AdaptiveLearningPage'
import { FormulaDeckPage }      from '@/features/flashcards/FormulaDeckPage'
import { AchievementsPage }     from '@/features/achievements/AchievementsPage'
import { DailyCapsulePage }     from '@/features/dailycapsule/DailyCapsulePage'
import { QuestionBankPage }     from '@/features/qbank/QuestionBankPage'
import { LiveSessionsPage }     from '@/features/livesessions/LiveSessionsPage'
import { SpeedDrillsPage }      from '@/features/drills/SpeedDrillsPage'
import { DeepResearchPage }     from '@/features/research/DeepResearchPage'
import { ErrorsPage }           from '@/features/errors/ErrorsPage'
import { RepairPage }           from '@/features/repair/RepairPage'
import { RetestPage }           from '@/features/retest/RetestPage'
import { MocksPage }            from '@/features/mocks/MocksPage'
import { SchedulePage }         from '@/features/schedule/SchedulePage'
import { SyllabusPage }         from '@/features/syllabus/SyllabusPage'
import { SettingsPage }         from '@/features/settings/SettingsPage'
import { SecuritySentinelPage }  from '@/features/security/SecuritySentinelPage'
import { MissionOSPage }          from '@/features/missionos/MissionOSPage'

import { openDB } from '@/db'
import { MasteryRepository } from '@/repositories/MasteryRepository'
import { registerBackButtonHandler, registerAppStateHandler } from '@/services/native'
import { SettingsRepository } from '@/repositories/index'
import { enableWebNotificationScheduler } from '@/services/webNotifications'
import { JarvisWebSecurityGate } from '@/features/jarvis/JarvisWebSecurityGate'
import { JarvisCommandCenter } from '@/features/jarvis/JarvisCommandCenter'
import { JarvisCommandPalette } from '@/features/jarvis/JarvisCommandPalette'
import { AppErrorBoundary } from '@/components/AppErrorBoundary'
import { initPwaInstall } from '@/services/pwaInstall'
import { installGlobalErrorAudit, recordAudit } from '@/services/auditLog'

type MainPage   = 'today' | 'week' | 'mastery' | 'phases' | 'more'
export type SubPage    = 'dashboard' | 'jarvis' | 'mission' | 'vision' | 'mindset' | 'apexpro' | 'openjarvis' | 'roadmap' | 'catmock' | 'dailycapsule' | 'adaptive' | 'flashcards' | 'achievements' | 'qbank' | 'livesessions' | 'drills' | 'research' | 'errors' | 'repair' | 'retest' | 'mockana' | 'schedule' | 'syllabus' | 'security' | 'missionos' | 'settings'
type ActivePage = MainPage | SubPage | string

const MAIN_PAGES: MainPage[] = ['today', 'week', 'mastery', 'phases', 'more']

const FOCUS_REMINDERS = [
  'EXECUTION > COLLECTION. Stay on your error log.',
  'Analysis > Ego. Review mistakes, not your score.',
  'Consistency > Intensity. One more block. Right now.',
  'No random resources. Your plan is your weapon.',
  'Repair > Reattempt. Fix the root cause first.',
]

export function App() {
  return (
    <AppErrorBoundary>
      <JarvisWebSecurityGate>
        <AppUnlocked />
      </JarvisWebSecurityGate>
    </AppErrorBoundary>
  )
}

function AppUnlocked() {
  const [activePage, setActivePage]             = useState<ActivePage>('dashboard')
  const [loading, setLoading]                   = useState(true)
  const [bootStage, setBootStage]               = useState(0)
  const [showVoiceJarvis, setShowVoiceJarvis]   = useState(false)
  const [showJarvisHud, setShowJarvisHud]       = useState(false)
  const [focusMode, setFocusMode]               = useState(false)
  const [focusStartedAt, setFocusStartedAt]     = useState<number | null>(null)
  const [focusElapsed, setFocusElapsed]         = useState(0)
  const { show: toast }                         = useToast()
  const touchStartX = useRef(0)
  const navIdxRef   = useRef(0)
  const reminderIdx = useRef(0)

  // ── Boot: open DB + seed mastery ────────────────
  useEffect(() => {
    initPwaInstall()
    const removeErrorAudit = installGlobalErrorAudit()
    void recordAudit('app_boot_started')

    async function boot() {
      try {
        setBootStage(1)
        await openDB()
        setBootStage(2)
        await MasteryRepository.init()
        setBootStage(3)
        const notificationsOn = await SettingsRepository.get('notifications', false)
        if (notificationsOn) enableWebNotificationScheduler()
        setBootStage(4)
      } catch (err) {
        console.error('[CAT2026] Boot error:', err)
        void recordAudit('boot_error', err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }
    boot()
    return removeErrorAudit
  }, [])

  // ── Global Focus Core state ─────────────────────
  useEffect(() => {
    const onStart = () => {
      setFocusMode(true)
      setFocusStartedAt(Date.now())
    }
    const onStop = () => {
      setFocusMode(false)
      setFocusStartedAt(null)
      setFocusElapsed(0)
    }
    window.addEventListener('jarvis:focus:start', onStart)
    window.addEventListener('jarvis:focus:stop', onStop)
    return () => {
      window.removeEventListener('jarvis:focus:start', onStart)
      window.removeEventListener('jarvis:focus:stop', onStop)
    }
  }, [])

  useEffect(() => {
    if (!focusMode || focusStartedAt == null) return
    const tick = () => setFocusElapsed(Math.max(0, Date.now() - focusStartedAt))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [focusMode, focusStartedAt])

  // ── Android hardware back button ────────────────
  const activePageRef = useRef(activePage)
  useEffect(() => { activePageRef.current = activePage }, [activePage])

  useEffect(() => {
    return registerBackButtonHandler(() => {
      const isMainNow = MAIN_PAGES.includes(activePageRef.current as MainPage)
      if (!isMainNow) {
        setActivePage('more')
        return true
      }
      return false
    })
  }, [])

  // ── Android app resume (foreground) ─────────────
  useEffect(() => {
    return registerAppStateHandler()
  }, [])

  // ── Focus reminder every 45 min ─────────────────
  useEffect(() => {
    const id = setInterval(() => {
      const msg = FOCUS_REMINDERS[reminderIdx.current % FOCUS_REMINDERS.length]
      toast('🔒 ' + msg, '#1A56DB')
      reminderIdx.current++
    }, 45 * 60 * 1000)
    return () => clearInterval(id)
  }, [toast])

  // ── Swipe navigation ────────────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(diff) < 70) return
    const isMain = MAIN_PAGES.includes(activePage as MainPage)
    if (!isMain) return
    const idx = MAIN_PAGES.indexOf(activePage as MainPage)
    if (diff < 0 && idx < MAIN_PAGES.length - 1) {
      const next = MAIN_PAGES[idx + 1]
      navIdxRef.current = idx + 1
      setActivePage(next)
    } else if (diff > 0 && idx > 0) {
      const prev = MAIN_PAGES[idx - 1]
      navIdxRef.current = idx - 1
      setActivePage(prev)
    }
  }, [activePage])

  // ── Keyboard shortcuts (desktop) ────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.altKey) return
      const map: Record<string, MainPage> = { '1':'today','2':'week','3':'mastery','4':'phases','5':'more' }
      if (map[e.key]) setActivePage(map[e.key])
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const isMain = MAIN_PAGES.includes(activePage as MainPage)

  if (loading) {
    const steps = [
      'WAKE JARVIS CORE',
      'OPEN LOCAL DATA VAULT',
      'LOAD MASTERY MATRIX',
      'SYNC DAILY EXECUTION',
    ]

    return (
      <div className="jarvis-boot-screen">
        <div className="jarvis-boot-orb">
          <div>◉</div>
        </div>
        <div className="jarvis-boot-kicker">JARVIS // SYSTEM STARTUP</div>
        <h1 className="jarvis-boot-title">CAT 2026</h1>
        <p className="jarvis-boot-sub">Personal execution system initializing…</p>
        <div className="jarvis-boot-progress">
          <div className="jarvis-boot-progress-fill" style={{ width: `${bootStage * 25}%` }} />
        </div>
        <div className="jarvis-boot-steps">
          {steps.map((step, i) => (
            <div key={step} className={bootStage > i ? 'done' : bootStage === i ? 'active' : ''}>
              <span>{bootStage > i ? '✓' : bootStage === i ? '›' : '·'}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (activePage === 'dashboard') {
    return (
      <>
        <div style={{ height: '100%', overflow: 'auto', position: 'relative' }}>
        <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
          <button onClick={() => setActivePage('more')} style={{ background: '#F5A623', color: '#0A0F1E', padding: '10px 20px', borderRadius: 20, fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
            ← Exit 1:1 Dashboard
          </button>
        </div>
        <DashboardPage />
        </div>
        <JarvisCommandPalette onNavigate={p => setActivePage(p as ActivePage)} />
      </>
    )
  }

  return (
    <div
      className="app-shell"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Header
        onOpenVoiceJarvis={() => setShowVoiceJarvis(true)}
        onOpenJarvisHud={() => setShowJarvisHud(true)}
      />

      <div className="content-area">
        {/* MAIN PAGES */}
        {activePage === 'today'   && <TodayPage />}
        {activePage === 'week'    && <WeekPage />}
        {activePage === 'mastery' && <MasteryPage />}
        {activePage === 'phases'  && <PhasesPage />}
        {activePage === 'more'    && <MorePage onNavigate={p => setActivePage(p as ActivePage)} />}

        {/* SUB PAGES */}
        {activePage === 'jarvis'        && <JarvisCommandCenter onBack={() => setActivePage('more')} onNavigate={p => setActivePage(p as ActivePage)} />}
        {activePage === 'mission'      && <MissionPage          onBack={() => setActivePage('more')} />}
        {activePage === 'vision'       && <VisionPage           onBack={() => setActivePage('more')} />}
        {activePage === 'mindset'      && <MindsetPage          onBack={() => setActivePage('more')} />}
        {activePage === 'apexpro'      && <ApexProSuite         onBack={() => setActivePage('more')} />}
        {activePage === 'openjarvis'   && <OpenJarvisTerminal   onBack={() => setActivePage('more')} />}
        {activePage === 'roadmap'      && <RoadmapPage          onBack={() => setActivePage('more')} />}
        {activePage === 'catmock'      && <CatMockExamPage      onBack={() => setActivePage('more')} />}
        {activePage === 'adaptive'     && <AdaptiveLearningPage onBack={() => setActivePage('more')} />}
        {activePage === 'flashcards'   && <FormulaDeckPage      onBack={() => setActivePage('more')} />}
        {activePage === 'achievements'  && <AchievementsPage     onBack={() => setActivePage('more')} />}
        {activePage === 'dailycapsule' && <DailyCapsulePage     onBack={() => setActivePage('more')} />}
        {activePage === 'qbank'        && <QuestionBankPage     onBack={() => setActivePage('more')} />}
        {activePage === 'livesessions' && <LiveSessionsPage     onBack={() => setActivePage('more')} />}
        {activePage === 'drills'       && <SpeedDrillsPage      onBack={() => setActivePage('more')} />}
        {activePage === 'research'     && <DeepResearchPage     onBack={() => setActivePage('more')} />}
        {activePage === 'errors'       && <ErrorsPage           onBack={() => setActivePage('more')} />}
        {activePage === 'repair'       && <RepairPage           onBack={() => setActivePage('more')} />}
        {activePage === 'retest'       && <RetestPage           onBack={() => setActivePage('more')} />}
        {activePage === 'mockana'      && <MocksPage            onBack={() => setActivePage('more')} />}
        {activePage === 'schedule'     && <SchedulePage         onBack={() => setActivePage('more')} />}
        {activePage === 'syllabus'     && <SyllabusPage         onBack={() => setActivePage('more')} />}
        {activePage === 'security'    && <SecuritySentinelPage  onBack={() => setActivePage('more')} />}
        {activePage === 'missionos'   && <MissionOSPage         onBack={() => setActivePage('more')} onOpenToday={() => setActivePage('today')} />}
        {activePage === 'settings'     && <SettingsPage         onBack={() => setActivePage('more')} />}
      </div>

      <VoiceJarvisModal
        isOpen={showVoiceJarvis}
        onClose={() => setShowVoiceJarvis(false)}
        onNavigate={(p) => { setShowVoiceJarvis(false); setActivePage(p); }}
      />

      <JarvisStartupHUD
        isOpen={showJarvisHud}
        onClose={() => setShowJarvisHud(false)}
        onLaunchJarvisVoice={() => { setShowJarvisHud(false); setShowVoiceJarvis(true); }}
      />

      {isMain && (
        <BottomNav
          current={activePage as MainPage}
          onChange={(p) => { setActivePage(p); navIdxRef.current = MAIN_PAGES.indexOf(p) }}
        />
      )}

      {!isMain && activePage !== 'dashboard' && (
        <div style={{ height: 'calc(var(--tab-h) + env(safe-area-inset-bottom))', paddingBottom: 'env(safe-area-inset-bottom)', background: '#0D1B2A', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <button onClick={() => setActivePage('more')} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 20, padding: '8px 24px', fontSize: 13, cursor: 'pointer' }}>
            ← Back to More Hub
          </button>
        </div>
      )}

      {focusMode && (
        <div className="jarvis-focus-overlay" role="dialog" aria-modal="true" aria-label="JARVIS Focus Core">
          <div className="jarvis-focus-card">
            <div className="jarvis-focus-kicker">JARVIS // FOCUS CORE</div>
            <div className="jarvis-focus-orb" aria-hidden="true">◉</div>
            <div className="jarvis-focus-title">DEEP WORK ACTIVE</div>
            <div className="jarvis-focus-timer">
              {new Date(focusElapsed).toISOString().slice(11, 19)}
            </div>
            <div className="jarvis-focus-mission">CURRENT MISSION</div>
            <div className="jarvis-focus-copy">Stay on the current CAT block. No random resources. Finish → analyse → repair.</div>
            <div className="jarvis-focus-actions">
              <button className="jarvis-focus-stop" onClick={() => window.dispatchEvent(new Event('jarvis:focus:stop'))}>EXIT FOCUS</button>
              <button className="jarvis-focus-lock" onClick={() => window.dispatchEvent(new Event('jarvis:lock'))}>LOCK JARVIS</button>
            </div>
          </div>
        </div>
      )}

      <StudyTimer />
      <JarvisCommandPalette onNavigate={p => setActivePage(p as ActivePage)} />
    </div>
  )
}
