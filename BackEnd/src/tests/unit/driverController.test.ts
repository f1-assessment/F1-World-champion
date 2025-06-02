import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import * as driverController from '../../controllers/driverController.js';
import * as driverService from '../../services/driverService.js';

// Mock all dependencies
jest.mock('../../services/driverService.js');
jest.mock('../../config/constants.js', () => ({
  STARTING_YEAR: 2005,
  getCurrentYear: jest.fn().mockReturnValue(2024)
}));

const mockDriverService = driverService as jest.Mocked<typeof driverService>;

// Ensure all functions are mocked
mockDriverService.getDriversByYearRange = jest.fn();
mockDriverService.getDriversBySeason = jest.fn();
mockDriverService.getDriverById = jest.fn();
mockDriverService.findOrCreateDriver = jest.fn();
mockDriverService.getAllDrivers = jest.fn();

// Helper function to create mock Request and Response objects
const createMockRequest = (params: any = {}, query: any = {}): Partial<Request> => ({
  params,
  query,
});

const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res) as any;
  res.json = jest.fn().mockReturnValue(res) as any;
  return res;
};

// Mock data
const mockDriverData = {
  _id: '507f1f77bcf86cd799439011',
  driverId: 'verstappen',
  code: 'VER',
  givenName: 'Max',
  familyName: 'Verstappen',
  nationality: 'Dutch',
  url: 'http://en.wikipedia.org/wiki/Max_Verstappen',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

const mockDriverData2 = {
  _id: '507f1f77bcf86cd799439012',
  driverId: 'hamilton',
  code: 'HAM',
  givenName: 'Lewis',
  familyName: 'Hamilton',
  nationality: 'British',
  url: 'http://en.wikipedia.org/wiki/Lewis_Hamilton',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

const mockDriversArray = [mockDriverData, mockDriverData2];

describe('Driver Controller Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllDrivers', () => {
    test('should return drivers for default year range (2005-2024)', async () => {
      mockDriverService.getDriversByYearRange.mockResolvedValue(mockDriversArray as any);

      const req = createMockRequest({}, {});
      const res = createMockResponse();

      await driverController.getAllDrivers(req as Request, res as Response);

      expect(mockDriverService.getDriversByYearRange).toHaveBeenCalledWith(2005, 2024);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDriversArray);
    });

    test('should return drivers for custom year range', async () => {
      mockDriverService.getDriversByYearRange.mockResolvedValue(mockDriversArray as any);

      const req = createMockRequest({}, { fromYear: '2020', toYear: '2023' });
      const res = createMockResponse();

      await driverController.getAllDrivers(req as Request, res as Response);

      expect(mockDriverService.getDriversByYearRange).toHaveBeenCalledWith(2020, 2023);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDriversArray);
    });

    test('should return 400 for start year before 2005', async () => {
      const req = createMockRequest({}, { fromYear: '2004' });
      const res = createMockResponse();

      await driverController.getAllDrivers(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Starting year cannot be before 2005' 
      });
      expect(mockDriverService.getDriversByYearRange).not.toHaveBeenCalled();
    });

    test('should return 400 for end year after current year', async () => {
      const req = createMockRequest({}, { toYear: '2025' });
      const res = createMockResponse();

      await driverController.getAllDrivers(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'End year cannot be after 2024' 
      });
      expect(mockDriverService.getDriversByYearRange).not.toHaveBeenCalled();
    });

    test('should return 400 when start year is after end year', async () => {
      const req = createMockRequest({}, { fromYear: '2023', toYear: '2020' });
      const res = createMockResponse();

      await driverController.getAllDrivers(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Starting year cannot be after ending year' 
      });
      expect(mockDriverService.getDriversByYearRange).not.toHaveBeenCalled();
    });

    test('should return empty array when no drivers exist', async () => {
      mockDriverService.getDriversByYearRange.mockResolvedValue([]);

      const req = createMockRequest({}, {});
      const res = createMockResponse();

      await driverController.getAllDrivers(req as Request, res as Response);

      expect(mockDriverService.getDriversByYearRange).toHaveBeenCalledWith(2005, 2024);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    test('should return 500 when service throws error', async () => {
      mockDriverService.getDriversByYearRange.mockRejectedValue(new Error('Database error'));

      const req = createMockRequest({}, {});
      const res = createMockResponse();

      await driverController.getAllDrivers(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch drivers' });
    });

    test('should handle boundary years correctly', async () => {
      mockDriverService.getDriversByYearRange.mockResolvedValue(mockDriversArray as any);

      const req = createMockRequest({}, { fromYear: '2005', toYear: '2024' });
      const res = createMockResponse();

      await driverController.getAllDrivers(req as Request, res as Response);

      expect(mockDriverService.getDriversByYearRange).toHaveBeenCalledWith(2005, 2024);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getDriversBySeason', () => {
    test('should return drivers for valid season', async () => {
      mockDriverService.getDriversBySeason.mockResolvedValue(mockDriversArray as any);

      const req = createMockRequest({ year: '2024' });
      const res = createMockResponse();

      await driverController.getDriversBySeason(req as Request, res as Response);

      expect(mockDriverService.getDriversBySeason).toHaveBeenCalledWith(2024);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDriversArray);
    });

    test('should return 400 for invalid year format', async () => {
      const req = createMockRequest({ year: 'invalid' });
      const res = createMockResponse();

      await driverController.getDriversBySeason(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid year format' });
      expect(mockDriverService.getDriversBySeason).not.toHaveBeenCalled();
    });

    test('should return 400 for year before 2005', async () => {
      const req = createMockRequest({ year: '2004' });
      const res = createMockResponse();

      await driverController.getDriversBySeason(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Year cannot be before 2005' 
      });
      expect(mockDriverService.getDriversBySeason).not.toHaveBeenCalled();
    });

    test('should return 400 for future year', async () => {
      const req = createMockRequest({ year: '2025' });
      const res = createMockResponse();

      await driverController.getDriversBySeason(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Year cannot be after 2024' 
      });
      expect(mockDriverService.getDriversBySeason).not.toHaveBeenCalled();
    });

    test('should return empty array when no drivers for season', async () => {
      mockDriverService.getDriversBySeason.mockResolvedValue([]);

      const req = createMockRequest({ year: '2010' });
      const res = createMockResponse();

      await driverController.getDriversBySeason(req as Request, res as Response);

      expect(mockDriverService.getDriversBySeason).toHaveBeenCalledWith(2010);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    test('should return 500 when service throws error', async () => {
      mockDriverService.getDriversBySeason.mockRejectedValue(new Error('Service error'));

      const req = createMockRequest({ year: '2024' });
      const res = createMockResponse();

      await driverController.getDriversBySeason(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch drivers for season' });
    });

    test('should handle boundary years correctly', async () => {
      mockDriverService.getDriversBySeason.mockResolvedValue(mockDriversArray as any);

      // Test with 2005 (minimum year)
      let req = createMockRequest({ year: '2005' });
      let res = createMockResponse();

      await driverController.getDriversBySeason(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);

      jest.clearAllMocks();

      // Test with 2024 (current year)
      req = createMockRequest({ year: '2024' });
      res = createMockResponse();

      await driverController.getDriversBySeason(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getDriverById', () => {
    test('should return driver data for valid ID', async () => {
      mockDriverService.getDriverById.mockResolvedValue(mockDriverData as any);

      const req = createMockRequest({ driverId: 'verstappen' });
      const res = createMockResponse();

      await driverController.getDriverById(req as Request, res as Response);

      expect(mockDriverService.getDriverById).toHaveBeenCalledWith('verstappen');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDriverData);
    });

    test('should return 404 when driver not found', async () => {
      mockDriverService.getDriverById.mockResolvedValue(null as any);

      const req = createMockRequest({ driverId: 'nonexistent' });
      const res = createMockResponse();

      await driverController.getDriverById(req as Request, res as Response);

      expect(mockDriverService.getDriverById).toHaveBeenCalledWith('nonexistent');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Driver not found' });
    });

    test('should return 500 when service throws error', async () => {
      mockDriverService.getDriverById.mockRejectedValue(new Error('Service error'));

      const req = createMockRequest({ driverId: 'verstappen' });
      const res = createMockResponse();

      await driverController.getDriverById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch driver' });
    });

    test('should handle various driver IDs correctly', async () => {
      const testCases = ['verstappen', 'hamilton', 'leclerc', 'norris'];
      
      for (const driverId of testCases) {
        mockDriverService.getDriverById.mockResolvedValue(mockDriverData as any);

        const req = createMockRequest({ driverId });
        const res = createMockResponse();

        await driverController.getDriverById(req as Request, res as Response);

        expect(mockDriverService.getDriverById).toHaveBeenCalledWith(driverId);
        expect(res.status).toHaveBeenCalledWith(200);
        
        jest.clearAllMocks();
      }
    });

    test('should handle missing driverId parameter', async () => {
      mockDriverService.getDriverById.mockResolvedValue(null as any);

      const req = createMockRequest({}); // No driverId in params
      const res = createMockResponse();

      await driverController.getDriverById(req as Request, res as Response);

      expect(mockDriverService.getDriverById).toHaveBeenCalledWith(undefined);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Driver not found' });
    });

    test('should handle empty string driverId', async () => {
      mockDriverService.getDriverById.mockResolvedValue(null as any);

      const req = createMockRequest({ driverId: '' });
      const res = createMockResponse();

      await driverController.getDriverById(req as Request, res as Response);

      expect(mockDriverService.getDriverById).toHaveBeenCalledWith('');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Driver not found' });
    });
  });
}); 