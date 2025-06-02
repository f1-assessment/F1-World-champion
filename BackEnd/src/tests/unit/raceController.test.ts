import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import * as raceController from '../../controllers/raceController.js';
import * as raceService from '../../services/raceService.js';

// Mock all dependencies
jest.mock('../../services/raceService.js');
jest.mock('../../config/constants.js', () => ({
  getCurrentYear: jest.fn().mockReturnValue(2024)
}));

const mockRaceService = raceService as jest.Mocked<typeof raceService>;

// Helper function to create mock Request and Response objects
const createMockRequest = (params: any = {}, query: any = {}): Partial<Request> => ({
  params,
  query,
});

const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res) as any;
  res.json = jest.fn().mockReturnValue(res) as any;
  return res;
};

// Mock data
const mockRaceData = {
  _id: '507f1f77bcf86cd799439011',
  season: '2024',
  round: '1',
  raceName: 'Bahrain Grand Prix',
  circuitId: 'bahrain',
  date: '2024-03-02',
  time: '15:00:00Z'
};

const mockRacesArray = [mockRaceData, { ...mockRaceData, round: '2', raceName: 'Saudi Arabian Grand Prix' }];

const mockLapData = [
  { driverId: 'verstappen', lapNumber: 1, time: '1:45.123' },
  { driverId: 'hamilton', lapNumber: 1, time: '1:45.456' }
];

const mockPitStopData = [
  { driverId: 'verstappen', stop: 1, lap: 10, time: '25.123' },
  { driverId: 'hamilton', stop: 1, lap: 12, time: '26.456' }
];

const mockSeasonsData = [
  { season: '2024', url: 'https://example.com/2024' },
  { season: '2023', url: 'https://example.com/2023' }
];

describe('Race Controller Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllRaces', () => {
    test('should return all races with status 200', async () => {
      mockRaceService.getAllRaces.mockResolvedValue(mockRacesArray as any);

      const req = createMockRequest();
      const res = createMockResponse();

      await raceController.getAllRaces(req as Request, res as Response);

      expect(mockRaceService.getAllRaces).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRacesArray);
    });

    test('should return empty array when no races exist', async () => {
      mockRaceService.getAllRaces.mockResolvedValue([]);

      const req = createMockRequest();
      const res = createMockResponse();

      await raceController.getAllRaces(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    test('should return error 500 when service throws error', async () => {
      mockRaceService.getAllRaces.mockRejectedValue(new Error('Database error'));

      const req = createMockRequest();
      const res = createMockResponse();

      await raceController.getAllRaces(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch all races' });
    });
  });

  describe('getCurrentSeasonRaces', () => {
    test('should return current season races with status 200', async () => {
      mockRaceService.getRacesBySeason.mockResolvedValue(mockRacesArray as any);

      const req = createMockRequest();
      const res = createMockResponse();

      await raceController.getCurrentSeasonRaces(req as Request, res as Response);

      expect(mockRaceService.getRacesBySeason).toHaveBeenCalledWith(2024);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRacesArray);
    });

    test('should return error 500 when service throws error', async () => {
      mockRaceService.getRacesBySeason.mockRejectedValue(new Error('Service error'));

      const req = createMockRequest();
      const res = createMockResponse();

      await raceController.getCurrentSeasonRaces(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch current season races' });
    });
  });

  describe('getRacesBySeason', () => {
    test('should return races for specified season', async () => {
      mockRaceService.getRacesBySeason.mockResolvedValue(mockRacesArray as any);

      const req = createMockRequest({ year: '2023' });
      const res = createMockResponse();

      await raceController.getRacesBySeason(req as Request, res as Response);

      expect(mockRaceService.getRacesBySeason).toHaveBeenCalledWith('2023');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRacesArray);
    });

    test('should return error 500 when service throws error', async () => {
      mockRaceService.getRacesBySeason.mockRejectedValue(new Error('Service error'));

      const req = createMockRequest({ year: '2023' });
      const res = createMockResponse();

      await raceController.getRacesBySeason(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch races' });
    });
  });

  describe('getRaceBySeasonAndRound', () => {
    test('should return race for valid season and round', async () => {
      mockRaceService.getRaceBySeasonAndRound.mockResolvedValue(mockRaceData as any);

      const req = createMockRequest({ year: '2024', round: '1' });
      const res = createMockResponse();

      await raceController.getRaceBySeasonAndRound(req as Request, res as Response);

      expect(mockRaceService.getRaceBySeasonAndRound).toHaveBeenCalledWith('2024', '1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRaceData);
    });

    test('should return 404 when race not found', async () => {
      mockRaceService.getRaceBySeasonAndRound.mockResolvedValue(null);

      const req = createMockRequest({ year: '2024', round: '99' });
      const res = createMockResponse();

      await raceController.getRaceBySeasonAndRound(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'No race found for 2024 round 99' });
    });

    test('should return error 500 when service throws error', async () => {
      mockRaceService.getRaceBySeasonAndRound.mockRejectedValue(new Error('Service error'));

      const req = createMockRequest({ year: '2024', round: '1' });
      const res = createMockResponse();

      await raceController.getRaceBySeasonAndRound(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch race data' });
    });
  });

  describe('updateRaceData', () => {
    test('should update race data successfully', async () => {
      mockRaceService.updateRaceData.mockResolvedValue(mockRacesArray as any);

      const req = createMockRequest({ year: '2024' });
      const res = createMockResponse();

      await raceController.updateRaceData(req as Request, res as Response);

      expect(mockRaceService.updateRaceData).toHaveBeenCalledWith('2024');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Successfully updated 2 races for 2024' });
    });

    test('should return error 500 when service throws error', async () => {
      mockRaceService.updateRaceData.mockRejectedValue(new Error('Update error'));

      const req = createMockRequest({ year: '2024' });
      const res = createMockResponse();

      await raceController.updateRaceData(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update race data' });
    });
  });

  describe('getLapData', () => {
    test('should return lap data for valid race', async () => {
      mockRaceService.getLapData.mockResolvedValue(mockLapData as any);

      const req = createMockRequest({ year: '2024', round: '1' });
      const res = createMockResponse();

      await raceController.getLapData(req as Request, res as Response);

      expect(mockRaceService.getLapData).toHaveBeenCalledWith('2024', '1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        season: '2024',
        round: '1',
        laps: mockLapData
      });
    });

    test('should return empty array when no lap data', async () => {
      mockRaceService.getLapData.mockResolvedValue([]);

      const req = createMockRequest({ year: '2024', round: '1' });
      const res = createMockResponse();

      await raceController.getLapData(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        season: '2024',
        round: '1',
        laps: []
      });
    });

    test('should return error 500 when service throws error', async () => {
      mockRaceService.getLapData.mockRejectedValue(new Error('Service error'));

      const req = createMockRequest({ year: '2024', round: '1' });
      const res = createMockResponse();

      await raceController.getLapData(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch lap data' });
    });
  });

  describe('getPitStopData', () => {
    test('should return pitstop data for valid race', async () => {
      mockRaceService.getPitStopData.mockResolvedValue(mockPitStopData as any);

      const req = createMockRequest({ year: '2024', round: '1' });
      const res = createMockResponse();

      await raceController.getPitStopData(req as Request, res as Response);

      expect(mockRaceService.getPitStopData).toHaveBeenCalledWith('2024', '1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        season: '2024',
        round: '1',
        pitStops: mockPitStopData
      });
    });

    test('should return empty array when no pitstop data', async () => {
      mockRaceService.getPitStopData.mockResolvedValue([]);

      const req = createMockRequest({ year: '2024', round: '1' });
      const res = createMockResponse();

      await raceController.getPitStopData(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        season: '2024',
        round: '1',
        pitStops: []
      });
    });

    test('should return error 500 when service throws error', async () => {
      mockRaceService.getPitStopData.mockRejectedValue(new Error('Service error'));

      const req = createMockRequest({ year: '2024', round: '1' });
      const res = createMockResponse();

      await raceController.getPitStopData(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch pitstop data' });
    });
  });

  describe('getSeasonsData', () => {
    test('should return seasons data with status 200', async () => {
      mockRaceService.getSeasonsData.mockResolvedValue(mockSeasonsData as any);

      const req = createMockRequest();
      const res = createMockResponse();

      await raceController.getSeasonsData(req as Request, res as Response);

      expect(mockRaceService.getSeasonsData).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Successfully fetched seasons data',
        total: mockSeasonsData.length,
        seasons: mockSeasonsData
      });
    });

    test('should return empty array when no seasons found', async () => {
      mockRaceService.getSeasonsData.mockResolvedValue([]);

      const req = createMockRequest();
      const res = createMockResponse();

      await raceController.getSeasonsData(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Successfully fetched seasons data',
        total: 0,
        seasons: []
      });
    });

    test('should return error 500 when service throws error', async () => {
      mockRaceService.getSeasonsData.mockRejectedValue(new Error('Service error'));

      const req = createMockRequest();
      const res = createMockResponse();

      await raceController.getSeasonsData(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch seasons data' });
    });
  });

  describe('getFilteredSeasonsData', () => {
    test('should return filtered seasons with query parameters', async () => {
      mockRaceService.getFilteredSeasonsData.mockResolvedValue(mockSeasonsData as any);

      const req = createMockRequest({}, { startYear: '2020', endYear: '2024', limit: '10' });
      const res = createMockResponse();

      await raceController.getFilteredSeasonsData(req as Request, res as Response);

      expect(mockRaceService.getFilteredSeasonsData).toHaveBeenCalledWith(2020, 2024, 10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Successfully fetched filtered seasons data',
        total: mockSeasonsData.length,
        seasons: mockSeasonsData
      });
    });

    test('should handle missing query parameters gracefully', async () => {
      mockRaceService.getFilteredSeasonsData.mockResolvedValue(mockSeasonsData as any);

      const req = createMockRequest({}, {}); // No query parameters
      const res = createMockResponse();

      await raceController.getFilteredSeasonsData(req as Request, res as Response);

      expect(mockRaceService.getFilteredSeasonsData).toHaveBeenCalledWith(undefined, undefined, undefined);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Successfully fetched filtered seasons data',
        total: mockSeasonsData.length,
        seasons: mockSeasonsData
      });
    });

    test('should return empty array when no filtered data found', async () => {
      mockRaceService.getFilteredSeasonsData.mockResolvedValue([]);

      const req = createMockRequest({}, { startYear: '2030' });
      const res = createMockResponse();

      await raceController.getFilteredSeasonsData(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Successfully fetched filtered seasons data',
        total: 0,
        seasons: []
      });
    });

    test('should handle service errors', async () => {
      mockRaceService.getFilteredSeasonsData.mockRejectedValue(new Error('Service error'));

      const req = createMockRequest({}, { startYear: '2020' });
      const res = createMockResponse();

      await raceController.getFilteredSeasonsData(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch filtered seasons data' });
    });

    test('should handle invalid query parameters', async () => {
      mockRaceService.getFilteredSeasonsData.mockResolvedValue(mockSeasonsData as any);

      const req = createMockRequest({}, { startYear: 'invalid', endYear: 'also-invalid', limit: 'not-a-number' });
      const res = createMockResponse();

      await raceController.getFilteredSeasonsData(req as Request, res as Response);

      // The controller passes NaN values to the service when parseInt fails
      expect(mockRaceService.getFilteredSeasonsData).toHaveBeenCalledWith(NaN, NaN, NaN);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('updateLapData', () => {
    test('should update lap data successfully', async () => {
      mockRaceService.updateLapData.mockResolvedValue(mockLapData as any);

      const req = createMockRequest({ year: '2024', round: '1' });
      const res = createMockResponse();

      await raceController.updateLapData(req as Request, res as Response);

      expect(mockRaceService.updateLapData).toHaveBeenCalledWith('2024', '1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Successfully updated lap data for 2024 round 1',
        season: '2024',
        round: '1',
        lapsCount: 2
      });
    });

    test('should return error 500 when service throws error', async () => {
      mockRaceService.updateLapData.mockRejectedValue(new Error('Update error'));

      const req = createMockRequest({ year: '2024', round: '1' });
      const res = createMockResponse();

      await raceController.updateLapData(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update lap data' });
    });
  });

  describe('updatePitStopData', () => {
    test('should update pitstop data successfully', async () => {
      mockRaceService.updatePitStopData.mockResolvedValue(mockPitStopData as any);

      const req = createMockRequest({ year: '2024', round: '1' });
      const res = createMockResponse();

      await raceController.updatePitStopData(req as Request, res as Response);

      expect(mockRaceService.updatePitStopData).toHaveBeenCalledWith('2024', '1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Successfully updated pitstop data for 2024 round 1',
        season: '2024',
        round: '1',
        pitStopsCount: 2
      });
    });

    test('should return error 500 when service throws error', async () => {
      mockRaceService.updatePitStopData.mockRejectedValue(new Error('Update error'));

      const req = createMockRequest({ year: '2024', round: '1' });
      const res = createMockResponse();

      await raceController.updatePitStopData(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update pitstop data' });
    });
  });

  describe('getLapDataByLapNumber', () => {
    test('should return lap data for specific lap number', async () => {
      const specificLapData = { lapNumber: 5, timings: mockLapData };
      mockRaceService.getLapDataByLapNumber.mockResolvedValue(specificLapData as any);

      const req = createMockRequest({ year: '2024', round: '1', lapNumber: '5' });
      const res = createMockResponse();

      await raceController.getLapDataByLapNumber(req as Request, res as Response);

      expect(mockRaceService.getLapDataByLapNumber).toHaveBeenCalledWith('2024', '1', '5');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        season: '2024',
        round: '1',
        lapNumber: '5',
        lap: specificLapData
      });
    });

    test('should return 404 when lap data not found', async () => {
      mockRaceService.getLapDataByLapNumber.mockResolvedValue(null);

      const req = createMockRequest({ year: '2024', round: '1', lapNumber: '99' });
      const res = createMockResponse();

      await raceController.getLapDataByLapNumber(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'No data found for lap 99 in 2024 round 1' });
    });
  });

  describe('getPitStopDataByDriver', () => {
    test('should return pitstop data for specific driver', async () => {
      const driverPitStops = [mockPitStopData[0]];
      mockRaceService.getPitStopDataByDriver.mockResolvedValue(driverPitStops as any);

      const req = createMockRequest({ year: '2024', round: '1', driverId: 'verstappen' });
      const res = createMockResponse();

      await raceController.getPitStopDataByDriver(req as Request, res as Response);

      expect(mockRaceService.getPitStopDataByDriver).toHaveBeenCalledWith('2024', '1', 'verstappen');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        season: '2024',
        round: '1',
        driverId: 'verstappen',
        pitStops: driverPitStops,
        pitStopsCount: 1
      });
    });

    test('should return error 500 when service throws error', async () => {
      mockRaceService.getPitStopDataByDriver.mockRejectedValue(new Error('Service error'));

      const req = createMockRequest({ year: '2024', round: '1', driverId: 'verstappen' });
      const res = createMockResponse();

      await raceController.getPitStopDataByDriver(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch pitstop data for driver' });
    });
  });

  describe('updateSeasonsData', () => {
    test('should update seasons data successfully', async () => {
      mockRaceService.updateSeasonsData.mockResolvedValue(mockSeasonsData as any);

      const req = createMockRequest();
      const res = createMockResponse();

      await raceController.updateSeasonsData(req as Request, res as Response);

      expect(mockRaceService.updateSeasonsData).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Successfully updated seasons data',
        total: 2,
        seasons: mockSeasonsData
      });
    });

    test('should return error 500 when service throws error', async () => {
      mockRaceService.updateSeasonsData.mockRejectedValue(new Error('Update error'));

      const req = createMockRequest();
      const res = createMockResponse();

      await raceController.updateSeasonsData(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update seasons data' });
    });
  });
}); 