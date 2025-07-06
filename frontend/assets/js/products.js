// Import products data
import { products } from './data/products.js';

// Page initialization
document.addEventListener('DOMContentLoaded', function() {
    // Sayfa yüklendiğinde loaded class'ını ekle
    document.body.classList.add('loaded');
    
    initializeProductsPage();
    setupEventListeners();
    checkURLParameters();
});

// Initialize products page
function initializeProductsPage() {
    renderProducts(products);
    setupMobileMenu();
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
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        searchProducts(searchTerm);
    });

    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        sortProducts(sortValue);
    });
}

// Setup mobile menu
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
}

// Check URL parameters for category filtering
function checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        filterByCategory(category);
        updateActiveButton(document.querySelector(`[data-category="${category}"]`));
    }
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
    
    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-badge">${getCategoryName(product.category)}</div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price}₺</div>
                <button class="btn btn-primary product-detail-btn" onclick="goToProductDetail(${product.id})">
                    <i class="fas fa-info-circle"></i> Detayları Gör
                </button>
            </div>
        </div>
    `).join('');
}

// Filter products by category
function filterByCategory(category) {
    let filteredProducts = products;
    
    if (category !== 'all') {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    renderProducts(filteredProducts);
}

// Search products
function searchProducts(searchTerm) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.features.some(feature => feature.toLowerCase().includes(searchTerm))
    );
    
    renderProducts(filteredProducts);
}

// Sort products
function sortProducts(sortValue) {
    let sortedProducts = [...products];
    
    switch(sortValue) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
            break;
        default:
            sortedProducts = products;
    }
    
    renderProducts(sortedProducts);
}

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
        'organik': 'Organik'
    };
    return categoryNames[category] || category;
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