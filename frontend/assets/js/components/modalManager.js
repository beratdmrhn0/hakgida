// Modal Yönetimi
export class ModalManager {
    constructor() {
        this.productModal = document.getElementById('productModal');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Modal kapatma
        const closeButton = document.querySelector('.close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closeModal());
        }

        // Modal dış alan tıklama
        if (this.productModal) {
            this.productModal.addEventListener('click', (e) => {
                if (e.target === this.productModal) {
                    this.closeModal();
                }
            });
        }

        // ESC tuşu ile kapatma
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.productModal?.style.display === 'block') {
                this.closeModal();
            }
        });
    }

    // Ürün detay modal'ını gösterme
    showProductModal(product) {
        if (!this.productModal) return;

        // Modal içeriğini doldurma
        this.populateModal(product);
        
        // Modal'ı gösterme
        this.productModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Animasyon için slight delay
        setTimeout(() => {
            this.productModal.classList.add('active');
        }, 10);
    }

    // Modal içeriğini doldurma
    populateModal(product) {
        // Temel bilgiler
        const modalProductImage = document.getElementById('modalProductImage');
        const modalProductName = document.getElementById('modalProductName');
        const modalCategory = document.getElementById('modalCategory');
        const modalPrice = document.getElementById('modalPrice');
        const modalDescription = document.getElementById('modalDescription');
        const modalStock = document.getElementById('modalStock');
        const modalFeatures = document.getElementById('modalFeatures');

        if (modalProductImage) modalProductImage.src = product.image;
        if (modalProductName) modalProductName.textContent = product.name;
        if (modalCategory) modalCategory.textContent = this.getCategoryName(product.category);
        if (modalPrice) modalPrice.textContent = `${product.price.toFixed(2)} TL`;
        if (modalDescription) modalDescription.textContent = product.description;
        
        if (modalStock) {
            modalStock.textContent = product.inStock ? `Stok: ${product.stock} adet` : 'Stokta yok';
            modalStock.className = `product-stock ${product.inStock ? '' : 'out-of-stock'}`;
        }
        
        if (modalFeatures) {
            modalFeatures.innerHTML = product.features
                .map(feature => `<span class="feature-tag">${feature}</span>`)
                .join('');
        }

        // Miktar sıfırlama
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) quantityInput.value = 1;
        
        // Sepete ekle butonu
        this.setupAddToCartButton(product);
    }

    // Sepete ekle butonunu ayarlama
    setupAddToCartButton(product) {
        const addToCartBtn = document.getElementById('addToCartBtn');
        if (!addToCartBtn) return;

        // Buton durumunu ayarlama
        addToCartBtn.disabled = !product.inStock;
        
        // Event listener temizleme ve yeniden ekleme
        const newBtn = addToCartBtn.cloneNode(true);
        addToCartBtn.parentNode.replaceChild(newBtn, addToCartBtn);
        
        newBtn.addEventListener('click', () => {
            const quantity = parseInt(document.getElementById('quantity')?.value || 1);
            this.addToCart(product.id, quantity);
        });
    }

    // Sepete ekleme
    addToCart(productId, quantity) {
        import('./cartManager.js').then(({ CartManager }) => {
            const cartManager = new CartManager();
            if (cartManager.addToCart(productId, quantity)) {
                // Başarı mesajı
                this.showSuccessMessage('Ürün sepetinize eklendi!');
                this.closeModal();
            }
        });
    }

    // Başarı mesajı gösterme
    showSuccessMessage(message) {
        // Basit toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            z-index: 9999;
            animation: slideInRight 0.3s ease;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // Modal kapatma
    closeModal() {
        if (!this.productModal) return;
        
        this.productModal.classList.remove('active');
        setTimeout(() => {
            this.productModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    // Kategori adı çevirici
    getCategoryName(category) {
        const categoryNames = {
            'caylar': 'Çaylar',
            'baklagil': 'Baklagil',
            'baharat': 'Baharat',
            'organik': 'Organik'
        };
        return categoryNames[category] || 'Ürün';
    }
}

// Miktar değiştirme fonksiyonları (global)
window.changeQuantity = function(change) {
    const quantityInput = document.getElementById('quantity');
    if (!quantityInput) return;
    
    let currentQuantity = parseInt(quantityInput.value);
    let newQuantity = currentQuantity + change;
    
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 10) newQuantity = 10; // Maksimum 10 adet
    
    quantityInput.value = newQuantity;
};
