#!/usr/bin/env node

import { program } from 'commander';
import AutoScraper from './scraper/auto-scraper.js';
import DatabaseFactory from './database/db-factory.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.production' });

const scraper = new AutoScraper();

program
  .name('gplay-scraper')
  .description('Google Play Store Auto Scraper CLI')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize scraper and database')
  .action(async () => {
    console.log('🚀 Initializing scraper...');
    const success = await scraper.init();
    if (success) {
      console.log('✅ Scraper initialized successfully');
    } else {
      console.log('❌ Failed to initialize scraper');
      process.exit(1);
    }
  });

program
  .command('scrape-all')
  .description('Scrape all categories (full scraping)')
  .action(async () => {
    console.log('🔍 Starting comprehensive scraping...');
    await scraper.init();
    await scraper.scrapeAllCategories();
    console.log('✅ Scraping completed');
    process.exit(0);
  });

program
  .command('scrape-category <category>')
  .description('Scrape specific category')
  .option('-c, --collection <collection>', 'Collection type (TOP_FREE, TOP_PAID, GROSSING)', 'TOP_FREE')
  .option('-n, --num <number>', 'Number of apps to scrape', '50')
  .action(async (category, options) => {
    console.log(`🔍 Scraping category: ${category}/${options.collection}`);
    await scraper.init();
    
    try {
      const stats = await scraper.scrapeCategory(category, options.collection, parseInt(options.num));
      console.log(`✅ Completed: ${stats.scraped} apps processed, ${stats.errors} errors`);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
    
    process.exit(0);
  });

program
  .command('scrape-trending')
  .description('Scrape trending apps only')
  .action(async () => {
    console.log('🔥 Scraping trending apps...');
    await scraper.init();
    await scraper.scrapeTrendingApps();
    console.log('✅ Trending apps scraping completed');
    process.exit(0);
  });

program
  .command('scrape-search <terms...>')
  .description('Scrape apps by search terms')
  .action(async (terms) => {
    console.log(`🔍 Scraping search terms: ${terms.join(', ')}`);
    await scraper.init();
    await scraper.scrapeBySearch(terms);
    console.log('✅ Search scraping completed');
    process.exit(0);
  });

program
  .command('start-scheduler')
  .description('Start automatic scraping scheduler')
  .action(async () => {
    console.log('⏰ Starting scraping scheduler...');
    await scraper.init();
    scraper.startScheduler();
    
    console.log('📅 Scheduler is running. Press Ctrl+C to stop.');
    console.log('Schedule:');
    console.log('  - Full scraping: Daily at 2:00 AM');
    console.log('  - Trending apps: Every 6 hours');
    console.log('  - Popular searches: Every 12 hours');
    
    // Keep process alive
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping scheduler...');
      scraper.stopScheduler();
      process.exit(0);
    });
  });

program
  .command('stats')
  .description('Show scraper statistics')
  .action(async () => {
    await scraper.init();
    const stats = scraper.getStats();
    
    console.log('📊 Scraper Statistics:');
    console.log(`  Total Scraped: ${stats.totalScraped}`);
    console.log(`  Total New: ${stats.totalNew}`);
    console.log(`  Total Updated: ${stats.totalUpdated}`);
    console.log(`  Total Errors: ${stats.totalErrors}`);
    console.log(`  Last Run: ${stats.lastRun || 'Never'}`);
    console.log(`  Currently Running: ${stats.isRunning ? 'Yes' : 'No'}`);
    
    process.exit(0);
  });

program
  .command('db-stats')
  .description('Show database statistics')
  .action(async () => {
    console.log('📊 Getting database statistics...');
    
    try {
      const db = await DatabaseFactory.create();
      const stats = await db.getStats();
      
      console.log('📊 Database Statistics:');
      console.log(`  Total Games: ${stats.totalGames}`);
      console.log(`  Free Games: ${stats.freeGames}`);
      console.log(`  Paid Games: ${stats.paidGames}`);
      console.log(`  Average Score: ${stats.averageScore?.toFixed(2) || 'N/A'}`);
      console.log(`  Total Developers: ${stats.totalDevelopers}`);
      console.log(`  Last Updated: ${stats.lastUpdated || 'Never'}`);
      
      console.log('\n📈 Category Breakdown:');
      stats.categoryBreakdown.forEach(cat => {
        console.log(`  ${cat.name}: ${cat.count} games`);
      });
      
      await db.close();
    } catch (error) {
      console.error(`❌ Database error: ${error.message}`);
    }
    
    process.exit(0);
  });

program
  .command('test-connection')
  .description('Test database connection')
  .action(async () => {
    console.log('🔌 Testing database connection...');
    
    try {
      const db = await DatabaseFactory.create();
      console.log('✅ Database connection successful');
      
      // Test a simple query
      const [rows] = await db.pool.execute('SELECT COUNT(*) as count FROM games');
      console.log(`📊 Found ${rows[0].count} games in database`);
      
      await db.close();
    } catch (error) {
      console.error(`❌ Database connection failed: ${error.message}`);
    }
    
    process.exit(0);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}