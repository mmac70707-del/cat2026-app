import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/Toast'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: Props) {
  const { user, loginWithGoogle, loginWithEmail, logout } = useAuth()
  const { show: toast } = useToast()
  const [email, setEmail] = useState('')
  const [name, setName]   = useState('')
  const [isRegisterMode, setIsRegisterMode] = useState(false)

  if (!isOpen) return null

  const handleGoogleSignIn = async () => {
    await loginWithGoogle()
    toast('✅ Successfully signed in with Google!', '#22C55E')
    onClose()
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast('Please enter a valid email address', '#EF4444')
      return
    }
    await loginWithEmail(email, name)
    toast('✅ Successfully signed in!', '#22C55E')
    onClose()
  }

  const handleLogout = () => {
    logout()
    toast('Signed out of profile.', '#F5A623')
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, zIndex: 2000
    }}>
      <div style={{ background: '#0D1B2A', padding: 24, borderRadius: 16, maxWidth: 420, width: '100%', border: '1px solid #1A56DB', color: '#E2E8F0', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#94A3B8', fontSize: 18, cursor: 'pointer' }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 32, marginBottom: 4 }}>🔐</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#F5A623', margin: 0 }}>
            {user.isLoggedIn ? 'User Profile & Account' : 'Sign In to CAT 2026'}
          </h2>
          <p style={{ fontSize: 12, color: '#94A3B8', margin: '4px 0 0' }}>
            {user.isLoggedIn ? 'Manage your cloud sync and percentile goals' : 'Sync your study blocks, errors, and mock scores across devices'}
          </p>
        </div>

        {user.isLoggedIn ? (
          <div style={{ background: '#1E293B', padding: 16, borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#F1F5F9' }}>👤 {user.name}</div>
            <div style={{ fontSize: 12, color: '#38BDF8', margin: '2px 0 10px' }}>{user.email}</div>
            <div style={{ fontSize: 12, color: '#CBD5E1' }}>🎯 Target Goal: <strong>{user.targetPercentile}%ile</strong> ({user.targetIIM})</div>

            <button
              onClick={handleLogout}
              style={{ width: '100%', marginTop: 16, padding: '10px', background: '#EF4444', color: '#FFF', fontWeight: 800, border: 'none', borderRadius: 8, cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            {/* Google One-Tap Sign In */}
            <button
              onClick={handleGoogleSignIn}
              style={{
                width: '100%', padding: '12px', borderRadius: 10, background: '#FFF', color: '#000',
                fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 10, marginBottom: 16, fontSize: 13
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Continue with Google
            </button>

            <div style={{ textAlign: 'center', fontSize: 11, color: '#94A3B8', marginBottom: 16 }}>— OR WITH EMAIL —</div>

            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {isRegisterMode && (
                <input
                  type="text"
                  placeholder="Full Name (e.g. Aditya Chauhan)"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#1E293B', border: '1px solid #334155', color: '#FFF', fontSize: 13, outline: 'none' }}
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: '#1E293B', border: '1px solid #334155', color: '#FFF', fontSize: 13, outline: 'none' }}
              />

              <button
                type="submit"
                style={{ width: '100%', padding: '12px', background: '#1A56DB', color: '#FFF', fontWeight: 800, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, marginTop: 4 }}
              >
                {isRegisterMode ? 'Create Account' : 'Sign In with Email'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <button
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                style={{ background: 'none', border: 'none', color: '#F5A623', fontSize: 12, cursor: 'pointer' }}
              >
                {isRegisterMode ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
