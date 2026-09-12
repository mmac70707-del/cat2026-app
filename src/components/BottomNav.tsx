type PageId = 'today' | 'week' | 'mastery' | 'phases' | 'more'

interface Props {
  current: PageId
  onChange: (page: PageId) => void
}

const NAV_ITEMS: { id: PageId; icon: string; label: string }[] = [
  { id: 'today',   icon: '📋', label: 'Today'   },
  { id: 'week',    icon: '📅', label: 'Week'    },
  { id: 'mastery', icon: '📈', label: 'Mastery' },
  { id: 'phases',  icon: '🗺️', label: 'Phases'  },
  { id: 'more',    icon: '⋯',  label: 'More'    },
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
          <div className="nav-icon">{item.icon}</div>
          <div className="nav-label">{item.label}</div>
        </button>
      ))}
    </nav>
  )
}
