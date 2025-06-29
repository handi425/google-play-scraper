import GamesScraper from './gamesScraper.js';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class GamesScrapingScheduler {
  constructor(options = {}) {
    this.options = {
      logPath: path.join(__dirname, '../logs'),
      dbPath: options.dbPath || './database/games.db',
      country: 'us',
      lang: 'en',
      ...options
    };
    
    this.scraper = new GamesScraper(this.options);
    this.jobs = new Map();
    this.isRunning = false;
    
    // Pastikan folder logs ada
    if (!fs.existsSync(this.options.logPath)) {
      fs.mkdirSync(this.options.logPath, { recursive: true });
    }
  }

  async init() {
    await this.scraper.init();
    console.log('Scheduler initialized successfully');
  }

  // Log aktivitas
  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    console.log(logMessage);
    
    // Simpan ke file log
    const logFile = path.join(this.options.logPath, `scraper-${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, logMessage + '\n');
  }

  // Scraping lengkap semua kategori (mingguan)
  async fullScrape() {
    if (this.isRunning) {
      this.log('Scraping already in progress, skipping full scrape', 'warn');
      return;
    }

    this.isRunning = true;
    this.log('Starting full games scraping...');
    
    try {
      const startTime = Date.now();
      const results = await this.scraper.scrapeAllGameCategories(
        ['TOP_FREE', 'TOP_PAID', 'GROSSING'], 
        150 // games per kategori per collection
      );
      
      const duration = (Date.now() - startTime) / 1000 / 60; // menit
      
      this.log(`Full scrape completed: ${results.newGames} new, ${results.updatedGames} updated, ${results.errors} errors in ${duration.toFixed(1)} minutes`);
      
      // Simpan laporan
      await this.saveReport('full-scrape', results, duration);
      
    } catch (error) {
      this.log(`Full scrape failed: ${error.message}`, 'error');
    } finally {
      this.isRunning = false;
      this.scraper.resetStats();
    }
  }

  // Scraping games populer (harian)
  async popularScrape() {
    if (this.isRunning) {
      this.log('Scraping already in progress, skipping popular scrape', 'warn');
      return;
    }

    this.isRunning = true;
    this.log('Starting popular games scraping...');
    
    try {
      const startTime = Date.now();
      const results = await this.scraper.scrapePopularGames(500);
      
      const duration = (Date.now() - startTime) / 1000 / 60;
      
      this.log(`Popular scrape completed: ${results.newGames} new, ${results.updatedGames} updated, ${results.errors} errors in ${duration.toFixed(1)} minutes`);
      
      await this.saveReport('popular-scrape', results, duration);
      
    } catch (error) {
      this.log(`Popular scrape failed: ${error.message}`, 'error');
    } finally {
      this.isRunning = false;
      this.scraper.resetStats();
    }
  }

  // Update games yang sudah ada (harian)
  async updateExisting() {
    if (this.isRunning) {
      this.log('Scraping already in progress, skipping update', 'warn');
      return;
    }

    this.isRunning = true;
    this.log('Starting existing games update...');
    
    try {
      const startTime = Date.now();
      const results = await this.scraper.updateExistingGames(24); // update games > 24 jam
      
      const duration = (Date.now() - startTime) / 1000 / 60;
      
      this.log(`Update completed: ${results.updated} updated, ${results.errors} errors in ${duration.toFixed(1)} minutes`);
      
      await this.saveReport('update-existing', results, duration);
      
    } catch (error) {
      this.log(`Update failed: ${error.message}`, 'error');
    } finally {
      this.isRunning = false;
      this.scraper.resetStats();
    }
  }

  // Simpan laporan ke file
  async saveReport(type, results, duration) {
    const report = {
      type,
      timestamp: new Date().toISOString(),
      results,
      duration: `${duration.toFixed(1)} minutes`,
      stats: await this.scraper.db.getStats()
    };
    
    const reportFile = path.join(this.options.logPath, `report-${type}-${new Date().toISOString().split('T')[0]}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  }

  // Setup jadwal otomatis
  setupSchedule() {
    // Scraping populer setiap hari jam 2 pagi
    this.jobs.set('popular-daily', cron.schedule('0 2 * * *', async () => {
      this.log('Starting scheduled popular scrape...');
      await this.popularScrape();
    }, { scheduled: false }));

    // Update games yang ada setiap hari jam 6 pagi
    this.jobs.set('update-daily', cron.schedule('0 6 * * *', async () => {
      this.log('Starting scheduled update...');
      await this.updateExisting();
    }, { scheduled: false }));

    // Scraping lengkap setiap Minggu jam 1 pagi
    this.jobs.set('full-weekly', cron.schedule('0 1 * * 0', async () => {
      this.log('Starting scheduled full scrape...');
      await this.fullScrape();
    }, { scheduled: false }));

    // Cleanup logs lama setiap hari jam 1 pagi
    this.jobs.set('cleanup-daily', cron.schedule('0 1 * * *', async () => {
      await this.cleanupOldLogs();
    }, { scheduled: false }));

    this.log('Schedule configured:');
    this.log('- Popular scrape: Daily at 2:00 AM');
    this.log('- Update existing: Daily at 6:00 AM');
    this.log('- Full scrape: Weekly on Sunday at 1:00 AM');
    this.log('- Log cleanup: Daily at 1:00 AM');
  }

  // Mulai scheduler
  start() {
    this.jobs.forEach((job, name) => {
      job.start();
      this.log(`Started job: ${name}`);
    });
    this.log('Scheduler started');
  }

  // Hentikan scheduler
  stop() {
    this.jobs.forEach((job, name) => {
      job.stop();
      this.log(`Stopped job: ${name}`);
    });
    this.log('Scheduler stopped');
  }

  // Cleanup logs lama (> 30 hari)
  async cleanupOldLogs() {
    try {
      const files = fs.readdirSync(this.options.logPath);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 30);

      let cleaned = 0;
      
      for (const file of files) {
        const filePath = path.join(this.options.logPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filePath);
          cleaned++;
        }
      }

      if (cleaned > 0) {
        this.log(`Cleaned up ${cleaned} old log files`);
      }
    } catch (error) {
      this.log(`Log cleanup failed: ${error.message}`, 'error');
    }
  }

  // Status scheduler
  getStatus() {
    return {
      isRunning: this.isRunning,
      activeJobs: Array.from(this.jobs.keys()).map(name => ({
        name,
        running: this.jobs.get(name).running
      })),
      stats: this.scraper.getStats()
    };
  }

  async close() {
    this.stop();
    await this.scraper.close();
  }
}

export default GamesScrapingScheduler;