// ============================================
// Test Script: Storage Authentication Check
// ============================================
// Run this in your browser console to debug storage upload issues
//
// HOW TO USE:
// 1. Open your LitLens app in browser
// 2. Open browser console (F12 or Cmd+Option+J)
// 3. Copy and paste this entire script
// 4. Press Enter
// 5. Check the results
//
// ============================================

(async function testStorageAuth() {
  console.log('🔍 Starting LitLens Storage Authentication Test...\n');
  
  let allTestsPassed = true;

  // Test 1: Check Supabase client exists
  console.log('📝 Test 1: Checking Supabase client...');
  if (typeof supabase === 'undefined') {
    console.error('❌ FAILED: Supabase client not found!');
    console.log('   → Make sure you are on the LitLens app page');
    allTestsPassed = false;
    return;
  }
  console.log('✅ PASSED: Supabase client exists\n');

  // Test 2: Check authentication session
  console.log('📝 Test 2: Checking authentication session...');
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('❌ FAILED: Error getting session:', sessionError);
    allTestsPassed = false;
  } else if (!session) {
    console.error('❌ FAILED: No active session');
    console.log('   → You need to log in first!');
    console.log('   → Go to the login page and sign in');
    allTestsPassed = false;
  } else {
    console.log('✅ PASSED: User is authenticated');
    console.log('   User ID:', session.user.id);
    console.log('   Email:', session.user.email);
    console.log('   Session expires:', new Date(session.expires_at * 1000).toLocaleString());
  }
  console.log('');

  if (!session) {
    console.log('\n⚠️  Cannot continue tests - please log in first');
    return;
  }

  // Test 3: Check storage bucket exists
  console.log('📝 Test 3: Checking storage bucket...');
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  if (bucketsError) {
    console.error('❌ FAILED: Error listing buckets:', bucketsError);
    allTestsPassed = false;
  } else {
    const litlensBucket = buckets?.find(b => b.id === 'litlens-profile-photos');
    if (!litlensBucket) {
      console.error('❌ FAILED: litlens-profile-photos bucket not found');
      console.log('   → Run the storage setup migration script in Supabase SQL Editor');
      console.log('   → See /FIX_STORAGE_RLS_ERROR.md for instructions');
      allTestsPassed = false;
    } else {
      console.log('✅ PASSED: litlens-profile-photos bucket exists');
      console.log('   Public:', litlensBucket.public);
      console.log('   Created:', litlensBucket.created_at);
    }
  }
  console.log('');

  // Test 4: Test file upload permissions
  console.log('📝 Test 4: Testing upload permissions...');
  
  // Create a tiny test file (1x1 pixel transparent PNG)
  const testBlob = new Blob(
    [new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
      0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ])],
    { type: 'image/png' }
  );
  const testFile = new File([testBlob], 'test.png', { type: 'image/png' });
  const testPath = `avatars/test-${Date.now()}.png`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('litlens-profile-photos')
    .upload(testPath, testFile);

  if (uploadError) {
    console.error('❌ FAILED: Upload test failed');
    console.error('   Error message:', uploadError.message);
    console.error('   Status code:', uploadError.statusCode);
    console.error('   Full error:', uploadError);
    console.log('\n   🔧 TROUBLESHOOTING:');
    console.log('   → Check if RLS policies are set up correctly');
    console.log('   → Run the migration script in /FIX_STORAGE_RLS_ERROR.md');
    console.log('   → Make sure you are logged in as a regular user (not admin)');
    allTestsPassed = false;
  } else {
    console.log('✅ PASSED: Upload successful');
    console.log('   File path:', uploadData.path);
    console.log('   File ID:', uploadData.id);

    // Clean up test file
    console.log('   🧹 Cleaning up test file...');
    const { error: deleteError } = await supabase.storage
      .from('litlens-profile-photos')
      .remove([testPath]);
    
    if (!deleteError) {
      console.log('   ✅ Test file cleaned up');
    }
  }
  console.log('');

  // Test 5: Check public URL generation
  console.log('📝 Test 5: Testing public URL generation...');
  const { data: urlData } = supabase.storage
    .from('litlens-profile-photos')
    .getPublicUrl('avatars/test.jpg');

  if (!urlData || !urlData.publicUrl) {
    console.error('❌ FAILED: Could not generate public URL');
    allTestsPassed = false;
  } else {
    console.log('✅ PASSED: Public URL generation works');
    console.log('   Sample URL:', urlData.publicUrl);
  }
  console.log('');

  // Final Results
  console.log('═══════════════════════════════════════');
  if (allTestsPassed) {
    console.log('✅ ALL TESTS PASSED!');
    console.log('   Your storage setup is working correctly.');
    console.log('   Profile photo uploads should work now!');
  } else {
    console.log('❌ SOME TESTS FAILED');
    console.log('   Review the errors above and follow the troubleshooting steps.');
    console.log('   See /FIX_STORAGE_RLS_ERROR.md for detailed instructions.');
  }
  console.log('═══════════════════════════════════════');

  return {
    allTestsPassed,
    session: session ? {
      userId: session.user.id,
      email: session.user.email,
      authenticated: true
    } : null
  };
})();

// ============================================
// End of test script
// ============================================
