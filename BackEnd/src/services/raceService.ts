import { IRace, LapDataApiResponse, PitStopDataApiResponse, SeasonDataApiResponse } from '../types';
import Race from '../models/Race.js';
import axios from 'axios';

/**
 * Gets all races from database
 * @returns Array of all race documents
 */
export const getAllRaces = async (): Promise<IRace[]> => {
  try {
    const races = await Race.find({}).sort({ season: -1, round: 1 });
    return races;
  } catch (error) {
    console.error('Error fetching all races:', error);
    throw new Error('Failed to fetch races from database');
  }
};

/**
 * Gets races by season
 * @param year - The season year
 * @returns Array of race documents
 */
export const getRacesBySeason = async (year: string | number): Promise<IRace[]> => {
  try {
    const seasonYear = typeof year === 'string' ? year : year.toString();
    const races = await Race.findBySeason(seasonYear);
    return races;
  } catch (error) {
    console.error(`Error fetching races for season ${year}:`, error);
    throw new Error(`Failed to fetch races for season ${year}`);
  }
};

/**
 * Gets race by season and round
 * @param year - The season year
 * @param round - The race round
 * @returns The race document or null
 */
export const getRaceBySeasonAndRound = async (year: string, round: string): Promise<IRace | null> => {
  try {
    const race = await Race.findBySeasonAndRound(year, round);
    return race;
  } catch (error) {
    console.error(`Error fetching race for season ${year}, round ${round}:`, error);
    throw new Error(`Failed to fetch race for season ${year}, round ${round}`);
  }
};

/**
 * Updates race data for a season
 * @param year - The season year
 * @returns Array of updated races
 */
export const updateRaceData = async (year: string): Promise<IRace[]> => {
  try {
    console.log(`Fetching race data for season ${year} from external API...`);
    
    // Fetch race data from external API
    const url = `https://api.jolpi.ca/ergast/f1/${year}.json`;
    const response = await axios.get(url);
    
    if (!response.data?.MRData?.RaceTable?.Races) {
      console.log(`No race data found for season ${year}`);
      return [];
    }
    
    const races = response.data.MRData.RaceTable.Races;
    const updatedRaces: IRace[] = [];
    
    for (const raceData of races) {
      try {
        // Check if race already exists
        let race = await Race.findBySeasonAndRound(year, raceData.round);
        
        if (!race) {
          // Create new race document
          race = new Race({
            season: year,
            round: raceData.round,
            raceName: raceData.raceName,
            circuit: raceData.Circuit,
            date: raceData.date,
            time: raceData.time,
            url: raceData.url
          });
        } else {
          // Update existing race
          race.raceName = raceData.raceName;
          race.circuit = raceData.Circuit;
          race.date = raceData.date;
          race.time = raceData.time;
          race.url = raceData.url;
        }
        
        // Fetch results for this race if available
        const resultsUrl = `https://api.jolpi.ca/ergast/f1/${year}/${raceData.round}/results.json`;
        try {
          const resultsResponse = await axios.get(resultsUrl);
          if (resultsResponse.data?.MRData?.RaceTable?.Races?.[0]?.Results) {
            race.results = resultsResponse.data.MRData.RaceTable.Races[0].Results;
          }
        } catch (resultsError) {
          console.log(`No results found for ${year} round ${raceData.round}`);
          // Continue without results
        }
        
        await race.save();
        updatedRaces.push(race);
        
        console.log(`Updated race: ${year} Round ${raceData.round} - ${raceData.raceName}`);
        
        // Add small delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (raceError) {
        console.error(`Error updating race ${year} round ${raceData.round}:`, raceError);
        // Continue with next race
      }
    }
    
    console.log(`Successfully updated ${updatedRaces.length} races for season ${year}`);
    return updatedRaces;
    
  } catch (error) {
    console.error(`Error updating race data for season ${year}:`, error);
    return [];
  }
};

/**
 * Fetches lap data for a specific race from external API with pagination support
 * @param year - The season year
 * @param round - The race round
 * @returns The lap data or empty array if not found
 */
export const fetchLapDataFromAPI = async (year: string, round: string): Promise<any[]> => {
  try {
    const allLaps: any[] = [];
    let offset = 0;
    const limit = 30; // Default limit from API
    let totalFetched = 0;
    let total = 0;
    let consecutiveEmptyResponses = 0;

    do {
      const url = `https://api.jolpi.ca/ergast/f1/${year}/${round}/laps?offset=${offset}&limit=${limit}`;
      console.log(`Fetching lap data from: ${url}`);
      
      try {
        const response = await axios.get<LapDataApiResponse>(url);
        
        if (response.data?.MRData?.RaceTable?.Races?.[0]?.Laps) {
          const laps = response.data.MRData.RaceTable.Races[0].Laps;
          allLaps.push(...laps);
          
          // Get total from first response
          if (offset === 0) {
            total = parseInt(response.data.MRData.total || '0');
            console.log(`Total lap records available: ${total}`);
          }
          
          totalFetched = allLaps.length;
          offset += limit;
          consecutiveEmptyResponses = 0;
          
          console.log(`Fetched ${laps.length} laps, total so far: ${totalFetched}`);
          
          // Add delay to prevent rate limiting
          if (totalFetched < total) {
            await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
          }
        } else {
          // No data found - this is normal for races without lap data
          console.log(`No lap data found for ${year} round ${round}`);
          consecutiveEmptyResponses++;
          
          // If we get 3 consecutive empty responses, stop
          if (consecutiveEmptyResponses >= 3) {
            console.log(`Stopping after ${consecutiveEmptyResponses} consecutive empty responses`);
            break;
          }
          
          offset += limit;
        }
      } catch (axiosError) {
        if (axios.isAxiosError(axiosError)) {
          if (axiosError.response?.status === 429) {
            console.log(`Rate limited. Waiting 2 seconds before continuing...`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay for rate limit
            continue; // Retry the same offset
          } else if (axiosError.response?.status === 404) {
            console.log(`No more data available (404) at offset ${offset}`);
            break;
          }
        }
        throw axiosError; // Re-throw other errors
      }
    } while (totalFetched < total && total > 0 && consecutiveEmptyResponses < 3);

    console.log(`Completed fetching lap data for ${year} round ${round}: ${allLaps.length} total laps`);
    return allLaps;
  } catch (error) {
    // Handle 404 and other errors gracefully
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.log(`No lap data available for season ${year}, round ${round} (404)`);
      return [];
    }
    
    console.error(`Error fetching lap data for season ${year}, round ${round}:`, error);
    // Return empty array instead of throwing error
    return [];
  }
};

/**
 * Gets lap data for a specific race
 * @param year - The season year
 * @param round - The race round
 * @returns The lap data from the race document or fetched from API
 */
export const getLapData = async (year: string, round: string): Promise<any[]> => {
  try {
    // TEMPORARY: Always fetch from external API for debugging
    console.log(`DEBUG: Force fetching lap data from API for ${year} round ${round}`);
    const lapData = await fetchLapDataFromAPI(year, round);
    console.log(`DEBUG: Fetched ${lapData.length} laps from external API`);
    
    if (lapData.length > 0) {
      // Try to find and update the race document
      const race = await Race.findBySeasonAndRound(year, round);
      if (race) {
        race.laps = lapData;
        await race.save();
        console.log(`DEBUG: Saved ${lapData.length} laps to database`);
      } else {
        console.log(`DEBUG: No race found in database for ${year} round ${round}`);
      }
    }
    
    return lapData;
  } catch (error) {
    console.error(`Error getting lap data for season ${year}, round ${round}:`, error);
    // Return empty array instead of throwing error
    return [];
  }
};

/**
 * Updates lap data for a specific race
 * @param year - The season year
 * @param round - The race round
 * @returns The updated lap data
 */
export const updateLapData = async (year: string, round: string): Promise<any[]> => {
  try {
    const lapData = await fetchLapDataFromAPI(year, round);
    
    // Find the race document
    const race = await Race.findBySeasonAndRound(year, round);
    
    if (!race) {
      console.log(`No race found for season ${year}, round ${round} - cannot update lap data`);
      return lapData; // Return the fetched data even if we can't save it
    }
    
    // Update race document with lap data (even if empty)
    race.laps = lapData;
    await race.save();
    
    console.log(`Updated lap data for ${year} round ${round}: ${lapData.length} laps`);
    return lapData;
  } catch (error) {
    console.error(`Error updating lap data for season ${year}, round ${round}:`, error);
    // Return empty array instead of throwing error
    return [];
  }
};

/**
 * Gets lap data for a specific lap number in a race
 * @param year - The season year
 * @param round - The race round
 * @param lapNumber - The specific lap number
 * @returns The lap data for the specific lap number
 */
export const getLapDataByLapNumber = async (year: string, round: string, lapNumber: string): Promise<any | null> => {
  try {
    const lapData = await getLapData(year, round);
    
    if (!lapData || lapData.length === 0) {
      return null;
    }
    
    const specificLap = lapData.find(lap => lap.number === lapNumber);
    return specificLap || null;
  } catch (error) {
    console.error(`Error getting lap ${lapNumber} data for season ${year}, round ${round}:`, error);
    throw new Error(`Failed to get lap ${lapNumber} data for season ${year}, round ${round}`);
  }
};

/**
 * Fetches pitstop data for a specific race from external API with pagination support
 * @param year - The season year
 * @param round - The race round
 * @returns The pitstop data or empty array if not found
 */
export const fetchPitStopDataFromAPI = async (year: string, round: string): Promise<any[]> => {
  try {
    const allPitStops: any[] = [];
    let offset = 0;
    const limit = 30; // Default limit from API
    let totalFetched = 0;
    let total = 0;
    let consecutiveEmptyResponses = 0;

    do {
      const url = `https://api.jolpi.ca/ergast/f1/${year}/${round}/pitstops?offset=${offset}&limit=${limit}`;
      console.log(`Fetching pit stop data from: ${url}`);
      
      try {
        const response = await axios.get<PitStopDataApiResponse>(url);
        
        if (response.data?.MRData?.RaceTable?.Races?.[0]?.PitStops) {
          const pitStops = response.data.MRData.RaceTable.Races[0].PitStops;
          allPitStops.push(...pitStops);
          
          // Get total from first response
          if (offset === 0) {
            total = parseInt(response.data.MRData.total || '0');
            console.log(`Total pit stop records available: ${total}`);
          }
          
          totalFetched = allPitStops.length;
          offset += limit;
          consecutiveEmptyResponses = 0;
          
          console.log(`Fetched ${pitStops.length} pit stops, total so far: ${totalFetched}`);
          
          // Add delay to prevent rate limiting
          if (totalFetched < total) {
            await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
          }
        } else {
          // No data found - this is normal for races without pit stop data
          console.log(`No pit stop data found for ${year} round ${round}`);
          consecutiveEmptyResponses++;
          
          // If we get 3 consecutive empty responses, stop
          if (consecutiveEmptyResponses >= 3) {
            console.log(`Stopping after ${consecutiveEmptyResponses} consecutive empty responses`);
            break;
          }
          
          offset += limit;
        }
      } catch (axiosError) {
        if (axios.isAxiosError(axiosError)) {
          if (axiosError.response?.status === 429) {
            console.log(`Rate limited. Waiting 2 seconds before continuing...`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay for rate limit
            continue; // Retry the same offset
          } else if (axiosError.response?.status === 404) {
            console.log(`No more data available (404) at offset ${offset}`);
            break;
          }
        }
        throw axiosError; // Re-throw other errors
      }
    } while (totalFetched < total && total > 0 && consecutiveEmptyResponses < 3);

    console.log(`Completed fetching pit stop data for ${year} round ${round}: ${allPitStops.length} total pit stops`);
    return allPitStops;
  } catch (error) {
    // Handle 404 and other errors gracefully
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.log(`No pit stop data available for season ${year}, round ${round} (404)`);
      return [];
    }
    
    console.error(`Error fetching pitstop data for season ${year}, round ${round}:`, error);
    // Return empty array instead of throwing error
    return [];
  }
};

/**
 * Gets pitstop data for a specific race
 * @param year - The season year
 * @param round - The race round
 * @returns The pitstop data from the race document or fetched from API
 */
export const getPitStopData = async (year: string, round: string): Promise<any[]> => {
  try {
    // First try to get from database
    const race = await Race.findBySeasonAndRound(year, round);
    
    if (race && race.pitStops && race.pitStops.length > 0) {
      return race.pitStops;
    }
    
    // If no pitstop data in database, fetch from external API
    const pitStopData = await fetchPitStopDataFromAPI(year, round);
    
    if (pitStopData.length > 0 && race) {
      // Update the race document with pitstop data
      race.pitStops = pitStopData;
      await race.save();
    }
    
    return pitStopData;
  } catch (error) {
    console.error(`Error getting pitstop data for season ${year}, round ${round}:`, error);
    // Return empty array instead of throwing error
    return [];
  }
};

/**
 * Updates pitstop data for a specific race
 * @param year - The season year
 * @param round - The race round
 * @returns The updated pitstop data
 */
export const updatePitStopData = async (year: string, round: string): Promise<any[]> => {
  try {
    const pitStopData = await fetchPitStopDataFromAPI(year, round);
    
    // Find the race document
    const race = await Race.findBySeasonAndRound(year, round);
    
    if (!race) {
      console.log(`No race found for season ${year}, round ${round} - cannot update pit stop data`);
      return pitStopData; // Return the fetched data even if we can't save it
    }
    
    // Update race document with pit stop data (even if empty)
    race.pitStops = pitStopData;
    await race.save();
    
    console.log(`Updated pit stop data for ${year} round ${round}: ${pitStopData.length} pit stops`);
    return pitStopData;
  } catch (error) {
    console.error(`Error updating pitstop data for season ${year}, round ${round}:`, error);
    // Return empty array instead of throwing error
    return [];
  }
};

/**
 * Gets pitstop data for a specific driver in a race
 * @param year - The season year
 * @param round - The race round
 * @param driverId - The driver ID
 * @returns The pitstop data for the specific driver
 */
export const getPitStopDataByDriver = async (year: string, round: string, driverId: string): Promise<any[]> => {
  try {
    const pitStopData = await getPitStopData(year, round);
    
    if (!pitStopData || pitStopData.length === 0) {
      return [];
    }
    
    const driverPitStops = pitStopData.filter(pitStop => pitStop.driverId === driverId);
    return driverPitStops || [];
  } catch (error) {
    console.error(`Error getting pitstop data for driver ${driverId} in season ${year}, round ${round}:`, error);
    throw new Error(`Failed to get pitstop data for driver ${driverId} in season ${year}, round ${round}`);
  }
};

/**
 * Fetches seasons data from external API with pagination to get seasons 2005-present
 * @returns The seasons data filtered for 2005 onwards or null if not found
 */
export const fetchSeasonsDataFromAPI = async (): Promise<any[] | null> => {
  try {
    const allSeasons: any[] = [];
    
    // We need to fetch from offset=30 and offset=60 to get seasons 2005-2025
    // offset=30 gives us 1980-2009 (we need 2005-2009 from this)
    // offset=60 gives us 2010-2025 (we need all of this)
    
    const urls = [
      'https://api.jolpi.ca/ergast/f1/seasons?offset=30', // 1980-2009
      'https://api.jolpi.ca/ergast/f1/seasons?offset=60'  // 2010-2025
    ];
    
    // Fetch from multiple pages concurrently
    const responses = await Promise.all(
      urls.map(url => axios.get<SeasonDataApiResponse>(url))
    );
    
    // Combine all seasons data
    for (const response of responses) {
      if (response.data?.MRData?.SeasonTable?.Seasons) {
        allSeasons.push(...response.data.MRData.SeasonTable.Seasons);
      }
    }
    
    if (allSeasons.length === 0) {
      return null;
    }
    
    // Filter to only include seasons from 2005 onwards
    const filteredSeasons = allSeasons.filter(season => {
      const year = parseInt(season.season);
      return year >= 2005;
    });
    
    // Sort by year in descending order (most recent first)
    filteredSeasons.sort((a, b) => parseInt(b.season) - parseInt(a.season));
    
    console.log(`Fetched ${filteredSeasons.length} seasons from 2005-present`);
    
    return filteredSeasons;
  } catch (error) {
    console.error('Error fetching seasons data:', error);
    throw new Error('Failed to fetch seasons data');
  }
};

/**
 * Gets all seasons data
 * @returns Array of all seasons
 */
export const getSeasonsData = async (): Promise<any[]> => {
  try {
    // For now, fetch directly from API
    // In the future, we could cache this in database
    const seasonsData = await fetchSeasonsDataFromAPI();
    
    if (!seasonsData) {
      throw new Error('No seasons data available');
    }
    
    return seasonsData;
  } catch (error) {
    console.error('Error getting seasons data:', error);
    throw new Error('Failed to get seasons data');
  }
};

/**
 * Updates seasons data by fetching from external API
 * @returns The updated seasons data
 */
export const updateSeasonsData = async (): Promise<any[]> => {
  try {
    const seasonsData = await fetchSeasonsDataFromAPI();
    
    if (!seasonsData) {
      throw new Error('No seasons data found');
    }
    
    // For now, just return the fetched data
    // In the future, we could save to database for caching
    return seasonsData;
  } catch (error) {
    console.error('Error updating seasons data:', error);
    throw new Error('Failed to update seasons data');
  }
};

/**
 * Gets seasons data with filtering options
 * @param startYear - Optional start year filter
 * @param endYear - Optional end year filter
 * @param limit - Optional limit for number of seasons
 * @returns Filtered array of seasons
 */
export const getFilteredSeasonsData = async (
  startYear?: number,
  endYear?: number,
  limit?: number
): Promise<any[]> => {
  try {
    const allSeasons = await getSeasonsData();
    
    let filteredSeasons = allSeasons;
    
    // Apply year range filtering
    if (startYear) {
      filteredSeasons = filteredSeasons.filter(season => 
        parseInt(season.season) >= startYear
      );
    }
    
    if (endYear) {
      filteredSeasons = filteredSeasons.filter(season => 
        parseInt(season.season) <= endYear
      );
    }
    
    // Sort by season year (descending by default)
    filteredSeasons = filteredSeasons.sort((a, b) => 
      parseInt(b.season) - parseInt(a.season)
    );
    
    // Apply limit
    if (limit && limit > 0) {
      filteredSeasons = filteredSeasons.slice(0, limit);
    }
    
    return filteredSeasons;
  } catch (error) {
    console.error('Error getting filtered seasons data:', error);
    throw new Error('Failed to get filtered seasons data');
  }
}; 