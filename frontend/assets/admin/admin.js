// Import products data
import { products as initialProducts } from '../js/data/products.js';

// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.products = []; // Backend'den yüklenecek
        this.isLoggedIn = false;
        this.currentEditId = null;
        
        this.categories = {
            'caylar': { name: 'Çaylar', icon: 'fas fa-leaf', color: '#27ae60', emoji: '🍃' },
            'baklagil': { name: 'Baklagil', icon: 'fas fa-seedling', color: '#e74c3c', emoji: '🫘' },
            'bakliyat': { name: 'Bakliyat', icon: 'fas fa-seedling', color: '#8b4513', emoji: '🌾' },
            'bulgur': { name: 'Bulgur', icon: 'fas fa-wheat-awn', color: '#daa520', emoji: '🌾' },
            'baharat': { name: 'Baharat', icon: 'fas fa-pepper-hot', color: '#f39c12', emoji: '🌶️' },
            'salca': { name: 'Salça', icon: 'fas fa-bottle-droplet', color: '#dc2626', emoji: '🍅' },
            'makarna': { name: 'Makarna', icon: 'fas fa-utensils', color: '#fbbf24', emoji: '🍝' },
            'seker': { name: 'Şeker', icon: 'fas fa-cube', color: '#f8fafc', emoji: '🧊' },
            'yag': { name: 'Yağ', icon: 'fas fa-oil-can', color: '#fcd34d', emoji: '🫒' },
            'icecek': { name: 'İçecek', icon: 'fas fa-bottle-water', color: '#06b6d4', emoji: '🥤' },
            'organik': { name: 'Organik', icon: 'fas fa-spa', color: '#8e44ad', emoji: '🌱' },
            'kuruyemis': { name: 'Kuruyemiş', icon: 'fas fa-apple-alt', color: '#795548', emoji: '🥜' }
        };

        // Marka listesi (index.html "İş Birliklerimiz" ile uyumlu slug'lar)
        this.brands = [
            { key: 'harfece-bakliyat', name: 'Harfece Bakliyat' },
            { key: 'kalbak-bakliyat', name: 'Kalbak Bakliyat' },
            { key: 'mert-kup-seker', name: 'Mert Küp Şeker' },
            { key: 'turna-yag', name: 'Turna Yağ' },
            { key: 'cagdas-bulgur', name: 'Çağdaş Bulgur' },
            { key: 'arbel-bulgur', name: 'Arbel Bulgur' },
            { key: 'turkiye-seker', name: 'Türkiye Şeker Fabrikaları' },
            { key: 'er-mis-salca', name: 'Er Mis Salça' },
            { key: 'ovella-makarna', name: 'Ovella Makarna' },
            { key: 'beypazari', name: 'Beypazarı' },
            { key: 'caykur', name: 'Çaykur' }
        ];
        
        this.init();
    }
    
    async init() {
        this.checkLoginStatus();
        this.bindEvents();
        
        // Backend'den ürünleri yükle
        await this.loadProductsFromBackend();
        
        this.updateDashboard();
        this.loadProducts();
        this.loadCategories();
        
        // Form enhancement'ları ekle
        this.setupFormEnhancements();
        
        // Auto-save every 30 seconds
        setInterval(() => this.autoSave(), 30000);
    }

    setupFormEnhancements() {
        // Karakter sayacı
        const textarea = document.getElementById('productDescription');
        const charCount = document.getElementById('charCount');
        
        if (textarea && charCount) {
            textarea.addEventListener('input', () => {
                charCount.textContent = textarea.value.length;
            });
        }
        
        // Image input type değiştirme
        const imageRadios = document.querySelectorAll('input[name="imageInputType"]');
        imageRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.toggleImageInputMode(e.target.value);
            });
        });
        
        // File select button
        const selectFileBtn = document.getElementById('selectFileBtn');
        const productImageFile = document.getElementById('productImageFile');
        const selectedFileName = document.getElementById('selectedFileName');
        
        if (selectFileBtn && productImageFile && selectedFileName) {
            selectFileBtn.addEventListener('click', () => {
                productImageFile.click();
            });
            
            productImageFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    selectedFileName.textContent = file.name;
                    this.handleFileUpload(file);
                } else {
                    selectedFileName.textContent = '';
                }
            });
        }
        
        // Remove image button
        const removeImageBtn = document.getElementById('removeImageBtn');
        if (removeImageBtn) {
            removeImageBtn.addEventListener('click', () => {
                this.removeImage();
            });
        }
    }

    toggleImageInputMode(mode) {
        const urlInput = document.getElementById('productImage');
        const fileBtn = document.getElementById('selectFileBtn');
        const fileName = document.getElementById('selectedFileName');
        
        if (mode === 'url') {
            urlInput.style.display = 'block';
            fileBtn.style.display = 'none';
            fileName.style.display = 'none';
        } else {
            urlInput.style.display = 'none';
            fileBtn.style.display = 'flex';
            fileName.style.display = 'block';
        }
    }

    handleFileUpload(file) {
        // Basit file upload - gerçek implementasyon için backend endpoint gerekir
        const reader = new FileReader();
        reader.onload = (e) => {
            this.showImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    showImagePreview(src) {
        const previewContainer = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        
        if (previewContainer && previewImg) {
            previewImg.src = src;
            previewContainer.style.display = 'block';
        }
    }

    removeImage() {
        const previewContainer = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        const urlInput = document.getElementById('productImage');
        const fileInput = document.getElementById('productImageFile');
        const fileName = document.getElementById('selectedFileName');
        
        if (previewContainer) previewContainer.style.display = 'none';
        if (previewImg) previewImg.src = '';
        if (urlInput) urlInput.value = '';
        if (fileInput) fileInput.value = '';
        if (fileName) fileName.textContent = '';
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
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const password = document.getElementById('adminPassword').value;
                this.login(password);
            });
        }
        
        // Tab navigation
        document.querySelectorAll('[data-tab]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });
        
        // Sidebar toggle (mobile)
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                document.querySelector('.sidebar').classList.toggle('active');
            });
        }
        
        // Product form
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProduct();
            });
        }

        // Dinamik marka chip alanı dinlemeleri (delegation)
        document.addEventListener('click', (e) => {
            const chip = e.target.closest('.brand-chip');
            if (chip && chip.dataset && chip.dataset.brandKey) {
                const all = document.querySelectorAll('.brand-chip');
                all.forEach(c => c.classList.remove('selected'));
                chip.classList.add('selected');
                const brandKeyInput = document.getElementById('selectedBrand');
                if (brandKeyInput) brandKeyInput.value = chip.dataset.brandKey;
            }
        });
        
                // Product search
        const productSearch = document.getElementById('productSearch');
        if (productSearch) {
            productSearch.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });
        }
        
        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterProducts(e.target.value);
            });
        }
        
        // Import file
        const importFile = document.getElementById('importFile');
        if (importFile) {
            importFile.addEventListener('change', (e) => {
                this.handleFileImport(e.target.files[0]);
            });
        }
        
        // Confirm modal
        const confirmNo = document.getElementById('confirmNo');
        if (confirmNo) {
            confirmNo.addEventListener('click', () => {
                this.hideConfirmModal();
            });
        }

        // Image input handling
        this.setupImageInput();

        // Category selection cards (delegated event listener) + Brand cards
        document.addEventListener('click', (e) => {
            const brandCard = e.target.closest('.brand-card');
            if (brandCard) {
                const brandKey = brandCard.dataset.brand;
                if (brandKey && window.adminPanel) {
                    window.adminPanel.selectBrand(brandKey);
                }
                return;
            }
            const categoryCard = e.target.closest('.category-card');
            if (categoryCard && categoryCard.dataset.category) {
                const category = categoryCard.dataset.category;
                if (category && window.adminPanel) window.adminPanel.selectCategory(category);
            }
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
        } else if (tabName === 'add-product') {
            this.showCategorySelection();
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
                    ${product.image ? `<img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23f0f0f0%22/><text x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22>No Image</text></svg>'">` : 
                    `<div style="width: 60px; height: 60px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px; border-radius: 4px;">Resim</div>`}
                </div>
                <div class="recent-product-info">
                    <h4>${product.name}</h4>
                    <p>${this.categories[product.category]?.name || product.category} - ${product.price}₺</p>
                </div>
            </div>
        `).join('');
    }
    
    // Backend'den ürünleri yükle
    async loadProductsFromBackend() {
        try {
            console.log('Backend\'den ürünler yükleniyor...');
            const response = await fetch(CONFIG.API_ENDPOINTS.products);
            
            if (response.ok) {
                const data = await response.json();
                this.products = data.data || [];
                console.log('Ürünler başarıyla yüklendi:', this.products.length, 'adet');
            } else {
                console.error('Backend\'den ürün yükleme hatası:', response.status);
                this.products = [];
            }
        } catch (error) {
            console.error('Backend bağlantı hatası:', error);
            this.products = [];
        }
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
                        ${product.image ? `<img src="${product.image}" alt="${product.name}" 
                             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23f0f0f0%22/><text x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22>Resim</text></svg>'" 
                             style="background: #000;">` : 
                        `<div class="no-image-placeholder" style="width: 60px; height: 60px; background: #000; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px; border-radius: 4px;">Resim</div>`}
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
    
    // Category Selection Management
    showCategorySelection() {
        const categorySelection = document.getElementById('categorySelection');
        const productFormContainer = document.getElementById('productFormContainer');
        
        if (categorySelection && productFormContainer) {
            categorySelection.style.display = 'block';
            productFormContainer.style.display = 'none';
        }
        
        // Kategori seçimi için form alanlarını sıfırla
        document.getElementById('productName').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productDescription').value = '';
        document.getElementById('productStock').value = '0';
        document.getElementById('editProductId').value = '';
        document.getElementById('selectedCategory').value = '';
        document.getElementById('submitBtnText').textContent = 'Ürün Ekle';
        
        // Resim input'larını temizle
        this.removeImage();
        document.querySelector('input[name="imageInputType"][value="url"]').checked = true;
        this.toggleImageInputMode('url');
    }
    
    // Yeni akış: Önce marka seçiliyor, formda marka chip'leri yine mevcut
    selectBrand(brandKey) {
        // Marka seçildiğinde doğrudan formu aç, kategori seçimi form içinde yapılacak
        const defaultCategory = 'caylar';
        this.showProductForm(defaultCategory, this.categories[defaultCategory], brandKey);
        
        // Brand display güncelle
        this.updateBrandDisplay(brandKey);
        
        // Gizli input'a marka yaz
        const brandInput = document.getElementById('selectedBrand');
        if (brandInput) brandInput.value = brandKey || '';
    }

    updateBrandDisplay(brandKey) {
        const brandLogoImg = document.getElementById('brandLogoImg');
        const brandTitle = document.getElementById('brandTitle');
        
        if (brandKey && brandLogoImg && brandTitle) {
            const brand = this.brands.find(b => b.key === brandKey);
            if (brand) {
                // Logo path'ini brand key'den belirle
                const logoMap = {
                    'harfece-bakliyat': 'assets/images/harfece.png',
                    'kalbak-bakliyat': 'assets/images/kalbak.png',
                    'mert-kup-seker': 'assets/images/mgs-logo.jpg',
                    'turna-yag': 'assets/images/turna-logo.png',
                    'cagdas-bulgur': 'assets/images/cagdas-bulgur.png',
                    'arbel-bulgur': 'assets/images/arbel-bulgur-bakliyat.png',
                    'turkiye-seker': 'assets/images/turkseker-logo.webp',
                    'er-mis-salca': 'assets/images/ermis_logo.jpg',
                    'ovella-makarna': 'assets/images/ova-makarna.png',
                    'beypazari': 'assets/images/beypazarı.png',
                    'caykur': 'assets/images/caykur-logo.png'
                };
                
                brandLogoImg.src = logoMap[brandKey] || '';
                brandLogoImg.alt = brand.name;
                brandTitle.textContent = brand.name;
            }
        }
    }

    selectCategory(categoryKey) {
        if (!this.categories[categoryKey]) return;
        
        const category = this.categories[categoryKey];
        this.showProductForm(categoryKey, category);
    }
    
    showProductForm(categoryKey, category, preselectedBrand = null) {
        const categorySelection = document.getElementById('categorySelection');
        const productFormContainer = document.getElementById('productFormContainer');
        const categoryIcon = document.getElementById('categoryIcon');
        const categoryName = document.getElementById('categoryName');
        const selectedCategory = document.getElementById('selectedCategory');
        
        // Hide category selection, show form
        categorySelection.style.display = 'none';
        productFormContainer.style.display = 'block';
        
        // Update form header - sadece kategori dropdown'ını güncelle
        selectedCategory.value = categoryKey;
        
        // Form alanlarını sıfırla ama kategoriyi koru
        document.getElementById('productName').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productDescription').value = '';
        document.getElementById('productStock').value = '0';
        document.getElementById('editProductId').value = '';
        document.getElementById('submitBtnText').textContent = 'Ürün Ekle';
        
        // Resim input'larını temizle
        this.removeImage();
        document.querySelector('input[name="imageInputType"][value="url"]').checked = true;
        this.toggleImageInputMode('url');
        
        // Form başlığı sabit kalacak - "Ürün Ekle"
    }
    
    backToCategorySelection() {
        this.showCategorySelection();
    }

    // Product CRUD Operations
    saveProduct() {
        console.log('saveProduct called');
        
        // Form elementlerini kontrol et
        const nameElement = document.getElementById('productName');
        const categoryElement = document.getElementById('selectedCategory');
        const priceElement = document.getElementById('productPrice');
        const descriptionElement = document.getElementById('productDescription');
        const imageElement = document.getElementById('productImage');
        const stockElement = document.getElementById('productStock');
        const brandElement = document.getElementById('selectedBrand');
        
        console.log('Form elements:', {
            name: nameElement,
            category: categoryElement,
            price: priceElement,
            description: descriptionElement,
            image: imageElement,
            stock: stockElement
        });
        
        if (!nameElement || !categoryElement || !priceElement || !descriptionElement || !imageElement || !stockElement) {
            this.showToast('Form elementleri bulunamadı!', 'error');
            console.error('Missing form elements');
            return;
        }
        
        const productData = {
            name: nameElement.value.trim(),
            category: categoryElement.value,
            // type field removed from form
            type: null,
            price: priceElement.value ? parseFloat(priceElement.value) : 0,
            description: descriptionElement.value.trim(),
            brand: (brandElement && brandElement.value) ? brandElement.value : null,
            image: imageElement.value.trim() || null, // Boşsa null gönder
            stock: parseInt(stockElement.value) || 0
        };
        
        console.log('Product data:', productData);
        
        // Validation
        if (!productData.name) {
            this.showToast('Ürün adı boş olamaz!', 'error');
            return;
        }
        
        if (!productData.category) {
            this.showToast('Kategori seçilmemiş!', 'error');
            return;
        }
        
        if (!productData.description) {
            this.showToast('Ürün açıklaması boş olamaz!', 'error');
            return;
        }
        
        // Fiyat ve stok artık zorunlu değil, sadece negatif kontrolü
        if (productData.price < 0) {
            this.showToast('Fiyat negatif olamaz!', 'error');
            return;
        }
        
        if (productData.stock < 0) {
            this.showToast('Stok adeti negatif olamaz!', 'error');
            return;
        }
        
        const editId = document.getElementById('editProductId').value;
        
        if (editId) {
            // Update existing product
            const index = this.products.findIndex(p => p.id == editId);
            if (index !== -1) {
                // Local için image placeholder kullan
                const localProductData = {
                    ...productData,
                    image: productData.image || this.getPlaceholderImage()
                };
                this.products[index] = { ...this.products[index], ...localProductData };
                this.showToast('Ürün başarıyla güncellendi!', 'success');
                
                // Backend'e güncelleme gönder (image null olarak)
                this.updateProductToBackend(editId, {...productData, image: productData.image || null});
            }
        } else {
            // Add new product
            const newId = Math.max(...this.products.map(p => p.id), 0) + 1;
            const newProduct = { 
                id: newId, 
                ...productData,
                image: productData.image || this.getPlaceholderImage() // Local için placeholder, backend için null
            };
            this.products.push(newProduct);
            this.showToast('Ürün başarıyla eklendi!', 'success');
            
            // Backend'e kaydet (image null olarak)
            this.saveProductToBackend({...productData, image: productData.image || null});
        }
        
        this.resetForm();
        this.updateDashboard();
        this.loadProducts();
        this.switchTab('products');
    }
    
    // Backend'e ürün kaydetme
    async saveProductToBackend(product) {
        try {
            console.log('Backend\'e gönderilecek data:', product);
            
            const response = await fetch(CONFIG.API_ENDPOINTS.products, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: product.name,
                    category: product.category,
                    type: product.type,
                    brand: product.brand,
                    price: product.price,
                    description: product.description,
                    image: product.image,
                    stock: product.stock
                })
            });
            
            console.log('Backend response status:', response.status);
            
            if (response.ok) {
                const savedProduct = await response.json();
                console.log('Ürün backend\'e kaydedildi:', savedProduct);
                this.showToast('Ürün veritabanına kaydedildi!', 'success');
            } else {
                const errorData = await response.json().catch(() => null);
                console.error('Backend kaydetme hatası:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorData: errorData
                });
                this.showToast(`Veritabanı hatası: ${response.status}`, 'error');
            }
        } catch (error) {
            console.error('Backend bağlantı hatası:', error);
            this.showToast('Backend bağlantı hatası: ' + error.message, 'error');
        }
    }
    
    // Backend'de ürün güncelleme
    async updateProductToBackend(id, product) {
        try {
            const response = await fetch(`${CONFIG.API_ENDPOINTS.products}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: product.name,
                    category: product.category,
                    type: product.type,
                    brand: product.brand,
                    price: product.price,
                    description: product.description,
                    image: product.image,
                    stock: product.stock
                })
            });
            
            if (response.ok) {
                const updatedProduct = await response.json();
                console.log('Ürün backend\'de güncellendi:', updatedProduct);
                this.showToast('Ürün veritabanında güncellendi!', 'success');
            } else {
                console.error('Backend güncelleme hatası:', response.statusText);
                this.showToast('Veritabanında güncelleme hatası!', 'warning');
            }
        } catch (error) {
            console.error('Backend bağlantı hatası:', error);
            this.showToast('Backend bağlantı hatası!', 'warning');
        }
    }
    
    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;
        
        // Get category info
        const category = this.categories[product.category];
        if (!category) return;
        
        // Show product form directly for editing
        this.showProductForm(product.category, category);
        
        // Fill form
        document.getElementById('editProductId').value = product.id;
        document.getElementById('productName').value = product.name;
        // productType field removed
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productStock').value = product.stock || 0;

        // Marka
        const brandInput = document.getElementById('selectedBrand');
        if (brandInput && product.brand) brandInput.value = product.brand;
        
        // Brand display güncelle
        this.updateBrandDisplay(product.brand);
        
        // Resim yükleme
        if (product.image && product.image !== this.getPlaceholderImage()) {
            // URL radio button'ını seç
            document.querySelector('input[name="imageInputType"][value="url"]').checked = true;
            this.toggleImageInputMode('url');
            
            // URL'yi set et ve preview göster
            document.getElementById('productImage').value = product.image;
            this.previewImage(product.image);
        } else {
            // Resim yoksa temizle
            this.removeImage();
            document.querySelector('input[name="imageInputType"][value="url"]').checked = true;
            this.toggleImageInputMode('url');
        }
        
        // Update form title and button
        document.getElementById('formTitle').innerHTML = `
            <span id="categoryIcon">${category.emoji}</span>
            <span id="categoryName">${category.name}</span> Ürününü Düzenle
        `;
        document.getElementById('submitBtnText').textContent = 'Güncelle';
        
        // Switch to form tab
        this.switchTab('add-product');
    }
    
    deleteProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;
        
        this.showConfirmModal(
            'Ürün Sil',
            `"${product.name}" ürününü silmek istediğinizden emin misiniz?`,
            async () => {
                // Backend'den sil
                const backendDeleted = await this.deleteProductFromBackend(id);
                
                if (backendDeleted) {
                    // Local array'den de sil
                    this.products = this.products.filter(p => p.id !== id);
                    this.showToast('Ürün başarıyla silindi!', 'success');
                    this.updateDashboard();
                    this.loadProducts();
                } else {
                    this.showToast('Ürün silinirken hata oluştu!', 'error');
                }
                
                this.hideConfirmModal();
            }
        );
    }
    
    // Backend'den ürün silme
    async deleteProductFromBackend(id) {
        try {
            console.log('Backend\'den ürün siliniyor:', id);
            
            const response = await fetch(`${CONFIG.API_ENDPOINTS.products}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            console.log('Backend delete response status:', response.status);
            
            if (response.ok) {
                const result = await response.json();
                console.log('Ürün backend\'den silindi:', result);
                this.showToast('Ürün veritabanından silindi!', 'success');
                return true;
            } else {
                const errorData = await response.json().catch(() => null);
                console.error('Backend silme hatası:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorData: errorData
                });
                this.showToast(`Veritabanından silme hatası: ${response.status}`, 'error');
                return false;
            }
        } catch (error) {
            console.error('Backend bağlantı hatası:', error);
            this.showToast('Backend bağlantı hatası: ' + error.message, 'error');
            return false;
        }
    }
    
    resetForm() {
        // Sadece gerekli alanları sıfırla, selectedCategory'yi koru
        document.getElementById('productName').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productDescription').value = '';
        document.getElementById('productStock').value = '0';
        document.getElementById('editProductId').value = '';
        document.getElementById('submitBtnText').textContent = 'Ürün Ekle';
        
        // Resim input'larını temizle
        this.removeImage();
        
        // URL radio button'ını seç
        document.querySelector('input[name="imageInputType"][value="url"]').checked = true;
        this.toggleImageInputMode('url');
    }
    
    // Image Management
    setupImageInput() {
        const radioButtons = document.querySelectorAll('input[name="imageInputType"]');
        const urlInput = document.getElementById('productImage');
        const fileInput = document.getElementById('productImageFile');
        const selectFileBtn = document.getElementById('selectFileBtn');
        const selectedFileName = document.getElementById('selectedFileName');
        const removeImageBtn = document.getElementById('removeImageBtn');
        
        // Radio button değişiklikleri
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.toggleImageInputMode(e.target.value);
            });
        });
        
        // URL input değişiklikleri
        if (urlInput) {
            urlInput.addEventListener('input', (e) => {
                if (document.querySelector('input[name="imageInputType"]:checked').value === 'url') {
                    this.previewImage(e.target.value);
                }
            });
        }
        
        // File select button
        if (selectFileBtn) {
            selectFileBtn.addEventListener('click', () => {
                fileInput.click();
            });
        }
        
        // File input değişiklikleri
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileSelect(e.target.files[0]);
            });
        }
        
        // Remove image button
        if (removeImageBtn) {
            removeImageBtn.addEventListener('click', () => {
                this.removeImage();
            });
        }
        
        // Initial mode setup
        this.toggleImageInputMode('url');
    }
    
    toggleImageInputMode(mode) {
        const urlInput = document.getElementById('productImage');
        const selectFileBtn = document.getElementById('selectFileBtn');
        const selectedFileName = document.getElementById('selectedFileName');
        
        if (mode === 'url') {
            urlInput.style.display = 'block';
            selectFileBtn.style.display = 'none';
            selectedFileName.textContent = '';
        } else if (mode === 'file') {
            urlInput.style.display = 'none';
            selectFileBtn.style.display = 'flex';
        }
        
        // Clear previews when switching modes
        this.removeImage();
    }
    
    async handleFileSelect(file) {
        if (!file) return;
        
        // File validation
        if (!file.type.startsWith('image/')) {
            this.showToast('Lütfen geçerli bir resim dosyası seçin!', 'error');
            return;
        }
        
        // File size check (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            this.showToast('Dosya boyutu 5MB\'dan küçük olmalıdır!', 'error');
            return;
        }
        
        try {
            // Upload file to server
            const uploadedUrl = await this.uploadFile(file);
            
            // Update UI
            document.getElementById('selectedFileName').textContent = file.name;
            
            // Store uploaded URL in hidden URL input for form processing
            document.getElementById('productImage').value = uploadedUrl;
            
            // Show success message first
            this.showToast('Resim başarıyla yüklendi!', 'success');
            
            // Try to show preview (this might fail due to CORS, but that's OK)
            this.previewImage(uploadedUrl);
            
        } catch (error) {
            console.error('Dosya işleme hatası:', error);
            this.showToast('Resim yüklenemedi: ' + error.message, 'error');
        }
    }
    
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('image', file);
        
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Dosya yüklenemedi');
            }
            
            return `${CONFIG.API_BASE_URL}${data.data.url}`;
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }
    
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    
    removeImage() {
        const preview = document.getElementById('imagePreview');
        const urlInput = document.getElementById('productImage');
        const fileInput = document.getElementById('productImageFile');
        const selectedFileName = document.getElementById('selectedFileName');
        
        // Hide preview
        preview.style.display = 'none';
        
        // Clear inputs
        urlInput.value = '';
        fileInput.value = '';
        selectedFileName.textContent = '';
    }
    
    previewImage(url) {
        const img = document.getElementById('previewImg');
        const preview = document.getElementById('imagePreview');
        
        if (url && url.trim()) {
            img.src = url;
            preview.style.display = 'inline-block';
            img.onerror = () => {
                preview.style.display = 'none';
                // Preview hatası, dosya yükleme hatasından farklı - sessizce ignore et
            };
        } else {
            preview.style.display = 'none';
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

window.backToCategorySelection = function() {
    adminPanel.backToCategorySelection();
};

window.selectCategoryCard = function(categoryKey) {
    console.log('selectCategoryCard called with:', categoryKey);
    if (window.adminPanel && typeof window.adminPanel.selectCategory === 'function') {
        window.adminPanel.selectCategory(categoryKey);
    } else {
        console.error('AdminPanel not ready yet, retrying in 100ms...');
        setTimeout(() => {
            if (window.adminPanel && typeof window.adminPanel.selectCategory === 'function') {
                window.adminPanel.selectCategory(categoryKey);
            }
        }, 100);
    }
};

// Initialize admin panel when DOM is ready
let adminPanel;

function initializeAdminPanel() {
    adminPanel = new AdminPanel();
    window.adminPanel = adminPanel;
    console.log('AdminPanel initialized successfully');
}

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdminPanel);
} else {
    initializeAdminPanel();
}

export default AdminPanel; 