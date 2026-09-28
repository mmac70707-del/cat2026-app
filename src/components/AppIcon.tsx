import type { SVGProps } from 'react'

/**
 * A single coherent icon language for the CAT 2026 command center.
 * Lucide-inspired geometry: 24px grid, outline-first, consistent caps/joins.
 */
export type AppIconName =
  | 'today' | 'week' | 'mastery' | 'phases' | 'more'
  | 'jarvis' | 'hud' | 'target' | 'focus' | 'errors'
  | 'repair' | 'retest' | 'mock' | 'adaptive' | 'research'
  | 'security' | 'settings' | 'lock' | 'back' | 'radar' | 'check'
  | 'compass' | 'clock' | 'dashboard' | 'library' | 'zap' | 'monitor'
  | 'book' | 'layers' | 'trophy' | 'flask' | 'alert' | 'wrench'
  | 'checkCircle' | 'badge' | 'eye' | 'meditation' | 'rocket' | 'bot'
  | 'newspaper' | 'microscope' | 'search' | 'arrowRight' | 'download' | 'x'

const PATHS: Record<AppIconName, JSX.Element> = {
  today: <><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 9h18"/><path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01"/></>,
  week: <><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 9h18"/><path d="M7 13h.01M12 13h.01M17 13h.01M7 17h.01M12 17h.01M17 17h.01"/></>,
  mastery: <><path d="M3 19V9M8 19V5M13 19v-8M18 19V3M21 19H2"/><path d="m3 7 5-3 5 2 5-4 3 2"/></>,
  phases: <><circle cx="5" cy="5" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="19" r="2"/><path d="m7 6 10 5M17 13 7 18"/></>,
  more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  jarvis: <><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6a6 6 0 1 0 6 6"/><circle cx="12" cy="12" r="2"/><path d="M12 2v2M22 12h-2"/></>,
  hud: <><path d="M3 9V5a2 2 0 0 1 2-2h4M15 3h4a2 2 0 0 1 2 2v4M21 15v4a2 2 0 0 1-2 2h-4M9 21H5a2 2 0 0 1-2-2v-4"/><circle cx="12" cy="12" r="3"/><path d="M12 8v1M12 15v1M8 12h1M15 12h1"/></>,
  target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/><path d="m16.5 7.5 4-4M18 3.5h2.5V6"/></>,
  focus: <><circle cx="12" cy="12" r="3"/><path d="M3 9V5a2 2 0 0 1 2-2h4M15 3h4a2 2 0 0 1 2 2v4M21 15v4a2 2 0 0 1-2 2h-4M9 21H5a2 2 0 0 1-2-2v-4"/></>,
  errors: <><path d="m12 3 9 16H3L12 3Z"/><path d="M12 9v4M12 16h.01"/></>,
  repair: <><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2.1-2.1Z"/><path d="m17 3 4 4"/></>,
  retest: <><path d="M20 11a8 8 0 1 0 1 5"/><path d="M20 4v7h-7"/><path d="m9 12 2 2 4-4"/></>,
  mock: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5M8 19h3"/></>,
  adaptive: <><path d="M4 19V8M10 19V5M16 19v-9M22 19H2"/><path d="M4 6h6M10 3v2M16 8h6"/></>,
  research: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/><path d="M11 8v6M8 11h6"/></>,
  security: <><path d="M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>,
  settings: <><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="8"/></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v3"/></>,
  back: <><path d="m15 18-6-6 6-6"/><path d="M9 12h11"/></>,
  radar: <><path d="M4.9 4.9a10 10 0 1 0 14.2 0"/><path d="M8.4 8.4a5 5 0 1 0 7.2 0"/><circle cx="12" cy="12" r="1.5"/><path d="m12 12 7-7"/></>,
  check: <><path d="m5 12 4 4L19 7"/></>,
  compass: <><circle cx="12" cy="12" r="9"/><path d="m15 9-2.2 4.8L8 16l2.2-4.8L15 9Z"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  dashboard: <><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></>,
  library: <><path d="M4 19V5M8 19V5M12 19V5M16 19V5M20 19V5"/><path d="M2 21h20M3 3h18"/></>,
  zap: <><path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z"/></>,
  monitor: <><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></>,
  book: <><path d="M4 5a3 3 0 0 1 3-2h13v17H7a3 3 0 0 0-3 3Z"/><path d="M4 5v18M7 3h13"/></>,
  layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></>,
  trophy: <><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M7 6H3v2a4 4 0 0 0 4 4M17 6h4v2a4 4 0 0 1-4 4"/></>,
  flask: <><path d="M9 3h6M10 3v6l-6 10a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2l-6-10V3"/><path d="M8 14h8"/></>,
  alert: <><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></>,
  wrench: <><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2.1-2.1Z"/><path d="m17 3 4 4"/></>,
  checkCircle: <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></>,
  badge: <><path d="M12 3 15 5l3.5-.2.8 3.4L22 10l-2 3 2 3-2.7 1.8-.8 3.4L15 19l-3 2-3-2-3.5.2-.8-3.4L2 16l2-3-2-3 2.7-1.8.8-3.4L9 5l3-2Z"/><path d="m9 12 2 2 4-4"/></>,
  eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
  meditation: <><circle cx="12" cy="5" r="2"/><path d="M7 20c1-4 3-6 5-6s4 2 5 6M5 12h4l3 2 3-2h4M9 9l3 3 3-3"/></>,
  rocket: <><path d="M14 6c3-3 6-3 6-3s0 3-3 6l-5 5-4-4 6-4Z"/><path d="m8 10-4 1 4 4M14 16l-1 4-4-4"/><circle cx="16" cy="7" r="1"/></>,
  bot: <><rect x="4" y="7" width="16" height="13" rx="3"/><path d="M12 3v4M8 13h.01M16 13h.01M8 17h8"/></>,
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
      {...props}
    >
      {PATHS[name]}
    </svg>
  )
}
