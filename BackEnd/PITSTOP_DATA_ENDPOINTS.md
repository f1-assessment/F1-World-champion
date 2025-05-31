# PitStop Data API Endpoints

This document describes the pitstop data endpoints added to the F1 World Champion backend API.

## External API Integration

The backend integrates with the following external API endpoint for pitstop data:
```
https://api.jolpi.ca/ergast/f1/{year}/{round}/pitstops
```

## Backend API Endpoints

### 1. Get All PitStop Data for a Race

**Endpoint:** `GET /api/races/season/{year}/round/{round}/pitstops`

**Description:** Retrieves all pitstop data for a specific race. If the data isn't in the database, it fetches from the external API and stores it.

**Parameters:**
- `year` (string): The season year (e.g., "2025")
- `round` (string): The race round number (e.g., "1")

**Response Example:**
```json
{
  "season": "2025",
  "round": "1",
  "pitStops": [
    {
      "driverId": "norris",
      "lap": "2",
      "stop": "1",
      "time": "15:22:58",
      "duration": "13.341"
    },
    {
      "driverId": "max_verstappen",
      "lap": "2",
      "stop": "1",
      "time": "15:23:00",
      "duration": "13.416"
    }
  ]
}
```

**Status Codes:**
- `200 OK`: Successfully retrieved pitstop data
- `404 Not Found`: No pitstop data found for the specified race
- `500 Internal Server Error`: Failed to fetch pitstop data

---

### 2. Get PitStop Data for Specific Driver

**Endpoint:** `GET /api/races/season/{year}/round/{round}/pitstops/driver/{driverId}`

**Description:** Retrieves all pitstop data for a specific driver in a race.

**Parameters:**
- `year` (string): The season year (e.g., "2025")
- `round` (string): The race round number (e.g., "1")
- `driverId` (string): The driver ID (e.g., "norris")

**Response Example:**
```json
{
  "season": "2025",
  "round": "1",
  "driverId": "norris",
  "pitStops": [
    {
      "driverId": "norris",
      "lap": "2",
      "stop": "1",
      "time": "15:22:58",
      "duration": "13.341"
    },
    {
      "driverId": "norris",
      "lap": "25",
      "stop": "2",
      "time": "16:15:40",
      "duration": "12.910"
    }
  ],
  "pitStopsCount": 2
}
```

**Status Codes:**
- `200 OK`: Successfully retrieved pitstop data for driver
- `500 Internal Server Error`: Failed to fetch pitstop data

---

### 3. Update PitStop Data for a Race

**Endpoint:** `POST /api/races/season/{year}/round/{round}/pitstops/update`

**Description:** Forces an update of pitstop data for a specific race by fetching fresh data from the external API.

**Parameters:**
- `year` (string): The season year (e.g., "2025")
- `round` (string): The race round number (e.g., "1")

**Response Example:**
```json
{
  "message": "Successfully updated pitstop data for 2025 round 1",
  "season": "2025",
  "round": "1",
  "pitStopsCount": 42
}
```

**Status Codes:**
- `200 OK`: Successfully updated pitstop data
- `404 Not Found`: No race found for the specified season and round
- `500 Internal Server Error`: Failed to update pitstop data

---

## Frontend API Client Methods

The following methods are available in the frontend `apiClient`:

```typescript
// PitStop Data endpoints
async getPitStopData(year: number, round: number): Promise<any>
async getPitStopDataByDriver(year: number, round: number, driverId: string): Promise<any>
async updatePitStopData(year: number, round: number): Promise<any>
```

## Data Structure

### PitStop Data Schema

The pitstop data follows this structure:

```typescript
interface PitStop {
  driverId: string;
  lap: string;
  stop: string;
  time: string;
  duration: string;
}
```

**Field Descriptions:**
- `driverId`: The unique identifier for the driver
- `lap`: The lap number when the pitstop occurred
- `stop`: The pitstop number for this driver (1st, 2nd, etc.)
- `time`: The time when the pitstop occurred (race time)
- `duration`: The duration of the pitstop in seconds

### External API Response Schema

The external API returns data in this format:

```typescript
interface PitStopDataApiResponse {
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
        PitStops: Array<{
          driverId: string;
          lap: string;
          stop: string;
          time: string;
          duration: string;
        }>;
      }>;
    };
  };
}
```

## Usage Examples

### Fetch all pitstop data for Australian Grand Prix 2025
```bash
GET /api/races/season/2025/round/1/pitstops
```

### Get pitstop data for Lando Norris in Australian Grand Prix 2025
```bash
GET /api/races/season/2025/round/1/pitstops/driver/norris
```

### Force update pitstop data for Australian Grand Prix 2025
```bash
POST /api/races/season/2025/round/1/pitstops/update
```

## Pitstop Analysis Features

The pitstop data enables various analyses:
- **Fastest Pitstops**: Compare pitstop durations across drivers and teams
- **Pitstop Strategy**: Analyze when drivers made their pitstops (lap numbers)
- **Multiple Stops**: Track how many pitstops each driver made
- **Team Performance**: Compare pitstop efficiency between constructors

## Common Pitstop Metrics

- **Duration**: Time spent in pitlane (typically 12-17 seconds in modern F1)
- **Strategy**: Early vs late pitstops affect race outcome
- **Multiple Stops**: Some drivers may pit multiple times per race
- **Time of Day**: Actual clock time when pitstop occurred

## Error Handling

All endpoints include proper error handling:
- Invalid parameters return appropriate error messages
- Missing data returns 404 status codes (for race-level endpoints)
- Driver-specific queries return empty arrays if no pitstops found
- External API failures are caught and logged
- Database errors are handled gracefully

## Performance Considerations

- Pitstop data is cached in the database after first fetch
- Only fetches from external API if data doesn't exist locally
- Update endpoint allows forcing refresh of cached data
- Driver-specific queries filter cached data efficiently
- Efficient database queries using compound indexes 