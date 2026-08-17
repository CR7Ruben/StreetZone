const express = require("express");

const {
    obtenerDetalles,
    obtenerDetallePorId,
    crearDetalle,
    actualizarDetalle,
    eliminarDetalle
} = require("../controllers/detallePedidoController");

const {
    verificarToken,
    verificarRol
} = require("../middleware.js/authMiddleware");

const router = express.Router();

// Cliente + Admin
router.get("/", verificarToken, obtenerDetalles);

router.get("/:id", verificarToken, obtenerDetallePorId);

router.post("/", verificarToken, crearDetalle);

// Admin solamente
router.put(
    "/:id",
    verificarToken,
    verificarRol("admin"),
    actualizarDetalle
);

router.delete(
    "/:id",
    verificarToken,
    verificarRol("admin"),
    eliminarDetalle
);

module.exports = router;