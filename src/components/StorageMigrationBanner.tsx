import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Database, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabase/client';

export function StorageMigrationBanner() {
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runMigration = async () => {
    setIsRunning(true);
    setError(null);

    try {
      // Check if bucket already exists
      const { data: buckets, error: listError } = await supabase
        .storage
        .listBuckets();

      if (listError) {
        throw new Error(`Failed to list buckets: ${listError.message}`);
      }

      const bucketExists = buckets?.some(bucket => bucket.id === 'profile-photos');

      if (!bucketExists) {
        // Create the bucket
        const { data, error: createError } = await supabase
          .storage
          .createBucket('profile-photos', {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
          });

        if (createError) {
          throw new Error(`Failed to create bucket: ${createError.message}`);
        }

        console.log('Profile photos bucket created successfully');
      } else {
        console.log('Profile photos bucket already exists');
      }

      setIsComplete(true);
      setTimeout(() => {
        // Hide banner after success
        localStorage.setItem('storage-migration-complete', 'true');
      }, 2000);
    } catch (err: any) {
      console.error('Migration error:', err);
      setError(err.message || 'Failed to set up storage. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  // Don't show if already complete
  if (localStorage.getItem('storage-migration-complete') === 'true' || isComplete) {
    return null;
  }

  return (
    <Alert variant={error ? 'destructive' : 'default'} className="mb-4">
      <Database className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        {isComplete ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Storage Setup Complete!
          </>
        ) : error ? (
          <>
            <AlertCircle className="h-4 w-4" />
            Storage Setup Error
          </>
        ) : (
          'Storage Setup Required'
        )}
      </AlertTitle>
      <AlertDescription className="mt-2">
        {isComplete ? (
          <p>Profile photo uploads are now enabled. You can upload your profile picture!</p>
        ) : error ? (
          <div className="space-y-2">
            <p>{error}</p>
            <p className="text-sm">
              Please ensure you have the necessary permissions in your Supabase project.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p>
              Profile photo uploads require a storage bucket. Click below to set up the storage automatically.
            </p>
            <Button
              onClick={runMigration}
              disabled={isRunning}
              variant={error ? 'destructive' : 'default'}
              size="sm"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up storage...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Setup Storage Now
                </>
              )}
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
