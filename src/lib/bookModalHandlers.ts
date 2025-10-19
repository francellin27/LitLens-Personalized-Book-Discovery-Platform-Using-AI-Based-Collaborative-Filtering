import { toast } from 'sonner@2.0.3';
import { setUserBookStatus, logReadingDates } from './supabase-services';

export async function handleLogBookWithSupabase(
  user: any,
  book: any,
  startDate: Date,
  finishDate: Date | undefined | null,
  setIsReading: (value: boolean) => void,
  setIsCompleted: (value: boolean) => void,
): Promise<boolean> {
  if (!user?.id || !book?.id) {
    toast.error('Please log in to log books');
    return false;
  }

  // Check if book ID is a valid UUID (from database) or numeric ID (from mock data)
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(book.id);
  
  if (!isUUID) {
    // This is mock data, just show local feedback
    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    
    if (finishDate) {
      toast.success(`Logged "${book.title}" from ${formatDate(startDate)} to ${formatDate(finishDate)}`);
    } else {
      toast.success(`Started reading "${book.title}" on ${formatDate(startDate)}`);
    }
    return true;
  }

  try {
    // Determine the status based on whether finish date is provided
    const status = finishDate ? 'completed' : 'reading';
    
    // Update the book status in Supabase
    const success = await setUserBookStatus(user.id, book.id, status);
    
    if (success) {
      // Log the reading dates
      await logReadingDates(user.id, book.id, startDate, finishDate || null);
      
      // Update local state
      if (status === 'reading') {
        setIsReading(true);
        setIsCompleted(false);
      } else {
        setIsReading(false);
        setIsCompleted(true);
      }
      
      const formatDate = (date: Date) => date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      
      if (finishDate) {
        toast.success(`Logged "${book.title}" from ${formatDate(startDate)} to ${formatDate(finishDate)}`);
      } else {
        toast.success(`Started reading "${book.title}" on ${formatDate(startDate)}`);
      }
      
      return true;
    } else {
      toast.error('Failed to log book. Please try again.');
      return false;
    }
  } catch (error) {
    console.error('Error logging book:', error);
    toast.error('Failed to log book. Please try again.');
    return false;
  }
}
