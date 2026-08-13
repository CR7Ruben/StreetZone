const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Usuario = sequelize.define(
    "Usuario",
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
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },

        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        rol: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "cliente"
        },

        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },

        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },

        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "usuarios",
        timestamps: false
    }
);

module.exports = Usuario;