# F1 World Champions API Testing Guide

## 🧪 Overview

This guide provides comprehensive instructions for testing the F1 World Champions API endpoints, Swagger documentation, and data integrity.

## 📁 Test Structure

```
tests/
├── package.json              # Test dependencies and scripts
├── swagger-endpoints-test.js  # Comprehensive endpoint testing
└── lap-data-test.js          # Specialized lap data testing
```

## 🚀 Quick Start

### 1. Install Test Dependencies
```bash
cd tests
npm install
```

### 2. Start the Backend Server
```bash
cd ../BackEnd
npm run dev
```

### 3. Run Tests
```bash
# From tests/ directory
npm run test:swagger    # Test all Swagger endpoints
npm run test:lap-data   # Test lap data specifically
npm run test:all        # Run all tests
```

## 🔍 Test Categories

### 1. Swagger Endpoint Tests (`swagger-endpoints-test.js`)

**Purpose**: Validates all 30 documented API endpoints

**Coverage**:
- ✅ Race endpoints (6 endpoints)
- ✅ Season endpoints (4 endpoints)
- ✅ Lap data endpoints (4 endpoints)
- ✅ Pit stop endpoints (4 endpoints)
- ✅ Championship endpoints (4 endpoints)
- ✅ Driver endpoints (4 endpoints)
- ✅ Constructor endpoints (2 endpoints)
- ✅ Documentation endpoints (2 endpoints)

**Features**:
- Status code validation
- Response structure analysis
- Error handling verification
- Data format consistency checks

**Sample Output**:
```
🔍 Testing All Swagger-Documented Endpoints

📋 Testing 30 endpoints...

🔸 Get all races
Testing GET /api/races/all
✅ GET /api/races/all - Status: 200
   📊 Array response with 12 items

📊 TEST SUMMARY
═══════════════
Total Tests: 30
Passed: 27
Failed: 3
Success Rate: 90.0%
```

### 2. Lap Data Tests (`lap-data-test.js`)

**Purpose**: Specialized testing for lap timing data with pagination

**Features**:
- External API integration testing
- Pagination handling
- Rate limiting detection
- Data structure validation

**Use Cases**:
- Debug lap data fetching issues
- Test external API connectivity
- Validate pagination logic

## 📊 Test Results Interpretation

### Success Indicators
- **Status 200**: Endpoint working correctly
- **Status 404**: Expected for missing data (not an error)
- **Array/Object Structure**: Proper data format returned

### Warning Signs
- **Timeout**: Usually indicates rate limiting or slow external API
- **Status 500**: Server error requiring investigation
- **Empty Arrays**: May indicate missing data or API issues

### Common Issues and Solutions

#### Rate Limiting (429 Errors)
```
❌ GET /api/races/season/2024/round/1/laps - Error: timeout of 10000ms exceeded
```
**Solution**: 
- Implement delays between requests
- Add retry logic with exponential backoff
- Cache responses when possible

#### Server Errors (500)
```
❌ GET /api/constructors - Status: 500
```
**Solution**:
- Check server logs for detailed error information
- Verify database connectivity
- Ensure all required services are running

#### Data Format Issues
```
❌ Seasons data structure incorrect
```
**Solution**:
- Verify response wrapper format: `{message, total, seasons}`
- Check controller response structure
- Validate schema definitions

## 🔧 Manual Testing

### Using Swagger UI
1. Navigate to `http://localhost:5001/api-docs/`
2. Expand endpoint categories
3. Click "Try it out" on any endpoint
4. Fill in required parameters
5. Click "Execute"
6. Review response data and status codes

### Using cURL Commands
```bash
# Test seasons endpoint
curl -X GET "http://localhost:5001/api/races/seasons" -H "accept: application/json"

# Test specific race
curl -X GET "http://localhost:5001/api/races/season/2024/round/1" -H "accept: application/json"

# Test pit stops with driver filter
curl -X GET "http://localhost:5001/api/races/season/2024/round/1/pitstops/driver/max_verstappen" -H "accept: application/json"
```

### Using Postman
1. Import the OpenAPI specification: `http://localhost:5001/api-docs/swagger.json`
2. Create a new collection from the imported spec
3. Configure environment variables (base URL, etc.)
4. Run individual requests or entire collections

## 📈 Performance Testing

### Load Testing Endpoints
```javascript
// Example load test with multiple concurrent requests
const concurrentRequests = 10;
const promises = [];

for (let i = 0; i < concurrentRequests; i++) {
  promises.push(axios.get('http://localhost:5001/api/races/seasons'));
}

const results = await Promise.allSettled(promises);
console.log(`Completed ${results.length} concurrent requests`);
```

### Response Time Monitoring
```javascript
// Measure endpoint response times
const startTime = Date.now();
const response = await axios.get('http://localhost:5001/api/races/all');
const endTime = Date.now();
console.log(`Response time: ${endTime - startTime}ms`);
```

## 🛠️ Custom Test Scripts

### Creating New Tests
```javascript
// Template for new test function
async function testCustomEndpoint() {
  try {
    const response = await axios.get('http://localhost:5001/api/your-endpoint');
    
    // Validate status code
    if (response.status !== 200) {
      console.error(`❌ Expected 200, got ${response.status}`);
      return false;
    }
    
    // Validate response structure
    if (!response.data || !Array.isArray(response.data.yourArray)) {
      console.error('❌ Invalid response structure');
      return false;
    }
    
    console.log('✅ Custom endpoint test passed');
    return true;
  } catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
    return false;
  }
}
```

## 🔍 Data Validation Tests

### Schema Validation
```javascript
// Validate race data structure
function validateRaceData(race) {
  const requiredFields = ['_id', 'season', 'round', 'raceName', 'date'];
  
  for (const field of requiredFields) {
    if (!(field in race)) {
      console.error(`❌ Missing required field: ${field}`);
      return false;
    }
  }
  
  console.log('✅ Race data structure valid');
  return true;
}
```

### Data Consistency Checks
```javascript
// Check season data consistency
async function validateSeasonConsistency() {
  const seasons = await axios.get('http://localhost:5001/api/races/seasons');
  const currentYear = new Date().getFullYear();
  
  // Verify seasons are in descending order
  for (let i = 0; i < seasons.data.seasons.length - 1; i++) {
    const current = parseInt(seasons.data.seasons[i].season);
    const next = parseInt(seasons.data.seasons[i + 1].season);
    
    if (current <= next) {
      console.error('❌ Seasons not in descending order');
      return false;
    }
  }
  
  console.log('✅ Season data consistency valid');
  return true;
}
```

## 📋 Test Checklist

### Pre-Test Setup
- [ ] Backend server running on port 5001
- [ ] Database connected and populated
- [ ] Test dependencies installed
- [ ] External API connectivity verified

### Core Functionality Tests
- [ ] All race endpoints return valid data
- [ ] Season filtering works correctly
- [ ] Lap data pagination handles rate limits
- [ ] Pit stop data includes all drivers
- [ ] Championship data is up-to-date
- [ ] Driver and constructor lookups work

### Error Handling Tests
- [ ] 404 responses for missing data
- [ ] 500 errors are handled gracefully
- [ ] Invalid parameters return appropriate errors
- [ ] Rate limiting is managed properly

### Documentation Tests
- [ ] Swagger UI loads correctly
- [ ] All endpoints documented
- [ ] Example responses match actual data
- [ ] Interactive testing works in Swagger UI

## 🚨 Troubleshooting

### Common Issues

#### Server Not Starting
```bash
# Check if port 5001 is already in use
netstat -ano | findstr :5001

# Kill process if needed (Windows)
taskkill /PID <PID> /F
```

#### Database Connection Issues
```bash
# Verify MongoDB is running
mongosh --eval "db.adminCommand('ismaster')"
```

#### External API Rate Limiting
- Implement exponential backoff
- Add request delays
- Cache responses locally
- Monitor API usage limits

## 📞 Support

For testing issues or questions:
1. Check the Swagger documentation: `http://localhost:5001/api-docs/`
2. Review server logs for detailed error information
3. Verify all dependencies are installed and up-to-date
4. Test individual endpoints manually before running automated tests

---

**🏁 Happy Testing! 🏁** 