# F1 World Champion

A modern SPA for exploring Formula 1 World Championship data, built with Next.js, Redux, Redux ToolKit, TailwindCSS, Express.js, MongoDB, and Mongoose.

## Project Structure

This is a monorepo containing:

1. **Frontend** - Next.js application with modern animations and UI inspired by ready.so
2. **Backend** - Express.js API with MongoDB database following 3-layer architecture

## Technologies Used

### Frontend
- **Next.js** - React framework
- **Redux** & **Redux Toolkit** - State management
- **TailwindCSS** - Styling
- **Framer Motion** - Animations

### Backend
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **TypeScript** - Type safety

## Architecture

### Backend Architecture (3-Layer)

1. **Presentation Layer** - Routes and controllers that handle HTTP requests and responses
2. **Business Layer** - Services that implement application logic
3. **Data Access Layer** - Models that interact with the database

### SOLID Principles

The application adheres to SOLID principles:
- **Single Responsibility** - Each class has a single responsibility
- **Open/Closed** - Open for extension, closed for modification
- **Liskov Substitution** - Derived classes are substitutable for their base classes
- **Interface Segregation** - Small, specific interfaces
- **Dependency Inversion** - Depend on abstractions, not concretions

## Year Restrictions (2005+)

🚨 **Important**: All API endpoints are restricted to **2005 season onwards** to ensure data consistency and focus on the modern era of Formula 1.

### Affected Data
- **Drivers**: Only drivers who participated in races from 2005 onwards
- **Championships**: World championship data from 2005 to present
- **Races**: Race data and results from 2005 onwards
- **Constructors**: Constructor data from the modern era

### API Examples
```bash
# ✅ Valid requests (2005+)
GET /api/drivers/season/2010
GET /api/drivers?fromYear=2005&toYear=2020
GET /api/championships/2023

# ❌ Invalid requests (before 2005)
GET /api/drivers/season/2004  # Returns 400 error
GET /api/championships/2003   # Returns 400 error
```

For detailed information about year restrictions, see [`BackEnd/API_RESTRICTIONS.md`](BackEnd/API_RESTRICTIONS.md).

## Setup & Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)

### MongoDB Setup Options

#### Option 1: Local MongoDB
- Install MongoDB locally
- Start MongoDB service
- Use connection string: `mongodb://localhost:27017/f1_championship`

#### Option 2: MongoDB Atlas (Cloud)
1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. In the Atlas dashboard, click "Connect" for your cluster
4. Choose "Connect your application"
5. Copy the connection string which looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.fn3feji.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
6. Replace `<username>` with your MongoDB Atlas username
7. Replace `<password>` with your actual password
8. Ensure your IP address is whitelisted in Network Access settings

### Backend Setup
1. Navigate to the backend directory: `cd BackEnd`
2. Install dependencies: `npm install`
3. Create `.env` file with:
   ```
   PORT=5001
   # For local MongoDB:
   MONGO_URI=mongodb://localhost:27017/f1_championship
   # OR for MongoDB Atlas:
   MONGO_URI=mongodb+srv://yourusername:yourpassword@cluster0.fn3feji.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   NODE_ENV=development
   ```
4. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to the frontend directory: `cd FrontEnd/app`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open http://localhost:3000 in your browser

## API Endpoints

### Drivers
- `GET /api/drivers` - Get all drivers (2005+) with optional year filtering
- `GET /api/drivers/season/:year` - Get drivers for specific season (2005+)
- `GET /api/drivers/:driverId` - Get specific driver details

### Championships
- `GET /api/championships` - Get all championships (2005+)
- `GET /api/championships/:year` - Get championship for specific year (2005+)
- `POST /api/championships/update` - Update all championship data (2005+)

### Query Parameters
- `fromYear` - Starting year (minimum: 2005)
- `toYear` - Ending year (maximum: current year)

Example: `/api/drivers?fromYear=2010&toYear=2020`

## Features

- View F1 World Champions from 2005 to present
- Explore race winners for each season
- View detailed information about drivers and constructors
- Beautiful animations and modern UI
- Responsive design for all device sizes
- **Year-based filtering** with validation
- **Real-time data updates** from external APIs
- **Comprehensive error handling** for invalid year ranges

## Data Source

The application fetches data from:
1. Ergast F1 API for initial data (filtered to 2005+)
2. Custom backend API for cached data stored in MongoDB

## Testing

To test the year restrictions:
1. Start the backend server: `npm run dev`
2. Open `BackEnd/test-restrictions.js` in a browser console or Node.js 18+
3. The script will test various year combinations and validate restrictions

## License

MIT 