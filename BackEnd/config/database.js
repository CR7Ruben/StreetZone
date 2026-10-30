
const { Sequelize } = require("sequelize");
const crypto = require("crypto");
require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("❌ DATABASE_URL no está configurada.");
}

// Diagnóstico seguro: nunca muestra la contraseña ni la cadena completa.
try {
    const parsedUrl = new URL(databaseUrl);

    const fingerprint = crypto
        .createHash("sha256")
        .update(databaseUrl)
        .digest("hex")
        .slice(0, 12);

    console.log("🔎 Configuración de PostgreSQL:");
    console.log("Usuario:", decodeURIComponent(parsedUrl.username));
    console.log("Host:", parsedUrl.hostname);
    console.log("Base de datos:", parsedUrl.pathname);
    console.log("Contraseña configurada:", parsedUrl.password ? "Sí" : "No");
    console.log("🔐 DATABASE_URL fingerprint:", fingerprint);
} catch (error) {
    console.error("❌ DATABASE_URL tiene un formato inválido.");
    throw error;
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
