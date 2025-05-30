import mongoose, { Model, Schema } from 'mongoose';
import { IRace, IRaceModel, ILocation, ICircuit, IResult, ITiming, ILap, IPitStop, ISession, ITime, IFastestLap, IAverageSpeed } from '../types/index.js';

// Define the location schema
const locationSchema = new Schema<ILocation>({
  lat: String,
  long: String,
  locality: String,
  country: String
});

// Define the circuit schema
const circuitSchema = new Schema<ICircuit>({
  circuitId: String,
  circuitName: String,
  url: String,
  location: locationSchema
});

// Define the time schema
const timeSchema = new Schema<ITime>({
  millis: String,
  time: String
});

// Define the average speed schema
const averageSpeedSchema = new Schema<IAverageSpeed>({
  units: String,
  speed: String
});

// Define the fastest lap schema
const fastestLapSchema = new Schema<IFastestLap>({
  rank: String,
  lap: String,
  time: String,
  averageSpeed: averageSpeedSchema
});

// Define the result schema
const resultSchema = new Schema<IResult>({
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
  time: timeSchema,
  fastestLap: fastestLapSchema
});

// Define the timing schema for lap times
const timingSchema = new Schema<ITiming>({
  driverId: {
    type: String,
    ref: 'Driver'
  },
  position: String,
  time: String
});

// Define the lap schema
const lapSchema = new Schema<ILap>({
  number: String,
  timings: [timingSchema]
});

// Define the pit stop schema
const pitStopSchema = new Schema<IPitStop>({
  driverId: {
    type: String,
    ref: 'Driver'
  },
  lap: String,
  stop: String,
  time: String,
  duration: String
});

// Define the session schema
const sessionSchema = new Schema<ISession>({
  date: String,
  time: String
});

// Define the race schema
const raceSchema = new Schema<IRace>({
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
  firstPractice: sessionSchema,
  secondPractice: sessionSchema,
  thirdPractice: sessionSchema,
  qualifying: sessionSchema,
  sprint: sessionSchema
}, { timestamps: true });

// Create a compound index for season and round to ensure uniqueness
raceSchema.index({ season: 1, round: 1 }, { unique: true });

// Add any instance methods or static methods if needed
raceSchema.statics.findBySeasonAndRound = function(this: Model<IRace>, season: string, round: string): Promise<IRace | null> {
  return this.findOne({ season, round });
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
raceSchema.statics.findBySeason = function(this: Model<IRace>, season: string): Promise<IRace[]> {
  return this.find({ season })
    .sort({ round: 1 });
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

// Create and export the model with proper typing
type RaceModel = Model<IRace> & IRaceModel;

const Race = mongoose.model<IRace, RaceModel>('Race', raceSchema);

export default Race; 