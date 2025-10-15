import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  totalRatings?: number;
  interactive?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  onRate?: (rating: number) => void;
}

export function StarRating({ 
  rating, 
  totalRatings, 
  interactive = false, 
  size = 'md',
  onRate 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [userRating, setUserRating] = useState(0);

  const displayRating = interactive ? (hoverRating || userRating || rating) : rating;
  
  const sizeClasses = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const handleClick = (starRating: number) => {
    if (!interactive) return;
    setUserRating(starRating);
    onRate?.(starRating);
  };

  const handleMouseEnter = (starRating: number) => {
    if (!interactive) return;
    setHoverRating(starRating);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= displayRating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'fill-muted text-muted-foreground'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform touch-manipulation' : ''}`}
            style={interactive ? { minHeight: '44px', minWidth: '44px', padding: '10px' } : {}}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>
      <span className="text-xs sm:text-sm text-muted-foreground ml-1">
        {rating.toFixed(1)}
        {totalRatings && ` (${totalRatings.toLocaleString()})`}
      </span>
    </div>
  );
}