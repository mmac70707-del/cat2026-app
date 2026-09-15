import rawHtml from './dashboard.html?raw'

export function DashboardPage({ onBack }: { onBack?: () => void }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <iframe
        srcDoc={rawHtml}
        style={{ flex: 1, width: '100%', border: 'none', display: 'block', background: '#0A0F1E' }}
        title="Master Execution Dashboard"
      />
    </div>
  )
}
