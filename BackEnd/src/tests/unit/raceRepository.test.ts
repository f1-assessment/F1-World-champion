import { jest } from '@jest/globals';
import * as raceRepository from '../../repositories/raceRepository.js';
import Race from '../../models/Race.js';
import { 
  MockRaceModel, 
  createMockRace
} from '../utils/mockTypes.js';

// Mock mongoose models with proper typing
jest.mock('../../models/Race.js', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findBySeason: jest.fn(),
  },
}));

// Use proper typing for mocks
const MockRace = Race as unknown as MockRaceModel;

// Mock data using typed helpers
const mockRaceData = createMockRace();
const mockRaceData2 = createMockRace({
  _id: '507f1f77bcf86cd799439012',
  season: '2024',
  round: '2',
  url: 'http://en.wikipedia.org/wiki/2024_Saudi_Arabian_Grand_Prix',
  raceName: 'Saudi Arabian Grand Prix',
  circuit: {
    circuitId: 'jeddah',
    circuitName: 'Jeddah Corniche Circuit',
    url: 'http://en.wikipedia.org/wiki/Jeddah_Corniche_Circuit',
    location: {
      lat: '21.6319',
      long: '39.1044',
      locality: 'Jeddah',
      country: 'Saudi Arabia'
    }
  },
  date: '2024-03-09',
  time: '15:00:00Z',
  results: []
});

const mockRacesArray = [mockRaceData, mockRaceData2];

describe('Race Repository Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findBySeasonAndRound', () => {
    test('should find race by season and round successfully', async () => {
      (MockRace.findOne as jest.MockedFunction<any>).mockResolvedValue(mockRaceData);

      const result = await raceRepository.findBySeasonAndRound('2024', '1');

      expect(MockRace.findOne).toHaveBeenCalledWith({ season: '2024', round: '1' });
      expect(result).toEqual(mockRaceData);
    });

    test('should return null when race not found', async () => {
      (MockRace.findOne as jest.MockedFunction<any>).mockResolvedValue(null);

      const result = await raceRepository.findBySeasonAndRound('2030', '1');

      expect(MockRace.findOne).toHaveBeenCalledWith({ season: '2030', round: '1' });
      expect(result).toBeNull();
    });

    test('should handle database errors', async () => {
      (MockRace.findOne as jest.MockedFunction<any>).mockRejectedValue(new Error('Database error'));

      await expect(raceRepository.findBySeasonAndRound('2024', '1'))
        .rejects.toThrow('Database error');
    });

    test('should handle various season and round formats', async () => {
      const testCases = [
        { season: '2024', round: '1' },
        { season: '2023', round: '22' },
        { season: '2005', round: '19' }
      ];
      
      for (const testCase of testCases) {
        (MockRace.findOne as jest.MockedFunction<any>).mockResolvedValue(mockRaceData);

        await raceRepository.findBySeasonAndRound(testCase.season, testCase.round);
        expect(MockRace.findOne).toHaveBeenCalledWith({ 
          season: testCase.season, 
          round: testCase.round 
        });
        
        jest.clearAllMocks();
      }
    });
  });

  describe('upsert', () => {
    test('should create new race successfully', async () => {
      const newRaceData = {
        url: 'http://en.wikipedia.org/wiki/2024_Australian_Grand_Prix',
        raceName: 'Australian Grand Prix',
        circuit: {
          circuitId: 'albert_park',
          circuitName: 'Albert Park Grand Prix Circuit',
          url: 'http://en.wikipedia.org/wiki/Melbourne_Grand_Prix_Circuit',
          location: {
            lat: '-37.8497',
            long: '144.968',
            locality: 'Melbourne',
            country: 'Australia'
          }
        },
        date: '2024-03-24',
        time: '05:00:00Z',
        results: []
      };

      (MockRace.findOneAndUpdate as jest.MockedFunction<any>).mockResolvedValue({ ...newRaceData, _id: 'new_id', season: '2024', round: '3' });

      const result = await raceRepository.upsert('2024', '3', newRaceData);

      expect(MockRace.findOneAndUpdate).toHaveBeenCalledWith(
        { season: '2024', round: '3' },
        {
          url: newRaceData.url,
          raceName: newRaceData.raceName,
          circuit: newRaceData.circuit,
          date: newRaceData.date,
          time: newRaceData.time,
          results: newRaceData.results
        },
        { upsert: true, new: true }
      );
      expect(result).toEqual({ ...newRaceData, _id: 'new_id', season: '2024', round: '3' });
    });

    test('should update existing race successfully', async () => {
      const updateData = {
        results: [
          {
            number: '1',
            position: '1',
            positionText: '1',
            points: '25',
            driverId: 'verstappen',
            constructorId: 'red_bull'
          }
        ]
      };

      const updatedRace = { ...mockRaceData, results: updateData.results };
      (MockRace.findOneAndUpdate as jest.MockedFunction<any>).mockResolvedValue(updatedRace);

      const result = await raceRepository.upsert('2024', '1', updateData);

      expect(MockRace.findOneAndUpdate).toHaveBeenCalledWith(
        { season: '2024', round: '1' },
        {
          url: undefined,
          raceName: undefined,
          circuit: {
            circuitId: undefined,
            circuitName: undefined,
            url: undefined,
            location: undefined
          },
          date: undefined,
          time: undefined,
          results: updateData.results
        },
        { upsert: true, new: true }
      );
      expect(result).toEqual(updatedRace);
    });

    test('should handle database upsert errors', async () => {
      (MockRace.findOneAndUpdate as jest.MockedFunction<any>).mockRejectedValue(new Error('Upsert error'));

      await expect(raceRepository.upsert('2024', '1', {}))
        .rejects.toThrow('Upsert error');
    });

    test('should handle partial race data', async () => {
      const partialData = {
        raceName: 'Test Grand Prix',
        date: '2024-12-31'
      };

      (MockRace.findOneAndUpdate as jest.MockedFunction<any>).mockResolvedValue({ ...partialData, _id: 'test_id' });

      const result = await raceRepository.upsert('2024', '99', partialData);

      expect(MockRace.findOneAndUpdate).toHaveBeenCalledWith(
        { season: '2024', round: '99' },
        {
          url: undefined,
          raceName: 'Test Grand Prix',
          circuit: {
            circuitId: undefined,
            circuitName: undefined,
            url: undefined,
            location: undefined
          },
          date: '2024-12-31',
          time: undefined,
          results: undefined
        },
        { upsert: true, new: true }
      );
      expect(result).toEqual({ ...partialData, _id: 'test_id' });
    });
  });

  describe('findBySeason', () => {
    test('should return all races for a season', async () => {
      (MockRace.findBySeason as jest.MockedFunction<any>).mockResolvedValue(mockRacesArray);

      const result = await raceRepository.findBySeason('2024');

      expect(MockRace.findBySeason).toHaveBeenCalledWith('2024');
      expect(result).toEqual(mockRacesArray);
    });

    test('should return empty array when no races exist for season', async () => {
      (MockRace.findBySeason as jest.MockedFunction<any>).mockResolvedValue([]);

      const result = await raceRepository.findBySeason('2030');

      expect(MockRace.findBySeason).toHaveBeenCalledWith('2030');
      expect(result).toEqual([]);
    });

    test('should handle database errors', async () => {
      (MockRace.findBySeason as jest.MockedFunction<any>).mockRejectedValue(new Error('Database error'));

      await expect(raceRepository.findBySeason('2024'))
        .rejects.toThrow('Database error');
    });

    test('should handle various season formats', async () => {
      const seasons = ['2024', '2023', '2005', '1950'];
      
      for (const season of seasons) {
        (MockRace.findBySeason as jest.MockedFunction<any>).mockResolvedValue(mockRacesArray);

        await raceRepository.findBySeason(season);
        expect(MockRace.findBySeason).toHaveBeenCalledWith(season);
        
        jest.clearAllMocks();
      }
    });
  });

  describe('findMostRecentBySeason', () => {
    test('should find most recently updated race for season', async () => {
      const mockQuery = {
        sort: jest.fn() as jest.MockedFunction<any>,
      };
      mockQuery.sort.mockResolvedValue(mockRaceData);

      (MockRace.findOne as jest.MockedFunction<any>).mockReturnValue(mockQuery);

      const result = await raceRepository.findMostRecentBySeason('2024');

      expect(MockRace.findOne).toHaveBeenCalledWith({ season: '2024' });
      expect(mockQuery.sort).toHaveBeenCalledWith({ updatedAt: -1 });
      expect(result).toEqual(mockRaceData);
    });

    test('should return null when no races exist for season', async () => {
      const mockQuery = {
        sort: jest.fn() as jest.MockedFunction<any>,
      };
      mockQuery.sort.mockResolvedValue(null);

      (MockRace.findOne as jest.MockedFunction<any>).mockReturnValue(mockQuery);

      const result = await raceRepository.findMostRecentBySeason('2030');

      expect(MockRace.findOne).toHaveBeenCalledWith({ season: '2030' });
      expect(mockQuery.sort).toHaveBeenCalledWith({ updatedAt: -1 });
      expect(result).toBeNull();
    });

    test('should handle database errors', async () => {
      const mockQuery = {
        sort: jest.fn() as jest.MockedFunction<any>,
      };
      mockQuery.sort.mockRejectedValue(new Error('Database error'));

      (MockRace.findOne as jest.MockedFunction<any>).mockReturnValue(mockQuery);

      await expect(raceRepository.findMostRecentBySeason('2024'))
        .rejects.toThrow('Database error');
    });

    test('should handle various season formats', async () => {
      const seasons = ['2024', '2023', '2005'];
      
      for (const season of seasons) {
        const mockQuery = {
          sort: jest.fn() as jest.MockedFunction<any>,
        };
        mockQuery.sort.mockResolvedValue(mockRaceData);

        (MockRace.findOne as jest.MockedFunction<any>).mockReturnValue(mockQuery);

        await raceRepository.findMostRecentBySeason(season);
        expect(MockRace.findOne).toHaveBeenCalledWith({ season });
        expect(mockQuery.sort).toHaveBeenCalledWith({ updatedAt: -1 });
        
        jest.clearAllMocks();
      }
    });
  });
}); 