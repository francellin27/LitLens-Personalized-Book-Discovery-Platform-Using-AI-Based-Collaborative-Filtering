-- ============================================
-- Community Reports Verification Script
-- ============================================
-- Run this in Supabase SQL Editor to diagnose issues

-- 1. Check if discussion_reports table exists
SELECT 
  'Table Exists: ' || 
  CASE WHEN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'discussion_reports'
  ) THEN 'YES ✅' ELSE 'NO ❌ - Run migration 006_discussion_reports.sql' END 
  AS status;

-- 2. Check if RLS is enabled
SELECT 
  'RLS Enabled: ' || 
  CASE WHEN rowsecurity THEN 'YES ✅' ELSE 'NO ❌' END AS status,
  tablename
FROM pg_tables 
WHERE tablename = 'discussion_reports';

-- 3. List all RLS policies
SELECT 
  policyname AS "Policy Name",
  cmd AS "Command",
  CASE 
    WHEN cmd = 'SELECT' THEN 'Read'
    WHEN cmd = 'INSERT' THEN 'Create'
    WHEN cmd = 'UPDATE' THEN 'Update'
    WHEN cmd = 'DELETE' THEN 'Delete'
    ELSE cmd
  END AS "Type"
FROM pg_policies
WHERE tablename = 'discussion_reports'
ORDER BY cmd;

-- Expected: 5 policies
-- - Users can view their own reports (SELECT)
-- - Users can create reports (INSERT)
-- - Admins can view all reports (SELECT)
-- - Admins can update reports (UPDATE)
-- - Admins can delete reports (DELETE)

-- 4. Count reports by status
SELECT 
  '=== Report Counts ===' AS section;

SELECT 
  status,
  COUNT(*) AS count,
  CASE 
    WHEN status = 'pending' THEN '🟡'
    WHEN status = 'resolved' THEN '🟢'
    WHEN status = 'dismissed' THEN '⚫'
  END AS icon
FROM discussion_reports 
GROUP BY status
ORDER BY 
  CASE status
    WHEN 'pending' THEN 1
    WHEN 'resolved' THEN 2
    WHEN 'dismissed' THEN 3
  END;

-- 5. Total report count
SELECT 
  'Total Reports: ' || COUNT(*) AS summary
FROM discussion_reports;

-- 6. Show recent reports (last 10)
SELECT 
  '=== Recent Reports ===' AS section;

SELECT 
  id,
  content_title AS "Discussion Title",
  reporter_name AS "Reporter",
  reason AS "Reason",
  status AS "Status",
  created_at AS "Created At",
  CASE 
    WHEN status = 'pending' THEN '🟡 Pending'
    WHEN status = 'resolved' THEN '🟢 Resolved'
    WHEN status = 'dismissed' THEN '⚫ Dismissed'
  END AS "Status Icon"
FROM discussion_reports 
ORDER BY created_at DESC 
LIMIT 10;

-- 7. Check for admin users
SELECT 
  '=== Admin Users ===' AS section;

SELECT 
  id,
  email,
  name,
  role,
  CASE 
    WHEN role = 'admin' THEN '✅ Admin'
    ELSE '❌ Not Admin'
  END AS "Admin Status"
FROM profiles 
WHERE role = 'admin' OR email LIKE '%admin%'
ORDER BY created_at;

-- 8. Check for test data (from migration)
SELECT 
  '=== Test Data Check ===' AS section;

SELECT 
  COUNT(*) AS "Test Reports",
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Test data exists'
    ELSE 'ℹ️ No test data (this is OK if you cleaned it up)'
  END AS "Status"
FROM discussion_reports
WHERE reporter_name = 'Test User';

-- 9. Validate foreign key relationships
SELECT 
  '=== Foreign Key Validation ===' AS section;

-- Check for orphaned reports (discussion deleted but report remains)
SELECT 
  'Orphaned Reports: ' || COUNT(*) AS status,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ None'
    ELSE '⚠️ Found orphaned reports'
  END AS result
FROM discussion_reports dr
WHERE NOT EXISTS (
  SELECT 1 FROM discussions d WHERE d.id = dr.discussion_id
);

-- Check for reports with deleted reporters
SELECT 
  'Reports with Deleted Reporters: ' || COUNT(*) AS status,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ None'
    ELSE '⚠️ Found reports with deleted reporters'
  END AS result
FROM discussion_reports dr
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = dr.reporter_id
);

-- 10. Check table structure
SELECT 
  '=== Table Structure ===' AS section;

SELECT 
  column_name AS "Column",
  data_type AS "Type",
  is_nullable AS "Nullable",
  column_default AS "Default"
FROM information_schema.columns
WHERE table_name = 'discussion_reports'
ORDER BY ordinal_position;

-- 11. Sample report data (if any exists)
SELECT 
  '=== Sample Report ===' AS section;

SELECT 
  id,
  discussion_id,
  reporter_id,
  reporter_name,
  content_title,
  content_type,
  original_author,
  reason,
  description,
  status,
  created_at
FROM discussion_reports 
ORDER BY created_at DESC 
LIMIT 1;

-- 12. Create a test report (OPTIONAL - uncomment to run)
/*
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
  d.id,
  p.id,
  p.name,
  d.title,
  'Discussion',
  (SELECT name FROM profiles WHERE id = d.author_id),
  'Spam/Promotional',
  'Test report created for debugging',
  'pending'
FROM discussions d
CROSS JOIN profiles p
WHERE p.email LIKE '%test%' OR p.email LIKE '%demo%'
LIMIT 1
RETURNING *;
*/

-- 13. Final Summary
SELECT 
  '=== SUMMARY ===' AS section;

SELECT 
  'Total Reports' AS metric,
  COUNT(*)::text AS value
FROM discussion_reports
UNION ALL
SELECT 
  'Pending Reports',
  COUNT(*)::text
FROM discussion_reports
WHERE status = 'pending'
UNION ALL
SELECT 
  'Resolved Reports',
  COUNT(*)::text
FROM discussion_reports
WHERE status = 'resolved'
UNION ALL
SELECT 
  'Dismissed Reports',
  COUNT(*)::text
FROM discussion_reports
WHERE status = 'dismissed'
UNION ALL
SELECT 
  'Admin Users',
  COUNT(*)::text
FROM profiles
WHERE role = 'admin'
UNION ALL
SELECT 
  'Total Discussions',
  COUNT(*)::text
FROM discussions;

-- 14. Test RLS as regular user (simulated)
-- This shows what a regular user can see
SELECT 
  '=== RLS Test (What User Can See) ===' AS section;

SELECT 
  id,
  content_title,
  reporter_name,
  status
FROM discussion_reports
-- Simulate user context (replace with actual user ID)
WHERE reporter_id = (SELECT id FROM profiles WHERE role = 'user' LIMIT 1)
ORDER BY created_at DESC
LIMIT 5;

-- 15. Common Issues Check
SELECT 
  '=== Common Issues Check ===' AS section;

SELECT 
  'Issue' AS check_type,
  'Status' AS result,
  'Recommendation' AS action
WHERE false -- Header row
UNION ALL
SELECT 
  'Migration Run',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'discussion_reports')
    THEN '✅ Yes' ELSE '❌ No' END,
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'discussion_reports')
    THEN 'Good' ELSE 'Run migration 006_discussion_reports.sql' END
UNION ALL
SELECT 
  'RLS Enabled',
  CASE WHEN (SELECT rowsecurity FROM pg_tables WHERE tablename = 'discussion_reports')
    THEN '✅ Yes' ELSE '❌ No' END,
  CASE WHEN (SELECT rowsecurity FROM pg_tables WHERE tablename = 'discussion_reports')
    THEN 'Good' ELSE 'Enable RLS on discussion_reports' END
UNION ALL
SELECT 
  'RLS Policies',
  CASE WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'discussion_reports') >= 5
    THEN '✅ ' || (SELECT COUNT(*)::text FROM pg_policies WHERE tablename = 'discussion_reports') || ' policies'
    ELSE '❌ Only ' || (SELECT COUNT(*)::text FROM pg_policies WHERE tablename = 'discussion_reports') || ' policies' END,
  CASE WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'discussion_reports') >= 5
    THEN 'Good' ELSE 'Check migration 006 - should have 5 policies' END
UNION ALL
SELECT 
  'Admin Users Exist',
  CASE WHEN EXISTS (SELECT FROM profiles WHERE role = 'admin')
    THEN '✅ Yes' ELSE '❌ No' END,
  CASE WHEN EXISTS (SELECT FROM profiles WHERE role = 'admin')
    THEN 'Good' ELSE 'Create admin user or update role to admin' END
UNION ALL
SELECT 
  'Reports Exist',
  CASE WHEN EXISTS (SELECT FROM discussion_reports)
    THEN '✅ ' || (SELECT COUNT(*)::text FROM discussion_reports) || ' reports'
    ELSE 'ℹ️ No reports yet' END,
  CASE WHEN EXISTS (SELECT FROM discussion_reports)
    THEN 'Good' ELSE 'Create test report from UI' END;

-- Done!
SELECT '✅ Verification Complete!' AS status;
