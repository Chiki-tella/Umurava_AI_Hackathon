'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Mail, User, Building2, Briefcase, MapPin, Code,
  ArrowRight, Sparkles, ChevronRight, Plus, X, Eye, EyeOff
} from 'lucide-react'
import { signIn, signUp, type UserRole } from '@/lib/auth'
import { useAuthContext } from '@/components/AuthProvider'
import { clsx } from 'clsx'
import { addJob } from '@/lib/jobs'

const ROLE_OPTIONS = [
  'Frontend Engineer', 'Backend Engineer', 'Full Stack Developer',
  'Product Designer', 'Data Scientist', 'DevOps Engineer',
  'Mobile Developer', 'Product Manager', 'Engineering Manager',
]

const LOCATION_OPTIONS = ['Remote', 'San Francisco', 'New York', 'Austin', 'Seattle', 'Los Angeles']

type Mode = 'signin' | 'signup-role' | 'signup-applicant' | 'signup-recruiter' | 'post-job'

export function AuthPage() {
  const router = useRouter()
  const { user: currentUser, loading: authLoading, refresh } = useAuthContext()
  const [mode, setMode] = useState<Mode>('signin')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [newRecruiterUser, setNewRecruiterUser] = useState<import('@/lib/auth').User | null>(null)

  // Redirect already-logged-in users immediately
  useEffect(() => {
    if (authLoading) return
    if (currentUser) {
      if (currentUser.role === 'admin') router.replace('/admin')
      else router.replace(currentUser.role === 'recruiter' ? '/dashboard' : '/jobs')
    }
  }, [currentUser, authLoading, router])

  // Sign in
  const [siEmail, setSiEmail] = useState('')
  const [siPassword, setSiPassword] = useState('')
  const [siShowPw, setSiShowPw] = useState(false)

  // Sign up shared
  const [suEmail, setSuEmail] = useState('')
  const [suName, setSuName] = useState('')
  const [suPassword, setSuPassword] = useState('')
  const [suConfirm, setSuConfirm] = useState('')
  const [suShowPw, setSuShowPw] = useState(false)
  const [suRole, setSuRole] = useState<UserRole>('applicant')

  // Applicant extras
  const [prefRoles, setPrefRoles] = useState<string[]>([])
  const [prefLocations, setPrefLocations] = useState<string[]>([])
  const [skills, setSkills] = useState('')

  // Recruiter extras
  const [company, setCompany] = useState('')

  // Post-job form
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [jobSkills, setJobSkills] = useState('')
  const [jobExpLevel, setJobExpLevel] = useState('')
  const [jobSalary, setJobSalary] = useState('')
  const [jobLocation, setJobLocation] = useState('')
  const [jobType, setJobType] = useState('Full-time')
  const [jobWebsite, setJobWebsite] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    const result = signIn(siEmail, siPassword)
    setLoading(false)
    if ('error' in result) { setError(result.error); return }
    refresh()
    if (result.user.role === 'admin') router.push('/admin')
    else router.push(result.user.role === 'recruiter' ? '/dashboard' : '/jobs')
  }

  // Applicant signup
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    const result = signUp({
      email: suEmail,
      name: suName,
      role: 'applicant',
      preferredRoles: prefRoles,
      preferredLocations: prefLocations,
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
    })
    setLoading(false)
    if ('error' in result) { setError(result.error); return }
    refresh()
    router.push('/jobs')
  }

  // Recruiter signup → then post a job
  const handleRecruiterSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    const result = signUp({ email: suEmail, name: suName, role: 'recruiter', company })
    setLoading(false)
    if ('error' in result) { setError(result.error); return }
    refresh()
    setNewRecruiterUser(result.user)
    setMode('post-job')
  }

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRecruiterUser) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    addJob({
      title: jobTitle,
      company: newRecruiterUser.company || company,
      description: jobDescription,
      requiredSkills: jobSkills.split(',').map((s) => s.trim()).filter(Boolean),
      experienceLevel: jobExpLevel,
      salary: jobSalary || undefined,
      location: jobLocation || undefined,
      type: jobType || undefined,
      websiteUrl: jobWebsite || undefined,
      recruiterId: newRecruiterUser.id,
    })
    setLoading(false)
    router.push('/dashboard')
  }

  const togglePref = (arr: string[], val: string, set: (v: string[]) => void) => {
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val])
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-pink/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center shadow-glow-purple">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">Talent<span className="gradient-text">AI</span></span>
          </div>
          <p className="text-gray-400 text-sm">AI-powered hiring, simplified</p>
        </div>

        <AnimatePresence mode="wait">
          {/* ── SIGN IN ── */}
          {mode === 'signin' && (
            <motion.div key="signin" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
                <p className="text-gray-400 text-sm mb-6">Enter your email to sign in</p>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email" required value={siEmail}
                        onChange={(e) => setSiEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="input-field pl-10"
                      />
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}

                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-70">
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-white/5 text-center">
                  <p className="text-gray-400 text-sm">
                    Don&apos;t have an account?{' '}
                    <button onClick={() => { setMode('signup-role'); setError('') }} className="text-brand-violet hover:text-brand-pink transition-colors font-medium">
                      Sign up
                    </button>
                  </p>
                </div>

                {/* Demo hint */}
                <div className="mt-4 p-3 rounded-xl bg-brand-purple/5 border border-brand-purple/20">
                  <p className="text-xs text-gray-500 mb-1 font-medium">Demo recruiter accounts:</p>
                  {['recruiter@techflow.ai', 'recruiter@designstudio.pro'].map((e) => (
                    <button key={e} onClick={() => setSiEmail(e)} className="block text-xs text-brand-violet hover:underline">{e}</button>
                  ))}
                  <p className="text-xs text-gray-500 mt-2 mb-1 font-medium">Admin account:</p>
                  <button onClick={() => setSiEmail('admin@talentai.com')} className="block text-xs text-brand-orange hover:underline">admin@talentai.com</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── PICK ROLE ── */}
          {mode === 'signup-role' && (
            <motion.div key="role" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
                <p className="text-gray-400 text-sm mb-8">I am joining as a...</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {([
                    { role: 'applicant' as UserRole, icon: User, title: 'Job Seeker', desc: 'Browse jobs & apply' },
                    { role: 'recruiter' as UserRole, icon: Building2, title: 'Recruiter', desc: 'Post jobs & screen candidates' },
                  ]).map(({ role, icon: Icon, title, desc }) => (
                    <button
                      key={role}
                      onClick={() => { setSuRole(role); setMode(role === 'applicant' ? 'signup-applicant' : 'signup-recruiter') }}
                      className={clsx(
                        'p-5 rounded-2xl border text-left transition-all duration-200 hover:border-brand-purple/50 hover:bg-brand-purple/5',
                        'bg-dark-700/50 border-white/10'
                      )}
                    >
                      <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 text-brand-violet" />
                      </div>
                      <p className="font-semibold text-white text-sm">{title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    </button>
                  ))}
                </div>

                <button onClick={() => { setMode('signin'); setError('') }} className="w-full text-center text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  ← Back to sign in
                </button>
              </div>
            </motion.div>
          )}

          {/* ── APPLICANT SIGN UP ── */}
          {mode === 'signup-applicant' && (
            <motion.div key="signup-app" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="glass-card p-8">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-brand-purple/20 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-brand-violet" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Job Seeker Profile</h2>
                </div>
                <p className="text-gray-400 text-sm mb-6">Tell us what you&apos;re looking for</p>

                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name *</label>
                      <input type="text" required value={suName} onChange={(e) => setSuName(e.target.value)} placeholder="Jane Doe" className="input-field text-sm py-2.5" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Email *</label>
                      <input type="email" required value={suEmail} onChange={(e) => setSuEmail(e.target.value)} placeholder="jane@email.com" className="input-field text-sm py-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">
                      <Briefcase className="w-3.5 h-3.5 inline mr-1" />
                      Roles I&apos;m interested in
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {ROLE_OPTIONS.map((r) => (
                        <button key={r} type="button" onClick={() => togglePref(prefRoles, r, setPrefRoles)}
                          className={clsx('px-2.5 py-1 rounded-lg text-xs border transition-all',
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
                    <label className="block text-xs font-medium text-gray-400 mb-2">
                      <MapPin className="w-3.5 h-3.5 inline mr-1" />
                      Preferred locations
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {LOCATION_OPTIONS.map((l) => (
                        <button key={l} type="button" onClick={() => togglePref(prefLocations, l, setPrefLocations)}
                          className={clsx('px-2.5 py-1 rounded-lg text-xs border transition-all',
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
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      <Code className="w-3.5 h-3.5 inline mr-1" />
                      Your skills (comma-separated)
                    </label>
                    <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, TypeScript, Python..." className="input-field text-sm py-2.5" />
                  </div>

                  {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}

                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-70">
                    {loading
                      ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><Sparkles className="w-4 h-4" /> Create Account <ChevronRight className="w-4 h-4" /></>
                    }
                  </button>
                </form>

                <button onClick={() => { setMode('signup-role'); setError('') }} className="w-full text-center text-sm text-gray-500 hover:text-gray-300 transition-colors mt-4">
                  ← Back
                </button>
              </div>
            </motion.div>
          )}

          {/* ── RECRUITER SIGN UP ── */}
          {mode === 'signup-recruiter' && (
            <motion.div key="signup-rec" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="glass-card p-8">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-brand-orange/20 flex items-center justify-center">
                    <Building2 className="w-3.5 h-3.5 text-brand-orange" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Recruiter Profile</h2>
                </div>
                <p className="text-gray-400 text-sm mb-6">Set up your hiring account</p>

                <form onSubmit={handleRecruiterSignUp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name *</label>
                    <input type="text" required value={suName} onChange={(e) => setSuName(e.target.value)} placeholder="Alex Morgan" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Work Email *</label>
                    <input type="email" required value={suEmail} onChange={(e) => setSuEmail(e.target.value)} placeholder="alex@company.com" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Company Name *</label>
                    <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" className="input-field" />
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300">
                    <strong>Note:</strong> New recruiter accounts start with no jobs. Use the demo accounts to see the full recruiter experience.
                  </div>

                  {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}

                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-70">
                    {loading
                      ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><Building2 className="w-4 h-4" /> Create Recruiter Account <ChevronRight className="w-4 h-4" /></>
                    }
                  </button>
                </form>

                <button onClick={() => { setMode('signup-role'); setError('') }} className="w-full text-center text-sm text-gray-500 hover:text-gray-300 transition-colors mt-4">
                  ← Back
                </button>
              </div>
            </motion.div>
          )}

          {/* ── POST A JOB (after recruiter signup) ── */}
          {mode === 'post-job' && (
            <motion.div key="post-job" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="glass-card p-8">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-brand-purple/20 flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5 text-brand-violet" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Post Your First Job</h2>
                </div>
                <p className="text-gray-400 text-sm mb-6">Add a job so applicants can find and apply to it</p>

                <form onSubmit={handlePostJob} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Job Title *</label>
                    <input type="text" required value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Senior Frontend Engineer" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Description *</label>
                    <textarea required rows={3} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Describe the role, responsibilities, and what you're looking for..." className="input-field resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Required Skills * <span className="text-gray-600 font-normal">(comma-separated)</span></label>
                    <input type="text" required value={jobSkills} onChange={(e) => setJobSkills(e.target.value)} placeholder="React, TypeScript, Node.js" className="input-field" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Experience Level *</label>
                      <input type="text" required value={jobExpLevel} onChange={(e) => setJobExpLevel(e.target.value)} placeholder="3+ years" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Job Type</label>
                      <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="input-field" style={{ background: '#141428' }}>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Location</label>
                      <input type="text" value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} placeholder="Remote / New York" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Salary Range</label>
                      <input type="text" value={jobSalary} onChange={(e) => setJobSalary(e.target.value)} placeholder="$80k - $120k" className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Company Website</label>
                    <input type="url" value={jobWebsite} onChange={(e) => setJobWebsite(e.target.value)} placeholder="https://yourcompany.com" className="input-field" />
                  </div>

                  {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}

                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => router.push('/dashboard')} className="btn-secondary flex-1 flex items-center justify-center gap-2 py-3 text-sm">
                      <X className="w-4 h-4" /> Skip for now
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 disabled:opacity-70">
                      {loading
                        ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <><Plus className="w-4 h-4" /> Post Job</>
                      }
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
