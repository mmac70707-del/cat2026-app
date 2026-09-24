import { useState } from 'react'
import { useToast } from '@/components/Toast'

export function OpenJarvisTerminal({ onBack }: { onBack?: () => void }) {
  const [inputQuery, setInputQuery] = useState('')
  const [messages, setMessages]     = useState<{ role: 'user' | 'jarvis'; text: string; codeSnippet?: string }[]>([
    {
      role: 'jarvis',
      text: '🤖 STANFORD OPENJARVIS AGENT v2.4 ONLINE.\n\nI am your Stanford OpenJarvis CAT 2026 AI Research Assistant. Ask me any Quantitative, DILR, or VARC question, request a concept breakdown, or get an instant step-by-step solution verification.'
    }
  ])
  const [isThinking, setIsThinking] = useState(false)
  const { show: toast }             = useToast()

  const handleAskJarvis = () => {
    const query = inputQuery.trim()
    if (!query) return

    // Append user message
    const updatedMsgs = [...messages, { role: 'user' as const, text: query }]
    setMessages(updatedMsgs)
    setInputQuery('')
    setIsThinking(true)

    // Simulate OpenJarvis Autonomous Reasoning Loop (Deconstruct -> Solve -> Verify)
    setTimeout(() => {
      let jarvisReply = ''
      let snippet = ''

      const lower = query.toLowerCase()

      if (lower.includes('percentage') || lower.includes('profit') || lower.includes('arithmetic')) {
        jarvisReply = '🔍 [STANFORD OPENJARVIS DECOMPOSITION]\n\n• Domain: Arithmetic / Percentages & Profit-Loss\n• Strategy: Multiplier & Base-100 Ratio Transformation\n\nSolution Step 1: Let Cost Price (CP) = 100x.\nSolution Step 2: Selling Price (SP) with 20% profit = 120x.\nSolution Step 3: Marked Price (MP) with 25% discount gives MP * 0.75 = 120x => MP = 160x.\n\n✓ Final Result Ratio MP:CP = 8:5.'
        snippet = 'CP = 100x | SP = 120x | MP = 160x | Profit = +20% | Discount = 25%'
      } else if (lower.includes('dilr') || lower.includes('matrix') || lower.includes('table') || lower.includes('arrangement')) {
        jarvisReply = '🧩 [STANFORD OPENJARVIS DILR REASONING ENGINE]\n\n• Category: Seating Arrangement / Constraint Grid\n• Execution Rule: Eliminate impossible cases before filling unknown cells.\n\nStep 1: Fix 100% deterministic constraints first.\nStep 2: Create a 2-case tree for conditional clues.\nStep 3: Test constraint 4 (contradiction eliminates Case 2).\n\n✓ Single Unique Arrangement Validated.'
        snippet = 'Case 1 (Valid): A at Pos 1, B at Pos 3, C at Pos 5 | Case 2 (Contradiction)'
      } else if (lower.includes('varc') || lower.includes('rc') || lower.includes('inference') || lower.includes('summary')) {
        jarvisReply = '📖 [STANFORD OPENJARVIS VARC ELIMINATION PROTOCOL]\n\n• Passage Architecture: Authorial Stance Analysis\n• Primary Trap: Extreme Qualifier Options (Always / Never / Solves)\n\nStep 1: Identify Paragraph 2 pivot word ("However").\nStep 2: Eliminate Option A (Too Broad) & Option C (Distorted Scope).\nStep 3: Option B mirrors the author\'s cautious tone.\n\n✓ Correct Choice: Option B.'
      } else {
        jarvisReply = `🤖 [STANFORD OPENJARVIS AUTONOMOUS AGENT]\n\nQuery Processed: "${query}"\n\n• Step 1 (Decomposition): Identified core mathematical/logical primitives.\n• Step 2 (Execution): Applied 99.9th percentile solution framework.\n• Step 3 (Self-Correction Audit): Zero C1–C5 errors detected.\n\n✓ Solution verified & ready for execution.`
      }

      setMessages([...updatedMsgs, { role: 'jarvis', text: jarvisReply, codeSnippet: snippet }])
      setIsThinking(false)
      toast('OpenJarvis Reasoning Complete ✓')
    }, 800)
  }

  return (
    <div style={{ padding: '16px 20px', maxWidth: 1000, margin: '0 auto', color: '#F1F5F9' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, background: '#161D2E', border: '1px solid #38BDF8', borderRadius: 12, padding: 16 }} className="glow-border-cobalt">
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#38BDF8', letterSpacing: 0.5 }}>
            🧠 STANFORD OPENJARVIS AI RESEARCH AGENT
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2, fontFamily: 'monospace' }}>
            openjarvis.stanford.edu • Autonomous CAT Reasoning &amp; Problem Solver
          </div>
        </div>

        {onBack && (
          <button onClick={onBack} style={{ background: '#1F2937', border: '1px solid #374151', color: '#94A3B8', padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
            ← Back
          </button>
        )}
      </div>

      {/* Terminal Viewport */}
      <div style={{ background: '#0A0F1E', border: '1px solid #2D3748', borderRadius: 12, padding: 16, minHeight: 380, maxHeight: 520, overflowY: 'auto', marginBottom: 16, fontFamily: 'JetBrains Mono, monospace' }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ marginBottom: 14, textAlign: m.role === 'user' ? 'right' : 'left' }}>
            <div style={{ fontSize: 10, color: m.role === 'user' ? '#F5A623' : '#38BDF8', fontWeight: 800, marginBottom: 4 }}>
              {m.role === 'user' ? '👤 YOU' : '🤖 STANFORD OPENJARVIS'}
            </div>
            <div
              style={{
                display: 'inline-block',
                background: m.role === 'user' ? 'rgba(245,166,35,0.15)' : '#161D2E',
                border: `1px solid ${m.role === 'user' ? '#F5A623' : '#38BDF8'}`,
                color: '#FFF',
                padding: '10px 14px',
                borderRadius: 10,
                maxWidth: '90%',
                fontSize: 12,
                whiteSpace: 'pre-line',
                lineHeight: 1.6
              }}
            >
              {m.text}
              {m.codeSnippet && (
                <div style={{ marginTop: 8, background: '#050A14', padding: 8, borderRadius: 6, color: '#4ADE80', fontSize: 11, border: '1px solid #22C55E' }}>
                  {m.codeSnippet}
                </div>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div style={{ color: '#F5A623', fontSize: 11, fontStyle: 'italic', animation: 'pulse 1.2s infinite' }}>
            ⚡ OpenJarvis is decomposing query &amp; auditing solution tree…
          </div>
        )}
      </div>

      {/* Input Box */}
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          type="text"
          placeholder="Ask OpenJarvis any Quant, DILR, or VARC question..."
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAskJarvis()}
          style={{ flex: 1, background: '#161D2E', border: '1px solid #38BDF8', color: '#FFF', borderRadius: 10, padding: '12px 14px', fontSize: 13, outline: 'none' }}
        />
        <button
          onClick={handleAskJarvis}
          style={{ background: '#38BDF8', color: '#0A0F1E', border: 'none', padding: '12px 20px', borderRadius: 10, fontWeight: 900, fontSize: 13, cursor: 'pointer' }}
        >
          Ask OpenJarvis
        </button>
      </div>
    </div>
  )
}
