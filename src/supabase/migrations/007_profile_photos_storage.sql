-- Migration 007: Profile Photos Storage Setup
-- This migration creates the storage bucket and RLS policies for profile photos

-- Step 1: Create the LitLens storage bucket for profile photos
-- NOTE: This INSERT might fail if the bucket already exists, which is fine
INSERT INTO storage.buckets (id, name, public)
VALUES ('litlens-profile-photos', 'litlens-profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies if they exist (to avoid conflicts)
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

-- Step 4: Create new, simplified RLS policies

-- Policy 1: Allow authenticated users to upload profile photos
-- Simple policy - any authenticated user can upload to this bucket
CREATE POLICY "Give users access to upload avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'litlens-profile-photos'
);

-- Policy 2: Allow public read access to all profile photos
-- Anyone can view profile photos (necessary for avatars to display)
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'litlens-profile-photos'
);

-- Policy 3: Allow authenticated users to update profile photos
-- Simple policy - any authenticated user can update files in this bucket
CREATE POLICY "Give users access to update avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'litlens-profile-photos'
)
WITH CHECK (
  bucket_id = 'litlens-profile-photos'
);

-- Policy 4: Allow authenticated users to delete profile photos
-- Simple policy - any authenticated user can delete files in this bucket
CREATE POLICY "Give users access to delete avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'litlens-profile-photos'
);

-- Step 5: Verify the setup
-- You can run these queries to verify the bucket and policies are created:
-- SELECT * FROM storage.buckets WHERE id = 'litlens-profile-photos';
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname LIKE 'LitLens:%';
