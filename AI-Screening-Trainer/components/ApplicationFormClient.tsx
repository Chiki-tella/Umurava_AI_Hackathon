'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Upload, CheckCircle2, Sparkles, ChevronRight, User, Mail, Code, Briefcase, GraduationCap, AlertCircle } from 'lucide-react'
import { Job } from '@/lib/mockData'
import { clsx } from 'clsx'
import { useAuthContext } from '@/components/AuthProvider'
import { submitApplication, hasApplied } from '@/lib/applications'

interface ApplicationFormClientProps {
  job: Job
}

const steps = ['Personal Info', 'Skills & Experience', 'Education & CV']

export function ApplicationFormClient({ job }: ApplicationFormClientProps) {
  const router = useRouter()
  const { user, loading } = useAuthContext()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alreadyApplied, setAlreadyApplied] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    skills: '',
    experience: '',
    education: '',
    portfolio: '',
  })

  useEffect(() => {
    if (loading) return
    if (!user) { router.replace('/auth'); return }
    if (user.role === 'recruiter') { router.replace('/dashboard'); return }
    // Pre-fill from profile
    const nameParts = user.name.split(' ')
    setFormData((f) => ({
      ...f,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: user.email,
      skills: user.skills?.join(', ') || '',
    }))
    setAlreadyApplied(hasApplied(user.id, job.id))
  }, [user, loading, job.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && step < steps.length - 1) {
      e.preventDefault()
      // Don't submit on Enter in steps 0-2
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    // Validate all required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'skills', 'experience', 'education']
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]?.trim())
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`)
      return
    }
    
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))

    submitApplication({
      jobId: job.id,
      applicantId: user.id,
      applicantName: `${formData.firstName} ${formData.lastName}`.trim(),
      applicantEmail: formData.email,
      skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      experience: formData.experience,
      education: formData.education,
      portfolio: formData.portfolio || undefined,
    })

    setIsSubmitting(false)
    setSubmitted(true)
    setTimeout(() => router.push('/'), 3500)
  }

  if (loading || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin" />
      </div>
    )
  }

  if (alreadyApplied) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="glass-card p-12 text-center max-w-lg w-full">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Already Applied</h2>
          <p className="text-gray-400 mb-6">You&apos;ve already submitted an application for <span className="text-white font-medium">{job.title}</span>.</p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2">Browse More Jobs</Link>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="glass-card p-12 text-center max-w-lg w-full">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            <div className="relative w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Application Submitted!</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Your application for <span className="text-white font-medium">{job.title}</span> at{' '}
            <span className="text-white font-medium">{job.company}</span> is being reviewed by our AI.
          </p>
          <div className="flex items-center justify-center gap-2 text-brand-violet text-sm">
            <Sparkles className="w-4 h-4 animate-pulse" />
            AI screening in progress...
          </div>
          <p className="text-xs text-gray-600 mt-4">Redirecting to jobs...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link href={`/job/${job.id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" />Back to {job.title}
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Apply for <span className="gradient-text">{job.title}</span>
          </h1>
          <p className="text-gray-400">{job.company} · {job.location}</p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <div className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                  i < step ? 'bg-emerald-500 text-white'
                  : i === step ? 'bg-brand-purple text-white shadow-glow-purple'
                  : 'bg-dark-700 text-gray-500 border border-white/10'
                )}>
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={clsx('text-sm font-medium hidden sm:block', i === step ? 'text-white' : 'text-gray-500')}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={clsx('flex-1 h-px transition-all duration-300', i < step ? 'bg-emerald-500/50' : 'bg-white/10')} />
              )}
            </div>
          ))}
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-brand-purple/10 border border-brand-purple/20">
                      <User className="w-5 h-5 text-brand-violet" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
                      <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="John" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
                      <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Doe" className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Mail className="w-4 h-4 inline mr-1.5 text-gray-400" />Email Address *
                    </label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="john@example.com" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="+1 (555) 000-0000" className="input-field" />
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-brand-pink/10 border border-brand-pink/20">
                      <Code className="w-5 h-5 text-brand-pink" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Skills & Experience</h2>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Skills * <span className="text-gray-500 font-normal">(comma-separated)</span>
                    </label>
                    <input type="text" name="skills" required value={formData.skills} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="React, TypeScript, Next.js" className="input-field" />
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="text-xs text-gray-500 mr-1">Required:</span>
                      {job.requiredSkills.map((skill) => (
                        <span key={skill} className="px-2 py-0.5 rounded-md bg-brand-purple/10 text-brand-violet text-xs border border-brand-purple/20">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Briefcase className="w-4 h-4 inline mr-1.5 text-gray-400" />Work Experience *
                    </label>
                    <textarea name="experience" required rows={6} value={formData.experience} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Describe your relevant work experience, projects, and achievements..." className="input-field resize-none" />
                    <p className="text-xs text-gray-500 mt-1.5">Tip: Be specific about your impact and the technologies you used.</p>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-brand-orange/10 border border-brand-orange/20">
                      <GraduationCap className="w-5 h-5 text-brand-orange" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Education & Portfolio</h2>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Education *</label>
                    <input type="text" name="education" required value={formData.education} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="BS Computer Science, University Name" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Portfolio / GitHub URL</label>
                    <input type="url" name="portfolio" value={formData.portfolio} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="https://github.com/username" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Resume / CV</label>
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:border-brand-purple/40 hover:bg-brand-purple/5 transition-all duration-300 cursor-pointer group">
                      <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-brand-violet" />
                      </div>
                      <p className="text-gray-300 font-medium mb-1">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 5MB</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
              <button type="button" onClick={() => setStep((s) => s - 1)} disabled={step === 0}
                className={clsx('flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all', step === 0 ? 'opacity-0 pointer-events-none' : 'btn-secondary')}>
                <ArrowLeft className="w-4 h-4" />Back
              </button>

            {step < steps.length - 1 ? (
                <button type="button" onClick={() => setStep((s) => s + 1)} className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm">
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2 px-8 py-2.5 text-sm disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</>
                    : <><Sparkles className="w-4 h-4" />Submit Application</>
                  }
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
