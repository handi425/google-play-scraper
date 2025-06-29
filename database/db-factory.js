import GameDatabase from './db.js';
import MySQLGameDatabase from './mysql-db.js';
import dotenv from 'dotenv';

// Load environment variables
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config();
}

class DatabaseFactory {
  static async create(type = null) {
    // Determine database type
    // Force MySQL if running on CloudPanel (port 3001 or tazen-aso directory)
    const isCloudPanel = process.env.PORT === '3001' || process.cwd().includes('/home/tazen-aso/');
    const dbType = type || process.env.DB_TYPE || 
                  (process.env.NODE_ENV === 'production' || isCloudPanel ? 'mysql' : 'sqlite');
    
    let db;
    
    switch (dbType) {
      case 'mysql':
        console.log('Using MySQL database');
        db = new MySQLGameDatabase({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME
        });
        break;
        
      case 'sqlite':
      default:
        console.log('Using SQLite database');
        db = new GameDatabase();
        break;
    }
    
    await db.init();
    return db;
  }
}

export default DatabaseFactory;