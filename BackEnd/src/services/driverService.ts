import * as driverRepository from '../repositories/driverRepository.js';
import * as apiService from './apiService.js';
import { getCurrentYear } from '../config/constants.js';
import { IDriver } from '../types';

// Cache duration in milliseconds (24 hours)
const CACHE_DURATION: number = 24 * 60 * 60 * 1000;

/**
 * Checks if the data is stale (older than cache duration)
 * @param updatedAt - The last update timestamp
 * @returns True if data is stale
 */
const isDataStale = (updatedAt: Date | undefined): boolean => {
  if (!updatedAt) return true;
  const now = new Date();
  const lastUpdate = new Date(updatedAt);
  return (now.getTime() - lastUpdate.getTime()) > CACHE_DURATION;
};

/**
 * Finds or creates a driver
 * @param driverData - The driver data from the API
 * @returns The driver document
 */
const findOrCreateDriver = async (driverData: Partial<IDriver>): Promise<IDriver> => {
  try {
    // Check if driver exists
    let driver = await driverRepository.findByDriverId(driverData.driverId!);
    
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
 * @returns Array of driver documents
 */
const getAllDrivers = async (): Promise<IDriver[]> => {
  try {
    return await driverRepository.findActiveDrivers();
  } catch (error) {
    console.error('Error in getAllDrivers service:', error);
    throw error;
  }
};

/**
 * Gets drivers by year range
 * @param startYear - Starting year (inclusive)
 * @param endYear - Ending year (inclusive)
 * @returns Array of driver documents
 */
const getDriversByYearRange = async (startYear: number, endYear: number): Promise<IDriver[]> => {
  try {
    return await driverRepository.findDriversByYearRange(startYear, endYear);
  } catch (error) {
    console.error('Error in getDriversByYearRange service:', error);
    throw error;
  }
};

/**
 * Gets drivers for a specific season
 * @param year - The season year
 * @returns Array of driver documents
 */
const getDriversBySeason = async (year: number): Promise<IDriver[]> => {
  try {
    return await driverRepository.findDriversBySeason(year);
  } catch (error) {
    console.error('Error in getDriversBySeason service:', error);
    throw error;
  }
};

/**
 * Gets a driver by their driverId
 * @param driverId - The driver's unique identifier
 * @returns The driver document or null
 */
const getDriverById = async (driverId: string): Promise<IDriver | null> => {
  try {
    return await driverRepository.findByDriverId(driverId);
  } catch (error) {
    console.error('Error in getDriverById service:', error);
    throw error;
  }
};

export {
  findOrCreateDriver,
  getAllDrivers,
  getDriversByYearRange,
  getDriversBySeason,
  getDriverById
}; 