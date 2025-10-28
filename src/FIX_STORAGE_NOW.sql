-- Quick Fix for Profile Photo Storage
-- Run this in Supabase SQL Editor

-- Step 1: Ensure the bucket exists (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'litlens-profile-photos',
  'litlens-profile-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Step 2: Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Give users access to upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to delete avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;

-- Step 3: Create simple, permissive policies for testing
-- Policy 1: Public read access
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'litlens-profile-photos');

-- Policy 2: Authenticated users can upload
CREATE POLICY "Give users access to upload avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'litlens-profile-photos');

-- Policy 3: Authenticated users can update
CREATE POLICY "Give users access to update avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'litlens-profile-photos')
WITH CHECK (bucket_id = 'litlens-profile-photos');

-- Policy 4: Authenticated users can delete
CREATE POLICY "Give users access to delete avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'litlens-profile-photos');

-- Verify setup
SELECT 
  'Bucket Check' as test,
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'litlens-profile-photos';

-- Verify policies
SELECT 
  'Policy Check' as test,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage'
  AND policyname LIKE '%avatar%';
