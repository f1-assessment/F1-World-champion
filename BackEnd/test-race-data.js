const axios = require('axios');

async function testRaceData() {
  try {
    console.log('Testing race data for 2025...');
    const response = await axios.get('http://localhost:5001/api/races/season/2025');
    
    console.log('Response status:', response.status);
    
    if (Array.isArray(response.data)) {
      const races = response.data;
      console.log('Total races:', races.length);
      
      if (races.length > 0) {
        const firstRace = races[0];
        console.log('First race:');
        console.log('  Name:', firstRace.raceName);
        console.log('  Round:', firstRace.round);
        console.log('  Date:', firstRace.date);
        console.log('  Circuit:', firstRace.circuit?.circuitName);
        console.log('  Location:', firstRace.circuit?.location?.locality, firstRace.circuit?.location?.country);
        console.log('  Winner:', firstRace.results?.[0] ? 
          `${firstRace.results[0].driverId} (${firstRace.results[0].constructorId})` : 
          'No winner data'
        );
      }
    } else {
      console.log('Unexpected response format:', typeof response.data);
    }
  } catch (error) {
    console.error('Error testing race data:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testRaceData(); 