import { Request, Response } from 'express';
import * as driverService from '../services/driverService.js';
import { STARTING_YEAR, getCurrentYear } from '../config/constants.js';

/**
 * @swagger
 * /api/drivers:
 *   get:
 *     summary: Get all Formula 1 drivers
 *     tags: [Drivers]
 *     description: Retrieves all F1 drivers from the database with optional year filtering
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         description: Optional year filter to get drivers from a specific season
 *         example: "2024"
 *     responses:
 *       200:
 *         description: Successfully retrieved drivers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Driver'
 *       500:
 *         $ref: '#/components/responses/InternalError'
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
 * @swagger
 * /api/drivers/season/{year}:
 *   get:
 *     summary: Get drivers by season year
 *     tags: [Drivers]
 *     description: Retrieves all drivers who participated in a specific F1 season
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *         description: Season year
 *         example: "2024"
 *     responses:
 *       200:
 *         description: Successfully retrieved drivers for the season
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Driver'
 *       500:
 *         $ref: '#/components/responses/InternalError'
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
 * @swagger
 * /api/drivers/{driverId}:
 *   get:
 *     summary: Get driver by ID
 *     tags: [Drivers]
 *     description: Retrieves detailed information for a specific driver
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver identifier
 *         example: "max_verstappen"
 *     responses:
 *       200:
 *         description: Successfully retrieved driver information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export const getDriverById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { driverId } = req.params;
    const driver = await driverService.getDriverById(driverId);
    
    if (!driver) {
      res.status(404).json({ error: `Driver not found: ${driverId}` });
      return;
    }
    
    res.status(200).json(driver);
  } catch (error) {
    console.error('Error in getDriverById controller:', error);
    res.status(500).json({ error: 'Failed to fetch driver' });
  }
}; 