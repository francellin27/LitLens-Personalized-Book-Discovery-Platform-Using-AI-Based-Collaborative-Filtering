/**
 * Test Review Submission Script
 * 
 * Copy and paste this into your browser console (F12)
 * while viewing a book modal in LitLens to test the review system.
 */

console.log('═══════════════════════════════════════════════════');
console.log('📝 LITLENS REVIEW SUBMISSION TEST');
console.log('═══════════════════════════════════════════════════\n');

// Test 1: Check User Authentication
console.log('TEST 1: User Authentication');
console.log('─────────────────────────────');
if (typeof user !== 'undefined' && user) {
  console.log('✅ User is logged in');
  console.log('   User ID:', user.id);
  console.log('   Name:', user.name);
  console.log('   Role:', user.role);
} else {
  console.log('❌ User is NOT logged in');
  console.log('   Action: Please log in first');
}
console.log('');

// Test 2: Check Book Data
console.log('TEST 2: Book Data');
console.log('─────────────────────────────');
if (typeof book !== 'undefined' && book) {
  console.log('✅ Book is loaded');
  console.log('   Book ID:', book.id);
  console.log('   Title:', book.title);
  console.log('   Author:', book.author);
  
  // Check if UUID (database book) or mock book
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(book.id);
  if (isUUID) {
    console.log('   ✅ Database book (UUID format)');
    console.log('   Reviews will be saved to Supabase');
  } else {
    console.log('   ⚠️  Mock book (numeric ID)');
    console.log('   Reviews will NOT be saved to database');
    console.log('   Action: Test with a different book from Browse Books');
  }
} else {
  console.log('❌ No book loaded');
  console.log('   Action: Open a book modal first');
}
console.log('');

// Test 3: Check Review Form Values
console.log('TEST 3: Review Form Values');
console.log('─────────────────────────────');
if (typeof userRating !== 'undefined') {
  if (userRating > 0) {
    console.log('✅ Rating selected:', userRating, '★');
  } else {
    console.log('❌ No rating selected (rating:', userRating, ')');
    console.log('   Action: Click stars to rate 1-5');
  }
} else {
  console.log('⚠️  userRating variable not found');
}

if (typeof reviewTitle !== 'undefined') {
  if (reviewTitle && reviewTitle.trim()) {
    console.log('✅ Review title:', reviewTitle);
  } else {
    console.log('ℹ️  No review title (this is optional)');
  }
} else {
  console.log('⚠️  reviewTitle variable not found');
}

if (typeof userComment !== 'undefined') {
  if (userComment && userComment.trim()) {
    console.log('✅ Review content:', userComment.substring(0, 50) + '...');
    console.log('   Length:', userComment.length, '/ 500 characters');
  } else {
    console.log('❌ No review content');
    console.log('   Action: Write something in the review textarea');
  }
} else {
  console.log('⚠️  userComment variable not found');
}
console.log('');

// Test 4: Check for Existing Review
console.log('TEST 4: Existing Review Check');
console.log('─────────────────────────────');
if (typeof reviews !== 'undefined' && typeof user !== 'undefined' && user) {
  const existingReview = reviews.find(r => r.userId === user.id);
  if (existingReview) {
    console.log('⚠️  You already reviewed this book!');
    console.log('   Your review:', existingReview);
    console.log('   Action: Delete existing review or test with different book');
  } else {
    console.log('✅ No existing review found');
    console.log('   You can submit a new review');
  }
} else {
  console.log('ℹ️  Cannot check (missing reviews or user data)');
}
console.log('');

// Test 5: Check Button State
console.log('TEST 5: Submit Button State');
console.log('─────────────────────────────');
if (typeof userComment !== 'undefined' && typeof userRating !== 'undefined' && typeof isSubmittingReview !== 'undefined') {
  const isDisabled = !userComment.trim() || userRating === 0 || isSubmittingReview;
  
  if (isDisabled) {
    console.log('❌ Submit button is DISABLED');
    console.log('   Reasons:');
    if (!userComment.trim()) console.log('   - No review content');
    if (userRating === 0) console.log('   - No rating selected');
    if (isSubmittingReview) console.log('   - Currently submitting');
  } else {
    console.log('✅ Submit button is ENABLED');
    console.log('   Ready to submit!');
  }
} else {
  console.log('⚠️  Cannot check button state (variables not found)');
}
console.log('');

// Test 6: Supabase Connection
console.log('TEST 6: Supabase Connection');
console.log('─────────────────────────────');
if (typeof supabase !== 'undefined') {
  console.log('Testing Supabase connection...');
  supabase
    .from('reviews')
    .select('count')
    .limit(1)
    .then(({ data, error }) => {
      if (error) {
        console.log('❌ Supabase connection error:', error.message);
      } else {
        console.log('✅ Supabase is connected');
      }
    });
} else {
  console.log('⚠️  Supabase client not available in global scope');
  console.log('   This is normal - it might be in a module');
}
console.log('');

// Summary
console.log('═══════════════════════════════════════════════════');
console.log('📊 SUMMARY');
console.log('═══════════════════════════════════════════════════');

let canSubmit = true;
const issues = [];

if (typeof user === 'undefined' || !user) {
  canSubmit = false;
  issues.push('Not logged in');
}

if (typeof book === 'undefined' || !book) {
  canSubmit = false;
  issues.push('No book loaded');
} else {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(book.id);
  if (!isUUID) {
    issues.push('Using mock book (won\'t save to database)');
  }
}

if (typeof userRating !== 'undefined' && userRating === 0) {
  canSubmit = false;
  issues.push('No rating selected');
}

if (typeof userComment !== 'undefined' && !userComment.trim()) {
  canSubmit = false;
  issues.push('No review content');
}

if (typeof reviews !== 'undefined' && typeof user !== 'undefined' && user && book) {
  const existingReview = reviews.find(r => r.userId === user.id);
  if (existingReview) {
    canSubmit = false;
    issues.push('Already reviewed this book');
  }
}

if (canSubmit && issues.length === 0) {
  console.log('✅ READY TO SUBMIT!');
  console.log('   All checks passed. Click "Submit Review" button.');
} else {
  console.log('❌ CANNOT SUBMIT YET');
  console.log('   Issues to fix:');
  issues.forEach(issue => {
    console.log('   - ' + issue);
  });
}

console.log('');
console.log('═══════════════════════════════════════════════════');
console.log('🔧 QUICK ACTIONS');
console.log('═══════════════════════════════════════════════════');
console.log('');
console.log('To manually trigger submission, run:');
console.log('  handleSubmitReview()');
console.log('');
console.log('To check migration status, run this SQL in Supabase:');
console.log('  SELECT column_name, is_nullable');
console.log('  FROM information_schema.columns');
console.log('  WHERE table_name = \'reviews\' AND column_name = \'title\';');
console.log('');
console.log('To view all existing reviews for this book:');
console.log('  console.table(reviews);');
console.log('');
console.log('═══════════════════════════════════════════════════\n');
