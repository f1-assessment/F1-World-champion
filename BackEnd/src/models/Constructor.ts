import mongoose, { Model, Schema } from 'mongoose';
import { IConstructor, IConstructorModel } from '../types';

// Define the constructor schema based on the API response structure
const constructorSchema = new Schema<IConstructor>({
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
constructorSchema.statics.findByConstructorId = function(this: Model<IConstructor>, constructorId: string): Promise<IConstructor | null> {
  return this.findOne({ constructorId });
};

// Create and export the model with proper typing
type ConstructorModel = Model<IConstructor> & IConstructorModel;

const Constructor = mongoose.model<IConstructor, ConstructorModel>('Constructor', constructorSchema);

export default Constructor; 