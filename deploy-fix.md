# 🚀 Deployment Fix untuk Database CloudPanel

## Masalah yang Ditemukan:
Server berjalan dalam mode development, menggunakan SQLite local alih-alih MySQL CloudPanel.

## File yang Perlu Diupload:

### 1. server.js (SUDAH DIPERBAIKI)
- Auto-deteksi environment production berdasarkan port 3001 dan directory /home/tazen-aso/
- Otomatis menggunakan MySQL CloudPanel di production

### 2. database/db-factory.js (SUDAH DIPERBAIKI) 
- Force MySQL untuk CloudPanel environment
- Auto-deteksi berdasarkan karakteristik server

## Langkah Deployment:

### Langkah 1: Upload Files via CloudPanel
1. Masuk ke CloudPanel File Manager
2. Navigasi ke `/home/tazen-aso/htdocs/aso.tazen.id/`
3. Upload file `server.js` yang telah diperbaiki
4. Upload file `database/db-factory.js` yang telah diperbaiki

### Langkah 2: Restart Server
1. Via SSH atau CloudPanel terminal:
```bash
cd /home/tazen-aso/htdocs/aso.tazen.id/
pm2 restart gplay-api
```

### Langkah 3: Migrate Database
```bash
curl -X POST https://aso.tazen.id/api/db/migrate
```

### Langkah 4: Verifikasi
```bash
curl https://aso.tazen.id/health
# Harus menunjukkan environment: "production" dan isCloudPanel: true
```

### Langkah 5: Test Scraping
```bash
curl -X POST https://aso.tazen.id/api/scraper/start
```

## Expected Results:
- Environment: "production" 
- isCloudPanel: true
- Data tersimpan ke MySQL CloudPanel
- Dashboard menampilkan data dari MySQL