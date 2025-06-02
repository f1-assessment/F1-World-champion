# F1 World Champions API Endpoint Guide

## 🏁 Quick Start

**Base URL**: `http://localhost:5001/api`
**Documentation**: `http://localhost:5001/api-docs/`

## 🎯 Endpoint Categories

### 🏁 Race Endpoints

#### Get All Races
```http
GET /api/races/all
```
Returns all race data from the database, sorted by season (desc) and round (asc).

#### Get Current Season Races
```http
GET /api/races
GET /api/races/current
```
Returns races for the current F1 season.

#### Get Races by Season
```http
GET /api/races/season/{year}
```
**Parameters:**
- `year` (path) - Season year (e.g., "2024")

#### Get Specific Race
```http
GET /api/races/season/{year}/round/{round}
```
**Parameters:**
- `year` (path) - Season year
- `round` (path) - Race round number

#### Update Race Data
```http
POST /api/races/update/{year}
```
Fetches and updates race data from external API.

---

### 📅 Season Endpoints

#### Get All Seasons
```http
GET /api/races/seasons
```
Returns F1 seasons data from 2005 to present.

**Response:**
```json
{
  "message": "Successfully fetched seasons data",
  "total": 21,
  "seasons": [
    {
      "season": "2024",
      "url": "https://en.wikipedia.org/wiki/2024_Formula_One_World_Championship"
    }
  ]
}
```

#### Get Filtered Seasons
```http
GET /api/races/seasons/filter?startYear=2020&endYear=2024&limit=5
```
**Query Parameters:**
- `startYear` (optional) - Start year for filtering
- `endYear` (optional) - End year for filtering
- `limit` (optional) - Maximum number of seasons

#### Update Seasons Data
```http
POST /api/races/seasons/update
```
Fetches and updates seasons data from external API.

---

### ⏱️ Lap Data Endpoints

#### Get Race Lap Data
```http
GET /api/races/season/{year}/round/{round}/laps
GET /api/races/{year}/{round}/laps
```
Returns lap timing data for all drivers in a specific race.

**Response:**
```json
{
  "season": "2024",
  "round": "1",
  "laps": [
    {
      "number": "1",
      "Timings": [
        {
          "driverId": "max_verstappen",
          "position": "1",
          "time": "1:31.523"
        }
      ]
    }
  ]
}
```

#### Get Specific Lap Data
```http
GET /api/races/season/{year}/round/{round}/laps/{lapNumber}
```
Returns timing data for all drivers in a specific lap.

#### Update Lap Data
```http
POST /api/races/season/{year}/round/{round}/laps/update
```
Fetches and updates lap data from external API.

---

### 🏎️ Pit Stop Endpoints

#### Get Race Pit Stops
```http
GET /api/races/season/{year}/round/{round}/pitstops
GET /api/races/{year}/{round}/pitstops
```
Returns pit stop data for all drivers in a specific race.

**Response:**
```json
{
  "season": "2024",
  "round": "1",
  "pitStops": [
    {
      "driverId": "max_verstappen",
      "lap": "14",
      "stop": "1",
      "time": "13:52:16",
      "duration": "2.506"
    }
  ]
}
```

#### Get Driver Pit Stops
```http
GET /api/races/season/{year}/round/{round}/pitstops/driver/{driverId}
```
Returns pit stops for a specific driver in a race.

#### Update Pit Stop Data
```http
POST /api/races/season/{year}/round/{round}/pitstops/update
```
Fetches and updates pit stop data from external API.

---

### 🏆 Championship Endpoints

#### Get All Championships
```http
GET /api/championships
```
Returns all World Championship data (2005-present).

#### Get Championship by Season
```http
GET /api/championships/{year}
GET /api/championships/season/{year}
```
Returns World Championship data for a specific season.

**Response:**
```json
{
  "_id": "...",
  "season": "2024",
  "driverId": "max_verstappen",
  "constructorId": "red_bull",
  "points": "575",
  "wins": "19"
}
```

#### Update Championships
```http
POST /api/championships/update
```
Fetches and updates all championship data.

---

### 👤 Driver Endpoints

#### Get All Drivers
```http
GET /api/drivers
GET /api/drivers?year=2024
```
Returns driver data with optional year filtering.

#### Get Drivers by Season
```http
GET /api/drivers/season/{year}
```
Returns drivers who participated in a specific season.

#### Get Specific Driver
```http
GET /api/drivers/{driverId}
```
Returns detailed information for a specific driver.

**Response:**
```json
{
  "driverId": "max_verstappen",
  "permanentNumber": "1",
  "code": "VER",
  "url": "http://en.wikipedia.org/wiki/Max_Verstappen",
  "givenName": "Max",
  "familyName": "Verstappen",
  "dateOfBirth": "1997-09-30",
  "nationality": "Dutch"
}
```

---

### 🏭 Constructor Endpoints

#### Get All Constructors
```http
GET /api/constructors
```
Returns all constructor/team data.

#### Get Specific Constructor
```http
GET /api/constructors/{constructorId}
```
Returns detailed information for a specific constructor.

**Response:**
```json
{
  "constructorId": "red_bull",
  "url": "http://en.wikipedia.org/wiki/Red_Bull_Racing",
  "name": "Red Bull Racing Honda RBPT",
  "nationality": "Austrian"
}
```

---

## 🔧 Error Handling

### Standard Error Responses

#### 404 Not Found
```json
{
  "error": "No race found for 2024 round 99"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Failed to fetch race data"
}
```

#### 400 Bad Request
```json
{
  "error": "Invalid year format"
}
```

---

## 📊 Response Formats

### Standardized List Responses
```json
{
  "message": "Successfully fetched data",
  "total": 25,
  "data": [...],
  "seasons": [...],
  "laps": [...],
  "pitStops": [...]
}
```

### Individual Resource Responses
Direct object responses for single resources (races, drivers, constructors, etc.).

---

## 🚀 Usage Examples

### JavaScript/Axios
```javascript
// Get current season races
const races = await axios.get('http://localhost:5001/api/races');

// Get lap data for Bahrain GP 2024
const laps = await axios.get('http://localhost:5001/api/races/season/2024/round/1/laps');

// Get driver information
const driver = await axios.get('http://localhost:5001/api/drivers/max_verstappen');
```

### cURL
```bash
# Get all seasons
curl http://localhost:5001/api/races/seasons

# Get pit stops for a race
curl http://localhost:5001/api/races/season/2024/round/1/pitstops

# Update championship data
curl -X POST http://localhost:5001/api/championships/update
```

---

## 📝 Rate Limiting & Best Practices

- **External API Rate Limits**: Some endpoints fetch from external APIs with rate limiting
- **Caching**: Consider caching responses for better performance
- **Error Handling**: Always handle potential 404/500 errors gracefully
- **Timeout**: Set appropriate timeouts for requests (recommended: 10s+)

---

## 🌐 Additional Resources

- **Interactive Documentation**: http://localhost:5001/api-docs/
- **OpenAPI Specification**: http://localhost:5001/api-docs/swagger.json
- **External F1 Data Source**: [Jolpi Ergast F1 API](https://api.jolpi.ca/ergast/f1/)

---

**�� Happy Racing! 🏁** 