'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Clock, ArrowRight, DollarSign, Globe, Building } from 'lucide-react'
import { Job } from '@/lib/jobs-backend'
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
  // Use company name from backend job data
  const companyName = job.companyName || 'Company'
  const gradient = companyColors[companyName] || 'from-brand-purple to-brand-violet'
  const initials = companyName.split(' ').map((w) => w[0]).join('').slice(0, 2)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/job/${job._id}`} className="group block h-full">
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

          {/* Company Info - Prominent at top */}
          <div className="relative z-10 flex-1">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-brand-violet" />
                <span className="text-brand-violet font-medium">{job.companyName}</span>
              </div>
              {job.companyWebsite && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(job.companyWebsite, '_blank', 'noopener,noreferrer')
                  }}
                  className="text-xs text-gray-400 hover:text-brand-violet transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer"
                >
                  <Globe className="w-3 h-3" />
                  Website
                </button>
              )}
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-purple transition-colors">
              {job.title}
            </h3>

            {/* Location - Very prominent */}
            <div className="flex items-center text-gray-300 text-sm font-medium mb-3">
              <MapPin className="w-4 h-4 mr-1.5 text-brand-violet" />
              {job.location}
            </div>
            
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
              {job.description}
            </p>

            {/* Salary and Employment Type */}
            <div className="flex items-center justify-between mb-4">
              {job.salary && (
                <div className="flex items-center text-gray-400 text-sm">
                  <DollarSign className="w-4 h-4 mr-1.5" />
                  {job.salary}
                </div>
              )}
              <div className="flex items-center text-gray-400 text-sm">
                <span className="px-2 py-1 bg-dark-700/50 border border-white/10 rounded-lg text-xs text-gray-300 capitalize">
                  {job.employmentType}
                </span>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {job.requiredSkills.slice(0, 3).map((skill, idx) => (
                <span key={skill} className="px-2 py-1 bg-dark-700/50 border border-white/10 rounded-lg text-xs text-gray-300">
                  {skill}
                </span>
              ))}
              {job.requiredSkills.length > 3 && (
                <span className="px-2 py-1 bg-gray-500/10 text-gray-400 text-xs rounded-full border border-gray-500/20">
                  +{job.requiredSkills.length - 3} more
                </span>
              )}
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center text-gray-500 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center text-brand-violet group-hover:text-brand-pink transition-colors text-sm font-medium">
                View Details <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
