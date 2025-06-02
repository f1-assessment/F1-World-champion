import { Request, Response } from 'express';
import * as constructorService from '../services/constructorService.js';

/**
 * Get all constructors
 * @param req - Express request object
 * @param res - Express response object
 */
export const getAllConstructors = async (req: Request, res: Response): Promise<void> => {
  try {
    const constructors = await constructorService.getAllConstructors();
    res.status(200).json(constructors);
  } catch (error) {
    console.error('Error in getAllConstructors controller:', error);
    res.status(500).json({ error: 'Failed to fetch constructors' });
  }
};

/**
 * Get constructor by ID
 * @param req - Express request object
 * @param res - Express response object
 */
export const getConstructorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { constructorId } = req.params;
    const constructor = await constructorService.getConstructorById(constructorId);
    
    if (!constructor) {
      res.status(404).json({ error: 'Constructor not found' });
      return;
    }
    
    res.status(200).json(constructor);
  } catch (error) {
    console.error('Error in getConstructorById controller:', error);
    res.status(500).json({ error: 'Failed to fetch constructor' });
  }
}; 