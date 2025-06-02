import axios, { AxiosResponse } from 'axios';
import { API_BASE_URL, API_ROUTES } from '../config/constants.js';

// Define specific API response interfaces
interface Season {
  season: string;
  url: string;
}

interface Circuit {
  circuitId: string;
  circuitName: string;
  url: string;
  location: {
    lat: string;
    long: string;
    locality: string;
    country: string;
  };
}

interface Driver {
  driverId: string;
  permanentNumber?: string;
  code?: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth?: string;
  nationality?: string;
}

interface Constructor {
  constructorId: string;
  name: string;
  nationality: string;
  url: string;
}

interface Race {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time: string;
  Results?: any[];
  SprintResults?: any[];
  QualifyingResults?: any[];
  PitStops?: any[];
  Laps?: any[];
  FirstPractice?: { date: string; time: string };
  SecondPractice?: { date: string; time: string };
  ThirdPractice?: { date: string; time: string };
  Qualifying?: { date: string; time: string };
  Sprint?: { date: string; time: string };
}

interface ChampionData {
  season: string;
  driverId: string;
  constructorId: string;
  points: string;
  wins: string;
  driver: Driver;
  constructor: Constructor;
}

/**
 * Fetches data from the Ergast API
 * @param endpoint - The API endpoint to fetch from
 * @returns The response data
 */
const fetchFromAPI = async (endpoint: string): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.get(`${API_BASE_URL}${endpoint}.json`);
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error fetching from API (${endpoint}):`, errorMessage);
    throw new Error(`Failed to fetch data from API: ${errorMessage}`);
  }
};

/**
 * Fetches all seasons from the API
 * @returns Array of seasons
 */
const fetchSeasons = async (): Promise<Season[]> => {
  const data = await fetchFromAPI(API_ROUTES.SEASONS);
  return data.MRData.SeasonTable.Seasons;
};

/**
 * Fetches all circuits from the API
 * @returns Array of circuits
 */
const fetchCircuits = async (): Promise<Circuit[]> => {
  const data = await fetchFromAPI(API_ROUTES.CIRCUITS);
  return data.MRData.CircuitTable.Circuits;
};

/**
 * Fetches races for a specific season
 * @param year - The season year
 * @returns Array of races
 */
const fetchRaces = async (year: number | string): Promise<Race[]> => {
  const data = await fetchFromAPI(API_ROUTES.RACES(year));
  return data.MRData.RaceTable.Races;
};

/**
 * Fetches constructors for a specific season
 * @param year - The season year
 * @returns Array of constructors
 */
const fetchConstructors = async (year: number | string): Promise<Constructor[]> => {
  const data = await fetchFromAPI(API_ROUTES.CONSTRUCTORS(year));
  return data.MRData.ConstructorTable.Constructors;
};

/**
 * Fetches drivers for a specific season
 * @param year - The season year
 * @returns Array of drivers
 */
const fetchDrivers = async (year: number | string): Promise<Driver[]> => {
  const data = await fetchFromAPI(API_ROUTES.DRIVERS(year));
  return data.MRData.DriverTable.Drivers;
};

/**
 * Fetches race results for a specific season
 * @param year - The season year
 * @returns Array of races with results
 */
const fetchResults = async (year: number | string): Promise<Race[]> => {
  const data = await fetchFromAPI(API_ROUTES.RESULTS(year));
  return data.MRData.RaceTable.Races;
};

/**
 * Fetches sprint results for a specific season
 * @param year - The season year
 * @returns Array of races with sprint results
 */
const fetchSprints = async (year: number | string): Promise<Race[]> => {
  const data = await fetchFromAPI(API_ROUTES.SPRINT(year));
  return data.MRData.RaceTable.Races;
};

/**
 * Fetches qualifying results for a specific season
 * @param year - The season year
 * @returns Array of races with qualifying results
 */
const fetchQualifying = async (year: number | string): Promise<Race[]> => {
  const data = await fetchFromAPI(API_ROUTES.QUALIFYING(year));
  return data.MRData.RaceTable.Races;
};

/**
 * Fetches pit stops for a specific race
 * @param year - The season year
 * @param round - The race round
 * @returns Array of pit stops
 */
const fetchPitStops = async (year: number | string, round: number | string): Promise<any[]> => {
  const data = await fetchFromAPI(API_ROUTES.PITSTOPS(year, round));
  return data.MRData.RaceTable.Races[0]?.PitStops || [];
};

/**
 * Fetches lap times for a specific race
 * @param year - The season year
 * @param round - The race round
 * @returns Array of laps with timings
 */
const fetchLaps = async (year: number | string, round: number | string): Promise<any[]> => {
  const data = await fetchFromAPI(API_ROUTES.LAPS(year, round));
  return data.MRData.RaceTable.Races[0]?.Laps || [];
};

/**
 * Fetches the world champion for a specific season
 * @param year - The season year
 * @returns The champion data or null if not found
 */
const fetchWorldChampion = async (year: number | string): Promise<ChampionData | null> => {
  try {
    const data = await fetchFromAPI(API_ROUTES.DRIVER_STANDINGS(year));
    
    if (!data.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.[0]) {
      return null;
    }
    
    const champion = data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];
    
    return {
      season: year.toString(),
      driverId: champion.Driver.driverId,
      constructorId: champion.Constructors[0].constructorId,
      points: champion.points,
      wins: champion.wins,
      driver: champion.Driver,
      constructor: champion.Constructors[0]
    };
  } catch (error) {
    console.error(`Error fetching world champion for ${year}:`, error);
    return null;
  }
};

export {
  fetchSeasons,
  fetchCircuits,
  fetchRaces,
  fetchConstructors,
  fetchDrivers,
  fetchResults,
  fetchSprints,
  fetchQualifying,
  fetchPitStops,
  fetchLaps,
  fetchWorldChampion
}; 