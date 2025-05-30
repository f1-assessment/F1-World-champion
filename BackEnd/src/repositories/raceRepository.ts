import { Race } from '../models/index.js';
import { IRace } from '../types';

/**
 * Finds a race by season and round
 * @param season - The race season
 * @param round - The race round
 * @returns The race document
 */
const findBySeasonAndRound = async (season: string, round: string): Promise<IRace | null> => {
  return Race.findOne({ season, round });
  // .populate({
  //   path: 'driverId',
  //   model: 'Driver',
  //   match: { driverId: { $exists: true } },
  //   select: 'driverId givenName familyName code nationality dateOfBirth permanentNumber url'
  // })
  // .populate({
  //   path: 'constructorId',
  //   model: 'Constructor',
  //   match: { constructorId: { $exists: true } },
  //   select: 'constructorId name nationality url'
  // });
};

/**
 * Updates or creates a race record
 * @param season - The race season
 * @param round - The race round
 * @param raceData - The race data
 * @returns The updated/created race document
 */
const upsert = async (season: string, round: string, raceData: Partial<IRace>): Promise<IRace | null> => {
  return Race.findOneAndUpdate(
    { season, round },
    {
      url: raceData.url,
      raceName: raceData.raceName,
      circuit: {
        circuitId: raceData.circuit?.circuitId,
        circuitName: raceData.circuit?.circuitName,
        url: raceData.circuit?.url,
        location: raceData.circuit?.location
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
 * @param season - The race season
 * @returns Array of race documents
 */
const findBySeason = async (season: string): Promise<IRace[]> => {
  return Race.findBySeason(season);
};

/**
 * Gets the most recently updated race for a season
 * @param season - The race season
 * @returns The most recent race document
 */
const findMostRecentBySeason = async (season: string): Promise<IRace | null> => {
  return Race.findOne({ season })
    .sort({ updatedAt: -1 });
};

export {
  findBySeasonAndRound,
  upsert,
  findBySeason,
  findMostRecentBySeason
}; 