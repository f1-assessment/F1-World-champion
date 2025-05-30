import * as championshipRepository from '../repositories/championshipRepository.js';
import * as apiService from './apiService.js';
import * as driverService from './driverService.js';
import * as constructorService from './constructorService.js';
import { STARTING_YEAR, getCurrentYear } from '../config/constants.js';
import { IChampionship } from '../types/index.js';

/**
 * Gets all championships from 2005 onwards
 * @returns Array of championship documents
 */
export const getAllChampionships = async (): Promise<IChampionship[]> => {
  try {
    const championships = await championshipRepository.findAll();
    
    // Filter championships to only include 2005 onwards
    return championships.filter(championship => {
      const season = parseInt(championship.season);
      return season >= STARTING_YEAR;
    });
  } catch (error) {
    console.error('Error in getAllChampionships service:', error);
    throw error;
  }
};

/**
 * Gets championship by season (only for 2005 onwards)
 * @param year - The season year
 * @returns The championship document or null
 */
export const getChampionshipBySeason = async (year: number): Promise<IChampionship | null> => {
  try {
    // Validate year is within allowed range
    if (year < STARTING_YEAR) {
      throw new Error(`Championship data is only available from ${STARTING_YEAR} onwards`);
    }
    
    if (year > getCurrentYear()) {
      throw new Error(`Championship data is not available for future years`);
    }
    
    // Try to get from database first
    let championship = await championshipRepository.findBySeason(year.toString());
    
    // If not found, try to fetch from API and create
    if (!championship) {
      const championData = await apiService.fetchWorldChampion(year);
      
      if (championData) {
        // Ensure driver and constructor exist
        await driverService.findOrCreateDriver(championData.driver);
        await constructorService.findOrCreateConstructor(championData.constructor);
        
        // Create championship record
        championship = await championshipRepository.upsert(year.toString(), {
          season: year.toString(),
          driverId: championData.driverId,
          constructorId: championData.constructorId,
          points: championData.points,
          wins: championData.wins
        });
      }
    }
    
    return championship;
  } catch (error) {
    console.error('Error in getChampionshipBySeason service:', error);
    throw error;
  }
};

/**
 * Updates all championships from 2005 to current year
 * @returns Number of updated championships
 */
export const updateAllChampionships = async (): Promise<number> => {
  try {
    let updatedCount = 0;
    const currentYear = getCurrentYear();
    
    // Update championships from STARTING_YEAR to current year
    for (let year = STARTING_YEAR; year <= currentYear; year++) {
      try {
        const championData = await apiService.fetchWorldChampion(year);
        
        if (championData) {
          // Ensure driver and constructor exist
          await driverService.findOrCreateDriver(championData.driver);
          await constructorService.findOrCreateConstructor(championData.constructor);
          
          // Update or create championship record
          await championshipRepository.upsert(year.toString(), {
            season: year.toString(),
            driverId: championData.driverId,
            constructorId: championData.constructorId,
            points: championData.points,
            wins: championData.wins
          });
          
          updatedCount++;
          console.log(`Updated championship data for ${year}`);
        }
      } catch (error) {
        console.error(`Error updating championship for ${year}:`, error);
        // Continue with next year even if one fails
      }
    }
    
    return updatedCount;
  } catch (error) {
    console.error('Error in updateAllChampionships service:', error);
    throw error;
  }
}; 