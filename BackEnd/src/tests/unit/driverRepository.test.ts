import { jest } from '@jest/globals';
import * as driverRepository from '../../repositories/driverRepository.js';
import Driver from '../../models/Driver.js';
import Race from '../../models/Race.js';

// Mock mongoose models
jest.mock('../../models/Driver.js');
jest.mock('../../models/Race.js');

// Simple mock setup
const mockDriver = {
  findOne: jest.fn(),
  create: jest.fn(), 
  find: jest.fn(),
  countDocuments: jest.fn(),
};

const mockRace = {
  aggregate: jest.fn(),
};

// Apply mocks
(Driver as any).findOne = mockDriver.findOne;
(Driver as any).create = mockDriver.create;
(Driver as any).find = mockDriver.find;
(Driver as any).countDocuments = mockDriver.countDocuments;
(Race as any).aggregate = mockRace.aggregate;

describe('Driver Repository Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByDriverId', () => {
    it('should find driver by driverId', async () => {
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
        fullName: 'Max Verstappen'
      };

      mockDriver.findOne.mockResolvedValue(mockDriverData);

      const result = await driverRepository.findByDriverId('verstappen');

      expect(mockDriver.findOne).toHaveBeenCalledWith({ driverId: 'verstappen' });
      expect(result).toEqual(mockDriverData);
    });

    it('should return null when driver not found', async () => {
      mockDriver.findOne.mockResolvedValue(null);

      const result = await driverRepository.findByDriverId('unknown');

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockDriver.findOne.mockRejectedValue(error);

      await expect(driverRepository.findByDriverId('verstappen'))
        .rejects.toThrow('Database error');
    });
  });

  describe('create', () => {
    test('should create new driver successfully', async () => {
      const driverData = { driverId: 'leclerc', familyName: 'Leclerc' };
      const createdDriver = { ...driverData, _id: 'new_id' };
      mockDriver.create.mockResolvedValue(createdDriver);

      const result = await driverRepository.create(driverData);

      expect(mockDriver.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    test('should handle database creation errors', async () => {
      mockDriver.create.mockRejectedValue(new Error('Creation error'));

      await expect(driverRepository.create({ driverId: 'test' }))
        .rejects.toThrow('Creation error');
    });
  });

  describe('findAll', () => {
    test('should return all drivers sorted by familyName', async () => {
      const mockDriversArray = [
        { driverId: 'verstappen', familyName: 'Verstappen' },
        { driverId: 'hamilton', familyName: 'Hamilton' }
      ];
      mockDriver.find.mockResolvedValue(mockDriversArray);

      const result = await driverRepository.findAll();

      expect(mockDriver.find).toHaveBeenCalledWith();
      expect(result).toEqual(mockDriversArray);
    });

    test('should handle database errors', async () => {
      mockDriver.find.mockRejectedValue(new Error('Database error'));

      await expect(driverRepository.findAll())
        .rejects.toThrow('Database error');
    });
  });

  describe('count', () => {
    test('should return correct driver count', async () => {
      mockDriver.countDocuments.mockResolvedValue(857);

      const result = await driverRepository.count();

      expect(mockDriver.countDocuments).toHaveBeenCalledWith();
      expect(result).toBe(857);
    });

    test('should handle database errors', async () => {
      mockDriver.countDocuments.mockRejectedValue(new Error('Count error'));

      await expect(driverRepository.count())
        .rejects.toThrow('Count error');
    });
  });

  describe('findActiveDrivers', () => {
    test('should return active drivers', async () => {
      const aggregateResult = [{ _id: 'verstappen' }, { _id: 'hamilton' }];
      const mockDriversArray = [
        { driverId: 'verstappen', familyName: 'Verstappen' },
        { driverId: 'hamilton', familyName: 'Hamilton' }
      ];

      mockRace.aggregate.mockResolvedValue(aggregateResult);

      const result = await driverRepository.findActiveDrivers();

      expect(mockRace.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockDriversArray);
    });
  });

  describe('findDriversByYearRange', () => {
    test('should find drivers within year range', async () => {
      const aggregateResult = [{ _id: 'verstappen' }];
      const mockDriversArray = [{ driverId: 'verstappen', familyName: 'Verstappen' }];

      mockRace.aggregate.mockResolvedValue(aggregateResult);

      const result = await driverRepository.findDriversByYearRange(2020, 2024);

      expect(mockRace.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockDriversArray);
    });
  });

  describe('findDriversBySeason', () => {
    it('should find drivers by season using number parameter', async () => {
      const mockResults = [
        {
          _id: 'verstappen',
          totalPoints: 575,
          wins: 19,
          podiums: 21,
          driver: {
            driverId: 'verstappen',
            givenName: 'Max',
            familyName: 'Verstappen',
            nationality: 'Dutch'
          }
        }
      ];

      mockRace.aggregate.mockResolvedValue(mockResults);

      const result = await driverRepository.findDriversBySeason(2024);

      expect(mockRace.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockResults);
    });

    it('should find drivers by season and round using number parameters', async () => {
      const mockResults = [
        {
          _id: 'verstappen',
          totalPoints: 26,
          driver: {
            driverId: 'verstappen',
            givenName: 'Max',
            familyName: 'Verstappen'
          }
        }
      ];

      mockRace.aggregate.mockResolvedValue(mockResults);

      const result = await driverRepository.findDriversBySeason(2024, 1);

      expect(mockRace.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockResults);
    });

    it('should handle findDriversBySeason errors', async () => {
      const error = new Error('Aggregation failed');
      mockRace.aggregate.mockRejectedValue(error);

      await expect(driverRepository.findDriversBySeason(2024))
        .rejects.toThrow('Aggregation failed');
    });

    it('should return empty array when no drivers found for season', async () => {
      mockRace.aggregate.mockResolvedValue([]);

      const result = await driverRepository.findDriversBySeason(2030);

      expect(result).toEqual([]);
    });
  });
}); 