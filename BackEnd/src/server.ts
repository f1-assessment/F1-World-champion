import app from './app.js';
import connectDB from './config/database.js';
import * as dotenv from 'dotenv';
dotenv.config();

// Get port from environment (default to 5001 to match Swagger docs)
const PORT: number = parseInt(process.env.PORT || '5001', 10);

console.log(`Starting server on port ${PORT}`);

// Connect to MongoDB and start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 F1 World Champions API server running on http://localhost:${PORT}`);
      console.log(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 