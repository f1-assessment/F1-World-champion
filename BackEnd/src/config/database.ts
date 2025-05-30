import mongoose from 'mongoose';

// Function to connect to MongoDB
const connectDB = async (): Promise<typeof mongoose> => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI: string | undefined = process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    const conn = await mongoose.connect(mongoURI, {
      dbName: process.env.MONGO_DB_NAME || 'f1_championship'
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error connecting to MongoDB: ${errorMessage}`);
    process.exit(1);
  }
};

export default connectDB; 