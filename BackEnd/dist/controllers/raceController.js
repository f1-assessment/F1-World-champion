import * as raceService from '../services/raceService.js';
import { getCurrentYear } from '../config/constants.js';
export const getAllRaces = async (req, res) => {
    try {
        const races = await raceService.getAllRaces();
        res.status(200).json(races);
    }
    catch (error) {
        console.error('Error in getAllRaces controller:', error);
        res.status(500).json({ error: 'Failed to fetch all races' });
    }
};
export const getCurrentSeasonRaces = async (req, res) => {
    try {
        const currentYear = getCurrentYear();
        const races = await raceService.getRacesBySeason(currentYear);
        res.status(200).json(races);
    }
    catch (error) {
        console.error('Error in getCurrentSeasonRaces controller:', error);
        res.status(500).json({ error: 'Failed to fetch current season races' });
    }
};
export const getRacesBySeason = async (req, res) => {
    try {
        const { year } = req.params;
        const races = await raceService.getRacesBySeason(year);
        res.status(200).json(races);
    }
    catch (error) {
        console.error('Error in getRacesBySeason controller:', error);
        res.status(500).json({ error: 'Failed to fetch races' });
    }
};
export const getRaceBySeasonAndRound = async (req, res) => {
    try {
        const { year, round } = req.params;
        const race = await raceService.getRaceBySeasonAndRound(year, round);
        if (!race) {
            res.status(404).json({ error: `No race found for ${year} round ${round}` });
            return;
        }
        res.status(200).json(race);
    }
    catch (error) {
        console.error('Error in getRaceBySeasonAndRound controller:', error);
        res.status(500).json({ error: 'Failed to fetch race data' });
    }
};
export const updateRaceData = async (req, res) => {
    try {
        const { year } = req.params;
        const races = await raceService.updateRaceData(year);
        res.status(200).json({ message: `Successfully updated ${races.length} races for ${year}` });
    }
    catch (error) {
        console.error('Error in updateRaceData controller:', error);
        res.status(500).json({ error: 'Failed to update race data' });
    }
};
export const getLapData = async (req, res) => {
    try {
        const { year, round } = req.params;
        const lapData = await raceService.getLapData(year, round);
        res.status(200).json({
            season: year,
            round: round,
            laps: lapData || []
        });
    }
    catch (error) {
        console.error('Error in getLapData controller:', error);
        res.status(500).json({ error: 'Failed to fetch lap data' });
    }
};
export const updateLapData = async (req, res) => {
    try {
        const { year, round } = req.params;
        const lapData = await raceService.updateLapData(year, round);
        res.status(200).json({
            message: `Successfully updated lap data for ${year} round ${round}`,
            season: year,
            round: round,
            lapsCount: lapData.length
        });
    }
    catch (error) {
        console.error('Error in updateLapData controller:', error);
        res.status(500).json({ error: 'Failed to update lap data' });
    }
};
export const getLapDataByLapNumber = async (req, res) => {
    try {
        const { year, round, lapNumber } = req.params;
        const lapData = await raceService.getLapDataByLapNumber(year, round, lapNumber);
        if (!lapData) {
            res.status(404).json({ error: `No data found for lap ${lapNumber} in ${year} round ${round}` });
            return;
        }
        res.status(200).json({
            season: year,
            round: round,
            lapNumber: lapNumber,
            lap: lapData
        });
    }
    catch (error) {
        console.error('Error in getLapDataByLapNumber controller:', error);
        res.status(500).json({ error: 'Failed to fetch lap data for specific lap' });
    }
};
export const getPitStopData = async (req, res) => {
    try {
        const { year, round } = req.params;
        const pitStopData = await raceService.getPitStopData(year, round);
        res.status(200).json({
            season: year,
            round: round,
            pitStops: pitStopData || []
        });
    }
    catch (error) {
        console.error('Error in getPitStopData controller:', error);
        res.status(500).json({ error: 'Failed to fetch pitstop data' });
    }
};
export const updatePitStopData = async (req, res) => {
    try {
        const { year, round } = req.params;
        const pitStopData = await raceService.updatePitStopData(year, round);
        res.status(200).json({
            message: `Successfully updated pitstop data for ${year} round ${round}`,
            season: year,
            round: round,
            pitStopsCount: pitStopData.length
        });
    }
    catch (error) {
        console.error('Error in updatePitStopData controller:', error);
        res.status(500).json({ error: 'Failed to update pitstop data' });
    }
};
export const getPitStopDataByDriver = async (req, res) => {
    try {
        const { year, round, driverId } = req.params;
        const pitStopData = await raceService.getPitStopDataByDriver(year, round, driverId);
        res.status(200).json({
            season: year,
            round: round,
            driverId: driverId,
            pitStops: pitStopData,
            pitStopsCount: pitStopData.length
        });
    }
    catch (error) {
        console.error('Error in getPitStopDataByDriver controller:', error);
        res.status(500).json({ error: 'Failed to fetch pitstop data for driver' });
    }
};
export const getSeasonsData = async (req, res) => {
    try {
        const seasonsData = await raceService.getSeasonsData();
        res.status(200).json({
            message: 'Successfully fetched seasons data',
            total: seasonsData.length,
            seasons: seasonsData || []
        });
    }
    catch (error) {
        console.error('Error in getSeasonsData controller:', error);
        res.status(500).json({ error: 'Failed to fetch seasons data' });
    }
};
export const updateSeasonsData = async (req, res) => {
    try {
        const seasonsData = await raceService.updateSeasonsData();
        res.status(200).json({
            message: 'Successfully updated seasons data',
            total: seasonsData.length,
            seasons: seasonsData
        });
    }
    catch (error) {
        console.error('Error in updateSeasonsData controller:', error);
        res.status(500).json({ error: 'Failed to update seasons data' });
    }
};
export const getFilteredSeasonsData = async (req, res) => {
    try {
        const { startYear, endYear, limit } = req.query;
        const parsedStartYear = startYear ? parseInt(startYear) : undefined;
        const parsedEndYear = endYear ? parseInt(endYear) : undefined;
        const parsedLimit = limit ? parseInt(limit) : undefined;
        const seasonsData = await raceService.getFilteredSeasonsData(parsedStartYear, parsedEndYear, parsedLimit);
        res.status(200).json({
            message: 'Successfully fetched filtered seasons data',
            total: seasonsData.length,
            seasons: seasonsData || []
        });
    }
    catch (error) {
        console.error('Error in getFilteredSeasonsData controller:', error);
        res.status(500).json({ error: 'Failed to fetch filtered seasons data' });
    }
};
//# sourceMappingURL=raceController.js.map