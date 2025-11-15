// Database Configuration for MySQL/SQLite
const { Sequelize } = require('sequelize');

// Database URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

// Fallback for local development
const LOCAL_DATABASE_URL = 'mysql://root:@localhost:3306/hakgida_dev';

// Create Sequelize instance
let sequelize;

if (DATABASE_URL) {
    // Check if it's SQLite
    if (DATABASE_URL.startsWith('sqlite:')) {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: DATABASE_URL.replace('sqlite:', ''),
            logging: process.env.NODE_ENV === 'development' ? console.log : false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });
    } else {
        // Check if it's a production/cloud database (has cloud provider domain)
        const isCloudDatabase = DATABASE_URL.includes('railway.app') || 
                                DATABASE_URL.includes('render.com') || 
                                DATABASE_URL.includes('planetscale.com') ||
                                DATABASE_URL.includes('amazonaws.com') ||
                                !DATABASE_URL.includes('localhost');
        
        // Check if it's cPanel hosting
        const isCpanelDatabase = DATABASE_URL.includes('localhost') || 
                                DATABASE_URL.includes(process.env.CPANEL_HOST) ||
                                DATABASE_URL.includes('mysql') && !isCloudDatabase;
        
        if (isCloudDatabase && !isCpanelDatabase) {
            // Production/Cloud database with SSL
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
            // Local database (localhost) or cPanel without SSL
            sequelize = new Sequelize(DATABASE_URL, {
                dialectOptions: {
                    ssl: false,
                    // cPanel specific settings
                    connectTimeout: 60000,
                    acquireTimeout: 60000,
                    timeout: 60000
                },
                logging: process.env.NODE_ENV === 'development' ? console.log : false,
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            });
        }
    }
} else {
    // Fallback local development database
    console.log('⚠️ No DATABASE_URL found, using local database');
    sequelize = new Sequelize(LOCAL_DATABASE_URL, {
        dialectOptions: {
            ssl: false
        },
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