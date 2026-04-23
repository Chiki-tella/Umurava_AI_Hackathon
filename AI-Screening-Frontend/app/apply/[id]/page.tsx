'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getJobById } from '@/lib/jobs-backend'
import { Job } from '@/lib/jobs-backend'
import { useAuthContextNew } from '@/components/AuthProviderNew'
import { 
  ArrowLeft, 
  Building, 
  MapPin, 
  DollarSign, 
  Briefcase,
  Upload,
  FileText,
  User,
  Mail,
  Phone,
  GraduationCap,
  Award
} from 'lucide-react'
import { motion } from 'framer-motion'

interface ApplicationData {
  fullName: string
  email: string
  phone: string
  education: string
  experience: string
  coverLetter: string
  resume: File | null
}

export default function ApplyPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading } = useAuthContextNew()
  const [job, setJob] = useState<Job | null>(null)
  const [loadingJob, setLoadingJob] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<ApplicationData>({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    coverLetter: '',
    resume: null
  })

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

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || ''
      }))
    }
  }, [user])

  if (loading || loadingJob || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin" />
      </div>
    )
  }

  if (user?.role !== 'jobseeker') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">Only job seekers can apply for positions.</p>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, resume: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Create form data for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('jobId', job._id)
      formDataToSend.append('fullName', formData.fullName)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('education', formData.education)
      formDataToSend.append('experience', formData.experience)
      formDataToSend.append('coverLetter', formData.coverLetter)
      
      if (formData.resume) {
        formDataToSend.append('resume', formData.resume)
      }

      // Make API call to submit application
      console.log('🚀 Submitting application:', {
        jobId: job._id,
        ...formData,
        resumeFile: formData.resume?.name
      })

      try {
        const { applyToJob } = await import('@/lib/applications-backend')
        const result = await applyToJob({
          jobId: job._id,
          cvUrl: formData.resume?.name
        })

        if ('application' in result) {
          console.log('✅ Application submitted successfully!')
          alert('Application submitted successfully!')
          router.push('/jobs')
        } else if ('error' in result) {
          console.error('❌ Application failed:', result.error)
          alert(`Application failed: ${result.error}`)
        }
      } catch (error: any) {
        console.error('❌ Application error:', error)
        alert(`Application failed: ${error.message || 'Unknown error'}`)
      }
      
    } catch (error) {
      console.error('Failed to submit application:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setSubmitting(false)
    }
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
              Back to Job Details
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold text-white mb-4">{job.title}</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Building className="w-4 h-4 text-brand-violet" />
                  {job.companyName}
                </div>
                
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-4 h-4 text-brand-violet" />
                  {job.location}
                </div>
                
                {job.salary && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <DollarSign className="w-4 h-4 text-brand-violet" />
                    {job.salary}
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-gray-300">
                  <Briefcase className="w-4 h-4 text-brand-violet" />
                  <span className="capitalize">{job.employmentType}</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-white mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.slice(0, 4).map((skill, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-brand-purple/10 border border-brand-purple/20 rounded text-xs text-brand-violet"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills.length > 4 && (
                    <span className="px-2 py-1 bg-gray-500/10 text-gray-400 text-xs rounded border border-gray-500/20">
                      +{job.requiredSkills.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass-card p-8">
                <h1 className="text-3xl font-bold text-white mb-2">Apply for this Position</h1>
                <p className="text-gray-400 mb-8">Fill out the form below to submit your application</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-brand-violet" />
                      Personal Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-brand-purple focus:outline-none transition-colors"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-brand-purple focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-brand-purple focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-brand-violet" />
                      Education
                    </h2>
                    <textarea
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Tell us about your educational background..."
                      className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-brand-purple focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-brand-violet" />
                      Work Experience
                    </h2>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Describe your relevant work experience..."
                      className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-brand-purple focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-brand-violet" />
                      Cover Letter
                    </h2>
                    <textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Why are you interested in this position and why would you be a good fit?"
                      className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-brand-purple focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-brand-violet" />
                      Resume/CV
                    </h2>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-brand-purple/50 transition-colors">
                      <input
                        type="file"
                        id="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="resume"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-gray-300">
                          {formData.resume ? formData.resume.name : 'Click to upload your resume'}
                        </span>
                        <span className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="px-6 py-3 bg-dark-700 border border-white/10 text-gray-300 rounded-lg hover:bg-dark-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary px-8 py-3 flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Briefcase className="w-4 h-4" />
                          Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
