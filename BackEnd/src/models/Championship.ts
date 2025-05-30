import mongoose, { Model, Schema } from 'mongoose';
import { IChampionship, IChampionshipModel } from '../types/index.js';

// Define the championship schema
const championshipSchema = new Schema<IChampionship>({
  season: {
    type: String,
    required: true,
    unique: true
  },
  driverId: {
    type: String,
    ref: 'Driver',
    required: true
  },
  constructorId: {
    type: String,
    ref: 'Constructor',
    required: true
  },
  points: String,
  wins: String,
  podiums: String, // Extra field for additional information
  fastestLaps: String // Extra field for additional information
}, { timestamps: true });

// Add any instance methods or static methods if needed
championshipSchema.statics.findBySeason = function(this: Model<IChampionship>, season: string): Promise<IChampionship | null> {
  return this.findOne({ season })
    .populate('driverId')
    .populate('constructorId');
};

championshipSchema.statics.getLatestChampions = function(this: Model<IChampionship>, limit: number = 10): Promise<IChampionship[]> {
  return this.find({})
    .sort({ season: -1 })
    .limit(limit)
    .populate('driverId')
    .populate('constructorId');
};

// Create and export the model with proper typing
type ChampionshipModel = Model<IChampionship> & IChampionshipModel;

const Championship = mongoose.model<IChampionship, ChampionshipModel>('Championship', championshipSchema);

export default Championship; 