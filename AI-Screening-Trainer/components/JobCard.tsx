'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Clock, ArrowRight, DollarSign, Globe } from 'lucide-react'
import { Job } from '@/lib/mockData'
import { clsx } from 'clsx'

interface JobCardProps {
  job: Job
  index: number
  highlighted?: boolean
}

const companyColors: Record<string, string> = {
  'TechFlow AI': 'from-brand-purple to-brand-violet',
  'DesignStudio Pro': 'from-brand-pink to-rose-500',
  'CloudNative Inc': 'from-blue-500 to-cyan-500',
  'Analytics Labs': 'from-amber-500 to-orange-500',
  'Infrastructure Co': 'from-slate-500 to-gray-600',
  'MobileFirst Labs': 'from-emerald-500 to-teal-500',
}

export function JobCard({ job, index, highlighted }: JobCardProps) {
  const gradient = companyColors[job.company] || 'from-brand-purple to-brand-violet'
  const initials = job.company.split(' ').map((w) => w[0]).join('').slice(0, 2)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/job/${job.id}`} className="group block h-full">
        <div className={clsx(
            'relative h-full glass-card p-6 flex flex-col overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-card-hover hover:-translate-y-1',
            highlighted && 'border-brand-purple/30 shadow-glow-purple'
          )}>
          {/* Background glow */}
          <div className={clsx(
            'absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br',
            gradient
          )} />

          {/* Top row */}
          <div className="flex items-start justify-between mb-5 relative z-10">
            <div className={clsx(
              'w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm shadow-lg',
              gradient
            )}>
              {initials}
            </div>

            <span className={clsx(
              'badge',
              job.status === 'open'
                ? 'badge-success'
                : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
            )}>
              <span className={clsx(
                'inline-block w-1.5 h-1.5 rounded-full mr-1.5',
                job.status === 'open' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'
              )} />
              {job.status === 'open' ? 'Hiring' : 'Closed'}
            </span>
          </div>

          {/* Job info */}
          <div className="relative z-10 flex-1">
            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-brand-violet transition-colors">
              {job.title}
            </h3>
            <p className="text-gray-400 text-sm mb-4">{job.company}</p>

            {/* Meta */}
            <div className="space-y-2 mb-5">
              {job.location && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{job.location}</span>
                </div>
              )}
              {job.salary && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{job.salary}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Deadline: {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              {job.websiteUrl && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                  <a 
                    href={job.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={(e) => e.stopPropagation()}
                    className="hover:text-brand-violet transition-colors underline"
                  >
                    Company Website
                  </a>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {job.requiredSkills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-brand-purple/10 text-brand-violet border border-brand-purple/20 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
              {job.requiredSkills.length > 3 && (
                <span className="px-2.5 py-1 rounded-lg bg-white/5 text-gray-400 border border-white/10 text-xs">
                  +{job.requiredSkills.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-gray-500">{job.experienceLevel}</span>
            <div className="flex items-center gap-1.5 text-brand-violet text-sm font-medium group-hover:gap-2.5 transition-all">
              <span>View Role</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
