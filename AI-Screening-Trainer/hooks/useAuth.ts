'use client'

import { useState, useEffect, useCallback } from 'react'
import { getCurrentUser, setCurrentUser, signOut as authSignOut, type User } from '@/lib/auth'

export function useAuth() {
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

  const updateUser = useCallback((updates: Partial<User>) => {
    if (!user) return
    const updated = { ...user, ...updates }
    setCurrentUser(updated)
    setUser(updated)
  }, [user])

  return { user, loading, refresh, signOut, updateUser }
}
