import { Constructor } from '../models/index.js';

/**
 * Finds a constructor by their constructorId
 * @param {string} constructorId - The constructor's unique identifier
 * @returns {Promise<Object>} - The constructor document
 */
const findByConstructorId = async (constructorId) => {
  return Constructor.findOne({ constructorId });
};

/**
 * Creates a new constructor
 * @param {Object} constructorData - The constructor data
 * @returns {Promise<Object>} - The created constructor document
 */
const create = async (constructorData) => {
  return Constructor.create({
    constructorId: constructorData.constructorId,
    name: constructorData.name,
    nationality: constructorData.nationality,
    url: constructorData.url
  });
};

/**
 * Gets all constructors sorted by name
 * @returns {Promise<Array>} - Array of constructor documents
 */
const findAll = async () => {
  return Constructor.find().sort({ name: 1 });
};

/**
 * Gets the count of constructors in the database
 * @returns {Promise<number>} - The number of constructors
 */
const count = async () => {
  return Constructor.countDocuments();
};

/**
 * Gets the most recently updated constructor
 * @returns {Promise<Object>} - The most recent constructor document
 */
const findMostRecent = async () => {
  return Constructor.findOne().sort({ updatedAt: -1 });
};

export {
  findByConstructorId,
  create,
  findAll,
  count,
  findMostRecent
}; 