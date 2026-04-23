import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define User type locally to avoid circular imports
interface User {
  id: string;
  fullName: string;
  name?: string;
  email: string;
  role: 'jobseeker' | 'recruiter' | 'admin';
  interestedRoles?: string[];
  preferredLocations?: string[];
  skills?: string[];
  companyName?: string;
  company?: string;
  companyWebsite?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { signIn } = await import('@/lib/auth-backend');
      const result = await signIn(email, password);
      
      if ('error' in result) {
        return rejectWithValue(result.error);
      }
      
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: {
    fullName: string;
    email: string;
    password: string;
    role: 'jobseeker' | 'recruiter';
    companyName?: string;
    interestedRoles?: string[];
    preferredLocations?: string[];
    skills?: string;
  }, { rejectWithValue }) => {
    try {
      const { registerJobseeker, registerRecruiter } = await import('@/lib/auth-backend');
      
      let result;
      if (userData.role === 'jobseeker') {
        result = await registerJobseeker(userData);
      } else {
        result = await registerRecruiter({
          fullName: userData.fullName,
          email: userData.email,
          password: userData.password,
          companyName: userData.companyName!,
        });
      }
      
      if ('error' in result) {
        return rejectWithValue(result.error);
      }
      
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: {
    fullName?: string;
    interestedRoles?: string[];
    preferredLocations?: string[];
    skills?: string[];
    companyName?: string;
  }, { rejectWithValue }) => {
    try {
      const { updateUserProfile: updateProfile } = await import('@/lib/auth-backend');
      const result = await updateProfile(userData);
      
      if ('error' in result) {
        return rejectWithValue(result.error);
      }
      
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Profile update failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { signOut } = await import('@/lib/auth-backend');
      signOut();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    initializeAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('talentai_token');
        const userStr = localStorage.getItem('talentai_user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            state.token = token;
            state.user = user;
            state.isAuthenticated = true;
          } catch (error) {
            localStorage.removeItem('talentai_token');
            localStorage.removeItem('talentai_user');
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Update Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError, setUser, setToken, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
