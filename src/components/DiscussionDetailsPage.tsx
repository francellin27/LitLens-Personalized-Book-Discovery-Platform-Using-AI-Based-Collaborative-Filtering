import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Book, bookData } from "../lib/bookData";
import { toast } from "sonner@2.0.3";
import { 
  ArrowLeft,
  MessageSquare, 
  Heart, 
  Share,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Flag,
  Clock,
  User,
  BookOpen,
  Zap,
  Shield,
  AlertTriangle,
  FileText,
  Copyright,
  HelpCircle
} from "lucide-react";

interface DiscussionDetailsPageProps {
  discussionId: string;
  onBack: () => void;
  onBookSelect: (book: Book) => void;
  onViewUser: (userId: string) => void;
}

interface Reply {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Reply[];
}

interface DiscussionDetails {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  bookTitle: string;
  bookCover: string;
  content: string;
  timestamp: string;
  category: string;
  likes: number;
  isLiked: boolean;
  replies: Reply[];
  totalReplies: number;
  isPopular?: boolean;
}

export function DiscussionDetailsPage({ 
  discussionId, 
  onBack, 
  onBookSelect, 
  onViewUser 
}: DiscussionDetailsPageProps) {
  const [newReply, setNewReply] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [discussionLikes, setDiscussionLikes] = useState(24);
  const [isDiscussionLiked, setIsDiscussionLiked] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportType, setReportType] = useState<"discussion" | "reply">("discussion");
  const [reportedItemId, setReportedItemId] = useState<string>("");
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [replyLikes, setReplyLikes] = useState<Record<string, { likes: number; isLiked: boolean }>>({
    "1": { likes: 12, isLiked: true },
    "2": { likes: 8, isLiked: false },
    "3": { likes: 15, isLiked: false },
    "4": { likes: 3, isLiked: false },
    "5": { likes: 7, isLiked: true }
  });

  // Handle interactions
  const handleLikeDiscussion = () => {
    const newLikedState = !isDiscussionLiked;
    setIsDiscussionLiked(newLikedState);
    setDiscussionLikes(prev => newLikedState ? prev + 1 : prev - 1);
    
    toast.success(newLikedState ? "Discussion liked!" : "Discussion unliked");
  };

  const handleLikeReply = (replyId: string) => {
    const currentState = replyLikes[replyId];
    const newLikedState = !currentState?.isLiked;
    
    setReplyLikes(prev => ({
      ...prev,
      [replyId]: {
        likes: newLikedState ? (currentState?.likes || 0) + 1 : (currentState?.likes || 0) - 1,
        isLiked: newLikedState
      }
    }));
    
    toast.success(newLikedState ? "Reply liked!" : "Reply unliked");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Discussion link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleReport = (replyId?: string) => {
    setReportType(replyId ? 'reply' : 'discussion');
    setReportedItemId(replyId || discussionId);
    setReportReason("");
    setReportDescription("");
    setIsReportDialogOpen(true);
  };

  const handleSubmitReport = () => {
    if (!reportReason) {
      toast.error("Please select a reason for reporting");
      return;
    }

    // In a real app, this would submit the report to the backend
    console.log('Submitting report:', {
      type: reportType,
      itemId: reportedItemId,
      reason: reportReason,
      description: reportDescription
    });

    toast.success(`${reportType === 'reply' ? 'Reply' : 'Discussion'} reported successfully. Thank you for helping keep our community safe.`);
    
    // Reset and close dialog
    setIsReportDialogOpen(false);
    setReportReason("");
    setReportDescription("");
  };

  // Mock discussion details data
  const discussion: DiscussionDetails = {
    id: discussionId,
    title: "What are your thoughts on the ending of 'The Midnight Library'?",
    author: "Sarah Johnson",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
    bookTitle: "The Midnight Library",
    bookCover: bookData[0].cover,
    content: "I just finished reading The Midnight Library and I'm still processing the ending. The concept of parallel lives and the library between life and death was fascinating, but I found myself questioning whether Nora's final choice was realistic. What did everyone else think about her journey and the resolution? Did it feel satisfying to you?",
    timestamp: "2 hours ago",
    category: "Book Discussion",
    likes: discussionLikes,
    isLiked: isDiscussionLiked,
    totalReplies: 18,
    replies: [
      {
        id: "1",
        author: "Alex Turner",
        authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        content: "I absolutely loved the ending! I think it was realistic because Nora finally learned to appreciate her actual life instead of always wondering 'what if'. The message about finding meaning in our current circumstances really resonated with me.",
        timestamp: "1 hour ago",
        likes: 12,
        isLiked: true
      },
      {
        id: "2", 
        author: "Emma Wilson",
        authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        content: "I had mixed feelings about it. While I appreciated the philosophical message, I felt like some of the parallel lives could have been explored more deeply. The ending felt a bit rushed to me, though I understand the author's intent.",
        timestamp: "45 minutes ago",
        likes: 8,
        isLiked: false
      },
      {
        id: "3",
        author: "Michael Chen", 
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        content: "The ending made me cry! I think it was perfect because it showed that every life has value, even the one we think is 'ordinary'. Nora's realization that her root life was worth living was beautifully written.",
        timestamp: "30 minutes ago",
        likes: 15,
        isLiked: false
      }
    ],
    isPopular: true
  };

  const handleSubmitReply = () => {
    if (newReply.trim()) {
      // TODO: Submit reply to backend
      console.log('Submitting reply:', newReply);
      setNewReply("");
      setReplyingTo(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Community
        </Button>
        <Badge variant="outline">{discussion.category}</Badge>
        {discussion.isPopular && (
          <Badge variant="secondary" className="gap-1">
            <MessageSquare className="h-3 w-3" />
            Popular
          </Badge>
        )}
      </div>

      {/* Main Discussion */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            {/* Book Cover */}
            <button
              onClick={() => {
                // TODO: Find and pass the actual book object
                console.log('Opening book details for:', discussion.bookTitle);
              }}
              className="flex-shrink-0 hover:opacity-80 transition-opacity"
            >
              <img
                src={discussion.bookCover}
                alt={`Cover of ${discussion.bookTitle}`}
                className="w-28 h-40 md:w-24 md:h-32 object-cover rounded shadow-sm"
              />
            </button>

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{discussion.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    About: <span className="text-foreground font-medium">{discussion.bookTitle}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <button
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                  onClick={() => onViewUser(discussion.author)}
                >
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={discussion.authorAvatar} />
                    <AvatarFallback>{discussion.author[0]}</AvatarFallback>
                  </Avatar>
                  <span>{discussion.author}</span>
                </button>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{discussion.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-foreground leading-relaxed">{discussion.content}</p>
          
          <Separator />

          {/* Discussion Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikeDiscussion}
                className={`gap-2 ${isDiscussionLiked ? 'text-red-600 hover:text-red-700' : ''}`}
              >
                <Heart className={`h-4 w-4 ${isDiscussionLiked ? 'fill-current' : ''}`} />
                <span>{discussionLikes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>{discussion.totalReplies} replies</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                onClick={handleShare}
              >
                <Share className="h-4 w-4" />
                Share
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 text-muted-foreground hover:text-destructive"
              onClick={() => handleReport()}
            >
              <Flag className="h-4 w-4" />
              Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Replies ({discussion.replies.length})</h3>
        
        {discussion.replies.map((reply) => (
          <Card key={reply.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <button
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    onClick={() => onViewUser(reply.author)}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={reply.authorAvatar} />
                      <AvatarFallback>{reply.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-medium text-sm">{reply.author}</p>
                      <p className="text-xs text-muted-foreground">{reply.timestamp}</p>
                    </div>
                  </button>
                </div>

                <p className="text-sm leading-relaxed pl-11">{reply.content}</p>

                <div className="flex items-center gap-2 pl-11">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikeReply(reply.id)}
                    className={`gap-1 text-xs ${replyLikes[reply.id]?.isLiked ? 'text-red-600 hover:text-red-700' : ''}`}
                  >
                    <ThumbsUp className={`h-3 w-3 ${replyLikes[reply.id]?.isLiked ? 'fill-current' : ''}`} />
                    <span>{replyLikes[reply.id]?.likes || reply.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(reply.id)}
                    className="gap-1 text-xs"
                  >
                    <Reply className="h-3 w-3" />
                    Reply
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 text-xs"
                    onClick={() => handleReport(reply.id)}
                  >
                    <Flag className="h-3 w-3" />
                    Report
                  </Button>
                </div>

                {/* Reply to reply form */}
                {replyingTo === reply.id && (
                  <div className="pl-11 pt-2 space-y-2">
                    <Textarea
                      placeholder={`Reply to ${reply.author}...`}
                      className="min-h-[80px]"
                    />
                    <div className="flex gap-2">
                      <Button size="sm">Reply</Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setReplyingTo(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Replies */}
      <div className="text-center">
        <Button variant="outline">
          Load More Replies
        </Button>
      </div>

      {/* Reply Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Join the Discussion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Share your thoughts on this discussion..."
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Be respectful and constructive in your responses
            </p>
            <Button onClick={handleSubmitReply} disabled={!newReply.trim()}>
              Post Reply
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-destructive" />
              Report {reportType === 'reply' ? 'Reply' : 'Discussion'}
            </DialogTitle>
            <DialogDescription>
              Help us maintain a safe and respectful community. Your report will be reviewed by our moderation team.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Why are you reporting this {reportType}?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Card 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    reportReason === 'spam' 
                      ? 'ring-2 ring-destructive bg-destructive/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setReportReason('spam')}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        reportReason === 'spam' 
                          ? 'bg-destructive/20 text-destructive' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <Zap className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm">Spam or promotional content</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">Unwanted advertising or repetitive content</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    reportReason === 'harassment' 
                      ? 'ring-2 ring-destructive bg-destructive/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setReportReason('harassment')}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        reportReason === 'harassment' 
                          ? 'bg-destructive/20 text-destructive' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <Shield className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm">Harassment or bullying</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">Targeting or attacking another user</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    reportReason === 'inappropriate' 
                      ? 'ring-2 ring-destructive bg-destructive/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setReportReason('inappropriate')}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        reportReason === 'inappropriate' 
                          ? 'bg-destructive/20 text-destructive' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm">Inappropriate or offensive content</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">Violates community guidelines</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    reportReason === 'misinformation' 
                      ? 'ring-2 ring-destructive bg-destructive/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setReportReason('misinformation')}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        reportReason === 'misinformation' 
                          ? 'bg-destructive/20 text-destructive' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm">False or misleading information</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">Spreads incorrect facts or claims</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    reportReason === 'copyright' 
                      ? 'ring-2 ring-destructive bg-destructive/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setReportReason('copyright')}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        reportReason === 'copyright' 
                          ? 'bg-destructive/20 text-destructive' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <Copyright className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm">Copyright violation</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">Uses copyrighted material without permission</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    reportReason === 'other' 
                      ? 'ring-2 ring-destructive bg-destructive/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setReportReason('other')}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        reportReason === 'other' 
                          ? 'bg-destructive/20 text-destructive' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <HelpCircle className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm">Other violation</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">Violates terms in another way</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <Label htmlFor="report-description" className="text-sm font-medium">
                Additional details (optional)
              </Label>
              <Textarea
                id="report-description"
                placeholder="Please provide any additional context that might help our moderation team..."
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                className="mt-2 min-h-[80px]"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {reportDescription.length}/500 characters
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsReportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleSubmitReport}
              disabled={!reportReason}
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}