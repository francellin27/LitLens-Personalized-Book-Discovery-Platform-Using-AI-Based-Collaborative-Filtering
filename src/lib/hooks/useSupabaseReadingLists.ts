// Custom React hooks for Supabase reading list operations
import { useState, useEffect } from 'react';
import { 
  fetchUserReadingLists, 
  createReadingList, 
  addBookToReadingList,
  removeBookFromReadingList,
  type ReadingList
} from '../supabase-services';

export function useReadingLists(userId: string | null) {
  const [readingLists, setReadingLists] = useState<ReadingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReadingLists = async () => {
    if (!userId) {
      setReadingLists([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await fetchUserReadingLists(userId);
      setReadingLists(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reading lists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReadingLists();
  }, [userId]);

  const createList = async (name: string, description?: string, isPublic: boolean = false) => {
    if (!userId) return null;

    try {
      const newList = await createReadingList(userId, name, description, isPublic);
      if (newList) {
        setReadingLists(prev => [newList, ...prev]);
        return newList;
      }
      return null;
    } catch (err) {
      console.error('Error creating reading list:', err);
      return null;
    }
  };

  const addBook = async (listId: string, bookId: string) => {
    try {
      const success = await addBookToReadingList(listId, bookId);
      if (success) {
        // Refresh lists to get updated book data
        await loadReadingLists();
      }
      return success;
    } catch (err) {
      console.error('Error adding book to list:', err);
      return false;
    }
  };

  const removeBook = async (listId: string, bookId: string) => {
    try {
      const success = await removeBookFromReadingList(listId, bookId);
      if (success) {
        // Update local state
        setReadingLists(prev => 
          prev.map(list => 
            list.id === listId 
              ? { ...list, books: list.books.filter(b => b.id !== bookId) }
              : list
          )
        );
      }
      return success;
    } catch (err) {
      console.error('Error removing book from list:', err);
      return false;
    }
  };

  return { 
    readingLists, 
    loading, 
    error, 
    createList,
    addBook,
    removeBook,
    refresh: loadReadingLists 
  };
}
