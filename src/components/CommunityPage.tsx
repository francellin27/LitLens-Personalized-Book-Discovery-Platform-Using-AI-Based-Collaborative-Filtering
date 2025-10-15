import { useState } from "react";
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
import { bookData, Book } from "../lib/bookData";
import { MOCK_BOOKS } from "../lib/bookData";
import { toast } from "sonner@2.0.3";
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

interface Discussion {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  bookTitle: string;
  bookCover: string;
  replies: number;
  lastActivity: string;
  category: string;
  isPopular?: boolean;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showDiscussionDialog, setShowDiscussionDialog] = useState(false);
  const [discussionTitle, setDiscussionTitle] = useState("");
  const [discussionContent, setDiscussionContent] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [discussionCategory, setDiscussionCategory] = useState("general");
  const [openBookSearch, setOpenBookSearch] = useState(false);
  const [bookSearchQuery, setBookSearchQuery] = useState("");

  // Mock community data
  const discussions: Discussion[] = [
    {
      id: "1",
      title: "What are your thoughts on the ending of 'The Midnight Library'?",
      author: "Sarah Johnson",
      authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
      bookTitle: "The Midnight Library",
      bookCover: bookData[0].cover,
      replies: 24,
      lastActivity: "2 hours ago",
      category: "Book Discussion",
      isPopular: true
    },
    {
      id: "2",
      title: "Looking for sci-fi recommendations similar to The Maze Runner",
      author: "Alex Turner",
      authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      bookTitle: "The Maze Runner",
      bookCover: bookData[1].cover,
      replies: 18,
      lastActivity: "4 hours ago",
      category: "Recommendations"
    },
    {
      id: "3",
      title: "Monthly Romance Reads - Share your favorites!",
      author: "Emma Wilson",
      authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      bookTitle: "The Seven Husbands of Evelyn Hugo",
      bookCover: bookData[2].cover,
      replies: 31,
      lastActivity: "6 hours ago",
      category: "General Discussion",
      isPopular: true
    },
    {
      id: "4",
      title: "Book club selection for next month - Vote now!",
      author: "Michael Chen",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      bookTitle: "The Silent Patient",
      bookCover: bookData[3].cover,
      replies: 15,
      lastActivity: "8 hours ago",
      category: "Book Club"
    }
  ];



  const leaderboard: LeaderboardUser[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
      booksRead: 127,
      reviewsWritten: 89,
      points: 2540,
      rank: 1,
      badge: "📚 Reading Master"
    },
    {
      id: "2",
      name: "Alex Turner",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      booksRead: 98,
      reviewsWritten: 76,
      points: 2180,
      rank: 2,
      badge: "⭐ Review Champion"
    },
    {
      id: "3",
      name: "Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      booksRead: 85,
      reviewsWritten: 92,
      points: 1950,
      rank: 3,
      badge: "💬 Discussion Leader"
    },
    {
      id: "4",
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      booksRead: 72,
      reviewsWritten: 45,
      points: 1720,
      rank: 4
    },
    {
      id: "5",
      name: "Jordan Lee",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      booksRead: 69,
      reviewsWritten: 38,
      points: 1650,
      rank: 5
    }
  ];

  const handleStartDiscussion = () => {
    if (!discussionTitle.trim()) {
      toast.error("Please enter a discussion title");
      return;
    }
    if (!discussionContent.trim()) {
      toast.error("Please enter discussion content");
      return;
    }
    
    // In a real app, this would save to the backend
    toast.success("Discussion posted successfully!");
    
    // Reset form
    setDiscussionTitle("");
    setDiscussionContent("");
    setSelectedBook("");
    setDiscussionCategory("general");
    setBookSearchQuery("");
    setShowDiscussionDialog(false);
  };

  // Get selected book details
  const selectedBookData = MOCK_BOOKS.find(book => book.id === selectedBook);

  // Filter books based on search query
  const filteredBooks = MOCK_BOOKS.filter(book =>
    book.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(bookSearchQuery.toLowerCase())
  ).slice(0, 50);

  return (
    <div className="space-y-6">
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
            <div className="text-xl md:text-2xl font-bold text-primary">2,847</div>
            <div className="text-xs md:text-sm text-muted-foreground">Active Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-primary">156</div>
            <div className="text-xs md:text-sm text-muted-foreground">Discussions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-primary">4,521</div>
            <div className="text-xs md:text-sm text-muted-foreground">Book Reviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-primary">1,203</div>
            <div className="text-xs md:text-sm text-muted-foreground">Reviews Today</div>
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
              onClick={() => setShowDiscussionDialog(true)}
            >
              <Plus className="h-4 w-4" />
              Start Discussion
            </Button>
          </div>

          <div className="space-y-4 md:space-y-5">
            {discussions.map((discussion) => (
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
                    <div className="flex-shrink-0">
                      <img
                        src={discussion.bookCover}
                        alt={`Cover of ${discussion.bookTitle}`}
                        className="w-28 h-40 md:w-20 md:h-28 object-cover rounded shadow-sm"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 flex-wrap">
                              <h3 className="font-medium hover:text-primary transition-colors line-clamp-2 text-base">
                                {discussion.title}
                              </h3>
                              {discussion.isPopular && (
                                <Badge variant="secondary" className="gap-1 flex-shrink-0">
                                  <TrendingUp className="h-3 w-3" />
                                  <span className="hidden sm:inline">Popular</span>
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1.5">
                              About: <span className="text-foreground">{discussion.bookTitle}</span>
                            </p>
                          </div>
                          <Badge variant="outline" className="flex-shrink-0 self-start">{discussion.category}</Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-1">
                        <button
                          className="flex items-center gap-2 hover:text-primary transition-colors text-sm text-muted-foreground self-start"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewUser(discussion.author);
                          }}
                          aria-label={`View ${discussion.author}'s profile`}
                        >
                          <Avatar className="w-6 h-6 md:w-7 md:h-7">
                            <AvatarImage src={discussion.authorAvatar} />
                            <AvatarFallback>{discussion.author[0]}</AvatarFallback>
                          </Avatar>
                          <span className="truncate">{discussion.author}</span>
                        </button>
                        <div className="flex items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{discussion.replies}</span>
                          </div>
                          <div className="hidden sm:flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{discussion.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
              <div className="space-y-2 md:space-y-4">
                {leaderboard.map((user, index) => (
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
            </CardContent>
          </Card>

          {/* Achievement Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
              tabIndex={0}
              role="button"
              aria-label={`View ${leaderboard[0].name}'s profile - Most books read with ${leaderboard[0].booksRead} books`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onViewUser(leaderboard[0].id);
                }
              }}
              onClick={() => onViewUser(leaderboard[0].id)}
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
                    <AvatarImage src={leaderboard[0].avatar} alt={`${leaderboard[0].name}'s avatar`} />
                    <AvatarFallback>{leaderboard[0].name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{leaderboard[0].name}</p>
                    <p className="text-sm text-muted-foreground">{leaderboard[0].booksRead} books</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
              tabIndex={0}
              role="button"
              aria-label={`View ${leaderboard[2].name}'s profile - Most reviews with ${leaderboard[2].reviewsWritten} reviews`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onViewUser(leaderboard[2].id);
                }
              }}
              onClick={() => onViewUser(leaderboard[2].id)}
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
                    <AvatarImage src={leaderboard[2].avatar} alt={`${leaderboard[2].name}'s avatar`} />
                    <AvatarFallback>{leaderboard[2].name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{leaderboard[2].name}</p>
                    <p className="text-sm text-muted-foreground">{leaderboard[2].reviewsWritten} reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
              tabIndex={0}
              role="button"
              aria-label={`View ${leaderboard[1].name}'s profile - Community favorite with most helpful reviews`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onViewUser(leaderboard[1].id);
                }
              }}
              onClick={() => onViewUser(leaderboard[1].id)}
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
                    <AvatarImage src={leaderboard[1].avatar} alt={`${leaderboard[1].name}'s avatar`} />
                    <AvatarFallback>{leaderboard[1].name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{leaderboard[1].name}</p>
                    <p className="text-sm text-muted-foreground">Most helpful</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
                  <PopoverContent className="w-full p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput 
                        placeholder="Search books by title or author..." 
                        value={bookSearchQuery}
                        onValueChange={setBookSearchQuery}
                      />
                      <CommandList>
                        <CommandEmpty>No books found.</CommandEmpty>
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
                            toast.success("Book request feature coming soon!");
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
    </div>
  );
}
