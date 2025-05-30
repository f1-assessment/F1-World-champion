# F1 World Champion API - Year Restrictions

## Overview

The F1 World Champion API implements strict year restrictions to ensure data consistency and focus on the modern era of Formula 1. All API endpoints that deal with historical data are restricted to the **2005 season onwards**.

## Year Restrictions

### Starting Year: 2005
- **Constant**: `STARTING_YEAR = 2005` (defined in `src/config/constants.ts`)
- **Rationale**: Focus on the modern era of Formula 1 with consistent data quality
- **Scope**: Applies to all drivers, championships, races, and related data

### Current Year Limit
- **Dynamic**: Based on `getCurrentYear()` function
- **Scope**: Prevents fetching data for future years

## Affected Endpoints

### Driver Endpoints

#### `GET /api/drivers`
- **Default Behavior**: Returns drivers who participated in races from 2005 onwards
- **Query Parameters**:
  - `fromYear` (optional): Starting year (minimum: 2005)
  - `toYear` (optional): Ending year (maximum: current year)
- **Example**: `/api/drivers?fromYear=2010&toYear=2020`
- **Validation**:
  - `fromYear` cannot be less than 2005
  - `toYear` cannot be greater than current year
  - `fromYear` cannot be greater than `toYear`

#### `GET /api/drivers/season/:year`
- **Restriction**: Year must be between 2005 and current year
- **Returns**: Drivers who participated in the specified season
- **Example**: `/api/drivers/season/2015`

#### `GET /api/drivers/:driverId`
- **Restriction**: Only returns drivers who have participated since 2005
- **Note**: Individual driver lookup is not year-restricted but only includes drivers from the modern era

### Championship Endpoints

#### `GET /api/championships`
- **Restriction**: Only returns championships from 2005 onwards
- **Sorting**: Descending by season (newest first)

#### `GET /api/championships/:year`
- **Restriction**: Year must be between 2005 and current year
- **Auto-fetch**: If championship data doesn't exist locally, attempts to fetch from external API
- **Example**: `/api/championships/2023`

#### `POST /api/championships/update`
- **Action**: Updates all championship data from 2005 to current year
- **Response**: Returns count of updated championships and year range

### Race Endpoints

#### Race-related endpoints (if implemented)
- **Restriction**: All race data queries are limited to 2005 onwards
- **Database Queries**: Use `{ season: { $gte: "2005" } }` filter

## Database Implementation

### MongoDB Aggregation Queries

The year restrictions are implemented at the database level using MongoDB aggregation pipelines:

```javascript
// Example: Get drivers from year range
const races = await Race.aggregate([
  { 
    $match: { 
      season: { 
        $gte: startYearStr, 
        $lte: endYearStr 
      } 
    } 
  },
  { $unwind: "$results" },
  { $group: { _id: "$results.driverId" } }
]);
```

### Repository Methods

#### Driver Repository
- `findActiveDrivers()`: Drivers from 2005 onwards
- `findDriversByYearRange(startYear, endYear)`: Drivers within specified range
- `findDriversBySeason(year)`: Drivers for specific season

#### Championship Repository
- `findAll()`: All championships (filtered in service layer for 2005+)
- `findBySeason(season)`: Championship for specific season

## Error Handling

### Validation Errors (400 Bad Request)

```json
{
  "error": "Starting year cannot be before 2005"
}
```

```json
{
  "error": "Championship data is only available from 2005 onwards"
}
```

```json
{
  "error": "Year cannot be after 2024"
}
```

### Not Found Errors (404 Not Found)

```json
{
  "error": "No championship data found for 2003"
}
```

## Configuration

### Constants File: `src/config/constants.ts`

```typescript
// Years config
const STARTING_YEAR: number = 2005; // We're focusing on 2005 to present
const getCurrentYear = (): number => new Date().getFullYear();
```

### Environment Variables

No additional environment variables are required for year restrictions. The restrictions are hardcoded to ensure consistency.

## Frontend Integration

### API Calls

When making API calls from the frontend, ensure year parameters are within the valid range:

```typescript
// Valid API calls
const drivers2010 = await fetch('/api/drivers/season/2010');
const driversRange = await fetch('/api/drivers?fromYear=2005&toYear=2020');
const championship = await fetch('/api/championships/2023');

// Invalid API calls (will return 400 errors)
const driversOld = await fetch('/api/drivers/season/2004'); // Before 2005
const driversFuture = await fetch('/api/drivers/season/2030'); // Future year
```

### Error Handling

```typescript
try {
  const response = await fetch('/api/drivers/season/2004');
  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error.error);
    // Handle: "Year cannot be before 2005"
  }
} catch (error) {
  console.error('Network Error:', error);
}
```

## Data Migration

### Existing Data

If the database contains data from before 2005:
- It will be ignored by the API endpoints
- No automatic cleanup is performed
- Data remains in the database but is not accessible via API

### Future Updates

To change the starting year:
1. Update `STARTING_YEAR` constant in `src/config/constants.ts`
2. Update this documentation
3. Test all affected endpoints
4. Consider data migration if expanding the range

## Testing

### Unit Tests

Test cases should cover:
- Valid year ranges (2005 to current year)
- Invalid years (before 2005, future years)
- Edge cases (exactly 2005, current year)
- Invalid year formats (non-numeric, null, undefined)

### Integration Tests

Test the complete flow:
1. API request with various year parameters
2. Database query execution
3. Response validation
4. Error handling

## Performance Considerations

### Database Indexing

Ensure proper indexing on season fields:
```javascript
// Recommended indexes
db.races.createIndex({ "season": 1 });
db.championships.createIndex({ "season": 1 });
```

### Caching

Consider implementing caching for frequently requested year ranges to improve performance.

## Monitoring

### Logging

The API logs validation errors and successful operations:
- Invalid year requests are logged as warnings
- Successful data fetches are logged as info
- Database errors are logged as errors

### Metrics

Monitor:
- Frequency of invalid year requests
- Most requested year ranges
- Performance of year-filtered queries 