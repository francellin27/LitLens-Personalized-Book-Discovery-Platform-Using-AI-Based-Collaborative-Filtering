import { useState, useMemo, useEffect } from 'react';
import { Book, Review, ReviewReport } from '../lib/bookData';
import { useAuth } from '../lib/auth-supabase';
import { 
  fetchBooks, 
  createBook, 
  updateBook, 
  deleteBook,
  fetchBookRequests,
  updateBookRequestStatus,
  deleteBookRequest,
  type BookRequest,
  fetchAllUsers,
  updateUserRole,
  updateUserProfile,
  deleteUserAccount,
  updateUserBooksRead,
  type UserProfile,
  deleteReview,
  updateReview,
  fetchAllReviews,
  fetchAllDiscussions,
  updateDiscussion,
  deleteDiscussion,
  type Discussion,
  fetchAllDiscussionReports,
  updateDiscussionReportStatus,
  deleteDiscussionReport,
  type DiscussionReport
} from '../lib/supabase-services';
import { 
  fetchAllAnalytics,
  type BookGrowthData,
  type ReviewDistribution,
  type UserGrowthData,
  type GenrePopularity,
  type ReadingStatusData
} from '../lib/supabase-analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BookOpen, Users, MessageSquare, Plus, Edit, Trash2, Eye, Search, Flag, CheckCircle, XCircle, AlertTriangle, TrendingUp, Star, ChevronDown, ChevronUp, Save, X, BarChart3, LineChart } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { StarRating } from './StarRating';
import { ReportedReviewsTable } from './ReportedReviewsTable';
import { UserManagementTable } from './UserManagementTable';
import { PrintBookReport } from './PrintBookReport';
import { LineChart as RechartsLine, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AdminPanelProps {}

export function AdminPanel({}: AdminPanelProps) {
  const { getReviewReports, updateReportStatus } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [bookRequests, setBookRequests] = useState<BookRequest[]>([]);
  const [reviewReports, setReviewReports] = useState<ReviewReport[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [admins, setAdmins] = useState<UserProfile[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [discussionReports, setDiscussionReports] = useState<DiscussionReport[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isLoadingDiscussions, setIsLoadingDiscussions] = useState(true);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [lastUserUpdate, setLastUserUpdate] = useState<Date>(new Date());
  
  // Analytics data state
  const [analyticsData, setAnalyticsData] = useState<{
    booksGrowth: BookGrowthData[];
    reviewDistribution: ReviewDistribution[];
    userGrowth: UserGrowthData[];
    topGenres: GenrePopularity[];
    readingStatus: ReadingStatusData[];
  }>({
    booksGrowth: [],
    reviewDistribution: [],
    userGrowth: [],
    topGenres: [],
    readingStatus: []
  });
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  
  // Load books from Supabase on mount
  useEffect(() => {
    loadBooks();
  }, []);

  // Load book requests from Supabase on mount
  useEffect(() => {
    loadBookRequests();
  }, []);

  // Load users from Supabase on mount
  useEffect(() => {
    loadUsers();
  }, []);
  
  // Load review reports on mount
  useEffect(() => {
    const loadReports = async () => {
      const reports = await getReviewReports();
      setReviewReports(reports);
    };
    loadReports();
  }, []);

  // Load reviews from Supabase on mount
  useEffect(() => {
    loadReviews();
  }, []);

  // Load discussions from Supabase on mount
  useEffect(() => {
    loadDiscussions();
  }, []);

  // Load discussion reports from Supabase on mount
  useEffect(() => {
    loadDiscussionReports();
  }, []);

  // Load analytics data on mount
  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoadingAnalytics(true);
      try {
        const data = await fetchAllAnalytics();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error loading analytics:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setIsLoadingAnalytics(false);
      }
    };
    loadAnalytics();
  }, []);

  const loadBooks = async () => {
    setIsLoadingBooks(true);
    try {
      const { books: fetchedBooks } = await fetchBooks({ limit: 1000 });
      setBooks(fetchedBooks);
    } catch (error) {
      console.error('Error loading books:', error);
      toast.error('Failed to load books');
    } finally {
      setIsLoadingBooks(false);
    }
  };

  const loadBookRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const requests = await fetchBookRequests();
      setBookRequests(requests);
    } catch (error) {
      console.error('Error loading book requests:', error);
      toast.error('Failed to load book requests');
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      console.log('🔄 Loading users...');
      const [allUsers, allAdmins] = await Promise.all([
        fetchAllUsers('user'),
        fetchAllUsers('admin')
      ]);
      console.log('✅ Users loaded:', allUsers.length, 'users,', allAdmins.length, 'admins');
      console.log('📊 Sample user data:', allUsers[0]);
      setUsers(allUsers);
      setAdmins(allAdmins);
      setLastUserUpdate(new Date());
      toast.success(`Loaded ${allUsers.length} users and ${allAdmins.length} admins`);
    } catch (error) {
      console.error('❌ Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const loadReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const fetchedReviews = await fetchAllReviews();
      setReviews(fetchedReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const loadDiscussions = async () => {
    setIsLoadingDiscussions(true);
    try {
      const fetchedDiscussions = await fetchAllDiscussions();
      setDiscussions(fetchedDiscussions);
    } catch (error: any) {
      console.error('Error loading discussions:', error);
      
      // Check if error is due to missing table
      if (error?.code === 'PGRST200' || error?.message?.includes('discussions')) {
        toast.error('Database migration needed', {
          description: 'Run migration 004_discussions_tables.sql in Supabase SQL Editor',
          duration: 10000,
        });
      } else {
        toast.error('Failed to load discussions');
      }
    } finally {
      setIsLoadingDiscussions(false);
    }
  };

  const loadDiscussionReports = async () => {
    setIsLoadingReports(true);
    try {
      console.log('🔄 Loading discussion reports...');
      const fetchedReports = await fetchAllDiscussionReports();
      console.log('✅ Discussion reports loaded:', fetchedReports.length, 'reports');
      console.log('📊 Reports by status:', {
        pending: fetchedReports.filter(r => r.status === 'pending').length,
        resolved: fetchedReports.filter(r => r.status === 'resolved').length,
        dismissed: fetchedReports.filter(r => r.status === 'dismissed').length
      });
      console.log('📝 Sample report:', fetchedReports[0]);
      setDiscussionReports(fetchedReports);
    } catch (error: any) {
      console.error('❌ Error loading discussion reports:', error);
      
      // Check if error is due to missing table
      if (error?.code === 'PGRST200' || error?.message?.includes('discussion_reports')) {
        toast.error('Database migration needed', {
          description: 'Run migration 006_discussion_reports.sql in Supabase SQL Editor',
          duration: 10000,
        });
      } else {
        toast.error('Failed to load discussion reports');
      }
    } finally {
      setIsLoadingReports(false);
    }
  };
  
  // Use reviews from state instead of extracting from books
  const allReviews = useMemo(() => {
    return reviews;
  }, [reviews]);
  

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [isEditingBook, setIsEditingBook] = useState(false);
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [isManagingUser, setIsManagingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditingBooksRead, setIsEditingBooksRead] = useState(false);
  const [editedBooksRead, setEditedBooksRead] = useState<number>(0);
  const [isEditingDiscussion, setIsEditingDiscussion] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<any>(null);
  const [selectedRequest, setSelectedRequest] = useState<BookRequest | null>(null);
  const [isViewingRequest, setIsViewingRequest] = useState(false);
  const [selectedBookForReviews, setSelectedBookForReviews] = useState<Book | null>(null);
  const [isViewingBookReviews, setIsViewingBookReviews] = useState(false);
  const [allReviewsSearchQuery, setAllReviewsSearchQuery] = useState('');
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editingReviewData, setEditingReviewData] = useState<{
    title: string;
    content: string;
    rating: number;
  }>({
    title: '',
    content: '',
    rating: 5
  });
  const [discussionFormData, setDiscussionFormData] = useState({
    title: '',
    category: '',
    bookTitle: ''
  });
  const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false);
  const [announcementFormData, setAnnouncementFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    category: 'general',
    expiryDate: '',
    isPinned: false,
    isGlobal: true
  });
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [reviewRatingFilter, setReviewRatingFilter] = useState<string>('all');
  const [reviewBookFilter, setReviewBookFilter] = useState('');
  const [reviewAuthorFilter, setReviewAuthorFilter] = useState('');
  const [reviewPublisherFilter, setReviewPublisherFilter] = useState('');
  const [reviewDateFilter, setReviewDateFilter] = useState('all');
  const [reportStatusFilter, setReportStatusFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('pending');
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: '',
    author: '',
    genre: ['Fiction'],
    description: '',
    publishedYear: new Date().getFullYear(),
    pages: 0,
    isbn: '',
    publisher: '',
    language: 'English',
    cover: ''
  });
  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    role: 'admin',
    permissions: {
      manageBooks: true,
      manageUsers: true,
      manageReviews: true,
      systemSettings: false
    }
  });

  // Transform UserProfile to match UserManagementTable expected format
  const transformedUsers = useMemo(() => {
    const transformed = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      joinDate: user.createdAt,
      booksRead: user.booksRead
    }));
    console.log('👥 Transformed Users for Table:', transformed.map(u => ({ name: u.name, booksRead: u.booksRead })));
    return transformed;
  }, [users]);

  const transformedAdmins = useMemo(() => {
    const transformed = admins.map(admin => ({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      joinDate: admin.createdAt,
      booksRead: admin.booksRead
    }));
    console.log('👑 Transformed Admins for Table:', transformed.map(a => ({ name: a.name, booksRead: a.booksRead })));
    return transformed;
  }, [admins]);

  // Calculate time ago for discussions
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return `${Math.floor(seconds / 604800)} weeks ago`;
  };

  // Get pending reports count
  const pendingReportsCount = discussionReports.filter(r => r.status === 'pending').length;

  const mockTopContributors = [
    {
      id: 'contrib_1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150',
      points: 2540,
      contributions: 45,
      badge: '📚 Reading Master'
    },
    {
      id: 'contrib_2',
      name: 'Alex Turner',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      points: 2180,
      contributions: 38,
      badge: '⭐ Review Champion'
    },
    {
      id: 'contrib_3',
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      points: 1950,
      contributions: 42,
      badge: '💬 Discussion Leader'
    }
  ];

  const mockRecentActivity = [
    {
      id: 'activity_1',
      type: 'discussion',
      description: 'New discussion started: "Best fantasy books of 2024" by Alex Turner',
      time: '2 hours ago'
    },
    {
      id: 'activity_2',
      type: 'review',
      description: 'Sarah Johnson posted a 5-star review for "The Midnight Library"',
      time: '4 hours ago'
    },
    {
      id: 'activity_3',
      type: 'join',
      description: '12 new members joined the community today',
      time: '6 hours ago'
    },
    {
      id: 'activity_4',
      type: 'discussion',
      description: 'Emma Wilson replied to "Monthly Romance Reads" discussion',
      time: '8 hours ago'
    }
  ];

  // Filter books based on search query
  const filteredBooks = useMemo(() => {
    let filtered = bookSearchQuery.trim() 
      ? books.filter(book =>
          book.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
          (Array.isArray(book.genre) 
            ? book.genre.some(g => g.toLowerCase().includes(bookSearchQuery.toLowerCase()))
            : book.genre.toLowerCase().includes(bookSearchQuery.toLowerCase()))
        )
      : [...books];
    
    // Sort alphabetically by title
    return filtered.sort((a, b) => a.title.localeCompare(b.title));
  }, [books, bookSearchQuery]);

  // Get books that have reviews with review count, sorted alphabetically
  const booksWithReviews = useMemo(() => {
    const bookReviewMap = new Map<string, number>();
    
    allReviews.forEach(review => {
      const count = bookReviewMap.get(review.bookId) || 0;
      bookReviewMap.set(review.bookId, count + 1);
    });
    
    let filtered = books
      .filter(book => bookReviewMap.has(book.id))
      .map(book => ({
        ...book,
        reviewCount: bookReviewMap.get(book.id) || 0
      }));
    
    // Apply search filter
    if (allReviewsSearchQuery.trim()) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(allReviewsSearchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(allReviewsSearchQuery.toLowerCase())
      );
    }
    
    // Sort alphabetically by title
    return filtered.sort((a, b) => a.title.localeCompare(b.title));
  }, [books, allReviews, allReviewsSearchQuery]);

  // Filter reviews based on all filters
  const filteredReviews = useMemo(() => {
    let filtered = allReviews;
    
    // Apply rating filter
    if (reviewRatingFilter !== 'all') {
      const filterRating = parseInt(reviewRatingFilter);
      filtered = filtered.filter(review => review.rating === filterRating);
    }
    
    // Apply search filter (searches in review content, title, and user name)
    if (reviewSearchQuery.trim()) {
      filtered = filtered.filter(review => {
        return (
          review.userName.toLowerCase().includes(reviewSearchQuery.toLowerCase()) ||
          review.title?.toLowerCase().includes(reviewSearchQuery.toLowerCase()) ||
          review.content.toLowerCase().includes(reviewSearchQuery.toLowerCase())
        );
      });
    }
    
    // Apply book name filter
    if (reviewBookFilter.trim()) {
      filtered = filtered.filter(review => {
        const book = books.find(b => b.id === review.bookId);
        return book?.title.toLowerCase().includes(reviewBookFilter.toLowerCase());
      });
    }
    
    // Apply author filter
    if (reviewAuthorFilter.trim()) {
      filtered = filtered.filter(review => {
        const book = books.find(b => b.id === review.bookId);
        return book?.author.toLowerCase().includes(reviewAuthorFilter.toLowerCase());
      });
    }
    
    // Apply publisher filter
    if (reviewPublisherFilter.trim()) {
      filtered = filtered.filter(review => {
        const book = books.find(b => b.id === review.bookId);
        return book?.publisher.toLowerCase().includes(reviewPublisherFilter.toLowerCase());
      });
    }
    
    // Apply date filter
    if (reviewDateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date(today);
      
      switch (reviewDateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(review => {
            const reviewDate = new Date(review.date);
            return reviewDate >= filterDate;
          });
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(review => {
            const reviewDate = new Date(review.date);
            return reviewDate >= filterDate;
          });
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(review => {
            const reviewDate = new Date(review.date);
            return reviewDate >= filterDate;
          });
          break;
        case 'year':
          filterDate.setFullYear(today.getFullYear() - 1);
          filtered = filtered.filter(review => {
            const reviewDate = new Date(review.date);
            return reviewDate >= filterDate;
          });
          break;
      }
    }
    
    return filtered;
  }, [allReviews, reviewSearchQuery, reviewRatingFilter, reviewBookFilter, reviewAuthorFilter, reviewPublisherFilter, reviewDateFilter, books]);

  // Calculate rating distribution for admin panel
  const getAdminRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    allReviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as keyof typeof distribution]++;
      }
    });
    
    return distribution;
  };

  const adminRatingDistribution = getAdminRatingDistribution();

  // Filter discussion reports based on status filter
  const filteredDiscussionReports = useMemo(() => {
    if (reportStatusFilter === 'all') {
      return discussionReports;
    }
    return discussionReports.filter(report => report.status === reportStatusFilter);
  }, [discussionReports, reportStatusFilter]);

  const getRatingLabel = (rating: number) => {
    const labels: { [key: number]: string } = {
      5: 'Excellent',
      4: 'Good', 
      3: 'Okay',
      2: 'Bad',
      1: 'Terrible'
    };
    return labels[rating] || '';
  };

  const clearAllReviewFilters = () => {
    setReviewSearchQuery('');
    setReviewRatingFilter('all');
    setReviewBookFilter('');
    setReviewAuthorFilter('');
    setReviewPublisherFilter('');
    setReviewDateFilter('all');
    toast.success('All filters cleared');
  };

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const bookData = {
        title: newBook.title,
        author: newBook.author,
        authorInfo: `Information about ${newBook.author}`,
        cover: newBook.cover || 'https://images.unsplash.com/photo-1535269414141-739bf0054cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjB2aW50YWdlJTIwbGl0ZXJhdHVyZXxlbnwxfHx8fDE3NTg1OTMzODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        genre: newBook.genre || ['Fiction'],
        description: newBook.description || '',
        publishedYear: newBook.publishedYear || new Date().getFullYear(),
        pages: newBook.pages || 0,
        isbn: newBook.isbn || '',
        publisher: newBook.publisher || '',
        language: newBook.language || 'English',
        length: `${Math.floor((newBook.pages || 0) / 50)} hours`,
        publishingInfo: `Published by ${newBook.publisher} in ${newBook.publishedYear}`,
        publishedDate: `${newBook.publishedYear}`,
      };

      const createdBook = await createBook(bookData);
      
      if (createdBook) {
        await loadBooks(); // Reload books from database
        resetBookForm();
        setIsAddingBook(false);
        toast.success('Book added successfully!');
      } else {
        toast.error('Failed to add book');
      }
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Failed to add book');
    }
  };

  const handleEditBook = async () => {
    if (!selectedBook || !newBook.title || !newBook.author) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const updates = {
        title: newBook.title,
        author: newBook.author,
        authorInfo: `Information about ${newBook.author}`,
        cover: newBook.cover || selectedBook.cover,
        genre: newBook.genre,
        description: newBook.description,
        publishedYear: newBook.publishedYear,
        pages: newBook.pages,
        isbn: newBook.isbn,
        publisher: newBook.publisher,
        language: newBook.language,
        length: `${Math.floor((newBook.pages || 0) / 50)} hours`,
        publishingInfo: `Published by ${newBook.publisher} in ${newBook.publishedYear}`,
      };

      const success = await updateBook(selectedBook.id, updates);
      
      if (success) {
        await loadBooks(); // Reload books from database
        resetBookForm();
        setIsEditingBook(false);
        setSelectedBook(null);
        toast.success('Book updated successfully!');
      } else {
        toast.error('Failed to update book');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Failed to update book');
    }
  };

  const resetBookForm = () => {
    setNewBook({
      title: '',
      author: '',
      genre: ['Fiction'],
      description: '',
      publishedYear: new Date().getFullYear(),
      pages: 0,
      isbn: '',
      publisher: '',
      language: 'English',
      cover: ''
    });
  };

  const handleOpenEditDialog = (book: Book) => {
    setSelectedBook(book);
    setNewBook({
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description,
      publishedYear: book.publishedYear,
      pages: book.pages,
      isbn: book.isbn,
      publisher: book.publisher,
      language: book.language,
      cover: book.cover
    });
    setIsEditingBook(true);
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      const success = await deleteBook(bookId);
      if (success) {
        await loadBooks(); // Reload books from database
        toast.success('Book removed successfully!');
      } else {
        toast.error('Failed to remove book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to remove book');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const success = await deleteReview(reviewId);
      
      if (success) {
        // Reload reviews to get updated list
        await loadReviews();
        // Reload books to update review counts
        await loadBooks();
        // Reload review reports to refresh the list
        const reports = await getReviewReports();
        setReviewReports(reports);
        toast.success('Review removed successfully!');
      } else {
        toast.error('Failed to remove review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to remove review');
    }
  };

  const handleStartEditReview = (review: Review) => {
    setEditingReviewId(review.id);
    setEditingReviewData({
      title: review.title || '',
      content: review.content,
      rating: review.rating
    });
  };

  const handleCancelEditReview = () => {
    setEditingReviewId(null);
    setEditingReviewData({
      title: '',
      content: '',
      rating: 5
    });
  };

  const handleSaveEditReview = async (reviewId: string) => {
    if (!editingReviewData.content.trim()) {
      toast.error('Review content cannot be empty');
      return;
    }

    try {
      const success = await updateReview(reviewId, {
        title: editingReviewData.title,
        content: editingReviewData.content,
        rating: editingReviewData.rating
      });

      if (success) {
        // Reload reviews to get updated list
        await loadReviews();
        // Reload books to update review counts
        await loadBooks();
        handleCancelEditReview();
        toast.success('Review updated successfully!');
      } else {
        toast.error('Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
    }
  };

  const handleEditAdmin = async (admin: any) => {
    setSelectedAdmin(admin);
    setAdminFormData({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: {
        manageBooks: true,
        manageUsers: true,
        manageReviews: true,
        systemSettings: admin.email.includes('superadmin')
      }
    });
    setIsEditingAdmin(true);
  };

  const handleSaveAdmin = async () => {
    if (!adminFormData.name || !adminFormData.email) {
      toast.error('Please fill in required fields');
      return;
    }
    
    try {
      const success = await updateUserProfile(selectedAdmin.id, {
        name: adminFormData.name
      });

      if (success) {
        await loadUsers(); // Reload users from database
        toast.success('Admin updated successfully!');
        setIsEditingAdmin(false);
        setSelectedAdmin(null);
      } else {
        toast.error('Failed to update admin');
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      toast.error('Failed to update admin');
    }
  };

  const handleManageUser = (user: any) => {
    setSelectedUser(user);
    setEditedBooksRead(user.booksRead || 0);
    setIsEditingBooksRead(false);
    setIsManagingUser(true);
  };

  const handleSuspendUser = () => {
    // Note: Suspension/banning would require additional database fields
    toast.success(`User ${selectedUser?.name} suspension feature coming soon`);
    setIsManagingUser(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedUser.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const success = await deleteUserAccount(selectedUser.id);
      
      if (success) {
        await loadUsers(); // Reload users from database
        toast.success(`User ${selectedUser.name} has been deleted`);
        setIsManagingUser(false);
        setSelectedUser(null);
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleResetUserPassword = () => {
    // Note: Password reset would be handled through Supabase Auth
    toast.success(`Password reset functionality coming soon`);
  };

  const handleBanUser = () => {
    // Note: Banning would require additional database fields
    toast.success(`User banning feature coming soon`);
    setIsManagingUser(false);
    setSelectedUser(null);
  };

  const handleUpdateBooksRead = async () => {
    if (!selectedUser) return;

    const newCount = Math.max(0, editedBooksRead); // Ensure non-negative
    
    if (newCount === selectedUser.booksRead) {
      toast.info('No changes to save');
      setIsEditingBooksRead(false);
      return;
    }

    try {
      const success = await updateUserBooksRead(selectedUser.id, newCount);
      
      if (success) {
        await loadUsers(); // Reload users to get updated count
        toast.success(`Updated books read count to ${newCount}`);
        setIsEditingBooksRead(false);
        // Update the selected user's data in the dialog
        setSelectedUser({ ...selectedUser, booksRead: newCount });
      } else {
        toast.error('Failed to update books read count');
      }
    } catch (error) {
      console.error('Error updating books read:', error);
      toast.error('Failed to update books read count');
    }
  };

  const handlePromoteToAdmin = async (user: any) => {
    try {
      const success = await updateUserRole(user.id, 'admin');
      
      if (success) {
        await loadUsers(); // Reload users from database
        toast.success(`${user.name} has been promoted to admin`);
      } else {
        toast.error('Failed to promote user');
      }
    } catch (error) {
      console.error('Error promoting user:', error);
      toast.error('Failed to promote user');
    }
  };

  const handleDemoteFromAdmin = async (admin: any) => {
    if (!window.confirm(`Are you sure you want to remove admin privileges from ${admin.name}?`)) {
      return;
    }

    try {
      const success = await updateUserRole(admin.id, 'user');
      
      if (success) {
        await loadUsers(); // Reload users from database
        toast.success(`${admin.name} has been demoted to regular user`);
      } else {
        toast.error('Failed to demote admin');
      }
    } catch (error) {
      console.error('Error demoting admin:', error);
      toast.error('Failed to demote admin');
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      const success = await updateBookRequestStatus(requestId, 'approved');
      if (success) {
        await loadBookRequests(); // Reload requests from database
        toast.success('Book request approved successfully!');
        setIsViewingRequest(false);
        setSelectedRequest(null);
      } else {
        toast.error('Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    }
  };

  const handleDenyRequest = async (requestId: string) => {
    try {
      const success = await updateBookRequestStatus(requestId, 'rejected');
      if (success) {
        await loadBookRequests(); // Reload requests from database
        toast.success('Book request denied');
        setIsViewingRequest(false);
        setSelectedRequest(null);
      } else {
        toast.error('Failed to deny request');
      }
    } catch (error) {
      console.error('Error denying request:', error);
      toast.error('Failed to deny request');
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    try {
      const success = await deleteBookRequest(requestId);
      if (success) {
        await loadBookRequests(); // Reload requests from database
        toast.success('Book request deleted successfully!');
        setIsViewingRequest(false);
        setSelectedRequest(null);
      } else {
        toast.error('Failed to delete request');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request');
    }
  };

  const handleResolveCommunityReport = async (reportId: string, contentTitle: string) => {
    try {
      const success = await updateDiscussionReportStatus(reportId, 'resolved');
      if (success) {
        await loadDiscussionReports(); // Reload reports from database
        toast.success(`Report for "${contentTitle}" resolved successfully!`);
      } else {
        toast.error('Failed to resolve report');
      }
    } catch (error) {
      console.error('Error resolving report:', error);
      toast.error('Failed to resolve report');
    }
  };

  const handleDismissCommunityReport = async (reportId: string, contentTitle: string) => {
    try {
      const success = await updateDiscussionReportStatus(reportId, 'dismissed');
      if (success) {
        await loadDiscussionReports(); // Reload reports from database
        toast.success(`Report for "${contentTitle}" dismissed`);
      } else {
        toast.error('Failed to dismiss report');
      }
    } catch (error) {
      console.error('Error dismissing report:', error);
      toast.error('Failed to dismiss report');
    }
  };

  const handleUpdateReportStatus = async (reportId: string, status: ReviewReport['status']) => {
    await updateReportStatus(reportId, status);
    // Reload reports after update
    const reports = await getReviewReports();
    setReviewReports(reports);
    toast.success(`Report ${status === 'dismissed' ? 'dismissed' : 'updated'} successfully`);
  };

  // Community management handlers
  const handleViewDiscussion = (discussionId: string) => {
    toast.success(`Opening discussion: ${discussionId}`);
    // Here you would navigate to the discussion details page
  };

  const handleEditDiscussion = async (discussionId: string) => {
    const discussion = discussions.find(d => d.id === discussionId);
    if (discussion) {
      setSelectedDiscussion(discussion);
      setDiscussionFormData({
        title: discussion.title,
        category: discussion.category,
        bookTitle: discussion.bookTitle || ''
      });
      setIsEditingDiscussion(true);
    }
  };

  const handleSaveDiscussion = async () => {
    if (!discussionFormData.title.trim()) {
      toast.error('Discussion title is required');
      return;
    }
    
    if (!discussionFormData.category.trim()) {
      toast.error('Category is required');
      return;
    }

    if (!selectedDiscussion) {
      toast.error('No discussion selected');
      return;
    }

    try {
      const success = await updateDiscussion(selectedDiscussion.id, {
        title: discussionFormData.title,
        category: discussionFormData.category,
        bookTitle: discussionFormData.bookTitle || undefined
      });

      if (success) {
        toast.success(`Discussion "${discussionFormData.title}" has been updated successfully`);
        await loadDiscussions(); // Reload discussions list
        setIsEditingDiscussion(false);
        setSelectedDiscussion(null);
        setDiscussionFormData({
          title: '',
          category: '',
          bookTitle: ''
        });
      } else {
        toast.error('Failed to update discussion');
      }
    } catch (error) {
      console.error('Error updating discussion:', error);
      toast.error('Failed to update discussion');
    }
  };

  const handleDeleteDiscussionClick = async (discussionId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the discussion "${title}"? This action cannot be undone.`)) {
      try {
        const success = await deleteDiscussion(discussionId);
        if (success) {
          toast.success(`Discussion "${title}" has been deleted`);
          await loadDiscussions(); // Reload discussions list
        } else {
          toast.error('Failed to delete discussion');
        }
      } catch (error) {
        console.error('Error deleting discussion:', error);
        toast.error('Failed to delete discussion');
      }
    }
  };

  const handleViewCommunityReport = (reportId: string) => {
    toast.success(`Viewing community report: ${reportId}`);
    // Here you would open the report details dialog
  };

  const handleCreateAnnouncement = () => {
    setIsCreatingAnnouncement(true);
  };

  const handleSaveAnnouncement = () => {
    if (!announcementFormData.title.trim()) {
      toast.error('Announcement title is required');
      return;
    }
    
    if (!announcementFormData.content.trim()) {
      toast.error('Announcement content is required');
      return;
    }

    // Here you would save the announcement to your backend
    // For now, we'll just show a success message
    toast.success(`Announcement "${announcementFormData.title}" has been created successfully`);
    setIsCreatingAnnouncement(false);
    setAnnouncementFormData({
      title: '',
      content: '',
      priority: 'normal',
      category: 'general',
      expiryDate: '',
      isPinned: false,
      isGlobal: true
    });
  };



  const BookForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="author">Author *</Label>
        <Input
          id="author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="genre">Genre</Label>
        <Select value={String(newBook.genre || 'Fiction')} onValueChange={(value) => setNewBook({ ...newBook, genre: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Fiction">Fiction</SelectItem>
            <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
            <SelectItem value="Fantasy">Fantasy</SelectItem>
            <SelectItem value="Science Fiction">Science Fiction</SelectItem>
            <SelectItem value="Romance">Romance</SelectItem>
            <SelectItem value="Thriller">Thriller</SelectItem>
            <SelectItem value="Mystery">Mystery</SelectItem>
            <SelectItem value="Biography">Biography</SelectItem>
            <SelectItem value="History">History</SelectItem>
            <SelectItem value="Contemporary Fiction">Contemporary Fiction</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="year">Publication Year</Label>
        <Input
          id="year"
          type="number"
          value={newBook.publishedYear}
          onChange={(e) => setNewBook({ ...newBook, publishedYear: Number(e.target.value) })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pages">Pages</Label>
        <Input
          id="pages"
          type="number"
          value={newBook.pages}
          onChange={(e) => setNewBook({ ...newBook, pages: Number(e.target.value) })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="isbn">ISBN</Label>
        <Input
          id="isbn"
          value={newBook.isbn}
          onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="publisher">Publisher</Label>
        <Input
          id="publisher"
          value={newBook.publisher}
          onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select value={String(newBook.language || 'English')} onValueChange={(value) => setNewBook({ ...newBook, language: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="French">French</SelectItem>
            <SelectItem value="German">German</SelectItem>
            <SelectItem value="Italian">Italian</SelectItem>
            <SelectItem value="Portuguese">Portuguese</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-2 space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={newBook.description}
          onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
          rows={3}
        />
      </div>
      <div className="col-span-2 space-y-2">
        <Label htmlFor="cover">Cover URL</Label>
        <Input
          id="cover"
          value={newBook.cover}
          onChange={(e) => setNewBook({ ...newBook, cover: e.target.value })}
          placeholder="https://example.com/cover.jpg"
        />
      </div>
      <div className="col-span-2">
        <Button 
          onClick={isEdit ? handleEditBook : handleAddBook} 
          className="w-full shadow-md"
          style={{ backgroundColor: '#879656' }}
        >
          {isEdit ? 'Update Book' : 'Add Book'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8 w-full max-w-full overflow-x-hidden">
      {/* Admin Header - Modern Design with Gradient */}
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl p-5 md:p-8 shadow-lg" style={{ background: 'linear-gradient(135deg, #879656 0%, #6b7a45 100%)' }}>
        <div className="relative z-10">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-white/20 backdrop-blur-sm">
              <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl text-white">Admin Dashboard</h1>
              <p className="text-white/90 text-xs md:text-sm mt-0.5 md:mt-1">
                Manage and monitor your LitLens platform
              </p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Stats Cards - Enhanced Modern Design */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {/* Total Books Card */}
        <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <CardHeader className="pb-2 md:pb-3 pt-3 md:pt-6 px-2 md:px-6">
            <div className="flex items-center justify-between gap-1">
              <CardTitle className="text-[9px] md:text-xs uppercase tracking-wide text-muted-foreground truncate">Total Books</CardTitle>
              <div className="p-1.5 md:p-2 rounded-md md:rounded-lg transition-all duration-300 flex-shrink-0" style={{ backgroundColor: '#879656' }}>
                <BookOpen className="h-3 w-3 md:h-4 md:w-4 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 md:px-6 pb-3 md:pb-6">
            <div className="space-y-0.5 md:space-y-1">
              <div className="text-2xl md:text-3xl" style={{ color: '#535050' }}>{books.length}</div>
              <div className="hidden md:flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span>+12% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Total Users Card */}
        <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <CardHeader className="pb-2 md:pb-3 pt-3 md:pt-6 px-2 md:px-6">
            <div className="flex items-center justify-between gap-1">
              <CardTitle className="text-[9px] md:text-xs uppercase tracking-wide text-muted-foreground truncate">Total Users</CardTitle>
              <div className="p-1.5 md:p-2 rounded-md md:rounded-lg bg-blue-500 transition-all duration-300 flex-shrink-0">
                <Users className="h-3 w-3 md:h-4 md:w-4 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 md:px-6 pb-3 md:pb-6">
            <div className="space-y-0.5 md:space-y-1">
              <div className="text-2xl md:text-3xl" style={{ color: '#535050' }}>{users.length}</div>
              <div className="hidden md:flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span>+8% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Total Reviews Card */}
        <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <CardHeader className="pb-2 md:pb-3 pt-3 md:pt-6 px-2 md:px-6">
            <div className="flex items-center justify-between gap-1">
              <CardTitle className="text-[9px] md:text-xs uppercase tracking-wide text-muted-foreground truncate">Total Reviews</CardTitle>
              <div className="p-1.5 md:p-2 rounded-md md:rounded-lg bg-purple-500 transition-all duration-300 flex-shrink-0">
                <MessageSquare className="h-3 w-3 md:h-4 md:w-4 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 md:px-6 pb-3 md:pb-6">
            <div className="space-y-0.5 md:space-y-1">
              <div className="text-2xl md:text-3xl" style={{ color: '#535050' }}>{allReviews.length}</div>
              <div className="hidden md:flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span>+15% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Active Admins Card */}
        <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <CardHeader className="pb-2 md:pb-3 pt-3 md:pt-6 px-2 md:px-6">
            <div className="flex items-center justify-between gap-1">
              <CardTitle className="text-[9px] md:text-xs uppercase tracking-wide text-muted-foreground truncate">Active Admins</CardTitle>
              <div className="p-1.5 md:p-2 rounded-md md:rounded-lg bg-orange-500 transition-all duration-300 flex-shrink-0">
                <Users className="h-3 w-3 md:h-4 md:w-4 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 md:px-6 pb-3 md:pb-6">
            <div className="space-y-0.5 md:space-y-1">
              <div className="text-2xl md:text-3xl" style={{ color: '#535050' }}>{admins.length}</div>
              <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
                <span>Managing platform</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Discussions Card */}
        <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <CardHeader className="pb-2 md:pb-3 pt-3 md:pt-6 px-2 md:px-6">
            <div className="flex items-center justify-between gap-1">
              <CardTitle className="text-[9px] md:text-xs uppercase tracking-wide text-muted-foreground truncate">Discussions</CardTitle>
              <div className="p-1.5 md:p-2 rounded-md md:rounded-lg bg-teal-500 transition-all duration-300 flex-shrink-0">
                <MessageSquare className="h-3 w-3 md:h-4 md:w-4 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 md:px-6 pb-3 md:pb-6">
            <div className="space-y-0.5 md:space-y-1">
              <div className="text-2xl md:text-3xl" style={{ color: '#535050' }}>{discussions.length}</div>
              <div className="hidden md:flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span>+22% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Pending Reports Card */}
        <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <CardHeader className="pb-2 md:pb-3 pt-3 md:pt-6 px-2 md:px-6">
            <div className="flex items-center justify-between gap-1">
              <CardTitle className="text-[9px] md:text-xs uppercase tracking-wide text-muted-foreground truncate">
                <span className="hidden sm:inline">Pending Reports</span>
                <span className="sm:hidden">Reports</span>
              </CardTitle>
              <div className="p-1.5 md:p-2 rounded-md md:rounded-lg bg-red-500 transition-all duration-300 flex-shrink-0">
                <Flag className="h-3 w-3 md:h-4 md:w-4 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 md:px-6 pb-3 md:pb-6">
            <div className="space-y-0.5 md:space-y-1">
              <div className="text-2xl md:text-3xl" style={{ color: '#535050' }}>0</div>
              <div className="hidden md:flex items-center gap-1 text-xs text-amber-600">
                <AlertTriangle className="w-3 h-3" />
                <span>Requires attention</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics & Visualizations Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-6 h-6" style={{ color: '#879656' }} />
          <h2 className="text-xl md:text-2xl" style={{ color: '#535050' }}>Platform Analytics</h2>
        </div>

        {isLoadingAnalytics ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-none shadow-md">
                <CardHeader>
                  <div className="h-6 bg-muted animate-pulse rounded w-1/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted animate-pulse rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Books Added Over Time */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <LineChart className="w-5 h-5" style={{ color: '#879656' }} />
                  Books Added Over Time
                </CardTitle>
                <CardDescription>Monthly book additions (last 6 months)</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLine data={analyticsData.booksGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(83, 80, 80, 0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6b6866"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#6b6866"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff',
                        border: '1px solid rgba(83, 80, 80, 0.15)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#879656" 
                      strokeWidth={2}
                      dot={{ fill: '#879656', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Books Added"
                    />
                  </RechartsLine>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Review Rating Distribution */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="w-5 h-5" style={{ color: '#879656' }} />
                  Review Rating Distribution
                </CardTitle>
                <CardDescription>Count of reviews by star rating</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.reviewDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(83, 80, 80, 0.1)" />
                    <XAxis 
                      dataKey="rating" 
                      stroke="#6b6866"
                      style={{ fontSize: '12px' }}
                      label={{ value: 'Star Rating', position: 'insideBottom', offset: -5, style: { fontSize: '12px', fill: '#6b6866' } }}
                    />
                    <YAxis 
                      stroke="#6b6866"
                      style={{ fontSize: '12px' }}
                      label={{ value: 'Number of Reviews', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#6b6866' } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff',
                        border: '1px solid rgba(83, 80, 80, 0.15)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#879656"
                      radius={[8, 8, 0, 0]}
                      name="Reviews"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Growth */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <LineChart className="w-5 h-5" style={{ color: '#879656' }} />
                  User Growth
                </CardTitle>
                <CardDescription>New user registrations (last 6 months)</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLine data={analyticsData.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(83, 80, 80, 0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6b6866"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#6b6866"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff',
                        border: '1px solid rgba(83, 80, 80, 0.15)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#a8a584" 
                      strokeWidth={2}
                      dot={{ fill: '#a8a584', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="New Users"
                    />
                  </RechartsLine>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Genres */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="w-5 h-5" style={{ color: '#879656' }} />
                  Most Popular Genres
                </CardTitle>
                <CardDescription>Top 8 genres by book count</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.topGenres} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(83, 80, 80, 0.1)" />
                    <XAxis 
                      type="number"
                      stroke="#6b6866"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      dataKey="genre" 
                      type="category"
                      stroke="#6b6866"
                      style={{ fontSize: '12px' }}
                      width={100}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff',
                        border: '1px solid rgba(83, 80, 80, 0.15)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#879656"
                      radius={[0, 8, 8, 0]}
                      name="Books"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Reading Status Distribution */}
            {analyticsData.readingStatus.length > 0 && (
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="w-5 h-5" style={{ color: '#879656' }} />
                    Reading Status Distribution
                  </CardTitle>
                  <CardDescription>Books by reading status across all users</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.readingStatus}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(83, 80, 80, 0.1)" />
                      <XAxis 
                        dataKey="status" 
                        stroke="#6b6866"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="#6b6866"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff',
                          border: '1px solid rgba(83, 80, 80, 0.15)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="#a8a584"
                        radius={[8, 8, 0, 0]}
                        name="Books"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Admin Tabs - Modern Card Design */}
      <Card className="border-none shadow-lg max-w-full overflow-hidden">
        <Tabs defaultValue="books" className="w-full max-w-full" style={{ height: '900px', width: '100%', overflow: 'hidden' }}>
          <div className="border-b" style={{ backgroundColor: '#faf9f7' }}>
            <TabsList className="grid w-full grid-cols-4 h-12 md:h-14 bg-transparent p-1 md:p-2" aria-label="Admin dashboard sections">
              <TabsTrigger 
                value="books" 
                aria-label={`Manage books, ${books.length} total`}
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md md:rounded-lg transition-all text-xs md:text-sm px-1 md:px-3"
              >
                <BookOpen className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden sm:inline">Manage Books</span>
                <span className="sm:hidden">Books</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                aria-label={`View reviews, ${allReviews.length} total`}
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md md:rounded-lg transition-all text-xs md:text-sm px-1 md:px-3"
              >
                <MessageSquare className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden sm:inline">View Reviews</span>
                <span className="sm:hidden">Reviews</span>
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                aria-label={`User management, ${users.length} users`}
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md md:rounded-lg transition-all text-xs md:text-sm px-1 md:px-3"
              >
                <Users className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden sm:inline">User Management</span>
                <span className="sm:hidden">Users</span>
              </TabsTrigger>
              <TabsTrigger 
                value="community" 
                aria-label="Community management and moderation"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md md:rounded-lg transition-all text-xs md:text-sm px-1 md:px-3"
              >
                <Flag className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden sm:inline">Community</span>
                <span className="sm:hidden">Community</span>
              </TabsTrigger>
            </TabsList>
          </div>

        {/* Books Management */}
        <TabsContent value="books" className="space-y-3 md:space-y-4 p-4 md:p-6" style={{ height: '800px', overflow: 'hidden' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
            <div>
              <h2 className="text-lg md:text-2xl mb-0.5 md:mb-1" style={{ color: '#535050' }}>Book Management</h2>
              <p className="text-xs md:text-sm text-muted-foreground">Add, edit, or remove books from your library</p>
            </div>
            <Dialog open={isAddingBook} onOpenChange={setIsAddingBook}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 shadow-md text-sm md:text-base h-9 md:h-10 whitespace-nowrap" style={{ backgroundColor: '#879656' }}>
                  <Plus className="w-3 h-3 md:w-4 md:h-4" />
                  Add New Book
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Book</DialogTitle>
                  <DialogDescription>
                    Add a new book to the library collection. Fill in the required information below.
                  </DialogDescription>
                </DialogHeader>
                <BookForm />
              </DialogContent>
            </Dialog>
          </div>

          {/* Search Bar for Books */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              value={bookSearchQuery}
              onChange={(e) => setBookSearchQuery(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>

          {/* Nested Tabs for Book Library and Book Requests */}
          <Tabs defaultValue="library" className="w-full">
            <TabsList className="grid w-full grid-cols-2 text-xs md:text-sm">
              <TabsTrigger value="library" className="text-xs md:text-sm">Book Library</TabsTrigger>
              <TabsTrigger value="requests" className="text-xs md:text-sm">
                <span className="hidden sm:inline">Book Requests ({bookRequests.filter(r => r.status === 'pending').length})</span>
                <span className="sm:hidden">Requests ({bookRequests.filter(r => r.status === 'pending').length})</span>
              </TabsTrigger>
            </TabsList>

            {/* Book Library Tab */}
            <TabsContent value="library" className="space-y-4">
              {/* Card View - Shows on all screen sizes */}
              <div style={{ height: '600px', overflow: 'auto' }}>
                <div className="space-y-2 p-2">
                  {filteredBooks.map((book) => (
                    <Card 
                      key={book.id}
                      className="p-3 cursor-pointer hover:shadow-md transition-shadow border-l-4 active:scale-[0.98]"
                      style={{ borderLeftColor: '#879656' }}
                      onClick={() => handleOpenEditDialog(book)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 flex-1 min-w-0">
                          <h3 className="font-medium text-sm line-clamp-1" style={{ color: '#535050' }}>
                            {book.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            by {book.author}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground flex-shrink-0">
                          {book.publishedYear}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {filteredBooks.length === 0 && bookSearchQuery && (
                <div className="text-center py-8 text-muted-foreground">
                  No books found matching "{bookSearchQuery}"
                </div>
              )}
            </TabsContent>

            {/* Book Requests Tab */}
            <TabsContent value="requests" className="space-y-4">
              {/* Card View - Shows on all screen sizes */}
              <div style={{ height: '600px', overflow: 'auto' }}>
                {bookRequests.filter(req => req.status === 'pending').length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending book requests
                  </div>
                ) : (
                  <div className="space-y-2 p-2">
                    {bookRequests
                      .filter(req => req.status === 'pending')
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((request) => (
                        <Card 
                          key={request.id}
                          className="p-3 cursor-pointer hover:shadow-md transition-shadow border-l-4 active:scale-[0.98]"
                          style={{ borderLeftColor: '#879656' }}
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsViewingRequest(true);
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1 flex-1 min-w-0">
                              <h3 className="font-medium text-sm line-clamp-1" style={{ color: '#535050' }}>
                                {request.title}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                by {request.author}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Requested by: {request.userName || 'Unknown User'}
                              </p>
                            </div>
                            <div className="text-xs text-muted-foreground flex-shrink-0">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Reviews Management */}
        <TabsContent value="reviews" className="space-y-3 md:space-y-4 p-4 md:p-6" style={{ height: '800px', overflow: 'hidden' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
            <div>
              <h2 className="text-lg md:text-2xl mb-0.5 md:mb-1" style={{ color: '#535050' }}>Review Moderation</h2>
              <p className="text-xs md:text-sm text-muted-foreground">Monitor and manage user reviews and reports</p>
            </div>
          </div>

          {/* Nested Tabs to match Manage Books structure */}
          <Tabs defaultValue="all-reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-2 text-xs md:text-sm">
              <TabsTrigger value="all-reviews" className="text-xs md:text-sm">All Reviews</TabsTrigger>
              <TabsTrigger value="reported-reviews" className="text-xs md:text-sm">
                <span className="hidden sm:inline">Reported Reviews ({reviewReports.filter(r => r.status === 'pending').length})</span>
                <span className="sm:hidden">Reported ({reviewReports.filter(r => r.status === 'pending').length})</span>
              </TabsTrigger>
            </TabsList>

            {/* All Reviews Tab - Card View */}
            <TabsContent value="all-reviews" className="space-y-4">
              {/* Search and Filter Controls */}
              <div className="space-y-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews by content, user, or book title..."
                    value={reviewSearchQuery}
                    onChange={(e) => setReviewSearchQuery(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-2">
                  <Select value={reviewRatingFilter} onValueChange={setReviewRatingFilter}>
                    <SelectTrigger className="w-[140px] text-sm h-9">
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={reviewDateFilter} onValueChange={setReviewDateFilter}>
                    <SelectTrigger className="w-[140px] text-sm h-9">
                      <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>

                  {(reviewSearchQuery || reviewRatingFilter !== 'all' || reviewDateFilter !== 'all') && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearAllReviewFilters}
                      className="text-xs h-9"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>

                {/* Results Count */}
                <div className="text-xs text-muted-foreground">
                  Showing {filteredReviews.length} of {allReviews.length} reviews
                </div>
              </div>

              {/* Reviews List */}
              <div style={{ height: '600px', overflow: 'auto' }}>
                <div className="space-y-3 p-2">
                  {filteredReviews.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {allReviews.length === 0 ? 'No reviews yet' : 'No reviews match your filters'}
                    </div>
                  ) : (
                    filteredReviews.map((review) => {
                      const book = books.find(b => b.id === review.bookId);
                      const isEditing = editingReviewId === review.id;
                      
                      return (
                        <Card 
                          key={review.id}
                          className="p-4 hover:shadow-md transition-shadow border-l-4"
                          style={{ borderLeftColor: '#879656' }}
                        >
                          {isEditing ? (
                            // Edit Mode
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">Editing Review</h4>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancelEditReview}
                                    className="h-8"
                                  >
                                    <X className="w-4 h-4 mr-1" />
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveEditReview(review.id)}
                                    className="h-8"
                                    style={{ backgroundColor: '#879656' }}
                                  >
                                    <Save className="w-4 h-4 mr-1" />
                                    Save
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div>
                                  <Label className="text-xs">Rating</Label>
                                  <StarRating
                                    rating={editingReviewData.rating}
                                    onRatingChange={(rating) => 
                                      setEditingReviewData({ ...editingReviewData, rating })
                                    }
                                    size="md"
                                  />
                                </div>
                                
                                <div>
                                  <Label className="text-xs">Review Title (Optional)</Label>
                                  <Input
                                    value={editingReviewData.title}
                                    onChange={(e) => 
                                      setEditingReviewData({ ...editingReviewData, title: e.target.value })
                                    }
                                    placeholder="Enter review title..."
                                    className="text-sm"
                                  />
                                </div>
                                
                                <div>
                                  <Label className="text-xs">Review Content</Label>
                                  <Textarea
                                    value={editingReviewData.content}
                                    onChange={(e) => 
                                      setEditingReviewData({ ...editingReviewData, content: e.target.value })
                                    }
                                    placeholder="Write your review..."
                                    className="min-h-[100px] text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <div className="space-y-3">
                              {/* Header - Book and User Info */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <StarRating rating={review.rating} readonly size="sm" />
                                    <span className="text-xs text-muted-foreground">
                                      by {review.userName}
                                    </span>
                                  </div>
                                  
                                  {book && (
                                    <div className="text-xs text-muted-foreground">
                                      <span className="font-medium">{book.title}</span> by {book.author}
                                    </div>
                                  )}
                                  
                                  {review.title && (
                                    <h4 className="font-medium text-sm mt-2">{review.title}</h4>
                                  )}
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStartEditReview(review)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to delete this review?')) {
                                        handleDeleteReview(review.id);
                                      }
                                    }}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              {/* Review Content */}
                              <p className="text-sm text-foreground whitespace-pre-wrap">
                                {review.content}
                              </p>
                              
                              {/* Footer - Date */}
                              <div className="flex items-center justify-between pt-2 border-t">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(review.date).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </span>
                              </div>
                            </div>
                          )}
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Reported Reviews Tab */}
            <TabsContent value="reported-reviews" className="space-y-4">
              <Card style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
                <CardContent style={{ padding: '0', flex: '1', overflow: 'hidden' }}>
                  <div className="overflow-x-auto h-full">
                    <ReportedReviewsTable
                      reports={reviewReports}
                      books={books}
                      reviews={allReviews}
                      onUpdateReportStatus={handleUpdateReportStatus}
                      onDeleteReview={handleDeleteReview}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="space-y-3 md:space-y-4 p-4 md:p-6" style={{ height: '800px', overflow: 'hidden' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
            <div>
              <h2 className="text-lg md:text-2xl mb-0.5 md:mb-1" style={{ color: '#535050' }}>User Management</h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                Manage user accounts and administrator privileges
                {lastUserUpdate && (
                  <span className="ml-2 text-xs text-muted-foreground/70">
                    • Updated {lastUserUpdate.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={loadUsers}
                disabled={isLoadingUsers}
                className="flex items-center gap-2 h-9 md:h-10"
              >
                <TrendingUp className={`w-3 h-3 md:w-4 md:h-4 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                {isLoadingUsers ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button className="flex items-center gap-2 shadow-md text-sm md:text-base h-9 md:h-10 whitespace-nowrap" style={{ backgroundColor: '#879656' }}>
                <Plus className="w-3 h-3 md:w-4 md:h-4" />
                Add User
              </Button>
            </div>
          </div>

          {/* Search Bar for Users */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-10 text-sm"
            />
          </div>

          {/* Nested Tabs to match Manage Books structure */}
          <Tabs defaultValue="all-users" className="w-full">
            <TabsList className="grid w-full grid-cols-2 text-xs md:text-sm">
              <TabsTrigger value="all-users" className="text-xs md:text-sm">All Users</TabsTrigger>
              <TabsTrigger value="admins" className="text-xs md:text-sm">
                <span className="hidden sm:inline">Administrators ({admins.length})</span>
                <span className="sm:hidden">Admins ({admins.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* All Users Tab */}
            <TabsContent value="all-users" className="space-y-4">
              <Card style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
                <CardContent style={{ padding: '0', flex: '1', overflow: 'hidden' }}>
                  <div className="overflow-x-auto h-full">
                    <UserManagementTable
                      users={transformedUsers}
                      onEditUser={handleManageUser}
                      type="users"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

        {/* Administrators Tab */}
        <TabsContent value="admins" className="space-y-4">
          <Card style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            <CardContent style={{ padding: '0', flex: '1', overflow: 'hidden' }}>
              <div className="overflow-x-auto h-full">
                <UserManagementTable
                  users={transformedAdmins}
                  onEditUser={handleEditAdmin}
                  onDeleteUser={handleDemoteFromAdmin}
                  type="admins"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </TabsContent>

        {/* Community Management */}
        <TabsContent value="community" className="space-y-3 md:space-y-4 p-4 md:p-6" style={{ height: '800px', overflow: 'hidden' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
            <div>
              <h2 className="text-lg md:text-2xl mb-0.5 md:mb-1" style={{ color: '#535050' }}>Community Management</h2>
              <p className="text-xs md:text-sm text-muted-foreground">Monitor discussions and handle community reports</p>
            </div>
            <Button 
              className="flex items-center gap-1 md:gap-2 shadow-md text-xs md:text-base h-9 md:h-10 whitespace-nowrap px-3 md:px-4"
              onClick={handleCreateAnnouncement}
              style={{ backgroundColor: '#879656' }}
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Create Announcement</span>
              <span className="sm:hidden">Announcement</span>
            </Button>
          </div>

          {/* Nested Tabs to match Reviews structure */}
          <Tabs defaultValue="discussions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 text-xs md:text-sm">
              <TabsTrigger value="discussions" className="text-xs md:text-sm">
                <span className="hidden sm:inline">Active Discussions</span>
                <span className="sm:hidden">Discussions</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="text-xs md:text-sm">
                <span className="hidden sm:inline">Community Reports ({discussionReports.filter(r => r.status === 'pending').length})</span>
                <span className="sm:hidden">Reports ({discussionReports.filter(r => r.status === 'pending').length})</span>
              </TabsTrigger>
            </TabsList>

            {/* Active Discussions Tab - Card View */}
            <TabsContent value="discussions" className="space-y-4">
              {/* Search Bar for Discussions */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search discussions by title or author..."
                  className="pl-10 text-sm"
                />
              </div>

              <div style={{ height: '600px', overflow: 'auto' }}>
                {isLoadingDiscussions ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading discussions...
                  </div>
                ) : (
                  <div className="space-y-2 p-2">
                    {discussions.map((discussion) => (
                      <Card 
                        key={discussion.id}
                        className="p-3 hover:shadow-md transition-shadow border-l-4"
                        style={{ borderLeftColor: '#879656' }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Left Side - Discussion Info */}
                          <div className="flex-1 min-w-0 space-y-2">
                            {/* Title and Popular Badge */}
                            <div className="space-y-1">
                              <div className="flex items-start gap-2">
                                <h4 className="text-sm font-medium line-clamp-2 flex-1">{discussion.title}</h4>
                                {discussion.replyCount >= 20 && (
                                  <Badge variant="secondary" className="text-xs whitespace-nowrap flex-shrink-0">
                                    🔥 Popular
                                  </Badge>
                                )}
                              </div>
                              {discussion.bookTitle && (
                                <p className="text-xs text-muted-foreground">
                                  Book: {discussion.bookTitle}
                                </p>
                              )}
                            </div>

                            {/* Meta Info Row */}
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Avatar className="w-5 h-5">
                                  <AvatarImage src={discussion.userAvatar} alt={discussion.userName} />
                                  <AvatarFallback className="text-[10px]">{discussion.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <span>{discussion.userName}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                <span>{discussion.replyCount} replies</span>
                              </div>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">{discussion.category}</Badge>
                              <span>{getTimeAgo(discussion.createdAt)}</span>
                            </div>
                          </div>

                          {/* Right Side - Action Buttons */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditDiscussion(discussion.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteDiscussionClick(discussion.id, discussion.title)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}

                    {discussions.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No discussions found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Community Reports Tab - Card View */}
            <TabsContent value="reports" className="space-y-4">
              {/* Report Status Filter and Refresh */}
              <div className="flex items-center justify-between gap-3 px-2">
                <div className="flex items-center gap-3">
                  <Label className="text-sm whitespace-nowrap">Filter by Status:</Label>
                  <Select value={reportStatusFilter} onValueChange={(value: any) => setReportStatusFilter(value)}>
                    <SelectTrigger className="w-[180px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reports ({discussionReports.length})</SelectItem>
                      <SelectItem value="pending">Pending ({discussionReports.filter(r => r.status === 'pending').length})</SelectItem>
                      <SelectItem value="resolved">Resolved ({discussionReports.filter(r => r.status === 'resolved').length})</SelectItem>
                      <SelectItem value="dismissed">Dismissed ({discussionReports.filter(r => r.status === 'dismissed').length})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={loadDiscussionReports}
                  variant="outline"
                  size="sm"
                  disabled={isLoadingReports}
                >
                  {isLoadingReports ? 'Loading...' : 'Refresh Reports'}
                </Button>
              </div>

              <div style={{ height: '550px', overflow: 'auto' }}>
                {isLoadingReports ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading reports...
                  </div>
                ) : (
                  <div className="space-y-2 p-2">
                    {filteredDiscussionReports.map((report) => (
                    <Card 
                      key={report.id}
                      className="p-4 border-l-4"
                      style={{ 
                        borderLeftColor: report.status === 'pending' ? '#f59e0b' : 
                                        report.status === 'resolved' ? '#10b981' : '#6b7280'
                      }}
                    >
                      <div className="space-y-3">
                        {/* Header Row */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium line-clamp-1">{report.contentTitle}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Type: {report.contentType} • By: {report.originalAuthor}
                            </p>
                          </div>
                          <Badge className={`text-xs whitespace-nowrap flex-shrink-0 ${
                            report.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                            report.status === 'resolved' ? 'bg-green-100 text-green-800 border-green-300' :
                            'bg-gray-100 text-gray-800 border-gray-300'
                          }`}>
                            {report.status === 'pending' ? 'Pending' : 
                             report.status === 'resolved' ? 'Resolved' : 'Dismissed'}
                          </Badge>
                        </div>

                        {/* Meta Info Grid */}
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div>
                            <span className="text-muted-foreground">Reported By:</span>
                            <p className="font-medium mt-0.5">{report.reporterName}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Reason:</span>
                            <p className="font-medium mt-0.5">
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                                {report.reason}
                              </Badge>
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date:</span>
                            <p className="font-medium mt-0.5">{new Date(report.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {/* Description - Only show if provided */}
                        {report.description && (
                          <div className="pt-2 border-t">
                            <span className="text-xs text-muted-foreground">Additional Details:</span>
                            <p className="text-xs mt-1 text-[#535050] bg-[#faf9f7] p-2 rounded">
                              {report.description}
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        {report.status === 'pending' && (
                          <div className="flex items-center gap-2 pt-2 border-t">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDismissCommunityReport(report.id, report.contentTitle)}
                              className="flex-1 h-8 text-xs"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" />
                              Dismiss
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleResolveCommunityReport(report.id, report.contentTitle)}
                              className="flex-1 h-8 text-xs"
                              style={{ backgroundColor: '#879656' }}
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-1" />
                              Resolve
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}

                    {filteredDiscussionReports.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        {reportStatusFilter === 'all' ? 'No community reports found' : `No ${reportStatusFilter} reports`}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
        </Card>

      {/* Edit Book Dialog */}
      <Dialog open={isEditingBook} onOpenChange={setIsEditingBook}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle>Edit Book</DialogTitle>
                <DialogDescription>
                  Update the book information below. Make sure all required fields are filled correctly.
                </DialogDescription>
              </div>
              {selectedBook && (
                <PrintBookReport 
                  book={selectedBook}
                  reviews={allReviews.filter(r => r.bookId === selectedBook.id)}
                />
              )}
            </div>
          </DialogHeader>
          <BookForm isEdit={true} />
        </DialogContent>
      </Dialog>

      {/* Book Request Details Dialog (Mobile) */}
      <Dialog open={isViewingRequest} onOpenChange={setIsViewingRequest}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Book Request Details</DialogTitle>
            <DialogDescription>
              Review the details of this book request
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              {/* Book Information */}
              <div className="space-y-3 pb-4 border-b">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide">Title</label>
                  <p className="text-sm font-medium mt-1" style={{ color: '#535050' }}>{selectedRequest.title}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide">Author</label>
                  <p className="text-sm mt-1">{selectedRequest.author}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide">ISBN</label>
                  <p className="text-sm mt-1">
                    {selectedRequest.isbn || <span className="text-muted-foreground italic">Not provided</span>}
                  </p>
                </div>
              </div>

              {/* Request Information */}
              <div className="space-y-3 pb-4 border-b">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide">Requested By</label>
                  <p className="text-sm mt-1">{selectedRequest.requestedBy}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide">Request Date</label>
                  <p className="text-sm mt-1">
                    {new Date(selectedRequest.requestDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Additional Notes */}
              {selectedRequest.additionalNotes && (
                <div className="pb-4 border-b">
                  <label className="text-xs text-muted-foreground uppercase tracking-wide">Additional Notes</label>
                  <p className="text-sm mt-2 p-3 rounded-lg" style={{ backgroundColor: '#faf9f7' }}>
                    {selectedRequest.additionalNotes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to deny this request?')) {
                      handleDenyRequest(selectedRequest.id);
                    }
                  }}
                >
                  Deny
                </Button>
                <Button
                  className="flex-1"
                  style={{ backgroundColor: '#879656' }}
                  onClick={() => handleApproveRequest(selectedRequest.id)}
                >
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Book Reviews Dialog */}
      <Dialog open={isViewingBookReviews} onOpenChange={setIsViewingBookReviews}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reviews for {selectedBookForReviews?.title}</DialogTitle>
            <DialogDescription>
              by {selectedBookForReviews?.author}
            </DialogDescription>
          </DialogHeader>
          {selectedBookForReviews && (
            <div className="space-y-4 mt-4">
              {allReviews
                .filter(review => review.bookId === selectedBookForReviews.id)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((review) => {
                  const isEditing = editingReviewId === review.id;
                  
                  return (
                    <Card key={review.id} className="p-4">
                      <div className="space-y-3">
                        {/* Review Header */}
                        {!isEditing ? (
                          <>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <StarRating rating={review.rating} size="sm" />
                                  <span className="text-sm font-medium">{review.rating}/5</span>
                                </div>
                                {review.title && (
                                  <h4 className="font-medium text-sm mb-1">{review.title}</h4>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground flex-shrink-0">
                                {new Date(review.date).toLocaleDateString()}
                              </div>
                            </div>

                            {/* Review Content */}
                            <p className="text-sm text-muted-foreground">
                              {review.content}
                            </p>
                          </>
                        ) : (
                          /* Edit Form */
                          <div className="space-y-3 p-3 rounded-lg" style={{ backgroundColor: '#faf9f7' }}>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-rating-${review.id}`} className="text-xs">Rating</Label>
                              <Select
                                value={editingReviewData.rating.toString()}
                                onValueChange={(value) => setEditingReviewData({
                                  ...editingReviewData,
                                  rating: parseInt(value)
                                })}
                              >
                                <SelectTrigger id={`edit-rating-${review.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 - Poor</SelectItem>
                                  <SelectItem value="2">2 - Fair</SelectItem>
                                  <SelectItem value="3">3 - Good</SelectItem>
                                  <SelectItem value="4">4 - Very Good</SelectItem>
                                  <SelectItem value="5">5 - Excellent</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`edit-title-${review.id}`} className="text-xs">Review Title (Optional)</Label>
                              <Input
                                id={`edit-title-${review.id}`}
                                value={editingReviewData.title}
                                onChange={(e) => setEditingReviewData({
                                  ...editingReviewData,
                                  title: e.target.value
                                })}
                                placeholder="Brief summary of your review"
                                className="text-sm"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`edit-content-${review.id}`} className="text-xs">Review Content *</Label>
                              <Textarea
                                id={`edit-content-${review.id}`}
                                value={editingReviewData.content}
                                onChange={(e) => setEditingReviewData({
                                  ...editingReviewData,
                                  content: e.target.value
                                })}
                                placeholder="Share your thoughts about this book..."
                                className="text-sm min-h-[100px]"
                              />
                            </div>

                            {/* Edit Action Buttons */}
                            <div className="flex items-center gap-2 pt-2">
                              <Button
                                size="sm"
                                onClick={() => handleSaveEditReview(review.id)}
                                style={{ backgroundColor: '#879656' }}
                                className="flex items-center gap-2"
                              >
                                <Save className="w-4 h-4" />
                                Save Changes
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelEditReview}
                                className="flex items-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Review Footer */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={review.userAvatar} />
                              <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{review.userName}</span>
                          </div>

                          {/* Action Buttons */}
                          {!isEditing && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStartEditReview(review)}
                                className="flex items-center gap-1"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this review?')) {
                                    handleDeleteReview(review.id);
                                    // Check if this was the last review for this book
                                    const remainingReviews = allReviews.filter(
                                      r => r.bookId === selectedBookForReviews.id && r.id !== review.id
                                    );
                                    if (remainingReviews.length === 0) {
                                      setIsViewingBookReviews(false);
                                    }
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}

              {allReviews.filter(review => review.bookId === selectedBookForReviews.id).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No reviews found for this book
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={isEditingAdmin} onOpenChange={setIsEditingAdmin}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Administrator</DialogTitle>
            <DialogDescription>
              Update administrator information and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Name *</Label>
                <Input
                  id="admin-name"
                  value={adminFormData.name}
                  onChange={(e) => setAdminFormData({ ...adminFormData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email *</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={adminFormData.email}
                  onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Manage Books</span>
                  <input
                    type="checkbox"
                    checked={adminFormData.permissions.manageBooks}
                    onChange={(e) => setAdminFormData({
                      ...adminFormData,
                      permissions: { ...adminFormData.permissions, manageBooks: e.target.checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Manage Users</span>
                  <input
                    type="checkbox"
                    checked={adminFormData.permissions.manageUsers}
                    onChange={(e) => setAdminFormData({
                      ...adminFormData,
                      permissions: { ...adminFormData.permissions, manageUsers: e.target.checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Manage Reviews</span>
                  <input
                    type="checkbox"
                    checked={adminFormData.permissions.manageReviews}
                    onChange={(e) => setAdminFormData({
                      ...adminFormData,
                      permissions: { ...adminFormData.permissions, manageReviews: e.target.checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">System Settings</span>
                  <input
                    type="checkbox"
                    checked={adminFormData.permissions.systemSettings}
                    onChange={(e) => setAdminFormData({
                      ...adminFormData,
                      permissions: { ...adminFormData.permissions, systemSettings: e.target.checked }
                    })}
                  />
                </div>
              </div>
            </div>
            
            <Button onClick={handleSaveAdmin} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Management Dialog */}
      <Dialog open={isManagingUser} onOpenChange={setIsManagingUser}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage User Account</DialogTitle>
            <DialogDescription>
              Manage user account settings and perform administrative actions.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info Display */}
              <div className="bg-muted/20 rounded-lg p-4 space-y-2">
                <h4 className="font-medium">{selectedUser.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                <p className="text-xs text-muted-foreground">
                  Member since: {new Date(selectedUser.joinDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Books read: {selectedUser.booksRead}
                </p>
              </div>

              {/* Account Actions */}
              <div className="space-y-3">
                <h5 className="font-medium text-sm">Account Actions</h5>
                
                <Button
                  variant="outline"
                  onClick={handleResetUserPassword}
                  className="w-full justify-start"
                >
                  Reset Password
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleSuspendUser}
                  className="w-full justify-start text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  Suspend Account (30 days)
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleBanUser}
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Ban User (Permanent)
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={handleDeleteUser}
                  className="w-full justify-start"
                >
                  Delete Account & Data
                </Button>
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <strong>Warning:</strong> Account actions cannot be easily undone. 
                  Please ensure you have proper authorization before proceeding.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Discussion Dialog */}
      <Dialog open={isEditingDiscussion} onOpenChange={setIsEditingDiscussion}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Discussion</DialogTitle>
            <DialogDescription>
              Modify discussion details including title, category, and related book information.
            </DialogDescription>
          </DialogHeader>
          {selectedDiscussion && (
            <div className="space-y-6">
              {/* Discussion Info Display */}
              <div className="bg-muted/20 rounded-lg p-4 space-y-2">
                <h4 className="font-medium">Discussion Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Author:</span>
                    <p className="font-medium">{selectedDiscussion.author}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Replies:</span>
                    <p className="font-medium">{selectedDiscussion.replies}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Activity:</span>
                    <p className="font-medium">{selectedDiscussion.lastActivity}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p className="font-medium">{selectedDiscussion.isPopular ? 'Popular' : 'Regular'}</p>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              <div className="space-y-4">
                {/* Discussion Title */}
                <div className="space-y-2">
                  <Label htmlFor="discussion-title">Discussion Title *</Label>
                  <Textarea
                    id="discussion-title"
                    placeholder="Enter discussion title..."
                    value={discussionFormData.title}
                    onChange={(e) => setDiscussionFormData({
                      ...discussionFormData,
                      title: e.target.value
                    })}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="discussion-category">Category *</Label>
                  <Select 
                    value={discussionFormData.category} 
                    onValueChange={(value) => setDiscussionFormData({
                      ...discussionFormData,
                      category: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Book Discussion">Book Discussion</SelectItem>
                      <SelectItem value="Recommendations">Recommendations</SelectItem>
                      <SelectItem value="General Discussion">General Discussion</SelectItem>
                      <SelectItem value="Book Club">Book Club</SelectItem>
                      <SelectItem value="Author Discussion">Author Discussion</SelectItem>
                      <SelectItem value="Reading Challenge">Reading Challenge</SelectItem>
                      <SelectItem value="News & Updates">News & Updates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Related Book */}
                <div className="space-y-2">
                  <Label htmlFor="discussion-book">Related Book</Label>
                  <Input
                    id="discussion-book"
                    placeholder="Enter book title (optional)..."
                    value={discussionFormData.bookTitle}
                    onChange={(e) => setDiscussionFormData({
                      ...discussionFormData,
                      bookTitle: e.target.value
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Link this discussion to a specific book (leave empty if not book-specific)
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditingDiscussion(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveDiscussion}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Announcement Dialog */}
      <Dialog open={isCreatingAnnouncement} onOpenChange={setIsCreatingAnnouncement}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Community Announcement</DialogTitle>
            <DialogDescription>
              Create a new announcement to inform the community about important updates, events, or information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Announcement Form */}
            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="announcement-title">Announcement Title *</Label>
                <Input
                  id="announcement-title"
                  placeholder="Enter announcement title..."
                  value={announcementFormData.title}
                  onChange={(e) => setAnnouncementFormData({
                    ...announcementFormData,
                    title: e.target.value
                  })}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="announcement-content">Content *</Label>
                <Textarea
                  id="announcement-content"
                  placeholder="Write your announcement content here..."
                  value={announcementFormData.content}
                  onChange={(e) => setAnnouncementFormData({
                    ...announcementFormData,
                    content: e.target.value
                  })}
                  rows={6}
                  className="resize-none"
                />
              </div>

              {/* Settings Row 1: Priority and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="announcement-priority">Priority Level</Label>
                  <Select 
                    value={announcementFormData.priority} 
                    onValueChange={(value) => setAnnouncementFormData({
                      ...announcementFormData,
                      priority: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="normal">Normal Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="announcement-category">Category</Label>
                  <Select 
                    value={announcementFormData.category} 
                    onValueChange={(value) => setAnnouncementFormData({
                      ...announcementFormData,
                      category: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="feature">New Feature</SelectItem>
                      <SelectItem value="event">Community Event</SelectItem>
                      <SelectItem value="policy">Policy Update</SelectItem>
                      <SelectItem value="contest">Contest/Challenge</SelectItem>
                      <SelectItem value="book-spotlight">Book Spotlight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Settings Row 2: Expiry Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="announcement-expiry">Expiry Date (Optional)</Label>
                  <Input
                    id="announcement-expiry"
                    type="date"
                    value={announcementFormData.expiryDate}
                    onChange={(e) => setAnnouncementFormData({
                      ...announcementFormData,
                      expiryDate: e.target.value
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty if announcement should not expire
                  </p>
                </div>
              </div>

              {/* Settings Row 3: Checkboxes */}
              <div className="space-y-3">
                <Label>Display Options</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="announcement-pinned"
                      checked={announcementFormData.isPinned}
                      onChange={(e) => setAnnouncementFormData({
                        ...announcementFormData,
                        isPinned: e.target.checked
                      })}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                    />
                    <Label htmlFor="announcement-pinned" className="text-sm">
                      Pin to top of community page
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="announcement-global"
                      checked={announcementFormData.isGlobal}
                      onChange={(e) => setAnnouncementFormData({
                        ...announcementFormData,
                        isGlobal: e.target.checked
                      })}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                    />
                    <Label htmlFor="announcement-global" className="text-sm">
                      Show globally across all pages
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-2 pt-4 border-t">
              <Label>Preview</Label>
              <div className="bg-muted/20 rounded-lg p-4 border">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">
                      {announcementFormData.title || 'Announcement Title'}
                    </h4>
                    {announcementFormData.priority === 'urgent' && (
                      <Badge variant="destructive" className="text-xs">Urgent</Badge>
                    )}
                    {announcementFormData.priority === 'high' && (
                      <Badge variant="default" className="text-xs">High Priority</Badge>
                    )}
                    {announcementFormData.isPinned && (
                      <Badge variant="secondary" className="text-xs">📌 Pinned</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {announcementFormData.content || 'Announcement content will appear here...'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Category: {announcementFormData.category}</span>
                    {announcementFormData.expiryDate && (
                      <span>• Expires: {new Date(announcementFormData.expiryDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setIsCreatingAnnouncement(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveAnnouncement}>
                Create Announcement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}