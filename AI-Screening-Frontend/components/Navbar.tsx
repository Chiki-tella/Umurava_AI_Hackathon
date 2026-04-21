'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Briefcase, LayoutDashboard, Zap, LogOut, User, ChevronDown, ShieldCheck, Bell } from 'lucide-react'
import { clsx } from 'clsx'
import { useAuthContext } from '@/components/AuthProvider'
import { useState, useRef, useEffect } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuthContext()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const isActive = (path: string) => {
    if (path === '/jobs' && pathname === '/jobs') return true
    if (path !== '/jobs' && pathname.startsWith(path)) return true
    return false
  }

  const homeHref = !user ? '/' : user.role === 'admin' ? '/admin' : user.role === 'recruiter' ? '/dashboard' : '/jobs'

  const handleSignOut = () => {
    signOut()
    router.push('/auth')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-dark-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={homeHref} className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center shadow-glow-purple group-hover:shadow-glow-pink transition-all duration-300">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Talent<span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Center nav — only show relevant links */}
          {user && (
            <div className="hidden md:flex items-center gap-1 bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-1">
              {/* Applicants see Jobs */}
              {user.role === 'applicant' && (
                <>
                  <Link
                    href="/jobs"
                    className={clsx(
                      'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive('/jobs')
                        ? 'bg-brand-purple/20 text-brand-violet border border-brand-purple/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Browse Jobs</span>
                  </Link>
                  <Link
                    href="/notifications"
                    className={clsx(
                      'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive('/notifications')
                        ? 'bg-brand-purple/20 text-brand-violet border border-brand-purple/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </Link>
                </>
              )}

              {/* Recruiters see Dashboard */}
              {user.role === 'recruiter' && (
                <Link
                  href="/dashboard"
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive('/dashboard')
                      ? 'bg-brand-purple/20 text-brand-violet border border-brand-purple/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>My Dashboard</span>
                </Link>
              )}

              {/* Admin sees Admin panel */}
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive('/admin')
                      ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI Online
            </div>

            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-800/50 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-white leading-none">{user.name.split(' ')[0]}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>                  </div>
                  <ChevronDown className={clsx('w-4 h-4 text-gray-400 transition-transform', menuOpen && 'rotate-180')} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 glass-card py-2 shadow-card">
                    <div className="px-4 py-2 border-b border-white/5 mb-1">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    {user.role === 'applicant' && (
                      <Link
                        href="/notifications"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Bell className="w-4 h-4" />
                        Notifications
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth" className="btn-primary text-sm py-2 px-5">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
