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
        title: review.title,
        content: review.content,
      })
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating review:', error);
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
      userName: userData?.name || 'Unknown User',
      userAvatar: userData?.avatar,
      rating: data.rating,
      title: data.title,
      content: data.content,
      date: data.created_at,
      helpful: data.helpful,
      isReported: data.is_reported,
      reportCount: data.report_count
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
}> {
  try {
    const { data, error } = await supabase
      .from('user_book_status')
      .select('status, user_rating')
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
  userRating?: number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_book_status')
      .upsert({
        user_id: userId,
        book_id: bookId,
        status,
        user_rating: userRating,
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
