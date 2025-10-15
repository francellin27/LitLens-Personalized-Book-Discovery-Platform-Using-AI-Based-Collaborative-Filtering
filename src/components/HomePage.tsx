import { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '../lib/auth-supabase';
import { BookModal } from './BookModal';
import { BookGrid } from './BookGrid';
import { BookCard } from './BookCard';
import { RecommendationCard } from './RecommendationCard';
import { RequestBookDialog } from './RequestBookDialog';
import { FEATURED_BOOKS, MOST_VIEWED_BOOKS, MOST_READ_BOOKS, TOP_RATED_BOOKS, Book, BookRecommendation, MOCK_BOOKS } from '../lib/bookData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Star, TrendingUp, BookOpen, Eye, Users, Award, X } from 'lucide-react';
import { Input } from './ui/input';
import { StarRating } from './StarRating';

interface HomePageProps {
  onSearch: (query: string) => void;
  onBookSelect: (book: Book) => void;
  onViewUser?: (userId: string) => void;
}

export function HomePage({ onSearch, onBookSelect, onViewUser }: HomePageProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showRequestBookDialog, setShowRequestBookDialog] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    return MOCK_BOOKS.filter((book) => {
      const query = searchQuery.toLowerCase();
      return book.title.toLowerCase().includes(query) ||
             book.author.toLowerCase().includes(query) ||
             book.genre.some(g => g.toLowerCase().includes(query));
    }).slice(0, 8); // Limit to 8 suggestions
  }, [searchQuery]);

  // Filtered search results (when search is active)
  const searchResults = useMemo(() => {
    if (!activeSearchQuery.trim()) return [];
    
    return MOCK_BOOKS.filter((book) => {
      const query = activeSearchQuery.toLowerCase();
      return book.title.toLowerCase().includes(query) ||
             book.author.toLowerCase().includes(query) ||
             book.genre.some(g => g.toLowerCase().includes(query)) ||
             book.description.toLowerCase().includes(query);
    });
  }, [activeSearchQuery]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      setActiveSearchQuery(searchQuery.trim());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveSearchQuery('');
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

  const handleBookClick = (book: Book) => {
    onBookSelect(book);
  };

  // Personalized recommendations based on user preferences and reading history
  const getPersonalizedRecommendations = (): BookRecommendation[] => {
    if (!user?.preferences?.readBooks?.length) {
      // If user hasn't read any books, show featured books without reasons
      return FEATURED_BOOKS.slice(0, 4).map(book => ({
        book,
        reason: "Popular among new readers"
      }));
    }

    const readBooks = MOCK_BOOKS.filter(book => 
      user.preferences!.readBooks!.includes(book.id)
    );
    
    const recommendations: BookRecommendation[] = [];
    const usedBookIds = new Set(user.preferences!.readBooks!);

    // Genre-based recommendations
    if (user?.preferences?.favoriteGenres?.length) {
      for (const readBook of readBooks) {
        const similarBooks = MOCK_BOOKS.filter(book => 
          book.genre === readBook.genre && 
          !usedBookIds.has(book.id) &&
          !recommendations.some(rec => rec.book.id === book.id)
        );
        
        similarBooks.slice(0, 1).forEach(book => {
          recommendations.push({
            book,
            reason: `Because you read "${readBook.title}"`,
            basedOnBook: readBook
          });
        });
      }
    }

    // Author-based recommendations  
    for (const readBook of readBooks) {
      const sameAuthorBooks = MOCK_BOOKS.filter(book => 
        book.author === readBook.author && 
        !usedBookIds.has(book.id) &&
        !recommendations.some(rec => rec.book.id === book.id)
      );
      
      sameAuthorBooks.slice(0, 1).forEach(book => {
        recommendations.push({
          book,
          reason: `More from ${readBook.author}`,
          basedOnBook: readBook
        });
      });
    }

    // Fill remaining slots with highly rated books in favorite genres
    if (recommendations.length < 4) {
      const remainingSlots = 4 - recommendations.length;
      const topRatedInGenres = MOCK_BOOKS.filter(book =>
        user.preferences!.favoriteGenres!.includes(book.genre) &&
        !usedBookIds.has(book.id) &&
        !recommendations.some(rec => rec.book.id === book.id)
      ).sort((a, b) => b.rating - a.rating);

      topRatedInGenres.slice(0, remainingSlots).forEach(book => {
        recommendations.push({
          book,
          reason: `Highly rated in ${Array.isArray(book.genre) ? book.genre[0] : book.genre}`,
        });
      });
    }

    return recommendations.slice(0, 4);
  };

  const personalizedRecommendations = getPersonalizedRecommendations();

  return (
    <div className="space-y-8">
      {/* Hero Section - Fixed Height */}
      <section className="text-center space-y-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg px-4 sm:px-6 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl">Welcome to LitLens</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover your next great read with AI-powered personalized recommendations
          </p>
        </div>
        
        {/* Quick Search */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
          <div className="relative flex-1" ref={searchContainerRef}>
            <Input
              ref={inputRef}
              placeholder="Search books, authors, genres..."
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              className="flex-1"
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
          <Button type="submit">Search</Button>
        </form>

        {/* About Us */}
        <div className="max-w-3xl mx-auto text-center space-y-2">
          <h3 className="text-lg">About LitLens</h3>
          <p className="text-muted-foreground">
            LitLens uses advanced AI-based collaborative filtering to provide personalized book recommendations. 
            Our mission is to help readers discover diverse literature tailored to their unique tastes and reading history.
          </p>
        </div>
      </section>

      {/* Search Results Section */}
      {activeSearchQuery && (
        <section className="space-y-6">
          {/* Header - Fixed Height */}
          <div className="flex items-center justify-between h-10">
            <h2 className="text-2xl">
              Search Results for "{activeSearchQuery}"
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleClearSearch}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Search
            </Button>
          </div>

          {/* Results Count */}
          <p className="text-muted-foreground">
            {searchResults.length} book{searchResults.length !== 1 ? 's' : ''} found
          </p>

          {/* Results Grid - Consistent Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {searchResults.length > 0 ? (
              searchResults.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onBookClick={handleBookClick}
                />
              ))
            ) : (
              <Card className="transition-all duration-300 col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5 max-w-2xl mx-auto w-full">
                <CardContent className="p-0">
                  <div className="relative bg-muted/30 h-48 sm:h-56 md:h-64 lg:h-72 rounded-t-lg flex items-center justify-center border-b border-border/50">
                    <div className="flex flex-col items-center gap-3 sm:gap-4">
                      <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-muted-foreground/30" />
                      <p className="text-xs sm:text-sm text-muted-foreground/60 hidden sm:block">No matching books</p>
                    </div>
                  </div>
                  
                  <div className="p-6 sm:p-8 lg:p-10 space-y-4 sm:space-y-6 text-center">
                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="text-lg sm:text-xl">No results found</h3>
                      <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                        Can't find your book? Let us know what you're looking for and we'll do our best to add it to our collection.
                      </p>
                    </div>
                    
                    <Button 
                      variant="default"
                      size="lg"
                      onClick={() => setShowRequestBookDialog(true)}
                      className="min-w-[180px] sm:min-w-[200px]"
                    >
                      Request a Book
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Reading Stats - Only for non-admin users */}
      {!activeSearchQuery && user && user.role !== 'admin' && (
        <section className="space-y-6">
          <h2 className="text-2xl">Your Reading Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Books Read</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">23</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Reading Goal</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{user.preferences?.readingGoal || 50}</div>
                <p className="text-xs text-muted-foreground">
                  Books this year
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Reviews Written</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">12</div>
                <p className="text-xs text-muted-foreground">
                  Helping other readers
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Personalized Recommendations */}
      {!activeSearchQuery && (
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          <h2 className="text-2xl">Personalized Recommendations</h2>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Based on your reading history and preferences
          </p>
          {user?.preferences?.readBooks?.length ? (
            <p className="text-sm text-primary/80">
              Tailored recommendations just for you
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Start reading books to get personalized recommendations
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {personalizedRecommendations.map((recommendation) => (
            <RecommendationCard 
              key={recommendation.book.id} 
              recommendation={recommendation} 
              onBookClick={handleBookClick} 
            />
          ))}
        </div>
      </section>
      )}

      {/* Featured Books */}
      {!activeSearchQuery && (
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <h2 className="text-2xl">Featured Books</h2>
        </div>
        
        <Tabs defaultValue="most-viewed" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="most-viewed" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Most Viewed
            </TabsTrigger>
            <TabsTrigger value="most-read" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Most Read
            </TabsTrigger>
            <TabsTrigger value="top-rated" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Top Rated
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="most-viewed" className="mt-6">
            <BookGrid books={MOST_VIEWED_BOOKS.slice(0, 8)} onBookClick={handleBookClick} />
          </TabsContent>
          
          <TabsContent value="most-read" className="mt-6">
            <BookGrid books={MOST_READ_BOOKS.slice(0, 8)} onBookClick={handleBookClick} />
          </TabsContent>
          
          <TabsContent value="top-rated" className="mt-6">
            <BookGrid books={TOP_RATED_BOOKS.slice(0, 8)} onBookClick={handleBookClick} />
          </TabsContent>
        </Tabs>
      </section>
      )}

      {/* Request Book Dialog */}
      <RequestBookDialog 
        open={showRequestBookDialog}
        onOpenChange={setShowRequestBookDialog}
      />

    </div>
  );
}