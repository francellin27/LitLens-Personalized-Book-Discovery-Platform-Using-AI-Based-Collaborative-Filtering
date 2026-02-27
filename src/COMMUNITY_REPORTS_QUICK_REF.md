# Community Reports - Quick Reference Card 🎯

## 🚀 Quick Start (2 Minutes)

### Test If It's Working

1. **Create Test Report**
   - Login as user → Any discussion → Flag icon → Submit
   - Check console: Should see `✅ Report created successfully`

2. **Check Admin Panel**
   - Login as admin → Admin Panel → Community → Reports
   - Click "Refresh Reports"
   - Check console: Should see `✅ Discussion reports loaded: X reports`

3. **If Reports Appear: ✅ WORKING**
4. **If Reports Don't Appear: ⚠️ SEE TROUBLESHOOTING**

---

## 🔧 Quick Fixes

### Fix 1: Not an Admin
```sql
-- Run in Supabase SQL Editor
UPDATE profiles SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### Fix 2: Table Missing
```sql
-- Run migration 006_discussion_reports.sql in SQL Editor
```

### Fix 3: RLS Issues
```sql
-- Run FIX_COMMUNITY_REPORTS.sql
-- (Copy entire file contents to SQL Editor)
```

### Fix 4: Reports Created But Not Showing
- Click "Refresh Reports" button in admin panel
- Check filter is set to "Pending" or "All"
- Verify admin role (Fix 1)

---

## 📋 Checklist

**Before Creating Report:**
- [ ] User is logged in
- [ ] Discussion exists
- [ ] Migration 006 has been run

**Before Viewing Reports:**
- [ ] Admin user has `role = 'admin'` in profiles
- [ ] Migration 006 has been run
- [ ] RLS policies exist (5 total)

**After Creating Report:**
- [ ] Success toast appears
- [ ] Console shows ✅ green checkmarks
- [ ] No errors in console

**After Loading Admin Panel:**
- [ ] Console shows ✅ reports loaded
- [ ] Count is > 0 in tab title
- [ ] Reports appear in UI

---

## 🔍 Console Log Cheat Sheet

### ✅ Good (Working)
```
✅ Report created successfully in database: {report}
✅ Discussion reports loaded: 5 reports
✅ Fetched discussion reports from database: 5 reports
```

### ❌ Bad (Not Working)
```
❌ Supabase error creating discussion report
❌ Error loading discussion reports
❌ Report creation returned null
```

### ⚠️ Warning (Check)
```
⚠️ No data returned from discussion_reports query
Database migration needed
```

---

## 🗂️ File Reference

| File | Purpose |
|------|---------|
| `VERIFY_COMMUNITY_REPORTS.sql` | Check current state |
| `FIX_COMMUNITY_REPORTS.sql` | Fix common issues |
| `COMMUNITY_REPORTS_DEBUGGING_GUIDE.md` | Full debugging guide |
| `COMMUNITY_REPORTS_FIX_V2.md` | What was changed |

---

## 🎨 UI Elements

### Admin Panel Location
```
Admin Panel → Community Tab → Community Reports Sub-tab
```

### Filter Options
- **Pending** (default) - New reports 🟡
- **Resolved** - Action taken 🟢
- **Dismissed** - No action needed ⚫
- **All** - Everything

### Actions
- **Refresh Reports** - Reload from database
- **Dismiss** - Mark as not valid
- **Resolve** - Mark as handled

---

## 🧪 Quick Test Report

**SQL to create test report:**
```sql
-- Get IDs
SELECT id FROM discussions LIMIT 1;  -- Copy this
SELECT id FROM profiles WHERE role = 'user' LIMIT 1;  -- Copy this

-- Insert test report (replace IDs)
INSERT INTO discussion_reports (
  discussion_id, reporter_id, reporter_name,
  content_title, content_type, original_author,
  reason, description, status
) VALUES (
  'DISCUSSION-ID-HERE',
  'USER-ID-HERE',
  'Test User',
  'Test Discussion',
  'Discussion',
  'Author Name',
  'Spam/Promotional',
  'TEST REPORT - CAN DELETE',
  'pending'
);

-- Verify
SELECT * FROM discussion_reports ORDER BY created_at DESC LIMIT 1;
```

---

## 📞 Troubleshooting Flowchart

```
Report not appearing?
        ↓
    Check console
        ↓
    See errors? ──YES→ Check error type:
        ↓              - Table missing → Run migration 006
        NO             - RLS error → Run FIX script
        ↓              - Auth error → Check login
    Run VERIFY script
        ↓
    Reports in DB? ──NO→ Issue with creation
        ↓                 Check user is logged in
        YES               Check console logs
        ↓
    User is admin? ─NO→ Run: UPDATE profiles SET role='admin'...
        ↓
        YES
        ↓
    Click "Refresh Reports"
        ↓
    Filter set to "All" or "Pending"?
        ↓
        YES
        ↓
    Should work now! ✅
```

---

## 💡 Common Scenarios

### Scenario 1: First Time Setup
1. Run migration 006
2. Set admin role
3. Create test report
4. Check admin panel
5. Should see report ✅

### Scenario 2: Reports Created, Not Visible
- **Cause:** Not admin or wrong filter
- **Fix:** Set admin role, check filter dropdown

### Scenario 3: Can't Create Reports
- **Cause:** Not logged in or RLS issue
- **Fix:** Login, run FIX script

### Scenario 4: Everything Works Except Count
- **Cause:** UI not updating
- **Fix:** Click "Refresh Reports" button

---

## 🎯 Success Criteria

**Working correctly when:**
- ✅ User can submit reports
- ✅ Success toast appears
- ✅ Console shows green checkmarks
- ✅ Admin sees reports in panel
- ✅ Count shows correct number
- ✅ Filter dropdown works
- ✅ Dismiss/Resolve buttons work
- ✅ Reports move to correct status

---

## 📊 Database Quick Checks

```sql
-- Count reports
SELECT COUNT(*) FROM discussion_reports;

-- Count by status  
SELECT status, COUNT(*) FROM discussion_reports GROUP BY status;

-- Check admin users
SELECT email, role FROM profiles WHERE role = 'admin';

-- Check RLS policies
SELECT COUNT(*) FROM pg_policies WHERE tablename = 'discussion_reports';
-- Should be 5

-- Latest reports
SELECT * FROM discussion_reports ORDER BY created_at DESC LIMIT 5;
```

---

## ⚡ Emergency Reset

If everything is broken:
```sql
-- 1. Drop table
DROP TABLE IF EXISTS discussion_reports CASCADE;

-- 2. Re-run migration 006_discussion_reports.sql
-- (Copy entire file to SQL Editor)

-- 3. Verify
SELECT COUNT(*) FROM discussion_reports;  -- Should be 0 or have test data
SELECT COUNT(*) FROM pg_policies WHERE tablename = 'discussion_reports';  -- Should be 5
```

---

## 📝 Key Functions

| Function | File | Purpose |
|----------|------|---------|
| `createDiscussionReport()` | supabase-services.ts | Creates new report in DB |
| `fetchAllDiscussionReports()` | supabase-services.ts | Gets all reports from DB |
| `loadDiscussionReports()` | AdminPanel.tsx | Loads reports in admin UI |
| `handleSubmitReport()` | DiscussionDetailsPage.tsx | User submits report |

---

## 🔐 RLS Policy Names

1. "Users can view their own reports" (SELECT)
2. "Users can create reports" (INSERT)
3. "Admins can view all reports" (SELECT)
4. "Admins can update reports" (UPDATE)
5. "Admins can delete reports" (DELETE)

All should exist for proper functionality.

---

**Last Updated:** Current Session  
**Status:** Production Ready with Enhanced Debugging ✅  
**Help:** See COMMUNITY_REPORTS_DEBUGGING_GUIDE.md for details
