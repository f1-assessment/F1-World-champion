import { Request, Response } from 'express';
import * as raceService from '../services/raceService.js';
import { getCurrentYear } from '../config/constants.js';

/**
 * @swagger
 * /api/races/all:
 *   get:
 *     summary: Get all races from database
 *     tags: [Races]
 *     description: Retrieves all race data stored in the database, sorted by season (descending) and round (ascending)
 *     responses:
 *       200:
 *         description: Successfully retrieved all races
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Race'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export const getAllRaces = async (req: Request, res: Response): Promise<void> => {
  try {
    const races = await raceService.getAllRaces();
    res.status(200).json(races);
  } catch (error) {
    console.error('Error in getAllRaces controller:', error);
    res.status(500).json({ error: 'Failed to fetch all races' });
  }
};

/**
 * @swagger
 * /api/races:
 *   get:
 *     summary: Get races for current season
 *     tags: [Races]
 *     description: Retrieves race data for the current F1 season
 *     responses:
 *       200:
 *         description: Successfully retrieved current season races
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Race'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export const getCurrentSeasonRaces = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentYear = getCurrentYear();
    const races = await raceService.getRacesBySeason(currentYear);
    res.status(200).json(races);
  } catch (error) {
    console.error('Error in getCurrentSeasonRaces controller:', error);
    res.status(500).json({ error: 'Failed to fetch current season races' });
  }
};

/**
 * @swagger
 * /api/races/season/{year}:
 *   get:
 *     summary: Get races by season
 *     tags: [Races]
 *     description: Retrieves all races for a specific season
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
 *         description: Successfully retrieved races for the season
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Race'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export const getRacesBySeason = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year } = req.params;
    const races = await raceService.getRacesBySeason(year);
    res.status(200).json(races);
  } catch (error) {
    console.error('Error in getRacesBySeason controller:', error);
    res.status(500).json({ error: 'Failed to fetch races' });
  }
};

/**
 * @swagger
 * /api/races/season/{year}/round/{round}:
 *   get:
 *     summary: Get race by season and round
 *     tags: [Races]
 *     description: Retrieves detailed race data for a specific season and round
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *         description: Season year
 *         example: "2024"
 *       - in: path
 *         name: round
 *         required: true
 *         schema:
 *           type: string
 *         description: Race round number
 *         example: "1"
 *     responses:
 *       200:
 *         description: Successfully retrieved race data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Race'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export const getRaceBySeasonAndRound = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year, round } = req.params;
    const race = await raceService.getRaceBySeasonAndRound(year, round);
    
    if (!race) {
      res.status(404).json({ error: `No race found for ${year} round ${round}` });
      return;
    }
    
    res.status(200).json(race);
  } catch (error) {
    console.error('Error in getRaceBySeasonAndRound controller:', error);
    res.status(500).json({ error: 'Failed to fetch race data' });
  }
};

/**
 * @swagger
 * /api/races/update/{year}:
 *   post:
 *     summary: Update race data for a season
 *     tags: [Races]
 *     description: Fetches and updates race data for a specific season from external API
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *         description: Season year to update
 *         example: "2024"
 *     responses:
 *       200:
 *         description: Successfully updated race data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully updated 24 races for 2024"
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export const updateRaceData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year } = req.params;
    const races = await raceService.updateRaceData(year);
    res.status(200).json({ message: `Successfully updated ${races.length} races for ${year}` });
  } catch (error) {
    console.error('Error in updateRaceData controller:', error);
    res.status(500).json({ error: 'Failed to update race data' });
  }
};

/**
 * @swagger
 * /api/races/season/{year}/round/{round}/laps:
 *   get:
 *     summary: Get lap timing data for a specific race
 *     tags: [Lap Data]
 *     description: Retrieves lap timing data for a specific race, including lap numbers and driver timings
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *         description: Season year
 *         example: "2024"
 *       - in: path
 *         name: round
 *         required: true
 *         schema:
 *           type: string
 *         description: Race round number
 *         example: "1"
 *     responses:
 *       200:
 *         description: Successfully retrieved lap data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 season:
 *                   type: string
 *                   example: "2024"
 *                 round:
 *                   type: string
 *                   example: "1"
 *                 laps:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LapData'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export const getLapData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year, round } = req.params;
    const lapData = await raceService.getLapData(year, round);
    
    res.status(200).json({
      season: year,
      round: round,
      laps: lapData || []
    });
  } catch (error) {
    console.error('Error in getLapData controller:', error);
    res.status(500).json({ error: 'Failed to fetch lap data' });
  }
};

/**
 * @swagger
 * /api/races/season/{year}/round/{round}/laps/update:
 *   post:
 *     summary: Update lap timing data for a specific race
 *     tags: [Lap Data]
 *     description: Fetches and updates lap timing data from external API for a specific race
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *         description: Season year
 *         example: "2024"
 *       - in: path
 *         name: round
 *         required: true
 *         schema:
 *           type: string
 *         description: Race round number
 *         example: "1"
 *     responses:
 *       200:
 *         description: Successfully updated lap data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully updated lap data for 2024 round 1"
 *                 season:
 *                   type: string
 *                   example: "2024"
 *                 round:
 *                   type: string
 *                   example: "1"
 *                 lapsCount:
 *                   type: number
 *                   example: 57
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export const updateLapData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year, round } = req.params;
    const lapData = await raceService.updateLapData(year, round);
    
    res.status(200).json({
      message: `Successfully updated lap data for ${year} round ${round}`,
      season: year,
      round: round,
      lapsCount: lapData.length
    });
  } catch (error) {
    console.error('Error in updateLapData controller:', error);
    res.status(500).json({ error: 'Failed to update lap data' });
  }
};

/**
 * @swagger
 * /api/races/season/{year}/round/{round}/laps/{lapNumber}:
 *   get:
 *     summary: Get lap timing data for a specific lap number
 *     tags: [Lap Data]
 *     description: Retrieves timing data for all drivers in a specific lap of a race
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *         description: Season year
 *         example: "2024"
 *       - in: path
 *         name: round
 *         required: true
 *         schema:
 *           type: string
 *         description: Race round number
 *         example: "1"
 *       - in: path
 *         name: lapNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Lap number
 *         example: "1"
 *     responses:
 *       200:
 *         description: Successfully retrieved lap data for specific lap
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 season:
 *                   type: string
 *                   example: "2024"
 *                 round:
 *                   type: string
 *                   example: "1"
 *                 lapNumber:
 *                   type: string
 *                   example: "1"
 *                 lap:
 *                   $ref: '#/components/schemas/LapData'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export const getLapDataByLapNumber = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year, round, lapNumber } = req.params;
    const lapData = await raceService.getLapDataByLapNumber(year, round, lapNumber);
    
    if (!lapData) {
      res.status(404).json({ error: `No data found for lap ${lapNumber} in ${year} round ${round}` });
      return;
    }
    
    res.status(200).json({
      season: year,
      round: round,
      lapNumber: lapNumber,
      lap: lapData
    });
  } catch (error) {
    console.error('Error in getLapDataByLapNumber controller:', error);
    res.status(500).json({ error: 'Failed to fetch lap data for specific lap' });
  }
};

/**
 * @swagger
 * /api/races/season/{year}/round/{round}/pitstops:
 *   get:
 *     summary: Get pit stop data for a specific race
 *     tags: [Pit Stops]
 *     description: Retrieves pit stop data for a specific race, including driver stops, lap numbers, and durations
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *         description: Season year
 *         example: "2024"
 *       - in: path
 *         name: round
 *         required: true
 *         schema:
 *           type: string
 *         description: Race round number
 *         example: "1"
 *     responses:
 *       200:
 *         description: Successfully retrieved pit stop data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 season:
 *                   type: string
 *                   example: "2024"
 *                 round:
 *                   type: string
 *                   example: "1"
 *                 pitStops:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PitStop'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export const getPitStopData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year, round } = req.params;
    const pitStopData = await raceService.getPitStopData(year, round);
    
    res.status(200).json({
      season: year,
      round: round,
      pitStops: pitStopData || []
    });
  } catch (error) {
    console.error('Error in getPitStopData controller:', error);
    res.status(500).json({ error: 'Failed to fetch pitstop data' });
  }
};

/**
 * @swagger
 * /api/races/season/{year}/round/{round}/pitstops/update:
 *   post:
 *     summary: Update pit stop data for a specific race
 *     tags: [Pit Stops]
 *     description: Fetches and updates pit stop data from external API for a specific race
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *         description: Season year
 *         example: "2024"
 *       - in: path
 *         name: round
 *         required: true
 *         schema:
 *           type: string
 *         description: Race round number
 *         example: "1"
 *     responses:
 *       200:
 *         description: Successfully updated pit stop data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully updated pitstop data for 2024 round 1"
 *                 season:
 *                   type: string
 *                   example: "2024"
 *                 round:
 *                   type: string
 *                   example: "1"
 *                 pitStopsCount:
 *                   type: number
 *                   example: 82
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export const updatePitStopData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year, round } = req.params;
    const pitStopData = await raceService.updatePitStopData(year, round);
    
    res.status(200).json({
      message: `Successfully updated pitstop data for ${year} round ${round}`,
      season: year,
      round: round,
      pitStopsCount: pitStopData.length
    });
  } catch (error) {
    console.error('Error in updatePitStopData controller:', error);
    res.status(500).json({ error: 'Failed to update pitstop data' });
  }
};

/**
 * @swagger
 * /api/races/season/{year}/round/{round}/pitstops/driver/{driverId}:
 *   get:
 *     summary: Get pit stop data for a specific driver in a race
 *     tags: [Pit Stops]
 *     description: Retrieves all pit stops made by a specific driver during a race
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *         description: Season year
 *         example: "2024"
 *       - in: path
 *         name: round
 *         required: true
 *         schema:
 *           type: string
 *         description: Race round number
 *         example: "1"
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver identifier
 *         example: "max_verstappen"
 *     responses:
 *       200:
 *         description: Successfully retrieved driver's pit stop data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 season:
 *                   type: string
 *                   example: "2024"
 *                 round:
 *                   type: string
 *                   example: "1"
 *                 driverId:
 *                   type: string
 *                   example: "max_verstappen"
 *                 pitStops:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PitStop'
 *                 pitStopsCount:
 *                   type: number
 *                   example: 3
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export const getPitStopDataByDriver = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year, round, driverId } = req.params;
    const pitStopData = await raceService.getPitStopDataByDriver(year, round, driverId);
    
    res.status(200).json({
      season: year,
      round: round,
      driverId: driverId,
      pitStops: pitStopData,
      pitStopsCount: pitStopData.length
    });
  } catch (error) {
    console.error('Error in getPitStopDataByDriver controller:', error);
    res.status(500).json({ error: 'Failed to fetch pitstop data for driver' });
  }
};

/**
 * @swagger
 * /api/races/seasons:
 *   get:
 *     summary: Get all Formula 1 seasons data
 *     tags: [Seasons]
 *     description: Retrieves all available F1 seasons from 2005 to present, sorted by year (descending)
 *     responses:
 *       200:
 *         description: Successfully retrieved seasons data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully fetched seasons data"
 *                 total:
 *                   type: number
 *                   example: 21
 *                 seasons:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Season'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export const getSeasonsData = async (req: Request, res: Response): Promise<void> => {
  try {
    const seasonsData = await raceService.getSeasonsData();
    
    res.status(200).json({
      message: 'Successfully fetched seasons data',
      total: seasonsData.length,
      seasons: seasonsData || []
    });
  } catch (error) {
    console.error('Error in getSeasonsData controller:', error);
    res.status(500).json({ error: 'Failed to fetch seasons data' });
  }
};

/**
 * @swagger
 * /api/races/seasons/update:
 *   post:
 *     summary: Update seasons data from external API
 *     tags: [Seasons]
 *     description: Fetches and updates F1 seasons data from external API (2005 to present)
 *     responses:
 *       200:
 *         description: Successfully updated seasons data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully updated seasons data"
 *                 total:
 *                   type: number
 *                   example: 21
 *                 seasons:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Season'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export const updateSeasonsData = async (req: Request, res: Response): Promise<void> => {
  try {
    const seasonsData = await raceService.updateSeasonsData();
    
    res.status(200).json({
      message: 'Successfully updated seasons data',
      total: seasonsData.length,
      seasons: seasonsData
    });
  } catch (error) {
    console.error('Error in updateSeasonsData controller:', error);
    res.status(500).json({ error: 'Failed to update seasons data' });
  }
};

/**
 * @swagger
 * /api/races/seasons/filter:
 *   get:
 *     summary: Get filtered seasons data with optional query parameters
 *     tags: [Seasons]
 *     description: Retrieves F1 seasons data with optional filtering by year range and limit
 *     parameters:
 *       - in: query
 *         name: startYear
 *         schema:
 *           type: integer
 *         description: Start year for filtering
 *         example: 2020
 *       - in: query
 *         name: endYear
 *         schema:
 *           type: integer
 *         description: End year for filtering
 *         example: 2024
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of seasons to return
 *         example: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered seasons data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully fetched filtered seasons data"
 *                 total:
 *                   type: number
 *                   example: 5
 *                 seasons:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Season'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
export const getFilteredSeasonsData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startYear, endYear, limit } = req.query;
    
    // Parse query parameters
    const parsedStartYear = startYear ? parseInt(startYear as string) : undefined;
    const parsedEndYear = endYear ? parseInt(endYear as string) : undefined;
    const parsedLimit = limit ? parseInt(limit as string) : undefined;
    
    const seasonsData = await raceService.getFilteredSeasonsData(
      parsedStartYear,
      parsedEndYear,
      parsedLimit
    );
    
    res.status(200).json({
      message: 'Successfully fetched filtered seasons data',
      total: seasonsData.length,
      seasons: seasonsData || []
    });
  } catch (error) {
    console.error('Error in getFilteredSeasonsData controller:', error);
    res.status(500).json({ error: 'Failed to fetch filtered seasons data' });
  }
}; 