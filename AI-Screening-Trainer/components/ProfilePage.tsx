'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Mail, Briefcase, MapPin, Code, Save, CheckCircle2, Building2 } from 'lucide-react'
import { useAuthContext } from '@/components/AuthProvider'
import { updateUser } from '@/lib/auth'
import { getApplicationsByApplicant } from '@/lib/applications'
import { jobs } from '@/lib/mockData'
import { clsx } from 'clsx'

const ROLE_OPTIONS = [
  'Frontend Engineer', 'Backend Engineer', 'Full Stack Developer',
  'Product Designer', 'Data Scientist', 'DevOps Engineer',
  'Mobile Developer', 'Product Manager', 'Engineering Manager',
]
const LOCATION_OPTIONS = ['Remote', 'San Francisco', 'New York', 'Austin', 'Seattle', 'Los Angeles']

export function ProfilePage() {
  const { user, loading, refresh } = useAuthContext()
  const router = useRouter()
  const [saved, setSaved] = useState(false)

  const [prefRoles, setPrefRoles] = useState<string[]>([])
  const [prefLocations, setPrefLocations] = useState<string[]>([])
  const [skills, setSkills] = useState('')

  useEffect(() => {
    if (loading) return
    if (!user) { router.replace('/auth'); return }
    setPrefRoles(user.preferredRoles ?? [])
    setPrefLocations(user.preferredLocations ?? [])
    setSkills(user.skills?.join(', ') ?? '')
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin" />
      </div>
    )
  }

  const toggle = (arr: string[], val: string, set: (v: string[]) => void) => {
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val])
  }

  const handleSave = () => {
    updateUser({
      preferredRoles: prefRoles,
      preferredLocations: prefLocations,
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
    })
    refresh()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const myApplications = user.role === 'applicant'
    ? getApplicationsByApplicant(user.id)
    : []

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold text-white mb-8">My Profile</h1>

        {/* Account info */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{user.name}</h2>
              <div className="flex items-center gap-2 text-gray-400 text-sm mt-0.5">
                <Mail className="w-3.5 h-3.5" />{user.email}
              </div>
              <span className={clsx(
                'inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-medium border',
                user.role === 'recruiter'
                  ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/20'
                  : 'bg-brand-purple/10 text-brand-violet border-brand-purple/20'
              )}>
                {user.role === 'recruiter' ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                {user.role === 'recruiter' ? `Recruiter · ${user.company}` : 'Job Seeker'}
              </span>
            </div>
          </div>
        </div>

        {/* Applicant preferences */}
        {user.role === 'applicant' && (
          <div className="glass-card p-6 mb-6 space-y-6">
            <h3 className="text-lg font-semibold text-white">Job Preferences</h3>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                <Briefcase className="w-4 h-4 inline mr-1.5 text-gray-400" />Roles I&apos;m interested in
              </label>
              <div className="flex flex-wrap gap-2">
                {ROLE_OPTIONS.map((r) => (
                  <button key={r} type="button" onClick={() => toggle(prefRoles, r, setPrefRoles)}
                    className={clsx('px-3 py-1.5 rounded-xl text-sm border transition-all',
                      prefRoles.includes(r)
                        ? 'bg-brand-purple/20 border-brand-purple/50 text-brand-violet'
                        : 'bg-dark-700/50 border-white/10 text-gray-400 hover:border-white/20'
                    )}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                <MapPin className="w-4 h-4 inline mr-1.5 text-gray-400" />Preferred locations
              </label>
              <div className="flex flex-wrap gap-2">
                {LOCATION_OPTIONS.map((l) => (
                  <button key={l} type="button" onClick={() => toggle(prefLocations, l, setPrefLocations)}
                    className={clsx('px-3 py-1.5 rounded-xl text-sm border transition-all',
                      prefLocations.includes(l)
                        ? 'bg-brand-pink/20 border-brand-pink/50 text-brand-pink'
                        : 'bg-dark-700/50 border-white/10 text-gray-400 hover:border-white/20'
                    )}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Code className="w-4 h-4 inline mr-1.5 text-gray-400" />My Skills
              </label>
              <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, TypeScript, Python..." className="input-field" />
            </div>

            <button onClick={handleSave} className={clsx('btn-primary flex items-center gap-2 transition-all', saved && 'bg-emerald-500 from-emerald-500 to-emerald-600')}>
              {saved ? <><CheckCircle2 className="w-4 h-4" />Saved!</> : <><Save className="w-4 h-4" />Save Preferences</>}
            </button>
          </div>
        )}

        {/* Applications history */}
        {user.role === 'applicant' && (
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-5">My Applications ({myApplications.length})</h3>
            {myApplications.length === 0 ? (
              <p className="text-gray-400 text-sm">You haven&apos;t applied to any jobs yet.</p>
            ) : (
              <div className="space-y-3">
                {myApplications.map((app) => {
                  const job = jobs.find((j) => j.id === app.jobId)
                  return (
                    <div key={app.id} className="flex items-center justify-between p-4 rounded-xl bg-dark-700/50 border border-white/5">
                      <div>
                        <p className="text-sm font-medium text-white">{job?.title ?? 'Unknown Job'}</p>
                        <p className="text-xs text-gray-500">{job?.company} · Applied {new Date(app.submittedAt).toLocaleDateString()}</p>
                      </div>
                      {app.matchScore ? (
                        <span className={clsx('badge', app.matchScore >= 90 ? 'badge-success' : app.matchScore >= 75 ? 'badge-warning' : 'badge-danger')}>
                          {app.matchScore}% match
                        </span>
                      ) : (
                        <span className="badge bg-gray-500/10 text-gray-400 border border-gray-500/20">Pending review</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
