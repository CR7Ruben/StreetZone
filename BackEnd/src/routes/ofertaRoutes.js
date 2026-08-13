const express = require("express");

const {
    obtenerOfertas,
    obtenerOfertaPorId,
    crearOferta,
    actualizarOferta,
    eliminarOferta
} = require("../controllers/ofertaController");

const router = express.Router();

router.get("/", obtenerOfertas);

router.get("/:id", obtenerOfertaPorId);

router.post("/", crearOferta);

router.put("/:id", actualizarOferta);

router.delete("/:id", eliminarOferta);

module.exports = router;