// Simple client-side auth store (demo/hackathon — no backend)
// In production this would be replaced with NextAuth / Supabase / etc.

export type UserRole = 'jobseeker' | 'recruiter' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  passwordHash: string
  // JobSeeker-specific
  preferredRoles?: string[]
  preferredLocations?: string[]
  skills?: string[]
  // Recruiter-specific
  company?: string
  companyWebsite?: string
  jobIds?: string[]
}

const STORAGE_KEY = 'talentai_user'
const USERS_KEY = 'talentai_users'

/** Simple deterministic hash — good enough for a localStorage demo */
export function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    hash = (Math.imul(31, hash) + password.charCodeAt(i)) | 0
  }
  return hash.toString(16)
}

// Seed admin account — password: admin123
const SEED_ADMIN: User = {
  id: 'admin_1',
  email: 'admin@talentai.com',
  name: 'Platform Admin',
  role: 'admin',
  passwordHash: hashPassword('admin123'),
}

// Seed recruiter accounts — password: recruiter123
const SEED_RECRUITERS: User[] = [
  { id: 'r1', email: 'recruiter@techflow.ai',      name: 'Alex Morgan',  role: 'recruiter', passwordHash: hashPassword('recruiter123'), company: 'TechFlow AI',       jobIds: ['1'] },
  { id: 'r2', email: 'recruiter@designstudio.pro', name: 'Jamie Lee',    role: 'recruiter', passwordHash: hashPassword('recruiter123'), company: 'DesignStudio Pro',  jobIds: ['2'] },
  { id: 'r3', email: 'recruiter@cloudnative.io',   name: 'Sam Rivera',   role: 'recruiter', passwordHash: hashPassword('recruiter123'), company: 'CloudNative Inc',   jobIds: ['3'] },
  { id: 'r4', email: 'recruiter@analytics.labs',   name: 'Taylor Kim',   role: 'recruiter', passwordHash: hashPassword('recruiter123'), company: 'Analytics Labs',    jobIds: ['4'] },
  { id: 'r5', email: 'recruiter@infra.co',         name: 'Jordan Chen',  role: 'recruiter', passwordHash: hashPassword('recruiter123'), company: 'Infrastructure Co', jobIds: ['5'] },
  { id: 'r6', email: 'recruiter@mobilefirst.labs', name: 'Casey Park',   role: 'recruiter', passwordHash: hashPassword('recruiter123'), company: 'MobileFirst Labs',  jobIds: ['6'] },
]

function getStoredUsers(): User[] {
  if (typeof window === 'undefined') return []
  try {
    // One-time reset: clear corrupted data
    if (localStorage.getItem('talentai_reset') !== 'done') {
      localStorage.removeItem(USERS_KEY)
      localStorage.setItem('talentai_reset', 'done')
    }
    
    const raw = localStorage.getItem(USERS_KEY)
    const stored: User[] = raw ? JSON.parse(raw) : []
    const ids = new Set(stored.map((u) => u.id))
    const merged = [...stored]
    
    // Always ensure seed users have correct password hashes
    const allSeedUsers = [SEED_ADMIN, ...SEED_RECRUITERS]
    for (const seedUser of allSeedUsers) {
      const existingIndex = merged.findIndex(u => u.id === seedUser.id)
      if (existingIndex === -1) {
        // Add seed user if not exists
        merged.push(seedUser)
      } else {
        // Update existing user to ensure passwordHash is set
        merged[existingIndex] = { ...seedUser, ...merged[existingIndex], passwordHash: seedUser.passwordHash }
      }
    }
    
    // Save back to localStorage to ensure persistence
    saveUsers(merged)
    return merged
  } catch {
    return [...SEED_RECRUITERS, SEED_ADMIN]
  }
}

/** Public getter for admin to read all users */
export function getAllUsers(): User[] {
  return getStoredUsers()
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
  password: string
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
    passwordHash: hashPassword(data.password),
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

export function signIn(email: string, password: string): { user: User } | { error: string } {
  const users = getStoredUsers()
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (!user) return { error: 'No account found with this email.' }
  
  // Debug logging (remove in production)
  console.log('Login attempt:', { email, password, storedHash: user.passwordHash, inputHash: hashPassword(password) })
  
  if (user.passwordHash !== hashPassword(password)) return { error: 'Incorrect password.' }
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
