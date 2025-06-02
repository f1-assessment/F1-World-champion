import { Model } from 'mongoose';
import { IChampionship, IChampionshipModel } from '../types/index.js';
type ChampionshipModel = Model<IChampionship> & IChampionshipModel;
declare const Championship: ChampionshipModel;
export default Championship;
//# sourceMappingURL=Championship.d.ts.map