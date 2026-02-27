# Community Reports Debugging Guide 🔍

## Problem Statement
Reports submitted by users are not appearing in the Admin Panel's Community Reports section.

## Enhanced Logging Added

I've added comprehensive console logging throughout the report flow to help diagnose the issue:

### 1. Report Submission (DiscussionDetailsPage.tsx)
When a user submits a report, you'll see:
```
📝 Submitting report... {discussionId, userId, userName, ...}
📋 Mapped reason: Spam/Promotional
✅ Report created: {report object}
```

Or if there's an error:
```
❌ Report creation returned null
❌ Error submitting report: {error}
```

### 2. Database Insert (supabase-services.ts - createDiscussionReport)
```
🔧 createDiscussionReport called with: {params}
📤 Inserting into discussion_reports: {insertData}
✅ Report created successfully in database: {data}
```

Or errors:
```
❌ Supabase error creating discussion report: {error}
Error details: {JSON error}
```

### 3. Fetching Reports (supabase-services.ts - fetchAllDiscussionReports)
```
🔧 fetchAllDiscussionReports called with status: pending
✅ Fetched discussion reports from database: 5 reports
📋 Raw data sample: {first report}
📊 Mapped reports: 5
```

### 4. Admin Panel Loading (AdminPanel.tsx)
```
🔄 Loading discussion reports...
✅ Discussion reports loaded: 5 reports
📊 Reports by status: {pending: 3, resolved: 1, dismissed: 1}
📝 Sample report: {first report}
```

## Debugging Steps

### Step 1: Test Report Submission

1. **Login as a regular user** (not admin)
2. **Go to any discussion page**
3. **Click the Flag icon** (🚩)
4. **Submit a report** with any reason
5. **Open browser console** (F12)
6. **Look for these logs:**
   ```
   📝 Submitting report...
   📋 Mapped reason: Spam/Promotional
   🔧 createDiscussionReport called with:
   📤 Inserting into discussion_reports:
   ✅ Report created successfully in database:
   ```

### Expected Outcomes:

**✅ Success Case:**
- See all green checkmarks (✅)
- Toast message: "Discussion reported successfully..."
- Report object returned with `id`, `status: 'pending'`, etc.

**❌ Failure Cases:**

#### Case 1: RLS Policy Issue
```
❌ Supabase error creating discussion report:
Error details: {
  "code": "42501",
  "message": "new row violates row-level security policy"
}
```
**Fix:** Check that migration `006_discussion_reports.sql` has been run and RLS policies are set up correctly.

#### Case 2: Missing Column
```
❌ Supabase error creating discussion report:
Error details: {
  "code": "42703",
  "message": "column \"discussion_id\" does not exist"
}
```
**Fix:** Run migration `006_discussion_reports.sql` to create the table.

#### Case 3: Foreign Key Violation
```
❌ Supabase error creating discussion report:
Error details: {
  "code": "23503",
  "message": "insert or update on table \"discussion_reports\" violates foreign key constraint"
}
```
**Fix:** Ensure the discussion exists in the database and the user profile exists.

#### Case 4: Auth Issue
```
❌ Error submitting report: You must be logged in to report content
```
**Fix:** User is not logged in. Login first.

### Step 2: Verify Database

**Run this SQL in Supabase SQL Editor:**

```sql
-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'discussion_reports'
);

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'discussion_reports';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'discussion_reports';

-- Count reports by status
SELECT status, COUNT(*) 
FROM discussion_reports 
GROUP BY status;

-- View all reports (as admin)
SELECT * FROM discussion_reports 
ORDER BY created_at DESC 
LIMIT 10;
```

### Step 3: Test Admin Panel Fetch

1. **Login as admin user**
2. **Go to Admin Panel → Community → Community Reports**
3. **Open browser console** (F12)
4. **Click "Refresh Reports" button**
5. **Look for these logs:**
   ```
   🔄 Loading discussion reports...
   🔧 fetchAllDiscussionReports called with status: undefined
   ✅ Fetched discussion reports from database: X reports
   📊 Reports by status: {pending: X, resolved: Y, dismissed: Z}
   ```

### Expected Outcomes:

**✅ Success Case:**
- Reports array is populated
- Count matches what's in database
- Reports appear in UI with correct status

**❌ Failure Cases:**

#### Case 1: RLS Blocking Admin
```
✅ Fetched discussion reports from database: 0 reports
```
But you know reports exist in the database.

**Fix:** Check that your admin user has `role = 'admin'` in the `profiles` table:
```sql
SELECT id, email, name, role FROM profiles WHERE email = 'your-admin-email@example.com';
```

If role is not 'admin', update it:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';
```

#### Case 2: No Reports Exist
```
✅ Fetched discussion reports from database: 0 reports
⚠️ No data returned from discussion_reports query
```

**Fix:** No reports have been created yet. Submit a test report first.

## Quick Test Script

Run this in browser console (after logging in):

```javascript
// Test fetching reports (as admin)
async function testFetchReports() {
  const { createClient } = await import('./utils/supabase/client');
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('discussion_reports')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Reports:', data);
    console.log('📊 Count:', data.length);
  }
}

testFetchReports();
```

## Common Issues & Solutions

### Issue 1: Reports Created But Not Visible to Admin

**Symptom:** User can create reports (gets success message), but admin sees 0 reports.

**Root Cause:** Admin user doesn't have proper `role = 'admin'` in profiles table.

**Solution:**
```sql
-- Verify admin role
SELECT id, email, role FROM profiles WHERE email = 'admin@example.com';

-- Fix if needed
UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
```

### Issue 2: Can't Create Reports - RLS Error

**Symptom:** User gets error "Failed to submit report" with RLS policy violation in console.

**Root Cause:** Missing RLS policy for INSERT or policy has wrong condition.

**Solution:**
```sql
-- Drop and recreate the policy
DROP POLICY IF EXISTS "Users can create reports" ON discussion_reports;

CREATE POLICY "Users can create reports"
  ON discussion_reports
  FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);
```

### Issue 3: Migration Not Run

**Symptom:** Console shows "table discussion_reports does not exist"

**Solution:**
1. Go to Supabase Dashboard → SQL Editor
2. Open `006_discussion_reports.sql`
3. Run the entire migration
4. Verify: `SELECT COUNT(*) FROM discussion_reports;`

### Issue 4: Reports Show 0 Even After Refresh

**Symptom:** Click "Refresh Reports" but count stays at 0.

**Debugging:**
1. Check console for fetch errors
2. Run SQL query to verify reports exist
3. Check if filter is set to wrong status
4. Verify admin role

## Testing Checklist

- [ ] Migration `006_discussion_reports.sql` has been run
- [ ] Table `discussion_reports` exists
- [ ] RLS is enabled on `discussion_reports` table
- [ ] 5 RLS policies exist (view own, create, admin view all, admin update, admin delete)
- [ ] Admin user has `role = 'admin'` in profiles table
- [ ] User can login and access discussions
- [ ] Discussion exists to report
- [ ] Report submission shows success toast
- [ ] Console shows ✅ green checkmarks
- [ ] SQL query shows reports in database
- [ ] Admin panel loads without errors
- [ ] "Refresh Reports" button works
- [ ] Reports appear in UI with correct status
- [ ] Filter dropdown works (All/Pending/Resolved/Dismissed)
- [ ] Action buttons (Dismiss/Resolve) work

## Manual Database Insert Test

If reports aren't working, test with a manual insert:

```sql
-- Get IDs first
SELECT id, email FROM profiles LIMIT 2;
SELECT id, title FROM discussions LIMIT 1;

-- Insert test report (replace UUIDs with real ones from above)
INSERT INTO discussion_reports (
  discussion_id,
  reporter_id,
  reporter_name,
  content_title,
  content_type,
  original_author,
  reason,
  description,
  status
) VALUES (
  'YOUR-DISCUSSION-ID-HERE',
  'YOUR-USER-ID-HERE',
  'Test Reporter',
  'Test Discussion Title',
  'Discussion',
  'Original Author Name',
  'Spam/Promotional',
  'This is a test report for debugging',
  'pending'
);

-- Verify it was created
SELECT * FROM discussion_reports ORDER BY created_at DESC LIMIT 1;
```

Then check if it appears in the admin panel.

## UI Features Added

### Refresh Button
- Located in Community Reports tab
- Manual trigger to reload reports
- Shows "Loading..." when fetching

### Status Filter
- Dropdown: All/Pending/Resolved/Dismissed
- Shows count for each status
- Updates dynamically

### Better Error Messages
- Migration needed alerts
- Specific error toasts
- Console logging for debugging

## Next Steps If Still Not Working

1. **Export console logs** - Copy all console output
2. **Export SQL results** - Run verification queries and save output
3. **Check Supabase logs** - Go to Supabase Dashboard → Logs
4. **Verify network requests** - Check Network tab in DevTools
5. **Test with curl** - Direct API test bypassing frontend

## Contact & Support

If issue persists after following this guide:
1. Provide console logs from both user and admin perspectives
2. Provide SQL query results
3. Provide screenshots of:
   - Supabase table structure
   - RLS policies
   - Admin panel UI
   - Error messages

---

**Last Updated:** Current Session  
**Status:** Enhanced logging and debugging tools added ✅
