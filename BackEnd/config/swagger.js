const swaggerJSDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "StreetZone API",
            version: "1.0.0",
            description:
                "API REST para el sistema de comercio electrónico StreetZone"
        },

        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor local"
            }
        ],

        tags: [
            {
                name: "Productos",
                description: "Operaciones relacionadas con productos"
            },
            {
                name: "Categorias",
                description: "Operaciones relacionadas con categorías"
            },
        ],

        paths: {
            // Productos
            "/api/productos": {
                get: {
                    tags: ["Productos"],
                    summary: "Obtener todos los productos",
                    description:
                        "Obtiene todos los productos registrados en StreetZone junto con su categoría.",

                    responses: {
                        200: {
                            description:
                                "Lista de productos obtenida correctamente"
                        },

                        500: {
                            description: "Error interno del servidor"
                        }
                    }
                },

                post: {
                    tags: ["Productos"],
                    summary: "Crear un nuevo producto",
                    description:
                        "Registra un nuevo producto en la base de datos.",

                    requestBody: {
                        required: true,

                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",

                                    required: [
                                        "nombre",
                                        "precio",
                                        "categoria_id"
                                    ],

                                    properties: {
                                        nombre: {
                                            type: "string"
                                        },

                                        descripcion: {
                                            type: "string"
                                        },

                                        precio: {
                                            type: "number",
                                            format: "double"
                                        },

                                        stock: {
                                            type: "integer"
                                        },

                                        imagen: {
                                            type: "string"
                                        },

                                        categoria_id: {
                                            type: "integer"
                                        }
                                    }
                                }
                            }
                        }
                    },

                    responses: {
                        201: {
                            description: "Producto creado correctamente"
                        },

                        400: {
                            description: "Datos obligatorios faltantes"
                        },

                        404: {
                            description: "La categoría no existe"
                        },

                        500: {
                            description: "Error interno del servidor"
                        }
                    }
                }
            },

            "/api/productos/{id}": {
                get: {
                    tags: ["Productos"],
                    summary: "Obtener un producto por ID",
                    description:
                        "Obtiene un producto específico junto con su categoría.",

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID del producto",

                            schema: {
                                type: "integer"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description:
                                "Producto encontrado correctamente"
                        },

                        404: {
                            description: "Producto no encontrado"
                        },

                        500: {
                            description: "Error interno del servidor"
                        }
                    }
                },

                put: {
                    tags: ["Productos"],
                    summary: "Actualizar un producto",
                    description:
                        "Actualiza la información de un producto existente.",

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID del producto",

                            schema: {
                                type: "integer"
                            }
                        }
                    ],

                    requestBody: {
                        required: true,

                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",

                                    properties: {
                                        nombre: {
                                            type: "string"
                                        },

                                        descripcion: {
                                            type: "string"
                                        },

                                        precio: {
                                            type: "number",
                                            format: "double"
                                        },

                                        stock: {
                                            type: "integer"
                                        },

                                        imagen: {
                                            type: "string"
                                        },

                                        categoria_id: {
                                            type: "integer"
                                        },

                                        activo: {
                                            type: "boolean"
                                        }
                                    }
                                }
                            }
                        }
                    },

                    responses: {
                        200: {
                            description:
                                "Producto actualizado correctamente"
                        },

                        404: {
                            description:
                                "Producto o categoría no encontrada"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                },

                delete: {
                    tags: ["Productos"],
                    summary: "Eliminar un producto",
                    description:
                        "Elimina un producto existente de la base de datos.",

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID del producto",

                            schema: {
                                type: "integer"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description:
                                "Producto eliminado correctamente"
                        },

                        404: {
                            description:
                                "Producto no encontrado"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                }
            },
            "/api/categorias": {
                get: {
                    tags: ["Categorias"],
                    summary: "Obtener todas las categorías",
                    description:
                        "Obtiene todas las categorías registradas en StreetZone.",

                    responses: {
                        200: {
                            description:
                                "Lista de categorías obtenida correctamente"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                },

                post: {
                    tags: ["Categorias"],
                    summary: "Crear una nueva categoría",
                    description:
                        "Registra una nueva categoría en la base de datos.",

                    requestBody: {
                        required: true,

                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",

                                    required: [
                                        "nombre"
                                    ],

                                    properties: {
                                        nombre: {
                                            type: "string"
                                        },

                                        descripcion: {
                                            type: "string"
                                        },

                                        activo: {
                                            type: "boolean"
                                        }
                                    }
                                }
                            }
                        }
                    },

                    responses: {
                        201: {
                            description:
                                "Categoría creada correctamente"
                        },

                        400: {
                            description:
                                "El nombre de la categoría es obligatorio"
                        },

                        409: {
                            description:
                                "La categoría ya existe"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                }
            },

            "/api/categorias/{id}": {
                get: {
                    tags: ["Categorias"],
                    summary: "Obtener una categoría por ID",
                    description:
                        "Obtiene una categoría específica junto con sus productos.",

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID de la categoría",

                            schema: {
                                type: "integer"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description:
                                "Categoría encontrada correctamente"
                        },

                        404: {
                            description:
                                "Categoría no encontrada"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                },

                put: {
                    tags: ["Categorias"],
                    summary: "Actualizar una categoría",
                    description:
                        "Actualiza la información de una categoría existente.",

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID de la categoría",

                            schema: {
                                type: "integer"
                            }
                        }
                    ],

                    requestBody: {
                        required: true,

                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",

                                    properties: {
                                        nombre: {
                                            type: "string"
                                        },

                                        descripcion: {
                                            type: "string"
                                        },

                                        activo: {
                                            type: "boolean"
                                        }
                                    }
                                }
                            }
                        }
                    },

                    responses: {
                        200: {
                            description:
                                "Categoría actualizada correctamente"
                        },

                        404: {
                            description:
                                "Categoría no encontrada"
                        },

                        409: {
                            description:
                                "Ya existe otra categoría con ese nombre"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                },

                delete: {
                    tags: ["Categorias"],
                    summary: "Eliminar una categoría",
                    description:
                        "Elimina una categoría que no tenga productos asociados.",

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID de la categoría",

                            schema: {
                                type: "integer"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description:
                                "Categoría eliminada correctamente"
                        },

                        404: {
                            description:
                                "Categoría no encontrada"
                        },

                        409: {
                            description:
                                "No se puede eliminar la categoría porque tiene productos asociados"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                }
            }
        }
    },

    apis: []
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;