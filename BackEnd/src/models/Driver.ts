import mongoose, { Model, Schema } from 'mongoose';
import { IDriver, IDriverModel } from '../types';

// Define the driver schema based on the API response structure
const driverSchema = new Schema<IDriver>({
  driverId: {
    type: String,
    required: true
  },
  permanentNumber: String,
  code: String,
  url: String,
  givenName: {
    type: String,
    required: true
  },
  familyName: {
    type: String,
    required: true
  },
  dateOfBirth: String,
  nationality: String
}, { timestamps: true });

// Create a virtual fullName property
driverSchema.virtual('fullName').get(function(this: IDriver): string {
  return `${this.givenName} ${this.familyName}`;
});

// Add any instance methods or static methods if needed
driverSchema.statics.findByDriverId = function(this: Model<IDriver>, driverId: string): Promise<IDriver | null> {
  return this.findOne({ driverId });
};

// Ensure virtual fields are serialized
driverSchema.set('toJSON', { virtuals: true });
driverSchema.set('toObject', { virtuals: true });

// Create and export the model with proper typing
type DriverModel = Model<IDriver> & IDriverModel;

const Driver = mongoose.model<IDriver, DriverModel>('Driver', driverSchema);

export default Driver; 