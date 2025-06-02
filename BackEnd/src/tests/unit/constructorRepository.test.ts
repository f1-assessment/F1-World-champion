// @ts-nocheck
import { jest } from '@jest/globals';
import * as constructorRepository from '../../repositories/constructorRepository.js';

// Mock the Constructor model
jest.mock('../../models/index.js', () => ({
  Constructor: {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

import { Constructor } from '../../models/index.js';

// Create mocks with TypeScript suppression
const MockConstructor = {
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
};

// Mock data
const mockConstructorData = {
  _id: '507f1f77bcf86cd799439011',
  constructorId: 'red_bull',
  name: 'Red Bull Racing',
  nationality: 'Austrian',
  url: 'http://en.wikipedia.org/wiki/Red_Bull_Racing',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

const mockConstructorData2 = {
  _id: '507f1f77bcf86cd799439012',
  constructorId: 'mercedes',
  name: 'Mercedes-AMG Petronas F1 Team',
  nationality: 'German',
  url: 'http://en.wikipedia.org/wiki/Mercedes-AMG_Petronas_F1_Team',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

const mockConstructorsArray = [mockConstructorData, mockConstructorData2];

describe('Constructor Repository Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByConstructorId', () => {
    test('should find constructor by constructorId successfully', async () => {
      (MockConstructor.findOne as any).mockResolvedValue(mockConstructorData);

      const result = await constructorRepository.findByConstructorId('red_bull');

      expect(MockConstructor.findOne).toHaveBeenCalledWith({ constructorId: 'red_bull' });
      expect(result).toEqual(mockConstructorData);
    });

    test('should return null when constructor not found', async () => {
      (MockConstructor.findOne as any).mockResolvedValue(null);

      const result = await constructorRepository.findByConstructorId('nonexistent');

      expect(MockConstructor.findOne).toHaveBeenCalledWith({ constructorId: 'nonexistent' });
      expect(result).toBeNull();
    });

    test('should handle database errors', async () => {
      (MockConstructor.findOne as any).mockRejectedValue(new Error('Database error'));

      await expect(constructorRepository.findByConstructorId('red_bull'))
        .rejects.toThrow('Database error');
    });

    test('should handle various constructor ID formats', async () => {
      const constructorIds = ['red_bull', 'mercedes', 'ferrari'];
      
      for (const constructorId of constructorIds) {
        (MockConstructor.findOne as any).mockResolvedValue(mockConstructorData);

        await constructorRepository.findByConstructorId(constructorId);
        expect(MockConstructor.findOne).toHaveBeenCalledWith({ constructorId });
        
        jest.clearAllMocks();
      }
    });
  });

  describe('create', () => {
    test('should create new constructor successfully', async () => {
      const newConstructorData = {
        constructorId: 'ferrari',
        name: 'Scuderia Ferrari',
        nationality: 'Italian',
        url: 'http://en.wikipedia.org/wiki/Scuderia_Ferrari'
      };

      (MockConstructor.create as any).mockResolvedValue({ ...newConstructorData, _id: 'new_id' });

      const result = await constructorRepository.create(newConstructorData);

      expect(MockConstructor.create).toHaveBeenCalledWith(newConstructorData);
      expect(result).toEqual({ ...newConstructorData, _id: 'new_id' });
    });

    test('should handle partial constructor data', async () => {
      const partialData = {
        constructorId: 'ferrari',
        name: 'Scuderia Ferrari'
      };

      (MockConstructor.create as any).mockResolvedValue({ ...partialData, _id: 'new_id' });

      const result = await constructorRepository.create(partialData);

      expect(MockConstructor.create).toHaveBeenCalledWith({
        constructorId: 'ferrari',
        name: 'Scuderia Ferrari',
        nationality: undefined,
        url: undefined
      });
      expect(result).toEqual({ ...partialData, _id: 'new_id' });
    });

    test('should handle database creation errors', async () => {
      (MockConstructor.create as any).mockRejectedValue(new Error('Creation error'));

      await expect(constructorRepository.create({ constructorId: 'test' }))
        .rejects.toThrow('Creation error');
    });

    test('should create constructor with minimal data', async () => {
      (MockConstructor.create as any).mockResolvedValue({ _id: 'new_id' });

      const result = await constructorRepository.create({});

      expect(MockConstructor.create).toHaveBeenCalledWith({
        constructorId: undefined,
        name: undefined,
        nationality: undefined,
        url: undefined
      });
      expect(result).toEqual({ _id: 'new_id' });
    });
  });

  describe('findAll', () => {
    test('should return all constructors sorted by name', async () => {
      const mockQuery = {
        sort: jest.fn().mockResolvedValue(mockConstructorsArray),
      };

      (MockConstructor.find as any).mockReturnValue(mockQuery);

      const result = await constructorRepository.findAll();

      expect(MockConstructor.find).toHaveBeenCalledWith();
      expect(mockQuery.sort).toHaveBeenCalledWith({ name: 1 });
      expect(result).toEqual(mockConstructorsArray);
    });

    test('should return empty array when no constructors exist', async () => {
      const mockQuery = {
        sort: jest.fn().mockResolvedValue([]),
      };

      (MockConstructor.find as any).mockReturnValue(mockQuery);

      const result = await constructorRepository.findAll();

      expect(MockConstructor.find).toHaveBeenCalledWith();
      expect(mockQuery.sort).toHaveBeenCalledWith({ name: 1 });
      expect(result).toEqual([]);
    });

    test('should handle database errors', async () => {
      const mockQuery = {
        sort: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      (MockConstructor.find as any).mockReturnValue(mockQuery);

      await expect(constructorRepository.findAll())
        .rejects.toThrow('Database error');
    });

    test('should handle constructor data with sorting', async () => {
      const mockQuery = {
        sort: jest.fn().mockResolvedValue(mockConstructorsArray),
      };

      (MockConstructor.find as any).mockReturnValue(mockQuery);

      const result = await constructorRepository.findAll();

      expect(result).toEqual(mockConstructorsArray);
    });
  });

  describe('count', () => {
    test('should return correct constructor count', async () => {
      (MockConstructor.countDocuments as any).mockResolvedValue(87);

      const result = await constructorRepository.count();

      expect(MockConstructor.countDocuments).toHaveBeenCalledWith();
      expect(result).toBe(87);
    });

    test('should return zero when no constructors exist', async () => {
      (MockConstructor.countDocuments as any).mockResolvedValue(0);

      const result = await constructorRepository.count();

      expect(MockConstructor.countDocuments).toHaveBeenCalledWith();
      expect(result).toBe(0);
    });

    test('should handle database errors', async () => {
      (MockConstructor.countDocuments as any).mockRejectedValue(new Error('Count error'));

      await expect(constructorRepository.count())
        .rejects.toThrow('Count error');
    });
  });

  describe('findMostRecent', () => {
    test('should return most recently updated constructor', async () => {
      const mockQuery = {
        sort: jest.fn().mockResolvedValue(mockConstructorData),
      };

      (MockConstructor.findOne as any).mockReturnValue(mockQuery);

      const result = await constructorRepository.findMostRecent();

      expect(MockConstructor.findOne).toHaveBeenCalledWith();
      expect(mockQuery.sort).toHaveBeenCalledWith({ updatedAt: -1 });
      expect(result).toEqual(mockConstructorData);
    });

    test('should return null when no constructors exist', async () => {
      const mockQuery = {
        sort: jest.fn().mockResolvedValue(null),
      };

      (MockConstructor.findOne as any).mockReturnValue(mockQuery);

      const result = await constructorRepository.findMostRecent();

      expect(result).toBeNull();
    });

    test('should handle database errors', async () => {
      const mockQuery = {
        sort: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      (MockConstructor.findOne as any).mockReturnValue(mockQuery);

      await expect(constructorRepository.findMostRecent())
        .rejects.toThrow('Database error');
    });

    test('should verify sorting is applied correctly', async () => {
      const mockQuery = {
        sort: jest.fn().mockResolvedValue(mockConstructorData),
      };

      (MockConstructor.findOne as any).mockReturnValue(mockQuery);

      await constructorRepository.findMostRecent();

      expect(mockQuery.sort).toHaveBeenCalledWith({ updatedAt: -1 });
      expect(mockQuery.sort).toHaveBeenCalledTimes(1);
    });
  });
}); 