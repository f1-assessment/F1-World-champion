import { Constructor } from '../models/index.js';
import { IConstructor } from '../types';

/**
 * Finds a constructor by their constructorId
 * @param constructorId - The constructor's unique identifier
 * @returns The constructor document
 */
const findByConstructorId = async (constructorId: string): Promise<IConstructor | null> => {
  return Constructor.findOne({ constructorId });
};

/**
 * Creates a new constructor
 * @param constructorData - The constructor data
 * @returns The created constructor document
 */
const create = async (constructorData: Partial<IConstructor>): Promise<IConstructor> => {
  return Constructor.create({
    constructorId: constructorData.constructorId,
    name: constructorData.name,
    nationality: constructorData.nationality,
    url: constructorData.url
  });
};

/**
 * Gets all constructors sorted by name
 * @returns Array of constructor documents
 */
const findAll = async (): Promise<IConstructor[]> => {
  return Constructor.find().sort({ name: 1 });
};

/**
 * Gets the count of constructors in the database
 * @returns The number of constructors
 */
const count = async (): Promise<number> => {
  return Constructor.countDocuments();
};

/**
 * Gets the most recently updated constructor
 * @returns The most recent constructor document
 */
const findMostRecent = async (): Promise<IConstructor | null> => {
  return Constructor.findOne().sort({ updatedAt: -1 });
};

export {
  findByConstructorId,
  create,
  findAll,
  count,
  findMostRecent
}; 