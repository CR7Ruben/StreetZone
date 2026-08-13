const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Oferta = sequelize.define(
    "Oferta",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        producto_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        precio_oferta: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        descuento: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },

        fecha_inicio: {
            type: DataTypes.DATE,
            allowNull: false
        },

        fecha_fin: {
            type: DataTypes.DATE,
            allowNull: true
        },

        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },

        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "ofertas",
        timestamps: false
    }
);

module.exports = Oferta;