# Admin Panel Routing Fix

## Problem
The admin account (admin123@gmail.com / admin123) was being treated as a regular user profile when accessed from the leaderboard or any other part of the application that calls `handleViewUser()`. This resulted in showing a UserProfileView instead of the Admin Panel.

## Root Cause
The `handleViewUser()` function in `App.tsx` was always setting `viewingUserId` state when a user profile was clicked. Since the rendering logic checks for `viewingUserId` BEFORE checking the current page type, any admin user would always be displayed as a regular profile view rather than the Admin Panel.

## Solution Implemented
Modified the `handleViewUser()` function in `/App.tsx` to:

1. **Check if viewing the current logged-in admin**: If the userId matches the current user's ID and they have an admin role, navigate to the admin panel instead of showing a profile view.

2. **Check if the target user is an admin**: Query the Supabase `profiles` table to fetch the user's role. If the target user has an admin role, redirect to the admin panel instead of showing UserProfileView.

3. **Show regular profile for non-admin users**: If the user is not an admin, proceed with the normal profile view flow.

## Code Changes

### `/App.tsx`
Added import for supabase client:
```typescript
import { supabase } from "./utils/supabase/client";
```

Updated `handleViewUser()` function:
```typescript
const handleViewUser = (userId: string) => {
  setSelectedBook(null); // Close book modal if open
  
  // Check if the user being viewed is the current logged-in admin
  if (user?.id === userId && user?.role === 'admin') {
    // Navigate to admin panel instead
    setCurrentPage('admin');
    setViewingUserId(null);
    window.scrollTo(0, 0);
    return;
  }
  
  // Check if the user being viewed is an admin (by fetching their role)
  supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
    .then(({ data, error }) => {
      if (!error && data?.role === 'admin') {
        // If viewing an admin profile, redirect to admin panel
        setCurrentPage('admin');
        setViewingUserId(null);
      } else {
        // Regular user profile
        setViewingUserId(userId);
      }
      window.scrollTo(0, 0);
    })
    .catch(() => {
      // If there's an error, default to showing the profile
      setViewingUserId(userId);
      window.scrollTo(0, 0);
    });
};
```

## How It Works

1. **Immediate Check**: First, the function checks if the user being viewed is the currently logged-in admin. This is a synchronous check that prevents unnecessary database queries.

2. **Database Query**: If not the current user, it queries Supabase to fetch the target user's role from the profiles table.

3. **Route Decision**: Based on the role:
   - If admin → Navigate to Admin Panel (`setCurrentPage('admin')`)
   - If regular user → Show profile view (`setViewingUserId(userId)`)

4. **Error Handling**: If the database query fails, it defaults to showing the profile view to prevent breaking the user experience.

## Testing

To test the fix:

1. Log in with admin credentials (admin123@gmail.com / admin123)
2. Navigate to the Community page (Leaderboard section)
3. Click on "Sarah Mitchell (Admin)" in the leaderboard
4. **Expected**: The Admin Panel should be displayed
5. **Previous behavior**: UserProfileView was shown incorrectly

## Benefits

- ✅ Admin users are now correctly routed to the Admin Panel
- ✅ Prevents confusion by not showing admin users as regular profiles
- ✅ Maintains security by checking roles server-side via Supabase
- ✅ Graceful error handling if the database query fails
- ✅ Works from any entry point (leaderboard, reviews, discussions, etc.)

## Notes

- The fix uses async database queries to check user roles, ensuring the most up-to-date role information
- The function properly cleans up state by clearing `viewingUserId` when navigating to the admin panel
- Scroll behavior is maintained consistently for better UX
