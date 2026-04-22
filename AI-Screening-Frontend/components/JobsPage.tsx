'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getJobs } from '@/lib/jobs-backend'
import { JobCard } from '@/components/JobCard'
import { useAuthContextNew } from '@/components/AuthProviderNew'
import { Sparkles, Briefcase, Filter } from 'lucide-react'
import { motion } from 'framer-motion'

export function JobsPage() {
  const { user, loading } = useAuthContextNew()
  const router = useRouter()

  const [allJobs, setAllJobs] = useState<any[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || loading) return
    if (!user) { router.replace('/auth'); return }
    if (user.role === 'recruiter') { router.replace('/dashboard'); return }
    
    // Fetch jobs from backend
    const fetchJobs = async () => {
      setLoadingJobs(true)
      try {
        console.log('🔍 Fetching jobs from backend...')
        const result = await getJobs()
        console.log('📡 Jobs API response:', result)
        
        if ('jobs' in result) {
          console.log('✅ Successfully fetched jobs:', result.jobs.length, 'jobs found')
          setAllJobs(result.jobs)
        } else if ('error' in result) {
          console.log('❌ Jobs API returned error:', result.error)
        } else {
          console.log('❓ Unexpected jobs API response:', result)
        }
      } catch (error) {
        console.error('💥 Failed to fetch jobs:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          response: error && typeof error === 'object' && 'response' in error ? (error as any).response?.data : undefined,
          status: error && typeof error === 'object' && 'response' in error ? (error as any).response?.status : undefined,
          config: error && typeof error === 'object' && 'config' in error ? (error as any).config : undefined
        })
      } finally {
        setLoadingJobs(false)
      }
    }
    
    fetchJobs()
  }, [mounted, user, loading, router])

  if (loading || !user || loadingJobs) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin" />
      </div>
    )
  }

  const openJobs = allJobs.filter((j) => j.status === 'open')
  const closedJobs = allJobs.filter((j) => j.status === 'closed')

  const hasPrefs =
    (user.interestedRoles && user.interestedRoles.length > 0) ||
    (user.preferredLocations && user.preferredLocations.length > 0) ||
    (user.skills && user.skills.length > 0)

  const matchedJobs = hasPrefs
    ? openJobs.filter((j) => {
        const roleMatch = !user.interestedRoles?.length ||
          user.interestedRoles.some((r) => j.title.toLowerCase().includes(r.toLowerCase()))
        const locationMatch = !user.preferredLocations?.length ||
          user.preferredLocations.some((l) => j.location?.toLowerCase().includes(l.toLowerCase()))
        const skillMatch = !user.skills?.length ||
          user.skills.some((s) =>
            j.requiredSkills.some((r: string) =>
              r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase())
            )
          )
        return roleMatch || locationMatch || skillMatch
      })
    : []

  const matchedIds = new Set(matchedJobs.map((j) => j.id))
  const otherJobs = openJobs.filter((j) => !matchedIds.has(j.id))
  const showSplit = hasPrefs && matchedJobs.length > 0

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="relative border-b border-white/5 bg-dark-800/20 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-40 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-brand-violet text-sm font-medium mb-3">
                <Sparkles className="w-4 h-4" />
                Welcome back, {user.fullName.split(' ')[0]}
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Your Job Feed</h1>
              <p className="text-gray-400">
                {openJobs.length} open positions
                {showSplit ? ` · ${matchedJobs.length} matched to your profile` : ' · Set your preferences to get personalised matches'}
              </p>
            </div>
            <button
              onClick={() => router.push('/profile')}
              className="btn-secondary flex items-center gap-2 text-sm flex-shrink-0"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Edit Preferences</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* Matched jobs */}
        {showSplit && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-brand-purple/10 border border-brand-purple/20">
                <Sparkles className="w-5 h-5 text-brand-violet" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Recommended for You</h2>
                <p className="text-sm text-gray-500">
                  {matchedJobs.length} role{matchedJobs.length !== 1 ? 's' : ''} matching your skills & preferences
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedJobs.map((job, index) => (
                <JobCard key={job.id} job={job} index={index} highlighted />
              ))}
            </div>
          </section>
        )}

        {/* All / remaining open jobs */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-dark-700/50 border border-white/10">
              <Briefcase className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {showSplit ? 'All Other Open Positions' : 'All Open Positions'}
              </h2>
              <p className="text-sm text-gray-500">
                {showSplit ? otherJobs.length : openJobs.length} role{(showSplit ? otherJobs : openJobs).length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>

          {(showSplit ? otherJobs : openJobs).length === 0 ? (
            <p className="text-gray-500 text-sm">All open positions are already shown above.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(showSplit ? otherJobs : openJobs).map((job, index) => (
                <JobCard key={job._id || job.id} job={job} index={index} />
              ))}
            </div>
          )}
        </section>

        {/* No prefs nudge */}
        {!hasPrefs && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 flex items-center gap-5 border-brand-purple/20"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-brand-violet" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium mb-0.5">Get personalised job matches</p>
              <p className="text-sm text-gray-400">Add your skills and preferred roles to see the best matches at the top.</p>
            </div>
            <button onClick={() => router.push('/profile')} className="btn-primary text-sm py-2 px-5 flex-shrink-0">
              Set Preferences
            </button>
          </motion.div>
        )}

        {/* Closed jobs */}
        {closedJobs.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-600">Closed Positions</h2>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50">
              {closedJobs.map((job, index) => (
                <JobCard key={job.id} job={job} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
