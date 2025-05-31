import express from 'express';
import * as raceController from '../controllers/raceController.js';
const router = express.Router();
router.get('/all', raceController.getAllRaces);
router.get('/', raceController.getCurrentSeasonRaces);
router.get('/season/:year', raceController.getRacesBySeason);
router.get('/season/:year/round/:round', raceController.getRaceBySeasonAndRound);
router.get('/season/:year/round/:round/laps', raceController.getLapData);
router.get('/season/:year/round/:round/laps/:lapNumber', raceController.getLapDataByLapNumber);
router.post('/update/:year', raceController.updateRaceData);
router.post('/season/:year/round/:round/laps/update', raceController.updateLapData);
export default router;
//# sourceMappingURL=raceRoutes.js.map