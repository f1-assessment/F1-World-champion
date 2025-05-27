import { Race } from '../models/index.js';

/**
 * Finds a race by season and round
 * @param {string} season - The race season
 * @param {string} round - The race round
 * @returns {Promise<Object>} - The race document
 */
const findBySeasonAndRound = async (season, round) => {
  return Race.findOne({ season, round })
    .populate({
      path: 'results.driverId',
      model: 'Driver',
      match: { driverId: { $exists: true } },
      select: 'driverId givenName familyName code nationality dateOfBirth permanentNumber url'
    })
    .populate({
      path: 'results.constructorId',
      model: 'Constructor',
      match: { constructorId: { $exists: true } },
      select: 'constructorId name nationality url'
    });
};

/**
 * Updates or creates a race record
 * @param {string} season - The race season
 * @param {string} round - The race round
 * @param {Object} raceData - The race data
 * @returns {Promise<Object>} - The updated/created race document
 */
const upsert = async (season, round, raceData) => {
  return Race.findOneAndUpdate(
    { season, round },
    {
      url: raceData.url,
      raceName: raceData.raceName,
      circuit: {
        circuitId: raceData.circuit.circuitId,
        circuitName: raceData.circuit.circuitName,
        url: raceData.circuit.url,
        location: raceData.circuit.location
      },
      date: raceData.date,
      time: raceData.time,
      results: raceData.results
    },
    { upsert: true, new: true }
  );
};

/**
 * Gets all races for a season
 * @param {string} season - The race season
 * @returns {Promise<Array>} - Array of race documents
 */
const findBySeason = async (season) => {
  return Race.findBySeason(season);
};

/**
 * Gets the most recently updated race for a season
 * @param {string} season - The race season
 * @returns {Promise<Object>} - The most recent race document
 */
const findMostRecentBySeason = async (season) => {
  return Race.findOne({ season })
    .sort({ updatedAt: -1 });
};

export {
  findBySeasonAndRound,
  upsert,
  findBySeason,
  findMostRecentBySeason
}; 