// @ts-nocheck
// testDatabase.ts - Mock database setup for testing
import { jest } from '@jest/globals';

// Mock all database models at the module level
export const mockDatabase = {
  Driver: {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue([])
    }),
    countDocuments: jest.fn().mockResolvedValue(0),
    aggregate: jest.fn().mockResolvedValue([])
  },
  Constructor: {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue([])
    }),
    countDocuments: jest.fn().mockResolvedValue(0)
  },
  Championship: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([])
    })
  },
  Race: {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn().mockResolvedValue([]),
    countDocuments: jest.fn().mockResolvedValue(0),
    aggregate: jest.fn().mockResolvedValue([])
  }
};

// Clear all mocks between tests
export const clearMocks = () => {
  Object.values(mockDatabase).forEach(model => {
    Object.values(model).forEach(method => {
      if (jest.isMockFunction(method)) {
        method.mockClear();
      }
    });
  });
}; 