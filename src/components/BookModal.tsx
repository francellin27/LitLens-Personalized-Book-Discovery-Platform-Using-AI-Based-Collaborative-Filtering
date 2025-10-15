import { Book, Review, MOCK_BOOKS } from '../lib/bookData';
import { StarRating } from './StarRating';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  Hash, 
  Heart, 
  Share2, 
  X, 
  BookmarkPlus, 
  ChevronDown, 
  ChevronUp,
  Eye,
  Users,
  MessageSquare,
  ThumbsUp,
  Send,
  Clock,
  Check,
  Edit,
  Trash2,
  Shield,
  Settings,
  Flag
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../lib/auth-supabase';
import { getUserBookStatus, setUserBookStatus, removeUserBookStatus } from '../lib/supabase-services';

interface BookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onViewUser?: (userId: string) => void;
  onBookSelect?: (book: Book) => void;
}

interface ReviewCardProps {
  review: Review;
  onViewUser?: (userId: string) => void;
  isAdmin?: boolean;
  onDeleteReview?: (reviewId: string) => void;
  onReportReview?: (reviewId: string) => void;
}

function ReviewCard({ review, onViewUser, isAdmin, onDeleteReview, onReportReview }: ReviewCardProps) {
  const [isHelpful, setIsHelpful] = useState(false);
  
  const handleHelpful = () => {
    setIsHelpful(!isHelpful);
    toast.success(isHelpful ? 'Feedback removed' : 'Marked as helpful');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-muted/20 rounded-xl p-4 space-y-3 hover:bg-muted/30 transition-colors">
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={review.userAvatar} alt={review.userName} />
          <AvatarFallback className="bg-primary/10 text-primary">{review.userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => onViewUser && onViewUser(review.userId || 'user_456')}
              className="font-medium truncate text-left hover:text-primary transition-colors cursor-pointer p-0 bg-transparent border-none"
            >
              {review.userName}
            </button>
            <StarRating rating={review.rating} size="sm" />
          </div>
          {review.title && (
            <h4 className="font-medium text-sm mb-1">{review.title}</h4>
          )}
          <p className="text-sm text-muted-foreground mb-3">
            {formatDate(review.date)}
          </p>
          <p className="text-sm leading-relaxed mb-3">
            {review.content}
          </p>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHelpful}
              className={`h-7 px-2 text-xs rounded-full min-touch-target ${
                isHelpful ? 'text-primary bg-primary/15 hover:bg-primary/20' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
              }`}
            >
              <ThumbsUp className="w-3 h-3 mr-1" />
              Helpful ({review.helpful + (isHelpful ? 1 : 0)})
            </Button>
            
            <div className="flex items-center gap-2">
              {!isAdmin && onReportReview && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReportReview(review.id)}
                  className="h-7 px-2 text-xs rounded-full min-touch-target text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <Flag className="w-3 h-3 mr-1" />
                  Report
                </Button>
              )}
              
              {isAdmin && onDeleteReview && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteReview(review.id)}
                  className="h-7 px-2 text-xs rounded-full min-touch-target text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookModal({ book, isOpen, onClose, onViewUser, onBookSelect }: BookModalProps) {
  const { user, reportReview } = useAuth();
  const [userRating, setUserRating] = useState(book?.userRating || 0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isInReadingList, setIsInReadingList] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [userComment, setUserComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showLogBookDialog, setShowLogBookDialog] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [finishDate, setFinishDate] = useState<Date | undefined>(undefined);
  const [isLoggingBook, setIsLoggingBook] = useState(false);
  const [showAdminActions, setShowAdminActions] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<string>('all');

  // Helper function to check if book ID is a valid UUID
  const isValidBookId = (id: string): boolean => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  };

  // Load user's book status from Supabase
  useEffect(() => {
    async function loadBookStatus() {
      if (!user?.id || !book?.id) return;

      // Check if book ID is a valid UUID (from database) or numeric ID (from mock data)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(book.id);
      
      if (!isUUID) {
        // This is mock data, skip loading from database
        return;
      }

      setLoadingStatus(true);
      try {
        const status = await getUserBookStatus(user.id, book.id);
        setIsFavorited(status.isFavorite || false);
        setIsInReadingList(status.isWantToRead || false);
        setIsReading(status.isReading || false);
        setIsCompleted(status.isCompleted || false);
        if (status.userRating) {
          setUserRating(status.userRating);
        }
      } catch (error) {
        console.error('Error loading book status:', error);
      } finally {
        setLoadingStatus(false);
      }
    }

    loadBookStatus();
  }, [user?.id, book?.id]);

  if (!book) return null;

  // Function to find similar books
  const getSimilarBooks = (currentBook: Book): Book[] => {
    return MOCK_BOOKS
      .filter(b => b.id !== currentBook.id) // Exclude current book
      .map(b => {
        let score = 0;
        
        // Same genre gets highest score
        if (b.genre === currentBook.genre) {
          score += 3;
        }
        
        // Same author gets second highest score
        if (b.author === currentBook.author) {
          score += 2;
        }
        
        // Similar themes based on genre relationships
        const genreGroups = {
          romance: ['Romance', 'Romantic Comedy'],
          scifi: ['Science Fiction', 'Dystopian Fiction', 'Fantasy'],
          mystery: ['Mystery', 'Thriller'],
          drama: ['Fiction', 'Biography']
        };
        
        for (const [group, genres] of Object.entries(genreGroups)) {
          if (genres.includes(currentBook.genre) && genres.includes(b.genre)) {
            score += 1;
          }
        }
        
        return { book: b, score };
      })
      .filter(item => item.score > 0) // Only include books with some similarity
      .sort((a, b) => b.score - a.score) // Sort by similarity score
      .slice(0, 6) // Limit to 6 similar books
      .map(item => item.book);
  };

  const similarBooks = getSimilarBooks(book);

  const handleRating = async (rating: number) => {
    if (!user?.id) {
      toast.error('Please log in to rate books');
      return;
    }

    if (!book?.id) {
      toast.error('Invalid book');
      return;
    }

    // Check if book ID is a valid UUID (from database) or numeric ID (from mock data)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(book.id);
    
    setUserRating(rating);
    
    if (!isUUID) {
      // This is mock data, just show local feedback
      toast.success(`You rated "${book.title}" ${rating} stars!`);
      return;
    }
    
    try {
      const success = await setUserBookStatus(user.id, book.id, 'completed', rating);
      if (success) {
        setIsCompleted(true);
        toast.success(`You rated "${book.title}" ${rating} stars!`);
      } else {
        toast.error('Failed to save rating');
      }
    } catch (error) {
      console.error('Error saving rating:', error);
      toast.error('Failed to save rating');
    }
  };

  const handleFavorite = async () => {
    if (!user?.id) {
      toast.error('Please log in to add favorites');
      return;
    }

    if (!book?.id) {
      toast.error('Invalid book');
      return;
    }

    // Check if book ID is a valid UUID (from database) or numeric ID (from mock data)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(book.id);

    const newFavoriteState = !isFavorited;
    setIsFavorited(newFavoriteState);
    
    if (!isUUID) {
      // This is mock data, just show local feedback
      toast.success(newFavoriteState ? 'Added to favorites' : 'Removed from favorites');
      return;
    }
    
    try {
      if (newFavoriteState) {
        const success = await setUserBookStatus(user.id, book.id, 'favorite');
        if (success) {
          toast.success('Added to favorites');
        } else {
          setIsFavorited(false);
          toast.error('Failed to add to favorites');
        }
      } else {
        const success = await removeUserBookStatus(user.id, book.id, 'favorite');
        if (success) {
          toast.success('Removed from favorites');
        } else {
          setIsFavorited(true);
          toast.error('Failed to remove from favorites');
        }
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      setIsFavorited(!newFavoriteState);
      toast.error('An error occurred');
    }
  };

  const handleReadingList = async () => {
    if (!user?.id) {
      toast.error('Please log in to add to reading list');
      return;
    }

    if (!book?.id) {
      toast.error('Invalid book');
      return;
    }

    // Check if book ID is a valid UUID (from database) or numeric ID (from mock data)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(book.id);

    const newReadingListState = !isInReadingList;
    setIsInReadingList(newReadingListState);
    
    if (!isUUID) {
      // This is mock data, just show local feedback
      toast.success(newReadingListState ? 'Added to reading list' : 'Removed from reading list');
      return;
    }
    
    try {
      if (newReadingListState) {
        const success = await setUserBookStatus(user.id, book.id, 'want_to_read');
        if (success) {
          toast.success('Added to reading list');
        } else {
          setIsInReadingList(false);
          toast.error('Failed to add to reading list');
        }
      } else {
        const success = await removeUserBookStatus(user.id, book.id, 'want_to_read');
        if (success) {
          toast.success('Removed from reading list');
        } else {
          setIsInReadingList(true);
          toast.error('Failed to remove from reading list');
        }
      }
    } catch (error) {
      console.error('Error updating reading list:', error);
      setIsInReadingList(!newReadingListState);
      toast.error('An error occurred');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Check out "${book.title}" by ${book.author}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleSubmitReview = async () => {
    if (!userComment.trim()) {
      toast.error('Please write a comment before submitting');
      return;
    }
    
    if (userRating === 0) {
      toast.error('Please rate the book before submitting your review');
      return;
    }

    setIsSubmittingReview(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would normally send the review to your backend
      // For now, we'll just show a success message
      toast.success('Your review has been submitted!');
      setUserComment('');
      
      // Optionally reset the rating if you want
      // setUserRating(0);
      
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleLogBook = async () => {
    if (!startDate) {
      toast.error('Please select a start date');
      return;
    }

    setIsLoggingBook(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would normally send the reading log to your backend
      const formatDate = (date: Date) => date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      
      if (finishDate) {
        toast.success(`Logged "${book.title}" from ${formatDate(startDate)} to ${formatDate(finishDate)}`);
      } else {
        toast.success(`Started reading "${book.title}" on ${formatDate(startDate)}`);
      }
      
      // Reset the form
      setStartDate(undefined);
      setFinishDate(undefined);
      setShowLogBookDialog(false);
      
    } catch (error) {
      toast.error('Failed to log book. Please try again.');
    } finally {
      setIsLoggingBook(false);
    }
  };

  const handleCancelLogBook = () => {
    setStartDate(undefined);
    setFinishDate(undefined);
    setShowLogBookDialog(false);
  };

  const handleDeleteReview = (reviewId: string) => {
    // In a real app, you'd make an API call here
    toast.success('Review deleted successfully');
  };

  const handleEditBook = () => {
    toast.success('Edit book functionality would open here');
  };

  const handleDeleteBook = () => {
    toast.success('Book deletion functionality would be implemented here');
  };

  const handleReportReview = (reviewId: string) => {
    setReportingReviewId(reviewId);
    setShowReportDialog(true);
  };

  const handleSubmitReport = async () => {
    if (!reportReason.trim()) {
      toast.error('Please select a reason for reporting');
      return;
    }

    if (!reportingReviewId) return;

    setIsSubmittingReport(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      await reportReview(reportingReviewId, reportReason, reportDescription);
      
      toast.success('Review reported successfully. Our team will review it shortly.');
      
      // Reset form
      setReportReason('');
      setReportDescription('');
      setShowReportDialog(false);
      setReportingReviewId(null);
      
    } catch (error) {
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleCancelReport = () => {
    setReportReason('');
    setReportDescription('');
    setShowReportDialog(false);
    setReportingReviewId(null);
  };

  const isDescriptionLong = book.description.length > 200;
  const displayDescription = showFullDescription || !isDescriptionLong 
    ? book.description 
    : book.description.slice(0, 200) + '...';

  // Filter reviews by rating
  const getFilteredReviews = () => {
    const allReviews = book.reviews || [];
    if (reviewFilter === 'all') return allReviews;
    const filterRating = parseInt(reviewFilter);
    return allReviews.filter(review => review.rating === filterRating);
  };

  const filteredReviews = getFilteredReviews();
  const reviewsToShow = showAllReviews ? filteredReviews : filteredReviews.slice(0, 2);
  const hasMoreReviews = filteredReviews.length > 2;

  // Calculate rating distribution
  const getRatingDistribution = () => {
    const allReviews = book.reviews || [];
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    allReviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as keyof typeof distribution]++;
      }
    });
    
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

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

  const formatStatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 overflow-hidden rounded-xl border-0 modal-card modal-enter">
        <DialogHeader className="sr-only">
          <DialogTitle>{book.title}</DialogTitle>
          <DialogDescription>
            Book details for {book.title} by {book.author}. View ratings, description, and book information.
          </DialogDescription>
        </DialogHeader>

        {/* Close Button */}
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-9 w-9 p-0 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background shadow-sm border min-touch-target transition-colors"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="h-full max-h-[90vh] modal-content modal-scroll-area">
          <div className="p-6 space-y-6 pb-8">
            {/* Hero Section - Side by Side Layout */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
              {/* Book Cover with Genre Badge */}
              <div className="md:col-span-2 flex justify-center md:justify-start">
                <div className="relative">
                  <ImageWithFallback
                    src={book.cover}
                    alt={book.title}
                    className="w-full max-w-[200px] aspect-[3/4] object-cover rounded-xl shadow-2xl"
                  />
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-3 -right-3 bg-primary text-primary-foreground shadow-lg px-3 py-1 text-xs max-w-[120px] text-center leading-tight whitespace-normal"
                  >
                    {Array.isArray(book.genre) ? book.genre.slice(0, 2).join(', ') : book.genre}
                  </Badge>
                </div>
              </div>

              {/* Book Details */}
              <div className="md:col-span-3 space-y-4 text-center md:text-left">
                {/* Title & Author */}
                <div className="space-y-2">
                  <h1 className="text-2xl md:text-3xl leading-tight tracking-tight">
                    {book.title}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    by {book.author}
                  </p>
                </div>

                {/* Community Rating - Prominent */}
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Community Rating
                    </span>
                    <div className="text-3xl font-bold text-primary">
                      {book.rating.toFixed(1)}
                    </div>
                  </div>
                  <StarRating rating={book.rating} size="lg" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Based on {book.totalRatings.toLocaleString()} ratings
                  </p>
                </div>

                {/* Action Buttons */}
                {user?.role === 'admin' ? (
                  /* Admin Action Buttons */
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={handleEditBook}
                      variant="default"
                      size="sm"
                      className="min-touch-target bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Edit Book</span>
                      <span className="sm:hidden">Edit</span>
                    </Button>
                    
                    <Button 
                      onClick={() => setShowAdminActions(!showAdminActions)}
                      variant="outline"
                      size="sm"
                      className="min-touch-target border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Manage</span>
                      <span className="sm:hidden">⚙️</span>
                    </Button>
                  </div>
                ) : (
                  /* Regular User Action Buttons */
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      onClick={handleFavorite} 
                      variant={isFavorited ? "default" : "outline"}
                      size="sm"
                      className="min-touch-target"
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                      <span className="hidden sm:inline">
                        {isFavorited ? 'Liked' : 'Like'}
                      </span>
                      <span className="sm:hidden">♥</span>
                    </Button>
                    
                    <Button 
                      onClick={handleReadingList}
                      variant={isInReadingList ? "default" : "outline"}
                      size="sm"
                      className="min-touch-target"
                    >
                      <BookmarkPlus className={`w-4 h-4 mr-2 ${isInReadingList ? 'fill-current' : ''}`} />
                      <span className="hidden sm:inline">List</span>
                      <span className="sm:hidden">📚</span>
                    </Button>
                    
                    <Button 
                      onClick={handleShare} 
                      variant="outline"
                      size="sm"
                      className="min-touch-target"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Share</span>
                      <span className="sm:hidden">↗</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Description with Read More/Less */}
            <div className="bg-card border rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                About This Book
              </h3>
              <div className="max-w-none">
                <p className="leading-relaxed text-foreground">
                  {displayDescription}
                </p>
                {isDescriptionLong && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-3 p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent"
                  >
                    {showFullDescription ? (
                      <>
                        Show Less <ChevronUp className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Read More <ChevronDown className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Similar Books Section */}
            {similarBooks.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3>Similar Books</h3>
                  <Badge variant="secondary" className="text-xs">
                    {similarBooks.length} suggestions
                  </Badge>
                </div>
                
                <Carousel className="w-full">
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {similarBooks.map((similarBook) => (
                      <CarouselItem key={similarBook.id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/2 md:basis-1/2 lg:basis-1/3">
                        <div 
                          className="group cursor-pointer touch-card"
                          onClick={() => {
                            if (onBookSelect) {
                              onClose();
                              // Small delay to allow modal to close before opening new one
                              setTimeout(() => {
                                onBookSelect(similarBook);
                              }, 100);
                            } else {
                              toast.success(`Opening "${similarBook.title}"`);
                            }
                          }}
                        >
                          <div className="relative overflow-hidden rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                            <ImageWithFallback
                              src={similarBook.cover}
                              alt={similarBook.title}
                              className="w-full aspect-[3/4] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                              <div className="flex items-center gap-1 mb-1">
                                <StarRating rating={similarBook.rating} size="xs" />
                                <span className="text-xs">
                                  {similarBook.rating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 space-y-1">
                            <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                              {similarBook.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {similarBook.author}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {Array.isArray(similarBook.genre) ? similarBook.genre[0] : similarBook.genre}
                            </Badge>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex -left-4" />
                  <CarouselNext className="hidden sm:flex -right-4" />
                </Carousel>
                
                <p className="text-xs text-muted-foreground text-center">
                  Based on genre, author, and themes
                </p>
              </div>
            )}

            {/* Admin Actions Panel */}
            {user?.role === 'admin' && showAdminActions && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-orange-600" />
                  <h3 className="font-medium text-orange-800">Admin Controls</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditBook}
                    className="justify-start text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Book Details
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteBook}
                    className="justify-start text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Book
                  </Button>
                </div>
                <p className="text-xs text-orange-700 mt-3">
                  ⚠️ Changes will affect all users. Use with caution.
                </p>
              </div>
            )}

            {/* Statistics and Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Statistics Card */}
              <div className="bg-card border rounded-xl p-4">
                <h3 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wide">
                  Book Statistics
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{formatStatNumber(book.viewCount || 0)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Views</p>
                  </div>
                  
                  <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{formatStatNumber(book.readCount || 0)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Readers</p>
                  </div>
                  
                  <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-1">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{formatStatNumber((book.reviews || []).length)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Reviews</p>
                  </div>
                </div>
              </div>

              {/* Book Info Card */}
              <div className="bg-card border rounded-xl p-4">
                <h3 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wide">
                  Book Information
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center space-y-1">
                    <BookOpen className="w-4 h-4 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{book.pages}</p>
                      <p className="text-xs text-muted-foreground">Pages</p>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-1">
                    <CalendarIcon className="w-4 h-4 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{book.publishedYear}</p>
                      <p className="text-xs text-muted-foreground">Published</p>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-1">
                    <Hash className="w-4 h-4 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-xs font-mono font-medium break-all">{book.isbn.slice(-4)}</p>
                      <p className="text-xs text-muted-foreground">ISBN</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Rating & Review Section - Only for non-admin users */}
            {user?.role !== 'admin' && (
              <>
                <div className="bg-gradient-to-r from-muted/20 to-muted/10 rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Your Rating & Review
                  </h3>
                  
                  {/* Rating */}
                  <div>
                    <div className="flex items-center gap-4 mb-3">
                      <StarRating 
                        rating={userRating} 
                        interactive
                        size="lg"
                        onRate={handleRating}
                      />
                      {userRating > 0 && (
                        <span className="text-2xl font-bold text-primary">
                          {userRating}.0
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {userRating > 0 ? 'Thanks for rating!' : 'Tap stars to rate this book'}
                    </p>
                  </div>

                  {/* Comment Section */}
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="user-comment" className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Write Your Review
                      </label>
                      <p className="text-xs text-muted-foreground mt-1 mb-3">
                        Share your thoughts about this book with other readers
                      </p>
                    </div>
                    
                    <Textarea
                      id="user-comment"
                      placeholder="What did you think of this book? Share your thoughts here..."
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      className="min-h-24 resize-none"
                      maxLength={500}
                    />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {userComment.length}/500 characters
                      </span>
                      
                      <Button
                        onClick={handleSubmitReview}
                        disabled={!userComment.trim() || userRating === 0 || isSubmittingReview}
                        size="sm"
                        className="min-touch-target"
                      >
                        {isSubmittingReview ? (
                          <>
                            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Review
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Log This Book Section */}
                <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Reading Progress
                    </h3>
                    <Button
                      onClick={() => setShowLogBookDialog(true)}
                      variant="outline"
                      size="sm"
                      className="min-touch-target"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Log This Book
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Track when you started and finished reading "{book.title}"
                  </p>
                </div>
              </>
            )}

            {/* Log Book Dialog */}
            <Dialog open={showLogBookDialog} onOpenChange={setShowLogBookDialog}>
              <DialogContent className="max-w-md w-[95vw] rounded-xl border-0 modal-card modal-enter">
                <DialogHeader>
                  <DialogTitle>Log Reading Progress</DialogTitle>
                  <DialogDescription>
                    Track your reading dates for "{book.title}"
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Start Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date *</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? startDate.toLocaleDateString() : "Select start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Finish Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Finish Date (Optional)</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {finishDate ? finishDate.toLocaleDateString() : "Select finish date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={finishDate}
                          onSelect={setFinishDate}
                          disabled={(date) => date > new Date() || (startDate && date < startDate)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={handleCancelLogBook}
                      className="flex-1 min-touch-target"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleLogBook}
                      disabled={!startDate || isLoggingBook}
                      className="flex-1 min-touch-target"
                    >
                      {isLoggingBook ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Logging...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Log Book
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Report Review Dialog */}
            <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
              <DialogContent className="max-w-md w-[95vw] rounded-xl border-0 modal-card modal-enter">
                <DialogHeader>
                  <DialogTitle>Report Review</DialogTitle>
                  <DialogDescription>
                    Help us maintain a safe and respectful community by reporting inappropriate content.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Report Reason */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reason for reporting *</label>
                    <Select value={reportReason} onValueChange={setReportReason}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spam">Spam or promotional content</SelectItem>
                        <SelectItem value="harassment">Harassment or bullying</SelectItem>
                        <SelectItem value="hate-speech">Hate speech or discrimination</SelectItem>
                        <SelectItem value="inappropriate">Inappropriate content</SelectItem>
                        <SelectItem value="fake">Fake or misleading review</SelectItem>
                        <SelectItem value="copyright">Copyright violation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Additional Details */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Additional details (Optional)</label>
                    <Textarea
                      placeholder="Please provide any additional context that might help us understand the issue..."
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      rows={3}
                      maxLength={500}
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {reportDescription.length}/500 characters
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={handleCancelReport}
                      className="flex-1 min-touch-target"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitReport}
                      disabled={!reportReason || isSubmittingReport}
                      className="flex-1 min-touch-target"
                    >
                      {isSubmittingReport ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Flag className="w-4 h-4 mr-2" />
                          Submit Report
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Readers' Reviews Section */}
            {book.reviews && book.reviews.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3>Reader Reviews</h3>
                  <Badge variant="secondary" className="text-xs">
                    {reviewFilter === 'all' ? book.reviews.length : filteredReviews.length} reviews
                  </Badge>
                </div>

                {/* Rating Filter Dropdown */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-muted-foreground">Filter by rating:</label>
                  <Select value={reviewFilter} onValueChange={(value) => {
                    setReviewFilter(value);
                    setShowAllReviews(false); // Reset to show limited reviews when filter changes
                  }}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reviews ({book.reviews.length})</SelectItem>
                      {[5, 4, 3, 2, 1].map(rating => (
                        <SelectItem key={rating} value={rating.toString()}>
                          <div className="flex items-center gap-2">
                            <StarRating rating={rating} size="xs" />
                            <span>
                              {rating} Star - {getRatingLabel(rating)} ({ratingDistribution[rating as keyof typeof ratingDistribution]})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Reviews List or Empty State */}
                {filteredReviews.length > 0 ? (
                  <div className="space-y-3">
                    {reviewsToShow.map((review) => (
                      <ReviewCard 
                        key={review.id} 
                        review={review} 
                        onViewUser={onViewUser}
                        isAdmin={user?.role === 'admin'}
                        onDeleteReview={handleDeleteReview}
                        onReportReview={handleReportReview}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-2">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50" />
                    <h4 className="text-muted-foreground">No {getRatingLabel(parseInt(reviewFilter)).toLowerCase()} reviews found</h4>
                    <p className="text-sm text-muted-foreground">
                      Try selecting a different rating or view all reviews.
                    </p>
                  </div>
                )}

                {hasMoreReviews && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="w-full"
                  >
                    {showAllReviews ? (
                      <>
                        Show Less Reviews <ChevronUp className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        See All {filteredReviews.length} {reviewFilter === 'all' ? 'Reviews' : `${getRatingLabel(parseInt(reviewFilter))} Reviews`} <ChevronDown className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}

            {/* No Reviews State */}
            {(!book.reviews || book.reviews.length === 0) && (
              <div className="text-center py-8 space-y-2">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50" />
                <h4 className="text-muted-foreground">No reviews yet</h4>
                <p className="text-sm text-muted-foreground">
                  Be the first to share your thoughts about this book!
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}