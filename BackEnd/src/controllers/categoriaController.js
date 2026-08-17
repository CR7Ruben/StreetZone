const { Categoria, Producto } = require("../models");

// ============================================
// OBTENER TODAS LAS CATEGORÍAS
// ============================================

const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.findAll({
            include: [
                {
                    model: Producto,
                    as: "productos",
                    attributes: [
                        "id",
                        "nombre",
                        "precio",
                        "stock",
                        "imagen",
                        "activo"
                    ]
                }
            ],
            order: [["id", "ASC"]]
        });

        res.status(200).json(categorias);

    } catch (error) {
        console.error(
            "❌ Error al obtener categorías:",
            error
        );

        res.status(500).json({
            mensaje: "Error al obtener las categorías"
        });
    }
};


// ============================================
// OBTENER CATEGORÍA POR ID
// ============================================

const obtenerCategoriaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const categoria = await Categoria.findByPk(id, {
            include: [
                {
                    model: Producto,
                    as: "productos",
                    attributes: [
                        "id",
                        "nombre",
                        "precio",
                        "stock",
                        "imagen",
                        "activo"
                    ]
                }
            ]
        });

        if (!categoria) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        res.status(200).json(categoria);

    } catch (error) {
        console.error(
            "❌ Error al obtener categoría:",
            error
        );

        res.status(500).json({
            mensaje: "Error al obtener la categoría"
        });
    }
};


// ============================================
// CREAR CATEGORÍA
// ============================================

const crearCategoria = async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            activo
        } = req.body;

        // Validar nombre
        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({
                mensaje: "El nombre de la categoría es obligatorio"
            });
        }

        // Comprobar si ya existe
        const categoriaExistente = await Categoria.findOne({
            where: {
                nombre
            }
        });

        if (categoriaExistente) {
            return res.status(409).json({
                mensaje: "La categoría ya existe"
            });
        }

        // Crear categoría
        const nuevaCategoria = await Categoria.create({
            nombre,
            descripcion,
            activo: activo !== undefined ? activo : true
        });

        res.status(201).json(nuevaCategoria);

    } catch (error) {
        console.error(
            "❌ Error al crear categoría:",
            error
        );

        res.status(500).json({
            mensaje: "Error al crear la categoría"
        });
    }
};


// ============================================
// ACTUALIZAR CATEGORÍA
// ============================================

const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nombre,
            descripcion,
            activo
        } = req.body;

        // Buscar categoría
        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        // Comprobar nombre duplicado
        if (nombre !== undefined) {

            if (!nombre.trim()) {
                return res.status(400).json({
                    mensaje:
                        "El nombre de la categoría no puede estar vacío"
                });
            }

            if (nombre !== categoria.nombre) {

                const categoriaExistente =
                    await Categoria.findOne({
                        where: {
                            nombre
                        }
                    });

                if (categoriaExistente) {
                    return res.status(409).json({
                        mensaje:
                            "Ya existe otra categoría con ese nombre"
                    });
                }
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

        if (activo !== undefined) {
            datosActualizados.activo = activo;
        }

        // Actualizar
        await categoria.update(datosActualizados);

        res.status(200).json(categoria);

    } catch (error) {
        console.error(
            "❌ Error al actualizar categoría:",
            error
        );

        res.status(500).json({
            mensaje: "Error al actualizar la categoría"
        });
    }
};


// ============================================
// ELIMINAR CATEGORÍA
// ============================================

const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        // Verificar si tiene productos
        const cantidadProductos = await Producto.count({
            where: {
                categoria_id: id
            }
        });

        if (cantidadProductos > 0) {
            return res.status(409).json({
                mensaje:
                    "No se puede eliminar la categoría porque tiene productos asociados"
            });
        }

        await categoria.destroy();

        res.status(200).json({
            mensaje: "Categoría eliminada correctamente"
        });

    } catch (error) {
        console.error(
            "❌ Error al eliminar categoría:",
            error
        );

        res.status(500).json({
            mensaje: "Error al eliminar la categoría"
        });
    }
};


// ============================================
// EXPORTACIONES
// ============================================

module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};