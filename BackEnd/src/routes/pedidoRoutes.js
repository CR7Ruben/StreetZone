const express = require("express");

const {
    obtenerPedidos,
    obtenerPedidoPorId,
    crearPedido,
    actualizarPedido,
    eliminarPedido
} = require("../controllers/pedidoController");

const router = express.Router();

router.get("/", obtenerPedidos);

router.get("/:id", obtenerPedidoPorId);

router.post("/", crearPedido);

router.put("/:id", actualizarPedido);

router.delete("/:id", eliminarPedido);

module.exports = router;