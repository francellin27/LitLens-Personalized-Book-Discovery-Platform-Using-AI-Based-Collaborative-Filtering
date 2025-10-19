import { useState, useMemo, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, Grid, List, BookOpen } from "lucide-react";
import { BookGrid } from "./BookGrid";
import { SearchFilters } from "./SearchFilters";
import type { SearchFilters as SearchFiltersType } from "./SearchFilters";
import { RequestBookDialog } from "./RequestBookDialog";
import { StarRating } from "./StarRating";
import { useBooks } from "../lib/hooks/useSupabaseBooks";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Book } from "../lib/bookData";

interface BrowseBooksPageProps {
  onBookSelect: (book: Book) => void;
  onViewUser: (userId: string) => void;
}

export function BrowseBooksPage({ onBookSelect, onViewUser }: BrowseBooksPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedFilters, setSelectedFilters] = useState<SearchFiltersType>({
    genre: 'All',
    author: '',
    year: 'All Years',
    rating: [0],
    language: 'All Languages',
    publisher: 'All Publishers'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("title");
  const [showRequestBookDialog, setShowRequestBookDialog] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
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

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    if (booksLoading) return [];
    
    let filtered = allBooks.filter(book => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!book.title.toLowerCase().includes(query) &&
            !book.author.toLowerCase().includes(query) &&
            !book.genre.some(g => g.toLowerCase().includes(query))) {
          return false;
        }
      }

      // Genre filter
      if (selectedFilters.genre && selectedFilters.genre !== 'All') {
        if (!book.genre.includes(selectedFilters.genre)) {
          return false;
        }
      }

      // Year filter
      if (selectedFilters.year && selectedFilters.year !== 'All Years') {
        const year = selectedFilters.year;
        if (year === '2010-2014') {
          if (book.publishedYear < 2010 || book.publishedYear > 2014) {
            return false;
          }
        } else if (year === '2000-2009') {
          if (book.publishedYear < 2000 || book.publishedYear > 2009) {
            return false;
          }
        } else if (year === 'Before 2000') {
          if (book.publishedYear >= 2000) {
            return false;
          }
        } else {
          // Single year
          if (book.publishedYear.toString() !== year) {
            return false;
          }
        }
      }

      // Rating filter
      if (selectedFilters.rating && selectedFilters.rating[0] > 0) {
        if (book.rating < selectedFilters.rating[0]) {
          return false;
        }
      }

      // Language filter
      if (selectedFilters.language && selectedFilters.language !== 'All Languages') {
        if (book.language !== selectedFilters.language) {
          return false;
        }
      }

      // Publisher filter
      if (selectedFilters.publisher && selectedFilters.publisher !== 'All Publishers') {
        if (book.publisher !== selectedFilters.publisher) {
          return false;
        }
      }

      return true;
    });

    // Sort books
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "rating":
          return b.rating - a.rating;
        case "year":
          return b.publishedYear - a.publishedYear;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedFilters, sortBy, allBooks, booksLoading]);



  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedFilters({
      genre: 'All',
      author: '',
      year: 'All Years',
      rating: [0],
      language: 'All Languages',
      publisher: 'All Publishers'
    });
  };

  const activeFiltersCount = (
    (searchQuery ? 1 : 0) +
    (selectedFilters.genre !== 'All' ? 1 : 0) +
    (selectedFilters.author ? 1 : 0) +
    (selectedFilters.year !== 'All Years' ? 1 : 0) +
    (selectedFilters.rating[0] > 0 ? 1 : 0) +
    (selectedFilters.language !== 'All Languages' ? 1 : 0) +
    (selectedFilters.publisher !== 'All Publishers' ? 1 : 0)
  );

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

  const handleSuggestionClick = (book: Book) => {
    setSearchQuery(book.title);
    setShowSuggestions(false);
    onBookSelect(book);
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
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-2 px-2 sm:px-0">
        <h1 className="text-2xl sm:text-3xl">Browse All Books</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
          Explore our complete collection of books. Use filters to find exactly what you're looking for.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search Input - Full width on all screens */}
            <div className="w-full relative" ref={searchContainerRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
              <Input
                ref={inputRef}
                placeholder="Search books, authors, or genres..."
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onKeyDown={handleKeyDown}
                className="pl-10 w-full"
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
                        {book.cover ? (
                          <img 
                            src={book.cover} 
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

            {/* Controls - Responsive layout */}
            <div className="flex flex-wrap items-center gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 flex-shrink-0"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-28 sm:w-32 flex-shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg flex-shrink-0 ml-auto">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <>
              <Separator className="my-4" />
              <div className="space-y-4">
                {/* Additional Filters */}
                <SearchFilters
                  filters={selectedFilters}
                  onFiltersChange={setSelectedFilters}
                />

                {activeFiltersCount > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearAllFilters}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Results Summary - Only show if there are books */}
      {filteredBooks.length > 0 && (
        <div className="flex items-center justify-between px-2 sm:px-0">
          <p className="text-muted-foreground text-sm sm:text-base">
            {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}

      {/* Books Grid */}
      {filteredBooks.length > 0 && (
        <BookGrid 
          books={filteredBooks}
          onBookSelect={onBookSelect}
          onViewUser={onViewUser}
          viewMode={viewMode}
        />
      )}

      {/* Empty State - No Results */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-12 space-y-4">
          <p className="text-muted-foreground mb-4">No books found matching your criteria.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button onClick={clearAllFilters} variant="outline">Clear Filters</Button>
          </div>
          
          {/* Can't Find Your Books Section - Only shown when no results */}
          <div className="pt-6 border-t mt-6">
            <p className="text-foreground mb-3">Can't find your book?</p>
            <Button variant="default" onClick={() => setShowRequestBookDialog(true)}>
              Request a Book
            </Button>
          </div>
        </div>
      )}

      {/* Request Book Dialog */}
      <RequestBookDialog 
        open={showRequestBookDialog}
        onOpenChange={setShowRequestBookDialog}
      />
    </div>
  );
}