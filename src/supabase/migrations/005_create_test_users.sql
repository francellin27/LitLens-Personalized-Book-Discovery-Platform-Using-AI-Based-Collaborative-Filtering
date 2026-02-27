-- Create test users for LitLens
-- These users can be used immediately for testing

-- Note: You need to run this in the Supabase SQL Editor
-- because Supabase Auth requires special permissions

-- Instructions:
-- 1. Go to: https://supabase.com/dashboard/project/nrdetgsryanpfxkazcap/sql/new
-- 2. Copy and paste the SQL commands below
-- 3. Click "Run"

-- Create Regular Test User
-- Email: test@example.com
-- Password: password123

-- Create Admin Test User  
-- Email: admin@example.com
-- Password: admin123

-- IMPORTANT: Run these commands in the Supabase SQL Editor:

-- 1. Create regular user
SELECT auth.create_user(
  '{
    "email": "test@example.com",
    "password": "password123",
    "email_confirm": true,
    "user_metadata": {
      "name": "Test User",
      "username": "testuser"
    }
  }'::jsonb
);

-- 2. Create admin user
SELECT auth.create_user(
  '{
    "email": "admin@example.com",
    "password": "admin123",
    "email_confirm": true,
    "user_metadata": {
      "name": "Admin User",
      "username": "admin"
    }
  }'::jsonb
);

-- 3. After creating the users above, update the admin user's role
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@example.com';

-- Verify the users were created:
SELECT id, email, name, username, role FROM profiles;
