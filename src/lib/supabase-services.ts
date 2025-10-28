// Supabase service layer for LitLens
import { supabase } from '../utils/supabase/client';
import type { Book, Review } from './bookData';

// ============ BOOKS SERVICE ============

export async function fetchBooks(options?: {
  genre?: string;
  author?: string;
  publisher?: string;
  language?: string;
  year?: number;
  searchQuery?: string;
  sortBy?: 'rating' | 'title' | 'published_year' | 'read_count';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}): Promise<{ books: Book[]; total: number }> {
  try {
    let query = supabase.from('books').select('*', { count: 'exact' });

    // Apply filters
    if (options?.genre && options.genre !== 'All') {
      query = query.contains('genre', [options.genre]);
    }

    if (options?.author) {
      query = query.ilike('author', `%${options.author}%`);
    }

    if (options?.publisher && options.publisher !== 'All Publishers') {
      query = query.eq('publisher', options.publisher);
    }

    if (options?.language && options.language !== 'All Languages') {
      query = query.eq('language', options.language);
    }

    if (options?.year) {
      query = query.eq('published_year', options.year);
    }

    if (options?.searchQuery) {
      query = query.or(
        `title.ilike.%${options.searchQuery}%,author.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%`
      );
    }

    // Apply sorting
    const sortBy = options?.sortBy || 'rating';
    const sortOrder = options?.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching books:', error);
      return { books: [], total: 0 };
    }

    const books = data.map(dbBook => transformDbBookToBook(dbBook));
    return { books, total: count || 0 };
  } catch (error) {
    console.error('Error fetching books:', error);
    return { books: [], total: 0 };
  }
}

export async function fetchBookById(bookId: string): Promise<Book | null> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single();

    if (error || !data) {
      console.error('Error fetching book:', error);
      return null;
    }

    // Increment view count
    await supabase
      .from('books')
      .update({ view_count: data.view_count + 1 })
      .eq('id', bookId);

    return transformDbBookToBook(data);
  } catch (error) {
    console.error('Error fetching book:', error);
    return null;
  }
}

export async function createBook(bookData: Omit<Book, 'id' | 'rating' | 'totalRatings' | 'viewCount' | 'readCount'>): Promise<Book | null> {
  try {
    const { data, error } = await supabase
      .from('books')
      .insert({
        title: bookData.title,
        author: bookData.author,
        author_info: bookData.authorInfo,
        cover: bookData.cover,
        genre: bookData.genre,
        description: bookData.description,
        published_year: bookData.publishedYear,
        pages: bookData.pages,
        isbn: bookData.isbn,
        publisher: bookData.publisher,
        language: bookData.language,
        publishing_info: bookData.publishingInfo,
        length: bookData.length,
      })
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating book:', error);
      return null;
    }

    return transformDbBookToBook(data);
  } catch (error) {
    console.error('Error creating book:', error);
    return null;
  }
}

export async function updateBook(bookId: string, updates: Partial<Book>): Promise<boolean> {
  try {
    const dbUpdates: any = {};

    if (updates.title) dbUpdates.title = updates.title;
    if (updates.author) dbUpdates.author = updates.author;
    if (updates.authorInfo !== undefined) dbUpdates.author_info = updates.authorInfo;
    if (updates.cover) dbUpdates.cover = updates.cover;
    if (updates.genre) dbUpdates.genre = updates.genre;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.publishedYear) dbUpdates.published_year = updates.publishedYear;
    if (updates.pages) dbUpdates.pages = updates.pages;
    if (updates.isbn) dbUpdates.isbn = updates.isbn;
    if (updates.publisher) dbUpdates.publisher = updates.publisher;
    if (updates.language) dbUpdates.language = updates.language;
    if (updates.publishingInfo !== undefined) dbUpdates.publishing_info = updates.publishingInfo;
    if (updates.length) dbUpdates.length = updates.length;

    const { error } = await supabase
      .from('books')
      .update(dbUpdates)
      .eq('id', bookId);

    if (error) {
      console.error('Error updating book:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating book:', error);
    return false;
  }
}

export async function deleteBook(bookId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', bookId);

    if (error) {
      console.error('Error deleting book:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting book:', error);
    return false;
  }
}

// ============ REVIEWS SERVICE ============

export async function fetchAllReviews(): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:profiles!reviews_user_id_fkey(name, username, avatar)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all reviews:', error);
      return [];
    }

    return data.map(review => ({
      id: review.id,
      bookId: review.book_id,
      userId: review.user_id,
      userName: review.user?.name || 'Unknown User',
      userAvatar: review.user?.avatar,
      rating: review.rating,
      title: review.title,
      content: review.content,
      date: review.created_at,
      helpful: review.helpful,
      isReported: review.is_reported,
      reportCount: review.report_count
    }));
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    return [];
  }
}

export async function fetchReviewsForBook(bookId: string): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:profiles!reviews_user_id_fkey(name, username, avatar)
      `)
      .eq('book_id', bookId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    return data.map(review => ({
      id: review.id,
      bookId: review.book_id,
      userId: review.user_id,
      userName: review.user?.name || 'Unknown User',
      userAvatar: review.user?.avatar,
      rating: review.rating,
      title: review.title,
      content: review.content,
      date: review.created_at,
      helpful: review.helpful,
      isReported: review.is_reported,
      reportCount: review.report_count
    }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export async function createReview(review: Omit<Review, 'id' | 'date' | 'helpful'>): Promise<Review | null> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        book_id: review.bookId,
        user_id: review.userId,
        rating: review.rating,
        title: review.title || null, // Handle undefined/empty title
        content: review.content,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating review:', error);
      
      // Check for unique constraint violation (user already reviewed this book)
      if (error.code === '23505') {
        console.error('User has already reviewed this book');
      }
      
      return null;
    }

    if (!data) {
      console.error('No data returned from review creation');
      return null;
    }

    // Fetch user info for the review
    const { data: userData } = await supabase
      .from('profiles')
      .select('name, username, avatar')
      .eq('id', data.user_id)
      .single();

    return {
      id: data.id,
      bookId: data.book_id,
      userId: data.user_id,
      userName: userData?.name || userData?.username || 'Unknown User',
      userAvatar: userData?.avatar,
      rating: data.rating,
      title: data.title,
      content: data.content,
      date: data.created_at,
      helpful: data.helpful || 0,
      isReported: data.is_reported || false,
      reportCount: data.report_count || 0
    };
  } catch (error) {
    console.error('Error creating review:', error);
    return null;
  }
}

export async function updateReview(reviewId: string, updates: Partial<Review>): Promise<boolean> {
  try {
    const dbUpdates: any = {};

    if (updates.rating) dbUpdates.rating = updates.rating;
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.content) dbUpdates.content = updates.content;

    const { error } = await supabase
      .from('reviews')
      .update(dbUpdates)
      .eq('id', reviewId);

    if (error) {
      console.error('Error updating review:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating review:', error);
    return false;
  }
}

export async function deleteReview(reviewId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      console.error('Error deleting review:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting review:', error);
    return false;
  }
}

// ============ USER BOOK STATUS SERVICE ============

export async function getUserBookStatus(userId: string, bookId: string): Promise<{
  isReading?: boolean;
  isCompleted?: boolean;
  isWantToRead?: boolean;
  isFavorite?: boolean;
  userRating?: number;
  startDate?: string;
  finishDate?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('user_book_status')
      .select('status, user_rating, start_date, finish_date')
      .eq('user_id', userId)
      .eq('book_id', bookId);

    if (error || !data) {
      return {};
    }

    const statuses = data.reduce((acc, item) => {
      if (item.status === 'reading') acc.isReading = true;
      if (item.status === 'completed') acc.isCompleted = true;
      if (item.status === 'want_to_read') acc.isWantToRead = true;
      if (item.status === 'favorite') acc.isFavorite = true;
      if (item.user_rating) acc.userRating = item.user_rating;
      if (item.start_date) acc.startDate = item.start_date;
      if (item.finish_date) acc.finishDate = item.finish_date;
      return acc;
    }, {} as any);

    return statuses;
  } catch (error) {
    console.error('Error fetching user book status:', error);
    return {};
  }
}

export async function setUserBookStatus(
  userId: string,
  bookId: string,
  status: 'reading' | 'completed' | 'want_to_read' | 'favorite',
  userRating?: number,
  startDate?: Date,
  finishDate?: Date
): Promise<boolean> {
  try {
    const updateData: any = {
      user_id: userId,
      book_id: bookId,
      status,
    };

    if (userRating !== undefined) {
      updateData.user_rating = userRating;
    }

    if (startDate !== undefined) {
      updateData.start_date = startDate.toISOString().split('T')[0];
    }

    if (finishDate !== undefined) {
      updateData.finish_date = finishDate.toISOString().split('T')[0];
    }

    const { error } = await supabase
      .from('user_book_status')
      .upsert(updateData, {
        onConflict: 'user_id,book_id,status',
        ignoreDuplicates: false
      });

    if (error) {
      console.error('Error setting user book status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error setting user book status:', error);
    return false;
  }
}

export async function removeUserBookStatus(
  userId: string,
  bookId: string,
  status: 'reading' | 'completed' | 'want_to_read' | 'favorite'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_book_status')
      .delete()
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .eq('status', status);

    if (error) {
      console.error('Error removing user book status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error removing user book status:', error);
    return false;
  }
}

export async function logReadingDates(
  userId: string,
  bookId: string,
  startDate: Date,
  finishDate?: Date | null
): Promise<boolean> {
  try {
    // If finish date is provided, set status to completed, otherwise reading
    const status = finishDate ? 'completed' : 'reading';
    
    // First, check if the start_date column exists by attempting a simple query
    const { error: checkError } = await supabase
      .from('user_book_status')
      .select('start_date')
      .limit(1);

    // Build update data - only include date fields if columns exist
    const updateData: any = {
      user_id: userId,
      book_id: bookId,
      status,
    };

    // If the column exists (no error), include the dates
    if (!checkError) {
      updateData.start_date = startDate.toISOString().split('T')[0];
      if (finishDate) {
        updateData.finish_date = finishDate.toISOString().split('T')[0];
      }
    } else {
      console.warn('Date columns not found in user_book_status table. Skipping date logging. Run migration 003_add_reading_dates.sql to enable date tracking.');
      
      // Show migration instructions in console
      if (typeof window !== 'undefined') {
        import('../lib/migrationHelper').then(({ logMigrationInstructions }) => {
          logMigrationInstructions();
        });
      }
    }

    const { error } = await supabase
      .from('user_book_status')
      .upsert(updateData, {
        onConflict: 'user_id,book_id,status',
        ignoreDuplicates: false
      });

    if (error) {
      console.error('Error logging reading dates:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error logging reading dates:', error);
    return false;
  }
}

// ============ READING LISTS SERVICE ============

export interface ReadingList {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  books: Book[];
  createdAt: string;
  updatedAt: string;
}

export async function fetchUserReadingLists(userId: string): Promise<ReadingList[]> {
  try {
    const { data, error } = await supabase
      .from('reading_lists')
      .select(`
        *,
        reading_list_books(
          book_id,
          books(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reading lists:', error);
      return [];
    }

    return data.map(list => ({
      id: list.id,
      userId: list.user_id,
      name: list.name,
      description: list.description || undefined,
      isPublic: list.is_public,
      books: list.reading_list_books.map((rlb: any) => transformDbBookToBook(rlb.books)),
      createdAt: list.created_at,
      updatedAt: list.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching reading lists:', error);
    return [];
  }
}

export async function createReadingList(
  userId: string,
  name: string,
  description?: string,
  isPublic: boolean = false
): Promise<ReadingList | null> {
  try {
    const { data, error } = await supabase
      .from('reading_lists')
      .insert({
        user_id: userId,
        name,
        description,
        is_public: isPublic,
      })
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating reading list:', error);
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      description: data.description || undefined,
      isPublic: data.is_public,
      books: [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error creating reading list:', error);
    return null;
  }
}

export async function addBookToReadingList(readingListId: string, bookId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('reading_list_books')
      .insert({
        reading_list_id: readingListId,
        book_id: bookId,
      });

    if (error) {
      console.error('Error adding book to reading list:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error adding book to reading list:', error);
    return false;
  }
}

export async function removeBookFromReadingList(readingListId: string, bookId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('reading_list_books')
      .delete()
      .eq('reading_list_id', readingListId)
      .eq('book_id', bookId);

    if (error) {
      console.error('Error removing book from reading list:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error removing book from reading list:', error);
    return false;
  }
}

// ============ USER MANAGEMENT SERVICE ============

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  bio?: string;
  favoriteGenres: string[];
  createdAt: string;
  booksRead: number;
}

export async function fetchAllUsers(roleFilter?: 'user' | 'admin'): Promise<UserProfile[]> {
  try {
    // First, get all profiles
    let profileQuery = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (roleFilter) {
      profileQuery = profileQuery.eq('role', roleFilter);
    }

    const { data: profiles, error: profileError } = await profileQuery;

    if (profileError) {
      console.error('❌ Error fetching users:', profileError);
      return [];
    }

    console.log(`📊 Fetched ${profiles.length} profiles with role filter: ${roleFilter || 'all'}`);

    // Then, for each profile, count their completed books
    const usersWithCounts = await Promise.all(
      profiles.map(async (profile) => {
        const { count, error: countError } = await supabase
          .from('user_book_status')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id)
          .eq('status', 'completed');

        if (countError) {
          console.error(`❌ Error counting books for user ${profile.name}:`, countError);
          console.error('💡 This might be an RLS policy issue. Make sure admins can view all user_book_status records.');
          console.error('📝 Run migration: /supabase/migrations/011_admin_view_user_book_status.sql');
        }

        console.log(`📚 User: ${profile.name} (${profile.email}) - Books Read: ${count || 0}${countError ? ' (ERROR - check RLS policies)' : ''}`);

        return {
          id: profile.id,
          name: profile.name || 'Unknown User',
          username: profile.username,
          email: profile.email || '',
          role: profile.role,
          bio: profile.bio || undefined,
          favoriteGenres: profile.favorite_genres || [],
          createdAt: profile.created_at,
          booksRead: count || 0,
        };
      })
    );

    console.log(`✅ Successfully fetched ${usersWithCounts.length} users with book counts`);
    return usersWithCounts;
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return [];
  }
}

export async function updateUserRole(userId: string, role: 'user' | 'admin'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user role:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<{
    name: string;
    username: string;
    bio: string;
    avatar: string;
    favoriteGenres: string[];
  }>
): Promise<boolean> {
  try {
    const dbUpdates: any = {};
    
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.username !== undefined) dbUpdates.username = updates.username;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
    if (updates.favoriteGenres !== undefined) dbUpdates.favorite_genres = updates.favoriteGenres;

    const { error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}

export async function deleteUserAccount(userId: string): Promise<boolean> {
  try {
    // Note: This only deletes the profile. The auth.users entry should be handled by Supabase Auth
    // or through the admin API if needed
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user account:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting user account:', error);
    return false;
  }
}

export async function updateUserBooksRead(userId: string, targetCount: number): Promise<boolean> {
  try {
    console.log(`📝 Updating books read count for user ${userId} to ${targetCount}`);
    
    // First, get current count of completed books
    const { count: currentCount, error: countError } = await supabase
      .from('user_book_status')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'completed');

    if (countError) {
      console.error('Error getting current books read count:', countError);
      return false;
    }

    const current = currentCount || 0;
    console.log(`📊 Current count: ${current}, Target count: ${targetCount}`);

    if (current === targetCount) {
      console.log('✅ Count already matches target');
      return true;
    }

    // Get all books to use as references
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('id')
      .limit(100);

    if (booksError || !books || books.length === 0) {
      console.error('Error fetching books for adjustment:', booksError);
      return false;
    }

    if (targetCount > current) {
      // Need to add more completed books
      const toAdd = targetCount - current;
      console.log(`➕ Adding ${toAdd} completed book entries`);
      
      // Get existing completed books for this user
      const { data: existingStatuses } = await supabase
        .from('user_book_status')
        .select('book_id')
        .eq('user_id', userId)
        .eq('status', 'completed');

      const existingBookIds = new Set(existingStatuses?.map(s => s.book_id) || []);
      
      // Find books not yet marked as completed
      const availableBooks = books.filter(b => !existingBookIds.has(b.id));
      
      if (availableBooks.length < toAdd) {
        console.error(`Not enough books available to add ${toAdd} entries (only ${availableBooks.length} available)`);
        return false;
      }

      // Add new completed book entries
      const newEntries = availableBooks.slice(0, toAdd).map(book => ({
        user_id: userId,
        book_id: book.id,
        status: 'completed' as const,
        start_date: new Date().toISOString().split('T')[0],
        finish_date: new Date().toISOString().split('T')[0]
      }));

      const { error: insertError } = await supabase
        .from('user_book_status')
        .insert(newEntries);

      if (insertError) {
        console.error('Error adding completed books:', insertError);
        return false;
      }

      console.log(`✅ Successfully added ${toAdd} completed book entries`);
    } else {
      // Need to remove some completed books
      const toRemove = current - targetCount;
      console.log(`➖ Removing ${toRemove} completed book entries`);

      // Get completed books for this user
      const { data: completedBooks, error: fetchError } = await supabase
        .from('user_book_status')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .limit(toRemove);

      if (fetchError || !completedBooks) {
        console.error('Error fetching completed books to remove:', fetchError);
        return false;
      }

      // Delete the entries
      const idsToDelete = completedBooks.map(b => b.id);
      const { error: deleteError } = await supabase
        .from('user_book_status')
        .delete()
        .in('id', idsToDelete);

      if (deleteError) {
        console.error('Error removing completed books:', deleteError);
        return false;
      }

      console.log(`✅ Successfully removed ${toRemove} completed book entries`);
    }

    return true;
  } catch (error) {
    console.error('Error updating user books read count:', error);
    return false;
  }
}

// ============ BOOK REQUESTS SERVICE ============

export interface BookRequest {
  id: string;
  userId: string;
  userName?: string;
  title: string;
  author: string;
  isbn?: string;
  additionalNotes?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export async function fetchBookRequests(status?: 'pending' | 'approved' | 'rejected'): Promise<BookRequest[]> {
  try {
    let query = supabase
      .from('book_requests')
      .select(`
        *,
        user:profiles!book_requests_user_id_fkey(name, username)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching book requests:', error);
      return [];
    }

    return data.map(request => ({
      id: request.id,
      userId: request.user_id,
      userName: request.user?.name || 'Unknown User',
      title: request.title,
      author: request.author,
      isbn: request.isbn || undefined,
      additionalNotes: request.additional_notes || undefined,
      status: request.status,
      createdAt: request.created_at,
      updatedAt: request.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching book requests:', error);
    return [];
  }
}

export async function createBookRequest(
  userId: string,
  title: string,
  author: string,
  isbn?: string,
  additionalNotes?: string
): Promise<BookRequest | null> {
  try {
    const { data, error } = await supabase
      .from('book_requests')
      .insert({
        user_id: userId,
        title,
        author,
        isbn: isbn || null,
        additional_notes: additionalNotes || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating book request:', error);
      return null;
    }

    // Fetch user info
    const { data: userData } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', userId)
      .single();

    return {
      id: data.id,
      userId: data.user_id,
      userName: userData?.name || 'Unknown User',
      title: data.title,
      author: data.author,
      isbn: data.isbn || undefined,
      additionalNotes: data.additional_notes || undefined,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error creating book request:', error);
    return null;
  }
}

export async function updateBookRequestStatus(
  requestId: string,
  status: 'pending' | 'approved' | 'rejected'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('book_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', requestId);

    if (error) {
      console.error('Error updating book request status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating book request status:', error);
    return false;
  }
}

export async function deleteBookRequest(requestId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('book_requests')
      .delete()
      .eq('id', requestId);

    if (error) {
      console.error('Error deleting book request:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting book request:', error);
    return false;
  }
}

// ============ DISCUSSIONS SERVICE ============

export interface Discussion {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  content: string;
  category: string;
  bookId?: string;
  bookTitle?: string;
  bookCover?: string;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
}

export async function fetchAllDiscussions(): Promise<Discussion[]> {
  try {
    const { data, error } = await supabase
      .from('discussions')
      .select(`
        *,
        user:profiles!discussions_author_id_fkey(name, username, avatar),
        book:books(title, cover),
        replies:discussion_replies(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching discussions:', error);
      return [];
    }

    return data.map(discussion => ({
      id: discussion.id,
      userId: discussion.author_id,
      userName: discussion.user?.name || 'Unknown User',
      userAvatar: discussion.user?.avatar,
      title: discussion.title,
      content: discussion.content,
      category: discussion.category,
      bookId: discussion.book_id || undefined,
      bookTitle: discussion.book?.title || undefined,
      bookCover: discussion.book?.cover || undefined,
      replyCount: discussion.replies?.[0]?.count || 0,
      createdAt: discussion.created_at,
      updatedAt: discussion.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return [];
  }
}

export async function fetchDiscussionById(discussionId: string): Promise<Discussion | null> {
  try {
    const { data, error } = await supabase
      .from('discussions')
      .select(`
        *,
        user:profiles!discussions_author_id_fkey(name, username, avatar),
        book:books(title, cover),
        replies:discussion_replies(count)
      `)
      .eq('id', discussionId)
      .single();

    if (error || !data) {
      console.error('Error fetching discussion:', error);
      return null;
    }

    return {
      id: data.id,
      userId: data.author_id,
      userName: data.user?.name || 'Unknown User',
      userAvatar: data.user?.avatar,
      title: data.title,
      content: data.content,
      category: data.category,
      bookId: data.book_id || undefined,
      bookTitle: data.book?.title || undefined,
      bookCover: data.book?.cover || undefined,
      replyCount: data.replies?.[0]?.count || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error fetching discussion:', error);
    return null;
  }
}

export async function createDiscussion(
  userId: string,
  title: string,
  content: string,
  category: string,
  bookId?: string
): Promise<Discussion | null> {
  try {
    const { data, error } = await supabase
      .from('discussions')
      .insert({
        author_id: userId,
        title,
        content,
        category,
        book_id: bookId || null,
      })
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating discussion:', error);
      return null;
    }

    // Fetch user and book info
    const { data: userData } = await supabase
      .from('profiles')
      .select('name, username, avatar')
      .eq('id', userId)
      .single();

    let bookData = null;
    if (bookId) {
      const { data: bookResult } = await supabase
        .from('books')
        .select('title, cover')
        .eq('id', bookId)
        .single();
      bookData = bookResult;
    }

    return {
      id: data.id,
      userId: data.author_id,
      userName: userData?.name || 'Unknown User',
      userAvatar: userData?.avatar,
      title: data.title,
      content: data.content,
      category: data.category,
      bookId: data.book_id || undefined,
      bookTitle: bookData?.title || undefined,
      bookCover: bookData?.cover || undefined,
      replyCount: 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error creating discussion:', error);
    return null;
  }
}

export async function updateDiscussion(
  discussionId: string,
  updates: Partial<{ title: string; content: string; category: string }>
): Promise<boolean> {
  try {
    const dbUpdates: any = {};
    
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.content) dbUpdates.content = updates.content;
    if (updates.category) dbUpdates.category = updates.category;
    
    dbUpdates.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('discussions')
      .update(dbUpdates)
      .eq('id', discussionId);

    if (error) {
      console.error('Error updating discussion:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating discussion:', error);
    return false;
  }
}

export async function deleteDiscussion(discussionId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('discussions')
      .delete()
      .eq('id', discussionId);

    if (error) {
      console.error('Error deleting discussion:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting discussion:', error);
    return false;
  }
}

// ============ DISCUSSION REPLIES SERVICE ============

export interface DiscussionReply {
  id: string;
  discussionId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchDiscussionReplies(discussionId: string): Promise<DiscussionReply[]> {
  try {
    const { data, error } = await supabase
      .from('discussion_replies')
      .select(`
        *,
        user:profiles!discussion_replies_author_id_fkey(name, username, avatar)
      `)
      .eq('discussion_id', discussionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching discussion replies:', error);
      return [];
    }

    return data.map(reply => ({
      id: reply.id,
      discussionId: reply.discussion_id,
      userId: reply.author_id,
      userName: reply.user?.name || 'Unknown User',
      userAvatar: reply.user?.avatar,
      content: reply.content,
      createdAt: reply.created_at,
      updatedAt: reply.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching discussion replies:', error);
    return [];
  }
}

export async function createDiscussionReply(
  discussionId: string,
  userId: string,
  content: string
): Promise<DiscussionReply | null> {
  try {
    const { data, error } = await supabase
      .from('discussion_replies')
      .insert({
        discussion_id: discussionId,
        author_id: userId,
        content,
      })
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating discussion reply:', error);
      return null;
    }

    // Fetch user info
    const { data: userData } = await supabase
      .from('profiles')
      .select('name, username, avatar')
      .eq('id', userId)
      .single();

    return {
      id: data.id,
      discussionId: data.discussion_id,
      userId: data.author_id,
      userName: userData?.name || 'Unknown User',
      userAvatar: userData?.avatar,
      content: data.content,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error creating discussion reply:', error);
    return null;
  }
}

export async function deleteDiscussionReply(replyId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('discussion_replies')
      .delete()
      .eq('id', replyId);

    if (error) {
      console.error('Error deleting discussion reply:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting discussion reply:', error);
    return false;
  }
}

// ============ DISCUSSION REPORTS SERVICE ============

export interface DiscussionReport {
  id: string;
  discussionId: string;
  reporterId: string;
  reporterName: string;
  contentTitle: string;
  contentType: 'Discussion' | 'Reply';
  originalAuthor: string;
  reason: 'Spam/Promotional' | 'Harassment' | 'Inappropriate Content' | 'Misinformation' | 'Off-topic' | 'Other';
  description?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  updatedAt: string;
  resolvedBy?: string;
  resolvedAt?: string;
  adminNotes?: string;
}

export async function fetchAllDiscussionReports(status?: 'pending' | 'resolved' | 'dismissed'): Promise<DiscussionReport[]> {
  try {
    console.log('🔧 fetchAllDiscussionReports called with status:', status);

    let query = supabase
      .from('discussion_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Supabase error fetching discussion reports:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return [];
    }

    if (!data) {
      console.warn('⚠️ No data returned from discussion_reports query');
      return [];
    }

    console.log('✅ Fetched discussion reports from database:', data.length, 'reports');
    console.log('📋 Raw data sample:', data[0]);

    const mappedReports = data.map(report => ({
      id: report.id,
      discussionId: report.discussion_id,
      reporterId: report.reporter_id,
      reporterName: report.reporter_name,
      contentTitle: report.content_title,
      contentType: report.content_type,
      originalAuthor: report.original_author,
      reason: report.reason,
      description: report.description || undefined,
      status: report.status,
      createdAt: report.created_at,
      updatedAt: report.updated_at,
      resolvedBy: report.resolved_by || undefined,
      resolvedAt: report.resolved_at || undefined,
      adminNotes: report.admin_notes || undefined,
    }));

    console.log('📊 Mapped reports:', mappedReports.length);
    return mappedReports;
  } catch (error) {
    console.error('❌ Exception fetching discussion reports:', error);
    return [];
  }
}

export async function createDiscussionReport(
  discussionId: string,
  reporterId: string,
  reporterName: string,
  contentTitle: string,
  contentType: 'Discussion' | 'Reply',
  originalAuthor: string,
  reason: DiscussionReport['reason'],
  description?: string
): Promise<DiscussionReport | null> {
  try {
    console.log('🔧 createDiscussionReport called with:', {
      discussionId,
      reporterId,
      reporterName,
      contentTitle,
      contentType,
      originalAuthor,
      reason,
      description
    });

    const insertData = {
      discussion_id: discussionId,
      reporter_id: reporterId,
      reporter_name: reporterName,
      content_title: contentTitle,
      content_type: contentType,
      original_author: originalAuthor,
      reason,
      description: description || null,
      status: 'pending' as const,
    };

    console.log('📤 Inserting into discussion_reports:', insertData);

    const { data, error } = await supabase
      .from('discussion_reports')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error creating discussion report:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return null;
    }

    if (!data) {
      console.error('❌ No data returned from insert');
      return null;
    }

    console.log('✅ Report created successfully in database:', data);

    return {
      id: data.id,
      discussionId: data.discussion_id,
      reporterId: data.reporter_id,
      reporterName: data.reporter_name,
      contentTitle: data.content_title,
      contentType: data.content_type,
      originalAuthor: data.original_author,
      reason: data.reason,
      description: data.description || undefined,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      resolvedBy: data.resolved_by || undefined,
      resolvedAt: data.resolved_at || undefined,
      adminNotes: data.admin_notes || undefined,
    };
  } catch (error) {
    console.error('❌ Exception creating discussion report:', error);
    return null;
  }
}

export async function updateDiscussionReportStatus(
  reportId: string,
  status: 'pending' | 'resolved' | 'dismissed',
  resolvedBy?: string,
  adminNotes?: string
): Promise<boolean> {
  try {
    const updates: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'resolved' || status === 'dismissed') {
      updates.resolved_at = new Date().toISOString();
      if (resolvedBy) {
        updates.resolved_by = resolvedBy;
      }
    }

    if (adminNotes) {
      updates.admin_notes = adminNotes;
    }

    const { error } = await supabase
      .from('discussion_reports')
      .update(updates)
      .eq('id', reportId);

    if (error) {
      console.error('Error updating discussion report status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating discussion report status:', error);
    return false;
  }
}

export async function deleteDiscussionReport(reportId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('discussion_reports')
      .delete()
      .eq('id', reportId);

    if (error) {
      console.error('Error deleting discussion report:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting discussion report:', error);
    return false;
  }
}

// ============ HELPER FUNCTIONS ============

function transformDbBookToBook(dbBook: any): Book {
  return {
    id: dbBook.id,
    title: dbBook.title,
    author: dbBook.author,
    authorInfo: dbBook.author_info,
    cover: dbBook.cover,
    rating: parseFloat(dbBook.rating) || 0,
    totalRatings: dbBook.total_ratings || 0,
    genre: dbBook.genre,
    description: dbBook.description,
    publishedYear: dbBook.published_year,
    pages: dbBook.pages,
    isbn: dbBook.isbn,
    publisher: dbBook.publisher,
    language: dbBook.language,
    viewCount: dbBook.view_count || 0,
    readCount: dbBook.read_count || 0,
    publishingInfo: dbBook.publishing_info,
    length: dbBook.length,
  };
}

// ============ PROFILE PHOTO UPLOAD ============

// Verify storage bucket exists (bucket should be created via SQL migration)
async function initializeStorageBucket(): Promise<boolean> {
  try {
    const bucketName = 'litlens-profile-photos';
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      // Return true anyway - the upload will fail with a better error if bucket doesn't exist
      return true;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.warn('Storage bucket does not exist. Please run migration 007_profile_photos_storage.sql');
      console.warn('Profile photo uploads will not work until the bucket is created.');
      // Return true to allow the app to continue - upload will fail gracefully
      return true;
    }
    
    console.log('Storage bucket verified:', bucketName);
    return true;
  } catch (error) {
    console.error('Error checking storage bucket:', error);
    // Return true to allow the app to continue
    return true;
  }
}

export async function uploadProfilePhoto(
  userId: string,
  file: File
): Promise<string | null> {
  try {
    // Check if user is authenticated first
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('User not authenticated. Please log in again.', sessionError);
      return null;
    }

    console.log('Upload started - User authenticated:', session.user.id);

    // Verify bucket exists (should be created via SQL migration)
    await initializeStorageBucket();

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      console.error('Invalid file type. Only JPG, PNG, and WebP are allowed.');
      return null;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      console.error('File size exceeds 5MB limit.');
      return null;
    }

    // Create unique filename with timestamp
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    console.log('Uploading to:', filePath, 'Size:', file.size, 'Type:', file.type);

    // Delete old avatar if exists
    try {
      const { data: existingFiles } = await supabase.storage
        .from('litlens-profile-photos')
        .list('avatars', {
          search: userId
        });
      
      if (existingFiles && existingFiles.length > 0) {
        console.log('Deleting old avatars:', existingFiles.length);
        for (const file of existingFiles) {
          await supabase.storage
            .from('litlens-profile-photos')
            .remove([`avatars/${file.name}`]);
        }
      }
    } catch (e) {
      console.log('Note: Could not delete old avatars (this is OK):', e);
    }

    // Upload to Supabase Storage (LitLens bucket)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('litlens-profile-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Allow overwriting
      });

    if (uploadError) {
      console.error('Error uploading file to LitLens storage:', uploadError);
      console.error('Upload error details:', {
        message: uploadError.message,
        statusCode: uploadError.statusCode,
        error: uploadError.error
      });
      return null;
    }

    console.log('Upload successful:', uploadData);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('litlens-profile-photos')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      console.error('Error getting public URL');
      return null;
    }

    console.log('Public URL generated:', urlData.publicUrl);
    
    // Verify the URL is accessible by checking the bucket settings
    const { data: bucketData } = await supabase.storage.getBucket('litlens-profile-photos');
    console.log('Bucket settings:', bucketData);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    return null;
  }
}

export async function deleteProfilePhoto(photoUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = photoUrl.split('/');
    const filePath = `avatars/${urlParts[urlParts.length - 1]}`;

    const { error } = await supabase.storage
      .from('litlens-profile-photos')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting profile photo from LitLens storage:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting profile photo:', error);
    return false;
  }
}