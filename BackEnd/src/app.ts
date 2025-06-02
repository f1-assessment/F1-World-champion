import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import routes from './routes/index.js';

// Initialize express app
const app: express.Application = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'F1 World Champions API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
  },
}));

// API routes
app.use('/api', routes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to F1 World Champion API',
    version: '1.0.0',
    status: 'active',
    documentation: '/api-docs',
    endpoints: {
      drivers: '/api/drivers',
      constructors: '/api/constructors',
      championships: '/api/championships',
      races: '/api/races'
    }
  });
});

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.originalUrl} does not exist`,
    documentation: '/api-docs',
    availableEndpoints: {
      drivers: '/api/drivers',
      constructors: '/api/constructors', 
      championships: '/api/championships',
      races: '/api/races'
    }
  });
});

// Error handling middleware
app.use((error: any, req: Request, res: Response, next: any) => {
  console.error('Global error handler:', error);
  
  // Handle JSON parsing errors
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({
      error: 'Invalid JSON format',
      message: 'Please check your request body syntax'
    });
  }
  
  // Default error response
  return res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on our end'
  });
});

export default app; 