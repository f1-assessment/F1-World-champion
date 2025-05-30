// Simple test script to verify year restrictions
const BASE_URL = 'http://localhost:5001/api';

async function testRestrictions() {
  console.log('🧪 Testing F1 API Year Restrictions (2005+)\n');

  // Test cases
  const tests = [
    {
      name: 'Valid: Get drivers from 2010',
      url: `${BASE_URL}/drivers/season/2010`,
      expectedStatus: 200
    },
    {
      name: 'Invalid: Get drivers from 2004 (before 2005)',
      url: `${BASE_URL}/drivers/season/2004`,
      expectedStatus: 400
    },
    {
      name: 'Invalid: Get drivers from 2030 (future)',
      url: `${BASE_URL}/drivers/season/2030`,
      expectedStatus: 400
    },
    {
      name: 'Valid: Get all drivers with year range',
      url: `${BASE_URL}/drivers?fromYear=2005&toYear=2020`,
      expectedStatus: 200
    },
    {
      name: 'Invalid: Get drivers with fromYear before 2005',
      url: `${BASE_URL}/drivers?fromYear=2000&toYear=2020`,
      expectedStatus: 400
    },
    {
      name: 'Valid: Get championship from 2015',
      url: `${BASE_URL}/championships/2015`,
      expectedStatus: 200
    },
    {
      name: 'Invalid: Get championship from 2003',
      url: `${BASE_URL}/championships/2003`,
      expectedStatus: 400
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      const response = await fetch(test.url);
      
      if (response.status === test.expectedStatus) {
        console.log(`✅ PASS - Status: ${response.status}`);
        passed++;
      } else {
        console.log(`❌ FAIL - Expected: ${test.expectedStatus}, Got: ${response.status}`);
        failed++;
      }

      // Show error message for failed requests
      if (response.status >= 400) {
        const errorData = await response.json();
        console.log(`   Error: ${errorData.error}`);
      }
      
      console.log('');
    } catch (error) {
      console.log(`❌ FAIL - Network error: ${error.message}`);
      failed++;
      console.log('');
    }
  }

  console.log(`\n📊 Test Results:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Year restrictions are working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the API implementation.');
  }
}

// Check if running in Node.js environment
if (typeof fetch === 'undefined') {
  console.log('❌ This test requires Node.js 18+ with fetch support or a browser environment.');
  console.log('To run this test:');
  console.log('1. Start the backend server: npm run dev');
  console.log('2. Run this script in a browser console or Node.js 18+');
} else {
  testRestrictions().catch(console.error);
} 