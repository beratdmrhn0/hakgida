// Hakgida E-ticaret Sitesi - Ana JavaScript Dosyası
import { ProductManager } from './components/productManager.js';
import { CartManager } from './components/cartManager.js';
import { ModalManager } from './components/modalManager.js';

class HakgidaApp {
    constructor() {
        this.productManager = null;
        this.cartManager = null;
        this.modalManager = null;
        
        this.init();
    }

    async init() {
        // DOM hazır olana kadar bekle
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        // Component'leri başlatma
        this.productManager = new ProductManager();
        this.cartManager = new CartManager();
        this.modalManager = new ModalManager();
        
        // Global referanslar
        window.productManager = this.productManager;
        window.cartManager = this.cartManager;
        window.modalManager = this.modalManager;
        
        // Diğer event'leri başlatma
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupFormHandling();
        this.setupGlobalFunctions();
        
        // Loading animasyonu
        this.handlePageLoad();
        
        console.log('Hakgida E-ticaret sitesi yüklendi! 🛒');
    }

    setupNavigation() {
        // Mobile menu toggle
        const mobileMenu = document.getElementById('mobile-menu');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileMenu && navMenu) {
            mobileMenu.addEventListener('click', () => {
                mobileMenu.classList.toggle('is-active');
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu) mobileMenu.classList.remove('is-active');
                if (navMenu) navMenu.classList.remove('active');
            });
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupScrollEffects() {
        // Navbar scroll effect
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (!navbar) return;
            
            const currentScrollY = window.scrollY;
            
            // Scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            // Background blur effect
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        });

        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const hero = document.querySelector('.hero');
            if (hero) {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.3;
                hero.style.transform = `translateY(${rate}px)`;
            }
        });

        // Scroll animations
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.product-card, .stat-item, .contact-item, .about-content, .hero-content').forEach(el => {
            observer.observe(el);
        });
    }

    setupFormHandling() {
        // Contact form
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(contactForm);
                const name = formData.get('name');
                const email = formData.get('email');
                const subject = formData.get('subject');
                const message = formData.get('message');
                
                // Validation
                if (!name || !email || !subject || !message) {
                    this.showNotification('Lütfen tüm alanları doldurun.', 'error');
                    return;
                }
                
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    this.showNotification('Lütfen geçerli bir e-posta adresi girin.', 'error');
                    return;
                }
                
                // Success
                this.showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size geri dönüş yapacağız.', 'success');
                contactForm.reset();
            });
        }
    }

    setupGlobalFunctions() {
        // Global filter function for footer links
        window.filterProducts = (category) => {
            if (this.productManager) {
                this.productManager.filterByCategory(category);
            }
        };

        // Global quantity change function
        window.changeQuantity = (change) => {
            const quantityInput = document.getElementById('quantity');
            if (!quantityInput) return;
            
            let currentQuantity = parseInt(quantityInput.value);
            let newQuantity = currentQuantity + change;
            
            if (newQuantity < 1) newQuantity = 1;
            if (newQuantity > 10) newQuantity = 10;
            
            quantityInput.value = newQuantity;
        };
    }

    handlePageLoad() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            // Hide any loading indicators
            const loadingElements = document.querySelectorAll('.loading');
            loadingElements.forEach(el => el.style.display = 'none');
        });
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 5px;
            color: white;
            z-index: 9999;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        
        // Type-specific styling
        switch(type) {
            case 'success':
                notification.style.background = 'var(--primary-color)';
                break;
            case 'error':
                notification.style.background = 'var(--secondary-color)';
                break;
            default:
                notification.style.background = 'var(--dark-text)';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Auto remove
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Utility functions
    static formatPrice(price) {
        return `${price.toFixed(2)} TL`;
    }

    static formatDate(date) {
        return new Intl.DateTimeFormat('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    static debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
}

// CSS Animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app
new HakgidaApp(); 