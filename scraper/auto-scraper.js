import DatabaseFactory from '../database/db-factory.js';
import gplay from '../index.js';
import cron from 'node-cron';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AutoScraper {
  constructor() {
    this.db = null;
    this.isRunning = false;
    this.stats = {
      totalScraped: 0,
      totalNew: 0,
      totalUpdated: 0,
      totalErrors: 0,
      lastRun: null,
      currentRun: null
    };
    this.logFile = path.join(__dirname, '../logs/scraper.log');
  }

  async init() {
    try {
      this.db = await DatabaseFactory.create();
      this.log('AutoScraper initialized successfully');
      
      // Ensure logs directory exists
      const logsDir = path.dirname(this.logFile);
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      
      return true;
    } catch (error) {
      this.log(`Failed to initialize AutoScraper: ${error.message}`, 'error');
      return false;
    }
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    console.log(logMessage);
    
    // Write to log file
    try {
      fs.appendFileSync(this.logFile, logMessage + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  async saveScrapingLog(type, category, collection, stats, error = null) {
    if (!this.db) return;
    
    try {
      const query = `
        INSERT INTO scraping_logs 
        (scrape_type, category, collection, games_scraped, games_updated, games_new, errors, status, error_message, completed_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      
      await this.db.pool.execute(query, [
        type,
        category,
        collection,
        stats.scraped || 0,
        stats.updated || 0,
        stats.new || 0,
        stats.errors || 0,
        error ? 'error' : 'completed',
        error ? error.message : null
      ]);
    } catch (err) {
      this.log(`Failed to save scraping log: ${err.message}`, 'error');
    }
  }

  async scrapeCategory(category, collection = 'TOP_FREE', maxApps = 100) {
    this.log(`Starting to scrape category: ${category}, collection: ${collection}`);
    
    const stats = { scraped: 0, new: 0, updated: 0, errors: 0 };
    
    try {
      // Get list of apps for this category/collection
      const apps = await gplay.list({
        category: category,
        collection: gplay.collection[collection] || gplay.collection.TOP_FREE,
        num: maxApps,
        country: 'us',
        lang: 'en'
      });

      this.log(`Found ${apps.length} apps in ${category}/${collection}`);

      for (const app of apps) {
        try {
          // Get detailed app information
          const appDetails = await gplay.app({ 
            appId: app.appId,
            lang: 'en',
            country: 'us'
          });

          // Process and save to database
          await this.db.processGameData(appDetails);
          
          stats.scraped++;
          
          // Add small delay to avoid rate limiting
          await this.delay(1000);
          
          if (stats.scraped % 10 === 0) {
            this.log(`Processed ${stats.scraped}/${apps.length} apps in ${category}`);
          }
          
        } catch (error) {
          this.log(`Error processing app ${app.appId}: ${error.message}`, 'error');
          stats.errors++;
        }
      }

      await this.saveScrapingLog('category', category, collection, stats);
      this.log(`Completed scraping ${category}/${collection}: ${stats.scraped} apps processed`);
      
    } catch (error) {
      this.log(`Error scraping category ${category}: ${error.message}`, 'error');
      await this.saveScrapingLog('category', category, collection, stats, error);
      throw error;
    }

    return stats;
  }

  async scrapeAllCategories() {
    if (this.isRunning) {
      this.log('Scraper is already running, skipping this run');
      return;
    }

    this.isRunning = true;
    this.stats.currentRun = new Date();
    this.log('=== Starting comprehensive scraping of all categories ===');

    const totalStats = { scraped: 0, new: 0, updated: 0, errors: 0 };

    try {
      // Define categories to scrape
      const categoriesToScrape = [
        'GAME',
        'GAME_ACTION',
        'GAME_ADVENTURE', 
        'GAME_ARCADE',
        'GAME_CASUAL',
        'GAME_PUZZLE',
        'GAME_RACING',
        'GAME_ROLE_PLAYING',
        'GAME_SIMULATION',
        'GAME_SPORTS',
        'GAME_STRATEGY',
        'COMMUNICATION',
        'SOCIAL',
        'ENTERTAINMENT',
        'PRODUCTIVITY',
        'EDUCATION',
        'LIFESTYLE',
        'SHOPPING',
        'BUSINESS'
      ];

      const collectionsToScrape = ['TOP_FREE', 'TOP_PAID', 'GROSSING'];

      for (const category of categoriesToScrape) {
        for (const collection of collectionsToScrape) {
          try {
            this.log(`\n--- Scraping ${category} / ${collection} ---`);
            
            const categoryStats = await this.scrapeCategory(category, collection, 50);
            
            totalStats.scraped += categoryStats.scraped;
            totalStats.new += categoryStats.new;
            totalStats.updated += categoryStats.updated;
            totalStats.errors += categoryStats.errors;

            // Longer delay between categories
            await this.delay(5000);
            
          } catch (error) {
            this.log(`Failed to scrape ${category}/${collection}: ${error.message}`, 'error');
            totalStats.errors++;
          }
        }
        
        // Even longer delay between different categories
        await this.delay(10000);
      }

      this.stats.totalScraped += totalStats.scraped;
      this.stats.totalNew += totalStats.new;
      this.stats.totalUpdated += totalStats.updated;
      this.stats.totalErrors += totalStats.errors;
      this.stats.lastRun = this.stats.currentRun;

      this.log('=== Scraping completed ===');
      this.log(`Total stats: ${totalStats.scraped} scraped, ${totalStats.new} new, ${totalStats.updated} updated, ${totalStats.errors} errors`);

    } catch (error) {
      this.log(`Critical error during scraping: ${error.message}`, 'error');
    } finally {
      this.isRunning = false;
      this.stats.currentRun = null;
    }
  }

  async scrapeTrendingApps() {
    this.log('Scraping trending apps...');
    
    try {
      // Scrape top trending across different categories
      const trendingCategories = ['GAME', 'COMMUNICATION', 'SOCIAL', 'ENTERTAINMENT'];
      
      for (const category of trendingCategories) {
        const apps = await gplay.list({
          category: category,
          collection: gplay.collection.TOP_FREE,
          num: 20,
          country: 'us'
        });

        for (const app of apps.slice(0, 10)) { // Top 10 only
          try {
            const appDetails = await gplay.app({ appId: app.appId });
            await this.db.processGameData(appDetails);
            await this.delay(500);
          } catch (error) {
            this.log(`Error processing trending app ${app.appId}: ${error.message}`, 'error');
          }
        }
      }
      
      this.log('Trending apps scraping completed');
    } catch (error) {
      this.log(`Error scraping trending apps: ${error.message}`, 'error');
    }
  }

  async scrapeBySearch(searchTerms) {
    this.log(`Scraping apps by search terms: ${searchTerms.join(', ')}`);
    
    for (const term of searchTerms) {
      try {
        const searchResults = await gplay.search({
          term: term,
          num: 20,
          country: 'us'
        });

        for (const app of searchResults.slice(0, 10)) {
          try {
            const appDetails = await gplay.app({ appId: app.appId });
            await this.db.processGameData(appDetails);
            await this.delay(1000);
          } catch (error) {
            this.log(`Error processing search result ${app.appId}: ${error.message}`, 'error');
          }
        }
      } catch (error) {
        this.log(`Error searching for "${term}": ${error.message}`, 'error');
      }
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStats() {
    return {
      ...this.stats,
      isRunning: this.isRunning,
      uptime: this.stats.lastRun ? Date.now() - this.stats.lastRun.getTime() : 0
    };
  }

  // Schedule scraping jobs
  startScheduler() {
    this.log('Starting scraping scheduler...');

    // Full scraping every day at 2 AM
    cron.schedule('0 2 * * *', () => {
      this.log('Triggered: Daily full scraping');
      this.scrapeAllCategories();
    });

    // Trending apps every 6 hours
    cron.schedule('0 */6 * * *', () => {
      this.log('Triggered: Trending apps scraping');
      this.scrapeTrendingApps();
    });

    // Popular search terms every 12 hours
    cron.schedule('0 */12 * * *', () => {
      const popularSearches = [
        'whatsapp', 'instagram', 'tiktok', 'youtube', 'facebook',
        'pubg', 'minecraft', 'roblox', 'pokemon', 'clash'
      ];
      this.log('Triggered: Popular searches scraping');
      this.scrapeBySearch(popularSearches);
    });

    this.log('Scheduler started successfully');
    this.log('Schedule: Full scraping daily at 2 AM, trending every 6h, searches every 12h');
  }

  stopScheduler() {
    cron.destroy();
    this.log('Scheduler stopped');
  }
}

export default AutoScraper;