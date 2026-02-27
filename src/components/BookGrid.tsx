import { Book } from '../lib/bookData';
import { BookCard } from './BookCard';
import { Card } from './ui/card';
import { BookOpen } from 'lucide-react';

interface BookGridProps {
  books: Book[];
  onBookSelect?: (book: Book) => void;
  onBookClick?: (book: Book) => void;
  onViewUser?: (userId: string) => void;
  compact?: boolean;
  viewMode?: "grid" | "list";
  showRemoveButton?: boolean;
  onRemoveBook?: (book: Book) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function BookGrid({ 
  books, 
  onBookSelect, 
  onBookClick, 
  onViewUser, 
  compact = false, 
  viewMode = "grid",
  showRemoveButton = false,
  onRemoveBook,
  loading = false,
  emptyMessage = "No books found matching your criteria."
}: BookGridProps) {
  const handleBookClick = onBookSelect || onBookClick;
  
  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3" />
        <p className="text-muted-foreground">Loading books...</p>
      </Card>
    );
  }
  
  if (books.length === 0) {
    return (
      <Card className="p-8 text-center">
        <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </Card>
    );
  }

  const gridClass = compact 
    ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
    : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6";

  const listClass = "space-y-4";

  return (
    <div className={viewMode === "list" ? listClass : gridClass}>
      {books.map((book) => (
        <BookCard 
          key={book.id} 
          book={book} 
          onBookClick={handleBookClick}
          onViewUser={onViewUser}
          compact={compact}
          listView={viewMode === "list"}
          showRemoveButton={showRemoveButton}
          onRemoveBook={onRemoveBook}
        />
      ))}
    </div>
  );
}