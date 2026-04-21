'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { getCurrentUser, setCurrentUser, signOut as authSignOut, type User } from '@/lib/auth'

interface AuthContextValue {
  user: User | null
  loading: boolean
  refresh: () => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refresh: () => {},
  signOut: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(getCurrentUser())
    setLoading(false)
  }, [])

  const refresh = useCallback(() => {
    setUser(getCurrentUser())
  }, [])

  const signOut = useCallback(() => {
    authSignOut()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, refresh, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
