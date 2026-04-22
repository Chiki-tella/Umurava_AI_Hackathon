'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy, TrendingUp, AlertCircle, Sparkles, Brain,
  Users, Target, ChevronDown, ChevronUp, Star, Zap,
  BarChart3, CheckCircle2, XCircle, Clock, Briefcase,
  Mail, Send, UserCheck
} from 'lucide-react'
import { getRecruiterJobs, createJob } from '@/lib/jobs-backend'
import { useAuthContextNew } from '@/components/AuthProviderNew'
import { clsx } from 'clsx'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const MEDAL_COLORS = [
  { bg: 'from-yellow-400 to-amber-500', text: 'text-yellow-400', shadow: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]', label: '1st' },
  { bg: 'from-gray-300 to-gray-400', text: 'text-gray-300', shadow: 'shadow-[0_0_20px_rgba(209,213,219,0.2)]', label: '2nd' },
  { bg: 'from-amber-600 to-orange-700', text: 'text-amber-600', shadow: 'shadow-[0_0_20px_rgba(217,119,6,0.3)]', label: '3rd' },
]

function getScoreConfig(score: number) {
  if (score >= 90) return { color: 'text-emerald-400', bg: 'bg-emerald-500', badge: 'badge-success', label: 'Excellent' }
  if (score >= 75) return { color: 'text-amber-400', bg: 'bg-amber-500', badge: 'badge-warning', label: 'Good' }
  return { color: 'text-red-400', bg: 'bg-red-500', badge: 'badge-danger', label: 'Below Average' }
}

function CandidateCard({ app, index, isExpanded, onToggle, requiredSkills, onSelect, onNotify, onAccept, onReject, onDelete }: {
  app: Application
  index: number
  isExpanded: boolean
  onToggle: () => void
  requiredSkills: string[]
  onSelect: (id: string) => void
  onNotify: (id: string) => void
  onAccept: (id: string) => void
  onReject: (id: string) => void
  onDelete: (id: string) => void
}) {
  const score = getScoreConfig(app.matchScore ?? 0)
  const medal = MEDAL_COLORS[index]

  const radarData = [
    { subject: 'Skills', value: Math.min(100, (app.matchScore ?? 0)) },
    { subject: 'Experience', value: Math.min(100, (app.matchScore ?? 0) - 5 + (app.experience.length > 200 ? 8 : 0)) },
    { subject: 'Education', value: Math.min(100, (app.matchScore ?? 0) - 8 + (app.education.length > 20 ? 10 : 0)) },
    { subject: 'Culture Fit', value: Math.min(100, (app.matchScore ?? 0) + 3) },
    { subject: 'Potential', value: Math.min(100, (app.matchScore ?? 0) - 2) },
  ].map(d => ({ ...d, value: Math.max(0, Math.round(d.value)) }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={clsx(
        'glass-card overflow-hidden transition-all duration-300',
        index < 3 && 'border-white/15',
        isExpanded && 'border-brand-purple/30'
      )}
    >
      {index < 3 && <div className={clsx('h-1 w-full bg-gradient-to-r', medal.bg)} />}

      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Rank */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            {index < 3 ? (
              <div className={clsx('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm', medal.bg, medal.shadow)}>
                <Trophy className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-dark-700/50 border border-white/10 flex items-center justify-center text-gray-400 font-bold text-lg">
                {index + 1}
              </div>
            )}
            {index < 3 && <span className={clsx('text-xs font-bold', medal.text)}>{medal.label}</span>}
          </div>

          {/* Avatar */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {app.applicantName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-1">
              <div>
                <h3 className="text-lg font-semibold text-white">{app.applicantName}</h3>
                <p className="text-sm text-gray-400">{app.applicantEmail}</p>
              </div>
              <span className={clsx('badge flex-shrink-0', score.badge)}>{score.label}</span>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-500">AI Match Score</span>
                <span className={clsx('text-2xl font-bold', score.color)}>{app.matchScore}%</span>
              </div>
              <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${app.matchScore}%` }}
                  transition={{ duration: 1, delay: index * 0.06 + 0.3, ease: 'easeOut' }}
                  className={clsx('h-full rounded-full', score.bg)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Strengths / Gaps */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-gray-300">Strengths</span>
            </div>
            <ul className="space-y-1">
              {(app.strengths ?? []).slice(0, 2).map((s, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-gray-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />{s}
                </li>
              ))}
            </ul>
          </div>
          {(app.gaps ?? []).length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-medium text-gray-300">Gaps</span>
              </div>
              <ul className="space-y-1">
                {(app.gaps ?? []).slice(0, 2).map((g, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-400">
                    <XCircle className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />{g}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* AI Recommendation */}
        <div className={clsx('mt-4 p-3 rounded-xl border text-xs leading-relaxed',
          score.badge === 'badge-success' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
          : score.badge === 'badge-warning' ? 'bg-amber-500/5 border-amber-500/20 text-amber-300'
          : 'bg-red-500/5 border-red-500/20 text-red-300'
        )}>
          <span className="font-medium">AI: </span>{app.recommendation}
        </div>

        {/* Expand toggle */}
        <button onClick={onToggle} className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-sm text-gray-400 hover:text-white transition-all">
          {isExpanded ? <>Hide Details <ChevronUp className="w-4 h-4" /></> : <>View Full Profile <ChevronDown className="w-4 h-4" /></>}
        </button>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {/* Status-based actions */}
          {app.status === 'submitted' || app.status === 'screened' ? (
            <button
              onClick={() => onSelect(app.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-purple/10 border border-brand-purple/20 hover:bg-brand-purple/20 text-sm text-brand-violet font-medium transition-all"
            >
              <UserCheck className="w-4 h-4" />
              Select for Interview
            </button>
          ) : app.status === 'selected' ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Selected</span>
            </div>
          ) : app.status === 'accepted' ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400 font-medium">Accepted</span>
            </div>
          ) : app.status === 'rejected' ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400 font-medium">Rejected</span>
            </div>
          ) : app.status === 'deleted' ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-500/10 border border-gray-500/20">
              <AlertCircle className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400 font-medium">Deleted</span>
            </div>
          ) : null}
          
          {/* Notification button */}
          {app.status === 'selected' && !app.notified && (
            <button
              onClick={() => onNotify(app.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-sm text-emerald-400 font-medium transition-all"
            >
              <Send className="w-4 h-4" />
              Send Interview Invite
            </button>
          )}
          
          {app.notified && app.status !== 'deleted' && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Mail className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">Notified</span>
            </div>
          )}
          
          {/* Accept/Reject buttons for selected candidates */}
          {app.status === 'selected' && app.notified && (
            <>
              <button
                onClick={() => onAccept(app.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-sm text-green-400 font-medium transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                Accept
              </button>
              <button
                onClick={() => onReject(app.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-sm text-red-400 font-medium transition-all"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </>
          )}
          
          {/* Delete button for non-accepted candidates */}
          {app.status !== 'accepted' && app.status !== 'deleted' && (
            <button
              onClick={() => onDelete(app.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-500/10 border border-gray-500/20 hover:bg-gray-500/20 text-sm text-gray-400 font-medium transition-all"
            >
              <AlertCircle className="w-4 h-4" />
              Remove
            </button>
          )}
          
          {/* Expand/Collapse button */}
          <button 
            onClick={onToggle} 
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-sm text-gray-400 hover:text-white transition-all min-w-0"
          >
            {isExpanded ? <>Hide Details <ChevronUp className="w-4 h-4" /></> : <>View Full Profile <ChevronDown className="w-4 h-4" /></>}
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="pt-5 mt-5 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-gray-400 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {app.skills.map((skill) => (
                        <span key={skill} className={clsx(
                          'px-2.5 py-1 rounded-lg text-xs border',
                          requiredSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-brand-purple/10 text-brand-violet border-brand-purple/20'
                        )}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 mb-1">Experience</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{app.experience}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 mb-1">Education</p>
                    <p className="text-sm text-gray-300">{app.education}</p>
                  </div>
                  {app.portfolio && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-1">Portfolio</p>
                      <a href={app.portfolio} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-violet hover:underline">{app.portfolio}</a>
                    </div>
                  )}
                  {app.resumeFileName && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-1">Resume/CV</p>
                      <p className="text-sm text-gray-300">{app.resumeFileName}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-600">Applied {new Date(app.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-3">AI Assessment Breakdown</p>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                        <Radar name="Score" dataKey="value" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.2} strokeWidth={2} />
                        <Tooltip contentStyle={{ background: '#141428', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} formatter={(v: number) => [`${v}%`, 'Score']} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export function RecruiterDashboard() {
  const { user, loading: authLoading } = useAuthContextNew()
  const router = useRouter()

  const [selectedJobId, setSelectedJobId] = useState('')
  const [applications, setApplications] = useState<Application[]>([])
  const [isScreening, setIsScreening] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [screeningProgress, setScreeningProgress] = useState(0)

  const [allJobs, setAllJobs] = useState<any[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)

  // Load recruiter's jobs from backend
  useEffect(() => {
    if (authLoading) return
    if (!user) { router.replace('/auth'); return }
    if (user.role !== 'recruiter') { router.replace('/'); return }
    
    const fetchJobs = async () => {
      try {
        const result = await getRecruiterJobs()
        if ('jobs' in result) {
          setAllJobs(result.jobs)
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
      } finally {
        setLoadingJobs(false)
      }
    }
    
    fetchJobs()
  }, [user, authLoading, router])

  // Recruiter's jobs from backend
  const myJobs = allJobs

  useEffect(() => {
    if (myJobs.length > 0 && !selectedJobId) {
      setSelectedJobId(myJobs[0]._id)
    }
  }, [myJobs, selectedJobId])

  useEffect(() => {
    if (selectedJobId) {
      // TODO: Replace with backend application fetching
      // setApplications(getApplicationsForJob(selectedJobId))
      setApplications([])
      setShowResults(false)
    }
  }, [selectedJobId])

  const selectedJob = allJobs.find((j) => j._id === selectedJobId)

  const handleScreening = async () => {
    if (!selectedJob) return
    setIsScreening(true)
    setShowResults(false)
    setScreeningProgress(0)

    const interval = setInterval(() => {
      setScreeningProgress((p) => {
        if (p >= 95) { clearInterval(interval); return p }
        return p + Math.random() * 15
      })
    }, 200)

    await new Promise((r) => setTimeout(r, 2800))
    clearInterval(interval)
    setScreeningProgress(100)

    // Score all applications
    const results = applications.map((app) => ({
      id: app.id,
      ...scoreApplication(app, selectedJob.requiredSkills),
    }))
    saveScreeningResults(selectedJobId, results)

    // Reload with scores
    const scored = getApplicationsForJob(selectedJobId)
      .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
    setApplications(scored)

    await new Promise((r) => setTimeout(r, 300))
    setIsScreening(false)
    setShowResults(true)
  }

  const handleSelectCandidate = (applicationId: string) => {
    selectCandidate(applicationId)
    // Reload applications to update UI
    const updated = getApplicationsForJob(selectedJobId)
      .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
    setApplications(updated)
  }

  const handleNotifyCandidate = (applicationId: string) => {
    const result = notifySelectedCandidate(applicationId)
    if (result.success) {
      alert(result.message)
      // Reload applications to update UI
      const updated = getApplicationsForJob(selectedJobId)
        .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
      setApplications(updated)
    } else {
      alert(result.message)
    }
  }

  const handleAcceptCandidate = (applicationId: string) => {
    const result = acceptCandidate(applicationId)
    if (result.success) {
      alert(result.message)
      // Reload applications to update UI
      const updated = getApplicationsForJob(selectedJobId)
        .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
      setApplications(updated)
    } else {
      alert(result.message)
    }
  }

  const handleRejectCandidate = (applicationId: string) => {
    if (confirm('Are you sure you want to reject this candidate? They will receive a rejection notification.')) {
      const result = rejectCandidate(applicationId)
      if (result.success) {
        alert(result.message)
        // Reload applications to update UI
        const updated = getApplicationsForJob(selectedJobId)
          .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
        setApplications(updated)
      } else {
        alert(result.message)
      }
    }
  }

  const handleDeleteApplication = (applicationId: string) => {
    if (confirm('Are you sure you want to remove this application? This cannot be undone and no notification will be sent.')) {
      const result = deleteApplication(applicationId)
      if (result.success) {
        alert(result.message)
        // Reload applications to update UI
        const updated = getApplicationsForJob(selectedJobId)
          .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
        setApplications(updated)
      } else {
        alert(result.message)
      }
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin" />
      </div>
    )
  }

  const avgScore = applications.length
    ? Math.round(applications.reduce((a, c) => a + (c.matchScore ?? 0), 0) / applications.length)
    : 0
  const topScore = applications[0]?.matchScore ?? 0
  const strongCandidates = applications.filter((c) => (c.matchScore ?? 0) >= 90).length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-violet shadow-glow-purple">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">AI Screening Dashboard</h1>
              <p className="text-gray-400 mt-0.5">
                {user.companyName ? `${user.companyName} · ` : ''}Recruiter: {user.fullName}
              </p>
            </div>
          </div>
          {myJobs.length > 0 && (
            <Link href="/post-job" className="btn-primary flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Post New Job
            </Link>
          )}
        </div>
      </motion.div>

      {/* No jobs state */}
      {myJobs.length === 0 && (
        <div className="glass-card p-16 text-center">
          <div className="w-16 h-16 rounded-3xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center mx-auto mb-5">
            <Briefcase className="w-8 h-8 text-brand-violet" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No Jobs Posted Yet</h3>
          <p className="text-gray-400 max-w-sm mx-auto mb-6">
            Start by posting your first job to begin receiving applications from qualified candidates.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/post-job" className="btn-primary inline-flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Post Your First Job
            </Link>
            <Link href="/auth" className="btn-secondary inline-flex items-center gap-2">
              Switch Account
            </Link>
          </div>
        </div>
      )}

      {myJobs.length > 0 && (
        <>
          {/* Control panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="glass-card p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Your Job Position</label>
                <select
                  value={selectedJobId}
                  onChange={(e) => { setSelectedJobId(e.target.value); setShowResults(false) }}
                  className="input-field max-w-sm"
                >
                  {myJobs.map((job) => (
                    <option key={job.id} value={job.id} style={{ background: '#141428' }}>
                      {job.title} — {job.company}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-700/50 border border-white/5 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  {applications.length} applicant{applications.length !== 1 ? 's' : ''}
                </div>
                <button
                  onClick={handleScreening}
                  disabled={isScreening || applications.length === 0}
                  className="btn-primary flex items-center gap-2 py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isScreening ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" />Run AI Screening</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Screening animation */}
          <AnimatePresence>
            {isScreening && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card p-16 text-center mb-8">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full border-4 border-brand-purple/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-brand-purple animate-spin" />
                  <div className="absolute inset-3 rounded-full border-4 border-t-brand-pink animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-brand-violet" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">AI is Analyzing {applications.length} Candidates</h2>
                <p className="text-gray-400 mb-8">Evaluating skills, experience, and fit for {selectedJob?.title}...</p>
                <div className="max-w-sm mx-auto">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-brand-violet font-medium">{Math.round(screeningProgress)}%</span>
                  </div>
                  <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-brand-purple to-brand-pink rounded-full" style={{ width: `${screeningProgress}%` }} />
                  </div>
                  <div className="mt-4 space-y-2">
                    {[
                      { label: 'Parsing applications', done: screeningProgress > 20 },
                      { label: 'Matching skills', done: screeningProgress > 45 },
                      { label: 'Scoring candidates', done: screeningProgress > 70 },
                      { label: 'Generating insights', done: screeningProgress > 90 },
                    ].map(({ label, done }) => (
                      <div key={label} className="flex items-center gap-2 text-sm">
                        {done ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <Clock className="w-4 h-4 text-gray-600 flex-shrink-0" />}
                        <span className={done ? 'text-gray-300' : 'text-gray-600'}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {showResults && !isScreening && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {/* Summary stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { icon: Users, label: 'Total Screened', value: applications.length, color: 'text-brand-violet', bg: 'bg-brand-purple/10 border-brand-purple/20' },
                    { icon: Target, label: 'Avg Match Score', value: `${avgScore}%`, color: 'text-brand-pink', bg: 'bg-brand-pink/10 border-brand-pink/20' },
                    { icon: Star, label: 'Top Score', value: `${topScore}%`, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                    { icon: Zap, label: 'Strong Matches', value: strongCandidates, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                  ].map(({ icon: Icon, label, value, color, bg }) => (
                    <motion.div key={label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={clsx('glass-card p-5 border', bg)}>
                      <div className={clsx('p-2 rounded-xl w-fit mb-3', bg)}><Icon className={clsx('w-5 h-5', color)} /></div>
                      <p className="text-2xl font-bold text-white">{value}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-brand-purple/10 border border-brand-purple/20">
                    <BarChart3 className="w-5 h-5 text-brand-violet" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Ranked Candidates</h2>
                  <span className="badge badge-info">{applications.length} results</span>
                </div>

                <div className="space-y-4">
                  {applications.map((app, index) => (
                    <CandidateCard
                      key={app.id}
                      app={app}
                      index={index}
                      isExpanded={expandedId === app.id}
                      onToggle={() => setExpandedId(expandedId === app.id ? null : app.id)}
                      requiredSkills={selectedJob?.requiredSkills ?? []}
                      onSelect={handleSelectCandidate}
                      onNotify={handleNotifyCandidate}
                      onAccept={handleAcceptCandidate}
                      onReject={handleRejectCandidate}
                      onDelete={handleDeleteApplication}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty / no applications */}
          {!isScreening && !showResults && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-20 text-center">
              <div className="w-20 h-20 rounded-3xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-brand-violet" />
              </div>
              {applications.length === 0 ? (
                <>
                  <h3 className="text-2xl font-bold text-white mb-3">No Applications Yet</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    No one has applied to <span className="text-white">{selectedJob?.title}</span> yet. Share the job link to start receiving applications.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white mb-3">Ready to Screen {applications.length} Candidates</h3>
                  <p className="text-gray-400 max-w-md mx-auto mb-8">
                    Click &quot;Run AI Screening&quot; to instantly analyze and rank all applicants for {selectedJob?.title}.
                  </p>
                  <button onClick={handleScreening} className="btn-primary flex items-center gap-2 mx-auto">
                    <Sparkles className="w-4 h-4" />Start AI Screening
                  </button>
                </>
              )}
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
