# Hakgida - E-Ticaret Web Sitesi

Modern, responsive ve kullanıcı dostu gıda ürünleri e-ticaret platformu.

## 🚀 Özellikler

### Frontend (React + TypeScript)
- ✅ Modern ve responsive tasarım
- ✅ React + TypeScript + Vite
- ✅ Tailwind CSS ile styling
- ✅ React Router ile sayfa yönetimi
- ✅ React Query ile state yönetimi
- ✅ Dinamik ürün filtreleme ve arama
- ✅ Ürün detay sayfaları
- ✅ Kategori bazlı filtreleme
- ✅ Responsive mobil tasarım

### Backend (Node.js + Express)
- ✅ RESTful API
- ✅ MySQL/SQLite veritabanı desteği
- ✅ JWT authentication
- ✅ File upload
- ✅ CORS desteği
- ✅ Güvenli admin paneli

### Admin Paneli
- ✅ JWT tabanlı güvenli giriş
- ✅ Ürün ekleme/düzenleme/silme (CRUD)
- ✅ Kategori yönetimi
- ✅ İstatistikler ve raporlar
- ✅ Stok takibi
- ✅ Aktif/Pasif ürün yönetimi

## 📁 Proje Yapısı

```
hakgida-main/
├── backend/                 # Node.js + Express backend
│   ├── api/
│   │   ├── routes/         # API route'ları
│   │   └── middleware/     # Middleware'ler
│   ├── config/             # Veritabanı ve yapılandırma
│   ├── models/             # Sequelize modelleri
│   └── server.js           # Ana sunucu dosyası
│
├── frontend/               # Orijinal HTML/CSS/JS frontend
│   ├── assets/
│   ├── index.html
│   └── ...
│
└── frontend_new/           # Yeni React frontend
    ├── src/
    │   ├── components/     # React komponentleri
    │   ├── pages/          # Sayfa komponentleri
    │   ├── hooks/          # Custom hooks
    │   ├── services/       # API servisleri
    │   ├── context/        # React context
    │   └── types/          # TypeScript type'ları
    ├── public/             # Statik dosyalar
    └── package.json
```

## 🛠️ Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- MySQL (veya SQLite)
- npm veya yarn

### 1. Backend Kurulumu

```bash
cd backend
npm install
```

`.env` dosyası oluştur:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=mysql://kullanici:sifre@localhost:3306/hakgida_db
JWT_SECRET=your-secret-key
ADMIN_PASSWORD=hakgida2024
```

Backend'i başlat:
```bash
npm start
```

### 2. Frontend Kurulumu

```bash
cd frontend_new
npm install
```

Frontend'i başlat:
```bash
npm run dev
```

## 🎯 Kullanım

### Public Sayfalar
- **Ana Sayfa**: `http://localhost:5173/`
- **Ürünler**: `http://localhost:5173/products`
- **Hakkımızda**: `http://localhost:5173/about`
- **Ürün Detay**: `http://localhost:5173/product/:id`

### Admin Paneli
- **Admin Giriş**: `http://localhost:5173/admin/login`
- **Dashboard**: `http://localhost:5173/admin`

**Default Admin Şifresi**: `hakgida2024`

## 🔧 Teknolojiler

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- TanStack Query (React Query)
- Axios
- Font Awesome

### Backend
- Node.js
- Express.js
- Sequelize ORM
- MySQL / SQLite
- JWT (jsonwebtoken)
- bcryptjs
- cors
- multer (file upload)

## 🎨 Tasarım

- **Ana Renk**: #D47800 (Turuncu)
- **İkincil Renk**: #B8660A (Koyu Turuncu)
- **Font**: Inter, Poppins
- **Responsive**: Mobile-first tasarım

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔐 Güvenlik

- JWT token authentication
- Password hashing (bcrypt)
- CORS koruması
- Protected routes
- Input validation

## 📊 API Endpoints

### Public
- `GET /api/products` - Tüm ürünler
- `GET /api/products/:id` - Ürün detay
- `GET /api/products/category/:category` - Kategoriye göre ürünler
- `GET /api/products/brand/:brand` - Markaya göre ürünler
- `GET /api/categories` - Kategoriler

### Admin (JWT Required)
- `POST /api/admin/login` - Admin giriş
- `GET /api/admin/stats` - İstatistikler
- `POST /api/products` - Ürün ekle
- `PUT /api/products/:id` - Ürün güncelle
- `DELETE /api/products/:id` - Ürün sil

## 🚧 Geliştirme

```bash
# Backend development mode (nodemon)
cd backend
npm run dev

# Frontend development mode (hot reload)
cd frontend_new
npm run dev
```

## 📦 Production Build

```bash
# Frontend build
cd frontend_new
npm run build

# Build dosyaları dist/ klasöründe olacak
```

## 👥 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje özel mülkiyettir.

## 📧 İletişim

**Hakgida** - Gıda Ürünleri E-Ticaret Platformu

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

