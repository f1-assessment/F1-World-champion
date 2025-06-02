import { Request, Response } from 'express';
export declare const getAllRaces: (req: Request, res: Response) => Promise<void>;
export declare const getCurrentSeasonRaces: (req: Request, res: Response) => Promise<void>;
export declare const getRacesBySeason: (req: Request, res: Response) => Promise<void>;
export declare const getRaceBySeasonAndRound: (req: Request, res: Response) => Promise<void>;
export declare const updateRaceData: (req: Request, res: Response) => Promise<void>;
export declare const getLapData: (req: Request, res: Response) => Promise<void>;
export declare const updateLapData: (req: Request, res: Response) => Promise<void>;
export declare const getLapDataByLapNumber: (req: Request, res: Response) => Promise<void>;
export declare const getPitStopData: (req: Request, res: Response) => Promise<void>;
export declare const updatePitStopData: (req: Request, res: Response) => Promise<void>;
export declare const getPitStopDataByDriver: (req: Request, res: Response) => Promise<void>;
export declare const getSeasonsData: (req: Request, res: Response) => Promise<void>;
export declare const getFilteredSeasonsData: (req: Request, res: Response) => Promise<void>;
export declare const updateSeasonsData: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=raceController.d.ts.map