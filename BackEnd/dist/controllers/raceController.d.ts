import { Request, Response } from 'express';
export declare const getAllRaces: (req: Request, res: Response) => Promise<void>;
export declare const getCurrentSeasonRaces: (req: Request, res: Response) => Promise<void>;
export declare const getRacesBySeason: (req: Request, res: Response) => Promise<void>;
export declare const getRaceBySeasonAndRound: (req: Request, res: Response) => Promise<void>;
export declare const updateRaceData: (req: Request, res: Response) => Promise<void>;
export declare const getLapData: (req: Request, res: Response) => Promise<void>;
export declare const updateLapData: (req: Request, res: Response) => Promise<void>;
export declare const getLapDataByLapNumber: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=raceController.d.ts.map