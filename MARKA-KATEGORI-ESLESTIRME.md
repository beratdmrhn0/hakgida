# 🏷️ Marka ve Kategori Eşleştirme Rehberi

## 📋 Kategori Listesi

Sistemde aktif kategoriler:

1. **Çaylar** (`caylar`)
2. **Baklagil** (`baklagil`)
3. **Bakliyat** (`bakliyat`)
4. **Baharat** (`baharat`)
5. **Salça** (`salca`)
6. **Makarna** (`makarna`)
7. **Şeker** (`seker`)
8. **Yağ** (`yag`)
9. **İçecek** (`icecek`)

### ❌ Kaldırılan Kategoriler:
- ~~Bulgur~~ (kaldırıldı)
- ~~Organik~~ (kaldırıldı)
- ~~Kuruyemiş~~ (kaldırıldı)

---

## 🏢 Marka - Kategori Eşleştirmeleri

### Kendi Markalarımız:

| Marka | Kategori | Açıklama |
|-------|----------|----------|
| **Harfece** | Bakliyat | Harfece bakliyat ürünleri |
| **Kalbak** | Bakliyat | Kalbak bakliyat ürünleri |

### İş Birliği Yaptığımız Markalar:

| Marka | Kategori | Açıklama |
|-------|----------|----------|
| **Çaykur** | Çaylar | Çay ürünleri |
| **Beypazarı** | İçecek | İçecek ürünleri |
| **Arbel Bulgur** | Baklagil | Baklagil ürünleri |
| **Ovella** | Makarna | Makarna ürünleri |
| **Türk Şeker** | Şeker | Şeker ürünleri |
| **Ova Makarna** | Makarna | Makarna ürünleri |
| **Çağdaş Bulgur** | Baklagil | Baklagil ürünleri |
| **Turna** | Yağ | Yağ ürünleri |
| **MGS** (Mert Küp Şeker) | Şeker | Şeker ürünleri |
| **ER MİS** | Salça | Salça ürünleri |

---

## 📝 Önemli Notlar

### Marka İsimleri:
- **ER MİS**: Eski adı "Ermiş" idi, şimdi "ER MİS" olarak kullanılıyor (büyük harflerle ve boşluklu)
- **MGS**: "Mert Küp Şeker" markasının kısa adı

### Kategori Değişiklikleri:
1. **Bulgur kategorisi kaldırıldı** → Bulgur ürünleri artık "Baklagil" kategorisinde
2. **Organik kategorisi kaldırıldı** → Organik ürünler ilgili kategorilerinde
3. **Kuruyemiş kategorisi kaldırıldı** → Kuruyemiş ürünleri ilgili kategorilerinde

### Marka-Kategori Mantığı:
- **Harfece** ve **Kalbak**: Bakliyat (kendi markalarımız)
- **Arbel Bulgur** ve **Çağdaş Bulgur**: Baklagil (bulgur kategorisi kaldırıldığı için)
- **Ovella** ve **Ova Makarna**: Makarna
- **Türk Şeker** ve **MGS**: Şeker
- **Turna**: Yağ
- **ER MİS**: Salça
- **Çaykur**: Çaylar
- **Beypazarı**: İçecek

---

## 🔧 Admin Panelinde Kullanım

Admin panelinde ürün eklerken veya düzenlerken:

1. **Marka** seçimi yapın (dropdown'dan)
2. **Kategori** seçimi yapın
3. Yukarıdaki tabloya göre doğru eşleştirmeyi yapın

### Örnek:
- Harfece fasulye ekleyecekseniz:
  - Marka: **Harfece**
  - Kategori: **Bakliyat**

- Çaykur çay ekleyecekseniz:
  - Marka: **Çaykur**
  - Kategori: **Çaylar**

---

## 📊 Kategori İkonları

| Kategori | İkon | Renk |
|----------|------|------|
| Çaylar | 🍃 Leaf | #27ae60 (Yeşil) |
| Baklagil | 🌱 Sprout | #e74c3c (Kırmızı) |
| Bakliyat | 🌱 Sprout | #8b4513 (Kahverengi) |
| Baharat | 🔥 Flame | #f39c12 (Turuncu) |
| Salça | 💧 Droplet | #dc2626 (Koyu Kırmızı) |
| Makarna | 🍴 UtensilsCrossed | #fbbf24 (Sarı) |
| Şeker | 🧊 Cube | #f8fafc (Beyaz) |
| Yağ | 💧 Droplets | #fcd34d (Açık Sarı) |
| İçecek | 🍷 Wine | #06b6d4 (Mavi) |

---

## 🗄️ Database Güncellemeleri

Backend'de kategori güncellemeleri otomatik olarak yapılacaktır:
- `server.js` dosyasındaki `seedCategories()` fonksiyonu güncellenmiştir
- Mevcut ürünlerin kategorileri manuel olarak güncellenmelidir

### Gerekli Adımlar:
1. Backend'i yeniden başlatın (kategoriler otomatik seed edilecek)
2. Admin panelinden mevcut ürünlerin kategorilerini kontrol edin
3. Bulgur, Organik, Kuruyemiş kategorisindeki ürünleri uygun kategorilere taşıyın

---

## 📞 Güncellemeler

Son güncelleme: 15 Kasım 2024

Değişiklikler:
- Bulgur, Organik, Kuruyemiş kategorileri kaldırıldı
- ER MİS marka ismi güncellendi
- Marka-kategori eşleştirmeleri netleştirildi

