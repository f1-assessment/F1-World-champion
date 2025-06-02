import { jest } from '@jest/globals';
import axios from 'axios';
import * as raceService from '../../services/raceService';
import { mockApiResponses } from '../setup';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Race Service Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchLapDataFromAPI', () => {
    test('should fetch lap data from external API successfully', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockApiResponses.lapData });

      const result = await raceService.fetchLapDataFromAPI('2024', '1');

      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.jolpi.ca/ergast/f1/2024/1/laps');
      expect(result).toEqual(mockApiResponses.lapData.MRData.RaceTable.Races[0].Laps);
    });

    test('should return null when no lap data is found in API response', async () => {
      const emptyResponse = {
        data: {
          MRData: {
            RaceTable: {
              Races: [{}]
            }
          }
        }
      };

      mockedAxios.get.mockResolvedValue(emptyResponse);

      const result = await raceService.fetchLapDataFromAPI('2024', '1');

      expect(result).toBeNull();
    });

    test('should throw error when API call fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      await expect(raceService.fetchLapDataFromAPI('2024', '1')).rejects.toThrow(
        'Failed to fetch lap data for season 2024, round 1'
      );
    });
  });

  describe('fetchPitStopDataFromAPI', () => {
    test('should fetch pitstop data from external API successfully', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockApiResponses.pitStopData });

      const result = await raceService.fetchPitStopDataFromAPI('2024', '1');

      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.jolpi.ca/ergast/f1/2024/1/pitstops');
      expect(result).toEqual(mockApiResponses.pitStopData.MRData.RaceTable.Races[0].PitStops);
    });

    test('should return null when no pitstop data is found', async () => {
      const emptyResponse = {
        data: {
          MRData: {
            RaceTable: {
              Races: [{}]
            }
          }
        }
      };

      mockedAxios.get.mockResolvedValue(emptyResponse);

      const result = await raceService.fetchPitStopDataFromAPI('2024', '1');

      expect(result).toBeNull();
    });

    test('should throw error when API call fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      await expect(raceService.fetchPitStopDataFromAPI('2024', '1')).rejects.toThrow(
        'Failed to fetch pitstop data for season 2024, round 1'
      );
    });
  });

  describe('fetchSeasonsDataFromAPI', () => {
    test('should fetch seasons data from external API successfully', async () => {
      // Mock responses for both offset calls
      mockedAxios.get
        .mockResolvedValueOnce({ data: { MRData: { SeasonTable: { Seasons: [
          { season: '2005', url: 'https://example.com/2005' },
          { season: '2006', url: 'https://example.com/2006' }
        ] } } } })
        .mockResolvedValueOnce({ data: { MRData: { SeasonTable: { Seasons: [
          { season: '2024', url: 'https://example.com/2024' },
          { season: '2023', url: 'https://example.com/2023' }
        ] } } } });

      const result = await raceService.fetchSeasonsDataFromAPI();

      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.jolpi.ca/ergast/f1/seasons?offset=30');
      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.jolpi.ca/ergast/f1/seasons?offset=60');
      expect(result).not.toBeNull();
      expect(result).toHaveLength(4); // All seasons >= 2005
      expect(result![0].season).toBe('2024'); // Should be sorted desc
    });

    test('should return null when no seasons data is found', async () => {
      const emptyResponse = {
        data: {
          MRData: {
            SeasonTable: {}
          }
        }
      };

      mockedAxios.get.mockResolvedValue(emptyResponse);

      const result = await raceService.fetchSeasonsDataFromAPI();

      expect(result).toBeNull();
    });

    test('should throw error when API call fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      await expect(raceService.fetchSeasonsDataFromAPI()).rejects.toThrow('Failed to fetch seasons data');
    });
  });

  describe('getFilteredSeasonsData', () => {
    // Mock the getSeasonsData dependency since getFilteredSeasonsData calls it
    beforeEach(() => {
      // Mock multiple API calls that fetchSeasonsDataFromAPI makes
      mockedAxios.get
        .mockResolvedValueOnce({ data: { MRData: { SeasonTable: { Seasons: [
          { season: '2005', url: 'https://example.com/2005' },
          { season: '2019', url: 'https://example.com/2019' }
        ] } } } })
        .mockResolvedValueOnce({ data: { MRData: { SeasonTable: { Seasons: [
          { season: '2024', url: 'https://example.com/2024' },
          { season: '2023', url: 'https://example.com/2023' },
          { season: '2022', url: 'https://example.com/2022' }
        ] } } } });
    });

    test('should filter seasons by start year', async () => {
      const result = await raceService.getFilteredSeasonsData(2020);

      expect(result).toHaveLength(3); // 2024, 2023, 2022 (>= 2020)
      expect(result.every(season => parseInt(season.season) >= 2020)).toBe(true);
    });

    test('should filter seasons by end year', async () => {
      const result = await raceService.getFilteredSeasonsData(undefined, 2022);

      expect(result).toHaveLength(3); // 2022, 2019, 2005 (<= 2022) 
      expect(result.every(season => parseInt(season.season) <= 2022)).toBe(true);
    });

    test('should limit results when limit parameter is provided', async () => {
      const result = await raceService.getFilteredSeasonsData(undefined, undefined, 3);

      expect(result).toHaveLength(3);
    });
  });
}); 