import * as constructorRepository from '../repositories/constructorRepository.js';
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
 * Finds or creates a constructor
 * @param {Object} constructorData - The constructor data from the API
 * @returns {Promise<Object>} - The constructor document
 */
const findOrCreateConstructor = async (constructorData) => {
  try {
    // Check if constructor exists
    let constructor = await constructorRepository.findByConstructorId(constructorData.constructorId);
    
    if (!constructor) {
      // Create new constructor
      constructor = await constructorRepository.create(constructorData);
      console.log(`Created new constructor: ${constructorData.name}`);
    }
    
    return constructor;
  } catch (error) {
    console.error('Error in findOrCreateConstructor:', error);
    throw error;
  }
};

/**
 * Gets all constructors, fetching from API if needed
 * @returns {Promise<Array>} - Array of constructor documents
 */
const getAllConstructors = async () => {
  try {
    // Check if we have any constructors in the database
    const constructorsCount = await constructorRepository.count();
    
    if (constructorsCount === 0 || isDataStale((await constructorRepository.findMostRecent())?.updatedAt)) {
      // Fetch current year's constructors
      const currentYear = getCurrentYear();
      const constructorsData = await apiService.fetchConstructors(currentYear);
      
      // Process each constructor
      for (const constructorData of constructorsData) {
        await findOrCreateConstructor(constructorData);
      }
    }
    
    return constructorRepository.findAll();
  } catch (error) {
    console.error('Error in getAllConstructors:', error);
    throw error;
  }
};

export {
  findOrCreateConstructor,
  getAllConstructors
}; 