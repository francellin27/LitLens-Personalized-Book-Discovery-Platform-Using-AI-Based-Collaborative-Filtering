# Storage Bucket Setup Guide

## Error Fixed

**Previous Error:** `Error creating bucket: StorageApiError: new row violates row-level security policy`

**Solution:** Storage buckets cannot be created from client-side code due to security policies. They must be created through SQL migrations.

## How to Enable Profile Photo Uploads

The storage bucket for profile photos is created automatically when you run the Supabase migrations. Follow these steps:

### Step 1: Run the Migration

The migration file `007_profile_photos_storage.sql` creates the storage bucket and sets up the necessary permissions.

**In Supabase Dashboard:**
1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `/supabase/migrations/007_profile_photos_storage.sql`
5. Click **Run**

### Step 2: Verify Setup

After running the migration, verify it worked:

```sql
-- Check if bucket exists
SELECT * FROM storage.buckets WHERE id = 'litlens-profile-photos';

-- Check if policies are created
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage' 
  AND policyname LIKE '%avatar%';
```

### Step 3: Test Upload

Once the migration is complete, profile photo uploads should work automatically. Users can upload photos from their profile edit dialog.

## What the Migration Does

1. **Creates Storage Bucket**: Creates a public bucket named `litlens-profile-photos`
2. **Sets Up RLS Policies**:
   - Authenticated users can upload profile photos
   - Anyone can view profile photos (for avatars to display)
   - Authenticated users can update their photos
   - Authenticated users can delete their photos

## Code Changes

The application code has been updated to:
- **NOT** attempt to create buckets from client-side (prevents RLS errors)
- Simply verify the bucket exists before uploading
- Provide helpful warnings if the bucket is missing
- Allow the upload process to continue (it will fail gracefully with a better error message)

## Troubleshooting

### If uploads still don't work:

1. **Check bucket exists:**
   ```sql
   SELECT * FROM storage.buckets WHERE id = 'litlens-profile-photos';
   ```

2. **Check policies exist:**
   ```sql
   SELECT * FROM pg_policies 
   WHERE tablename = 'objects' 
     AND schemaname = 'storage';
   ```

3. **Check bucket is public:**
   ```sql
   SELECT id, name, public FROM storage.buckets 
   WHERE id = 'litlens-profile-photos';
   ```
   The `public` column should be `true`.

4. **Re-run the migration:**
   If something went wrong, you can safely re-run migration 007. It uses `ON CONFLICT DO NOTHING` and `DROP POLICY IF EXISTS` to avoid errors.

## Technical Details

**Why buckets can't be created from client code:**
- The `storage.buckets` table has Row Level Security (RLS) enabled
- Only database admins can insert into this table
- Client-side code (even with authentication) doesn't have these permissions
- This is a security feature to prevent users from creating unlimited storage buckets

**The correct approach:**
- Create buckets through SQL migrations (admin level)
- Client code only uploads files to existing buckets
- RLS policies on `storage.objects` control who can upload/view files
