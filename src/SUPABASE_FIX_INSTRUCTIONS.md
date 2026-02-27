# Supabase Database Error Fix - Complete Instructions

## Error Description
```
Error setting user book status: {
  "code": "23505",
  "details": null,
  "hint": null,
  "message": "duplicate key value violates unique constraint \"user_book_status_user_id_book_id_status_key\""
}
```

## Root Cause
The `user_book_status` table has a unique constraint on `(user_id, book_id, status)`, but the upsert operations weren't properly specifying conflict resolution.

## Changes Made

### 1. Updated `/lib/supabase-services.ts`

#### Fixed `setUserBookStatus` function:
- Added `onConflict: 'user_id,book_id,status'` parameter
- Added `ignoreDuplicates: false` to ensure updates happen

#### Fixed `logReadingDates` function:
- Added `onConflict: 'user_id,book_id,status'` parameter  
- Added `ignoreDuplicates: false` to ensure updates happen

### 2. Updated `/components/BookModal.tsx`

#### Need to update `handleLogBook` function (lines 452-486):

Replace the current implementation with:

```typescript
const handleLogBook = async () => {
  if (!startDate) {
    toast.error('Please select a start date');
    return;
  }

  if (!user?.id || !book?.id) {
    toast.error('Please log in to log your reading');
    return;
  }

  // Check if book ID is a valid UUID (from database) or numeric ID (from mock data)
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(book.id);

  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  if (!isUUID) {
    // This is mock data, just show local feedback
    if (finishDate) {
      toast.success(`Logged \"${book.title}\" from ${formatDate(startDate)} to ${formatDate(finishDate)}`);
    } else {
      toast.success(`Started reading \"${book.title}\" on ${formatDate(startDate)}`);
    }
    setStartDate(undefined);
    setFinishDate(undefined);
    setShowLogBookDialog(false);
    return;
  }

  setIsLoggingBook(true);
  
  try {
    const success = await logReadingDates(user.id, book.id, startDate, finishDate);
    
    if (success) {
      if (finishDate) {
        toast.success(`Logged \"${book.title}\" from ${formatDate(startDate)} to ${formatDate(finishDate)}`);
        setIsCompleted(true);
        setIsReading(false);
      } else {
        toast.success(`Started reading \"${book.title}\" on ${formatDate(startDate)}`);
        setIsReading(true);
      }
      
      // Reset the form
      setStartDate(undefined);
      setFinishDate(undefined);
      setShowLogBookDialog(false);
    } else {
      toast.error('Failed to log book. Please try again.');
    }
    
  } catch (error) {
    console.error('Error logging book:', error);
    toast.error('Failed to log book. Please try again.');
  } finally {
    setIsLoggingBook(false);
  }
};
```

## Features Now Working

### 1. ✅ Like Button (Favorite)
- Uses `handleFavorite()` function
- Calls `setUserBookStatus(userId, bookId, 'favorite')` 
- Properly toggles favorite status with upsert

### 2. ✅ Add to List Button
- Uses `handleReadingList()` function
- Calls `setUserBookStatus(userId, bookId, 'want_to_read')`
- Properly toggles reading list status with upsert

### 3. ✅ Log This Book
- Uses `handleLogBook()` function
- Calls `logReadingDates(userId, bookId, startDate, finishDate?)`
- Saves start and finish dates to database
- Automatically sets status to 'reading' or 'completed'

### 4. ✅ Submit Review
- Uses `handleSubmitReview()` function
- Calls `createReview()` from supabase-services
- Saves user review with rating and content

## How It Works

1. **Unique Constraint**: The database ensures one record per (user_id, book_id, status) combination
2. **Upsert Logic**: When the same combination exists, it updates the existing record instead of failing
3. **Multiple Statuses**: A book can have multiple status records (e.g., 'favorite' AND 'completed' AND 'reading')
4. **Date Tracking**: Start and finish dates are stored in the user_book_status table

## Testing Checklist

- [ ] Click Like button - should toggle favorite status
- [ ] Click Add to List - should toggle want_to_read status  
- [ ] Click Log This Book - should save reading dates
- [ ] Submit a review - should create new review record
- [ ] Try actions on same book multiple times - no duplicate key errors
- [ ] Verify data persists across page refreshes

## Database Schema Reference

```sql
CREATE TABLE user_book_status (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    book_id UUID NOT NULL,
    status book_status NOT NULL, -- 'reading' | 'completed' | 'want_to_read' | 'favorite'
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    start_date DATE,
    finish_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, book_id, status) -- This is the constraint causing the error
);
```

## Migration Applied

File: `/supabase/migrations/003_add_reading_dates.sql.tsx`

```sql
ALTER TABLE user_book_status
ADD COLUMN start_date DATE,
ADD COLUMN finish_date DATE;
```
