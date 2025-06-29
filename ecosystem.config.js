// PM2 Configuration for production deployment
module.exports = {
  apps: [{
    name: 'gplay-api',
    script: './server-fixed.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      DB_HOST: 'localhost',
      DB_USER: 'handi45',
      DB_PASSWORD: 'SAyang45@@',
      DB_NAME: 'gplay',
      API_BASE_URL: 'https://aso.tazen.id'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};