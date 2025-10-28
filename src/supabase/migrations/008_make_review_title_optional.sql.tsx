export default `
-- Migration: Make review title optional
-- This allows users to submit reviews without a title

-- Make title field nullable in reviews table
ALTER TABLE reviews 
ALTER COLUMN title DROP NOT NULL;

-- Add a comment to document the change
COMMENT ON COLUMN reviews.title IS 'Optional title for the review';
`;
