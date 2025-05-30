import express, { Request, Response, Router } from 'express';
import driverRoutes from './driverRoutes.js';
import constructorRoutes from './constructorRoutes.js';
import championshipRoutes from './championshipRoutes.js';
import raceRoutes from './raceRoutes.js';

const router: Router = express.Router();

// API routes
router.use('/drivers', driverRoutes);
router.use('/constructors', constructorRoutes);
router.use('/championships', championshipRoutes);
router.use('/races', raceRoutes);

// API health check
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'F1 World Champion API is running' });
});

export default router; 