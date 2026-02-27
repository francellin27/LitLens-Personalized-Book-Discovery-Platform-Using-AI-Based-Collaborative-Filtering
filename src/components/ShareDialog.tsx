import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner@2.0.3";
import { copyToClipboard } from "../utils/clipboard";
import {
  Link,
  Mail,
  MessageCircle,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Check,
  Copy
} from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  url: string;
  description?: string;
}

export function ShareDialog({ 
  open, 
  onOpenChange, 
  title, 
  url,
  description 
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopyLink = async () => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy link");
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || title);

  const shareOptions = [
    {
      name: "Twitter",
      icon: Twitter,
      color: "hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-200 dark:hover:border-blue-800",
      iconColor: "text-blue-500",
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
          '_blank',
          'width=600,height=400'
        );
      }
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-200 dark:hover:border-blue-800",
      iconColor: "text-blue-600",
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          '_blank',
          'width=600,height=400'
        );
      }
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-200 dark:hover:border-blue-800",
      iconColor: "text-blue-700",
      action: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
          '_blank',
          'width=600,height=400'
        );
      }
    },
    {
      name: "Email",
      icon: Mail,
      color: "hover:bg-gray-50 dark:hover:bg-gray-950/20 hover:border-gray-200 dark:hover:border-gray-800",
      iconColor: "text-gray-600 dark:text-gray-400",
      action: () => {
        window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;
      }
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-200 dark:hover:border-green-800",
      iconColor: "text-green-600",
      action: () => {
        window.open(
          `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
          '_blank',
          'width=600,height=400'
        );
      }
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Share Discussion
          </DialogTitle>
          <DialogDescription>
            Share this discussion with your friends and reading community
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Copy Link Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Copy Link
            </label>
            <div className="flex gap-2">
              <Input
                value={url}
                readOnly
                className="flex-1 bg-muted/50"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                onClick={handleCopyLink}
                variant={copied ? "default" : "outline"}
                size="icon"
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Share to Social Media */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
              Share via
            </label>
            <div className="grid grid-cols-5 gap-2">
              {shareOptions.map((option) => (
                <Button
                  key={option.name}
                  variant="outline"
                  className={`flex flex-col items-center gap-2 h-auto py-3 ${option.color}`}
                  onClick={option.action}
                >
                  <option.icon className={`h-5 w-5 ${option.iconColor}`} />
                  <span className="text-xs">{option.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Native Share API (Mobile) */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={async () => {
                try {
                  await navigator.share({
                    title: title,
                    text: description || title,
                    url: url,
                  });
                  toast.success("Shared successfully!");
                } catch (error) {
                  // User cancelled or error occurred
                  console.log('Share cancelled or failed:', error);
                }
              }}
            >
              <Share2 className="h-4 w-4" />
              More Share Options
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
