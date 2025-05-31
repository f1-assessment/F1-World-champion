import { IRace } from '../types';
export declare const getAllRaces: () => Promise<IRace[]>;
export declare const getRacesBySeason: (year: string | number) => Promise<IRace[]>;
export declare const getRaceBySeasonAndRound: (year: string, round: string) => Promise<IRace | null>;
export declare const updateRaceData: (year: string) => Promise<IRace[]>;
export declare const fetchLapDataFromAPI: (year: string, round: string) => Promise<any | null>;
export declare const getLapData: (year: string, round: string) => Promise<any[]>;
export declare const updateLapData: (year: string, round: string) => Promise<any[]>;
export declare const getLapDataByLapNumber: (year: string, round: string, lapNumber: string) => Promise<any | null>;
//# sourceMappingURL=raceService.d.ts.map