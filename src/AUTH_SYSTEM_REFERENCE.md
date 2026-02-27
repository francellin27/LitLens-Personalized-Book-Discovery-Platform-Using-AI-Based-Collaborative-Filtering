# Authentication System Reference

## Current Auth System: Supabase

**Active File:** `/lib/auth-supabase.tsx`

All components must import from this file:
```tsx
import { useAuth } from '../lib/auth-supabase';
// or from App.tsx:
import { AuthProvider, useAuth } from './lib/auth-supabase';
```

## Components Using Auth:

✅ App.tsx  
✅ Navigation.tsx  
✅ Login.tsx  
✅ HomePage.tsx  
✅ AdminPanel.tsx  
✅ BookModal.tsx  
✅ UserProfile.tsx  

## Old Auth System (DEPRECATED)

**Backup File:** `/lib/auth-local-backup.tsx`

This is the old localStorage-based auth system. It has been renamed to prevent conflicts.

⚠️ **DO NOT** import from `/lib/auth.tsx` - this file has been deleted.

## Why the Old File Was Removed

Having two auth files with the same exports (`useAuth`, `AuthProvider`) caused module resolution conflicts. The error:
```
Error: useAuth must be used within an AuthProvider
    at useAuth2 (lib/auth.tsx:36:10)
```

This happened because:
1. Some bundlers/build systems were caching the old auth.tsx file
2. Hot module reloading wasn't clearing the old exports
3. Multiple files with identical export names created ambiguity

## Solution

The old `auth.tsx` file was:
- ✅ Backed up to `auth-local-backup.tsx`
- ✅ Deleted to prevent conflicts
- ✅ All imports updated to use `auth-supabase.tsx`

## If You See Auth Errors

If you see "useAuth must be used within an AuthProvider":

1. **Clear browser cache** and reload
2. **Check imports** - make sure all use `auth-supabase`
3. **Restart dev server** to clear module cache
4. **Verify** the AuthProvider wraps your app in App.tsx

## Auth Provider Setup

In `/App.tsx`:
```tsx
export default function App() {
  return (
    <AuthProvider>  {/* From lib/auth-supabase.tsx */}
      <AppContent />
    </AuthProvider>
  );
}
```

## Available Auth Functions

```tsx
const { 
  user,                        // Current user object or null
  login,                       // (email, password) => Promise<boolean>
  signup,                      // (email, password, name, username) => Promise<void>
  logout,                      // () => Promise<void>
  isLoading,                   // boolean - auth state loading
  checkUsernameAvailability,   // (username) => Promise<boolean>
  reportReview,                // (reviewId, reason, description) => Promise<void>
  getReviewReports,            // () => ReviewReport[]
  updateReportStatus,          // (reportId, status) => void
  updateProfile                // (updates) => Promise<void>
} = useAuth();
```

## Demo Accounts

The app includes demo login functionality that works without Supabase:
- **Demo as Reader**: user@example.com / password
- **Demo as Admin**: admin@example.com / admin

These are handled in the Login component and don't require database setup.

## Supabase Setup Required For:

- ✅ Real user signup/login
- ✅ Persistent user data
- ✅ Profile management
- ✅ Review system
- ✅ Reading lists
- ✅ Admin features

See `/QUICK_SETUP_INSTRUCTIONS.md` for Supabase configuration.

---

**Last Updated:** After migration to Supabase auth system  
**Status:** All components migrated ✓
