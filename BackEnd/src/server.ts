import app from './app.js';
import connectDB from './config/database.js';
import * as dotenv from 'dotenv';
dotenv.config();

// Get port from environment
const PORT: number = parseInt(process.env.PORT || '5000', 10);

console.log(process.env.PORT);

// Connect to MongoDB and start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 