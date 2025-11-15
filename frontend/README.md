# Hakgida - Tanıtım Sitesi

Hakgida firması için geliştirilmiş modern ve profesyonel tanıtım sitesi. Doğal ve kaliteli çay, baklagil, baharat ve organik ürünlerin tanıtımı için tasarlanmıştır.

## 🌟 Özellikler

### Ana Sayfa
- **Modern Hero Section**: Etkileyici başlık ve çağrı butonları
- **Hakkımızda Bölümü**: Firma tanıtımı ve istatistikler
- **İletişim Formu**: Ziyaretçi mesajları için form
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görüntü

### Ürünler Sayfası
- **Ürün Kataloğu**: 18 farklı ürün 4 kategoride
- **Akıllı Filtreleme**: Kategori, arama ve sıralama
- **Ürün Kartları**: Görsel ve bilgi içeren modern kartlar
- **Responsive Grid**: Tüm ekran boyutlarında optimal görüntü

### Ürün Detay Sayfaları
- **Detaylı Bilgi**: Ürün özellikleri ve açıklamaları
- **Breadcrumb Navigasyon**: Kolay sayfa takibi
- **Benzer Ürünler**: Kategori bazlı öneriler
- **İletişim Entegrasyonu**: WhatsApp ile direkt iletişim

## 🏗️ Proje Yapısı

```
frontend/
├── index.html                 # Ana sayfa
├── products.html              # Ürünler sayfası
├── product-detail.html        # Ürün detay sayfası
├── assets/
│   ├── css/
│   │   ├── styles.css         # Ana CSS dosyası
│   │   ├── utils/             # Temel CSS dosyaları
│   │   │   ├── variables.css  # CSS değişkenleri
│   │   │   ├── base.css       # Temel stiller
│   │   │   └── responsive.css # Responsive mixins
│   │   └── components/        # Bileşen CSS dosyaları
│   │       ├── navbar.css     # Navigasyon
│   │       ├── hero.css       # Hero section
│   │       ├── products.css   # Ürün grid
│   │       ├── about.css      # Hakkımızda
│   │       ├── contact.css    # İletişim
│   │       ├── footer.css     # Alt bilgi
│   │       ├── page-header.css # Sayfa başlığı
│   │       ├── breadcrumb.css # Breadcrumb navigasyon
│   │       ├── product-detail.css # Ürün detay
│   │       ├── related-products.css # Benzer ürünler
│   │       └── products-filter.css # Ürün filtreleme
│   ├── js/
│   │   ├── main.js            # Ana JavaScript (Ana sayfa)
│   │   ├── products.js        # Ürünler sayfası JS
│   │   ├── product-detail.js  # Ürün detay JS
│   │   ├── components/        # JavaScript bileşenleri
│   │   │   ├── productManager.js
│   │   │   ├── cartManager.js
│   │   │   └── modalManager.js
│   │   └── data/
│   │       └── products.js    # Ürün verileri
│   └── images/                # Resim dosyaları
└── README.md                  # Proje dokumentasyonu
```

## 🚀 Hızlı Başlangıç

### 1. Projeyi İndirin
```bash
git clone <repository-url>
cd hakgida/frontend
```

### 2. Local Server Başlatın
```bash
# Python ile
python -m http.server 8000

# Node.js ile
npx http-server

# VS Code Live Server eklentisi ile
# index.html'e sağ tıklayın ve "Open with Live Server"
```

### 3. Tarayıcıda Açın
```
http://localhost:8000
```

## 🎨 Teknolojiler

- **HTML5**: Semantic markup
- **CSS3**: Modern stillendirme
  - CSS Grid & Flexbox
  - CSS Variables
  - CSS Animations
  - Responsive Design
- **JavaScript (ES6+)**: Modern JavaScript
  - ES6 Modules
  - Async/Await
  - Local Storage
  - Fetch API
- **Font Awesome**: İkonlar
- **Google Fonts**: Poppins font ailesi

## 📱 Responsive Tasarım

Site tüm cihazlarda mükemmel çalışır:
- 🖥️ **Desktop**: 1200px+
- 💻 **Laptop**: 1024px - 1199px
- 📱 **Tablet**: 768px - 1023px
- 📱 **Mobile**: 320px - 767px

## 🔧 Özelleştirme

### Renk Paleti Değiştirmek
`assets/css/utils/variables.css` dosyasındaki CSS değişkenlerini düzenleyin:

```css
:root {
    --primary-color: #28a745;    /* Ana renk */
    --secondary-color: #20c997;  /* İkincil renk */
    --accent-color: #ffc107;     /* Vurgu rengi */
    /* ... diğer renkler */
}
```

### Ürün Eklemek/Düzenlemek
`assets/js/data/products.js` dosyasını düzenleyin:

```javascript
export const products = [
    {
        id: 1,
        name: "Ürün Adı",
        category: "kategori",
        price: 100,
        image: "resim-url",
        description: "Açıklama",
        features: ["Özellik 1", "Özellik 2"],
        stock: 10
    },
    // ... diğer ürünler
];
```

## 📄 Sayfa Detayları

### Ana Sayfa (index.html)
- Hero section ile etkileyici giriş
- Hakkımızda bölümü
- İletişim formu
- Sosyal medya linkleri

### Ürünler Sayfası (products.html)
- Kategori filtreleme
- Arama fonksiyonu
- Fiyat sıralaması
- Responsive ürün grid

### Ürün Detay Sayfası (product-detail.html)
- Detaylı ürün bilgileri
- Breadcrumb navigasyon
- Benzer ürünler önerisi
- WhatsApp entegrasyonu

## 🎯 Performans Optimizasyonları

- **CSS**: Modüler yapı ile küçük dosyalar
- **JavaScript**: ES6 modules ile code splitting
- **Images**: Lazy loading
- **Fonts**: Preload ile hızlı yükleme
- **Caching**: Browser cache optimizasyonu

## 📞 İletişim Entegrasyonu

Site WhatsApp entegrasyonu ile donatılmıştır:
- Ürün detay sayfasında "Bilgi Al" butonu
- Otomatik mesaj oluşturma
- Direkt WhatsApp'a yönlendirme

## 🔒 SEO Optimizasyonu

- Semantic HTML yapısı
- Meta tag optimizasyonu
- Open Graph desteği
- Sitemap hazır yapı
- Accessibility standartları

## 🛠️ Geliştirme Notları

### Yeni Sayfa Eklemek
1. HTML dosyasını oluşturun
2. Gerekli CSS dosyalarını ekleyin
3. JavaScript modüllerini bağlayın
4. Navigation'a link ekleyin

### Yeni Bileşen Eklemek
1. `components/` klasörüne CSS dosyası ekleyin
2. `styles.css`'e import edin
3. Gerekiyorsa JavaScript bileşeni oluşturun

## 📈 Gelecek Geliştirmeler

- [ ] Çoklu dil desteği
- [ ] Dark mode
- [ ] PWA özellikleri
- [ ] Blog sistemi
- [ ] Galeri sayfası
- [ ] Müşteri yorumları

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun
3. Commit edin
4. Push edin
5. Pull request gönderin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

**Geliştirici**: AI Assistant  
**Tarih**: 2024  
**Versiyon**: 2.0.0 