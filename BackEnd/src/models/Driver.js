import mongoose from 'mongoose';

// Define the driver schema based on the API response structure
const driverSchema = new mongoose.Schema({
  driverId: String,
  permanentNumber: String,
  code: String,
  url: String,
  givenName: String,
  familyName: String,
  dateOfBirth: String,
  nationality: String
}, { timestamps: true });

// Create a virtual fullName property
driverSchema.virtual('fullName').get(function() {
  return `${this.givenName} ${this.familyName}`;
});

// Add any instance methods or static methods if needed
driverSchema.statics.findByDriverId = function(driverId) {
  return this.findOne({ driverId });
};

const Driver = mongoose.model('Driver', driverSchema);

export default Driver; 