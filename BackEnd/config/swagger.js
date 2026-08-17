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
            },
            {
                name: "DetallePedidos",
                description: "Operaciones relacionadas con los detalles de pedidos"
            },
            {
                name: "Auth",
                description: "Operaciones de autenticación y autorización"
            },
            {
                name: "Pagos",
                description: "Operaciones relacionadas con pagos mediante Stripe"
            },
            {
                name: "MensajesContacto",
                description: "Operaciones relacionadas con mensajes de contacto"
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

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
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

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        403: {
                            description:
                                "No tienes permisos para realizar esta acción"
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

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
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

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        403: {
                            description:
                                "No tienes permisos para realizar esta acción"
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

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
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

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        403: {
                            description:
                                "No tienes permisos para realizar esta acción"
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

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
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

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        403: {
                            description:
                                "No tienes permisos para realizar esta acción"
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

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
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

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        403: {
                            description:
                                "No tienes permisos para realizar esta acción"
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

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
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

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        403: {
                            description:
                                "No tienes permisos para realizar esta acción"
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

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    responses: {
                        200: {
                            description:
                                "Usuarios encontrados correctamente"
                        },

                        404: {
                            description:
                                "Usuario no encontrado"
                        },

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        403: {
                            description:
                                "No tienes permisos para realizar esta acción"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                },
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

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    responses: {
                        200: {
                            description:
                                "Usuario encontrado correctamente"
                        },

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        403: {
                            description:
                                "No tienes permisos para realizar esta acción"
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

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    responses: {
                        200: {
                            description:
                                "Usuario actualizado correctamente"
                        },

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        403: {
                            description:
                                "No tienes permisos para realizar esta acción"
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

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    responses: {
                        200: {
                            description:
                                "Usuario eliminado correctamente"
                        },

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        403: {
                            description:
                                "No tienes permisos para realizar esta acción"
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

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    requestBody: {
                        required: true,

                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",

                                    required: [
                                        "producto_id",
                                        "precio_oferta",
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

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        403: {
                            description:
                                "No tienes permisos para realizar esta acción"
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

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
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

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        403: {
                            description:
                                "No tienes permisos para realizar esta acción"
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

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
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

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        403: {
                            description:
                                "No tienes permisos para realizar esta acción"
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
                        "Obtiene los pedidos permitidos para el usuario autenticado junto con la información del usuario y los detalles de cada pedido.",
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],

                    responses: {
                        200: {
                            description:
                                "Lista de pedidos obtenida correctamente"
                        },

                        401: {
                            description:
                                "Token inválido o no proporcionado"
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
                        "Crea un nuevo pedido para el usuario autenticado. El total inicia en 0 y se calcula automáticamente al agregar los detalles del pedido.",

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],

                    requestBody: {
                        required: false,

                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        usuario_id: {
                                            type: "integer",
                                            description:
                                                "ID del usuario. Solo puede ser utilizado por un administrador.",
                                            example: 1
                                        }
                                    }
                                },

                                example: {}
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
                                "El usuario_id es obligatorio para un administrador"
                        },

                        401: {
                            description:
                                "Token inválido o no proporcionado"
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
                        "Obtiene un pedido específico junto con la información del usuario y los detalles de los productos incluidos.",
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
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

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        403: {
                            description:
                                "No tienes permisos para realizar esta acción"
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
                        "Actualiza la información administrativa de un pedido. El total no puede modificarse manualmente; se calcula automáticamente a partir de los detalles.",
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
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
                                            type: "integer",
                                            description:
                                                "ID del usuario asociado al pedido."
                                        },

                                        estado: {
                                            type: "string",
                                            enum: [
                                                "pendiente",
                                                "confirmado",
                                                "procesando",
                                                "enviado",
                                                "entregado",
                                                "cancelado"
                                            ],
                                            description:
                                                "Nuevo estado del pedido."
                                        },

                                        estado_pago: {
                                            type: "string",
                                            enum: [
                                                "pendiente",
                                                "pagado",
                                                "fallido",
                                                "reembolsado"
                                            ],
                                            description:
                                                "Nuevo estado del pago."
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

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        403: {
                            description:
                                "No tienes permisos para realizar esta acción"
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

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
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

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        403: {
                            description:
                                "No tienes permisos para realizar esta acción"
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

            // Detalle de pedidos
            "/api/detalle-pedidos": {
                get: {
                    tags: ["DetallePedidos"],
                    summary: "Obtener todos los detalles de pedidos",
                    description:
                        "Obtiene todos los detalles registrados junto con el pedido y producto relacionados.",

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    responses: {
                        200: {
                            description:
                                "Lista de detalles obtenida correctamente"
                        },

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                },

                post: {
                    tags: ["DetallePedidos"],
                    summary: "Crear un detalle de pedido",
                    description:
                        "Registra un producto dentro de un pedido existente.",

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    requestBody: {
                        required: true,

                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",

                                    required: [
                                        "pedido_id",
                                        "producto_id",
                                        "cantidad"
                                    ],

                                    properties: {
                                        pedido_id: {
                                            type: "integer"
                                        },

                                        producto_id: {
                                            type: "integer"
                                        },

                                        cantidad: {
                                            type: "integer",
                                            minimum: 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description:
                                "Detalle de pedido creado correctamente"
                        },

                        400: {
                            description:
                                "Datos inválidos o stock insuficiente"
                        },

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        403: {
                            description:
                                "No tienes permisos para agregar productos a este pedido"
                        },

                        404: {
                            description:
                                "Pedido o producto no encontrado"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                }
            },

            "/api/detalle-pedidos/{id}": {
                get: {
                    tags: ["DetallePedidos"],
                    summary: "Obtener un detalle por ID",
                    description:
                        "Obtiene un detalle específico junto con su pedido y producto.",

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID del detalle",

                            schema: {
                                type: "integer"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description:
                                "Detalle encontrado correctamente"
                        },

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        403: {
                            description:
                                "No tienes permisos para acceder a este detalle"
                        },

                        404: {
                            description:
                                "Detalle de pedido no encontrado"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                },

                put: {
                    tags: ["DetallePedidos"],
                    summary: "Actualizar un detalle de pedido",
                    description:
                        "Actualiza el pedido, producto o cantidad de un detalle. El precio unitario se obtiene automáticamente del precio actual del producto.",

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID del detalle",
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
                                        pedido_id: {
                                            type: "integer",
                                            description:
                                                "ID del pedido"
                                        },

                                        producto_id: {
                                            type: "integer",
                                            description:
                                                "ID del producto"
                                        },

                                        cantidad: {
                                            type: "integer",
                                            minimum: 1,
                                            description:
                                                "Nueva cantidad del producto"
                                        }
                                    }
                                }
                            }
                        }
                    },

                    responses: {
                        200: {
                            description:
                                "Detalle actualizado correctamente"
                        },

                        400: {
                            description:
                                "Datos inválidos, stock insuficiente o pedido finalizado"
                        },

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        403: {
                            description:
                                "No tienes permisos para realizar esta acción"
                        },

                        404: {
                            description:
                                "Detalle, pedido o producto no encontrado"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                },

                delete: {
                    tags: ["DetallePedidos"],
                    summary: "Eliminar un detalle de pedido",
                    description:
                        "Elimina un detalle de pedido existente.",

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID del detalle",

                            schema: {
                                type: "integer"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description:
                                "Detalle de pedido eliminado correctamente"
                        },

                        400: {
                            description:
                                "No se puede eliminar el detalle de un pedido entregado o cancelado"
                        },

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        403: {
                            description:
                                "No tienes permisos para realizar esta acción"
                        },

                        404: {
                            description:
                                "Detalle de pedido no encontrado"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                }
            },

            // Auth
            "/api/auth/registro": {
                post: {
                    tags: ["Auth"],
                    summary: "Registrar un usuario",
                    description:
                        "Registra un nuevo usuario y genera un token JWT.",

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
                                            type: "string",
                                            format: "email"
                                        },

                                        password: {
                                            type: "string",
                                            description:
                                                "Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
                                        }
                                    }
                                }
                            }
                        }
                    },

                    responses: {
                        201: {
                            description:
                                "Usuario registrado correctamente"
                        },

                        400: {
                            description:
                                "Datos inválidos"
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

            "/api/auth/login": {
                post: {
                    tags: ["Auth"],
                    summary: "Iniciar sesión",
                    description:
                        "Autentica un usuario y genera un token JWT.",

                    requestBody: {
                        required: true,

                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",

                                    required: [
                                        "email",
                                        "password"
                                    ],

                                    properties: {
                                        email: {
                                            type: "string",
                                            format: "email"
                                        },

                                        password: {
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
                                "Inicio de sesión correcto"
                        },

                        400: {
                            description:
                                "Email y password son obligatorios"
                        },

                        401: {
                            description:
                                "Credenciales incorrectas"
                        },

                        403: {
                            description:
                                "Usuario desactivado"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                }
            },

            "/api/auth/perfil": {
                get: {
                    tags: ["Auth"],
                    summary: "Obtener perfil autenticado",
                    description:
                        "Obtiene la información del usuario autenticado mediante JWT.",

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],

                    responses: {
                        200: {
                            description:
                                "Perfil obtenido correctamente"
                        },

                        401: {
                            description:
                                "Token inválido o no proporcionado"
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

            // Pagos
"/api/pagos/crear-checkout": {
    post: {
        tags: ["Pagos"],
        summary: "Crear una sesión de pago con Stripe",
        description:
            "Crea una sesión de Stripe Checkout para realizar el pago de un pedido del usuario autenticado.",

        security: [
            {
                bearerAuth: []
            }
        ],

        requestBody: {
            required: true,

            content: {
                "application/json": {
                    schema: {
                        type: "object",

                        required: [
                            "pedido_id"
                        ],

                        properties: {
                            pedido_id: {
                                type: "integer",
                                description:
                                    "ID del pedido que se desea pagar"
                            }
                        }
                    }
                }
            }
        },

        responses: {
            200: {
                description:
                    "Sesión de Stripe Checkout creada correctamente"
            },

            400: {
                description:
                    "El pedido no puede ser pagado o no tiene productos"
            },

            401: {
                description:
                    "Token inválido o no proporcionado"
            },

            403: {
                description:
                    "El pedido no pertenece al usuario autenticado"
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

            // Mensajes de contacto
            "/api/mensajes-contacto": {
                get: {
                    tags: ["MensajesContacto"],
                    summary: "Obtener todos los mensajes de contacto",
                    description:
                        "Obtiene todos los mensajes enviados mediante el formulario de contacto.",

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],

                    responses: {
                        200: {
                            description:
                                "Lista de mensajes obtenida correctamente"
                        },

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                },

                post: {
                    tags: ["MensajesContacto"],
                    summary: "Crear un mensaje de contacto",
                    description:
                        "Registra un nuevo mensaje enviado desde el formulario de contacto.",

                    requestBody: {
                        required: true,

                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",

                                    required: [
                                        "nombre",
                                        "email",
                                        "mensaje"
                                    ],

                                    properties: {
                                        nombre: {
                                            type: "string",
                                            example: "Rubén González"
                                        },

                                        email: {
                                            type: "string",
                                            format: "email",
                                            example:
                                                "ruben@example.com"
                                        },

                                        mensaje: {
                                            type: "string",
                                            example:
                                                "Hola, tengo una pregunta sobre un producto."
                                        }
                                    }
                                }
                            }
                        }
                    },

                    responses: {
                        201: {
                            description:
                                "Mensaje creado correctamente"
                        },

                        400: {
                            description:
                                "Datos obligatorios no proporcionados"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                }
            },

            "/api/mensajes-contacto/{id}": {
                get: {
                    tags: ["MensajesContacto"],
                    summary: "Obtener un mensaje por ID",
                    description:
                        "Obtiene un mensaje específico mediante su ID.",

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description:
                                "ID del mensaje",

                            schema: {
                                type: "integer"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description:
                                "Mensaje encontrado correctamente"
                        },

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        404: {
                            description:
                                "Mensaje no encontrado"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                },

                put: {
                    tags: ["MensajesContacto"],
                    summary: "Actualizar un mensaje",
                    description:
                        "Actualiza la información o el estado de atención de un mensaje.",

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description:
                                "ID del mensaje",

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
                                            type: "string",
                                            format: "email"
                                        },

                                        mensaje: {
                                            type: "string"
                                        },

                                        atendido: {
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
                                "Mensaje actualizado correctamente"
                        },

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        404: {
                            description:
                                "Mensaje no encontrado"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                },

                delete: {
                    tags: ["MensajesContacto"],
                    summary: "Eliminar un mensaje",
                    description:
                        "Elimina un mensaje de contacto existente.",

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],

                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description:
                                "ID del mensaje",

                            schema: {
                                type: "integer"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description:
                                "Mensaje eliminado correctamente"
                        },

                        401: {
                            description:
                                "Token inválido o no proporcionado"
                        },

                        404: {
                            description:
                                "Mensaje no encontrado"
                        },

                        500: {
                            description:
                                "Error interno del servidor"
                        }
                    }
                }
            },
        },

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },

    apis: []
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;