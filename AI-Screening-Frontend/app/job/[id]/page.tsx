'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getJobById } from '@/lib/jobs-backend'
import { Job } from '@/lib/jobs-backend'
import { useAuthContextNew } from '@/components/AuthProviderNew'
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Clock, 
  Globe, 
  Briefcase,
  GraduationCap,
  Award,
  Building
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading } = useAuthContextNew()
  const [job, setJob] = useState<Job | null>(null)
  const [loadingJob, setLoadingJob] = useState(true)

  useEffect(() => {
    if (!params.id) return
    
    const fetchJob = async () => {
      try {
        const result = await getJobById(params.id as string)
        if ('job' in result) {
          setJob(result.job)
        }
      } catch (error) {
        console.error('Failed to fetch job:', error)
      } finally {
        setLoadingJob(false)
      }
    }

    fetchJob()
  }, [params.id])

  if (loading || loadingJob || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin" />
      </div>
    )
  }

  const handleApply = () => {
    router.push(`/apply/${job._id}`)
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/5 bg-dark-900/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </button>
            
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                job.status === 'open' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
              }`}>
                {job.status === 'open' ? 'Hiring' : 'Closed'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Job Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-4">{job.title}</h1>
                
                {/* Company Info */}
                <div className="flex items-center gap-6 text-gray-300 mb-4">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    <span className="font-medium">{job.companyName}</span>
                  </div>
                  
                  {job.companyWebsite && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      <a 
                        href={job.companyWebsite} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-brand-violet hover:text-brand-pink transition-colors"
                      >
                        {job.companyWebsite}
                      </a>
                    </div>
                  )}
                </div>

                {/* Key Details */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  
                  {job.salary && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-gray-400">
                    <Briefcase className="w-4 h-4" />
                    <span className="px-2 py-1 bg-dark-700/50 border border-white/10 rounded-lg text-xs text-gray-300 capitalize">
                      {job.employmentType}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="glass-card p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">About the Role</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          </div>

          {/* Requirements */}
          <div className="glass-card p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Requirements & Skills</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-violet" />
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-2 bg-brand-purple/10 border border-brand-purple/20 rounded-lg text-sm text-brand-violet"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Details (if available) */}
          {job.experience && (
            <div className="glass-card p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Experience Requirements</h2>
              <p className="text-gray-300">{job.experience}</p>
            </div>
          )}

          {job.education && (
            <div className="glass-card p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-brand-violet" />
                Education Requirements
              </h2>
              <p className="text-gray-300">{job.education}</p>
            </div>
          )}

          {/* Apply Button */}
          {job.status === 'open' && user?.role === 'jobseeker' && (
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApply}
                className="btn-primary text-lg py-4 px-12 flex items-center gap-3"
              >
                <Briefcase className="w-5 h-5" />
                Apply Now
              </motion.button>
            </div>
          )}

          {user?.role !== 'jobseeker' && (
            <div className="text-center">
              <p className="text-gray-400">
                {user ? 'Only job seekers can apply for positions.' : 'Please sign in as a job seeker to apply.'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
