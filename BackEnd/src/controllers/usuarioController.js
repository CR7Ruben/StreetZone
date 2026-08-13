const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");

// ============================================
// VALIDACIONES
// ============================================

const validarCorreo = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validarPassword = (password) => {
    const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-])[A-Za-z\d@$!%*?&.#_\-]{8,}$/;

    return regex.test(password);
};

// ============================================
// OBTENER TODOS LOS USUARIOS
// ============================================

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: {
                exclude: ["password"]
            },
            order: [["id", "ASC"]]
        });

        res.status(200).json(usuarios);

    } catch (error) {
        console.error("❌ Error al obtener usuarios:", error);

        res.status(500).json({
            mensaje: "Error al obtener los usuarios"
        });
    }
};

// ============================================
// OBTENER USUARIO POR ID
// ============================================

const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id, {
            attributes: {
                exclude: ["password"]
            }
        });

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.status(200).json(usuario);

    } catch (error) {
        console.error("❌ Error al obtener usuario:", error);

        res.status(500).json({
            mensaje: "Error al obtener el usuario"
        });
    }
};

// ============================================
// CREAR USUARIO
// ============================================

const crearUsuario = async (req, res) => {
    try {
        const {
            nombre,
            email,
            password,
            rol,
            activo
        } = req.body;

        // Validar campos obligatorios
        if (!nombre || !email || !password) {
            return res.status(400).json({
                mensaje: "Nombre, email y password son obligatorios"
            });
        }

        // Validar correo
        if (!validarCorreo(email)) {
            return res.status(400).json({
                mensaje: "El correo electrónico no es válido"
            });
        }

        // Validar contraseña
        if (!validarPassword(password)) {
            return res.status(400).json({
                mensaje:
                    "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial"
            });
        }

        // Comprobar correo existente
        const usuarioExistente = await Usuario.findOne({
            where: {
                email
            }
        });

        if (usuarioExistente) {
            return res.status(409).json({
                mensaje: "El correo electrónico ya está registrado"
            });
        }

        // Generar hash de contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Crear usuario
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password: passwordHash,
            rol: rol || "cliente",
            activo: activo !== undefined ? activo : true
        });

        // Nunca devolver la contraseña
        res.status(201).json({
            id: nuevoUsuario.id,
            nombre: nuevoUsuario.nombre,
            email: nuevoUsuario.email,
            rol: nuevoUsuario.rol,
            activo: nuevoUsuario.activo,
            created_at: nuevoUsuario.created_at,
            updated_at: nuevoUsuario.updated_at
        });

    } catch (error) {
        console.error("❌ Error al crear usuario:", error);

        res.status(500).json({
            mensaje: "Error al crear el usuario"
        });
    }
};

// ============================================
// ACTUALIZAR USUARIO
// ============================================

const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nombre,
            email,
            password,
            rol,
            activo
        } = req.body;

        // Buscar usuario
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        // Validar correo si se quiere cambiar
        if (email !== undefined) {

            if (!validarCorreo(email)) {
                return res.status(400).json({
                    mensaje: "El correo electrónico no es válido"
                });
            }

            if (email !== usuario.email) {
                const emailExistente = await Usuario.findOne({
                    where: {
                        email
                    }
                });

                if (emailExistente) {
                    return res.status(409).json({
                        mensaje:
                            "El correo electrónico ya está registrado"
                    });
                }
            }
        }

        const datosActualizados = {};

        // Solo actualizar los campos enviados
        if (nombre !== undefined) {
            datosActualizados.nombre = nombre;
        }

        if (email !== undefined) {
            datosActualizados.email = email;
        }

        if (rol !== undefined) {
            datosActualizados.rol = rol;
        }

        if (activo !== undefined) {
            datosActualizados.activo = activo;
        }

        // Validar y volver a generar hash si cambia la contraseña
        if (password !== undefined) {

            if (!validarPassword(password)) {
                return res.status(400).json({
                    mensaje:
                        "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial"
                });
            }

            datosActualizados.password =
                await bcrypt.hash(password, 10);
        }

        await usuario.update(datosActualizados);

        // Nunca devolver la contraseña
        res.status(200).json({
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            activo: usuario.activo,
            updated_at: usuario.updated_at
        });

    } catch (error) {
        console.error("❌ Error al actualizar usuario:", error);

        res.status(500).json({
            mensaje: "Error al actualizar el usuario"
        });
    }
};

// ============================================
// ELIMINAR USUARIO
// ============================================

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        await usuario.destroy();

        res.status(200).json({
            mensaje: "Usuario eliminado correctamente"
        });

    } catch (error) {
        console.error("❌ Error al eliminar usuario:", error);

        res.status(500).json({
            mensaje: "Error al eliminar el usuario"
        });
    }
};

// ============================================
// EXPORTACIONES
// ============================================

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};