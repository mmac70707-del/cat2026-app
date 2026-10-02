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
import { AdvancedJarvisConsole } from '@/features/jarvis/AdvancedJarvisConsole'
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
import { SecuritySentinelPage } from '@/features/security/SecuritySentinelPage'
import { MissionOSPage }        from '@/features/missionos/MissionOSPage'

import { openDB } from '@/db'
import { MasteryRepository } from '@/repositories/MasteryRepository'
import { SettingsRepository } from '@/repositories/index'
import { registerBackButtonHandler, registerAppStateHandler, isNative } from '@/services/native'
import { enableWebNotificationScheduler } from '@/services/webNotifications'
import { JarvisWebSecurityGate } from '@/features/jarvis/JarvisWebSecurityGate'
import { JarvisCommandCenter } from '@/features/jarvis/JarvisCommandCenter'
import { JarvisCommandPalette } from '@/features/jarvis/JarvisCommandPalette'
import { AppErrorBoundary } from '@/components/AppErrorBoundary'
import { initPwaInstall } from '@/services/pwaInstall'
import { applyStitchTheme } from '@/services/uiPreferences'
import { installGlobalErrorAudit, recordAudit } from '@/services/auditLog'

type MainPage   = 'today' | 'week' | 'mastery' | 'phases' | 'more'
export type SubPage    = 'dashboard' | 'jarvis' | 'jarvisconsole' | 'mission' | 'vision' | 'mindset' | 'apexpro' | 'openjarvis' | 'roadmap' | 'catmock' | 'dailycapsule' | 'adaptive' | 'flashcards' | 'achievements' | 'qbank' | 'livesessions' | 'drills' | 'research' | 'errors' | 'repair' | 'retest' | 'mockana' | 'schedule' | 'syllabus' | 'security' | 'missionos' | 'settings'
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
  const [activePage, setActivePage]             = useState<ActivePage>('dashboard')
  const [loading, setLoading]                   = useState(true)
  const [showVoiceJarvis, setShowVoiceJarvis]   = useState(false)
  const [showJarvisHud, setShowJarvisHud]       = useState(false)

  const { show: toast }                         = useToast()
  const touchStartX = useRef(0)
  const navIdxRef   = useRef(0)
  const reminderIdx = useRef(0)

  // ── Boot: open DB + seed mastery + apply theme ──
  useEffect(() => {
    async function boot() {
      try {
        await openDB()
        await MasteryRepository.init()
        installGlobalErrorAudit()
        initPwaInstall()
        if (!isNative()) {
          const notificationsEnabled = await SettingsRepository.get('notifications', false)
          if (notificationsEnabled) enableWebNotificationScheduler()
        }

        const savedAccent = await SettingsRepository.get('stitchTheme', 'apex')
        applyStitchTheme(savedAccent as string || 'apex')
      } catch (err) {
        console.error('[CAT2026] Boot error:', err)
      } finally {
        setLoading(false)
      }
    }
    boot()
  }, [])

  // ── Dashboard quick-command bridge ─────────────
  useEffect(() => {
    const handler = (event: Event) => {
      const page = (event as CustomEvent<{ page?: string }>).detail?.page
      if (page && typeof page === 'string') setActivePage(page as ActivePage)
    }
    window.addEventListener('jarvis:navigate', handler)
    return () => window.removeEventListener('jarvis:navigate', handler)
  }, [])

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
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
        <div style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(90deg,#F5A623,#FBBF24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          CAT 2026
        </div>
        <div style={{ fontSize: 12, color: '#94A3B8' }}>Loading execution system…</div>
      </div>
    )
  }

  return (
    <AppErrorBoundary>
      <JarvisWebSecurityGate>
        {activePage === 'dashboard' ? (
          <div style={{ height: '100%', overflow: 'auto', position: 'relative' }}>
            <div className="legacy-dashboard-exit">
              <button onClick={() => setActivePage('more')} aria-label="Return to the main app">
                <span aria-hidden="true">←</span>
                <span>BACK TO APP</span>
              </button>
            </div>
            <DashboardPage />
          </div>
        ) : (
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
              {activePage === 'today'   && <TodayPage onNavigate={p => setActivePage(p as ActivePage)} />}
              {activePage === 'week'    && <WeekPage />}
              {activePage === 'mastery' && <MasteryPage />}
              {activePage === 'phases'  && <PhasesPage />}
              {activePage === 'more'    && <MorePage onNavigate={p => setActivePage(p as ActivePage)} />}

              {/* SUB PAGES */}
              {activePage === 'jarvis'        && <JarvisCommandCenter   onBack={() => setActivePage('more')} />}
              {activePage === 'jarvisconsole' && <AdvancedJarvisConsole onBack={() => setActivePage('more')} />}
              {activePage === 'mission'       && <MissionPage           onBack={() => setActivePage('more')} />}
              {activePage === 'vision'        && <VisionPage            onBack={() => setActivePage('more')} />}
              {activePage === 'mindset'       && <MindsetPage           onBack={() => setActivePage('more')} />}
              {activePage === 'apexpro'       && <ApexProSuite          onBack={() => setActivePage('more')} />}
              {activePage === 'openjarvis'    && <OpenJarvisTerminal    onBack={() => setActivePage('more')} />}
              {activePage === 'roadmap'       && <RoadmapPage           onBack={() => setActivePage('more')} />}
              {activePage === 'catmock'       && <CatMockExamPage       onBack={() => setActivePage('more')} />}
              {activePage === 'adaptive'      && <AdaptiveLearningPage  onBack={() => setActivePage('more')} />}
              {activePage === 'flashcards'    && <FormulaDeckPage       onBack={() => setActivePage('more')} />}
              {activePage === 'achievements'  && <AchievementsPage      onBack={() => setActivePage('more')} />}
              {activePage === 'dailycapsule'  && <DailyCapsulePage      onBack={() => setActivePage('more')} />}
              {activePage === 'qbank'         && <QuestionBankPage      onBack={() => setActivePage('more')} />}
              {activePage === 'livesessions'  && <LiveSessionsPage      onBack={() => setActivePage('more')} />}
              {activePage === 'drills'        && <SpeedDrillsPage       onBack={() => setActivePage('more')} />}
              {activePage === 'research'      && <DeepResearchPage      onBack={() => setActivePage('more')} />}
              {activePage === 'errors'        && <ErrorsPage            onBack={() => setActivePage('more')} />}
              {activePage === 'repair'        && <RepairPage             onBack={() => setActivePage('more')} />}
              {activePage === 'retest'        && <RetestPage             onBack={() => setActivePage('more')} />}
              {activePage === 'mockana'       && <MocksPage              onBack={() => setActivePage('more')} />}
              {activePage === 'schedule'      && <SchedulePage           onBack={() => setActivePage('more')} />}
              {activePage === 'syllabus'      && <SyllabusPage           onBack={() => setActivePage('more')} />}
              {activePage === 'security'      && <SecuritySentinelPage   onBack={() => setActivePage('more')} />}
              {activePage === 'missionos'     && <MissionOSPage          onBack={() => setActivePage('more')} />}
              {activePage === 'settings'      && <SettingsPage           onBack={() => setActivePage('more')} />}
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

            <JarvisCommandPalette
              onNavigate={p => { setActivePage(p); recordAudit('PALETTE_NAVIGATE: ' + p); }}
            />

            {isMain && (
              <BottomNav
                current={activePage as MainPage}
                onChange={(p) => { setActivePage(p); navIdxRef.current = MAIN_PAGES.indexOf(p) }}
              />
            )}

            {!isMain && (
              <div style={{ height: 'calc(var(--tab-h) + env(safe-area-inset-bottom))', paddingBottom: 'env(safe-area-inset-bottom)', background: 'var(--ui-surface)', borderTop: '1px solid var(--ui-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <button onClick={() => setActivePage('more')} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--ui-muted)', borderRadius: 20, padding: '8px 24px', fontSize: 13, cursor: 'pointer' }}>
                  ← Back to More Hub
                </button>
              </div>
            )}

            <StudyTimer />
          </div>
        )}
      </JarvisWebSecurityGate>
    </AppErrorBoundary>
  )
}
