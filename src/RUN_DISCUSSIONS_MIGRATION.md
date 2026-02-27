# 🚨 URGENT: Run Discussions Migration

## The Problem
You're seeing these errors because the `discussions` and `discussion_replies` tables don't exist in your Supabase database yet:

```
Error: Could not find a relationship between 'discussions' and 'profiles'
Error: Could not find the 'book_id' column of 'discussions'
```

## The Solution
You need to run the migration SQL file to create these tables.

---

## Step-by-Step Instructions

### 1. Open Supabase SQL Editor
1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Click on your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**

### 2. Copy the Migration SQL
Copy **ALL** of the SQL code from the file:
```
/supabase/migrations/004_discussions_tables.sql
```

### 3. Paste and Run
1. Paste the entire SQL code into the SQL Editor
2. Click **Run** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
3. Wait for the success message

### 4. Verify Tables Created
After running, verify the tables exist:

```sql
-- Run this query to check:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('discussions', 'discussion_replies');
```

You should see both tables listed.

---

## Quick Copy-Paste SQL

Here's the complete SQL to copy and paste directly:

```sql
-- Migration: Create discussions and discussion_replies tables
-- This migration adds support for community discussions with replies

-- Create discussions table
CREATE TABLE IF NOT EXISTS discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  book_id UUID REFERENCES books(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create discussion_replies table
CREATE TABLE IF NOT EXISTS discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_discussions_user_id ON discussions(user_id);
CREATE INDEX IF NOT EXISTS idx_discussions_book_id ON discussions(book_id);
CREATE INDEX IF NOT EXISTS idx_discussions_created_at ON discussions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussions_category ON discussions(category);

CREATE INDEX IF NOT EXISTS idx_discussion_replies_discussion_id ON discussion_replies(discussion_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_user_id ON discussion_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_created_at ON discussion_replies(created_at);

-- Enable Row Level Security
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for discussions table
-- Anyone can view discussions
CREATE POLICY "Anyone can view discussions"
  ON discussions FOR SELECT
  USING (true);

-- Only authenticated users can create discussions
CREATE POLICY "Authenticated users can create discussions"
  ON discussions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own discussions
CREATE POLICY "Users can update own discussions"
  ON discussions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own discussions, admins can delete any
CREATE POLICY "Users can delete own discussions or admins can delete any"
  ON discussions FOR DELETE
  USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for discussion_replies table
-- Anyone can view replies
CREATE POLICY "Anyone can view discussion replies"
  ON discussion_replies FOR SELECT
  USING (true);

-- Only authenticated users can create replies
CREATE POLICY "Authenticated users can create discussion replies"
  ON discussion_replies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own replies
CREATE POLICY "Users can update own discussion replies"
  ON discussion_replies FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own replies, admins can delete any
CREATE POLICY "Users can delete own replies or admins can delete any"
  ON discussion_replies FOR DELETE
  USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_discussions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-updating updated_at
CREATE TRIGGER discussions_updated_at
  BEFORE UPDATE ON discussions
  FOR EACH ROW
  EXECUTE FUNCTION update_discussions_updated_at();

CREATE TRIGGER discussion_replies_updated_at
  BEFORE UPDATE ON discussion_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_discussions_updated_at();
```

---

## What This Migration Does

✅ Creates `discussions` table with:
  - User association (who created it)
  - Title and content
  - Category (general, book-discussion, etc.)
  - Optional book reference
  - Timestamps

✅ Creates `discussion_replies` table with:
  - Discussion association
  - User association
  - Reply content
  - Timestamps

✅ Sets up security with Row Level Security (RLS):
  - Anyone can view discussions/replies
  - Only authenticated users can create
  - Users can edit/delete their own content
  - Admins can delete any content

✅ Adds performance indexes

✅ Auto-updates timestamps on edits

---

## After Running the Migration

Once the migration is complete:

1. **Refresh your app** - The errors should disappear
2. **Test creating a discussion** - Go to Community page and create one
3. **Verify in Admin Panel** - Check that discussions appear in the admin interface

---

## Troubleshooting

### Error: "relation 'profiles' does not exist"
You need to run the initial migrations first:
1. `/supabase/migrations/001_initial_schema.sql.tsx`
2. `/supabase/migrations/002_seed_data.sql.tsx`

### Error: "relation 'books' does not exist"  
Same as above - run migrations 001 and 002 first.

### Policy errors
If you get permission errors after creating the tables, make sure you're logged in as an authenticated user.

---

## Need Help?

If you encounter any issues:
1. Check the Supabase SQL Editor for error messages
2. Make sure all previous migrations have been run
3. Verify your user is authenticated in the app
4. Check the browser console for detailed error messages

---

**Status After Running:** ✅ Community discussions will work fully
