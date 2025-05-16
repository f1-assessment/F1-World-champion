# Ergast F1 API Research

## Overview

The Ergast F1 API is a comprehensive RESTful web service that provides historical Formula One racing data from 1950 to the present. The API is currently being transitioned to a new service called Jolpica, which maintains backward compatibility with the original Ergast API endpoints.

**Important Note:** The Ergast API is deprecated and will not be updated beyond the 2024 season, with shutdown expected in early 2025. The successor API, Jolpica, is available at `https://api.jolpi.ca/ergast/`.

## Base URL

- Original Ergast API: `http://ergast.com/api/f1/`
- Jolpica API (replacement): `https://api.jolpi.ca/ergast/f1/`

## Key Endpoints for F1 Champions App

### 1. World Champions (2005-Present)

To retrieve the F1 World Champion for a specific season:

```
GET /f1/{year}/driverStandings/1.json
```

Example:
```
https://api.jolpi.ca/ergast/f1/2005/driverStandings/1.json
```

This returns the driver who finished in position 1 in the championship for the specified season.

### 2. Race Winners for a Season

To retrieve all race winners for a specific season:

```
GET /f1/{year}/results/1.json
```

Example:
```
https://api.jolpi.ca/ergast/f1/2005/results/1.json
```

This returns all drivers who finished in position 1 (race winners) for each race in the specified season.

### 3. Race Schedule for a Season

To retrieve the race schedule for a specific season:

```
GET /f1/{year}.json
```

Example:
```
https://api.jolpi.ca/ergast/f1/2005.json
```

## Response Structure

### World Champion Response Structure

```json
{
  "MRData": {
    "xmlns": "",
    "series": "f1",
    "url": "https://api.jolpi.ca/ergast/f1/2005/driverstandings/1.json",
    "limit": "30",
    "offset": "0",
    "total": "1",
    "StandingsTable": {
      "driverStandings": "1",
      "season": "2005",
      "round": "19",
      "StandingsLists": [
        {
          "season": "2005",
          "round": "19",
          "DriverStandings": [
            {
              "position": "1",
              "positionText": "1",
              "points": "133",
              "wins": "7",
              "Driver": {
                "driverId": "alonso",
                "permanentNumber": "14",
                "code": "ALO",
                "url": "http://en.wikipedia.org/wiki/Fernando_Alonso",
                "givenName": "Fernando",
                "familyName": "Alonso",
                "dateOfBirth": "1981-07-29",
                "nationality": "Spanish"
              },
              "Constructors": [
                {
                  "constructorId": "renault",
                  "url": "http://en.wikipedia.org/wiki/Renault_in_Formula_One",
                  "name": "Renault",
                  "nationality": "French"
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
```

### Race Winners Response Structure

```json
{
  "MRData": {
    "xmlns": "",
    "series": "f1",
    "url": "https://api.jolpi.ca/ergast/f1/2005/results/1.json",
    "limit": "30",
    "offset": "0",
    "total": "19",
    "RaceTable": {
      "position": "1",
      "season": "2005",
      "Races": [
        {
          "season": "2005",
          "round": "1",
          "url": "https://en.wikipedia.org/wiki/2005_Australian_Grand_Prix",
          "raceName": "Australian Grand Prix",
          "Circuit": {
            "circuitId": "albert_park",
            "url": "https://en.wikipedia.org/wiki/Albert_Park_Circuit",
            "circuitName": "Albert Park Grand Prix Circuit",
            "Location": {
              "lat": "-37.8497",
              "long": "144.968",
              "locality": "Melbourne",
              "country": "Australia"
            }
          },
          "date": "2005-03-06",
          "time": "14:00:00Z",
          "Results": [
            {
              "number": "6",
              "position": "1",
              "positionText": "1",
              "points": "10",
              "Driver": {
                "driverId": "fisichella",
                "code": "FIS",
                "url": "http://en.wikipedia.org/wiki/Giancarlo_Fisichella",
                "givenName": "Giancarlo",
                "familyName": "Fisichella",
                "dateOfBirth": "1973-01-14",
                "nationality": "Italian"
              },
              "Constructor": {
                "constructorId": "renault",
                "url": "http://en.wikipedia.org/wiki/Renault_in_Formula_One",
                "name": "Renault",
                "nationality": "French"
              },
              "grid": "1",
              "laps": "57",
              "status": "Finished",
              "Time": {
                "millis": "5057336",
                "time": "1:24:17.336"
              },
              "FastestLap": {
                "rank": "2",
                "lap": "55",
                "Time": {
                  "time": "1:25.994"
                },
                "AverageSpeed": {
                  "units": "kph",
                  "speed": "222.001"
                }
              }
            }
          ]
        }
        // Additional races...
      ]
    }
  }
}
```

## Key Data Fields

### Driver Information
- `driverId`: Unique identifier for the driver
- `code`: Three-letter code for the driver (e.g., "ALO" for Alonso)
- `givenName`: Driver's first name
- `familyName`: Driver's last name
- `nationality`: Driver's nationality
- `dateOfBirth`: Driver's date of birth
- `permanentNumber`: Driver's permanent number (if applicable)

### Constructor Information
- `constructorId`: Unique identifier for the constructor (team)
- `name`: Constructor's name
- `nationality`: Constructor's nationality

### Race Information
- `season`: Year of the season
- `round`: Race number within the season
- `raceName`: Name of the Grand Prix
- `date`: Race date
- `time`: Race start time (UTC)
- `Circuit`: Information about the circuit where the race was held

### Results Information
- `position`: Finishing position
- `positionText`: Text representation of the position (can include "R" for retired, "D" for disqualified, etc.)
- `points`: Points awarded for the result
- `grid`: Starting grid position
- `laps`: Number of laps completed
- `status`: Race finish status (e.g., "Finished", "Accident", etc.)
- `Time`: Race time information

## Pagination and Query Parameters

The API supports pagination through the following query parameters:

- `limit`: Maximum number of results to return (default: 30, maximum: 100)
- `offset`: Offset into the result set (default: 0)

Example:
```
https://api.jolpi.ca/ergast/f1/2005/results.json?limit=10&offset=5
```

## Rate Limiting and Caching

- Applications exceeding rate limits are automatically blocked for 24 hours
- Maximum `limit` parameter value is 100 results per request
- Implementing caching is recommended to reduce the number of API calls

## Implementation Considerations

1. **Fetching World Champions (2005-Present)**
   - Make individual API calls for each year from 2005 to the current year
   - Extract the champion's information from each response
   - Store the data in a structured format for display

2. **Fetching Race Winners**
   - For each season, fetch all race winners using the results endpoint
   - Match race winners against the season's champion to highlight races won by the champion
   - Store race results in a database for persistence

3. **Error Handling**
   - Implement proper error handling for API requests
   - Consider implementing retry logic with exponential backoff for failed requests
   - Handle edge cases such as seasons in progress or missing data

4. **Caching Strategy**
   - Implement client-side caching for historical data that doesn't change
   - Use conditional requests (If-Modified-Since, ETag) for data that might be updated

## References

- [Ergast Developer API Documentation](http://ergast.com/mrd/)
- [Ergast API Standings Documentation](http://ergast.com/mrd/methods/standings/)
- [Ergast API Results Documentation](http://ergast.com/mrd/methods/results/)
- [Jolpica F1 API](https://api.jolpi.ca/ergast/)
