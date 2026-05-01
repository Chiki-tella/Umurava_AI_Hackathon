'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, CheckCircle2, Mail, Briefcase, Calendar, ArrowRight, Users, Send, AlertCircle, XCircle } from 'lucide-react'
import { useAuthContextNew } from '@/components/AuthProviderNew'
import { getNotifications } from '@/lib/notifications-backend'
import { getMyApplications } from '@/lib/applications-backend'
import { getJobs } from '@/lib/jobs-backend'

import Link from 'next/link'

export function NotificationsPage() {
  const { user, loading } = useAuthContextNew()
  const [notifications, setNotifications] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [sentNotifications, setSentNotifications] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || loading || !user) return
    
    console.log('NotificationsPage: Loading notifications for user:', user.role, user.id)
    
    const loadData = async () => {
      try {
        console.log('🔍 Loading notifications for user:', user.role, user.id)
        
        // Load notifications from backend
        console.log('📬 Fetching notifications...')
        const notificationsResult = await getNotifications()
        console.log('📡 Notifications API response:', notificationsResult)
        
        if ('notifications' in notificationsResult) {
          console.log('✅ Successfully fetched notifications:', notificationsResult.notifications.length, 'notifications')
          setNotifications(notificationsResult.notifications)
        } else if ('error' in notificationsResult) {
          console.log('❌ Notifications API returned error:', notificationsResult.error)
        } else {
          console.log('❓ Unexpected notifications API response:', notificationsResult)
        }
        
        // Load jobs from backend
        console.log('💼 Fetching jobs for notifications context...')
        const jobsResult = await getJobs()
        console.log('📡 Jobs API response:', jobsResult)
        
        if ('jobs' in jobsResult) {
          console.log('✅ Successfully fetched jobs for notifications:', jobsResult.jobs.length, 'jobs')
          setJobs(jobsResult.jobs)
        } else if ('error' in jobsResult) {
          console.log('❌ Jobs API returned error:', jobsResult.error)
        } else {
          console.log('❓ Unexpected jobs API response:', jobsResult)
        }
        
        if (user.role === 'jobseeker') {
          console.log('👤 Processing jobseeker notifications')
          // For jobseekers, we already have notifications from backend
        } else if (user.role === 'recruiter') {
          console.log('👔 Processing recruiter notifications')
          // For recruiters, we could load applications they've processed
          // This would be expanded based on your requirements
        }
      } catch (error) {
        console.error('💥 Failed to load notifications:', {
          message: error instanceof Error ? error.message : String(error),
          response: (error as any)?.response?.data,
          status: (error as any)?.response?.status,
          config: (error as any)?.config
        })
      }
    }
    
    loadData()
  }, [mounted, loading, user])

  if (loading || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin" />
      </div>
    )
  }


  // JobSeeker view
  if (user.role === 'jobseeker') {
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
                const getNotificationStyle = (type: 'selected' | 'accepted' | 'rejected' | 'info') => {
                  switch (type) {
                    case 'accepted':
                    case 'selected':
                      return {
                        border: 'border-green-500/20',
                        bg: 'bg-green-500/5',
                        iconBg: 'bg-green-500/10',
                        iconBorder: 'border-green-500/30',
                        iconColor: 'text-green-400',
                        badge: 'badge-success',
                        title: 'Congratulations! Your application has been selected!',
                        badgeText: 'Selected'
                      }
                    case 'rejected':
                      return {
                        border: 'border-red-500/20',
                        bg: 'bg-red-500/5',
                        iconBg: 'bg-red-500/10',
                        iconBorder: 'border-red-500/30',
                        iconColor: 'text-red-400',
                        badge: 'badge-danger',
                        title: 'Application Status Update',
                        badgeText: 'Rejected'
                      }
                    default: // info or other
                      return {
                        border: 'border-blue-500/20',
                        bg: 'bg-blue-500/5',
                        iconBg: 'bg-blue-500/10',
                        iconBorder: 'border-blue-500/30',
                        iconColor: 'text-blue-400',
                        badge: 'badge-info',
                        title: 'Notification',
                        badgeText: 'Update'
                      }
                  }
                }

                const style = getNotificationStyle(notification.type)

                return (
                  <motion.div
                    key={notification.id || `notification-${index}`}
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
                            <p className="text-gray-300 mb-3 whitespace-pre-line">
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
                          <span>
                            {notification.notifiedAt 
                              ? new Date(notification.notifiedAt).toLocaleDateString()
                              : 'Recent'
                            }
                          </span>
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
                  key={notification.id || `sent-notification-${index}`}
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
                          <span>
                            {notification.notifiedAt 
                              ? new Date(notification.notifiedAt).toLocaleDateString()
                              : 'Recent'
                            }
                          </span>
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
        <p className="text-gray-400">Notifications are available for jobseekers and recruiters only.</p>
      </div>
    </div>
  )
}
