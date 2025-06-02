import { jest } from '@jest/globals';
import * as constructorService from '../../services/constructorService.js';
import * as constructorRepository from '../../repositories/constructorRepository.js';
import * as apiService from '../../services/apiService.js';

// Mock the repository
jest.mock('../../repositories/constructorRepository.js', () => ({
  findByConstructorId: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  count: jest.fn(),
  findMostRecent: jest.fn()
}));

// Mock the API service
jest.mock('../../services/apiService.js', () => ({
  fetchConstructors: jest.fn()
}));

// Mock constants
jest.mock('../../config/constants.js', () => ({
  getCurrentYear: jest.fn().mockReturnValue(2024),
  STARTING_YEAR: 2005
}));

const mockedConstructorRepository = constructorRepository as jest.Mocked<typeof constructorRepository>;
const mockedApiService = apiService as jest.Mocked<typeof apiService>;

describe('Constructor Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findOrCreateConstructor', () => {
    test('should return existing constructor if found', async () => {
      const mockConstructor = {
        constructorId: 'red_bull',
        name: 'Red Bull Racing',
        nationality: 'Austrian'
      };

      mockedConstructorRepository.findByConstructorId.mockResolvedValue(mockConstructor as any);

      const result = await constructorService.findOrCreateConstructor(mockConstructor);

      expect(mockedConstructorRepository.findByConstructorId).toHaveBeenCalledWith('red_bull');
      expect(mockedConstructorRepository.create).not.toHaveBeenCalled();
      expect(result).toEqual(mockConstructor);
    });

    test('should create new constructor if not found', async () => {
      const mockConstructorData = {
        constructorId: 'new_team',
        name: 'New Team',
        nationality: 'Country'
      };

      const createdConstructor = { ...mockConstructorData, _id: 'some-id' };

      mockedConstructorRepository.findByConstructorId.mockResolvedValue(null);
      mockedConstructorRepository.create.mockResolvedValue(createdConstructor as any);

      const result = await constructorService.findOrCreateConstructor(mockConstructorData);

      expect(mockedConstructorRepository.findByConstructorId).toHaveBeenCalledWith('new_team');
      expect(mockedConstructorRepository.create).toHaveBeenCalledWith(mockConstructorData);
      expect(result).toEqual(createdConstructor);
    });

    test('should handle errors', async () => {
      const mockConstructorData = { constructorId: 'error-team' };
      const error = new Error('Database error');

      mockedConstructorRepository.findByConstructorId.mockRejectedValue(error);

      await expect(constructorService.findOrCreateConstructor(mockConstructorData)).rejects.toThrow('Database error');
    });
  });

  describe('getConstructorById', () => {
    test('should return constructor by ID', async () => {
      const mockConstructor = {
        constructorId: 'ferrari',
        name: 'Ferrari',
        nationality: 'Italian'
      };

      mockedConstructorRepository.findByConstructorId.mockResolvedValue(mockConstructor as any);

      const result = await constructorService.getConstructorById('ferrari');

      expect(mockedConstructorRepository.findByConstructorId).toHaveBeenCalledWith('ferrari');
      expect(result).toEqual(mockConstructor);
    });

    test('should return null if constructor not found', async () => {
      mockedConstructorRepository.findByConstructorId.mockResolvedValue(null);

      const result = await constructorService.getConstructorById('nonexistent');

      expect(result).toBeNull();
    });

    test('should handle errors', async () => {
      const error = new Error('Database error');
      mockedConstructorRepository.findByConstructorId.mockRejectedValue(error);

      await expect(constructorService.getConstructorById('error-team')).rejects.toThrow('Database error');
    });
  });

  describe('getAllConstructors', () => {
    test('should return existing constructors if data is fresh', async () => {
      const mockConstructors = [
        { constructorId: 'red_bull', name: 'Red Bull Racing' },
        { constructorId: 'ferrari', name: 'Ferrari' }
      ];

      const recentConstructor = {
        updatedAt: new Date()
      };

      mockedConstructorRepository.count.mockResolvedValue(2);
      mockedConstructorRepository.findMostRecent.mockResolvedValue(recentConstructor as any);
      mockedConstructorRepository.findAll.mockResolvedValue(mockConstructors as any);

      const result = await constructorService.getAllConstructors();

      expect(mockedConstructorRepository.count).toHaveBeenCalled();
      expect(mockedConstructorRepository.findMostRecent).toHaveBeenCalled();
      expect(mockedConstructorRepository.findAll).toHaveBeenCalled();
      expect(mockedApiService.fetchConstructors).not.toHaveBeenCalled();
      expect(result).toEqual(mockConstructors);
    });

    test('should fetch and update constructors if no data exists', async () => {
      const mockConstructors = [
        { constructorId: 'red_bull', name: 'Red Bull Racing' }
      ];

      const apiConstructors = [
        { constructorId: 'red_bull', name: 'Red Bull Racing', nationality: 'Austrian' }
      ];

      mockedConstructorRepository.count.mockResolvedValue(0);
      mockedApiService.fetchConstructors.mockResolvedValue(apiConstructors as any);
      mockedConstructorRepository.findByConstructorId.mockResolvedValue(null);
      mockedConstructorRepository.create.mockResolvedValue(apiConstructors[0] as any);
      mockedConstructorRepository.findAll.mockResolvedValue(mockConstructors as any);

      const result = await constructorService.getAllConstructors();

      expect(mockedConstructorRepository.count).toHaveBeenCalled();
      expect(mockedApiService.fetchConstructors).toHaveBeenCalledWith(2024);
      expect(mockedConstructorRepository.create).toHaveBeenCalledWith(apiConstructors[0]);
      expect(result).toEqual(mockConstructors);
    });

    test('should fetch and update constructors if data is stale', async () => {
      const mockConstructors = [
        { constructorId: 'red_bull', name: 'Red Bull Racing' }
      ];

      const staleConstructor = {
        updatedAt: new Date(Date.now() - 25 * 60 * 60 * 1000) // 25 hours ago
      };

      const apiConstructors = [
        { constructorId: 'red_bull', name: 'Red Bull Racing', nationality: 'Austrian' }
      ];

      mockedConstructorRepository.count.mockResolvedValue(1);
      mockedConstructorRepository.findMostRecent.mockResolvedValue(staleConstructor as any);
      mockedApiService.fetchConstructors.mockResolvedValue(apiConstructors as any);
      mockedConstructorRepository.findByConstructorId.mockResolvedValue(apiConstructors[0] as any);
      mockedConstructorRepository.findAll.mockResolvedValue(mockConstructors as any);

      const result = await constructorService.getAllConstructors();

      expect(mockedApiService.fetchConstructors).toHaveBeenCalledWith(2024);
      expect(result).toEqual(mockConstructors);
    });

    test('should handle errors', async () => {
      const error = new Error('Database error');
      mockedConstructorRepository.count.mockRejectedValue(error);

      await expect(constructorService.getAllConstructors()).rejects.toThrow('Database error');
    });
  });
}); 