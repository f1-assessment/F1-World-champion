import * as raceRepository from '../repositories/raceRepository.js';
import * as driverService from './driverService.js';
import * as constructorService from './constructorService.js';
import * as apiService from './apiService.js';

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
 * Updates race data for a specific season
 * @param {number} year - The season year
 * @returns {Promise<Array>} - Array of race documents
 */
const updateRaceData = async (year) => {
  try {
    const racesData = await apiService.fetchResults(year);
    const updatedRaces = [];
    
    for (const raceData of racesData) {
      // Process race results
      const results = [];
      
      for (const result of raceData.Results) {
        // Make sure driver and constructor exist and get their IDs
        const driver = await driverService.findOrCreateDriver(result.Driver);
        const constructor = await constructorService.findOrCreateConstructor(result.Constructor);
        
        if (!driver || !constructor) {
          console.warn(`Skipping result for race ${raceData.raceName} - missing driver or constructor`);
          continue;
        }
        
        // Add processed result with string IDs
        results.push({
          position: result.position,
          positionText: result.positionText,
          points: result.points,
          driverId: driver.driverId, // Use the string ID
          constructorId: constructor.constructorId, // Use the string ID
          grid: result.grid,
          laps: result.laps,
          status: result.status,
          time: result.Time,
          fastestLap: result.FastestLap
        });
      }
      
      // Update or create race record
      const race = await raceRepository.upsert(
        year.toString(),
        raceData.round,
        {
          url: raceData.url,
          raceName: raceData.raceName,
          circuit: {
            circuitId: raceData.Circuit.circuitId,
            circuitName: raceData.Circuit.circuitName,
            url: raceData.Circuit.url,
            location: raceData.Circuit.Location
          },
          date: raceData.date,
          time: raceData.time,
          results: results
        }
      );
      
      updatedRaces.push(race);
    }
    
    console.log(`Updated ${updatedRaces.length} races for ${year}`);
    return updatedRaces;
  } catch (error) {
    console.error(`Error updating race data for ${year}:`, error);
    throw error;
  }
};

/**
 * Gets all races for a specific season
 * @param {number} year - The season year
 * @returns {Promise<Array>} - Array of race documents
 */
const getRacesBySeason = async (year) => {
  try {
    // Check if we have data for this season
    const latestRace = await raceRepository.findMostRecentBySeason(year.toString());
    
    // If no data or data is stale, fetch from API
    if (!latestRace || isDataStale(latestRace.updatedAt)) {
      await updateRaceData(year);
    }
    
    return raceRepository.findBySeason(year.toString());
  } catch (error) {
    console.error(`Error in getRacesBySeason for ${year}:`, error);
    throw error;
  }
};

/**
 * Gets a specific race by season and round
 * @param {number} year - The season year
 * @param {number} round - The race round
 * @returns {Promise<Object>} - The race document
 */
const getRaceBySeasonAndRound = async (year, round) => {
  try {
    // Check if we have this race
    let race = await raceRepository.findBySeasonAndRound(year.toString(), round.toString());
    
    if (!race) {
      // Update data for this season
      await updateRaceData(year);
      
      // Fetch again
      race = await raceRepository.findBySeasonAndRound(year.toString(), round.toString());
    }
    
    return race;
  } catch (error) {
    console.error(`Error in getRaceBySeasonAndRound for ${year} round ${round}:`, error);
    throw error;
  }
};

export {
  updateRaceData,
  getRacesBySeason,
  getRaceBySeasonAndRound
}; 