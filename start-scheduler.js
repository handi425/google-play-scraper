import AutoScraper from './scraper/auto-scraper.js';
import dotenv from 'dotenv';

// Load environment variables
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config();
}

const scraper = new AutoScraper();

async function startScheduler() {
  console.log('🚀 Initializing Auto Scraper...');
  
  const success = await scraper.init();
  if (!success) {
    console.error('❌ Failed to initialize scraper');
    process.exit(1);
  }

  console.log('✅ Scraper initialized successfully');
  console.log('⏰ Starting scheduler...');
  
  scraper.startScheduler();
  
  console.log('📅 Scheduler is now running!');
  console.log('');
  console.log('📋 Schedule:');
  console.log('  🔄 Full scraping: Daily at 2:00 AM');
  console.log('  🔥 Trending apps: Every 6 hours');
  console.log('  🔍 Popular searches: Every 12 hours');
  console.log('');
  console.log('💡 Available commands:');
  console.log('  Ctrl+C: Stop scheduler');
  console.log('');
  console.log('🌐 API Endpoints for manual control:');
  console.log('  POST /api/scraper/start - Start full scraping');
  console.log('  POST /api/scraper/trending - Start trending scraping');
  console.log('  POST /api/scraper/category/:category - Start category scraping');
  console.log('  GET /api/scraper/logs - View scraping logs');
  console.log('  GET /api/db/stats - Database statistics');
  console.log('');

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Received shutdown signal...');
    console.log('⏹️  Stopping scheduler...');
    scraper.stopScheduler();
    console.log('✅ Scheduler stopped successfully');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Received termination signal...');
    scraper.stopScheduler();
    process.exit(0);
  });

  // Keep process alive
  process.stdin.resume();
}

startScheduler().catch(error => {
  console.error('❌ Failed to start scheduler:', error);
  process.exit(1);
});