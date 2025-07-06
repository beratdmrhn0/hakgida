// Global products array
let products = [];

// Current product
let currentProduct = null;

// Page initialization
document.addEventListener('DOMContentLoaded', async function() {
    // Sayfa yüklendiğinde loaded class'ını ekle
    document.body.classList.add('loaded');
    
    await initializeProductDetail();
    setupMobileMenu();
});

// Initialize product detail page
async function initializeProductDetail() {
    // Backend'den ürünleri yükle
    await loadProductsFromBackend();
    
    const productId = getProductIdFromURL();
    
    if (productId) {
        loadProductDetail(productId);
    } else {
        showProductNotFound();
    }
}

// Backend'den ürünleri yükle
async function loadProductsFromBackend() {
    try {
        console.log('Backend\'den ürünler yükleniyor...');
        
        const response = await fetch('http://localhost:3001/api/products');
        
        if (response.ok) {
            const data = await response.json();
            products = data.data || [];
            
            // Placeholder image ve features ekle
            products = products.map(product => ({
                ...product,
                image: product.image || getPlaceholderImage(),
                features: product.features || ['Doğal ve organik', 'Yüksek kalite', 'Günlük taze'] // Default features
            }));
            
            console.log('Ürünler başarıyla yüklendi:', products.length, 'adet');
        } else {
            console.error('Backend\'den ürün yükleme hatası:', response.status);
            showLoadingError();
        }
    } catch (error) {
        console.error('Backend bağlantı hatası:', error);
        showLoadingError();
    }
}

// Placeholder image
function getPlaceholderImage() {
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f0f0f0"/><text x="150" y="100" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial, sans-serif" font-size="16">Ürün Resmi</text></svg>';
}

// Yükleme hatası
function showLoadingError() {
    document.querySelector('.product-detail').innerHTML = `
        <div class="container">
            <div class="product-not-found">
                <i class="fas fa-wifi fa-3x" style="color: #ef4444;"></i>
                <h2>Bağlantı Hatası</h2>
                <p>Ürün bilgileri yüklenemiyor. Lütfen sayfayı yenileyin.</p>
                <div class="not-found-actions">
                    <button class="btn btn-primary" onclick="window.location.reload()">
                        <i class="fas fa-redo"></i> Sayfayı Yenile
                    </button>
                    <a href="products.html" class="btn btn-secondary">Ürünler</a>
                </div>
            </div>
        </div>
    `;
}

// Get product ID from URL parameters
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

// Load product detail
function loadProductDetail(productId) {
    currentProduct = products.find(product => product.id === productId);
    
    if (currentProduct) {
        renderProductDetail(currentProduct);
        updateBreadcrumb(currentProduct);
        loadRelatedProducts(currentProduct);
        updatePageTitle(currentProduct);
    } else {
        showProductNotFound();
    }
}

// Render product detail
function renderProductDetail(product) {
    // Update product image
    document.getElementById('productImage').src = product.image;
    document.getElementById('productImage').alt = product.name;
    
    // Update product info
    document.getElementById('productCategory').textContent = getCategoryName(product.category);
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productStock').innerHTML = `
        <span class="stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
            <i class="fas fa-${product.stock > 0 ? 'check' : 'times'}-circle"></i>
            ${product.stock > 0 ? 'Stokta Var' : 'Stokta Yok'}
        </span>
    `;
    document.getElementById('productPrice').textContent = `${product.price}₺`;
    document.getElementById('productDescription').textContent = product.description;
    
    // Update product features
    const featuresElement = document.getElementById('productFeatures');
    featuresElement.innerHTML = product.features.map(feature => `<li>${feature}</li>`).join('');
}

// Update breadcrumb
function updateBreadcrumb(product) {
    const categoryElement = document.getElementById('breadcrumb-category');
    const productElement = document.getElementById('breadcrumb-product');
    
    const categoryName = getCategoryName(product.category);
    categoryElement.innerHTML = `<a href="products.html?category=${product.category}">${categoryName}</a>`;
    productElement.textContent = product.name;
}

// Load related products
function loadRelatedProducts(product) {
    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);
    
    const relatedProductsGrid = document.getElementById('relatedProductsGrid');
    
    if (relatedProducts.length === 0) {
        relatedProductsGrid.innerHTML = '<p>Bu kategoride başka ürün bulunmamaktadır.</p>';
        return;
    }
    
    relatedProductsGrid.innerHTML = relatedProducts.map(relatedProduct => `
        <div class="related-product-card">
            <div class="related-product-image">
                <img src="${relatedProduct.image}" alt="${relatedProduct.name}" loading="lazy">
            </div>
            <div class="related-product-info">
                <h4>${relatedProduct.name}</h4>
                <p class="related-product-price">${relatedProduct.price}₺</p>
                <button class="btn btn-sm btn-outline" onclick="goToProduct(${relatedProduct.id})">
                    Detayları Gör
                </button>
            </div>
        </div>
    `).join('');
}

// Update page title
function updatePageTitle(product) {
    document.title = `${product.name} - Hakgida`;
}

// Show product not found
function showProductNotFound() {
    document.querySelector('.product-detail').innerHTML = `
        <div class="container">
            <div class="product-not-found">
                <i class="fas fa-exclamation-triangle fa-3x"></i>
                <h2>Ürün Bulunamadı</h2>
                <p>Aradığınız ürün bulunamadı veya artık mevcut değil.</p>
                <div class="not-found-actions">
                    <a href="products.html" class="btn btn-primary">Tüm Ürünler</a>
                    <a href="index.html" class="btn btn-secondary">Ana Sayfa</a>
                </div>
            </div>
        </div>
    `;
}

// Setup mobile menu
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
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

// Contact for product
window.contactForProduct = function() {
    if (currentProduct) {
        const message = `Merhaba, ${currentProduct.name} ürünü hakkında bilgi almak istiyorum.`;
        const whatsappUrl = `https://wa.me/905464123456?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
};

// Share product
window.shareProduct = function() {
    if (currentProduct && navigator.share) {
        navigator.share({
            title: currentProduct.name,
            text: currentProduct.description,
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('Ürün linki kopyalandı!');
        });
    }
};

// Go back
window.goBack = function() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'products.html';
    }
};

// Go to product
window.goToProduct = function(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
};

// Export functions for potential use
export { 
    loadProductDetail, 
    renderProductDetail, 
    updateBreadcrumb, 
    loadRelatedProducts 
}; 