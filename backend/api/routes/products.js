// Products API Routes - Protected with Authentication
const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const { Op } = require('sequelize');
const { verifyToken, verifyAdmin } = require('../../middleware/security');

// GET /api/products - Get all products
router.get('/', async (req, res) => {
    try {
        const { search, sort, limit = 50, offset = 0, brand, category } = req.query;
        
        let whereClause = {};
        let orderClause = [['createdAt', 'DESC']];
        
        // Search filter
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { brand: { [Op.like]: `%${search}%` } }
            ];
        }

        // Brand filter
        if (brand) {
            whereClause.brand = brand;
        }

        // Category filter
        if (category) {
            whereClause.category = category;
        }
        
        // Sort options
        if (sort) {
            switch (sort) {
                case 'price-low':
                    orderClause = [['price', 'ASC']];
                    break;
                case 'price-high':
                    orderClause = [['price', 'DESC']];
                    break;
                case 'name':
                    orderClause = [['name', 'ASC']];
                    break;
                case 'newest':
                    orderClause = [['createdAt', 'DESC']];
                    break;
                case 'oldest':
                    orderClause = [['createdAt', 'ASC']];
                    break;
            }
        }
        
        const products = await Product.findAll({
            where: whereClause,
            order: orderClause,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
        
        const totalCount = await Product.count({ where: whereClause });
        
        res.json({
            success: true,
            data: products,
            pagination: {
                total: totalCount,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: totalCount > (parseInt(offset) + parseInt(limit))
            }
        });
        
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            error: 'Ürünler getirilirken hata oluştu',
            message: error.message
        });
    }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await Product.findByPk(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Ürün bulunamadı'
            });
        }
        
        res.json({
            success: true,
            data: product
        });
        
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            error: 'Ürün getirilirken hata oluştu',
            message: error.message
        });
    }
});

// POST /api/products - Create new product (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const productData = req.body;
        
        // Validate required fields (price and stock are now optional)
        const requiredFields = ['name', 'category', 'description'];
        const missingFields = requiredFields.filter(field => !productData[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Eksik alanlar',
                missingFields
            });
        }
        
        // Set null for empty optional fields
        if (!productData.price || productData.price === '' || productData.price === 0) {
            productData.price = null;
        }
        if (!productData.stock || productData.stock === '' || productData.stock === 0) {
            productData.stock = null;
        }
        
        const product = await Product.create(productData);
        
        res.status(201).json({
            success: true,
            data: product,
            message: 'Ürün başarıyla oluşturuldu'
        });
        
    } catch (error) {
        console.error('Error creating product:', error);
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Doğrulama hatası',
                details: error.errors.map(e => ({
                    field: e.path,
                    message: e.message
                }))
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Ürün oluşturulurken hata oluştu',
            message: error.message
        });
    }
});

// PUT /api/products/:id - Update product (Admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const product = await Product.findByPk(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Ürün bulunamadı'
            });
        }
        
        // Set null for empty optional fields
        if (!updateData.price || updateData.price === '' || updateData.price === 0) {
            updateData.price = null;
        }
        if (!updateData.stock || updateData.stock === '' || updateData.stock === 0) {
            updateData.stock = null;
        }
        
        await product.update(updateData);
        
        res.json({
            success: true,
            data: product,
            message: 'Ürün başarıyla güncellendi'
        });
        
    } catch (error) {
        console.error('Error updating product:', error);
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Doğrulama hatası',
                details: error.errors.map(e => ({
                    field: e.path,
                    message: e.message
                }))
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Ürün güncellenirken hata oluştu',
            message: error.message
        });
    }
});

// DELETE /api/products/:id - Delete product (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await Product.findByPk(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Ürün bulunamadı'
            });
        }
        
        // Hard delete
        await product.destroy();
        
        res.json({
            success: true,
            message: 'Ürün başarıyla silindi'
        });
        
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            error: 'Ürün silinirken hata oluştu',
            message: error.message
        });
    }
});

// GET /api/products/categories - Get all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = Product.getCategories();
        
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

// GET /api/products/category/:category - Get products by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        
        const products = await Product.findByCategory(category);
        
        res.json({
            success: true,
            data: products,
            category: category,
            count: products.length
        });
        
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({
            success: false,
            error: 'Kategori ürünleri getirilirken hata oluştu',
            message: error.message
        });
    }
});

// GET /api/products/brand/:brand - Get products by brand
router.get('/brand/:brand', async (req, res) => {
    try {
        const { brand } = req.params;
        const products = await Product.findAll({
            where: { brand: { [Op.like]: `%${brand}%` } },
            order: [['createdAt', 'DESC']]
        });

        // Farklı büyük/küçük yazımlar için gruplanmış brand etiketi döndür
        const normalized = brand;
        res.json({
            success: true,
            data: products,
            brand: normalized,
            count: products.length
        });
    } catch (error) {
        console.error('Error fetching products by brand:', error);
        res.status(500).json({
            success: false,
            error: 'Marka ürünleri getirilirken hata oluştu',
            message: error.message
        });
    }
});

// GET /api/products/search/:query - Search products
router.get('/search/:query', async (req, res) => {
    try {
        const { query } = req.params;
        
        const products = await Product.search(query);
        
        res.json({
            success: true,
            data: products,
            query: query,
            count: products.length
        });
        
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({
            success: false,
            error: 'Ürün arama sırasında hata oluştu',
            message: error.message
        });
    }
});

module.exports = router; 