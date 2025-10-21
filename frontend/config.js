// Frontend Configuration
const CONFIG = {
    // Environment detection
    isDevelopment: window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1',
    
    // API Base URLs
    get API_BASE_URL() {
        if (this.isDevelopment) {
            return 'http://localhost:3001';
        } else {
            // Production: Labina hosting için
            // DirectAdmin'de genellikle subdomain veya path-based API kullanılır
            return `${window.location.origin}/api`;
            // Alternative için subdomain: return `${window.location.protocol}//api.${window.location.hostname}`;
        }
    },
    
    // API Endpoints
    get API_ENDPOINTS() {
        return {
            products: `${this.API_BASE_URL}/api/products`,
            categories: `${this.API_BASE_URL}/api/categories`,
            admin: `${this.API_BASE_URL}/api/admin`,
            upload: `${this.API_BASE_URL}/api/upload`,
            health: `${this.API_BASE_URL}/health`
        };
    },
    
    // App Settings
    APP: {
        name: 'Hakgida',
        version: '1.0.0',
        adminPassword: 'hakgida2024'
    },
    
    // UI Settings
    UI: {
        itemsPerPage: 12,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    }
};

// Export for use in other files
window.CONFIG = CONFIG;