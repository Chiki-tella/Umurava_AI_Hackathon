// Client-side applications store
// Stores submitted applications in localStorage

export interface Application {
  id: string
  jobId: string
  applicantId: string
  applicantName: string
  applicantEmail: string
  skills: string[]
  experience: string
  education: string
  portfolio?: string
  submittedAt: string
  // AI screening results (populated when recruiter runs screening)
  matchScore?: number
  strengths?: string[]
  gaps?: string[]
  recommendation?: string
}

const APPS_KEY = 'talentai_applications'

export function getApplications(): Application[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(APPS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getApplicationsForJob(jobId: string): Application[] {
  return getApplications().filter((a) => a.jobId === jobId)
}

export function getApplicationsByApplicant(applicantId: string): Application[] {
  return getApplications().filter((a) => a.applicantId === applicantId)
}

export function hasApplied(applicantId: string, jobId: string): boolean {
  return getApplications().some(
    (a) => a.applicantId === applicantId && a.jobId === jobId
  )
}

export function submitApplication(app: Omit<Application, 'id' | 'submittedAt'>): Application {
  const applications = getApplications()
  const newApp: Application = {
    ...app,
    id: `app_${Date.now()}`,
    submittedAt: new Date().toISOString(),
  }
  localStorage.setItem(APPS_KEY, JSON.stringify([...applications, newApp]))
  return newApp
}

// Simulate AI scoring for an application against a job's required skills
export function scoreApplication(
  app: Application,
  requiredSkills: string[]
): { matchScore: number; strengths: string[]; gaps: string[]; recommendation: string } {
  const appSkills = app.skills.map((s) => s.toLowerCase().trim())
  const required = requiredSkills.map((s) => s.toLowerCase().trim())

  const matched = required.filter((s) => appSkills.some((a) => a.includes(s) || s.includes(a)))
  const missing = required.filter((s) => !appSkills.some((a) => a.includes(s) || s.includes(a)))

  const skillScore = required.length > 0 ? (matched.length / required.length) * 100 : 70
  const expBonus = app.experience.length > 200 ? 5 : app.experience.length > 100 ? 2 : 0
  const eduBonus = app.education.toLowerCase().includes('university') ||
    app.education.toLowerCase().includes('college') ||
    app.education.toLowerCase().includes('bs') ||
    app.education.toLowerCase().includes('ms') ? 3 : 0

  const raw = Math.min(98, Math.round(skillScore + expBonus + eduBonus))
  const matchScore = Math.max(30, raw)

  const strengths: string[] = []
  if (matched.length > 0) strengths.push(`Matches ${matched.length} of ${required.length} required skills`)
  if (app.experience.length > 200) strengths.push('Detailed work experience provided')
  if (app.portfolio) strengths.push('Portfolio / GitHub provided')
  if (eduBonus > 0) strengths.push('Relevant educational background')
  if (matched.length === required.length) strengths.push('Full skill stack alignment')

  const gaps: string[] = missing.map((s) => `Missing: ${requiredSkills.find(r => r.toLowerCase() === s) || s}`)

  let recommendation = ''
  if (matchScore >= 90) recommendation = 'Exceptional match — recommend immediate interview.'
  else if (matchScore >= 75) recommendation = 'Strong candidate with minor gaps. Recommend technical interview.'
  else if (matchScore >= 60) recommendation = 'Moderate match. Consider if pipeline is thin.'
  else recommendation = 'Significant skill gaps. Not recommended for this role.'

  return { matchScore, strengths, gaps, recommendation }
}

export function saveScreeningResults(
  jobId: string,
  results: Array<{ id: string; matchScore: number; strengths: string[]; gaps: string[]; recommendation: string }>
) {
  const applications = getApplications()
  const updated = applications.map((app) => {
    if (app.jobId !== jobId) return app
    const result = results.find((r) => r.id === app.id)
    return result ? { ...app, ...result } : app
  })
  localStorage.setItem(APPS_KEY, JSON.stringify(updated))
}
