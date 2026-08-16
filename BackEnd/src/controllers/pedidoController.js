const {
    Pedido,
    Usuario,
    DetallePedido
} = require("../models");

// ============================================
// OBTENER TODOS LOS PEDIDOS
// ADMIN → todos
// CLIENTE → solo los suyos
// ============================================

const obtenerPedidos = async (req, res) => {
    try {
        const esAdmin = req.usuario.rol === "admin";

        const where = esAdmin
            ? {}
            : {
                usuario_id: req.usuario.id
            };

        const pedidos = await Pedido.findAll({
            where,

            include: [
                {
                    model: Usuario,
                    as: "usuario",
                    attributes: [
                        "id",
                        "nombre",
                        "email"
                    ]
                },

                {
                    model: DetallePedido,
                    as: "detalles",
                    attributes: [
                        "id",
                        "pedido_id",
                        "producto_id",
                        "cantidad",
                        "precio_unitario",
                        "subtotal"
                    ]
                }
            ],

            order: [
                ["id", "ASC"]
            ]
        });

        res.status(200).json(pedidos);

    } catch (error) {
        console.error(
            "❌ Error al obtener pedidos:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al obtener los pedidos"
        });
    }
};

// ============================================
// OBTENER PEDIDO POR ID
// ADMIN → cualquiera
// CLIENTE → solo los suyos
// ============================================

const obtenerPedidoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pedido = await Pedido.findByPk(
            id,
            {
                include: [
                    {
                        model: Usuario,
                        as: "usuario",
                        attributes: [
                            "id",
                            "nombre",
                            "email"
                        ]
                    },

                    {
                        model: DetallePedido,
                        as: "detalles",
                        attributes: [
                            "id",
                            "pedido_id",
                            "producto_id",
                            "cantidad",
                            "precio_unitario",
                            "subtotal"
                        ]
                    }
                ]
            }
        );

        if (!pedido) {
            return res.status(404).json({
                mensaje:
                    "Pedido no encontrado"
            });
        }

        // Cliente solamente puede consultar sus pedidos
        if (
            req.usuario.rol !== "admin" &&
            pedido.usuario_id !== req.usuario.id
        ) {
            return res.status(403).json({
                mensaje:
                    "No tienes permisos para acceder a este pedido"
            });
        }

        res.status(200).json(pedido);

    } catch (error) {
        console.error(
            "❌ Error al obtener pedido:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al obtener el pedido"
        });
    }
};

// ============================================
// CREAR PEDIDO
// CLIENTE → para sí mismo
// ADMIN → para cualquier usuario
// ============================================

const crearPedido = async (req, res) => {
    try {
        const {
            usuario_id
        } = req.body;

        // ============================================
        // DETERMINAR USUARIO
        // ============================================

        const usuarioFinal =
            req.usuario.rol === "admin"
                ? usuario_id
                : req.usuario.id;

        if (usuarioFinal === undefined) {
            return res.status(400).json({
                mensaje:
                    "usuario_id es obligatorio para un administrador"
            });
        }

        // ============================================
        // VALIDAR USUARIO
        // ============================================

        const usuario =
            await Usuario.findByPk(
                usuarioFinal
            );

        if (!usuario) {
            return res.status(404).json({
                mensaje:
                    "El usuario indicado no existe"
            });
        }

        // ============================================
        // CREAR PEDIDO
        // EL TOTAL INICIA EN 0
        // ============================================

        const nuevoPedido =
            await Pedido.create({
                usuario_id: usuarioFinal,
                total: 0,
                estado: "pendiente",
                estado_pago: "pendiente"
            });

        // ============================================
        // OBTENER PEDIDO CREADO
        // ============================================

        const pedidoCreado =
            await Pedido.findByPk(
                nuevoPedido.id,
                {
                    include: [
                        {
                            model: Usuario,
                            as: "usuario",
                            attributes: [
                                "id",
                                "nombre",
                                "email"
                            ]
                        },

                        {
                            model: DetallePedido,
                            as: "detalles",
                            attributes: [
                                "id",
                                "pedido_id",
                                "producto_id",
                                "cantidad",
                                "precio_unitario",
                                "subtotal"
                            ]
                        }
                    ]
                }
            );

        res.status(201).json(
            pedidoCreado
        );

    } catch (error) {
        console.error(
            "❌ Error al crear pedido:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al crear el pedido"
        });
    }
};

// ============================================
// ACTUALIZAR PEDIDO
// ADMIN SOLAMENTE
//
// El total NO se modifica aquí.
// Se calcula automáticamente desde detallePedido.
// ============================================

const actualizarPedido = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            usuario_id,
            estado,
            estado_pago,
            stripe_payment_intent_id,
            stripe_checkout_session_id
        } = req.body;

        // ============================================
        // BUSCAR PEDIDO
        // ============================================

        const pedido =
            await Pedido.findByPk(id);

        if (!pedido) {
            return res.status(404).json({
                mensaje:
                    "Pedido no encontrado"
            });
        }

        // ============================================
        // VALIDAR USUARIO
        // ============================================

        if (
            usuario_id !== undefined
        ) {
            const usuario =
                await Usuario.findByPk(
                    usuario_id
                );

            if (!usuario) {
                return res.status(404).json({
                    mensaje:
                        "El usuario indicado no existe"
                });
            }
        }

        // ============================================
        // ESTADOS PERMITIDOS
        // ============================================

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

        // ============================================
        // VALIDAR ESTADO
        // ============================================

        if (
            estado !== undefined &&
            !estadosPermitidos.includes(
                estado
            )
        ) {
            return res.status(400).json({
                mensaje:
                    "Estado de pedido no válido"
            });
        }

        // ============================================
        // VALIDAR ESTADO DE PAGO
        // ============================================

        if (
            estado_pago !== undefined &&
            !estadosPagoPermitidos.includes(
                estado_pago
            )
        ) {
            return res.status(400).json({
                mensaje:
                    "Estado de pago no válido"
            });
        }

        // ============================================
        // ACTUALIZAR CAMPOS
        // ============================================

        const datosActualizados = {};

        if (
            usuario_id !== undefined
        ) {
            datosActualizados.usuario_id =
                usuario_id;
        }

        if (
            estado !== undefined
        ) {
            datosActualizados.estado =
                estado;
        }

        if (
            estado_pago !== undefined
        ) {
            datosActualizados.estado_pago =
                estado_pago;
        }

        if (
            stripe_payment_intent_id !== undefined
        ) {
            datosActualizados
                .stripe_payment_intent_id =
                stripe_payment_intent_id;
        }

        if (
            stripe_checkout_session_id !== undefined
        ) {
            datosActualizados
                .stripe_checkout_session_id =
                stripe_checkout_session_id;
        }

        // ============================================
        // ACTUALIZAR
        // ============================================

        await pedido.update(
            datosActualizados
        );

        // ============================================
        // OBTENER PEDIDO ACTUALIZADO
        // ============================================

        const pedidoActualizado =
            await Pedido.findByPk(
                id,
                {
                    include: [
                        {
                            model: Usuario,
                            as: "usuario",
                            attributes: [
                                "id",
                                "nombre",
                                "email"
                            ]
                        },

                        {
                            model: DetallePedido,
                            as: "detalles",
                            attributes: [
                                "id",
                                "pedido_id",
                                "producto_id",
                                "cantidad",
                                "precio_unitario",
                                "subtotal"
                            ]
                        }
                    ]
                }
            );

        res.status(200).json(
            pedidoActualizado
        );

    } catch (error) {
        console.error(
            "❌ Error al actualizar pedido:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al actualizar el pedido"
        });
    }
};

// ============================================
// ELIMINAR PEDIDO
// ADMIN SOLAMENTE
// ============================================

const eliminarPedido = async (req, res) => {
    try {
        const { id } = req.params;

        const pedido =
            await Pedido.findByPk(id);

        if (!pedido) {
            return res.status(404).json({
                mensaje:
                    "Pedido no encontrado"
            });
        }

        // ============================================
        // NO ELIMINAR PEDIDOS ENTREGADOS
        // ============================================

        if (
            pedido.estado === "entregado"
        ) {
            return res.status(400).json({
                mensaje:
                    "No se puede eliminar un pedido entregado"
            });
        }

        // ============================================
        // ELIMINAR
        // ============================================

        await pedido.destroy();

        res.status(200).json({
            mensaje:
                "Pedido eliminado correctamente"
        });

    } catch (error) {
        console.error(
            "❌ Error al eliminar pedido:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al eliminar el pedido"
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