import * as constructorRepository from '../repositories/constructorRepository.js';
import * as apiService from './apiService.js';
import { getCurrentYear } from '../config/constants.js';
import { IConstructor } from '../types/index.js';

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
 * Finds or creates a constructor
 * @param constructorData - The constructor data from the API
 * @returns The constructor document
 */
const findOrCreateConstructor = async (constructorData: Partial<IConstructor>): Promise<IConstructor> => {
  try {
    // Check if constructor exists
    let constructor = await constructorRepository.findByConstructorId(constructorData.constructorId!);
    
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
 * @returns Array of constructor documents
 */
const getAllConstructors = async (): Promise<IConstructor[]> => {
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