import { useState, useEffect } from 'react';
import { BookModal } from './BookModal';
import { BookCard } from './BookCard';
import { Book } from '../lib/bookData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BookOpen, Heart, List, Star, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';

interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  joinedDate: string;
  bio?: string;
  avatar?: string;
  favoriteGenres: string[];
  readingGoal?: number;
}

interface UserProfileViewProps {
  userId: string;
  onBack: () => void;
}

export function UserProfileView({ userId, onBack }: UserProfileViewProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [currentlyReading, setCurrentlyReading] = useState<Book[]>([]);
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [wantToRead, setWantToRead] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile data and books
  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, username, email, bio, avatar, favorite_genres, created_at')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        toast.error('Failed to load user profile');
        return;
      }

      if (profile) {
        setUserData({
          id: profile.id,
          name: profile.name || 'Unknown User',
          username: profile.username || 'user',
          email: profile.email || '',
          joinedDate: profile.created_at,
          bio: profile.bio || undefined,
          avatar: profile.avatar || undefined,
          favoriteGenres: profile.favorite_genres || [],
          readingGoal: 75 // Default goal, can be added to profiles table later
        });
      }

      // Fetch user's book statuses
      const { data: bookStatuses, error: statusError } = await supabase
        .from('user_book_status')
        .select(`
          book_id,
          status,
          books (*)
        `)
        .eq('user_id', userId);

      if (statusError) {
        console.error('Error fetching user books:', statusError);
      } else if (bookStatuses) {
        // Transform and categorize books
        const reading: Book[] = [];
        const favorited: Book[] = [];
        const toRead: Book[] = [];
        const completed: Book[] = [];

        bookStatuses.forEach((status: any) => {
          if (status.books) {
            const book = transformDbBookToBook(status.books);
            
            if (status.status === 'reading') {
              reading.push(book);
            } else if (status.status === 'favorite') {
              favorited.push(book);
            } else if (status.status === 'want_to_read') {
              toRead.push(book);
            } else if (status.status === 'completed') {
              completed.push(book);
            }
          }
        });

        setCurrentlyReading(reading);
        setFavorites(favorited);
        setWantToRead(toRead);
        setUserBooks([...reading, ...completed, ...favorited]);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast.error('Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  };

  const transformDbBookToBook = (dbBook: any): Book => {
    return {
      id: dbBook.id,
      title: dbBook.title,
      author: dbBook.author,
      authorInfo: dbBook.author_info,
      cover: dbBook.cover,
      rating: parseFloat(dbBook.rating) || 0,
      totalRatings: dbBook.total_ratings || 0,
      genre: dbBook.genre,
      description: dbBook.description,
      publishedYear: dbBook.published_year,
      pages: dbBook.pages,
      isbn: dbBook.isbn,
      publisher: dbBook.publisher,
      language: dbBook.language,
      viewCount: dbBook.view_count || 0,
      readCount: dbBook.read_count || 0,
      publishingInfo: dbBook.publishing_info,
      length: dbBook.length,
    };
  };
  
  const openBookModal = (book: Book) => {
    setSelectedBook(book);
  };

  const closeBookModal = () => {
    setSelectedBook(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">User not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const booksRead = userBooks.length;
  const progressPercentage = userData.readingGoal 
    ? Math.round((booksRead / userData.readingGoal) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="flex items-center gap-2 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="w-24 h-24 sm:w-28 sm:h-28">
              <AvatarImage 
                src={userData.avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b048?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODU1MDMwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"} 
                alt={userData.name} 
              />
              <AvatarFallback className="text-xl">
                {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div>
                <h1 className="text-2xl font-semibold">{userData.name}</h1>
                <p className="text-muted-foreground">@{userData.username}</p>
              </div>
              
              {userData.bio && (
                <p className="text-muted-foreground">{userData.bio}</p>
              )}
              
              <div className="flex flex-wrap gap-2">
                {userData.favoriteGenres.map((genre) => (
                  <Badge key={genre} variant="secondary" className="text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Reading Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Reading Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Books Read</span>
                <span>{booksRead} / {userData.readingGoal}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {progressPercentage}% of annual goal completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-semibold">{favorites.length}</div>
              <p className="text-sm text-muted-foreground">Favorite books</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <List className="w-5 h-5 text-blue-500" />
              To Read
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-semibold">{wantToRead.length}</div>
              <p className="text-sm text-muted-foreground">Books to read</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookshelf */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Bookshelf
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Currently Reading */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                Currently Reading
              </h3>
              {currentlyReading.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {currentlyReading.map((book) => (
                    <BookCard 
                      key={book.id} 
                      book={book} 
                      onClick={() => openBookModal(book)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4">No books currently being read</p>
              )}
            </div>

            {/* Favorites */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Favorite Books
              </h3>
              {favorites.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {favorites.map((book) => (
                    <BookCard 
                      key={book.id} 
                      book={book} 
                      onClick={() => openBookModal(book)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4">No favorite books yet</p>
              )}
            </div>

            {/* Want to Read */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <List className="w-4 h-4 text-blue-500" />
                Want to Read
              </h3>
              {wantToRead.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {wantToRead.map((book) => (
                    <BookCard 
                      key={book.id} 
                      book={book} 
                      onClick={() => openBookModal(book)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4">No books in want to read list</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Book Modal */}
      <BookModal 
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={closeBookModal}
      />
    </div>
  );
}