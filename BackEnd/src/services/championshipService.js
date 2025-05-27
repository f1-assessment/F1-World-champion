import * as championshipRepository from '../repositories/championshipRepository.js';
import * as driverService from './driverService.js';
import * as constructorService from './constructorService.js';
import * as apiService from './apiService.js';
import { STARTING_YEAR, getCurrentYear } from '../config/constants.js';

// Cache duration in milliseconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

/**
 * Checks if the data is stale (older than cache duration)
 * @param {Date} updatedAt - The last update timestamp
 * @returns {boolean} - True if data is stale
 */
const isDataStale = (updatedAt) => {
  if (!updatedAt) return true;
  const now = new Date();
  const lastUpdate = new Date(updatedAt);
  return (now - lastUpdate) > CACHE_DURATION;
};

/**
 * Updates the championship data for a season
 * @param {number} year - The season year
 * @returns {Promise<Object>} - The championship document
 */
const updateChampionshipData = async (year) => {
  try {
    const championData = await apiService.fetchWorldChampion(year);
    
    if (!championData) {
      console.log(`No championship data found for ${year}`);
      return null;
    }
    
    // Make sure driver and constructor exist
    await driverService.findOrCreateDriver(championData.driver);
    await constructorService.findOrCreateConstructor(championData.constructor);
    
    // Update or create championship record
    const championship = await championshipRepository.upsert(year.toString(), {
      driverId: championData.driverId,
      constructorId: championData.constructorId,
      points: championData.points,
      wins: championData.wins
    });
    
    console.log(`Updated championship data for ${year}`);
    return championship;
  } catch (error) {
    console.error(`Error updating championship data for ${year}:`, error);
    throw error;
  }
};

/**
 * Gets all championship data
 * @returns {Promise<Array>} - Array of championship documents
 */
const getAllChampionships = async () => {
  return championshipRepository.findAll();
};

/**
 * Gets championship data for a specific season
 * @param {number} year - The season year
 * @returns {Promise<Object>} - The championship document
 */
const getChampionshipBySeason = async (year) => {
  try {
    // Check if we have data for this season
    let championship = await championshipRepository.findBySeason(year.toString());
    
    // If no data or data is stale, fetch from API
    if (!championship || isDataStale(championship.updatedAt)) {
      championship = await updateChampionshipData(year);
    }
    
    return championship;
  } catch (error) {
    console.error(`Error in getChampionshipBySeason for ${year}:`, error);
    throw error;
  }
};

/**
 * Updates championship data for all seasons
 * @returns {Promise<number>} - Number of updated championships
 */
const updateAllChampionships = async () => {
  const currentYear = getCurrentYear();
  let updatedCount = 0;
  
  for (let year = STARTING_YEAR; year <= currentYear; year++) {
    try {
      const championship = await updateChampionshipData(year);
      if (championship) updatedCount++;
    } catch (error) {
      console.error(`Error updating championship for ${year}:`, error);
    }
  }
  
  return updatedCount;
};

export {
  updateChampionshipData,
  getAllChampionships,
  getChampionshipBySeason,
  updateAllChampionships
}; 