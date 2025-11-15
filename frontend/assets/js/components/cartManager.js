// Sepet Yönetimi
export class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.cartCount = document.querySelector('.cart-count');
        this.init();
    }

    init() {
        this.updateCartCount();
        this.bindEvents();
    }

    bindEvents() {
        // Sepet ikonu tıklama
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => this.showCart());
        }
    }

    // Sepete ürün ekleme
    addToCart(productId, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            // Ürün bilgilerini products.js'den al
            import('../data/products.js').then(({ products }) => {
                const product = products.find(p => p.id === productId);
                if (product && product.inStock) {
                    this.cart.push({
                        id: productId,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: quantity
                    });
                    this.saveCart();
                    this.updateCartCount();
                }
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        return true;
    }

    // Sepetten ürün çıkarma
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
    }

    // Sepeti temizleme
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
    }

    // Sepet sayısını güncelleme
    updateCartCount() {
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        if (this.cartCount) {
            this.cartCount.textContent = totalItems;
        }
    }

    // Sepeti gösterme
    showCart() {
        if (this.cart.length === 0) {
            alert('Sepetiniz boş!');
            return;
        }

        const modal = this.createCartModal();
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    }

    // Sepet modal'ı oluşturma
    createCartModal() {
        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        
        let total = 0;
        const cartItems = this.cart.map(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-details">Adet: ${item.quantity} x ${item.price.toFixed(2)} TL</div>
                    </div>
                    <div class="cart-item-price">${itemTotal.toFixed(2)} TL</div>
                    <button class="cart-item-remove" onclick="cartManager.removeFromCart(${item.id}); cartManager.refreshCartModal();">×</button>
                </div>
            `;
        }).join('');

        modal.innerHTML = `
            <div class="cart-content">
                <div class="cart-header">
                    <h2>Sepetiniz</h2>
                    <button class="close-modal" onclick="this.closest('.cart-modal').remove(); document.body.style.overflow = 'auto';">×</button>
                </div>
                <div class="cart-items">${cartItems}</div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <h3>Toplam: ${total.toFixed(2)} TL</h3>
                    </div>
                    <div class="cart-actions">
                        <button class="btn btn-primary" onclick="cartManager.checkout()">Siparişi Tamamla</button>
                        <button class="btn btn-outline" onclick="cartManager.clearCart(); this.closest('.cart-modal').remove(); document.body.style.overflow = 'auto';">Sepeti Temizle</button>
                    </div>
                </div>
            </div>
        `;

        // Modal dış alan tıklama
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
        });

        return modal;
    }

    // Sepet modal'ını yenileme
    refreshCartModal() {
        const existingModal = document.querySelector('.cart-modal');
        if (existingModal) {
            existingModal.remove();
            setTimeout(() => this.showCart(), 100);
        }
    }

    // Sipariş tamamlama
    checkout() {
        if (this.cart.length === 0) return;
        
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        alert(`Sipariş özeti:\n\n${this.cart.map(item => `${item.name} x${item.quantity}`).join('\n')}\n\nToplam: ${total.toFixed(2)} TL\n\nSiparişiniz alınmıştır! Teşekkür ederiz.`);
        
        this.clearCart();
        
        const modal = document.querySelector('.cart-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    }

    // Sepeti kaydetme
    saveCart() {
        localStorage.setItem('hakgida_cart', JSON.stringify(this.cart));
    }

    // Sepeti yükleme
    loadCart() {
        const saved = localStorage.getItem('hakgida_cart');
        return saved ? JSON.parse(saved) : [];
    }

    // Sepet toplam fiyatı
    getTotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Sepet öğe sayısı
    getItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
}
