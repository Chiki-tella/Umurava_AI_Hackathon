'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, CheckCircle2, Mail, Briefcase, Calendar, ArrowRight, Users, Send, AlertCircle, XCircle } from 'lucide-react'
import { useAuthContext } from '@/components/AuthProvider'
import { getApplicantNotifications, getApplicationsForJob } from '@/lib/applications'
import { getAllJobs } from '@/lib/jobs'

import Link from 'next/link'

export function NotificationsPage() {
  const { user, loading } = useAuthContext()
  const [notifications, setNotifications] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [sentNotifications, setSentNotifications] = useState<any[]>([])

  useEffect(() => {
    if (loading || !user) return
    
    // Only run on client side
    if (typeof window === 'undefined') return
    
    console.log('NotificationsPage: Loading notifications for user:', user.role, user.id)
    
    try {
      const allJobs = getAllJobs()
      console.log('NotificationsPage: Loaded jobs:', allJobs.length)
      
      if (user.role === 'applicant') {
        // Applicant notifications
        const notifs = getApplicantNotifications(user.id)
        console.log('NotificationsPage: Applicant notifications:', notifs.length)
        
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
        console.log('NotificationsPage: Recruiter jobIds:', user.jobIds)
        const myJobs = user?.jobIds && user.jobIds.length > 0 
          ? allJobs.filter((j) => user.jobIds!.includes(j.id))
          : []
        
        console.log('NotificationsPage: Recruiter jobs:', myJobs.length)
        const allSentNotifications: any[] = []
        
        if (myJobs.length === 0) {
          // Recruiter has no jobs assigned
          setSentNotifications([])
        } else {
          myJobs.forEach(job => {
            const applications = getApplicationsForJob(job.id)
            const notifiedApps = applications.filter(app => app.notified && (app.status === 'selected' || app.status === 'accepted' || app.status === 'rejected'))
            
            notifiedApps.forEach(app => {
              allSentNotifications.push({
                id: app.id,
                applicantName: app.applicantName,
                applicantEmail: app.applicantEmail,
                jobTitle: job.title,
                company: job.company,
                notifiedAt: app.selectedAt || app.acceptedAt || app.rejectedAt || app.submittedAt,
                status: app.status
              })
            })
          })
          
          setSentNotifications(allSentNotifications)
        }
      }
      
      setJobs(allJobs)
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
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
              notifications.map((notification, index) => {
                const getNotificationStyle = (type: 'selected' | 'accepted' | 'rejected') => {
                  switch (type) {
                    case 'accepted':
                      return {
                        border: 'border-green-500/20',
                        bg: 'bg-green-500/5',
                        iconBg: 'bg-green-500/10',
                        iconBorder: 'border-green-500/30',
                        iconColor: 'text-green-400',
                        badge: 'badge-success',
                        title: 'Congratulations! You have been accepted!',
                        badgeText: 'Accepted'
                      }
                    case 'rejected':
                      return {
                        border: 'border-red-500/20',
                        bg: 'bg-red-500/5',
                        iconBg: 'bg-red-500/10',
                        iconBorder: 'border-red-500/30',
                        iconColor: 'text-red-400',
                        badge: 'badge-danger',
                        title: 'Application Update',
                        badgeText: 'Rejected'
                      }
                    default: // selected
                      return {
                        border: 'border-emerald-500/20',
                        bg: 'bg-emerald-500/5',
                        iconBg: 'bg-emerald-500/10',
                        iconBorder: 'border-emerald-500/30',
                        iconColor: 'text-emerald-400',
                        badge: 'badge-success',
                        title: 'Congratulations! You have been selected for the interview stage',
                        badgeText: 'Interview Stage'
                      }
                  }
                }

                const style = getNotificationStyle(notification.type)

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`glass-card p-6 ${style.border} ${style.bg}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${style.iconBg} ${style.iconBorder} flex items-center justify-center flex-shrink-0`}>
                        {notification.type === 'accepted' ? (
                          <CheckCircle2 className={`w-6 h-6 ${style.iconColor}`} />
                        ) : notification.type === 'rejected' ? (
                          <XCircle className={`w-6 h-6 ${style.iconColor}`} />
                        ) : (
                          <CheckCircle2 className={`w-6 h-6 ${style.iconColor}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {style.title}
                            </h3>
                            <p className="text-gray-300 mb-3">
                              {notification.message}
                            </p>
                          </div>
                          <span className={`badge ${style.badge} text-xs`}>
                            {style.badgeText}
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
                          {notification.type === 'accepted' 
                            ? 'Welcome to the team! Check your email for onboarding details.'
                            : notification.type === 'rejected'
                            ? 'Thank you for your time. We wish you the best in your job search.'
                            : 'Check your email for interview scheduling details.'
                          }
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
              )
            })
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

