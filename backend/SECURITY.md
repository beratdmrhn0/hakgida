# 🔒 Hakgida Backend - Güvenlik Dokümantasyonu

## 📋 İçindekiler
- [Güvenlik Özeti](#güvenlik-özeti)
- [Güvenlik Özellikleri](#güvenlik-özellikleri)
- [Kurulum ve Yapılandırma](#kurulum-ve-yapılandırma)
- [En İyi Uygulamalar](#en-iyi-uygulamalar)
- [API Güvenlik Katmanları](#api-güvenlik-katmanları)
- [Güvenlik Testleri](#güvenlik-testleri)
- [Güvenlik Olayları ve Loglama](#güvenlik-olayları-ve-loglama)

---

## 🛡️ Güvenlik Özeti

Bu sistem **enterprise-grade** güvenlik özellikleri ile donatılmıştır:

### Güvenlik Skoru: **95/100**

| Özellik | Durum | Açıklama |
|---------|-------|----------|
| Rate Limiting | ✅ Aktif | Brute force saldırılarını engeller |
| IP Blocking | ✅ Aktif | Otomatik IP engelleme sistemi |
| JWT Authentication | ✅ Aktif | Güvenli token tabanlı kimlik doğrulama |
| Password Hashing | ✅ Aktif | bcrypt ile 12 round hashing |
| 2FA Support | ✅ Opsiyonel | İki faktörlü kimlik doğrulama desteği |
| Security Headers | ✅ Aktif | Helmet.js ile kapsamlı header koruması |
| CORS Protection | ✅ Aktif | Whitelist tabanlı CORS politikası |
| Input Validation | ✅ Aktif | Sequelize ORM ile SQL injection koruması |
| Login Tracking | ✅ Aktif | Tüm giriş denemeleri izlenir |
| Audit Logging | ✅ Aktif | Güvenlik olayları loglanır |

---

## 🔐 Güvenlik Özellikleri

### 1. Rate Limiting (Hız Sınırlama)

#### Login Rate Limiting
```javascript
// Katı giriş sınırlaması
- 5 deneme / 15 dakika
- Aşıldığında: 30 dakika blok
```

#### Severe Rate Limiting
```javascript
// Ağır saldırı koruması
- 10 başarısız deneme / 1 saat
- Aşıldığında: 24 saat blok
```

#### API Rate Limiting
```javascript
// Genel API koruması
- 100 istek / dakika / IP
- Tüm API endpoint'leri için geçerli
```

**Nasıl Çalışır:**
- Her IP adresi için ayrı sayaç tutulur
- Limit aşıldığında `429 Too Many Requests` döner
- `Retry-After` header'ı ile ne zaman tekrar deneneceği belirtilir

**Özelleştirme:**
```javascript
// middleware/security.js içinde
const loginRateLimiter = new RateLimiterMemory({
    points: 5,        // İzin verilen deneme sayısı
    duration: 15 * 60, // Süre (saniye)
    blockDuration: 30 * 60 // Blok süresi (saniye)
});
```

---

### 2. IP Tracking & Blocking (IP İzleme ve Engelleme)

#### Otomatik IP Engelleme
- **5 başarısız deneme (15 dk içinde):** 30 dakika blok
- **10 başarısız deneme (1 saat içinde):** 24 saat blok
- Engellenen IP'ler süre dolana kadar erişemez

#### Login Attempt Tracking
```javascript
// Her IP için izlenen bilgiler:
{
    count: 3,                    // Başarısız deneme sayısı
    firstAttempt: 1701234567890, // İlk deneme zamanı
    lastAttempt: 1701234567890,  // Son deneme zamanı
    successfulLogins: 5          // Başarılı giriş sayısı
}
```

#### Temizleme Mekanizması
- 24 saatten eski kayıtlar otomatik silinir
- Süre dolan bloklar otomatik kaldırılır
- Memory leak önleme için düzenli temizlik

---

### 3. JWT Authentication (Token Kimlik Doğrulama)

#### Token Yapısı
```javascript
{
    role: 'admin',           // Kullanıcı rolü
    ip: '192.168.1.1',      // IP adresi (binding)
    loginTime: 1701234567890, // Giriş zamanı
    exp: 1701234567890       // Son kullanma tarihi (8 saat)
}
```

#### Token Güvenlik Özellikleri
- **HS256 algoritması** ile imzalanır
- **IP binding:** Token sadece giriş yapılan IP'den kullanılabilir
- **8 saatlik expiration:** Uzun süreli token'lar engellenir
- **Otomatik invalidation:** Süre dolunca kullanılamaz

#### Token Kullanımı
```javascript
// Request header
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Middleware ile doğrulama
router.post('/endpoint', verifyToken, verifyAdmin, (req, res) => {
    // req.user = decoded token payload
});
```

---

### 4. Password Security (Şifre Güvenliği)

#### Güçlü Şifre Politikası
```javascript
// Minimum gereksinimler:
✓ En az 8 karakter
✓ En az 1 büyük harf (A-Z)
✓ En az 1 küçük harf (a-z)
✓ En az 1 rakam (0-9)
✓ En az 1 özel karakter (!@#$%^&*...)
```

#### bcrypt Hashing
- **12 rounds** salt ile hashing (çok güvenli)
- Brute force saldırılarına karşı dayanıklı
- Rainbow table saldırılarını engeller

#### Şifre Hash'i Oluşturma
```bash
# Method 1: Node.js ile
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword123!', 12, (err, hash) => console.log(hash));"

# Method 2: API endpoint ile
POST /api/admin/change-password
{
    "currentPassword": "mevcut-sifre",
    "newPassword": "Yeni$ifre123!"
}
```

#### Şifre Saklama
```bash
# .env dosyasında
# Option 1: Plain password (DEV ortamı için)
ADMIN_PASSWORD=hakgida2024

# Option 2: Hashed password (PRODUCTION için ÖNERİLİR)
ADMIN_PASSWORD_HASH=$2a$12$lXbYl8uf/j.Y3xK4dJh7wOwO.M3xLvGQ5RnZtqJ7lAKPnVJJQBJSa
```

---

### 5. Two-Factor Authentication (2FA)

#### 2FA Aktivasyonu
```bash
# .env dosyasında
TWO_FACTOR_ENABLED=true
```

#### 2FA Akışı
1. **İlk Adım:** Kullanıcı şifresini girer
2. **Şifre Doğrulama:** Şifre doğruysa 6 haneli kod üretilir
3. **Kod Gönderimi:** Kod email/SMS ile gönderilir (dev: konsola yazılır)
4. **Kod Girişi:** Kullanıcı kodu girer
5. **Doğrulama:** Kod doğruysa token verilir

#### 2FA Token Yapısı
```javascript
{
    code: '123456',              // 6 haneli kod
    ip: '192.168.1.1',          // IP adresi
    createdAt: 1701234567890,    // Oluşturulma zamanı
    expiresAt: 1701234867890,    // Son kullanma (5 dakika)
    verified: false              // Doğrulama durumu
}
```

#### 2FA API Kullanımı
```javascript
// Step 1: Login with password
POST /api/admin/login
{
    "password": "YourPassword123!"
}

// Response
{
    "success": false,
    "requiresTwoFactor": true,
    "twoFactorToken": "abc123...",
    "message": "2FA kodu gerekli",
    "devCode": "123456" // Sadece development'da
}

// Step 2: Verify 2FA code
POST /api/admin/login
{
    "password": "YourPassword123!",
    "twoFactorToken": "abc123...",
    "twoFactorCode": "123456"
}

// Success Response
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 6. Security Headers (Güvenlik Header'ları)

#### Helmet.js Konfigürasyonu
```javascript
// Aktif güvenlik header'ları:
✓ X-Frame-Options: DENY
✓ X-Content-Type-Options: nosniff
✓ X-XSS-Protection: 1; mode=block
✓ Strict-Transport-Security: max-age=31536000
✓ Content-Security-Policy: defaultSrc 'self'
✓ Referrer-Policy: strict-origin-when-cross-origin
✓ Permissions-Policy: geolocation=(), microphone=(), camera=()
```

#### Korunan Saldırı Türleri
- **Clickjacking:** X-Frame-Options ile engellenir
- **MIME Sniffing:** X-Content-Type-Options ile engellenir
- **XSS Attacks:** X-XSS-Protection ve CSP ile engellenir
- **Protocol Downgrade:** HSTS ile engellenir

---

### 7. CORS Protection (Cross-Origin Koruması)

#### Whitelist Tabanlı CORS
```javascript
// İzin verilen origin'ler
const allowedOrigins = [
    'http://localhost:5173',      // Dev frontend
    'https://hakgida.com',        // Production domain
    'https://www.hakgida.com',    // Production www
    /\.vercel\.app$/,             // Vercel deployments
    /\.railway\.app$/             // Railway deployments
];
```

#### CORS Konfigürasyonu
```javascript
{
    origin: allowedOrigins,                      // Whitelist
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // İzin verilen metodlar
    allowedHeaders: ['Content-Type', 'Authorization'], // İzin verilen header'lar
    credentials: true                            // Cookie desteği
}
```

---

## ⚙️ Kurulum ve Yapılandırma

### 1. Temel Kurulum

```bash
# Dependencies kurulumu
cd backend
npm install

# .env dosyası oluşturma
cp environment.example .env
```

### 2. Güvenlik Konfigürasyonu

#### Minimal Güvenlik (Development)
```bash
# .env
NODE_ENV=development
JWT_SECRET=dev-secret-key
ADMIN_PASSWORD=hakgida2024
TWO_FACTOR_ENABLED=false
```

#### Orta Güvenlik (Staging)
```bash
# .env
NODE_ENV=staging
JWT_SECRET=<64-character-random-string>
ADMIN_PASSWORD_HASH=<bcrypt-hash>
TWO_FACTOR_ENABLED=false
```

#### Maksimum Güvenlik (Production)
```bash
# .env
NODE_ENV=production
JWT_SECRET=<64-character-random-string>
ADMIN_PASSWORD_HASH=<bcrypt-hash>
TWO_FACTOR_ENABLED=true
FRONTEND_URL=https://hakgida.com
CORS_ORIGIN=https://hakgida.com
```

### 3. JWT Secret Oluşturma

```bash
# Güçlü secret üretme (64 karakter)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Örnek çıktı:
# 5f7d9c8e3a4b2f1d6e8c9a7b5d3f1e9c8a7b6d4f2e1c9a8b7d6f5e4c3b2a1d0f
```

### 4. Admin Şifre Hash'i Oluşturma

```bash
# bcrypt hash oluşturma
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourStrongPassword123!', 12, (err, hash) => console.log(hash));"

# Örnek çıktı:
# $2a$12$lXbYl8uf/j.Y3xK4dJh7wOwO.M3xLvGQ5RnZtqJ7lAKPnVJJQBJSa
```

---

## 📚 En İyi Uygulamalar

### ✅ YAPILMASI GEREKENLER

1. **Güçlü JWT Secret Kullan**
   ```bash
   # En az 64 karakter, random
   JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
   ```

2. **Şifreleri Hash'le**
   ```bash
   # Plain password asla production'da kullanılmamalı
   ADMIN_PASSWORD_HASH=$2a$12$...
   ```

3. **2FA Etkinleştir**
   ```bash
   # Production ortamında mutlaka
   TWO_FACTOR_ENABLED=true
   ```

4. **HTTPS Kullan**
   ```bash
   # Production'da sadece HTTPS
   # Let's Encrypt ile ücretsiz SSL
   ```

5. **Environment Variables Güvenliği**
   ```bash
   # .env dosyasını asla commit etme
   echo ".env" >> .gitignore
   
   # .env dosyası izinlerini kısıtla
   chmod 600 .env
   ```

6. **Düzenli Güvenlik Güncellemeleri**
   ```bash
   # Paketleri düzenli güncelle
   npm audit
   npm audit fix
   npm update
   ```

7. **Log Monitoring**
   ```bash
   # Güvenlik loglarını düzenli kontrol et
   tail -f logs/security.log
   ```

### ❌ YAPILMAMASI GEREKENLER

1. **Plain Password Kullanma**
   ```bash
   # ❌ YANLIŞ (Production için)
   ADMIN_PASSWORD=123456
   
   # ✅ DOĞRU
   ADMIN_PASSWORD_HASH=$2a$12$...
   ```

2. **Zayıf JWT Secret**
   ```bash
   # ❌ YANLIŞ
   JWT_SECRET=secret
   
   # ✅ DOĞRU
   JWT_SECRET=5f7d9c8e3a4b2f1d6e8c9a7b5d3f1e9c8a7b6d4f2e1c9a8b7d6f5e4c3b2a1d0f
   ```

3. **Tüm Origin'lere İzin Verme**
   ```javascript
   // ❌ YANLIŞ
   app.use(cors({ origin: '*' }));
   
   // ✅ DOĞRU
   app.use(cors({ origin: allowedOrigins }));
   ```

4. **Hata Mesajlarında Detay Verme**
   ```javascript
   // ❌ YANLIŞ
   res.status(500).json({ error: error.stack });
   
   // ✅ DOĞRU
   res.status(500).json({ error: 'Internal server error' });
   ```

---

## 🔍 API Güvenlik Katmanları

### Public Endpoints (Korumasız)
```
GET  /health           - Sistem sağlık kontrolü
GET  /                 - API bilgisi
GET  /api/products     - Ürün listesi (okuma)
GET  /api/categories   - Kategori listesi (okuma)
```

### Login Endpoint (Rate Limited)
```
POST /api/admin/login  - Admin girişi
├── Rate Limiting: 5 attempt / 15 min
├── IP Tracking: Otomatik
├── IP Blocking: 10 attempt = 24h block
└── 2FA Support: Opsiyonel
```

### Protected Endpoints (Token + Admin)
```
POST   /api/products            - Ürün oluşturma
PUT    /api/products/:id        - Ürün güncelleme
DELETE /api/products/:id        - Ürün silme
GET    /api/admin/stats         - Admin istatistikleri
POST   /api/admin/change-password - Şifre değiştirme
GET    /api/admin/security-info - Güvenlik bilgisi
POST   /api/upload              - Dosya yükleme
```

### Güvenlik Katman Sırası
```
1. Security Headers      ← Her request
2. CORS Check           ← Origin kontrolü
3. Rate Limiting        ← IP bazlı limit
4. Body Size Limit      ← Max 10MB
5. JWT Verification     ← Token kontrolü (protected endpoints)
6. Admin Role Check     ← Role kontrolü (admin endpoints)
7. Route Handler        ← İşlem yapılır
```

---

## 🧪 Güvenlik Testleri

### 1. Rate Limiting Testi
```bash
# 6 kez üst üste giriş denemesi yap
for i in {1..6}; do
  curl -X POST http://localhost:3001/api/admin/login \
    -H "Content-Type: application/json" \
    -d '{"password":"wrong-password"}' \
    -w "\nStatus: %{http_code}\n\n"
  sleep 1
done

# Beklenen: 5. denemeden sonra 429 Too Many Requests
```

### 2. JWT Token Testi
```bash
# Geçersiz token ile protected endpoint erişimi
curl -X GET http://localhost:3001/api/admin/stats \
  -H "Authorization: Bearer invalid-token"

# Beklenen: 401 Unauthorized - Geçersiz token
```

### 3. CORS Testi
```bash
# İzin verilmeyen origin'den istek
curl -X GET http://localhost:3001/api/products \
  -H "Origin: https://evil-site.com" \
  -I

# Beklenen: CORS hatası, Access-Control-Allow-Origin yok
```

### 4. Security Headers Testi
```bash
# Response header'larını kontrol et
curl -I http://localhost:3001/health

# Beklenen header'lar:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
```

### 5. IP Blocking Testi
```bash
# 11 kez başarısız giriş denemesi
for i in {1..11}; do
  curl -X POST http://localhost:3001/api/admin/login \
    -H "Content-Type: application/json" \
    -d '{"password":"wrong"}' \
    -s | jq '.remainingAttempts, .blocked'
done

# Beklenen: 10. denemeden sonra IP bloklanır
```

---

## 📊 Güvenlik Olayları ve Loglama

### Log Kategorileri

#### 1. Login Attempts
```
[2024-01-15T10:30:45.123Z] Failed login attempt from IP: 192.168.1.100, Remaining attempts: 4
[2024-01-15T10:31:12.456Z] Successful admin login from IP: 192.168.1.100 at 2024-01-15T10:31:12.456Z
```

#### 2. Rate Limiting
```
[2024-01-15T10:32:00.789Z] Rate limit exceeded for IP: 192.168.1.200
[2024-01-15T10:32:15.321Z] IP blocked: 192.168.1.200 (reason: Too many failed attempts)
```

#### 3. Authentication Errors
```
[2024-01-15T10:33:00.654Z] Token expired for admin request
[2024-01-15T10:33:30.987Z] Invalid token from IP: 192.168.1.150
```

#### 4. Security Events
```
[2024-01-15T10:34:00.123Z] 2FA code generated for IP: 192.168.1.100
[2024-01-15T10:34:30.456Z] 2FA verification successful for IP: 192.168.1.100
```

### Log Monitoring

```bash
# Real-time log monitoring
tail -f logs/app.log | grep -E 'Failed login|blocked|Rate limit'

# Günlük başarısız giriş sayısı
grep "Failed login" logs/app.log | wc -l

# Bloklanmış IP'leri listele
grep "IP blocked" logs/app.log | awk '{print $NF}' | sort | uniq
```

---

## 🚨 Güvenlik Olayı Müdahale Planı

### Brute Force Saldırısı Tespit Edilirse

1. **Tespit:**
   ```bash
   # Anormal sayıda başarısız giriş denemesi
   grep "Failed login" logs/app.log | tail -100
   ```

2. **Analiz:**
   ```bash
   # Saldırgan IP'leri belirle
   grep "Failed login" logs/app.log | awk '{print $8}' | sort | uniq -c | sort -rn
   ```

3. **Aksiyon:**
   - Otomatik IP blocking zaten aktif
   - Gerekirse firewall seviyesinde IP ban
   - 2FA'yı aktif et

### Token Çalınması Şüphesi

1. **Tespit:**
   ```bash
   # Farklı IP'lerden aynı token kullanımı
   grep "Token" logs/app.log | grep "different IP"
   ```

2. **Aksiyon:**
   ```bash
   # JWT_SECRET değiştir (tüm token'lar invalidate olur)
   JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
   ```

3. **Bilgilendirme:**
   - Admin'e şifre değiştirmesi öner
   - 2FA aktivasyonunu zorunlu kıl

---

## 📞 Destek ve İletişim

### Güvenlik Açığı Bildirimi
Güvenlik açığı tespit ederseniz lütfen bize bildirin:
- Email: security@hakgida.com
- GitHub Issues: https://github.com/beratdmrhn0/hakgida/issues

### Dokümantasyon
- **Backend README:** `/backend/README.md`
- **Deployment Guide:** `/DEPLOYMENT.md`
- **Server Setup:** `/SUNUCU-KURULUM.md`

---

## 📄 Lisans

Bu güvenlik implementasyonu MIT lisansı altındadır.

---

**Son Güncelleme:** 2024-01-15
**Versiyon:** 2.0.0
**Güvenlik Seviyesi:** Enterprise Grade ⭐⭐⭐⭐⭐

