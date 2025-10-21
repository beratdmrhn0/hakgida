// Upload API Routes
const express = require('express');
const router = express.Router();
const multer = require('multer');

// Simple file upload (for development)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Sadece resim dosyaları yüklenebilir'));
        }
    }
});

// POST /api/upload - Upload image
router.post('/', (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({
                success: false,
                error: err.message || 'Dosya yüklenirken hata oluştu'
            });
        }
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Dosya yüklenmedi'
            });
        }
        
        const fileUrl = `/uploads/${req.file.filename}`;
        
        res.json({
            success: true,
            data: {
                url: fileUrl,
                filename: req.file.filename,
                originalname: req.file.originalname,
                size: req.file.size
            },
            message: 'Dosya başarıyla yüklendi'
        });
    });
});

module.exports = router; 