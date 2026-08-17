const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const MensajeContacto = sequelize.define(
    "MensajeContacto",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        email: {
            type: DataTypes.STRING(150),
            allowNull: false
        },

        mensaje: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        atendido: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "mensajes_contacto",
        timestamps: false
    }
);

module.exports = MensajeContacto;