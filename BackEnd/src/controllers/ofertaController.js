const { Oferta, Producto } = require("../models");

// Obtener todas las ofertas
const obtenerOfertas = async (req, res) => {
    try {
        const ofertas = await Oferta.findAll({
            include: [
                {
                    model: Producto,
                    as: "producto",
                    attributes: [
                        "id",
                        "nombre",
                        "precio",
                        "imagen",
                        "stock",
                        "categoria_id"
                    ]
                }
            ],
            order: [["id", "ASC"]]
        });

        res.status(200).json(ofertas);

    } catch (error) {
        console.error("❌ Error al obtener ofertas:", error);

        res.status(500).json({
            mensaje: "Error al obtener las ofertas"
        });
    }
};

// Obtener oferta por ID
const obtenerOfertaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const oferta = await Oferta.findByPk(id, {
            include: [
                {
                    model: Producto,
                    as: "producto",
                    attributes: [
                        "id",
                        "nombre",
                        "precio",
                        "imagen",
                        "stock",
                        "categoria_id"
                    ]
                }
            ]
        });

        if (!oferta) {
            return res.status(404).json({
                mensaje: "Oferta no encontrada"
            });
        }

        res.status(200).json(oferta);

    } catch (error) {
        console.error("❌ Error al obtener oferta:", error);

        res.status(500).json({
            mensaje: "Error al obtener la oferta"
        });
    }
};

// Crear oferta
const crearOferta = async (req, res) => {
    try {
        const {
            producto_id,
            precio_oferta,
            descuento,
            fecha_inicio,
            fecha_fin,
            activo
        } = req.body;

        if (
            producto_id === undefined ||
            precio_oferta === undefined ||
            descuento === undefined ||
            !fecha_inicio
        ) {
            return res.status(400).json({
                mensaje:
                    "producto_id, precio_oferta, descuento y fecha_inicio son obligatorios"
            });
        }

        if (precio_oferta < 0) {
            return res.status(400).json({
                mensaje: "El precio de oferta no puede ser negativo"
            });
        }

        if (descuento <= 0 || descuento > 100) {
            return res.status(400).json({
                mensaje: "El descuento debe ser mayor a 0 y menor o igual a 100"
            });
        }

        const producto = await Producto.findByPk(producto_id);

        if (!producto) {
            return res.status(404).json({
                mensaje: "El producto indicado no existe"
            });
        }

        const nuevaOferta = await Oferta.create({
            producto_id,
            precio_oferta,
            descuento,
            fecha_inicio,
            fecha_fin,
            activo: activo !== undefined ? activo : true
        });

        const ofertaCreada = await Oferta.findByPk(nuevaOferta.id, {
            include: [
                {
                    model: Producto,
                    as: "producto",
                    attributes: [
                        "id",
                        "nombre",
                        "precio",
                        "imagen",
                        "stock",
                        "categoria_id"
                    ]
                }
            ]
        });

        res.status(201).json(ofertaCreada);

    } catch (error) {
        console.error("❌ Error al crear oferta:", error);

        res.status(500).json({
            mensaje: "Error al crear la oferta"
        });
    }
};

// Actualizar oferta
const actualizarOferta = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            producto_id,
            precio_oferta,
            descuento,
            fecha_inicio,
            fecha_fin,
            activo
        } = req.body;

        const oferta = await Oferta.findByPk(id);

        if (!oferta) {
            return res.status(404).json({
                mensaje: "Oferta no encontrada"
            });
        }

        if (producto_id !== undefined) {
            const producto = await Producto.findByPk(producto_id);

            if (!producto) {
                return res.status(404).json({
                    mensaje: "El producto indicado no existe"
                });
            }
        }

        if (
            precio_oferta !== undefined &&
            precio_oferta < 0
        ) {
            return res.status(400).json({
                mensaje: "El precio de oferta no puede ser negativo"
            });
        }

        if (
            descuento !== undefined &&
            (descuento <= 0 || descuento > 100)
        ) {
            return res.status(400).json({
                mensaje: "El descuento debe ser mayor a 0 y menor o igual a 100"
            });
        }

        const datosActualizados = {};

        if (producto_id !== undefined) {
            datosActualizados.producto_id = producto_id;
        }

        if (precio_oferta !== undefined) {
            datosActualizados.precio_oferta = precio_oferta;
        }

        if (descuento !== undefined) {
            datosActualizados.descuento = descuento;
        }

        if (fecha_inicio !== undefined) {
            datosActualizados.fecha_inicio = fecha_inicio;
        }

        if (fecha_fin !== undefined) {
            datosActualizados.fecha_fin = fecha_fin;
        }

        if (activo !== undefined) {
            datosActualizados.activo = activo;
        }

        await oferta.update(datosActualizados);

        const ofertaActualizada = await Oferta.findByPk(id, {
            include: [
                {
                    model: Producto,
                    as: "producto",
                    attributes: [
                        "id",
                        "nombre",
                        "precio",
                        "imagen",
                        "stock",
                        "categoria_id"
                    ]
                }
            ]
        });

        res.status(200).json(ofertaActualizada);

    } catch (error) {
        console.error("❌ Error al actualizar oferta:", error);

        res.status(500).json({
            mensaje: "Error al actualizar la oferta"
        });
    }
};

// Eliminar oferta
const eliminarOferta = async (req, res) => {
    try {
        const { id } = req.params;

        const oferta = await Oferta.findByPk(id);

        if (!oferta) {
            return res.status(404).json({
                mensaje: "Oferta no encontrada"
            });
        }

        await oferta.destroy();

        res.status(200).json({
            mensaje: "Oferta eliminada correctamente"
        });

    } catch (error) {
        console.error("❌ Error al eliminar oferta:", error);

        res.status(500).json({
            mensaje: "Error al eliminar la oferta"
        });
    }
};

module.exports = {
    obtenerOfertas,
    obtenerOfertaPorId,
    crearOferta,
    actualizarOferta,
    eliminarOferta
};