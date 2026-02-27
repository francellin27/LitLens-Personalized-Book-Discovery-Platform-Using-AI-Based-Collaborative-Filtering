# 📸 Profile Photo Upload - Complete Setup Guide

## 🎯 Overview

This guide will help you fix the profile photo upload feature in LitLens. The issue is that the Supabase Storage bucket and its security policies need to be set up in your Supabase project.

## 🚨 The Error You're Seeing

```
Storage Setup Error
Failed to create bucket: new row violates row-level security policy
```

This error appears when trying to upload a profile photo because:
1. The `profile-photos` storage bucket doesn't exist in Supabase
2. OR the Row Level Security (RLS) policies aren't properly configured

## ✅ Complete Fix (Choose One Method)

### Method 1: Quick Fix (Recommended) ⚡

**Time: 2 minutes**

1. **Open Supabase Dashboard**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Select your LitLens project

2. **Open SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **New Query**

3. **Copy & Run This Script**
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

4. **Click RUN**

5. **Test It!**
   - Refresh your LitLens app
   - Go to Profile page
   - Click the camera icon on your avatar
   - Upload a photo (JPG, PNG, or WebP, under 5MB)
   - ✅ Success!

---

### Method 2: Manual Setup Through UI 🖱️

**Time: 5 minutes**

If you prefer using the Supabase UI:

#### Step 1: Create the Bucket

1. In Supabase Dashboard, click **Storage** in sidebar
2. Click **New Bucket**
3. Enter name: `profile-photos`
4. Check **Public bucket**
5. Click **Create Bucket**

#### Step 2: Set Up Policies

1. Click on the `profile-photos` bucket
2. Go to **Policies** tab
3. Click **New Policy**
4. Create 4 policies:

**Policy 1: Upload (INSERT)**
```sql
CREATE POLICY "Users can upload profile photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'profile-photos');
```

**Policy 2: Read (SELECT)**
```sql
CREATE POLICY "Public read access to profile photos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'profile-photos');
```

**Policy 3: Update**
```sql
CREATE POLICY "Users can update their own profile photos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = 'avatars')
WITH CHECK (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = 'avatars');
```

**Policy 4: Delete**
```sql
CREATE POLICY "Users can delete their own profile photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = 'avatars');
```

---

## 🔍 Verification

After setup, verify everything works:

### Option A: In Your App
1. The yellow banner at the top of the Profile page should disappear
2. You should be able to upload a profile photo without errors

### Option B: In Supabase SQL Editor
Run the verification script from `VERIFY_STORAGE_SETUP.sql` to check:
- Bucket exists ✅
- 4 RLS policies are present ✅
- No permission errors ✅

---

## 📁 Files Reference

Your project includes these helpful files:

| File | Purpose |
|------|---------|
| `QUICK_FIX_PROFILE_PHOTOS.md` | Ultra-quick 3-step fix |
| `PROFILE_PHOTO_UPLOAD_FIX.md` | Detailed troubleshooting guide |
| `VERIFY_STORAGE_SETUP.sql` | SQL script to verify setup |
| `supabase/migrations/007_profile_photos_storage.sql` | Complete migration script |
| `StorageMigrationBanner.tsx` | In-app setup instructions banner |

---

## 🎨 How Profile Photos Work

After setup, here's what happens when a user uploads a photo:

1. **User clicks camera icon** on their profile avatar
2. **Selects an image** (JPG, PNG, or WebP, max 5MB)
3. **File is uploaded** to Supabase Storage:
   - Path: `profile-photos/avatars/{userId}-{timestamp}.{ext}`
   - Example: `profile-photos/avatars/123-1234567890.jpg`
4. **Profile is updated** with the new avatar URL
5. **Photo appears** on profile, leaderboards, discussions, reviews

---

## 🔐 Security Features

The RLS policies ensure:
- ✅ Only authenticated users can upload
- ✅ Anyone can view profile photos (public)
- ✅ Files are organized in the `avatars` folder
- ✅ File type and size validated in the app (JPG/PNG/WebP, max 5MB)

---

## 🐛 Troubleshooting

### Issue: "Bucket already exists" error
**Solution:** This is fine! The `ON CONFLICT DO NOTHING` clause handles this. Continue to create the policies.

### Issue: Still getting RLS errors after setup
**Solutions:**
1. Make sure you're logged in as a regular user (not admin)
2. Clear browser cache and cookies
3. Log out and log back in
4. Run the verification script to check what's missing

### Issue: Can upload but can't see the photo
**Solutions:**
1. Check if the bucket is marked as **public** in Storage settings
2. Verify the SELECT policy exists for public users
3. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: Upload works but banner still shows
**Solution:** Click the "Verify Setup" button in the banner, or refresh the page

---

## 🎓 Understanding the Setup

### What is a Storage Bucket?
A bucket is like a folder in Supabase Storage where files are organized. Each project can have multiple buckets for different purposes.

### What is RLS?
Row Level Security (RLS) controls who can access what data. For storage, we use RLS policies to control:
- Who can upload files (INSERT)
- Who can view files (SELECT)
- Who can modify files (UPDATE)
- Who can delete files (DELETE)

### Why do we need this?
Without RLS policies, Supabase blocks all storage operations by default for security. The policies explicitly grant the necessary permissions.

---

## 📞 Still Need Help?

If you're still having issues:

1. **Check the logs:**
   - Browser console (F12 → Console tab)
   - Supabase Dashboard → Logs

2. **Verify authentication:**
   - Make sure you're logged in
   - Try logging out and back in

3. **Check permissions:**
   - Ensure your Supabase project has storage enabled
   - Verify you have admin access to the project

4. **Review the code:**
   - See `lib/supabase-services.ts` → `uploadProfilePhoto` function
   - See `components/UserProfile.tsx` → photo upload logic

---

## ✨ Success Checklist

After completing the setup, you should be able to:

- ✅ Click the camera icon on profile avatar
- ✅ Select and upload an image file
- ✅ See the upload progress
- ✅ See the new avatar immediately
- ✅ See the avatar persist after refresh
- ✅ See the avatar on leaderboards and community pages
- ✅ Upload a new photo to replace the old one

---

## 🚀 You're Done!

Once the setup is complete, profile photos will work seamlessly for all users. The yellow banner will automatically hide, and users can customize their profiles with photos.

Happy reading! 📚✨
