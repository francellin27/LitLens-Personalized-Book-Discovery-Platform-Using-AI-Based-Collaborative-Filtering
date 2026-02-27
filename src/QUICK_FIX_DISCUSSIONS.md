# 🚀 QUICK FIX: Discussions Errors

## The Error You're Seeing

```
❌ Could not find a relationship between 'discussions' and 'profiles'
❌ Could not find the 'book_id' column of 'discussions'
```

## Why It's Happening

The `discussions` tables don't exist in your Supabase database.

## Fix It in 60 Seconds ⏱️

### 1️⃣ Open Your App
Go to the **Community** page in LitLens

### 2️⃣ Click Two Buttons
You'll see a red banner with:
- **"📋 Copy Migration SQL"** ← Click this
- **"Open Supabase SQL Editor"** ← Click this

### 3️⃣ Paste & Run
In Supabase:
- Click "New Query"
- Paste (Ctrl+V / Cmd+V)
- Click "Run" (or Ctrl+Enter / Cmd+Enter)

### 4️⃣ Refresh
Refresh your LitLens app - Done! ✅

---

## Don't See the Banner?

### Manual Method

**Copy this SQL:**
```sql
-- Open /supabase/migrations/004_discussions_tables.sql
-- Copy all the SQL from that file
```

**Paste in Supabase:**
1. Go to: https://supabase.com/dashboard
2. Your Project → SQL Editor → New Query
3. Paste & Run

---

## How to Know It Worked

✅ Banner disappears  
✅ Discussions load on Community page  
✅ No more errors in console  
✅ Can create new discussions  

---

## Still Stuck?

Read: `/RUN_DISCUSSIONS_MIGRATION.md`  
Or: `/FIX_DISCUSSIONS_ERROR.md`

---

**That's it!** Migration takes 5 seconds to run. 🎯
