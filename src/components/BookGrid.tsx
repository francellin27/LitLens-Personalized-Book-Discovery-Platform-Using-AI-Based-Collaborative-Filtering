import { Book } from '../lib/bookData';
import { BookCard } from './BookCard';

interface BookGridProps {
  books: Book[];
  onBookSelect?: (book: Book) => void;
  onBookClick?: (book: Book) => void;
  onViewUser?: (userId: string) => void;
  compact?: boolean;
  viewMode?: "grid" | "list";
  showRemoveButton?: boolean;
  onRemoveBook?: (book: Book) => void;
}

export function BookGrid({ 
  books, 
  onBookSelect, 
  onBookClick, 
  onViewUser, 
  compact = false, 
  viewMode = "grid",
  showRemoveButton = false,
  onRemoveBook 
}: BookGridProps) {
  const handleBookClick = onBookSelect || onBookClick;
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No books found matching your criteria.</p>
      </div>
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