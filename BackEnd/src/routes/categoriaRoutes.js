const express = require("express");

const {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
} = require("../controllers/categoriaController");

const {
    verificarToken,
    verificarRol
} = require("../middleware.js/authMiddleware");

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Categorías
 *   description: Operaciones relacionadas con las categorías
 */

// ============================================
// GET /api/categorias
// PÚBLICO
// ============================================

router.get(
    "/",
    obtenerCategorias
);

// ============================================
// GET /api/categorias/:id
// PÚBLICO
// ============================================

router.get(
    "/:id",
    obtenerCategoriaPorId
);

// ============================================
// POST /api/categorias
// JWT + ADMIN
// ============================================

router.post(
    "/",
    verificarToken,
    verificarRol("admin"),
    crearCategoria
);

// ============================================
// PUT /api/categorias/:id
// JWT + ADMIN
// ============================================

router.put(
    "/:id",
    verificarToken,
    verificarRol("admin"),
    actualizarCategoria
);

// ============================================
// DELETE /api/categorias/:id
// JWT + ADMIN
// ============================================

router.delete(
    "/:id",
    verificarToken,
    verificarRol("admin"),
    eliminarCategoria
);

module.exports = router;