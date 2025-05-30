import { Championship } from '../models/index.js';
import { IChampionship } from '../types';

/**
 * Finds a championship by season
 * @param season - The championship season
 * @returns The championship document
 */
const findBySeason = async (season: string): Promise<IChampionship | null> => {
  return Championship.findOne({ season });
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
 * @param season - The championship season
 * @param championshipData - The championship data
 * @returns The updated/created championship document
 */
const upsert = async (season: string, championshipData: Partial<IChampionship>): Promise<IChampionship | null> => {
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
 * @returns Array of championship documents
 */
const findAll = async (): Promise<IChampionship[]> => {
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