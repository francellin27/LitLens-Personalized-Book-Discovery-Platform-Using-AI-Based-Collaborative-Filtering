# Similar Books - Supabase Integration Quick Reference

## 🎯 Summary

**Updated**: Similar Books now uses a **direct Supabase query** instead of complex scoring.

**Shows**: Maximum **3 books** that match author OR genre.

**Auto-hides**: Section hidden if no matches found.

---

## 📝 Query Logic

```typescript
// Fetch books matching author OR any genre
.or('author.eq.AuthorName,genre.cs.{Genre1},genre.cs.{Genre2},...')
.neq('id', currentBookId)  // Exclude current book
.order('rating', { ascending: false })  // Highest rated first
.limit(3)  // Maximum 3 books
```

---

## ✅ What's Displayed

Each card shows:
- ✅ Cover image
- ✅ Title
- ✅ Author
- ✅ Star rating + numeric value
- ✅ Genre badge ("Same Author" or genre name)

---

## 🧪 Quick Test

1. **Open** any book page
2. **Check** Similar Books section
3. **Verify** shows ≤3 books
4. **Verify** current book NOT shown
5. **Verify** section hides if no matches

---

## 📊 Examples

### Books with Matches
```
Viewing: Atomic Habits
Similar: [Deep Work, Power of Habit, Essentialism]
Count: 3 books
Status: Section visible
```

### No Matches
```
Viewing: Rare Technical Book
Similar: []
Count: 0 books
Status: Section hidden
```

---

## 🔧 Technical

**File**: `/components/BookDetailsPage.tsx`

**Query Location**: Lines 127-194

**Import Added**: 
```typescript
import { supabase } from '../utils/supabase/client';
```

**Query Example**:
```typescript
const { data } = await supabase
  .from('books')
  .select('*')
  .or(orConditions.join(','))
  .neq('id', currentBookId)
  .order('rating', { ascending: false })
  .limit(3);
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| No books showing | Check console for errors |
| Too many books | Should be max 3 (check code) |
| Current book shown | Check `.neq('id')` filter |
| Section not hiding | Should auto-hide when empty |

---

## 📖 Documentation

- **Full Details**: `/SIMILAR_BOOKS_SUPABASE_INTEGRATION.md`
- **Test Script**: `/TEST_SIMILAR_BOOKS_SUPABASE.js`

---

**Status**: ✅ Complete  
**Date**: October 28, 2025  
**Max Books**: 3  
**Query**: Direct Supabase OR
