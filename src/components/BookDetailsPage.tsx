import { useState, useEffect } from 'react';
import { Book, Review } from '../lib/bookData';
import { StarRating } from './StarRating';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  BookOpen, 
  Calendar, 
  Hash, 
  Heart, 
  Share2, 
  ArrowLeft,
  BookmarkPlus, 
  ChevronDown, 
  ChevronUp,
  Eye,
  Users,
  MessageSquare,
  ThumbsUp,
  MoreHorizontal,
  Sparkles
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { copyToClipboard } from '../utils/clipboard';
import { supabase } from '../utils/supabase/client';
import { useAuth } from '../lib/auth-supabase';
import { submitUserRating, getUserBookStatus } from '../lib/supabase-services';

interface BookDetailsPageProps {
  book: Book;
  onBack: () => void;
  onBookSelect?: (book: Book) => void;
}

interface ReviewCardProps {
  review: Review;
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

// Smooth section wrapper with proper spacing
function Section({ children, className = '', id }: SectionProps) {
  return (
    <section id={id} className={`py-4 ${className}`}>
      {children}
    </section>
  );
}

function ReviewCard({ review }: ReviewCardProps) {
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
    <div className="bg-card border rounded-lg p-4 space-y-3 min-touch-target">
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={review.userAvatar} alt={review.userName} />
          <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium truncate">{review.userName}</p>
            <StarRating rating={review.rating} size="sm" />
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {formatDate(review.date)}
          </p>
          <p className="text-sm leading-relaxed mb-3">
            {review.content}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHelpful}
              className={`h-8 px-3 text-xs touch-manipulation ${
                isHelpful ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
            >
              <ThumbsUp className="w-3 h-3 mr-1" />
              Helpful ({review.helpful + (isHelpful ? 1 : 0)})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookDetailsPage({ book, onBack, onBookSelect }: BookDetailsPageProps) {
  const { user } = useAuth();
  const [userRating, setUserRating] = useState(book?.userRating || 0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isInReadingList, setIsInReadingList] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
  const [currentBookRating, setCurrentBookRating] = useState(book.rating);
  const [currentBookTotalRatings, setCurrentBookTotalRatings] = useState(book.totalRatings);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  // Handle scroll for dynamic header effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load user's existing rating when book changes
  useEffect(() => {
    async function loadUserRating() {
      if (!user?.id) return;
      
      const status = await getUserBookStatus(user.id, book.id);
      if (status.userRating) {
        setUserRating(status.userRating);
        console.log('📊 Loaded user rating:', status.userRating);
      } else {
        setUserRating(0);
      }
    }
    
    loadUserRating();
    
    // Reset book rating to current values when book changes
    setCurrentBookRating(book.rating);
    setCurrentBookTotalRatings(book.totalRatings);
  }, [user?.id, book.id, book.rating, book.totalRatings]);

  // Fetch similar books based on genre or author (excluding current book)
  useEffect(() => {
    // Reset similar books immediately when book changes
    setSimilarBooks([]);
    
    async function loadSimilarBooks() {
      try {
        const currentBookId = book.id;
        console.debug('[Similar Books] Loading for book:', book.title, 'ID:', currentBookId);
        
        // Build OR conditions for each genre or author match
        const orConditions: string[] = [];
        
        // Add author match condition
        orConditions.push(`author.eq.${book.author}`);
        
        // Add genre match conditions (check if any genre in the array matches)
        book.genre.forEach(genre => {
          orConditions.push(`genre.cs.{${genre}}`); // cs = contains (for arrays)
        });
        
        // Fetch similar books using Supabase OR query
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .or(orConditions.join(','))
          .neq('id', currentBookId) // Exclude current book
          .order('rating', { ascending: false })
          .limit(3); // Show only 3 books
        
        if (error) {
          console.error('[Similar Books] Error fetching from Supabase:', error);
          setSimilarBooks([]);
          return;
        }
        
        if (!data || data.length === 0) {
          console.debug('[Similar Books] No similar books found');
          setSimilarBooks([]);
          return;
        }
        
        // Transform database books to Book interface
        const similarBooksData = data.map(dbBook => ({
          id: dbBook.id,
          title: dbBook.title,
          author: dbBook.author,
          cover: dbBook.cover_url || '',
          rating: dbBook.rating || 0,
          totalRatings: dbBook.total_ratings || 0,
          genre: dbBook.genre || [],
          description: dbBook.description || '',
          publishedYear: dbBook.published_year || 0,
          pages: dbBook.pages || 0,
          isbn: dbBook.isbn || '',
          publisher: dbBook.publisher || '',
          language: dbBook.language || 'English',
          viewCount: dbBook.view_count || 0,
          readCount: dbBook.read_count || 0,
          length: dbBook.pages ? `${dbBook.pages} pages` : 'Unknown'
        }));
        
        console.debug('[Similar Books] Found', similarBooksData.length, 'similar books');
        console.debug('[Similar Books] Titles:', similarBooksData.map(b => b.title).join(', '));
        
        setSimilarBooks(similarBooksData);
      } catch (error) {
        console.error('[Similar Books] Error loading similar books:', error);
        setSimilarBooks([]);
      }
    }
    
    loadSimilarBooks();
  }, [book.id, book.author, JSON.stringify(book.genre)]); // Use JSON.stringify for array comparison

  const handleRating = async (rating: number) => {
    if (!user?.id) {
      toast.error('Please log in to rate this book');
      return;
    }
    
    console.log('🌟 [Rating] User clicked rating:', rating);
    console.log('🌟 [Rating] Current book rating:', currentBookRating);
    console.log('🌟 [Rating] Current total ratings:', currentBookTotalRatings);
    
    setIsSubmittingRating(true);
    setUserRating(rating);
    
    try {
      const result = await submitUserRating(user.id, book.id, rating);
      
      console.log('🌟 [Rating] Submit result:', result);
      
      if (!result.success) {
        console.error('[Rating] Error submitting rating');
        toast.error('Failed to submit rating');
        setUserRating(0);
      } else {
        console.log('[Rating] Submitted rating successfully');
        toast.success(`You rated "${book.title}" ${rating} stars!`);
        
        // Update book's rating and total ratings with the new values from the server
        if (result.newAverageRating !== undefined) {
          console.log('🌟 [Rating] Updating currentBookRating from', currentBookRating, 'to', result.newAverageRating);
          setCurrentBookRating(result.newAverageRating);
        }
        if (result.totalRatings !== undefined) {
          console.log('🌟 [Rating] Updating currentBookTotalRatings from', currentBookTotalRatings, 'to', result.totalRatings);
          setCurrentBookTotalRatings(result.totalRatings);
        }
        
        console.log('🌟 [Rating] State updated, component should re-render');
      }
    } catch (error) {
      console.error('[Rating] Error handling rating:', error);
      toast.error('An error occurred while rating');
      setUserRating(0);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleReadingList = () => {
    setIsInReadingList(!isInReadingList);
    toast.success(isInReadingList ? 'Removed from reading list' : 'Added to reading list');
  };

  const handleShare = async () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Check out "${book.title}" by ${book.author}`,
        url: window.location.href
      });
    } else {
      const success = await copyToClipboard(window.location.href);
      if (success) {
        toast.success('Link copied to clipboard!');
      } else {
        toast.error('Failed to copy link');
      }
    }
  };

  const isDescriptionLong = book.description.length > 200;
  const displayDescription = showFullDescription || !isDescriptionLong 
    ? book.description 
    : book.description.slice(0, 200) + '...';

  const reviewsToShow = showAllReviews ? book.reviews || [] : (book.reviews || []).slice(0, 3);
  const hasMoreReviews = (book.reviews || []).length > 3;

  const formatStatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  // Dynamic header background based on scroll
  const headerOpacity = Math.min(scrollY / 100, 0.95);

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header with Dynamic Background */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-200 ease-out"
        style={{
          backgroundColor: `rgba(var(--background-rgb, 234, 231, 224), ${headerOpacity})`,
          backdropFilter: scrollY > 20 ? 'blur(10px)' : 'none',
          borderBottom: scrollY > 20 ? '1px solid var(--border)' : 'none'
        }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2 min-touch-target"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          
          {scrollY > 100 && (
            <div className="flex-1 text-center px-4">
              <h1 className="truncate text-sm font-medium">{book.title}</h1>
              <p className="truncate text-xs text-muted-foreground">{book.author}</p>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="min-touch-target"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content with Proper Top Spacing */}
      <main className="pt-16">
        <div className="container mx-auto px-4 max-w-2xl">
          
          {/* Hero Section - Book Cover & Title */}
          <Section className="text-center space-y-6 py-8">
            <div className="relative inline-block">
              <ImageWithFallback
                src={book.cover}
                alt={book.title}
                className="w-48 h-auto mx-auto rounded-lg shadow-2xl"
              />
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 bg-primary text-primary-foreground shadow-lg"
              >
                {book.genre}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl leading-tight tracking-tight">
                {book.title}
              </h1>
              <p className="text-xl text-muted-foreground">
                by {book.author}
              </p>
            </div>
          </Section>

          {/* Statistics Bar */}
          <Section>
            <div className="bg-muted/30 rounded-xl p-4 mb-2">
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
          </Section>

          {/* Action Bar - Sticky on Mobile */}
          <Section>
            <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm py-3 -mx-4 px-4 border-y border-border/50">
              <div className="flex gap-2">
                <Button 
                  onClick={handleFavorite} 
                  variant={isFavorited ? "default" : "ghost"}
                  size="sm"
                  className="flex-1 min-touch-target touch-manipulation"
                >
                  <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">
                    {isFavorited ? 'Favorited' : 'Favorite'}
                  </span>
                  <span className="sm:hidden">♥</span>
                </Button>
                
                <Button 
                  onClick={handleReadingList}
                  variant={isInReadingList ? "default" : "ghost"}
                  size="sm"
                  className="flex-1 min-touch-target touch-manipulation"
                >
                  <BookmarkPlus className={`w-4 h-4 mr-2 ${isInReadingList ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">Reading List</span>
                  <span className="sm:hidden">📚</span>
                </Button>
                
                <Button 
                  onClick={handleShare} 
                  variant="ghost"
                  size="sm"
                  className="flex-1 min-touch-target touch-manipulation"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Share</span>
                  <span className="sm:hidden">↗</span>
                </Button>
              </div>
            </div>
          </Section>

          {/* Ratings Section */}
          <Section id="ratings" className="space-y-4">
            {/* Community Rating */}
            <div className="bg-muted/30 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Community Rating
                  {isSubmittingRating && (
                    <span className="ml-2 text-xs text-primary">(Updating...)</span>
                  )}
                </h3>
                <div className="text-3xl font-bold text-primary">
                  {currentBookRating.toFixed(1)}
                </div>
              </div>
              <StarRating rating={currentBookRating} size="lg" />
              <p className="text-sm text-muted-foreground">
                Based on {currentBookTotalRatings.toLocaleString()} rating{currentBookTotalRatings !== 1 ? 's' : ''}
              </p>
            </div>

            {/* User Rating */}
            <div className="bg-card border rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Your Rating
              </h3>
              <div className="flex items-center gap-4">
                <StarRating 
                  rating={userRating} 
                  interactive={!isSubmittingRating}
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
                {isSubmittingRating 
                  ? 'Submitting your rating...' 
                  : userRating > 0 
                    ? 'Thanks for rating!' 
                    : 'Click on the stars to rate this book'
                }
              </p>
            </div>
          </Section>

          {/* Book Information */}
          <Section id="info" className="space-y-4">
            <h3>Book Information</h3>
            <div className="bg-muted/20 rounded-xl p-5">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-3">
                  <BookOpen className="w-6 h-6 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">{book.pages}</p>
                    <p className="text-xs text-muted-foreground">Pages</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Calendar className="w-6 h-6 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">{book.publishedYear}</p>
                    <p className="text-xs text-muted-foreground">Published</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Hash className="w-6 h-6 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-xs font-mono font-medium break-all">{book.isbn.slice(-8)}</p>
                    <p className="text-xs text-muted-foreground">ISBN</p>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Description */}
          <Section id="description" className="space-y-4">
            <h3>About This Book</h3>
            <div className="bg-card border rounded-xl p-5 space-y-4">
              <p className="leading-relaxed text-muted-foreground">
                {displayDescription}
              </p>
              {isDescriptionLong && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="w-full touch-manipulation text-primary hover:text-primary/80 hover:bg-primary/5"
                >
                  {showFullDescription ? (
                    <>
                      Show Less <ChevronUp className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Read More <ChevronDown className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </Section>

          {/* Reviews Section */}
          <Section id="reviews" className="space-y-4">
            {book.reviews && book.reviews.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h3>Reader Reviews</h3>
                  <Badge variant="secondary" className="text-xs">
                    {book.reviews.length} reviews
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {reviewsToShow.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>

                {hasMoreReviews && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="w-full min-touch-target touch-manipulation"
                  >
                    {showAllReviews ? (
                      <>
                        Show Less Reviews <ChevronUp className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        See All {book.reviews.length} Reviews <ChevronDown className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </>
            ) : (
              <div className="text-center py-12 space-y-3">
                <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground/30" />
                <h4 className="text-muted-foreground">No reviews yet</h4>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Be the first to share your thoughts about this book!
                </p>
              </div>
            )}
          </Section>

          {/* Similar Books Section */}
          {similarBooks.length > 0 && (
            <Section id="similar-books" className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3>Similar Books</h3>
                <Badge variant="secondary" className="text-xs">
                  {similarBooks.length}
                </Badge>
              </div>
              
              <div className="relative -mx-4">
                <div className="overflow-x-auto px-4 pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                  <div className="flex gap-4" style={{ width: 'max-content' }}>
                    {similarBooks.map((similarBook) => {
                      // CRITICAL CHECK: Ensure we NEVER show the current book
                      if (similarBook.id === book.id) {
                        console.error('[Similar Books - RENDER] Current book found, skipping:', similarBook.title);
                        console.error('[Similar Books - RENDER] Current:', book.id, 'vs Similar:', similarBook.id);
                        return null;
                      }
                      
                      // Additional safety: Check title and author match
                      if (similarBook.title === book.title && similarBook.author === book.author) {
                        console.warn('[Similar Books - RENDER] Same title+author, skipping:', similarBook.title);
                        return null;
                      }
                      
                      return (
                        <div
                          key={similarBook.id}
                          className="group cursor-pointer flex-shrink-0 w-32 sm:w-40"
                          onClick={() => {
                            console.debug('[Similar Books] Clicked on:', similarBook.title);
                            if (onBookSelect) {
                              onBookSelect(similarBook);
                              window.scrollTo({ top: 0, behavior: 'instant' });
                            }
                          }}
                        >
                          <div className="space-y-2">
                            {/* Book Cover */}
                            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-200">
                              <ImageWithFallback
                                src={similarBook.cover}
                                alt={similarBook.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </div>
                            
                            {/* Book Info */}
                            <div className="space-y-1">
                              {/* Title */}
                              <p className="text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                {similarBook.title}
                              </p>
                              
                              {/* Author */}
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {similarBook.author}
                              </p>
                              
                              {/* Rating - Always Visible */}
                              {similarBook.rating && (
                                <div className="flex items-center gap-1">
                                  <StarRating rating={similarBook.rating} size="sm" readonly />
                                  <span className="text-xs text-muted-foreground ml-0.5">
                                    {similarBook.rating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                              
                              {/* Genre Tag - Shows "Same Author" or matching genre */}
                              {similarBook.author.toLowerCase() === book.author.toLowerCase() ? (
                                <Badge variant="outline" className="text-xs px-1.5 py-0 bg-primary/10 border-primary/30">
                                  Same Author
                                </Badge>
                              ) : similarBook.genre.some(g => book.genre.includes(g)) && (
                                <Badge variant="outline" className="text-xs px-1.5 py-0">
                                  {similarBook.genre.find(g => book.genre.includes(g))}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Scroll indicators */}
                <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                Books with similar genres or by the same author
              </p>
            </Section>
          )}

          {/* Bottom Spacing for Mobile Navigation */}
          <div className="h-20" />
        </div>
      </main>
    </div>
  );
}