import { jest } from '@jest/globals';

/**
 * Create a properly typed mock for Jest
 * This utility helps avoid 'as any' usage in tests
 */
export function createMockModel<T extends object>(): jest.Mocked<T> {
  return {
    findOne: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findOneAndUpdate: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
    updateMany: jest.fn(),
    deleteOne: jest.fn(),
    deleteMany: jest.fn(),
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
    // Add custom methods for our models
    findBySeason: jest.fn(),
    findBySeasonAndRound: jest.fn(),
  } as unknown as jest.Mocked<T>;
}

/**
 * Create a mock query object for Mongoose queries
 */
export function createMockQuery<T extends object>() {
  return {
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    populate: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
  };
}

/**
 * Helper to create repository function mocks
 */
export function createRepositoryMock() {
  return {
    findByDriverId: jest.fn(),
    findByConstructorId: jest.fn(),
    findBySeason: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
    findActiveDrivers: jest.fn(),
    findDriversByYearRange: jest.fn(),
    findDriversBySeason: jest.fn(),
    createOrUpdate: jest.fn(),
    findBySeasonRange: jest.fn(),
  };
} 