// Simple test script to validate API endpoints
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5001/api';

async function testEndpoint(url, description) {
  try {
    console.log(`\n🧪 Testing: ${description}`);
    console.log(`📡 URL: ${url}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Status: ${response.status}`);
      console.log(`📊 Response keys: ${Object.keys(data).join(', ')}`);
      
      // Check for expected response format
      if (url.includes('/seasons')) {
        if (data.seasons && Array.isArray(data.seasons)) {
          console.log(`📈 Seasons found: ${data.seasons.length}`);
        } else {
          console.log('⚠️  Warning: Expected seasons array not found');
        }
      }
      
      if (url.includes('/laps')) {
        if (data.laps && Array.isArray(data.laps)) {
          console.log(`📈 Laps found: ${data.laps.length}`);
        } else {
          console.log('⚠️  Warning: Expected laps array not found');
        }
      }
      
      if (url.includes('/pitstops')) {
        if (data.pitStops && Array.isArray(data.pitStops)) {
          console.log(`📈 Pit stops found: ${data.pitStops.length}`);
        } else {
          console.log('⚠️  Warning: Expected pitStops array not found');
        }
      }
    } else {
      console.log(`❌ Status: ${response.status}`);
      console.log(`🔍 Error: ${data.error || data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`💥 Network Error: ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 Starting API Endpoint Tests\n');
  console.log('=' .repeat(50));
  
  // Test basic endpoints
  await testEndpoint(`${API_BASE}/health`, 'Health Check');
  await testEndpoint(`${API_BASE}/races/seasons`, 'All Seasons Data');
  await testEndpoint(`${API_BASE}/races/all`, 'All Races Data');
  
  // Test specific race endpoints
  await testEndpoint(`${API_BASE}/races/season/2024/round/1`, 'Specific Race (2024 Round 1)');
  await testEndpoint(`${API_BASE}/races/season/2024/round/1/laps`, 'Lap Data (2024 Round 1)');
  await testEndpoint(`${API_BASE}/races/season/2024/round/1/pitstops`, 'Pit Stop Data (2024 Round 1)');
  
  // Test with different race
  await testEndpoint(`${API_BASE}/races/season/2023/round/1/laps`, 'Lap Data (2023 Round 1)');
  await testEndpoint(`${API_BASE}/races/season/2023/round/1/pitstops`, 'Pit Stop Data (2023 Round 1)');
  
  console.log('\n' + '=' .repeat(50));
  console.log('🏁 API Endpoint Tests Complete');
  console.log('\n📖 Swagger Documentation: http://localhost:5001/api-docs');
}

runTests().catch(console.error); 