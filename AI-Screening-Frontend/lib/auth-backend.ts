import { authAPI } from './api'

export type UserRole = 'jobseeker' | 'recruiter' | 'admin'

export interface User {
  id: string
  fullName: string
  email: string
  role: UserRole
  // JobSeeker-specific
  interestedRoles?: string[]
  preferredLocations?: string[]
  skills?: string[]
  // Recruiter-specific
  companyName?: string
}

const TOKEN_KEY = 'talentai_token'
const USER_KEY = 'talentai_user'

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setCurrentUser(user: User | null) {
  if (typeof window === 'undefined') return
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(USER_KEY)
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}


export async function signUp(data: {
  email: string
  fullName: string
  password: string
  role: UserRole
  companyName?: string
  interestedRoles?: string[]
  preferredLocations?: string[]
  skills?: string[]
}): Promise<{ user: User; token: string } | { error: string }> {
  try {
    console.log('🔍 Registration attempt:', { role: data.role, email: data.email })
    
    const skillsString = data.skills ? (Array.isArray(data.skills) ? data.skills.join(',') : data.skills) : undefined
    
    console.log('📝 Sending registration data:', {
      role: data.role,
      fullName: data.fullName,
      email: data.email,
      hasPassword: !!data.password,
      companyName: data.companyName,
      interestedRoles: data.interestedRoles,
      preferredLocations: data.preferredLocations,
      skills: skillsString
    })
    
    const response = data.role === 'recruiter' 
      ? await authAPI.registerRecruiter({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          companyName: data.companyName || '',
        })
      : await authAPI.registerJobseeker({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          interestedRoles: data.interestedRoles,
          preferredLocations: data.preferredLocations,
          skills: skillsString,
        })

    console.log('📡 Registration response:', response.data)

    if (response.data.success && response.data.token) {
      const { user, token } = response.data
      setCurrentUser(user)
      setToken(token)
      console.log('✅ Registration successful:', { user: user.fullName, role: user.role })
      return { user, token }
    } else {
      console.log('❌ Registration failed:', response.data.message)
      return { error: response.data.message || 'Registration failed' }
    }
  } catch (error: any) {
    console.error('💥 Registration error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    })
    return { error: error.response?.data?.message || error.message || 'Registration failed' }
  }
}

export async function signIn(email: string, password: string): Promise<{ user: User; token: string } | { error: string }> {
  try {
    console.log('🔍 Login attempt:', { email, passwordLength: password?.length })
    
    const requestData = { email, password }
    console.log('📤 Sending login request:', requestData)
    
    const response = await authAPI.login(requestData)
    
    console.log('📡 Login response:', response.data)
    
    if (response.data.success && response.data.token) {
      const { user, token } = response.data
      setCurrentUser(user)
      setToken(token)
      console.log('✅ Login successful:', { user: user.fullName, role: user.role })
      return { user, token }
    } else {
      console.log('❌ Login failed:', response.data.message)
      return { error: response.data.message || 'Login failed' }
    }
  } catch (error: any) {
    console.error('💥 Login error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    })
    return { error: error.response?.data?.message || error.message || 'Login failed' }
  }
}

export async function getMe(): Promise<{ user: User } | { error: string }> {
  try {
    const response = await authAPI.getMe()
    
    if (response.data.success) {
      const user = response.data.user
      setCurrentUser(user)
      return { user }
    } else {
      return { error: response.data.message || 'Failed to get user profile' }
    }
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message || 'Failed to get user profile' }
  }
}

export function signOut() {
  setCurrentUser(null)
  setToken(null)
}

export async function updateUserProfile(data: {
  preferredRoles?: string[]
  preferredLocations?: string[]
  skills?: string[]
  fullName?: string
  companyName?: string
}): Promise<{ user: User } | { error: string }> {
  try {
    console.log('🔄 Frontend profile update called with data:', data);
    
    // Check if data is empty
    if (!data || Object.keys(data).length === 0) {
      console.log('❌ No data provided for profile update');
      return { error: 'No data provided for profile update' };
    }
    
    // Map frontend field names to backend field names
    const backendData: any = {};
    if (data.fullName) backendData.fullName = data.fullName;
    if (data.preferredRoles) backendData.interestedRoles = data.preferredRoles; // Map to backend field
    if (data.preferredLocations) backendData.preferredLocations = data.preferredLocations;
    if (data.skills) backendData.skills = data.skills;
    if (data.companyName) backendData.companyName = data.companyName;
    
    console.log('📤 Mapped data for backend:', backendData);
    
    // Import userAPI here to avoid circular dependency
    const { userAPI } = await import('./api')
    console.log('📤 Sending profile update request to:', '/users/profile');
    const response = await userAPI.updateProfile(backendData)
    
    if (response.data.success) {
      const user = response.data.user
      setCurrentUser(user)
      return { user }
    } else {
      return { error: response.data.message || 'Failed to update user profile' }
    }
  } catch (error: any) {
    console.error('💥 Profile update error in auth-backend:', {
      name: error.name,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: error.config,
      code: error.code,
      isAxiosError: error.isAxiosError,
      fullError: error
    })
    return { error: error.response?.data?.message || error.message || 'Failed to update user profile' }
  }
}

export function isAuth(): boolean {
  return !!getToken() && !!getCurrentUser()
}
