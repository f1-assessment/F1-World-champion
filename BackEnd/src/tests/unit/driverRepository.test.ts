import { jest } from '@jest/globals';
import * as driverRepository from '../../repositories/driverRepository.js';
import Driver from '../../models/Driver.js';
import Race from '../../models/Race.js';
import { IDriver } from '../../types/index.js';
import { 
  MockDriverModel, 
  MockRaceModel, 
  createMockDriver, 
  createMockQuery 
} from '../utils/mockTypes.js';

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

// Use proper typing for mocks
const MockDriver = Driver as unknown as MockDriverModel;
const MockRace = Race as unknown as MockRaceModel;

// Mock data using typed helpers
const mockDriverData = createMockDriver();
const mockDriverData2 = createMockDriver({
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
});

const mockDriversArray = [mockDriverData, mockDriverData2];

describe('Driver Repository Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByDriverId', () => {
    test('should find driver by driverId successfully', async () => {
      (MockDriver.findOne as jest.MockedFunction<any>).mockResolvedValue(mockDriverData);

      const result = await driverRepository.findByDriverId('verstappen');

      expect(MockDriver.findOne).toHaveBeenCalledWith({ driverId: 'verstappen' });
      expect(result).toEqual(mockDriverData);
    });

    test('should return null when driver not found', async () => {
      (MockDriver.findOne as jest.MockedFunction<any>).mockResolvedValue(null);

      const result = await driverRepository.findByDriverId('nonexistent');

      expect(MockDriver.findOne).toHaveBeenCalledWith({ driverId: 'nonexistent' });
      expect(result).toBeNull();
    });

    test('should handle database errors', async () => {
      (MockDriver.findOne as jest.MockedFunction<any>).mockRejectedValue(new Error('Database error'));

      await expect(driverRepository.findByDriverId('verstappen'))
        .rejects.toThrow('Database error');
    });

    test('should handle various driver ID formats', async () => {
      const driverIds = ['verstappen', 'hamilton', 'leclerc'];
      
      for (const driverId of driverIds) {
        (MockDriver.findOne as jest.MockedFunction<any>).mockResolvedValue(mockDriverData);

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
        nationality: 'Monégasque'
      };

      const createdDriver = createMockDriver({ ...newDriverData, _id: 'new_id' });
      MockDriver.create.mockResolvedValue(createdDriver);

      const result = await driverRepository.create(newDriverData);

      expect(MockDriver.create).toHaveBeenCalledWith(newDriverData);
      expect(result).toEqual(createdDriver);
    });

    test('should handle partial driver data', async () => {
      const partialData = {
        driverId: 'leclerc',
        givenName: 'Charles',
        familyName: 'Leclerc'
      };

      const createdDriver = createMockDriver({ ...partialData, _id: 'new_id' });
      MockDriver.create.mockResolvedValue(createdDriver);

      const result = await driverRepository.create(partialData);

      expect(MockDriver.create).toHaveBeenCalledWith({
        driverId: 'leclerc',
        permanentNumber: undefined,
        code: undefined,
        url: undefined,
        givenName: 'Charles',
        familyName: 'Leclerc',
        dateOfBirth: undefined,
        nationality: undefined
      });
      expect(result).toEqual(createdDriver);
    });

    test('should handle database creation errors', async () => {
      MockDriver.create.mockRejectedValue(new Error('Creation error'));

      await expect(driverRepository.create({ driverId: 'test' }))
        .rejects.toThrow('Creation error');
    });
  });

  describe('findAll', () => {
    test('should return all drivers sorted by family name', async () => {
      const mockQuery = createMockQuery<typeof mockDriversArray>();
      mockQuery.sort.mockResolvedValue(mockDriversArray);
      MockDriver.find.mockReturnValue(mockQuery);

      const result = await driverRepository.findAll();

      expect(MockDriver.find).toHaveBeenCalledWith();
      expect(mockQuery.sort).toHaveBeenCalledWith({ familyName: 1 });
      expect(result).toEqual(mockDriversArray);
    });

    test('should return empty array when no drivers exist', async () => {
      const mockQuery = createMockQuery<typeof mockDriversArray>();
      mockQuery.sort.mockResolvedValue([]);
      MockDriver.find.mockReturnValue(mockQuery);

      const result = await driverRepository.findAll();

      expect(MockDriver.find).toHaveBeenCalledWith();
      expect(mockQuery.sort).toHaveBeenCalledWith({ familyName: 1 });
      expect(result).toEqual([]);
    });

    test('should handle database errors', async () => {
      const mockQuery = createMockQuery<typeof mockDriversArray>();
      mockQuery.sort.mockRejectedValue(new Error('Database error'));
      MockDriver.find.mockReturnValue(mockQuery);

      await expect(driverRepository.findAll())
        .rejects.toThrow('Database error');
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

  describe('findMostRecent', () => {
    test('should find most recently updated driver', async () => {
      const mockQuery = createMockQuery<IDriver | null>();
      mockQuery.sort.mockResolvedValue(mockDriverData);
      MockDriver.findOne.mockReturnValue(mockQuery);

      const result = await driverRepository.findMostRecent();

      expect(MockDriver.findOne).toHaveBeenCalledWith();
      expect(mockQuery.sort).toHaveBeenCalledWith({ updatedAt: -1 });
      expect(result).toEqual(mockDriverData);
    });

    test('should return null when no drivers exist', async () => {
      const mockQuery = createMockQuery<IDriver | null>();
      mockQuery.sort.mockResolvedValue(null);
      MockDriver.findOne.mockReturnValue(mockQuery);

      const result = await driverRepository.findMostRecent();

      expect(MockDriver.findOne).toHaveBeenCalledWith();
      expect(result).toBeNull();
    });

    test('should handle database errors', async () => {
      const mockQuery = createMockQuery<IDriver | null>();
      mockQuery.sort.mockRejectedValue(new Error('Database error'));
      MockDriver.findOne.mockReturnValue(mockQuery);

      await expect(driverRepository.findMostRecent())
        .rejects.toThrow('Database error');
    });
  });

  describe('findActiveDrivers', () => {
    test('should find drivers active from 2005 onwards', async () => {
      const mockQuery = createMockQuery<typeof mockDriversArray>();
      mockQuery.sort.mockResolvedValue(mockDriversArray);
      MockDriver.find.mockReturnValue(mockQuery);

      const mockAggregateResult = [{ _id: 'verstappen' }, { _id: 'hamilton' }];
      MockRace.aggregate.mockResolvedValue(mockAggregateResult);

      const result = await driverRepository.findActiveDrivers();

      expect(MockRace.aggregate).toHaveBeenCalledWith([
        { $match: { season: { $gte: "2005" } } },
        { $unwind: "$results" },
        { $group: { _id: "$results.driverId" } }
      ]);
      expect(MockDriver.find).toHaveBeenCalledWith({ 
        driverId: { $in: ['verstappen', 'hamilton'] } 
      });
      expect(result).toEqual(mockDriversArray);
    });

    test('should return empty array when no active drivers', async () => {
      MockRace.aggregate.mockResolvedValue([]);
      
      const mockQuery = createMockQuery<typeof mockDriversArray>();
      mockQuery.sort.mockResolvedValue([]);
      MockDriver.find.mockReturnValue(mockQuery);

      const result = await driverRepository.findActiveDrivers();

      expect(result).toEqual([]);
    });

    test('should handle aggregation errors', async () => {
      MockRace.aggregate.mockRejectedValue(new Error('Aggregation error'));

      await expect(driverRepository.findActiveDrivers())
        .rejects.toThrow('Aggregation error');
    });
  });

  describe('findDriversByYearRange', () => {
    test('should find drivers by year range', async () => {
      const mockQuery = createMockQuery<typeof mockDriversArray>();
      mockQuery.sort.mockResolvedValue(mockDriversArray);
      MockDriver.find.mockReturnValue(mockQuery);

      const mockAggregateResult = [{ _id: 'verstappen' }, { _id: 'hamilton' }];
      MockRace.aggregate.mockResolvedValue(mockAggregateResult);

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
        { $group: { _id: "$results.driverId" } }
      ]);
      expect(MockDriver.find).toHaveBeenCalledWith({ 
        driverId: { $in: ['verstappen', 'hamilton'] } 
      });
      expect(result).toEqual(mockDriversArray);
    });

    test('should return empty array when no drivers in range', async () => {
      MockRace.aggregate.mockResolvedValue([]);
      
      const mockQuery = createMockQuery<typeof mockDriversArray>();
      mockQuery.sort.mockResolvedValue([]);
      MockDriver.find.mockReturnValue(mockQuery);

      const result = await driverRepository.findDriversByYearRange(2030, 2035);

      expect(result).toEqual([]);
    });

    test('should handle aggregation errors', async () => {
      MockRace.aggregate.mockRejectedValue(new Error('Aggregation error'));

      await expect(driverRepository.findDriversByYearRange(2020, 2024))
        .rejects.toThrow('Aggregation error');
    });

    test('should find drivers for single year', async () => {
      const mockQuery = createMockQuery<typeof mockDriversArray>();
      mockQuery.sort.mockResolvedValue(mockDriversArray);
      MockDriver.find.mockReturnValue(mockQuery);

      const mockAggregateResult = [{ _id: 'verstappen' }];
      MockRace.aggregate.mockResolvedValue(mockAggregateResult);

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
        { $group: { _id: "$results.driverId" } }
      ]);
      expect(result).toEqual(mockDriversArray);
    });
  });

  describe('findDriversBySeason', () => {
    test('should find drivers for specific season', async () => {
      const mockQuery = createMockQuery<typeof mockDriversArray>();
      mockQuery.sort.mockResolvedValue([mockDriverData]);
      MockDriver.find.mockReturnValue(mockQuery);

      const mockAggregateResult = [{ _id: 'verstappen' }];
      MockRace.aggregate.mockResolvedValue(mockAggregateResult);

      const result = await driverRepository.findDriversBySeason(2023);

      expect(MockRace.aggregate).toHaveBeenCalledWith([
        { $match: { season: "2023" } },
        { $unwind: "$results" },
        { $group: { _id: "$results.driverId" } }
      ]);
      expect(MockDriver.find).toHaveBeenCalledWith({ 
        driverId: { $in: ['verstappen'] } 
      });
      expect(result).toEqual([mockDriverData]);
    });

    test('should handle empty season results', async () => {
      MockRace.aggregate.mockResolvedValue([]);
      
      const mockQuery = createMockQuery<typeof mockDriversArray>();
      mockQuery.sort.mockResolvedValue([]);
      MockDriver.find.mockReturnValue(mockQuery);

      const result = await driverRepository.findDriversBySeason(2030);

      expect(result).toEqual([]);
    });

    test('should handle aggregation errors', async () => {
      MockRace.aggregate.mockRejectedValue(new Error('Season aggregation error'));

      await expect(driverRepository.findDriversBySeason(2023))
        .rejects.toThrow('Season aggregation error');
    });
  });
}); 