'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContextNew } from '@/components/AuthProviderNew'
import { createJob } from '@/lib/jobs-backend'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  Globe,
  Users,
  GraduationCap,
  Award,
  FileText,
  Plus,
  X
} from 'lucide-react'

interface JobFormData {
  title: string
  description: string
  requiredSkills: string[]
  location: string
  companyName: string
  companyWebsite: string
  salary: string
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote'
  experience: string
  education: string
}

export default function PostJobPage() {
  const router = useRouter()
  const { user, loading } = useAuthContextNew()
  const [submitting, setSubmitting] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    requiredSkills: [],
    location: '',
    companyName: '',
    companyWebsite: '',
    salary: '',
    employmentType: 'full-time',
    experience: '',
    education: ''
  })

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/auth')
      return
    }
    if (user.role !== 'recruiter') {
      router.replace('/')
      return
    }

    // Pre-fill company info if available
    setFormData(prev => ({
      ...prev,
      companyName: user.companyName || '',
      companyWebsite: user.companyWebsite || ''
    }))
  }, [user, loading, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addSkill = () => {
    if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skillInput.trim()]
      }))
      setSkillInput('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const result = await createJob({
        title: formData.title,
        description: formData.description,
        requiredSkills: formData.requiredSkills,
        location: formData.location,
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite || undefined,
        salary: formData.salary || undefined,
        employmentType: formData.employmentType,
        experience: formData.experience || undefined,
        education: formData.education || undefined
      })

      if ('error' in result) {
        alert(result.error)
      } else {
        alert('Job posted successfully!')
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Failed to post job:', error)
      alert('Failed to post job. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin" />
      </div>
    )
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
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-violet shadow-glow-purple">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Post a New Job</h1>
                <p className="text-gray-400">Create a new job posting to attract qualified candidates</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Job Details */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-violet" />
                  Job Details
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Senior Frontend Developer"
                      className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-brand-purple focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Job Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="Describe the role, responsibilities, and what you're looking for..."
                      className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-brand-purple focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Required Skills *
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        placeholder="Add a skill and press Enter"
                        className="flex-1 px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-brand-purple focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple/80 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.requiredSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-brand-purple/10 border border-brand-purple/20 rounded-lg text-sm text-brand-violet flex items-center gap-2"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="text-brand-violet hover:text-white transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-brand-violet" />
                  Company Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      placeholder="Your company name"
                      className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-brand-purple focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company Website
                    </label>
                    <input
                      type="url"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleInputChange}
                      placeholder="https://yourcompany.com"
                      className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-brand-purple focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Position Details */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-violet" />
                  Position Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Remote, San Francisco, New York"
                      className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-brand-purple focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Employment Type *
                    </label>
                    <select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-brand-purple focus:outline-none transition-colors"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                      <option value="remote">Remote</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Salary
                    </label>
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      placeholder="e.g. $80,000 - $120,000"
                      className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-brand-purple focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-violet" />
                  Requirements
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Experience Requirements
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="e.g. 3+ years of experience in frontend development..."
                      className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-brand-purple focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Education Requirements
                    </label>
                    <textarea
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="e.g. Bachelor's degree in Computer Science or related field..."
                      className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-brand-purple focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
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
                      Posting...
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-4 h-4" />
                      Post Job
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
