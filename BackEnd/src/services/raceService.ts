import { IRace, LapDataApiResponse } from '../types';
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