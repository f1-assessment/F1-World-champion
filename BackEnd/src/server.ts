import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/database.js';
import routes from './routes/index.js';
import * as dotenv from 'dotenv';
dotenv.config();

// Initialize express app
const PORT: number = parseInt(process.env.PORT || '5000', 10);
const app: express.Application = express();

console.log(process.env.PORT);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API routes
app.use('/api', routes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to F1 World Champion API',
    docs: '/api/health'
  });
});

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