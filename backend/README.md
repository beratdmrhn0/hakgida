# 🚀 Hakgida Backend - Railway Deployment Guide

## 📋 Deployment Adımları

### 1️⃣ Railway.app Hesabı
1. **Railway.app**'e git: https://railway.app
2. **GitHub ile giriş yap**
3. **Ücretsiz hesap oluştur** (500 saat/ay ücretsiz)

### 2️⃣ PostgreSQL Database Oluştur
1. Railway Dashboard'da **+ New Project**
2. **Database** seçeneğini seç
3. **PostgreSQL** seç
4. Database otomatik oluşturulacak
5. **DATABASE_URL** otomatik oluşturulacak

### 3️⃣ Backend Projesi Deploy Et
1. **+ New Service** tıkla
2. **GitHub Repo**'yu seç
3. **hakgida/backend** klasörünü seç
4. **Deploy** butonuna tıkla
5. **Environment Variables** ekle:
   - `NODE_ENV=production`
   - `ADMIN_PASSWORD=hakgida2024`
   - `JWT_SECRET=your-secret-key`

### 4️⃣ Domain Ayarları
1. **Settings > Networking**
2. **Generate Domain** tıkla
3. Domain: `hakgida-backend.railway.app`
4. **Custom Domain** ekleyebilirsin

### 5️⃣ Test Et
```bash
# Health check
curl https://hakgida-backend.railway.app/health

# Products API
curl https://hakgida-backend.railway.app/api/products
```

## 🔧 Local Development

### Kurulum
```bash
cd backend
npm install
npm run dev
```

### Environment Variables
```bash
# .env dosyası oluştur
cp environment.example .env
# Değerleri düzenle
```

### Database
```bash
# PostgreSQL kurulumu (macOS)
brew install postgresql
brew services start postgresql

# Database oluştur
createdb hakgida_dev
```

## 📦 Production Features

### ✅ Hazır Özellikler
- **PostgreSQL Database** (Railway hosted)
- **JWT Authentication** (Admin panel için)
- **CORS Setup** (Frontend entegrasyonu)
- **Error Handling** (Comprehensive error management)
- **Logging** (Request/Response logging)
- **Security** (Helmet, Rate limiting)
- **File Upload** (Multer integration)
- **Validation** (Joi/Sequelize validation)

### 🔒 Security
- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API abuse protection
- **JWT** - Secure authentication
- **Input Validation** - SQL injection prevention

### 🚀 Performance
- **Compression** - Response compression
- **Connection Pooling** - Database optimization
- **Caching** - Response caching
- **Error Recovery** - Automatic retry logic

## 🌐 API Endpoints

### Products
- `GET /api/products` - Tüm ürünler
- `GET /api/products/:id` - Tekil ürün
- `POST /api/products` - Yeni ürün
- `PUT /api/products/:id` - Ürün güncelle
- `DELETE /api/products/:id` - Ürün sil

### Categories
- `GET /api/categories` - Tüm kategoriler
- `POST /api/categories` - Yeni kategori

### Admin
- `POST /api/admin/login` - Admin girişi
- `GET /api/admin/stats` - İstatistikler

### Upload
- `POST /api/upload` - Dosya yükle

## 📱 Frontend Entegrasyonu

### JavaScript Fetch
```javascript
// Products API
const response = await fetch('https://hakgida-backend.railway.app/api/products');
const data = await response.json();

// Admin Login
const loginResponse = await fetch('https://hakgida-backend.railway.app/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'hakgida2024' })
});
```

### Admin Panel Connection
```javascript
// Admin panel'deki products.js dosyasını güncelle
const API_BASE_URL = 'https://hakgida-backend.railway.app/api';
```

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Railway logs kontrol et
railway logs --follow
```

### Environment Variables
```bash
# Railway'de environment variables kontrol et
railway variables
```

### CORS Issues
```javascript
// Frontend URL'ini backend CORS ayarlarına ekle
origin: ['https://hakgida.com', 'https://hakgida.vercel.app']
```

## 💰 Maliyet
- **Database**: Ücretsiz (512MB)
- **Backend**: Ücretsiz (500 saat/ay)
- **Toplam**: **$0/ay** (hobbyist kullanım için)
- **Scaling**: $5/ay (unlimited usage)

## 🎯 Next Steps
1. **Frontend'i Vercel'e deploy et**
2. **Custom domain bağla**
3. **SSL certificate otomatik aktif**
4. **Monitoring setup**
5. **Backup strategy**

---

**🚀 Railway ile 5 dakikada production-ready backend!** 