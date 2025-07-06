// Ürün Yönetimi
import { products, categoryNames } from '../data/products.js';

export class ProductManager {
    constructor() {
        this.products = products;
        this.filteredProducts = [...products];
        this.currentCategory = 'all';
        this.currentPriceRange = 300;
        this.currentSort = 'default';
        this.searchTerm = '';
        
        this.productsGrid = document.getElementById('productsGrid');
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadProducts();
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
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-content">
                    <div class="product-category">${this.getCategoryName(product.category)}</div>
                    <h3>${product.name}</h3>
                    <div class="product-stock ${product.inStock ? '' : 'out-of-stock'}">
                        ${product.inStock ? `Stok: ${product.stock} adet` : 'Stokta yok'}
                    </div>
                    <div class="product-price">${product.price.toFixed(2)} TL</div>
                    <div class="product-features">
                        ${product.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        // Ürün kartlarına click event ekleme
        this.productsGrid.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const productId = parseInt(card.dataset.productId);
                this.showProductDetail(productId);
            });
        });
    }

    // Kategori adı çevirici
    getCategoryName(category) {
        return categoryNames[category] || 'Ürün';
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
