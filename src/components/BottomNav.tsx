import { AppIcon, type AppIconName } from '@/components/AppIcon'

type PageId = 'today' | 'week' | 'mastery' | 'phases' | 'more'

interface Props {
  current: PageId
  onChange: (page: PageId) => void
}

const NAV_ITEMS: { id: PageId; icon: AppIconName; label: string; seq: string }[] = [
  { id: 'today',   icon: 'today',   label: 'Today',   seq: '01' },
  { id: 'week',    icon: 'week',    label: 'Week',    seq: '02' },
  { id: 'mastery', icon: 'mastery', label: 'Mastery', seq: '03' },
  { id: 'phases',  icon: 'phases',  label: 'Phases',  seq: '04' },
  { id: 'more',    icon: 'more',    label: 'More',    seq: '05' },
]

export function BottomNav({ current, onChange }: Props) {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`nav-btn ${current === item.id ? 'active' : ''}`}
          onClick={() => onChange(item.id)}
        >
          <div className="nav-icon">
            <span className="nav-seq">{item.seq}</span>
            <AppIcon name={item.icon} size={19} />
          </div>
          <div className="nav-label">{item.label}</div>
        </button>
      ))}
    </nav>
  )
}
