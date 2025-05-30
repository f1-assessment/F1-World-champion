// API Constants
const API_BASE_URL: string = 'https://api.jolpi.ca/ergast/f1';

// Routes
interface ApiRoutes {
  SEASONS: string;
  CIRCUITS: string;
  RACES: (year: string | number) => string;
  CONSTRUCTORS: (year: string | number) => string;
  DRIVERS: (year: string | number) => string;
  RESULTS: (year: string | number) => string;
  SPRINT: (year: string | number) => string;
  QUALIFYING: (year: string | number) => string;
  PITSTOPS: (year: string | number, round: string | number) => string;
  LAPS: (year: string | number, round: string | number) => string;
  DRIVER_STANDINGS: (year: string | number) => string;
}

const API_ROUTES: ApiRoutes = {
  SEASONS: '/seasons',
  CIRCUITS: '/circuits',
  RACES: (year: string | number) => `/${year}/races`,
  CONSTRUCTORS: (year: string | number) => `/${year}/constructors`,
  DRIVERS: (year: string | number) => `/${year}/drivers`,
  RESULTS: (year: string | number) => `/${year}/results`,
  SPRINT: (year: string | number) => `/${year}/sprint`,
  QUALIFYING: (year: string | number) => `/${year}/qualifying`,
  PITSTOPS: (year: string | number, round: string | number) => `/${year}/${round}/pitstops`,
  LAPS: (year: string | number, round: string | number) => `/${year}/${round}/laps`,
  DRIVER_STANDINGS: (year: string | number) => `/${year}/driverStandings/1`
};

// Pagination config
const DEFAULT_LIMIT: number = 30;
const MAX_LIMIT: number = 100;

// Years config
const STARTING_YEAR: number = 2005; // We're focusing on 2005 to present
const getCurrentYear = (): number => new Date().getFullYear();

export {
  API_BASE_URL,
  API_ROUTES,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  STARTING_YEAR,
  getCurrentYear
}; 