// Test script to validate pagination fixes and 404 handling
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5001/api';

async function testEndpoint(url, description, expectedFields = []) {
  try {
    console.log(`\n🧪 Testing: ${description}`);
    console.log(`📡 URL: ${url}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📊 Response keys: ${Object.keys(data).join(', ')}`);
    
    // Check for expected fields
    expectedFields.forEach(field => {
      if (data[field] !== undefined) {
        if (Array.isArray(data[field])) {
          console.log(`📈 ${field}: ${data[field].length} items`);
        } else {
          console.log(`📈 ${field}: ${data[field]}`);
        }
      } else {
        console.log(`⚠️  Warning: Expected field '${field}' not found`);
      }
    });
    
    return { success: true, data, status: response.status };
  } catch (error) {
    console.log(`💥 Network Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive API Tests for Pagination and 404 Handling\n');
  console.log('=' .repeat(80));
  
  // Test cases that should work (recent data)
  console.log('\n📊 TESTING RECENT DATA (Should have results)');
  console.log('-' .repeat(50));
  
  await testEndpoint(
    `${API_BASE}/races/season/2025/round/1/laps`, 
    'Lap Data - 2025 Round 1 (Australian GP)', 
    ['season', 'round', 'laps']
  );
  
  await testEndpoint(
    `${API_BASE}/races/season/2025/round/1/pitstops`, 
    'Pit Stop Data - 2025 Round 1 (Australian GP)', 
    ['season', 'round', 'pitStops']
  );
  
  await testEndpoint(
    `${API_BASE}/races/season/2024/round/1/laps`, 
    'Lap Data - 2024 Round 1', 
    ['season', 'round', 'laps']
  );
  
  await testEndpoint(
    `${API_BASE}/races/season/2024/round/1/pitstops`, 
    'Pit Stop Data - 2024 Round 1', 
    ['season', 'round', 'pitStops']
  );
  
  // Test cases that were causing 404 errors (should now return empty arrays)
  console.log('\n❌ TESTING PROBLEMATIC CASES (Should return empty arrays, not 404)');
  console.log('-' .repeat(50));
  
  await testEndpoint(
    `${API_BASE}/races/season/2020/round/1/laps`, 
    'Lap Data - 2020 Round 1 (Should be empty, not 404)', 
    ['season', 'round', 'laps']
  );
  
  await testEndpoint(
    `${API_BASE}/races/season/2020/round/1/pitstops`, 
    'Pit Stop Data - 2020 Round 1 (Should be empty, not 404)', 
    ['season', 'round', 'pitStops']
  );
  
  await testEndpoint(
    `${API_BASE}/races/season/2019/round/1/laps`, 
    'Lap Data - 2019 Round 1 (Should be empty, not 404)', 
    ['season', 'round', 'laps']
  );
  
  await testEndpoint(
    `${API_BASE}/races/season/2019/round/1/pitstops`, 
    'Pit Stop Data - 2019 Round 1 (Should be empty, not 404)', 
    ['season', 'round', 'pitStops']
  );
  
  // Test extreme cases
  console.log('\n🔥 TESTING EXTREME CASES');
  console.log('-' .repeat(50));
  
  await testEndpoint(
    `${API_BASE}/races/season/1950/round/1/laps`, 
    'Lap Data - 1950 Round 1 (Very old, should be empty)', 
    ['season', 'round', 'laps']
  );
  
  await testEndpoint(
    `${API_BASE}/races/season/1950/round/1/pitstops`, 
    'Pit Stop Data - 1950 Round 1 (Very old, should be empty)', 
    ['season', 'round', 'pitStops']
  );
  
  await testEndpoint(
    `${API_BASE}/races/season/3000/round/1/laps`, 
    'Lap Data - 3000 Round 1 (Future, should be empty)', 
    ['season', 'round', 'laps']
  );
  
  await testEndpoint(
    `${API_BASE}/races/season/3000/round/1/pitstops`, 
    'Pit Stop Data - 3000 Round 1 (Future, should be empty)', 
    ['season', 'round', 'pitStops']
  );
  
  // Test pagination by updating data (this will fetch all pages)
  console.log('\n📄 TESTING PAGINATION (Update endpoints will fetch all pages)');
  console.log('-' .repeat(50));
  
  await testEndpoint(
    `${API_BASE}/races/season/2025/round/1/laps/update`, 
    'UPDATE Lap Data - 2025 Round 1 (Test pagination)', 
    ['message', 'season', 'round', 'lapsCount']
  );
  
  await testEndpoint(
    `${API_BASE}/races/season/2025/round/1/pitstops/update`, 
    'UPDATE Pit Stop Data - 2025 Round 1 (Test pagination)', 
    ['message', 'season', 'round', 'pitStopsCount']
  );
  
  console.log('\n' + '=' .repeat(80));
  console.log('🏁 Comprehensive API Tests Complete');
  console.log('\n📖 Swagger Documentation: http://localhost:5001/api-docs');
  console.log('\n✅ Expected Results:');
  console.log('   • All requests should return 200 status (no 404s)');
  console.log('   • Old years (2020, 2019, 1950) should return empty arrays');
  console.log('   • Recent years (2024, 2025) should return actual data');
  console.log('   • Update endpoints should show total counts from pagination');
}

runComprehensiveTests().catch(console.error); 