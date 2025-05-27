import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the championship schema
const championshipSchema = new Schema({
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
championshipSchema.statics.findBySeason = function(season) {
  return this.findOne({ season })
    .populate('driverId')
    .populate('constructorId');
};

championshipSchema.statics.getLatestChampions = function(limit = 10) {
  return this.find({})
    .sort({ season: -1 })
    .limit(limit)
    .populate('driverId')
    .populate('constructorId');
};

const Championship = mongoose.model('Championship', championshipSchema);

export default Championship; 