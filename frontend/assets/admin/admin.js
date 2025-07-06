// Import products data
import { products as initialProducts } from '../js/data/products.js';

// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.products = [...initialProducts];
        this.isLoggedIn = false;
        this.currentEditId = null;
        
        this.categories = {
            'caylar': { name: 'Çaylar', icon: 'fas fa-leaf', color: '#27ae60' },
            'baklagil': { name: 'Baklagil', icon: 'fas fa-seedling', color: '#e74c3c' },
            'baharat': { name: 'Baharat', icon: 'fas fa-pepper-hot', color: '#f39c12' },
            'organik': { name: 'Organik', icon: 'fas fa-spa', color: '#8e44ad' }
        };
        
        this.init();
    }
    
    init() {
        this.checkLoginStatus();
        this.bindEvents();
        this.updateDashboard();
        this.loadProducts();
        this.loadCategories();
        
        // Auto-save every 30 seconds
        setInterval(() => this.autoSave(), 30000);
    }
    
    // Login Management
    checkLoginStatus() {
        const loginModal = document.getElementById('loginModal');
        const adminPanel = document.getElementById('adminPanel');
        
        if (this.isLoggedIn) {
            loginModal.classList.remove('active');
            adminPanel.classList.add('active');
        } else {
            loginModal.classList.add('active');
            adminPanel.classList.remove('active');
        }
    }
    
    login(password) {
        // Simple password check (in production, use proper authentication)
        if (password === 'hakgida2024') {
            this.isLoggedIn = true;
            this.checkLoginStatus();
            this.showToast('Başarıyla giriş yapıldı!', 'success');
            return true;
        } else {
            this.showToast('Yanlış şifre!', 'error');
            return false;
        }
    }
    
    logout() {
        this.isLoggedIn = false;
        this.checkLoginStatus();
        this.showToast('Çıkış yapıldı.', 'info');
    }
    
    // Event Binding
    bindEvents() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('adminPassword').value;
            this.login(password);
        });
        
        // Tab navigation
        document.querySelectorAll('[data-tab]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });
        
        // Sidebar toggle (mobile)
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('active');
        });
        
        // Product form
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });
        
        // Image preview
        document.getElementById('productImage').addEventListener('input', (e) => {
            this.previewImage(e.target.value);
        });
        
        // Product search
        document.getElementById('productSearch').addEventListener('input', (e) => {
            this.searchProducts(e.target.value);
        });
        
        // Category filter
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.filterProducts(e.target.value);
        });
        
        // Import file
        document.getElementById('importFile').addEventListener('change', (e) => {
            this.handleFileImport(e.target.files[0]);
        });
        
        // Confirm modal
        document.getElementById('confirmNo').addEventListener('click', () => {
            this.hideConfirmModal();
        });
    }
    
    // Tab Management
    switchTab(tabName) {
        // Update nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Update page title
        const titles = {
            'dashboard': 'Dashboard',
            'products': 'Ürün Yönetimi',
            'add-product': 'Ürün Ekle',
            'categories': 'Kategoriler',
            'export': 'Veri Yönetimi'
        };
        document.getElementById('pageTitle').textContent = titles[tabName] || 'Admin Panel';
        
        // Refresh data if needed
        if (tabName === 'dashboard') {
            this.updateDashboard();
        } else if (tabName === 'products') {
            this.loadProducts();
        } else if (tabName === 'categories') {
            this.loadCategories();
        }
    }
    
    // Dashboard
    updateDashboard() {
        const totalProducts = this.products.length;
        const totalCategories = Object.keys(this.categories).length;
        const avgPrice = this.products.length > 0 
            ? Math.round(this.products.reduce((sum, p) => sum + p.price, 0) / this.products.length)
            : 0;
        const lastUpdate = new Date().toLocaleDateString('tr-TR');
        
        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('totalCategories').textContent = totalCategories;
        document.getElementById('avgPrice').textContent = `${avgPrice}₺`;
        document.getElementById('lastUpdate').textContent = lastUpdate;
        
        this.loadRecentProducts();
    }
    
    loadRecentProducts() {
        const recentProducts = this.products.slice(-5).reverse();
        const container = document.getElementById('recentProductsList');
        
        if (recentProducts.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--admin-text-secondary);">Henüz ürün bulunmamaktadır.</p>';
            return;
        }
        
        container.innerHTML = recentProducts.map(product => `
            <div class="recent-product-item">
                <div class="recent-product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23f0f0f0%22/><text x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22>No Image</text></svg>'">
                </div>
                <div class="recent-product-info">
                    <h4>${product.name}</h4>
                    <p>${this.categories[product.category]?.name || product.category} - ${product.price}₺</p>
                </div>
            </div>
        `).join('');
    }
    
    // Product Management
    loadProducts() {
        const tbody = document.getElementById('productsTableBody');
        const categoryFilter = document.getElementById('categoryFilter');
        
        // Update category filter
        categoryFilter.innerHTML = '<option value="">Tüm Kategoriler</option>' +
            Object.entries(this.categories).map(([key, cat]) => 
                `<option value="${key}">${cat.name}</option>`
            ).join('');
        
        // Load products
        this.renderProductsTable(this.products);
    }
    
    renderProductsTable(products) {
        const tbody = document.getElementById('productsTableBody');
        
        if (products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--admin-text-secondary);">
                        Ürün bulunamadı.
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = products.map(product => `
            <tr>
                <td>
                    <div class="product-image-cell">
                        <img src="${product.image}" alt="${product.name}" 
                             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23f0f0f0%22/><text x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22>No Image</text></svg>'">
                    </div>
                </td>
                <td>
                    <strong style="color: var(--admin-text-primary);">${product.name}</strong>
                    <br>
                    <small style="color: var(--admin-text-secondary);">${product.description.substring(0, 50)}...</small>
                </td>
                <td>
                    <span style="color: ${this.categories[product.category]?.color || '#666'};">
                        <i class="${this.categories[product.category]?.icon || 'fas fa-tag'}"></i>
                        ${this.categories[product.category]?.name || product.category}
                    </span>
                </td>
                <td><strong style="color: var(--admin-text-primary);">${product.price}₺</strong></td>
                <td>
                    <span style="color: ${product.stock > 0 ? 'var(--admin-success)' : 'var(--admin-danger)'};">
                        ${product.stock > 0 ? product.stock + ' adet' : 'Stokta yok'}
                    </span>
                </td>
                <td>
                    <div class="product-actions">
                        <button class="action-btn edit" onclick="adminPanel.editProduct(${product.id})" title="Düzenle">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="adminPanel.deleteProduct(${product.id})" title="Sil">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    searchProducts(query) {
        if (!query.trim()) {
            this.renderProductsTable(this.products);
            return;
        }
        
        const filtered = this.products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.features.some(feature => feature.toLowerCase().includes(query.toLowerCase()))
        );
        
        this.renderProductsTable(filtered);
    }
    
    filterProducts(category) {
        if (!category) {
            this.renderProductsTable(this.products);
            return;
        }
        
        const filtered = this.products.filter(product => product.category === category);
        this.renderProductsTable(filtered);
    }
    
    // Product CRUD Operations
    saveProduct() {
        const form = document.getElementById('productForm');
        const formData = new FormData(form);
        
        const productData = {
            name: document.getElementById('productName').value.trim(),
            category: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            image: document.getElementById('productImage').value.trim() || this.getPlaceholderImage(),
            description: document.getElementById('productDescription').value.trim(),
            features: document.getElementById('productFeatures').value
                .split('\n')
                .map(f => f.trim())
                .filter(f => f.length > 0)
        };
        
        // Validation
        if (!productData.name || !productData.category || !productData.description) {
            this.showToast('Lütfen zorunlu alanları doldurun!', 'error');
            return;
        }
        
        const editId = document.getElementById('editProductId').value;
        
        if (editId) {
            // Update existing product
            const index = this.products.findIndex(p => p.id == editId);
            if (index !== -1) {
                this.products[index] = { ...this.products[index], ...productData };
                this.showToast('Ürün başarıyla güncellendi!', 'success');
            }
        } else {
            // Add new product
            const newId = Math.max(...this.products.map(p => p.id), 0) + 1;
            this.products.push({ id: newId, ...productData });
            this.showToast('Ürün başarıyla eklendi!', 'success');
        }
        
        this.resetForm();
        this.updateDashboard();
        this.loadProducts();
        this.switchTab('products');
    }
    
    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;
        
        // Fill form
        document.getElementById('editProductId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productFeatures').value = product.features.join('\n');
        
        // Update form title and button
        document.getElementById('formTitle').textContent = 'Ürün Düzenle';
        document.getElementById('submitBtnText').textContent = 'Güncelle';
        
        // Preview image
        this.previewImage(product.image);
        
        // Switch to form tab
        this.switchTab('add-product');
    }
    
    deleteProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;
        
        this.showConfirmModal(
            'Ürün Sil',
            `"${product.name}" ürününü silmek istediğinizden emin misiniz?`,
            () => {
                this.products = this.products.filter(p => p.id !== id);
                this.showToast('Ürün başarıyla silindi!', 'success');
                this.updateDashboard();
                this.loadProducts();
                this.hideConfirmModal();
            }
        );
    }
    
    resetForm() {
        document.getElementById('productForm').reset();
        document.getElementById('editProductId').value = '';
        document.getElementById('formTitle').textContent = 'Yeni Ürün Ekle';
        document.getElementById('submitBtnText').textContent = 'Ürün Ekle';
        document.getElementById('previewImg').style.display = 'none';
    }
    
    // Image Management
    previewImage(url) {
        const img = document.getElementById('previewImg');
        if (url && url.trim()) {
            img.src = url;
            img.style.display = 'block';
            img.onerror = () => {
                img.style.display = 'none';
            };
        } else {
            img.style.display = 'none';
        }
    }
    
    getPlaceholderImage() {
        return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f0f0f0"/><text x="150" y="100" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial, sans-serif" font-size="16">Ürün Resmi</text></svg>';
    }
    
    // Categories Management
    loadCategories() {
        const container = document.getElementById('categoriesGrid');
        
        container.innerHTML = Object.entries(this.categories).map(([key, category]) => {
            const productCount = this.products.filter(p => p.category === key).length;
            
            return `
                <div class="category-card">
                    <div class="category-icon" style="color: ${category.color};">
                        <i class="${category.icon}"></i>
                    </div>
                    <h4>${category.name}</h4>
                    <p>${productCount} ürün</p>
                </div>
            `;
        }).join('');
    }
    
    // Data Management
    exportData() {
        const data = {
            products: this.products,
            categories: this.categories,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `hakgida-products-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showToast('Veriler başarıyla indirildi!', 'success');
    }
    
    importData() {
        document.getElementById('importFile').click();
    }
    
    handleFileImport(file) {
        if (!file || file.type !== 'application/json') {
            this.showToast('Lütfen geçerli bir JSON dosyası seçin!', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.products && Array.isArray(data.products)) {
                    this.showConfirmModal(
                        'Veri İçe Aktar',
                        `${data.products.length} ürün içe aktarılacak. Mevcut veriler silinecek. Devam etmek istiyor musunuz?`,
                        () => {
                            this.products = data.products;
                            if (data.categories) {
                                this.categories = { ...this.categories, ...data.categories };
                            }
                            this.showToast('Veriler başarıyla içe aktarıldı!', 'success');
                            this.updateDashboard();
                            this.loadProducts();
                            this.loadCategories();
                            this.hideConfirmModal();
                        }
                    );
                } else {
                    this.showToast('Geçersiz dosya formatı!', 'error');
                }
            } catch (error) {
                this.showToast('Dosya okuma hatası!', 'error');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        document.getElementById('importFile').value = '';
    }
    
    createBackup() {
        const backupData = {
            products: this.products,
            categories: this.categories,
            backup: true,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('hakgida-backup', JSON.stringify(backupData));
        document.getElementById('lastBackup').textContent = new Date().toLocaleString('tr-TR');
        this.showToast('Yedek başarıyla oluşturuldu!', 'success');
    }
    
    autoSave() {
        if (this.isLoggedIn) {
            localStorage.setItem('hakgida-autosave', JSON.stringify({
                products: this.products,
                timestamp: new Date().toISOString()
            }));
        }
    }
    
    // UI Helpers
    showConfirmModal(title, message, onConfirm) {
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        document.getElementById('confirmModal').classList.add('active');
        
        document.getElementById('confirmYes').onclick = onConfirm;
    }
    
    hideConfirmModal() {
        document.getElementById('confirmModal').classList.remove('active');
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${this.getToastIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        document.getElementById('toastContainer').appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Hide toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    getToastIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Global functions for HTML onclick events
window.resetForm = function() {
    adminPanel.resetForm();
};

window.logout = function() {
    adminPanel.logout();
};

window.exportData = function() {
    adminPanel.exportData();
};

window.importData = function() {
    adminPanel.importData();
};

window.createBackup = function() {
    adminPanel.createBackup();
};

// Initialize admin panel
const adminPanel = new AdminPanel();

// Make it globally available for debugging
window.adminPanel = adminPanel;

export default AdminPanel; 