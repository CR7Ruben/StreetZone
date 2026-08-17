const {
    sequelize,
    Pedido,
    Usuario,
    DetallePedido,
    Producto,
    Oferta
} = require("../models");

// ============================================================
// OBTENER TODOS LOS PEDIDOS
// ADMIN → todos
// CLIENTE → solo los suyos
// ============================================================

const obtenerPedidos = async (req, res) => {
    try {

        const esAdmin =
            req.usuario.rol === "admin";

        const where = esAdmin
            ? {}
            : {
                usuario_id: req.usuario.id
            };

        const pedidos =
            await Pedido.findAll({
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
                        ],

                        include: [
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
                ],

                order: [
                    ["id", "ASC"]
                ]
            });

        return res.status(200).json(pedidos);

    } catch (error) {

        console.error(
            "❌ Error al obtener pedidos:",
            error
        );

        return res.status(500).json({
            mensaje:
                "Error al obtener los pedidos"
        });
    }
};


// ============================================================
// OBTENER PEDIDO POR ID
// ADMIN → cualquiera
// CLIENTE → solo los suyos
// ============================================================

const obtenerPedidoPorId = async (req, res) => {

    try {

        const { id } = req.params;

        const pedido =
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
                            ],

                            include: [
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
                    ]
                }
            );

        if (!pedido) {

            return res.status(404).json({
                mensaje:
                    "Pedido no encontrado"
            });
        }

        // Cliente solamente puede consultar
        // sus propios pedidos

        if (
            req.usuario.rol !== "admin" &&
            Number(pedido.usuario_id) !==
            Number(req.usuario.id)
        ) {

            return res.status(403).json({
                mensaje:
                    "No tienes permisos para acceder a este pedido"
            });
        }

        return res.status(200).json(
            pedido
        );

    } catch (error) {

        console.error(
            "❌ Error al obtener pedido:",
            error
        );

        return res.status(500).json({
            mensaje:
                "Error al obtener el pedido"
        });
    }
};


// ============================================================
// CREAR PEDIDO COMPLETO
//
// CLIENTE:
//   usuario_id viene del JWT
//
// ADMIN:
//   puede indicar usuario_id
//
// RECIBE:
//
// {
//     "productos": [
//         {
//             "producto_id": 1,
//             "cantidad": 2
//         },
//         {
//             "producto_id": 3,
//             "cantidad": 1
//         }
//     ]
// }
//
// REALIZA:
// - Validación del carrito
// - Validación del usuario
// - Validación de productos
// - Validación de stock
// - Aplicación de oferta vigente
// - Creación del pedido
// - Creación de detalles
// - Descuento de stock
// - Cálculo del total
//
// TODO DENTRO DE UNA TRANSACCIÓN
// ============================================================

const crearPedidoCompleto = async (req, res) => {

    const transaction =
        await sequelize.transaction();

    try {

        const {
            productos
        } = req.body;


        // ====================================================
        // VALIDAR CARRITO
        // ====================================================

        if (
            !Array.isArray(productos) ||
            productos.length === 0
        ) {

            await transaction.rollback();

            return res.status(400).json({
                mensaje:
                    "El carrito está vacío"
            });
        }


        // ====================================================
        // DETERMINAR USUARIO
        // ====================================================

        const usuarioFinal =
            req.usuario.rol === "admin" &&
            req.body.usuario_id !== undefined
                ? Number(req.body.usuario_id)
                : Number(req.usuario.id);


        // ====================================================
        // VALIDAR USUARIO
        // ====================================================

        const usuario =
            await Usuario.findByPk(
                usuarioFinal,
                {
                    transaction
                }
            );

        if (!usuario) {

            await transaction.rollback();

            return res.status(404).json({
                mensaje:
                    "El usuario indicado no existe"
            });
        }


        // ====================================================
        // NORMALIZAR CARRITO
        //
        // Si el frontend manda el mismo producto varias veces,
        // se suman las cantidades.
        // ====================================================

        const carritoNormalizado = {};

        for (const item of productos) {

            const productoId =
                Number(item.producto_id);

            const cantidad =
                Number(item.cantidad);


            // ------------------------------------------------
            // VALIDAR PRODUCTO ID
            // ------------------------------------------------

            if (
                !Number.isInteger(productoId) ||
                productoId <= 0
            ) {

                await transaction.rollback();

                return res.status(400).json({
                    mensaje:
                        "producto_id no válido"
                });
            }


            // ------------------------------------------------
            // VALIDAR CANTIDAD
            // ------------------------------------------------

            if (
                !Number.isInteger(cantidad) ||
                cantidad <= 0
            ) {

                await transaction.rollback();

                return res.status(400).json({
                    mensaje:
                        "La cantidad debe ser un entero mayor a 0"
                });
            }


            if (
                !carritoNormalizado[productoId]
            ) {
                carritoNormalizado[productoId] = 0;
            }

            carritoNormalizado[productoId] +=
                cantidad;
        }


        // ====================================================
        // CREAR PEDIDO
        // ====================================================

        const nuevoPedido =
            await Pedido.create(
                {
                    usuario_id:
                        usuarioFinal,

                    total: 0,

                    estado:
                        "pendiente",

                    estado_pago:
                        "pendiente"
                },
                {
                    transaction
                }
            );


        let totalPedido = 0;


        // ====================================================
        // PROCESAR PRODUCTOS
        // ====================================================

        for (
            const productoIdString
            of Object.keys(
                carritoNormalizado
            )
        ) {

            const productoId =
                Number(productoIdString);

            const cantidad =
                carritoNormalizado[
                    productoId
                ];


            // =================================================
            // BUSCAR PRODUCTO CON BLOQUEO
            // =================================================

            const producto =
                await Producto.findByPk(
                    productoId,
                    {
                        transaction,

                        lock:
                            transaction.LOCK.UPDATE
                    }
                );


            // =================================================
            // VALIDAR PRODUCTO
            // =================================================

            if (!producto) {

                throw new Error(
                    `El producto con ID ${productoId} no existe`
                );
            }


            // =================================================
            // VALIDAR PRODUCTO ACTIVO
            // =================================================

            if (!producto.activo) {

                throw new Error(
                    `El producto "${producto.nombre}" no está disponible`
                );
            }


            // =================================================
            // VALIDAR STOCK
            // =================================================

            const stockDisponible =
                Number(producto.stock);

            if (
                cantidad >
                stockDisponible
            ) {

                throw new Error(
                    `Stock insuficiente para "${producto.nombre}". Disponible: ${stockDisponible}`
                );
            }


            // =================================================
            // PRECIO BASE
            //
            // IMPORTANTE:
            // Nunca confiamos en el precio enviado
            // por el frontend.
            // =================================================

            let precioFinal =
                Number(producto.precio);

            let ofertaAplicada =
                null;


            // =================================================
            // BUSCAR OFERTA VIGENTE
            // =================================================

            const ahora =
                new Date();

            const ofertas =
                await Oferta.findAll({
                    where: {
                        producto_id:
                            producto.id,

                        activo:
                            true
                    },

                    order: [
                        [
                            "id",
                            "DESC"
                        ]
                    ],

                    transaction
                });


            // =================================================
            // ENCONTRAR OFERTA ACTIVA Y VIGENTE
            // =================================================

            for (const oferta of ofertas) {

                const fechaInicio =
                    oferta.fecha_inicio
                        ? new Date(
                            oferta.fecha_inicio
                        )
                        : null;

                const fechaFin =
                    oferta.fecha_fin
                        ? new Date(
                            oferta.fecha_fin
                        )
                        : null;


                const inicioValido =
                    !fechaInicio ||
                    ahora >= fechaInicio;

                const finValido =
                    !fechaFin ||
                    ahora <= fechaFin;


                if (
                    inicioValido &&
                    finValido
                ) {

                    const precioOferta =
                        Number(
                            oferta.precio_oferta
                        );


                    if (
                        Number.isFinite(
                            precioOferta
                        ) &&
                        precioOferta >= 0 &&
                        precioOferta <
                            precioFinal
                    ) {

                        precioFinal =
                            precioOferta;

                        ofertaAplicada =
                            oferta;

                        break;
                    }
                }
            }


            // =================================================
            // CALCULAR SUBTOTAL
            // =================================================

            const subtotal =
                Number(
                    (
                        precioFinal *
                        cantidad
                    ).toFixed(2)
                );


            // =================================================
            // CREAR DETALLE
            // =================================================

            await DetallePedido.create(
                {
                    pedido_id:
                        nuevoPedido.id,

                    producto_id:
                        producto.id,

                    cantidad:
                        cantidad,

                    precio_unitario:
                        precioFinal,

                    subtotal:
                        subtotal
                },
                {
                    transaction
                }
            );


            // =================================================
            // DESCONTAR STOCK
            // =================================================

            producto.stock =
                stockDisponible -
                cantidad;

            await producto.save({
                transaction
            });


            // =================================================
            // ACUMULAR TOTAL
            // =================================================

            totalPedido +=
                subtotal;


            console.log(
                `✅ Producto: ${producto.nombre}`
            );

            console.log(
                `   Cantidad: ${cantidad}`
            );

            console.log(
                `   Precio: $${precioFinal}`
            );

            console.log(
                `   Oferta: ${
                    ofertaAplicada
                        ? "Sí"
                        : "No"
                }`
            );
        }


        // ====================================================
        // REDONDEAR TOTAL
        // ====================================================

        totalPedido =
            Number(
                totalPedido.toFixed(2)
            );


        // ====================================================
        // ACTUALIZAR PEDIDO
        // ====================================================

        await nuevoPedido.update(
            {
                total:
                    totalPedido
            },
            {
                transaction
            }
        );


        // ====================================================
        // CONFIRMAR TRANSACCIÓN
        // ====================================================

        await transaction.commit();


        // ====================================================
        // OBTENER PEDIDO COMPLETO
        // ====================================================

        const pedidoCompleto =
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
                            ],

                            include: [
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
                    ]
                }
            );


        console.log(
            "======================================"
        );

        console.log(
            "✅ PEDIDO CREADO CORRECTAMENTE"
        );

        console.log(
            "✅ ID:",
            pedidoCompleto.id
        );

        console.log(
            "✅ TOTAL:",
            pedidoCompleto.total
        );

        console.log(
            "======================================"
        );


        return res.status(201).json(
            pedidoCompleto
        );

    } catch (error) {

        // ====================================================
        // ROLLBACK
        // ====================================================

        try {

            await transaction.rollback();

        } catch (rollbackError) {

            console.error(
                "❌ Error haciendo rollback:",
                rollbackError
            );
        }


        console.error(
            "❌ Error creando pedido completo:",
            error
        );

        console.error(
            error.stack
        );


        return res.status(400).json({
            mensaje:
                error.message ||
                "No se pudo crear el pedido"
        });
    }
};


// ============================================================
// CREAR PEDIDO SIMPLE
//
// Se mantiene para que la ruta POST "/" siga funcionando.
//
// NO CREA DETALLES.
// Para comprar desde StreetZone debemos usar /checkout.
// ============================================================

const crearPedido = async (req, res) => {

    try {

        const usuarioFinal =
            req.usuario.rol === "admin" &&
            req.body.usuario_id !== undefined
                ? Number(req.body.usuario_id)
                : Number(req.usuario.id);


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


        const nuevoPedido =
            await Pedido.create({
                usuario_id:
                    usuarioFinal,

                total:
                    0,

                estado:
                    "pendiente",

                estado_pago:
                    "pendiente"
            });


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
                            as: "detalles"
                        }
                    ]
                }
            );


        return res.status(201).json(
            pedidoCreado
        );

    } catch (error) {

        console.error(
            "❌ Error al crear pedido:",
            error
        );

        return res.status(500).json({
            mensaje:
                "Error al crear el pedido"
        });
    }
};


// ============================================================
// ACTUALIZAR PEDIDO
// ADMIN SOLAMENTE
// ============================================================

const actualizarPedido = async (req, res) => {

    try {

        const { id } =
            req.params;

        const {
            usuario_id,
            estado,
            estado_pago,
            stripe_payment_intent_id,
            stripe_checkout_session_id
        } = req.body;


        // ====================================================
        // BUSCAR PEDIDO
        // ====================================================

        const pedido =
            await Pedido.findByPk(id);


        if (!pedido) {

            return res.status(404).json({
                mensaje:
                    "Pedido no encontrado"
            });
        }


        // ====================================================
        // VALIDAR USUARIO
        // ====================================================

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


        // ====================================================
        // ESTADOS PERMITIDOS
        // ====================================================

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


        // ====================================================
        // VALIDAR ESTADO
        // ====================================================

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


        // ====================================================
        // VALIDAR ESTADO DE PAGO
        // ====================================================

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


        // ====================================================
        // CAMPOS A ACTUALIZAR
        // ====================================================

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
            stripe_payment_intent_id !==
            undefined
        ) {

            datosActualizados
                .stripe_payment_intent_id =
                stripe_payment_intent_id;
        }


        if (
            stripe_checkout_session_id !==
            undefined
        ) {

            datosActualizados
                .stripe_checkout_session_id =
                stripe_checkout_session_id;
        }


        // ====================================================
        // ACTUALIZAR
        // ====================================================

        await pedido.update(
            datosActualizados
        );


        // ====================================================
        // OBTENER ACTUALIZADO
        // ====================================================

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
                            as: "detalles"
                        }
                    ]
                }
            );


        return res.status(200).json(
            pedidoActualizado
        );

    } catch (error) {

        console.error(
            "❌ Error al actualizar pedido:",
            error
        );

        return res.status(500).json({
            mensaje:
                "Error al actualizar el pedido"
        });
    }
};


// ============================================================
// ELIMINAR PEDIDO
// ADMIN SOLAMENTE
// ============================================================

const eliminarPedido = async (req, res) => {

    try {

        const { id } =
            req.params;


        const pedido =
            await Pedido.findByPk(id);


        if (!pedido) {

            return res.status(404).json({
                mensaje:
                    "Pedido no encontrado"
            });
        }


        // ====================================================
        // NO ELIMINAR ENTREGADOS
        // ====================================================

        if (
            pedido.estado ===
            "entregado"
        ) {

            return res.status(400).json({
                mensaje:
                    "No se puede eliminar un pedido entregado"
            });
        }


        // ====================================================
        // ELIMINAR
        // ====================================================

        await pedido.destroy();


        return res.status(200).json({
            mensaje:
                "Pedido eliminado correctamente"
        });

    } catch (error) {

        console.error(
            "❌ Error al eliminar pedido:",
            error
        );

        return res.status(500).json({
            mensaje:
                "Error al eliminar el pedido"
        });
    }
};


// ============================================================
// EXPORTACIONES
// ============================================================

module.exports = {

    obtenerPedidos,

    obtenerPedidoPorId,

    crearPedido,

    crearPedidoCompleto,

    actualizarPedido,

    eliminarPedido
};