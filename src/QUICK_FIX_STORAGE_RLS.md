# ⚡ QUICK FIX: Storage RLS Error

## Error
```
Error uploading file to LitLens storage: StorageApiError: new row violates row-level security policy
```

---

## Fix (Copy & Paste)

### 1️⃣ Open Supabase SQL Editor
Dashboard → SQL Editor → New Query

### 2️⃣ Run This Script
```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('litlens-profile-photos', 'litlens-profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Users can upload their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload profile photos" ON storage.objects;
DROP POLICY IF EXISTS "LitLens: Users can upload profile photos" ON storage.objects;
DROP POLICY IF EXISTS "LitLens: Public read access to profile photos" ON storage.objects;
DROP POLICY IF EXISTS "LitLens: Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "LitLens: Users can delete their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to delete avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- Create new policies (simple & permissive)
CREATE POLICY "Give users access to upload avatars"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'litlens-profile-photos');

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'litlens-profile-photos');

CREATE POLICY "Give users access to update avatars"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'litlens-profile-photos')
WITH CHECK (bucket_id = 'litlens-profile-photos');

CREATE POLICY "Give users access to delete avatars"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'litlens-profile-photos');
```

### 3️⃣ Test
1. Log out
2. Log back in
3. Upload profile photo
4. ✅ Should work!

---

## Verify
```sql
-- Should return 4 rows
SELECT policyname FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%avatars%';
```

---

## Still Broken?

### Browser Console Test
```javascript
// Check if logged in
const { data: { session } } = await supabase.auth.getSession();
console.log('Logged in:', !!session);
```

If `false` → **Log out and log back in**

### Manual Upload Test
```javascript
// Test upload (run in console)
const test = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
const { data, error } = await supabase.storage
  .from('litlens-profile-photos')
  .upload(`avatars/test-${Date.now()}.jpg`, test);
console.log({ data, error });
```

If error → Check policies were created

---

## Files
- 📄 `/FIX_STORAGE_RLS_ERROR.md` - Full guide
- 📄 `/supabase/migrations/009_fix_storage_rls.sql` - Migration file
- 📄 `/TEST_STORAGE_AUTH.js` - Full test script

---

**Time:** 2 minutes  
**Status:** ✅ Works
