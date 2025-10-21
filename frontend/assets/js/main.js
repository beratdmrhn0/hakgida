// Hakgida E-ticaret Sitesi - Ana JavaScript Dosyası
import { ProductManager } from './components/productManager.js';
import { CartManager } from './components/cartManager.js';
import { ModalManager } from './components/modalManager.js';

// Hero Carousel Class
class HeroCarousel {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;
        
        this.slides = this.container.querySelectorAll('.carousel-slide');
        this.indicators = this.container.querySelectorAll('.indicator');
        this.prevBtn = this.container.querySelector('.carousel-prev');
        this.nextBtn = this.container.querySelector('.carousel-next');
        this.progressBar = this.container.querySelector('.progress-bar');
        
        this.currentSlide = 0;
        this.isPlaying = true;
        this.interval = null;
        this.autoPlayDelay = 5000; // 5 saniye
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        this.setupEventListeners();
        this.startAutoPlay();
        this.showSlide(0);
    }
    
    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === ' ') {
                e.preventDefault();
                this.toggleAutoPlay();
            }
        });
        
        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.container.addEventListener('mouseleave', () => this.resumeAutoPlay());
        
        // Touch/Swipe support
        this.setupTouchEvents();
    }
    
    setupTouchEvents() {
        let startX = 0;
        let endX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Minimum 50px swipe
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }
    
    showSlide(index) {
        // Remove active class from all slides and indicators
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
        }
        if (this.indicators[index]) {
            this.indicators[index].classList.add('active');
        }
        
        this.currentSlide = index;
        this.resetProgressBar();
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }
    
    goToSlide(index) {
        this.showSlide(index);
        this.restartAutoPlay();
    }
    
    startAutoPlay() {
        if (!this.isPlaying) return;
        
        this.interval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
        
        this.startProgressBar();
    }
    
    pauseAutoPlay() {
        this.clearInterval();
        this.pauseProgressBar();
    }
    
    resumeAutoPlay() {
        if (this.isPlaying) {
            this.startAutoPlay();
        }
    }
    
    restartAutoPlay() {
        this.clearInterval();
        if (this.isPlaying) {
            this.startAutoPlay();
        }
    }
    
    toggleAutoPlay() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.startAutoPlay();
        } else {
            this.pauseAutoPlay();
        }
    }
    
    clearInterval() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    
    startProgressBar() {
        if (this.progressBar) {
            this.progressBar.classList.remove('active');
            setTimeout(() => {
                this.progressBar.classList.add('active');
                this.progressBar.style.animationDuration = `${this.autoPlayDelay}ms`;
            }, 50);
        }
    }
    
    resetProgressBar() {
        if (this.progressBar) {
            this.progressBar.classList.remove('active');
        }
    }
    
    pauseProgressBar() {
        if (this.progressBar) {
            this.progressBar.style.animationPlayState = 'paused';
        }
    }
    
    destroy() {
        this.clearInterval();
        // Remove event listeners if needed
    }
}

// Partnerships Carousel Class
class PartnershipsCarousel {
    constructor(containerSelector = '.partnerships-carousel') {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;
        
        this.track = this.container.querySelector('.partnerships-carousel-track');
        this.wrapper = this.container.querySelector('.partnerships-carousel-wrapper');
        this.partnerItems = this.container.querySelectorAll('.partner-item');
        
        this.currentIndex = 0;
        this.itemWidth = 0;
        this.totalItems = 0;
        this.isAnimating = false;
        
        // Drag functionality
        this.isDragging = false;
        this.startPos = { x: 0, y: 0 };
        this.currentPos = { x: 0, y: 0 };
        this.startTranslate = 0;
        this.currentTranslate = 0;
        this.dragThreshold = 10;
        
        // Wait for DOM to be ready
        setTimeout(() => {
            this.init();
        }, 100);
    }
    
    init() {
        if (!this.track || this.partnerItems.length === 0) return;
        
        this.calculateDimensions();
        this.setupEventListeners();
        this.setupDragEvents();
        this.setupPartnerClickHandlers();
        
        window.addEventListener('resize', () => {
            this.calculateDimensions();
        });
    }
    
    calculateDimensions() {
        if (this.partnerItems.length === 0) return;
        
        const firstItem = this.partnerItems[0];
        if (firstItem) {
            // Get the actual computed style values
            const itemStyle = window.getComputedStyle(firstItem);
            const itemMargin = parseInt(itemStyle.marginRight || 0);
            
            // Calculate single item width including margin
            this.itemWidth = firstItem.offsetWidth + itemMargin;
            
            // Total unique items (half because we have duplicates for seamless scrolling)
            this.totalItems = Math.floor(this.partnerItems.length / 2);
            
            // Ensure we have a valid item width
            if (this.itemWidth <= 0) {
                // Fallback calculation if offsetWidth is 0
                this.itemWidth = 140 + itemMargin; // Default item width from CSS
            }
        }
    }
    
    setupEventListeners() {
        // Hover controls for desktop auto-scroll pause
        this.container.addEventListener('mouseenter', () => this.pauseAnimation());
        this.container.addEventListener('mouseleave', () => this.resumeAnimation());
        
        // Enhanced touch and drag events for mobile
        this.setupTouchEvents();
        this.setupDragEvents();
    }
    
    goToNext() {
        if (this.isAnimating || this.itemWidth === 0) return;
        
        this.isAnimating = true;
        this.pauseAnimation();
        
        this.currentIndex++;
        
        // Calculate new position
        const newTranslate = -(this.currentIndex * this.itemWidth);
        
        // Apply transition
        if (this.track) {
            this.track.style.transition = 'transform 0.3s ease-out';
            this.track.style.transform = `translateX(${newTranslate}px)`;
        }
        
        // Reset to beginning if reached end
        if (this.currentIndex >= this.totalItems) {
            setTimeout(() => {
                if (this.track) {
                    this.track.style.transition = 'none';
                    this.currentIndex = 0;
                    this.track.style.transform = `translateX(0px)`;
                    
                    setTimeout(() => {
                        if (this.track) {
                            this.track.style.transition = 'transform 0.3s ease-out';
                        }
                    }, 50);
                }
            }, 300);
        }
        
        setTimeout(() => {
            this.isAnimating = false;
            this.resumeAnimation();
        }, 350);
    }
    
    goToPrev() {
        if (this.isAnimating || this.itemWidth === 0) return;
        
        this.isAnimating = true;
        this.pauseAnimation();
        
        this.currentIndex--;
        
        // If going before the beginning, jump to the end first
        if (this.currentIndex < 0) {
            this.track.style.transition = 'none';
            this.currentIndex = this.totalItems - 1;
            const jumpTranslate = -(this.totalItems * this.itemWidth);
            this.track.style.transform = `translateX(${jumpTranslate}px)`;
            
            setTimeout(() => {
                if (this.track) {
                    this.track.style.transition = 'transform 0.3s ease-out';
                    const newTranslate = -(this.currentIndex * this.itemWidth);
                    this.track.style.transform = `translateX(${newTranslate}px)`;
                }
            }, 50);
        } else {
            // Normal previous movement
            const newTranslate = -(this.currentIndex * this.itemWidth);
            if (this.track) {
                this.track.style.transition = 'transform 0.4s ease-out';
                this.track.style.transform = `translateX(${newTranslate}px)`;
            }
        }
        
        setTimeout(() => {
            this.isAnimating = false;
            this.resumeAnimation();
        }, 450);
    }
    
    setupDragEvents() {
        if (!this.wrapper) return;
        
        // Mouse events
        this.wrapper.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());
        
        // Touch events
        this.wrapper.addEventListener('touchstart', (e) => this.startDrag(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
        document.addEventListener('touchend', () => this.endDrag());
        
        // Prevent default drag behavior
        this.wrapper.addEventListener('dragstart', (e) => e.preventDefault());
        this.wrapper.addEventListener('selectstart', (e) => {
            if (this.isDragging) e.preventDefault();
        });
    }
    
    startDrag(e) {
        if (e.type === 'mousedown' && e.button !== 0) return;
        
        this.isDragging = true;
        this.pauseAnimation();
        
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        
        this.startPos = { x: clientX, y: clientY };
        this.currentPos = { x: clientX, y: clientY };
        this.startTranslate = -(this.currentIndex * this.itemWidth);
        this.currentTranslate = this.startTranslate;
        
        if (this.track) {
            this.track.style.transition = 'none';
        }
        if (this.wrapper) {
            this.wrapper.style.cursor = 'grabbing';
        }
        
        document.body.style.userSelect = 'none';
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        this.currentPos.x = clientX;
        
        const deltaX = this.currentPos.x - this.startPos.x;
        this.currentTranslate = this.startTranslate + deltaX;
        
        if (this.track) {
            this.track.style.transform = `translateX(${this.currentTranslate}px)`;
        }
    }
    
    endDrag() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        
        if (this.track) {
            this.track.style.transition = 'transform 0.4s ease-out';
        }
        if (this.wrapper) {
            this.wrapper.style.cursor = 'grab';
        }
        
        document.body.style.userSelect = '';
        
        const deltaX = this.currentPos.x - this.startPos.x;
        const dragDistance = Math.abs(deltaX);
        const threshold = 50;
        
        if (dragDistance > threshold) {
            if (deltaX > 0) {
                this.goToPrev();
            } else {
                this.goToNext();
            }
        } else {
            // Snap back to current position
            const snapTranslate = -(this.currentIndex * this.itemWidth);
            if (this.track) {
                this.track.style.transform = `translateX(${snapTranslate}px)`;
            }
        }
        
        setTimeout(() => {
            this.resumeAnimation();
        }, 500);
    }
    
    setupPartnerClickHandlers() {
        this.partnerItems.forEach((item) => {
            item.addEventListener('click', (e) => {
                const deltaX = Math.abs(this.currentPos.x - this.startPos.x);
                if (deltaX > this.dragThreshold) {
                    e.preventDefault();
                    return;
                }
                
                e.preventDefault();
                const brand = item.dataset.brand;
                const category = item.dataset.category;
                
                const params = new URLSearchParams();
                if (brand) params.set('brand', brand);
                if (category) params.set('category', category);
                window.location.href = `products.html?${params.toString()}`;
            });
        });
    }
    
    setupTouchEvents() {
        let startX = 0;
        let endX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.goToNext();
                } else {
                    this.goToPrev();
                }
            }
        }, { passive: true });
    }
    
    pauseAnimation() {
        if (this.track) {
            this.track.style.animationPlayState = 'paused';
        }
    }
    
    resumeAnimation() {
        if (this.track && !this.isDragging) {
            this.track.style.animationPlayState = 'running';
        }
    }
    
    destroy() {
        if (this.prevBtn) {
            this.prevBtn.removeEventListener('click', this.goToPrev);
        }
        if (this.nextBtn) {
            this.nextBtn.removeEventListener('click', this.goToNext);
        }
        document.removeEventListener('mousemove', this.drag);
        document.removeEventListener('mouseup', this.endDrag);
        document.removeEventListener('touchmove', this.drag);
        document.removeEventListener('touchend', this.endDrag);
        window.removeEventListener('resize', this.calculateDimensions);
    }
}

class HakgidaApp {
    constructor() {
        this.productManager = null;
        this.cartManager = null;
        this.modalManager = null;
        this.heroCarousel = null;
        this.partnershipsCarousel = null;
        
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
        
        // Hero Carousel başlatma (sadece ana sayfada)
        if (document.querySelector('.hero-carousel')) {
            this.heroCarousel = new HeroCarousel('.hero-carousel');
        }
        
        // Partnerships Carousel başlatma
        if (document.querySelector('.partnerships-carousel')) {
            this.partnershipsCarousel = new PartnershipsCarousel();
        }
        
        // Global referanslar
        window.productManager = this.productManager;
        window.cartManager = this.cartManager;
        window.modalManager = this.modalManager;
        window.heroCarousel = this.heroCarousel;
        window.partnershipsCarousel = this.partnershipsCarousel;
        
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