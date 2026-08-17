const express = require("express");

const {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
} = require("../controllers/usuarioController");

const {
    verificarToken,
    verificarRol
} = require("../middleware.js/authMiddleware");

const router = express.Router();

// Solo administradores

router.get(
    "/",
    verificarToken,
    verificarRol("admin"),
    obtenerUsuarios
);

router.get(
    "/:id",
    verificarToken,
    verificarRol("admin"),
    obtenerUsuarioPorId
);

router.put(
    "/:id",
    verificarToken,
    verificarRol("admin"),
    actualizarUsuario
);

router.delete(
    "/:id",
    verificarToken,
    verificarRol("admin"),
    eliminarUsuario
);

module.exports = router;