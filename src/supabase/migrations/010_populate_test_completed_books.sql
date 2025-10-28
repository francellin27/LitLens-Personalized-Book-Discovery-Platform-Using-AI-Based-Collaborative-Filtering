-- ============================================
-- Migration: Populate Test Completed Books
-- Description: Add sample completed books for testing the Books Read count
-- Date: October 27, 2025
-- ============================================

-- This migration adds test data for users to have completed books
-- This is OPTIONAL and only for testing/demo purposes

-- Add 5 completed books for each regular user
-- Uses random books and ratings (3-5 stars)
-- Sets realistic finish dates (within last 90 days)

DO $$
DECLARE
  v_user RECORD;
  v_book RECORD;
  v_books_to_add INTEGER;
  v_rating INTEGER;
  v_finish_date TIMESTAMP;
BEGIN
  -- For each regular user
  FOR v_user IN 
    SELECT id, name, email 
    FROM profiles 
    WHERE role = 'user'
  LOOP
    -- Add 3-7 completed books per user (random)
    v_books_to_add := floor(random() * 5 + 3)::INTEGER;
    
    RAISE NOTICE 'Adding % completed books for user: %', v_books_to_add, v_user.name;
    
    -- Get random books for this user
    FOR v_book IN 
      SELECT id, title
      FROM books 
      ORDER BY random()
      LIMIT v_books_to_add
    LOOP
      -- Random rating between 3 and 5
      v_rating := floor(random() * 3 + 3)::INTEGER;
      
      -- Random finish date in last 90 days
      v_finish_date := NOW() - (random() * interval '90 days');
      
      -- Insert completed book (ignore if already exists)
      INSERT INTO user_book_status (user_id, book_id, status, rating, finish_date, created_at)
      VALUES (
        v_user.id,
        v_book.id,
        'completed',
        v_rating,
        v_finish_date,
        v_finish_date
      )
      ON CONFLICT (user_id, book_id, status) 
      DO UPDATE SET
        rating = EXCLUDED.rating,
        finish_date = EXCLUDED.finish_date;
      
      RAISE NOTICE '  ✓ Added: % (rating: %)', v_book.title, v_rating;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Migration complete!';
END $$;

-- Verify the results
SELECT 
  p.name,
  p.email,
  COUNT(ubs.id) as books_completed
FROM profiles p
LEFT JOIN user_book_status ubs ON p.id = ubs.user_id AND ubs.status = 'completed'
WHERE p.role = 'user'
GROUP BY p.id, p.name, p.email
ORDER BY books_completed DESC, p.name;

-- Summary
SELECT 
  'Total Users' as metric,
  COUNT(DISTINCT p.id) as count
FROM profiles p
WHERE p.role = 'user'
UNION ALL
SELECT 
  'Users with Completed Books' as metric,
  COUNT(DISTINCT ubs.user_id) as count
FROM user_book_status ubs
JOIN profiles p ON ubs.user_id = p.id
WHERE ubs.status = 'completed' AND p.role = 'user'
UNION ALL
SELECT 
  'Total Completed Books' as metric,
  COUNT(*) as count
FROM user_book_status ubs
JOIN profiles p ON ubs.user_id = p.id
WHERE ubs.status = 'completed' AND p.role = 'user';

-- Add some reading progress for variety
-- Some books currently reading
INSERT INTO user_book_status (user_id, book_id, status, start_date, created_at)
SELECT 
  p.id,
  b.id,
  'reading',
  NOW() - (random() * interval '30 days'),
  NOW() - (random() * interval '30 days')
FROM profiles p
CROSS JOIN LATERAL (
  SELECT id 
  FROM books 
  WHERE id NOT IN (
    SELECT book_id FROM user_book_status WHERE user_id = p.id
  )
  ORDER BY random() 
  LIMIT 2
) b
WHERE p.role = 'user'
ON CONFLICT (user_id, book_id, status) DO NOTHING;

-- Some favorite books
INSERT INTO user_book_status (user_id, book_id, status, created_at)
SELECT 
  p.id,
  b.id,
  'favorite',
  NOW() - (random() * interval '60 days')
FROM profiles p
CROSS JOIN LATERAL (
  SELECT id 
  FROM books 
  WHERE id NOT IN (
    SELECT book_id FROM user_book_status WHERE user_id = p.id
  )
  ORDER BY random() 
  LIMIT 3
) b
WHERE p.role = 'user'
ON CONFLICT (user_id, book_id, status) DO NOTHING;

-- Some want_to_read books
INSERT INTO user_book_status (user_id, book_id, status, created_at)
SELECT 
  p.id,
  b.id,
  'want_to_read',
  NOW() - (random() * interval '45 days')
FROM profiles p
CROSS JOIN LATERAL (
  SELECT id 
  FROM books 
  WHERE id NOT IN (
    SELECT book_id FROM user_book_status WHERE user_id = p.id
  )
  ORDER BY random() 
  LIMIT 5
) b
WHERE p.role = 'user'
ON CONFLICT (user_id, book_id, status) DO NOTHING;

-- Final verification
SELECT 
  p.name,
  COUNT(CASE WHEN ubs.status = 'completed' THEN 1 END) as completed,
  COUNT(CASE WHEN ubs.status = 'reading' THEN 1 END) as reading,
  COUNT(CASE WHEN ubs.status = 'favorite' THEN 1 END) as favorites,
  COUNT(CASE WHEN ubs.status = 'want_to_read' THEN 1 END) as want_to_read
FROM profiles p
LEFT JOIN user_book_status ubs ON p.id = ubs.user_id
WHERE p.role = 'user'
GROUP BY p.id, p.name
ORDER BY p.name;
