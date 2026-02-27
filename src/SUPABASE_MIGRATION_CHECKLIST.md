# LitLens Supabase Migration Checklist

## Phase 1: Database Setup (Do First) ✅

- [ ] Run migration `001_initial_schema.sql` in Supabase SQL Editor
- [ ] Run migration `002_seed_data.sql` in Supabase SQL Editor
- [ ] Create admin user in Supabase Auth
- [ ] Update admin user role in profiles table
- [ ] Verify tables were created successfully
- [ ] Test authentication by creating a test user

## Phase 2: Authentication Migration

- [ ] Update `/App.tsx` to import from `./lib/auth-supabase` instead of `./lib/auth`
- [ ] Test login functionality with existing mock users (they won't exist in Supabase initially)
- [ ] Test signup with new users
- [ ] Verify profile auto-creation on signup
- [ ] Test logout functionality
- [ ] Update any components that directly import from `./lib/auth`

### Files to Update:
- `/App.tsx` - Change AuthProvider import
- `/components/Login.tsx` - Verify it works with async auth
- `/components/UserProfile.tsx` - Update profile editing to use `updateProfile`
- `/components/AdminPanel.tsx` - Verify admin role checking
- Any other components using `useAuth()`

## Phase 3: Books Data Migration

### Components to Update:

- [ ] `/components/HomePage.tsx`
  - Replace `MOCK_BOOKS` with `useBooks()` hook
  - Update featured books section to use Supabase query
  - Add loading states

- [ ] `/components/BrowseBooksPage.tsx`
  - Replace local book data with `useBooks()` hook
  - Update filters to use Supabase queries
  - Implement server-side pagination

- [ ] `/components/SearchPage.tsx`
  - Use `useBooks({ searchQuery })` hook
  - Add debouncing for search input
  - Show loading state during search

- [ ] `/components/BookDetailsPage.tsx`
  - Use `useBook(bookId)` hook for single book
  - Add view count increment
  - Show loading state

- [ ] `/components/RecommendationsPage.tsx`
  - Fetch recommended books from Supabase
  - Implement recommendation algorithm server-side (or use RPC)

- [ ] `/components/BookCard.tsx`
  - Verify it works with Supabase book data structure
  - Update any hardcoded data references

- [ ] `/components/BookGrid.tsx`
  - Update to handle async book loading
  - Add loading skeleton

## Phase 4: Reviews Migration

### Components to Update:

- [ ] `/components/BookDetailsPage.tsx`
  - Use `useBookReviews(bookId)` hook
  - Update review display
  - Add loading state

- [ ] Any review creation forms
  - Use `addReview()` from hook
  - Handle success/error states

- [ ] Review editing/deletion
  - Use `editReview()` and `removeReview()` from hook

- [ ] `/components/AdminPanel.tsx`
  - Update review reports to use `getReviewReports()`
  - Use `updateReportStatus()` for moderation

## Phase 5: Reading Lists Migration

### Components to Update:

- [ ] `/components/ReadingListsPage.tsx`
  - Use `useReadingLists(userId)` hook
  - Update list creation to use `createList()`
  - Add/remove books using hook methods

- [ ] `/components/UserProfile.tsx`
  - Show reading lists from Supabase
  - Update any list management features

- [ ] Add to Reading List buttons/dialogs
  - Use `addBook()` from reading lists hook

## Phase 6: User Book Status Migration

### Components to Update:

- [ ] Book status buttons (Reading, Completed, Want to Read, Favorite)
  - Use `useUserBookStatus()` hook
  - Update all toggle functions

- [ ] `/components/UserProfile.tsx`
  - Update bookshelf, completed books, and favorites sections
  - Query `user_book_status` table

- [ ] Book rating components
  - Use `setRating()` from hook
  - Show user's rating from Supabase

## Phase 7: Community Features Migration

### Components to Update:

- [ ] `/components/CommunityPage.tsx`
  - Fetch discussions from Supabase
  - Implement discussion creation
  - Add loading states

- [ ] `/components/DiscussionDetailsPage.tsx`
  - Fetch discussion and replies from Supabase
  - Implement reply creation
  - Update like counts

## Phase 8: Admin Panel Migration

### Components to Update:

- [ ] `/components/AdminPanel.tsx`
  - Update all data sources to Supabase
  - Use admin-specific queries

- [ ] Book management section
  - Use `createBook()`, `updateBook()`, `deleteBook()`
  - Add form validation

- [ ] User management
  - Query profiles table
  - Implement user role updates

- [ ] Review moderation
  - Use review reports from Supabase
  - Implement bulk actions

- [ ] `/components/UserManagementTable.tsx`
  - Fetch users from profiles table
  - Implement inline editing

- [ ] `/components/ReportedReviewsTable.tsx`
  - Fetch from review_reports table
  - Update status management

## Phase 9: Testing & Verification

- [ ] Test complete user flow: signup → browse → add to list → review
- [ ] Test admin features: create book → moderate review → manage users
- [ ] Verify RLS policies are working correctly
- [ ] Test responsive design still works
- [ ] Check dark mode compatibility
- [ ] Verify all loading states
- [ ] Test error handling
- [ ] Check search functionality
- [ ] Test pagination
- [ ] Verify book filtering works

## Phase 10: Optimization

- [ ] Add database indexes if needed (already in migration)
- [ ] Implement caching strategy
- [ ] Add optimistic updates where appropriate
- [ ] Implement real-time subscriptions (optional)
- [ ] Add error boundary components
- [ ] Implement retry logic for failed requests
- [ ] Add toast notifications for actions
- [ ] Optimize images (lazy loading, responsive images)

## Phase 11: Cleanup

- [ ] Remove old localStorage code
- [ ] Delete `/lib/auth.tsx` (replaced by auth-supabase.tsx)
- [ ] Remove mock data imports where not needed
- [ ] Clean up unused data files
- [ ] Update documentation
- [ ] Remove console.log statements
- [ ] Update TypeScript types if needed

## Testing Checklist

### Authentication
- [ ] New user signup works
- [ ] Login works with correct credentials
- [ ] Login fails with wrong credentials
- [ ] Username uniqueness is enforced
- [ ] Profile is created automatically on signup
- [ ] Logout works
- [ ] Session persists on page reload
- [ ] Admin role is checked correctly

### Books
- [ ] Books display on homepage
- [ ] Search works correctly
- [ ] Filters apply properly
- [ ] Book details page loads
- [ ] View count increments
- [ ] Pagination works
- [ ] Sort options work

### Reviews
- [ ] Users can create reviews
- [ ] Reviews display correctly
- [ ] Users can edit own reviews
- [ ] Users can delete own reviews
- [ ] Book rating updates when review is added/edited/deleted
- [ ] Report review works
- [ ] Admin can see reported reviews

### Reading Lists
- [ ] Users can create reading lists
- [ ] Users can add books to lists
- [ ] Users can remove books from lists
- [ ] Public/private visibility works
- [ ] Reading lists display correctly

### User Book Status
- [ ] "Currently Reading" status works
- [ ] "Completed" status works
- [ ] "Want to Read" status works
- [ ] "Favorite" status works
- [ ] User ratings save correctly
- [ ] Status changes reflect immediately

### Admin Features
- [ ] Admin can create books
- [ ] Admin can edit books
- [ ] Admin can delete books
- [ ] Admin can view all review reports
- [ ] Admin can update report status
- [ ] Admin panel is hidden from non-admins

### Performance
- [ ] Pages load in reasonable time
- [ ] No unnecessary re-renders
- [ ] Loading states are shown
- [ ] Errors are handled gracefully
- [ ] Images load efficiently

## Migration Priority Order

1. **Critical (Do First)**: Authentication, Books display, Book details
2. **High Priority**: Reviews, Search, User profile
3. **Medium Priority**: Reading lists, User book status, Filters
4. **Lower Priority**: Community features, Book requests, Advanced admin features

## Common Issues & Solutions

### Issue: "relation does not exist"
**Solution**: Ensure migrations were run in correct order

### Issue: "RLS policy violation"
**Solution**: Check user is authenticated and has correct permissions

### Issue: Data not appearing
**Solution**: Check browser console for errors, verify Supabase connection

### Issue: Slow queries
**Solution**: Check indexes exist, optimize query structure, use pagination

### Issue: Profile not created on signup
**Solution**: Verify the `handle_new_user()` trigger is working

## Notes

- Keep the old auth system available during migration by not deleting `/lib/auth.tsx` immediately
- Test each component thoroughly after migration before moving to the next
- Consider implementing a feature flag system to toggle between old and new data sources
- Backup any important localStorage data before migration
- Monitor Supabase dashboard for errors and performance issues
- Consider rate limiting for API calls
- Implement proper error boundaries in React

## Rollback Plan

If issues occur:
1. Switch back to old auth import in App.tsx
2. Components using hooks will gracefully fall back to loading states
3. Fix issues in Supabase
4. Re-test and re-deploy

## Post-Migration

- [ ] Monitor error logs for 24-48 hours
- [ ] Collect user feedback
- [ ] Check Supabase usage metrics
- [ ] Optimize based on real usage patterns
- [ ] Document any custom patterns or solutions
- [ ] Train team members on Supabase usage
