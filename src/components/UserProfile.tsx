import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-supabase';
import { BookModal } from './BookModal';
import { BookCard } from './BookCard';
import { Book } from '../lib/bookData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { StarRating } from './StarRating';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BookOpen, Heart, List, Settings, Star, Calendar, Edit, Save, X, Camera, Clock, LogOut, Trash2, Eye, Database, HelpCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { supabase } from '../utils/supabase/client';

interface UserProfileProps {
  onViewUser?: (userId: string) => void;
  onPageChange?: (page: string) => void;
}

export function UserProfile({ onViewUser, onPageChange }: UserProfileProps) {
  const { user, logout } = useAuth();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [readingGoal, setReadingGoal] = useState(user?.preferences?.readingGoal || 50);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Real user data from Supabase
  const [userBooks, setUserBooks] = useState({
    currentlyReading: [] as string[],
    completed: [] as string[],
    favorites: [] as string[],
    readingList: [] as string[]
  });
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock last profile update date - in a real app, this would come from the backend
  const lastProfileUpdate = new Date('2024-12-01'); // Example date
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const canEditProfile = lastProfileUpdate <= thirtyDaysAgo;

  // Fetch user's book status from Supabase
  useEffect(() => {
    async function fetchUserData() {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        // Fetch user's book statuses
        const { data: bookStatuses, error: statusError } = await supabase
          .from('user_book_status')
          .select('book_id, status')
          .eq('user_id', user.id);

        if (!statusError && bookStatuses) {
          const currentlyReading: string[] = [];
          const completed: string[] = [];
          const favorites: string[] = [];
          const wantToRead: string[] = [];

          bookStatuses.forEach(status => {
            if (status.status === 'reading') currentlyReading.push(status.book_id);
            if (status.status === 'completed') completed.push(status.book_id);
            if (status.status === 'favorite') favorites.push(status.book_id);
            if (status.status === 'want_to_read') wantToRead.push(status.book_id);
          });

          setUserBooks({
            currentlyReading,
            completed,
            favorites,
            readingList: wantToRead
          });
        }

        // Fetch user's reviews
        const { data: reviews, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('user_id', user.id);

        if (!reviewsError && reviews) {
          setUserReviews(reviews);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user?.id]);

  const openBookModal = (book: Book) => {
    setSelectedBook(book);
  };

  const closeBookModal = () => {
    setSelectedBook(null);
  };

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile via API
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const [books, setBooks] = useState<Book[]>([]);
  
  // Fetch books data
  useEffect(() => {
    async function fetchBooks() {
      const allBookIds = [
        ...userBooks.currentlyReading,
        ...userBooks.completed,
        ...userBooks.favorites,
        ...userBooks.readingList
      ];
      
      if (allBookIds.length === 0) return;

      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .in('id', allBookIds);

        if (!error && data) {
          // Transform database books to Book interface
          const transformedBooks = data.map(dbBook => ({
            id: dbBook.id,
            title: dbBook.title,
            author: dbBook.author,
            authorInfo: dbBook.author_info,
            cover: dbBook.cover,
            rating: parseFloat(dbBook.rating),
            totalRatings: dbBook.total_ratings,
            genre: dbBook.genre,
            description: dbBook.description,
            publishedYear: dbBook.published_year,
            pages: dbBook.pages,
            isbn: dbBook.isbn,
            publisher: dbBook.publisher,
            language: dbBook.language,
            viewCount: dbBook.view_count,
            readCount: dbBook.read_count,
            publishingInfo: dbBook.publishing_info,
            length: dbBook.length
          }));
          setBooks(transformedBooks);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }

    fetchBooks();
  }, [userBooks]);

  const getBooksById = (bookIds: string[]): Book[] => {
    return books.filter(book => bookIds.includes(book.id));
  };

  const currentlyReadingBooks = getBooksById(userBooks.currentlyReading);
  const completedBooks = getBooksById(userBooks.completed);
  const favoriteBooks = getBooksById(userBooks.favorites);
  const readingListBooks = getBooksById(userBooks.readingList);

  return (
    <div className="w-full space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28">
                {user?.avatar && <AvatarImage src={user.avatar} alt={user?.name} />}
                <AvatarFallback className="text-xl">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl">{user?.name}</h1>
                <p className="text-muted-foreground">@{user?.username}</p>
                <Badge variant="secondary" className="mt-2">
                  {user?.role === 'admin' ? 'Administrator' : 'Reader'}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-medium">Books Read</div>
                <div className="text-2xl text-primary">{completedBooks.length}</div>
              </div>
              <div>
                <div className="font-medium">Currently Reading</div>
                <div className="text-2xl text-primary">{currentlyReadingBooks.length}</div>
              </div>
              <div>
                <div className="font-medium">Reviews Written</div>
                <div className="text-2xl text-primary">{userReviews.length}</div>
              </div>
              <div>
                <div className="font-medium">Reading Goal</div>
                <div className="text-2xl text-primary">{readingGoal}</div>
              </div>
            </div>
          </div>
          
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Edit Profile
                </DialogTitle>
                <DialogDescription>
                  Update your profile information. You can make changes every 30 days.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex-shrink-0">
                    <Avatar className="w-16 h-16 relative group">
                      {user?.avatar && <AvatarImage src={user.avatar} alt={user?.name} />}
                      <AvatarFallback>
                        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                      </AvatarFallback>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center cursor-pointer">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">Click your photo to update</p>
                    <p className="text-xs text-muted-foreground">JPG or PNG, max 5MB</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      disabled={!canEditProfile}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-username">Username</Label>
                    <Input
                      id="edit-username"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      disabled={!canEditProfile}
                    />
                  </div>
                </div>

                {!canEditProfile && (
                  <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <div className="text-sm">
                      <p className="text-orange-800 dark:text-orange-200">Profile changes are limited</p>
                      <p className="text-orange-600 dark:text-orange-400 text-xs">
                        You can make changes again on {new Date(lastProfileUpdate.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      if (canEditProfile) {
                        handleSaveProfile();
                        setShowEditDialog(false);
                      } else {
                        toast.error('You can only update your profile every 30 days');
                      }
                    }}
                    disabled={!canEditProfile}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Profile Tabs */}
      <Tabs defaultValue="bookshelf" className="w-full min-w-0">
        <TabsList className="grid w-full grid-cols-5" role="tablist" aria-label="Profile sections">
          <TabsTrigger 
            value="bookshelf" 
            className="flex items-center gap-2 sm:gap-2 gap-0 justify-center sm:justify-start focus-visible-ring"
            aria-label="View your bookshelf and currently reading books"
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Bookshelf</span>
            <span className="sr-only sm:hidden">View bookshelf</span>
          </TabsTrigger>
          <TabsTrigger 
            value="reviews" 
            className="flex items-center gap-2 sm:gap-2 gap-0 justify-center sm:justify-start focus-visible-ring"
            aria-label="View and manage your book reviews"
          >
            <Star className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">My Reviews</span>
            <span className="sr-only sm:hidden">View reviews</span>
          </TabsTrigger>
          <TabsTrigger 
            value="favorites" 
            className="flex items-center gap-2 sm:gap-2 gap-0 justify-center sm:justify-start focus-visible-ring"
            aria-label="View your favorite books"
          >
            <Heart className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Favorites</span>
            <span className="sr-only sm:hidden">View favorites</span>
          </TabsTrigger>
          <TabsTrigger 
            value="reading-list" 
            className="flex items-center gap-2 sm:gap-2 gap-0 justify-center sm:justify-start focus-visible-ring"
            aria-label="View your reading list and planned books"
          >
            <List className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Reading List</span>
            <span className="sr-only sm:hidden">View reading list</span>
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="flex items-center gap-2 sm:gap-2 gap-0 justify-center sm:justify-start focus-visible-ring"
            aria-label="Access account settings and preferences"
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Settings</span>
            <span className="sr-only sm:hidden">Account settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Bookshelf Tab */}
        <TabsContent value="bookshelf" className="w-full min-w-0">
          <div className="min-h-[600px] space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl">Currently Reading</h2>
              {currentlyReadingBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {currentlyReadingBooks.map((book) => (
                    <BookCard key={book.id} book={book} onBookClick={openBookModal} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No books currently being read</p>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl">Completed Books</h2>
              {completedBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {completedBooks.map((book) => (
                    <BookCard key={book.id} book={book} onBookClick={openBookModal} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No completed books yet</p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="w-full min-w-0">
          <div className="min-h-[600px] space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl">My Reviews</h2>
              {userReviews.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {userReviews.map((review) => {
                    const book = MOCK_BOOKS.find(b => b.id === review.bookId);
                    return (
                      <Card 
                        key={review.id} 
                        className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 touch-manipulation flex flex-col"
                        onClick={() => book && openBookModal(book)}
                      >
                        <CardContent className="p-0 flex flex-col h-full">
                          <div className="relative">
                            <ImageWithFallback
                              src={book?.cover || ''}
                              alt={book?.title || 'Book cover'}
                              className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-t-lg"
                            />
                            <Badge className="absolute top-2 left-2 text-xs" variant="secondary">
                              Review
                            </Badge>
                            <div className="absolute top-2 right-2">
                              <div className="px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm">
                                <StarRating rating={review.rating} size="sm" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-3 sm:p-4 space-y-2 flex-1 flex flex-col">
                            <div className="space-y-1 flex-1">
                              <h3 className="line-clamp-2 group-hover:text-primary transition-colors text-sm sm:text-base leading-tight">
                                {book?.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                                by {book?.author}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                                {review.content}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2 pt-1 sm:pt-2 text-xs text-muted-foreground border-t">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews written yet</p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites" className="w-full min-w-0">
          <div className="min-h-[600px] space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl">Favorite Books</h2>
              {favoriteBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {favoriteBooks.map((book) => (
                    <BookCard key={book.id} book={book} onBookClick={openBookModal} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No favorite books yet</p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Reading List Tab */}
        <TabsContent value="reading-list" className="w-full min-w-0">
          <div className="min-h-[600px] space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl">Reading List</h2>
              {readingListBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {readingListBooks.map((book) => (
                    <BookCard key={book.id} book={book} onBookClick={openBookModal} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No books in reading list</p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="w-full min-w-0" role="tabpanel" aria-labelledby="settings-tab">
          <div className="min-h-[600px] space-y-6">
            {/* Account & Settings Section */}
            <div className="space-y-4">
              <h2 className="text-xl">Settings Overview</h2>
              
              {/* Settings Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Profile Information Card */}
                <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 h-24 rounded-t-lg flex items-center justify-center">
                      <Settings className="w-12 h-12 text-primary" />
                      <Badge className="absolute top-2 left-2 text-xs" variant="secondary">
                        Account
                      </Badge>
                    </div>
                    <div className="p-3 sm:p-4 space-y-2 flex-1 flex flex-col">
                      <h3 className="group-hover:text-primary transition-colors">Profile Info</h3>
                      <div className="text-xs text-muted-foreground space-y-1 flex-1">
                        <p className="line-clamp-1">{user?.name}</p>
                        <p className="line-clamp-1">@{user?.username}</p>
                        <p className="line-clamp-1">{user?.email}</p>
                      </div>
                      <div className="text-xs text-muted-foreground border-t pt-2">
                        Member since Dec 2023
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reading Goal Card */}
                <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 h-24 rounded-t-lg flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-primary" />
                      <Badge className="absolute top-2 left-2 text-xs" variant="secondary">
                        Reading
                      </Badge>
                    </div>
                    <div className="p-3 sm:p-4 space-y-2 flex-1 flex flex-col">
                      <h3 className="group-hover:text-primary transition-colors">Reading Goal</h3>
                      <div className="text-xs text-muted-foreground flex-1">
                        <p>Annual target</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            type="number"
                            value={readingGoal}
                            onChange={(e) => setReadingGoal(Number(e.target.value))}
                            className="w-16 h-7 text-xs text-center"
                            min="1"
                            max="365"
                          />
                          <span className="text-xs">books</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground border-t pt-2">
                        Track your progress
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Profile Visibility Card */}
                <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 h-24 rounded-t-lg flex items-center justify-center">
                      <Eye className="w-12 h-12 text-primary" />
                      <Badge className="absolute top-2 left-2 text-xs" variant="secondary">
                        Privacy
                      </Badge>
                    </div>
                    <div className="p-3 sm:p-4 space-y-2 flex-1 flex flex-col">
                      <h3 className="group-hover:text-primary transition-colors">Visibility</h3>
                      <div className="text-xs text-muted-foreground flex-1">
                        <p>Profile visibility</p>
                        <Select defaultValue="public">
                          <SelectTrigger className="w-full h-7 text-xs mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="friends">Friends</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="text-xs text-muted-foreground border-t pt-2">
                        Control your privacy
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Collection Card */}
                <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 h-24 rounded-t-lg flex items-center justify-center">
                      <Database className="w-12 h-12 text-primary" />
                      <Badge className="absolute top-2 left-2 text-xs" variant="secondary">
                        Data
                      </Badge>
                    </div>
                    <div className="p-3 sm:p-4 space-y-2 flex-1 flex flex-col">
                      <h3 className="group-hover:text-primary transition-colors">Preferences</h3>
                      <div className="text-xs text-muted-foreground flex-1">
                        <p>Personalized recommendations</p>
                        <div className="flex items-center justify-between mt-2">
                          <span>Enabled</span>
                          <Switch defaultChecked />
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground border-t pt-2">
                        Better suggestions
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Help & Support Card */}
                <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 h-24 rounded-t-lg flex items-center justify-center">
                      <HelpCircle className="w-12 h-12 text-primary" />
                      <Badge className="absolute top-2 left-2 text-xs" variant="secondary">
                        Support
                      </Badge>
                    </div>
                    <div className="p-3 sm:p-4 space-y-2 flex-1 flex flex-col">
                      <h3 className="group-hover:text-primary transition-colors">Get Help</h3>
                      <div className="text-xs text-muted-foreground flex-1">
                        <p>Access guides and support resources</p>
                      </div>
                      <div className="border-t pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-xs h-7"
                          onClick={() => onPageChange?.('help')}
                        >
                          View Help
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Additional Settings Section */}
            <div className="space-y-4">
              <h2 className="text-xl">Account Actions</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Delete Account Card */}
                <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative bg-gradient-to-br from-destructive/10 to-destructive/5 h-24 rounded-t-lg flex items-center justify-center">
                      <Trash2 className="w-12 h-12 text-destructive" />
                      <Badge className="absolute top-2 left-2 text-xs" variant="destructive">
                        Danger
                      </Badge>
                    </div>
                    <div className="p-3 sm:p-4 space-y-2 flex-1 flex flex-col">
                      <h3 className="group-hover:text-destructive transition-colors">Delete Account</h3>
                      <div className="text-xs text-muted-foreground flex-1">
                        <p>Permanently delete your account and data</p>
                      </div>
                      <div className="border-t pt-2">
                        <Button variant="outline" size="sm" className="w-full text-xs h-7 text-destructive hover:bg-destructive/10">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sign Out Card */}
                <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative bg-gradient-to-br from-destructive/10 to-destructive/5 h-24 rounded-t-lg flex items-center justify-center">
                      <LogOut className="w-12 h-12 text-destructive" />
                      <Badge className="absolute top-2 left-2 text-xs" variant="secondary">
                        Session
                      </Badge>
                    </div>
                    <div className="p-3 sm:p-4 space-y-2 flex-1 flex flex-col">
                      <h3 className="group-hover:text-destructive transition-colors">Sign Out</h3>
                      <div className="text-xs text-muted-foreground flex-1">
                        <p>Sign out of your account on this device</p>
                      </div>
                      <div className="border-t pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-xs h-7 text-destructive hover:bg-destructive/10"
                          onClick={logout}
                        >
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Book Modal */}
      <BookModal 
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={closeBookModal}
      />
    </div>
  );
}