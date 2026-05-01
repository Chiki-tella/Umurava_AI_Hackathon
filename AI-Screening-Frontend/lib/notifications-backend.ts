import { notificationAPI } from './api'

export interface Notification {
  _id: string
  userId: string
  message: string
  type?: 'selected' | 'accepted' | 'rejected' | 'info'
  read: boolean
  createdAt: string
  jobTitle?: string
  company?: string
  jobId?: string
  notifiedAt?: string
}

export async function getNotifications(): Promise<{ notifications: Notification[] } | { error: string }> {
  try {
    const response = await notificationAPI.getNotifications()
    if (response.data.success) {
      return { notifications: response.data.notifications }
    } else {
      return { error: response.data.message || 'Failed to fetch notifications' }
    }
  } catch (error: any) {
    return { error: error.response?.data?.message || 'Failed to fetch notifications' }
  }
}

export async function markAsRead(id: string): Promise<{ notification: Notification } | { error: string }> {
  try {
    const response = await notificationAPI.markAsRead(id)
    if (response.data.success) {
      return { notification: response.data.notification }
    } else {
      return { error: response.data.message || 'Failed to mark notification as read' }
    }
  } catch (error: any) {
    return { error: error.response?.data?.message || 'Failed to mark notification as read' }
  }
}
