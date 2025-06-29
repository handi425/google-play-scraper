const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
// Auto-detect production environment based on domain
const isProduction = process.env.NODE_ENV === 'production' || 
                    process.env.PORT === '3001' || 
                    (typeof window !== 'undefined' && window.location && window.location.hostname === 'aso.tazen.id') ||
                    process.cwd().includes('/home/tazen-aso/');

if (isProduction) {
  process.env.NODE_ENV = 'production';
  dotenv.config({ path: path.join(__dirname, '.env.production') });
  console.log('🌐 Auto-detected PRODUCTION environment - using MySQL CloudPanel database');
} else {
  dotenv.config();
  console.log('🔧 Development environment - using SQLite database');
}

const app = express();
const PORT = process.env.PORT || 3001;

// Dynamic import untuk gplay (ES6 module)
let gplay;

async function initializeGplay() {
  try {
    gplay = await import('./index.js');
    console.log('Google Play scraper module loaded successfully');
  } catch (error) {
    console.error('Failed to load gplay module:', error);
  }
}

// Initialize gplay module
initializeGplay();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

// Middleware to check if gplay is loaded
const checkGplay = (req, res, next) => {
  if (!gplay) {
    return res.status(503).json({ error: 'Google Play scraper module not loaded yet. Please try again.' });
  }
  next();
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Google Play Games API',
    version: '1.0.0',
    status: gplay ? 'ready' : 'initializing',
    endpoints: {
      apps: '/api/apps/:appId',
      developers: '/api/developers/:devId',
      categories: '/api/categories',
      search: '/api/search?term=xxx',
      list: '/api/list?category=GAME&collection=TOP_FREE'
    }
  });
});

// Redirect /api to show available endpoints
app.get('/api', (req, res) => {
  const baseUrl = process.env.API_BASE_URL || `https://${req.get('host')}`;
  res.json({
    apps: `${baseUrl}/api/apps/com.whatsapp`,
    search: `${baseUrl}/api/search?term=whatsapp`,
    categories: `${baseUrl}/api/categories`,
    list: `${baseUrl}/api/list`,
    developers: `${baseUrl}/api/developers/5700313618786177705`,
    dashboard: `${baseUrl}/dashboard.html`,
    database: {
      stats: `${baseUrl}/api/db/stats`,
      games: `${baseUrl}/api/db/games`
    },
    scraper: {
      start: `POST ${baseUrl}/api/scraper/start`,
      trending: `POST ${baseUrl}/api/scraper/trending`,
      category: `POST ${baseUrl}/api/scraper/category/:category`,
      logs: `${baseUrl}/api/scraper/logs`
    }
  });
});

// Get app details
app.get('/api/apps/:appId', checkGplay, async (req, res) => {
  try {
    const result = await gplay.default.app({ appId: req.params.appId });
    res.json(result);
  } catch (error) {
    console.error('Error fetching app:', error);
    res.status(404).json({ error: error.message });
  }
});

// Search apps
app.get('/api/search', checkGplay, async (req, res) => {
  try {
    const { term, num = 30, price = 'all', country = 'us', lang = 'en' } = req.query;
    
    if (!term) {
      return res.status(400).json({ error: 'Search term is required' });
    }
    
    const result = await gplay.default.search({
      term,
      num: parseInt(num),
      price: price === 'free' ? 'free' : price === 'paid' ? 'paid' : 'all',
      country,
      lang
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error searching apps:', error);
    res.status(500).json({ error: error.message });
  }
});

// List apps by category/collection
app.get('/api/list', checkGplay, async (req, res) => {
  try {
    const { 
      category = 'GAME', 
      collection = 'TOP_FREE',
      num = 50,
      country = 'us',
      lang = 'en',
      age
    } = req.query;
    
    const options = {
      category,
      collection: gplay.default.collection[collection] || gplay.default.collection.TOP_FREE,
      num: parseInt(num),
      country,
      lang
    };
    
    if (age) options.age = parseInt(age);
    
    const result = await gplay.default.list(options);
    res.json(result);
  } catch (error) {
    console.error('Error listing apps:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get developer apps
app.get('/api/developers/:devId', checkGplay, async (req, res) => {
  try {
    const result = await gplay.default.developer({
      devId: req.params.devId,
      num: parseInt(req.query.num) || 60
    });
    res.json(result);
  } catch (error) {
    console.error('Error fetching developer apps:', error);
    res.status(404).json({ error: error.message });
  }
});

// Get similar apps
app.get('/api/similar/:appId', checkGplay, async (req, res) => {
  try {
    const result = await gplay.default.similar({
      appId: req.params.appId
    });
    res.json(result);
  } catch (error) {
    console.error('Error fetching similar apps:', error);
    res.status(404).json({ error: error.message });
  }
});

// Get app permissions
app.get('/api/permissions/:appId', checkGplay, async (req, res) => {
  try {
    const result = await gplay.default.permissions({
      appId: req.params.appId,
      lang: req.query.lang || 'en'
    });
    res.json(result);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(404).json({ error: error.message });
  }
});

// Get app reviews
app.get('/api/reviews/:appId', checkGplay, async (req, res) => {
  try {
    const result = await gplay.default.reviews({
      appId: req.params.appId,
      sort: parseInt(req.query.sort) || gplay.default.sort.NEWEST,
      num: parseInt(req.query.num) || 40,
      lang: req.query.lang || 'en',
      country: req.query.country || 'us'
    });
    res.json(result);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(404).json({ error: error.message });
  }
});

// Categories endpoint
app.get('/api/categories', checkGplay, (req, res) => {
  try {
    res.json({
      categories: Object.keys(gplay.default.category).map(key => ({
        id: key,
        value: gplay.default.category[key]
      })),
      collections: Object.keys(gplay.default.collection).map(key => ({
        id: key,
        value: gplay.default.collection[key]
      })),
      sort: Object.keys(gplay.default.sort).map(key => ({
        id: key,
        value: gplay.default.sort[key]
      })),
      age: Object.keys(gplay.default.age).map(key => ({
        id: key,
        value: gplay.default.age[key]
      }))
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    gplayLoaded: !!gplay,
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    isCloudPanel: process.env.PORT === '3001' || process.cwd().includes('/home/tazen-aso/'),
    currentDirectory: process.cwd()
  });
});

// Test single app save to database
app.post('/api/test/save-app/:appId', checkGplay, async (req, res) => {
  try {
    const appId = req.params.appId;
    console.log(`Testing app save for: ${appId}`);
    
    // Get app details
    const appData = await gplay.default.app({ appId });
    console.log(`✅ App data retrieved: ${appData.title}`);
    
    // Save to database
    const { default: DatabaseFactory } = await import('./database/db-factory.js');
    const db = await DatabaseFactory.create();
    console.log('✅ Database connected');
    
    const result = await db.processGameData(appData);
    console.log(`✅ App saved with ID: ${result}`);
    
    await db.close();
    
    res.json({
      success: true,
      appId,
      title: appData.title,
      gameId: result,
      message: 'App saved successfully to database'
    });
    
  } catch (error) {
    console.error('❌ Test save error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      stack: error.stack 
    });
  }
});

// Database migration endpoint
app.post('/api/db/migrate', async (req, res) => {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    // Read MySQL schema
    const schemaPath = path.join(__dirname, 'database', 'mysql-schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    
    // Get MySQL connection
    const { default: DatabaseFactory } = await import('./database/db-factory.js');
    const db = await DatabaseFactory.create('mysql'); // Force MySQL
    
    // Split schema into individual statements
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);
    
    let executed = 0;
    for (const statement of statements) {
      try {
        await db.pool.execute(statement.trim());
        executed++;
      } catch (error) {
        console.log(`Statement skipped (likely already exists): ${error.message.substring(0, 100)}`);
      }
    }
    
    await db.close();
    
    res.json({
      message: 'Database migration completed',
      executed: executed,
      total: statements.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fix database schema issues
app.post('/api/db/fix-schema', async (req, res) => {
  try {
    const { default: DatabaseFactory } = await import('./database/db-factory.js');
    const db = await DatabaseFactory.create('mysql');
    
    // Fix score column precision
    await db.pool.execute('ALTER TABLE games MODIFY score DECIMAL(4,2)');
    await db.pool.execute('ALTER TABLE rating_history MODIFY score DECIMAL(4,2)');
    
    await db.close();
    
    res.json({
      message: 'Schema fixes applied successfully',
      fixes: ['score column precision updated to DECIMAL(4,2)'],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Schema fix error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Database endpoints - moved earlier for better organization
app.get('/api/db/stats', async (req, res) => {
  try {
    const { default: DatabaseFactory } = await import('./database/db-factory.js');
    const db = await DatabaseFactory.create();
    const stats = await db.getStats();
    await db.close();
    res.json(stats);
  } catch (error) {
    console.error('Error getting database stats:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/db/games', async (req, res) => {
  try {
    const { default: DatabaseFactory } = await import('./database/db-factory.js');
    const db = await DatabaseFactory.create();
    
    const filters = {
      category: req.query.category,
      free: req.query.free === 'true' ? true : req.query.free === 'false' ? false : undefined,
      minScore: req.query.minScore ? parseFloat(req.query.minScore) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit) : 100
    };
    
    const games = await db.getGames(filters);
    await db.close();
    res.json(games);
  } catch (error) {
    console.error('Error getting games from database:', error);
    res.status(500).json({ error: error.message });
  }
});

// Scraper management endpoints
app.post('/api/scraper/start', async (req, res) => {
  try {
    const { default: AutoScraper } = await import('./scraper/auto-scraper.js');
    const scraper = new AutoScraper();
    await scraper.init();
    
    // Start scraping in background
    scraper.scrapeAllCategories().catch(err => {
      console.error('Scraping error:', err);
    });
    
    res.json({
      message: 'Scraping started successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error starting scraper:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/scraper/trending', async (req, res) => {
  try {
    const { default: AutoScraper } = await import('./scraper/auto-scraper.js');
    const scraper = new AutoScraper();
    await scraper.init();
    
    // Start trending scraping in background
    scraper.scrapeTrendingApps().catch(err => {
      console.error('Trending scraping error:', err);
    });
    
    res.json({
      message: 'Trending apps scraping started',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error starting trending scraper:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/scraper/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { collection = 'TOP_FREE', num = 50 } = req.query;
    
    const { default: AutoScraper } = await import('./scraper/auto-scraper.js');
    const scraper = new AutoScraper();
    await scraper.init();
    
    // Start category scraping in background
    scraper.scrapeCategory(category, collection, parseInt(num)).catch(err => {
      console.error('Category scraping error:', err);
    });
    
    res.json({
      message: `Scraping started for category: ${category}/${collection}`,
      category,
      collection,
      maxApps: parseInt(num),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error starting category scraper:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/scraper/logs', async (req, res) => {
  try {
    const { default: DatabaseFactory } = await import('./database/db-factory.js');
    const db = await DatabaseFactory.create();
    
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    const [rows] = await db.pool.execute(
      'SELECT * FROM scraping_logs ORDER BY started_at DESC LIMIT ?',
      [limit]
    );
    
    await db.close();
    res.json(rows);
  } catch (error) {
    console.error('Error getting scraper logs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Deduplication monitoring endpoint
app.get('/api/db/deduplication-stats', async (req, res) => {
  try {
    const { default: DatabaseFactory } = await import('./database/db-factory.js');
    const db = await DatabaseFactory.create();
    
    const stats = await db.getDeduplicationStats();
    await db.close();
    
    res.json({
      message: 'Smart deduplication system statistics',
      timestamp: new Date().toISOString(),
      ...stats
    });
  } catch (error) {
    console.error('Error getting deduplication stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API available at: ${process.env.API_BASE_URL || `http://localhost:${PORT}`}`);
  console.log(`📊 Health check: ${process.env.API_BASE_URL || `http://localhost:${PORT}`}/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

module.exports = app;