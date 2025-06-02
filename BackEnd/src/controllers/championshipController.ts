import { Request, Response } from 'express';
import * as championshipService from '../services/championshipService.js';
import { STARTING_YEAR, getCurrentYear } from '../config/constants.js';

/**
 * @swagger
 * /api/championships:
 *   get:
 *     summary: Get all Formula 1 World Championships
 *     tags: [Championships]
 *     description: Retrieves all F1 World Championship data from the database, sorted by season (descending)
 *     responses:
 *       200:
 *         description: Successfully retrieved all championships
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Championship'
 *       500:
 *         $ref: '#/components/responses/InternalError'
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
 * @swagger
 * /api/championships/{year}:
 *   get:
 *     summary: Get championship data for a specific season
 *     tags: [Championships]
 *     description: Retrieves World Championship data for a specific F1 season
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *         description: Championship season year
 *         example: "2024"
 *     responses:
 *       200:
 *         description: Successfully retrieved championship data for the season
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Championship'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
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
 * @swagger
 * /api/championships/update:
 *   post:
 *     summary: Update all championship data from external API
 *     tags: [Championships]
 *     description: Fetches and updates all F1 World Championship data from external API (2005 to present)
 *     responses:
 *       200:
 *         description: Successfully updated championship data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully updated 21 championships"
 *                 total:
 *                   type: number
 *                   example: 21
 *                 championships:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Championship'
 *       500:
 *         $ref: '#/components/responses/InternalError'
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