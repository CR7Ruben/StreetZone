const { Pedido, Usuario } = require("../models");

// Obtener todos los pedidos
const obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [
                {
                    model: Usuario,
                    as: "usuario",
                    attributes: ["id", "nombre", "email"]
                }
            ],
            order: [["id", "ASC"]]
        });

        res.status(200).json(pedidos);

    } catch (error) {
        console.error("❌ Error al obtener pedidos:", error);

        res.status(500).json({
            mensaje: "Error al obtener los pedidos"
        });
    }
};

// Obtener pedido por ID
const obtenerPedidoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pedido = await Pedido.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    as: "usuario",
                    attributes: ["id", "nombre", "email"]
                }
            ]
        });

        if (!pedido) {
            return res.status(404).json({
                mensaje: "Pedido no encontrado"
            });
        }

        res.status(200).json(pedido);

    } catch (error) {
        console.error("❌ Error al obtener pedido:", error);

        res.status(500).json({
            mensaje: "Error al obtener el pedido"
        });
    }
};

//Crear pedido
const crearPedido = async (req, res) => {
    try {
        const {
            usuario_id,
            total,
            estado,
            estado_pago,
            stripe_payment_intent_id,
            stripe_checkout_session_id
        } = req.body;

        if (
            usuario_id === undefined ||
            total === undefined
        ) {
            return res.status(400).json({
                mensaje: "usuario_id y total son obligatorios"
            });
        }

        if (total < 0) {
            return res.status(400).json({
                mensaje: "El total no puede ser negativo"
            });
        }

        const usuario = await Usuario.findByPk(usuario_id);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "El usuario indicado no existe"
            });
        }

        const estadosPermitidos = [
            "pendiente",
            "confirmado",
            "procesando",
            "enviado",
            "entregado",
            "cancelado"
        ];

        const estadosPagoPermitidos = [
            "pendiente",
            "pagado",
            "fallido",
            "reembolsado"
        ];

        const estadoFinal = estado || "pendiente";
        const estadoPagoFinal = estado_pago || "pendiente";

        if (!estadosPermitidos.includes(estadoFinal)) {
            return res.status(400).json({
                mensaje: "Estado de pedido no válido"
            });
        }

        if (!estadosPagoPermitidos.includes(estadoPagoFinal)) {
            return res.status(400).json({
                mensaje: "Estado de pago no válido"
            });
        }

        const nuevoPedido = await Pedido.create({
            usuario_id,
            total,
            estado: estadoFinal,
            estado_pago: estadoPagoFinal,
            stripe_payment_intent_id,
            stripe_checkout_session_id
        });

        const pedidoCreado = await Pedido.findByPk(
            nuevoPedido.id,
            {
                include: [
                    {
                        model: Usuario,
                        as: "usuario",
                        attributes: ["id", "nombre", "email"]
                    }
                ]
            }
        );

        res.status(201).json(pedidoCreado);

    } catch (error) {
        console.error("❌ Error al crear pedido:", error);

        res.status(500).json({
            mensaje: "Error al crear el pedido"
        });
    }
};

// Actualizar pedido
const actualizarPedido = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            usuario_id,
            total,
            estado,
            estado_pago,
            stripe_payment_intent_id,
            stripe_checkout_session_id
        } = req.body;

        const pedido = await Pedido.findByPk(id);

        if (!pedido) {
            return res.status(404).json({
                mensaje: "Pedido no encontrado"
            });
        }

        if (usuario_id !== undefined) {
            const usuario = await Usuario.findByPk(usuario_id);

            if (!usuario) {
                return res.status(404).json({
                    mensaje: "El usuario indicado no existe"
                });
            }
        }

        if (total !== undefined && total < 0) {
            return res.status(400).json({
                mensaje: "El total no puede ser negativo"
            });
        }

        const estadosPermitidos = [
            "pendiente",
            "confirmado",
            "procesando",
            "enviado",
            "entregado",
            "cancelado"
        ];

        const estadosPagoPermitidos = [
            "pendiente",
            "pagado",
            "fallido",
            "reembolsado"
        ];

        if (
            estado !== undefined &&
            !estadosPermitidos.includes(estado)
        ) {
            return res.status(400).json({
                mensaje: "Estado de pedido no válido"
            });
        }

        if (
            estado_pago !== undefined &&
            !estadosPagoPermitidos.includes(estado_pago)
        ) {
            return res.status(400).json({
                mensaje: "Estado de pago no válido"
            });
        }

        const datosActualizados = {};

        if (usuario_id !== undefined) {
            datosActualizados.usuario_id = usuario_id;
        }

        if (total !== undefined) {
            datosActualizados.total = total;
        }

        if (estado !== undefined) {
            datosActualizados.estado = estado;
        }

        if (estado_pago !== undefined) {
            datosActualizados.estado_pago = estado_pago;
        }

        if (stripe_payment_intent_id !== undefined) {
            datosActualizados.stripe_payment_intent_id =
                stripe_payment_intent_id;
        }

        if (stripe_checkout_session_id !== undefined) {
            datosActualizados.stripe_checkout_session_id =
                stripe_checkout_session_id;
        }

        await pedido.update(datosActualizados);

        const pedidoActualizado = await Pedido.findByPk(
            id,
            {
                include: [
                    {
                        model: Usuario,
                        as: "usuario",
                        attributes: ["id", "nombre", "email"]
                    }
                ]
            }
        );

        res.status(200).json(pedidoActualizado);

    } catch (error) {
        console.error("❌ Error al actualizar pedido:", error);

        res.status(500).json({
            mensaje: "Error al actualizar el pedido"
        });
    }
};

// Eliminar pedido
const eliminarPedido = async (req, res) => {
    try {
        const { id } = req.params;

        const pedido = await Pedido.findByPk(id);

        if (!pedido) {
            return res.status(404).json({
                mensaje: "Pedido no encontrado"
            });
        }

        await pedido.destroy();

        res.status(200).json({
            mensaje: "Pedido eliminado correctamente"
        });

    } catch (error) {
        console.error("❌ Error al eliminar pedido:", error);

        res.status(500).json({
            mensaje: "Error al eliminar el pedido"
        });
    }
};

module.exports = {
    obtenerPedidos,
    obtenerPedidoPorId,
    crearPedido,
    actualizarPedido,
    eliminarPedido
};