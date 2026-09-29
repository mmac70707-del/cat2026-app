import type { SVGProps } from 'react'

/**
 * A single coherent icon language for the CAT 2026 command center.
 * Lucide-inspired geometry: 24px grid, outline-first, consistent caps/joins.
 */
export type AppIconName =
  | 'sun' | 'moon' | 'today' | 'week' | 'mastery' | 'phases' | 'more'
  | 'jarvis' | 'hud' | 'target' | 'focus' | 'errors'
  | 'repair' | 'retest' | 'mock' | 'adaptive' | 'research'
  | 'security' | 'settings' | 'lock' | 'back' | 'radar' | 'check'
  | 'compass' | 'clock' | 'dashboard' | 'library' | 'zap' | 'monitor'
  | 'book' | 'layers' | 'trophy' | 'flask' | 'alert' | 'wrench'
  | 'checkCircle' | 'badge' | 'eye' | 'meditation' | 'rocket' | 'bot'
  | 'newspaper' | 'microscope' | 'search' | 'arrowRight' | 'download' | 'x'

const PATHS: Record<AppIconName, JSX.Element> = {
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
  moon: <><path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5a8.7 8.7 0 1 0 12 12Z"/></>,
  today: <><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M8 2v4M16 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></>,
  week: <><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M8 2v4M16 2v4M3 10h18"/><path d="M7 14h4M7 18h4M15 14h2M15 18h2"/></>,
  mastery: <><path d="M3 3v18h18"/><path d="m6 16 4-5 4 3 5-7"/><path d="M19 7h-3V4"/></>,
  phases: <><path d="M6 3v18M6 7h5a4 4 0 0 1 0 8H6M12 11h5a3 3 0 0 0 0-6h-5"/></>,
  more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  jarvis: <><path d="M17.6 6.5A3 3 0 1 0 12 5a3 3 0 0 0-5.63-1.45A3 3 0 0 0 6 10"/><path d="M18 5.1a4 4 0 0 1 2.5 5.8A4 4 0 0 1 19.5 18"/><path d="M4 17.5A4 4 0 0 0 11.5 20c.2-.3.9-.3 1.1 0a4 4 0 0 0 6.8-.8"/><path d="M6 10.3A4 4 0 0 0 6 18"/><circle cx="12" cy="12" r="3"/></>,
  hud: <><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0Z"/><path d="M12 7v1M12 16v1M7 12h1M16 12h1"/></>,
  target: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
  focus: <><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="1.2"/></>,
  errors: <><path d="m12 3 9 16H3L12 3Z"/><path d="M12 9v4M12 16h.01"/></>,
  repair: <><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2.1-2.1Z"/><path d="m17 3 4 4"/></>,
  retest: <><path d="M20 11a8 8 0 1 0 1 5"/><path d="M20 4v7h-7"/><path d="m9 12 2 2 4-4"/></>,
  mock: <><path d="M6 3h9l3 3v15H6z"/><path d="M14 3v4h4M9 12h6M9 16h4"/></>,
  adaptive: <><path d="M4 19V8M10 19V5M16 19v-9M22 19H2"/><path d="M4 6h6M10 3v2M16 8h6"/></>,
  research: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/><path d="M11 8v6M8 11h6"/></>,
  security: <><path d="M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6Z"/><rect x="9" y="10.5" width="6" height="5.5" rx="1"/><path d="M10 10.5V9a2 2 0 0 1 4 0v1.5"/></>,
  settings: <><path d="M9.7 4.2a2.4 2.4 0 0 1 4.6 0 2.4 2.4 0 0 0 3.4 1.9 2.4 2.4 0 0 1 2.3 4 2.4 2.4 0 0 0 0 3.8 2.4 2.4 0 0 1-2.3 4 2.4 2.4 0 0 0-3.4 1.9 2.4 2.4 0 0 1-4.6 0 2.4 2.4 0 0 0-3.4-1.9 2.4 2.4 0 0 1-2.3-4 2.4 2.4 0 0 0 0-3.8 2.4 2.4 0 0 1 2.3-4 2.4 2.4 0 0 0 3.4-1.9Z"/><circle cx="12" cy="12" r="3"/></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v3"/></>,
  back: <><path d="m15 18-6-6 6-6"/><path d="M9 12h11"/></>,
  radar: <><path d="M4.9 4.9a10 10 0 1 0 14.2 0"/><path d="M8.4 8.4a5 5 0 1 0 7.2 0"/><circle cx="12" cy="12" r="1.5"/><path d="m12 12 7-7"/></>,
  check: <><path d="m5 12 4 4L19 7"/></>,
  compass: <><circle cx="12" cy="12" r="9"/><path d="m15 9-2.2 4.8L8 16l2.2-4.8L15 9Z"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  dashboard: <><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></>,
  library: <><path d="m16 6 4 14M12 6v14M8 8v12M4 4v16"/></>,
  zap: <><path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z"/></>,
  monitor: <><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></>,
  book: <><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a2.5 2.5 0 0 0-2.5 2.5"/></>,
  layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></>,
  trophy: <><path d="M6 3h12v6a6 6 0 0 1-12 0z"/><path d="M6 5H4a2 2 0 0 0 0 4h2M18 5h2a2 2 0 0 1 0 4h-2M9 21h6M12 15v6"/></>,
  flask: <><path d="M9 3h6M10 3v6l-6 10a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2l-6-10V3"/><path d="M8 14h8"/></>,
  alert: <><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></>,
  wrench: <><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2.1-2.1Z"/><path d="m17 3 4 4"/></>,
  checkCircle: <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></>,
  badge: <><path d="M12 3 15 5l3.5-.2.8 3.4L22 10l-2 3 2 3-2.7 1.8-.8 3.4L15 19l-3 2-3-2-3.5.2-.8-3.4L2 16l2-3-2-3 2.7-1.8.8-3.4L9 5l3-2Z"/><path d="m9 12 2 2 4-4"/></>,
  eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
  meditation: <><circle cx="12" cy="5" r="2"/><path d="M7 20c1-4 3-6 5-6s4 2 5 6M5 12h4l3 2 3-2h4M9 9l3 3 3-3"/></>,
  rocket: <><path d="M14 6c3-3 6-3 6-3s0 3-3 6l-5 5-4-4 6-4Z"/><path d="m8 10-4 1 4 4M14 16l-1 4-4-4"/><circle cx="16" cy="7" r="1"/></>,
  bot: <><rect x="4" y="7" width="16" height="13" rx="4"/><path d="M12 3v4M8 13h.01M16 13h.01M8 17h8M9 10h6"/></>,
  newspaper: <><path d="M4 4h16v17H4z"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
  microscope: <><path d="M6 20h12M9 20v-3a3 3 0 0 1 3-3h3M12 14 9 9l3-2 3 5M14 4l3 3M17 7 20 4"/><path d="M5 17h12"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  arrowRight: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  download: <><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></>,
  x: <><path d="m6 6 12 12M18 6 6 18"/></>,
}

export function AppIcon({
  name,
  size = 20,
  strokeWidth = 1.8,
  className,
  ...props
}: { name: AppIconName; size?: number; strokeWidth?: number } & Omit<SVGProps<SVGSVGElement>, 'name'>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      vectorEffect="non-scaling-stroke"
      className={['app-icon', className].filter(Boolean).join(' ')}
      {...props}
    >
      {PATHS[name]}
    </svg>
  )
}
