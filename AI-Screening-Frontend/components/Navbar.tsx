'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Briefcase, LayoutDashboard, LogOut, User, ChevronDown, ShieldCheck, Bell } from 'lucide-react'
import { clsx } from 'clsx'
import { useAuthContextNew } from '@/components/AuthProviderNew'
import { useState, useRef, useEffect } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuthContextNew()
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
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[rgba(7,12,20,0.92)] backdrop-blur-xl shadow-[0_1px_3px_var(--shadow)]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={homeHref} className="group inline-flex items-center">
            <span className="text-xl sm:text-2xl font-bold uppercase font-display tracking-[0.25em] text-[var(--text-primary)]">
              Talent
            </span>
            <span className="text-xl sm:text-2xl font-bold uppercase font-display tracking-[0.05em] text-[var(--accent-primary)]">
              AI
            </span>
          </Link>

          {/* Center nav — only show relevant links */}
          {user && (
            <div className="hidden md:flex items-center gap-1 bg-[rgba(17,29,45,0.7)] backdrop-blur-sm border border-[var(--border)] rounded-lg p-1">
              {/* Job seekers see Jobs */}
              {user.role === 'jobseeker' && (
                <>
                  <Link
                    href="/jobs"
                    className={clsx(
                      'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                      isActive('/jobs')
                        ? 'bg-[rgba(74,158,191,0.16)] text-[var(--accent-light)] border border-[rgba(74,158,191,0.42)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.04)]'
                    )}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Browse Jobs</span>
                  </Link>
                  <Link
                    href="/notifications"
                    className={clsx(
                      'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                      isActive('/notifications')
                        ? 'bg-[rgba(74,158,191,0.16)] text-[var(--accent-light)] border border-[rgba(74,158,191,0.42)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.04)]'
                    )}
                  >
                    <div className="relative">
                      <Bell className="w-4 h-4" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <span>Notifications</span>
                  </Link>
                </>
              )}

              {/* Recruiters see Dashboard */}
              {user.role === 'recruiter' && (
                <Link
                  href="/dashboard"
                  className={clsx(
                      'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                    isActive('/dashboard')
                      ? 'bg-[rgba(74,158,191,0.16)] text-[var(--accent-light)] border border-[rgba(74,158,191,0.42)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.04)]'
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
                      'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                    isActive('/admin')
                      ? 'bg-[rgba(74,158,191,0.16)] text-[var(--accent-light)] border border-[rgba(74,158,191,0.42)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.04)]'
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
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[rgba(74,158,191,0.12)] border border-[rgba(74,158,191,0.35)] text-[var(--accent-light)] text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
              AI Online
            </div>

            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-[rgba(17,29,45,0.75)] border border-[var(--border)] hover:border-[rgba(74,158,191,0.45)] transition-all"
                >
                  <div className="w-7 h-7 rounded-md bg-[rgba(74,158,191,0.16)] border border-[rgba(74,158,191,0.4)] flex items-center justify-center text-[var(--accent-light)] text-xs font-bold">
                    {user?.fullName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-[var(--text-primary)] leading-none">{user?.fullName?.split(' ')[0] || user?.name?.split(' ')[0] || 'User'}</p>
                    <p className="text-xs text-[var(--text-muted)] capitalize">{user?.role || 'user'}</p>                  </div>
                  <ChevronDown className={clsx('w-4 h-4 text-[var(--text-muted)] transition-transform', menuOpen && 'rotate-180')} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 glass-card py-2 shadow-card">
                    <div className="px-4 py-2 border-b border-[var(--border)] mb-1">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{user?.fullName || user?.name || 'User'}</p>
                      <p className="text-xs text-[var(--text-muted)]">{user?.email || 'user@example.com'}</p>
                    </div>
                    {user?.role === 'jobseeker' && (
                      <Link
                        href="/notifications"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                      >
                        <div className="relative">
                          <Bell className="w-4 h-4" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                        Notifications
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
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
