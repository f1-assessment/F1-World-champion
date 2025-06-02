import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.test' });

let mongoServer: MongoMemoryServer;

export const setupTestEnvironment = async (): Promise<void> => {
  // Create an in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect mongoose to the in-memory database
  await mongoose.connect(mongoUri);
};

export const cleanupTestEnvironment = async (): Promise<void> => {
  // Close the database connection
  await mongoose.connection.close();
  
  // Stop the in-memory MongoDB instance
  if (mongoServer) {
    await mongoServer.stop();
  }
};

export const clearTestData = async (): Promise<void> => {
  // Clear all collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

// Global test utilities
export const testUtils = {
  // Helper function to clear specific collection
  clearCollection: async (collectionName: string) => {
    const collection = mongoose.connection.collections[collectionName];
    if (collection) {
      await collection.deleteMany({});
    }
  },
  
  // Helper function to get collection count
  getCollectionCount: async (collectionName: string): Promise<number> => {
    const collection = mongoose.connection.collections[collectionName];
    return collection ? await collection.countDocuments({}) : 0;
  },
  
  // Helper function to create test data
  createTestRace: (overrides: any = {}) => ({
    season: '2024',
    round: '1',
    url: 'https://en.wikipedia.org/wiki/2024_Bahrain_Grand_Prix',
    raceName: 'Bahrain Grand Prix',
    circuit: {
      circuitId: 'bahrain',
      circuitName: 'Bahrain International Circuit',
      url: 'http://www.formula1.com/en/racing/2024/Bahrain.html',
      location: {
        lat: '26.0325',
        long: '50.5106',
        locality: 'Sakhir',
        country: 'Bahrain'
      }
    },
    date: '2024-03-02',
    time: '15:00:00Z',
    results: [],
    laps: [],
    pitStops: [],
    ...overrides
  })
};

// Mock external API calls during testing
export const mockApiResponses = {
  seasonsData: {
    MRData: {
      xmlns: 'http://ergast.com/mrd/1.5',
      series: 'f1',
      url: 'http://ergast.com/api/f1/seasons',
      limit: '30',
      offset: '0',
      total: '75',
      SeasonTable: {
        Seasons: [
          { season: '2024', url: 'https://en.wikipedia.org/wiki/2024_Formula_One_season' },
          { season: '2023', url: 'https://en.wikipedia.org/wiki/2023_Formula_One_season' },
          { season: '2022', url: 'https://en.wikipedia.org/wiki/2022_Formula_One_season' }
        ]
      }
    }
  },
  
  lapData: {
    MRData: {
      xmlns: 'http://ergast.com/mrd/1.5',
      series: 'f1',
      url: 'http://ergast.com/api/f1/2024/1/laps',
      limit: '30',
      offset: '0',
      total: '1',
      RaceTable: {
        season: '2024',
        round: '1',
        Races: [{
          season: '2024',
          round: '1',
          url: 'https://en.wikipedia.org/wiki/2024_Bahrain_Grand_Prix',
          raceName: 'Bahrain Grand Prix',
          Laps: [
            {
              number: '1',
              Timings: [
                { driverId: 'verstappen', position: '1', time: '1:30.000' },
                { driverId: 'leclerc', position: '2', time: '1:30.500' }
              ]
            }
          ]
        }]
      }
    }
  },
  
  pitStopData: {
    MRData: {
      xmlns: 'http://ergast.com/mrd/1.5',
      series: 'f1',
      url: 'http://ergast.com/api/f1/2024/1/pitstops',
      limit: '30',
      offset: '0',
      total: '1',
      RaceTable: {
        season: '2024',
        round: '1',
        Races: [{
          season: '2024',
          round: '1',
          url: 'https://en.wikipedia.org/wiki/2024_Bahrain_Grand_Prix',
          raceName: 'Bahrain Grand Prix',
          PitStops: [
            {
              driverId: 'verstappen',
              lap: '15',
              stop: '1',
              time: '14:15:30',
              duration: '2.300'
            }
          ]
        }]
      }
    }
  }
}; 