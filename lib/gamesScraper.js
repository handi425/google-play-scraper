import gplay from '../index.js';
import GameDatabase from '../database/db.js';
import { constants } from './constants.js';
import createDebug from 'debug';

const debug = createDebug('gplay:games-scraper');

class GamesScraper {
  constructor(options = {}) {
    this.db = new GameDatabase(options.dbPath || './database/games.db');
    this.options = {
      country: 'us',
      lang: 'en',
      throttle: 2000, // 2 detik delay antar request
      maxRetries: 3,
      batchSize: 50,
      ...options
    };
    this.stats = {
      processed: 0,
      newGames: 0,
      updatedGames: 0,
      errors: 0,
      startTime: null
    };
  }

  async init() {
    await this.db.init();
    debug('Games scraper initialized');
  }

  // Daftar semua kategori game
  getGameCategories() {
    return [
      constants.category.GAME,
      constants.category.GAME_ACTION,
      constants.category.GAME_ADVENTURE,
      constants.category.GAME_ARCADE,
      constants.category.GAME_BOARD,
      constants.category.GAME_CARD,
      constants.category.GAME_CASINO,
      constants.category.GAME_CASUAL,
      constants.category.GAME_EDUCATIONAL,
      constants.category.GAME_MUSIC,
      constants.category.GAME_PUZZLE,
      constants.category.GAME_RACING,
      constants.category.GAME_ROLE_PLAYING,
      constants.category.GAME_SIMULATION,
      constants.category.GAME_SPORTS,
      constants.category.GAME_STRATEGY,
      constants.category.GAME_TRIVIA,
      constants.category.GAME_WORD
    ];
  }

  // Ambil daftar games dari kategori tertentu
  async scrapeGamesByCategory(category, collection = constants.collection.TOP_FREE, limit = 200) {
    try {
      debug(`Scraping category: ${category}, collection: ${collection}`);
      
      const games = await gplay.list({
        category,
        collection,
        num: limit,
        country: this.options.country,
        lang: this.options.lang,
        fullDetail: false,
        throttle: this.options.throttle
      });

      debug(`Found ${games.length} games in category ${category}`);
      return games;
    } catch (error) {
      debug(`Error scraping category ${category}:`, error.message);
      this.stats.errors++;
      return [];
    }
  }

  // Ambil detail lengkap game
  async getGameDetails(appId) {
    for (let attempt = 1; attempt <= this.options.maxRetries; attempt++) {
      try {
        const gameDetail = await gplay.app({
          appId,
          country: this.options.country,
          lang: this.options.lang,
          throttle: this.options.throttle
        });

        return gameDetail;
      } catch (error) {
        debug(`Attempt ${attempt} failed for ${appId}:`, error.message);
        
        if (attempt === this.options.maxRetries) {
          this.stats.errors++;
          throw error;
        }
        
        // Wait sebelum retry
        await new Promise(resolve => setTimeout(resolve, this.options.throttle * attempt));
      }
    }
  }

  // Proses batch games
  async processBatch(gameList) {
    const results = {
      processed: 0,
      newGames: 0,
      updatedGames: 0,
      errors: 0
    };

    for (let i = 0; i < gameList.length; i += this.options.batchSize) {
      const batch = gameList.slice(i, i + this.options.batchSize);
      debug(`Processing batch ${Math.floor(i / this.options.batchSize) + 1}, games ${i + 1}-${Math.min(i + this.options.batchSize, gameList.length)}`);

      for (const basicGame of batch) {
        try {
          // Cek apakah game sudah ada di database
          const existingCheck = await this.db.checkGameChanges(basicGame.appId, '');
          
          // Jika game baru atau belum diupdate dalam 24 jam, ambil detail lengkap
          const shouldUpdate = existingCheck.isNew || 
            (existingCheck.lastUpdated && 
             new Date() - new Date(existingCheck.lastUpdated) > 24 * 60 * 60 * 1000);

          if (shouldUpdate) {
            debug(`Getting details for: ${basicGame.title} (${basicGame.appId})`);
            const gameDetail = await this.getGameDetails(basicGame.appId);
            
            // Proses dan simpan ke database
            const gameId = await this.db.processGameData(gameDetail);
            
            if (existingCheck.isNew) {
              results.newGames++;
            } else {
              results.updatedGames++;
            }
          } else {
            debug(`Skipping unchanged game: ${basicGame.title}`);
          }

          results.processed++;
          this.stats.processed++;

          // Progress update setiap 10 games
          if (results.processed % 10 === 0) {
            debug(`Progress: ${results.processed} games processed`);
          }

        } catch (error) {
          debug(`Error processing ${basicGame.appId}:`, error.message);
          results.errors++;
          this.stats.errors++;
        }
      }

      // Delay antar batch
      if (i + this.options.batchSize < gameList.length) {
        await new Promise(resolve => setTimeout(resolve, this.options.throttle));
      }
    }

    return results;
  }

  // Scrape semua kategori game
  async scrapeAllGameCategories(collections = [constants.collection.TOP_FREE], limitPerCategory = 100) {
    this.stats.startTime = new Date();
    debug('Starting comprehensive games scraping...');

    const categories = this.getGameCategories();
    let allGames = [];

    for (const category of categories) {
      for (const collection of collections) {
        try {
          const games = await this.scrapeGamesByCategory(category, collection, limitPerCategory);
          allGames = allGames.concat(games);
          
          debug(`Category ${category} (${collection}): ${games.length} games found`);
          
          // Delay antar kategori
          await new Promise(resolve => setTimeout(resolve, this.options.throttle));
        } catch (error) {
          debug(`Failed to scrape category ${category}:`, error.message);
        }
      }
    }

    // Remove duplicates berdasarkan appId
    const uniqueGames = allGames.filter((game, index, self) => 
      index === self.findIndex(g => g.appId === game.appId)
    );

    debug(`Total unique games found: ${uniqueGames.length}`);

    // Proses games dalam batch
    const results = await this.processBatch(uniqueGames);
    
    // Update stats
    this.stats.newGames += results.newGames;
    this.stats.updatedGames += results.updatedGames;

    return {
      totalFound: uniqueGames.length,
      ...results,
      duration: new Date() - this.stats.startTime
    };
  }

  // Scrape games terpopuler saja (untuk update harian)
  async scrapePopularGames(limit = 500) {
    this.stats.startTime = new Date();
    debug('Starting popular games scraping...');

    const collections = [
      constants.collection.TOP_FREE,
      constants.collection.TOP_PAID,
      constants.collection.GROSSING
    ];

    let allGames = [];

    // Ambil dari kategori GAME utama dan beberapa kategori populer
    const popularCategories = [
      constants.category.GAME,
      constants.category.GAME_ACTION,
      constants.category.GAME_CASUAL,
      constants.category.GAME_PUZZLE,
      constants.category.GAME_STRATEGY
    ];

    for (const category of popularCategories) {
      for (const collection of collections) {
        try {
          const games = await this.scrapeGamesByCategory(category, collection, Math.floor(limit / popularCategories.length / collections.length));
          allGames = allGames.concat(games);
        } catch (error) {
          debug(`Failed to scrape popular category ${category}:`, error.message);
        }
      }
    }

    // Remove duplicates
    const uniqueGames = allGames.filter((game, index, self) => 
      index === self.findIndex(g => g.appId === game.appId)
    );

    debug(`Total popular games found: ${uniqueGames.length}`);

    const results = await this.processBatch(uniqueGames);
    
    this.stats.newGames += results.newGames;
    this.stats.updatedGames += results.updatedGames;

    return {
      totalFound: uniqueGames.length,
      ...results,
      duration: new Date() - this.stats.startTime
    };
  }

  // Update games yang sudah ada di database
  async updateExistingGames(olderThanHours = 24) {
    debug(`Updating games older than ${olderThanHours} hours...`);
    
    const cutoffDate = new Date(Date.now() - olderThanHours * 60 * 60 * 1000).toISOString();
    
    const gamesNeedingUpdate = await this.db.db.all(`
      SELECT app_id, title, last_updated_at 
      FROM games 
      WHERE last_updated_at < ? 
      ORDER BY last_updated_at ASC 
      LIMIT 200
    `, [cutoffDate]);

    debug(`Found ${gamesNeedingUpdate.length} games needing update`);

    let updated = 0;
    let errors = 0;

    for (const game of gamesNeedingUpdate) {
      try {
        debug(`Updating: ${game.title} (${game.app_id})`);
        const gameDetail = await this.getGameDetails(game.app_id);
        await this.db.processGameData(gameDetail);
        updated++;
      } catch (error) {
        debug(`Failed to update ${game.app_id}:`, error.message);
        errors++;
      }
    }

    return { updated, errors, total: gamesNeedingUpdate.length };
  }

  // Get statistics
  getStats() {
    return {
      ...this.stats,
      duration: this.stats.startTime ? new Date() - this.stats.startTime : 0
    };
  }

  // Reset statistics
  resetStats() {
    this.stats = {
      processed: 0,
      newGames: 0,
      updatedGames: 0,
      errors: 0,
      startTime: null
    };
  }

  async close() {
    await this.db.close();
  }
}

export default GamesScraper;