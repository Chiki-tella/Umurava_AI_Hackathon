import { applicationAPI } from './api'

export interface Application {
  _id: string
  jobId: string
  applicantId: string
  cvUrl?: string
  status: 'pending' | 'selected' | 'rejected'
  score?: number
  aiSummary?: string
  createdAt: string
  // Populated data
  jobDetails?: {
    title: string
    location: string
    status: string
  }
  applicantDetails?: {
    fullName: string
    email: string
    skills: string[]
  }
}

export async function applyToJob(data: {
  jobId: string
  cvUrl?: string
  experience?: string
  education?: string
  portfolio?: string
  skills?: string
  coverLetter?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}): Promise<{ application: Application } | { error: string }> {
  try {
    const response = await applicationAPI.applyToJob(data)
    if (response.data.success) {
      return { application: response.data.application }
    } else {
      return { error: response.data.message || 'Failed to apply to job' }
    }
  } catch (error: any) {
    return { error: error.response?.data?.message || 'Failed to apply to job' }
  }
}

export async function getMyApplications(): Promise<{ applications: Application[]; count: number } | { error: string }> {
  try {
    const response = await applicationAPI.getMyApplications()
    if (response.data.success) {
      return { applications: response.data.applications, count: response.data.count }
    } else {
      return { error: response.data.message || 'Failed to fetch applications' }
    }
  } catch (error: any) {
    return { error: error.response?.data?.message || 'Failed to fetch applications' }
  }
}

export async function getJobApplications(jobId: string): Promise<{ applications: Application[]; count: number } | { error: string }> {
  try {
    const response = await applicationAPI.getJobApplications(jobId)
    if (response.data.success) {
      return { applications: response.data.applications, count: response.data.count }
    } else {
      return { error: response.data.message || 'Failed to fetch job applications' }
    }
  } catch (error: any) {
    return { error: error.response?.data?.message || 'Failed to fetch job applications' }
  }
}

export async function screenApplicants(jobId: string): Promise<{ applications: Application[] } | { error: string }> {
  try {
    const response = await applicationAPI.screenApplicants(jobId)
    if (response.data.success) {
      return { applications: response.data.applications }
    } else {
      return { error: response.data.message || 'Failed to screen applicants' }
    }
  } catch (error: any) {
    return { error: error.response?.data?.message || 'Failed to screen applicants' }
  }
}

export async function selectCandidate(applicationId: string, status: 'selected' | 'rejected'): Promise<{ application: Application } | { error: string }> {
  try {
    const response = await applicationAPI.selectCandidate(applicationId, { status })
    if (response.data.success) {
      return { application: response.data.application }
    } else {
      return { error: response.data.message || 'Failed to update candidate status' }
    }
  } catch (error: any) {
    return { error: error.response?.data?.message || 'Failed to update candidate status' }
  }
}
