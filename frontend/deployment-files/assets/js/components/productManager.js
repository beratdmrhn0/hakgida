// Ürün Yönetimi

export class ProductManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentCategory = 'all';
        this.currentPriceRange = 300;
        this.currentSort = 'default';
        this.searchTerm = '';
        
        this.productsGrid = document.getElementById('productsGrid');
        this.categoryNames = {
            'caylar': 'Çaylar',
            'baklagil': 'Baklagil',
            'baharat': 'Baharat',
            'organik': 'Organik',
            'kuruyemis': 'Kuruyemiş'
        };
        
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadProductsFromBackend();
        this.loadProducts();
    }

    // Backend'den ürünleri yükle
    async loadProductsFromBackend() {
        try {
            console.log('ProductManager: Backend\'den ürünler yükleniyor...');
            
            const response = await fetch(CONFIG.API_ENDPOINTS.products);
            
            if (response.ok) {
                const data = await response.json();
                this.products = data.data || [];
                
                // Eski yapıya uygun şekilde dönüştür ve veriyi temizle
                this.products = this.products.map(product => {
                    return {
                        id: product.id,
                        name: product.name || 'Ürün',
                        description: product.description || 'Açıklama mevcut değil',
                        price: product.price || 0,
                        category: product.category || 'genel',
                        brand: product.brand || '',
                        image: product.image || this.getPlaceholderImage(),
                        features: product.features || ['Doğal', 'Kaliteli', 'Taze'],
                        inStock: product.stock > 0,
                        stock: product.stock || 0
                    };
                });
                
                console.log('ProductManager: Ürünler yüklendi:', this.products.length, 'adet');
            } else {
                console.error('ProductManager: Backend hatası:', response.status);
                this.products = [];
            }
        } catch (error) {
            console.error('ProductManager: Bağlantı hatası:', error);
            this.products = [];
        }
    }

    // Placeholder image
    getPlaceholderImage() {
        return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f0f0f0"/></svg>';
    }

    // HTML attribute'larını temizle
    cleanHtmlAttributes(text) {
        if (!text) return '';
        
        // Eğer string değilse, string'e çevir
        text = String(text);
        
        // Çok agresif temizleme - tüm HTML benzeri içeriği kaldır
        let cleaned = text
            // HTML tag'larını kaldır
            .replace(/<[^>]*>/g, '')
            // HTML attribute'larını kaldır  
            .replace(/\s*(alt|loading|onerror|src|class|id|style|width|height|data-\w+|onclick|onload|defer|async)\s*=\s*['"][^'"]*['"]?\s*/gi, '')
            // Tekil attribute'ları kaldır
            .replace(/\s+(loading|lazy|eager)\s*/gi, ' ')
            // Çok fazla boşlukları temizle
            .replace(/\s+/g, ' ')
            // Başlangıç ve bitiş boşluklarını kaldır
            .trim();
            
        // Eğer temizlenen metin çok kısaysa veya anlamlı değilse, boş döndür
        if (cleaned.length < 2 || cleaned.match(/^[^a-zA-ZÇÖÜĞIŞçöüğış0-9]+$/)) {
            return '';
        }
        
        return cleaned;
    }

    // Daha güvenli ürün temizleme
    cleanProduct(product) {
        const cleaned = { ...product };
        
        // Tüm string alanları temizle
        Object.keys(cleaned).forEach(key => {
            if (typeof cleaned[key] === 'string') {
                cleaned[key] = this.cleanHtmlAttributes(cleaned[key]);
            }
        });
        
        return cleaned;
    }

    // Kesin temizleme fonksiyonu
    forceCleanText(text) {
        if (!text) return '';
        
        // String'e çevir
        let cleaned = String(text);
        
        // Eğer HTML tag içeriyorsa ya da HTML attribute içeriyorsa tamamen temizle
        if (cleaned.includes('<') || cleaned.includes('alt=') || cleaned.includes('loading=') || cleaned.includes('onerror=')) {
            // Tüm HTML tag'larını kaldır
            cleaned = cleaned.replace(/<[^>]*>/g, '');
            
            // Tüm HTML attribute'larını kaldır
            cleaned = cleaned.replace(/\s*\w+\s*=\s*["'][^"']*["']/g, '');
            
            // Tekil attribute'ları kaldır
            cleaned = cleaned.replace(/\s*(alt|loading|onerror|src|lazy|eager)\s*/g, ' ');
            
            // = işaretli her şeyi kaldır
            cleaned = cleaned.replace(/\w+=['"][^'"]*['"]/g, '');
            
            // Geriye kalan tırnak işaretlerini kaldır
            cleaned = cleaned.replace(/["']/g, '');
            
            // > < işaretlerini kaldır
            cleaned = cleaned.replace(/[<>]/g, '');
        }
        
        // Çok fazla boşlukları temizle
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        
        // Eğer sadece anlamsız karakterler kaldıysa boş döndür
        if (cleaned.length < 2 || !cleaned.match(/[a-zA-ZÇÖÜĞIŞçöüğış0-9]/)) {
            return '';
        }
        
        return cleaned;
    }

    bindEvents() {
        // Kategori butonları
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                categoryButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.category;
                this.loadProducts();
            });
        });

        // Arama
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.loadProducts();
            });
        }

        // Fiyat aralığı
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.addEventListener('input', (e) => {
                this.currentPriceRange = e.target.value;
                document.getElementById('maxPrice').textContent = e.target.value;
                this.loadProducts();
            });
        }

        // Sıralama
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.loadProducts();
            });
        }
    }

    // Ürünleri yükleme ve filtreleme
    loadProducts() {
        let filtered = [...this.products];

        // Kategori filtresi
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(product => product.category === this.currentCategory);
        }

        // Arama filtresi
        if (this.searchTerm) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(this.searchTerm) ||
                product.description.toLowerCase().includes(this.searchTerm)
            );
        }

        // Fiyat filtresi
        filtered = filtered.filter(product => product.price <= this.currentPriceRange);

        // Sıralama
        switch(this.currentSort) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                filtered.sort((a, b) => a.id - b.id);
        }

        this.filteredProducts = filtered;
        this.displayProducts();
    }

    // Ürünleri görüntüleme
    displayProducts() {
        if (!this.productsGrid) return;

        if (this.filteredProducts.length === 0) {
            this.productsGrid.innerHTML = '<div class="no-products">Aradığınız kriterlere uygun ürün bulunamadı.</div>';
            return;
        }

        this.productsGrid.innerHTML = this.filteredProducts.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    ${product.image && product.image !== '' ? 
                        `<img src="${product.image}" alt="${product.name}" loading="lazy">` :
                        `<div class="image-placeholder">
                            <i class="fas fa-image-slash"></i>
                        </div>`
                    }
                </div>
                <div class="product-content">
                    <div class="product-info">
                        <div class="product-category ${product.category}">${this.getCategoryName(product.category)}</div>
                        <h3>${product.name}</h3>
                        <p class="product-description">${product.description || 'Ürün açıklaması henüz eklenmedi.'}</p>
                    </div>
                    <div class="product-bottom">
                        <div class="product-price-info">
                            <div class="product-price">
                                <span class="currency">₺</span>
                                <span class="amount">${this.formatPrice(product.price)}</span>
                            </div>
                            <div class="product-stock ${product.inStock ? '' : 'out-of-stock'}">
                                ${product.inStock ? `${product.stock} adet` : 'Stokta yok'}
                            </div>
                        </div>
                        <div class="product-features">
                            ${product.features ? product.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('') : ''}
                        </div>
                        <button class="product-detail-btn">
                            <i class="fas fa-info-circle"></i>
                            DETAYLARI GÖR
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Ürün kartlarına click event ekleme
        this.productsGrid.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Eğer detay butonu tıklandıysa
                if (e.target.closest('.product-detail-btn')) {
                    const productId = parseInt(card.dataset.productId);
                    this.showProductDetail(productId);
                } else {
                    // Kartın herhangi bir yerine tıklandıysa
                    const productId = parseInt(card.dataset.productId);
                    this.showProductDetail(productId);
                }
            });
        });

        // Problemli metinleri gizle
        setTimeout(() => {
            this.hideProblematicTexts();
        }, 100);
    }

    // Basit ama etkili gizleme
    hideProblematicTexts() {
        // Sadece ürün kartlarındaki metinleri kontrol et
        document.querySelectorAll('.product-card').forEach(card => {
            const titleElement = card.querySelector('h3');
            const nameElement = card.querySelector('.product-name');
            const descElement = card.querySelector('.product-description');
            
            if (titleElement && titleElement.textContent.includes('alt=')) {
                titleElement.textContent = 'Ürün';
            }
            if (nameElement && nameElement.textContent.includes('alt=')) {
                nameElement.textContent = 'Ürün';
            }
            if (descElement && descElement.textContent.includes('alt=')) {
                descElement.textContent = 'Ürün açıklaması';
            }
        });
    }

    // Kategori adı çevirici
    getCategoryName(category) {
        return this.categoryNames[category] || 'Ürün';
    }

    // Fiyat formatlayıcı
    formatPrice(price) {
        // Convert to number if it's a string
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        
        // Format with Turkish locale (comma for thousands, period for decimals)
        return new Intl.NumberFormat('tr-TR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(numPrice);
    }

    // Ürün detay modal'ı
    showProductDetail(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        import('./modalManager.js').then(({ ModalManager }) => {
            const modalManager = new ModalManager();
            modalManager.showProductModal(product);
        });
    }

    // Kategori filtreleme (footer'dan çağrılabilir)
    filterByCategory(category) {
        this.currentCategory = category;
        
        // Aktif kategori butonunu güncelle
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });
        
        this.loadProducts();
        
        // Ürünler bölümüne scroll
        const productsSection = document.getElementById('products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Ürün getirme
    getProduct(id) {
        return this.products.find(p => p.id === id);
    }

    // Kategori bazında ürün sayısı
    getCategoryCount(category) {
        return this.products.filter(p => p.category === category).length;
    }

    // Stokta olan ürünler
    getInStockProducts() {
        return this.products.filter(p => p.inStock);
    }

    // Fiyat aralığındaki ürünler
    getProductsByPriceRange(min, max) {
        return this.products.filter(p => p.price >= min && p.price <= max);
    }
}
