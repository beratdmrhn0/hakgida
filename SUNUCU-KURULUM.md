# 🚀 Sunucu Kurulum Rehberi

## ❌ Hata Açıklaması

Aldığınız hata: **Access denied for user 'root'@'localhost'**

**Neden oluyor?**
- Sunucuda `DATABASE_URL` environment variable'ı ayarlanmamış
- Backend MySQL'e şifresiz `root` kullanıcısı ile bağlanmaya çalışıyor
- MySQL bu bağlantıyı reddediyor

---

## ✅ Çözüm 1: SQLite Kullan (ÖNERİLEN - En Kolay)

SQLite dosya tabanlı bir veritabanıdır, ekstra kurulum gerektirmez.

### Adımlar:

```bash
# 1. Backend klasörüne git
cd /home/vito/api.hakgidaofficial.com/backend

# 2. .env dosyası oluştur
nano .env

# 3. Aşağıdaki içeriği yapıştır:
NODE_ENV=production
PORT=3001
DATABASE_URL=sqlite:./database.sqlite
JWT_SECRET=hakgida_production_jwt_secret_2024
ADMIN_PASSWORD=hakgida2024
FRONTEND_URL=https://hakgidaofficial.com

# 4. Kaydet ve çık (Ctrl+X, Y, Enter)

# 5. SQLite paketini yükle
npm install sqlite3 --save

# 6. Backend'i başlat
npm start
```

**Avantajları:**
- ✅ Kolay kurulum (MySQL kurulumu gerekmez)
- ✅ Hızlı ve hafif
- ✅ Küçük-orta ölçekli siteler için ideal
- ✅ Yedekleme kolay (tek dosya)

---

## ✅ Çözüm 2: MySQL Kullan (Advanced)

Eğer MySQL kullanmak istiyorsanız:

### Adım 1: MySQL Veritabanı Oluştur

```bash
# MySQL'e giriş yap
mysql -u root -p

# Veritabanı oluştur
CREATE DATABASE hakgida_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Kullanıcı oluştur
CREATE USER 'hakgida_user'@'localhost' IDENTIFIED BY 'GüçlüŞifre123';

# Yetkileri ver
GRANT ALL PRIVILEGES ON hakgida_db.* TO 'hakgida_user'@'localhost';
FLUSH PRIVILEGES;

# Çık
EXIT;
```

### Adım 2: .env Dosyasını Ayarla

```bash
cd /home/vito/api.hakgidaofficial.com/backend
nano .env
```

İçeriği:
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=mysql://hakgida_user:GüçlüŞifre123@localhost:3306/hakgida_db
JWT_SECRET=hakgida_production_jwt_secret_2024
ADMIN_PASSWORD=hakgida2024
FRONTEND_URL=https://hakgidaofficial.com
```

### Adım 3: MySQL paketini yükle

```bash
npm install mysql2 --save
```

### Adım 4: Backend'i başlat

```bash
npm start
```

---

## 🔧 PM2 ile Otomatik Başlatma (Recommended)

Backend'in sürekli çalışması için PM2 kullanın:

```bash
# PM2 yükle (global)
npm install -g pm2

# Backend'i PM2 ile başlat
cd /home/vito/api.hakgidaofficial.com/backend
pm2 start npm --name "hakgida-api" -- start

# Otomatik başlatma için kaydet
pm2 save
pm2 startup

# Durumu kontrol et
pm2 status
pm2 logs hakgida-api
```

**PM2 Komutları:**
```bash
pm2 start hakgida-api      # Başlat
pm2 stop hakgida-api       # Durdur
pm2 restart hakgida-api    # Yeniden başlat
pm2 logs hakgida-api       # Log'ları göster
pm2 monit                  # Monitor
```

---

## 🌐 Nginx Reverse Proxy Ayarı

```nginx
# /etc/nginx/sites-available/api.hakgidaofficial.com
server {
    listen 80;
    server_name api.hakgidaofficial.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Nginx'i test et ve yeniden başlat
sudo nginx -t
sudo systemctl restart nginx

# SSL sertifikası ekle (Let's Encrypt)
sudo certbot --nginx -d api.hakgidaofficial.com
```

---

## 📊 Test Et

```bash
# Health check
curl http://localhost:3001/health

# API test
curl http://localhost:3001/api/products

# Dışarıdan erişim
curl https://api.hakgidaofficial.com/health
```

---

## 🔍 Sorun Giderme

### Log'ları kontrol et:
```bash
# PM2 log'ları
pm2 logs hakgida-api

# Nginx log'ları
sudo tail -f /var/log/nginx/error.log

# Backend log'ları
cd /home/vito/api.hakgidaofficial.com/backend
cat logs/error.log
```

### Database bağlantı testi:
```bash
cd /home/vito/api.hakgidaofficial.com/backend
node -e "require('./config/database').testConnection()"
```

---

## 📝 Önemli Notlar

1. **.env dosyasını asla Git'e eklemeyin**
2. **JWT_SECRET'i değiştirin** (production için)
3. **Admin şifresini güçlü yapın**
4. **Firewall ayarlarını kontrol edin**
5. **SSL sertifikası ekleyin** (Let's Encrypt ücretsiz)

---

## 🎯 Hızlı Başlatma (SQLite)

En hızlı çözüm:

```bash
cd /home/vito/api.hakgidaofficial.com/backend
echo 'NODE_ENV=production
PORT=3001
DATABASE_URL=sqlite:./database.sqlite
JWT_SECRET=hakgida_secret_2024
ADMIN_PASSWORD=hakgida2024
FRONTEND_URL=https://hakgidaofficial.com' > .env
npm install sqlite3
npm start
```

✅ Bu kadar! Backend çalışmaya başlayacak.
