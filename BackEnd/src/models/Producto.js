const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Producto = sequelize.define(
    'Producto',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        nombre: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        precio: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },

        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

        imagen: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },

        categoria_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },

        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },

        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'productos',
        timestamps: false,
    }
);

module.exports = Producto;