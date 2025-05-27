import express from 'express';
import * as raceController from '../controllers/raceController.js';

const router = express.Router();

// Get all races for current season
router.get('/', raceController.getCurrentSeasonRaces);

// Get races by season
router.get('/season/:year', raceController.getRacesBySeason);

// Get race by season and round
router.get('/season/:year/round/:round', raceController.getRaceBySeasonAndRound);

// Update race data for a season
router.post('/update/:year', raceController.updateRaceData);

export default router; 