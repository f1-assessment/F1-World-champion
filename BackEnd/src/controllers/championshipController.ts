import { Request, Response } from 'express';
import * as championshipService from '../services/championshipService.js';
import { STARTING_YEAR, getCurrentYear } from '../config/constants.js';

/**
 * Get all championships (from 2005 onwards)
 * @param req - Express request object
 * @param res - Express response object
 */
export const getAllChampionships = async (req: Request, res: Response): Promise<void> => {
  try {
    const championships = await championshipService.getAllChampionships();
    res.status(200).json(championships);
  } catch (error) {
    console.error('Error in getAllChampionships controller:', error);
    res.status(500).json({ error: 'Failed to fetch championships' });
  }
};

/**
 * Get championship by season (only for 2005 onwards)
 * @param req - Express request object
 * @param res - Express response object
 */
export const getChampionshipBySeason = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year } = req.params;
    const seasonYear = parseInt(year);
    
    // Validate year format
    if (isNaN(seasonYear)) {
      res.status(400).json({ error: 'Invalid year format' });
      return;
    }
    
    // Validate year range
    if (seasonYear < STARTING_YEAR) {
      res.status(400).json({ 
        error: `Championship data is only available from ${STARTING_YEAR} onwards` 
      });
      return;
    }
    
    if (seasonYear > getCurrentYear()) {
      res.status(400).json({ 
        error: `Championship data is not available for future years` 
      });
      return;
    }
    
    const championship = await championshipService.getChampionshipBySeason(seasonYear);
    
    if (!championship) {
      res.status(404).json({ error: `No championship data found for ${year}` });
      return;
    }
    
    res.status(200).json(championship);
  } catch (error) {
    console.error('Error in getChampionshipBySeason controller:', error);
    res.status(500).json({ error: 'Failed to fetch championship data' });
  }
};

/**
 * Update all championships (from 2005 to current year)
 * @param req - Express request object
 * @param res - Express response object
 */
export const updateAllChampionships = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedCount = await championshipService.updateAllChampionships();
    res.status(200).json({ 
      message: `Successfully updated ${updatedCount} championships`,
      updatedCount,
      yearRange: `${STARTING_YEAR}-${getCurrentYear()}`
    });
  } catch (error) {
    console.error('Error in updateAllChampionships controller:', error);
    res.status(500).json({ error: 'Failed to update championships' });
  }
}; 