import { useState } from 'react';
import { BookModal } from './BookModal';
import { BookCard } from './BookCard';
import { MOCK_BOOKS, Book } from '../lib/bookData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BookOpen, Heart, List, Star, ArrowLeft } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  joinedDate: string;
  bio?: string;
  favoriteGenres: string[];
  readingGoal: number;
}

interface UserProfileViewProps {
  userId: string;
  onBack: () => void;
}

// Mock user data - in a real app, this would be fetched from the backend
const MOCK_USER_DATA: UserData = {
  id: 'user_456',
  name: 'Sarah Mitchell',
  username: 'bookworm_sarah',
  email: 'sarah@example.com',
  joinedDate: '2023-03-15',
  bio: 'Avid reader, coffee enthusiast, and lover of mystery novels. Always looking for the next great page-turner!',
  favoriteGenres: ['Mystery', 'Thriller', 'Contemporary Fiction', 'Historical Fiction'],
  readingGoal: 75
};

export function UserProfileView({ userId, onBack }: UserProfileViewProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
  // Mock user's bookshelf - in a real app, this would be fetched based on userId
  const userBooks = MOCK_BOOKS.slice(0, 12); // Simulate user's collection
  const currentlyReading = MOCK_BOOKS.slice(0, 3);
  const favorites = MOCK_BOOKS.slice(3, 9);
  const wantToRead = MOCK_BOOKS.slice(9, 15);
  
  const openBookModal = (book: Book) => {
    setSelectedBook(book);
  };

  const closeBookModal = () => {
    setSelectedBook(null);
  };

  const booksRead = userBooks.length;
  const progressPercentage = Math.round((booksRead / MOCK_USER_DATA.readingGoal) * 100);

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
                src="https://images.unsplash.com/photo-1494790108755-2616b612b048?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODU1MDMwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                alt={MOCK_USER_DATA.name} 
              />
              <AvatarFallback className="text-xl">
                {MOCK_USER_DATA.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div>
                <h1 className="text-2xl font-semibold">{MOCK_USER_DATA.name}</h1>
                <p className="text-muted-foreground">@{MOCK_USER_DATA.username}</p>
              </div>
              
              {MOCK_USER_DATA.bio && (
                <p className="text-muted-foreground">{MOCK_USER_DATA.bio}</p>
              )}
              
              <div className="flex flex-wrap gap-2">
                {MOCK_USER_DATA.favoriteGenres.map((genre) => (
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
                <span>{booksRead} / {MOCK_USER_DATA.readingGoal}</span>
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
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentlyReading.map((book) => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    onClick={() => openBookModal(book)}
                  />
                ))}
              </div>
            </div>

            {/* Favorites */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Favorite Books
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {favorites.map((book) => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    onClick={() => openBookModal(book)}
                  />
                ))}
              </div>
            </div>

            {/* Want to Read */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <List className="w-4 h-4 text-blue-500" />
                Want to Read
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {wantToRead.map((book) => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    onClick={() => openBookModal(book)}
                  />
                ))}
              </div>
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