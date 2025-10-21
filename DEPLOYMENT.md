# Hakgida - cPanel Deployment Rehberi

## 🎯 Sistemi Cloud'a Taşıma Adımları

### 1️⃣ **cPanel Hazırlığı**

#### **Database Kurulumu:**
1. cPanel → **MySQL Veritabanları**
2. Yeni veritabanı oluştur: `hakgida_db`
3. Yeni kullanıcı oluştur: `hakgida_user`
4. Kullanıcıyı veritabanına ekle (TÜM YETKİLER)
5. Database bilgilerini not et:
   ```
   Database: cpanel_username_hakgida_db
   Username: cpanel_username_hakgida_user  
   Password: [güçlü şifre]
   Host: localhost
   ```

#### **Node.js Kurulumu:**
1. cPanel → **Node.js Selector**
2. Node.js versiyonunu seç: **18.x** veya üzeri
3. App Root: `public_html/api` (backend için)
4. Startup file: `server.js`

### 2️⃣ **Backend Deployment**

#### **Dosya Yükleme:**
1. **File Manager** veya **FTP** ile `public_html/api/` klasörüne backend dosyalarını yükle:
   ```
   public_html/api/
   ├── server.js
   ├── package.json
   ├── config/
   ├── models/
   ├── api/
   └── .env
   ```

2. **Environment dosyası oluştur** (`public_html/api/.env`):
   ```env
   NODE_ENV=production
   PORT=3001
   
   # cPanel MySQL Database
   DATABASE_URL=mysql://cpanel_username_hakgida_user:YOUR_PASSWORD@localhost:3306/cpanel_username_hakgida_db
   
   # Domain (kendi domain'inizi yazın)
   CORS_ORIGIN=https://yourdomain.com
   FRONTEND_URL=https://yourdomain.com
   ADMIN_URL=https://yourdomain.com/admin.html
   
   # Security
   JWT_SECRET=hakgida_super_secure_jwt_secret_2024
   ADMIN_PASSWORD=hakgida2024
   ```

#### **Dependencies Kurulumu:**
1. cPanel → **Terminal** (varsa) veya Node.js Selector
2. Komutları çalıştır:
   ```bash
   cd public_html/api
   npm install
   npm start
   ```

### 3️⃣ **Frontend Deployment**

#### **Config Güncelleme:**
`frontend/config.js` dosyasında production URL'ini güncelle:
```javascript
return `https://yourdomain.com/api`;
// veya subdomain kullanıyorsanız:
return `https://api.yourdomain.com`;
```

#### **Dosya Yükleme:**
1. Frontend dosyalarını `public_html/` ana dizinine yükle:
   ```
   public_html/
   ├── index.html
   ├── admin.html
   ├── products.html
   ├── product-detail.html
   ├── config.js
   ├── assets/
   └── api/ (backend dosyaları)
   ```

### 4️⃣ **Domain ve SSL Ayarları**

#### **Subdomain Oluşturma (Opsiyonel):**
1. cPanel → **Subdomains**
2. `api.yourdomain.com` oluştur
3. Document Root: `public_html/api`

#### **SSL Sertifikası:**
1. cPanel → **SSL/TLS**
2. **Let's Encrypt** ücretsiz SSL aktifleştir
3. Hem ana domain hem api subdomain için

### 5️⃣ **Database Migration**

#### **Otomatik Table Oluşturma:**
Backend ilk çalıştığında tablolar otomatik oluşur (`sequelize.sync`)

#### **Manuel Tablo Oluşturma (Gerekirse):**
```sql
USE cpanel_username_hakgida_db;

CREATE TABLE Products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image TEXT,
    stock INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 6️⃣ **Test Etme**

#### **Backend Test:**
- `https://yourdomain.com/api/health` → Status OK dönmeli
- `https://yourdomain.com/api/products` → Ürünler listesi

#### **Frontend Test:**
- `https://yourdomain.com` → Ana sayfa
- `https://yourdomain.com/admin.html` → Admin panel
- `https://yourdomain.com/products.html` → Ürünler sayfası

### 7️⃣ **Production Optimizasyonları**

#### **Security Headers:**
`.htaccess` dosyası oluştur (`public_html/.htaccess`):
```apache
# Security Headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# HTTPS Redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# API Routes
RewriteRule ^api/(.*)$ /api/server.js [L,QSA]
```

#### **Performance:**
- **Cloudflare** CDN ekle (ücretsiz)
- **Gzip** compression aktif
- **Browser caching** ayarla

### 8️⃣ **Monitoring ve Backup**

#### **Otomatik Backup:**
1. cPanel → **Backup Wizard**
2. Günlük otomatik backup ayarla
3. Database ve dosyaları dahil et

#### **Log Monitoring:**
```bash
# Error logs
tail -f /home/username/logs/yourdomain.com.error.log

# Access logs  
tail -f /home/username/logs/yourdomain.com.access.log
```

---

## 🔧 **Troubleshooting**

### **Yaygın Sorunlar:**

#### **"Module not found" hatası:**
```bash
cd public_html/api
npm install --production
```

#### **Database bağlantı hatası:**
- `.env` dosyasındaki DATABASE_URL'i kontrol et
- MySQL kullanıcı yetkilerini kontrol et
- cPanel'de database aktif mi kontrol et

#### **CORS hatası:**
- `config.js`'deki API URL'ini kontrol et
- Backend'de CORS_ORIGIN environment variable'ını kontrol et

#### **Admin panel açılmıyor:**
- `config.js` yükleniyor mu kontrol et
- Console'da hata var mı kontrol et
- Backend API çalışıyor mu test et

---

## 📞 **Destek**

Deployment sırasında sorun yaşarsanız:
1. Browser Console'daki hataları kontrol edin
2. cPanel Error Logs'larını inceleyin  
3. Backend API endpoint'lerini test edin
4. Database bağlantısını kontrol edin

**Başarılı deployment sonrası sisteminiz 7/24 çalışacak! 🚀** 