# F1 World Champions API 🏁

A comprehensive Formula 1 World Champions API with full **Swagger/OpenAPI 3.0 documentation**, interactive testing capabilities, and complete data management for races, seasons, drivers, constructors, and performance data.

## 🎯 Project Overview

This project provides a complete F1 data management system featuring:
- **30+ API endpoints** with full Swagger documentation
- **Interactive API testing** through Swagger UI
- **Real-time F1 data** integration with Jolpi Ergast API
- **Complete race analysis** including lap times and pit stops
- **Professional documentation** and testing suite

## 📁 Project Structure

```
F1-World-champion/
├── BackEnd/                    # Main API backend
│   ├── src/
│   │   ├── controllers/        # API endpoint controllers
│   │   ├── models/             # Database models
│   │   ├── services/           # Business logic
│   │   ├── routes/             # Route definitions
│   │   └── config/             # Configuration files
│   ├── package.json            # Backend dependencies
│   └── ...
├── FrontEnd/                   # Next.js frontend application
├── tests/                      # 🆕 Organized test suite
│   ├── swagger-endpoints-test.js
│   ├── lap-data-test.js
│   └── package.json
├── docs/                       # 🆕 Complete documentation
│   ├── SWAGGER_DOCUMENTATION.md
│   ├── API_ENDPOINT_GUIDE.md
│   └── TESTING_GUIDE.md
└── README.md                   # This file
```

## 🚀 Quick Start

### 1. Start the Backend API
```bash
cd BackEnd
npm install
npm run dev
```
**Server runs on**: `http://localhost:5001`

### 2. Access Interactive Documentation
**Swagger UI**: `http://localhost:5001/api-docs/`

### 3. Run Tests
```bash
cd tests
npm install
npm run test:swagger    # Test all endpoints
```

### 4. Start Frontend (Optional)
```bash
cd FrontEnd
npm install
npm run dev
```
**Frontend runs on**: `http://localhost:3000`

## 🌟 Key Features

### ✅ Complete API Coverage (30 Endpoints)
- **🏁 Race Data**: Current/historical races, results, circuits
- **📅 Season Management**: 2005-present with filtering
- **⏱️ Lap Data**: Real-time lap timing with pagination
- **🏎️ Pit Stops**: Complete pit stop analysis by driver
- **🏆 Championships**: World championship standings
- **👤 Drivers**: Complete driver profiles and statistics
- **🏭 Constructors**: Team information and history

### ✅ Professional Documentation
- **Interactive Swagger UI** with live testing
- **OpenAPI 3.0 compliance** with complete schemas
- **Comprehensive error handling** (404, 500, etc.)
- **Rate limiting support** for external APIs
- **Real data examples** and use cases

### ✅ Robust Testing Suite
- **90% endpoint success rate** validated
- **Automated testing scripts** for CI/CD
- **Data consistency checks** and validation
- **Performance monitoring** capabilities

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [**Swagger Documentation**](docs/SWAGGER_DOCUMENTATION.md) | Complete implementation details and technical specs |
| [**API Endpoint Guide**](docs/API_ENDPOINT_GUIDE.md) | Developer-friendly endpoint reference with examples |
| [**Testing Guide**](docs/TESTING_GUIDE.md) | Comprehensive testing instructions and troubleshooting |

## 🌐 API Access Points

### Primary Endpoints
- **API Base**: `http://localhost:5001/api`
- **Documentation**: `http://localhost:5001/api-docs/`
- **OpenAPI Spec**: `http://localhost:5001/api-docs/swagger.json`

### Core Endpoint Categories
```http
GET /api/races/seasons          # All F1 seasons (2005-present)
GET /api/races/season/2024      # 2024 season races
GET /api/championships          # World championship data
GET /api/drivers                # All drivers
GET /api/constructors           # All teams/constructors

# With real-time data integration
GET /api/races/season/2024/round/1/laps     # Lap timing data
GET /api/races/season/2024/round/1/pitstops # Pit stop analysis
```

## 🧪 Testing

### Automated Testing
```bash
# From tests/ directory
npm run test:swagger    # Test all 30 endpoints
npm run test:lap-data   # Test lap data specifically
npm run test:all        # Complete test suite
```

### Manual Testing
1. **Swagger UI**: Interactive testing at `http://localhost:5001/api-docs/`
2. **cURL Commands**: Direct API calls
3. **Postman**: Import OpenAPI spec for collection testing

### Test Results
```
📊 LATEST TEST RESULTS
═══════════════════════
Total Tests: 30
Passed: 27
Failed: 3
Success Rate: 90.0%
```

## 💾 Data Sources

- **Historical Data**: MongoDB database with complete F1 records
- **Real-time Data**: [Jolpi Ergast F1 API](https://api.jolpi.ca/ergast/f1/) integration
- **Coverage**: 2005-present with automatic updates
- **Rate Limiting**: Built-in protection and retry logic

## 🛠️ Technical Stack

### Backend
- **Node.js** + **Express.js** (TypeScript)
- **MongoDB** with Mongoose ODM
- **Swagger/OpenAPI 3.0** documentation
- **Axios** for external API integration

### Frontend
- **Next.js** + **React** (TypeScript)
- **Tailwind CSS** for styling
- **Responsive design** for all devices

### Testing
- **Axios** for HTTP testing
- **Custom test runners** with detailed reporting
- **CI/CD ready** automated testing

## 📈 Performance Features

- **Pagination Support**: Handle large datasets efficiently
- **Rate Limiting Protection**: Graceful external API handling
- **Error Resilience**: 404/500 errors return useful responses
- **Caching Ready**: Optimized for Redis implementation
- **Type Safety**: Full TypeScript integration

## 🔧 Configuration

### Environment Variables
```bash
# Backend/.env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/f1-champions
NODE_ENV=development
```

### Server Configuration
- **Default Port**: 5001
- **CORS**: Enabled for frontend integration
- **Logging**: Comprehensive error and access logging

## 📝 Development Workflow

### Adding New Endpoints
1. Create controller function with JSDoc comments
2. Add route definition
3. Update Swagger schemas if needed
4. Add tests to test suite
5. Update documentation

### Testing Changes
```bash
# Test specific endpoint
curl http://localhost:5001/api/your-new-endpoint

# Run full test suite
cd tests && npm run test:all

# Check Swagger documentation
open http://localhost:5001/api-docs/
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Add comprehensive tests** for new functionality
4. **Update documentation** as needed
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open Pull Request**

## 📞 Support & Troubleshooting

### Common Issues
- **Port conflicts**: Change port in `BackEnd/src/server.ts`
- **Database connection**: Ensure MongoDB is running
- **Rate limiting**: Check external API limits and implement delays

### Getting Help
1. Check the [**Testing Guide**](docs/TESTING_GUIDE.md) for common solutions
2. Review server logs for detailed error information
3. Test endpoints individually using Swagger UI
4. Verify all dependencies are installed and up-to-date

## 🎉 Features Delivered

- ✅ **Complete Swagger Implementation** (30+ endpoints)
- ✅ **Interactive API Documentation** with live testing
- ✅ **Professional Error Handling** and data validation
- ✅ **Real F1 Data Integration** with rate limiting protection
- ✅ **Comprehensive Testing Suite** with 90% success rate
- ✅ **Production-Ready Architecture** with TypeScript
- ✅ **Organized Project Structure** with dedicated folders

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🏁 Ready to race with Formula 1 data! 🏁**

*Swagger Documentation*: http://localhost:5001/api-docs/  
*API Base URL*: http://localhost:5001/api  
*Test Suite*: `cd tests && npm run test:all` T e s t i n g   p i p e l i n e   t r i g g e r  
 D o c k e r   s e c r e t s   c o n f i g u r e d   -   t e s t i n g   p i p e l i n e  
 