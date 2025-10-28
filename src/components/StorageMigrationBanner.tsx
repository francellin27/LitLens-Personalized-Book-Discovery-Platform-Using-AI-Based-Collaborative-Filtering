import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Database, AlertCircle, CheckCircle2, X, ExternalLink } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { copyToClipboard } from '../utils/clipboard';

export function StorageMigrationBanner() {
  const [isChecking, setIsChecking] = useState(false);
  const [bucketExists, setBucketExists] = useState<boolean | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const checkBucket = async () => {
    setIsChecking(true);
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error checking buckets:', error);
        setBucketExists(false);
        return;
      }

      const exists = buckets?.some(bucket => bucket.id === 'litlens-profile-photos');
      setBucketExists(exists);
      
      if (exists) {
        // LitLens bucket exists, save to localStorage
        localStorage.setItem('storage-migration-complete', 'true');
      }
    } catch (err) {
      console.error('Error checking storage:', err);
      setBucketExists(false);
    } finally {
      setIsChecking(false);
    }
  };

  // Auto-check on mount
  useEffect(() => {
    if (localStorage.getItem('storage-migration-complete') !== 'true') {
      checkBucket();
    }
  }, []);

  // Don't show if already complete or dismissed
  if (localStorage.getItem('storage-migration-complete') === 'true' || isDismissed) {
    return null;
  }

  // Don't show if bucket exists
  if (bucketExists === true) {
    return null;
  }

  const sqlScript = `-- ==========================================
-- FIX: LitLens Profile Photos Storage
-- ==========================================
-- Run this in Supabase SQL Editor to enable profile photo uploads

-- Create the LitLens storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('litlens-profile-photos', 'litlens-profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies (clean slate)
DROP POLICY IF EXISTS "Users can upload their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload profile photos" ON storage.objects;
DROP POLICY IF EXISTS "LitLens: Users can upload profile photos" ON storage.objects;
DROP POLICY IF EXISTS "LitLens: Public read access to profile photos" ON storage.objects;
DROP POLICY IF EXISTS "LitLens: Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "LitLens: Users can delete their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to delete avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- Create simple, permissive policies that WORK
CREATE POLICY "Give users access to upload avatars"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'litlens-profile-photos');

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'litlens-profile-photos');

CREATE POLICY "Give users access to update avatars"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'litlens-profile-photos')
WITH CHECK (bucket_id = 'litlens-profile-photos');

CREATE POLICY "Give users access to delete avatars"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'litlens-profile-photos');

-- ==========================================
-- Done! Profile photo uploads enabled
-- ==========================================`;

  const handleCopyToClipboard = async () => {
    const success = await copyToClipboard(sqlScript);
    if (success) {
      alert('✅ SQL script copied to clipboard! Paste it in the Supabase SQL Editor.');
    } else {
      alert('❌ Failed to copy. Please manually select and copy the SQL script from the documentation files.');
    }
  };

  return (
    <Alert className="mb-4 relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0"
        onClick={() => setIsDismissed(true)}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <Database className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2 pr-8">
        {bucketExists === false ? (
          <>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            Profile Photo Storage Setup Required
          </>
        ) : (
          'Storage Setup'
        )}
      </AlertTitle>
      <AlertDescription className="mt-2">
        {bucketExists === false ? (
          <div className="space-y-3">
            <p>
              Profile photo uploads require a storage bucket in Supabase. 
              Follow these steps to enable this feature:
            </p>
            
            <div className="space-y-2">
              <Button
                onClick={() => setShowInstructions(!showInstructions)}
                variant="outline"
                size="sm"
              >
                {showInstructions ? 'Hide Instructions' : 'Show Setup Instructions'}
              </Button>
              
              {showInstructions && (
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Step 1: Open Supabase SQL Editor</h4>
                    <p className="text-muted-foreground">
                      Go to your Supabase dashboard → SQL Editor → New Query
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Step 2: Copy and Run the SQL Script</h4>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCopyToClipboard}
                        variant="secondary"
                        size="sm"
                      >
                        Copy SQL Script
                      </Button>
                      <a
                        href="https://supabase.com/dashboard/project/_/sql"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="secondary" size="sm">
                          Open SQL Editor
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </Button>
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Step 3: Verify Setup</h4>
                    <p className="text-muted-foreground mb-2">
                      After running the script, click the button below to check if it worked:
                    </p>
                    <Button
                      onClick={checkBucket}
                      disabled={isChecking}
                      size="sm"
                    >
                      {isChecking ? 'Checking...' : 'Verify Setup'}
                    </Button>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-muted-foreground">
                      💡 Need more help? See{' '}
                      <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded">
                        PROFILE_PHOTO_UPLOAD_FIX.md
                      </code>{' '}
                      in your project files for detailed instructions.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p>Checking storage setup...</p>
            <Button
              onClick={checkBucket}
              disabled={isChecking}
              variant="outline"
              size="sm"
            >
              {isChecking ? 'Checking...' : 'Check Again'}
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
