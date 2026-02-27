-- ============================================
-- Migration 006: Discussion Reports System
-- ============================================
-- This migration creates the discussion_reports table for tracking
-- reported discussions and replies that violate community guidelines

-- Create discussion_reports table
CREATE TABLE IF NOT EXISTS discussion_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reporter_name TEXT NOT NULL,
  content_title TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('Discussion', 'Reply')),
  original_author TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('Spam/Promotional', 'Harassment', 'Inappropriate Content', 'Misinformation', 'Off-topic', 'Other')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_discussion_reports_discussion_id ON discussion_reports(discussion_id);
CREATE INDEX IF NOT EXISTS idx_discussion_reports_reporter_id ON discussion_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_discussion_reports_status ON discussion_reports(status);
CREATE INDEX IF NOT EXISTS idx_discussion_reports_created_at ON discussion_reports(created_at DESC);

-- Enable Row Level Security
ALTER TABLE discussion_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own reports
CREATE POLICY "Users can view their own reports"
  ON discussion_reports
  FOR SELECT
  USING (auth.uid() = reporter_id);

-- Policy: Users can create reports
CREATE POLICY "Users can create reports"
  ON discussion_reports
  FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Policy: Admins can view all reports
CREATE POLICY "Admins can view all reports"
  ON discussion_reports
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admins can update reports
CREATE POLICY "Admins can update reports"
  ON discussion_reports
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admins can delete reports
CREATE POLICY "Admins can delete reports"
  ON discussion_reports
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_discussion_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE TRIGGER update_discussion_reports_timestamp
  BEFORE UPDATE ON discussion_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_discussion_reports_updated_at();

-- Add some test data (OPTIONAL - comment out if not needed)
-- This will create 2 sample reports if you have existing discussions and users
INSERT INTO discussion_reports (discussion_id, reporter_id, reporter_name, content_title, content_type, original_author, reason, description, status, created_at)
SELECT 
  d.id,
  (SELECT id FROM profiles WHERE email = 'user@example.com' LIMIT 1),
  'Test User',
  d.title,
  'Discussion',
  p.name,
  'Spam/Promotional',
  'This discussion contains promotional content that violates community guidelines.',
  'pending',
  NOW() - INTERVAL '2 days'
FROM discussions d
JOIN profiles p ON d.author_id = p.id
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'user@example.com')
LIMIT 1;

INSERT INTO discussion_reports (discussion_id, reporter_id, reporter_name, content_title, content_type, original_author, reason, description, status, created_at)
SELECT 
  d.id,
  (SELECT id FROM profiles LIMIT 1 OFFSET 1),
  (SELECT name FROM profiles LIMIT 1 OFFSET 1),
  d.title,
  'Discussion',
  p.name,
  'Inappropriate Content',
  'Discussion contains inappropriate language and content.',
  'pending',
  NOW() - INTERVAL '1 day'
FROM discussions d
JOIN profiles p ON d.author_id = p.id
WHERE EXISTS (SELECT 1 FROM profiles OFFSET 1)
LIMIT 1;

-- Add helpful comments to the table
COMMENT ON TABLE discussion_reports IS 'Stores user reports for discussions and replies that violate community guidelines';
COMMENT ON COLUMN discussion_reports.content_type IS 'Type of content being reported: Discussion or Reply';
COMMENT ON COLUMN discussion_reports.status IS 'Current status: pending (awaiting review), resolved (action taken), dismissed (no action needed)';
COMMENT ON COLUMN discussion_reports.reason IS 'Category of the violation being reported';
COMMENT ON COLUMN discussion_reports.resolved_by IS 'Admin user ID who resolved the report';

-- Verify the migration
SELECT 'Discussion reports table created successfully!' AS status;
SELECT COUNT(*) AS report_count FROM discussion_reports;
