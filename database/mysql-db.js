import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MySQLGameDatabase {
  constructor(config = {}) {
    this.config = {
      host: config.host || process.env.DB_HOST || 'localhost',
      user: config.user || process.env.DB_USER || 'handi45',
      password: config.password || process.env.DB_PASSWORD || 'SAyang45@@',
      database: config.database || process.env.DB_NAME || 'gplay',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4'
    };
    this.pool = null;
  }

  async init() {
    try {
      // Create connection pool
      this.pool = await mysql.createPool(this.config);
      
      // Test connection
      const connection = await this.pool.getConnection();
      console.log('MySQL connection established successfully');
      
      // Execute schema if needed
      const schemaPath = path.join(__dirname, 'mysql-schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        // Split by semicolon and execute each statement
        const statements = schema.split(';').filter(stmt => stmt.trim());
        for (const statement of statements) {
          if (statement.trim()) {
            await connection.query(statement);
          }
        }
        console.log('Database schema initialized');
      }
      
      connection.release();
    } catch (error) {
      console.error('Error initializing MySQL database:', error);
      throw error;
    }
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
      .update(description.substring(0, 1000))
      .digest('hex');
  }

  // Insert atau update developer
  async upsertDeveloper(developerName, developerId, email = null, website = null) {
    if (!developerName) return null;

    try {
      const [rows] = await this.pool.execute(
        'SELECT id FROM developers WHERE name = ?',
        [developerName]
      );

      if (rows.length > 0) {
        return rows[0].id;
      }

      const [result] = await this.pool.execute(
        'INSERT INTO developers (name, developer_id, email, website) VALUES (?, ?, ?, ?)',
        [developerName, developerId, email, website]
      );

      return result.insertId;
    } catch (error) {
      console.error('Error upserting developer:', error);
      return null;
    }
  }

  // Get category ID
  async getCategoryId(categoryId) {
    try {
      const [rows] = await this.pool.execute(
        'SELECT id FROM categories WHERE category_id = ?',
        [categoryId]
      );
      return rows.length > 0 ? rows[0].id : null;
    } catch (error) {
      console.error('Error getting category:', error);
      return null;
    }
  }

  // Check apakah game sudah ada dan berubah
  async checkGameChanges(appId, newDataHash) {
    try {
      const [rows] = await this.pool.execute(
        'SELECT id, data_hash, last_updated_at FROM games WHERE app_id = ?',
        [appId]
      );

      if (rows.length === 0) {
        return { isNew: true, hasChanged: false, gameId: null };
      }

      const existing = rows[0];
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
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      const developerId = await this.upsertDeveloper(
        gameData.developer,
        gameData.developerId,
        gameData.developerEmail,
        gameData.developerWebsite
      );

      const categoryId = await this.getCategoryId(gameData.genreId || 'GAME');
      const dataHash = this.generateDataHash(gameData);
      const descriptionHash = this.generateDescriptionHash(gameData.description);

      // Format data untuk MySQL
      const releasedDate = gameData.released ? 
        (gameData.released instanceof Date ? 
          gameData.released.toISOString().split('T')[0] : 
          new Date(gameData.released).toISOString().split('T')[0]
        ) : null;
      
      const score = gameData.score ? Math.min(parseFloat(gameData.score), 9.99) : null;
      const price = gameData.price ? parseFloat(gameData.price) : 0;

      const [result] = await connection.execute(`
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
        gameData.video, gameData.contentRating, gameData.free, price,
        gameData.currency, gameData.priceText, score, gameData.scoreText,
        gameData.ratings, gameData.reviews, gameData.installs, gameData.minInstalls,
        gameData.maxInstalls, gameData.androidVersion, gameData.version,
        releasedDate, gameData.updated, gameData.offersIAP, gameData.IAPRange,
        gameData.adSupported, gameData.available, gameData.preregister,
        gameData.earlyAccessEnabled, gameData.isAvailableInPlayPass, dataHash
      ]);

      const gameId = result.insertId;

      // Simpan deskripsi jika ada
      if (gameData.description || gameData.recentChanges) {
        await connection.execute(
          'INSERT INTO game_descriptions (game_id, description, recent_changes) VALUES (?, ?, ?)',
          [gameId, gameData.description, gameData.recentChanges]
        );
      }

      // Simpan screenshots
      if (gameData.screenshots && gameData.screenshots.length > 0) {
        for (let i = 0; i < gameData.screenshots.length; i++) {
          await connection.execute(
            'INSERT INTO game_screenshots (game_id, screenshot_url, position) VALUES (?, ?, ?)',
            [gameId, gameData.screenshots[i], i]
          );
        }
      }

      // Simpan data historis
      await this.saveHistoricalData(gameId, gameData, connection);

      await connection.commit();
      console.log(`Game baru disimpan: ${gameData.title} (${gameData.appId})`);

      return gameId;
    } catch (error) {
      await connection.rollback();
      console.error('Error inserting game:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Update game yang sudah ada
  async updateGame(gameId, gameData, oldGame = null) {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

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
      await connection.execute(`
        UPDATE games SET
          title = ?, developer_id = ?, category_id = ?, genre = ?, summary = ?,
          description_hash = ?, icon_url = ?, header_image_url = ?, video_url = ?,
          content_rating = ?, free = ?, price = ?, currency = ?, price_text = ?,
          score = ?, score_text = ?, ratings = ?, reviews = ?, installs_text = ?,
          min_installs = ?, max_installs = ?, android_version = ?, version = ?,
          updated_timestamp = ?, offers_iap = ?, iap_range = ?, ad_supported = ?,
          available = ?, preregister = ?, early_access = ?, play_pass = ?,
          data_hash = ?
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

      // Update deskripsi
      await connection.execute('DELETE FROM game_descriptions WHERE game_id = ?', [gameId]);
      if (gameData.description || gameData.recentChanges) {
        await connection.execute(
          'INSERT INTO game_descriptions (game_id, description, recent_changes) VALUES (?, ?, ?)',
          [gameId, gameData.description, gameData.recentChanges]
        );
      }

      // Update screenshots
      await connection.execute('DELETE FROM game_screenshots WHERE game_id = ?', [gameId]);
      if (gameData.screenshots && gameData.screenshots.length > 0) {
        for (let i = 0; i < gameData.screenshots.length; i++) {
          await connection.execute(
            'INSERT INTO game_screenshots (game_id, screenshot_url, position) VALUES (?, ?, ?)',
            [gameId, gameData.screenshots[i], i]
          );
        }
      }

      // Track perubahan dan simpan data historis
      if (oldGame) {
        await this.trackChanges(gameId, oldGame, gameData, connection);
      }
      await this.saveHistoricalData(gameId, gameData, connection);

      await connection.commit();
      console.log(`Game diupdate: ${gameData.title} (${gameData.appId})`);

      return gameId;
    } catch (error) {
      await connection.rollback();
      console.error('Error updating game:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Track perubahan spesifik
  async trackChanges(gameId, oldData, newData, connection) {
    const fieldsToTrack = ['score', 'ratings', 'reviews', 'price', 'version', 'available'];
    
    for (const field of fieldsToTrack) {
      if (oldData[field] !== newData[field]) {
        await connection.execute(
          'INSERT INTO game_changes (game_id, field_name, old_value, new_value) VALUES (?, ?, ?, ?)',
          [gameId, field, String(oldData[field] || ''), String(newData[field] || '')]
        );
      }
    }
  }

  // Simpan data historis
  async saveHistoricalData(gameId, gameData, connection) {
    // Simpan history harga jika ada
    if (gameData.price !== undefined) {
      await connection.execute(
        'INSERT INTO price_history (game_id, price, currency, price_text, original_price) VALUES (?, ?, ?, ?, ?)',
        [gameId, gameData.price, gameData.currency, gameData.priceText, gameData.originalPrice]
      );
    }

    // Simpan history rating
    if (gameData.score !== undefined) {
      await connection.execute(
        'INSERT INTO rating_history (game_id, score, score_text, ratings, reviews) VALUES (?, ?, ?, ?, ?)',
        [gameId, gameData.score, gameData.scoreText, gameData.ratings, gameData.reviews]
      );
    }

    // Simpan history installs
    if (gameData.minInstalls !== undefined) {
      await connection.execute(
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
        const [rows] = await this.pool.execute('SELECT * FROM games WHERE id = ?', [changeInfo.gameId]);
        return await this.updateGame(changeInfo.gameId, gameData, rows[0]);
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

    const [rows] = await this.pool.execute(query, params);
    return rows;
  }

  // Get game statistics
  async getStats() {
    const stats = {};
    
    const [totalGames] = await this.pool.execute('SELECT COUNT(*) as count FROM games');
    stats.totalGames = totalGames[0].count;
    
    const [freeGames] = await this.pool.execute('SELECT COUNT(*) as count FROM games WHERE free = 1');
    stats.freeGames = freeGames[0].count;
    
    const [paidGames] = await this.pool.execute('SELECT COUNT(*) as count FROM games WHERE free = 0');
    stats.paidGames = paidGames[0].count;
    
    const [avgScore] = await this.pool.execute('SELECT AVG(score) as avg FROM games WHERE score > 0');
    stats.averageScore = avgScore[0].avg;
    
    const [totalDevs] = await this.pool.execute('SELECT COUNT(*) as count FROM developers');
    stats.totalDevelopers = totalDevs[0].count;
    
    const [categoryBreakdown] = await this.pool.execute(`
      SELECT c.name, COUNT(g.id) as count
      FROM categories c
      LEFT JOIN games g ON c.id = g.category_id
      GROUP BY c.id, c.name
      ORDER BY count DESC
    `);
    stats.categoryBreakdown = categoryBreakdown;

    const [lastUpdate] = await this.pool.execute('SELECT MAX(last_updated_at) as last_update FROM games');
    stats.lastUpdated = lastUpdate[0].last_update;
    
    return stats;
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}

export default MySQLGameDatabase;