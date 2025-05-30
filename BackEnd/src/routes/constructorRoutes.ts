import express, { Router } from 'express';
import * as constructorController from '../controllers/constructorController.js';

const router: Router = express.Router();

// Get all constructors
router.get('/', constructorController.getAllConstructors);

// Get constructor by ID
router.get('/:constructorId', constructorController.getConstructorById);

export default router; 