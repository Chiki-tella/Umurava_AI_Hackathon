'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ShieldCheck, Users, Briefcase, FileText, TrendingUp,
  Building2, User, ChevronDown, ChevronUp, Search,
  CheckCircle2, XCircle, Clock, Zap, BarChart3, Star
} from 'lucide-react'
import { useAuthContextNew } from '@/components/AuthProviderNew'
import { getAllUsers, type User as AuthUser } from '@/lib/auth'
import { getAllJobs } from '@/lib/jobs'
import { getApplications } from '@/lib/applications'
import { clsx } from 'clsx'
import type { Job } from '@/lib/mockData'
import type { Application } from '@/lib/applications'

type Tab = 'overview' | 'recruiters' | 'applicants' | 'jobs' | 'applications'

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6">
      <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center mb-4 border', color)}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </motion.div>
  )
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={clsx(
      'px-4 py-2 rounded-xl text-sm font-medium transition-all',
      active ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
    )}>
      {children}
    </button>
  )
}

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      <input
        type="text" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-10 w-full max-w-sm"
      />
    </div>
  )
}

export function AdminDashboard() {
  const { user, loading: authLoading } = useAuthContextNew()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('overview')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const [users, setUsers] = useState<AuthUser[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.replace('/auth'); return }
    if (user.role !== 'admin') { router.replace('/'); return }
    
    const loadAdminData = async () => {
      try {
        console.log('🔍 Loading admin dashboard data...')
        
        // Load users data
        // TODO: Implement admin API for getting all users
        // For now, use mock data as fallback
        const usersData = getAllUsers()
        console.log('👥 Users loaded:', usersData.length)
        setUsers(usersData)
        
        // Load jobs data
        const jobsResult = await getAllJobs()
        console.log('💼 Jobs loaded:', jobsResult.length)
        setJobs(jobsResult)
        
        // Load applications data
        const applicationsResult = await getApplications()
        console.log('📄 Applications loaded:', applicationsResult.length)
        setApplications(applicationsResult)
        
      } catch (error) {
        console.error('❌ Failed to load admin data:', error)
      }
    }
    
    loadAdminData()
  }, [authLoading, user, router])

  if (authLoading || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
      </div>
    )
  }

  const recruiters = users.filter((u) => u.role === 'recruiter')
  const applicants = users.filter((u) => u.role === 'jobseeker')
  const openJobs = jobs.filter((j) => j.status === 'open')
  const screenedApps = applications.filter((a) => a.matchScore !== undefined)
  const avgScore = screenedApps.length
    ? Math.round(screenedApps.reduce((s, a) => s + (a.matchScore ?? 0), 0) / screenedApps.length)
    : 0

  const q = search.toLowerCase()

  const filteredRecruiters = recruiters.filter((r) =>
    r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || (r.company ?? '').toLowerCase().includes(q)
  )
  const filteredApplicants = applicants.filter((a) =>
    a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
  )
  const filteredJobs = jobs.filter((j) =>
    j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q)
  )
  const filteredApps = applications.filter((a) =>
    a.applicantName.toLowerCase().includes(q) || a.applicantEmail.toLowerCase().includes(q)
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-brand-orange to-amber-500 shadow-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-400 mt-0.5">Platform-wide oversight · {user.fullName}</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-dark-800/40 border border-white/5 rounded-2xl p-1.5">
        {(['overview', 'recruiters', 'applicants', 'jobs', 'applications'] as Tab[]).map((t) => (
          <TabBtn key={t} active={tab === t} onClick={() => { setTab(t); setSearch('') }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </TabBtn>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Building2} label="Recruiters" value={recruiters.length}
              sub={`${recruiters.filter(r => (r.jobIds?.length ?? 0) > 0).length} with active jobs`}
              color="bg-brand-orange/10 border-brand-orange/20 text-brand-orange" />
            <StatCard icon={Users} label="Job Seekers" value={applicants.length}
              sub={`${applications.length} applications submitted`}
              color="bg-brand-purple/10 border-brand-purple/20 text-brand-violet" />
            <StatCard icon={Briefcase} label="Total Jobs" value={jobs.length}
              sub={`${openJobs.length} open · ${jobs.length - openJobs.length} closed`}
              color="bg-brand-pink/10 border-brand-pink/20 text-brand-pink" />
            <StatCard icon={BarChart3} label="Avg AI Score" value={avgScore ? `${avgScore}%` : '—'}
              sub={`${screenedApps.length} screened applications`}
              color="bg-emerald-500/10 border-emerald-500/20 text-emerald-400" />
          </div>

          {/* Recent activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Latest applications */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <FileText className="w-5 h-5 text-brand-violet" />
                <h3 className="text-lg font-semibold text-white">Latest Applications</h3>
              </div>
              {applications.length === 0 ? (
                <p className="text-gray-500 text-sm">No applications yet.</p>
              ) : (
                <div className="space-y-3">
                  {[...applications].reverse().slice(0, 5).map((app) => {
                    const job = jobs.find((j) => j.id === app.jobId)
                    return (
                      <div key={app.id} className="flex items-center justify-between gap-3 py-2 border-b border-white/5 last:border-0">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{app.applicantName}</p>
                          <p className="text-xs text-gray-500 truncate">{job?.title ?? app.jobId} · {job?.company}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {app.matchScore !== undefined
                            ? <span className={clsx('text-xs font-bold', app.matchScore >= 75 ? 'text-emerald-400' : app.matchScore >= 60 ? 'text-amber-400' : 'text-red-400')}>{app.matchScore}%</span>
                            : <span className="text-xs text-gray-600">Not screened</span>
                          }
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Recruiters overview */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <Building2 className="w-5 h-5 text-brand-orange" />
                <h3 className="text-lg font-semibold text-white">Recruiters Overview</h3>
              </div>
              {recruiters.length === 0 ? (
                <p className="text-gray-500 text-sm">No recruiters yet.</p>
              ) : (
                <div className="space-y-3">
                  {recruiters.slice(0, 6).map((r) => {
                    const jobCount = (r.jobIds ?? []).length
                    const appCount = applications.filter((a) => (r.jobIds ?? []).includes(a.jobId)).length
                    return (
                      <div key={r.id} className="flex items-center justify-between gap-3 py-2 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange text-xs font-bold flex-shrink-0">
                            {r.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{r.name}</p>
                            <p className="text-xs text-gray-500 truncate">{r.company}</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 flex-shrink-0">{jobCount} job{jobCount !== 1 ? 's' : ''} · {appCount} app{appCount !== 1 ? 's' : ''}</div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── RECRUITERS ── */}
      {tab === 'recruiters' && (
        <div className="space-y-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search recruiters..." />
          {filteredRecruiters.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">No recruiters found.</p>
          ) : filteredRecruiters.map((r) => {
            const rJobs = jobs.filter((j) => (r.jobIds ?? []).includes(j.id))
            const rApps = applications.filter((a) => (r.jobIds ?? []).includes(a.jobId))
            const isOpen = expandedId === r.id
            return (
              <div key={r.id} className="glass-card overflow-hidden">
                <div className="p-5 flex items-center justify-between gap-4 cursor-pointer" onClick={() => setExpandedId(isOpen ? null : r.id)}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange font-bold flex-shrink-0">
                      {r.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{r.name}</p>
                      <p className="text-sm text-gray-400">{r.email} · {r.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="hidden sm:flex gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{rJobs.length} jobs</span>
                      <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{rApps.length} apps</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 border-t border-white/5">
                    <p className="text-xs font-medium text-gray-400 mt-4 mb-2">Jobs Posted</p>
                    {rJobs.length === 0 ? <p className="text-xs text-gray-600">No jobs posted yet.</p> : (
                      <div className="space-y-2">
                        {rJobs.map((j) => {
                          const jApps = applications.filter((a) => a.jobId === j.id)
                          return (
                            <div key={j.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-dark-700/50 border border-white/5 text-sm">
                              <span className="text-gray-300">{j.title}</span>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className={clsx('px-2 py-0.5 rounded-full border text-xs', j.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-500/10 text-gray-500 border-gray-500/20')}>{j.status}</span>
                                <span>{jApps.length} applicants</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── APPLICANTS ── */}
      {tab === 'applicants' && (
        <div className="space-y-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search applicants..." />
          {filteredApplicants.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">No applicants found.</p>
          ) : filteredApplicants.map((a) => {
            const aApps = applications.filter((ap) => ap.applicantId === a.id)
            const isOpen = expandedId === a.id
            return (
              <div key={a.id} className="glass-card overflow-hidden">
                <div className="p-5 flex items-center justify-between gap-4 cursor-pointer" onClick={() => setExpandedId(isOpen ? null : a.id)}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-violet font-bold flex-shrink-0">
                      {a.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{a.name}</p>
                      <p className="text-sm text-gray-400">{a.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="hidden sm:flex gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{aApps.length} application{aApps.length !== 1 ? 's' : ''}</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-white/5">
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {a.skills && a.skills.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-400 mb-2">Skills</p>
                          <div className="flex flex-wrap gap-1.5">
                            {a.skills.map((s) => <span key={s} className="px-2 py-0.5 rounded-lg bg-brand-purple/10 text-brand-violet text-xs border border-brand-purple/20">{s}</span>)}
                          </div>
                        </div>
                      )}
                      {a.preferredRoles && a.preferredRoles.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-400 mb-2">Preferred Roles</p>
                          <div className="flex flex-wrap gap-1.5">
                            {a.preferredRoles.map((r) => <span key={r} className="px-2 py-0.5 rounded-lg bg-dark-700/50 text-gray-300 text-xs border border-white/10">{r}</span>)}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium text-gray-400 mb-2">Applications</p>
                    {aApps.length === 0 ? <p className="text-xs text-gray-600">No applications yet.</p> : (
                      <div className="space-y-2">
                        {aApps.map((ap) => {
                          const j = jobs.find((jj) => jj.id === ap.jobId)
                          return (
                            <div key={ap.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-dark-700/50 border border-white/5 text-sm">
                              <span className="text-gray-300">{j?.title ?? ap.jobId} <span className="text-gray-500">@ {j?.company}</span></span>
                              {ap.matchScore !== undefined
                                ? <span className={clsx('text-xs font-bold', ap.matchScore >= 75 ? 'text-emerald-400' : ap.matchScore >= 60 ? 'text-amber-400' : 'text-red-400')}>{ap.matchScore}%</span>
                                : <span className="text-xs text-gray-600 flex items-center gap-1"><Clock className="w-3 h-3" />Pending</span>
                              }
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── JOBS ── */}
      {tab === 'jobs' && (
        <div className="space-y-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search jobs..." />
          {filteredJobs.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">No jobs found.</p>
          ) : filteredJobs.map((j) => {
            const jApps = applications.filter((a) => a.jobId === j.id)
            const screened = jApps.filter((a) => a.matchScore !== undefined)
            const topScore = screened.length ? Math.max(...screened.map((a) => a.matchScore ?? 0)) : null
            return (
              <div key={j.id} className="glass-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white">{j.title}</p>
                      <span className={clsx('px-2 py-0.5 rounded-full text-xs border', j.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-500/10 text-gray-500 border-gray-500/20')}>{j.status}</span>
                    </div>
                    <p className="text-sm text-gray-400">{j.company} · {j.location ?? 'Location TBD'} · {j.experienceLevel}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {j.requiredSkills.slice(0, 5).map((s) => <span key={s} className="px-2 py-0.5 rounded-lg bg-brand-purple/10 text-brand-violet text-xs border border-brand-purple/20">{s}</span>)}
                      {j.requiredSkills.length > 5 && <span className="text-xs text-gray-500">+{j.requiredSkills.length - 5} more</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{jApps.length} applicants</span>
                    {topScore !== null && <span className="flex items-center gap-1 text-emerald-400"><Star className="w-3.5 h-3.5" />Top: {topScore}%</span>}
                    <span>Deadline: {new Date(j.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── APPLICATIONS ── */}
      {tab === 'applications' && (
        <div className="space-y-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by applicant name or email..." />
          {filteredApps.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">No applications found.</p>
          ) : filteredApps.map((app) => {
            const j = jobs.find((jj) => jj.id === app.jobId)
            return (
              <div key={app.id} className="glass-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-white">{app.applicantName}</p>
                    <p className="text-sm text-gray-400">{app.applicantEmail}</p>
                    <p className="text-xs text-gray-500 mt-1">Applied to: <span className="text-gray-300">{j?.title ?? app.jobId}</span> @ {j?.company}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {app.skills.slice(0, 5).map((s) => <span key={s} className="px-2 py-0.5 rounded-lg bg-dark-700/50 text-gray-300 text-xs border border-white/10">{s}</span>)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {app.matchScore !== undefined ? (
                      <>
                        <span className={clsx('text-2xl font-bold', app.matchScore >= 75 ? 'text-emerald-400' : app.matchScore >= 60 ? 'text-amber-400' : 'text-red-400')}>{app.matchScore}%</span>
                        <span className="text-xs text-gray-500">AI Score</span>
                      </>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-gray-600"><Clock className="w-3.5 h-3.5" />Not screened</span>
                    )}
                    <span className="text-xs text-gray-600">{new Date(app.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                {app.recommendation && (
                  <div className={clsx('mt-3 px-3 py-2 rounded-xl text-xs border', app.matchScore && app.matchScore >= 75 ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' : 'bg-amber-500/5 border-amber-500/20 text-amber-300')}>
                    <span className="font-medium">AI: </span>{app.recommendation}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
