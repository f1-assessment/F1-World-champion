// @ts-nocheck
import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';

// Mock all external dependencies before any imports
jest.mock('../../config/database.js', () => ({
  default: jest.fn().mockResolvedValue({
    connection: { host: 'mock-host' }
  })
}));

// Mock mongoose models
jest.mock('../../models/Race.js', () => ({
  default: {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({}),
    updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
    deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 })
  }
}));

jest.mock('../../models/Driver.js', () => ({
  default: {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({}),
    updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 })
  }
}));

jest.mock('../../models/Constructor.js', () => ({
  default: {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({}),
    updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 })
  }
}));

jest.mock('../../models/Championship.js', () => ({
  default: {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({}),
    updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 })
  }
}));

// Mock axios for external API calls
jest.mock('axios', () => ({
  default: {
    get: jest.fn().mockResolvedValue({
      data: {
        MRData: {
          SeasonTable: { Seasons: [] },
          RaceTable: { Races: [] },
          DriverTable: { Drivers: [] },
          ConstructorTable: { Constructors: [] },
          StandingsTable: { StandingsLists: [] }
        }
      }
    })
  }
}));

// Mock all service layers to return controlled data
jest.mock('../../services/raceService.js', () => ({
  getAllRaces: jest.fn().mockResolvedValue([]),
  getCurrentSeasonRaces: jest.fn().mockResolvedValue([]),
  getRacesBySeason: jest.fn().mockResolvedValue([]),
  getRaceBySeasonAndRound: jest.fn().mockResolvedValue(null),
  getLapData: jest.fn().mockResolvedValue([]),
  getPitStopData: jest.fn().mockResolvedValue([]),
  getSeasonsData: jest.fn().mockResolvedValue([]),
  getFilteredSeasonsData: jest.fn().mockResolvedValue([]),
  updateRaceData: jest.fn().mockResolvedValue([])
}));

jest.mock('../../services/driverService.js', () => ({
  getAllDrivers: jest.fn().mockResolvedValue([]),
  getDriversBySeason: jest.fn().mockResolvedValue([]),
  getDriversByYearRange: jest.fn().mockResolvedValue([]),
  getDriverById: jest.fn().mockResolvedValue(null),
  findOrCreateDriver: jest.fn().mockResolvedValue(null)
}));

jest.mock('../../services/constructorService.js', () => ({
  getAllConstructors: jest.fn().mockResolvedValue([]),
  getConstructorById: jest.fn().mockResolvedValue(null),
  findOrCreateConstructor: jest.fn().mockResolvedValue(null)
}));

jest.mock('../../services/championshipService.js', () => ({
  getAllChampionships: jest.fn().mockResolvedValue([]),
  getChampionshipBySeason: jest.fn().mockResolvedValue(null),
  updateAllChampionships: jest.fn().mockResolvedValue({ 
    message: 'Successfully updated 0 championships',
    updatedCount: 0,
    yearRange: '2005-2025'
  })
}));

describe('F1 Championship API Integration Tests', () => {
  
  describe('Health Check', () => {
    test('GET / should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('F1 World Champion API');
    });
  });

  describe('Driver Endpoints', () => {
    test('GET /api/drivers should return drivers list', async () => {
      const response = await request(app)
        .get('/api/drivers')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/drivers with year range should work', async () => {
      const response = await request(app)
        .get('/api/drivers?startYear=2020&endYear=2024')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/drivers with invalid year should return 400', async () => {
      const response = await request(app)
        .get('/api/drivers?startYear=abc')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('GET /api/drivers/season/:year should return drivers for season', async () => {
      const response = await request(app)
        .get('/api/drivers/season/2024')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/drivers/:driverId should return specific driver', async () => {
      const response = await request(app)
        .get('/api/drivers/verstappen')
        .expect(404); // Expected since mock returns null

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Constructor Endpoints', () => {
    test('GET /api/constructors should return constructors list', async () => {
      const response = await request(app)
        .get('/api/constructors')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/constructors/:constructorId should return specific constructor', async () => {
      const response = await request(app)
        .get('/api/constructors/red_bull')
        .expect(404); // Expected since mock returns null

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Championship Endpoints', () => {
    test('GET /api/championships should return championships list', async () => {
      const response = await request(app)
        .get('/api/championships')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/championships/season/:year should return championship for season', async () => {
      const response = await request(app)
        .get('/api/championships/season/2024')
        .expect(404); // Expected since mock returns null

      expect(response.body).toHaveProperty('error');
    });

    test('POST /api/championships/update should update championship', async () => {
      const response = await request(app)
        .post('/api/championships/update')
        .send({ year: 2024 })
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    test('PUT /api/championships/update-all should update all championships', async () => {
      const response = await request(app)
        .put('/api/championships/update-all')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('updatedCount');
    });
  });

  describe('Race Endpoints', () => {
    test('GET /api/races should return all races', async () => {
      const response = await request(app)
        .get('/api/races')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/races/current should return current season races', async () => {
      const response = await request(app)
        .get('/api/races/current')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/races/season/:year should return races for season', async () => {
      const response = await request(app)
        .get('/api/races/season/2024')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/races/:year/:round should return specific race', async () => {
      const response = await request(app)
        .get('/api/races/2024/1')
        .expect(404); // Expected since no race data in mock

      expect(response.body).toHaveProperty('error');
    });

    test('PUT /api/races/update/:year should update races for year', async () => {
      const response = await request(app)
        .put('/api/races/update/2024')
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    test('GET /api/races/:year/:round/laps should return lap data', async () => {
      const response = await request(app)
        .get('/api/races/2024/1/laps')
        .expect(200); // Changed to 200 since we're mocking empty arrays

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/races/:year/:round/pitstops should return pitstop data', async () => {
      const response = await request(app)
        .get('/api/races/2024/1/pitstops')
        .expect(200); // Changed to 200 since we're mocking empty arrays

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/races/seasons should return seasons data', async () => {
      const response = await request(app)
        .get('/api/races/seasons')
        .expect(200); // Changed to 200 since we're mocking

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/races/seasons/filtered should return filtered seasons', async () => {
      const response = await request(app)
        .get('/api/races/seasons/filtered?startYear=2020&limit=5')
        .expect(200); // Changed to 200 since we're mocking

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for unknown endpoints', async () => {
      const response = await request(app)
        .get('/api/unknown-endpoint')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    test('should handle malformed JSON in POST requests', async () => {
      const response = await request(app)
        .post('/api/championships/update')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should handle missing required parameters', async () => {
      const response = await request(app)
        .get('/api/drivers/season/abc')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('CORS and Security Headers', () => {
    test('should include CORS headers', async () => {
      const response = await request(app)
        .get('/api/drivers')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    test('should handle OPTIONS requests', async () => {
      const response = await request(app)
        .options('/api/drivers')
        .expect(204);

      expect(response.headers).toHaveProperty('access-control-allow-methods');
    });
  });

  describe('Performance and Load', () => {
    test('should handle multiple concurrent requests', async () => {
      const requests = Array(5).fill(null).map(() => 
        request(app).get('/api/drivers')
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    test('should complete requests within reasonable time', async () => {
      const start = Date.now();
      await request(app)
        .get('/api/drivers')
        .expect(200);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
  });
}); 