import { getCurrentYear } from './utils';

const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

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
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Driver;
  Constructor: Constructor;
  grid: string;
  laps: string;
  status: string;
  Time?: {
    millis: string;
    time: string;
  };
  FastestLap?: {
    rank: string;
    lap: string;
    Time: {
      time: string;
    };
    AverageSpeed: {
      units: string;
      speed: string;
    };
  };
}

export interface Race {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
  };
  date: string;
  time: string;
  Results: RaceResult[];
}

export interface ChampionData {
  season: number;
  driver: Driver;
  constructor: Constructor;
  points: number;
  wins: number;
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
    driver: Driver;
    constructor: Constructor;
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

export async function fetchWorldChampion(year: number): Promise<ChampionData | null> {
  try {
    const response = await fetch(`${BASE_URL}/${year}/driverStandings/1.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch champion data for ${year}`);
    }
    
    const data = await response.json();
    
    if (!data.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.[0]) {
      return null;
    }
    
    const championData = data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];
    
    return {
      season: parseInt(data.MRData.StandingsTable.season),
      driver: championData.Driver,
      constructor: championData.Constructors[0],
      points: parseFloat(championData.points),
      wins: parseInt(championData.wins)
    };
  } catch (error) {
    console.error(`Error fetching champion for ${year}:`, error);
    return null;
  }
}

export async function fetchRaceWinners(year: number): Promise<RaceWinnerData[]> {
  try {
    const response = await fetch(`${BASE_URL}/${year}/results/1.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch race winners for ${year}`);
    }
    
    const data = await response.json();
    
    if (!data.MRData?.RaceTable?.Races) {
      return [];
    }
    
    return data.MRData.RaceTable.Races.map((race: Race) => {
      const result = race.Results[0];
      
      return {
        season: parseInt(race.season),
        round: parseInt(race.round),
        raceName: race.raceName,
        date: race.date,
        time: race.time,
        circuit: {
          id: race.Circuit.circuitId,
          name: race.Circuit.circuitName,
          url: race.Circuit.url,
          location: {
            locality: race.Circuit.Location.locality,
            country: race.Circuit.Location.country
          }
        },
        winner: {
          driver: result.Driver,
          constructor: result.Constructor,
          grid: parseInt(result.grid),
          laps: parseInt(result.laps),
          status: result.status,
          time: result.Time,
          fastestLap: result.FastestLap ? {
            rank: parseInt(result.FastestLap.rank),
            lap: parseInt(result.FastestLap.lap),
            time: result.FastestLap.Time.time,
            speed: result.FastestLap.AverageSpeed.speed
          } : undefined
        }
      };
    });
  } catch (error) {
    console.error(`Error fetching race winners for ${year}:`, error);
    return [];
  }
}

export async function fetchAllChampions(): Promise<ChampionData[]> {
  const champions: ChampionData[] = [];
  const currentYear = getCurrentYear();
  
  for (let year = 2005; year <= currentYear; year++) {
    const champion = await fetchWorldChampion(year);
    if (champion) {
      champions.push(champion);
    }
  }
  
  return champions;
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