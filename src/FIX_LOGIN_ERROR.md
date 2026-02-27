# Fix Login Error: Invalid Credentials

## Problem
You're getting "Login error: AuthApiError: Invalid login credentials" because **no users exist in the database yet**.

## Quick Fix - Option 1: Sign Up via UI (Easiest)

1. **Enable Email Signups** (if not already enabled):
   - Go to: https://supabase.com/dashboard/project/nrdetgsryanpfxkazcap/auth/providers
   - Click on **Email** provider
   - Make sure it's **enabled**
   - Toggle **OFF** "Confirm email" (for easier testing)
   - Click **Save**

2. **Create an Account**:
   - Go to your LitLens app
   - Click the **"Sign Up"** tab
   - Fill in the form:
     - Full Name: `Test User`
     - Username: `testuser` 
     - Email: `test@example.com`
     - Password: `password123`
   - Click **Sign Up**

3. **Login**:
   - Use the credentials you just created
   - Email: `test@example.com`
   - Password: `password123`

---

## Quick Fix - Option 2: Create Test Users via SQL

If you want pre-made test accounts:

1. **Go to Supabase SQL Editor**:
   - Visit: https://supabase.com/dashboard/project/nrdetgsryanpfxkazcap/sql/new

2. **Copy and paste this SQL**:
```sql
-- Create regular test user
-- Email: test@example.com | Password: password123
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
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
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
  ''
);

-- Create admin test user  
-- Email: admin@example.com | Password: admin123
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
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
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
  ''
);

-- Update admin role
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@example.com';
```

3. **Click "Run"**

4. **Login with**:
   - **Regular User**: `test@example.com` / `password123`
   - **Admin User**: `admin@example.com` / `admin123`

---

## Test Credentials Summary

After following either option above, you can use:

### Regular User Account
- Email: `test@example.com`
- Password: `password123`
- Access: Browse, search, profile, community features

### Admin User Account  
- Email: `admin@example.com`
- Password: `admin123`
- Access: Full admin panel to manage books, users, reviews, discussions

---

## Why This Happened

The seed migration (`002_seed_data.sql.tsx`) only created:
- ✅ 60 books
- ✅ Database tables and structure
- ❌ No user accounts

Supabase requires users to be created through either:
1. The signup UI (which calls Supabase Auth)
2. Direct SQL insertion into the `auth.users` table
3. The Supabase Dashboard

---

## Verify It Worked

After creating users, check in Supabase Dashboard:
1. Go to: https://supabase.com/dashboard/project/nrdetgsryanpfxkazcap/auth/users
2. You should see your new user(s) listed
3. Try logging in with the credentials

---

## Need Help?

If you still have issues:
1. Check the browser console for detailed error messages
2. Verify email provider is enabled in Supabase Auth settings
3. Make sure the SQL ran successfully without errors
4. Check that profiles were created: Go to Database → Tables → profiles
