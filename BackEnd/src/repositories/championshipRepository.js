import { Championship } from '../models/index.js';

/**
 * Finds a championship by season
 * @param {string} season - The championship season
 * @returns {Promise<Object>} - The championship document
 */
const findBySeason = async (season) => {
  return Championship.findOne({ season })
    // .populate({
    //   path: 'driverId',
    //   model: 'Driver',
    //   match: { driverId: { $exists: true } }
    // })
    // .populate({
    //   path: 'constructorId',
    //   model: 'Constructor',
    //   match: { constructorId: { $exists: true } }
    // });
};

/**
 * Updates or creates a championship record
 * @param {string} season - The championship season
 * @param {Object} championshipData - The championship data
 * @returns {Promise<Object>} - The updated/created championship document
 */
const upsert = async (season, championshipData) => {
  return Championship.findOneAndUpdate(
    { season },
    {
      driverId: championshipData.driverId,
      constructorId: championshipData.constructorId,
      points: championshipData.points,
      wins: championshipData.wins
    },
    { upsert: true, new: true }
  );
};

/**
 * Gets all championships sorted by season
 * @returns {Promise<Array>} - Array of championship documents
 */
const findAll = async () => {
  return Championship.find()
    // .populate({
    //   path: 'driverId',
    //   model: 'Driver',
    //   match: { driverId: { $exists: true } }
    // })
    // .populate({
    //   path: 'constructorId',
    //   model: 'Constructor',
    //   match: { constructorId: { $exists: true } }
    // })
    .sort({ season: -1 });
};

export {
  findBySeason,
  upsert,
  findAll
}; 