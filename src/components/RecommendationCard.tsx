import { Book, BookRecommendation } from '../lib/bookData';
import { BookCard } from './BookCard';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles } from 'lucide-react';

// Support both interfaces for backward compatibility
interface RecommendationCardPropsNew {
  book: Book;
  reason: string;
  confidence?: number;
  onClick: (book: Book) => void;
  onViewUser?: (userId: string) => void;
}

interface RecommendationCardPropsOld {
  recommendation: BookRecommendation;
  onBookClick: (book: any) => void;
}

type RecommendationCardProps = RecommendationCardPropsNew | RecommendationCardPropsOld;

function isOldInterface(props: RecommendationCardProps): props is RecommendationCardPropsOld {
  return 'recommendation' in props;
}

export function RecommendationCard(props: RecommendationCardProps) {
  if (isOldInterface(props)) {
    // Old interface for HomePage compatibility
    const { recommendation, onBookClick } = props;
    return (
      <div className="space-y-4 group">
        <BookCard book={recommendation.book} onBookClick={onBookClick} />
        <div className="px-2 space-y-2">
          <div className="flex items-start gap-2">
            <Sparkles className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {recommendation.reason}
            </p>
          </div>
          {recommendation.basedOnBook && (
            <p className="text-xs text-primary/70 pl-5 italic">
              Similar to "{recommendation.basedOnBook.title}"
            </p>
          )}
        </div>
      </div>
    );
  }

  // New interface for RecommendationsPage
  const { book, reason, confidence, onClick, onViewUser } = props;
  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1" onClick={() => onClick(book)}>
      <CardContent className="p-0">
        {/* Book Cover */}
        <div className="relative">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {confidence && (
            <Badge 
              className="absolute top-2 right-2 bg-primary/90 text-primary-foreground"
              variant="secondary"
            >
              {confidence}% match
            </Badge>
          )}
        </div>
        
        {/* Book Info */}
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              by {book.author}
            </p>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={`text-xs ${star <= Math.floor(book.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">
              {book.rating} ({book.totalRatings})
            </span>
          </div>
          
          {/* Recommendation Reason */}
          <div className="flex items-start gap-2 mt-3 pt-3 border-t">
            <Sparkles className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {reason}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}