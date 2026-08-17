const express = require("express");

const {
    obtenerPedidos,
    obtenerPedidoPorId,
    crearPedido,
    crearPedidoCompleto,
    actualizarPedido,
    eliminarPedido
} = require("../controllers/pedidoController");

const {
    verificarToken,
    verificarRol
} = require("../middleware.js/authMiddleware");

const router = express.Router();


// ============================================================
// OBTENER TODOS LOS PEDIDOS
// CLIENTE → solamente sus pedidos
// ADMIN   → todos los pedidos
// ============================================================

router.get(
    "/",
    verificarToken,
    obtenerPedidos
);


// ============================================================
// OBTENER PEDIDO POR ID
// CLIENTE → solamente si es suyo
// ADMIN   → cualquiera
// ============================================================

router.get(
    "/:id",
    verificarToken,
    obtenerPedidoPorId
);


// ============================================================
// CREAR PEDIDO COMPLETO
//
// CREA EN UNA SOLA TRANSACCIÓN:
//
// pedido
// detalles
// cálculo del total
// descuento de stock
//
// CLIENTE + ADMIN
// ============================================================

router.post(
    "/completo",
    verificarToken,
    crearPedidoCompleto
);


// ============================================================
// CREAR PEDIDO SIMPLE
// Opcional / compatibilidad
// ============================================================

router.post(
    "/",
    verificarToken,
    crearPedido
);


// ============================================================
// ACTUALIZAR PEDIDO
// SOLO ADMIN
// ============================================================

router.put(
    "/:id",
    verificarToken,
    verificarRol("admin"),
    actualizarPedido
);


// ============================================================
// ELIMINAR PEDIDO
// SOLO ADMIN
// ============================================================

router.delete(
    "/:id",
    verificarToken,
    verificarRol("admin"),
    eliminarPedido
);


module.exports = router;