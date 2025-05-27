import * as championshipService from '../services/championshipService.js';

/**
 * Get all championships
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllChampionships = async (req, res) => {
  try {
    const championships = await championshipService.getAllChampionships();
    res.status(200).json(championships);
  } catch (error) {
    console.error('Error in getAllChampionships controller:', error);
    res.status(500).json({ error: 'Failed to fetch championships' });
  }
};

/**
 * Get championship by season
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getChampionshipBySeason = async (req, res) => {
  try {
    const { year } = req.params;
    const championship = await championshipService.getChampionshipBySeason(parseInt(year));
    
    if (!championship) {
      return res.status(404).json({ error: `No championship data found for ${year}` });
    }
    
    res.status(200).json(championship);
  } catch (error) {
    console.error('Error in getChampionshipBySeason controller:', error);
    res.status(500).json({ error: 'Failed to fetch championship data' });
  }
};

/**
 * Update all championships
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateAllChampionships = async (req, res) => {
  try {
    const updatedCount = await championshipService.updateAllChampionships();
    res.status(200).json({ message: `Successfully updated ${updatedCount} championships` });
  } catch (error) {
    console.error('Error in updateAllChampionships controller:', error);
    res.status(500).json({ error: 'Failed to update championships' });
  }
}; 