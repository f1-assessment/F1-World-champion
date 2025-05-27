import { getCurrentYear } from './utils';
import { API_BASE_URL } from './db';

// Use the API_BASE_URL from db.ts for consistency
// const BASE_URL = 'http://localhost:5000/api';

export interface Driver {
  driverId: string;
  permanentNumber?: string;
  code: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
}

export interface Constructor {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
}

export interface DriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
}

export interface RaceResult {
  position: string;
  positionText: string;
  points: string;
  driverId: string;
  constructorId: string;
  grid: string;
  laps: string;
  status: string;
  time?: {
    millis: string;
    time: string;
  };
  fastestLap?: {
    rank: string;
    lap: string;
    time: string;
    averageSpeed: {
      units: string;
      speed: string;
    };
  };
}

export interface Race {
  _id: string;
  season: string;
  round: string;
  url: string;
  raceName: string;
  circuit: {
    circuitId: string;
    circuitName: string;
    url: string;
    location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
  };
  date: string;
  time: string;
  results: RaceResult[];
}

export interface ChampionData {
  _id: string;
  season: string;
  driverId: Driver;
  constructorId: Constructor;
  points: string;
  wins: string;
}

export interface RaceWinnerData {
  season: number;
  round: number;
  raceName: string;
  date: string;
  time: string;
  circuit: {
    id: string;
    name: string;
    url: string;
    location: {
      locality: string;
      country: string;
    };
  };
  winner: {
    driver: any;
    constructor: any;
    grid: number;
    laps: number;
    status: string;
    time?: {
      millis: string;
      time: string;
    };
    fastestLap?: {
      rank: number;
      lap: number;
      time: string;
      speed: string;
    };
  };
}

// Helper function to transform MongoDB data to match the expected format
const transformChampionData = (championData: any): ChampionData => {
  return {
    _id: championData._id,
    season: championData.season,
    driverId: championData.driverId,
    constructorId: championData.constructorId,
    points: championData.points,
    wins: championData.wins
  };
};

// Helper function to transform race data to match the expected format
const transformRaceData = (raceData: any): Race => {
  return {
    _id: raceData._id,
    season: raceData.season,
    round: raceData.round,
    url: raceData.url,
    raceName: raceData.raceName,
    circuit: raceData.circuit,
    date: raceData.date,
    time: raceData.time,
    results: raceData.results
  };
};

// Helper function to transform race data to race winner format
const transformToRaceWinnerData = (race: Race): RaceWinnerData => {
  // Find the winner (position 1)
  const winnerResult = race.results.find(result => result.position === '1');

  if (!winnerResult) {
    throw new Error('No winner found in race results');
  }

  return {
    season: parseInt(race.season),
    round: parseInt(race.round),
    raceName: race.raceName,
    date: race.date,
    time: race.time,
    circuit: {
      id: race.circuit.circuitId,
      name: race.circuit.circuitName,
      url: race.circuit.url,
      location: {
        locality: race.circuit.location.locality,
        country: race.circuit.location.country
      }
    },
    winner: {
      driver: winnerResult.driverId,
      constructor: winnerResult.constructorId,
      grid: parseInt(winnerResult.grid),
      laps: parseInt(winnerResult.laps),
      status: winnerResult.status,
      time: winnerResult.time,
      fastestLap: winnerResult.fastestLap ? {
        rank: parseInt(winnerResult.fastestLap.rank),
        lap: parseInt(winnerResult.fastestLap.lap),
        time: winnerResult.fastestLap.time,
        speed: winnerResult.fastestLap.averageSpeed?.speed
      } : undefined
    }
  };
};

export async function fetchWorldChampion(year: number): Promise<ChampionData | null> {
  try {
    // First try to fetch from our backend
    const response = await fetch(`${API_BASE_URL}/championships/${year}`);
    
    if (!response.ok) {
      // If not found, trigger an update
      const updateResponse = await fetch(`${API_BASE_URL}/championships/update`, {
        method: 'POST'
      });
      
      if (!updateResponse.ok) {
        throw new Error(`Failed to update championship data for ${year}`);
      }
      
      // Try fetching again
      const retryResponse = await fetch(`${API_BASE_URL}/championships/${year}`);
      
      if (!retryResponse.ok) {
        return null;
      }
      
      const data = await retryResponse.json();
      return transformChampionData(data);
    }
    
    const data = await response.json();
    return transformChampionData(data);
  } catch (error) {
    console.error(`Error fetching champion for ${year}:`, error);
    return null;
  }
}

export async function fetchRaceWinners(year: number): Promise<RaceWinnerData[]> {
  try {
    // First try to fetch from our backend
    const response = await fetch(`${API_BASE_URL}/races/season/${year}`);
    
    if (!response.ok) {
      // If not found, trigger an update
      const updateResponse = await fetch(`${API_BASE_URL}/races/update/${year}`, {
        method: 'POST'
      });
      
      if (!updateResponse.ok) {
        throw new Error(`Failed to update race data for ${year}`);
      }
      
      // Try fetching again
      const retryResponse = await fetch(`${API_BASE_URL}/races/season/${year}`);
      
      if (!retryResponse.ok) {
        return [];
      }
      
      const races = await retryResponse.json();
      return races.map(transformRaceData).map(transformToRaceWinnerData);
    }
    
    const races = await response.json();
    return races.map(transformRaceData).map(transformToRaceWinnerData);
  } catch (error) {
    console.error(`Error fetching race winners for ${year}:`, error);
    return [];
  }
}

export async function fetchAllChampions(): Promise<ChampionData[]> {
  try {
    // First try to fetch from our backend
    const response = await fetch(`${API_BASE_URL}/championships`);
    
    if (!response.ok) {
      // If not found, trigger an update
      const updateResponse = await fetch(`${API_BASE_URL}/championships/update`, {
        method: 'POST'
      });
      
      if (!updateResponse.ok) {
        throw new Error('Failed to update championship data');
      }
      
      // Try fetching again
      const retryResponse = await fetch(`${API_BASE_URL}/championships`);
      
      if (!retryResponse.ok) {
        return [];
      }
      
      const data = await retryResponse.json();
      return data.map(transformChampionData);
    }
    
    const data = await response.json();
    return data.map(transformChampionData);
  } catch (error) {
    console.error('Error fetching all champions:', error);
    return [];
  }
}

export async function fetchSeasonData(year: number): Promise<{
  champion: ChampionData | null;
  races: RaceWinnerData[];
}> {
  const champion = await fetchWorldChampion(year);
  const races = await fetchRaceWinners(year);
  
  return {
    champion,
    races
  };
}