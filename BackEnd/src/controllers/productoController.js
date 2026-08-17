const { Producto, Categoria } = require("../models");

// ============================================
// OBTENER TODOS LOS PRODUCTOS
// ============================================

const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll({
            include: [
                {
                    model: Categoria,
                    as: "categoria",
                    attributes: [
                        "id",
                        "nombre",
                        "descripcion"
                    ]
                }
            ],
            order: [["id", "ASC"]]
        });

        res.status(200).json(productos);

    } catch (error) {
        console.error("❌ Error al obtener productos:", error);

        res.status(500).json({
            mensaje: "Error al obtener los productos"
        });
    }
};


// ============================================
// OBTENER PRODUCTO POR ID
// ============================================

const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Producto.findByPk(id, {
            include: [
                {
                    model: Categoria,
                    as: "categoria",
                    attributes: [
                        "id",
                        "nombre",
                        "descripcion"
                    ]
                }
            ]
        });

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.status(200).json(producto);

    } catch (error) {
        console.error("❌ Error al obtener producto:", error);

        res.status(500).json({
            mensaje: "Error al obtener el producto"
        });
    }
};


// ============================================
// CREAR PRODUCTO
// ============================================

const crearProducto = async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            precio,
            stock,
            imagen,
            categoria_id
        } = req.body;

        // Validar campos obligatorios
        if (
            !nombre ||
            precio === undefined ||
            categoria_id === undefined
        ) {
            return res.status(400).json({
                mensaje:
                    "Nombre, precio y categoria_id son obligatorios"
            });
        }

        // Validar precio
        if (precio < 0) {
            return res.status(400).json({
                mensaje: "El precio no puede ser negativo"
            });
        }

        // Validar stock
        if (stock !== undefined && stock < 0) {
            return res.status(400).json({
                mensaje: "El stock no puede ser negativo"
            });
        }

        // Comprobar categoría
        const categoria = await Categoria.findByPk(categoria_id);

        if (!categoria) {
            return res.status(404).json({
                mensaje: "La categoría indicada no existe"
            });
        }

        // Crear producto
        const nuevoProducto = await Producto.create({
            nombre,
            descripcion,
            precio,
            stock: stock !== undefined ? stock : 0,
            imagen,
            categoria_id
        });

        // Obtener producto con categoría
        const productoCreado = await Producto.findByPk(
            nuevoProducto.id,
            {
                include: [
                    {
                        model: Categoria,
                        as: "categoria",
                        attributes: [
                            "id",
                            "nombre",
                            "descripcion"
                        ]
                    }
                ]
            }
        );

        res.status(201).json(productoCreado);

    } catch (error) {
        console.error("❌ Error al crear producto:", error);

        res.status(500).json({
            mensaje: "Error al crear el producto"
        });
    }
};


// ============================================
// ACTUALIZAR PRODUCTO
// ============================================

const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nombre,
            descripcion,
            precio,
            stock,
            imagen,
            categoria_id,
            activo
        } = req.body;

        // Buscar producto
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        // Validar precio
        if (precio !== undefined && precio < 0) {
            return res.status(400).json({
                mensaje: "El precio no puede ser negativo"
            });
        }

        // Validar stock
        if (stock !== undefined && stock < 0) {
            return res.status(400).json({
                mensaje: "El stock no puede ser negativo"
            });
        }

        // Validar categoría
        if (categoria_id !== undefined) {
            const categoria = await Categoria.findByPk(
                categoria_id
            );

            if (!categoria) {
                return res.status(404).json({
                    mensaje: "La categoría indicada no existe"
                });
            }
        }

        // Construir actualización
        const datosActualizados = {};

        if (nombre !== undefined) {
            datosActualizados.nombre = nombre;
        }

        if (descripcion !== undefined) {
            datosActualizados.descripcion = descripcion;
        }

        if (precio !== undefined) {
            datosActualizados.precio = precio;
        }

        if (stock !== undefined) {
            datosActualizados.stock = stock;
        }

        if (imagen !== undefined) {
            datosActualizados.imagen = imagen;
        }

        if (categoria_id !== undefined) {
            datosActualizados.categoria_id = categoria_id;
        }

        if (activo !== undefined) {
            datosActualizados.activo = activo;
        }

        // Actualizar
        await producto.update(datosActualizados);

        // Obtener producto actualizado
        const productoActualizado = await Producto.findByPk(
            id,
            {
                include: [
                    {
                        model: Categoria,
                        as: "categoria",
                        attributes: [
                            "id",
                            "nombre",
                            "descripcion"
                        ]
                    }
                ]
            }
        );

        res.status(200).json(productoActualizado);

    } catch (error) {
        console.error(
            "❌ Error al actualizar producto:",
            error
        );

        res.status(500).json({
            mensaje: "Error al actualizar el producto"
        });
    }
};


// ============================================
// ELIMINAR PRODUCTO
// ============================================

const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        await producto.destroy();

        res.status(200).json({
            mensaje: "Producto eliminado correctamente"
        });

    } catch (error) {
        console.error(
            "❌ Error al eliminar producto:",
            error
        );

        res.status(500).json({
            mensaje: "Error al eliminar el producto"
        });
    }
};


// ============================================
// EXPORTACIONES
// ============================================

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};