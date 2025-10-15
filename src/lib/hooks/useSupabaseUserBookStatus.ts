// Custom React hooks for user book status operations
import { useState, useEffect } from 'react';
import { 
  getUserBookStatus, 
  setUserBookStatus,
  removeUserBookStatus 
} from '../supabase-services';

export function useUserBookStatus(userId: string | null, bookId: string | null) {
  const [status, setStatus] = useState({
    isReading: false,
    isCompleted: false,
    isWantToRead: false,
    isFavorite: false,
    userRating: undefined as number | undefined
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = async () => {
    if (!userId || !bookId) {
      setStatus({
        isReading: false,
        isCompleted: false,
        isWantToRead: false,
        isFavorite: false,
        userRating: undefined
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getUserBookStatus(userId, bookId);
      setStatus({
        isReading: result.isReading || false,
        isCompleted: result.isCompleted || false,
        isWantToRead: result.isWantToRead || false,
        isFavorite: result.isFavorite || false,
        userRating: result.userRating
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load book status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, [userId, bookId]);

  const setStatus_ = async (
    statusType: 'reading' | 'completed' | 'want_to_read' | 'favorite',
    value: boolean,
    userRating?: number
  ) => {
    if (!userId || !bookId) return false;

    try {
      if (value) {
        const success = await setUserBookStatus(userId, bookId, statusType, userRating);
        if (success) {
          setStatus(prev => ({
            ...prev,
            [`is${statusType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`]: true,
            ...(userRating !== undefined && { userRating })
          }));
        }
        return success;
      } else {
        const success = await removeUserBookStatus(userId, bookId, statusType);
        if (success) {
          setStatus(prev => ({
            ...prev,
            [`is${statusType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`]: false
          }));
        }
        return success;
      }
    } catch (err) {
      console.error('Error updating book status:', err);
      return false;
    }
  };

  const toggleReading = (value: boolean) => setStatus_('reading', value);
  const toggleCompleted = (value: boolean) => setStatus_('completed', value);
  const toggleWantToRead = (value: boolean) => setStatus_('want_to_read', value);
  const toggleFavorite = (value: boolean) => setStatus_('favorite', value);
  const setRating = (rating: number) => setStatus_('completed', true, rating);

  return {
    ...status,
    loading,
    error,
    toggleReading,
    toggleCompleted,
    toggleWantToRead,
    toggleFavorite,
    setRating,
    refresh: loadStatus
  };
}
