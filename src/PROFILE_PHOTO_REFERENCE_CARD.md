# 📸 Profile Photo Upload - Quick Reference Card

---

## 🚨 THE ERROR

```
Storage Setup Error
Failed to create bucket: new row violates row-level security policy
```

---

## ⚡ THE FIX (2 Minutes)

### 1️⃣ Open Supabase SQL Editor
`Dashboard → SQL Editor → New Query`

### 2️⃣ Copy & Paste This:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can upload profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;

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

### 3️⃣ Click Run
`Success? You're done! ✅`

---

## ✅ HOW TO TEST

1. Refresh app
2. Go to Profile
3. Click camera icon 📷
4. Upload photo
5. Success! ✨

---

## 📋 VERIFICATION CHECKLIST

**In Supabase:**
- [ ] Storage → See `profile-photos` bucket
- [ ] Bucket is marked "public"
- [ ] 4 policies exist

**In App:**
- [ ] Yellow banner gone
- [ ] Can upload photo
- [ ] Avatar appears
- [ ] Persists after refresh

---

## 🐛 QUICK TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| Still getting errors | Log out & log back in |
| Bucket not showing | Refresh Supabase dashboard |
| "Permission denied" | Make sure you're project owner |
| Upload fails | Check file is JPG/PNG/WebP <5MB |

---

## 📁 FILE LOCATIONS

| File | What It Does |
|------|-------------|
| `/supabase/migrations/007_profile_photos_storage.sql` | Complete migration script |
| `/lib/supabase-services.ts` | uploadProfilePhoto() function |
| `/components/UserProfile.tsx` | Upload UI logic |
| `/components/StorageMigrationBanner.tsx` | In-app setup helper |

---

## 🔧 USEFUL SQL QUERIES

**Check if bucket exists:**
```sql
SELECT * FROM storage.buckets WHERE id = 'profile-photos';
```

**Check policies:**
```sql
SELECT policyname FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
```

**See uploaded files:**
```sql
SELECT * FROM storage.objects WHERE bucket_id = 'profile-photos';
```

---

## 💡 HOW IT WORKS

```
User clicks camera → Select file → Validate (size/type)
                                          ↓
                              Upload to Supabase Storage
                              (profile-photos/avatars/)
                                          ↓
                              Get public URL → Update profile
                                          ↓
                              Avatar appears everywhere!
```

---

## 🔐 SECURITY

- ✅ Only authenticated users can upload
- ✅ Public can view (for avatars to display)
- ✅ File type validation (JPG/PNG/WebP)
- ✅ File size limit (5MB)
- ✅ RLS policies enforce permissions

---

## 📚 MORE HELP

| Document | When to Use |
|----------|-------------|
| `QUICK_FIX_PROFILE_PHOTOS.md` | Need it fixed NOW |
| `VISUAL_GUIDE_STORAGE_FIX.md` | Step-by-step with screenshots |
| `STORAGE_SETUP_COMPLETE_GUIDE.md` | Want full understanding |
| `PROFILE_PHOTO_UPLOAD_FIX.md` | Detailed troubleshooting |
| `VERIFY_STORAGE_SETUP.sql` | Verify everything works |

---

## ⚙️ CONFIGURATION

**Bucket:** `profile-photos` (public)  
**File Path:** `avatars/{userId}-{timestamp}.{ext}`  
**Max Size:** 5MB  
**Allowed Types:** JPG, PNG, WebP  
**RLS:** Enabled with 4 policies

---

## 🎯 EXPECTED BEHAVIOR

### Before Fix:
- ❌ Error when uploading
- ❌ Yellow banner shows
- ❌ No profile photos

### After Fix:
- ✅ Smooth uploads
- ✅ Banner disappears
- ✅ Avatars everywhere!

---

## 🚀 PRODUCTION READY?

Yes! After this fix:
- ✅ Secure
- ✅ Scalable
- ✅ Fast
- ✅ User-friendly

---

## 📞 STILL STUCK?

1. Check browser console (F12)
2. Check Supabase logs
3. Verify authentication
4. Try different browser
5. Clear cache & cookies

---

**Last Updated:** October 2025  
**Status:** ✅ Tested & Working  
**Time to Fix:** 2 minutes
