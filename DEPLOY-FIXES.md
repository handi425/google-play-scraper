# 🔧 **DEPLOY FIXES - Perbaikan Database CloudPanel**

## 🎯 **Root Cause Ditemukan:**

**MASALAH**: Games tidak tersimpan ke MySQL meski developers tersimpan karena:

1. **Data Format Issues** - released_date, score precision, price format
2. **Schema Limitations** - score DECIMAL(3,2) terlalu kecil untuk Google Play scores  
3. **Type Conversion Errors** - JavaScript Date vs MySQL DATE format

## 📁 **File yang Telah Diperbaiki:**

### 1. `/database/mysql-db.js` (PERBAIKAN UTAMA)
**Problem**: insertGame() gagal karena format data tidak sesuai MySQL  
**Solution**: Tambah data formatting sebelum insert:
- Format released_date ke MySQL DATE format  
- Cap score maksimal 9.99 untuk DECIMAL(4,2)
- Parse price ke float dengan fallback 0

### 2. `/database/mysql-schema.sql` 
**Problem**: score DECIMAL(3,2) maksimal 9.99, tapi Google Play ada score > 9.99
**Solution**: Ubah ke DECIMAL(4,2) untuk support score sampai 99.99

### 3. `/server.js` (ENDPOINT BARU)
**Tambahan**:
- `POST /api/db/fix-schema` - Fix schema issues yang sudah ada
- `POST /api/test/save-app/:appId` - Test endpoint untuk debug single app

## 🚀 **Langkah Deployment:**

### 1. Upload File yang Diperbaiki
```bash
# Via CloudPanel File Manager, upload:
- database/mysql-db.js (WAJIB)
- server.js (optional, untuk endpoint baru)
```

### 2. Fix Database Schema
```bash
curl -X POST https://aso.tazen.id/api/db/fix-schema
```

### 3. Restart PM2 (Jika upload server.js)
```bash
pm2 restart gplay-api
```

### 4. Test Scraping
```bash
curl -X POST "https://aso.tazen.id/api/scraper/category/GAME?collection=TOP_FREE&num=5"
```

### 5. Verify Results
```bash
curl "https://aso.tazen.id/api/db/stats"
# Harus menunjukkan totalGames > 0
```

## 🔍 **Expected Results:**

**SEBELUM Perbaikan:**
- ✅ Developers: 1295 (tersimpan)  
- ❌ Games: 0 (error saat insert)
- ❌ Scraping logs: semua error

**SETELAH Perbaikan:**
- ✅ Developers: Terus bertambah
- ✅ Games: Mulai tersimpan ke database  
- ✅ Dashboard: Menampilkan data real
- ✅ Scraping logs: Status completed dengan games_scraped > 0

## 📋 **Priority Upload:**

**WAJIB UPLOAD**: 
1. `database/mysql-db.js` (fix utama)

**OPTIONAL**: 
1. `server.js` (endpoint tambahan)
2. `database/mysql-schema.sql` (untuk referensi)

Setelah upload mysql-db.js dan restart, masalah games tidak tersimpan akan teratasi!