const express = require("express");

const {
    obtenerMensajes,
    obtenerMensajePorId,
    crearMensaje,
    actualizarMensaje,
    eliminarMensaje
} = require("../controllers/mensajeContactoController");

const router = express.Router();

// Obtener todos los mensajes
router.get("/", obtenerMensajes);

// Obtener un mensaje por ID
router.get("/:id", obtenerMensajePorId);

// Crear un mensaje
router.post("/", crearMensaje);

// Actualizar un mensaje
router.put("/:id", actualizarMensaje);

// Eliminar un mensaje
router.delete("/:id", eliminarMensaje);

module.exports = router;