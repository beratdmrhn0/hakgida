#!/bin/bash

# Hakgida - cPanel Deployment Package Creator
echo "📦 Hakgida cPanel Deployment Package Creator"
echo "============================================="

# Create deployment directory
echo "📁 Creating deployment directory..."
mkdir -p deployment/frontend
mkdir -p deployment/backend

# Copy Frontend files
echo "📄 Copying frontend files..."
cp -r frontend/* deployment/frontend/
echo "✅ Frontend files copied"

# Copy Backend files (excluding node_modules and logs)
echo "🔧 Copying backend files..."
cp -r backend/* deployment/backend/
rm -rf deployment/backend/node_modules
rm -rf deployment/backend/logs
rm -rf deployment/backend/.env
echo "✅ Backend files copied"

# Create deployment instructions
echo "📋 Creating deployment instructions..."
cp DEPLOYMENT.md deployment/
echo "✅ Deployment instructions added"

# Create example .env file for backend
echo "🔐 Creating example environment file..."
cat > deployment/backend/.env.example << 'EOF'
# cPanel Production Environment
NODE_ENV=production
PORT=3001

# cPanel MySQL Database (Update with your actual details)
DATABASE_URL=mysql://cpanel_username_hakgida_user:YOUR_PASSWORD@localhost:3306/cpanel_username_hakgida_db

# Domain (Update with your actual domain)
CORS_ORIGIN=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
ADMIN_URL=https://yourdomain.com/admin.html

# Security (Change these!)
JWT_SECRET=hakgida_super_secure_jwt_secret_2024
ADMIN_PASSWORD=hakgida2024

# Upload Settings
UPLOAD_MAX_SIZE=5242880
UPLOAD_ALLOWED_TYPES=jpg,jpeg,png,gif,webp

# Database Pool Settings
DB_POOL_MAX=5
DB_POOL_MIN=0
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000
EOF
echo "✅ Example environment file created"

# Create deployment checklist
echo "📝 Creating deployment checklist..."
cat > deployment/CHECKLIST.md << 'EOF'
# cPanel Deployment Checklist

## ✅ Pre-Deployment
- [ ] cPanel hosting hesabınız hazır
- [ ] Domain adınız mevcut
- [ ] cPanel'de Node.js support var mı kontrol ettiniz
- [ ] MySQL veritabanı oluşturmaya hazırsınız

## ✅ Database Setup
- [ ] cPanel → MySQL Databases
- [ ] Yeni database oluşturuldu: `hakgida_db`
- [ ] Yeni user oluşturuldu: `hakgida_user`
- [ ] User database'e TÜM YETKİLERLE eklendi
- [ ] Database bilgileri not edildi

## ✅ Backend Deployment
- [ ] `backend/` klasörü `public_html/api/` altına yüklendi
- [ ] `.env.example` → `.env` olarak kopyalandı ve düzenlendi
- [ ] cPanel Node.js Selector'da app ayarlandı
- [ ] `npm install` çalıştırıldı
- [ ] Backend başlatıldı

## ✅ Frontend Deployment
- [ ] `frontend/` klasörü `public_html/` ana dizinine yüklendi
- [ ] `config.js`'de production URL güncellendi
- [ ] SSL sertifikası aktifleştirildi

## ✅ Testing
- [ ] `https://yourdomain.com/api/health` → Status OK
- [ ] `https://yourdomain.com/api/products` → Products list
- [ ] `https://yourdomain.com` → Homepage works
- [ ] `https://yourdomain.com/admin.html` → Admin panel works
- [ ] Admin panelde ürün ekleme/silme test edildi

## 🎉 Go Live!
- [ ] Backup scheduled
- [ ] Monitoring setup
- [ ] Team informed
EOF
echo "✅ Deployment checklist created"

# Create ZIP packages
echo "📦 Creating ZIP packages..."
cd deployment

# Backend package
zip -r hakgida-backend.zip backend/ DEPLOYMENT.md CHECKLIST.md
echo "✅ Backend package: hakgida-backend.zip"

# Frontend package  
zip -r hakgida-frontend.zip frontend/ DEPLOYMENT.md CHECKLIST.md
echo "✅ Frontend package: hakgida-frontend.zip"

# Complete package
zip -r hakgida-complete.zip backend/ frontend/ DEPLOYMENT.md CHECKLIST.md
echo "✅ Complete package: hakgida-complete.zip"

cd ..

echo ""
echo "🎉 Deployment packages created successfully!"
echo "📂 Files in deployment/ directory:"
ls -la deployment/
echo ""
echo "📋 Next steps:"
echo "1. Upload hakgida-backend.zip to your cPanel"
echo "2. Extract to public_html/api/"
echo "3. Upload hakgida-frontend.zip to your cPanel"  
echo "4. Extract to public_html/"
echo "5. Follow DEPLOYMENT.md instructions"
echo ""
echo "🚀 Happy deploying!" 