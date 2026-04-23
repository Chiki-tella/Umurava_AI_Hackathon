import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  pageTitle: string;
  pageDescription: string;
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  notifications: any[];
  loading: {
    global: boolean;
    [key: string]: boolean;
  };
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
  '/jobs': {
    title: 'Job Opportunities - TalentAI',
    description: 'Browse and apply for jobs that match your skills',
  },
  '/dashboard': {
    title: 'Dashboard - TalentAI',
    description: 'Manage your applications and profile',
  },
};

export const uiSlice = createSlice({
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
      }
    },
  },
});

export const { setPageTitle, setPageTitleByRoute } = uiSlice.actions;
