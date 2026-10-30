const { Sequelize } = require("sequelize");
require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error("❌ DATABASE_URL no está definida");
} else {
    try {
        const url = new URL(databaseUrl);

        console.log("🔎 Configuración de PostgreSQL:");
        console.log("Usuario:", url.username);
        console.log("Host:", url.hostname);
        console.log("Base de datos:", url.pathname);
        console.log("Contraseña configurada:", url.password ? "Sí" : "No");
    } catch (error) {
        console.error("❌ DATABASE_URL tiene un formato inválido");
    }
}

const sequelize = new Sequelize(databaseUrl, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

module.exports = sequelize;