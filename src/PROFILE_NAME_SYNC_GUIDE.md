# Profile Name & Username Synchronization Guide

## Overview

When a user edits their **Name** or **Username** in the Edit Profile screen and clicks "Save Changes", the system automatically updates and synchronizes these values across the entire LitLens application.

## What Gets Updated

### ✅ Immediately Synchronized (Real-time)

The following areas update **immediately** after saving:

1. **Profile Page Header**
   - User's full name display
   - @username display
   - Avatar fallback letters (uses first letter of name)

2. **Navigation Bar**
   - "Hello, [Name]" greeting message (visible on desktop)
   - Avatar display with updated fallback

3. **Edit Profile Dialog**
   - Input fields sync to show the latest saved values
   - All profile fields remain in sync with the user context

4. **Other Users Viewing Your Profile**
   - When someone views your profile (UserProfileView), they see the updated name/username
   - Data is fetched fresh from the database each time

5. **New Content Created After Update**
   - Any new reviews, discussions, or comments will use the updated name
   - Any new interactions show the current name

### 📝 Preserved Historical Data

The following preserve the name you had **at the time of creation**:

1. **Existing Reviews**
   - Reviews you wrote before the name change keep the old name
   - This is intentional - it preserves historical context
   - New reviews will use the updated name

2. **Existing Discussion Posts**
   - Discussion posts and replies keep the original name
   - This maintains conversation continuity
   - New posts will use the updated name

## How It Works

### Technical Implementation

```
User edits profile → Clicks "Save Changes"
                    ↓
1. Frontend calls updateProfile() from auth context
2. Profile updates in Supabase 'profiles' table
3. Local user object updates in React context
4. All components using the user context re-render with new data
5. Success toast confirms the update
```

### Code Flow

1. **UserProfile.tsx** - Edit Profile Dialog
   ```typescript
   const handleSaveProfile = async () => {
     const success = await updateProfile({
       name: editName,
       username: editUsername,
       bio: editBio,
     });
     
     if (success) {
       toast.success('Profile updated successfully!');
     }
   };
   ```

2. **auth-supabase.tsx** - Auth Context
   ```typescript
   const updateProfile = async (updates: Partial<User>) => {
     // Update database
     await supabase
       .from('profiles')
       .update(dbUpdates)
       .eq('id', user.id);
     
     // Update local state - this triggers re-render everywhere
     setUser({ ...user, ...updates });
   };
   ```

3. **Components Auto-Update**
   - All components using `const { user } = useAuth()` automatically receive the updated user object
   - React's context system propagates changes to all subscribers

## User Experience

### What Users See

1. **During Edit**
   - User opens Edit Profile dialog
   - Changes name from "John Doe" to "Jonathan Doe"
   - Changes username from "johnd" to "jonathand"
   - Clicks "Save Changes"

2. **After Save**
   - Success message: "Profile updated successfully! Your changes are now visible everywhere."
   - Dialog closes
   - Profile page immediately shows new name and username
   - Navigation bar shows new greeting
   - All future interactions use the new name

3. **Across Sessions**
   - Changes persist across browser sessions
   - Other users see the updated name when viewing your profile
   - Your new name appears in leaderboards, search results, etc.

## Database Schema

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar TEXT,
  -- other fields...
);
```

When a profile is updated:
- The `name` and `username` columns are modified
- All components fetching from this table get the new values
- The auth context caches the updated user object

### Historical Data Tables

Tables that store historical user data:
- `reviews` - Stores `user_name` at time of review creation
- `discussions` - Stores user info at time of post
- `discussion_replies` - Stores user info at time of reply

These are **not updated** when profile changes - this is by design.

## Best Practices

### For Users

1. **Choose Wisely**: Since old reviews/posts preserve the original name, choose a name you'll want to keep
2. **Consistency**: Keep your username and name consistent with your identity
3. **Verification**: After updating, check your profile page to confirm changes

### For Developers

1. **Auth Context**: Always use the `useAuth()` hook to access current user data
2. **Fresh Fetches**: When viewing other users' profiles, fetch from database for latest data
3. **Denormalization**: Historical data (reviews, posts) intentionally stores name at creation time
4. **Caching**: The auth context maintains the cached user object for performance

## Troubleshooting

### My name didn't update in [location]

**Check if you're logged in:**
- Sign out and sign back in to refresh the session
- Clear browser cache if needed

**Old reviews still show old name:**
- This is expected behavior
- Historical data preserves the name at time of creation

**Navigation bar doesn't update:**
- The Navigation component receives the user object from auth context
- Try refreshing the page
- Check browser console for errors

### Username already taken

If you try to change to a username that's already in use:
- The system will prevent the update
- You'll see an error message
- Choose a different username

## Future Enhancements

Potential improvements to the name synchronization system:

1. **Update Historical Data**: Option to update all past reviews/posts with new name
2. **Name Change History**: Track name changes for moderation purposes
3. **Username Validation**: Real-time checking for username availability
4. **Display Name vs Username**: Separate display name (can change) from username (permanent)

## Summary

The LitLens profile name synchronization system provides:

✅ **Immediate updates** to all live UI components  
✅ **Persistent storage** in Supabase database  
✅ **Global propagation** through React context  
✅ **Historical preservation** for integrity  
✅ **Seamless user experience** with instant feedback  

Your profile updates are reflected everywhere the system displays your current information, while preserving historical context in content you created previously.
