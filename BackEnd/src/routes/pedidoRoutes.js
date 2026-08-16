const express = require("express");

const {
    obtenerPedidos,
    obtenerPedidoPorId,
    crearPedido,
    actualizarPedido,
    eliminarPedido
} = require("../controllers/pedidoController");

const {
    verificarToken,
    verificarRol
} = require("../middleware/authMiddleware");

const router = express.Router();

// Cliente + Admin
router.get("/", verificarToken, obtenerPedidos);

router.get("/:id", verificarToken, obtenerPedidoPorId);

router.post("/", verificarToken, crearPedido);

// Solo Admin
router.put(
    "/:id",
    verificarToken,
    verificarRol("admin"),
    actualizarPedido
);

router.delete(
    "/:id",
    verificarToken,
    verificarRol("admin"),
    eliminarPedido
);

module.exports = router;