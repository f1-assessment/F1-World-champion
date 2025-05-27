import * as driverRepository from '../repositories/driverRepository.js';
import * as apiService from './apiService.js';
import { getCurrentYear } from '../config/constants.js';

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
 * Finds or creates a driver
 * @param {Object} driverData - The driver data from the API
 * @returns {Promise<Object>} - The driver document
 */
const findOrCreateDriver = async (driverData) => {
  try {
    // Check if driver exists
    let driver = await driverRepository.findByDriverId(driverData.driverId);
    
    if (!driver) {
      // Create new driver
      driver = await driverRepository.create(driverData);
      console.log(`Created new driver: ${driverData.givenName} ${driverData.familyName}`);
    }
    
    return driver;
  } catch (error) {
    console.error('Error in findOrCreateDriver:', error);
    throw error;
  }
};

/**
 * Gets all active drivers (from 2005 onwards)
 * @returns {Promise<Array>} - Array of driver documents
 */
const getAllDrivers = async () => {
  try {
    return await driverRepository.findActiveDrivers();
  } catch (error) {
    console.error('Error in getAllDrivers service:', error);
    throw error;
  }
};

export {
  findOrCreateDriver,
  getAllDrivers
}; 