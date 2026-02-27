/**
 * Test Script: Similar Books Supabase Integration
 * 
 * Purpose: Verify the Supabase query returns correct results
 * 
 * How to use:
 * 1. Open browser console (F12)
 * 2. Copy and paste this entire script
 * 3. Press Enter to run
 * 4. Navigate to any book details page
 * 5. Watch console for verification results
 */

(function() {
  console.log('📚 Similar Books Supabase Test - LOADED');
  console.log('================================================');
  console.log('');
  console.log('Navigate to any book to test the Supabase query...');
  console.log('');
  
  // Track current test
  let currentBookTitle = null;
  let currentBookId = null;
  let similarBooksFound = 0;
  
  // Intercept console.debug to track Similar Books logs
  const originalDebug = console.debug;
  console.debug = function(...args) {
    const message = args.join(' ');
    
    // Track when similar books are loading
    if (message.includes('[Similar Books] Loading for book:')) {
      currentBookTitle = args[2]; // book title
      currentBookId = args[4]; // book ID
      similarBooksFound = 0;
      
      console.log('');
      console.log('═══════════════════════════════════════════');
      console.log('🔄 NEW BOOK LOADED');
      console.log('═══════════════════════════════════════════');
      console.log('📖 Current Book:', currentBookTitle);
      console.log('🆔 Book ID:', currentBookId);
      console.log('');
      console.log('⏳ Fetching similar books from Supabase...');
      console.log('-------------------------------------------');
    }
    
    // Track found books
    if (message.includes('[Similar Books] Found')) {
      const count = parseInt(args[3]);
      similarBooksFound = count;
      
      console.log('');
      console.log('📊 QUERY RESULT');
      console.log('-------------------------------------------');
      console.log('✅ Books Found:', count);
      
      if (count === 0) {
        console.log('ℹ️  No similar books match author or genres');
        console.log('ℹ️  Section will be hidden');
      } else if (count <= 3) {
        console.log('✅ Result count is within limit (≤3)');
      } else {
        console.warn('⚠️  More than 3 books found (unexpected!)');
      }
    }
    
    // Track titles
    if (message.includes('[Similar Books] Titles:')) {
      const titles = args.slice(3).join('').split(', ');
      
      console.log('');
      console.log('📚 SIMILAR BOOKS:');
      console.log('-------------------------------------------');
      titles.forEach((title, idx) => {
        console.log(`${idx + 1}. ${title}`);
      });
      
      // Check if current book is in the list
      const currentInList = titles.some(title => 
        title.toLowerCase() === currentBookTitle?.toLowerCase()
      );
      
      console.log('');
      console.log('🔍 VERIFICATION:');
      console.log('-------------------------------------------');
      
      if (currentInList) {
        console.error('❌ FAIL: Current book appears in similar books!');
        console.error('Current:', currentBookTitle);
      } else {
        console.log('✅ PASS: Current book excluded');
      }
      
      if (titles.length <= 3) {
        console.log('✅ PASS: Shows ≤3 books');
      } else {
        console.warn('⚠️  Shows >3 books (expected max 3)');
      }
      
      console.log('');
      console.log('═══════════════════════════════════════════');
      console.log('✅ TEST COMPLETE');
      console.log('═══════════════════════════════════════════');
      console.log('');
    }
    
    // Track no results
    if (message.includes('[Similar Books] No similar books found')) {
      console.log('');
      console.log('📊 QUERY RESULT');
      console.log('-------------------------------------------');
      console.log('ℹ️  No similar books found');
      console.log('✅ Section will be hidden automatically');
      console.log('');
      console.log('═══════════════════════════════════════════');
      console.log('✅ TEST COMPLETE (No Results)');
      console.log('═══════════════════════════════════════════');
      console.log('');
    }
    
    originalDebug.apply(console, args);
  };
  
  // Intercept console.error for errors
  const originalError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    
    if (message.includes('[Similar Books]')) {
      console.log('');
      console.log('🚨 ERROR DETECTED');
      console.log('═══════════════════════════════════════════');
      console.error(...args);
      console.log('═══════════════════════════════════════════');
      console.log('');
    }
    
    originalError.apply(console, args);
  };
  
  console.log('✅ Test script active!');
  console.log('📖 Open any book page to start testing');
  console.log('');
})();

/**
 * WHAT TO LOOK FOR:
 * 
 * ✅ SUCCESS INDICATORS:
 * - "Books Found: X" (where X ≤ 3)
 * - "Current book excluded" 
 * - "Shows ≤3 books"
 * - No errors
 * 
 * ❌ FAILURE INDICATORS:
 * - "Current book appears in similar books"
 * - "Shows >3 books"
 * - "Error fetching from Supabase"
 * 
 * TEST SCENARIOS:
 * 
 * Scenario 1: Book with Many Similar Books
 * - Expected: Shows exactly 3 books (limited)
 * - Expected: Highest rated books shown first
 * - Expected: Current book NOT in list
 * 
 * Scenario 2: Book with Few Similar Books
 * - Expected: Shows 1-2 books
 * - Expected: Current book NOT in list
 * - Expected: Section still visible
 * 
 * Scenario 3: Unique Book
 * - Expected: "No similar books found"
 * - Expected: Section hidden
 * - Expected: No errors
 * 
 * Scenario 4: Navigation
 * - Open Book A
 * - Click similar book (Book B)
 * - Expected: Navigate to Book B
 * - Expected: New similar books load
 * - Expected: Book B not in its own list
 * - Expected: Book A may appear if similar to B
 */
