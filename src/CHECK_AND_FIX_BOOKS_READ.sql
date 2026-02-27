-- ============================================
-- CHECK AND FIX BOOKS READ COUNT
-- Run this in Supabase SQL Editor
-- ============================================

-- STEP 1: Check current state
-- ============================================
SELECT '=== STEP 1: Current User Book Status Summary ===' as step;

SELECT 
  p.name,
  p.email,
  p.role,
  COUNT(CASE WHEN ubs.status = 'completed' THEN 1 END) as books_completed,
  COUNT(CASE WHEN ubs.status = 'reading' THEN 1 END) as currently_reading,
  COUNT(CASE WHEN ubs.status = 'favorite' THEN 1 END) as favorites,
  COUNT(CASE WHEN ubs.status = 'want_to_read' THEN 1 END) as want_to_read,
  COUNT(ubs.id) as total_interactions
FROM profiles p
LEFT JOIN user_book_status ubs ON p.id = ubs.user_id
WHERE p.role = 'user'
GROUP BY p.id, p.name, p.email, p.role
ORDER BY p.name;

-- STEP 2: Check specific users
-- ============================================
SELECT '=== STEP 2: Specific Users Check ===' as step;

SELECT 
  p.name,
  p.email,
  COUNT(CASE WHEN ubs.status = 'completed' THEN 1 END) as books_read
FROM profiles p
LEFT JOIN user_book_status ubs ON p.id = ubs.user_id
WHERE p.name IN (
  'Francellin Tejada',
  'rctopada',
  'tryme',
  'Jefferson Costales',
  'Sean Justine Barbo',
  'Ryan Pogi Opada'
)
GROUP BY p.id, p.name, p.email
ORDER BY p.name;

-- STEP 3: Check if any completed books exist at all
-- ============================================
SELECT '=== STEP 3: Total Completed Books in System ===' as step;

SELECT 
  COUNT(*) as total_completed_books,
  COUNT(DISTINCT user_id) as users_with_completed_books
FROM user_book_status
WHERE status = 'completed';

-- STEP 4: Check all possible status values
-- ============================================
SELECT '=== STEP 4: All Status Values in Database ===' as step;

SELECT DISTINCT status, COUNT(*) as count
FROM user_book_status
GROUP BY status
ORDER BY count DESC;

-- STEP 5: Detailed view of completed books
-- ============================================
SELECT '=== STEP 5: All Completed Books ===' as step;

SELECT 
  p.name as user_name,
  p.email as user_email,
  b.title as book_title,
  ubs.rating,
  ubs.finish_date,
  ubs.created_at
FROM user_book_status ubs
JOIN profiles p ON ubs.user_id = p.id
JOIN books b ON ubs.book_id = b.id
WHERE ubs.status = 'completed'
ORDER BY ubs.created_at DESC
LIMIT 50;

-- ============================================
-- OPTIONAL: Add test data if needed
-- ============================================
-- Uncomment the section below if you want to add test completed books

/*
-- This will add 3 completed books for each user
-- WARNING: Only run this once for testing!

INSERT INTO user_book_status (user_id, book_id, status, rating, finish_date)
SELECT 
  p.id as user_id,
  b.id as book_id,
  'completed' as status,
  (ARRAY[3, 4, 5])[floor(random() * 3 + 1)] as rating,
  NOW() - (random() * interval '60 days') as finish_date
FROM profiles p
CROSS JOIN LATERAL (
  SELECT id 
  FROM books 
  ORDER BY random() 
  LIMIT 3
) b
WHERE p.role = 'user'
  AND p.name IN (
    'Francellin Tejada',
    'rctopada',
    'tryme',
    'Jefferson Costales',
    'Sean Justine Barbo',
    'Ryan Pogi Opada'
  )
ON CONFLICT (user_id, book_id, status) DO NOTHING;

-- Verify the insertion
SELECT 
  p.name,
  COUNT(*) as books_added
FROM user_book_status ubs
JOIN profiles p ON ubs.user_id = p.id
WHERE ubs.status = 'completed'
  AND p.role = 'user'
GROUP BY p.id, p.name
ORDER BY p.name;
*/

-- ============================================
-- VERIFICATION: Run the exact query used by the app
-- ============================================
SELECT '=== VERIFICATION: Exact App Query ===' as step;

SELECT 
  p.id,
  p.name,
  p.email,
  p.role,
  (
    SELECT COUNT(*)
    FROM user_book_status ubs
    WHERE ubs.user_id = p.id
    AND ubs.status = 'completed'
  ) as books_read
FROM profiles p
WHERE p.role = 'user'
ORDER BY p.created_at DESC;

-- ============================================
-- DIAGNOSTIC: Check for data issues
-- ============================================
SELECT '=== DIAGNOSTIC: Potential Issues ===' as step;

-- Check for users without any book interactions
SELECT 
  'Users with no book interactions' as issue,
  COUNT(*) as count
FROM profiles p
LEFT JOIN user_book_status ubs ON p.id = ubs.user_id
WHERE p.role = 'user' AND ubs.id IS NULL;

-- Check for orphaned user_book_status records
SELECT 
  'Orphaned book status records' as issue,
  COUNT(*) as count
FROM user_book_status ubs
LEFT JOIN profiles p ON ubs.user_id = p.id
WHERE p.id IS NULL;

-- Check for invalid status values
SELECT 
  'Invalid status values' as issue,
  COUNT(*) as count
FROM user_book_status
WHERE status NOT IN ('completed', 'reading', 'favorite', 'want_to_read');

-- ============================================
-- SUMMARY
-- ============================================
SELECT '=== SUMMARY ===' as step;

SELECT 
  (SELECT COUNT(*) FROM profiles WHERE role = 'user') as total_users,
  (SELECT COUNT(DISTINCT user_id) FROM user_book_status WHERE status = 'completed') as users_with_completed_books,
  (SELECT COUNT(*) FROM user_book_status WHERE status = 'completed') as total_completed_books,
  (SELECT ROUND(AVG(book_count), 2) FROM (
    SELECT COUNT(*) as book_count
    FROM user_book_status
    WHERE status = 'completed'
    GROUP BY user_id
  ) avg_books) as avg_books_per_user;

-- ============================================
-- EXPECTED RESULTS
-- ============================================
/*
If everything is working:
- STEP 1: Should show counts > 0 for books_completed
- STEP 2: All 6 users should have books_read > 0
- STEP 3: total_completed_books should be > 0
- STEP 4: Should show 'completed' as one of the statuses
- STEP 5: Should show list of completed books
- VERIFICATION: books_read column should have values > 0

If all show 0:
- No books marked as 'completed' in database
- Users need to rate books OR uncomment test data section
*/
