import { Driver, Race } from '../models/index.js';
import { IDriver } from '../types';

/**
 * Finds a driver by their driverId
 * @param driverId - The driver's unique identifier
 * @returns The driver document
 */
const findByDriverId = async (driverId: string): Promise<IDriver | null> => {
  return Driver.findOne({ driverId });
};

/**
 * Creates a new driver
 * @param driverData - The driver data
 * @returns The created driver document
 */
const create = async (driverData: Partial<IDriver>): Promise<IDriver> => {
  return Driver.create({
    driverId: driverData.driverId,
    permanentNumber: driverData.permanentNumber,
    code: driverData.code,
    url: driverData.url,
    givenName: driverData.givenName,
    familyName: driverData.familyName,
    dateOfBirth: driverData.dateOfBirth,
    nationality: driverData.nationality
  });
};

/**
 * Gets all drivers sorted by family name
 * @returns Array of driver documents
 */
const findAll = async (): Promise<IDriver[]> => {
  return Driver.find().sort({ familyName: 1 });
};

/**
 * Gets the count of drivers in the database
 * @returns The number of drivers
 */
const count = async (): Promise<number> => {
  return Driver.countDocuments();
};

/**
 * Gets the most recently updated driver
 * @returns The most recent driver document
 */
const findMostRecent = async (): Promise<IDriver | null> => {
  return Driver.findOne().sort({ updatedAt: -1 });
};

/**
 * Gets all drivers who participated in races from 2005 onwards, sorted by family name
 * @returns Array of driver documents
 */
const findActiveDrivers = async (): Promise<IDriver[]> => {
  // First, get all unique driver IDs from race results from 2005 onwards
  const races = await Race.aggregate([
    { $match: { season: { $gte: "2005" } } },
    { $unwind: "$results" },
    { $group: { _id: "$results.driverId" } }
  ]);

  // Extract the driver IDs
  const driverIds: string[] = races.map(race => race._id);

  // Get the full driver documents for these IDs
  return Driver.find({ driverId: { $in: driverIds } })
    .sort({ familyName: 1 });
};

/**
 * Gets drivers who participated in races within a specific year range
 * @param startYear - Starting year (inclusive)
 * @param endYear - Ending year (inclusive)
 * @returns Array of driver documents
 */
const findDriversByYearRange = async (startYear: number, endYear: number): Promise<IDriver[]> => {
  // Convert years to strings for MongoDB comparison
  const startYearStr = startYear.toString();
  const endYearStr = endYear.toString();

  // Get all unique driver IDs from race results within the year range
  const races = await Race.aggregate([
    { 
      $match: { 
        season: { 
          $gte: startYearStr, 
          $lte: endYearStr 
        } 
      } 
    },
    { $unwind: "$results" },
    { $group: { _id: "$results.driverId" } }
  ]);

  // Extract the driver IDs
  const driverIds: string[] = races.map(race => race._id);

  // Get the full driver documents for these IDs
  return Driver.find({ driverId: { $in: driverIds } })
    .sort({ familyName: 1 });
};

/**
 * Gets drivers who participated in races for a specific season
 * @param year - The season year
 * @returns Array of driver documents
 */
const findDriversBySeason = async (year: number): Promise<IDriver[]> => {
  // Convert year to string for MongoDB comparison
  const yearStr = year.toString();

  // Get all unique driver IDs from race results for the specific season
  const races = await Race.aggregate([
    { $match: { season: yearStr } },
    { $unwind: "$results" },
    { $group: { _id: "$results.driverId" } }
  ]);

  // Extract the driver IDs
  const driverIds: string[] = races.map(race => race._id);

  // Get the full driver documents for these IDs
  return Driver.find({ driverId: { $in: driverIds } })
    .sort({ familyName: 1 });
};

export {
  findByDriverId,
  create,
  findAll,
  count,
  findMostRecent,
  findActiveDrivers,
  findDriversByYearRange,
  findDriversBySeason
}; 