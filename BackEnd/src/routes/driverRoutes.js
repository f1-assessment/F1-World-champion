import express from 'express';
import * as driverController from '../controllers/driverController.js';

const router = express.Router();

// Get all drivers
router.get('/', driverController.getAllDrivers);

// Get driver by ID
router.get('/:driverId', driverController.getDriverById);

export default router; 