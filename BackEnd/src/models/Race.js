import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the location schema
const locationSchema = new Schema({
  lat: String,
  long: String,
  locality: String,
  country: String
});

// Define the circuit schema
const circuitSchema = new Schema({
  circuitId: String,
  circuitName: String,
  url: String,
  location: locationSchema
});

// Define the result schema
const resultSchema = new Schema({
  position: String,
  positionText: String,
  points: String,
  driverId: {
    type: String,
    ref: 'Driver'
  },
  constructorId: {
    type: String,
    ref: 'Constructor'
  },
  grid: String,
  laps: String,
  status: String,
  time: {
    millis: String,
    time: String
  },
  fastestLap: {
    rank: String,
    lap: String,
    time: String,
    averageSpeed: {
      units: String,
      speed: String
    }
  }
});

// Define the timing schema for lap times
const timingSchema = new Schema({
  driverId: {
    type: String,
    ref: 'Driver'
  },
  position: String,
  time: String
});

// Define the lap schema
const lapSchema = new Schema({
  number: String,
  timings: [timingSchema]
});

// Define the pit stop schema
const pitStopSchema = new Schema({
  driverId: {
    type: String,
    ref: 'Driver'
  },
  lap: String,
  stop: String,
  time: String,
  duration: String
});

// Define the race schema
const raceSchema = new Schema({
  season: {
    type: String,
    required: true
  },
  round: {
    type: String,
    required: true
  },
  url: String,
  raceName: String,
  circuit: circuitSchema,
  date: String,
  time: String,
  results: [resultSchema],
  laps: [lapSchema],
  pitStops: [pitStopSchema],
  firstPractice: {
    date: String,
    time: String
  },
  secondPractice: {
    date: String,
    time: String
  },
  thirdPractice: {
    date: String,
    time: String
  },
  qualifying: {
    date: String,
    time: String
  },
  sprint: {
    date: String,
    time: String
  }
}, { timestamps: true });

// Create a compound index for season and round to ensure uniqueness
raceSchema.index({ season: 1, round: 1 }, { unique: true });

// Add any instance methods or static methods if needed
raceSchema.statics.findBySeasonAndRound = function(season, round) {
  return this.findOne({ season, round })
    // .populate({
    //   path: 'results.driverId',
    //   model: 'Driver',
    //   select: 'driverId givenName familyName code nationality dateOfBirth permanentNumber url',
    //   match: { driverId: { $exists: true } }
    // })
    // .populate({
    //   path: 'results.constructorId',
    //   model: 'Constructor',
    //   select: 'constructorId name nationality url',
    //   match: { constructorId: { $exists: true } }
    // });
};

// Add a static method for finding by season
raceSchema.statics.findBySeason = function(season) {
  return this.find({ season })
    .sort({ round: 1 })
    // .populate({
    //   path: 'results.driverId',
    //   model: 'Driver',
    //   select: 'driverId givenName familyName code nationality dateOfBirth permanentNumber url',
    //   match: { driverId: { $exists: true } }
    // })
    // .populate({
    //   path: 'results.constructorId',
    //   model: 'Constructor',
    //   select: 'constructorId name nationality url',
    //   match: { constructorId: { $exists: true } }
    // });
};

const Race = mongoose.model('Race', raceSchema);

export default Race; 