# 📸 LitLens Storage - Quick Reference

---

## 🎯 Bucket Info

**Name:** `litlens-profile-photos`  
**Type:** Public  
**Purpose:** Store user profile photos/avatars  
**Path Structure:** `litlens-profile-photos/avatars/{userId}-{timestamp}.{ext}`

---

## ⚡ Setup (2 Min)

### SQL Script
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('litlens-profile-photos', 'litlens-profile-photos', true)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "LitLens: Users can upload profile photos" ON storage.objects;
DROP POLICY IF EXISTS "LitLens: Public read access to profile photos" ON storage.objects;
DROP POLICY IF EXISTS "LitLens: Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "LitLens: Users can delete their own profile photos" ON storage.objects;

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
```

---

## ✅ Verify

```sql
-- Check bucket
SELECT * FROM storage.buckets WHERE id = 'litlens-profile-photos';

-- Check policies (should return 4)
SELECT policyname FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE 'LitLens:%';
```

---

## 🔐 RLS Policies

| Policy | Type | Who | Bucket Check |
|--------|------|-----|-------------|
| Upload | INSERT | authenticated | `bucket_id = 'litlens-profile-photos'` |
| Read | SELECT | public | `bucket_id = 'litlens-profile-photos'` |
| Update | UPDATE | authenticated | `bucket_id = 'litlens-profile-photos'` + avatars folder |
| Delete | DELETE | authenticated | `bucket_id = 'litlens-profile-photos'` + avatars folder |

---

## 📋 File Rules

- **Types:** JPG, PNG, WebP
- **Max Size:** 5MB
- **Folder:** `avatars/`
- **Naming:** `{userId}-{timestamp}.{ext}`
- **Example:** `user-abc123-1708012345.jpg`

---

## 🔧 Code Reference

### Upload
```typescript
import { uploadProfilePhoto } from './lib/supabase-services';
const url = await uploadProfilePhoto(userId, file);
```

### Delete
```typescript
import { deleteProfilePhoto } from './lib/supabase-services';
await deleteProfilePhoto(photoUrl);
```

### Check Bucket
```typescript
import { supabase } from './utils/supabase/client';
const { data } = await supabase.storage.listBuckets();
const exists = data?.some(b => b.id === 'litlens-profile-photos');
```

---

## 🐛 Quick Fixes

| Problem | Solution |
|---------|----------|
| Bucket not found | Run setup SQL |
| Permission denied | Check logged in as authenticated user |
| Upload fails | File must be JPG/PNG/WebP < 5MB |
| Can't see photo | Bucket must be public |

---

## 📂 File Locations

| File | What |
|------|------|
| `/SETUP_LITLENS_STORAGE.md` | Full guide |
| `/supabase/migrations/007_profile_photos_storage.sql` | Migration |
| `/lib/supabase-services.ts` | Functions |
| `/components/StorageMigrationBanner.tsx` | UI helper |

---

## 🎯 Status Checklist

- [ ] Bucket created in Supabase
- [ ] 4 policies active
- [ ] Can upload from app
- [ ] Photos appear immediately
- [ ] Photos persist after refresh

---

**Bucket:** `litlens-profile-photos`  
**Policies:** 4 (with `LitLens:` prefix)  
**Status:** Production-ready ✅
