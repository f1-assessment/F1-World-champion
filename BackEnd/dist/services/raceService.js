import Race from '../models/Race.js';
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
//# sourceMappingURL=raceService.js.map