import express, { Router } from 'express';
import * as raceController from '../controllers/raceController.js';

const router: Router = express.Router();

// Get all races from database
router.get('/all', raceController.getAllRaces);

// Get all races for current season (keep for backward compatibility)
router.get('/', raceController.getCurrentSeasonRaces);

// Get races by season
router.get('/season/:year', raceController.getRacesBySeason);

// Get race by season and round
router.get('/season/:year/round/:round', raceController.getRaceBySeasonAndRound);

// Get lap data for a specific race
router.get('/season/:year/round/:round/laps', raceController.getLapData);

// Get lap data for a specific lap number in a race
router.get('/season/:year/round/:round/laps/:lapNumber', raceController.getLapDataByLapNumber);

// Get pitstop data for a specific race
router.get('/season/:year/round/:round/pitstops', raceController.getPitStopData);

// Get pitstop data for a specific driver in a race
router.get('/season/:year/round/:round/pitstops/driver/:driverId', raceController.getPitStopDataByDriver);

// Update race data for a season
router.post('/update/:year', raceController.updateRaceData);

// Update lap data for a specific race
router.post('/season/:year/round/:round/laps/update', raceController.updateLapData);

// Update pitstop data for a specific race
router.post('/season/:year/round/:round/pitstops/update', raceController.updatePitStopData);

export default router; 