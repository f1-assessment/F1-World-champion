# F1 World Champion Backend API

This is the RESTful API backend for the F1 World Championship application. It uses Node.js, Express, MongoDB, and Mongoose to provide data about Formula 1 championships, races, drivers, and constructors.

## Architecture

The backend follows a 3-layer architecture:

1. **Presentation Layer**: Controllers and routes that handle HTTP requests and responses
2. **Business Layer**: Services that implement the application logic
3. **Data Access Layer**: Models that interact with the MongoDB database

## Setup and Installation

### Prerequisites

- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)

### Installation Steps

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd BackEnd
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file with the following variables:
   
   #### For local MongoDB:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/f1_championship
   NODE_ENV=development
   ```
   
   #### For MongoDB Atlas:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://xlopotoon:your_password@cluster0.fn3feji.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   NODE_ENV=development
   ```
   Replace `your_password` with your actual MongoDB Atlas password.

5. Start the server:
   ```
   npm run dev
   ```

## Connecting to MongoDB Atlas

To connect to your MongoDB Atlas cluster:

1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. In the Atlas dashboard, click "Connect" for your cluster
4. Choose "Connect your application"
5. Copy the connection string
6. Update your `.env` file with the connection string, replacing `<password>` with your actual password
7. Ensure that your IP address is whitelisted in the Atlas Network Access settings

## API Endpoints

### Drivers

- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/:driverId` - Get driver by ID

### Constructors

- `GET /api/constructors` - Get all constructors
- `GET /api/constructors/:constructorId` - Get constructor by ID

### Championships

- `GET /api/championships` - Get all championships
- `GET /api/championships/:year` - Get championship by season
- `POST /api/championships/update` - Update all championships data

### Races

- `GET /api/races/season/:year` - Get races by season
- `GET /api/races/season/:year/round/:round` - Get race by season and round
- `POST /api/races/update/:year` - Update race data for a season

## Data Sources

The API fetches data from the Ergast F1 API and stores it in MongoDB for faster retrieval and to reduce the number of external API calls.

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Axios** - HTTP client for making API requests
- **dotenv** - Environment variables management
- **cors** - CORS middleware
- **morgan** - HTTP request logger middleware 