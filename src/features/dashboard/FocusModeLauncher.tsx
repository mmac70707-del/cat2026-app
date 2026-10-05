import type { ReactNode } from 'react'
import { AppIcon, type AppIconName } from '@/components/AppIcon'

type FocusModule = {
  id: string
  label: string
  sub: string
  icon: AppIconName
  onOpen: () => void
}

type Props = {
  realDayName: string
  realDateStr: string
  phaseId: string
  phaseName: string
  dayNum: number
  actionTitle: string
  actionStatus: string
  actionDetail: string
  done: number
  total: number
  pct: number
  onFullDashboard: () => void
  onStartFocus: () => void
  modules: FocusModule[]
  children?: ReactNode
}

export function FocusModeLauncher({
  realDayName,
  realDateStr,
  phaseId,
  phaseName,
  dayNum,
  actionTitle,
  actionStatus,
  actionDetail,
  done,
  total,
  pct,
  onFullDashboard,
  onStartFocus,
  modules,
}: Props) {
  return (
    <section className="focus-mode-cockpit focus-mode-launcher" aria-label="Focus Mode CAT one-tap command center">
      <div className="focus-launcher-head">
        <div>
          <div className="focus-mode-kicker">
            <AppIcon name="focus" size={13} /> FOCUS MODE • CAT-FIRST
          </div>
          <div className="focus-launcher-title">ONE TAP. ONE PART. NO CLUTTER.</div>
          <div className="focus-launcher-sub">
            {realDayName}, {realDateStr} • {phaseId} — {phaseName} • CAT Day {String(dayNum).padStart(2, '0')}/44
          </div>
        </div>
        <button type="button" className="focus-mode-exit" onClick={onFullDashboard}>
          FULL DASHBOARD
        </button>
      </div>

      <div className="focus-primary-action">
        <div className="focus-primary-copy">
          <span>{actionStatus}</span>
          <strong>{actionTitle}</strong>
          <small>{actionDetail}</small>
        </div>
        <button type="button" className="focus-primary-start" onClick={onStartFocus}>
          <span>⏱</span>
          START FOCUS
        </button>
      </div>

      <div className="focus-execution-strip" aria-label="CAT execution sequence">
        {['SOLVE', 'TEST', 'ANALYSE', 'REPAIR', 'RETEST'].map((step, index) => (
          <div key={step} className={'focus-execution-step ' + (index === 0 ? 'active' : '')}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <b>{step}</b>
          </div>
        ))}
      </div>

      <div className="focus-3d-stage" aria-label="One-tap modules">
        <div className="focus-3d-floor" aria-hidden="true" />
        <div className="focus-3d-core">
          <div className="focus-3d-ring ring-one" />
          <div className="focus-3d-ring ring-two" />
          <div className="focus-3d-core-face">
            <span>CAT CORE</span>
            <strong>{done}/{total || 8}</strong>
            <small>{pct}% EXECUTED</small>
          </div>
        </div>

        {modules.map((module, index) => (
          <button
            type="button"
            key={module.id}
            className={'focus-3d-pod pod-' + (index + 1)}
            onClick={module.onOpen}
            aria-label={'Open ' + module.label}
          >
            <span className="focus-3d-pod-icon">
              <AppIcon name={module.icon} size={18} />
            </span>
            <span className="focus-3d-pod-copy">
              <b>{module.label}</b>
              <small>{module.sub}</small>
            </span>
            <span className="focus-3d-pod-arrow">↗</span>
          </button>
        ))}
      </div>

      <div className="focus-launcher-foot">
        <AppIcon name="target" size={13} />
        <span>Tap a pod → that part opens. CAT stays first. Everything else stays out of the way.</span>
      </div>
    </section>
  )
}
