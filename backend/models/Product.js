// Product Model for PostgreSQL
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
            },
            len: {
                args: [2, 255],
                msg: 'Ürün adı 2-255 karakter arasında olmalıdır'
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
                args: [['caylar', 'baklagil', 'baharat', 'organik']],
                msg: 'Geçersiz kategori'
            }
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: 'Fiyat 0\'dan küçük olamaz'
            },
            isDecimal: {
                msg: 'Fiyat geçerli bir sayı olmalıdır'
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Açıklama boş olamaz'
            },
            len: {
                args: [10, 2000],
                msg: 'Açıklama 10-2000 karakter arasında olmalıdır'
            }
        }
    },
    features: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
        validate: {
            isValidFeatures(value) {
                if (value && value.length > 0) {
                    value.forEach(feature => {
                        if (typeof feature !== 'string' || feature.trim().length === 0) {
                            throw new Error('Özellikler boş olamaz');
                        }
                    });
                }
            }
        }
    },
    image: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
            isUrl: {
                msg: 'Geçerli bir URL giriniz'
            }
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: 'Stok 0\'dan küçük olamaz'
            },
            isInt: {
                msg: 'Stok tam sayı olmalıdır'
            }
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    slug: {
        type: DataTypes.STRING(300),
        allowNull: true,
        unique: true
    }
}, {
    tableName: 'products',
    timestamps: true, // createdAt, updatedAt
    underscored: true, // created_at, updated_at
    paranoid: true, // soft delete (deleted_at)
    hooks: {
        beforeCreate: (product, options) => {
            // Generate slug from name
            if (product.name && !product.slug) {
                product.slug = generateSlug(product.name);
            }
        },
        beforeUpdate: (product, options) => {
            // Update slug if name changed
            if (product.changed('name')) {
                product.slug = generateSlug(product.name);
            }
        }
    }
});

// Helper function to generate slug
function generateSlug(name) {
    return name
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// Instance methods
Product.prototype.toJSON = function() {
    const values = { ...this.get() };
    
    // Convert price to number
    if (values.price) {
        values.price = parseFloat(values.price);
    }
    
    // Ensure features is an array
    if (!values.features) {
        values.features = [];
    }
    
    // Add computed properties
    values.inStock = values.stock > 0;
    values.categoryName = getCategoryName(values.category);
    
    return values;
};

// Static methods
Product.getCategories = function() {
    return ['caylar', 'baklagil', 'baharat', 'organik'];
};

Product.findByCategory = function(category) {
    return this.findAll({
        where: { category, isActive: true },
        order: [['createdAt', 'DESC']]
    });
};

Product.search = function(query) {
    return this.findAll({
        where: {
            [sequelize.Sequelize.Op.and]: [
                { isActive: true },
                {
                    [sequelize.Sequelize.Op.or]: [
                        { name: { [sequelize.Sequelize.Op.iLike]: `%${query}%` } },
                        { description: { [sequelize.Sequelize.Op.iLike]: `%${query}%` } }
                    ]
                }
            ]
        },
        order: [['createdAt', 'DESC']]
    });
};

// Helper function for category names
function getCategoryName(category) {
    const categoryNames = {
        'caylar': 'Çaylar',
        'baklagil': 'Baklagil',
        'baharat': 'Baharat',
        'organik': 'Organik'
    };
    return categoryNames[category] || category;
}

module.exports = Product; 