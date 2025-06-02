import { jest } from '@jest/globals';
import axios from 'axios';
import * as apiService from '../../services/apiService.js';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock constants
jest.mock('../../config/constants.js', () => ({
  API_BASE_URL: 'https://ergast.com/api/f1',
  API_ROUTES: {
    SEASONS: '/seasons',
    CIRCUITS: '/circuits',
    RACES: (year: number | string) => `/${year}`,
    CONSTRUCTORS: (year: number | string) => `/${year}/constructors`,
    DRIVERS: (year: number | string) => `/${year}/drivers`,
    RESULTS: (year: number | string) => `/${year}/results`,
    SPRINT: (year: number | string) => `/${year}/sprint`,
    QUALIFYING: (year: number | string) => `/${year}/qualifying`,
    PITSTOPS: (year: number | string, round: number | string) => `/${year}/${round}/pitstops`,
    LAPS: (year: number | string, round: number | string) => `/${year}/${round}/laps`,
    DRIVER_STANDINGS: (year: number | string) => `/${year}/driverStandings`
  }
}));

// Mock API response data
const mockSeasonsResponse = {
  data: {
    MRData: {
      SeasonTable: {
        Seasons: [
          { season: '2023', url: 'http://en.wikipedia.org/wiki/2023_Formula_One_season' },
          { season: '2024', url: 'http://en.wikipedia.org/wiki/2024_Formula_One_season' }
        ]
      }
    }
  }
};

const mockCircuitsResponse = {
  data: {
    MRData: {
      CircuitTable: {
        Circuits: [
          {
            circuitId: 'monza',
            circuitName: 'Autodromo Nazionale Monza',
            url: 'http://en.wikipedia.org/wiki/Autodromo_Nazionale_Monza',
            location: {
              lat: '45.6156',
              long: '9.28111',
              locality: 'Monza',
              country: 'Italy'
            }
          }
        ]
      }
    }
  }
};

const mockRacesResponse = {
  data: {
    MRData: {
      RaceTable: {
        Races: [
          {
            season: '2024',
            round: '1',
            url: 'http://en.wikipedia.org/wiki/2024_Bahrain_Grand_Prix',
            raceName: 'Bahrain Grand Prix',
            Circuit: {
              circuitId: 'bahrain',
              circuitName: 'Bahrain International Circuit',
              url: 'http://en.wikipedia.org/wiki/Bahrain_International_Circuit',
              location: {
                lat: '26.0325',
                long: '50.5106',
                locality: 'Sakhir',
                country: 'Bahrain'
              }
            },
            date: '2024-03-02',
            time: '15:00:00Z'
          }
        ]
      }
    }
  }
};

const mockConstructorsResponse = {
  data: {
    MRData: {
      ConstructorTable: {
        Constructors: [
          {
            constructorId: 'red_bull',
            name: 'Red Bull',
            nationality: 'Austrian',
            url: 'http://en.wikipedia.org/wiki/Red_Bull_Racing'
          },
          {
            constructorId: 'ferrari',
            name: 'Ferrari',
            nationality: 'Italian',
            url: 'http://en.wikipedia.org/wiki/Scuderia_Ferrari'
          }
        ]
      }
    }
  }
};

const mockDriversResponse = {
  data: {
    MRData: {
      DriverTable: {
        Drivers: [
          {
            driverId: 'verstappen',
            permanentNumber: '1',
            code: 'VER',
            url: 'http://en.wikipedia.org/wiki/Max_Verstappen',
            givenName: 'Max',
            familyName: 'Verstappen',
            dateOfBirth: '1997-09-30',
            nationality: 'Dutch'
          }
        ]
      }
    }
  }
};

const mockPitStopsResponse = {
  data: {
    MRData: {
      RaceTable: {
        Races: [
          {
            PitStops: [
              {
                driverId: 'verstappen',
                lap: '15',
                stop: '1',
                time: '14:15:30',
                duration: '2.300'
              }
            ]
          }
        ]
      }
    }
  }
};

const mockLapsResponse = {
  data: {
    MRData: {
      RaceTable: {
        Races: [
          {
            Laps: [
              {
                number: '1',
                Timings: [
                  { driverId: 'verstappen', position: '1', time: '1:30.000' }
                ]
              }
            ]
          }
        ]
      }
    }
  }
};

const mockChampionResponse = {
  data: {
    MRData: {
      StandingsTable: {
        StandingsLists: [
          {
            DriverStandings: [
              {
                position: '1',
                positionText: '1',
                points: '575',
                wins: '19',
                Driver: {
                  driverId: 'verstappen',
                  permanentNumber: '1',
                  code: 'VER',
                  url: 'http://en.wikipedia.org/wiki/Max_Verstappen',
                  givenName: 'Max',
                  familyName: 'Verstappen',
                  dateOfBirth: '1997-09-30',
                  nationality: 'Dutch'
                },
                Constructors: [
                  {
                    constructorId: 'red_bull',
                    name: 'Red Bull',
                    nationality: 'Austrian',
                    url: 'http://en.wikipedia.org/wiki/Red_Bull_Racing'
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  }
};

describe('API Service Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchSeasons', () => {
    test('should fetch seasons successfully', async () => {
      mockedAxios.get.mockResolvedValue(mockSeasonsResponse);

      const result = await apiService.fetchSeasons();

      expect(mockedAxios.get).toHaveBeenCalledWith('https://ergast.com/api/f1/seasons.json');
      expect(result).toHaveLength(2);
      expect(result[0].season).toBe('2023');
      expect(result[1].season).toBe('2024');
    });

    test('should handle API errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(apiService.fetchSeasons()).rejects.toThrow('Failed to fetch data from API: Network error');
    });
  });

  describe('fetchCircuits', () => {
    test('should fetch circuits successfully', async () => {
      mockedAxios.get.mockResolvedValue(mockCircuitsResponse);

      const result = await apiService.fetchCircuits();

      expect(mockedAxios.get).toHaveBeenCalledWith('https://ergast.com/api/f1/circuits.json');
      expect(result).toHaveLength(1);
      expect(result[0].circuitId).toBe('monza');
      expect(result[0].circuitName).toBe('Autodromo Nazionale Monza');
    });
  });

  describe('fetchRaces', () => {
    test('should fetch races for specific year', async () => {
      mockedAxios.get.mockResolvedValue(mockRacesResponse);

      const result = await apiService.fetchRaces(2024);

      expect(mockedAxios.get).toHaveBeenCalledWith('https://ergast.com/api/f1/2024.json');
      expect(result).toHaveLength(1);
      expect(result[0].season).toBe('2024');
      expect(result[0].raceName).toBe('Bahrain Grand Prix');
    });

    test('should handle string year parameter', async () => {
      mockedAxios.get.mockResolvedValue(mockRacesResponse);

      await apiService.fetchRaces('2024');

      expect(mockedAxios.get).toHaveBeenCalledWith('https://ergast.com/api/f1/2024.json');
    });
  });

  describe('fetchConstructors', () => {
    test('should fetch constructors for specific year', async () => {
      mockedAxios.get.mockResolvedValue(mockConstructorsResponse);

      const result = await apiService.fetchConstructors(2024);

      expect(mockedAxios.get).toHaveBeenCalledWith('https://ergast.com/api/f1/2024/constructors.json');
      expect(result).toHaveLength(2);
      expect(result[0].constructorId).toBe('red_bull');
      expect(result[1].constructorId).toBe('ferrari');
    });
  });

  describe('fetchDrivers', () => {
    test('should fetch drivers for specific year', async () => {
      mockedAxios.get.mockResolvedValue(mockDriversResponse);

      const result = await apiService.fetchDrivers(2024);

      expect(mockedAxios.get).toHaveBeenCalledWith('https://ergast.com/api/f1/2024/drivers.json');
      expect(result).toHaveLength(1);
      expect(result[0].driverId).toBe('verstappen');
      expect(result[0].givenName).toBe('Max');
    });
  });

  describe('fetchPitStops', () => {
    test('should fetch pit stops for specific race', async () => {
      mockedAxios.get.mockResolvedValue(mockPitStopsResponse);

      const result = await apiService.fetchPitStops(2024, 1);

      expect(mockedAxios.get).toHaveBeenCalledWith('https://ergast.com/api/f1/2024/1/pitstops.json');
      expect(result).toHaveLength(1);
      expect(result[0].driverId).toBe('verstappen');
      expect(result[0].duration).toBe('2.300');
    });

    test('should return empty array when no pit stops data', async () => {
      const emptyResponse = {
        data: {
          MRData: {
            RaceTable: {
              Races: [{}] // No PitStops property
            }
          }
        }
      };
      mockedAxios.get.mockResolvedValue(emptyResponse);

      const result = await apiService.fetchPitStops(2024, 1);

      expect(result).toEqual([]);
    });
  });

  describe('fetchLaps', () => {
    test('should fetch laps for specific race', async () => {
      mockedAxios.get.mockResolvedValue(mockLapsResponse);

      const result = await apiService.fetchLaps(2024, 1);

      expect(mockedAxios.get).toHaveBeenCalledWith('https://ergast.com/api/f1/2024/1/laps.json');
      expect(result).toHaveLength(1);
      expect(result[0].number).toBe('1');
    });

    test('should return empty array when no laps data', async () => {
      const emptyResponse = {
        data: {
          MRData: {
            RaceTable: {
              Races: [{}] // No Laps property
            }
          }
        }
      };
      mockedAxios.get.mockResolvedValue(emptyResponse);

      const result = await apiService.fetchLaps(2024, 1);

      expect(result).toEqual([]);
    });
  });

  describe('fetchWorldChampion', () => {
    test('should fetch world champion for specific year', async () => {
      mockedAxios.get.mockResolvedValue(mockChampionResponse);

      const result = await apiService.fetchWorldChampion(2024);

      expect(mockedAxios.get).toHaveBeenCalledWith('https://ergast.com/api/f1/2024/driverStandings.json');
      expect(result).not.toBeNull();
      expect(result!.season).toBe('2024');
      expect(result!.driverId).toBe('verstappen');
      expect(result!.constructorId).toBe('red_bull');
      expect(result!.points).toBe('575');
      expect(result!.wins).toBe('19');
    });

    test('should return null when no champion data found', async () => {
      const emptyResponse = {
        data: {
          MRData: {
            StandingsTable: {
              StandingsLists: [] // Empty standings
            }
          }
        }
      };
      mockedAxios.get.mockResolvedValue(emptyResponse);

      const result = await apiService.fetchWorldChampion(2024);

      expect(result).toBeNull();
    });

    test('should return null when standings structure is incomplete', async () => {
      const incompleteResponse = {
        data: {
          MRData: {
            StandingsTable: {
              StandingsLists: [
                {
                  DriverStandings: [] // Empty driver standings
                }
              ]
            }
          }
        }
      };
      mockedAxios.get.mockResolvedValue(incompleteResponse);

      const result = await apiService.fetchWorldChampion(2024);

      expect(result).toBeNull();
    });

    test('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      const result = await apiService.fetchWorldChampion(2024);

      expect(result).toBeNull();
    });
  });

  describe('Error handling', () => {
    test('should throw error with proper message format', async () => {
      const networkError = new Error('Network timeout');
      mockedAxios.get.mockRejectedValue(networkError);

      await expect(apiService.fetchSeasons())
        .rejects.toThrow('Failed to fetch data from API: Network timeout');
    });

    test('should handle non-Error objects', async () => {
      mockedAxios.get.mockRejectedValue('String error');

      await expect(apiService.fetchSeasons())
        .rejects.toThrow('Failed to fetch data from API: Unknown error');
    });

    test('should handle undefined errors', async () => {
      mockedAxios.get.mockRejectedValue(undefined);

      await expect(apiService.fetchSeasons())
        .rejects.toThrow('Failed to fetch data from API: Unknown error');
    });
  });

  describe('API endpoint construction', () => {
    test('should construct correct endpoints for different functions', async () => {
      // Mock all calls to avoid actual API calls
      mockedAxios.get.mockResolvedValue({ data: { MRData: {} } });

      // Test various endpoint constructions
      await apiService.fetchRaces(2024);
      await apiService.fetchConstructors('2023');
      await apiService.fetchDrivers(2022);
      await apiService.fetchPitStops(2024, '5');
      await apiService.fetchLaps('2023', 10);

      const calls = mockedAxios.get.mock.calls;
      expect(calls[0][0]).toBe('https://ergast.com/api/f1/2024.json');
      expect(calls[1][0]).toBe('https://ergast.com/api/f1/2023/constructors.json');
      expect(calls[2][0]).toBe('https://ergast.com/api/f1/2022/drivers.json');
      expect(calls[3][0]).toBe('https://ergast.com/api/f1/2024/5/pitstops.json');
      expect(calls[4][0]).toBe('https://ergast.com/api/f1/2023/10/laps.json');
    });
  });
}); 