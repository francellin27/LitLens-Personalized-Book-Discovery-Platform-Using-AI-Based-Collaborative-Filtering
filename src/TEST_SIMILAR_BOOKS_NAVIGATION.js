/**
 * Test Script: Similar Books Navigation Test
 * 
 * Purpose: Verify that clicking similar books navigates correctly
 *          and the new page shows correct similar books (excluding itself)
 * 
 * How to use:
 * 1. Open browser console (F12)
 * 2. Copy and paste this entire script
 * 3. Press Enter to run
 * 4. Navigate to any book details page
 * 5. Click on a book in the Similar Books section
 * 6. Watch console for verification results
 */

(function() {
  console.log('📚 Similar Books Navigation Test - LOADED');
  console.log('Navigate to a book and click similar books to test...');
  console.log('---------------------------------------------------');
  
  // Track navigation events
  let currentBookId = null;
  let currentBookTitle = null;
  let similarBooksOnPage = [];
  
  // Intercept console.debug to track Similar Books logs
  const originalDebug = console.debug;
  console.debug = function(...args) {
    const message = args.join(' ');
    
    // Track when similar books are loading
    if (message.includes('[Similar Books] Loading for book:')) {
      const bookInfo = args[2]; // book title
      const idInfo = args[4]; // book ID
      currentBookTitle = bookInfo;
      currentBookId = idInfo;
      
      console.log('');
      console.log('🔄 NEW BOOK PAGE LOADED');
      console.log('📖 Current Book:', currentBookTitle);
      console.log('🆔 Current ID:', currentBookId);
      console.log('---');
    }
    
    // Track similar books shown
    if (message.includes('[Similar Books] Similar book titles:')) {
      const titles = args.slice(3).join('').split(', ');
      similarBooksOnPage = titles;
      
      console.log('');
      console.log('✅ Similar Books Loaded:', similarBooksOnPage.length);
      console.log('📚 Titles:', similarBooksOnPage.join(', '));
      
      // CRITICAL TEST: Check if current book is in similar books
      const currentInSimilar = similarBooksOnPage.some(title => 
        title.toLowerCase().includes(currentBookTitle?.toLowerCase() || '')
      );
      
      if (currentInSimilar) {
        console.error('❌ FAIL: Current book found in similar books!');
        console.error('Current:', currentBookTitle);
        console.error('Similar:', similarBooksOnPage);
      } else {
        console.log('✅ PASS: Current book NOT in similar books');
      }
      console.log('---');
    }
    
    // Track if current book excluded
    if (message.includes('current book excluded')) {
      console.log('✅ Exclusion filter active');
    }
    
    // Track confirmation
    if (message.includes('Confirmed - Current book NOT in results')) {
      console.log('✅ Final verification passed');
    }
    
    originalDebug.apply(console, args);
  };
  
  // Intercept console.error for critical issues
  const originalError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    
    if (message.includes('[Similar Books]')) {
      console.log('');
      console.log('🚨 CRITICAL ISSUE DETECTED');
      console.log('❌', ...args);
      console.log('---');
    }
    
    originalError.apply(console, args);
  };
  
  // Intercept console.warn for warnings
  const originalWarn = console.warn;
  console.warn = function(...args) {
    const message = args.join(' ');
    
    if (message.includes('[Similar Books]')) {
      console.log('');
      console.log('⚠️  WARNING DETECTED');
      console.log('⚠️ ', ...args);
      console.log('---');
    }
    
    originalWarn.apply(console, args);
  };
  
  console.log('');
  console.log('✅ Test script ready!');
  console.log('📖 Open any book to start testing');
  console.log('🔄 Click similar books to test navigation');
  console.log('');
})();

/**
 * WHAT TO LOOK FOR:
 * 
 * ✅ PASS indicators:
 * - "Current book NOT in similar books"
 * - "Exclusion filter active"
 * - "Final verification passed"
 * - No error messages
 * 
 * ❌ FAIL indicators:
 * - "Current book found in similar books"
 * - "CRITICAL: Current book in final list"
 * - "Current book leaked"
 * - Error messages in red
 * 
 * TEST PROCEDURE:
 * 1. Open any book (e.g., "Atomic Habits")
 * 2. Check console - should show similar books
 * 3. Verify "Atomic Habits" is NOT in the list
 * 4. Click on a similar book (e.g., "Deep Work")
 * 5. Page navigates to "Deep Work"
 * 6. Check console - should show NEW similar books
 * 7. Verify "Deep Work" is NOT in the NEW list
 * 8. Verify "Atomic Habits" MAY appear (if similar to Deep Work)
 * 
 * EXPECTED BEHAVIOR:
 * - Each book's similar books EXCLUDES that book itself
 * - Clicking a similar book navigates to that book
 * - The NEW page shows similar books for the NEW book
 * - The previous book MAY appear if it's similar to the new one
 */
