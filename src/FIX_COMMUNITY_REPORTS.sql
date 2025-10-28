-- ============================================
-- Community Reports Quick Fix Script
-- ============================================
-- Run this if reports aren't showing up in admin panel

-- STEP 1: Ensure RLS is enabled (should already be from migration)
ALTER TABLE discussion_reports ENABLE ROW LEVEL SECURITY;

-- STEP 2: Drop and recreate all RLS policies (in case they're corrupted)

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own reports" ON discussion_reports;
DROP POLICY IF EXISTS "Users can create reports" ON discussion_reports;
DROP POLICY IF EXISTS "Admins can view all reports" ON discussion_reports;
DROP POLICY IF EXISTS "Admins can update reports" ON discussion_reports;
DROP POLICY IF EXISTS "Admins can delete reports" ON discussion_reports;

-- Recreate policies

-- Policy 1: Users can view their own reports
CREATE POLICY "Users can view their own reports"
  ON discussion_reports
  FOR SELECT
  USING (auth.uid() = reporter_id);

-- Policy 2: Users can create reports (authenticated users only)
CREATE POLICY "Users can create reports"
  ON discussion_reports
  FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Policy 3: Admins can view all reports
CREATE POLICY "Admins can view all reports"
  ON discussion_reports
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy 4: Admins can update reports
CREATE POLICY "Admins can update reports"
  ON discussion_reports
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy 5: Admins can delete reports
CREATE POLICY "Admins can delete reports"
  ON discussion_reports
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- STEP 3: Verify policies were created
SELECT 
  policyname AS "Policy",
  cmd AS "Command",
  'Created ✅' AS "Status"
FROM pg_policies
WHERE tablename = 'discussion_reports'
ORDER BY cmd;

-- STEP 4: Make sure you have at least one admin user
-- Replace 'your-admin-email@example.com' with your actual admin email
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com' 
  OR email LIKE '%admin%'
RETURNING email, role;

-- If no admin exists, you can manually set one:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';

-- STEP 5: Create a test report for verification
-- This will create a test report that should appear in the admin panel

DO $$
DECLARE
  test_discussion_id UUID;
  test_reporter_id UUID;
  test_reporter_name TEXT;
BEGIN
  -- Get a discussion ID
  SELECT id INTO test_discussion_id FROM discussions LIMIT 1;
  
  -- Get a user ID
  SELECT id, name INTO test_reporter_id, test_reporter_name 
  FROM profiles 
  WHERE role = 'user' 
  LIMIT 1;
  
  -- If we have both, create a test report
  IF test_discussion_id IS NOT NULL AND test_reporter_id IS NOT NULL THEN
    INSERT INTO discussion_reports (
      discussion_id,
      reporter_id,
      reporter_name,
      content_title,
      content_type,
      original_author,
      reason,
      description,
      status
    )
    SELECT 
      test_discussion_id,
      test_reporter_id,
      COALESCE(test_reporter_name, 'Test User'),
      d.title,
      'Discussion',
      p.name,
      'Spam/Promotional',
      '⚠️ THIS IS A TEST REPORT - Created by FIX_COMMUNITY_REPORTS.sql for debugging. You can delete this.',
      'pending'
    FROM discussions d
    JOIN profiles p ON d.author_id = p.id
    WHERE d.id = test_discussion_id;
    
    RAISE NOTICE 'Test report created successfully! ✅';
  ELSE
    RAISE NOTICE 'Cannot create test report - missing discussion or user. Please create manually.';
  END IF;
END $$;

-- STEP 6: Verify the test report was created
SELECT 
  '=== Test Report Created ===' AS section;

SELECT 
  id,
  content_title AS "Discussion Title",
  reporter_name AS "Reporter",
  reason,
  status,
  description,
  created_at
FROM discussion_reports 
WHERE description LIKE '%THIS IS A TEST REPORT%'
ORDER BY created_at DESC
LIMIT 1;

-- STEP 7: Show all pending reports (what admin should see)
SELECT 
  '=== Pending Reports (Admin View) ===' AS section;

SELECT 
  id,
  content_title AS "Title",
  reporter_name AS "Reporter",
  reason,
  content_type AS "Type",
  created_at AS "Date"
FROM discussion_reports 
WHERE status = 'pending'
ORDER BY created_at DESC;

-- STEP 8: Count reports by status
SELECT 
  '=== Report Counts ===' AS section;

SELECT 
  status,
  COUNT(*) AS count
FROM discussion_reports 
GROUP BY status
ORDER BY 
  CASE status
    WHEN 'pending' THEN 1
    WHEN 'resolved' THEN 2
    WHEN 'dismissed' THEN 3
  END;

-- STEP 9: Final verification
SELECT 
  '=== FINAL VERIFICATION ===' AS section;

SELECT 
  'Reports Table Exists: ' || 
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'discussion_reports')
    THEN '✅ YES' ELSE '❌ NO' END AS check_1,
  'RLS Enabled: ' ||
  CASE WHEN (SELECT rowsecurity FROM pg_tables WHERE tablename = 'discussion_reports')
    THEN '✅ YES' ELSE '❌ NO' END AS check_2,
  'RLS Policies: ' ||
  (SELECT COUNT(*)::text FROM pg_policies WHERE tablename = 'discussion_reports') || ' of 5' AS check_3,
  'Admin Users: ' ||
  (SELECT COUNT(*)::text FROM profiles WHERE role = 'admin') AS check_4,
  'Total Reports: ' ||
  (SELECT COUNT(*)::text FROM discussion_reports) AS check_5,
  'Pending Reports: ' ||
  (SELECT COUNT(*)::text FROM discussion_reports WHERE status = 'pending') AS check_6;

-- SUCCESS MESSAGE
SELECT '✅ Fix script completed! Please refresh the Admin Panel and check the Community Reports section.' AS message;

-- CLEANUP (OPTIONAL)
-- If you want to delete the test report after verifying it appears:
-- DELETE FROM discussion_reports WHERE description LIKE '%THIS IS A TEST REPORT%';
