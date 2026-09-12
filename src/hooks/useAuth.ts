import { useState, useEffect } from 'react'

export interface UserProfile {
  id: string
  name: string
  email: string
  avatarUrl?: string
  targetPercentile: number
  targetIIM: string
  isLoggedIn: boolean
}

const DEFAULT_USER: UserProfile = {
  id: 'guest_1001',
  name: 'Aspirant (Guest)',
  email: 'aspirant@cat2026.app',
  targetPercentile: 99.5,
  targetIIM: 'IIM Ahmedabad / IIM Bangalore',
  isLoggedIn: false
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cat2026_user_profile')
    if (saved) {
      try { return JSON.parse(saved) } catch { return DEFAULT_USER }
    }
    return DEFAULT_USER
  })

  useEffect(() => {
    localStorage.setItem('cat2026_user_profile', JSON.stringify(user))
  }, [user])

  const loginWithGoogle = async () => {
    // Simulated Google One-Tap / OAuth Sign In
    const googleUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: 'Aditya Chauhan',
      email: 'aditya.cat2026@gmail.com',
      avatarUrl: 'https://lh3.googleusercontent.com/a/default-user',
      targetPercentile: 99.8,
      targetIIM: 'IIM Ahmedabad',
      isLoggedIn: true
    }
    setUser(googleUser)
    return googleUser
  }

  const loginWithEmail = async (email: string, name: string) => {
    const emailUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      targetPercentile: 99.5,
      targetIIM: 'IIM Bangalore / IIM Calcutta',
      isLoggedIn: true
    }
    setUser(emailUser)
    return emailUser
  }

  const logout = () => {
    setUser(DEFAULT_USER)
    localStorage.removeItem('cat2026_user_profile')
  }

  return { user, loginWithGoogle, loginWithEmail, logout }
}
