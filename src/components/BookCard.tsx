import { Book } from '../lib/bookData';
import { StarRating } from './StarRating';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Heart, BookOpen, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../lib/auth-supabase';
import { getUserBookStatus, setUserBookStatus, removeUserBookStatus } from '../lib/supabase-services';
import { toast } from 'sonner@2.0.3';

interface BookCardProps {
  book: Book;
  onBookClick?: (book: Book) => void;
  onViewUser?: (userId: string) => void;
  compact?: boolean;
  listView?: boolean;
  showRemoveButton?: boolean;
  onRemoveBook?: (book: Book) => void;
}

export function BookCard({ 
  book, 
  onBookClick, 
  onViewUser, 
  compact = false, 
  listView = false,
  showRemoveButton = false,
  onRemoveBook 
}: BookCardProps) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  // Load user's favorite status from Supabase
  useEffect(() => {
    async function loadFavoriteStatus() {
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
      } catch (error) {
        console.error('Error loading favorite status:', error);
      } finally {
        setLoadingStatus(false);
      }
    }

    loadFavoriteStatus();
  }, [user?.id, book?.id]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
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

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveBook?.(book);
  };

  if (listView) {
    return (
      <Card 
        className="group cursor-pointer transition-all duration-300 hover:shadow-md touch-manipulation"
        onClick={() => onBookClick?.(book)}
      >
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative">
              <ImageWithFallback
                src={book.cover}
                alt={book.title}
                className="w-16 h-24 object-cover rounded-md flex-shrink-0"
              />
            </div>
            
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="font-medium group-hover:text-primary transition-colors">
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  by {book.author}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {book.genre.map((g) => (
                  <Badge key={g} variant="secondary" className="text-xs">
                    {g}
                  </Badge>
                ))}
              </div>
              
              <StarRating 
                rating={book.rating} 
                totalRatings={book.totalRatings}
                size="sm"
              />
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{book.pages} pages</span>
                <span>{book.publishedYear}</span>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              {showRemoveButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveClick}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <button
                onClick={handleFavoriteClick}
                className="p-2 rounded-full hover:bg-accent transition-colors"
              >
                <Heart 
                  className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
                />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const imageHeight = compact ? "h-32 sm:h-40" : "h-48 sm:h-56 md:h-64";

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 touch-manipulation"
      onClick={() => onBookClick?.(book)}
    >
      <CardContent className="p-0">
        <div className="relative">
          <ImageWithFallback
            src={book.cover}
            alt={book.title}
            className={`w-full ${imageHeight} object-cover rounded-t-lg`}
          />
          <div className="absolute top-2 right-2 flex gap-1">
            {showRemoveButton && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRemoveClick}
                className="h-8 w-8 p-0 rounded-full bg-background/80 backdrop-blur-sm"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <button
              onClick={handleFavoriteClick}
              className="p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart 
                className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
              />
            </button>
          </div>
          <Badge className="absolute bottom-2 left-2 text-xs" variant="secondary">
            {Array.isArray(book.genre) ? book.genre[0] : book.genre}
          </Badge>
        </div>
        
        <div className="p-3 sm:p-4 space-y-2">
          <div className="space-y-1">
            <h3 className="line-clamp-2 group-hover:text-primary transition-colors text-sm sm:text-base leading-tight">
              {book.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
              by {book.author}
            </p>
          </div>
          
          <StarRating 
            rating={book.rating} 
            totalRatings={book.totalRatings}
            size="sm"
          />
          
          <div className="flex items-center justify-between pt-1 sm:pt-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{book.pages} pages</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {book.publishedDate}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}