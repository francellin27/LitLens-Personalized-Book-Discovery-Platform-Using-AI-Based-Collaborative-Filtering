-- Verification Script for LitLens Profile Photos Storage Setup
-- Run this in Supabase SQL Editor to verify everything is set up correctly

-- ==========================================
-- 1. Check if the LitLens bucket exists
-- ==========================================
SELECT 
  id,
  name,
  public,
  created_at
FROM storage.buckets 
WHERE id = 'litlens-profile-photos';

-- Expected result: One row showing the 'litlens-profile-photos' bucket with public = true
-- If no rows: The bucket doesn't exist. Run the migration script first!

-- ==========================================
-- 2. Check RLS policies on storage.objects
-- ==========================================
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN roles = '{authenticated}' THEN 'authenticated'
    WHEN roles = '{public}' THEN 'public'
    ELSE roles::text
  END as role
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE 'LitLens:%'
ORDER BY cmd;

-- Expected result: 4 policies
--   1. "LitLens: Users can upload profile photos" - INSERT - authenticated
--   2. "LitLens: Public read access to profile photos" - SELECT - public
--   3. "LitLens: Users can update their own profile photos" - UPDATE - authenticated
--   4. "LitLens: Users can delete their own profile photos" - DELETE - authenticated
-- 
-- If fewer than 4 policies: Run the migration script to create the missing policies

-- ==========================================
-- 3. Test bucket accessibility
-- ==========================================
-- This checks if the bucket is publicly readable
SELECT 
  bucket_id,
  name,
  created_at
FROM storage.objects
WHERE bucket_id = 'litlens-profile-photos'
ORDER BY created_at DESC
LIMIT 10;

-- Expected result: Either empty (no files uploaded yet) or a list of uploaded files
-- If error: There's an RLS issue. Re-run the migration script

-- ==========================================
-- 4. Check bucket configuration details
-- ==========================================
SELECT 
  id,
  name,
  owner,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at,
  updated_at
FROM storage.buckets 
WHERE id = 'litlens-profile-photos';

-- Expected result:
--   id: litlens-profile-photos
--   name: litlens-profile-photos
--   public: true
--   file_size_limit: null (or a specific value)
--   allowed_mime_types: null (validated in app code instead)

-- ==========================================
-- 5. Verify your authentication (optional)
-- ==========================================
SELECT 
  auth.uid() as my_user_id,
  auth.jwt() IS NOT NULL as am_i_authenticated;

-- Expected result: 
--   my_user_id: Your user UUID (if logged in) or NULL (if not)
--   am_i_authenticated: true (if logged in) or false (if not)
-- 
-- Note: If you're running this in the SQL Editor, auth.uid() will be NULL
-- because SQL Editor doesn't use your app's authentication context

-- ==========================================
-- 6. Count existing profile photos
-- ==========================================
SELECT 
  COUNT(*) as total_profile_photos,
  COUNT(DISTINCT(storage.foldername(name))[1]) as folders
FROM storage.objects
WHERE bucket_id = 'litlens-profile-photos';

-- Expected result: Shows how many photos are uploaded and how many folders exist
-- If count > 0: Photos have been uploaded successfully!

-- ==========================================
-- SUMMARY
-- ==========================================
-- ✅ Bucket 'litlens-profile-photos' should exist and be public
-- ✅ 4 RLS policies with prefix 'LitLens:' should be present
-- ✅ No errors when querying storage.objects

-- If all checks pass, profile photo uploads should work!
-- If any check fails, run the migration script from:
--   /supabase/migrations/007_profile_photos_storage.sql
-- Or copy the script from:
--   /SETUP_LITLENS_STORAGE.md
