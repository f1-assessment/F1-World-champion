import { Driver, Race } from '../models/index.js';

/**
 * Finds a driver by their driverId
 * @param {string} driverId - The driver's unique identifier
 * @returns {Promise<Object>} - The driver document
 */
const findByDriverId = async (driverId) => {
  return Driver.findOne({ driverId });
};

/**
 * Creates a new driver
 * @param {Object} driverData - The driver data
 * @returns {Promise<Object>} - The created driver document
 */
const create = async (driverData) => {
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
 * @returns {Promise<Array>} - Array of driver documents
 */
const findAll = async () => {
  return Driver.find().sort({ familyName: 1 });
};

/**
 * Gets the count of drivers in the database
 * @returns {Promise<number>} - The number of drivers
 */
const count = async () => {
  return Driver.countDocuments();
};

/**
 * Gets the most recently updated driver
 * @returns {Promise<Object>} - The most recent driver document
 */
const findMostRecent = async () => {
  return Driver.findOne().sort({ updatedAt: -1 });
};

/**
 * Gets all drivers who participated in races from 2005 onwards, sorted by family name
 * @returns {Promise<Array>} - Array of driver documents
 */
const findActiveDrivers = async () => {
  // First, get all unique driver IDs from race results from 2005 onwards
  const races = await Race.aggregate([
    { $match: { season: { $gte: "2005" } } },
    { $unwind: "$results" },
    { $group: { _id: "$results.driverId" } }
  ]);

  // Extract the driver IDs
  const driverIds = races.map(race => race._id);

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
  findActiveDrivers
}; 