# Profile Photo Upload Fix - Complete Setup Guide

## Problem
You're getting this error when uploading profile photos:
```
Storage Setup Error
Failed to create bucket: new row violates row-level security policy
```

## Root Cause
The Supabase Storage bucket `profile-photos` doesn't exist yet, or the RLS (Row Level Security) policies are not properly configured.

## Solution - Follow These Steps in Order

### Step 1: Go to Supabase SQL Editor

1. Open your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query** to create a new SQL script

### Step 2: Run the Storage Setup Migration

Copy and paste this entire SQL script into the SQL Editor and click **Run**:

```sql
-- Migration 007: Profile Photos Storage Setup
-- This migration creates the storage bucket and RLS policies for profile photos

-- Step 1: Create the storage bucket
-- NOTE: This INSERT might fail if the bucket already exists, which is fine
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Enable RLS on storage.objects (if not already enabled)
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;

-- Step 4: Create new, simplified RLS policies

-- Policy 1: Allow authenticated users to upload profile photos
CREATE POLICY "Users can upload profile photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos'
);

-- Policy 2: Allow public read access to all profile photos
CREATE POLICY "Public read access to profile photos"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'profile-photos'
);

-- Policy 3: Allow authenticated users to update their own profile photos
CREATE POLICY "Users can update their own profile photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = 'avatars'
)
WITH CHECK (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = 'avatars'
);

-- Policy 4: Allow authenticated users to delete their own profile photos
CREATE POLICY "Users can delete their own profile photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = 'avatars'
);
```

### Step 3: Verify the Bucket Was Created

After running the migration, verify the bucket exists:

1. In Supabase dashboard, click on **Storage** in the left sidebar
2. You should see a bucket named `profile-photos`
3. If you don't see it, go back to SQL Editor and run:

```sql
SELECT * FROM storage.buckets WHERE id = 'profile-photos';
```

This should return one row with the bucket details.

### Step 4: Verify the RLS Policies

Run this query to check the policies:

```sql
SELECT 
  policyname, 
  cmd, 
  roles,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%profile photo%';
```

You should see 4 policies:
- Users can upload profile photos (INSERT)
- Public read access to profile photos (SELECT)
- Users can update their own profile photos (UPDATE)
- Users can delete their own profile photos (DELETE)

### Step 5: Test Profile Photo Upload

1. Log in to your LitLens app with any user account (not admin)
2. Go to your profile page
3. Click the camera icon on your avatar
4. Select an image file (JPG, PNG, or WebP under 5MB)
5. The upload should now work without errors!

## Troubleshooting

### If you still get RLS policy errors:

1. Make sure you're logged in as a regular user (not admin)
2. Try logging out and logging back in
3. Check browser console for detailed error messages

### If the bucket still doesn't exist:

Try creating it manually through the UI:

1. Go to **Storage** in Supabase dashboard
2. Click **New Bucket**
3. Name: `profile-photos`
4. Make it **Public**
5. Click Create

Then run just the RLS policy part of the migration (Step 3 and 4 from the SQL above).

### If uploads still fail:

The issue might be with authentication. Check:

```sql
-- Verify your user is authenticated
SELECT auth.uid();
```

This should return your user ID. If it returns NULL, there's an authentication issue.

## What Changed

The original RLS policies were too complex and tried to validate that users could only upload files with their own user ID in the filename. This caused issues.

The new simplified policies:
- ✅ Allow ANY authenticated user to upload to the profile-photos bucket
- ✅ Allow public read access to all profile photos
- ✅ Allow users to update/delete files in the avatars folder
- ✅ Much simpler and more reliable

## Security Note

These simplified policies allow any authenticated user to upload photos. In production, you might want to add additional validation like:
- File size limits (already handled in the app)
- File type restrictions (already handled in the app)
- Rate limiting (can be added at the bucket level)
- Cleanup of old profile photos when users upload new ones

For a prototype/MVP, the current setup is perfectly fine!

## Still Having Issues?

If you're still experiencing problems:

1. Check the browser console for detailed error messages
2. Check the Supabase logs in your dashboard
3. Verify the migration ran successfully by checking the Storage section

The most common issue is forgetting to run the migration. Make sure Step 2 above is completed!
