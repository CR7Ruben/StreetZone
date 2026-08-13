const express = require("express");

const { Producto, Categoria } = require("../models");

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Productos
 *   description: Operaciones relacionadas con los productos
 */

/**
 * @openapi
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos
 *     description: Obtiene todos los productos registrados junto con su categoría.
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", async (req, res) => {
    try {
        const productos = await Producto.findAll({
            include: [
                {
                    model: Categoria,
                    as: "categoria",
                    attributes: ["id", "nombre"]
                }
            ]
        });

        res.json(productos);

    } catch (error) {
        console.error("❌ Error al obtener productos:", error);

        res.status(500).json({
            mensaje: "Error al obtener los productos"
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Producto.findByPk(id, {
            include: [
                {
                    model: Categoria,
                    as: "categoria",
                    attributes: ["id", "nombre"]
                }
            ]
        });

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.json(producto);

    } catch (error) {
        console.error("❌ Error al obtener el producto:", error);

        res.status(500).json({
            mensaje: "Error al obtener el producto"
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            precio,
            stock,
            imagen,
            categoria_id
        } = req.body;

        // Validaciones básicas
        if (!nombre || precio === undefined || !categoria_id) {
            return res.status(400).json({
                mensaje: "Nombre, precio y categoria_id son obligatorios"
            });
        }

        // Verificar que la categoría exista
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
            stock: stock ?? 0,
            imagen,
            categoria_id
        });

        // Devolver el producto creado junto con su categoría
        const productoCreado = await Producto.findByPk(
            nuevoProducto.id,
            {
                include: [
                    {
                        model: Categoria,
                        as: "categoria",
                        attributes: ["id", "nombre"]
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
});

router.put("/:id", async (req, res) => {
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

        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        // Si se envía categoria_id, validar que exista
        if (categoria_id !== undefined) {
            const categoria = await Categoria.findByPk(categoria_id);

            if (!categoria) {
                return res.status(404).json({
                    mensaje: "La categoría indicada no existe"
                });
            }
        }

        await producto.update({
            nombre,
            descripcion,
            precio,
            stock,
            imagen,
            categoria_id,
            activo
        });

        const productoActualizado = await Producto.findByPk(id, {
            include: [
                {
                    model: Categoria,
                    as: "categoria",
                    attributes: ["id", "nombre"]
                }
            ]
        });

        res.json(productoActualizado);

    } catch (error) {
        console.error("❌ Error al actualizar producto:", error);

        res.status(500).json({
            mensaje: "Error al actualizar el producto"
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        await producto.destroy();

        res.json({
            mensaje: "Producto eliminado correctamente"
        });

    } catch (error) {
        console.error("❌ Error al eliminar producto:", error);

        res.status(500).json({
            mensaje: "Error al eliminar el producto"
        });
    }
});

module.exports = router;