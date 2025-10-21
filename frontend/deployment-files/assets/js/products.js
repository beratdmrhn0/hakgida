// Global products array
let products = [];

// Pagination state
const PAGE_SIZE = 15;
let currentPage = 1;
let totalPages = 1;
let lastFiltered = [];

// Active filters/sort state
let activeCategory = 'all';
let activeBrand = null;
let activeSearch = '';
let activeSort = null;

// Page initialization
document.addEventListener('DOMContentLoaded', async function() {
    // Sayfa yüklendiğinde loaded class'ını ekle
    document.body.classList.add('loaded');
    
    await initializeProductsPage();
    setupEventListeners();
    checkURLParameters();
});

// Initialize products page
async function initializeProductsPage() {
    // Backend'den ürünleri yükle
    await loadProductsFromBackend();
    renderProducts(products);
    setupMobileMenu();
}

// Backend'den ürünleri yükle
async function loadProductsFromBackend() {
    try {
        console.log('Backend\'den ürünler yükleniyor...');
        
        const response = await fetch(CONFIG.API_ENDPOINTS.products);
        
        if (response.ok) {
            const data = await response.json();
            products = data.data || [];
            
            // Placeholder image ekle ve veriyi temizle
            products = products.map(product => {
                return {
                    id: product.id,
                    name: product.name || 'Ürün',
                    type: product.type || '',
                    description: product.description || 'Açıklama mevcut değil',
                    price: product.price || 0,
                    category: product.category || 'genel',
                    brand: product.brand || '',
                    image: product.image || getPlaceholderImage(),
                    features: product.features || [], // Eski kodlar için
                    stock: product.stock || 0
                };
            });
            
            console.log('Ürünler başarıyla yüklendi:', products.length, 'adet');
        } else {
            console.error('Backend\'den ürün yükleme hatası:', response.status);
            showNoConnectionMessage();
        }
    } catch (error) {
        console.error('Backend bağlantı hatası:', error);
        showNoConnectionMessage();
    }
}

// Bağlantı hatası mesajı
function showNoConnectionMessage() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = `
        <div class="no-products">
            <i class="fas fa-wifi fa-3x" style="margin-bottom: 1rem; color: #ef4444;"></i>
            <h3>Bağlantı Hatası</h3>
            <p>Ürünler yüklenemiyor. Lütfen sayfayı yenileyin.</p>
            <button class="btn btn-primary" onclick="window.location.reload()">
                <i class="fas fa-redo"></i> Sayfayı Yenile
            </button>
        </div>
    `;
}

// Placeholder image
function getPlaceholderImage() {
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f0f0f0"/></svg>';
}

// Apply all filters and sorting together
function applyFilters() {
    let result = [...products];

    // Category filter
    if (activeCategory && activeCategory !== 'all') {
        result = result.filter(p => (p.category || '') === activeCategory);
    }

    // Brand filter
    if (activeBrand) {
        const normalizedBrand = String(activeBrand).toLowerCase();
        result = result.filter(p => (p.brand || '').toLowerCase().includes(normalizedBrand));
    }

    // Search filter
    if (activeSearch) {
        const term = activeSearch.toLowerCase();
        result = result.filter(p =>
            (p.name || '').toLowerCase().includes(term) ||
            (p.description || '').toLowerCase().includes(term) ||
            (Array.isArray(p.features) ? p.features.some(f => (f || '').toLowerCase().includes(term)) : false)
        );
    }

    // Sorting
    if (activeSort) {
        switch (activeSort) {
            case 'price-low':
                result.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price-high':
                result.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'name':
                result.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'tr'));
                break;
            default:
                break;
        }
    }

    // Save filtered list and compute pagination
    lastFiltered = result;
    totalPages = Math.max(1, Math.ceil(result.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const paged = result.slice(start, end);

    renderProducts(paged);
    renderPagination();
}

// Render pagination controls
function renderPagination() {
    const container = document.getElementById('pagination');
    if (!container) return;

    // Hide when only one page
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '';
    const makeBtn = (label, page, disabled = false, active = false) => `
        <button class="page-btn ${disabled ? 'disabled' : ''} ${active ? 'active' : ''}" ${disabled ? 'disabled' : ''} data-page="${page}">${label}</button>
    `;

    html += makeBtn('«', currentPage - 1, currentPage === 1);

    // Show limited range of pages around current
    const range = 2;
    const start = Math.max(1, currentPage - range);
    const end = Math.min(totalPages, currentPage + range);
    for (let p = start; p <= end; p++) {
        html += makeBtn(String(p), p, false, p === currentPage);
    }

    html += makeBtn('»', currentPage + 1, currentPage === totalPages);

    container.innerHTML = html;

    container.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = Number(btn.getAttribute('data-page'));
            if (!isNaN(page)) {
                goToPage(page);
            }
        });
    });
}

// HTML attribute'larını temizle
function cleanHtmlAttributes(text) {
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

// Kesin temizleme fonksiyonu
function forceCleanText(text) {
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

// Setup event listeners
function setupEventListeners() {
    // Category filter buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            filterByCategory(category);
            updateActiveButton(this);
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value || '';
            searchProducts(searchTerm);
        });
    }

    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value || null;
            sortProducts(sortValue);
        });
    }

    // Categories collapsible toggle
    const categoriesToggle = document.getElementById('categoriesToggle');
    const categoriesPanel = document.getElementById('categoriesPanel');
    if (categoriesToggle && categoriesPanel) {
        categoriesToggle.addEventListener('click', () => {
            const isExpanded = categoriesToggle.getAttribute('aria-expanded') === 'true';
            categoriesToggle.setAttribute('aria-expanded', String(!isExpanded));
            if (isExpanded) {
                categoriesPanel.setAttribute('hidden', '');
                categoriesToggle.classList.remove('open');
            } else {
                categoriesPanel.removeAttribute('hidden');
                categoriesToggle.classList.add('open');
            }
        });
    }

    // Brands collapsible toggle
    const brandsToggle = document.getElementById('brandsToggle');
    const brandsPanel = document.getElementById('brandsPanel');
    if (brandsToggle && brandsPanel) {
        brandsToggle.addEventListener('click', () => {
            const isExpanded = brandsToggle.getAttribute('aria-expanded') === 'true';
            brandsToggle.setAttribute('aria-expanded', String(!isExpanded));
            if (isExpanded) {
                brandsPanel.setAttribute('hidden', '');
                brandsToggle.classList.remove('open');
            } else {
                brandsPanel.removeAttribute('hidden');
                brandsToggle.classList.add('open');
            }
        });
    }

    // Brand filter buttons
    document.querySelectorAll('.brand-item').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const brand = this.dataset.brand;
            if (brand) {
                filterByBrand(brand);
                updateActiveBrand(brand);
            } else {
                // "Tümü" seçildi - tüm ürünleri göster
                renderProducts(products);
                updateActiveBrand(null);
            }
            updateActiveButton(document.querySelector('.category-btn[data-category="all"]'));
        });
    });
}

// Setup mobile menu
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

// Check URL parameters for category/brand filtering
function checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const brand = urlParams.get('brand');
    
    if (brand) {
        // Marka filtresi: sadece marka eşleşenleri göster
        activeBrand = brand;
        updateActiveBrand(brand);
        setBrandIndicator(brand);
    } else {
        activeBrand = null;
        updateActiveBrand(null);
        setBrandIndicator(null);
    }

    if (category) {
        activeCategory = category;
        const catBtn = document.querySelector(`[data-category="${category}"]`);
        if (catBtn) updateActiveButton(catBtn);
    } else {
        activeCategory = 'all';
        const allBtn = document.querySelector(`[data-category="all"]`) || document.querySelector('.category-btn');
        if (allBtn) updateActiveButton(allBtn);
    }

    applyFilters();
}

// Render products in grid
function renderProducts(productsToRender) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (productsToRender.length === 0) {
        if (products.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-box-open fa-3x" style="margin-bottom: 1rem; color: #64748b;"></i>
                    <h3>Henüz Ürün Eklenmemiş</h3>
                    <p>Ürün kataloğu şu anda boş. Yakında yeni ürünler eklenecek!</p>
                </div>
            `;
        } else {
            productsGrid.innerHTML = '<div class="no-products">Aradığınız kriterlere uygun ürün bulunamadı.</div>';
        }
        return;
    }
    
    const brandNameMap = {
        'harfece-bakliyat': 'Harfece Bakliyat',
        'kalbak-bakliyat': 'Kalbak Bakliyat',
        'mert-kup-seker': 'Mert Küp Şeker',
        'turna-yag': 'Turna Yağ',
        'cagdas-bulgur': 'Çağdaş Bulgur',
        'arbel-bulgur': 'Arbel Bulgur',
        'turkiye-seker': 'Türkiye Şeker Fabrikaları',
        'er-mis-salca': 'Er Mis Salça',
        'ovella-makarna': 'Ovella Makarna',
        'beypazari': 'Beypazarı',
        'caykur': 'Çaykur'
    };

    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                ${product.image && product.image !== '' ? 
                    `<img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.style.display='none'">` :
                    `<div class="image-placeholder">
                        <i class="fas fa-image-slash"></i>
                    </div>`
                }
                ${product.category ? `<div class=\"product-category-chip\">${getCategoryName(product.category)}</div>` : ''}
            </div>
            <div class="product-content">
                <!-- Ürün Başlığı -->
                <div class="product-header">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-chips">
                        ${product.brand ? `<div class="product-brand-chip">${brandNameMap[product.brand] || product.brand.replace(/-/g,' ')}</div>` : ''}
                    </div>
                </div>
                

                
                <!-- Ürün Açıklaması -->
                <div class="product-description-section">
                    <div class="product-description-label">Açıklama:</div>
                    <p class="product-description">${truncateDescription(product.description, 8)}</p>
                </div>
                
                <!-- Alt Bilgiler -->
                <div class="product-footer">
                    <div class="product-info-row">
                        ${product.price && product.price > 0 ? `
                            <div class="product-price-info">
                                <span class="product-price-label">Fiyat:</span>
                                <span class="price-current">₺${formatPriceStrict(product.price)}</span>
                            </div>
                        ` : ''}
                        
                        ${product.stock && product.stock > 0 ? `
                            <div class="product-stock-info">
                                <span class="product-stock-label">Stok:</span>
                                <span class="product-stock-value">${product.stock} adet</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    <button class="btn btn-primary product-detail-btn" onclick="goToProductDetail(${product.id})">
                        <i class="fas fa-info-circle"></i> Detayları Gör
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Problemli metinleri gizle
    setTimeout(() => {
        hideProblematicTexts();
    }, 100);
}

// Basit ama etkili gizleme
function hideProblematicTexts() {
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

// Filter products by category
function filterByCategory(category) {
    activeCategory = category || 'all';
    currentPage = 1;
    applyFilters();
}

// Filter products by brand
function filterByBrand(brand) {
    activeBrand = brand || null;
    currentPage = 1;
    applyFilters();
}

// Highlight active brand pill
function updateActiveBrand(brand) {
    const items = document.querySelectorAll('.brands-list .brand-item');
    items.forEach(item => item.classList.remove('active'));
    if (brand) {
        const active = document.querySelector(`.brands-list .brand-item[data-brand="${brand}"]`);
        if (active) active.classList.add('active');
    } else {
        // Tümü linki: data-brand yok
        const allLink = document.querySelector('.brands-list .brand-item[href="products.html"]');
        if (allLink) allLink.classList.add('active');
    }
}

// Brand indicator helper
function setBrandIndicator(brand) {
    const indicator = document.getElementById('brandIndicator');
    const nameSpan = document.getElementById('brandIndicatorName');
    if (!indicator || !nameSpan) return;

    if (brand) {
        const map = {
            'harfece-bakliyat': 'Harfece Bakliyat',
            'kalbak-bakliyat': 'Kalbak Bakliyat',
            'mert-kup-seker': 'Mert Küp Şeker',
            'turna-yag': 'Turna Yağ',
            'cagdas-bulgur': 'Çağdaş Bulgur',
            'arbel-bulgur': 'Arbel Bulgur',
            'turkiye-seker': 'Türkiye Şeker Fabrikaları',
            'er-mis-salca': 'Er Mis Salça',
            'ovella-makarna': 'Ovella Makarna',
            'beypazari': 'Beypazarı',
            'caykur': 'Çaykur'
        };
        nameSpan.textContent = map[brand] || brand;
        indicator.classList.add('show');
    } else {
        nameSpan.textContent = '';
        indicator.classList.remove('show');
    }
}

// Search products
function searchProducts(searchTerm) {
    activeSearch = (searchTerm || '').trim();
    currentPage = 1;
    applyFilters();
}

// Sort products
function sortProducts(sortValue) {
    activeSort = sortValue || null;
    currentPage = 1;
    applyFilters();
}

// Expose for click handlers
window.goToPage = function(page) {
    if (typeof page !== 'number') return;
    currentPage = Math.max(1, Math.min(page, totalPages));
    applyFilters();
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {}
};

// Update active button
function updateActiveButton(activeBtn) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
}

// Get category name in Turkish
function getCategoryName(category) {
    const categoryNames = {
        'caylar': 'Çaylar',
        'baklagil': 'Baklagil',
        'baharat': 'Baharat',
        'organik': 'Organik',
        'kuruyemis': 'Kuruyemiş'
    };
    return categoryNames[category] || category;
}

// Helper function to format price
function formatPrice(price) {
    // Convert to number if it's a string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Format with Turkish locale (comma for thousands, period for decimals)
    return new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(numPrice);
}

// Açıklama metnini kısalt
function truncateDescription(text, wordLimit = 15) {
    if (!text) return 'Ürün açıklaması henüz eklenmedi.';
    
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) {
        return text;
    }
    
    return words.slice(0, wordLimit).join(' ') + '...';
}

// Daha katı fiyat formatlayıcı: geçersiz değerleri 0'a düşürür
function formatPriceStrict(price) {
    const n = Number(price);
    if (!isFinite(n) || isNaN(n) || n < 0) return '0';
    return new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(n);
}

// Go to product detail page
window.goToProductDetail = function(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
};

// Export functions for potential use
export { 
    renderProducts, 
    filterByCategory, 
    searchProducts, 
    sortProducts 
}; 