// Product Model - Admin Panel Alanlarına Göre
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Ürün adı boş olamaz'
            }
        }
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Kategori boş olamaz'
            },
            isIn: {
                args: [['caylar', 'baklagil', 'bakliyat', 'bulgur', 'baharat', 'salca', 'makarna', 'seker', 'yag', 'icecek', 'organik', 'kuruyemis']],
                msg: 'Geçersiz kategori'
            }
        }
    },
    brand: {
        type: DataTypes.STRING(100),
        allowNull: true, // Geriye dönük uyumluluk için opsiyonel bırakıyoruz
        validate: {
            len: {
                args: [0, 100],
                msg: 'Marka adı 100 karakteri geçemez'
            }
        }
    },
    type: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
            len: {
                args: [0, 100],
                msg: 'Ürün türü 100 karakteri geçemez'
            }
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: 'Fiyat 0\'dan küçük olamaz'
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Açıklama boş olamaz'
            }
        }
    },
    image: {
        type: DataTypes.TEXT, // Base64 string'ler uzun olabileceği için TEXT kullan
        allowNull: true,
        defaultValue: null,
        validate: {
            isValidImage(value) {
                if (value && value.trim()) {
                    // URL veya base64 string kontrolü
                    const isUrl = /^https?:\/\/.+/.test(value);
                    const isBase64 = /^data:image\/.+;base64,/.test(value);
                    
                    if (!isUrl && !isBase64) {
                        throw new Error('Geçerli bir URL veya resim dosyası olmalıdır');
                    }
                }
            }
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: 'Stok 0\'dan küçük olamaz'
            }
        }
    }
}, {
    tableName: 'products',
    timestamps: true, // createdAt, updatedAt
    underscored: true  // created_at, updated_at
});

// Instance methods
Product.prototype.toJSON = function() {
    const values = { ...this.get() };
    
    // Convert price to number
    if (values.price) {
        values.price = parseFloat(values.price);
    }
    
    return values;
};

// Static methods
Product.getCategories = function() {
    return [
        { key: 'caylar', name: 'Çaylar', icon: '🍃' },
        { key: 'baklagil', name: 'Baklagil', icon: '🫘' },
        { key: 'baharat', name: 'Baharat', icon: '🌶️' },
        { key: 'organik', name: 'Organik', icon: '🌱' },
        { key: 'kuruyemis', name: 'Kuruyemiş', icon: '🥜' }
    ];
};

Product.findByCategory = function(category) {
    return this.findAll({
        where: { category },
        order: [['createdAt', 'DESC']]
    });
};

Product.search = function(query) {
    return this.findAll({
        where: {
            [sequelize.Sequelize.Op.or]: [
                { name: { [sequelize.Sequelize.Op.like]: `%${query}%` } },
                { description: { [sequelize.Sequelize.Op.like]: `%${query}%` } },
                { brand: { [sequelize.Sequelize.Op.like]: `%${query}%` } }
            ]
        },
        order: [['createdAt', 'DESC']]
    });
};

module.exports = Product; 