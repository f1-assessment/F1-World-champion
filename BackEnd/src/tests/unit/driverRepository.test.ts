import { jest } from '@jest/globals';
import * as driverRepository from '../../repositories/driverRepository.js';
import Driver from '../../models/Driver.js';
import Race from '../../models/Race.js';
import { IDriver } from '../../types/index.js';

// Mock mongoose models with proper typing
jest.mock('../../models/Driver.js', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

jest.mock('../../models/Race.js', () => ({
  __esModule: true,
  default: {
    aggregate: jest.fn(),
  }
}));

// Use proper Jest mock typing instead of 'as any'
const MockDriver = Driver as jest.Mocked<typeof Driver>;
const MockRace = Race as jest.Mocked<typeof Race>;

// Mock data
const mockDriverData = {
  _id: '507f1f77bcf86cd799439011',
  driverId: 'verstappen',
  permanentNumber: '1',
  code: 'VER',
  url: 'http://en.wikipedia.org/wiki/Max_Verstappen',
  givenName: 'Max',
  familyName: 'Verstappen',
  dateOfBirth: '1997-09-30',
  nationality: 'Dutch',
  fullName: 'Max Verstappen',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

const mockDriverData2 = {
  _id: '507f1f77bcf86cd799439012',
  driverId: 'hamilton',
  permanentNumber: '44',
  code: 'HAM',
  url: 'http://en.wikipedia.org/wiki/Lewis_Hamilton',
  givenName: 'Lewis',
  familyName: 'Hamilton',
  dateOfBirth: '1985-01-07',
  nationality: 'British',
  fullName: 'Lewis Hamilton'
};

const mockDriversArray = [mockDriverData, mockDriverData2];

describe('Driver Repository Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByDriverId', () => {
    test('should find driver by driverId successfully', async () => {
      MockDriver.findOne.mockResolvedValue(mockDriverData);

      const result = await driverRepository.findByDriverId('verstappen');

      expect(MockDriver.findOne).toHaveBeenCalledWith({ driverId: 'verstappen' });
      expect(result).toEqual(mockDriverData);
    });

    test('should return null when driver not found', async () => {
      MockDriver.findOne.mockResolvedValue(null);

      const result = await driverRepository.findByDriverId('nonexistent');

      expect(MockDriver.findOne).toHaveBeenCalledWith({ driverId: 'nonexistent' });
      expect(result).toBeNull();
    });

    test('should handle database errors', async () => {
      MockDriver.findOne.mockRejectedValue(new Error('Database error'));

      await expect(driverRepository.findByDriverId('verstappen'))
        .rejects.toThrow('Database error');
    });

    test('should handle various driver ID formats', async () => {
      const driverIds = ['verstappen', 'hamilton', 'leclerc'];
      
      for (const driverId of driverIds) {
        MockDriver.findOne.mockResolvedValue(mockDriverData);

        await driverRepository.findByDriverId(driverId);
        expect(MockDriver.findOne).toHaveBeenCalledWith({ driverId });
        
        jest.clearAllMocks();
      }
    });
  });

  describe('create', () => {
    test('should create new driver successfully', async () => {
      const newDriverData = {
        driverId: 'leclerc',
        permanentNumber: '16',
        code: 'LEC',
        url: 'http://en.wikipedia.org/wiki/Charles_Leclerc',
        givenName: 'Charles',
        familyName: 'Leclerc',
        dateOfBirth: '1997-10-16',
        nationality: 'Monégasque',
        fullName: 'Charles Leclerc'
      };

      MockDriver.create.mockResolvedValue({ ...newDriverData, _id: 'new_id' });

      const result = await driverRepository.create(newDriverData);

      expect(MockDriver.create).toHaveBeenCalledWith(newDriverData);
      expect(result).toEqual({ ...newDriverData, _id: 'new_id' });
    });

    test('should handle partial driver data', async () => {
      const partialData = {
        driverId: 'leclerc',
        givenName: 'Charles',
        familyName: 'Leclerc'
      };

      MockDriver.create.mockResolvedValue({ ...partialData, _id: 'new_id' });

      const result = await driverRepository.create(partialData);

      expect(MockDriver.create).toHaveBeenCalledWith(partialData);
      expect(result).toEqual({ ...partialData, _id: 'new_id' });
    });

    test('should handle database creation errors', async () => {
      MockDriver.create.mockRejectedValue(new Error('Creation error'));

      await expect(driverRepository.create({ driverId: 'test' }))
        .rejects.toThrow('Creation error');
    });

    test('should create driver with minimal data', async () => {
      const minimalData = { driverId: 'test' };
      MockDriver.create.mockResolvedValue({ ...minimalData, _id: 'new_id' });

      const result = await driverRepository.create(minimalData);

      expect(MockDriver.create).toHaveBeenCalledWith(minimalData);
      expect(result).toEqual({ ...minimalData, _id: 'new_id' });
    });
  });

  describe('findAll', () => {
    test('should return all drivers sorted by familyName', async () => {
      const mockQuery = {
        sort: jest.fn().mockResolvedValue(mockDriversArray),
      };

      MockDriver.find.mockReturnValue(mockQuery);

      const result = await driverRepository.findAll();

      expect(MockDriver.find).toHaveBeenCalledWith();
      expect(mockQuery.sort).toHaveBeenCalledWith({ familyName: 1 });
      expect(result).toEqual(mockDriversArray);
    });

    test('should return empty array when no drivers exist', async () => {
      const mockQuery = {
        sort: jest.fn().mockResolvedValue([]),
      };

      MockDriver.find.mockReturnValue(mockQuery);

      const result = await driverRepository.findAll();

      expect(MockDriver.find).toHaveBeenCalledWith();
      expect(mockQuery.sort).toHaveBeenCalledWith({ familyName: 1 });
      expect(result).toEqual([]);
    });

    test('should handle database errors', async () => {
      const mockQuery = {
        sort: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      MockDriver.find.mockReturnValue(mockQuery);

      await expect(driverRepository.findAll())
        .rejects.toThrow('Database error');
    });

    test('should verify sort order for driver names', async () => {
      const sortedDrivers = [
        { ...mockDriverData, familyName: 'Hamilton' },
        { ...mockDriverData, familyName: 'Verstappen' }
      ];

      const mockQuery = {
        sort: jest.fn().mockResolvedValue(sortedDrivers),
      };

      MockDriver.find.mockReturnValue(mockQuery);

      const result = await driverRepository.findAll();

      expect(mockQuery.sort).toHaveBeenCalledWith({ familyName: 1 });
      expect(result).toEqual(sortedDrivers);
    });
  });

  describe('findActiveDrivers', () => {
    test('should return drivers from year 2005 onwards', async () => {
      const aggregateResult = [
        { _id: 'verstappen' },
        { _id: 'hamilton' }
      ];

      MockRace.aggregate.mockResolvedValue(aggregateResult);

      const result = await driverRepository.findActiveDrivers();

      expect(MockRace.aggregate).toHaveBeenCalledWith([
        { 
          $match: { 
            season: { 
              $gte: "2005", 
              $lte: new Date().getFullYear().toString() 
            } 
          } 
        },
        { $unwind: "$results" },
        { $group: { _id: "$results.driverId" } },
        { $sort: { _id: 1 } }
      ]);
      expect(result).toEqual(['verstappen', 'hamilton']);
    });

    test('should handle empty aggregation result', async () => {
      MockRace.aggregate.mockResolvedValue([]);

      const result = await driverRepository.findActiveDrivers();

      expect(result).toEqual([]);
    });

    test('should handle database aggregation errors', async () => {
      MockRace.aggregate.mockRejectedValue(new Error('Aggregation error'));

      await expect(driverRepository.findActiveDrivers())
        .rejects.toThrow('Aggregation error');
    });
  });

  describe('count', () => {
    test('should return correct driver count', async () => {
      MockDriver.countDocuments.mockResolvedValue(857);

      const result = await driverRepository.count();

      expect(MockDriver.countDocuments).toHaveBeenCalledWith();
      expect(result).toBe(857);
    });

    test('should return zero when no drivers exist', async () => {
      MockDriver.countDocuments.mockResolvedValue(0);

      const result = await driverRepository.count();

      expect(MockDriver.countDocuments).toHaveBeenCalledWith();
      expect(result).toBe(0);
    });

    test('should handle database errors', async () => {
      MockDriver.countDocuments.mockRejectedValue(new Error('Count error'));

      await expect(driverRepository.count())
        .rejects.toThrow('Count error');
    });
  });

  describe('findDriversByYearRange', () => {
    test('should find drivers within specified year range', async () => {
      const aggregateResult = [
        { _id: 'verstappen' },
        { _id: 'hamilton' }
      ];

      MockRace.aggregate.mockResolvedValue(aggregateResult);

      const result = await driverRepository.findDriversByYearRange(2020, 2024);

      expect(MockRace.aggregate).toHaveBeenCalledWith([
        { 
          $match: { 
            season: { 
              $gte: "2020", 
              $lte: "2024" 
            } 
          } 
        },
        { $unwind: "$results" },
        { $group: { _id: "$results.driverId" } },
        { $sort: { _id: 1 } }
      ]);
      expect(result).toEqual(['verstappen', 'hamilton']);
    });

    test('should handle single year range', async () => {
      MockRace.aggregate.mockResolvedValue([{ _id: 'verstappen' }]);

      const result = await driverRepository.findDriversByYearRange(2024, 2024);

      expect(MockRace.aggregate).toHaveBeenCalledWith([
        { 
          $match: { 
            season: { 
              $gte: "2024", 
              $lte: "2024" 
            } 
          } 
        },
        { $unwind: "$results" },
        { $group: { _id: "$results.driverId" } },
        { $sort: { _id: 1 } }
      ]);
      expect(result).toEqual(['verstappen']);
    });

    test('should handle empty year range result', async () => {
      MockRace.aggregate.mockResolvedValue([]);

      const result = await driverRepository.findDriversByYearRange(1950, 1960);

      expect(result).toEqual([]);
    });

    test('should handle database aggregation errors', async () => {
      MockRace.aggregate.mockRejectedValue(new Error('Year range error'));

      await expect(driverRepository.findDriversByYearRange(2020, 2024))
        .rejects.toThrow('Year range error');
    });
  });

  describe('findDriversBySeason', () => {
    test('should find drivers for specific season', async () => {
      const aggregateResult = [
        { _id: 'verstappen' },
        { _id: 'perez' }
      ];

      MockRace.aggregate.mockResolvedValue(aggregateResult);

      const result = await driverRepository.findDriversBySeason('2024');

      expect(MockRace.aggregate).toHaveBeenCalledWith([
        { $match: { season: "2024" } },
        { $unwind: "$results" },
        { $group: { _id: "$results.driverId" } },
        { $sort: { _id: 1 } }
      ]);
      expect(result).toEqual(['verstappen', 'perez']);
    });

    test('should handle season with no drivers', async () => {
      MockRace.aggregate.mockResolvedValue([]);

      const result = await driverRepository.findDriversBySeason('1950');

      expect(result).toEqual([]);
    });

    test('should handle database errors for season query', async () => {
      MockRace.aggregate.mockRejectedValue(new Error('Season query error'));

      await expect(driverRepository.findDriversBySeason('2024'))
        .rejects.toThrow('Season query error');
    });

    test('should handle various season formats', async () => {
      const seasons = ['2024', '2023', '2022'];
      
      for (const season of seasons) {
        MockRace.aggregate.mockResolvedValue([{ _id: 'test_driver' }]);

        await driverRepository.findDriversBySeason(season);
        
        expect(MockRace.aggregate).toHaveBeenCalledWith([
          { $match: { season } },
          { $unwind: "$results" },
          { $group: { _id: "$results.driverId" } },
          { $sort: { _id: 1 } }
        ]);
        
        jest.clearAllMocks();
      }
    });
  });
}); 