# LitLens Supabase Backend Setup Guide

This guide will walk you through setting up your Supabase backend for the LitLens application.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Your project is already connected (projectId: nbiybsikchmvncvocezw)

## Step 1: Run Database Migrations

You need to run the SQL migrations to create your database schema:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/nbiybsikchmvncvocezw
2. Navigate to **SQL Editor** in the left sidebar
3. Create a new query and run the contents of `/supabase/migrations/001_initial_schema.sql`
4. After that completes successfully, run `/supabase/migrations/002_seed_data.sql`

### What the migrations do:

**001_initial_schema.sql** creates:
- User profiles table (extends Supabase Auth)
- Books table with full metadata
- Reviews and review reports tables
- Reading lists and book status tracking
- Discussions and replies tables
- Book requests table
- Row Level Security (RLS) policies for data access control
- Automatic triggers for updated_at timestamps
- Automatic profile creation on user signup

**002_seed_data.sql** adds:
- 10 sample books to get you started
- Helper functions for review reporting

## Step 2: Create Admin User

To create an admin user:

1. Go to **Authentication** > **Users** in your Supabase Dashboard
2. Click **Add user** > **Create new user**
3. Enter email: `admin@litlens.com` (or your preferred email)
4. Create a password
5. After creating the user, go to **SQL Editor** and run:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@litlens.com';
```

## Step 3: Update Your Application Code

### Option A: Switch to Supabase Auth (Recommended)

To use the new Supabase authentication system:

1. Open `/App.tsx`
2. Change the import from:
   ```tsx
   import { AuthProvider } from './lib/auth';
   ```
   to:
   ```tsx
   import { AuthProvider } from './lib/auth-supabase';
   ```

### Option B: Keep Local Auth for Development

You can continue using the local localStorage-based authentication for development and testing. The Supabase backend will be ready when you're ready to switch.

## Step 4: Enable Email Authentication (REQUIRED)

You must enable email authentication for users to sign up:

1. Go to **Authentication** > **Providers** in your Supabase Dashboard
2. Find **Email** provider
3. Make sure it is **enabled** (toggle should be ON)
4. Click **Save** if you made changes

### Disable Email Confirmations for Development (Recommended)

By default, Supabase requires email confirmation for new signups. To disable this for development:

1. Go to **Authentication** > **Providers**
2. Click on **Email** provider to expand settings
3. Scroll down and toggle **OFF** "Confirm email"
4. Click **Save**

This allows users to sign up and log in immediately without having to verify their email.

## Step 5: Configure Storage (Optional)

If you want to allow users to upload custom avatars or book covers:

1. Go to **Storage** in your Supabase Dashboard
2. Create a new bucket called `avatars` (make it public)
3. Create a new bucket called `book-covers` (make it public)
4. Set up storage policies as needed

## Database Schema Overview

### Tables

1. **profiles** - User profiles linked to Supabase Auth
   - Stores user metadata (name, username, bio, avatar, reading preferences)
   - Role field for admin access control

2. **books** - Book catalog
   - Full book metadata (title, author, cover, description, etc.)
   - Automatic rating calculation from reviews
   - View and read count tracking

3. **reviews** - User book reviews
   - Linked to users and books
   - Includes rating, title, content
   - Helpful count and reporting flags

4. **review_reports** - Moderation system
   - Users can report inappropriate reviews
   - Admin dashboard for managing reports

5. **reading_lists** - User-created book collections
   - Public/private visibility
   - Many-to-many relationship with books

6. **user_book_status** - Track reading progress
   - Status: reading, completed, want_to_read, favorite
   - User ratings

7. **discussions** - Community discussions
   - Categorized conversations
   - Like and reply counts

8. **discussion_replies** - Discussion responses
   - Nested comments
   - Like counts

9. **book_requests** - User book requests
   - Request new books to be added
   - Admin approval workflow

## Using the Supabase Services

The application includes a comprehensive service layer in `/lib/supabase-services.ts`:

### Books Service
```typescript
import { fetchBooks, fetchBookById, createBook, updateBook, deleteBook } from './lib/supabase-services';

// Fetch books with filters
const { books, total } = await fetchBooks({
  genre: 'Fantasy',
  searchQuery: 'dragon',
  sortBy: 'rating',
  limit: 20
});

// Get single book
const book = await fetchBookById('book-id');

// Create new book (admin only)
const newBook = await createBook({
  title: 'New Book',
  author: 'Author Name',
  // ... other fields
});
```

### Reviews Service
```typescript
import { fetchReviewsForBook, createReview, updateReview, deleteReview } from './lib/supabase-services';

// Get reviews for a book
const reviews = await fetchReviewsForBook('book-id');

// Create a review
const review = await createReview({
  bookId: 'book-id',
  userId: 'user-id',
  userName: 'User Name',
  rating: 5,
  title: 'Great book!',
  content: 'Really enjoyed this...'
});
```

### Reading Lists Service
```typescript
import { 
  fetchUserReadingLists, 
  createReadingList, 
  addBookToReadingList 
} from './lib/supabase-services';

// Get user's reading lists
const lists = await fetchUserReadingLists('user-id');

// Create new list
const newList = await createReadingList(
  'user-id',
  'Summer Reading',
  'Books for summer vacation',
  true // isPublic
);

// Add book to list
await addBookToReadingList('list-id', 'book-id');
```

### User Book Status
```typescript
import { getUserBookStatus, setUserBookStatus } from './lib/supabase-services';

// Check if user has book in any status
const status = await getUserBookStatus('user-id', 'book-id');
// Returns: { isReading, isCompleted, isWantToRead, isFavorite, userRating }

// Mark book as completed
await setUserBookStatus('user-id', 'book-id', 'completed', 5);
```

## Authentication Methods

### Supabase Auth (auth-supabase.tsx)

The new authentication system provides:

- **Email/Password authentication** through Supabase Auth
- **Automatic profile creation** when users sign up
- **Session management** with automatic token refresh
- **Real-time auth state** updates across tabs
- **Username availability checking** before signup
- **Profile updates** function
- **Review reporting** system
- **Admin report management**

### Available Auth Functions

```typescript
import { useAuth } from './lib/auth-supabase';

const { user, login, signup, logout, isLoading, updateProfile } = useAuth();

// Login
const success = await login('email@example.com', 'password');

// Signup
const success = await signup('email@example.com', 'password', 'Full Name', 'username');

// Update profile
await updateProfile({
  name: 'New Name',
  bio: 'My bio',
  preferences: {
    favoriteGenres: ['Fantasy', 'Sci-Fi'],
    readingGoal: 50
  }
});

// Logout
logout();
```

## Row Level Security (RLS)

The database uses Supabase's Row Level Security for fine-grained access control:

- **Public data**: Books, reviews, discussions are viewable by everyone
- **User data**: Users can only modify their own profiles, reviews, and reading lists
- **Admin data**: Only admins can manage books, view reports, and moderate content
- **Private lists**: Reading lists can be public or private

## Testing the Setup

After running migrations and creating an admin user:

1. Try signing up a new user through your app
2. Check if the profile was created automatically in the `profiles` table
3. Try adding a book to favorites or a reading list
4. Create a review for a book
5. Verify the book's rating updates automatically
6. Log in as admin and check the admin panel

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the migrations in order (001 then 002)
- Check the SQL Editor for any error messages

### "row-level security policy violation" error
- RLS policies are enforced - make sure users are authenticated
- Check that the `auth.uid()` matches the user performing the action

### Users can't sign up
- Check if email confirmations are enabled (disable for development)
- Verify the auth trigger is working: `SELECT * FROM profiles;`

### Books aren't showing up
- Run the seed data migration (002_seed_data.sql)
- Or manually insert books through the admin panel

### Admin features not working
- Verify the user's role is set to 'admin' in the profiles table
- Check RLS policies allow admin access

## Next Steps

1. **Migrate existing components** to use Supabase services instead of local data
2. **Add real-time features** using Supabase Realtime subscriptions
3. **Implement file uploads** for user avatars and book covers
4. **Add social features** like following users and book recommendations
5. **Set up backups** for your production database

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase React Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-react)

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Review Supabase logs in the Dashboard
3. Verify your migrations ran successfully
4. Check RLS policies are configured correctly
