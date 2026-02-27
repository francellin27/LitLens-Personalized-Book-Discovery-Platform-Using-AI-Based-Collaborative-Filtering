-- ============================================
-- QUICK FIX: Make Review Title Optional
-- ============================================
-- Run this in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================

-- Step 1: Make title column nullable
ALTER TABLE reviews 
ALTER COLUMN title DROP NOT NULL;

-- Step 2: Add documentation
COMMENT ON COLUMN reviews.title IS 'Optional title for the review';

-- Step 3: Verify the change
SELECT 
    'Migration Successful!' as status,
    column_name, 
    is_nullable, 
    data_type
FROM information_schema.columns 
WHERE table_name = 'reviews' 
AND column_name = 'title';

-- ============================================
-- Expected Output:
-- status              | column_name | is_nullable | data_type
-- -------------------|-------------|-------------|----------
-- Migration Successful! | title    | YES         | text
-- ============================================
