import { fetchFromAPI } from '@/lib/db';

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
    
    // Fetch from our backend API
    const [champion, races] = await Promise.all([
      fetchFromAPI(`/championships/${year}`),
      fetchFromAPI(`/races/season/${year}`)
    ]);
    
    return Response.json({ champion, races });
  } catch (error) {
    console.error(`Error fetching season data for ${params.year}:`, error);
    return Response.json({ error: 'Failed to fetch season data' }, { status: 500 });
  }
}