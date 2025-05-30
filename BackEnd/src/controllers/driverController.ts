import { Request, Response } from 'express';
import * as driverService from '../services/driverService.js';
import { STARTING_YEAR, getCurrentYear } from '../config/constants.js';

/**
 * Get all drivers with optional year filtering
 * @param req - Express request object
 * @param res - Express response object
 */
export const getAllDrivers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fromYear, toYear } = req.query;
    
    // Parse and validate year parameters
    const startYear = fromYear ? parseInt(fromYear as string) : STARTING_YEAR;
    const endYear = toYear ? parseInt(toYear as string) : getCurrentYear();
    
    // Validate year range
    if (startYear < STARTING_YEAR) {
      res.status(400).json({ 
        error: `Starting year cannot be before ${STARTING_YEAR}` 
      });
      return;
    }
    
    if (endYear > getCurrentYear()) {
      res.status(400).json({ 
        error: `End year cannot be after ${getCurrentYear()}` 
      });
      return;
    }
    
    if (startYear > endYear) {
      res.status(400).json({ 
        error: 'Starting year cannot be after ending year' 
      });
      return;
    }
    
    const drivers = await driverService.getDriversByYearRange(startYear, endYear);
    res.status(200).json(drivers);
  } catch (error) {
    console.error('Error in getAllDrivers controller:', error);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
};

/**
 * Get drivers by specific season
 * @param req - Express request object
 * @param res - Express response object
 */
export const getDriversBySeason = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year } = req.params;
    const seasonYear = parseInt(year);
    
    // Validate year
    if (isNaN(seasonYear)) {
      res.status(400).json({ error: 'Invalid year format' });
      return;
    }
    
    if (seasonYear < STARTING_YEAR) {
      res.status(400).json({ 
        error: `Year cannot be before ${STARTING_YEAR}` 
      });
      return;
    }
    
    if (seasonYear > getCurrentYear()) {
      res.status(400).json({ 
        error: `Year cannot be after ${getCurrentYear()}` 
      });
      return;
    }
    
    const drivers = await driverService.getDriversBySeason(seasonYear);
    res.status(200).json(drivers);
  } catch (error) {
    console.error('Error in getDriversBySeason controller:', error);
    res.status(500).json({ error: 'Failed to fetch drivers for season' });
  }
};

/**
 * Get driver by ID
 * @param req - Express request object
 * @param res - Express response object
 */
export const getDriverById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { driverId } = req.params;
    const driver = await driverService.findOrCreateDriver({ driverId });
    
    if (!driver) {
      res.status(404).json({ error: 'Driver not found' });
      return;
    }
    
    res.status(200).json(driver);
  } catch (error) {
    console.error('Error in getDriverById controller:', error);
    res.status(500).json({ error: 'Failed to fetch driver' });
  }
}; 