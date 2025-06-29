# Instruksi Deployment ke CloudPanel

## 1. Upload Project
Upload semua file project ke server menggunakan FTP/SFTP:
- Host: tazen.id atau 82.29.166.20
- Username: tazen-aso
- Path: /home/tazen-aso/htdocs/aso.tazen.id/api

## 2. Koneksi SSH ke Server
```bash
ssh tazen-aso@tazen.id
# atau
ssh tazen-aso@82.29.166.20
```

## 3. Setup Database MySQL
Database sudah disiapkan di CloudPanel:
- Database: gplay
- Username: handi45
- Password: SAyang45@@

Jalankan schema MySQL:
```bash
cd /home/tazen-aso/htdocs/aso.tazen.id/api
mysql -u handi45 -p gplay < database/mysql-schema.sql
# Masukkan password: SAyang45@@
```

## 4. Install Dependencies
```bash
cd /home/tazen-aso/htdocs/aso.tazen.id/api
npm install
```

## 5. Setup Environment Variables
Pastikan file `.env.production` sudah terupload dengan konfigurasi:
```
DB_HOST=localhost
DB_USER=handi45
DB_PASSWORD=SAyang45@@
DB_NAME=gplay
NODE_ENV=production
PORT=3001
API_BASE_URL=https://aso.tazen.id
```

## 5. Setup PM2 Process Manager
```bash
# Install PM2 globally jika belum ada
npm install -g pm2

# Start aplikasi dengan PM2
pm2 start server.js --name "gplay-api"

# Save PM2 process list
pm2 save

# Setup PM2 untuk autostart
pm2 startup
```

## 6. Konfigurasi Nginx (Sudah Otomatis di CloudPanel)
CloudPanel sudah mengkonfigurasi Nginx untuk proxy ke port 3001.

## 7. Test API
Akses API di:
- https://aso.tazen.id/api
- https://aso.tazen.id/api/apps
- https://aso.tazen.id/api/developers
- https://aso.tazen.id/api/categories

## 8. Monitor Logs
```bash
# Lihat logs PM2
pm2 logs gplay-api

# Lihat logs Nginx
tail -f /home/tazen-aso/logs/error.log
tail -f /home/tazen-aso/logs/access.log
```

## 9. Update Aplikasi
Untuk update aplikasi di masa depan:
```bash
cd /home/tazen-aso/htdocs/aso.tazen.id/api
git pull # jika menggunakan git
npm install # jika ada dependency baru
pm2 restart gplay-api
```

## Troubleshooting
- Jika aplikasi tidak berjalan, cek logs dengan `pm2 logs`
- Pastikan port 3001 tidak digunakan aplikasi lain
- Cek permission file dengan `ls -la`
- Restart aplikasi dengan `pm2 restart gplay-api`