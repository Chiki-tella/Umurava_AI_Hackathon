import axios, { AxiosInstance, AxiosResponse } from 'axios'

// API base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('talentai_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('🌐 API Request:', {
      method: config.method?.toUpperCase(),
      url: (config.baseURL || '') + (config.url || ''),
      data: config.data,
      hasToken: !!token
    })
    return config
  },
  (error) => {
    console.error('❌ Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('📡 API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    })
    return response
  },
  (error) => {
    console.error('❌ API Error:', {
      name: error.name,
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      requestData: error.config?.data,
      headers: error.config?.headers,
      isAxiosError: error.isAxiosError,
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      fullError: error
    })
    if (error.response?.status === 401) {
      // Token expired or invalid, clear local storage
      localStorage.removeItem('talentai_token')
      localStorage.removeItem('talentai_user')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

// API Response type
export type ApiResponse<T = {}> = {
  success: boolean
  message?: string
  token?: string
} & T

// Auth APIs
export const authAPI = {
  registerJobseeker: (data: {
    fullName: string
    email: string
    password: string
    interestedRoles?: string[]
    preferredLocations?: string[]
    skills?: string
  }) => apiClient.post<ApiResponse<{ user: any; token: string }>>('/auth/register/jobseeker', data),

  registerRecruiter: (data: {
    fullName: string
    email: string
    password: string
    companyName: string
  }) => apiClient.post<ApiResponse<{ user: any; token: string }>>('/auth/register/recruiter', data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<ApiResponse<{ user: any; token: string }>>('/auth/login', data),

  getMe: () => apiClient.get<ApiResponse<{ user: any }>>('/auth/me'),
}

// Job APIs
export const jobAPI = {
  getJobs: (params?: {
    title?: string
    location?: string
    skills?: string
  }) => apiClient.get<ApiResponse<{ jobs: any[]; count: number }>>('/jobs', { params }),

  getJobById: (id: string) => apiClient.get<ApiResponse<{ job: any }>>(`/jobs/${id}`),

  createJob: (data: {
    title: string
    description: string
    requiredSkills: string[]
    location: string
  }) => apiClient.post<ApiResponse<{ job: any }>>('/jobs', data),

  getRecruiterJobs: () => apiClient.get<ApiResponse<{ jobs: any[]; count: number }>>('/jobs/recruiter'),

  getRecommendedJobs: () => apiClient.get<ApiResponse<{ jobs: any[]; count: number }>>('/jobs/recommended'),
}

// Application APIs
export const applicationAPI = {
  applyToJob: (data: { jobId: string; cvUrl?: string }) =>
    apiClient.post<ApiResponse<{ application: any }>>('/applications', data),

  getMyApplications: () =>
    apiClient.get<ApiResponse<{ applications: any[]; count: number }>>('/applications/me'),

  getJobApplications: (jobId: string) =>
    apiClient.get<ApiResponse<{ applications: any[]; count: number }>>(`/applications/job/${jobId}`),

  screenApplicants: (jobId: string) =>
    apiClient.post<ApiResponse<{ applications: any[] }>>(`/applications/screen/${jobId}`),

  selectCandidate: (applicationId: string, data: { status: 'selected' | 'rejected' }) =>
    apiClient.patch<ApiResponse<{ application: any }>>(`/applications/${applicationId}/select`, data),
}

// Notification APIs
export const notificationAPI = {
  getNotifications: () => apiClient.get<ApiResponse<{ notifications: any[] }>>('/notifications'),

  markAsRead: (id: string) => apiClient.patch<ApiResponse<{ notification: any }>>(`/notifications/${id}/read`),
}

// User Profile APIs
export const userAPI = {
  updateProfile: (data: {
    fullName?: string
    interestedRoles?: string[]
    preferredLocations?: string[]
    skills?: string | string[]
    companyName?: string
  }) => apiClient.patch<ApiResponse<{ user: any }>>('/users/profile', data),
}

export default apiClient
