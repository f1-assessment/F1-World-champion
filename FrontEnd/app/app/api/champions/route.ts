import { prisma } from '@/lib/prisma';
import { fetchAllChampions } from '@/lib/api';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Check if we have champions in the database
    const championsCount = await prisma.driver_Championship.count();
    
    if (championsCount === 0) {
      // Fetch champions from API and store in database
      const champions = await fetchAllChampions();
      
      for (const champion of champions) {
        // Check if driver exists
        let driver = await prisma.driver.findUnique({
          where: { id: champion.driver.driverId }
        });
        
        if (!driver) {
          // Create driver
          driver = await prisma.driver.create({
            data: {
              id: champion.driver.driverId,
              code: champion.driver.code,
              givenName: champion.driver.givenName,
              familyName: champion.driver.familyName,
              dateOfBirth: champion.driver.dateOfBirth,
              nationality: champion.driver.nationality,
              permanentNumber: champion.driver.permanentNumber,
              url: champion.driver.url
            }
          });
        }
        
        // Check if constructor exists
        let constructor = await prisma.constructor.findUnique({
          where: { id: champion.constructor.constructorId }
        });
        
        if (!constructor) {
          // Create constructor
          constructor = await prisma.constructor.create({
            data: {
              id: champion.constructor.constructorId,
              name: champion.constructor.name,
              nationality: champion.constructor.nationality,
              url: champion.constructor.url
            }
          });
        }
        
        // Create championship record
        await prisma.driver_Championship.create({
          data: {
            season: champion.season,
            points: champion.points,
            wins: champion.wins,
            driverId: champion.driver.driverId,
            constructorId: champion.constructor.constructorId
          }
        });
      }
    }
    
    // Fetch champions from database
    const dbChampions = await prisma.driver_Championship.findMany({
      include: {
        driver: true,
        constructor: true
      },
      orderBy: {
        season: 'desc'
      }
    });
    
    return Response.json(dbChampions);
  } catch (error) {
    console.error('Error fetching champions:', error);
    return Response.json({ error: 'Failed to fetch champions' }, { status: 500 });
  }
}