import { IRace } from '../types';
export declare const getAllRaces: () => Promise<IRace[]>;
export declare const getRacesBySeason: (year: string | number) => Promise<IRace[]>;
export declare const getRaceBySeasonAndRound: (year: string, round: string) => Promise<IRace | null>;
export declare const updateRaceData: (year: string) => Promise<IRace[]>;
//# sourceMappingURL=raceService.d.ts.map