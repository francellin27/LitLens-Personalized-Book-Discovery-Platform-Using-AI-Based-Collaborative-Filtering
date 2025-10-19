import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Book } from "../lib/bookData";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../lib/auth-supabase";
import { DiscussionsMigrationBanner } from "./DiscussionsMigrationBanner";
import { RequestBookDialog } from "./RequestBookDialog";
import { 
  fetchBooks,
  fetchAllDiscussions,
  createDiscussion,
  fetchAllUsers,
  fetchAllReviews,
  type Discussion
} from "../lib/supabase-services";
import { 
  Users, 
  MessageSquare, 
  Trophy, 
  TrendingUp, 
  Heart, 
  BookOpen, 
  Star,
  Search,
  Plus,
  Clock,
  User,
  Check,
  ChevronsUpDown,
  X
} from "lucide-react";

interface CommunityPageProps {
  onBookSelect: (book: Book) => void;
  onViewUser: (userId: string) => void;
  onViewDiscussion: (discussionId: string) => void;
}

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  booksRead: number;
  reviewsWritten: number;
  points: number;
  rank: number;
  badge?: string;
}

export function CommunityPage({ onBookSelect, onViewUser, onViewDiscussion }: CommunityPageProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDiscussionDialog, setShowDiscussionDialog] = useState(false);
  const [discussionTitle, setDiscussionTitle] = useState("");
  const [discussionContent, setDiscussionContent] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [discussionCategory, setDiscussionCategory] = useState("general");
  const [openBookSearch, setOpenBookSearch] = useState(false);
  const [bookSearchQuery, setBookSearchQuery] = useState("");
  const [showRequestBookDialog, setShowRequestBookDialog] = useState(false);
  
  // State for Supabase data
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoadingDiscussions, setIsLoadingDiscussions] = useState(true);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
  const [showMigrationBanner, setShowMigrationBanner] = useState(false);

  // Load discussions from Supabase
  useEffect(() => {
    loadDiscussions();
  }, []);

  // Load leaderboard data from Supabase
  useEffect(() => {
    loadLeaderboardData();
  }, []);

  const loadDiscussions = async () => {
    setIsLoadingDiscussions(true);
    try {
      const fetchedDiscussions = await fetchAllDiscussions();
      setDiscussions(fetchedDiscussions);
      setShowMigrationBanner(false); // Hide banner if successful
    } catch (error: any) {
      console.error('Error loading discussions:', error);
      
      // Check if error is due to missing table
      if (error?.code === 'PGRST200' || error?.message?.includes('discussions')) {
        setShowMigrationBanner(true); // Show migration banner
        toast.error('Database migration needed', {
          description: 'Please run the discussions migration in Supabase SQL Editor. See banner above.',
          duration: 8000,
        });
      } else {
        toast.error('Failed to load discussions');
      }
    } finally {
      setIsLoadingDiscussions(false);
    }
  };

  const loadLeaderboardData = async () => {
    setIsLoadingLeaderboard(true);
    try {
      const [allUsers, allReviews] = await Promise.all([
        fetchAllUsers(),
        fetchAllReviews()
      ]);
      
      // Count reviews per user
      const reviewCountByUser = allReviews.reduce((acc, review) => {
        acc[review.userId] = (acc[review.userId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Transform users to leaderboard format and calculate points
      const leaderboardUsers = allUsers.map(user => ({
        id: user.id,
        name: user.name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
        booksRead: user.booksRead,
        reviewsWritten: reviewCountByUser[user.id] || 0,
        points: (user.booksRead * 10) + (reviewCountByUser[user.id] || 0) * 25, // 10 points per book, 25 per review
        rank: 0,
        badge: undefined as string | undefined
      }));

      // Sort by points and assign ranks
      leaderboardUsers.sort((a, b) => b.points - a.points);
      leaderboardUsers.forEach((user, index) => {
        user.rank = index + 1;
        // Assign badges to top 3
        if (index === 0) user.badge = "📚 Reading Master";
        else if (index === 1) user.badge = "⭐ Review Champion";
        else if (index === 2) user.badge = "💬 Discussion Leader";
      });

      setUsers(leaderboardUsers);
      setReviewCount(allReviews.length);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  const handleStartDiscussion = async () => {
    if (!user) {
      toast.error("You must be logged in to start a discussion");
      return;
    }
    
    if (!discussionTitle.trim()) {
      toast.error("Please enter a discussion title");
      return;
    }
    if (!discussionContent.trim()) {
      toast.error("Please enter discussion content");
      return;
    }
    
    try {
      const newDiscussion = await createDiscussion(
        user.id,
        discussionTitle,
        discussionContent,
        discussionCategory,
        selectedBook || undefined
      );

      if (newDiscussion) {
        toast.success("Discussion posted successfully!");
        
        // Reset form
        setDiscussionTitle("");
        setDiscussionContent("");
        setSelectedBook("");
        setDiscussionCategory("general");
        setBookSearchQuery("");
        setShowDiscussionDialog(false);
        
        // Reload discussions
        await loadDiscussions();
      } else {
        toast.error("Failed to create discussion");
      }
    } catch (error: any) {
      console.error('Error creating discussion:', error);
      
      // Check if error is due to missing table
      if (error?.code === 'PGRST204' || error?.message?.includes('discussions') || error?.message?.includes('book_id')) {
        toast.error('Database migration needed', {
          description: 'Please run migration 004_discussions_tables.sql in Supabase. See RUN_DISCUSSIONS_MIGRATION.md for instructions.',
          duration: 10000,
        });
      } else {
        toast.error("Failed to create discussion");
      }
    }
  };

  // Get selected book details
  const selectedBookData = books.find(book => book.id === selectedBook);

  // Filter books based on search query
  const filteredBooks = useMemo(() => {
    return books.filter(book =>
      book.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(bookSearchQuery.toLowerCase())
    ).slice(0, 50);
  }, [books, bookSearchQuery]);

  // Load books when dialog opens
  const handleOpenDialog = async () => {
    setShowDiscussionDialog(true);
    if (books.length === 0) {
      setIsLoadingBooks(true);
      try {
        const { books: fetchedBooks } = await fetchBooks({ limit: 500 });
        setBooks(fetchedBooks);
      } catch (error) {
        console.error('Error loading books:', error);
      } finally {
        setIsLoadingBooks(false);
      }
    }
  };

  // Filter discussions based on search
  const filteredDiscussions = useMemo(() => {
    if (!searchQuery.trim()) return discussions;
    
    const query = searchQuery.toLowerCase();
    return discussions.filter(discussion =>
      discussion.title.toLowerCase().includes(query) ||
      discussion.userName.toLowerCase().includes(query) ||
      discussion.bookTitle?.toLowerCase().includes(query) ||
      discussion.category.toLowerCase().includes(query)
    );
  }, [discussions, searchQuery]);

  // Calculate time ago
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return `${Math.floor(seconds / 604800)} weeks ago`;
  };

  // Determine if discussion is popular (more than 20 replies)
  const isPopularDiscussion = (replyCount: number) => replyCount >= 20;

  return (
    <div className="space-y-6">
      {/* Migration Banner - Shows if discussions table doesn't exist */}
      {showMigrationBanner && <DiscussionsMigrationBanner />}

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Community</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect with fellow book lovers, join discussions, and discover your next great read through our vibrant community
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-primary">
              {isLoadingLeaderboard ? '...' : users.length}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Active Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-primary">
              {isLoadingDiscussions ? '...' : discussions.length}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Discussions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-primary">
              {isLoadingLeaderboard ? '...' : reviewCount}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Book Reviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-primary">
              {isLoadingLeaderboard ? '...' : users.reduce((sum, u) => sum + u.booksRead, 0)}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Books Read</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="discussions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="discussions" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Discussions
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        {/* Discussions Tab */}
        <TabsContent value="discussions" className="space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              className="gap-2 w-full sm:w-auto"
              onClick={handleOpenDialog}
            >
              <Plus className="h-4 w-4" />
              Start Discussion
            </Button>
          </div>

          <div className="space-y-4 md:space-y-5">
            {isLoadingDiscussions ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading discussions...
              </div>
            ) : filteredDiscussions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No discussions found matching your search' : 'No discussions yet. Be the first to start one!'}
              </div>
            ) : (
              filteredDiscussions.map((discussion) => (
                <Card 
                  key={discussion.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                  tabIndex={0}
                  role="button"
                  aria-label={`Open discussion: ${discussion.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onViewDiscussion(discussion.id);
                    }
                  }}
                  onClick={() => {
                    onViewDiscussion(discussion.id);
                  }}
                >
                  <CardContent className="p-5 md:p-7">
                    <div className="flex gap-4 md:gap-5">
                      {discussion.bookCover && (
                        <div className="flex-shrink-0">
                          <img
                            src={discussion.bookCover}
                            alt={`Cover of ${discussion.bookTitle}`}
                            className="w-28 h-40 md:w-20 md:h-28 object-cover rounded shadow-sm"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-2 flex-wrap">
                                <h3 className="font-medium hover:text-primary transition-colors line-clamp-2 text-base">
                                  {discussion.title}
                                </h3>
                                {isPopularDiscussion(discussion.replyCount) && (
                                  <Badge variant="secondary" className="gap-1 flex-shrink-0">
                                    <TrendingUp className="h-3 w-3" />
                                    <span className="hidden sm:inline">Popular</span>
                                  </Badge>
                                )}
                              </div>
                              {discussion.bookTitle && (
                                <p className="text-sm text-muted-foreground mt-1.5">
                                  About: <span className="text-foreground">{discussion.bookTitle}</span>
                                </p>
                              )}
                            </div>
                            <Badge variant="outline" className="flex-shrink-0 self-start">{discussion.category}</Badge>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-1">
                          <button
                            className="flex items-center gap-2 hover:text-primary transition-colors text-sm text-muted-foreground self-start"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewUser(discussion.userId);
                            }}
                            aria-label={`View ${discussion.userName}'s profile`}
                          >
                            <Avatar className="w-6 h-6 md:w-7 md:h-7">
                              <AvatarImage src={discussion.userAvatar} />
                              <AvatarFallback>{discussion.userName[0]}</AvatarFallback>
                            </Avatar>
                            <span className="truncate">{discussion.userName}</span>
                          </button>
                          <div className="flex items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{discussion.replyCount}</span>
                            </div>
                            <div className="hidden sm:flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{getTimeAgo(discussion.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Top Readers This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingLeaderboard ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading leaderboard...
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No users yet
                </div>
              ) : (
                <div className="space-y-2 md:space-y-4">
                  {users.slice(0, 10).map((user, index) => (
                  <div 
                    key={user.id} 
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    tabIndex={0}
                    role="button"
                    aria-label={`View ${user.name}'s profile - Rank #${user.rank} with ${user.points} points`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onViewUser(user.id);
                      }
                    }}
                    onClick={() => onViewUser(user.id)}
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' :
                        index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        #{user.rank}
                      </div>
                    </div>
                    
                    <Avatar className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                      <AvatarImage src={user.avatar} alt={`${user.name}'s avatar`} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <p className="font-medium truncate">{user.name}</p>
                        {user.badge && (
                          <Badge variant="secondary" className="text-xs self-start sm:self-auto">
                            {user.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <span>{user.booksRead} books</span>
                        <span className="hidden sm:inline">{user.reviewsWritten} reviews</span>
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-primary text-sm md:text-base">{user.points}</div>
                      <div className="text-xs text-muted-foreground hidden sm:block">points</div>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievement Categories */}
          {!isLoadingLeaderboard && users.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                tabIndex={0}
                role="button"
                aria-label={`View ${users[0].name}'s profile - Most books read with ${users[0].booksRead} books`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onViewUser(users[0].id);
                  }
                }}
                onClick={() => onViewUser(users[0].id)}
              >
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                    Most Books Read
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 md:w-12 md:h-12">
                      <AvatarImage src={users[0].avatar} alt={`${users[0].name}'s avatar`} />
                      <AvatarFallback>{users[0].name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{users[0].name}</p>
                      <p className="text-sm text-muted-foreground">{users[0].booksRead} books</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {(() => {
                const mostReviewsUser = [...users].sort((a, b) => b.reviewsWritten - a.reviewsWritten)[0];
                return (
                  <Card 
                    className="cursor-pointer hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                    tabIndex={0}
                    role="button"
                    aria-label={`View ${mostReviewsUser.name}'s profile - Most reviews with ${mostReviewsUser.reviewsWritten} reviews`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onViewUser(mostReviewsUser.id);
                      }
                    }}
                    onClick={() => onViewUser(mostReviewsUser.id)}
                  >
                    <CardHeader className="pb-2 md:pb-3">
                      <CardTitle className="text-base md:text-lg flex items-center gap-2">
                        <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
                        Most Reviews
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 md:w-12 md:h-12">
                          <AvatarImage src={mostReviewsUser.avatar} alt={`${mostReviewsUser.name}'s avatar`} />
                          <AvatarFallback>{mostReviewsUser.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{mostReviewsUser.name}</p>
                          <p className="text-sm text-muted-foreground">{mostReviewsUser.reviewsWritten} reviews</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}

              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                tabIndex={0}
                role="button"
                aria-label={`View ${users[1].name}'s profile - Community favorite with most helpful reviews`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onViewUser(users[1].id);
                  }
                }}
                onClick={() => onViewUser(users[1].id)}
              >
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <Heart className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                    Community Favorite
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 md:w-12 md:h-12">
                      <AvatarImage src={users[1].avatar} alt={`${users[1].name}'s avatar`} />
                      <AvatarFallback>{users[1].name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{users[1].name}</p>
                      <p className="text-sm text-muted-foreground">Most helpful</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Start Discussion Dialog */}
      <Dialog open={showDiscussionDialog} onOpenChange={setShowDiscussionDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Start a New Discussion</DialogTitle>
            <DialogDescription>
              Share your thoughts, ask questions, or start a conversation about books with the community.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="discussion-title">Discussion Title *</Label>
              <Input
                id="discussion-title"
                placeholder="What's your discussion about?"
                value={discussionTitle}
                onChange={(e) => setDiscussionTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discussion-category">Category *</Label>
              <Select value={discussionCategory} onValueChange={setDiscussionCategory}>
                <SelectTrigger id="discussion-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Discussion</SelectItem>
                  <SelectItem value="book-discussion">Book Discussion</SelectItem>
                  <SelectItem value="recommendations">Recommendations</SelectItem>
                  <SelectItem value="book-club">Book Club</SelectItem>
                  <SelectItem value="author-talk">Author Talk</SelectItem>
                  <SelectItem value="reading-tips">Reading Tips</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Related Book (Optional)</Label>
              {selectedBook ? (
                <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{selectedBookData?.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{selectedBookData?.author}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedBook("");
                      setBookSearchQuery("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Popover open={openBookSearch} onOpenChange={setOpenBookSearch}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openBookSearch}
                      className="w-full justify-between"
                    >
                      <span className="text-muted-foreground">Search for a book...</span>
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput 
                        placeholder="Search books by title or author..." 
                        value={bookSearchQuery}
                        onValueChange={setBookSearchQuery}
                      />
                      <CommandList className="max-h-[300px] overflow-y-auto">
                        <CommandEmpty>
                          {isLoadingBooks ? "Loading books..." : "No books found."}
                        </CommandEmpty>
                        <CommandGroup>
                          {filteredBooks.map((book) => (
                            <CommandItem
                              key={book.id}
                              value={book.id}
                              onSelect={() => {
                                setSelectedBook(book.id);
                                setOpenBookSearch(false);
                              }}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center gap-3 w-full">
                                <img
                                  src={book.cover}
                                  alt={book.title}
                                  className="w-8 h-12 object-cover rounded flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{book.title}</p>
                                  <p className="text-sm text-muted-foreground truncate">{book.author}</p>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                      <div className="border-t p-3 bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-2">Can't find your book?</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            setOpenBookSearch(false);
                            setShowDiscussionDialog(false);
                            setShowRequestBookDialog(true);
                          }}
                        >
                          Request a Book
                        </Button>
                      </div>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="discussion-content">Your Message *</Label>
              <Textarea
                id="discussion-content"
                placeholder="Share your thoughts, questions, or start a conversation..."
                value={discussionContent}
                onChange={(e) => setDiscussionContent(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {discussionContent.length}/1000 characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDiscussionDialog(false);
                setDiscussionTitle("");
                setDiscussionContent("");
                setSelectedBook("");
                setDiscussionCategory("general");
                setBookSearchQuery("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleStartDiscussion}>
              Post Discussion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Request Book Dialog */}
      <RequestBookDialog 
        open={showRequestBookDialog} 
        onOpenChange={setShowRequestBookDialog}
      />
    </div>
  );
}
