// Category Model for PostgreSQL
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    key: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'Kategori anahtarı boş olamaz'
            },
            isLowercase: {
                msg: 'Kategori anahtarı küçük harf olmalıdır'
            }
        }
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Kategori adı boş olamaz'
            }
        }
    },
    icon: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'fas fa-tag'
    },
    color: {
        type: DataTypes.STRING(7),
        allowNull: true,
        defaultValue: '#666666',
        validate: {
            is: {
                args: /^#[0-9A-F]{6}$/i,
                msg: 'Renk hex formatında olmalıdır (#RRGGBB)'
            }
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'categories',
    timestamps: true,
    underscored: true
});

module.exports = Category; 