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

// Create typed mock
const MockChampionship = Championship as jest.Mocked<typeof Championship>;

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

// Mock query object
const mockQuery = {
  sort: jest.fn().mockReturnThis(),
};

describe('Championship Repository Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    MockChampionship.find.mockReturnValue(mockQuery as any);
  });

  describe('findBySeason', () => {
    test('should find championship by season successfully', async () => {
      MockChampionship.findOne.mockResolvedValue(mockChampionshipData as any);

      const result = await championshipRepository.findBySeason('2024');

      expect(MockChampionship.findOne).toHaveBeenCalledWith({ season: '2024' });
      expect(result).toEqual(mockChampionshipData);
    });

    test('should return null when championship not found', async () => {
      MockChampionship.findOne.mockResolvedValue(null);

      const result = await championshipRepository.findBySeason('2025');

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

  describe('upsert', () => {
    test('should create new championship when none exists', async () => {
      const championshipData = {
        season: '2024',
        driverId: 'verstappen',
        constructorId: 'red_bull',
        points: '575',
        wins: '19'
      };

      MockChampionship.findOneAndUpdate.mockResolvedValue({ ...championshipData, _id: 'new_id' } as any);

      const result = await championshipRepository.upsert('2024', championshipData);

      expect(MockChampionship.findOneAndUpdate).toHaveBeenCalledWith(
        { season: '2024' },
        {
          driverId: 'verstappen',
          constructorId: 'red_bull',
          points: '575',
          wins: '19'
        },
        { upsert: true, new: true }
      );
      expect(result).toEqual({ ...championshipData, _id: 'new_id' });
    });

    test('should update existing championship', async () => {
      const updatedData = { ...mockChampionshipData, points: '600' };
      MockChampionship.findOneAndUpdate.mockResolvedValue(updatedData as any);

      const championshipData = {
        driverId: 'verstappen',
        constructorId: 'red_bull',
        points: '600',
        wins: '20'
      };

      const result = await championshipRepository.upsert('2024', championshipData);

      expect(result).toEqual(updatedData);
    });

    test('should handle upsert errors', async () => {
      const error = new Error('Upsert failed');
      MockChampionship.findOneAndUpdate.mockRejectedValue(error);

      const championshipData = {
        driverId: 'verstappen',
        constructorId: 'red_bull',
        points: '575',
        wins: '19'
      };

      await expect(championshipRepository.upsert('2024', championshipData))
        .rejects.toThrow('Upsert failed');
    });
  });

  describe('findAll', () => {
    test('should return all championships sorted by season', async () => {
      mockQuery.sort.mockResolvedValue(mockChampionshipsArray);

      const result = await championshipRepository.findAll();

      expect(MockChampionship.find).toHaveBeenCalledWith();
      expect(mockQuery.sort).toHaveBeenCalledWith({ season: -1 });
      expect(result).toEqual(mockChampionshipsArray);
    });

    test('should return empty array when no championships exist', async () => {
      mockQuery.sort.mockResolvedValue([]);

      const result = await championshipRepository.findAll();

      expect(MockChampionship.find).toHaveBeenCalledWith();
      expect(mockQuery.sort).toHaveBeenCalledWith({ season: -1 });
      expect(result).toEqual([]);
    });

    test('should handle database errors', async () => {
      mockQuery.sort.mockRejectedValue(new Error('Database error'));

      await expect(championshipRepository.findAll())
        .rejects.toThrow('Database error');
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