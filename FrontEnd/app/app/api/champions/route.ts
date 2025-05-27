import { fetchFromAPI } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch champions directly from our backend API
    const champions = await fetchFromAPI('/championships');
    
    return Response.json(champions);
  } catch (error) {
    console.error('Error fetching champions:', error);
    return Response.json({ error: 'Failed to fetch champions' }, { status: 500 });
  }
}