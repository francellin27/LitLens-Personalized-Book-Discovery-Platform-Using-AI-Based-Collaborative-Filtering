# Leaderboard Profile Linking Fix

## Issue Description
Clicking on any user in the leaderboard always opened Sarah Mitchell's profile instead of the selected user's profile.

## Root Cause
The `UserProfileView` component was receiving the `userId` prop correctly from the parent component, but it was **completely ignoring it** and always displaying hardcoded mock data for "Sarah Mitchell".

### Before Fix
```typescript
// UserProfileView.tsx - OLD CODE
const MOCK_USER_DATA: UserData = {
  id: 'user_456',
  name: 'Sarah Mitchell',  // ❌ Always hardcoded
  username: 'bookworm_sarah',
  email: 'sarah@example.com',
  // ...
};

export function UserProfileView({ userId, onBack }: UserProfileViewProps) {
  // ❌ userId prop was completely ignored
  const userBooks = MOCK_BOOKS.slice(0, 12); // ❌ Mock data
  // ...
  
  return (
    // Always displayed MOCK_USER_DATA regardless of userId
    <h1>{MOCK_USER_DATA.name}</h1>  // ❌ Always "Sarah Mitchell"
  );
}
```

## Solution Implemented

### 1. Fetch Real User Data from Supabase
The component now properly uses the `userId` prop to fetch the actual user's data from the Supabase database.

```typescript
// UserProfileView.tsx - NEW CODE
export function UserProfileView({ userId, onBack }: UserProfileViewProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, [userId]);  // ✅ Reloads when userId changes

  const loadUserProfile = async () => {
    // ✅ Fetch actual user data from Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, name, username, email, bio, avatar, favorite_genres, created_at')
      .eq('id', userId)  // ✅ Using the passed userId
      .single();

    setUserData({
      id: profile.id,
      name: profile.name || 'Unknown User',
      username: profile.username || 'user',
      // ... all real data
    });
  };
}
```

### 2. Load User's Actual Books
The component now fetches the user's real book collection from the database.

```typescript
// Fetch user's book statuses
const { data: bookStatuses } = await supabase
  .from('user_book_status')
  .select(`
    book_id,
    status,
    books (*)
  `)
  .eq('user_id', userId);  // ✅ Using the passed userId

// Categorize books by status
bookStatuses.forEach((status: any) => {
  if (status.books) {
    const book = transformDbBookToBook(status.books);
    
    if (status.status === 'reading') {
      reading.push(book);
    } else if (status.status === 'favorite') {
      favorited.push(book);
    } else if (status.status === 'want_to_read') {
      toRead.push(book);
    }
  }
});
```

### 3. Added Loading and Error States

```typescript
if (isLoading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-12 h-12 animate-spin" />
      <p>Loading profile...</p>
    </div>
  );
}

if (!userData) {
  return (
    <Card>
      <CardContent>
        <p>User not found</p>
      </CardContent>
    </Card>
  );
}
```

### 4. Added Empty States for Book Collections

```typescript
{currentlyReading.length > 0 ? (
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {currentlyReading.map((book) => (
      <BookCard key={book.id} book={book} onClick={() => openBookModal(book)} />
    ))}
  </div>
) : (
  <p className="text-sm text-muted-foreground py-4">No books currently being read</p>
)}
```

## Files Modified

### `/components/UserProfileView.tsx`
**Changes:**
- ✅ Removed hardcoded `MOCK_USER_DATA` constant
- ✅ Added `useState` hooks for dynamic data (`userData`, `userBooks`, etc.)
- ✅ Added `useEffect` to fetch data when `userId` changes
- ✅ Implemented `loadUserProfile()` function to fetch from Supabase
- ✅ Added `transformDbBookToBook()` helper function
- ✅ Added loading state with spinner
- ✅ Added "user not found" error state
- ✅ Added empty states for book collections
- ✅ Fixed toast import to use `sonner@2.0.3`

## Data Flow

```
User clicks leaderboard entry
         ↓
CommunityPage calls onViewUser(user.id)
         ↓
App.tsx handleViewUser(userId) sets viewingUserId state
         ↓
App.tsx renders <UserProfileView userId={viewingUserId} />
         ↓
UserProfileView receives userId prop
         ↓
useEffect triggers loadUserProfile()
         ↓
Fetches user data from Supabase profiles table
         ↓
Fetches user's books from user_book_status table
         ↓
Displays personalized profile with real data
```

## Features Now Working

### ✅ Profile Display
- Shows actual user's name, username, avatar
- Displays real bio and favorite genres
- Shows join date from database

### ✅ Reading Stats
- Actual books read count
- Real favorite books count
- Accurate "want to read" count
- Dynamic progress bar based on real data

### ✅ Book Collections
- Currently Reading: Books with status='reading'
- Favorites: Books with status='favorite'
- Want to Read: Books with status='want_to_read'
- All data fetched from database based on userId

### ✅ Loading States
- Spinner while loading profile data
- "User not found" message for invalid userIds
- Empty states for collections with no books

## Testing

### Test Scenario 1: Click Different Users
1. Go to Community page
2. Click on Leaderboard tab
3. Click on different users in the leaderboard
4. **Expected**: Each user opens their own unique profile
5. **Result**: ✅ Works correctly

### Test Scenario 2: User With Books
1. Click a user who has logged books
2. **Expected**: See their actual book collections
3. **Result**: ✅ Shows real books categorized correctly

### Test Scenario 3: New User Without Books
1. Click a newly created user
2. **Expected**: Empty state messages for book collections
3. **Result**: ✅ Shows "No books currently being read", etc.

### Test Scenario 4: Invalid User ID
1. Manually set an invalid userId in App.tsx
2. **Expected**: "User not found" message
3. **Result**: ✅ Shows error state gracefully

## Database Queries Used

### Fetch User Profile
```sql
SELECT id, name, username, email, bio, avatar, favorite_genres, created_at
FROM profiles
WHERE id = $userId;
```

### Fetch User's Books
```sql
SELECT book_id, status, books.*
FROM user_book_status
JOIN books ON books.id = user_book_status.book_id
WHERE user_id = $userId;
```

## Migration Requirements

**None** - This fix uses existing database tables:
- `profiles` (already exists)
- `user_book_status` (already exists)
- `books` (already exists)

No new migrations are required.

## Known Limitations

### Reading Goal
Currently hardcoded to 75 books. To make this dynamic:
```sql
-- Future migration to add reading_goal column
ALTER TABLE profiles ADD COLUMN reading_goal INTEGER DEFAULT 75;
```

### Performance
For users with many books, consider adding pagination:
```typescript
// Future enhancement
const { data } = await supabase
  .from('user_book_status')
  .select('*')
  .eq('user_id', userId)
  .limit(50)  // Pagination
  .order('created_at', { ascending: false });
```

## Benefits

### ✅ User Experience
- Each user has a unique, personalized profile
- Real data shows actual reading progress
- Accurate book collections

### ✅ Data Integrity
- No more hardcoded mock data
- All data comes from authoritative source (database)
- Consistent with rest of application

### ✅ Scalability
- Works for any number of users
- Handles users with no books gracefully
- Efficient Supabase queries

## Related Components

These components correctly pass `userId` and don't need changes:
- ✅ `/App.tsx` - Correctly passes userId to UserProfileView
- ✅ `/components/CommunityPage.tsx` - Correctly calls onViewUser(user.id)
- ✅ `/components/HomePage.tsx` - Correctly passes onViewUser handler
- ✅ `/components/SearchPage.tsx` - Correctly passes onViewUser handler

## Verification Checklist

- [x] Each leaderboard user opens their own profile
- [x] Profile displays correct user data (name, username, avatar, bio)
- [x] Book collections are user-specific
- [x] Loading state shows while fetching data
- [x] Error state shows for invalid users
- [x] Empty states show when user has no books
- [x] Back button returns to Community page
- [x] Book modals open correctly
- [x] No console errors
- [x] TypeScript compiles without errors

## Future Enhancements

### 1. Add Reading Goal to Database
```typescript
// Migration
ALTER TABLE profiles ADD COLUMN reading_goal INTEGER DEFAULT 75;

// Component
const { data: profile } = await supabase
  .from('profiles')
  .select('*, reading_goal')  // Include reading_goal
  .eq('id', userId)
  .single();

setUserData({
  // ...
  readingGoal: profile.reading_goal || 75
});
```

### 2. Add Review Count
```typescript
// Fetch user's review count
const { count: reviewCount } = await supabase
  .from('reviews')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', userId);
```

### 3. Add Follow/Unfollow Feature
```typescript
// Add follow button to profile
<Button onClick={() => handleFollowUser(userId)}>
  {isFollowing ? 'Unfollow' : 'Follow'}
</Button>
```

### 4. Add Activity Feed
```typescript
// Show recent activities
const { data: activities } = await supabase
  .from('user_activities')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(10);
```

## Summary

The leaderboard profile linking issue has been completely resolved. The `UserProfileView` component now:
- ✅ Uses the passed `userId` prop
- ✅ Fetches real user data from Supabase
- ✅ Displays personalized information for each user
- ✅ Shows actual book collections
- ✅ Handles loading and error states gracefully

Users can now click on any leaderboard entry and view that specific user's unique profile with their personal reading data.
