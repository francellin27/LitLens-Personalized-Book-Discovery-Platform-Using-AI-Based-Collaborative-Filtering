// Utility functions for working with Supabase in LitLens

import { supabase } from '../utils/supabase/client';

/**
 * Upload an image to Supabase Storage
 * @param bucket - Storage bucket name (e.g., 'avatars', 'book-covers')
 * @param file - File to upload
 * @param path - Optional path within bucket
 * @returns Public URL of uploaded file or null on error
 */
export async function uploadImage(
  bucket: string,
  file: File,
  path?: string
): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = path || `${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

/**
 * Delete an image from Supabase Storage
 * @param bucket - Storage bucket name
 * @param path - Path to file within bucket
 * @returns true if successful, false otherwise
 */
export async function deleteImage(bucket: string, path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * Subscribe to real-time changes on a table
 * @param table - Table name to subscribe to
 * @param callback - Function to call when changes occur
 * @param filter - Optional filter (e.g., 'id=eq.123')
 * @returns Unsubscribe function
 */
export function subscribeToTable(
  table: string,
  callback: (payload: any) => void,
  filter?: string
) {
  const channel = supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table,
        ...(filter && { filter })
      },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Get user's reading statistics
 */
export async function getUserReadingStats(userId: string): Promise<{
  booksRead: number;
  currentlyReading: number;
  wantToRead: number;
  favorites: number;
  reviewsWritten: number;
  averageRating: number;
}> {
  try {
    // Get book counts
    const { data: statusData } = await supabase
      .from('user_book_status')
      .select('status')
      .eq('user_id', userId);

    const booksRead = statusData?.filter(s => s.status === 'completed').length || 0;
    const currentlyReading = statusData?.filter(s => s.status === 'reading').length || 0;
    const wantToRead = statusData?.filter(s => s.status === 'want_to_read').length || 0;
    const favorites = statusData?.filter(s => s.status === 'favorite').length || 0;

    // Get review stats
    const { data: reviewData } = await supabase
      .from('reviews')
      .select('rating')
      .eq('user_id', userId);

    const reviewsWritten = reviewData?.length || 0;
    const averageRating = reviewData && reviewData.length > 0
      ? reviewData.reduce((sum, r) => sum + r.rating, 0) / reviewData.length
      : 0;

    return {
      booksRead,
      currentlyReading,
      wantToRead,
      favorites,
      reviewsWritten,
      averageRating: Math.round(averageRating * 10) / 10
    };
  } catch (error) {
    console.error('Error fetching reading stats:', error);
    return {
      booksRead: 0,
      currentlyReading: 0,
      wantToRead: 0,
      favorites: 0,
      reviewsWritten: 0,
      averageRating: 0
    };
  }
}

/**
 * Get popular books based on various metrics
 */
export async function getPopularBooks(
  metric: 'rating' | 'views' | 'reads' | 'reviews',
  limit: number = 10
): Promise<any[]> {
  try {
    let orderBy: string;
    
    switch (metric) {
      case 'rating':
        orderBy = 'rating';
        break;
      case 'views':
        orderBy = 'view_count';
        break;
      case 'reads':
        orderBy = 'read_count';
        break;
      case 'reviews':
        orderBy = 'total_ratings';
        break;
      default:
        orderBy = 'rating';
    }

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order(orderBy, { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching popular books:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching popular books:', error);
    return [];
  }
}

/**
 * Get personalized book recommendations for a user
 * Based on their favorite genres and reading history
 */
export async function getPersonalizedRecommendations(
  userId: string,
  limit: number = 10
): Promise<any[]> {
  try {
    // Get user's favorite genres
    const { data: profile } = await supabase
      .from('profiles')
      .select('favorite_genres')
      .eq('id', userId)
      .single();

    if (!profile || !profile.favorite_genres || profile.favorite_genres.length === 0) {
      // Fall back to popular books if no preferences
      return getPopularBooks('rating', limit);
    }

    // Get books the user hasn't read yet in their favorite genres
    const { data: readBooks } = await supabase
      .from('user_book_status')
      .select('book_id')
      .eq('user_id', userId)
      .in('status', ['completed', 'reading']);

    const readBookIds = readBooks?.map(b => b.book_id) || [];

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .overlaps('genre', profile.favorite_genres)
      .not('id', 'in', `(${readBookIds.join(',')})`)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
}

/**
 * Get similar books based on genre and author
 */
export async function getSimilarBooks(
  bookId: string,
  limit: number = 6
): Promise<any[]> {
  try {
    // Get the source book
    const { data: sourceBook } = await supabase
      .from('books')
      .select('genre, author')
      .eq('id', bookId)
      .single();

    if (!sourceBook) return [];

    // Find books with same genre or author
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .or(`author.eq.${sourceBook.author},genre.ov.{${sourceBook.genre.join(',')}}`)
      .neq('id', bookId)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching similar books:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching similar books:', error);
    return [];
  }
}

/**
 * Search users by username or name
 */
export async function searchUsers(query: string, limit: number = 10): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, username, avatar, bio')
      .or(`username.ilike.%${query}%,name.ilike.%${query}%`)
      .limit(limit);

    if (error) {
      console.error('Error searching users:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}

/**
 * Get trending discussions
 */
export async function getTrendingDiscussions(limit: number = 10): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('discussions')
      .select(`
        *,
        author:profiles!discussions_author_id_fkey(name, username, avatar)
      `)
      .order('likes', { ascending: false })
      .order('replies_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching trending discussions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching trending discussions:', error);
    return [];
  }
}

/**
 * Increment a counter field (views, likes, etc.)
 */
export async function incrementCounter(
  table: string,
  id: string,
  field: string
): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('increment', {
      table_name: table,
      row_id: id,
      field_name: field
    });

    if (error) {
      console.error('Error incrementing counter:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error incrementing counter:', error);
    return false;
  }
}

/**
 * Check if a user has permission to perform an action
 */
export async function checkPermission(
  userId: string,
  permission: 'admin' | 'moderator'
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) return false;

    if (permission === 'admin') {
      return data.role === 'admin';
    }

    if (permission === 'moderator') {
      return data.role === 'admin' || data.role === 'moderator';
    }

    return false;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

/**
 * Batch update multiple records
 */
export async function batchUpdate<T>(
  table: string,
  updates: Array<{ id: string; data: Partial<T> }>
): Promise<boolean> {
  try {
    const promises = updates.map(({ id, data }) =>
      supabase.from(table).update(data).eq('id', id)
    );

    const results = await Promise.all(promises);
    
    return results.every(result => !result.error);
  } catch (error) {
    console.error('Error in batch update:', error);
    return false;
  }
}

/**
 * Get database statistics for admin dashboard
 */
export async function getDatabaseStats(): Promise<{
  totalBooks: number;
  totalUsers: number;
  totalReviews: number;
  totalDiscussions: number;
  pendingReports: number;
  pendingRequests: number;
}> {
  try {
    const [books, users, reviews, discussions, reports, requests] = await Promise.all([
      supabase.from('books').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('reviews').select('id', { count: 'exact', head: true }),
      supabase.from('discussions').select('id', { count: 'exact', head: true }),
      supabase.from('review_reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('book_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    return {
      totalBooks: books.count || 0,
      totalUsers: users.count || 0,
      totalReviews: reviews.count || 0,
      totalDiscussions: discussions.count || 0,
      pendingReports: reports.count || 0,
      pendingRequests: requests.count || 0,
    };
  } catch (error) {
    console.error('Error fetching database stats:', error);
    return {
      totalBooks: 0,
      totalUsers: 0,
      totalReviews: 0,
      totalDiscussions: 0,
      pendingReports: 0,
      pendingRequests: 0,
    };
  }
}

/**
 * Format Supabase timestamp to readable date
 */
export function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format Supabase timestamp to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  
  return formatDate(timestamp);
}
