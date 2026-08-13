const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Pedido = sequelize.define(
    "Pedido",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        estado: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "pendiente"
        },

        estado_pago: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "pendiente"
        },

        stripe_payment_intent_id: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        stripe_checkout_session_id: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        fecha_pedido: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },

        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "pedidos",
        timestamps: false
    }
);

module.exports = Pedido;