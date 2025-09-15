#!/bin/bash

# Hakgida cPanel Deployment Script
# Bu script projenizi cPanel'e deploy etmek için gerekli dosyaları hazırlar

echo "🚀 Hakgida cPanel Deployment Başlıyor..."

# Deployment klasörü oluştur
DEPLOY_DIR="cpanel-deployment"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

echo "📁 Deployment klasörü oluşturuldu: $DEPLOY_DIR"

# Backend dosyalarını kopyala
echo "📦 Backend dosyaları kopyalanıyor..."
cp -r backend/* $DEPLOY_DIR/
cp .env.cpanel $DEPLOY_DIR/.env
cp .htaccess $DEPLOY_DIR/

# Frontend dosyalarını backend içine kopyala (cPanel için)
echo "🎨 Frontend dosyaları kopyalanıyor..."
mkdir -p $DEPLOY_DIR/public
cp -r frontend/* $DEPLOY_DIR/public/

# package.json'u güncelle (production için)
echo "📝 Package.json güncelleniyor..."
cat > $DEPLOY_DIR/package.json << 'EOF'
{
  "name": "hakgida-cpanel",
  "version": "1.0.0",
  "description": "Hakgida cPanel Production",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "postinstall": "echo 'cPanel setup complete'"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "helmet": "^7.1.0",
    "joi": "^17.11.0",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "mysql2": "^3.14.1",
    "rate-limiter-flexible": "^4.0.1",
    "sequelize": "^6.35.0"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  }
}
EOF

# Server.js'i cPanel için güncelle
echo "⚙️ Server.js cPanel için optimize ediliyor..."
cat > $DEPLOY_DIR/server-cpanel.js << 'EOF'
// Hakgida cPanel Production Server
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { sequelize } = require('./config/database');

const app = express();

// cPanel için özel ayarlar
app.set('trust proxy', 1);

// Middleware
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false
}));
app.use(compression());
app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        process.env.CORS_ORIGIN,
        'https://' + process.env.CPANEL_HOST,
        'http://' + process.env.CPANEL_HOST
    ],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files - frontend
app.use(express.static(path.join(__dirname, 'public')));

// Static files - uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/products', require('./api/routes/products'));
app.use('/api/categories', require('./api/routes/categories'));
app.use('/api/admin', require('./api/routes/admin'));
app.use('/api/upload', require('./api/routes/upload'));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Frontend routes (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;

// Start server
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');
        
        await sequelize.sync({ force: false });
        console.log('✅ Database synced');
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Server start failed:', error);
    }
}

startServer();
EOF

# README dosyası oluştur
echo "📚 README dosyası oluşturuluyor..."
cat > $DEPLOY_DIR/README-CPANEL.md << 'EOF'
# Hakgida cPanel Deployment

## cPanel'e Yükleme Talimatları:

### 1. Dosyaları Yükle
- Bu klasördeki tüm dosyaları cPanel File Manager ile `public_html` klasörüne yükleyin

### 2. Environment Ayarları
- `.env` dosyasını düzenleyin:
  - `DATABASE_URL` değerini cPanel MySQL bilgilerinizle güncelleyin
  - `CPANEL_HOST` değerini domain adınızla değiştirin
  - Admin şifresini güvenli bir değerle değiştirin

### 3. Database Kurulumu
- cPanel → MySQL Databases
- Database: `yourusername_hakgida`
- User: `yourusername_hakgida`
- Password: güvenli şifre

### 4. Node.js Aktifleştir
- cPanel → Node.js Selector
- Version: 16+ seçin
- App Root: `public_html`
- Startup File: `server.js`

### 5. .htaccess Güncelle
- `.htaccess` dosyasındaki `/home/yourusername/public_html` yolunu kendi path'inizle değiştirin

### 6. NPM Install
Terminal'de:
```bash
cd public_html
npm install
```

### 7. Test
- https://yourdomain.com/health adresine gidin
- JSON response gelirse başarılı!
EOF

echo "🎉 Deployment hazırlığı tamamlandı!"
echo "📁 Deployment klasörü: $DEPLOY_DIR"
echo ""
echo "📋 Sonraki adımlar:"
echo "1. $DEPLOY_DIR klasöründeki dosyaları cPanel'e yükleyin"
echo "2. .env dosyasını düzenleyin"
echo "3. MySQL database oluşturun"
echo "4. Node.js'i aktifleştirin"
echo "5. npm install çalıştırın"
echo ""
echo "📖 Detaylı talimatlar: $DEPLOY_DIR/README-CPANEL.md"