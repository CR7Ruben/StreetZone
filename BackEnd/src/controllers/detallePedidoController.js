const {
    DetallePedido,
    Pedido,
    Producto
} = require("../models");

// Obtener todos los detalles
const obtenerDetalles = async (req, res) => {
    try {
        const detalles = await DetallePedido.findAll({
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
            ],
            order: [["id", "ASC"]]
        });

        res.status(200).json(detalles);

    } catch (error) {
        console.error("❌ Error al obtener detalles:", error);

        res.status(500).json({
            mensaje: "Error al obtener los detalles de pedidos"
        });
    }
};

// Obtener detalle por ID
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

        res.status(200).json(detalle);

    } catch (error) {
        console.error("❌ Error al obtener detalle:", error);

        res.status(500).json({
            mensaje: "Error al obtener el detalle del pedido"
        });
    }
};

    // Crear detalle
const crearDetalle = async (req, res) => {
    try {
        const {
            pedido_id,
            producto_id,
            cantidad,
            precio_unitario
        } = req.body;

        if (
            pedido_id === undefined ||
            producto_id === undefined ||
            cantidad === undefined ||
            precio_unitario === undefined
        ) {
            return res.status(400).json({
                mensaje:
                    "pedido_id, producto_id, cantidad y precio_unitario son obligatorios"
            });
        }

        if (cantidad <= 0) {
            return res.status(400).json({
                mensaje: "La cantidad debe ser mayor a 0"
            });
        }

        if (precio_unitario < 0) {
            return res.status(400).json({
                mensaje:
                    "El precio unitario no puede ser negativo"
            });
        }

        const pedido = await Pedido.findByPk(pedido_id);

        if (!pedido) {
            return res.status(404).json({
                mensaje: "El pedido indicado no existe"
            });
        }

        const producto = await Producto.findByPk(producto_id);

        if (!producto) {
            return res.status(404).json({
                mensaje: "El producto indicado no existe"
            });
        }

        if (cantidad > producto.stock) {
            return res.status(400).json({
                mensaje:
                    "La cantidad solicitada supera el stock disponible"
            });
        }

        const subtotal = Number(
            (Number(precio_unitario) * Number(cantidad)).toFixed(2)
        );

        const nuevoDetalle = await DetallePedido.create({
            pedido_id,
            producto_id,
            cantidad,
            precio_unitario,
            subtotal
        });

        const detalleCreado = await DetallePedido.findByPk(
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
        console.error("❌ Error al crear detalle:", error);

        res.status(500).json({
            mensaje: "Error al crear el detalle del pedido"
        });
    }
};

// Actualizar detalle
const actualizarDetalle = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            pedido_id,
            producto_id,
            cantidad,
            precio_unitario
        } = req.body;

        const detalle = await DetallePedido.findByPk(id);

        if (!detalle) {
            return res.status(404).json({
                mensaje: "Detalle de pedido no encontrado"
            });
        }

        if (pedido_id !== undefined) {
            const pedido = await Pedido.findByPk(pedido_id);

            if (!pedido) {
                return res.status(404).json({
                    mensaje: "El pedido indicado no existe"
                });
            }
        }

        let producto;

        if (producto_id !== undefined) {
            producto = await Producto.findByPk(producto_id);

            if (!producto) {
                return res.status(404).json({
                    mensaje: "El producto indicado no existe"
                });
            }
        } else {
            producto = await Producto.findByPk(
                detalle.producto_id
            );
        }

        const cantidadFinal =
            cantidad !== undefined
                ? Number(cantidad)
                : Number(detalle.cantidad);

        const precioFinal =
            precio_unitario !== undefined
                ? Number(precio_unitario)
                : Number(detalle.precio_unitario);

        if (cantidadFinal <= 0) {
            return res.status(400).json({
                mensaje: "La cantidad debe ser mayor a 0"
            });
        }

        if (precioFinal < 0) {
            return res.status(400).json({
                mensaje:
                    "El precio unitario no puede ser negativo"
            });
        }

        if (cantidadFinal > producto.stock) {
            return res.status(400).json({
                mensaje:
                    "La cantidad solicitada supera el stock disponible"
            });
        }

        const datosActualizados = {};

        if (pedido_id !== undefined) {
            datosActualizados.pedido_id = pedido_id;
        }

        if (producto_id !== undefined) {
            datosActualizados.producto_id = producto_id;
        }

        datosActualizados.cantidad = cantidadFinal;
        datosActualizados.precio_unitario = precioFinal;
        datosActualizados.subtotal = Number(
            (cantidadFinal * precioFinal).toFixed(2)
        );

        await detalle.update(datosActualizados);

        const detalleActualizado =
            await DetallePedido.findByPk(id, {
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
            });

        res.status(200).json(detalleActualizado);

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

// Eliminar detalle
const eliminarDetalle = async (req, res) => {
    try {
        const { id } = req.params;

        const detalle = await DetallePedido.findByPk(id);

        if (!detalle) {
            return res.status(404).json({
                mensaje: "Detalle de pedido no encontrado"
            });
        }

        await detalle.destroy();

        res.status(200).json({
            mensaje: "Detalle de pedido eliminado correctamente"
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