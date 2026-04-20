'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, CheckCircle2, Mail, Briefcase, Calendar, ArrowRight, Users, Send, AlertCircle } from 'lucide-react'
import { useAuthContext } from '@/components/AuthProvider'
import { getApplicantNotifications, getApplicationsForJob } from '@/lib/applications'
import { getJobs } from '@/lib/jobs'
import { clsx } from 'clsx'
import Link from 'next/link'

export function NotificationsPage() {
  const { user, loading } = useAuthContext()
  const [notifications, setNotifications] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [sentNotifications, setSentNotifications] = useState<any[]>([])

  useEffect(() => {
    if (loading || !user) return
    
    const allJobs = getJobs()
    
    if (user.role === 'applicant') {
      // Applicant notifications
      const notifs = getApplicantNotifications(user.id)
      
      // Enrich notifications with job details
      const enrichedNotifs = notifs.map(notif => {
        const job = allJobs.find(j => j.id === notif.jobId)
        return {
          ...notif,
          jobTitle: job?.title || 'Unknown Position',
          company: job?.company || 'Unknown Company'
        }
      })
      
      setNotifications(enrichedNotifs)
    } else if (user.role === 'recruiter') {
      // Recruiter notifications - show sent notifications
      const myJobs = allJobs.filter((j) => user?.jobIds?.includes(j.id))
      const allSentNotifications: any[] = []
      
      myJobs.forEach(job => {
        const applications = getApplicationsForJob(job.id)
        const notifiedApps = applications.filter(app => app.notified && app.selected)
        
        notifiedApps.forEach(app => {
          allSentNotifications.push({
            id: app.id,
            applicantName: app.applicantName,
            applicantEmail: app.applicantEmail,
            jobTitle: job.title,
            company: job.company,
            notifiedAt: app.submittedAt,
          })
        })
      })
      
      setSentNotifications(allSentNotifications)
    }
    
    setJobs(allJobs)
  }, [user, loading])

  if (loading || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin" />
      </div>
    )
  }

  // Applicant view
  if (user.role === 'applicant') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-brand-purple/10 border border-brand-purple/20">
                <Bell className="w-6 h-6 text-brand-violet" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Notifications</h1>
                <p className="text-gray-400">Updates on your job applications</p>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="w-16 h-16 rounded-3xl bg-gray-500/10 border border-gray-500/20 flex items-center justify-center mx-auto mb-5">
                  <Mail className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No notifications yet</h3>
                <p className="text-gray-400 mb-6">
                  When recruiters select you for a position, you'll see updates here.
                </p>
                <Link href="/jobs" className="btn-primary inline-flex items-center gap-2">
                  Browse Jobs <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="glass-card p-6 border-emerald-500/20 bg-emerald-500/5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            Congratulations! You've been selected
                          </h3>
                          <p className="text-gray-300 mb-3">
                            {notification.message}
                          </p>
                        </div>
                        <span className="badge badge-success text-xs">
                          Selected
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4" />
                          <span>{notification.jobTitle}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-4 h-4" />
                          <span>{notification.company}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(notification.notifiedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <p className="text-sm text-gray-500">
                          Check your email for detailed information about next steps.
                        </p>
                        <Link 
                          href={`/job/${notification.jobId}`}
                          className="text-brand-violet hover:text-brand-pink text-sm font-medium transition-colors"
                        >
                          View Job →
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  // Recruiter view
  if (user.role === 'recruiter') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-brand-purple/10 border border-brand-purple/20">
                <Send className="w-6 h-6 text-brand-violet" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Sent Notifications</h1>
                <p className="text-gray-400">Track notifications sent to selected candidates</p>
              </div>
            </div>
          </div>

          {/* Sent Notifications List */}
          <div className="space-y-4">
            {sentNotifications.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="w-16 h-16 rounded-3xl bg-gray-500/10 border border-gray-500/20 flex items-center justify-center mx-auto mb-5">
                  <Mail className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No notifications sent yet</h3>
                <p className="text-gray-400 mb-6">
                  When you select candidates and send notifications, they'll appear here.
                </p>
                <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              sentNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="glass-card p-6 border-brand-purple/20 bg-brand-purple/5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center flex-shrink-0">
                      <Send className="w-6 h-6 text-brand-violet" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            Notification Sent
                          </h3>
                          <p className="text-gray-300 mb-3">
                            Selection notification sent to {notification.applicantName}
                          </p>
                        </div>
                        <span className="badge badge-info text-xs">
                          Sent
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          <span>{notification.applicantName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-4 h-4" />
                          <span>{notification.applicantEmail}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4" />
                          <span>{notification.jobTitle}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(notification.notifiedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <p className="text-sm text-gray-500">
                          Email and in-app notification sent successfully.
                        </p>
                        <Link 
                          href="/dashboard"
                          className="text-brand-violet hover:text-brand-pink text-sm font-medium transition-colors"
                        >
                          View Dashboard →
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  // Other roles
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass-card p-12 text-center max-w-lg w-full">
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-3">Notifications Not Available</h2>
        <p className="text-gray-400">Notifications are available for applicants and recruiters only.</p>
      </div>
    </div>
  )
}
