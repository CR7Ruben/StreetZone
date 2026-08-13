const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const productoRoutes = require("./src/routes/productoRoutes");
const categoriaRoutes = require("./src/routes/categoriaRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use("/api/productos", productoRoutes);
app.use("/api/categorias", categoriaRoutes);

app.get("/", (req, res) => {
    res.json({
        mensaje: "API de StreetZone funcionando 🚀"
    });
});

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        await sequelize.authenticate();

        console.log("✅ Conexión con PostgreSQL establecida correctamente");

        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
            console.log(`📚 Swagger disponible en http://localhost:${PORT}/api-docs`);
        });

    } catch (error) {
        console.error("❌ Error al conectar con PostgreSQL:");
        console.error(error.message);
    }
}

iniciarServidor();