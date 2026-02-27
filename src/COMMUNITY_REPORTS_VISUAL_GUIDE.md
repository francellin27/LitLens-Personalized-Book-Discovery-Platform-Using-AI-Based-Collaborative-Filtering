# Community Reports - Visual Testing Guide 🎯

## Quick Test Flow

### 📱 Step 1: User Reports a Discussion

**Path**: `Home → Community → [Any Discussion] → Flag Icon`

```
┌─────────────────────────────────────────┐
│  📖 Discussion Title                    │
│  by John Doe • 2 hours ago             │
│  Category: Book Discussion             │
│  ┌──────────────────────────────────┐  │
│  │  Discussion content here...      │  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│                                         │
│  [❤️ Like] [💬 Reply] [🔗 Share] [🚩 Report] ← Click here!
└─────────────────────────────────────────┘
```

### 📝 Step 2: Select Report Reason

```
┌────────────────────────────────────────────┐
│  Report Discussion                         │
│  Why are you reporting this discussion?   │
│                                            │
│  ┌──────────────┐  ┌──────────────┐      │
│  │ ⚡ Spam/     │  │ 🛡️ Harassment│      │
│  │  Promotional │  │   or Bullying │      │
│  └──────────────┘  └──────────────┘      │
│                                            │
│  ┌──────────────┐  ┌──────────────┐      │
│  │ ⚠️ Inappropriate│ 📄 Misinformation│   │
│  │    Content    │  │               │      │
│  └──────────────┘  └──────────────┘      │
│                                            │
│  ┌──────────────┐  ┌──────────────┐      │
│  │ © Copyright  │  │ ❓ Other      │      │
│  │  Violation   │  │               │      │
│  └──────────────┘  └──────────────┘      │
│                                            │
│  Additional details (optional):           │
│  ┌────────────────────────────────────┐  │
│  │ Type additional context here...    │  │
│  └────────────────────────────────────┘  │
│                                            │
│  [Cancel]  [Submit Report]                │
└────────────────────────────────────────────┘
```

### 🔧 Step 3: Admin Views Report

**Path**: `Admin Panel → Community Tab → Community Reports`

```
Admin Panel
┌─────────────────────────────────────────────────────────┐
│ [Books] [Reviews] [Users] [Community] ← Click here      │
└─────────────────────────────────────────────────────────┘

Community Management
┌─────────────────────────────────────────────────────────┐
│  [Active Discussions] [Community Reports (2)] ← See count│
└─────────────────────────────────────────────────────────┘

Filter: [Pending ▼]  ← Default shows pending reports
┌─────────────────────────────────────────────────────────┐
│ ┌──────────────────────────────────────────────────┐    │
│ │🟡 "Best Fantasy Books of 2024"         [Pending]│    │
│ │   Type: Discussion • By: Jane Smith              │    │
│ │                                                  │    │
│ │   Reported By: John Doe                          │    │
│ │   Reason: [Spam/Promotional]                     │    │
│ │   Date: Oct 28, 2025                             │    │
│ │                                                  │    │
│ │   Additional Details:                            │    │
│ │   "This post contains affiliate links..."        │    │
│ │                                                  │    │
│ │   [✗ Dismiss]  [✓ Resolve]                       │    │
│ └──────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Status Filter Options

```
Filter by Status: [Pending ▼]
                  └──────────────────────┐
                     • All Reports (5)   │
                     • Pending (2) ← Default
                     • Resolved (2)      │
                     • Dismissed (1)     │
                     └─────────────────┘
```

## Color Codes

### Report Status Border Colors
- 🟡 **Yellow Border** = Pending (needs attention)
- 🟢 **Green Border** = Resolved (action taken)
- ⚫ **Gray Border** = Dismissed (no action needed)

### Status Badges
```
┌─────────┐  ┌──────────┐  ┌───────────┐
│ Pending │  │ Resolved │  │ Dismissed │
│ 🟡 bg   │  │ 🟢 bg    │  │ ⚫ bg     │
└─────────┘  └──────────┘  └───────────┘
```

## Admin Actions

### For Pending Reports:

**✗ Dismiss Button**
- Marks report as "Dismissed"
- Use when: Report is not valid or doesn't violate guidelines
- Effect: Moves to "Dismissed" filter, no action taken on content

**✓ Resolve Button**
- Marks report as "Resolved"
- Use when: Report is valid and you've taken action
- Effect: Moves to "Resolved" filter, indicates action was taken

### For Resolved/Dismissed Reports:
- Shows status text: "Resolved" or "Closed"
- No action buttons (already processed)

## Testing Checklist

### ✅ User Side
- [ ] Navigate to any discussion
- [ ] Click Flag icon (🚩)
- [ ] Report dialog opens
- [ ] Select a reason (required)
- [ ] Add optional description
- [ ] Click "Submit Report"
- [ ] See success toast: "Discussion reported successfully..."

### ✅ Admin Side
- [ ] Login as admin
- [ ] Go to Admin Panel → Community → Community Reports
- [ ] See "(2)" in tab title (dynamic count)
- [ ] Default filter shows "Pending"
- [ ] Report card displays:
  - [ ] Discussion title
  - [ ] Report status badge
  - [ ] Reporter name
  - [ ] Reason badge
  - [ ] Date
  - [ ] Additional details (if provided)
  - [ ] Action buttons (Dismiss/Resolve)
- [ ] Click "Dismiss" → moves to Dismissed filter
- [ ] Click "Resolve" → moves to Resolved filter
- [ ] Change filter dropdown → see different reports
- [ ] Counts in dropdown are accurate

## Real-Time Updates

When you take action:
1. **Dismiss** a report → Count decreases in "Pending", increases in "Dismissed"
2. **Resolve** a report → Count decreases in "Pending", increases in "Resolved"
3. **Filter changes** → Content updates immediately
4. **New report submitted** → Appears in Pending (may need refresh)

## Data Flow Diagram

```
User                    Database                    Admin
  │                        │                          │
  │  1. Submit Report      │                          │
  ├───────────────────────>│                          │
  │                        │                          │
  │  2. Store in DB        │                          │
  │                        │  3. Query Reports        │
  │                        │<─────────────────────────┤
  │                        │                          │
  │                        │  4. Display in UI        │
  │                        ├─────────────────────────>│
  │                        │                          │
  │                        │  5. Admin Action         │
  │                        │<─────────────────────────┤
  │                        │  (Dismiss/Resolve)       │
  │                        │                          │
  │                        │  6. Update Status        │
  │                        │                          │
  │                        │  7. Refresh List         │
  │                        ├─────────────────────────>│
```

## Common Scenarios

### Scenario 1: Spam Report
1. User sees promotional content in discussion
2. Clicks Flag → Selects "Spam/Promotional"
3. Adds note: "Contains multiple affiliate links"
4. Admin reviews → Clicks "Resolve"
5. Report moved to "Resolved" status

### Scenario 2: False Report
1. User mistakenly reports legitimate content
2. Reports with "Inappropriate Content"
3. Admin reviews → Content is fine
4. Clicks "Dismiss" → No action needed
5. Report moved to "Dismissed" status

### Scenario 3: Harassment Report
1. User reports harassment in discussion
2. Selects "Harassment or Bullying"
3. Provides context in description
4. Admin reviews and takes action on user
5. Clicks "Resolve" → Issue handled

## Database Check (For Debugging)

Run in Supabase SQL Editor:
```sql
-- Check all reports
SELECT * FROM discussion_reports 
ORDER BY created_at DESC;

-- Count by status
SELECT status, COUNT(*) 
FROM discussion_reports 
GROUP BY status;

-- Check recent reports
SELECT 
  dr.content_title,
  dr.reporter_name,
  dr.reason,
  dr.status,
  dr.created_at
FROM discussion_reports dr
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

---

## Quick Reference

| Action | Location | Effect |
|--------|----------|--------|
| Report Discussion | Discussion Page → Flag Icon | Creates new report |
| View Reports | Admin → Community → Reports | Shows all reports |
| Filter Reports | Reports Tab → Dropdown | Filters by status |
| Dismiss Report | Report Card → Dismiss Button | Marks dismissed |
| Resolve Report | Report Card → Resolve Button | Marks resolved |

**Status**: Ready for Testing ✅  
**No Additional Setup Required**
