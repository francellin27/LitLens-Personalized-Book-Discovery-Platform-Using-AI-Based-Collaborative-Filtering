// Custom React hooks for Supabase book operations
import { useState, useEffect } from 'react';
import { fetchBooks, fetchBookById } from '../supabase-services';
import type { Book } from '../bookData';

export function useBooks(options?: {
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
}) {
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBooks() {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchBooks(options);
        
        if (isMounted) {
          setBooks(result.books);
          setTotal(result.total);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load books');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadBooks();

    return () => {
      isMounted = false;
    };
  }, [
    options?.genre,
    options?.author,
    options?.publisher,
    options?.language,
    options?.year,
    options?.searchQuery,
    options?.sortBy,
    options?.sortOrder,
    options?.limit,
    options?.offset
  ]);

  return { books, total, loading, error };
}

export function useBook(bookId: string | null) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId) {
      setBook(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadBook() {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchBookById(bookId);
        
        if (isMounted) {
          setBook(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load book');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadBook();

    return () => {
      isMounted = false;
    };
  }, [bookId]);

  return { book, loading, error };
}
