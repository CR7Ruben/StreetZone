const express = require("express");

const {
    obtenerOfertas,
    obtenerOfertaPorId,
    crearOferta,
    actualizarOferta,
    eliminarOferta
} = require("../controllers/ofertaController");

const {
    verificarToken,
    verificarRol
} = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================
// GET /api/ofertas
// Público
// ============================================

router.get("/", obtenerOfertas);

// ============================================
// GET /api/ofertas/:id
// Público
// ============================================

router.get("/:id", obtenerOfertaPorId);

// ============================================
// POST /api/ofertas
// JWT + ADMIN
// ============================================

router.post(
    "/",
    verificarToken,
    verificarRol("admin"),
    crearOferta
);

// ============================================
// PUT /api/ofertas/:id
// JWT + ADMIN
// ============================================

router.put(
    "/:id",
    verificarToken,
    verificarRol("admin"),
    actualizarOferta
);

// ============================================
// DELETE /api/ofertas/:id
// JWT + ADMIN
// ============================================

router.delete(
    "/:id",
    verificarToken,
    verificarRol("admin"),
    eliminarOferta
);

module.exports = router;