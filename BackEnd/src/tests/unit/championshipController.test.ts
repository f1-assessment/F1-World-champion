import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import * as championshipController from '../../controllers/championshipController.js';
import * as championshipService from '../../services/championshipService.js';

// Mock all dependencies
jest.mock('../../services/championshipService.js');
jest.mock('../../config/constants.js', () => ({
  STARTING_YEAR: 2005,
  getCurrentYear: jest.fn().mockReturnValue(2024)
}));

const mockChampionshipService = championshipService as jest.Mocked<typeof championshipService>;

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
const mockChampionshipData = {
  _id: '507f1f77bcf86cd799439011',
  season: '2024',
  driverId: 'verstappen',
  constructorId: 'red_bull',
  points: '575',
  wins: '19',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

const mockChampionshipsArray = [
  mockChampionshipData,
  {
    _id: '507f1f77bcf86cd799439012',
    season: '2023',
    driverId: 'verstappen',
    constructorId: 'red_bull',
    points: '575',
    wins: '19',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  }
];

describe('Championship Controller Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllChampionships', () => {
    test('should return all championships with status 200', async () => {
      mockChampionshipService.getAllChampionships.mockResolvedValue(mockChampionshipsArray as any);

      const req = createMockRequest();
      const res = createMockResponse();

      await championshipController.getAllChampionships(req as Request, res as Response);

      expect(mockChampionshipService.getAllChampionships).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockChampionshipsArray);
    });

    test('should return empty array when no championships exist', async () => {
      mockChampionshipService.getAllChampionships.mockResolvedValue([]);

      const req = createMockRequest();
      const res = createMockResponse();

      await championshipController.getAllChampionships(req as Request, res as Response);

      expect(mockChampionshipService.getAllChampionships).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    test('should return error 500 when service throws error', async () => {
      mockChampionshipService.getAllChampionships.mockRejectedValue(new Error('Database error'));

      const req = createMockRequest();
      const res = createMockResponse();

      await championshipController.getAllChampionships(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch championships' });
    });
  });

  describe('getChampionshipBySeason', () => {
    test('should return championship data for valid year', async () => {
      mockChampionshipService.getChampionshipBySeason.mockResolvedValue(mockChampionshipData as any);

      const req = createMockRequest({ year: '2024' });
      const res = createMockResponse();

      await championshipController.getChampionshipBySeason(req as Request, res as Response);

      expect(mockChampionshipService.getChampionshipBySeason).toHaveBeenCalledWith(2024);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockChampionshipData);
    });

    test('should return 400 for invalid year format', async () => {
      const req = createMockRequest({ year: 'invalid' });
      const res = createMockResponse();

      await championshipController.getChampionshipBySeason(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid year format' });
      expect(mockChampionshipService.getChampionshipBySeason).not.toHaveBeenCalled();
    });

    test('should return 400 for year before starting year (2005)', async () => {
      const req = createMockRequest({ year: '2004' });
      const res = createMockResponse();

      await championshipController.getChampionshipBySeason(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Championship data is only available from 2005 onwards' 
      });
      expect(mockChampionshipService.getChampionshipBySeason).not.toHaveBeenCalled();
    });

    test('should return 400 for future year', async () => {
      const req = createMockRequest({ year: '2025' });
      const res = createMockResponse();

      await championshipController.getChampionshipBySeason(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Championship data is not available for future years' 
      });
      expect(mockChampionshipService.getChampionshipBySeason).not.toHaveBeenCalled();
    });

    test('should return 404 when championship not found', async () => {
      mockChampionshipService.getChampionshipBySeason.mockResolvedValue(null);

      const req = createMockRequest({ year: '2010' });
      const res = createMockResponse();

      await championshipController.getChampionshipBySeason(req as Request, res as Response);

      expect(mockChampionshipService.getChampionshipBySeason).toHaveBeenCalledWith(2010);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'No championship data found for 2010' });
    });

    test('should return 500 when service throws error', async () => {
      mockChampionshipService.getChampionshipBySeason.mockRejectedValue(new Error('Service error'));

      const req = createMockRequest({ year: '2024' });
      const res = createMockResponse();

      await championshipController.getChampionshipBySeason(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch championship data' });
    });

    test('should handle boundary year 2005 correctly', async () => {
      mockChampionshipService.getChampionshipBySeason.mockResolvedValue(mockChampionshipData as any);

      const req = createMockRequest({ year: '2005' });
      const res = createMockResponse();

      await championshipController.getChampionshipBySeason(req as Request, res as Response);

      expect(mockChampionshipService.getChampionshipBySeason).toHaveBeenCalledWith(2005);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('should handle current year correctly', async () => {
      mockChampionshipService.getChampionshipBySeason.mockResolvedValue(mockChampionshipData as any);

      const req = createMockRequest({ year: '2024' });
      const res = createMockResponse();

      await championshipController.getChampionshipBySeason(req as Request, res as Response);

      expect(mockChampionshipService.getChampionshipBySeason).toHaveBeenCalledWith(2024);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('updateAllChampionships', () => {
    test('should update all championships successfully', async () => {
      mockChampionshipService.updateAllChampionships.mockResolvedValue(20);

      const req = createMockRequest();
      const res = createMockResponse();

      await championshipController.updateAllChampionships(req as Request, res as Response);

      expect(mockChampionshipService.updateAllChampionships).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Successfully updated 20 championships',
        updatedCount: 20,
        yearRange: '2005-2024'
      });
    });

    test('should handle zero updates', async () => {
      mockChampionshipService.updateAllChampionships.mockResolvedValue(0);

      const req = createMockRequest();
      const res = createMockResponse();

      await championshipController.updateAllChampionships(req as Request, res as Response);

      expect(mockChampionshipService.updateAllChampionships).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Successfully updated 0 championships',
        updatedCount: 0,
        yearRange: '2005-2024'
      });
    });

    test('should return 500 when service throws error', async () => {
      mockChampionshipService.updateAllChampionships.mockRejectedValue(new Error('Update error'));

      const req = createMockRequest();
      const res = createMockResponse();

      await championshipController.updateAllChampionships(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update championships' });
    });
  });
}); 