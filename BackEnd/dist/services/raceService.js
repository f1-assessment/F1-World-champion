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
    try {
        console.log(`Fetching race data for season ${year} from external API...`);
        const url = `https://api.jolpi.ca/ergast/f1/${year}.json`;
        const response = await axios.get(url);
        if (!response.data?.MRData?.RaceTable?.Races) {
            console.log(`No race data found for season ${year}`);
            return [];
        }
        const races = response.data.MRData.RaceTable.Races;
        const updatedRaces = [];
        const BATCH_SIZE = 3;
        const BATCH_DELAY = 500;
        for (let i = 0; i < races.length; i += BATCH_SIZE) {
            const batch = races.slice(i, i + BATCH_SIZE);
            console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(races.length / BATCH_SIZE)} (${batch.length} races)`);
            const batchPromises = batch.map(async (raceData) => {
                try {
                    let race = await Race.findBySeasonAndRound(year, raceData.round);
                    if (!race) {
                        race = new Race({
                            season: year,
                            round: raceData.round,
                            raceName: raceData.raceName,
                            circuit: raceData.Circuit,
                            date: raceData.date,
                            time: raceData.time,
                            url: raceData.url
                        });
                    }
                    else {
                        race.raceName = raceData.raceName;
                        race.circuit = raceData.Circuit;
                        race.date = raceData.date;
                        race.time = raceData.time;
                        race.url = raceData.url;
                    }
                    const resultsUrl = `https://api.jolpi.ca/ergast/f1/${year}/${raceData.round}/results.json`;
                    try {
                        const resultsResponse = await axios.get(resultsUrl);
                        if (resultsResponse.data?.MRData?.RaceTable?.Races?.[0]?.Results) {
                            race.results = resultsResponse.data.MRData.RaceTable.Races[0].Results;
                        }
                    }
                    catch (resultsError) {
                        console.log(`No results found for ${year} round ${raceData.round}`);
                    }
                    await race.save();
                    console.log(`✅ Updated: ${year} Round ${raceData.round} - ${raceData.raceName}`);
                    return race;
                }
                catch (raceError) {
                    console.error(`❌ Error updating race ${year} round ${raceData.round}:`, raceError);
                    return null;
                }
            });
            const batchResults = await Promise.allSettled(batchPromises);
            batchResults.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    updatedRaces.push(result.value);
                }
                else if (result.status === 'rejected') {
                    console.error(`Batch item ${index} failed:`, result.reason);
                }
            });
            if (i + BATCH_SIZE < races.length) {
                console.log(`⏳ Waiting ${BATCH_DELAY}ms before next batch...`);
                await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
            }
        }
        console.log(`🏁 Successfully updated ${updatedRaces.length}/${races.length} races for season ${year}`);
        return updatedRaces;
    }
    catch (error) {
        console.error(`Error updating race data for season ${year}:`, error);
        return [];
    }
};
export const fetchLapDataFromAPI = async (year, round) => {
    try {
        const allLaps = [];
        let offset = 0;
        const limit = 30;
        let totalFetched = 0;
        let total = 0;
        let consecutiveEmptyResponses = 0;
        let hasInitialResponse = false;
        do {
            const url = `https://api.jolpi.ca/ergast/f1/${year}/${round}/laps?offset=${offset}&limit=${limit}`;
            console.log(`Fetching lap data from: ${url}`);
            try {
                const response = await axios.get(url);
                if (response.data?.MRData?.RaceTable?.Races?.[0]?.Laps) {
                    const laps = response.data.MRData.RaceTable.Races[0].Laps;
                    allLaps.push(...laps);
                    if (!hasInitialResponse) {
                        hasInitialResponse = true;
                        total = parseInt(response.data.MRData.total || '0');
                        console.log(`Total lap records available: ${total}`);
                        if (total === 0) {
                            console.log(`No lap data available for ${year} round ${round} (total=0)`);
                            break;
                        }
                    }
                    totalFetched = allLaps.length;
                    offset += limit;
                    consecutiveEmptyResponses = 0;
                    console.log(`Fetched ${laps.length} laps, total so far: ${totalFetched}/${total}`);
                    if (totalFetched < total) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }
                else {
                    if (!hasInitialResponse) {
                        hasInitialResponse = true;
                        total = parseInt(response.data?.MRData?.total || '0');
                        console.log(`No lap data found for ${year} round ${round}, total=${total}`);
                        if (total === 0) {
                            break;
                        }
                    }
                    consecutiveEmptyResponses++;
                    console.log(`Empty response ${consecutiveEmptyResponses}/3 for ${year} round ${round}`);
                    if (consecutiveEmptyResponses >= 3) {
                        console.log(`Stopping after ${consecutiveEmptyResponses} consecutive empty responses`);
                        break;
                    }
                    offset += limit;
                }
            }
            catch (axiosError) {
                if (axios.isAxiosError(axiosError)) {
                    if (axiosError.response?.status === 429) {
                        console.log(`Rate limited. Waiting 2 seconds before continuing...`);
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        continue;
                    }
                    else if (axiosError.response?.status === 404) {
                        console.log(`No more data available (404) at offset ${offset}`);
                        break;
                    }
                }
                throw axiosError;
            }
            if (offset > 10000) {
                console.log(`Safety break: offset exceeded 10000, stopping lap data fetch for ${year} round ${round}`);
                break;
            }
        } while (totalFetched < total && total > 0 && consecutiveEmptyResponses < 3 && hasInitialResponse);
        console.log(`Completed fetching lap data for ${year} round ${round}: ${allLaps.length} total laps`);
        return allLaps;
    }
    catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.log(`No lap data available for season ${year}, round ${round} (404)`);
            return [];
        }
        console.error(`Error fetching lap data for season ${year}, round ${round}:`, error);
        return [];
    }
};
export const getLapData = async (year, round) => {
    try {
        const race = await Race.findBySeasonAndRound(year, round);
        if (race && race.laps && race.laps.length > 0) {
            console.log(`Found ${race.laps.length} laps in database for ${year} round ${round}`);
            return race.laps;
        }
        console.log(`No lap data in database for ${year} round ${round}, fetching from API...`);
        const lapData = await fetchLapDataFromAPI(year, round);
        console.log(`Fetched ${lapData.length} laps from external API`);
        if (lapData.length > 0 && race) {
            race.laps = lapData;
            await race.save();
            console.log(`Saved ${lapData.length} laps to database for ${year} round ${round}`);
        }
        return lapData;
    }
    catch (error) {
        console.error(`Error getting lap data for season ${year}, round ${round}:`, error);
        return [];
    }
};
export const updateLapData = async (year, round) => {
    try {
        const lapData = await fetchLapDataFromAPI(year, round);
        const race = await Race.findBySeasonAndRound(year, round);
        if (!race) {
            console.log(`No race found for season ${year}, round ${round} - cannot update lap data`);
            return lapData;
        }
        race.laps = lapData;
        await race.save();
        console.log(`Updated lap data for ${year} round ${round}: ${lapData.length} laps`);
        return lapData;
    }
    catch (error) {
        console.error(`Error updating lap data for season ${year}, round ${round}:`, error);
        return [];
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
export const fetchPitStopDataFromAPI = async (year, round) => {
    try {
        const allPitStops = [];
        let offset = 0;
        const limit = 30;
        let totalFetched = 0;
        let total = 0;
        let consecutiveEmptyResponses = 0;
        do {
            const url = `https://api.jolpi.ca/ergast/f1/${year}/${round}/pitstops?offset=${offset}&limit=${limit}`;
            console.log(`Fetching pit stop data from: ${url}`);
            try {
                const response = await axios.get(url);
                if (response.data?.MRData?.RaceTable?.Races?.[0]?.PitStops) {
                    const pitStops = response.data.MRData.RaceTable.Races[0].PitStops;
                    allPitStops.push(...pitStops);
                    if (offset === 0) {
                        total = parseInt(response.data.MRData.total || '0');
                        console.log(`Total pit stop records available: ${total}`);
                    }
                    totalFetched = allPitStops.length;
                    offset += limit;
                    consecutiveEmptyResponses = 0;
                    console.log(`Fetched ${pitStops.length} pit stops, total so far: ${totalFetched}`);
                    if (totalFetched < total) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }
                else {
                    console.log(`No pit stop data found for ${year} round ${round}`);
                    consecutiveEmptyResponses++;
                    if (consecutiveEmptyResponses >= 3) {
                        console.log(`Stopping after ${consecutiveEmptyResponses} consecutive empty responses`);
                        break;
                    }
                    offset += limit;
                }
            }
            catch (axiosError) {
                if (axios.isAxiosError(axiosError)) {
                    if (axiosError.response?.status === 429) {
                        console.log(`Rate limited. Waiting 2 seconds before continuing...`);
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        continue;
                    }
                    else if (axiosError.response?.status === 404) {
                        console.log(`No more data available (404) at offset ${offset}`);
                        break;
                    }
                }
                throw axiosError;
            }
        } while (totalFetched < total && total > 0 && consecutiveEmptyResponses < 3);
        console.log(`Completed fetching pit stop data for ${year} round ${round}: ${allPitStops.length} total pit stops`);
        return allPitStops;
    }
    catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.log(`No pit stop data available for season ${year}, round ${round} (404)`);
            return [];
        }
        console.error(`Error fetching pitstop data for season ${year}, round ${round}:`, error);
        return [];
    }
};
export const getPitStopData = async (year, round) => {
    try {
        const race = await Race.findBySeasonAndRound(year, round);
        if (race && race.pitStops && race.pitStops.length > 0) {
            return race.pitStops;
        }
        const pitStopData = await fetchPitStopDataFromAPI(year, round);
        if (pitStopData.length > 0 && race) {
            race.pitStops = pitStopData;
            await race.save();
        }
        return pitStopData;
    }
    catch (error) {
        console.error(`Error getting pitstop data for season ${year}, round ${round}:`, error);
        return [];
    }
};
export const updatePitStopData = async (year, round) => {
    try {
        const pitStopData = await fetchPitStopDataFromAPI(year, round);
        const race = await Race.findBySeasonAndRound(year, round);
        if (!race) {
            console.log(`No race found for season ${year}, round ${round} - cannot update pit stop data`);
            return pitStopData;
        }
        race.pitStops = pitStopData;
        await race.save();
        console.log(`Updated pit stop data for ${year} round ${round}: ${pitStopData.length} pit stops`);
        return pitStopData;
    }
    catch (error) {
        console.error(`Error updating pitstop data for season ${year}, round ${round}:`, error);
        return [];
    }
};
export const getPitStopDataByDriver = async (year, round, driverId) => {
    try {
        const pitStopData = await getPitStopData(year, round);
        if (!pitStopData || pitStopData.length === 0) {
            return [];
        }
        const driverPitStops = pitStopData.filter(pitStop => pitStop.driverId === driverId);
        return driverPitStops || [];
    }
    catch (error) {
        console.error(`Error getting pitstop data for driver ${driverId} in season ${year}, round ${round}:`, error);
        throw new Error(`Failed to get pitstop data for driver ${driverId} in season ${year}, round ${round}`);
    }
};
export const fetchSeasonsDataFromAPI = async () => {
    try {
        const allSeasons = [];
        const urls = [
            'https://api.jolpi.ca/ergast/f1/seasons?offset=30',
            'https://api.jolpi.ca/ergast/f1/seasons?offset=60'
        ];
        const responses = await Promise.all(urls.map(url => axios.get(url)));
        for (const response of responses) {
            if (response.data?.MRData?.SeasonTable?.Seasons) {
                allSeasons.push(...response.data.MRData.SeasonTable.Seasons);
            }
        }
        if (allSeasons.length === 0) {
            return null;
        }
        const filteredSeasons = allSeasons.filter(season => {
            const year = parseInt(season.season);
            return year >= 2005;
        });
        filteredSeasons.sort((a, b) => parseInt(b.season) - parseInt(a.season));
        console.log(`Fetched ${filteredSeasons.length} seasons from 2005-present`);
        return filteredSeasons;
    }
    catch (error) {
        console.error('Error fetching seasons data:', error);
        throw new Error('Failed to fetch seasons data');
    }
};
export const getSeasonsData = async () => {
    try {
        const seasonsData = await fetchSeasonsDataFromAPI();
        if (!seasonsData) {
            throw new Error('No seasons data available');
        }
        return seasonsData;
    }
    catch (error) {
        console.error('Error getting seasons data:', error);
        throw new Error('Failed to get seasons data');
    }
};
export const updateSeasonsData = async () => {
    try {
        const seasonsData = await fetchSeasonsDataFromAPI();
        if (!seasonsData) {
            throw new Error('No seasons data found');
        }
        return seasonsData;
    }
    catch (error) {
        console.error('Error updating seasons data:', error);
        throw new Error('Failed to update seasons data');
    }
};
export const getFilteredSeasonsData = async (startYear, endYear, limit) => {
    try {
        const allSeasons = await getSeasonsData();
        let filteredSeasons = allSeasons;
        if (startYear) {
            filteredSeasons = filteredSeasons.filter(season => parseInt(season.season) >= startYear);
        }
        if (endYear) {
            filteredSeasons = filteredSeasons.filter(season => parseInt(season.season) <= endYear);
        }
        filteredSeasons = filteredSeasons.sort((a, b) => parseInt(b.season) - parseInt(a.season));
        if (limit && limit > 0) {
            filteredSeasons = filteredSeasons.slice(0, limit);
        }
        return filteredSeasons;
    }
    catch (error) {
        console.error('Error getting filtered seasons data:', error);
        throw new Error('Failed to get filtered seasons data');
    }
};
//# sourceMappingURL=raceService.js.map