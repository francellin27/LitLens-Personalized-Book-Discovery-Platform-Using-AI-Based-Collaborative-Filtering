# Profile Photo Loading Fix Guide

## The Problem
Profile photos are uploading but not displaying. The test image shows "Test image failed to load".

## Root Cause
The Supabase storage bucket `litlens-profile-photos` either:
1. Doesn't exist
2. Isn't public
3. Has incorrect RLS policies blocking access

## Quick Fix (2 steps)

### Step 1: Run the SQL Script in Supabase
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the file `/FIX_STORAGE_NOW.sql`
4. Copy and paste the entire contents
5. Click **Run**
6. Verify the results show the bucket is created and policies are in place

### Step 2: Test in the App
1. Go to your profile page
2. Click the **"Test Storage"** button in the debug panel
3. Check the console - it should show:
   - "All buckets" including `litlens-profile-photos`
   - "Bucket details" with `public: true`
   - Success toast message

4. Upload a new photo
5. The debug panel should now show the test image loading successfully

## What the Fix Does

### Bucket Creation
- Creates the `litlens-profile-photos` bucket if it doesn't exist
- Sets it to **public** (required for images to be viewable)
- Sets size limit to 5MB
- Restricts to image types only

### RLS Policies
The fix creates 4 simple policies:
1. **Anyone can view avatars** - Public read access (this is why images load)
2. **Users can upload avatars** - Authenticated users can add new photos
3. **Users can update avatars** - Authenticated users can replace photos
4. **Users can delete avatars** - Authenticated users can remove photos

## Code Changes Made

### 1. Auto-Initialize Bucket
Added `initializeStorageBucket()` function that:
- Checks if bucket exists before uploading
- Creates bucket if missing
- Runs automatically on every upload

### 2. Better Error Logging
- Logs bucket settings after upload
- Logs file details before upload
- Shows detailed error messages

### 3. Delete Old Avatars
- Automatically deletes previous avatar files before uploading new ones
- Prevents storage from filling up with old photos

### 4. Debug Tools
Added two buttons in UserProfile:
- **Check DB** - Verifies avatar URL is in database
- **Test Storage** - Checks bucket existence and lists files

## Troubleshooting

### If images still don't load after running SQL:

1. **Check bucket exists:**
   ```sql
   SELECT * FROM storage.buckets WHERE id = 'litlens-profile-photos';
   ```
   Should show `public: true`

2. **Check policies exist:**
   ```sql
   SELECT * FROM pg_policies 
   WHERE tablename = 'objects' 
   AND policyname LIKE '%avatar%';
   ```
   Should show 4 policies

3. **Check bucket is actually public:**
   - Go to Supabase Dashboard → Storage
   - Click on `litlens-profile-photos`
   - Verify "Public bucket" toggle is ON

4. **Try uploading via Supabase UI:**
   - Go to Storage → litlens-profile-photos
   - Create `avatars` folder if it doesn't exist
   - Upload a test image
   - Right-click → Copy URL
   - Paste URL in browser - should load the image

### If bucket creation fails in SQL:

The app now creates buckets automatically! Just try uploading a photo and the code will:
1. Check if bucket exists
2. Create it if missing
3. Upload the file

## Console Debugging

When you upload a photo, you should see:
```
Upload started - User authenticated: <user-id>
Bucket already exists (or "Bucket created successfully")
Uploading to: avatars/<user-id>-<timestamp>.<ext>
Upload successful: { path: "avatars/..." }
Public URL generated: https://...
Bucket settings: { public: true, ... }
```

If you see errors, check:
- User is authenticated (session exists)
- File type is image/jpeg, image/png, or image/webp
- File size is under 5MB
- Bucket permissions are correct

## Quick Test

After running the SQL script:

1. Upload a photo
2. Check console for "✅ Test image loaded successfully!"
3. The avatar should appear in the profile header
4. The test image in the debug panel should load

## Need More Help?

If this still doesn't work:
1. Share the console logs from uploading
2. Click "Test Storage" and share the console output
3. Run this query and share results:
   ```sql
   SELECT id, name, public FROM storage.buckets;
   ```
