# Testing Guide for F1 World Champion Backend

## Overview

This document provides comprehensive guidance for testing the F1 World Champion backend application. The testing setup includes unit tests, integration tests, and end-to-end testing using Jest, Supertest, and MongoDB Memory Server.

## Testing Stack

- **Jest**: JavaScript testing framework for unit and integration tests
- **Supertest**: HTTP assertion library for testing Express endpoints
- **MongoDB Memory Server**: In-memory MongoDB instance for testing
- **TypeScript**: Type-safe testing with Jest and ts-jest

## Installation

```bash
npm install --save-dev jest @types/jest supertest @types/supertest mongodb-memory-server ts-jest
```

## Configuration

### Jest Configuration (`jest.config.js`)

```javascript
export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapping: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/tests/**/*.test.ts',
    '<rootDir>/src/tests/**/*.spec.ts',
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/tests/**/*',
    '!src/server.ts',
    '!src/config/**/*',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))',
  ],
};
```

### TypeScript Configuration for Tests

Add the following to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["jest", "node"],
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

## Test Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "NODE_OPTIONS=\"--experimental-vm-modules\" jest",
    "test:watch": "NODE_OPTIONS=\"--experimental-vm-modules\" jest --watch",
    "test:coverage": "NODE_OPTIONS=\"--experimental-vm-modules\" jest --coverage",
    "test:unit": "NODE_OPTIONS=\"--experimental-vm-modules\" jest --testPathPattern=unit",
    "test:integration": "NODE_OPTIONS=\"--experimental-vm-modules\" jest --testPathPattern=integration"
  }
}
```

## Test Structure

```
src/tests/
├── setup.ts                    # Test environment setup utilities
├── unit/                       # Unit tests
│   ├── raceController.test.ts   # Controller unit tests
│   ├── raceService.test.ts      # Service unit tests
│   └── models/                  # Model unit tests
├── integration/                 # Integration tests
│   ├── raceRoutes.test.ts       # API endpoint tests
│   └── database.test.ts         # Database integration tests
└── e2e/                        # End-to-end tests
    └── api.test.ts             # Full API workflow tests
```

## Unit Testing

### Testing Controllers

Controllers should be tested by mocking the service layer:

```typescript
import { Request, Response } from 'express';
import * as raceController from '../../controllers/raceController.js';
import * as raceService from '../../services/raceService.js';

// Mock the service
jest.mock('../../services/raceService.js');
const mockRaceService = raceService as jest.Mocked<typeof raceService>;

describe('Race Controller Tests', () => {
  test('getAllRaces should return races with 200 status', async () => {
    const mockRaces = [{ season: '2024', round: '1' }];
    mockRaceService.getAllRaces.mockResolvedValue(mockRaces);

    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    await raceController.getAllRaces(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockRaces);
  });
});
```

### Testing Services

Services should be tested by mocking external dependencies:

```typescript
import axios from 'axios';
import * as raceService from '../../services/raceService.js';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Race Service Tests', () => {
  test('fetchLapDataFromAPI should return lap data', async () => {
    const mockResponse = {
      data: {
        MRData: {
          RaceTable: {
            Races: [{ Laps: [{ number: '1' }] }]
          }
        }
      }
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await raceService.fetchLapDataFromAPI('2024', '1');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.jolpi.ca/ergast/f1/2024/1/laps'
    );
    expect(result).toEqual([{ number: '1' }]);
  });
});
```

## Integration Testing

### Testing API Endpoints

Integration tests should test the full request/response cycle:

```typescript
import request from 'supertest';
import express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import raceRoutes from '../../routes/raceRoutes.js';
import Race from '../../models/Race.js';

const app = express();
app.use(express.json());
app.use('/api/races', raceRoutes);

describe('Race Routes Integration Tests', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Race.deleteMany({});
  });

  test('GET /api/races/all should return all races', async () => {
    const testRace = new Race({
      season: '2024',
      round: '1',
      raceName: 'Test Grand Prix'
    });
    await testRace.save();

    const response = await request(app)
      .get('/api/races/all')
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].season).toBe('2024');
  });
});
```

## Test Coverage

### Coverage Requirements

- **Functions**: 70% minimum coverage
- **Lines**: 70% minimum coverage
- **Branches**: 70% minimum coverage
- **Statements**: 70% minimum coverage

### Generating Coverage Reports

```bash
npm run test:coverage
```

This generates reports in:
- `coverage/lcov-report/index.html` - HTML report
- `coverage/lcov.info` - LCOV format for CI/CD
- Terminal output with summary

## Mocking Strategies

### External API Calls

```typescript
// Mock axios for external API calls
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  mockedAxios.get.mockClear();
});
```

### Database Operations

```typescript
// Mock Mongoose models
jest.mock('../../models/Race.js');
const MockedRace = Race as jest.Mocked<typeof Race>;

beforeEach(() => {
  MockedRace.find.mockClear();
  MockedRace.findOne.mockClear();
});
```

### Environment Variables

```typescript
// Mock environment variables
const originalEnv = process.env;

beforeEach(() => {
  process.env = {
    ...originalEnv,
    NODE_ENV: 'test',
    MONGODB_URI: 'mongodb://localhost:27017/test'
  };
});

afterEach(() => {
  process.env = originalEnv;
});
```

## Test Data Management

### Test Fixtures

Create reusable test data:

```typescript
export const testFixtures = {
  race: {
    season: '2024',
    round: '1',
    raceName: 'Bahrain Grand Prix',
    date: '2024-03-02',
    circuit: {
      circuitId: 'bahrain',
      circuitName: 'Bahrain International Circuit',
      location: {
        locality: 'Sakhir',
        country: 'Bahrain'
      }
    }
  },
  
  lapData: [
    {
      number: '1',
      timings: [
        { driverId: 'verstappen', position: '1', time: '1:30.000' }
      ]
    }
  ]
};
```

### Database Seeding

```typescript
export const seedDatabase = async () => {
  await Race.deleteMany({});
  
  const races = [
    new Race(testFixtures.race),
    new Race({ ...testFixtures.race, round: '2' })
  ];
  
  await Race.insertMany(races);
};
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm run test:coverage
      
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v2
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

## Best Practices

### 1. Test Naming
- Use descriptive test names that explain the scenario
- Follow the pattern: "should [expected behavior] when [condition]"

### 2. Test Structure
- Arrange: Set up test data and mocks
- Act: Execute the function being tested
- Assert: Verify the expected outcomes

### 3. Isolation
- Each test should be independent
- Clean up after each test
- Don't rely on test execution order

### 4. Mocking
- Mock external dependencies
- Don't mock the code you're testing
- Use the minimum necessary mocking

### 5. Coverage
- Aim for meaningful coverage, not just high percentages
- Test edge cases and error conditions
- Include both positive and negative test cases

## Troubleshooting

### Common Issues

1. **Module import errors**: Ensure proper ESM configuration
2. **MongoDB connection issues**: Check MongoMemoryServer setup
3. **Async test timeouts**: Increase Jest timeout for integration tests
4. **Type errors**: Ensure proper TypeScript configuration

### Debug Mode

```bash
# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Example Test Files

The testing setup includes examples for:
- Unit testing controllers with mocked services
- Unit testing services with mocked external APIs
- Integration testing API endpoints
- Testing database operations
- Error handling scenarios
- Performance testing

This comprehensive testing strategy ensures reliability, maintainability, and confidence in the F1 World Champion backend application. 