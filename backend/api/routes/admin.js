// Admin API Routes - Enhanced Security
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { 
    loginRateLimit, 
    trackLoginAttempt, 
    getLoginAttempts,
    verifyToken,
    verifyAdmin
} = require('../../middleware/security');

// ============================================
// PASSWORD HASHING UTILITY
// ============================================

/**
 * Hash password using bcrypt (for storing admin password securely)
 * Usage: Store this hash in environment variable instead of plain password
 */
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(12); // 12 rounds for strong security
    return await bcrypt.hash(password, salt);
}

/**
 * Verify password against hash
 */
async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

// ============================================
// PASSWORD STRENGTH VALIDATION
// ============================================

/**
 * Validate password strength
 * Requires: min 8 chars, uppercase, lowercase, number, special char
 */
function validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const errors = [];
    
    if (password.length < minLength) {
        errors.push(`Şifre en az ${minLength} karakter olmalıdır`);
    }
    if (!hasUpperCase) {
        errors.push('Şifre en az bir büyük harf içermelidir');
    }
    if (!hasLowerCase) {
        errors.push('Şifre en az bir küçük harf içermelidir');
    }
    if (!hasNumbers) {
        errors.push('Şifre en az bir rakam içermelidir');
    }
    if (!hasSpecialChar) {
        errors.push('Şifre en az bir özel karakter içermelidir (!@#$%^&*...)');
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        strength: errors.length === 0 ? 'strong' : errors.length <= 2 ? 'medium' : 'weak'
    };
}

// ============================================
// 2FA TOKEN GENERATION (Optional Feature)
// ============================================

// In-memory store for 2FA tokens (in production, use Redis)
const twoFactorTokens = new Map();

/**
 * Generate 6-digit 2FA code
 */
function generate2FACode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate and store 2FA token
 */
function create2FAToken(ip) {
    const code = generate2FACode();
    const token = crypto.randomBytes(32).toString('hex');
    
    twoFactorTokens.set(token, {
        code,
        ip,
        createdAt: Date.now(),
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
        verified: false
    });
    
    // Clean up after expiration
    setTimeout(() => {
        twoFactorTokens.delete(token);
    }, 5 * 60 * 1000);
    
    return { token, code };
}

/**
 * Verify 2FA code
 */
function verify2FACode(token, code) {
    const data = twoFactorTokens.get(token);
    
    if (!data) {
        return { valid: false, error: 'Geçersiz token' };
    }
    
    if (Date.now() > data.expiresAt) {
        twoFactorTokens.delete(token);
        return { valid: false, error: 'Token süresi doldu' };
    }
    
    if (data.code !== code) {
        return { valid: false, error: 'Yanlış kod' };
    }
    
    data.verified = true;
    return { valid: true };
}

// ============================================
// LOGIN ENDPOINT - Enhanced Security
// ============================================

/**
 * POST /api/admin/login - Secure admin login with rate limiting and tracking
 */
router.post('/login', loginRateLimit, async (req, res) => {
    try {
        const { password, twoFactorToken, twoFactorCode } = req.body;
        const ip = req.ip || req.connection.remoteAddress;
        
        // Input validation
        if (!password || password.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Şifre gereklidir',
                message: 'Lütfen şifrenizi girin'
            });
        }
        
        // Get admin password (can be plain or hashed)
        const adminPassword = process.env.ADMIN_PASSWORD || 'hakgida2024';
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
        
        let isPasswordValid = false;
        
        // Check if password matches (support both plain and hashed)
        if (adminPasswordHash) {
            // Use bcrypt comparison for hashed password
            isPasswordValid = await verifyPassword(password, adminPasswordHash);
        } else {
            // Fallback to plain comparison (not recommended for production)
            isPasswordValid = password === adminPassword;
        }
        
        // Track failed attempt
        if (!isPasswordValid) {
            const attemptResult = trackLoginAttempt(ip, false);
            
            const attempts = getLoginAttempts(ip);
            const remainingAttempts = Math.max(0, 5 - attempts.count);
            
            // Log failed attempt
            console.warn(`Failed login attempt from IP: ${ip}, Remaining attempts: ${remainingAttempts}`);
            
            return res.status(401).json({
                success: false,
                error: 'Yanlış şifre',
                message: `Geçersiz şifre. Kalan deneme: ${remainingAttempts}`,
                remainingAttempts,
                blocked: attemptResult.blocked
            });
        }
        
        // Check if 2FA is enabled (optional feature)
        const twoFactorEnabled = process.env.TWO_FACTOR_ENABLED === 'true';
        
        if (twoFactorEnabled) {
            // If 2FA token not provided, generate one
            if (!twoFactorToken) {
                const { token, code } = create2FAToken(ip);
                
                // In production, send this code via email/SMS
                console.log(`[2FA] Code for IP ${ip}: ${code}`);
                
                return res.json({
                    success: false,
                    requiresTwoFactor: true,
                    twoFactorToken: token,
                    message: '2FA kodu gerekli. Kod konsola yazıldı (production\'da email/SMS ile gönderilir).',
                    // DO NOT send code in production, only for development
                    devCode: process.env.NODE_ENV === 'development' ? code : undefined
                });
            }
            
            // Verify 2FA code if provided
            if (!twoFactorCode) {
                return res.status(400).json({
                    success: false,
                    error: '2FA kodu gerekli',
                    message: 'Lütfen doğrulama kodunu girin'
                });
            }
            
            const verification = verify2FACode(twoFactorToken, twoFactorCode);
            if (!verification.valid) {
                return res.status(401).json({
                    success: false,
                    error: verification.error,
                    message: 'Doğrulama başarısız'
                });
            }
            
            // Clean up used token
            twoFactorTokens.delete(twoFactorToken);
        }
        
        // Track successful attempt
        trackLoginAttempt(ip, true);
        
        // Generate secure JWT token
        const jwtSecret = process.env.JWT_SECRET || 'hakgida-secret-key';
        const token = jwt.sign(
            { 
                role: 'admin',
                ip: ip, // Bind token to IP for additional security
                loginTime: Date.now()
            },
            jwtSecret,
            { 
                expiresIn: '8h', // Shorter expiration for better security (changed from 24h)
                algorithm: 'HS256'
            }
        );
        
        // Log successful login
        console.log(`Successful admin login from IP: ${ip} at ${new Date().toISOString()}`);
        
        res.json({
            success: true,
            token,
            message: 'Admin girişi başarılı',
            expiresIn: '8h',
            loginTime: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error in admin login:', error);
        res.status(500).json({
            success: false,
            error: 'Giriş sırasında hata oluştu',
            message: error.message
        });
    }
});

// ============================================
// CHANGE PASSWORD ENDPOINT
// ============================================

/**
 * POST /api/admin/change-password - Change admin password
 * Requires authentication
 */
router.post('/change-password', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Mevcut şifre ve yeni şifre gereklidir'
            });
        }
        
        // Validate new password strength
        const validation = validatePasswordStrength(newPassword);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                error: 'Şifre güvenlik gereksinimlerini karşılamıyor',
                details: validation.errors
            });
        }
        
        // Verify current password
        const adminPassword = process.env.ADMIN_PASSWORD || 'hakgida2024';
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
        
        let isCurrentPasswordValid = false;
        if (adminPasswordHash) {
            isCurrentPasswordValid = await verifyPassword(currentPassword, adminPasswordHash);
        } else {
            isCurrentPasswordValid = currentPassword === adminPassword;
        }
        
        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Mevcut şifre yanlış'
            });
        }
        
        // Generate new password hash
        const newPasswordHash = await hashPassword(newPassword);
        
        // In production, save this to database
        // For now, return the hash to be set in environment variable
        res.json({
            success: true,
            message: 'Şifre başarıyla değiştirildi',
            newPasswordHash,
            instruction: 'Bu hash değerini ADMIN_PASSWORD_HASH environment variable\'ına kaydedin'
        });
        
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({
            success: false,
            error: 'Şifre değiştirme sırasında hata oluştu',
            message: error.message
        });
    }
});

// ============================================
// SECURITY INFO ENDPOINT
// ============================================

/**
 * GET /api/admin/security-info - Get security information and recommendations
 * Requires authentication
 */
router.get('/security-info', verifyToken, verifyAdmin, (req, res) => {
    const hasHashedPassword = !!process.env.ADMIN_PASSWORD_HASH;
    const hasTwoFactor = process.env.TWO_FACTOR_ENABLED === 'true';
    const hasStrongJwtSecret = process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32;
    
    const securityScore = (hasHashedPassword ? 33 : 0) + 
                         (hasTwoFactor ? 33 : 0) + 
                         (hasStrongJwtSecret ? 34 : 0);
    
    const recommendations = [];
    
    if (!hasHashedPassword) {
        recommendations.push('ADMIN_PASSWORD_HASH kullanarak şifreyi hash\'lenmiş olarak saklayın');
    }
    if (!hasTwoFactor) {
        recommendations.push('2FA (Two-Factor Authentication) özelliğini etkinleştirin');
    }
    if (!hasStrongJwtSecret) {
        recommendations.push('En az 32 karakter uzunluğunda güçlü bir JWT_SECRET kullanın');
    }
    
    res.json({
        success: true,
        securityScore,
        level: securityScore >= 80 ? 'Yüksek' : securityScore >= 50 ? 'Orta' : 'Düşük',
        features: {
            hashedPassword: hasHashedPassword,
            twoFactorAuth: hasTwoFactor,
            strongJwtSecret: hasStrongJwtSecret,
            rateLimiting: true,
            loginTracking: true,
            ipBlocking: true
        },
        recommendations
    });
});

// ============================================
// ADMIN STATISTICS
// ============================================

/**
 * GET /api/admin/stats - Admin statistics
 * Requires authentication
 */
router.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const Product = require('../../models/Product');
        
        const totalProducts = await Product.count();
        const activeProducts = totalProducts; // Tüm ürünler aktif sayılıyor (isActive kolonu yok)
        const inactiveProducts = 0;
        
        const categoryStats = await Product.findAll({
            attributes: [
                'category',
                [Product.sequelize.fn('count', Product.sequelize.col('category')), 'count']
            ],
            group: ['category'],
            raw: true
        });
        
        res.json({
            success: true,
            data: {
                totalProducts,
                activeProducts,
                inactiveProducts,
                categoryStats
            }
        });
        
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({
            success: false,
            error: 'İstatistikler getirilirken hata oluştu',
            message: error.message
        });
    }
});

module.exports = router; 