// Dynamic jobs store — merges seed mock data with user-created jobs
import { jobs as seedJobs, type Job } from '@/lib/mockData'
import { getCurrentUser, updateUser } from '@/lib/auth'

const JOBS_KEY = 'talentai_jobs'

export function getStoredJobs(): Job[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(JOBS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/** All jobs: seed + user-created */
export function getAllJobs(): Job[] {
  const stored = getStoredJobs()
  const storedIds = new Set(stored.map((j) => j.id))
  return [...seedJobs.filter((j) => !storedIds.has(j.id)), ...stored]
}

export function addJob(data: {
  title: string
  company: string
  description: string
  requiredSkills: string[]
  experienceLevel: string
  salary?: string
  location?: string
  type?: string
  recruiterId: string
}): Job {
  const stored = getStoredJobs()
  const id = `job_${Date.now()}`
  const job: Job = {
    id,
    title: data.title,
    company: data.company,
    status: 'open',
    startDate: new Date().toISOString().split('T')[0],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: data.description,
    requiredSkills: data.requiredSkills,
    experienceLevel: data.experienceLevel,
    salary: data.salary,
    location: data.location,
    type: data.type,
    applicants: 0,
  }
  localStorage.setItem(JOBS_KEY, JSON.stringify([...stored, job]))

  // Link job to recruiter's jobIds
  const user = getCurrentUser()
  if (user && user.id === data.recruiterId) {
    updateUser({ jobIds: [...(user.jobIds ?? []), id] })
  }

  return job
}
