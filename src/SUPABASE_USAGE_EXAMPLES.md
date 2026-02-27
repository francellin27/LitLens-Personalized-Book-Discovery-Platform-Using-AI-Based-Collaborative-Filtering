# Supabase Integration Usage Examples

This document provides practical examples of how to use the Supabase integration in your LitLens components.

## Table of Contents
- [Authentication](#authentication)
- [Fetching Books](#fetching-books)
- [Managing Reviews](#managing-reviews)
- [Reading Lists](#reading-lists)
- [User Book Status](#user-book-status)
- [Admin Operations](#admin-operations)

## Authentication

### Basic Auth Usage

```tsx
import { useAuth } from './lib/auth-supabase';

function MyComponent() {
  const { user, login, signup, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <button onClick={() => login('email@example.com', 'password')}>
        Login
      </button>
    );
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Signup with Username Check

```tsx
import { useAuth } from './lib/auth-supabase';
import { useState } from 'react';

function SignupForm() {
  const { signup, checkUsernameAvailability } = useAuth();
  const [username, setUsername] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const handleUsernameChange = async (value: string) => {
    setUsername(value);
    if (value.length >= 3) {
      const available = await checkUsernameAvailability(value);
      setIsAvailable(available);
    }
  };

  const handleSignup = async () => {
    const success = await signup(
      'email@example.com',
      'password',
      'Full Name',
      username
    );
    
    if (success) {
      // Signup successful
    }
  };

  return (
    <div>
      <input 
        value={username}
        onChange={(e) => handleUsernameChange(e.target.value)}
        placeholder="Username"
      />
      {isAvailable === false && <p>Username taken</p>}
      {isAvailable === true && <p>Username available</p>}
      
      <button 
        onClick={handleSignup}
        disabled={!isAvailable}
      >
        Sign Up
      </button>
    </div>
  );
}
```

### Update User Profile

```tsx
import { useAuth } from './lib/auth-supabase';

function ProfileSettings() {
  const { user, updateProfile } = useAuth();

  const handleUpdateProfile = async () => {
    const success = await updateProfile({
      name: 'New Name',
      bio: 'New bio',
      preferences: {
        favoriteGenres: ['Fantasy', 'Science Fiction'],
        readingGoal: 50
      }
    });

    if (success) {
      // Profile updated
    }
  };

  return (
    <button onClick={handleUpdateProfile}>
      Update Profile
    </button>
  );
}
```

## Fetching Books

### Using the useBooks Hook

```tsx
import { useBooks } from './lib/hooks/useSupabaseBooks';

function BookList() {
  const { books, total, loading, error } = useBooks({
    genre: 'Fantasy',
    sortBy: 'rating',
    sortOrder: 'desc',
    limit: 20
  });

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Found {total} books</p>
      {books.map(book => (
        <div key={book.id}>
          <h3>{book.title}</h3>
          <p>{book.author}</p>
          <p>Rating: {book.rating} ({book.totalRatings} reviews)</p>
        </div>
      ))}
    </div>
  );
}
```

### Searching Books

```tsx
import { useBooks } from './lib/hooks/useSupabaseBooks';
import { useState } from 'react';

function SearchBooks() {
  const [searchQuery, setSearchQuery] = useState('');
  const { books, loading } = useBooks({ searchQuery });

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search books..."
      />
      
      {loading ? (
        <div>Searching...</div>
      ) : (
        <div>
          {books.map(book => (
            <div key={book.id}>{book.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Fetch Single Book

```tsx
import { useBook } from './lib/hooks/useSupabaseBooks';

function BookDetails({ bookId }: { bookId: string }) {
  const { book, loading, error } = useBook(bookId);

  if (loading) return <div>Loading book...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div>
      <h1>{book.title}</h1>
      <h2>by {book.author}</h2>
      <p>{book.description}</p>
      <p>Rating: {book.rating}/5 ({book.totalRatings} ratings)</p>
      <p>Pages: {book.pages}</p>
      <p>Published: {book.publishedYear}</p>
    </div>
  );
}
```

### Direct Service Usage (without hooks)

```tsx
import { fetchBooks, fetchBookById } from './lib/supabase-services';
import { useEffect, useState } from 'react';

function BookComponent() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function loadBooks() {
      const result = await fetchBooks({
        genre: 'Fiction',
        limit: 10
      });
      setBooks(result.books);
    }
    loadBooks();
  }, []);

  return <div>{/* Render books */}</div>;
}
```

## Managing Reviews

### Display and Add Reviews

```tsx
import { useBookReviews } from './lib/hooks/useSupabaseReviews';
import { useAuth } from './lib/auth-supabase';

function BookReviews({ bookId }: { bookId: string }) {
  const { user } = useAuth();
  const { reviews, loading, addReview } = useBookReviews(bookId);

  const handleAddReview = async () => {
    if (!user) return;

    const success = await addReview({
      bookId,
      userId: user.id,
      userName: user.name,
      rating: 5,
      title: 'Great book!',
      content: 'I really enjoyed reading this book...'
    });

    if (success) {
      // Review added successfully
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div>
      <button onClick={handleAddReview}>Add Review</button>
      
      {reviews.map(review => (
        <div key={review.id}>
          <h4>{review.title}</h4>
          <p>By {review.userName} - {review.rating}/5 stars</p>
          <p>{review.content}</p>
          <p>{review.helpful} people found this helpful</p>
        </div>
      ))}
    </div>
  );
}
```

### Edit and Delete Reviews

```tsx
import { useBookReviews } from './lib/hooks/useSupabaseReviews';

function UserReviewItem({ review, onEdit, onDelete }) {
  const { editReview, removeReview } = useBookReviews(review.bookId);

  const handleEdit = async () => {
    const success = await editReview(review.id, {
      title: 'Updated title',
      content: 'Updated content',
      rating: 4
    });

    if (success) {
      onEdit();
    }
  };

  const handleDelete = async () => {
    const success = await removeReview(review.id);
    if (success) {
      onDelete();
    }
  };

  return (
    <div>
      <h4>{review.title}</h4>
      <p>{review.content}</p>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
```

## Reading Lists

### Display User's Reading Lists

```tsx
import { useReadingLists } from './lib/hooks/useSupabaseReadingLists';
import { useAuth } from './lib/auth-supabase';

function MyReadingLists() {
  const { user } = useAuth();
  const { readingLists, loading, createList } = useReadingLists(user?.id || null);

  const handleCreateList = async () => {
    const newList = await createList(
      'Summer Reading',
      'Books I want to read this summer',
      true // isPublic
    );

    if (newList) {
      // List created successfully
    }
  };

  if (loading) return <div>Loading lists...</div>;

  return (
    <div>
      <button onClick={handleCreateList}>Create New List</button>
      
      {readingLists.map(list => (
        <div key={list.id}>
          <h3>{list.name}</h3>
          <p>{list.description}</p>
          <p>{list.books.length} books</p>
          {list.isPublic && <span>Public</span>}
        </div>
      ))}
    </div>
  );
}
```

### Add/Remove Books from Lists

```tsx
import { useReadingLists } from './lib/hooks/useSupabaseReadingLists';
import { useAuth } from './lib/auth-supabase';

function AddToListButton({ bookId }: { bookId: string }) {
  const { user } = useAuth();
  const { readingLists, addBook } = useReadingLists(user?.id || null);

  const handleAddToList = async (listId: string) => {
    const success = await addBook(listId, bookId);
    if (success) {
      // Book added to list
    }
  };

  return (
    <div>
      <h4>Add to Reading List</h4>
      {readingLists.map(list => (
        <button key={list.id} onClick={() => handleAddToList(list.id)}>
          {list.name}
        </button>
      ))}
    </div>
  );
}
```

## User Book Status

### Track Reading Status

```tsx
import { useUserBookStatus } from './lib/hooks/useSupabaseUserBookStatus';
import { useAuth } from './lib/auth-supabase';

function BookStatusButtons({ bookId }: { bookId: string }) {
  const { user } = useAuth();
  const {
    isReading,
    isCompleted,
    isWantToRead,
    isFavorite,
    userRating,
    toggleReading,
    toggleCompleted,
    toggleWantToRead,
    toggleFavorite,
    setRating,
    loading
  } = useUserBookStatus(user?.id || null, bookId);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <button 
        onClick={() => toggleReading(!isReading)}
        className={isReading ? 'active' : ''}
      >
        {isReading ? 'Currently Reading' : 'Start Reading'}
      </button>

      <button 
        onClick={() => toggleCompleted(!isCompleted)}
        className={isCompleted ? 'active' : ''}
      >
        {isCompleted ? 'Completed' : 'Mark as Complete'}
      </button>

      <button 
        onClick={() => toggleWantToRead(!isWantToRead)}
        className={isWantToRead ? 'active' : ''}
      >
        {isWantToRead ? 'In Want to Read' : 'Want to Read'}
      </button>

      <button 
        onClick={() => toggleFavorite(!isFavorite)}
        className={isFavorite ? 'active' : ''}
      >
        {isFavorite ? '❤️ Favorite' : '🤍 Add to Favorites'}
      </button>

      {isCompleted && (
        <div>
          <p>Your rating: {userRating || 'Not rated'}</p>
          <button onClick={() => setRating(5)}>Rate 5 stars</button>
        </div>
      )}
    </div>
  );
}
```

## Admin Operations

### Create New Book (Admin Only)

```tsx
import { createBook } from './lib/supabase-services';
import { useAuth } from './lib/auth-supabase';

function AddBookForm() {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return <div>Admin access required</div>;
  }

  const handleAddBook = async () => {
    const newBook = await createBook({
      title: 'New Book Title',
      author: 'Author Name',
      authorInfo: 'About the author...',
      cover: 'https://example.com/cover.jpg',
      genre: ['Fiction', 'Mystery'],
      description: 'Book description...',
      publishedYear: 2024,
      pages: 350,
      isbn: '978-1234567890',
      publisher: 'Publisher Name',
      language: 'English',
      publishingInfo: 'Published in 2024',
      length: '10 hours'
    });

    if (newBook) {
      // Book created successfully
    }
  };

  return (
    <button onClick={handleAddBook}>Add New Book</button>
  );
}
```

### Manage Review Reports

```tsx
import { useAuth } from './lib/auth-supabase';
import { useState, useEffect } from 'react';

function ReviewReportsPanel() {
  const { user, getReviewReports, updateReportStatus } = useAuth();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function loadReports() {
      if (user?.role === 'admin') {
        const data = await getReviewReports();
        setReports(data);
      }
    }
    loadReports();
  }, [user]);

  const handleUpdateStatus = async (reportId: string, status: string) => {
    await updateReportStatus(reportId, status);
    // Reload reports
    const data = await getReviewReports();
    setReports(data);
  };

  if (user?.role !== 'admin') {
    return <div>Admin access required</div>;
  }

  return (
    <div>
      <h2>Review Reports</h2>
      {reports.map(report => (
        <div key={report.id}>
          <p>Review ID: {report.reviewId}</p>
          <p>Reason: {report.reason}</p>
          <p>Description: {report.description}</p>
          <p>Status: {report.status}</p>
          
          <button onClick={() => handleUpdateStatus(report.id, 'reviewed')}>
            Mark as Reviewed
          </button>
          <button onClick={() => handleUpdateStatus(report.id, 'actionTaken')}>
            Action Taken
          </button>
          <button onClick={() => handleUpdateStatus(report.id, 'dismissed')}>
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Best Practices

1. **Always check authentication**: Verify `user` exists before performing user-specific operations
2. **Handle loading states**: Show loading indicators while data is being fetched
3. **Handle errors gracefully**: Display user-friendly error messages
4. **Use hooks for common operations**: Leverage the custom hooks for cleaner code
5. **Refresh data when needed**: Use the `refresh` functions provided by hooks
6. **Check permissions**: Verify user roles before showing admin features
7. **Optimize re-renders**: Use proper dependency arrays in useEffect

## Migration from Local Storage

To migrate existing components from localStorage to Supabase:

1. Replace localStorage reads with Supabase queries
2. Replace localStorage writes with Supabase mutations
3. Update the `AuthProvider` import from `./lib/auth` to `./lib/auth-supabase`
4. Use the custom hooks instead of direct state management
5. Handle async operations properly (localStorage was synchronous)

### Before (Local Storage):
```tsx
const books = JSON.parse(localStorage.getItem('books') || '[]');
```

### After (Supabase):
```tsx
const { books, loading } = useBooks({ limit: 20 });
```
