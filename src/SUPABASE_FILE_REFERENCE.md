# Supabase Integration File Reference

This document provides an overview of all Supabase-related files in the LitLens project.

## Directory Structure

```
/
├── utils/
│   └── supabase/
│       ├── client.ts                 # Supabase client configuration
│       ├── info.tsx                  # Auto-generated project credentials
│       └── types.ts                  # TypeScript database types
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql   # Database schema and RLS policies
│   │   └── 002_seed_data.sql        # Initial seed data
│   └── functions/
│       └── server/
│           ├── index.tsx             # Edge function server
│           └── kv_store.tsx          # Key-value store utilities
│
├── lib/
│   ├── auth-supabase.tsx            # New Supabase authentication context
│   ├── auth.tsx                     # Original local auth (keep for migration)
│   ├── supabase-services.ts         # Data access layer for Supabase
│   ├── supabase-utils.ts            # Utility functions
│   ├── bookData.ts                  # Type definitions
│   ├── data-new.ts                  # Mock data (for reference)
│   └── hooks/
│       ├── useSupabaseBooks.ts      # React hooks for books
│       ├── useSupabaseReviews.ts    # React hooks for reviews
│       ├── useSupabaseReadingLists.ts # React hooks for reading lists
│       └── useSupabaseUserBookStatus.ts # React hooks for book status
│
└── Documentation/
    ├── SUPABASE_SETUP_GUIDE.md      # Setup instructions
    ├── SUPABASE_USAGE_EXAMPLES.md   # Code examples
    ├── SUPABASE_MIGRATION_CHECKLIST.md # Migration checklist
    └── SUPABASE_FILE_REFERENCE.md   # This file
```

## File Descriptions

### Core Configuration Files

#### `/utils/supabase/client.ts`
- **Purpose**: Creates and exports the Supabase client instance
- **Usage**: Import `supabase` from this file to make database queries
- **Key Features**:
  - Configures authentication settings
  - Sets up session persistence
  - Auto-refresh tokens

#### `/utils/supabase/info.tsx`
- **Purpose**: Auto-generated file with project credentials
- **Contains**: 
  - Project ID
  - Public anonymous key
- **Note**: Never edit this file manually

#### `/utils/supabase/types.ts`
- **Purpose**: TypeScript type definitions for database schema
- **Contains**:
  - Table row types
  - Insert types
  - Update types
  - Enum types
- **Usage**: Import types for type-safe database operations

### Database Files

#### `/supabase/migrations/001_initial_schema.sql`
- **Purpose**: Creates all database tables, RLS policies, and triggers
- **Creates**:
  - 10 tables (profiles, books, reviews, etc.)
  - RLS policies for security
  - Indexes for performance
  - Triggers for automatic updates
  - Functions for data integrity
- **Run**: Once in Supabase SQL Editor
- **Order**: Must run before 002_seed_data.sql

#### `/supabase/migrations/002_seed_data.sql`
- **Purpose**: Populates database with initial data
- **Creates**:
  - 10 sample books
  - Helper functions (increment_review_report_count)
- **Run**: After 001_initial_schema.sql completes
- **Note**: Can be run multiple times (will error on duplicate ISBNs)

### Authentication Files

#### `/lib/auth-supabase.tsx`
- **Purpose**: Supabase-powered authentication context
- **Provides**:
  - `useAuth()` hook
  - `login()`, `signup()`, `logout()` functions
  - `updateProfile()` function
  - `reportReview()`, `getReviewReports()`, `updateReportStatus()`
  - `checkUsernameAvailability()` function
- **Key Features**:
  - Real authentication with Supabase Auth
  - Automatic profile creation on signup
  - Session persistence across tabs
  - Real-time auth state updates

#### `/lib/auth.tsx`
- **Purpose**: Original localStorage-based authentication
- **Status**: Keep during migration, delete after
- **Note**: Components use the same interface, so switching is easy

### Service Layer Files

#### `/lib/supabase-services.ts`
- **Purpose**: Data access layer for all Supabase operations
- **Contains**:
  - Books service (CRUD operations)
  - Reviews service (CRUD operations)
  - User book status service
  - Reading lists service
  - Helper functions
- **Pattern**: Service functions return data or null/false on error
- **Usage**: Import specific functions as needed

#### `/lib/supabase-utils.ts`
- **Purpose**: Utility functions for common operations
- **Contains**:
  - Image upload/delete
  - Real-time subscriptions
  - Reading statistics
  - Popular books queries
  - Personalized recommendations
  - Similar books
  - User search
  - Trending discussions
  - Permission checks
  - Batch operations
  - Database stats
  - Date formatting
- **Usage**: Import utilities as needed

### React Hooks Files

#### `/lib/hooks/useSupabaseBooks.ts`
- **Exports**:
  - `useBooks(options)` - Fetch multiple books with filters
  - `useBook(bookId)` - Fetch single book
- **Returns**: `{ books/book, total, loading, error }`
- **Auto-updates**: When options change

#### `/lib/hooks/useSupabaseReviews.ts`
- **Exports**: `useBookReviews(bookId)`
- **Returns**: 
  - `reviews` array
  - `loading`, `error` states
  - `addReview()`, `editReview()`, `removeReview()` functions
  - `refresh()` to reload
- **Features**: Optimistic updates, automatic state management

#### `/lib/hooks/useSupabaseReadingLists.ts`
- **Exports**: `useReadingLists(userId)`
- **Returns**:
  - `readingLists` array
  - `loading`, `error` states
  - `createList()`, `addBook()`, `removeBook()` functions
  - `refresh()` to reload
- **Features**: Nested book data, automatic updates

#### `/lib/hooks/useSupabaseUserBookStatus.ts`
- **Exports**: `useUserBookStatus(userId, bookId)`
- **Returns**:
  - Status booleans: `isReading`, `isCompleted`, `isWantToRead`, `isFavorite`
  - `userRating`
  - `loading`, `error` states
  - Toggle functions for each status
  - `setRating()` function
  - `refresh()` to reload
- **Features**: Multiple statuses per book, automatic sync

### Documentation Files

#### `/SUPABASE_SETUP_GUIDE.md`
- **Purpose**: Step-by-step setup instructions
- **Covers**:
  - Running migrations
  - Creating admin user
  - Configuring authentication
  - Understanding schema
  - Using service layer
  - Troubleshooting

#### `/SUPABASE_USAGE_EXAMPLES.md`
- **Purpose**: Practical code examples
- **Covers**:
  - Authentication patterns
  - Data fetching
  - CRUD operations
  - Admin operations
  - Best practices
- **Format**: Copy-paste ready examples

#### `/SUPABASE_MIGRATION_CHECKLIST.md`
- **Purpose**: Component-by-component migration guide
- **Contains**:
  - 11-phase migration plan
  - Component checklist
  - Testing checklist
  - Priority order
  - Rollback plan

#### `/SUPABASE_FILE_REFERENCE.md`
- **Purpose**: This file - complete file overview
- **Use**: Quick reference for file locations and purposes

## Import Patterns

### Authentication
```typescript
// New Supabase auth
import { useAuth } from './lib/auth-supabase';

// Old local auth (during migration)
import { useAuth } from './lib/auth';
```

### Direct Service Access
```typescript
import { 
  fetchBooks, 
  fetchBookById, 
  createBook 
} from './lib/supabase-services';
```

### Using Hooks (Recommended)
```typescript
import { useBooks, useBook } from './lib/hooks/useSupabaseBooks';
import { useBookReviews } from './lib/hooks/useSupabaseReviews';
import { useReadingLists } from './lib/hooks/useSupabaseReadingLists';
import { useUserBookStatus } from './lib/hooks/useSupabaseUserBookStatus';
```

### Utilities
```typescript
import { 
  getUserReadingStats, 
  getPersonalizedRecommendations,
  formatRelativeTime 
} from './lib/supabase-utils';
```

### Types
```typescript
import type { Database } from './utils/supabase/types';
import type { Book, Review } from './lib/bookData';
```

## Key Concepts

### Service Layer Pattern
- Services handle all database operations
- Services return data or null/false on error
- Services log errors to console
- Components use services through hooks or directly

### Hook Pattern
- Hooks manage loading and error states
- Hooks provide convenience methods (add, edit, delete)
- Hooks auto-update on dependency changes
- Hooks include refresh functions

### Authentication Flow
1. User signs up/logs in through Supabase Auth
2. Database trigger auto-creates profile
3. Auth context fetches and stores profile data
4. Components use `useAuth()` to access user data
5. Session persists across page reloads

### Data Flow
1. Component uses hook or service
2. Service queries Supabase
3. Supabase enforces RLS policies
4. Data returned to component
5. Component renders data

### Security Model
- Row Level Security (RLS) enforces permissions
- Users can only modify their own data
- Admins have elevated permissions
- Public data is read-only for non-authenticated users

## Quick Reference: Common Tasks

### Fetch Books
```typescript
const { books, loading } = useBooks({ genre: 'Fantasy', limit: 20 });
```

### Get Single Book
```typescript
const { book, loading } = useBook(bookId);
```

### Create Review
```typescript
const { addReview } = useBookReviews(bookId);
await addReview({ bookId, userId, userName, rating, title, content });
```

### Manage Reading List
```typescript
const { readingLists, addBook } = useReadingLists(userId);
await addBook(listId, bookId);
```

### Track Book Status
```typescript
const { isReading, toggleReading } = useUserBookStatus(userId, bookId);
await toggleReading(true);
```

### Check if Admin
```typescript
const { user } = useAuth();
const isAdmin = user?.role === 'admin';
```

## Database Schema Quick Reference

### Main Tables
- `profiles` - User accounts and preferences
- `books` - Book catalog
- `reviews` - Book reviews
- `review_reports` - Moderation queue
- `reading_lists` - User-created lists
- `reading_list_books` - Books in lists (junction)
- `user_book_status` - Reading progress tracking
- `discussions` - Community discussions
- `discussion_replies` - Discussion responses
- `book_requests` - User book requests

### Key Relationships
- Profile ← Reviews → Book
- Profile ← Reading List ← Junction → Book
- Profile ← User Book Status → Book
- Review ← Review Reports ← Profile
- Discussion ← Replies ← Profile

## Environment Variables

The project uses Supabase project credentials from `/utils/supabase/info.tsx`:
- `projectId` - Your Supabase project ID
- `publicAnonKey` - Public anonymous key (safe to expose)

No `.env` file needed - credentials are auto-generated.

## Next Steps After Reading This

1. Read `/SUPABASE_SETUP_GUIDE.md` to set up your database
2. Review `/SUPABASE_USAGE_EXAMPLES.md` for code patterns
3. Follow `/SUPABASE_MIGRATION_CHECKLIST.md` to migrate components
4. Refer back to this file when you need to find something

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **SQL Editor**: https://supabase.com/dashboard/project/[project-id]/sql
- **Auth Settings**: https://supabase.com/dashboard/project/[project-id]/auth/users
- **Table Editor**: https://supabase.com/dashboard/project/[project-id]/editor
- **API Docs**: https://supabase.com/dashboard/project/[project-id]/api

## Maintenance

### Adding New Tables
1. Create migration file in `/supabase/migrations/`
2. Define table schema with RLS policies
3. Run migration in SQL Editor
4. Add types to `/utils/supabase/types.ts`
5. Create service functions in `/lib/supabase-services.ts`
6. Create hooks if needed in `/lib/hooks/`

### Modifying Existing Tables
1. Create new migration file (don't edit existing ones)
2. Use ALTER TABLE statements
3. Update types in `/utils/supabase/types.ts`
4. Update affected service functions

### Adding New Features
1. Check if table changes needed
2. Add service functions
3. Create hooks if beneficial
4. Update components to use new functions
5. Add examples to usage guide
6. Test thoroughly
