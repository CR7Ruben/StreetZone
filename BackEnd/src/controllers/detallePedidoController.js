const {
    DetallePedido,
    Pedido,
    Producto
} = require("../models");

// ============================================
// Obtener detalle por ID
// ADMIN → cualquiera
// CLIENTE → solo si pertenece a su pedido
// ============================================

const obtenerDetalles = async (req, res) => {
    try {
        const esAdmin = req.usuario.rol === "admin";

        const detalles = await DetallePedido.findAll({
            include: [
                {
                    model: Pedido,
                    as: "pedido",
                    required: true,
                    attributes: [
                        "id",
                        "usuario_id",
                        "total",
                        "estado",
                        "estado_pago"
                    ],
                    ...(esAdmin
                        ? {}
                        : {
                            where: {
                                usuario_id: req.usuario.id
                            }
                        })
                },
                {
                    model: Producto,
                    as: "producto",
                    required: true,
                    attributes: [
                        "id",
                        "nombre",
                        "precio",
                        "stock",
                        "imagen"
                    ]
                }
            ],
            order: [["id", "ASC"]]
        });

        res.status(200).json(detalles);

    } catch (error) {
        console.error("❌ Error al obtener detalles:");
        console.error(error);
        console.error(error.stack);

        res.status(500).json({
            mensaje: "Error al obtener los detalles de pedidos"
        });
    }
};

const obtenerDetallePorId = async (req, res) => {
    try {
        const { id } = req.params;

        const detalle = await DetallePedido.findByPk(id, {
            include: [
                {
                    model: Pedido,
                    as: "pedido",
                    attributes: [
                        "id",
                        "usuario_id",
                        "total",
                        "estado",
                        "estado_pago"
                    ]
                },
                {
                    model: Producto,
                    as: "producto",
                    attributes: [
                        "id",
                        "nombre",
                        "precio",
                        "stock",
                        "imagen"
                    ]
                }
            ]
        });

        if (!detalle) {
            return res.status(404).json({
                mensaje: "Detalle de pedido no encontrado"
            });
        }

        // ADMIN puede consultar cualquier detalle
        // CLIENTE solo puede consultar sus propios detalles
        if (
            req.usuario.rol !== "admin" &&
            (!detalle.pedido ||
                detalle.pedido.usuario_id !== req.usuario.id)
        ) {
            return res.status(403).json({
                mensaje:
                    "No tienes permisos para acceder a este detalle"
            });
        }

        res.status(200).json(detalle);

    } catch (error) {
        console.error("❌ Error al obtener detalle:", error);
        console.error(error.stack);

        res.status(500).json({
            mensaje: "Error al obtener el detalle del pedido"
        });
    }
};

// ============================================
// Crear detalle
// CLIENTE → solo en sus pedidos
// ADMIN → cualquier pedido
// ============================================

const crearDetalle = async (req, res) => {
    try {
        const {
            pedido_id,
            producto_id,
            cantidad
        } = req.body;

        // ============================================
        // VALIDACIONES
        // ============================================

        if (
            pedido_id === undefined ||
            producto_id === undefined ||
            cantidad === undefined
        ) {
            return res.status(400).json({
                mensaje:
                    "pedido_id, producto_id y cantidad son obligatorios"
            });
        }

        const cantidadFinal = Number(cantidad);

        if (
            !Number.isInteger(cantidadFinal) ||
            cantidadFinal <= 0
        ) {
            return res.status(400).json({
                mensaje:
                    "La cantidad debe ser un entero mayor a 0"
            });
        }

        // ============================================
        // BUSCAR PEDIDO
        // ============================================

        const pedido = await Pedido.findByPk(pedido_id);

        if (!pedido) {
            return res.status(404).json({
                mensaje: "El pedido indicado no existe"
            });
        }

        // ============================================
        // PERMISOS
        // CLIENTE → solo sus pedidos
        // ADMIN → cualquier pedido
        // ============================================

        if (
            req.usuario.rol !== "admin" &&
            pedido.usuario_id !== req.usuario.id
        ) {
            return res.status(403).json({
                mensaje:
                    "No tienes permisos para agregar productos a este pedido"
            });
        }

        // ============================================
        // VALIDAR ESTADO DEL PEDIDO
        // ============================================

        if (
            ["entregado", "cancelado"].includes(
                pedido.estado
            )
        ) {
            return res.status(400).json({
                mensaje:
                    "No se pueden agregar productos a un pedido entregado o cancelado"
            });
        }

        // ============================================
        // BUSCAR PRODUCTO
        // ============================================

        const producto = await Producto.findByPk(producto_id);

        if (!producto) {
            return res.status(404).json({
                mensaje: "El producto indicado no existe"
            });
        }

        // ============================================
        // VALIDAR STOCK
        // ============================================

        if (cantidadFinal > Number(producto.stock)) {
            return res.status(400).json({
                mensaje:
                    "La cantidad solicitada supera el stock disponible"
            });
        }

        // ============================================
        // TOMAR PRECIO REAL DEL PRODUCTO
        // NO confiar en el cliente
        // ============================================

        const precioFinal = Number(producto.precio);

        const subtotal = Number(
            (precioFinal * cantidadFinal).toFixed(2)
        );

        // ============================================
        // CREAR DETALLE
        // ============================================

        const nuevoDetalle = await DetallePedido.create({
            pedido_id,
            producto_id,
            cantidad: cantidadFinal,
            precio_unitario: precioFinal,
            subtotal
        });

        // ============================================
        // DESCONTAR STOCK
        // ============================================

        producto.stock =
            Number(producto.stock) - cantidadFinal;

        await producto.save();

        // ============================================
        // ACTUALIZAR TOTAL DEL PEDIDO
        // ============================================

        const detallesPedido =
            await DetallePedido.findAll({
                where: {
                    pedido_id
                }
            });

        const nuevoTotal = detallesPedido.reduce(
            (acumulado, detalle) =>
                acumulado + Number(detalle.subtotal),
            0
        );

        await pedido.update({
            total: Number(nuevoTotal.toFixed(2))
        });

        // ============================================
        // OBTENER DETALLE CREADO
        // ============================================

        const detalleCreado =
            await DetallePedido.findByPk(
                nuevoDetalle.id,
                {
                    include: [
                        {
                            model: Pedido,
                            as: "pedido",
                            attributes: [
                                "id",
                                "usuario_id",
                                "total",
                                "estado",
                                "estado_pago"
                            ]
                        },
                        {
                            model: Producto,
                            as: "producto",
                            attributes: [
                                "id",
                                "nombre",
                                "precio",
                                "imagen"
                            ]
                        }
                    ]
                }
            );

        res.status(201).json(detalleCreado);

    } catch (error) {
        console.error(
            "❌ Error al crear detalle:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al crear el detalle del pedido"
        });
    }
};

// ============================================
// Actualizar detalle
// ADMIN SOLAMENTE
// ============================================

const actualizarDetalle = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            pedido_id,
            producto_id,
            cantidad
        } = req.body;

        // ============================================
        // BUSCAR DETALLE
        // ============================================

        const detalle = await DetallePedido.findByPk(id);

        if (!detalle) {
            return res.status(404).json({
                mensaje: "Detalle de pedido no encontrado"
            });
        }

        // ============================================
        // PEDIDO ACTUAL
        // ============================================

        const pedidoActual = await Pedido.findByPk(
            detalle.pedido_id
        );

        if (!pedidoActual) {
            return res.status(404).json({
                mensaje: "El pedido asociado no existe"
            });
        }

        // ============================================
        // PEDIDO NUEVO
        // ============================================

        const pedidoIdFinal =
            pedido_id !== undefined
                ? Number(pedido_id)
                : detalle.pedido_id;

        const pedidoNuevo =
            await Pedido.findByPk(pedidoIdFinal);

        if (!pedidoNuevo) {
            return res.status(404).json({
                mensaje: "El pedido indicado no existe"
            });
        }

        // ============================================
        // VALIDAR ESTADO DEL PEDIDO ACTUAL
        // ============================================

        if (
            ["entregado", "cancelado"].includes(
                pedidoActual.estado
            )
        ) {
            return res.status(400).json({
                mensaje:
                    "No se puede modificar un pedido entregado o cancelado"
            });
        }

        // ============================================
        // VALIDAR ESTADO DEL NUEVO PEDIDO
        // ============================================

        if (
            ["entregado", "cancelado"].includes(
                pedidoNuevo.estado
            )
        ) {
            return res.status(400).json({
                mensaje:
                    "No se puede mover el detalle a un pedido entregado o cancelado"
            });
        }

        // ============================================
        // PRODUCTO ACTUAL
        // ============================================

        const productoActual =
            await Producto.findByPk(
                detalle.producto_id
            );

        if (!productoActual) {
            return res.status(404).json({
                mensaje:
                    "El producto asociado al detalle no existe"
            });
        }

        // ============================================
        // PRODUCTO NUEVO
        // ============================================

        const productoIdFinal =
            producto_id !== undefined
                ? Number(producto_id)
                : detalle.producto_id;

        const productoNuevo =
            await Producto.findByPk(productoIdFinal);

        if (!productoNuevo) {
            return res.status(404).json({
                mensaje:
                    "El producto indicado no existe"
            });
        }

        // ============================================
        // CANTIDAD NUEVA
        // ============================================

        const cantidadFinal =
            cantidad !== undefined
                ? Number(cantidad)
                : Number(detalle.cantidad);

        if (
            !Number.isInteger(cantidadFinal) ||
            cantidadFinal <= 0
        ) {
            return res.status(400).json({
                mensaje:
                    "La cantidad debe ser un entero mayor a 0"
            });
        }

        const cantidadAnterior =
            Number(detalle.cantidad);

        // ============================================
        // VALIDAR STOCK ANTES DE MODIFICARLO
        // ============================================

        if (
            productoActual.id !== productoNuevo.id
        ) {
            // El producto cambia.
            // Primero verificamos que el nuevo producto
            // tenga suficiente stock.
            if (
                cantidadFinal >
                Number(productoNuevo.stock)
            ) {
                return res.status(400).json({
                    mensaje:
                        "La cantidad solicitada supera el stock disponible del nuevo producto"
                });
            }

        } else {
            // Mismo producto.
            // Solo necesitamos comprobar el stock adicional.
            const diferencia =
                cantidadFinal -
                cantidadAnterior;

            if (diferencia > 0) {
                if (
                    diferencia >
                    Number(productoNuevo.stock)
                ) {
                    return res.status(400).json({
                        mensaje:
                            "La cantidad adicional supera el stock disponible"
                    });
                }
            }
        }

        // ============================================
        // AJUSTAR STOCK
        // ============================================

        if (
            productoActual.id !== productoNuevo.id
        ) {
            // Devolver cantidad al producto anterior
            productoActual.stock =
                Number(productoActual.stock) +
                cantidadAnterior;

            await productoActual.save();

            // Descontar cantidad del nuevo producto
            productoNuevo.stock =
                Number(productoNuevo.stock) -
                cantidadFinal;

            await productoNuevo.save();

        } else {
            // Mismo producto
            const diferencia =
                cantidadFinal -
                cantidadAnterior;

            // Aumentó la cantidad
            if (diferencia > 0) {
                productoNuevo.stock =
                    Number(productoNuevo.stock) -
                    diferencia;

                await productoNuevo.save();
            }

            // Disminuyó la cantidad
            else if (diferencia < 0) {
                productoNuevo.stock =
                    Number(productoNuevo.stock) +
                    Math.abs(diferencia);

                await productoNuevo.save();
            }
        }

        // ============================================
        // TOMAR PRECIO REAL DEL PRODUCTO
        // ============================================

        const precioFinal =
            Number(productoNuevo.precio);

        // ============================================
        // CALCULAR SUBTOTAL
        // ============================================

        const subtotal =
            Number(
                (
                    precioFinal *
                    cantidadFinal
                ).toFixed(2)
            );

        // ============================================
        // ACTUALIZAR DETALLE
        // ============================================

        await detalle.update({
            pedido_id: pedidoIdFinal,
            producto_id: productoIdFinal,
            cantidad: cantidadFinal,
            precio_unitario: precioFinal,
            subtotal
        });

        // ============================================
        // RECALCULAR TOTAL DEL PEDIDO ACTUAL
        // ============================================

        const detallesPedidoActual =
            await DetallePedido.findAll({
                where: {
                    pedido_id: pedidoActual.id
                }
            });

        const totalPedidoActual =
            detallesPedidoActual.reduce(
                (acumulado, item) =>
                    acumulado +
                    Number(item.subtotal),
                0
            );

        await pedidoActual.update({
            total:
                Number(
                    totalPedidoActual.toFixed(2)
                )
        });

        // ============================================
        // RECALCULAR NUEVO PEDIDO
        // SOLO SI CAMBIÓ
        // ============================================

        if (
            pedidoActual.id !== pedidoNuevo.id
        ) {
            const detallesPedidoNuevo =
                await DetallePedido.findAll({
                    where: {
                        pedido_id: pedidoNuevo.id
                    }
                });

            const totalPedidoNuevo =
                detallesPedidoNuevo.reduce(
                    (acumulado, item) =>
                        acumulado +
                        Number(item.subtotal),
                    0
                );

            await pedidoNuevo.update({
                total:
                    Number(
                        totalPedidoNuevo.toFixed(2)
                    )
            });
        }

        // ============================================
        // OBTENER DETALLE ACTUALIZADO
        // ============================================

        const detalleActualizado =
            await DetallePedido.findByPk(
                id,
                {
                    include: [
                        {
                            model: Pedido,
                            as: "pedido",
                            attributes: [
                                "id",
                                "usuario_id",
                                "total",
                                "estado",
                                "estado_pago"
                            ]
                        },
                        {
                            model: Producto,
                            as: "producto",
                            attributes: [
                                "id",
                                "nombre",
                                "precio",
                                "stock",
                                "imagen"
                            ]
                        }
                    ]
                }
            );

        res.status(200).json(
            detalleActualizado
        );

    } catch (error) {
        console.error(
            "❌ Error al actualizar detalle:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al actualizar el detalle del pedido"
        });
    }
};

// ============================================
// Eliminar detalle
// ADMIN SOLAMENTE
// ============================================

const eliminarDetalle = async (req, res) => {
    try {
        const { id } = req.params;

        // ============================================
        // BUSCAR DETALLE
        // ============================================

        const detalle = await DetallePedido.findByPk(id);

        if (!detalle) {
            return res.status(404).json({
                mensaje:
                    "Detalle de pedido no encontrado"
            });
        }

        // ============================================
        // BUSCAR PEDIDO
        // ============================================

        const pedido = await Pedido.findByPk(
            detalle.pedido_id
        );

        if (!pedido) {
            return res.status(404).json({
                mensaje:
                    "El pedido asociado no existe"
            });
        }

        // ============================================
        // NO ELIMINAR DE PEDIDOS FINALIZADOS
        // ============================================

        if (
            ["entregado", "cancelado"].includes(
                pedido.estado
            )
        ) {
            return res.status(400).json({
                mensaje:
                    "No se puede eliminar un detalle de un pedido entregado o cancelado"
            });
        }

        // ============================================
        // DEVOLVER STOCK
        // ============================================

        const producto =
            await Producto.findByPk(
                detalle.producto_id
            );

        if (producto) {
            producto.stock =
                Number(producto.stock) +
                Number(detalle.cantidad);

            await producto.save();
        }

        // ============================================
        // ELIMINAR DETALLE
        // ============================================

        await detalle.destroy();

        // ============================================
        // RECALCULAR TOTAL DEL PEDIDO
        // ============================================

        const detallesRestantes =
            await DetallePedido.findAll({
                where: {
                    pedido_id:
                        pedido.id
                }
            });

        const nuevoTotal =
            detallesRestantes.reduce(
                (acumulado, item) =>
                    acumulado +
                    Number(item.subtotal),
                0
            );

        await pedido.update({
            total:
                Number(
                    nuevoTotal.toFixed(2)
                )
        });

        res.status(200).json({
            mensaje:
                "Detalle de pedido eliminado correctamente",
            pedido_id: pedido.id,
            nuevo_total:
                Number(
                    nuevoTotal.toFixed(2)
                )
        });

    } catch (error) {
        console.error(
            "❌ Error al eliminar detalle:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al eliminar el detalle del pedido"
        });
    }
};

module.exports = {
    obtenerDetalles,
    obtenerDetallePorId,
    crearDetalle,
    actualizarDetalle,
    eliminarDetalle
};
