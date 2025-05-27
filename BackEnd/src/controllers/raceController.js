import * as raceService from '../services/raceService.js';
import { getCurrentYear } from '../config/constants.js';

/**
 * Get races for current season
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getCurrentSeasonRaces = async (req, res) => {
  try {
    const currentYear = getCurrentYear();
    const races = await raceService.getRacesBySeason(currentYear);
    res.status(200).json(races);
  } catch (error) {
    console.error('Error in getCurrentSeasonRaces controller:', error);
    res.status(500).json({ error: 'Failed to fetch current season races' });
  }
};

/**
 * Get races by season
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getRacesBySeason = async (req, res) => {
  try {
    const { year } = req.params;
    const races = await raceService.getRacesBySeason(year);
    res.status(200).json(races);
  } catch (error) {
    console.error('Error in getRacesBySeason controller:', error);
    res.status(500).json({ error: 'Failed to fetch races' });
  }
};

/**
 * Get race by season and round
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getRaceBySeasonAndRound = async (req, res) => {
  try {
    const { year, round } = req.params;
    const race = await raceService.getRaceBySeasonAndRound(year, round);
    
    if (!race) {
      return res.status(404).json({ error: `No race found for ${year} round ${round}` });
    }
    
    res.status(200).json(race);
  } catch (error) {
    console.error('Error in getRaceBySeasonAndRound controller:', error);
    res.status(500).json({ error: 'Failed to fetch race data' });
  }
};

/**
 * Update race data for a season
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateRaceData = async (req, res) => {
  try {
    const { year } = req.params;
    const races = await raceService.updateRaceData(year);
    res.status(200).json({ message: `Successfully updated ${races.length} races for ${year}` });
  } catch (error) {
    console.error('Error in updateRaceData controller:', error);
    res.status(500).json({ error: 'Failed to update race data' });
  }
}; 