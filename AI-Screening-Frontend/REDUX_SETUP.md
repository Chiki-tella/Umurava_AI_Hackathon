# Redux Toolkit + Dynamic Page Titles Setup

## ✅ What's Been Implemented

### 1. Redux Toolkit Setup
- **Store Configuration**: `/store/index.ts`
- **Auth Slice**: `/store/slices/authSlice.ts` - Login, register, profile management
- **Jobs Slice**: `/store/slices/jobsSlice.ts` - Job fetching and filtering
- **Applications Slice**: `/store/slices/applicationsSlice.ts` - Applications and screening
- **UI Slice**: `/store/slices/uiSlice.ts` - Page titles, notifications, loading states

### 2. Dynamic Page Titles
- **React Helmet**: Integrated for SEO-friendly page titles
- **RouteWatcher**: Automatically updates titles based on current route
- **Pre-configured Routes**: All major routes have custom titles and descriptions

### 3. Additional Features
- **Notifications System**: Redux-powered toast notifications
- **Loading States**: Global and component-specific loading management
- **Error Handling**: Centralized error state management

## 🔧 Installation

```bash
cd AI-Screening-Frontend
npm install @reduxjs/toolkit react-redux react-helmet-async
```

## 📋 Usage Examples

### Using Auth State
```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginPage() {
  const { login, loading, error } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.meta.requestStatus === 'fulfilled') {
      // Login successful
    }
  };
}
```

### Using Jobs State
```typescript
import { useAppSelector, useAppDispatch } from '@/store';
import { fetchJobs, setFilters } from '@/store/slices/jobsSlice';

function JobsPage() {
  const dispatch = useAppDispatch();
  const { jobs, loading, filters } = useAppSelector(state => state.jobs);
  
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);
  
  const handleFilter = (newFilters) => {
    dispatch(setFilters(newFilters));
  };
}
```

### Using Notifications
```typescript
import { useAppDispatch } from '@/store';
import { addNotification } from '@/store/slices/uiSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  
  const showSuccess = () => {
    dispatch(addNotification({
      type: 'success',
      message: 'Operation completed successfully!',
      duration: 3000
    }));
  };
}
```

## 🎯 Page Title Configuration

Page titles are automatically updated based on the current route. The configuration is in `/store/slices/uiSlice.ts`:

```typescript
const pageTitles = {
  '/': { title: 'TalentAI - AI-Powered Recruitment', description: '...' },
  '/jobs': { title: 'Job Opportunities - TalentAI', description: '...' },
  '/dashboard': { title: 'Dashboard - TalentAI', description: '...' },
  // ... more routes
};
```

## 🔄 Migration Steps

### 1. Replace Local State with Redux
```typescript
// Before (local state)
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(false);

// After (Redux)
const { user, loading } = useAppSelector(state => state.auth);
```

### 2. Replace API Calls with Redux Actions
```typescript
// Before (direct API call)
const { signIn } = await import('@/lib/auth-backend');
const result = await signIn(email, password);

// After (Redux action)
const { login } = useAuth();
const result = await login(email, password);
```

### 3. Add Custom Page Titles
```typescript
// For new routes, add to uiSlice.ts
'/new-route': {
  title: 'New Page - TalentAI',
  description: 'Description of the new page'
}
```

## 🚀 Benefits

1. **Centralized State**: All application state in one place
2. **Type Safety**: Full TypeScript support
3. **Performance**: Optimized re-renders with Redux Toolkit
4. **SEO**: Dynamic page titles for better search engine optimization
5. **Developer Experience**: Better debugging with Redux DevTools
6. **Scalability**: Easy to add new features and state management

## 📱 Testing

1. Check browser tab title changes when navigating
2. Verify Redux DevTools shows state changes
3. Test notifications appear correctly
4. Confirm loading states work properly

## 🛠 Next Steps

1. Install dependencies: `npm install`
2. Test the implementation
3. Migrate remaining components to use Redux
4. Add more page title configurations as needed
