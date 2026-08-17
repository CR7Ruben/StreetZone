const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                mensaje: "Token de autenticación requerido"
            });
        }

        const partes = authHeader.split(" ");

        if (partes.length !== 2 || partes[0] !== "Bearer") {
            return res.status(401).json({
                mensaje: "Formato de autorización inválido"
            });
        }

        const token = partes[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = decoded;

        next();

    } catch (error) {
        console.error(
            "❌ Error de autenticación:",
            error.message
        );

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                mensaje: "El token ha expirado"
            });
        }

        return res.status(401).json({
            mensaje: "Token inválido"
        });
    }
};

const verificarRol = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({
                mensaje: "Usuario no autenticado"
            });
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({
                mensaje:
                    "No tienes permisos para realizar esta acción"
            });
        }

        next();
    };
};

module.exports = {
    verificarToken,
    verificarRol
};