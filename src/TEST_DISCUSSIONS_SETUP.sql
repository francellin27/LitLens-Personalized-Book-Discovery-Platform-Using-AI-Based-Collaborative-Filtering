-- ============================================
-- TEST: Verify Discussions Tables Setup
-- ============================================
-- Run this in Supabase SQL Editor to check if everything is set up correctly

-- 1. Check if tables exist
SELECT 
  'Tables Exist' as test_category,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'discussions'
    ) THEN '✅ discussions table exists'
    ELSE '❌ discussions table MISSING - Run migration!'
  END as discussions_table,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'discussion_replies'
    ) THEN '✅ discussion_replies table exists'
    ELSE '❌ discussion_replies table MISSING - Run migration!'
  END as replies_table;

-- 2. Check columns in discussions table
SELECT 
  'Discussions Columns' as test_category,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'discussions'
ORDER BY ordinal_position;

-- 3. Check columns in discussion_replies table
SELECT 
  'Discussion Replies Columns' as test_category,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'discussion_replies'
ORDER BY ordinal_position;

-- 4. Check foreign key relationships
SELECT 
  'Foreign Keys' as test_category,
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('discussions', 'discussion_replies')
ORDER BY tc.table_name, tc.constraint_name;

-- 5. Check indexes
SELECT 
  'Indexes' as test_category,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('discussions', 'discussion_replies')
ORDER BY tablename, indexname;

-- 6. Check RLS (Row Level Security) is enabled
SELECT 
  'Row Level Security' as test_category,
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ RLS Enabled'
    ELSE '❌ RLS Disabled'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('discussions', 'discussion_replies');

-- 7. Check RLS policies
SELECT 
  'RLS Policies' as test_category,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('discussions', 'discussion_replies')
ORDER BY tablename, policyname;

-- 8. Test basic insert (this will fail if you're not authenticated)
-- Uncomment to test:
/*
INSERT INTO discussions (user_id, title, content, category)
VALUES (
  auth.uid(),  -- Your user ID
  'Test Discussion',
  'This is a test discussion to verify the setup works.',
  'general'
)
RETURNING *;
*/

-- 9. Count existing data
SELECT 
  'Data Count' as test_category,
  (SELECT COUNT(*) FROM discussions) as discussions_count,
  (SELECT COUNT(*) FROM discussion_replies) as replies_count;

-- ============================================
-- EXPECTED RESULTS:
-- ============================================
-- ✅ Both tables should exist
-- ✅ discussions should have 8 columns (id, user_id, title, content, category, book_id, created_at, updated_at)
-- ✅ discussion_replies should have 5 columns (id, discussion_id, user_id, content, created_at, updated_at)
-- ✅ Foreign keys should point to profiles and books
-- ✅ Multiple indexes should exist for performance
-- ✅ RLS should be enabled on both tables
-- ✅ Multiple policies should exist for each table
-- ============================================
