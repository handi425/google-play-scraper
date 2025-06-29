import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class GameDatabase {
  constructor(dbPath = path.join(__dirname, 'games.db')) {
    this.dbPath = dbPath;
    this.db = null;
  }

  async init() {
    this.db = await open({
      filename: this.dbPath,
      driver: sqlite3.Database
    });

    // Execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await this.db.exec(schema);

    console.log('Database initialized successfully');
  }

  // Generate hash untuk deteksi perubahan
  generateDataHash(gameData) {
    const hashableData = {
      title: gameData.title,
      score: gameData.score,
      ratings: gameData.ratings,
      reviews: gameData.reviews,
      price: gameData.price,
      version: gameData.version,
      updated: gameData.updated,
      minInstalls: gameData.minInstalls,
      maxInstalls: gameData.maxInstalls,
      available: gameData.available
    };
    
    return crypto.createHash('md5')
      .update(JSON.stringify(hashableData))
      .digest('hex');
  }

  // Generate hash untuk deskripsi
  generateDescriptionHash(description) {
    if (!description) return null;
    return crypto.createHash('md5')
      .update(description.substring(0, 1000)) // Ambil 1000 karakter pertama
      .digest('hex');
  }

  // Insert atau update developer
  async upsertDeveloper(developerName, developerId, email = null, website = null) {
    if (!developerName) return null;

    try {
      const existing = await this.db.get(
        'SELECT id FROM developers WHERE name = ?',
        [developerName]
      );

      if (existing) {
        return existing.id;
      }

      const result = await this.db.run(
        'INSERT INTO developers (name, developer_id, email, website) VALUES (?, ?, ?, ?)',
        [developerName, developerId, email, website]
      );

      return result.lastID;
    } catch (error) {
      console.error('Error upserting developer:', error);
      return null;
    }
  }

  // Get category ID
  async getCategoryId(categoryId) {
    try {
      const category = await this.db.get(
        'SELECT id FROM categories WHERE category_id = ?',
        [categoryId]
      );
      return category ? category.id : null;
    } catch (error) {
      console.error('Error getting category:', error);
      return null;
    }
  }

  // Check apakah game sudah ada dan berubah
  async checkGameChanges(appId, newDataHash) {
    try {
      const existing = await this.db.get(
        'SELECT id, data_hash, last_updated_at FROM games WHERE app_id = ?',
        [appId]
      );

      if (!existing) {
        return { isNew: true, hasChanged: false, gameId: null };
      }

      const hasChanged = existing.data_hash !== newDataHash;
      return {
        isNew: false,
        hasChanged,
        gameId: existing.id,
        lastUpdated: existing.last_updated_at
      };
    } catch (error) {
      console.error('Error checking game changes:', error);
      return { isNew: true, hasChanged: false, gameId: null };
    }
  }

  // Insert game baru
  async insertGame(gameData) {
    try {
      const developerId = await this.upsertDeveloper(
        gameData.developer,
        gameData.developerId,
        gameData.developerEmail,
        gameData.developerWebsite
      );

      const categoryId = await this.getCategoryId(gameData.genreId || 'GAME');
      const dataHash = this.generateDataHash(gameData);
      const descriptionHash = this.generateDescriptionHash(gameData.description);

      const result = await this.db.run(`
        INSERT INTO games (
          app_id, title, developer_id, category_id, genre, summary,
          description_hash, icon_url, header_image_url, video_url,
          content_rating, free, price, currency, price_text,
          score, score_text, ratings, reviews, installs_text,
          min_installs, max_installs, android_version, version,
          released_date, updated_timestamp, offers_iap, iap_range,
          ad_supported, available, preregister, early_access,
          play_pass, data_hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        gameData.appId, gameData.title, developerId, categoryId, gameData.genre,
        gameData.summary, descriptionHash, gameData.icon, gameData.headerImage,
        gameData.video, gameData.contentRating, gameData.free, gameData.price,
        gameData.currency, gameData.priceText, gameData.score, gameData.scoreText,
        gameData.ratings, gameData.reviews, gameData.installs, gameData.minInstalls,
        gameData.maxInstalls, gameData.androidVersion, gameData.version,
        gameData.released, gameData.updated, gameData.offersIAP, gameData.IAPRange,
        gameData.adSupported, gameData.available, gameData.preregister,
        gameData.earlyAccessEnabled, gameData.isAvailableInPlayPass, dataHash
      ]);

      console.log(`Game baru disimpan: ${gameData.title} (${gameData.appId})`);

      // Simpan data historis
      await this.saveHistoricalData(result.lastID, gameData);

      return result.lastID;
    } catch (error) {
      console.error('Error inserting game:', error);
      throw error;
    }
  }

  // Update game yang sudah ada
  async updateGame(gameId, gameData, oldGame = null) {
    try {
      const developerId = await this.upsertDeveloper(
        gameData.developer,
        gameData.developerId,
        gameData.developerEmail,
        gameData.developerWebsite
      );

      const categoryId = await this.getCategoryId(gameData.genreId || 'GAME');
      const dataHash = this.generateDataHash(gameData);
      const descriptionHash = this.generateDescriptionHash(gameData.description);

      // Update game
      await this.db.run(`
        UPDATE games SET
          title = ?, developer_id = ?, category_id = ?, genre = ?, summary = ?,
          description_hash = ?, icon_url = ?, header_image_url = ?, video_url = ?,
          content_rating = ?, free = ?, price = ?, currency = ?, price_text = ?,
          score = ?, score_text = ?, ratings = ?, reviews = ?, installs_text = ?,
          min_installs = ?, max_installs = ?, android_version = ?, version = ?,
          updated_timestamp = ?, offers_iap = ?, iap_range = ?, ad_supported = ?,
          available = ?, preregister = ?, early_access = ?, play_pass = ?,
          last_updated_at = CURRENT_TIMESTAMP, data_hash = ?
        WHERE id = ?
      `, [
        gameData.title, developerId, categoryId, gameData.genre, gameData.summary,
        descriptionHash, gameData.icon, gameData.headerImage, gameData.video,
        gameData.contentRating, gameData.free, gameData.price, gameData.currency,
        gameData.priceText, gameData.score, gameData.scoreText, gameData.ratings,
        gameData.reviews, gameData.installs, gameData.minInstalls, gameData.maxInstalls,
        gameData.androidVersion, gameData.version, gameData.updated, gameData.offersIAP,
        gameData.IAPRange, gameData.adSupported, gameData.available, gameData.preregister,
        gameData.earlyAccessEnabled, gameData.isAvailableInPlayPass, dataHash, gameId
      ]);

      console.log(`Game diupdate: ${gameData.title} (${gameData.appId})`);

      // Track perubahan dan simpan data historis
      if (oldGame) {
        await this.trackChanges(gameId, oldGame, gameData);
      }
      await this.saveHistoricalData(gameId, gameData);

      return gameId;
    } catch (error) {
      console.error('Error updating game:', error);
      throw error;
    }
  }

  // Track perubahan spesifik
  async trackChanges(gameId, oldData, newData) {
    const fieldsToTrack = ['score', 'ratings', 'reviews', 'price', 'version', 'available'];
    
    for (const field of fieldsToTrack) {
      if (oldData[field] !== newData[field]) {
        await this.db.run(
          'INSERT INTO game_changes (game_id, field_name, old_value, new_value) VALUES (?, ?, ?, ?)',
          [gameId, field, String(oldData[field] || ''), String(newData[field] || '')]
        );
      }
    }
  }

  // Simpan data historis
  async saveHistoricalData(gameId, gameData) {
    // Simpan history harga jika ada
    if (gameData.price !== undefined) {
      await this.db.run(
        'INSERT INTO price_history (game_id, price, currency, price_text, original_price) VALUES (?, ?, ?, ?, ?)',
        [gameId, gameData.price, gameData.currency, gameData.priceText, gameData.originalPrice]
      );
    }

    // Simpan history rating
    if (gameData.score !== undefined) {
      await this.db.run(
        'INSERT INTO rating_history (game_id, score, score_text, ratings, reviews) VALUES (?, ?, ?, ?, ?)',
        [gameId, gameData.score, gameData.scoreText, gameData.ratings, gameData.reviews]
      );
    }

    // Simpan history installs
    if (gameData.minInstalls !== undefined) {
      await this.db.run(
        'INSERT INTO install_history (game_id, min_installs, max_installs, installs_text) VALUES (?, ?, ?, ?)',
        [gameId, gameData.minInstalls, gameData.maxInstalls, gameData.installs]
      );
    }
  }

  // Proses dan simpan game data
  async processGameData(gameData) {
    try {
      const dataHash = this.generateDataHash(gameData);
      const changeInfo = await this.checkGameChanges(gameData.appId, dataHash);

      if (changeInfo.isNew) {
        return await this.insertGame(gameData);
      } else if (changeInfo.hasChanged) {
        // Get old data untuk tracking changes
        const oldGame = await this.db.get('SELECT * FROM games WHERE id = ?', [changeInfo.gameId]);
        return await this.updateGame(changeInfo.gameId, gameData, oldGame);
      } else {
        console.log(`Game tidak berubah: ${gameData.title} (${gameData.appId})`);
        return changeInfo.gameId;
      }
    } catch (error) {
      console.error('Error processing game data:', error);
      throw error;
    }
  }

  // Query games
  async getGames(filters = {}) {
    let query = `
      SELECT g.*, d.name as developer_name, c.name as category_name
      FROM games g
      LEFT JOIN developers d ON g.developer_id = d.id
      LEFT JOIN categories c ON g.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.category) {
      query += ' AND c.category_id = ?';
      params.push(filters.category);
    }

    if (filters.free !== undefined) {
      query += ' AND g.free = ?';
      params.push(filters.free);
    }

    if (filters.minScore) {
      query += ' AND g.score >= ?';
      params.push(filters.minScore);
    }

    if (filters.limit) {
      query += ' ORDER BY g.last_updated_at DESC LIMIT ?';
      params.push(filters.limit);
    }

    return await this.db.all(query, params);
  }

  // Get game statistics
  async getStats() {
    const stats = {};
    
    stats.totalGames = (await this.db.get('SELECT COUNT(*) as count FROM games')).count;
    stats.freeGames = (await this.db.get('SELECT COUNT(*) as count FROM games WHERE free = 1')).count;
    stats.paidGames = (await this.db.get('SELECT COUNT(*) as count FROM games WHERE free = 0')).count;
    stats.averageScore = (await this.db.get('SELECT AVG(score) as avg FROM games WHERE score > 0')).avg;
    stats.totalDevelopers = (await this.db.get('SELECT COUNT(*) as count FROM developers')).count;
    
    stats.categoryBreakdown = await this.db.all(`
      SELECT c.name, COUNT(g.id) as count
      FROM categories c
      LEFT JOIN games g ON c.id = g.category_id
      GROUP BY c.id, c.name
      ORDER BY count DESC
    `);

    stats.lastUpdated = (await this.db.get('SELECT MAX(last_updated_at) as last_update FROM games')).last_update;
    
    return stats;
  }

  async close() {
    if (this.db) {
      await this.db.close();
    }
  }
}

export default GameDatabase;