import express from 'express';
import gplay from './index.js';
import DatabaseFactory from './database/db-factory.js';
import dotenv from 'dotenv';

// Load environment variables
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

// Initialize database
let db;
DatabaseFactory.create().then(database => {
  db = database;
  console.log('Database connected successfully');
}).catch(err => {
  console.error('Failed to connect to database:', err);
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Google Play Games API',
    version: '1.0.0',
    endpoints: {
      apps: '/api/apps',
      developers: '/api/developers',
      categories: '/api/categories',
      search: '/api/search',
      database: {
        stats: '/api/db/stats',
        games: '/api/db/games'
      }
    }
  });
});

// Redirect /api to root
app.get('/api', (req, res) => {
  res.json({
    apps: `${process.env.API_BASE_URL || `http://localhost:${PORT}`}/api/apps`,
    developers: `${process.env.API_BASE_URL || `http://localhost:${PORT}`}/api/developers`,
    categories: `${process.env.API_BASE_URL || `http://localhost:${PORT}`}/api/categories`
  });
});

// Get app details
app.get('/api/apps/:appId', async (req, res) => {
  try {
    const result = await gplay.app({ appId: req.params.appId });
    
    // Save to database if available
    if (db) {
      await db.processGameData(result);
    }
    
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Search apps
app.get('/api/search', async (req, res) => {
  try {
    const { term, num = 30, price = 'all', country = 'us', lang = 'en' } = req.query;
    
    if (!term) {
      return res.status(400).json({ error: 'Search term is required' });
    }
    
    const result = await gplay.search({
      term,
      num: parseInt(num),
      price: price === 'free' ? 'free' : price === 'paid' ? 'paid' : 'all',
      country,
      lang
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List apps by category/collection
app.get('/api/list', async (req, res) => {
  try {
    const { 
      category = 'GAME', 
      collection = gplay.collection.TOP_FREE,
      num = 50,
      country = 'us',
      lang = 'en',
      age
    } = req.query;
    
    const options = {
      category,
      collection,
      num: parseInt(num),
      country,
      lang
    };
    
    if (age) options.age = parseInt(age);
    
    const result = await gplay.list(options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get developer apps
app.get('/api/developers/:devId', async (req, res) => {
  try {
    const result = await gplay.developer({
      devId: req.params.devId,
      num: parseInt(req.query.num) || 60
    });
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Get similar apps
app.get('/api/similar/:appId', async (req, res) => {
  try {
    const result = await gplay.similar({
      appId: req.params.appId
    });
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Get app permissions
app.get('/api/permissions/:appId', async (req, res) => {
  try {
    const result = await gplay.permissions({
      appId: req.params.appId,
      lang: req.query.lang || 'en'
    });
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Get app reviews
app.get('/api/reviews/:appId', async (req, res) => {
  try {
    const result = await gplay.reviews({
      appId: req.params.appId,
      sort: parseInt(req.query.sort) || gplay.sort.NEWEST,
      num: parseInt(req.query.num) || 40,
      lang: req.query.lang || 'en',
      country: req.query.country || 'us'
    });
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Categories endpoint
app.get('/api/categories', (req, res) => {
  res.json({
    categories: Object.keys(gplay.category).map(key => ({
      id: key,
      value: gplay.category[key]
    })),
    collections: Object.keys(gplay.collection).map(key => ({
      id: key,
      value: gplay.collection[key]
    })),
    sort: Object.keys(gplay.sort).map(key => ({
      id: key,
      value: gplay.sort[key]
    })),
    age: Object.keys(gplay.age).map(key => ({
      id: key,
      value: gplay.age[key]
    }))
  });
});

// Database endpoints
app.get('/api/db/stats', async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: 'Database not available' });
  }
  
  try {
    const stats = await db.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/db/games', async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: 'Database not available' });
  }
  
  try {
    const filters = {
      category: req.query.category,
      free: req.query.free === 'true' ? true : req.query.free === 'false' ? false : undefined,
      minScore: req.query.minScore ? parseFloat(req.query.minScore) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit) : 100
    };
    
    const games = await db.getGames(filters);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API available at: ${process.env.API_BASE_URL || `http://localhost:${PORT}`}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  if (db) {
    await db.close();
  }
  process.exit(0);
});

export default app;