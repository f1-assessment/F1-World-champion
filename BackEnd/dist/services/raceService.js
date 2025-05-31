import Race from '../models/Race.js';
import axios from 'axios';
export const getAllRaces = async () => {
    try {
        const races = await Race.find({}).sort({ season: -1, round: 1 });
        return races;
    }
    catch (error) {
        console.error('Error fetching all races:', error);
        throw new Error('Failed to fetch races from database');
    }
};
export const getRacesBySeason = async (year) => {
    try {
        const seasonYear = typeof year === 'string' ? year : year.toString();
        const races = await Race.findBySeason(seasonYear);
        return races;
    }
    catch (error) {
        console.error(`Error fetching races for season ${year}:`, error);
        throw new Error(`Failed to fetch races for season ${year}`);
    }
};
export const getRaceBySeasonAndRound = async (year, round) => {
    try {
        const race = await Race.findBySeasonAndRound(year, round);
        return race;
    }
    catch (error) {
        console.error(`Error fetching race for season ${year}, round ${round}:`, error);
        throw new Error(`Failed to fetch race for season ${year}, round ${round}`);
    }
};
export const updateRaceData = async (year) => {
    console.log(`Update race data for ${year} - Not yet implemented`);
    return [];
};
export const fetchLapDataFromAPI = async (year, round) => {
    try {
        const url = `https://api.jolpi.ca/ergast/f1/${year}/${round}/laps`;
        const response = await axios.get(url);
        if (response.data?.MRData?.RaceTable?.Races?.[0]?.Laps) {
            return response.data.MRData.RaceTable.Races[0].Laps;
        }
        return null;
    }
    catch (error) {
        console.error(`Error fetching lap data for season ${year}, round ${round}:`, error);
        throw new Error(`Failed to fetch lap data for season ${year}, round ${round}`);
    }
};
export const getLapData = async (year, round) => {
    try {
        const race = await Race.findBySeasonAndRound(year, round);
        if (race && race.laps && race.laps.length > 0) {
            return race.laps;
        }
        const lapData = await fetchLapDataFromAPI(year, round);
        if (lapData && race) {
            race.laps = lapData;
            await race.save();
            return lapData;
        }
        return lapData || [];
    }
    catch (error) {
        console.error(`Error getting lap data for season ${year}, round ${round}:`, error);
        throw new Error(`Failed to get lap data for season ${year}, round ${round}`);
    }
};
export const updateLapData = async (year, round) => {
    try {
        const lapData = await fetchLapDataFromAPI(year, round);
        if (!lapData) {
            throw new Error(`No lap data found for season ${year}, round ${round}`);
        }
        const race = await Race.findBySeasonAndRound(year, round);
        if (!race) {
            throw new Error(`No race found for season ${year}, round ${round}`);
        }
        race.laps = lapData;
        await race.save();
        return lapData;
    }
    catch (error) {
        console.error(`Error updating lap data for season ${year}, round ${round}:`, error);
        throw new Error(`Failed to update lap data for season ${year}, round ${round}`);
    }
};
export const getLapDataByLapNumber = async (year, round, lapNumber) => {
    try {
        const lapData = await getLapData(year, round);
        if (!lapData || lapData.length === 0) {
            return null;
        }
        const specificLap = lapData.find(lap => lap.number === lapNumber);
        return specificLap || null;
    }
    catch (error) {
        console.error(`Error getting lap ${lapNumber} data for season ${year}, round ${round}:`, error);
        throw new Error(`Failed to get lap ${lapNumber} data for season ${year}, round ${round}`);
    }
};
//# sourceMappingURL=raceService.js.map