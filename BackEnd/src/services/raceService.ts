import { IRace } from '../types';
import Race from '../models/Race.js';

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