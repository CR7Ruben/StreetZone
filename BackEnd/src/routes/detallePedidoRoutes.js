const express = require("express");

const {
    obtenerDetalles,
    obtenerDetallePorId,
    crearDetalle,
    actualizarDetalle,
    eliminarDetalle
} = require("../controllers/detallePedidoController");

const router = express.Router();

router.get("/", obtenerDetalles);

router.get("/:id", obtenerDetallePorId);

router.post("/", crearDetalle);

router.put("/:id", actualizarDetalle);

router.delete("/:id", eliminarDetalle);

module.exports = router;