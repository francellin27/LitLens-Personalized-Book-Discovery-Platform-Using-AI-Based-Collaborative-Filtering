// Custom React hooks for Supabase review operations
import { useState, useEffect } from 'react';
import { fetchReviewsForBook, createReview, updateReview, deleteReview } from '../supabase-services';
import type { Review } from '../bookData';

export function useBookReviews(bookId: string | null) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = async () => {
    if (!bookId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await fetchReviewsForBook(bookId);
      setReviews(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [bookId]);

  const addReview = async (review: Omit<Review, 'id' | 'date' | 'helpful'>) => {
    try {
      const newReview = await createReview(review);
      if (newReview) {
        setReviews(prev => [newReview, ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding review:', err);
      return false;
    }
  };

  const editReview = async (reviewId: string, updates: Partial<Review>) => {
    try {
      const success = await updateReview(reviewId, updates);
      if (success) {
        setReviews(prev => 
          prev.map(r => r.id === reviewId ? { ...r, ...updates } : r)
        );
      }
      return success;
    } catch (err) {
      console.error('Error updating review:', err);
      return false;
    }
  };

  const removeReview = async (reviewId: string) => {
    try {
      const success = await deleteReview(reviewId);
      if (success) {
        setReviews(prev => prev.filter(r => r.id !== reviewId));
      }
      return success;
    } catch (err) {
      console.error('Error deleting review:', err);
      return false;
    }
  };

  return { 
    reviews, 
    loading, 
    error, 
    addReview, 
    editReview, 
    removeReview,
    refresh: loadReviews 
  };
}
