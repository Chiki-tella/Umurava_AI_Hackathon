'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/AuthProvider'
import type { UserRole } from '@/lib/auth'

interface RouteGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function RouteGuard({ children, requiredRole }: RouteGuardProps) {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/auth')
      return
    }
    if (requiredRole && user.role !== requiredRole) {
      // Wrong role — redirect to their home
      router.replace(user.role === 'recruiter' ? '/dashboard' : '/')
    }
  }, [user, loading, requiredRole, router])

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null
  if (requiredRole && user.role !== requiredRole) return null

  return <>{children}</>
}
