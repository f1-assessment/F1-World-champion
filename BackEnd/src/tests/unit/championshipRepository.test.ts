import { jest } from '@jest/globals';
import * as championshipRepository from '../../repositories/championshipRepository.js';
import { Championship } from '../../models/index.js';
import { 
  MockChampionshipModel, 
  createMockChampionship, 
  createMockQuery 
} from '../utils/mockTypes.js';

// Mock the Championship model
jest.mock('../../models/index.js', () => ({
  Championship: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    find: jest.fn(),
  }
}));

const MockChampionship = Championship as unknown as MockChampionshipModel;

// Mock data using typed helpers
const mockChampionshipData = createMockChampionship();
const mockChampionshipsArray = [
  mockChampionshipData,
  createMockChampionship({
    _id: '507f1f77bcf86cd799439012',
    season: '2023',
    driverId: 'verstappen',
    constructorId: 'red_bull',
    points: '575',
    wins: '19',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  })
];

describe('Championship Repository Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findBySeason', () => {
    test('should find championship by season successfully', async () => {
      (MockChampionship.findOne as jest.MockedFunction<any>).mockResolvedValue(mockChampionshipData);

      const result = await championshipRepository.findBySeason('2024');

      expect(MockChampionship.findOne).toHaveBeenCalledWith({ season: '2024' });
      expect(result).toEqual(mockChampionshipData);
    });

    test('should return null when championship not found', async () => {
      (MockChampionship.findOne as jest.MockedFunction<any>).mockResolvedValue(null);

      const result = await championshipRepository.findBySeason('2025');

      expect(MockChampionship.findOne).toHaveBeenCalledWith({ season: '2025' });
      expect(result).toBeNull();
    });

    test('should handle database errors', async () => {
      (MockChampionship.findOne as jest.MockedFunction<any>).mockRejectedValue(new Error('Database error'));

      await expect(championshipRepository.findBySeason('2024'))
        .rejects.toThrow('Database error');
    });

    test('should handle various season formats', async () => {
      const seasons = ['2024', '2023', '2005'];
      
      for (const season of seasons) {
        (MockChampionship.findOne as jest.MockedFunction<any>).mockResolvedValue(mockChampionshipData);

        await championshipRepository.findBySeason(season);
        expect(MockChampionship.findOne).toHaveBeenCalledWith({ season });
        
        jest.clearAllMocks();
      }
    });
  });

  describe('upsert', () => {
    test('should create new championship when not exists', async () => {
      const championshipData = {
        driverId: 'verstappen',
        constructorId: 'red_bull',
        points: '575',
        wins: '19'
      };

      (MockChampionship.findOneAndUpdate as jest.MockedFunction<any>).mockResolvedValue(mockChampionshipData);

      const result = await championshipRepository.upsert('2024', championshipData);

      expect(MockChampionship.findOneAndUpdate).toHaveBeenCalledWith(
        { season: '2024' },
        championshipData,
        { upsert: true, new: true }
      );
      expect(result).toEqual(mockChampionshipData);
    });

    test('should update existing championship', async () => {
      const updatedData = {
        driverId: 'verstappen',
        constructorId: 'red_bull',
        points: '600',
        wins: '20'
      };

      const updatedChampionship = createMockChampionship({
        ...mockChampionshipData,
        points: '600',
        wins: '20'
      });

      (MockChampionship.findOneAndUpdate as jest.MockedFunction<any>).mockResolvedValue(updatedChampionship);

      const result = await championshipRepository.upsert('2024', updatedData);

      expect(MockChampionship.findOneAndUpdate).toHaveBeenCalledWith(
        { season: '2024' },
        updatedData,
        { upsert: true, new: true }
      );
      expect(result).toEqual(updatedChampionship);
    });

    test('should handle partial championship data', async () => {
      const partialData = {
        points: '500'
      };

      (MockChampionship.findOneAndUpdate as jest.MockedFunction<any>).mockResolvedValue(mockChampionshipData);

      const result = await championshipRepository.upsert('2024', partialData);

      expect(MockChampionship.findOneAndUpdate).toHaveBeenCalledWith(
        { season: '2024' },
        {
          driverId: undefined,
          constructorId: undefined,
          points: '500',
          wins: undefined
        },
        { upsert: true, new: true }
      );
      expect(result).toEqual(mockChampionshipData);
    });

    test('should handle database errors during upsert', async () => {
      (MockChampionship.findOneAndUpdate as jest.MockedFunction<any>).mockRejectedValue(new Error('Upsert error'));

      await expect(championshipRepository.upsert('2024', {}))
        .rejects.toThrow('Upsert error');
    });

    test('should handle empty championship data', async () => {
      (MockChampionship.findOneAndUpdate as jest.MockedFunction<any>).mockResolvedValue(mockChampionshipData);

      const result = await championshipRepository.upsert('2024', {});

      expect(MockChampionship.findOneAndUpdate).toHaveBeenCalledWith(
        { season: '2024' },
        {
          driverId: undefined,
          constructorId: undefined,
          points: undefined,
          wins: undefined
        },
        { upsert: true, new: true }
      );
      expect(result).toEqual(mockChampionshipData);
    });
  });

  describe('findAll', () => {
    test('should return all championships sorted by season', async () => {
      const mockQuery = createMockQuery<typeof mockChampionshipsArray>();
      mockQuery.sort.mockResolvedValue(mockChampionshipsArray);

      (MockChampionship.find as jest.MockedFunction<any>).mockReturnValue(mockQuery);

      const result = await championshipRepository.findAll();

      expect(MockChampionship.find).toHaveBeenCalledWith();
      expect(mockQuery.sort).toHaveBeenCalledWith({ season: -1 });
      expect(result).toEqual(mockChampionshipsArray);
    });

    test('should return empty array when no championships exist', async () => {
      const mockQuery = createMockQuery<typeof mockChampionshipsArray>();
      mockQuery.sort.mockResolvedValue([]);

      (MockChampionship.find as jest.MockedFunction<any>).mockReturnValue(mockQuery);

      const result = await championshipRepository.findAll();

      expect(MockChampionship.find).toHaveBeenCalledWith();
      expect(result).toEqual([]);
    });

    test('should handle database errors', async () => {
      const mockQuery = createMockQuery<typeof mockChampionshipsArray>();
      mockQuery.sort.mockRejectedValue(new Error('Database error'));

      (MockChampionship.find as jest.MockedFunction<any>).mockReturnValue(mockQuery);

      await expect(championshipRepository.findAll())
        .rejects.toThrow('Database error');
    });
  });
}); 