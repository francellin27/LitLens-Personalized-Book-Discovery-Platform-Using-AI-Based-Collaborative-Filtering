-- Add reading date tracking to user_book_status table
-- This migration adds start_date and finish_date columns for tracking reading progress

ALTER TABLE user_book_status
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS finish_date DATE;

-- Add index for date queries
CREATE INDEX IF NOT EXISTS idx_user_book_status_dates ON user_book_status(start_date, finish_date);

-- Add comments
COMMENT ON COLUMN user_book_status.start_date IS 'Date when user started reading the book';
COMMENT ON COLUMN user_book_status.finish_date IS 'Date when user finished reading the book';
