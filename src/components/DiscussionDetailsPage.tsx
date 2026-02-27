import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-supabase';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  ArrowLeft,
  MessageSquare,
  Heart,
  Share,
  Bookmark,
  Flag,
  Clock,
  Send,
  ThumbsUp,
  Zap,
  Shield,
  AlertTriangle,
  FileText,
  Copyright,
  HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ShareDialog } from './ShareDialog';
import { Book } from "../lib/bookData";
import { 
  fetchDiscussionById, 
  fetchDiscussionReplies, 
  createDiscussionReply,
  createDiscussionReport,
  saveDiscussion,
  unsaveDiscussion,
  checkIfDiscussionSaved,
  type Discussion,
  type DiscussionReply as SupabaseDiscussionReply,
  type DiscussionReport
} from "../lib/supabase-services";

interface DiscussionDetailsPageProps {
  discussionId: string;
  onBack: () => void;
  onBookSelect: (book: Book) => void;
  onViewUser: (userId: string) => void;
}

export function DiscussionDetailsPage({ 
  discussionId, 
  onBack, 
  onBookSelect, 
  onViewUser 
}: DiscussionDetailsPageProps) {
  const { user } = useAuth();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [replies, setReplies] = useState<SupabaseDiscussionReply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newReply, setNewReply] = useState("");
  const [isDiscussionLiked, setIsDiscussionLiked] = useState(false);
  const [isDiscussionSaved, setIsDiscussionSaved] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [reportType, setReportType] = useState<"discussion" | "reply">("discussion");
  const [reportedItemId, setReportedItemId] = useState<string>("");
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  // Load discussion and replies
  useEffect(() => {
    loadDiscussion();
  }, [discussionId]);

  // Check if discussion is saved
  useEffect(() => {
    if (user && discussionId) {
      checkSavedStatus();
    }
  }, [user, discussionId]);

  const checkSavedStatus = async () => {
    if (!user) return;
    const isSaved = await checkIfDiscussionSaved(user.id, discussionId);
    setIsDiscussionSaved(isSaved);
  };

  const loadDiscussion = async () => {
    setIsLoading(true);
    try {
      const [discussionData, repliesData] = await Promise.all([
        fetchDiscussionById(discussionId),
        fetchDiscussionReplies(discussionId)
      ]);

      if (discussionData) {
        setDiscussion(discussionData);
      } else {
        toast.error("Discussion not found");
        onBack();
      }

      setReplies(repliesData);
    } catch (error) {
      console.error("Error loading discussion:", error);
      toast.error("Failed to load discussion");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle interactions
  const handleLikeDiscussion = () => {
    // TODO: Implement like functionality with Supabase
    const newLikedState = !isDiscussionLiked;
    setIsDiscussionLiked(newLikedState);
    toast.success(newLikedState ? "Discussion liked!" : "Discussion unliked");
  };

  const handleLikeReply = (replyId: string) => {
    // TODO: Implement like functionality with Supabase
    toast.success("Reply liked!");
  };

  const handleShare = () => {
    setIsShareDialogOpen(true);
  };

  const handleSaveDiscussion = async () => {
    if (!user) {
      toast.error("Please log in to save discussions");
      return;
    }

    try {
      if (isDiscussionSaved) {
        // Unsave
        const success = await unsaveDiscussion(user.id, discussionId);
        if (success) {
          setIsDiscussionSaved(false);
          toast.success("Discussion removed from saved items");
        } else {
          toast.error("Failed to unsave discussion");
        }
      } else {
        // Save
        const success = await saveDiscussion(user.id, discussionId);
        if (success) {
          setIsDiscussionSaved(true);
          toast.success("Discussion saved!");
        } else {
          toast.error("Failed to save discussion");
        }
      }
    } catch (error) {
      console.error("Error toggling save discussion:", error);
      toast.error("Failed to update saved status");
    }
  };

  const handleReport = (replyId?: string) => {
    setReportType(replyId ? 'reply' : 'discussion');
    setReportedItemId(replyId || discussionId);
    setReportReason("");
    setReportDescription("");
    setIsReportDialogOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!reportReason) {
      toast.error("Please select a reason for reporting");
      return;
    }

    if (!user || !discussion) {
      toast.error("You must be logged in to report content");
      return;
    }

    try {
      console.log('📝 Submitting report...', {
        discussionId: discussion.id,
        userId: user.id,
        userName: user.name || user.email || 'Anonymous',
        discussionTitle: discussion.title,
        reportType: reportType,
        reportReason: reportReason
      });

      // Map the report reason to match the database enum
      const reasonMap: { [key: string]: DiscussionReport['reason'] } = {
        'spam': 'Spam/Promotional',
        'harassment': 'Harassment',
        'inappropriate': 'Inappropriate Content',
        'misinformation': 'Misinformation',
        'copyright': 'Off-topic', // Map copyright to off-topic since it's not in DB enum
        'off-topic': 'Off-topic',
        'other': 'Other'
      };

      const mappedReason = reasonMap[reportReason] || 'Other';
      console.log('📋 Mapped reason:', mappedReason);

      const report = await createDiscussionReport(
        discussion.id,
        user.id,
        user.name || user.email || 'Anonymous',
        discussion.title,
        reportType === 'discussion' ? 'Discussion' : 'Reply',
        discussion.userName,
        mappedReason,
        reportDescription || undefined
      );

      console.log('✅ Report created:', report);

      if (report) {
        toast.success(`${reportType === 'reply' ? 'Reply' : 'Discussion'} reported successfully. Thank you for helping keep our community safe.`);
        
        // Reset and close dialog
        setIsReportDialogOpen(false);
        setReportReason("");
        setReportDescription("");
      } else {
        console.error('❌ Report creation returned null');
        toast.error("Failed to submit report. Please try again.");
      }
    } catch (error) {
      console.error('❌ Error submitting report:', error);
      toast.error("Failed to submit report. Please try again.");
    }
  };

  const handleSubmitReply = async () => {
    if (!newReply.trim() || !user || !discussion) {
      toast.error("Please enter a reply");
      return;
    }

    try {
      const reply = await createDiscussionReply(discussionId, user.id, newReply);
      if (reply) {
        toast.success("Reply posted successfully!");
        setNewReply("");
        // Reload replies
        await loadDiscussion();
      } else {
        toast.error("Failed to post reply");
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error("Failed to post reply");
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading discussion...</p>
        </div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">Discussion not found</p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Community
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      {/* Hero Section with Book Cover Background */}
      <div className="relative w-full bg-gradient-to-b from-primary/5 via-background to-background border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 mb-6 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Community
          </Button>

          {/* Category & Popular Badge */}
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="outline" className="text-sm px-3 py-1">
              {discussion.category}
            </Badge>
            {discussion.replyCount >= 20 && (
              <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                <MessageSquare className="h-3.5 w-3.5" />
                Popular Discussion
              </Badge>
            )}
          </div>

          {/* Discussion Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {discussion.title}
          </h1>

          {/* Book Info Banner (if linked to a book) */}
          {discussion.bookTitle && discussion.bookCover && (
            <div className="flex items-center gap-4 p-4 rounded-lg bg-card border mb-6 hover:shadow-md transition-shadow">
              <img
                src={discussion.bookCover}
                alt={discussion.bookTitle}
                className="w-16 h-24 object-cover rounded shadow-sm flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1">Discussing</p>
                <p className="font-medium text-lg line-clamp-2">{discussion.bookTitle}</p>
              </div>
            </div>
          )}

          {/* Author Info & Meta */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              onClick={() => onViewUser(discussion.userId)}
              className="flex items-center gap-3 group"
            >
              <Avatar className="w-12 h-12 ring-2 ring-background shadow-sm">
                <AvatarImage src={discussion.userAvatar} />
                <AvatarFallback>{discussion.userName[0]}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="font-medium group-hover:text-primary transition-colors">
                  {discussion.userName}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {getTimeAgo(discussion.createdAt)}
                </p>
              </div>
            </button>

            <Separator orientation="vertical" className="h-10 hidden sm:block" />

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>{discussion.replyCount} {discussion.replyCount === 1 ? 'reply' : 'replies'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Discussion Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
                {discussion.content}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 py-6 border-y">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikeDiscussion}
                className={`gap-2 ${isDiscussionLiked ? 'text-red-600 hover:text-red-700' : ''}`}
              >
                <Heart className={`h-4 w-4 ${isDiscussionLiked ? 'fill-current' : ''}`} />
                Like
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
              <Button 
                variant="ghost" 
                size="sm" 
                className={`gap-2 ${isDiscussionSaved ? 'text-primary' : ''}`}
                onClick={handleSaveDiscussion}
              >
                <Bookmark className={`h-4 w-4 ${isDiscussionSaved ? 'fill-current' : ''}`} />
                {isDiscussionSaved ? 'Saved' : 'Save'}
              </Button>
              <div className="flex-1"></div>
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

            {/* Replies Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
                </h2>
              </div>

              {/* Reply Input */}
              {user && (
                <Card className="border-2 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <Textarea
                          placeholder="Share your thoughts on this discussion..."
                          value={newReply}
                          onChange={(e) => setNewReply(e.target.value)}
                          className="min-h-[100px] resize-none"
                        />
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            Be respectful and constructive
                          </p>
                          <Button 
                            onClick={handleSubmitReply} 
                            disabled={!newReply.trim()}
                            className="gap-2"
                          >
                            <Send className="h-4 w-4" />
                            Post Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Replies List */}
              <div className="space-y-4">
                {replies.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground text-lg mb-2">No replies yet</p>
                      <p className="text-sm text-muted-foreground">Be the first to share your thoughts!</p>
                    </CardContent>
                  </Card>
                ) : (
                  replies.map((reply) => (
                    <Card key={reply.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <button
                            onClick={() => onViewUser(reply.userId)}
                            className="flex-shrink-0"
                          >
                            <Avatar className="w-10 h-10 ring-2 ring-background">
                              <AvatarImage src={reply.userAvatar} />
                              <AvatarFallback>{reply.userName[0]}</AvatarFallback>
                            </Avatar>
                          </button>
                          
                          <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <button
                                onClick={() => onViewUser(reply.userId)}
                                className="hover:underline"
                              >
                                <p className="font-medium">{reply.userName}</p>
                              </button>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {getTimeAgo(reply.createdAt)}
                              </p>
                            </div>

                            <p className="text-base leading-relaxed whitespace-pre-wrap">
                              {reply.content}
                            </p>

                            <div className="flex items-center gap-2 pt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLikeReply(reply.id)}
                                className="gap-1.5 h-8 px-3"
                              >
                                <ThumbsUp className="h-3.5 w-3.5" />
                                Like
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="gap-1.5 h-8 px-3 text-muted-foreground hover:text-destructive"
                                onClick={() => handleReport(reply.id)}
                              >
                                <Flag className="h-3.5 w-3.5" />
                                Report
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* About this Discussion */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">About this Discussion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <Badge variant="outline" className="text-sm">
                    {discussion.category}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">{getTimeAgo(discussion.createdAt)}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Activity</p>
                  <div className="space-y-1 text-sm">
                    <p>{discussion.replyCount} {discussion.replyCount === 1 ? 'reply' : 'replies'}</p>
                  </div>
                </div>

                {discussion.replyCount >= 20 && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <MessageSquare className="h-4 w-4" />
                      <span className="font-medium">Popular Discussion</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>• Be respectful and kind to others</p>
                <p>• Stay on topic and relevant</p>
                <p>• No spam or self-promotion</p>
                <p>• Respect others' opinions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

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

      {/* Share Dialog */}
      <ShareDialog 
        open={isShareDialogOpen} 
        onOpenChange={setIsShareDialogOpen}
        title={discussion.title}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        description={`Join the discussion about "${discussion.title}" on LitLens`}
      />
    </div>
  );
}