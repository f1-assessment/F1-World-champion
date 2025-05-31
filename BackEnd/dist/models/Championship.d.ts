import { Model } from 'mongoose';
import { IChampionship, IChampionshipModel } from '../types';
type ChampionshipModel = Model<IChampionship> & IChampionshipModel;
declare const Championship: ChampionshipModel;
export default Championship;
//# sourceMappingURL=Championship.d.ts.map