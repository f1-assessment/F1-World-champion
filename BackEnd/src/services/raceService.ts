import { IRace, LapDataApiResponse, PitStopDataApiResponse, SeasonDataApiResponse } from '../types';
import Race from '../models/Race.js';
import axios from 'axios';

/**
 * Gets all races from database
 * @returns Array of all race documents
 */
export const getAllRaces = async (): Promise<IRace[]> => {
  try {
    const races = await Race.find({}).sort({ season: -1, round: 1 });
    return races;
  } catch (error) {
    console.error('Error fetching all races:', error);
    throw new Error('Failed to fetch races from database');
  }
};

/**
 * Gets races by season
 * @param year - The season year
 * @returns Array of race documents
 */
export const getRacesBySeason = async (year: string | number): Promise<IRace[]> => {
  try {
    const seasonYear = typeof year === 'string' ? year : year.toString();
    const races = await Race.findBySeason(seasonYear);
    return races;
  } catch (error) {
    console.error(`Error fetching races for season ${year}:`, error);
    throw new Error(`Failed to fetch races for season ${year}`);
  }
};

/**
 * Gets race by season and round
 * @param year - The season year
 * @param round - The race round
 * @returns The race document or null
 */
export const getRaceBySeasonAndRound = async (year: string, round: string): Promise<IRace | null> => {
  try {
    const race = await Race.findBySeasonAndRound(year, round);
    return race;
  } catch (error) {
    console.error(`Error fetching race for season ${year}, round ${round}:`, error);
    throw new Error(`Failed to fetch race for season ${year}, round ${round}`);
  }
};

/**
 * Updates race data for a season
 * @param year - The season year
 * @returns Array of updated races
 */
export const updateRaceData = async (year: string): Promise<IRace[]> => {
  // TODO: Implement race data update logic (fetch from external API, etc.)
  console.log(`Update race data for ${year} - Not yet implemented`);
  return [];
};

/**
 * Fetches lap data for a specific race from external API
 * @param year - The season year
 * @param round - The race round
 * @returns The lap data or null if not found
 */
export const fetchLapDataFromAPI = async (year: string, round: string): Promise<any | null> => {
  try {
    const url = `https://api.jolpi.ca/ergast/f1/${year}/${round}/laps`;
    const response = await axios.get<LapDataApiResponse>(url);
    
    if (response.data?.MRData?.RaceTable?.Races?.[0]?.Laps) {
      return response.data.MRData.RaceTable.Races[0].Laps;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching lap data for season ${year}, round ${round}:`, error);
    throw new Error(`Failed to fetch lap data for season ${year}, round ${round}`);
  }
};

/**
 * Gets lap data for a specific race
 * @param year - The season year
 * @param round - The race round
 * @returns The lap data from the race document or fetched from API
 */
export const getLapData = async (year: string, round: string): Promise<any[]> => {
  try {
    // First try to get from database
    const race = await Race.findBySeasonAndRound(year, round);
    
    if (race && race.laps && race.laps.length > 0) {
      return race.laps;
    }
    
    // If no lap data in database, fetch from external API
    const lapData = await fetchLapDataFromAPI(year, round);
    
    if (lapData && race) {
      // Update the race document with lap data
      race.laps = lapData;
      await race.save();
      return lapData;
    }
    
    return lapData || [];
  } catch (error) {
    console.error(`Error getting lap data for season ${year}, round ${round}:`, error);
    throw new Error(`Failed to get lap data for season ${year}, round ${round}`);
  }
};

/**
 * Updates lap data for a specific race
 * @param year - The season year
 * @param round - The race round
 * @returns The updated lap data
 */
export const updateLapData = async (year: string, round: string): Promise<any[]> => {
  try {
    const lapData = await fetchLapDataFromAPI(year, round);
    
    if (!lapData) {
      throw new Error(`No lap data found for season ${year}, round ${round}`);
    }
    
    // Find and update the race document
    const race = await Race.findBySeasonAndRound(year, round);
    
    if (!race) {
      throw new Error(`No race found for season ${year}, round ${round}`);
    }
    
    race.laps = lapData;
    await race.save();
    
    return lapData;
  } catch (error) {
    console.error(`Error updating lap data for season ${year}, round ${round}:`, error);
    throw new Error(`Failed to update lap data for season ${year}, round ${round}`);
  }
};

/**
 * Gets lap data for a specific lap number in a race
 * @param year - The season year
 * @param round - The race round
 * @param lapNumber - The specific lap number
 * @returns The lap data for the specific lap number
 */
export const getLapDataByLapNumber = async (year: string, round: string, lapNumber: string): Promise<any | null> => {
  try {
    const lapData = await getLapData(year, round);
    
    if (!lapData || lapData.length === 0) {
      return null;
    }
    
    const specificLap = lapData.find(lap => lap.number === lapNumber);
    return specificLap || null;
  } catch (error) {
    console.error(`Error getting lap ${lapNumber} data for season ${year}, round ${round}:`, error);
    throw new Error(`Failed to get lap ${lapNumber} data for season ${year}, round ${round}`);
  }
};

/**
 * Fetches pitstop data for a specific race from external API
 * @param year - The season year
 * @param round - The race round
 * @returns The pitstop data or null if not found
 */
export const fetchPitStopDataFromAPI = async (year: string, round: string): Promise<any | null> => {
  try {
    const url = `https://api.jolpi.ca/ergast/f1/${year}/${round}/pitstops`;
    const response = await axios.get<PitStopDataApiResponse>(url);
    
    if (response.data?.MRData?.RaceTable?.Races?.[0]?.PitStops) {
      return response.data.MRData.RaceTable.Races[0].PitStops;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching pitstop data for season ${year}, round ${round}:`, error);
    throw new Error(`Failed to fetch pitstop data for season ${year}, round ${round}`);
  }
};

/**
 * Gets pitstop data for a specific race
 * @param year - The season year
 * @param round - The race round
 * @returns The pitstop data from the race document or fetched from API
 */
export const getPitStopData = async (year: string, round: string): Promise<any[]> => {
  try {
    // First try to get from database
    const race = await Race.findBySeasonAndRound(year, round);
    
    if (race && race.pitStops && race.pitStops.length > 0) {
      return race.pitStops;
    }
    
    // If no pitstop data in database, fetch from external API
    const pitStopData = await fetchPitStopDataFromAPI(year, round);
    
    if (pitStopData && race) {
      // Update the race document with pitstop data
      race.pitStops = pitStopData;
      await race.save();
      return pitStopData;
    }
    
    return pitStopData || [];
  } catch (error) {
    console.error(`Error getting pitstop data for season ${year}, round ${round}:`, error);
    throw new Error(`Failed to get pitstop data for season ${year}, round ${round}`);
  }
};

/**
 * Updates pitstop data for a specific race
 * @param year - The season year
 * @param round - The race round
 * @returns The updated pitstop data
 */
export const updatePitStopData = async (year: string, round: string): Promise<any[]> => {
  try {
    const pitStopData = await fetchPitStopDataFromAPI(year, round);
    
    if (!pitStopData) {
      throw new Error(`No pitstop data found for season ${year}, round ${round}`);
    }
    
    // Find and update the race document
    const race = await Race.findBySeasonAndRound(year, round);
    
    if (!race) {
      throw new Error(`No race found for season ${year}, round ${round}`);
    }
    
    race.pitStops = pitStopData;
    await race.save();
    
    return pitStopData;
  } catch (error) {
    console.error(`Error updating pitstop data for season ${year}, round ${round}:`, error);
    throw new Error(`Failed to update pitstop data for season ${year}, round ${round}`);
  }
};

/**
 * Gets pitstop data for a specific driver in a race
 * @param year - The season year
 * @param round - The race round
 * @param driverId - The driver ID
 * @returns The pitstop data for the specific driver
 */
export const getPitStopDataByDriver = async (year: string, round: string, driverId: string): Promise<any[]> => {
  try {
    const pitStopData = await getPitStopData(year, round);
    
    if (!pitStopData || pitStopData.length === 0) {
      return [];
    }
    
    const driverPitStops = pitStopData.filter(pitStop => pitStop.driverId === driverId);
    return driverPitStops || [];
  } catch (error) {
    console.error(`Error getting pitstop data for driver ${driverId} in season ${year}, round ${round}:`, error);
    throw new Error(`Failed to get pitstop data for driver ${driverId} in season ${year}, round ${round}`);
  }
};

/**
 * Fetches seasons data from external API with pagination to get seasons 2005-present
 * @returns The seasons data filtered for 2005 onwards or null if not found
 */
export const fetchSeasonsDataFromAPI = async (): Promise<any[] | null> => {
  try {
    const allSeasons: any[] = [];
    
    // We need to fetch from offset=30 and offset=60 to get seasons 2005-2025
    // offset=30 gives us 1980-2009 (we need 2005-2009 from this)
    // offset=60 gives us 2010-2025 (we need all of this)
    
    const urls = [
      'https://api.jolpi.ca/ergast/f1/seasons?offset=30', // 1980-2009
      'https://api.jolpi.ca/ergast/f1/seasons?offset=60'  // 2010-2025
    ];
    
    // Fetch from multiple pages concurrently
    const responses = await Promise.all(
      urls.map(url => axios.get<SeasonDataApiResponse>(url))
    );
    
    // Combine all seasons data
    for (const response of responses) {
      if (response.data?.MRData?.SeasonTable?.Seasons) {
        allSeasons.push(...response.data.MRData.SeasonTable.Seasons);
      }
    }
    
    if (allSeasons.length === 0) {
      return null;
    }
    
    // Filter to only include seasons from 2005 onwards
    const filteredSeasons = allSeasons.filter(season => {
      const year = parseInt(season.season);
      return year >= 2005;
    });
    
    // Sort by year in descending order (most recent first)
    filteredSeasons.sort((a, b) => parseInt(b.season) - parseInt(a.season));
    
    console.log(`Fetched ${filteredSeasons.length} seasons from 2005-present`);
    
    return filteredSeasons;
  } catch (error) {
    console.error('Error fetching seasons data:', error);
    throw new Error('Failed to fetch seasons data');
  }
};

/**
 * Gets all seasons data
 * @returns Array of all seasons
 */
export const getSeasonsData = async (): Promise<any[]> => {
  try {
    // For now, fetch directly from API
    // In the future, we could cache this in database
    const seasonsData = await fetchSeasonsDataFromAPI();
    
    if (!seasonsData) {
      throw new Error('No seasons data available');
    }
    
    return seasonsData;
  } catch (error) {
    console.error('Error getting seasons data:', error);
    throw new Error('Failed to get seasons data');
  }
};

/**
 * Updates seasons data by fetching from external API
 * @returns The updated seasons data
 */
export const updateSeasonsData = async (): Promise<any[]> => {
  try {
    const seasonsData = await fetchSeasonsDataFromAPI();
    
    if (!seasonsData) {
      throw new Error('No seasons data found');
    }
    
    // For now, just return the fetched data
    // In the future, we could save to database for caching
    return seasonsData;
  } catch (error) {
    console.error('Error updating seasons data:', error);
    throw new Error('Failed to update seasons data');
  }
};

/**
 * Gets seasons data with filtering options
 * @param startYear - Optional start year filter
 * @param endYear - Optional end year filter
 * @param limit - Optional limit for number of seasons
 * @returns Filtered array of seasons
 */
export const getFilteredSeasonsData = async (
  startYear?: number,
  endYear?: number,
  limit?: number
): Promise<any[]> => {
  try {
    const allSeasons = await getSeasonsData();
    
    let filteredSeasons = allSeasons;
    
    // Apply year range filtering
    if (startYear) {
      filteredSeasons = filteredSeasons.filter(season => 
        parseInt(season.season) >= startYear
      );
    }
    
    if (endYear) {
      filteredSeasons = filteredSeasons.filter(season => 
        parseInt(season.season) <= endYear
      );
    }
    
    // Sort by season year (descending by default)
    filteredSeasons = filteredSeasons.sort((a, b) => 
      parseInt(b.season) - parseInt(a.season)
    );
    
    // Apply limit
    if (limit && limit > 0) {
      filteredSeasons = filteredSeasons.slice(0, limit);
    }
    
    return filteredSeasons;
  } catch (error) {
    console.error('Error getting filtered seasons data:', error);
    throw new Error('Failed to get filtered seasons data');
  }
}; 