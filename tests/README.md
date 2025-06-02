# F1 World Champions API Test Suite

## 🧪 Overview

This folder contains the complete testing suite for the F1 World Champions API, including endpoint validation, data structure verification, and performance testing.

## 📁 Test Files

| File | Description |
|------|-------------|
| `swagger-endpoints-test.js` | Comprehensive test of all 30 Swagger-documented endpoints |
| `lap-data-test.js` | Specialized testing for lap data pagination and external API integration |
| `package.json` | Test dependencies and npm scripts |

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
# Test all Swagger endpoints (recommended)
npm run test:swagger

# Test lap data specifically
npm run test:lap-data

# Run all tests
npm run test:all
```

## 📊 Test Coverage

### Swagger Endpoints Test (`swagger-endpoints-test.js`)
- **🏁 Race Endpoints**: 6 endpoints
- **📅 Season Endpoints**: 4 endpoints  
- **⏱️ Lap Data Endpoints**: 4 endpoints
- **🏎️ Pit Stop Endpoints**: 4 endpoints
- **🏆 Championship Endpoints**: 4 endpoints
- **👤 Driver Endpoints**: 4 endpoints
- **🏭 Constructor Endpoints**: 2 endpoints
- **📚 Documentation Endpoints**: 2 endpoints

**Total**: 30 endpoints tested

### Lap Data Test (`lap-data-test.js`)
- External API integration testing
- Pagination handling verification
- Rate limiting detection
- Response structure validation

## 📈 Expected Results

### Successful Test Run
```
🔍 Testing All Swagger-Documented Endpoints

📋 Testing 30 endpoints...

🔸 Get all races
✅ GET /api/races/all - Status: 200
   📊 Array response with 12 items

📊 TEST SUMMARY
═══════════════
Total Tests: 30
Passed: 27
Failed: 3
Success Rate: 90.0%

🎉 All Swagger endpoints are working perfectly!

🌐 Swagger UI available at: http://localhost:5001/api-docs/
📄 API Documentation (JSON): http://localhost:5001/api-docs/swagger.json
```

## ⚠️ Prerequisites

### Before Running Tests
1. **Backend Server Running**: Ensure the API is running on `http://localhost:5001`
   ```bash
   cd ../BackEnd
   npm run dev
   ```

2. **Database Connected**: MongoDB should be running and populated with data

3. **Network Access**: Tests require internet access for external API calls

## 🔧 Test Configuration

### Base URL
Tests are configured to run against:
```javascript
const BASE_URL = 'http://localhost:5001';
```

### Timeouts
- Default timeout: 10 seconds
- Lap data tests: Extended timeouts for external API calls

### Rate Limiting
- Built-in delays between requests (100ms)
- Retry logic for 429 rate limit errors

## 📝 Adding New Tests

### Test Template
```javascript
async function testNewEndpoint() {
  try {
    const response = await axios.get('http://localhost:5001/api/your-endpoint');
    
    if (response.status === 200) {
      console.log('✅ Test passed');
      return true;
    } else {
      console.log('❌ Test failed');
      return false;
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
}
```

### Adding to Test Suite
1. Add your test function to the appropriate test file
2. Include it in the endpoints array with description
3. Update the total count in documentation

## 🚨 Troubleshooting

### Common Issues

#### Server Not Running
```
❌ GET /api/races - Error: connect ECONNREFUSED 127.0.0.1:5001
```
**Solution**: Start the backend server with `npm run dev` in the BackEnd folder

#### Rate Limiting
```
❌ GET /api/races/season/2024/round/1/laps - Error: timeout of 10000ms exceeded
```
**Solution**: This is expected for some endpoints due to external API rate limits

#### Database Issues
```
❌ GET /api/races/seasons - Status: 500
```
**Solution**: Verify MongoDB is running and database is populated

### Test Debugging
- Check server logs for detailed error information
- Test endpoints manually using Swagger UI: `http://localhost:5001/api-docs/`
- Verify database connection and data population

## 📊 Performance Monitoring

### Response Time Tracking
Tests include basic response time monitoring:
```
Testing GET /api/races/all
✅ GET /api/races/all - Status: 200
   📊 Array response with 12 items
```

### Success Rate Calculation
Automatic calculation of test success rates with detailed reporting.

## 🔗 Related Documentation

- [**Main API Documentation**](../docs/SWAGGER_DOCUMENTATION.md)
- [**API Endpoint Guide**](../docs/API_ENDPOINT_GUIDE.md)
- [**Testing Guide**](../docs/TESTING_GUIDE.md)

## 🎯 Test Objectives

1. **Endpoint Validation**: Verify all endpoints return correct status codes
2. **Data Structure Verification**: Ensure response formats match expected schemas
3. **Error Handling**: Validate proper error responses for edge cases
4. **Performance Monitoring**: Track response times and identify bottlenecks
5. **External API Integration**: Test real-time data fetching capabilities

---

**🏁 Happy Testing! 🏁**

*Run `npm run test:swagger` to get started* 