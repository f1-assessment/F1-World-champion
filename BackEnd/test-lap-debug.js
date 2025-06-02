// Debug script to test lap data fetching
import axios from 'axios';

async function testLapDataFetch() {
  console.log('🔍 Testing Lap Data Fetching for 2025 Round 1\n');
  
  try {
    const year = '2025';
    const round = '1';
    const allLaps = [];
    let offset = 0;
    const limit = 30;
    let totalFetched = 0;
    let total = 0;

    console.log('Starting pagination loop...\n');

    do {
      const url = `https://api.jolpi.ca/ergast/f1/${year}/${round}/laps?offset=${offset}&limit=${limit}`;
      console.log(`📡 Fetching from: ${url}`);
      
      try {
        const response = await axios.get(url);
        console.log(`✅ Response status: ${response.status}`);
        console.log(`📊 Response data structure:`, {
          hasMRData: !!response.data?.MRData,
          hasRaceTable: !!response.data?.MRData?.RaceTable,
          hasRaces: !!response.data?.MRData?.RaceTable?.Races,
          racesLength: response.data?.MRData?.RaceTable?.Races?.length,
          hasLaps: !!response.data?.MRData?.RaceTable?.Races?.[0]?.Laps,
          lapsLength: response.data?.MRData?.RaceTable?.Races?.[0]?.Laps?.length
        });
        
        if (response.data?.MRData?.RaceTable?.Races?.[0]?.Laps) {
          const laps = response.data.MRData.RaceTable.Races[0].Laps;
          allLaps.push(...laps);
          
          // Get total from first response
          if (offset === 0) {
            total = parseInt(response.data.MRData.total || '0');
            console.log(`📈 Total lap records available: ${total}`);
          }
          
          totalFetched = allLaps.length;
          offset += limit;
          
          console.log(`📥 Fetched ${laps.length} laps, total so far: ${totalFetched}`);
          console.log(`🔄 Next offset: ${offset}\n`);
        } else {
          console.log(`❌ No lap data found in response structure`);
          break;
        }
      } catch (axiosError) {
        console.error(`❌ Axios error:`, axiosError.message);
        if (axiosError.response) {
          console.error(`📊 Error status: ${axiosError.response.status}`);
          console.error(`📊 Error data:`, axiosError.response.data);
        }
        break;
      }
    } while (totalFetched < total && total > 0);

    console.log(`\n🏁 Completed fetching lap data for ${year} round ${round}: ${allLaps.length} total laps`);
    
    if (allLaps.length > 0) {
      console.log(`📋 Sample lap data:`, JSON.stringify(allLaps[0], null, 2));
    }
    
    return allLaps;
  } catch (error) {
    console.error('💥 General error:', error);
    return [];
  }
}

testLapDataFetch().catch(console.error); 