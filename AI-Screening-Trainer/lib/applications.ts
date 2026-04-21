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
  resumeFileName?: string
  resumeFile?: File // Note: In production, this would be stored in cloud storage
  submittedAt: string
  // AI screening results (populated when recruiter runs screening)
  matchScore?: number
  strengths?: string[]
  gaps?: string[]
  recommendation?: string
  // Application status tracking
  status: 'submitted' | 'screened' | 'selected' | 'accepted' | 'rejected' | 'deleted'
  notified?: boolean
  selectedAt?: string
  acceptedAt?: string
  rejectedAt?: string
  deletedAt?: string
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

export function submitApplication(app: Omit<Application, 'id' | 'submittedAt' | 'status'>): Application {
  const applications = getApplications()
  const newApp: Application = {
    ...app,
    id: `app_${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: 'submitted',
    notified: false,
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
    return result ? { ...app, ...result, status: 'screened' as const } : app
  })
  localStorage.setItem(APPS_KEY, JSON.stringify(updated))
}

// Select a candidate and mark them as selected
export function selectCandidate(applicationId: string): boolean {
  const applications = getApplications()
  const updated = applications.map((app) => 
    app.id === applicationId ? { ...app, status: 'selected' as const, selected: true, selectedAt: new Date().toISOString() } : app
  )
  localStorage.setItem(APPS_KEY, JSON.stringify(updated))
  return true
}

// Send notification to selected candidate (simulated - in production would send email)
export function notifySelectedCandidate(applicationId: string): { success: boolean; message: string } {
  const applications = getApplications()
  const application = applications.find((app) => app.id === applicationId)
  
  if (!application) {
    return { success: false, message: 'Application not found' }
  }
  
  if (application.status !== 'selected') {
    return { success: false, message: 'Candidate must be selected first' }
  }
  
  if (application.notified) {
    return { success: false, message: 'Candidate already notified' }
  }
  
  // Update application to mark as notified
  const updated = applications.map((app) => 
    app.id === applicationId ? { ...app, notified: true } : app
  )
  localStorage.setItem(APPS_KEY, JSON.stringify(updated))
  
  // In production, this would send an actual email
  console.log(`Email sent to ${application.applicantEmail}: Congratulations! You have been selected for the next stage - interview process.`)
  
  return { 
    success: true, 
    message: `Interview notification sent to ${application.applicantName} at ${application.applicantEmail}` 
  }
}

// Get notifications for an applicant
export function getApplicantNotifications(applicantId: string): Array<{
  id: string
  jobId: string
  jobTitle?: string
  company?: string
  notifiedAt: string
  message: string
  type: 'selected' | 'accepted' | 'rejected'
}> {
  const applications = getApplicationsByApplicant(applicantId)
  const notifications = applications
    .filter(app => app.notified && (app.status === 'selected' || app.status === 'accepted' || app.status === 'rejected'))
    .map(app => {
      let message = ''
      let type: 'selected' | 'accepted' | 'rejected' = 'selected'
      
      if (app.status === 'selected') {
        message = `Congratulations! You have been selected for the interview stage. Our team will contact you soon with further details about scheduling and next steps.`
        type = 'selected'
      } else if (app.status === 'accepted') {
        message = `Great news! You have been accepted for the position. Welcome to the team!`
        type = 'accepted'
      } else if (app.status === 'rejected') {
        message = `Thank you for your interest. Unfortunately, we have decided to move forward with other candidates at this time.`
        type = 'rejected'
      }
      
      return {
        id: app.id,
        jobId: app.jobId,
        notifiedAt: app.selectedAt || app.acceptedAt || app.rejectedAt || app.submittedAt,
        message,
        type
      }
    })
  
  return notifications
}

// Accept a candidate (after interview stage)
export function acceptCandidate(applicationId: string): { success: boolean; message: string } {
  const applications = getApplications()
  const application = applications.find((app) => app.id === applicationId)
  
  if (!application) {
    return { success: false, message: 'Application not found' }
  }
  
  if (application.status !== 'selected') {
    return { success: false, message: 'Candidate must be selected first' }
  }
  
  // Update application to mark as accepted
  const updated = applications.map((app) => 
    app.id === applicationId ? { 
      ...app, 
      status: 'accepted' as const, 
      acceptedAt: new Date().toISOString(),
      notified: true
    } : app
  )
  localStorage.setItem(APPS_KEY, JSON.stringify(updated))
  
  // In production, this would send an actual email
  console.log(`Email sent to ${application.applicantEmail}: Congratulations! You have been accepted for the position.`)
  
  return { 
    success: true, 
    message: `Acceptance notification sent to ${application.applicantName} at ${application.applicantEmail}` 
  }
}

// Reject a candidate
export function rejectCandidate(applicationId: string): { success: boolean; message: string } {
  const applications = getApplications()
  const application = applications.find((app) => app.id === applicationId)
  
  if (!application) {
    return { success: false, message: 'Application not found' }
  }
  
  if (application.status === 'deleted') {
    return { success: false, message: 'Application already deleted' }
  }
  
  // Update application to mark as rejected
  const updated = applications.map((app) => 
    app.id === applicationId ? { 
      ...app, 
      status: 'rejected' as const, 
      rejectedAt: new Date().toISOString(),
      notified: true
    } : app
  )
  localStorage.setItem(APPS_KEY, JSON.stringify(updated))
  
  // In production, this would send an actual email
  console.log(`Email sent to ${application.applicantEmail}: Thank you for your interest, but we have decided to move forward with other candidates.`)
  
  return { 
    success: true, 
    message: `Rejection notification sent to ${application.applicantName} at ${application.applicantEmail}` 
  }
}

// Delete/remove an application (without notifying)
export function deleteApplication(applicationId: string): { success: boolean; message: string } {
  const applications = getApplications()
  const application = applications.find((app) => app.id === applicationId)
  
  if (!application) {
    return { success: false, message: 'Application not found' }
  }
  
  // Update application to mark as deleted
  const updated = applications.map((app) => 
    app.id === applicationId ? { 
      ...app, 
      status: 'deleted' as const, 
      deletedAt: new Date().toISOString()
    } : app
  )
  localStorage.setItem(APPS_KEY, JSON.stringify(updated))
  
  return { 
    success: true, 
    message: `Application from ${application.applicantName} has been removed` 
  }
}
