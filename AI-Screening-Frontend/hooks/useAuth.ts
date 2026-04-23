'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  getCurrentUser, 
  setCurrentUser, 
  signOut as authSignOut, 
  updateUserProfile,
  getMe,
  isAuth,
  type User 
} from '@/lib/auth-backend'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const initAuth = async () => {
      try {
        if (isAuth()) {
          // Try to refresh user data from backend
          const result = await getMe()
          if ('user' in result) {
            setUser(result.user)
          } else {
            // Token might be invalid, clear it
            authSignOut()
          }
        } else {
          setUser(getCurrentUser())
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [mounted])

  const refresh = useCallback(async () => {
    if (!mounted) return
    
    if (isAuth()) {
      const result = await getMe()
      if ('user' in result) {
        setUser(result.user)
      }
    } else {
      setUser(getCurrentUser())
    }
  }, [mounted])

  const signOut = useCallback(() => {
    authSignOut()
    setUser(null)
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    if (!user) return
    const updated = { ...user, ...updates }
    setCurrentUser(updated)
    setUser(updated)
  }, [user])

  // Return loading state until component is mounted to prevent hydration mismatch
  return { user, loading: loading || !mounted, refresh, signOut, updateUser }
}
