import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../lib/auth-supabase";
import { createBookRequest } from "../lib/supabase-services";

interface RequestBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestBookDialog({ open, onOpenChange }: RequestBookDialogProps) {
  const { user } = useAuth();
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to request a book");
      return;
    }

    if (!bookTitle.trim()) {
      toast.error("Please enter a book title");
      return;
    }

    if (!author.trim()) {
      toast.error("Please enter an author name");
      return;
    }

    setIsSubmitting(true);

    try {
      const request = await createBookRequest(
        user.id,
        bookTitle.trim(),
        author.trim(),
        isbn.trim() || undefined,
        additionalNotes.trim() || undefined
      );

      if (request) {
        toast.success("Book request submitted successfully! We'll review it soon.");
        
        // Reset form and close dialog
        setBookTitle("");
        setAuthor("");
        setIsbn("");
        setAdditionalNotes("");
        onOpenChange(false);
      } else {
        toast.error("Failed to submit book request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting book request:", error);
      toast.error("Failed to submit book request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setBookTitle("");
    setAuthor("");
    setIsbn("");
    setAdditionalNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request a Book</DialogTitle>
          <DialogDescription>
            Can't find a book you're looking for? Let us know and we'll consider adding it to our collection.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="book-title">Book Title *</Label>
            <Input
              id="book-title"
              placeholder="Enter the book title"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              placeholder="Enter the author's name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN (Optional)</Label>
            <Input
              id="isbn"
              placeholder="Enter ISBN if known"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information that might help us find this book..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {additionalNotes.length}/500 characters
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
