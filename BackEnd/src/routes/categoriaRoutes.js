const express = require("express");

const { Categoria, Producto } = require("../models");

const router = express.Router();

/**
 * Obtener todas las categorías
 */
router.get("/", async (req, res) => {
    try {
        const categorias = await Categoria.findAll({
            order: [["id", "ASC"]]
        });

        res.json(categorias);

    } catch (error) {
        console.error("❌ Error al obtener categorías:", error);

        res.status(500).json({
            mensaje: "Error al obtener las categorías"
        });
    }
});

/**
 * Obtener una categoría por ID
 */
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const categoria = await Categoria.findByPk(id, {
            include: [
                {
                    model: Producto,
                    as: "productos"
                }
            ]
        });

        if (!categoria) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        res.json(categoria);

    } catch (error) {
        console.error("❌ Error al obtener la categoría:", error);

        res.status(500).json({
            mensaje: "Error al obtener la categoría"
        });
    }
});

/**
 * Crear una categoría
 */
router.post("/", async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            activo
        } = req.body;

        if (!nombre) {
            return res.status(400).json({
                mensaje: "El nombre de la categoría es obligatorio"
            });
        }

        const categoriaExistente = await Categoria.findOne({
            where: { nombre }
        });

        if (categoriaExistente) {
            return res.status(409).json({
                mensaje: "La categoría ya existe"
            });
        }

        const nuevaCategoria = await Categoria.create({
            nombre,
            descripcion,
            activo: activo ?? true
        });

        res.status(201).json(nuevaCategoria);

    } catch (error) {
        console.error("❌ Error al crear categoría:", error);

        res.status(500).json({
            mensaje: "Error al crear la categoría"
        });
    }
});

/**
 * Actualizar una categoría
 */
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nombre,
            descripcion,
            activo
        } = req.body;

        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        if (nombre !== undefined) {
            const categoriaExistente = await Categoria.findOne({
                where: { nombre }
            });

            if (
                categoriaExistente &&
                categoriaExistente.id !== Number(id)
            ) {
                return res.status(409).json({
                    mensaje: "Ya existe otra categoría con ese nombre"
                });
            }
        }

        await categoria.update({
            nombre,
            descripcion,
            activo
        });

        res.json(categoria);

    } catch (error) {
        console.error("❌ Error al actualizar categoría:", error);

        res.status(500).json({
            mensaje: "Error al actualizar la categoría"
        });
    }
});

/**
 * Eliminar una categoría
 */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        const productos = await Producto.count({
            where: {
                categoria_id: id
            }
        });

        if (productos > 0) {
            return res.status(409).json({
                mensaje:
                    "No se puede eliminar la categoría porque tiene productos asociados"
            });
        }

        await categoria.destroy();

        res.json({
            mensaje: "Categoría eliminada correctamente"
        });

    } catch (error) {
        console.error("❌ Error al eliminar categoría:", error);

        res.status(500).json({
            mensaje: "Error al eliminar la categoría"
        });
    }
});

module.exports = router;