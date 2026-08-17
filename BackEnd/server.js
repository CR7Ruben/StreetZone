const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const sequelize = require("./config/database");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const productoRoutes = require("./src/routes/productoRoutes");
const categoriaRoutes = require("./src/routes/categoriaRoutes");
const usuarioRoutes = require("./src/routes/usuarioRoutes");
const ofertaRoutes = require("./src/routes/ofertaRoutes");
const pedidoRoutes = require("./src/routes/pedidoRoutes");
const detallePedidoRoutes = require("./src/routes/detallePedidoRoutes");
const authRoutes = require("./src/routes/authRoutes");
const pagoRoutes = require("./src/routes/pagoRoutes");
const mensajeContactoRoutes = require("./src/routes/mensajeContactoRoutes");

const app = express();

app.use(cors());

app.use(express.static(
    path.join(__dirname, "../FrontEnd")
));

// Rutas de pago
app.use("/api/pagos", pagoRoutes);

// JSON para las demás rutas
app.use(express.json());

// Swagger
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
            persistAuthorization: true
        }
    })
);

app.get("/api-docs.json", (req, res) => {
    res.json(swaggerSpec);
});

// Rutas
app.use("/api/productos", productoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/ofertas", ofertaRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/detalle-pedidos", detallePedidoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/mensajes-contacto", mensajeContactoRoutes);

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../FrontEnd/index.html")
    );
});

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {

    try {

        await sequelize.authenticate();

        console.log(
            "✅ Conexión con PostgreSQL establecida correctamente"
        );

        app.listen(PORT, () => {

            console.log(
                `🚀 Servidor ejecutándose en http://localhost:${PORT}`
            );

            console.log(
                `📚 Swagger disponible en http://localhost:${PORT}/api-docs`
            );

        });

    } catch (error) {

        console.error(
            "❌ Error al conectar con PostgreSQL:"
        );

        console.error(error.message);

    }

}

iniciarServidor();