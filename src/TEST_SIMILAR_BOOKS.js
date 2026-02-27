/**
 * Test Script for Similar Books Functionality
 * 
 * This script helps verify that the similar books feature is working correctly
 * and that the current book is never shown in the similar books section.
 * 
 * HOW TO USE:
 * 1. Open your LitLens app in the browser
 * 2. Open the browser console (F12)
 * 3. Copy and paste this entire script into the console
 * 4. Press Enter to run
 * 5. Navigate to any book details page
 * 6. The script will automatically verify the similar books section
 */

(function() {
  console.log('=== Similar Books Test Script ===');
  console.log('This script will monitor similar books loading...\n');

  // Store original console.debug to intercept similar books logs
  const originalDebug = console.debug;
  const originalError = console.error;
  const originalWarn = console.warn;

  let currentBookId = null;
  let currentBookTitle = null;
  let similarBookIds = [];
  let similarBookTitles = [];

  // Intercept console.debug to capture similar books data
  console.debug = function(...args) {
    const message = args.join(' ');
    
    if (message.includes('[Similar Books] Loading for book:')) {
      currentBookTitle = args[3]; // Extract book title
      currentBookId = args[5]; // Extract book ID
      console.log('%c📚 Testing book: ' + currentBookTitle, 'color: blue; font-weight: bold');
      console.log('%c🔑 Book ID: ' + currentBookId, 'color: blue');
      similarBookIds = [];
      similarBookTitles = [];
    }
    
    if (message.includes('[Similar Books] Titles:')) {
      // Extract the titles list
      const titlesStr = args.slice(3).join(' ');
      similarBookTitles = titlesStr.split(', ').filter(t => t.trim());
      
      console.log('%c✨ Similar books found: ' + similarBookTitles.length, 'color: green; font-weight: bold');
      similarBookTitles.forEach((title, i) => {
        console.log(`  ${i + 1}. ${title}`);
      });
    }
    
    if (message.includes('[Similar Books] IDs:')) {
      // Extract the IDs list
      const idsStr = args.slice(3).join(' ');
      similarBookIds = idsStr.split(', ').filter(id => id.trim());
    }
    
    if (message.includes('[Similar Books] Showing') && similarBookTitles.length > 0) {
      // Verify the current book is not in similar books
      const hasDuplicate = similarBookIds.includes(currentBookId);
      const hasTitleDuplicate = similarBookTitles.includes(currentBookTitle);
      
      if (hasDuplicate || hasTitleDuplicate) {
        console.log('%c❌ FAILED: Current book found in similar books!', 'color: red; font-weight: bold; font-size: 14px');
        console.log('Current book ID:', currentBookId);
        console.log('Current book title:', currentBookTitle);
        console.log('Similar book IDs:', similarBookIds);
        console.log('Similar book titles:', similarBookTitles);
      } else {
        console.log('%c✅ PASSED: Current book is NOT in similar books list', 'color: green; font-weight: bold; font-size: 14px');
        console.log(`%c✓ All ${similarBookTitles.length} similar books are different from "${currentBookTitle}"`, 'color: green');
      }
      console.log('\n' + '='.repeat(60) + '\n');
    }
    
    originalDebug.apply(console, args);
  };

  // Intercept errors
  console.error = function(...args) {
    const message = args.join(' ');
    
    if (message.includes('[Similar Books]')) {
      console.log('%c⚠️ ERROR DETECTED:', 'color: red; font-weight: bold; font-size: 14px');
    }
    
    originalError.apply(console, args);
  };

  // Intercept warnings
  console.warn = function(...args) {
    const message = args.join(' ');
    
    if (message.includes('[Similar Books]')) {
      console.log('%c⚠️ WARNING DETECTED:', 'color: orange; font-weight: bold; font-size: 14px');
    }
    
    originalWarn.apply(console, args);
  };

  console.log('%c✓ Test script is now monitoring similar books...', 'color: green; font-weight: bold');
  console.log('Navigate to any book details page to see the test results.\n');
  console.log('To stop monitoring, refresh the page.');
})();
