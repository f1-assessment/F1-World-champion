import axios from 'axios';

const BASE_URL = 'http://localhost:5001';

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

async function testEndpoint(method, endpoint, expectedStatus = 200) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`${colors.blue}Testing ${method.toUpperCase()} ${endpoint}${colors.reset}`);
    
    const response = await axios({
      method,
      url,
      timeout: 10000
    });
    
    if (response.status === expectedStatus) {
      console.log(`${colors.green}✅ ${method.toUpperCase()} ${endpoint} - Status: ${response.status}${colors.reset}`);
      
      // Log response structure for GET requests
      if (method === 'get' && response.data) {
        if (Array.isArray(response.data)) {
          console.log(`   📊 Array response with ${response.data.length} items`);
        } else if (typeof response.data === 'object') {
          console.log(`   📊 Object response with keys: [${Object.keys(response.data).join(', ')}]`);
        }
      }
      
      return true;
    } else {
      console.log(`${colors.yellow}⚠️ ${method.toUpperCase()} ${endpoint} - Expected: ${expectedStatus}, Got: ${response.status}${colors.reset}`);
      return false;
    }
  } catch (error) {
    if (error.response) {
      console.log(`${colors.red}❌ ${method.toUpperCase()} ${endpoint} - Status: ${error.response.status}${colors.reset}`);
      if (error.response.status === 404 && endpoint.includes('/2025/')) {
        console.log(`   ℹ️ 404 expected for future/test data`);
        return true;
      }
    } else {
      console.log(`${colors.red}❌ ${method.toUpperCase()} ${endpoint} - Error: ${error.message}${colors.reset}`);
    }
    return false;
  }
}

async function runSwaggerEndpointTests() {
  console.log(`${colors.blue}🔍 Testing All Swagger-Documented Endpoints${colors.reset}\n`);

  const endpoints = [
    // ========== RACES ENDPOINTS ==========
    { method: 'get', endpoint: '/api/races/all', description: 'Get all races' },
    { method: 'get', endpoint: '/api/races', description: 'Get current season races' },
    { method: 'get', endpoint: '/api/races/current', description: 'Get current season races (alternative)' },
    { method: 'get', endpoint: '/api/races/season/2024', description: 'Get races by season' },
    { method: 'get', endpoint: '/api/races/season/2024/round/1', description: 'Get race by season and round' },
    { method: 'post', endpoint: '/api/races/update/2024', description: 'Update race data for season' },

    // ========== SEASONS ENDPOINTS ==========
    { method: 'get', endpoint: '/api/races/seasons', description: 'Get all seasons data' },
    { method: 'get', endpoint: '/api/races/seasons/filter', description: 'Get filtered seasons data' },
    { method: 'get', endpoint: '/api/races/seasons/filter?startYear=2020&endYear=2024&limit=5', description: 'Get filtered seasons with params' },
    { method: 'post', endpoint: '/api/races/seasons/update', description: 'Update seasons data' },

    // ========== LAP DATA ENDPOINTS ==========
    { method: 'get', endpoint: '/api/races/season/2024/round/1/laps', description: 'Get lap data for race' },
    { method: 'get', endpoint: '/api/races/season/2024/round/1/laps/1', description: 'Get specific lap data' },
    { method: 'get', endpoint: '/api/races/2024/1/laps', description: 'Get lap data (direct pattern)' },
    { method: 'post', endpoint: '/api/races/season/2024/round/1/laps/update', description: 'Update lap data' },

    // ========== PIT STOPS ENDPOINTS ==========
    { method: 'get', endpoint: '/api/races/season/2024/round/1/pitstops', description: 'Get pit stop data for race' },
    { method: 'get', endpoint: '/api/races/season/2024/round/1/pitstops/driver/max_verstappen', description: 'Get driver pit stops' },
    { method: 'get', endpoint: '/api/races/2024/1/pitstops', description: 'Get pit stops (direct pattern)' },
    { method: 'post', endpoint: '/api/races/season/2024/round/1/pitstops/update', description: 'Update pit stop data' },

    // ========== CHAMPIONSHIPS ENDPOINTS ==========
    { method: 'get', endpoint: '/api/championships', description: 'Get all championships' },
    { method: 'get', endpoint: '/api/championships/2024', description: 'Get championship by season' },
    { method: 'get', endpoint: '/api/championships/season/2024', description: 'Get championship by season (alternative)' },
    { method: 'post', endpoint: '/api/championships/update', description: 'Update all championships' },

    // ========== DRIVERS ENDPOINTS ==========
    { method: 'get', endpoint: '/api/drivers', description: 'Get all drivers' },
    { method: 'get', endpoint: '/api/drivers?year=2024', description: 'Get drivers with year filter' },
    { method: 'get', endpoint: '/api/drivers/season/2024', description: 'Get drivers by season' },
    { method: 'get', endpoint: '/api/drivers/max_verstappen', description: 'Get driver by ID' },

    // ========== CONSTRUCTORS ENDPOINTS ==========
    { method: 'get', endpoint: '/api/constructors', description: 'Get all constructors' },
    { method: 'get', endpoint: '/api/constructors/red_bull', description: 'Get constructor by ID' },

    // ========== SWAGGER DOCUMENTATION ==========
    { method: 'get', endpoint: '/api-docs/', description: 'Swagger UI page' },
    { method: 'get', endpoint: '/api-docs/swagger.json', description: 'Swagger JSON spec' }
  ];

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  console.log(`${colors.blue}📋 Testing ${endpoints.length} endpoints...${colors.reset}\n`);

  for (const endpoint of endpoints) {
    console.log(`\n🔸 ${endpoint.description}`);
    totalTests++;
    
    const success = await testEndpoint(endpoint.method, endpoint.endpoint);
    if (success) {
      passedTests++;
    } else {
      failedTests++;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Summary
  console.log(`\n${colors.blue}📊 TEST SUMMARY${colors.reset}`);
  console.log(`${colors.blue}═══════════════${colors.reset}`);
  console.log(`Total Tests: ${totalTests}`);
  console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (failedTests === 0) {
    console.log(`\n${colors.green}🎉 All Swagger endpoints are working perfectly!${colors.reset}`);
  } else {
    console.log(`\n${colors.yellow}⚠️ Some endpoints need attention.${colors.reset}`);
  }

  console.log(`\n${colors.blue}🌐 Swagger UI available at: http://localhost:5001/api-docs/${colors.reset}`);
  console.log(`${colors.blue}📄 API Documentation (JSON): http://localhost:5001/api-docs/swagger.json${colors.reset}`);
}

// Enhanced endpoint testing with specific data validation
async function testDataStructures() {
  console.log(`\n${colors.blue}🔍 Testing Data Structure Consistency${colors.reset}\n`);

  try {
    // Test seasons data structure
    console.log(`${colors.blue}Testing seasons data structure...${colors.reset}`);
    const seasonsResponse = await axios.get(`${BASE_URL}/api/races/seasons`);
    if (seasonsResponse.data.seasons && Array.isArray(seasonsResponse.data.seasons)) {
      console.log(`${colors.green}✅ Seasons data structure correct${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ Seasons data structure incorrect${colors.reset}`);
    }

    // Test lap data structure
    console.log(`${colors.blue}Testing lap data structure...${colors.reset}`);
    const lapResponse = await axios.get(`${BASE_URL}/api/races/season/2024/round/1/laps`);
    if (lapResponse.data.laps && Array.isArray(lapResponse.data.laps)) {
      console.log(`${colors.green}✅ Lap data structure correct${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ Lap data structure incorrect${colors.reset}`);
    }

    // Test pit stop data structure
    console.log(`${colors.blue}Testing pit stop data structure...${colors.reset}`);
    const pitStopResponse = await axios.get(`${BASE_URL}/api/races/season/2024/round/1/pitstops`);
    if (pitStopResponse.data.pitStops && Array.isArray(pitStopResponse.data.pitStops)) {
      console.log(`${colors.green}✅ Pit stop data structure correct${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ Pit stop data structure incorrect${colors.reset}`);
    }

  } catch (error) {
    console.log(`${colors.red}❌ Error testing data structures: ${error.message}${colors.reset}`);
  }
}

// Run all tests
async function main() {
  try {
    await runSwaggerEndpointTests();
    await testDataStructures();
  } catch (error) {
    console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  }
}

main().catch(console.error); 