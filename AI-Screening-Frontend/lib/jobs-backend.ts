import { jobAPI } from './api'

export interface Job {
  _id: string
  id?: string
  title: string
  description: string
  requiredSkills: string[]
  location: string
  companyName: string
  companyWebsite?: string
  salary?: string
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote'
  experience?: string
  education?: string
  createdBy: string
  status: 'open' | 'closed'
  createdAt: string
  matchScore?: number // For recommended jobs
}

export async function getJobs(params?: {
  title?: string
  location?: string
  skills?: string
}): Promise<{ jobs: Job[]; count: number } | { error: string }> {
  try {
    const response = await jobAPI.getJobs(params)
    if (response.data.success) {
      return { jobs: response.data.jobs, count: response.data.count }
    } else {
      return { error: response.data.message || 'Failed to fetch jobs' }
    }
  } catch (error: any) {
    return { error: error.response?.data?.message || 'Failed to fetch jobs' }
  }
}

export async function getJobById(id: string): Promise<{ job: Job } | { error: string }> {
  try {
    const response = await jobAPI.getJobById(id)
    if (response.data.success) {
      return { job: response.data.job }
    } else {
      return { error: response.data.message || 'Failed to fetch job' }
    }
  } catch (error: any) {
    return { error: error.response?.data?.message || 'Failed to fetch job' }
  }
}

export async function createJob(data: {
  title: string
  description: string
  requiredSkills: string[]
  location: string
  companyName: string
  companyWebsite?: string
  salary?: string
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote'
  experience?: string
  education?: string
}): Promise<{ job: Job } | { error: string }> {
  try {
    const response = await jobAPI.createJob(data)
    if (response.data.success) {
      return { job: response.data.job }
    } else {
      return { error: response.data.message || 'Failed to create job' }
    }
  } catch (error: any) {
    return { error: error.response?.data?.message || 'Failed to create job' }
  }
}

export async function getRecruiterJobs(): Promise<{ jobs: Job[]; count: number } | { error: string }> {
  try {
    const response = await jobAPI.getRecruiterJobs()
    if (response.data.success) {
      return { jobs: response.data.jobs, count: response.data.count }
    } else {
      return { error: response.data.message || 'Failed to fetch recruiter jobs' }
    }
  } catch (error: any) {
    return { error: error.response?.data?.message || 'Failed to fetch recruiter jobs' }
  }
}

export async function getRecommendedJobs(): Promise<{ jobs: Job[]; count: number } | { error: string }> {
  try {
    const response = await jobAPI.getRecommendedJobs()
    if (response.data.success) {
      return { jobs: response.data.jobs, count: response.data.count }
    } else {
      return { error: response.data.message || 'Failed to fetch recommended jobs' }
    }
  } catch (error: any) {
    return { error: error.response?.data?.message || 'Failed to fetch recommended jobs' }
  }
}
