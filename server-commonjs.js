const express = require('express');
const gplay = require('./index.js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: path.join(__dirname, '.env.production') });
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

// Initialize database - we'll skip this for now to get API working first
let db = null;

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Google Play Games API',
    version: '1.0.0',
    endpoints: {
      apps: '/api/apps',
      developers: '/api/developers',
      categories: '/api/categories',
      search: '/api/search'
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API available at: ${process.env.API_BASE_URL || `http://localhost:${PORT}`}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

module.exports = app;