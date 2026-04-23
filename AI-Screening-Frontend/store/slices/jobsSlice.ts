import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  salary: string;
  requiredSkills: string[];
  createdBy: string;
  createdAt: string;
  status: string;
}

interface JobsState {
  jobs: Job[];
  recommendedJobs: Job[];
  loading: boolean;
  error: string | null;
  filters: {
    location: string;
    type: string;
    title: string;
  };
}

const initialState: JobsState = {
  jobs: [],
  recommendedJobs: [],
  loading: false,
  error: null,
  filters: {
    location: '',
    type: '',
    title: '',
  },
};

// Async thunks
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (params?: { location?: string; type?: string; title?: string }, { rejectWithValue }) => {
    try {
      const { jobAPI } = await import('@/lib/api');
      const response = await jobAPI.getJobs(params);
      return response.data.data || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

export const fetchRecommendedJobs = createAsyncThunk(
  'jobs/fetchRecommended',
  async (_, { rejectWithValue }) => {
    try {
      const { jobAPI } = await import('@/lib/api');
      const response = await jobAPI.getRecommended();
      return response.data.data || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommended jobs');
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<JobsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        location: '',
        type: '',
        title: '',
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Jobs
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Recommended Jobs
    builder
      .addCase(fetchRecommendedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedJobs = action.payload;
      })
      .addCase(fetchRecommendedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, clearError } = jobsSlice.actions;
export default jobsSlice.reducer;
