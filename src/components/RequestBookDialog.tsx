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

interface RequestBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestBookDialog({ open, onOpenChange }: RequestBookDialogProps) {
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleSubmit = () => {
    if (!bookTitle.trim()) {
      toast.error("Please enter a book title");
      return;
    }

    if (!author.trim()) {
      toast.error("Please enter an author name");
      return;
    }

    // Simulate request submission
    toast.success("Book request submitted successfully!");
    
    // Reset form and close dialog
    setBookTitle("");
    setAuthor("");
    setIsbn("");
    setAdditionalNotes("");
    onOpenChange(false);
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
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
