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
            {
                name: "Usuarios",
                description: "Operaciones relacionadas con usuarios"
            },
            {
                name: "Ofertas",
                description: "Operaciones relacionadas con ofertas"
            },
            {
                name: "Pedidos",
                description: "Operaciones relacionadas con pedidos"
            }
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

            // Categorias
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
            },

            // Usuarios
            "/api/usuarios": {
                get: {
                    tags: ["Usuarios"],
                    summary: "Obtener todos los usuarios",
                    description:
                        "Obtiene todos los usuarios registrados sin mostrar sus contraseñas.",

                    responses: {
                        200: {
                            description:
                                "Lista de usuarios obtenida correctamente"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                },

                post: {
                    tags: ["Usuarios"],
                    summary: "Crear un nuevo usuario",
                    description:
                        "Registra un nuevo usuario en la base de datos.",

                    requestBody: {
                        required: true,

                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",

                                    required: [
                                        "nombre",
                                        "email",
                                        "password"
                                    ],

                                    properties: {
                                        nombre: {
                                            type: "string"
                                        },

                                        email: {
                                            type: "string"
                                        },

                                        password: {
                                            type: "string",
                                            description:
                                                "Mínimo 8 caracteres, con una mayúscula, una minúscula, un número y un carácter especial."
                                        },

                                        rol: {
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
                                "Usuario creado correctamente"
                        },

                        400: {
                            description:
                                "Datos obligatorios faltantes o contraseña inválida"
                        },

                        409: {
                            description:
                                "El correo electrónico ya está registrado"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                }
            },

            "/api/usuarios/{id}": {
                get: {
                    tags: ["Usuarios"],
                    summary: "Obtener un usuario por ID",
                    description:
                        "Obtiene la información de un usuario específico.",

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID del usuario",

                            schema: {
                                type: "integer"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description:
                                "Usuario encontrado correctamente"
                        },

                        404: {
                            description:
                                "Usuario no encontrado"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                },

                put: {
                    tags: ["Usuarios"],
                    summary: "Actualizar un usuario",
                    description:
                        "Actualiza la información de un usuario existente.",

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID del usuario",

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

                                        email: {
                                            type: "string"
                                        },

                                        password: {
                                            type: "string",
                                            description:
                                                "Mínimo 8 caracteres, con una mayúscula, una minúscula, un número y un carácter especial."
                                        },

                                        rol: {
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
                                "Usuario actualizado correctamente"
                        },

                        400: {
                            description:
                                "Contraseña inválida"
                        },

                        404: {
                            description:
                                "Usuario no encontrado"
                        },

                        409: {
                            description:
                                "El correo electrónico ya está registrado"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                },

                delete: {
                    tags: ["Usuarios"],
                    summary: "Eliminar un usuario",
                    description:
                        "Elimina un usuario de la base de datos.",

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID del usuario",

                            schema: {
                                type: "integer"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description:
                                "Usuario eliminado correctamente"
                        },

                        404: {
                            description:
                                "Usuario no encontrado"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                }
            },

            // Ofertas
            "/api/ofertas": {
                get: {
                    tags: ["Ofertas"],
                    summary: "Obtener todas las ofertas",
                    description:
                        "Obtiene todas las ofertas registradas junto con la información del producto.",

                    responses: {
                        200: {
                            description:
                                "Lista de ofertas obtenida correctamente"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                },

                post: {
                    tags: ["Ofertas"],
                    summary: "Crear una nueva oferta",
                    description:
                        "Registra una nueva oferta asociada a un producto existente.",

                    requestBody: {
                        required: true,

                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",

                                    required: [
                                        "producto_id",
                                        "precio_oferta",
                                        "descuento",
                                        "fecha_inicio"
                                    ],

                                    properties: {
                                        producto_id: {
                                            type: "integer"
                                        },

                                        precio_oferta: {
                                            type: "number",
                                            format: "double"
                                        },

                                        descuento: {
                                            type: "number",
                                            format: "double"
                                        },

                                        fecha_inicio: {
                                            type: "string",
                                            format: "date-time"
                                        },

                                        fecha_fin: {
                                            type: "string",
                                            format: "date-time"
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
                                "Oferta creada correctamente"
                        },

                        400: {
                            description:
                                "Datos obligatorios o valores de oferta inválidos"
                        },

                        404: {
                            description:
                                "El producto indicado no existe"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                }
            },

            "/api/ofertas/{id}": {
                get: {
                    tags: ["Ofertas"],
                    summary: "Obtener una oferta por ID",
                    description:
                        "Obtiene una oferta específica junto con la información del producto.",

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID de la oferta",

                            schema: {
                                type: "integer"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description:
                                "Oferta encontrada correctamente"
                        },

                        404: {
                            description:
                                "Oferta no encontrada"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                },

                put: {
                    tags: ["Ofertas"],
                    summary: "Actualizar una oferta",
                    description:
                        "Actualiza la información de una oferta existente.",

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID de la oferta",

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
                                        producto_id: {
                                            type: "integer"
                                        },

                                        precio_oferta: {
                                            type: "number",
                                            format: "double"
                                        },

                                        descuento: {
                                            type: "number",
                                            format: "double"
                                        },

                                        fecha_inicio: {
                                            type: "string",
                                            format: "date-time"
                                        },

                                        fecha_fin: {
                                            type: "string",
                                            format: "date-time"
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
                                "Oferta actualizada correctamente"
                        },

                        400: {
                            description:
                                "Valores de oferta inválidos"
                        },

                        404: {
                            description:
                                "Oferta o producto no encontrado"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                },

                delete: {
                    tags: ["Ofertas"],
                    summary: "Eliminar una oferta",
                    description:
                        "Elimina una oferta existente de la base de datos.",

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID de la oferta",

                            schema: {
                                type: "integer"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description:
                                "Oferta eliminada correctamente"
                        },

                        404: {
                            description:
                                "Oferta no encontrada"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                }
            },

            // Pedidos
          "/api/pedidos": {
                get: {
                    tags: ["Pedidos"],
                    summary: "Obtener todos los pedidos",
                    description:
                        "Obtiene todos los pedidos registrados junto con la información del usuario.",

                    responses: {
                        200: {
                            description:
                                "Lista de pedidos obtenida correctamente"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                },

                post: {
                    tags: ["Pedidos"],
                    summary: "Crear un nuevo pedido",
                    description:
                        "Registra un nuevo pedido asociado a un usuario existente.",

                    requestBody: {
                        required: true,

                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",

                                    required: [
                                        "usuario_id",
                                        "total"
                                    ],

                                    properties: {
                                        usuario_id: {
                                            type: "integer"
                                        },

                                        total_importe: {
                                            type: "number",
                                            format: "double"
                                        },

                                        estado_pedido: {
                                            type: "string"
                                        },

                                        estado_pago: {
                                            type: "string"
                                        },

                                        stripe_payment_intent_id: {
                                            type: "string"
                                        },

                                        stripe_checkout_session_id: {
                                            type: "string"
                                        }
                                    }
                                }
                            }
                        }
                    },

                    responses: {
                        201: {
                            description:
                                "Pedido creado correctamente"
                        },

                        400: {
                            description:
                                "Datos obligatorios o estados no válidos"
                        },

                        404: {
                            description:
                                "El usuario indicado no existe"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                }
            },

            "/api/pedidos/{id}": {
                get: {
                    tags: ["Pedidos"],
                    summary: "Obtener un pedido por ID",
                    description:
                        "Obtiene un pedido específico junto con la información del usuario.",

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID del pedido",

                            schema: {
                                type: "integer"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description:
                                "Pedido encontrado correctamente"
                        },

                        404: {
                            description:
                                "Pedido no encontrado"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                },

                put: {
                    tags: ["Pedidos"],
                    summary: "Actualizar un pedido",
                    description:
                        "Actualiza la información de un pedido existente.",

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID del pedido",

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
                                        usuario_id: {
                                            type: "integer"
                                        },

                                        total_pedido: {
                                            type: "number",
                                            format: "double"
                                        },

                                        estado_pedido: {
                                            type: "string"
                                        },

                                        estado_pago: {
                                            type: "string"
                                        },

                                        stripe_payment_intent_id: {
                                            type: "string"
                                        },

                                        stripe_checkout_session_id: {
                                            type: "string"
                                        }
                                    }
                                }
                            }
                        }
                    },

                    responses: {
                        200: {
                            description:
                                "Pedido actualizado correctamente"
                        },

                        400: {
                            description:
                                "Datos o estados no válidos"
                        },

                        404: {
                            description:
                                "Pedido o usuario no encontrado"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                },

                delete: {
                    tags: ["Pedidos"],
                    summary: "Eliminar un pedido",
                    description:
                        "Elimina un pedido de la base de datos.",

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID del pedido",

                            schema: {
                                type: "integer"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description:
                                "Pedido eliminado correctamente"
                        },

                        404: {
                            description:
                                "Pedido no encontrado"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                }
            },

            //
        }
    },

    apis: []
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;