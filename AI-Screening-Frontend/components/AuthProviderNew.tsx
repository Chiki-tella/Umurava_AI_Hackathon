'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  getCurrentUser, 
  setCurrentUser, 
  signOut as authSignOut, 
  updateUserProfile,
  getMe,
  getToken,
  setToken,
  type User 
} from '@/lib/auth-backend'

interface AuthContextType {
  user: User | null
  loading: boolean
  refresh: () => Promise<void>
  signOut: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProviderNew({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  // Initialize auth state only on client side
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getToken()
        const storedUser = getCurrentUser()
        
        if (token && storedUser) {
          // Validate token with backend
          const result = await getMe()
          if ('user' in result) {
            setUser(result.user)
          } else {
            // Token invalid, clear everything
            authSignOut()
            setUser(null)
          }
        } else {
          // No valid session
          setUser(null)
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        setUser(null)
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    }

    initAuth()
  }, [])

  const refresh = async () => {
    if (!initialized) return
    
    try {
      const result = await getMe()
      if ('user' in result) {
        setUser(result.user)
      }
    } catch (error) {
      console.error('Auth refresh failed:', error)
    }
  }

  const signOut = () => {
    authSignOut()
    setUser(null)
  }

  const updateUser = (updates: Partial<User>) => {
    if (!user) return
    const updated = { ...user, ...updates }
    setCurrentUser(updated)
    setUser(updated)
  }

  const value: AuthContextType = {
    user,
    loading: loading || !initialized,
    refresh,
    signOut,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContextNew() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContextNew must be used within an AuthProviderNew')
  }
  return context
}
