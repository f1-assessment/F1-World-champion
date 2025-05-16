import { prisma } from '@/lib/prisma';
import { fetchSeasonData } from '@/lib/api';

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { year: string } }
) {
  try {
    const year = parseInt(params.year);
    
    if (isNaN(year)) {
      return Response.json({ error: 'Invalid year parameter' }, { status: 400 });
    }
    
    // Check if we have races for this season in the database
    const racesCount = await prisma.race.count({
      where: { season: year }
    });
    
    if (racesCount === 0) {
      // Fetch season data from API and store in database
      const seasonData = await fetchSeasonData(year);
      
      if (seasonData.champion) {
        // Check if driver exists
        let driver = await prisma.driver.findUnique({
          where: { id: seasonData.champion.driver.driverId }
        });
        
        if (!driver) {
          // Create driver
          driver = await prisma.driver.create({
            data: {
              id: seasonData.champion.driver.driverId,
              code: seasonData.champion.driver.code,
              givenName: seasonData.champion.driver.givenName,
              familyName: seasonData.champion.driver.familyName,
              dateOfBirth: seasonData.champion.driver.dateOfBirth,
              nationality: seasonData.champion.driver.nationality,
              permanentNumber: seasonData.champion.driver.permanentNumber,
              url: seasonData.champion.driver.url
            }
          });
        }
        
        // Check if constructor exists
        let constructor = await prisma.constructor.findUnique({
          where: { id: seasonData.champion.constructor.constructorId }
        });
        
        if (!constructor) {
          // Create constructor
          constructor = await prisma.constructor.create({
            data: {
              id: seasonData.champion.constructor.constructorId,
              name: seasonData.champion.constructor.name,
              nationality: seasonData.champion.constructor.nationality,
              url: seasonData.champion.constructor.url
            }
          });
        }
        
        // Check if championship record exists
        const championshipExists = await prisma.driver_Championship.findFirst({
          where: {
            season: year,
            driverId: seasonData.champion.driver.driverId
          }
        });
        
        if (!championshipExists) {
          // Create championship record
          await prisma.driver_Championship.create({
            data: {
              season: seasonData.champion.season,
              points: seasonData.champion.points,
              wins: seasonData.champion.wins,
              driverId: seasonData.champion.driver.driverId,
              constructorId: seasonData.champion.constructor.constructorId
            }
          });
        }
      }
      
      // Store race winners
      for (const race of seasonData.races) {
        // Check if driver exists
        let driver = await prisma.driver.findUnique({
          where: { id: race.winner.driver.driverId }
        });
        
        if (!driver) {
          // Create driver
          driver = await prisma.driver.create({
            data: {
              id: race.winner.driver.driverId,
              code: race.winner.driver.code,
              givenName: race.winner.driver.givenName,
              familyName: race.winner.driver.familyName,
              dateOfBirth: race.winner.driver.dateOfBirth,
              nationality: race.winner.driver.nationality,
              permanentNumber: race.winner.driver.permanentNumber,
              url: race.winner.driver.url
            }
          });
        }
        
        // Check if constructor exists
        let constructor = await prisma.constructor.findUnique({
          where: { id: race.winner.constructor.constructorId }
        });
        
        if (!constructor) {
          // Create constructor
          constructor = await prisma.constructor.create({
            data: {
              id: race.winner.constructor.constructorId,
              name: race.winner.constructor.name,
              nationality: race.winner.constructor.nationality,
              url: race.winner.constructor.url
            }
          });
        }
        
        // Create race record
        await prisma.race.create({
          data: {
            season: race.season,
            round: race.round,
            raceName: race.raceName,
            date: race.date,
            time: race.time || '',
            circuitId: race.circuit.id,
            circuitName: race.circuit.name,
            circuitUrl: race.circuit.url,
            locality: race.circuit.location.locality,
            country: race.circuit.location.country,
            winnerId: race.winner.driver.driverId,
            constructorId: race.winner.constructor.constructorId,
            grid: race.winner.grid,
            laps: race.winner.laps,
            status: race.winner.status,
            timeMillis: race.winner.time?.millis || null,
            fastestLapRank: race.winner.fastestLap?.rank || null,
            fastestLap: race.winner.fastestLap?.lap || null,
            fastestLapTime: race.winner.fastestLap?.time || null,
            fastestLapSpeed: race.winner.fastestLap?.speed || null
          }
        });
      }
    }
    
    // Fetch season data from database
    const champion = await prisma.driver_Championship.findFirst({
      where: { season: year },
      include: {
        driver: true,
        constructor: true
      }
    });
    
    const races = await prisma.race.findMany({
      where: { season: year },
      include: {
        winner: true,
        constructor: true
      },
      orderBy: { round: 'asc' }
    });
    
    return Response.json({ champion, races });
  } catch (error) {
    console.error(`Error fetching season data for ${params.year}:`, error);
    return Response.json({ error: 'Failed to fetch season data' }, { status: 500 });
  }
}