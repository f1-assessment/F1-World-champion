import axios from 'axios';
import { API_BASE_URL, API_ROUTES } from '../config/constants.js';

/**
 * Fetches data from the Ergast API
 * @param {string} endpoint - The API endpoint to fetch from
 * @returns {Promise<Object>} - The response data
 */
const fetchFromAPI = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}.json`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching from API (${endpoint}):`, error.message);
    throw new Error(`Failed to fetch data from API: ${error.message}`);
  }
};

/**
 * Fetches all seasons from the API
 * @returns {Promise<Array>} - Array of seasons
 */
const fetchSeasons = async () => {
  const data = await fetchFromAPI(API_ROUTES.SEASONS);
  return data.MRData.SeasonTable.Seasons;
};

/**
 * Fetches all circuits from the API
 * @returns {Promise<Array>} - Array of circuits
 */
const fetchCircuits = async () => {
  const data = await fetchFromAPI(API_ROUTES.CIRCUITS);
  return data.MRData.CircuitTable.Circuits;
};

/**
 * Fetches races for a specific season
 * @param {number} year - The season year
 * @returns {Promise<Array>} - Array of races
 */
const fetchRaces = async (year) => {
  const data = await fetchFromAPI(API_ROUTES.RACES(year));
  return data.MRData.RaceTable.Races;
};

/**
 * Fetches constructors for a specific season
 * @param {number} year - The season year
 * @returns {Promise<Array>} - Array of constructors
 */
const fetchConstructors = async (year) => {
  const data = await fetchFromAPI(API_ROUTES.CONSTRUCTORS(year));
  return data.MRData.ConstructorTable.Constructors;
};

/**
 * Fetches drivers for a specific season
 * @param {number} year - The season year
 * @returns {Promise<Array>} - Array of drivers
 */
const fetchDrivers = async (year) => {
  const data = await fetchFromAPI(API_ROUTES.DRIVERS(year));
  return data.MRData.DriverTable.Drivers;
};

/**
 * Fetches race results for a specific season
 * @param {number} year - The season year
 * @returns {Promise<Array>} - Array of races with results
 */
const fetchResults = async (year) => {
  const data = await fetchFromAPI(API_ROUTES.RESULTS(year));
  return data.MRData.RaceTable.Races;
};

/**
 * Fetches sprint results for a specific season
 * @param {number} year - The season year
 * @returns {Promise<Array>} - Array of races with sprint results
 */
const fetchSprints = async (year) => {
  const data = await fetchFromAPI(API_ROUTES.SPRINT(year));
  return data.MRData.RaceTable.Races;
};

/**
 * Fetches qualifying results for a specific season
 * @param {number} year - The season year
 * @returns {Promise<Array>} - Array of races with qualifying results
 */
const fetchQualifying = async (year) => {
  const data = await fetchFromAPI(API_ROUTES.QUALIFYING(year));
  return data.MRData.RaceTable.Races;
};

/**
 * Fetches pit stops for a specific race
 * @param {number} year - The season year
 * @param {number} round - The race round
 * @returns {Promise<Array>} - Array of pit stops
 */
const fetchPitStops = async (year, round) => {
  const data = await fetchFromAPI(API_ROUTES.PITSTOPS(year, round));
  return data.MRData.RaceTable.Races[0]?.PitStops || [];
};

/**
 * Fetches lap times for a specific race
 * @param {number} year - The season year
 * @param {number} round - The race round
 * @returns {Promise<Array>} - Array of laps with timings
 */
const fetchLaps = async (year, round) => {
  const data = await fetchFromAPI(API_ROUTES.LAPS(year, round));
  return data.MRData.RaceTable.Races[0]?.Laps || [];
};

/**
 * Fetches the world champion for a specific season
 * @param {number} year - The season year
 * @returns {Promise<Object|null>} - The champion data or null if not found
 */
const fetchWorldChampion = async (year) => {
  try {
    const data = await fetchFromAPI(API_ROUTES.DRIVER_STANDINGS(year));
    
    if (!data.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.[0]) {
      return null;
    }
    
    const champion = data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];
    
    return {
      season: year.toString(),
      driverId: champion.Driver.driverId,
      constructorId: champion.Constructors[0].constructorId,
      points: champion.points,
      wins: champion.wins,
      driver: champion.Driver,
      constructor: champion.Constructors[0]
    };
  } catch (error) {
    console.error(`Error fetching world champion for ${year}:`, error);
    return null;
  }
};

export {
  fetchSeasons,
  fetchCircuits,
  fetchRaces,
  fetchConstructors,
  fetchDrivers,
  fetchResults,
  fetchSprints,
  fetchQualifying,
  fetchPitStops,
  fetchLaps,
  fetchWorldChampion
}; 