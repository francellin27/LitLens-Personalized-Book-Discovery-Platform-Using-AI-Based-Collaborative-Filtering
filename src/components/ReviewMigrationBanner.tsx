import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { supabase } from '../utils/supabase/client';

export function ReviewMigrationBanner() {
  const [show, setShow] = useState(false);
  const [migrationNeeded, setMigrationNeeded] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkMigrationStatus();
  }, []);

  const checkMigrationStatus = async () => {
    try {
      setChecking(true);
      
      // Try to insert a review with null title to test if migration is needed
      // We'll use a test query that won't actually insert anything
      const { error } = await supabase
        .from('reviews')
        .select('title')
        .limit(1);

      if (error) {
        console.error('Error checking migration status:', error);
        setMigrationNeeded(false);
        setShow(false);
        return;
      }

      // Check column metadata to see if title is nullable
      const { data: columnInfo, error: columnError } = await supabase
        .rpc('get_column_info', { 
          table_name: 'reviews',
          column_name: 'title' 
        })
        .single();

      if (columnError) {
        // RPC function doesn't exist, we can't check automatically
        // Show banner by default for safety
        setMigrationNeeded(true);
        setShow(true);
      } else {
        // Check if title is nullable
        const isNullable = columnInfo?.is_nullable === 'YES';
        setMigrationNeeded(!isNullable);
        setShow(!isNullable);
      }
    } catch (error) {
      console.error('Error checking migration status:', error);
      // Show banner on error to be safe
      setMigrationNeeded(true);
      setShow(true);
    } finally {
      setChecking(false);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('review_migration_banner_dismissed', 'true');
  };

  if (!show || checking) {
    return null;
  }

  if (migrationNeeded) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-background">
        <Alert variant="destructive" className="max-w-5xl mx-auto">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="flex items-center justify-between">
            <span>Database Migration Required</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>
              The review submission feature requires a database migration to work properly.
              The <code className="bg-muted px-1 py-0.5 rounded">reviews.title</code> column
              needs to be made optional.
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant="default"
                onClick={() => window.open('/FIX_REVIEW_SUBMIT.md', '_blank')}
              >
                View Fix Instructions
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDismiss}
              >
                Dismiss
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-background">
      <Alert className="max-w-5xl mx-auto border-green-500 bg-green-50">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <AlertTitle className="flex items-center justify-between text-green-800">
          <span>Migration Complete ✓</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertTitle>
        <AlertDescription className="text-green-700">
          The review system is properly configured. You can now submit reviews with or without titles.
        </AlertDescription>
      </Alert>
    </div>
  );
}
