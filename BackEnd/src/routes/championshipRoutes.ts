import express, { Router } from 'express';
import * as championshipController from '../controllers/championshipController.js';

const router: Router = express.Router();

// Get all championships
router.get('/', championshipController.getAllChampionships);

// Get championship by season (direct access)
router.get('/:year', championshipController.getChampionshipBySeason);

// Get championship by season (specific route expected by integration tests)
router.get('/season/:year', championshipController.getChampionshipBySeason);

// Update all championships (POST route)
router.post('/update', championshipController.updateAllChampionships);

// Update all championships (PUT route expected by integration tests)
router.put('/update-all', championshipController.updateAllChampionships);

export default router; 