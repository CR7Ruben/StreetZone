const express = require("express");

const {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require("../controllers/productoController");

const {
    verificarToken,
    verificarRol
} = require("../middleware.js/authMiddleware");

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Productos
 *   description: Operaciones relacionadas con los productos
 */

// ============================================
// GET /api/productos
// PÚBLICO
// ============================================

router.get(
    "/",
    obtenerProductos
);

// ============================================
// GET /api/productos/:id
// PÚBLICO
// ============================================

router.get(
    "/:id",
    obtenerProductoPorId
);

// ============================================
// POST /api/productos
// JWT + ADMIN
// ============================================

router.post(
    "/",
    verificarToken,
    verificarRol("admin"),
    crearProducto
);

// ============================================
// PUT /api/productos/:id
// JWT + ADMIN
// ============================================

router.put(
    "/:id",
    verificarToken,
    verificarRol("admin"),
    actualizarProducto
);

// ============================================
// DELETE /api/productos/:id
// JWT + ADMIN
// ============================================

router.delete(
    "/:id",
    verificarToken,
    verificarRol("admin"),
    eliminarProducto
);

module.exports = router;