import { Model } from 'mongoose';
import { IRace, IRaceModel } from '../types/index.js';
type RaceModel = Model<IRace> & IRaceModel;
declare const Race: RaceModel;
export default Race;
//# sourceMappingURL=Race.d.ts.map