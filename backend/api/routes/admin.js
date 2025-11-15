// Admin API Routes
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// POST /api/admin/login - Admin login
router.post('/login', async (req, res) => {
    try {
        const { password } = req.body;
        
        // Simple password check (in production, use database)
        const adminPassword = process.env.ADMIN_PASSWORD || 'hakgida2024';
        
        if (password !== adminPassword) {
            return res.status(401).json({
                success: false,
                error: 'Yanlış şifre'
            });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { role: 'admin' },
            process.env.JWT_SECRET || 'hakgida-secret-key',
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            token,
            message: 'Admin girişi başarılı'
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

// GET /api/admin/stats - Admin statistics
router.get('/stats', async (req, res) => {
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