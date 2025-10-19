import { useState, useMemo, useRef, useEffect } from 'react';
import { BookModal } from './BookModal';
import { BookGrid } from './BookGrid';
import { SearchFilters, SearchFilters as FilterType } from './SearchFilters';
import { Book } from '../lib/bookData';
import { useBooks } from '../lib/hooks/useSupabaseBooks';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Filter, BookOpen } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { StarRating } from './StarRating';
import { RequestBookDialog } from './RequestBookDialog';

interface SearchPageProps {
  initialQuery?: string;
  onBookSelect: (book: Book) => void;
  onViewUser?: (userId: string) => void;
}

export function SearchPage({ initialQuery = '', onBookSelect, onViewUser }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<FilterType>({
    genre: 'All',
    author: '',
    year: 'All Years',
    rating: [0],
    language: 'All Languages',
    publisher: 'All Publishers'
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showRequestBookDialog, setShowRequestBookDialog] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all books from Supabase
  const { books: allBooks, loading: booksLoading } = useBooks({ limit: 1000 });

  // Search suggestions (only based on search query, no other filters)
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || booksLoading) return [];
    
    return allBooks.filter((book) => {
      const query = searchQuery.toLowerCase();
      return book.title.toLowerCase().includes(query) ||
             book.author.toLowerCase().includes(query) ||
             book.genre.some(g => g.toLowerCase().includes(query));
    }).slice(0, 8); // Limit to 8 suggestions
  }, [searchQuery, allBooks, booksLoading]);

  const filteredBooks = useMemo(() => {
    if (booksLoading) return [];
    
    return allBooks.filter((book) => {
      // Search query filter
      const matchesSearch = searchQuery === '' || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Genre filter
      const matchesGenre = filters.genre === 'All' || book.genre.includes(filters.genre);

      // Author filter
      const matchesAuthor = filters.author === '' || 
        book.author.toLowerCase().includes(filters.author.toLowerCase());

      // Year filter
      let matchesYear = true;
      if (filters.year !== 'All Years') {
        const year = filters.year;
        if (year === '2010-2014') {
          matchesYear = book.publishedYear >= 2010 && book.publishedYear <= 2014;
        } else if (year === '2000-2009') {
          matchesYear = book.publishedYear >= 2000 && book.publishedYear <= 2009;
        } else if (year === 'Before 2000') {
          matchesYear = book.publishedYear < 2000;
        } else {
          matchesYear = book.publishedYear.toString() === year;
        }
      }

      // Rating filter
      const matchesRating = book.rating >= filters.rating[0];

      // Language filter
      const matchesLanguage = filters.language === 'All Languages' || 
        book.language === filters.language;

      // Publisher filter
      const matchesPublisher = filters.publisher === 'All Publishers' || 
        book.publisher === filters.publisher;

      return matchesSearch && matchesGenre && matchesAuthor && 
             matchesYear && matchesRating && matchesLanguage && matchesPublisher;
    });
  }, [searchQuery, filters, allBooks, booksLoading]);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBookClick = (book: Book) => {
    onBookSelect(book);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (book: Book) => {
    setSearchQuery(book.title);
    setShowSuggestions(false);
    onBookSelect(book);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
    setFocusedIndex(-1);
  };

  const handleInputFocus = () => {
    if (searchQuery.trim()) {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || searchSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < searchSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        if (focusedIndex >= 0 && focusedIndex < searchSuggestions.length) {
          e.preventDefault();
          handleSuggestionClick(searchSuggestions[focusedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setFocusedIndex(-1);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="text-3xl">Search Books</h1>
        <p className="text-muted-foreground">
          Discover your next great read with our advanced search and filtering options
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1" ref={searchContainerRef}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <Input
            ref={inputRef}
            placeholder="Search books, authors, genres..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            className="pl-10"
            autoComplete="off"
          />
          
          {/* Search Suggestions Dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-40 max-h-96 overflow-y-auto">
              {searchSuggestions.map((book, index) => (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => handleSuggestionClick(book)}
                  className={`w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b last:border-b-0 flex gap-3 ${
                    index === focusedIndex ? 'bg-accent' : ''
                  }`}
                >
                  <div className="flex-shrink-0">
                    {book.coverImage ? (
                      <img 
                        src={book.coverImage} 
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{book.title}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {book.author}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={book.rating} size="sm" />
                      <span className="text-xs text-muted-foreground">
                        {book.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Mobile Filter Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Filter className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Search Filters</SheetTitle>
              <SheetDescription>
                Refine your search results with these filters
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <SearchFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </SheetContent>
        </Sheet>
      </form>

      {/* Desktop Filters */}
      <div className="hidden md:block">
        <SearchFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Books'}
          </h2>
          <span className="text-sm text-muted-foreground">
            {filteredBooks.length} books found
          </span>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground text-lg">
              No books found matching your search criteria
            </p>
            <p className="text-muted-foreground text-sm">
              Try adjusting your filters or search terms
            </p>
            <div className="pt-4">
              <Button 
                variant="outline"
                onClick={() => setShowRequestBookDialog(true)}
              >
                Can't find your book? Request it here
              </Button>
            </div>
          </div>
        ) : (
          <BookGrid books={filteredBooks} onBookClick={handleBookClick} />
        )}
      </div>

      {/* Request Book Dialog */}
      <RequestBookDialog 
        open={showRequestBookDialog} 
        onOpenChange={setShowRequestBookDialog}
      />
    </div>
  );
}