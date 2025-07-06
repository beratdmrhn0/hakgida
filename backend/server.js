// Hakgida Backend Server - Cloud Deployment Ready
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { sequelize } = require('./config/database');

// Import routes
const productRoutes = require('./api/routes/products');
const categoryRoutes = require('./api/routes/categories');
const adminRoutes = require('./api/routes/admin');
const uploadRoutes = require('./api/routes/upload');

// Initialize Express app
const app = express();

// Trust proxy for Railway
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false
}));

// Compression middleware
app.use(compression());

// CORS configuration
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5000',
        'http://127.0.0.1:3000',
        'https://hakgida.com',
        'https://www.hakgida.com',
        'https://hakgida.vercel.app',
        /\.vercel\.app$/,
        /\.railway\.app$/
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0'
    });
});

// API routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Hakgida Backend API',
        version: '1.0.0',
        status: 'Running',
        endpoints: {
            health: '/health',
            products: '/api/products',
            categories: '/api/categories',
            admin: '/api/admin',
            upload: '/api/upload'
        },
        documentation: 'https://github.com/beratdmrhn0/hakgida'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `${req.method} ${req.originalUrl} is not a valid endpoint`,
        availableEndpoints: [
            'GET /',
            'GET /health',
            'GET /api/products',
            'POST /api/products',
            'GET /api/categories',
            'POST /api/admin/login'
        ]
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Error:', error);
    
    // Sequelize errors
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: error.errors.map(e => e.message).join(', ')
        });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            error: 'Conflict',
            message: 'Resource already exists'
        });
    }
    
    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid token'
        });
    }
    
    // Default error
    res.status(error.status || 500).json({
        error: error.name || 'Internal Server Error',
        message: error.message || 'Something went wrong',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

// Get port from environment
const PORT = process.env.PORT || 3001;

// Database connection and server startup
async function startServer() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully');
        
        // Sync database models
        await sequelize.sync({ force: false, alter: true });
        console.log('✅ Database models synchronized');
        
        // Start server
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Hakgida Backend Server running on port ${PORT}`);
            console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📊 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Local'}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
            console.log(`📚 API docs: http://localhost:${PORT}/`);
        });
        
        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received, shutting down gracefully');
            server.close(() => {
                console.log('HTTP server closed');
                sequelize.close();
                process.exit(0);
            });
        });
        
    } catch (error) {
        console.error('❌ Unable to start server:', error);
        process.exit(1);
    }
}

// Start the server
if (require.main === module) {
    startServer();
}

module.exports = app; 