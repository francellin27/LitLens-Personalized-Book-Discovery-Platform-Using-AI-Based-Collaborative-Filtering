import { useState, useEffect, useRef } from 'react';
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
import { BookOpen, Heart, List, Settings, Star, Calendar, Edit, Save, X, Camera, Clock, LogOut, Trash2, Eye, Database, HelpCircle, Trophy, Target, TrendingUp, Award, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { supabase } from '../utils/supabase/client';
import { Progress } from './ui/progress';
import { updateUserProfile } from '../lib/supabase-services';
import { StorageMigrationBanner } from './StorageMigrationBanner';

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

  // Photo upload state
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock last profile update date - in a real app, this would come from the backend
  const lastProfileUpdate = new Date('2024-12-01'); // Example date
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const canEditProfile = lastProfileUpdate <= thirtyDaysAgo;

  // Add a refresh key to force refetch when needed
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Refresh data when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setRefreshKey(prev => prev + 1);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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
  }, [user?.id, refreshKey]);

  const openBookModal = (book: Book) => {
    setSelectedBook(book);
  };

  const closeBookModal = () => {
    setSelectedBook(null);
    // Refresh data when closing the modal to reflect any status changes
    setRefreshKey(prev => prev + 1);
  };

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile via API
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a JPG, PNG, or WebP image');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadingPhoto(true);

    try {
      // Upload photo to Supabase Storage
      const photoUrl = await uploadProfilePhoto(user.id, file);

      if (!photoUrl) {
        toast.error('Failed to upload photo. Please try again.');
        setUploadingPhoto(false);
        return;
      }

      // Update user profile with new avatar URL
      const success = await updateUserProfile(user.id, { avatar: photoUrl });

      if (success) {
        // Update local state
        setTempAvatarUrl(photoUrl);
        
        // Refresh the auth context to update the user object
        setRefreshKey(prev => prev + 1);
        
        toast.success('Profile photo updated successfully!');
      } else {
        toast.error('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('An error occurred while uploading the photo');
    } finally {
      setUploadingPhoto(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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

  // Calculate reading progress
  const readingProgress = readingGoal > 0 ? Math.min((completedBooks.length / readingGoal) * 100, 100) : 0;

  return (
    <div className="w-full space-y-8">
      {/* Modern Profile Hero Section */}
      <div className="relative overflow-hidden rounded-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        
        <div className="relative px-6 py-8 md:px-10 md:py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-white/40 to-white/20 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200" />
              <Avatar className="relative w-28 h-28 md:w-32 md:h-32 border-4 border-white/30 shadow-2xl">
                {user?.avatar && <AvatarImage src={user.avatar} alt={user?.name} />}
                <AvatarFallback className="text-3xl bg-white/20 text-white backdrop-blur-sm">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl md:text-4xl text-white mb-1">{user?.name}</h1>
                <p className="text-white/80 text-lg">@{user?.username}</p>
              </div>
              
              {user?.bio && (
                <p className="text-white/90 text-sm md:text-base max-w-2xl">
                  {user.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Trophy className="w-3 h-3 mr-1" />
                  {user?.role === 'admin' ? 'Administrator' : 'Reader'}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Calendar className="w-3 h-3 mr-1" />
                  Joined Dec 2023
                </Badge>
              </div>
            </div>

            {/* Edit Button */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm self-start md:self-auto"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
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
                  {/* Storage Migration Banner */}
                  <StorageMigrationBanner />
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <Avatar className="w-16 h-16 cursor-pointer" onClick={triggerFileInput}>
                          {(tempAvatarUrl || user?.avatar) && <AvatarImage src={tempAvatarUrl || user?.avatar} alt={user?.name} />}
                          <AvatarFallback>
                            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          disabled={uploadingPhoto}
                          className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          {uploadingPhoto ? (
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Upload className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{uploadingPhoto ? 'Uploading...' : 'Click your photo to update'}</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG or WebP, max 5MB</p>
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

                  <div className="space-y-2">
                    <Label htmlFor="edit-bio">Bio</Label>
                    <Textarea
                      id="edit-bio"
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      disabled={!canEditProfile}
                      rows={3}
                    />
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

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl text-white">{completedBooks.length}</div>
                  <div className="text-xs text-white/80">Books Read</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl text-white">{currentlyReadingBooks.length}</div>
                  <div className="text-xs text-white/80">Reading Now</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl text-white">{userReviews.length}</div>
                  <div className="text-xs text-white/80">Reviews</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl text-white">{favoriteBooks.length}</div>
                  <div className="text-xs text-white/80">Favorites</div>
                </div>
              </div>
            </div>
          </div>

          {/* Reading Goal Progress */}
          <Card className="mt-6 bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-white" />
                  <span className="text-sm text-white">Annual Reading Goal</span>
                </div>
                <span className="text-sm text-white">{completedBooks.length} / {readingGoal} books</span>
              </div>
              <Progress value={readingProgress} className="h-2 bg-white/20" />
              <p className="text-xs text-white/80 mt-2">
                {readingProgress >= 100 
                  ? '🎉 Goal achieved! Keep going!' 
                  : `${Math.round(readingProgress)}% complete - ${readingGoal - completedBooks.length} books to go`}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Tabs */}
      <Tabs defaultValue="bookshelf" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-card" role="tablist">
          <TabsTrigger 
            value="bookshelf" 
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Bookshelf</span>
          </TabsTrigger>
          <TabsTrigger 
            value="reviews" 
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Star className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Reviews</span>
          </TabsTrigger>
          <TabsTrigger 
            value="favorites" 
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Heart className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Favorites</span>
          </TabsTrigger>
          <TabsTrigger 
            value="reading-list" 
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <List className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Reading List</span>
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Settings className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Bookshelf Tab */}
        <TabsContent value="bookshelf" className="mt-6">
          <div className="space-y-8">
            {/* Currently Reading */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl flex items-center gap-2">
                  <div className="w-1 h-8 bg-primary rounded-full" />
                  Currently Reading
                </h2>
                <Badge variant="secondary">{currentlyReadingBooks.length}</Badge>
              </div>
              {currentlyReadingBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {currentlyReadingBooks.map((book) => (
                    <BookCard key={book.id} book={book} onBookClick={openBookModal} />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No books currently being read</p>
                  <Button variant="outline" className="mt-4" onClick={() => onPageChange?.('browse')}>
                    Browse Books
                  </Button>
                </Card>
              )}
            </div>

            {/* Completed Books */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl flex items-center gap-2">
                  <div className="w-1 h-8 bg-primary rounded-full" />
                  Completed Books
                </h2>
                <Badge variant="secondary">{completedBooks.length}</Badge>
              </div>
              {completedBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {completedBooks.map((book) => (
                    <BookCard key={book.id} book={book} onBookClick={openBookModal} />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <Award className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No completed books yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Start reading to build your collection!</p>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl flex items-center gap-2">
                <div className="w-1 h-8 bg-primary rounded-full" />
                My Reviews
              </h2>
              <Badge variant="secondary">{userReviews.length}</Badge>
            </div>
            {userReviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userReviews.map((review) => {
                  const book = books.find(b => b.id === review.book_id);
                  return (
                    <Card 
                      key={review.id} 
                      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
                      onClick={() => book && openBookModal(book)}
                    >
                      <div className="aspect-[3/4] relative">
                        <ImageWithFallback
                          src={book?.cover || ''}
                          alt={book?.title || 'Book cover'}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="line-clamp-2 mb-1">{book?.title}</h3>
                          <p className="text-sm text-white/80 line-clamp-1">by {book?.author}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <StarRating rating={review.rating} size="sm" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground line-clamp-3">{review.content}</p>
                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Star className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No reviews written yet</p>
                <p className="text-sm text-muted-foreground mt-2">Share your thoughts on books you've read!</p>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl flex items-center gap-2">
                <div className="w-1 h-8 bg-primary rounded-full" />
                Favorite Books
              </h2>
              <Badge variant="secondary">{favoriteBooks.length}</Badge>
            </div>
            {favoriteBooks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {favoriteBooks.map((book) => (
                  <BookCard key={book.id} book={book} onBookClick={openBookModal} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Heart className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No favorite books yet</p>
                <p className="text-sm text-muted-foreground mt-2">Mark your favorite books with a heart!</p>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Reading List Tab */}
        <TabsContent value="reading-list" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl flex items-center gap-2">
                <div className="w-1 h-8 bg-primary rounded-full" />
                Reading List
              </h2>
              <Badge variant="secondary">{readingListBooks.length}</Badge>
            </div>
            {readingListBooks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {readingListBooks.map((book) => (
                  <BookCard key={book.id} book={book} onBookClick={openBookModal} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <List className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No books in your reading list</p>
                <p className="text-sm text-muted-foreground mt-2">Add books you want to read later!</p>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl flex items-center gap-2 mb-6">
                <div className="w-1 h-8 bg-primary rounded-full" />
                Account Settings
              </h2>

              <div className="grid gap-6">
                {/* Reading Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Reading Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Annual Reading Goal</Label>
                        <p className="text-sm text-muted-foreground">Set your yearly target</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={readingGoal}
                          onChange={(e) => setReadingGoal(Number(e.target.value))}
                          className="w-20"
                          min="1"
                          max="365"
                        />
                        <span className="text-sm">books</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Privacy Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Privacy Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Profile Visibility</Label>
                        <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                      </div>
                      <Select defaultValue="public">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="friends">Friends</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <Label>Show Reading Activity</Label>
                        <p className="text-sm text-muted-foreground">Let others see what you're reading</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                {/* Personalization */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Personalization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Personalized Recommendations</Label>
                        <p className="text-sm text-muted-foreground">Get AI-powered book suggestions</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive updates about new books</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                {/* Account Actions */}
                <Card className="border-destructive/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <Settings className="w-5 h-5" />
                      Account Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={() => onPageChange?.('help')}
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Help Center
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={logout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log Out
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Book Details Modal */}
      <BookModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={closeBookModal}
        onViewUser={onViewUser}
        onBookSelect={openBookModal}
      />
    </div>
  );
}