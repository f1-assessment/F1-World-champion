import express, { Router } from 'express';
import * as driverController from '../controllers/driverController.js';

const router: Router = express.Router();

// Get all drivers with optional year filtering
router.get('/', driverController.getAllDrivers);

// Get drivers by season year
router.get('/season/:year', driverController.getDriversBySeason);

// Get driver by ID
router.get('/:driverId', driverController.getDriverById);

export default router; 