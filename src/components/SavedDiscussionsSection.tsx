import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-supabase';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { fetchSavedDiscussions, type Discussion } from '../lib/supabase-services';
import { MessageSquare, Clock, Bookmark } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SavedDiscussionsSectionProps {
  onViewDiscussion?: (discussionId: string) => void;
}

export function SavedDiscussionsSection({ onViewDiscussion }: SavedDiscussionsSectionProps) {
  const { user } = useAuth();
  const [savedDiscussions, setSavedDiscussions] = useState<Discussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedDiscussions();
  }, [user?.id]);

  const loadSavedDiscussions = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const discussions = await fetchSavedDiscussions(user.id);
      setSavedDiscussions(discussions);
    } catch (error) {
      console.error('Error loading saved discussions:', error);
      toast.error('Failed to load saved discussions');
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl flex items-center gap-2">
          <div className="w-1 h-8 bg-primary rounded-full" />
          Saved Discussions
        </h2>
        <Badge variant="secondary">{savedDiscussions.length}</Badge>
      </div>
      
      {isLoading ? (
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3" />
          <p className="text-muted-foreground">Loading saved discussions...</p>
        </Card>
      ) : savedDiscussions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedDiscussions.map((discussion) => (
            <Card 
              key={discussion.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onViewDiscussion?.(discussion.id)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {discussion.bookCover && (
                    <div className="flex-shrink-0">
                      <img
                        src={discussion.bookCover}
                        alt={discussion.bookTitle || 'Book cover'}
                        className="w-16 h-24 object-cover rounded shadow-sm"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium line-clamp-2 text-sm">{discussion.title}</h3>
                      <Bookmark className="w-4 h-4 text-primary flex-shrink-0 fill-current" />
                    </div>
                    
                    {discussion.bookTitle && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        About: {discussion.bookTitle}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={discussion.userAvatar} />
                        <AvatarFallback className="text-xs">{discussion.userName[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground truncate">{discussion.userName}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{discussion.replyCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{getTimeAgo(discussion.createdAt)}</span>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      {discussion.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Bookmark className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">No saved discussions yet</p>
          <p className="text-sm text-muted-foreground mt-2">Save interesting discussions from the Community page!</p>
        </Card>
      )}
    </div>
  );
}
