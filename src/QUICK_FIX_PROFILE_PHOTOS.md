# 🔧 Quick Fix: Profile Photo Upload

## The Error You're Seeing
```
Storage Setup Error
Failed to create bucket: new row violates row-level security policy
```

## Quick 3-Step Fix

### ✅ Step 1: Open Supabase SQL Editor
1. Go to your Supabase dashboard
2. Click **SQL Editor** in the sidebar
3. Click **New Query**

### ✅ Step 2: Run This SQL Script

Copy and paste this entire script, then click **Run**:

```sql
-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Users can upload profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;

-- Create new policies
CREATE POLICY "Users can upload profile photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'profile-photos');

CREATE POLICY "Public read access to profile photos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can update their own profile photos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = 'avatars')
WITH CHECK (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = 'avatars');

CREATE POLICY "Users can delete their own profile photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = 'avatars');
```

### ✅ Step 3: Test Upload
1. Refresh your LitLens app
2. Go to Profile page
3. Click the camera icon
4. Upload a photo
5. ✨ It should work now!

## That's It!

The profile photo upload should now work perfectly. 

If you still have issues, see `PROFILE_PHOTO_UPLOAD_FIX.md` for detailed troubleshooting.
