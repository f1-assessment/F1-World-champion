// API Constants
const API_BASE_URL = 'https://api.jolpi.ca/ergast/f1';

// Routes
const API_ROUTES = {
  SEASONS: '/seasons',
  CIRCUITS: '/circuits',
  RACES: (year) => `/${year}/races`,
  CONSTRUCTORS: (year) => `/${year}/constructors`,
  DRIVERS: (year) => `/${year}/drivers`,
  RESULTS: (year) => `/${year}/results`,
  SPRINT: (year) => `/${year}/sprint`,
  QUALIFYING: (year) => `/${year}/qualifying`,
  PITSTOPS: (year, round) => `/${year}/${round}/pitstops`,
  LAPS: (year, round) => `/${year}/${round}/laps`,
  DRIVER_STANDINGS: (year) => `/${year}/driverStandings/1`
};

// Pagination config
const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 100;

// Years config
const STARTING_YEAR = 2005; // We're focusing on 2005 to present
const getCurrentYear = () => new Date().getFullYear();

export {
  API_BASE_URL,
  API_ROUTES,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  STARTING_YEAR,
  getCurrentYear
}; 