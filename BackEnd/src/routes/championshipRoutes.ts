import express, { Router } from 'express';
import * as championshipController from '../controllers/championshipController.js';

const router: Router = express.Router();

// Get all championships
router.get('/', championshipController.getAllChampionships);

// Get championship by season
router.get('/:year', championshipController.getChampionshipBySeason);

// Update all championships
router.post('/update', championshipController.updateAllChampionships);

export default router; 