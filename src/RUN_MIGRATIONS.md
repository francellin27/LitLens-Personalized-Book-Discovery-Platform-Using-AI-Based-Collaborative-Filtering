# How to Run Database Migrations

## Issue
The `user_book_status` table is missing the `start_date` and `finish_date` columns needed for logging reading dates.

## ⚡ QUICK FIX

**Use the Admin Panel Database Tab** (Easiest method!)

1. Log in as admin
2. Go to Admin Panel → Database tab
3. Click "Copy SQL" then "Open Supabase SQL Editor"
4. Paste and run the SQL
5. Done! ✅

For detailed instructions, see: **[FIX_DATE_COLUMNS.md](./FIX_DATE_COLUMNS.md)**

---

## Manual Method

### Option 1: Run via Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the following SQL:

```sql
-- Add reading date tracking to user_book_status table
ALTER TABLE user_book_status
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS finish_date DATE;

-- Add index for date queries
CREATE INDEX IF NOT EXISTS idx_user_book_status_dates 
ON user_book_status(start_date, finish_date);

-- Add comments
COMMENT ON COLUMN user_book_status.start_date IS 'Date when user started reading the book';
COMMENT ON COLUMN user_book_status.finish_date IS 'Date when user finished reading the book';
```

5. Click **Run** to execute the migration
6. You should see a success message

### Option 2: Verify the Migration
After running the migration, verify it worked:

1. In Supabase Dashboard, go to **Table Editor**
2. Select the `user_book_status` table
3. Check that the columns `start_date` and `finish_date` now exist

## Current Behavior
- The app has been updated to gracefully handle the missing columns
- If the columns don't exist, it will still log books as "reading" or "completed" but won't store the dates
- A warning will be logged in the console: "Date columns not found in user_book_status table"

## After Migration
Once you run the migration:
- Users can log books with start and finish dates
- The dates will be stored in the database
- Date-based queries and statistics will work properly

## Note
The migration uses `IF NOT EXISTS` clauses, so it's safe to run multiple times without errors.
