const Stripe = require("stripe");

const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY
);

const {
    Pedido,
    DetallePedido,
    Producto,
    sequelize
} = require("../models");


const crearCheckout = async (req, res) => {

    try {

        const { pedido_id } = req.body;


        // ==========================================
        // 1. VALIDAR PEDIDO_ID
        // ==========================================

        if (!pedido_id) {

            return res.status(400).json({
                mensaje: "El pedido_id es obligatorio"
            });

        }


        // ==========================================
        // 2. BUSCAR EL PEDIDO
        // ==========================================

        const pedido = await Pedido.findByPk(
            pedido_id,
            {
                include: [
                    {
                        model: DetallePedido,
                        as: "detalles",

                        include: [
                            {
                                model: Producto,
                                as: "producto"
                            }
                        ]
                    }
                ]
            }
        );


        // ==========================================
        // 3. VERIFICAR QUE EXISTA
        // ==========================================

        if (!pedido) {

            return res.status(404).json({
                mensaje: "Pedido no encontrado"
            });

        }


        // ==========================================
        // 4. VERIFICAR PROPIETARIO DEL PEDIDO
        // ==========================================

        if (
            req.usuario.rol !== "admin" &&
            pedido.usuario_id !== req.usuario.id
        ) {

            return res.status(403).json({
                mensaje:
                    "No tienes permiso para pagar este pedido"
            });

        }


        // ==========================================
        // 5. VERIFICAR QUE TENGA PRODUCTOS
        // ==========================================

        if (
            !pedido.detalles ||
            pedido.detalles.length === 0
        ) {

            return res.status(400).json({
                mensaje:
                    "El pedido no tiene productos"
            });

        }


        // ==========================================
        // 6. VERIFICAR ESTADO DEL PEDIDO
        // ==========================================

        if (pedido.estado === "cancelado") {

            return res.status(400).json({
                mensaje:
                    "No se puede pagar un pedido cancelado"
            });

        }


        // ==========================================
        // 7. VERIFICAR SI YA FUE PAGADO
        // ==========================================

        if (pedido.estado_pago === "pagado") {

            return res.status(400).json({
                mensaje:
                    "Este pedido ya fue pagado"
            });

        }


        // ==========================================
        // 8. CREAR LINE ITEMS PARA STRIPE
        // ==========================================

        const line_items = pedido.detalles.map(
            (detalle) => {

                return {

                    price_data: {

                        currency: "mxn",

                        product_data: {

                            name:
                                detalle.producto.nombre,

                            description:
                                detalle.producto.descripcion ||
                                "Producto StreetZone",

                            ...(detalle.producto.imagen
                                ? {
                                    images: [
                                        detalle.producto.imagen
                                    ]
                                }
                                : {})
                        },

                        unit_amount:
                            Math.round(
                                Number(
                                    detalle.precio_unitario
                                ) * 100
                            )
                    },

                    quantity:
                        detalle.cantidad
                };

            }
        );


        // ==========================================
        // 9. CREAR SESIÓN DE STRIPE CHECKOUT
        // ==========================================

        const session =
            await stripe.checkout.sessions.create({

                payment_method_types: [
                    "card"
                ],

                line_items,

                mode: "payment",

                success_url:
                    `http://localhost:3000/index.html?pago=exitoso&pedido=${pedido.id}`,

                cancel_url:
                    "http://localhost:3000/index.html?pago=cancelado",

                metadata: {

                    pedido_id:
                        String(pedido.id),

                    usuario_id:
                        String(pedido.usuario_id)
                }

            });


        // ==========================================
        // 10. GUARDAR SESSION ID EN POSTGRESQL
        // ==========================================

        await pedido.update({

            stripe_checkout_session_id:
                session.id

        });


        // ==========================================
        // 11. RESPUESTA
        // ==========================================

        return res.status(200).json({

            mensaje:
                "Sesión de pago creada correctamente",

            url:
                session.url,

            session_id:
                session.id

        });


    } catch (error) {

        console.error(
            "❌ Error al crear Checkout de Stripe:",
            error
        );


        return res.status(500).json({

            mensaje:
                "Error al crear la sesión de pago",

            error:
                error.message

        });

    }

};

const webhookStripe = async (req, res) => {

    const sig = req.headers["stripe-signature"];

    let event;

    // ==========================================
    // 1. VERIFICAR WEBHOOK DE STRIPE
    // ==========================================

    try {

        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

    } catch (error) {

        console.error(
            "❌ Error verificando webhook de Stripe:",
            error.message
        );

        return res.status(400).send(
            `Webhook Error: ${error.message}`
        );

    }


    // ==========================================
    // 2. PROCESAR EVENTO
    // ==========================================

    try {

        if (
            event.type ===
            "checkout.session.completed"
        ) {

            const session =
                event.data.object;


            // ==========================================
            // 3. OBTENER PEDIDO_ID
            // ==========================================

            const pedido_id =
                session.metadata?.pedido_id;


            if (!pedido_id) {

                console.error(
                    "❌ El webhook no contiene pedido_id"
                );

                return res.status(400).json({
                    mensaje:
                        "El webhook no contiene pedido_id"
                });

            }


            // ==========================================
            // 4. INICIAR TRANSACCIÓN
            // ==========================================

            const resultado =
                await sequelize.transaction(
                    async (transaction) => {

                        const pedido =
                            await Pedido.findByPk(
                                pedido_id,
                                {
                                    transaction,
                                    lock: transaction.LOCK.UPDATE
                                }
                            );


                        // ==========================================
                        // 5. VERIFICAR PEDIDO
                        // ==========================================

                        if (!pedido) {

                            throw new Error(
                                `Pedido ${pedido_id} no encontrado`
                            );

                        }


                        // ==========================================
                        // 6. EVITAR DUPLICAR EL DESCUENTO
                        // ==========================================

                        if (
                            pedido.estado_pago ===
                            "pagado"
                        ) {

                            console.log(
                                `⚠️ Pedido ${pedido_id} ya estaba pagado.`
                            );

                            return {
                                yaProcesado: true
                            };

                        }


                        // ==========================================
                        // 7. OBTENER DETALLES DEL PEDIDO
                        // ==========================================

                        const detalles =
                            await DetallePedido.findAll({

                                where: {
                                    pedido_id
                                },

                                transaction

                            });


                        if (
                            !detalles ||
                            detalles.length === 0
                        ) {

                            throw new Error(
                                `El pedido ${pedido_id} no tiene detalles`
                            );

                        }


                        // ==========================================
                        // 8. DESCONTAR STOCK
                        // ==========================================

                        for (
                            const detalle
                            of detalles
                        ) {

                            const producto =
                                await Producto.findByPk(
                                    detalle.producto_id,
                                    {
                                        transaction,
                                        lock:
                                            transaction.LOCK.UPDATE
                                    }
                                );


                            if (!producto) {

                                throw new Error(
                                    `Producto ${detalle.producto_id} no encontrado`
                                );

                            }


                            const stockActual =
                                Number(
                                    producto.stock || 0
                                );

                            const cantidadComprada =
                                Number(
                                    detalle.cantidad || 0
                                );


                            // ==========================================
                            // 9. VERIFICAR STOCK
                            // ==========================================

                            if (
                                stockActual <
                                cantidadComprada
                            ) {

                                throw new Error(
                                    `Stock insuficiente para el producto ${producto.id}. Stock disponible: ${stockActual}, solicitado: ${cantidadComprada}`
                                );

                            }


                            // ==========================================
                            // 10. RESTAR STOCK
                            // ==========================================

                            producto.stock =
                                stockActual -
                                cantidadComprada;


                            await producto.save({
                                transaction
                            });


                            console.log(
                                `📦 Stock actualizado - ${producto.nombre}: ${stockActual} → ${producto.stock}`
                            );

                        }


                        // ==========================================
                        // 11. ACTUALIZAR PEDIDO
                        // ==========================================

                        await pedido.update(

                            {

                                estado_pago:
                                    "pagado",

                                estado:
                                    "confirmado",

                                stripe_checkout_session_id:
                                    session.id,

                                stripe_payment_intent_id:
                                    session.payment_intent

                            },

                            {
                                transaction
                            }

                        );


                        console.log(
                            `✅ Pago confirmado para pedido ${pedido_id}`
                        );


                        console.log(
                            `📦 Stock descontado correctamente para pedido ${pedido_id}`
                        );


                        return {
                            yaProcesado: false
                        };

                    }
                );


            // ==========================================
            // 12. RESULTADO
            // ==========================================

            if (resultado.yaProcesado) {

                console.log(
                    `ℹ️ El pedido ${pedido_id} ya había sido procesado`
                );

            } else {

                console.log(
                    `🎉 Pedido ${pedido_id} procesado completamente`
                );

            }

        }


        // ==========================================
        // 13. RESPONDER A STRIPE
        // ==========================================

        return res.status(200).json({

            recibido: true

        });


    } catch (error) {

        console.error(
            "❌ Error procesando webhook:",
            error
        );

        return res.status(500).json({

            mensaje:
                "Error procesando webhook",

            error:
                error.message

        });

    }

};

module.exports = {
    crearCheckout,
    webhookStripe
};