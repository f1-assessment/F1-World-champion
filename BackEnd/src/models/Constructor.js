import mongoose from 'mongoose';

// Define the constructor schema based on the API response structure
const constructorSchema = new mongoose.Schema({
  constructorId: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  nationality: String,
  url: String
}, { timestamps: true });

// Add any instance methods or static methods if needed
constructorSchema.statics.findByConstructorId = function(constructorId) {
  return this.findOne({ constructorId });
};

const Constructor = mongoose.model('Constructor', constructorSchema);

export default Constructor; 