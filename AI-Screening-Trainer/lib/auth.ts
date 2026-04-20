// Simple client-side auth store (demo/hackathon — no backend)
// In production this would be replaced with NextAuth / Supabase / etc.

export type UserRole = 'applicant' | 'recruiter'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  // Applicant-specific
  preferredRoles?: string[]
  preferredLocations?: string[]
  skills?: string[]
  // Recruiter-specific
  company?: string
  jobIds?: string[] // jobs this recruiter owns
}

const STORAGE_KEY = 'talentai_user'
const USERS_KEY = 'talentai_users'

// Seed recruiter accounts that map to existing mock jobs
const SEED_RECRUITERS: User[] = [
  {
    id: 'r1',
    email: 'recruiter@techflow.ai',
    name: 'Alex Morgan',
    role: 'recruiter',
    company: 'TechFlow AI',
    jobIds: ['1'],
  },
  {
    id: 'r2',
    email: 'recruiter@designstudio.pro',
    name: 'Jamie Lee',
    role: 'recruiter',
    company: 'DesignStudio Pro',
    jobIds: ['2'],
  },
  {
    id: 'r3',
    email: 'recruiter@cloudnative.io',
    name: 'Sam Rivera',
    role: 'recruiter',
    company: 'CloudNative Inc',
    jobIds: ['3'],
  },
  {
    id: 'r4',
    email: 'recruiter@analytics.labs',
    name: 'Taylor Kim',
    role: 'recruiter',
    company: 'Analytics Labs',
    jobIds: ['4'],
  },
  {
    id: 'r5',
    email: 'recruiter@infra.co',
    name: 'Jordan Chen',
    role: 'recruiter',
    company: 'Infrastructure Co',
    jobIds: ['5'],
  },
  {
    id: 'r6',
    email: 'recruiter@mobilefirst.labs',
    name: 'Casey Park',
    role: 'recruiter',
    company: 'MobileFirst Labs',
    jobIds: ['6'],
  },
]

function getStoredUsers(): User[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(USERS_KEY)
    const stored: User[] = raw ? JSON.parse(raw) : []
    // Merge seed recruiters (don't duplicate)
    const ids = new Set(stored.map((u) => u.id))
    const merged = [...stored]
    for (const r of SEED_RECRUITERS) {
      if (!ids.has(r.id)) merged.push(r)
    }
    return merged
  } catch {
    return SEED_RECRUITERS
  }
}

function saveUsers(users: User[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setCurrentUser(user: User | null) {
  if (typeof window === 'undefined') return
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function signUp(data: {
  email: string
  name: string
  role: UserRole
  company?: string
  preferredRoles?: string[]
  preferredLocations?: string[]
  skills?: string[]
}): { user: User } | { error: string } {
  const users = getStoredUsers()
  if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { error: 'An account with this email already exists.' }
  }
  const user: User = {
    id: `u_${Date.now()}`,
    email: data.email,
    name: data.name,
    role: data.role,
    company: data.company,
    preferredRoles: data.preferredRoles,
    preferredLocations: data.preferredLocations,
    skills: data.skills,
    jobIds: data.role === 'recruiter' ? [] : undefined,
  }
  saveUsers([...users, user])
  setCurrentUser(user)
  return { user }
}

export function signIn(email: string): { user: User } | { error: string } {
  const users = getStoredUsers()
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (!user) return { error: 'No account found with this email.' }
  setCurrentUser(user)
  return { user }
}

export function signOut() {
  setCurrentUser(null)
}

export function updateUser(updates: Partial<User>) {
  const current = getCurrentUser()
  if (!current) return
  const updated = { ...current, ...updates }
  setCurrentUser(updated)
  // Also update in users list
  const users = getStoredUsers()
  const idx = users.findIndex((u) => u.id === current.id)
  if (idx !== -1) {
    users[idx] = updated
    saveUsers(users)
  }
}
