-- ============================================
-- FIX LOGIN ERROR - CREATE TEST USERS
-- ============================================
-- 
-- INSTRUCTIONS:
-- 1. Go to: https://supabase.com/dashboard/project/nrdetgsryanpfxkazcap/sql/new
-- 2. Copy this ENTIRE file
-- 3. Paste into the SQL Editor
-- 4. Click "Run"
-- 5. Login with credentials below
--
-- ============================================

-- First, enable the pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- CREATE TEST USER 1: Regular User
-- Email: test@example.com
-- Password: password123
-- ============================================

DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Generate a new UUID for the user
  new_user_id := gen_random_uuid();
  
  -- Create auth user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    'test@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Test User","username":"testuser"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  ON CONFLICT (email) DO NOTHING;

  -- Create or update profile (in case trigger didn't fire)
  INSERT INTO public.profiles (id, email, name, username, role, created_at, updated_at)
  VALUES (
    new_user_id,
    'test@example.com',
    'Test User',
    'testuser',
    'user',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    name = 'Test User',
    username = 'testuser',
    role = 'user',
    updated_at = NOW();

  RAISE NOTICE 'Created/Updated test user: test@example.com';
END $$;

-- ============================================
-- CREATE TEST USER 2: Admin User
-- Email: admin@example.com
-- Password: admin123
-- ============================================

DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Generate a new UUID for the admin
  new_user_id := gen_random_uuid();
  
  -- Create auth user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    'admin@example.com',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin User","username":"admin"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  ON CONFLICT (email) DO NOTHING;

  -- Create or update profile with admin role
  INSERT INTO public.profiles (id, email, name, username, role, created_at, updated_at)
  VALUES (
    new_user_id,
    'admin@example.com',
    'Admin User',
    'admin',
    'admin',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    name = 'Admin User',
    username = 'admin',
    role = 'admin',
    updated_at = NOW();

  RAISE NOTICE 'Created/Updated admin user: admin@example.com';
END $$;

-- ============================================
-- VERIFY USERS WERE CREATED
-- ============================================

-- Check auth.users table
SELECT 
  'auth.users' as table_name,
  id,
  email,
  email_confirmed_at IS NOT NULL as email_confirmed,
  created_at
FROM auth.users
WHERE email IN ('test@example.com', 'admin@example.com')
ORDER BY email;

-- Check profiles table
SELECT 
  'profiles' as table_name,
  id,
  email,
  name,
  username,
  role,
  created_at
FROM public.profiles
WHERE email IN ('test@example.com', 'admin@example.com')
ORDER BY email;

-- ============================================
-- ✅ SUCCESS! Login Credentials:
-- ============================================
--
-- REGULAR USER:
--   Email:    test@example.com
--   Password: password123
--   Access:   Browse books, reviews, profile, reading lists
--
-- ADMIN USER:
--   Email:    admin@example.com
--   Password: admin123
--   Access:   Full admin panel + all user features
--
-- ============================================
