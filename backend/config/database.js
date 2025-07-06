// Database Configuration for Railway PostgreSQL
const { Sequelize } = require('sequelize');

// Database URL from Railway environment
const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_PRIVATE_URL;

// Fallback for local development
const LOCAL_DATABASE_URL = 'postgres://postgres:password@localhost:5432/hakgida_dev';

// Create Sequelize instance
let sequelize;

if (DATABASE_URL) {
    // Production/Railway database
    sequelize = new Sequelize(DATABASE_URL, {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        retry: {
            match: [
                /ConnectionError/,
                /ConnectionRefusedError/,
                /ConnectionTimedOutError/,
                /TimeoutError/,
                /SequelizeConnectionError/,
                /SequelizeConnectionRefusedError/,
                /SequelizeHostNotFoundError/,
                /SequelizeHostNotReachableError/,
                /SequelizeInvalidConnectionError/,
                /SequelizeConnectionTimedOutError/
            ],
            max: 3
        }
    });
} else {
    // Local development database
    console.log('⚠️ No DATABASE_URL found, using local database');
    sequelize = new Sequelize(LOCAL_DATABASE_URL, {
        logging: console.log,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
}

// Test database connection
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection has been established successfully');
        return true;
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error.message);
        return false;
    }
}

// Initialize database
async function initializeDatabase() {
    try {
        // Test connection
        const connected = await testConnection();
        if (!connected) {
            throw new Error('Database connection failed');
        }
        
        // Sync models
        await sequelize.sync({ 
            force: false, // Set to true only for development reset
            alter: process.env.NODE_ENV === 'development' // Auto-migrate in development
        });
        
        console.log('✅ Database models synchronized successfully');
        return true;
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        throw error;
    }
}

// Close database connection
async function closeConnection() {
    try {
        await sequelize.close();
        console.log('✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error closing database connection:', error.message);
    }
}

module.exports = {
    sequelize,
    testConnection,
    initializeDatabase,
    closeConnection,
    Sequelize
}; 