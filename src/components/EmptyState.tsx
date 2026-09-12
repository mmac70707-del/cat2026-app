interface Props {
  icon: string
  title: string
  sub: string
}

export function EmptyState({ icon, title, sub }: Props) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      <div className="empty-sub">{sub}</div>
    </div>
  )
}
