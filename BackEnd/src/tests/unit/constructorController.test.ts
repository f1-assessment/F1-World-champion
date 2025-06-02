import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import * as constructorController from '../../controllers/constructorController.js';
import * as constructorService from '../../services/constructorService.js';

// Mock all dependencies
jest.mock('../../services/constructorService.js');

const mockConstructorService = constructorService as jest.Mocked<typeof constructorService>;

// Ensure all functions are mocked
mockConstructorService.getAllConstructors = jest.fn();
mockConstructorService.getConstructorById = jest.fn();
mockConstructorService.findOrCreateConstructor = jest.fn();

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
const mockConstructorData = {
  _id: '507f1f77bcf86cd799439011',
  constructorId: 'red_bull',
  name: 'Red Bull',
  nationality: 'Austrian',
  url: 'http://en.wikipedia.org/wiki/Red_Bull_Racing',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

const mockConstructorData2 = {
  _id: '507f1f77bcf86cd799439012',
  constructorId: 'ferrari',
  name: 'Ferrari',
  nationality: 'Italian',
  url: 'http://en.wikipedia.org/wiki/Ferrari',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

const mockConstructorsArray = [mockConstructorData, mockConstructorData2];

describe('Constructor Controller Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllConstructors', () => {
    test('should return all constructors with status 200', async () => {
      mockConstructorService.getAllConstructors.mockResolvedValue(mockConstructorsArray as any);

      const req = createMockRequest();
      const res = createMockResponse();

      await constructorController.getAllConstructors(req as Request, res as Response);

      expect(mockConstructorService.getAllConstructors).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockConstructorsArray);
    });

    test('should return empty array when no constructors exist', async () => {
      mockConstructorService.getAllConstructors.mockResolvedValue([]);

      const req = createMockRequest();
      const res = createMockResponse();

      await constructorController.getAllConstructors(req as Request, res as Response);

      expect(mockConstructorService.getAllConstructors).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    test('should return error 500 when service throws error', async () => {
      mockConstructorService.getAllConstructors.mockRejectedValue(new Error('Database error'));

      const req = createMockRequest();
      const res = createMockResponse();

      await constructorController.getAllConstructors(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch constructors' });
    });

    test('should handle service timeout errors', async () => {
      mockConstructorService.getAllConstructors.mockRejectedValue(new Error('Connection timeout'));

      const req = createMockRequest();
      const res = createMockResponse();

      await constructorController.getAllConstructors(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch constructors' });
    });
  });

  describe('getConstructorById', () => {
    test('should return constructor data for valid ID', async () => {
      mockConstructorService.getConstructorById.mockResolvedValue(mockConstructorData as any);

      const req = createMockRequest({ constructorId: 'red_bull' });
      const res = createMockResponse();

      await constructorController.getConstructorById(req as Request, res as Response);

      expect(mockConstructorService.getConstructorById).toHaveBeenCalledWith('red_bull');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockConstructorData);
    });

    test('should return 404 when constructor not found', async () => {
      mockConstructorService.getConstructorById.mockResolvedValue(null as any);

      const req = createMockRequest({ constructorId: 'nonexistent' });
      const res = createMockResponse();

      await constructorController.getConstructorById(req as Request, res as Response);

      expect(mockConstructorService.getConstructorById).toHaveBeenCalledWith('nonexistent');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Constructor not found' });
    });

    test('should return 500 when service throws error', async () => {
      mockConstructorService.getConstructorById.mockRejectedValue(new Error('Service error'));

      const req = createMockRequest({ constructorId: 'red_bull' });
      const res = createMockResponse();

      await constructorController.getConstructorById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch constructor' });
    });

    test('should handle various constructor IDs correctly', async () => {
      const testCases = ['red_bull', 'ferrari', 'mercedes', 'mclaren'];
      
      for (const constructorId of testCases) {
        mockConstructorService.getConstructorById.mockResolvedValue(mockConstructorData as any);

        const req = createMockRequest({ constructorId });
        const res = createMockResponse();

        await constructorController.getConstructorById(req as Request, res as Response);

        expect(mockConstructorService.getConstructorById).toHaveBeenCalledWith(constructorId);
        expect(res.status).toHaveBeenCalledWith(200);
        
        jest.clearAllMocks();
      }
    });

    test('should handle missing constructorId parameter', async () => {
      mockConstructorService.getConstructorById.mockResolvedValue(null as any);

      const req = createMockRequest({}); // No constructorId in params
      const res = createMockResponse();

      await constructorController.getConstructorById(req as Request, res as Response);

      expect(mockConstructorService.getConstructorById).toHaveBeenCalledWith(undefined);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Constructor not found' });
    });

    test('should handle empty string constructorId', async () => {
      mockConstructorService.getConstructorById.mockResolvedValue(null as any);

      const req = createMockRequest({ constructorId: '' });
      const res = createMockResponse();

      await constructorController.getConstructorById(req as Request, res as Response);

      expect(mockConstructorService.getConstructorById).toHaveBeenCalledWith('');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Constructor not found' });
    });

    test('should handle service validation errors', async () => {
      mockConstructorService.getConstructorById.mockRejectedValue(new Error('Validation error'));

      const req = createMockRequest({ constructorId: 'invalid_id' });
      const res = createMockResponse();

      await constructorController.getConstructorById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch constructor' });
    });
  });
}); 