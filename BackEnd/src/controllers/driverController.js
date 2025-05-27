import * as driverService from '../services/driverService.js';

/**
 * Get all drivers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await driverService.getAllDrivers();
    res.status(200).json(drivers);
  } catch (error) {
    console.error('Error in getAllDrivers controller:', error);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
};

/**
 * Get driver by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getDriverById = async (req, res) => {
  try {
    const { driverId } = req.params;
    const driver = await driverService.findOrCreateDriver({ driverId });
    
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    res.status(200).json(driver);
  } catch (error) {
    console.error('Error in getDriverById controller:', error);
    res.status(500).json({ error: 'Failed to fetch driver' });
  }
}; 