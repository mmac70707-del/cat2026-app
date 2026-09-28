import type { SVGProps } from 'react'

export type AppIconName =
  | 'today' | 'week' | 'mastery' | 'phases' | 'more'
  | 'jarvis' | 'hud' | 'target' | 'focus' | 'errors'
  | 'repair' | 'retest' | 'mock' | 'adaptive' | 'research'
  | 'security' | 'settings' | 'lock' | 'back' | 'radar' | 'check'

const PATHS: Record<AppIconName, JSX.Element> = {
  today: <><rect x="4" y="3.5" width="16" height="17" rx="2"/><path d="M8 7.5h8M8 11.5h8M8 15.5h5"/></>,
  week: <><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M7 3v4M17 3v4M3.5 9h17M7.5 13h.01M12 13h.01M16.5 13h.01M7.5 16.5h.01M12 16.5h.01"/></>,
  mastery: <><path d="M4 18V9M10 18V5M16 18v-7M22 18H2"/><path d="m4 7 5-3 6 3 5-4"/></>,
  phases: <><circle cx="5" cy="5" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="19" r="2"/><path d="M7 6.2 17 10.8M17.2 13.2 7 17.8"/></>,
  more: <><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></>,
  jarvis: <><circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></>,
  hud: <><circle cx="12" cy="12" r="8"/><path d="M8 12h8M12 8v8"/></>,
  target: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></>,
  focus: <><path d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4"/><circle cx="12" cy="12" r="3"/></>,
  errors: <><path d="M12 3 21 19H3Z"/><path d="M12 9v4M12 16h.01"/></>,
  repair: <><path d="m14.5 6.5 3-3 3 3-3 3"/><path d="m17.5 6.5-5 5M4 20l3.5-.7L18 8.8l-2.8-2.8L4.7 16.5Z"/></>,
  retest: <><path d="M20 6v5h-5"/><path d="M19 11a7 7 0 1 0 1.2 4"/></>,
  mock: <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/></>,
  adaptive: <><path d="M5 18V6M12 18V4M19 18V9"/><path d="M3 20h18"/></>,
  research: <><circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 5 5"/></>,
  security: <><path d="M12 3 19 6v5c0 4.3-2.7 7.8-7 10-4.3-2.2-7-5.7-7-10V6Z"/><path d="m9 12 2 2 4-4"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 2-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-2.8v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-2-2 .1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H4v-2.8h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-2 .1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3h2.8v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 2 2-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v2.8h-.2a1.7 1.7 0 0 0-1.6 1Z"/></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  back: <><path d="m14 6-6 6 6 6M8 12h11"/></>,
  radar: <><circle cx="12" cy="12" r="8"/><path d="M12 12 18 7M12 4v16M4 12h16"/></>,
  check: <><path d="m5 12 4 4L19 7"/></>
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
