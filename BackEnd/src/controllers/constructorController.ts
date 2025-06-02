import { Request, Response } from 'express';
import * as constructorService from '../services/constructorService.js';

/**
 * @swagger
 * /api/constructors:
 *   get:
 *     summary: Get all Formula 1 constructors/teams
 *     tags: [Constructors]
 *     description: Retrieves all F1 constructors (teams) from the database
 *     responses:
 *       200:
 *         description: Successfully retrieved all constructors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Constructor'
 *       500:
 *         $ref: '#/components/responses/InternalError'
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
 * @swagger
 * /api/constructors/{constructorId}:
 *   get:
 *     summary: Get constructor by ID
 *     tags: [Constructors]
 *     description: Retrieves detailed information for a specific F1 constructor/team
 *     parameters:
 *       - in: path
 *         name: constructorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Constructor identifier
 *         example: "red_bull"
 *     responses:
 *       200:
 *         description: Successfully retrieved constructor information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Constructor'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
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