import { Request, Response } from 'express';
import * as raceService from '../services/raceService.js';
import { getCurrentYear } from '../config/constants.js';

/**
 * Get all races from database
 * @param req - Express request object
 * @param res - Express response object
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
 * Get races for current season
 * @param req - Express request object
 * @param res - Express response object
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
 * Get races by season
 * @param req - Express request object
 * @param res - Express response object
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
 * Get race by season and round
 * @param req - Express request object
 * @param res - Express response object
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
 * Update race data for a season
 * @param req - Express request object
 * @param res - Express response object
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
 * Get lap data for a specific race
 * @param req - Express request object
 * @param res - Express response object
 */
export const getLapData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year, round } = req.params;
    const lapData = await raceService.getLapData(year, round);
    
    if (!lapData || lapData.length === 0) {
      res.status(404).json({ error: `No lap data found for ${year} round ${round}` });
      return;
    }
    
    res.status(200).json({
      season: year,
      round: round,
      laps: lapData
    });
  } catch (error) {
    console.error('Error in getLapData controller:', error);
    res.status(500).json({ error: 'Failed to fetch lap data' });
  }
};

/**
 * Update lap data for a specific race
 * @param req - Express request object
 * @param res - Express response object
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
 * Get lap data for a specific lap number in a race
 * @param req - Express request object
 * @param res - Express response object
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
 * Get pitstop data for a specific race
 * @param req - Express request object
 * @param res - Express response object
 */
export const getPitStopData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year, round } = req.params;
    const pitStopData = await raceService.getPitStopData(year, round);
    
    if (!pitStopData || pitStopData.length === 0) {
      res.status(404).json({ error: `No pitstop data found for ${year} round ${round}` });
      return;
    }
    
    res.status(200).json({
      season: year,
      round: round,
      pitStops: pitStopData
    });
  } catch (error) {
    console.error('Error in getPitStopData controller:', error);
    res.status(500).json({ error: 'Failed to fetch pitstop data' });
  }
};

/**
 * Update pitstop data for a specific race
 * @param req - Express request object
 * @param res - Express response object
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
 * Get pitstop data for a specific driver in a race
 * @param req - Express request object
 * @param res - Express response object
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