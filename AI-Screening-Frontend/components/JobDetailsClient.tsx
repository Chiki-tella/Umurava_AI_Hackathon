'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft, MapPin, DollarSign, Clock, Briefcase,
  Star, Award, CheckCircle2, ChevronRight, Globe
} from 'lucide-react'
import { Job } from '@/lib/mockData'
import { clsx } from 'clsx'

interface JobDetailsClientProps {
  job: Job
}

const companyColors: Record<string, string> = {
  'TechFlow AI': 'from-brand-purple to-brand-violet',
  'DesignStudio Pro': 'from-brand-pink to-rose-500',
  'CloudNative Inc': 'from-blue-500 to-cyan-500',
  'Analytics Labs': 'from-amber-500 to-orange-500',
  'Infrastructure Co': 'from-slate-500 to-gray-600',
  'MobileFirst Labs': 'from-emerald-500 to-teal-500',
}

export function JobDetailsClient({ job }: JobDetailsClientProps) {
  const router = useRouter()
  const gradient = companyColors[job.company] || 'from-brand-purple to-brand-violet'
  const initials = job.company.split(' ').map((w) => w[0]).join('').slice(0, 2)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Jobs
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-300">{job.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <div className="glass-card p-8 relative overflow-hidden">
              <div className={clsx(
                'absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 bg-gradient-to-br',
                gradient
              )} />

              <div className="relative z-10">
                <div className="flex items-start gap-5 mb-6">
                  <div className={clsx(
                    'w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0',
                    gradient
                  )}>
                    {initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-bold text-white mb-1">{job.title}</h1>
                        <p className="text-gray-400 text-lg">{job.company}</p>
                      </div>
                      <span className={clsx(
                        'badge flex-shrink-0',
                        job.status === 'open' ? 'badge-success' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      )}>
                        <span className={clsx(
                          'inline-block w-1.5 h-1.5 rounded-full mr-1.5',
                          job.status === 'open' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'
                        )} />
                        {job.status === 'open' ? 'Actively Hiring' : 'Closed'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { icon: MapPin, value: job.location || 'Remote', label: 'Location' },
                    { icon: DollarSign, value: job.salary || 'Competitive', label: 'Salary' },
                    { icon: Clock, value: new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), label: 'Deadline' },
                    ...(job.websiteUrl ? [{ icon: Globe, value: 'Visit Website', label: 'Company', isLink: true, url: job.websiteUrl }] : []),
                  ].map(({ icon: Icon, value, label, isLink, url }) => (
                    <div key={label} className="bg-dark-700/50 rounded-xl p-3 border border-white/5">
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </div>
                      {isLink ? (
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-brand-violet text-sm font-medium hover:text-brand-pink transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-white text-sm font-medium">{value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-brand-purple/10 border border-brand-purple/20">
                  <Briefcase className="w-5 h-5 text-brand-violet" />
                </div>
                <h2 className="text-xl font-semibold text-white">About the Role</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">{job.description}</p>
            </div>

            {/* Required Skills */}
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-brand-pink/10 border border-brand-pink/20">
                  <Star className="w-5 h-5 text-brand-pink" />
                </div>
                <h2 className="text-xl font-semibold text-white">Required Skills</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {job.requiredSkills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-violet text-sm font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-brand-orange/10 border border-brand-orange/20">
                  <Award className="w-5 h-5 text-brand-orange" />
                </div>
                <h2 className="text-xl font-semibold text-white">Experience Level</h2>
              </div>
              <p className="text-gray-300">{job.experienceLevel} of relevant experience required</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply card */}
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-2">Ready to apply?</h3>
              <p className="text-gray-400 text-sm mb-6">
                Your application will be reviewed by our AI screening system within seconds.
              </p>

              {job.status === 'open' ? (
                <button
                  onClick={() => router.push(`/apply/${job.id}`)}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3.5"
                >
                  Apply Now
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="w-full py-3.5 rounded-xl bg-gray-500/10 border border-gray-500/20 text-gray-500 text-center text-sm font-medium">
                  Applications Closed
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Job Type</span>
                  <span className="text-gray-300">{job.type || 'Full-time'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Start Date</span>
                  <span className="text-gray-300">{new Date(job.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Experience</span>
                  <span className="text-gray-300">{job.experienceLevel}</span>
                </div>
              </div>
            </div>

            {/* AI screening note */}
            <div className="glass-card p-5 border-brand-purple/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex-shrink-0">
                  <Star className="w-4 h-4 text-brand-violet" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-1">AI-Powered Review</p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Applications are instantly analyzed by our AI for skills match, experience alignment, and cultural fit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
