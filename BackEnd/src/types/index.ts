import { Document } from 'mongoose';

// Base interface for documents with timestamps
export interface BaseDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
}

// Driver interfaces
export interface IDriver extends BaseDocument {
  driverId: string;
  permanentNumber?: string;
  code?: string;
  url?: string;
  givenName: string;
  familyName: string;
  dateOfBirth?: string;
  nationality?: string;
  fullName: string; // virtual property
}

// Constructor interfaces
export interface IConstructor extends BaseDocument {
  constructorId: string;
  name?: string;
  nationality?: string;
  url?: string;
}

// Location and Circuit interfaces
export interface ILocation {
  lat?: string;
  long?: string;
  locality?: string;
  country?: string;
}

export interface ICircuit {
  circuitId?: string;
  circuitName?: string;
  url?: string;
  location?: ILocation;
}

// Result interfaces
export interface ITime {
  millis?: string;
  time?: string;
}

export interface IAverageSpeed {
  units?: string;
  speed?: string;
}

export interface IFastestLap {
  rank?: string;
  lap?: string;
  time?: string;
  averageSpeed?: IAverageSpeed;
}

export interface IResult {
  position?: string;
  positionText?: string;
  points?: string;
  driverId?: string | IDriver;
  constructorId?: string | IConstructor;
  grid?: string;
  laps?: string;
  status?: string;
  time?: ITime;
  fastestLap?: IFastestLap;
}

// Lap and Timing interfaces
export interface ITiming {
  driverId?: string | IDriver;
  position?: string;
  time?: string;
}

export interface ILap {
  number?: string;
  timings?: ITiming[];
}

// Pit Stop interface
export interface IPitStop {
  driverId?: string | IDriver;
  lap?: string;
  stop?: string;
  time?: string;
  duration?: string;
}

// Session interface for practice, qualifying, etc.
export interface ISession {
  date?: string;
  time?: string;
}

// Race interfaces
export interface IRace extends BaseDocument {
  season: string;
  round: string;
  url?: string;
  raceName?: string;
  circuit?: ICircuit;
  date?: string;
  time?: string;
  results?: IResult[];
  laps?: ILap[];
  pitStops?: IPitStop[];
  firstPractice?: ISession;
  secondPractice?: ISession;
  thirdPractice?: ISession;
  qualifying?: ISession;
  sprint?: ISession;
}

// Championship interfaces
export interface IChampionship extends BaseDocument {
  season: string;
  driverId: string | IDriver;
  constructorId: string | IConstructor;
  points?: string;
  wins?: string;
  podiums?: string;
  fastestLaps?: string;
}

// Model static methods interfaces
export interface IDriverModel {
  findByDriverId(driverId: string): Promise<IDriver | null>;
}

export interface IConstructorModel {
  findByConstructorId(constructorId: string): Promise<IConstructor | null>;
}

export interface IRaceModel {
  findBySeasonAndRound(season: string, round: string): Promise<IRace | null>;
  findBySeason(season: string): Promise<IRace[]>;
}

export interface IChampionshipModel {
  findBySeason(season: string): Promise<IChampionship | null>;
  getLatestChampions(limit?: number): Promise<IChampionship[]>;
}

// API Response types (from external F1 API)
export interface ApiResponse<T> {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    [key: string]: T | string;
  };
}

// Request/Response types for controllers
export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface SeasonQuery extends PaginationQuery {
  season: string;
}

export interface RaceQuery extends SeasonQuery {
  round: string;
}

// Lap Data API Response types (from external F1 API)
export interface LapDataApiResponse {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    RaceTable: {
      season: string;
      round: string;
      Races: Array<{
        season: string;
        round: string;
        url: string;
        raceName: string;
        Circuit: {
          circuitId: string;
          url: string;
          circuitName: string;
          Location: {
            lat: string;
            long: string;
            locality: string;
            country: string;
          };
        };
        date: string;
        time: string;
        Laps: Array<{
          number: string;
          Timings: Array<{
            driverId: string;
            position: string;
            time: string;
          }>;
        }>;
      }>;
    };
  };
}

// PitStop Data API Response types (from external F1 API)
export interface PitStopDataApiResponse {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    RaceTable: {
      season: string;
      round: string;
      Races: Array<{
        season: string;
        round: string;
        url: string;
        raceName: string;
        Circuit: {
          circuitId: string;
          url: string;
          circuitName: string;
          Location: {
            lat: string;
            long: string;
            locality: string;
            country: string;
          };
        };
        date: string;
        time: string;
        PitStops: Array<{
          driverId: string;
          lap: string;
          stop: string;
          time: string;
          duration: string;
        }>;
      }>;
    };
  };
} 