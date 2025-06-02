import { jest } from '@jest/globals';
import * as championshipRepository from '../../repositories/championshipRepository.js';
import { Championship } from '../../models/index.js';

// Mock the Championship model
jest.mock('../../models/index.js', () => ({
  Championship: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    find: jest.fn(),
  }
}));

const MockChampionship = Championship as any;

// Mock data
const mockChampionshipData = {
  _id: '507f1f77bcf86cd799439011',
  season: '2024',
  driverId: 'verstappen',
  constructorId: 'red_bull',
  points: '575',
  wins: '19',
  podiums: '21',
  fastestLaps: '5',
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
    podiums: '21',
    fastestLaps: '5',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  }
];

describe('Championship Repository Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findBySeason', () => {
    test('should find championship by season successfully', async () => {
      MockChampionship.findOne.mockResolvedValue(mockChampionshipData);

      const result = await championshipRepository.findBySeason('2024');

      expect(MockChampionship.findOne).toHaveBeenCalledWith({ season: '2024' });
      expect(result).toEqual(mockChampionshipData);
    });

    test('should return null when championship not found', async () => {
      MockChampionship.findOne.mockResolvedValue(null);

      const result = await championshipRepository.findBySeason('2025');

      expect(MockChampionship.findOne).toHaveBeenCalledWith({ season: '2025' });
      expect(result).toBeNull();
    });

    test('should handle database errors', async () => {
      MockChampionship.findOne.mockRejectedValue(new Error('Database error'));

      await expect(championshipRepository.findBySeason('2024'))
        .rejects.toThrow('Database error');
    });

    test('should handle various season formats', async () => {
      const seasons = ['2024', '2023', '2022'];
      
      for (const season of seasons) {
        MockChampionship.findOne.mockResolvedValue(mockChampionshipData);

        await championshipRepository.findBySeason(season);
        expect(MockChampionship.findOne).toHaveBeenCalledWith({ season });
        
        jest.clearAllMocks();
      }
    });
  });

  describe('createOrUpdate', () => {
    test('should create new championship when none exists', async () => {
      const championshipData = {
        season: '2024',
        driverId: 'verstappen',
        constructorId: 'red_bull',
        points: '575',
        wins: '19'
      };

      MockChampionship.findOneAndUpdate.mockResolvedValue({ ...championshipData, _id: 'new_id' });

      const result = await championshipRepository.createOrUpdate(championshipData);

      expect(MockChampionship.findOneAndUpdate).toHaveBeenCalledWith(
        { season: '2024' },
        championshipData,
        { new: true, upsert: true }
      );
      expect(result).toEqual({ ...championshipData, _id: 'new_id' });
    });

    test('should update existing championship', async () => {
      const updateData = {
        season: '2024',
        driverId: 'verstappen',
        constructorId: 'red_bull',
        points: '600',
        wins: '20'
      };

      MockChampionship.findOneAndUpdate.mockResolvedValue({ ...updateData, _id: 'existing_id' });

      const result = await championshipRepository.createOrUpdate(updateData);

      expect(MockChampionship.findOneAndUpdate).toHaveBeenCalledWith(
        { season: '2024' },
        updateData,
        { new: true, upsert: true }
      );
      expect(result).toEqual({ ...updateData, _id: 'existing_id' });
    });

    test('should handle database update errors', async () => {
      MockChampionship.findOneAndUpdate.mockRejectedValue(new Error('Update error'));

      await expect(championshipRepository.createOrUpdate({ season: '2024' }))
        .rejects.toThrow('Update error');
    });

    test('should handle partial championship data', async () => {
      const partialData = {
        season: '2024',
        driverId: 'verstappen'
      };

      MockChampionship.findOneAndUpdate.mockResolvedValue({ ...partialData, _id: 'new_id' });

      const result = await championshipRepository.createOrUpdate(partialData);

      expect(MockChampionship.findOneAndUpdate).toHaveBeenCalledWith(
        { season: '2024' },
        partialData,
        { new: true, upsert: true }
      );
      expect(result).toEqual({ ...partialData, _id: 'new_id' });
    });
  });

  describe('findAll', () => {
    test('should return all championships sorted by season', async () => {
      const mockQuery = {
        sort: jest.fn().mockResolvedValue(mockChampionshipsArray),
      };

      MockChampionship.find.mockReturnValue(mockQuery);

      const result = await championshipRepository.findAll();

      expect(MockChampionship.find).toHaveBeenCalledWith();
      expect(mockQuery.sort).toHaveBeenCalledWith({ season: -1 });
      expect(result).toEqual(mockChampionshipsArray);
    });

    test('should return empty array when no championships exist', async () => {
      const mockQuery = {
        sort: jest.fn().mockResolvedValue([]),
      };

      MockChampionship.find.mockReturnValue(mockQuery);

      const result = await championshipRepository.findAll();

      expect(MockChampionship.find).toHaveBeenCalledWith();
      expect(mockQuery.sort).toHaveBeenCalledWith({ season: -1 });
      expect(result).toEqual([]);
    });

    test('should handle database errors', async () => {
      const mockQuery = {
        sort: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      MockChampionship.find.mockReturnValue(mockQuery);

      await expect(championshipRepository.findAll())
        .rejects.toThrow('Database error');
    });

    test('should verify sort order for championships', async () => {
      const sortedChampionships = [
        { ...mockChampionshipData, season: '2024' },
        { ...mockChampionshipData, season: '2023' }
      ];

      const mockQuery = {
        sort: jest.fn().mockResolvedValue(sortedChampionships),
      };

      MockChampionship.find.mockReturnValue(mockQuery);

      const result = await championshipRepository.findAll();

      expect(mockQuery.sort).toHaveBeenCalledWith({ season: -1 });
      expect(result).toEqual(sortedChampionships);
    });
  });

  describe('findBySeasonRange', () => {
    test('should find championships within specified season range', async () => {
      const rangeChampionships = [mockChampionshipData];
      
      const mockQuery = {
        sort: jest.fn().mockResolvedValue(rangeChampionships),
      };

      MockChampionship.find.mockReturnValue(mockQuery);

      const result = await championshipRepository.findBySeasonRange('2020', '2024');

      expect(MockChampionship.find).toHaveBeenCalledWith({
        season: { $gte: '2020', $lte: '2024' }
      });
      expect(mockQuery.sort).toHaveBeenCalledWith({ season: -1 });
      expect(result).toEqual(rangeChampionships);
    });

    test('should handle single season range', async () => {
      const mockQuery = {
        sort: jest.fn().mockResolvedValue([mockChampionshipData]),
      };

      MockChampionship.find.mockReturnValue(mockQuery);

      const result = await championshipRepository.findBySeasonRange('2024', '2024');

      expect(MockChampionship.find).toHaveBeenCalledWith({
        season: { $gte: '2024', $lte: '2024' }
      });
      expect(result).toEqual([mockChampionshipData]);
    });

    test('should handle empty season range result', async () => {
      const mockQuery = {
        sort: jest.fn().mockResolvedValue([]),
      };

      MockChampionship.find.mockReturnValue(mockQuery);

      const result = await championshipRepository.findBySeasonRange('1950', '1960');

      expect(result).toEqual([]);
    });

    test('should handle database errors for season range', async () => {
      const mockQuery = {
        sort: jest.fn().mockRejectedValue(new Error('Range query error')),
      };

      MockChampionship.find.mockReturnValue(mockQuery);

      await expect(championshipRepository.findBySeasonRange('2020', '2024'))
        .rejects.toThrow('Range query error');
    });
  });
}); 