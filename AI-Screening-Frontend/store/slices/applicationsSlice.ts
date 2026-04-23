import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  status: 'pending' | 'selected' | 'rejected';
  score?: number;
  aiSummary?: string;
  github?: string;
  createdAt: string;
  job?: {
    title: string;
    company: string;
  };
  applicant?: {
    fullName: string;
    email: string;
  };
}

interface ApplicationsState {
  applications: Application[];
  myApplications: Application[];
  jobApplications: Application[];
  loading: boolean;
  error: string | null;
  screeningLoading: boolean;
}

const initialState: ApplicationsState = {
  applications: [],
  myApplications: [],
  jobApplications: [],
  loading: false,
  error: null,
  screeningLoading: false,
};

// Async thunks
export const applyToJob = createAsyncThunk(
  'applications/apply',
  async (data: { jobId: string; cvUrl?: string }, { rejectWithValue }) => {
    try {
      const { applicationAPI } = await import('@/lib/api');
      const response = await applicationAPI.applyToJob(data);
      return response.data.application;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply to job');
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const { applicationAPI } = await import('@/lib/api');
      const response = await applicationAPI.getMyApplications();
      return response.data.applications || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
    }
  }
);

export const fetchJobApplications = createAsyncThunk(
  'applications/fetchJobApplications',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const { applicationAPI } = await import('@/lib/api');
      const response = await applicationAPI.getJobApplications(jobId);
      return response.data.applications || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job applications');
    }
  }
);

export const screenApplicants = createAsyncThunk(
  'applications/screen',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const { applicationAPI } = await import('@/lib/api');
      const response = await applicationAPI.screenApplicants(jobId);
      return response.data.applications || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to screen applicants');
    }
  }
);

export const selectCandidate = createAsyncThunk(
  'applications/select',
  async (data: { applicationId: string }, { rejectWithValue }) => {
    try {
      const { applicationAPI } = await import('@/lib/api');
      const response = await applicationAPI.selectCandidate(data.applicationId, { status: 'selected' });
      return response.data.application;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to select candidate');
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateApplicationStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const application = state.applications.find(app => app.id === action.payload.id);
      if (application) {
        application.status = action.payload.status as any;
      }
    },
  },
  extraReducers: (builder) => {
    // Apply to Job
    builder
      .addCase(applyToJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications.push(action.payload);
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch My Applications
    builder
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Job Applications
    builder
      .addCase(fetchJobApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.jobApplications = action.payload;
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Screen Applicants
    builder
      .addCase(screenApplicants.pending, (state) => {
        state.screeningLoading = true;
        state.error = null;
      })
      .addCase(screenApplicants.fulfilled, (state, action) => {
        state.screeningLoading = false;
        // Update the applications with screening results
        action.payload.forEach((screenedApp: Application) => {
          const index = state.jobApplications.findIndex(app => app.id === screenedApp.id);
          if (index !== -1) {
            state.jobApplications[index] = screenedApp;
          }
        });
      })
      .addCase(screenApplicants.rejected, (state, action) => {
        state.screeningLoading = false;
        state.error = action.payload as string;
      });

    // Select Candidate
    builder
      .addCase(selectCandidate.fulfilled, (state, action) => {
        const application = state.jobApplications.find(app => app.id === action.payload.id);
        if (application) {
          application.status = 'selected';
        }
      });
  },
});

export const { clearError, updateApplicationStatus } = applicationsSlice.actions;
export default applicationsSlice.reducer;
