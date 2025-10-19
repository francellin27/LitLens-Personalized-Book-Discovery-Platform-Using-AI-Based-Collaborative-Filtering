import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { AlertTriangle, ExternalLink } from "lucide-react";

export function DiscussionsMigrationBanner() {
  const migrationSQL = `-- Copy and paste this into Supabase SQL Editor
-- NOTE: This migration uses 'author_id' to match the existing schema

-- Add book_id column to discussions table if it doesn't exist
DO $ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'discussions' AND column_name = 'book_id'
  ) THEN
    ALTER TABLE discussions ADD COLUMN book_id UUID REFERENCES books(id) ON DELETE SET NULL;
  END IF;
END $;

-- Add missing columns that were in original schema
DO $ 
BEGIN
  -- Check if tags column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'discussions' AND column_name = 'tags'
  ) THEN
    ALTER TABLE discussions ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;
  
  -- Check if likes column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'discussions' AND column_name = 'likes'
  ) THEN
    ALTER TABLE discussions ADD COLUMN likes INTEGER DEFAULT 0;
  END IF;
  
  -- Check if replies_count column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'discussions' AND column_name = 'replies_count'
  ) THEN
    ALTER TABLE discussions ADD COLUMN replies_count INTEGER DEFAULT 0;
  END IF;
  
  -- Check if views column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'discussions' AND column_name = 'views'
  ) THEN
    ALTER TABLE discussions ADD COLUMN views INTEGER DEFAULT 0;
  END IF;
END $;

-- Add likes column to discussion_replies if it doesn't exist
DO $ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'discussion_replies' AND column_name = 'likes'
  ) THEN
    ALTER TABLE discussion_replies ADD COLUMN likes INTEGER DEFAULT 0;
  END IF;
END $;

-- Create indexes for better query performance (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_discussions_book_id ON discussions(book_id);

-- Drop and recreate conflicting policies
DO $ 
BEGIN
  -- Drop old policies if they exist
  DROP POLICY IF EXISTS "Anyone can view discussions" ON discussions;
  DROP POLICY IF EXISTS "Authenticated users can create discussions" ON discussions;
  DROP POLICY IF EXISTS "Users can update own discussions" ON discussions;
  DROP POLICY IF EXISTS "Users can delete own discussions" ON discussions;
  DROP POLICY IF EXISTS "Users can delete own discussions or admins can delete any" ON discussions;
  
  DROP POLICY IF EXISTS "Anyone can view discussion replies" ON discussion_replies;
  DROP POLICY IF EXISTS "Authenticated users can create replies" ON discussion_replies;
  DROP POLICY IF EXISTS "Authenticated users can create discussion replies" ON discussion_replies;
  DROP POLICY IF EXISTS "Users can update own replies" ON discussion_replies;
  DROP POLICY IF EXISTS "Users can update own discussion replies" ON discussion_replies;
  DROP POLICY IF EXISTS "Users can delete own replies" ON discussion_replies;
  DROP POLICY IF EXISTS "Users can delete own replies or admins can delete any" ON discussion_replies;
END $;

-- Create RLS Policies for discussions table
CREATE POLICY "Anyone can view discussions"
  ON discussions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create discussions"
  ON discussions FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own discussions"
  ON discussions FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete own discussions or admins can delete any"
  ON discussions FOR DELETE
  USING (
    auth.uid() = author_id 
    OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create RLS Policies for discussion_replies table
CREATE POLICY "Anyone can view discussion replies"
  ON discussion_replies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create discussion replies"
  ON discussion_replies FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own discussion replies"
  ON discussion_replies FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete own replies or admins can delete any"
  ON discussion_replies FOR DELETE
  USING (
    auth.uid() = author_id 
    OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );`;

  const handleCopySQL = () => {
    navigator.clipboard.writeText(migrationSQL);
    alert('Migration SQL copied to clipboard! Now paste it into Supabase SQL Editor.');
  };

  const handleOpenSupabase = () => {
    window.open('https://supabase.com/dashboard', '_blank');
  };

  return (
    <Alert variant="destructive" className="mb-6 border-2">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle className="text-lg font-semibold mb-2">
        Database Migration Required
      </AlertTitle>
      <AlertDescription className="space-y-3">
        <p className="text-sm">
          The <strong>discussions</strong> and <strong>discussion_replies</strong> tables need to be created in your Supabase database.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleCopySQL}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            📋 Copy Migration SQL
          </Button>
          
          <Button
            onClick={handleOpenSupabase}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open Supabase SQL Editor
          </Button>
        </div>

        <div className="text-xs bg-background/50 p-3 rounded border space-y-1">
          <p className="font-semibold">Quick Steps:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click "Copy Migration SQL" above</li>
            <li>Click "Open Supabase SQL Editor"</li>
            <li>Click "New Query" in Supabase</li>
            <li>Paste the SQL and click "Run"</li>
            <li>Refresh this page</li>
          </ol>
        </div>

        <p className="text-xs">
          See <code className="bg-background/50 px-1 rounded">RUN_DISCUSSIONS_MIGRATION.md</code> for detailed instructions.
        </p>
      </AlertDescription>
    </Alert>
  );
}
