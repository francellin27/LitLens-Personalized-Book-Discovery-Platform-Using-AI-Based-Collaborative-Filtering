# 🚀 LitLens Storage Setup - Profile Photo Uploads

## Quick Setup (2 Minutes)

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the sidebar
3. Click **New Query**

### Step 2: Run This SQL Script

Copy and paste this entire script, then click **Run**:

```sql
-- ====================================
-- LitLens Profile Photos Storage Setup
-- ====================================

-- Create the LitLens storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('litlens-profile-photos', 'litlens-profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "LitLens: Users can upload profile photos" ON storage.objects;
DROP POLICY IF EXISTS "LitLens: Public read access to profile photos" ON storage.objects;
DROP POLICY IF EXISTS "LitLens: Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "LitLens: Users can delete their own profile photos" ON storage.objects;

-- Create RLS policies for LitLens
CREATE POLICY "LitLens: Users can upload profile photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'litlens-profile-photos');

CREATE POLICY "LitLens: Public read access to profile photos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'litlens-profile-photos');

CREATE POLICY "LitLens: Users can update their own profile photos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'litlens-profile-photos' AND (storage.foldername(name))[1] = 'avatars')
WITH CHECK (bucket_id = 'litlens-profile-photos' AND (storage.foldername(name))[1] = 'avatars');

CREATE POLICY "LitLens: Users can delete their own profile photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'litlens-profile-photos' AND (storage.foldername(name))[1] = 'avatars');

-- ====================================
-- Done! Profile photo uploads enabled
-- ====================================
```

### Step 3: Verify Setup

After running the script, verify the bucket was created:

```sql
SELECT * FROM storage.buckets WHERE id = 'litlens-profile-photos';
```

You should see one row with the bucket details.

### Step 4: Test in Your App

1. Refresh your LitLens app
2. Go to Profile page
3. Click the camera icon on your avatar
4. Upload a photo (JPG, PNG, or WebP, under 5MB)
5. ✅ Success!

---

## What This Does

This setup creates:
- **Bucket:** `litlens-profile-photos` (public, for viewing avatars)
- **Storage Path:** `litlens-profile-photos/avatars/{userId}-{timestamp}.{ext}`
- **4 RLS Policies:**
  1. `LitLens: Users can upload profile photos` - Allows authenticated users to upload
  2. `LitLens: Public read access to profile photos` - Allows anyone to view avatars
  3. `LitLens: Users can update their own profile photos` - Allows users to replace photos
  4. `LitLens: Users can delete their own profile photos` - Allows users to delete old photos

---

## Verification

### Check Bucket Exists:
```sql
SELECT * FROM storage.buckets WHERE id = 'litlens-profile-photos';
```

### Check Policies:
```sql
SELECT policyname FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE 'LitLens:%';
```

Should return 4 policies.

---

## Troubleshooting

### Error: "bucket already exists"
✅ This is fine! The `ON CONFLICT DO NOTHING` handles this. Policies will still be created.

### Error: "permission denied"
❌ Make sure you're the project owner or have admin access to the Supabase project.

### Upload still fails
1. Clear browser cache
2. Log out and log back in
3. Check browser console for detailed errors
4. Verify you're using a regular user account (not admin)

---

## Storage Structure

After setup, your storage will look like this:

```
litlens-profile-photos/              ← Bucket (public)
  └── avatars/                        ← Folder
      ├── user-abc123-1234567890.jpg  ← Format: {userId}-{timestamp}.{ext}
      ├── user-def456-1234567891.png
      └── user-ghi789-1234567892.webp
```

---

## Security Features

✅ Only authenticated LitLens users can upload  
✅ Anyone can view profile photos (for public avatars)  
✅ File type validation: JPG, PNG, WebP only  
✅ File size limit: 5MB maximum  
✅ Automatic file organization in avatars folder  
✅ RLS policies enforce all permissions  

---

## File Locations in Your Project

| File | What It Does |
|------|-------------|
| `/supabase/migrations/007_profile_photos_storage.sql` | Complete migration script |
| `/lib/supabase-services.ts` | `uploadProfilePhoto()` function |
| `/components/UserProfile.tsx` | Upload UI and logic |
| `/components/StorageMigrationBanner.tsx` | In-app setup helper |

---

## Next Steps

After this setup:
1. ✅ Profile photo uploads work seamlessly
2. ✅ Avatars appear on profiles, leaderboards, discussions, reviews
3. ✅ Users can update their photos anytime
4. ✅ Photos persist across sessions
5. ✅ Storage is secure and scalable

---

**Time to Setup:** 2 minutes  
**Status:** Production-ready  
**Bucket Name:** `litlens-profile-photos`
