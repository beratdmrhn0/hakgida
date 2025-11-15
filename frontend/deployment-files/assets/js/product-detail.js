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
    console.log('Initializing product detail page...');
    
    // Backend'den ürünleri yükle
    await loadProductsFromBackend();
    console.log('Products loaded, total:', products.length);
    
    const productId = getProductIdFromURL();
    console.log('Product ID from URL:', productId);
    
    if (productId) {
        loadProductDetail(productId);
    } else {
        console.log('No product ID found in URL');
        showProductNotFound();
    }
}

// Backend'den ürünleri yükle
async function loadProductsFromBackend() {
    try {
        console.log('Backend\'den ürünler yükleniyor...');
        
        const response = await fetch(CONFIG.API_ENDPOINTS.products);
        
        if (response.ok) {
            const data = await response.json();
            products = data.data || [];
            
            // Placeholder image ve features ekle, veriyi temizle
            products = products.map(product => {
                return {
                    id: product.id,
                    name: product.name || 'Ürün',
                    description: product.description || 'Açıklama mevcut değil',
                    price: product.price || 0,
                    category: product.category || 'genel',
                    brand: product.brand || '',
                    image: product.image || getPlaceholderImage(),
                    features: product.features || ['Doğal ve organik', 'Yüksek kalite', 'Günlük taze'], // Default features
                    stock: product.stock || 0
                };
            });
            
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
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f0f0f0"/></svg>';
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
    console.log('Rendering product detail for:', product);
    
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
    
    // Update price
    const priceElement = document.getElementById('productPrice');
    priceElement.textContent = `${formatPrice(product.price)}`;
    console.log('Price set to:', formatPrice(product.price));
    
    // Update description
    const descriptionElement = document.getElementById('productDescription');
    descriptionElement.textContent = product.description || 'Ürün açıklaması bulunmamaktadır.';
    console.log('Description set to:', product.description);
    
    // Make sure elements are visible
    priceElement.style.display = 'block';
    descriptionElement.style.display = 'block';
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
    console.log('Loading related products for:', product.name);
    console.log('Products array length:', products.length);
    console.log('Current product category:', product.category);
    
    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);
    
    console.log('Related products found:', relatedProducts.length);
    console.log('Related products:', relatedProducts);
    
    const relatedProductsGrid = document.getElementById('relatedProductsGrid');
    const relatedProductsSection = document.querySelector('.related-products');
    
    // Make sure the section is visible
    if (relatedProductsSection) {
        relatedProductsSection.style.display = 'block';
        relatedProductsSection.style.visibility = 'visible';
    }
    
    if (relatedProducts.length === 0) {
        relatedProductsGrid.innerHTML = '<p style="text-align: center; color: var(--medium-text); padding: 2rem;">Bu kategoride başka ürün bulunmamaktadır.</p>';
        return;
    }
    
    relatedProductsGrid.innerHTML = relatedProducts.map(relatedProduct => `
        <div class="related-product-card">
            <div class="related-product-image">
                ${relatedProduct.image && relatedProduct.image !== '' ? 
                    `<img src="${relatedProduct.image}" alt="${relatedProduct.name}" loading="lazy">` :
                    `<div class="image-placeholder">
                        <i class="fas fa-image-slash"></i>
                    </div>`
                }
            </div>
            <div class="related-product-info">
                <h4>${relatedProduct.name}</h4>
                <div class="related-product-price">
                    <span class="currency">₺</span>
                    <span class="amount">${formatPrice(relatedProduct.price)}</span>
                </div>
                <button class="btn btn-sm btn-outline" onclick="goToProduct(${relatedProduct.id})">
                    Detayları Gör
                </button>
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
    document.querySelectorAll('.related-product-card').forEach(card => {
        const titleElement = card.querySelector('h4');
        
        if (titleElement && titleElement.textContent.includes('alt=')) {
            titleElement.textContent = 'Ürün';
        }
    });
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

// Add to favorites
window.addToFavorites = function() {
    if (currentProduct) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        if (!favorites.find(fav => fav.id === currentProduct.id)) {
            favorites.push(currentProduct);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            
            // Update button text temporarily
            const btn = event.target.closest('.btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Favorilere Eklendi';
            btn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 2000);
        } else {
            alert('Bu ürün zaten favorilerinizde!');
        }
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

// Image zoom modal functions
window.openImageModal = function() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const productImage = document.getElementById('productImage');
    
    modal.style.display = 'block';
    modalImage.src = productImage.src;
    
    // Close modal when clicking outside
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeImageModal();
        }
    };
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeImageModal();
        }
    });
};

window.closeImageModal = function() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
};

// Export functions for potential use
export { 
    loadProductDetail, 
    renderProductDetail, 
    updateBreadcrumb, 
    loadRelatedProducts 
}; 