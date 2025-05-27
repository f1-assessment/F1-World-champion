import * as constructorService from '../services/constructorService.js';

/**
 * Get all constructors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllConstructors = async (req, res) => {
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
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getConstructorById = async (req, res) => {
  try {
    const { constructorId } = req.params;
    const constructor = await constructorService.findOrCreateConstructor({ constructorId });
    
    if (!constructor) {
      return res.status(404).json({ error: 'Constructor not found' });
    }
    
    res.status(200).json(constructor);
  } catch (error) {
    console.error('Error in getConstructorById controller:', error);
    res.status(500).json({ error: 'Failed to fetch constructor' });
  }
}; 