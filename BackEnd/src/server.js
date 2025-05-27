import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/database.js';
import routes from './routes/index.js';
import * as dotenv from 'dotenv';
dotenv.config();
// Initialize express app
const PORT = process.env.PORT || 5000;
console.log( process.env.PORT);
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


// API routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to F1 World Champion API',
    docs: '/api/health'
  });
});

console.log('✅ Loaded ENV vars:');
console.log({
  MONGO_URI: process.env.MONGO_URI,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT
});


// Connect to MongoDB and start server
const startServer = async () => {
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