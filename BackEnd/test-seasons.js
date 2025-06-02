const axios = require('axios');

async function testSeasonsAPI() {
  try {
    console.log('Testing seasons API...');
    const response = await axios.get('http://localhost:5001/api/races/seasons');
    
    console.log('Response status:', response.status);
    console.log('Message:', response.data.message);
    console.log('Total seasons:', response.data.total);
    
    if (response.data.seasons && response.data.seasons.length > 0) {
      const seasons = response.data.seasons;
      const firstSeason = seasons[0];
      const lastSeason = seasons[seasons.length - 1];
      
      console.log('First season:', firstSeason.season);
      console.log('Last season:', lastSeason.season);
      console.log('Season range:', `${lastSeason.season} to ${firstSeason.season}`);
      
      // Check if we have seasons from 2005 onwards
      const hasModernSeasons = seasons.some(s => parseInt(s.season) >= 2005);
      console.log('Has seasons from 2005+:', hasModernSeasons);
      
      // Show first 5 seasons
      console.log('First 5 seasons:');
      seasons.slice(0, 5).forEach(s => console.log(`  ${s.season}`));
    }
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testSeasonsAPI(); 