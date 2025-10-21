// Categories API Routes
const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');

// GET /api/categories - Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: { isActive: true },
            order: [['name', 'ASC']]
        });
        
        res.json({
            success: true,
            data: categories
        });
        
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            error: 'Kategoriler getirilirken hata oluştu',
            message: error.message
        });
    }
});

// POST /api/categories - Create new category
router.post('/', async (req, res) => {
    try {
        const categoryData = req.body;
        
        const category = await Category.create(categoryData);
        
        res.status(201).json({
            success: true,
            data: category,
            message: 'Kategori başarıyla oluşturuldu'
        });
        
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            success: false,
            error: 'Kategori oluşturulurken hata oluştu',
            message: error.message
        });
    }
});

module.exports = router; 