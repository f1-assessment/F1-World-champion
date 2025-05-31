# Lap Data API Endpoints

This document describes the lap data endpoints added to the F1 World Champion backend API.

## External API Integration

The backend integrates with the following external API endpoint for lap data:
```
https://api.jolpi.ca/ergast/f1/{year}/{round}/laps
```

## Backend API Endpoints

### 1. Get All Lap Data for a Race

**Endpoint:** `GET /api/races/season/{year}/round/{round}/laps`

**Description:** Retrieves all lap data for a specific race. If the data isn't in the database, it fetches from the external API and stores it.

**Parameters:**
- `year` (string): The season year (e.g., "2025")
- `round` (string): The race round number (e.g., "1")

**Response Example:**
```json
{
  "season": "2025",
  "round": "1",
  "laps": [
    {
      "number": "1",
      "timings": [
        {
          "driverId": "norris",
          "position": "1",
          "time": "1:57.099"
        },
        {
          "driverId": "max_verstappen",
          "position": "2",
          "time": "1:59.392"
        }
      ]
    },
    {
      "number": "2",
      "timings": [
        {
          "driverId": "norris",
          "position": "1",
          "time": "2:49.888"
        }
      ]
    }
  ]
}
```

**Status Codes:**
- `200 OK`: Successfully retrieved lap data
- `404 Not Found`: No lap data found for the specified race
- `500 Internal Server Error`: Failed to fetch lap data

---

### 2. Get Lap Data for Specific Lap Number

**Endpoint:** `GET /api/races/season/{year}/round/{round}/laps/{lapNumber}`

**Description:** Retrieves lap data for a specific lap number in a race.

**Parameters:**
- `year` (string): The season year (e.g., "2025")
- `round` (string): The race round number (e.g., "1")
- `lapNumber` (string): The specific lap number (e.g., "1")

**Response Example:**
```json
{
  "season": "2025",
  "round": "1",
  "lapNumber": "1",
  "lap": {
    "number": "1",
    "timings": [
      {
        "driverId": "norris",
        "position": "1",
        "time": "1:57.099"
      },
      {
        "driverId": "max_verstappen",
        "position": "2",
        "time": "1:59.392"
      }
    ]
  }
}
```

**Status Codes:**
- `200 OK`: Successfully retrieved lap data for specific lap
- `404 Not Found`: No data found for the specified lap
- `500 Internal Server Error`: Failed to fetch lap data

---

### 3. Update Lap Data for a Race

**Endpoint:** `POST /api/races/season/{year}/round/{round}/laps/update`

**Description:** Forces an update of lap data for a specific race by fetching fresh data from the external API.

**Parameters:**
- `year` (string): The season year (e.g., "2025")
- `round` (string): The race round number (e.g., "1")

**Response Example:**
```json
{
  "message": "Successfully updated lap data for 2025 round 1",
  "season": "2025",
  "round": "1",
  "lapsCount": 58
}
```

**Status Codes:**
- `200 OK`: Successfully updated lap data
- `404 Not Found`: No race found for the specified season and round
- `500 Internal Server Error`: Failed to update lap data

---

## Frontend API Client Methods

The following methods are available in the frontend `apiClient`:

```typescript
// Lap Data endpoints
async getLapData(year: number, round: number): Promise<any>
async getLapDataByLapNumber(year: number, round: number, lapNumber: number): Promise<any>
async updateLapData(year: number, round: number): Promise<any>
```

## Data Structure

### Lap Data Schema

The lap data follows this structure:

```typescript
interface LapData {
  number: string;
  timings: LapTiming[];
}

interface LapTiming {
  driverId: string;
  position: string;
  time: string;
}
```

**Field Descriptions:**
- `number`: The lap number
- `timings`: Array of timing data for each driver on this lap
  - `driverId`: The unique identifier for the driver
  - `position`: The driver's position during this lap
  - `time`: The cumulative race time at the end of this lap

### External API Response Schema

The external API returns data in this format:

```typescript
interface LapDataApiResponse {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    RaceTable: {
      season: string;
      round: string;
      Races: Array<{
        season: string;
        round: string;
        url: string;
        raceName: string;
        Circuit: {
          circuitId: string;
          url: string;
          circuitName: string;
          Location: {
            lat: string;
            long: string;
            locality: string;
            country: string;
          };
        };
        date: string;
        time: string;
        Laps: Array<{
          number: string;
          Timings: Array<{
            driverId: string;
            position: string;
            time: string;
          }>;
        }>;
      }>;
    };
  };
}
```

**Note:** The external API returns `Timings` (capital T), but the frontend normalizes this to `timings` (lowercase t).

## Usage Examples

### Fetch all lap data for Australian Grand Prix 2025
```bash
GET /api/races/season/2025/round/1/laps
```

### Get lap data for lap 10 in Australian Grand Prix 2025
```bash
GET /api/races/season/2025/round/1/laps/10
```

### Force update lap data for Australian Grand Prix 2025
```bash
POST /api/races/season/2025/round/1/laps/update
```

## Lap Data Analysis Features

The lap data enables various analyses:
- **Lap Time Progression**: Track how drivers' pace changes throughout the race
- **Position Changes**: See how drivers move up and down the field
- **Fastest Laps**: Identify which drivers set the fastest times on specific laps
- **Stint Analysis**: Analyze performance between pitstops
- **Race Strategy**: Understand how different strategies played out

## Common Lap Time Formats

- **Cumulative Time**: Total race time from start (e.g., "1:23:45.123")
- **Lap Time**: Time for individual lap (e.g., "1:23.456")
- **Position**: Driver's position at end of lap (1st, 2nd, etc.)

## Error Handling

All endpoints include proper error handling:
- Invalid parameters return appropriate error messages
- Missing data returns 404 status codes (for race-level endpoints)
- Lap-specific queries return null if lap not found
- External API failures are caught and logged
- Database errors are handled gracefully

## Performance Considerations

- Lap data is cached in the database after first fetch
- Only fetches from external API if data doesn't exist locally
- Update endpoint allows forcing refresh of cached data
- Lap-specific queries filter cached data efficiently
- Large datasets are paginated when necessary 