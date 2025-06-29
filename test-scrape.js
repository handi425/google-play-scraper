const gplay = require('./index.js');
const DatabaseFactory = require('./database/db-factory.js');

async function testScraping() {
  console.log('Testing single app scraping...');
  
  try {
    // Test with a simple app
    const appData = await gplay.app({ appId: 'com.whatsapp' });
    console.log('✅ App data retrieved successfully');
    console.log('App Title:', appData.title);
    console.log('App ID:', appData.appId);
    console.log('Developer:', appData.developer);
    console.log('Genre:', appData.genre);
    console.log('Free:', appData.free);
    
    // Test database connection and save
    console.log('\n--- Testing Database Save ---');
    const db = await DatabaseFactory.create('mysql'); // Force MySQL
    console.log('✅ Database connected');
    
    const result = await db.processGameData(appData);
    console.log('✅ Game saved to database with ID:', result);
    
    await db.close();
    console.log('✅ Test completed successfully');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testScraping();