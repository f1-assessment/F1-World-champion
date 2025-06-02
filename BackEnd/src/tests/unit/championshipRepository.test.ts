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
    it('should find championship by season', async () => {
      MockChampionship.findOne.mockResolvedValue(mockChampionshipData as any);

      const result = await championshipRepository.findBySeason('2024');

      expect(MockChampionship.findOne).toHaveBeenCalledWith({ season: '2024' });
      expect(result).toEqual(mockChampionshipData);
    });

    it('should return null when championship not found', async () => {
      MockChampionship.findOne.mockResolvedValue(null);

      const result = await championshipRepository.findBySeason('2025');

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      MockChampionship.findOne.mockRejectedValue(error);

      await expect(championshipRepository.findBySeason('2024'))
        .rejects.toThrow('Database error');
    });
  });

  describe('upsert', () => {
    it('should create new championship when none exists', async () => {
      MockChampionship.findOneAndUpdate.mockResolvedValue(mockChampionshipData as any);

      const championshipData = {
        driverId: 'verstappen',
        constructorId: 'red_bull',
        points: '575',
        wins: '19'
      };

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
      expect(result).toEqual(mockChampionshipData);
    });

    it('should update existing championship', async () => {
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

    it('should handle upsert errors', async () => {
      const error = new Error('Upsert failed');
      MockChampionship.findOneAndUpdate.mockRejectedValue(error);

      await expect(championshipRepository.upsert('2024', {}))
        .rejects.toThrow('Upsert failed');
    });
  });

  describe('findAll', () => {
    it('should find all championships sorted by season', async () => {
      const mockChampionships = [
        { ...mockChampionshipData, season: '2024' },
        { ...mockChampionshipData, _id: '507f1f77bcf86cd799439012', season: '2023' }
      ];
      mockQuery.sort.mockResolvedValue(mockChampionships);

      const result = await championshipRepository.findAll();

      expect(MockChampionship.find).toHaveBeenCalledWith();
      expect(mockQuery.sort).toHaveBeenCalledWith({ season: -1 });
      expect(result).toEqual(mockChampionships);
    });

    it('should return empty array when no championships found', async () => {
      mockQuery.sort.mockResolvedValue([]);

      const result = await championshipRepository.findAll();

      expect(result).toEqual([]);
    });

    it('should handle findAll errors', async () => {
      const error = new Error('Find failed');
      mockQuery.sort.mockRejectedValue(error);

      await expect(championshipRepository.findAll())
        .rejects.toThrow('Find failed');
    });
  });
});