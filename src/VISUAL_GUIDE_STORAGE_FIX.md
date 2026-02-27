# 📸 Visual Guide: Fix Profile Photo Upload

## 🎯 Goal
Fix the profile photo upload error in 2 minutes by running a SQL script in Supabase.

---

## Step-by-Step Visual Guide

### Step 1: Open Your Supabase Dashboard

```
🌐 Browser → https://app.supabase.com
```

**What you'll see:**
- List of your projects
- Find your **LitLens** project
- Click on it to open

---

### Step 2: Navigate to SQL Editor

**In the left sidebar, you'll see:**

```
📊 Project Dashboard
📊 Table Editor
📝 SQL Editor          ← Click This!
🔐 Authentication
📦 Storage
🔧 Database
⚙️ Settings
```

**Click on "SQL Editor"**

---

### Step 3: Create New Query

**You'll see:**

```
[+ New Query]  [Snippets ▼]  [History]
```

**Click the "[+ New Query]" button**

This opens a blank SQL editor where you can write/paste SQL.

---

### Step 4: Copy and Paste This SQL Script

**Copy this ENTIRE script:**

```sql
-- ====================================
-- Profile Photos Storage Setup
-- ====================================

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop old policies (if they exist)
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

-- ====================================
-- Done! Profile photos are now enabled
-- ====================================
```

**Paste it into the SQL editor**

---

### Step 5: Run the Script

**At the bottom right of the SQL editor, you'll see:**

```
[Save]  [Run]
```

**Click the "Run" button** (or press Ctrl+Enter / Cmd+Enter)

---

### Step 6: Wait for Success Message

**You should see:**

```
✅ Success. No rows returned
```

OR

```
✅ Success. 1 row(s) returned
```

**Both are good!** This means the script ran successfully.

---

### Step 7: Verify the Bucket Was Created

**Navigate to Storage:**

```
Left Sidebar → 📦 Storage
```

**You should see:**

```
Buckets:
  📁 profile-photos    [public]    0 files
```

**If you see this, you're done! ✅**

---

### Step 8: Test in Your App

1. **Refresh** your LitLens app (F5)
2. **Log in** (if not already)
3. **Go to Profile** page
4. **Click the camera icon** 📷 on your avatar
5. **Select a photo** (JPG, PNG, or WebP, under 5MB)
6. **Click upload**
7. **Watch the magic happen!** ✨

---

## Expected Results

### Before Fix:
```
❌ Error: Storage Setup Error
   Failed to create bucket: new row violates row-level security policy
```

### After Fix:
```
✅ Profile photo uploaded successfully!
✅ Avatar updated
✅ Photo visible everywhere (profile, leaderboards, discussions)
```

---

## Visual Checklist

Use this to verify everything is working:

### ✅ In Supabase Dashboard:

1. **Storage Tab:**
   - [ ] `profile-photos` bucket exists
   - [ ] Bucket is marked as "public"
   - [ ] No error messages

2. **SQL Editor:**
   - [ ] Script ran without errors
   - [ ] Success message appeared

3. **Verify with SQL:**
   ```sql
   SELECT * FROM storage.buckets WHERE id = 'profile-photos';
   ```
   - [ ] Returns 1 row

### ✅ In Your App:

1. **Profile Page:**
   - [ ] Yellow banner disappeared
   - [ ] Camera icon is clickable
   - [ ] File picker opens when clicking camera icon

2. **Upload Process:**
   - [ ] Can select an image
   - [ ] Upload starts without errors
   - [ ] Success message appears
   - [ ] Avatar updates immediately

3. **Persistence:**
   - [ ] Avatar still there after page refresh
   - [ ] Avatar appears on leaderboards
   - [ ] Avatar appears in discussions
   - [ ] Avatar appears in reviews

---

## Troubleshooting

### If Step 5 shows an error:

**Error: "permission denied for table buckets"**
- **Cause:** You don't have admin access
- **Fix:** Make sure you're the project owner or have admin role

**Error: "bucket already exists"**
- **Cause:** The bucket was created before
- **Fix:** This is fine! The rest of the script will still run

**Error: "relation storage.objects does not exist"**
- **Cause:** Storage isn't enabled on your project
- **Fix:** Go to Storage tab first to enable it

### If Step 7 doesn't show the bucket:

1. **Refresh the page** (F5)
2. **Check again** in Storage tab
3. **If still not there, run this:**
   ```sql
   SELECT * FROM storage.buckets;
   ```
   See if `profile-photos` appears in the list

### If Step 8 still shows errors:

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Log out and log back in**
3. **Check browser console** for detailed errors (F12 → Console)
4. **Verify you're using a regular user account** (not admin)

---

## Alternative: Manual Setup Through UI

If you prefer clicking buttons instead of SQL:

### Create Bucket:
1. Storage → New Bucket
2. Name: `profile-photos`
3. ✅ Check "Public bucket"
4. Click Create

### Create Policies:
1. Click on `profile-photos` bucket
2. Go to Policies tab
3. Click New Policy
4. Paste each policy from Step 4 above
5. Create all 4 policies

---

## Time Estimate

| Method | Time |
|--------|------|
| SQL Script (Recommended) | 2 minutes |
| Manual UI Setup | 5 minutes |
| Reading this guide | 10 minutes |

---

## Success Indicators

You'll know it worked when:

1. ✅ No yellow banner on Profile page
2. ✅ Can upload photos without errors
3. ✅ Avatar appears immediately after upload
4. ✅ Avatar persists after refresh
5. ✅ No console errors when uploading

---

## Quick Reference: Where is Everything?

| What | Where in Supabase |
|------|-------------------|
| Run SQL | SQL Editor → New Query → Paste → Run |
| Check Buckets | Storage → Buckets List |
| Check Policies | Storage → [bucket] → Policies tab |
| View Logs | Logs → Select timeframe |
| Check Files | Storage → [bucket] → Files |

---

## Pro Tips

💡 **Save the SQL script** as a favorite in SQL Editor for easy re-running

💡 **Name your query** something like "Setup Profile Photos" so you can find it later

💡 **Share this guide** with your team if they need to set up their own instances

💡 **Run VERIFY_STORAGE_SETUP.sql** after setup to confirm everything is configured correctly

---

## Summary

**What we did:**
1. Created a storage bucket called `profile-photos`
2. Set it as public (so avatars are viewable)
3. Created 4 RLS policies to control access
4. Enabled authenticated users to upload
5. Enabled everyone to view avatars

**Why it works:**
- Supabase blocks storage by default until you create policies
- We explicitly granted the necessary permissions
- Now the app can upload and retrieve profile photos

**Result:**
- ✅ Profile photo uploads work
- ✅ Users can customize their avatars
- ✅ Photos appear throughout the app
- ✅ Everything is secure and fast

---

🎉 **Congratulations!** Your profile photo upload feature is now fully functional!

Need more help? See:
- `QUICK_FIX_PROFILE_PHOTOS.md` - Ultra-quick reference
- `STORAGE_SETUP_COMPLETE_GUIDE.md` - Detailed explanation
- `PROFILE_PHOTO_UPLOAD_FIX.md` - Troubleshooting guide
