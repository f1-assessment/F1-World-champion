import { jest } from '@jest/globals';
import { IDriver, IConstructor, IRace, IChampionship } from '../../types/index.js';
import { Document } from 'mongoose';

// Mock return types for Jest
export type MockedFunction<T extends (...args: any[]) => any> = jest.MockedFunction<T>;

// Mock query object with proper typing
export interface MockQuery<T> {
  sort: MockedFunction<(sortObj: any) => Promise<T>>;
  exec: MockedFunction<() => Promise<T>>;
  populate: MockedFunction<(path: string) => MockQuery<T>>;
  select: MockedFunction<(fields: string) => MockQuery<T>>;
  limit: MockedFunction<(count: number) => MockQuery<T>>;
  skip: MockedFunction<(count: number) => MockQuery<T>>;
}

// Mock model interfaces
export interface MockDriverModel {
  findOne: MockedFunction<(query?: any) => MockQuery<IDriver | null>>;
  find: MockedFunction<(query?: any) => MockQuery<IDriver[]>>;
  findById: MockedFunction<(id: string) => Promise<IDriver | null>>;
  findByIdAndUpdate: MockedFunction<(id: string, update: any, options?: any) => Promise<IDriver | null>>;
  findOneAndUpdate: MockedFunction<(query: any, update: any, options?: any) => Promise<IDriver | null>>;
  create: MockedFunction<(data: Partial<IDriver>) => Promise<IDriver>>;
  updateOne: MockedFunction<(query: any, update: any) => Promise<any>>;
  updateMany: MockedFunction<(query: any, update: any) => Promise<any>>;
  deleteOne: MockedFunction<(query: any) => Promise<any>>;
  deleteMany: MockedFunction<(query: any) => Promise<any>>;
  countDocuments: MockedFunction<(query?: any) => Promise<number>>;
  aggregate: MockedFunction<(pipeline: any[]) => Promise<any[]>>;
}

export interface MockConstructorModel {
  findOne: MockedFunction<(query?: any) => MockQuery<IConstructor | null>>;
  find: MockedFunction<(query?: any) => MockQuery<IConstructor[]>>;
  findById: MockedFunction<(id: string) => Promise<IConstructor | null>>;
  findByIdAndUpdate: MockedFunction<(id: string, update: any, options?: any) => Promise<IConstructor | null>>;
  findOneAndUpdate: MockedFunction<(query: any, update: any, options?: any) => Promise<IConstructor | null>>;
  create: MockedFunction<(data: Partial<IConstructor>) => Promise<IConstructor>>;
  updateOne: MockedFunction<(query: any, update: any) => Promise<any>>;
  updateMany: MockedFunction<(query: any, update: any) => Promise<any>>;
  deleteOne: MockedFunction<(query: any) => Promise<any>>;
  deleteMany: MockedFunction<(query: any) => Promise<any>>;
  countDocuments: MockedFunction<(query?: any) => Promise<number>>;
  aggregate: MockedFunction<(pipeline: any[]) => Promise<any[]>>;
}

export interface MockRaceModel {
  findOne: MockedFunction<(query?: any) => MockQuery<IRace | null>>;
  find: MockedFunction<(query?: any) => MockQuery<IRace[]>>;
  findById: MockedFunction<(id: string) => Promise<IRace | null>>;
  findByIdAndUpdate: MockedFunction<(id: string, update: any, options?: any) => Promise<IRace | null>>;
  findOneAndUpdate: MockedFunction<(query: any, update: any, options?: any) => Promise<IRace | null>>;
  create: MockedFunction<(data: Partial<IRace>) => Promise<IRace>>;
  updateOne: MockedFunction<(query: any, update: any) => Promise<any>>;
  updateMany: MockedFunction<(query: any, update: any) => Promise<any>>;
  deleteOne: MockedFunction<(query: any) => Promise<any>>;
  deleteMany: MockedFunction<(query: any) => Promise<any>>;
  countDocuments: MockedFunction<(query?: any) => Promise<number>>;
  aggregate: MockedFunction<(pipeline: any[]) => Promise<any[]>>;
  findBySeason: MockedFunction<(season: string) => Promise<IRace[]>>;
}

export interface MockChampionshipModel {
  findOne: MockedFunction<(query?: any) => Promise<IChampionship | null>>;
  find: MockedFunction<(query?: any) => MockQuery<IChampionship[]>>;
  findById: MockedFunction<(id: string) => Promise<IChampionship | null>>;
  findByIdAndUpdate: MockedFunction<(id: string, update: any, options?: any) => Promise<IChampionship | null>>;
  findOneAndUpdate: MockedFunction<(query: any, update: any, options?: any) => Promise<IChampionship | null>>;
  create: MockedFunction<(data: Partial<IChampionship>) => Promise<IChampionship>>;
  updateOne: MockedFunction<(query: any, update: any) => Promise<any>>;
  updateMany: MockedFunction<(query: any, update: any) => Promise<any>>;
  deleteOne: MockedFunction<(query: any) => Promise<any>>;
  deleteMany: MockedFunction<(query: any) => Promise<any>>;
  countDocuments: MockedFunction<(query?: any) => Promise<number>>;
  aggregate: MockedFunction<(pipeline: any[]) => Promise<any[]>>;
}

// Helper function to create mock query object
export function createMockQuery<T>(): MockQuery<T> {
  return {
    sort: jest.fn() as MockedFunction<(sortObj: any) => Promise<T>>,
    exec: jest.fn() as MockedFunction<() => Promise<T>>,
    populate: jest.fn().mockReturnThis() as MockedFunction<(path: string) => MockQuery<T>>,
    select: jest.fn().mockReturnThis() as MockedFunction<(fields: string) => MockQuery<T>>,
    limit: jest.fn().mockReturnThis() as MockedFunction<(count: number) => MockQuery<T>>,
    skip: jest.fn().mockReturnThis() as MockedFunction<(count: number) => MockQuery<T>>,
  };
}

// Helper functions to create properly typed mock data
export function createMockDriver(overrides: Partial<IDriver> = {}): IDriver {
  return {
    _id: '507f1f77bcf86cd799439011',
    driverId: 'verstappen',
    permanentNumber: '1',
    code: 'VER',
    url: 'http://en.wikipedia.org/wiki/Max_Verstappen',
    givenName: 'Max',
    familyName: 'Verstappen',
    dateOfBirth: '1997-09-30',
    nationality: 'Dutch',
    fullName: 'Max Verstappen',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    save: jest.fn() as any,
    toObject: jest.fn().mockReturnThis() as any,
    ...overrides
  } as IDriver;
}

export function createMockConstructor(overrides: Partial<IConstructor> = {}): IConstructor {
  return {
    _id: '507f1f77bcf86cd799439011',
    constructorId: 'red_bull',
    name: 'Red Bull Racing Honda RBPT',
    nationality: 'Austrian',
    url: 'http://en.wikipedia.org/wiki/Red_Bull_Racing',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    save: jest.fn() as any,
    toObject: jest.fn().mockReturnThis() as any,
    ...overrides
  } as IConstructor;
}

export function createMockRace(overrides: Partial<IRace> = {}): IRace {
  return {
    _id: '507f1f77bcf86cd799439011',
    season: '2024',
    round: '1',
    url: 'https://ergast.com/api/f1/2024/1',
    raceName: 'Bahrain Grand Prix',
    circuit: {
      circuitId: 'bahrain',
      circuitName: 'Bahrain International Circuit',
      url: 'http://en.wikipedia.org/wiki/Bahrain_International_Circuit',
      location: {
        lat: '26.0325',
        long: '50.5106',
        locality: 'Sakhir',
        country: 'Bahrain'
      }
    },
    date: '2024-03-02',
    time: '15:00:00Z',
    results: [],
    laps: [],
    pitStops: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    save: jest.fn() as any,
    toObject: jest.fn().mockReturnThis() as any,
    ...overrides
  } as IRace;
}

export function createMockChampionship(overrides: Partial<IChampionship> = {}): IChampionship {
  return {
    _id: '507f1f77bcf86cd799439011',
    season: '2024',
    driverId: 'verstappen',
    constructorId: 'red_bull',
    points: '575',
    wins: '19',
    podiums: '21',
    fastestLaps: '5',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    save: jest.fn() as any,
    toObject: jest.fn().mockReturnThis() as any,
    ...overrides
  } as IChampionship;
} 