// Security Middleware - Advanced Security Features
const { RateLimiterMemory, RateLimiterRes } = require('rate-limiter-flexible');
const jwt = require('jsonwebtoken');

// ============================================
// 1. RATE LIMITING - Brute Force Protection
// ============================================

// Strict rate limiter for login attempts
const loginRateLimiter = new RateLimiterMemory({
    points: 5, // 5 attempts
    duration: 15 * 60, // per 15 minutes
    blockDuration: 30 * 60, // Block for 30 minutes after limit
});

// Severe rate limiter after multiple failures
const severeLoginRateLimiter = new RateLimiterMemory({
    points: 10, // 10 failed attempts
    duration: 60 * 60, // per 1 hour
    blockDuration: 24 * 60 * 60, // Block for 24 hours
});

// General API rate limiter
const apiRateLimiter = new RateLimiterMemory({
    points: 100, // 100 requests
    duration: 60, // per 1 minute
});

// ============================================
// 2. LOGIN ATTEMPT TRACKING
// ============================================

// In-memory store for login attempts (in production, use Redis or Database)
const loginAttempts = new Map();
const blockedIPs = new Map();

// Clean up old entries every hour
setInterval(() => {
    const now = Date.now();
    // Clean login attempts older than 24 hours
    for (const [key, value] of loginAttempts.entries()) {
        if (now - value.lastAttempt > 24 * 60 * 60 * 1000) {
            loginAttempts.delete(key);
        }
    }
    // Clean blocked IPs that have expired
    for (const [ip, blockData] of blockedIPs.entries()) {
        if (now > blockData.unblockTime) {
            blockedIPs.delete(ip);
        }
    }
}, 60 * 60 * 1000);

/**
 * Check if IP is blocked
 */
function isIPBlocked(ip) {
    const blockData = blockedIPs.get(ip);
    if (!blockData) return false;
    
    const now = Date.now();
    if (now > blockData.unblockTime) {
        blockedIPs.delete(ip);
        return false;
    }
    return true;
}

/**
 * Block an IP address
 */
function blockIP(ip, duration = 30 * 60 * 1000) {
    const now = Date.now();
    blockedIPs.set(ip, {
        blockedAt: now,
        unblockTime: now + duration,
        reason: 'Too many failed login attempts'
    });
}

/**
 * Track login attempt
 */
function trackLoginAttempt(ip, success) {
    const now = Date.now();
    const attempts = loginAttempts.get(ip) || {
        count: 0,
        firstAttempt: now,
        lastAttempt: now,
        successfulLogins: 0
    };
    
    if (success) {
        attempts.successfulLogins++;
        attempts.count = 0; // Reset failed attempts on success
    } else {
        attempts.count++;
    }
    
    attempts.lastAttempt = now;
    loginAttempts.set(ip, attempts);
    
    // Block IP after 10 failed attempts in 1 hour
    if (attempts.count >= 10) {
        blockIP(ip, 24 * 60 * 60 * 1000); // 24 hours block
        return { blocked: true, duration: 24 * 60 * 60 * 1000 };
    }
    
    // Block IP after 5 failed attempts in 15 minutes
    if (attempts.count >= 5 && (now - attempts.firstAttempt) < 15 * 60 * 1000) {
        blockIP(ip, 30 * 60 * 1000); // 30 minutes block
        return { blocked: true, duration: 30 * 60 * 1000 };
    }
    
    return { blocked: false, remainingAttempts: 5 - attempts.count };
}

/**
 * Get login attempts for an IP
 */
function getLoginAttempts(ip) {
    return loginAttempts.get(ip) || { count: 0, successfulLogins: 0 };
}

// ============================================
// 3. RATE LIMITING MIDDLEWARE
// ============================================

/**
 * Login rate limiting middleware
 */
const loginRateLimit = async (req, res, next) => {
    try {
        const ip = req.ip || req.connection.remoteAddress;
        
        // Check if IP is blocked
        if (isIPBlocked(ip)) {
            const blockData = blockedIPs.get(ip);
            const remainingTime = Math.ceil((blockData.unblockTime - Date.now()) / 1000 / 60);
            return res.status(429).json({
                success: false,
                error: 'IP adresiniz geçici olarak engellenmiştir',
                message: `Çok fazla başarısız giriş denemesi. ${remainingTime} dakika sonra tekrar deneyin.`,
                remainingMinutes: remainingTime
            });
        }
        
        try {
            // Try basic rate limiter first
            await loginRateLimiter.consume(ip);
            
            // Also check severe limiter
            await severeLoginRateLimiter.consume(ip);
            
            next();
        } catch (rateLimiterRes) {
            if (rateLimiterRes instanceof RateLimiterRes) {
                const secs = Math.ceil(rateLimiterRes.msBeforeNext / 1000);
                res.set('Retry-After', String(secs));
                return res.status(429).json({
                    success: false,
                    error: 'Çok fazla giriş denemesi',
                    message: `Lütfen ${Math.ceil(secs / 60)} dakika sonra tekrar deneyin.`,
                    retryAfter: secs
                });
            }
            throw rateLimiterRes;
        }
    } catch (error) {
        console.error('Rate limiter error:', error);
        next(); // Continue on error to avoid blocking legitimate users
    }
};

/**
 * General API rate limiting middleware
 */
const apiRateLimit = async (req, res, next) => {
    try {
        const ip = req.ip || req.connection.remoteAddress;
        await apiRateLimiter.consume(ip);
        next();
    } catch (rateLimiterRes) {
        if (rateLimiterRes instanceof RateLimiterRes) {
            res.set('Retry-After', String(Math.ceil(rateLimiterRes.msBeforeNext / 1000)));
            return res.status(429).json({
                success: false,
                error: 'Çok fazla istek',
                message: 'Lütfen daha sonra tekrar deneyin.'
            });
        }
        next(); // Continue on error
    }
};

// ============================================
// 4. JWT TOKEN VERIFICATION
// ============================================

/**
 * Verify JWT token middleware
 */
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Yetkilendirme token\'ı bulunamadı',
                message: 'Lütfen giriş yapın'
            });
        }
        
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const jwtSecret = process.env.JWT_SECRET || 'hakgida-secret-key';
        
        try {
            const decoded = jwt.verify(token, jwtSecret);
            req.user = decoded;
            next();
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    error: 'Token süresi doldu',
                    message: 'Lütfen tekrar giriş yapın'
                });
            } else if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    error: 'Geçersiz token',
                    message: 'Lütfen tekrar giriş yapın'
                });
            }
            throw jwtError;
        }
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(500).json({
            success: false,
            error: 'Token doğrulama hatası',
            message: 'Bir hata oluştu, lütfen tekrar deneyin'
        });
    }
};

/**
 * Verify admin role middleware
 */
const verifyAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Yetkisiz erişim',
            message: 'Bu işlem için admin yetkisi gereklidir'
        });
    }
    next();
};

// ============================================
// 5. SECURITY HEADERS MIDDLEWARE
// ============================================

/**
 * Additional security headers
 */
const securityHeaders = (req, res, next) => {
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // XSS Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions Policy
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    next();
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
    // Rate limiting
    loginRateLimit,
    apiRateLimit,
    
    // Login tracking
    trackLoginAttempt,
    getLoginAttempts,
    isIPBlocked,
    
    // Token verification
    verifyToken,
    verifyAdmin,
    
    // Security headers
    securityHeaders,
};

