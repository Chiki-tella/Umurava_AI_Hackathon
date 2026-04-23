import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  pageTitle: string;
  pageDescription: string;
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  notifications: Notification[];
  loading: {
    global: boolean;
    [key: string]: boolean;
  };
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  timestamp: number;
}

const initialState: UIState = {
  pageTitle: 'TalentAI - AI-Powered Recruitment',
  pageDescription: 'Find your dream job or hire the perfect candidate with AI',
  sidebarOpen: false,
  theme: 'system',
  notifications: [],
  loading: {
    global: false,
  },
};

// Page title configurations
const pageTitles: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'TalentAI - AI-Powered Recruitment',
    description: 'Find your dream job or hire the perfect candidate with AI',
  },
  '/auth': {
    title: 'Sign In - TalentAI',
    description: 'Sign in to your TalentAI account',
  },
  '/auth/register': {
    title: 'Sign Up - TalentAI',
    description: 'Create your TalentAI account',
  },
  '/jobs': {
    title: 'Job Opportunities - TalentAI',
    description: 'Browse and apply for jobs that match your skills',
  },
  '/jobs/[id]': {
    title: 'Job Details - TalentAI',
    description: 'View job details and apply',
  },
  '/dashboard': {
    title: 'Dashboard - TalentAI',
    description: 'Manage your applications and profile',
  },
  '/profile': {
    title: 'Profile - TalentAI',
    description: 'Manage your profile and preferences',
  },
  '/applications': {
    title: 'My Applications - TalentAI',
    description: 'Track your job applications',
  },
  '/recruiter': {
    title: 'Recruiter Dashboard - TalentAI',
    description: 'Manage your job postings and applicants',
  },
  '/recruiter/jobs': {
    title: 'My Job Postings - TalentAI',
    description: 'Manage your job postings',
  },
  '/recruiter/applications': {
    title: 'Applicants - TalentAI',
    description: 'Review and screen applicants',
  },
  '/recruiter/create-job': {
    title: 'Create Job - TalentAI',
    description: 'Create a new job posting',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setPageTitle: (state, action: PayloadAction<{ title: string; description?: string }>) => {
      state.pageTitle = action.payload.title;
      if (action.payload.description) {
        state.pageDescription = action.payload.description;
      }
    },
    setPageTitleByRoute: (state, action: PayloadAction<string>) => {
      const route = action.payload;
      const config = pageTitles[route];
      if (config) {
        state.pageTitle = config.title;
        state.pageDescription = config.description;
      } else {
        // Try to match dynamic routes
        for (const [key, value] of Object.entries(pageTitles)) {
          if (key.includes('[') && route.startsWith(key.split('[')[0])) {
            state.pageTitle = value.title;
            state.pageDescription = value.description;
            break;
          }
        }
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      state.loading[action.payload.key] = action.payload.loading;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
  },
});

export const {
  setPageTitle,
  setPageTitleByRoute,
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  setGlobalLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
