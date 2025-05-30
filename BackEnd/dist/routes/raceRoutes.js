import express from 'express';
import * as raceController from '../controllers/raceController.js';
const router = express.Router();
router.get('/all', raceController.getAllRaces);
router.get('/', raceController.getCurrentSeasonRaces);
router.get('/season/:year', raceController.getRacesBySeason);
router.get('/season/:year/round/:round', raceController.getRaceBySeasonAndRound);
router.post('/update/:year', raceController.updateRaceData);
export default router;
//# sourceMappingURL=raceRoutes.js.map