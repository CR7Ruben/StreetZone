const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Validación de correo electrónico y contraseña

const validarCorreo = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validarPassword = (password) => {
    const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-])[A-Za-z\d@$!%*?&.#_\-]{8,}$/;

    return regex.test(password);
};

// Generar token JWT

const generarToken = (usuario) => {
    return jwt.sign(
        {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "8h"
        }
    );
};

// Registro de usuario

const registrarUsuario = async (req, res) => {
    try {
        const {
            nombre,
            email,
            password
        } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({
                mensaje: "Nombre, email y password son obligatorios"
            });
        }

        if (!validarCorreo(email)) {
            return res.status(400).json({
                mensaje: "El correo electrónico no es válido"
            });
        }

        if (!validarPassword(password)) {
            return res.status(400).json({
                mensaje:
                    "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial"
            });
        }

        const usuarioExistente = await Usuario.findOne({
            where: { email }
        });

        if (usuarioExistente) {
            return res.status(409).json({
                mensaje: "El correo electrónico ya está registrado"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const usuario = await Usuario.create({
            nombre,
            email,
            password: passwordHash,
            rol: "cliente",
            activo: true
        });

        const token = generarToken(usuario);

        res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                activo: usuario.activo
            }
        });

    } catch (error) {
        console.error("❌ Error en registro:", error);

        res.status(500).json({
            mensaje: "Error al registrar el usuario"
        });
    }
};

// Login
const iniciarSesion = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                mensaje: "Email y password son obligatorios"
            });
        }

        const usuario = await Usuario.findOne({
            where: { email }
        });

        if (!usuario) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        if (!usuario.activo) {
            return res.status(403).json({
                mensaje: "El usuario está desactivado"
            });
        }

        const passwordValida = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordValida) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        const token = generarToken(usuario);

        res.status(200).json({
            mensaje: "Inicio de sesión correcto",
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                activo: usuario.activo
            }
        });

    } catch (error) {
        console.error("❌ Error en login:", error);

        res.status(500).json({
            mensaje: "Error al iniciar sesión"
        });
    }
};

// Perfil del usuario autenticado
const obtenerPerfil = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(
            req.usuario.id,
            {
                attributes: {
                    exclude: ["password"]
                }
            }
        );

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.status(200).json(usuario);

    } catch (error) {
        console.error("❌ Error al obtener perfil:", error);

        res.status(500).json({
            mensaje: "Error al obtener el perfil"
        });
    }
};

module.exports = {
    registrarUsuario,
    iniciarSesion,
    obtenerPerfil
};