// Analytics service for Admin Dashboard
import { supabase } from '../utils/supabase/client';

// ============ ANALYTICS INTERFACES ============

export interface BookGrowthData {
  date: string;
  count: number;
}

export interface ReviewDistribution {
  rating: number;
  count: number;
}

export interface UserGrowthData {
  date: string;
  count: number;
}

export interface GenrePopularity {
  genre: string;
  count: number;
}

export interface ReadingStatusData {
  status: string;
  count: number;
}

// ============ ANALYTICS FUNCTIONS ============

/**
 * Get books added over time (last 6 months, grouped by month)
 */
export async function fetchBooksGrowthData(): Promise<BookGrowthData[]> {
  try {
    const { data: books, error } = await supabase
      .from('books')
      .select('created_at')
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!books) return [];

    // Group by month
    const monthlyData = new Map<string, number>();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    books.forEach(book => {
      const date = new Date(book.created_at);
      if (date >= sixMonthsAgo) {
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + 1);
      }
    });

    // Convert to array and format
    const result: BookGrowthData[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      result.push({
        date: monthName,
        count: monthlyData.get(monthKey) || 0
      });
    }

    return result;
  } catch (error) {
    console.error('Error fetching books growth data:', error);
    return [];
  }
}

/**
 * Get review rating distribution
 */
export async function fetchReviewDistribution(): Promise<ReviewDistribution[]> {
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('rating');

    if (error) throw error;
    if (!reviews) return [];

    // Count by rating
    const distribution = new Map<number, number>();
    reviews.forEach(review => {
      distribution.set(review.rating, (distribution.get(review.rating) || 0) + 1);
    });

    // Convert to array with all ratings 1-5
    return [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: distribution.get(rating) || 0
    }));
  } catch (error) {
    console.error('Error fetching review distribution:', error);
    return [];
  }
}

/**
 * Get user growth over time (last 6 months, grouped by month)
 */
export async function fetchUserGrowthData(): Promise<UserGrowthData[]> {
  try {
    const { data: users, error } = await supabase
      .from('profiles')
      .select('created_at')
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!users) return [];

    // Group by month
    const monthlyData = new Map<string, number>();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    users.forEach(user => {
      const date = new Date(user.created_at);
      if (date >= sixMonthsAgo) {
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + 1);
      }
    });

    // Convert to array and format
    const result: UserGrowthData[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      result.push({
        date: monthName,
        count: monthlyData.get(monthKey) || 0
      });
    }

    return result;
  } catch (error) {
    console.error('Error fetching user growth data:', error);
    return [];
  }
}

/**
 * Get top genres by book count
 */
export async function fetchTopGenres(limit: number = 8): Promise<GenrePopularity[]> {
  try {
    const { data: books, error } = await supabase
      .from('books')
      .select('genre');

    if (error) throw error;
    if (!books) return [];

    // Count genres (books can have multiple genres)
    const genreCount = new Map<string, number>();
    books.forEach(book => {
      const genres = Array.isArray(book.genre) ? book.genre : [book.genre];
      genres.forEach(genre => {
        if (genre) {
          genreCount.set(genre, (genreCount.get(genre) || 0) + 1);
        }
      });
    });

    // Convert to array and sort
    const result = Array.from(genreCount.entries())
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return result;
  } catch (error) {
    console.error('Error fetching top genres:', error);
    return [];
  }
}

/**
 * Get reading status distribution
 */
export async function fetchReadingStatusDistribution(): Promise<ReadingStatusData[]> {
  try {
    const { data: statuses, error } = await supabase
      .from('user_book_status')
      .select('status');

    if (error) throw error;
    if (!statuses) return [];

    // Count by status
    const distribution = new Map<string, number>();
    statuses.forEach(item => {
      const status = item.status || 'unknown';
      distribution.set(status, (distribution.get(status) || 0) + 1);
    });

    // Convert to array
    return Array.from(distribution.entries())
      .map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count
      }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error fetching reading status distribution:', error);
    return [];
  }
}

/**
 * Fetch all analytics data at once
 */
export async function fetchAllAnalytics() {
  const [
    booksGrowth,
    reviewDistribution,
    userGrowth,
    topGenres,
    readingStatus
  ] = await Promise.all([
    fetchBooksGrowthData(),
    fetchReviewDistribution(),
    fetchUserGrowthData(),
    fetchTopGenres(),
    fetchReadingStatusDistribution()
  ]);

  return {
    booksGrowth,
    reviewDistribution,
    userGrowth,
    topGenres,
    readingStatus
  };
}
