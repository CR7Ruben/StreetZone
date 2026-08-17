const express = require("express");

const {
    registrarUsuario,
    iniciarSesion,
    obtenerPerfil
} = require("../controllers/authController");

const {
    verificarToken
} = require("../middleware.js/authMiddleware");

const router = express.Router();

router.post("/registro", registrarUsuario);

router.post("/login", iniciarSesion);

router.get("/perfil", verificarToken, obtenerPerfil);

module.exports = router;