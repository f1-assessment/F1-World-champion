# F1 Seasons API Endpoints Documentation

This document provides comprehensive documentation for the F1 seasons API endpoints in the backend.

## Overview

The seasons API provides access to Formula 1 season data from 1950 to present. It fetches data from the external Ergast F1 API and provides filtering and update capabilities.

**Base URL**: `/api/races`

**External API**: `https://api.jolpi.ca/ergast/f1/seasons`

---

## 📋 API Endpoints

### 1. Get All Seasons Data

Retrieves all available F1 seasons data.

```http
GET /api/races/seasons
```

**Response Format:**
```json
{
  "message": "Seasons data retrieved successfully",
  "total": 76,
  "seasons": [
    {
      "season": "2025",
      "url": "https://en.wikipedia.org/wiki/2025_Formula_One_season"
    },
    {
      "season": "2024",
      "url": "https://en.wikipedia.org/wiki/2024_Formula_One_season"
    }
  ]
}
```

**Response Codes:**
- `200` - Success
- `404` - No seasons data found
- `500` - Server error

---

### 2. Get Filtered Seasons Data

Retrieves seasons data with optional filtering parameters.

```http
GET /api/races/seasons/filter?startYear=2020&endYear=2024&limit=10
```

**Query Parameters:**
- `startYear` (optional) - Filter seasons from this year (inclusive)
- `endYear` (optional) - Filter seasons up to this year (inclusive)  
- `limit` (optional) - Maximum number of seasons to return

**Examples:**

Get last 10 seasons:
```http
GET /api/races/seasons/filter?limit=10
```

Get seasons from 2010 to 2020:
```http
GET /api/races/seasons/filter?startYear=2010&endYear=2020
```

Get seasons from 2000 onwards, limited to 15:
```http
GET /api/races/seasons/filter?startYear=2000&limit=15
```

**Response Format:**
```json
{
  "message": "Filtered seasons data retrieved successfully",
  "filters": {
    "startYear": 2020,
    "endYear": 2024,
    "limit": 10
  },
  "total": 5,
  "seasons": [
    {
      "season": "2024",
      "url": "https://en.wikipedia.org/wiki/2024_Formula_One_season"
    },
    {
      "season": "2023",
      "url": "https://en.wikipedia.org/wiki/2023_Formula_One_season"
    }
  ]
}
```

**Response Codes:**
- `200` - Success
- `400` - Invalid query parameters
- `404` - No seasons found for criteria
- `500` - Server error

---

### 3. Update Seasons Data

Forces a refresh of seasons data from the external API.

```http
POST /api/races/seasons/update
```

**Response Format:**
```json
{
  "message": "Successfully updated seasons data",
  "total": 76,
  "seasons": [
    {
      "season": "2025",
      "url": "https://en.wikipedia.org/wiki/2025_Formula_One_season"
    }
  ]
}
```

**Response Codes:**
- `200` - Successfully updated
- `500` - Update failed

---

## 🔧 Backend Implementation Details

### Service Functions

**File**: `src/services/raceService.ts`

```typescript
// Fetch seasons data from external API
export const fetchSeasonsDataFromAPI = async (): Promise<any[] | null>

// Get all seasons data
export const getSeasonsData = async (): Promise<any[]>

// Update seasons data
export const updateSeasonsData = async (): Promise<any[]>

// Get filtered seasons data
export const getFilteredSeasonsData = async (
  startYear?: number,
  endYear?: number,
  limit?: number
): Promise<any[]>
```

### Controller Functions

**File**: `src/controllers/raceController.ts`

```typescript
// Get all seasons data
export const getSeasonsData = async (req: Request, res: Response): Promise<void>

// Update seasons data
export const updateSeasonsData = async (req: Request, res: Response): Promise<void>

// Get filtered seasons data
export const getFilteredSeasonsData = async (req: Request, res: Response): Promise<void>
```

### Routes Configuration

**File**: `src/routes/raceRoutes.ts`

```typescript
// Get all seasons data
router.get('/seasons', raceController.getSeasonsData);

// Get filtered seasons data
router.get('/seasons/filter', raceController.getFilteredSeasonsData);

// Update seasons data
router.post('/seasons/update', raceController.updateSeasonsData);
```

---

## 📊 Data Structure

### Season Object

```typescript
interface Season {
  season: string;        // Year as string (e.g., "2024")
  url: string;          // Wikipedia URL for the season
}
```

### API Response Type

```typescript
interface SeasonDataApiResponse {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    SeasonTable: {
      Seasons: Array<{
        season: string;
        url: string;
      }>;
    };
  };
}
```

---

## 🎯 Usage Examples

### JavaScript/Node.js

```javascript
// Get all seasons
const response = await fetch('/api/races/seasons');
const data = await response.json();
console.log(`Found ${data.total} seasons`);

// Get recent seasons (last 5)
const recentSeasons = await fetch('/api/races/seasons/filter?limit=5');
const recentData = await recentSeasons.json();

// Get seasons from 2010-2020
const decadeSeasons = await fetch('/api/races/seasons/filter?startYear=2010&endYear=2020');
const decadeData = await decadeSeasons.json();

// Update seasons data
const updateResponse = await fetch('/api/races/seasons/update', {
  method: 'POST'
});
const updateData = await updateResponse.json();
```

### cURL Commands

```bash
# Get all seasons
curl -X GET "http://localhost:3001/api/races/seasons"

# Get filtered seasons
curl -X GET "http://localhost:3001/api/races/seasons/filter?startYear=2020&limit=5"

# Update seasons data
curl -X POST "http://localhost:3001/api/races/seasons/update"
```

---

## ⚠️ Error Handling

### Common Error Responses

```json
// 400 - Bad Request
{
  "error": "Invalid startYear parameter"
}

// 404 - Not Found
{
  "error": "No seasons data found for the specified criteria"
}

// 500 - Server Error
{
  "error": "Failed to fetch seasons data"
}
```

### Error Scenarios

1. **Invalid Query Parameters**: Non-numeric values for year parameters
2. **External API Unavailable**: Ergast API is down or unreachable
3. **Network Issues**: Timeout or connection problems
4. **No Data Found**: No seasons match the filtering criteria

---

## 🚀 Performance Notes

- **Caching**: Currently fetches directly from external API (future enhancement: database caching)
- **Rate Limiting**: Respects external API rate limits
- **Sorting**: Results are sorted by year (descending by default)
- **Filtering**: Applied server-side for optimal performance

---

## 🔮 Future Enhancements

1. **Database Caching**: Store seasons data in MongoDB for faster access
2. **Pagination**: Add pagination support for large result sets
3. **Season Details**: Extend to include more detailed season information
4. **Search**: Add text search functionality for season names/years
5. **Analytics**: Add season statistics and comparisons

---

## 📝 Dependencies

- **axios**: HTTP client for external API calls
- **express**: Web framework for routing
- **mongoose**: MongoDB ODM (for future caching)
- **typescript**: Type safety and interfaces

---

This implementation provides a solid foundation for F1 seasons data management with room for future expansion and optimization. 