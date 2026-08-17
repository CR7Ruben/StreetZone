const { MensajeContacto } = require("../models");
const transporter = require("../../config/email");

// Obtener todos los mensajes
const obtenerMensajes = async (req, res) => {
    try {
        const mensajes = await MensajeContacto.findAll({
            order: [["id", "ASC"]]
        });

        res.status(200).json(mensajes);

    } catch (error) {
        console.error("❌ Error al obtener mensajes:", error);

        res.status(500).json({
            mensaje: "Error al obtener los mensajes"
        });
    }
};

// Obtener mensaje por ID
const obtenerMensajePorId = async (req, res) => {
    try {
        const { id } = req.params;

        const mensaje = await MensajeContacto.findByPk(id);

        if (!mensaje) {
            return res.status(404).json({
                mensaje: "Mensaje no encontrado"
            });
        }

        res.status(200).json(mensaje);

    } catch (error) {
        console.error("❌ Error al obtener mensaje:", error);

        res.status(500).json({
            mensaje: "Error al obtener el mensaje"
        });
    }
};

// Crear mensaje
const crearMensaje = async (req, res) => {

    try {

        const {
            nombre,
            email,
            mensaje
        } = req.body;


        // =====================================================
        // VALIDAR DATOS
        // =====================================================

        if (!nombre || !email || !mensaje) {

            return res.status(400).json({
                mensaje: "Nombre, email y mensaje son obligatorios"
            });

        }


        // =====================================================
        // GUARDAR EN NEON
        // =====================================================

        const nuevoMensaje =
            await MensajeContacto.create({

                nombre,
                email,
                mensaje,
                atendido: false

            });


        // =====================================================
        // ENVIAR CORREO A LA EMPRESA
        // =====================================================

        try {

            await transporter.sendMail({

                from: process.env.EMAIL_USUARIO,

                to: process.env.EMAIL_EMPRESA,

                subject: `📩 Nuevo mensaje de contacto - StreetZone`,

                html: `

                    <div style="
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-radius: 10px;
                    ">

                        <h2 style="color:#222;">
                            📩 Nuevo mensaje de contacto
                        </h2>

                        <p>
                            Has recibido un nuevo mensaje desde
                            <strong>StreetZone</strong>.
                        </p>

                        <hr>

                        <p>
                            <strong>Nombre:</strong>
                            ${nombre}
                        </p>

                        <p>
                            <strong>Email:</strong>
                            ${email}
                        </p>

                        <p>
                            <strong>Mensaje:</strong>
                        </p>

                        <div style="
                            background:#f5f5f5;
                            padding:15px;
                            border-radius:8px;
                            margin-top:10px;
                        ">
                            ${mensaje}
                        </div>

                        <hr>

                        <p style="color:#777; font-size:12px;">
                            Este mensaje fue enviado desde el
                            formulario de contacto de StreetZone.
                        </p>

                    </div>

                `

            });


            console.log(
                "📧 Correo enviado correctamente a:",
                process.env.EMAIL_EMPRESA
            );


        } catch (errorCorreo) {

            // =================================================
            // EL CORREO FALLÓ, PERO NO CANCELAMOS EL MENSAJE
            // =================================================

            console.error(
                "⚠️ El mensaje se guardó, pero no se pudo enviar el correo:",
                errorCorreo.message
            );

        }


        // =====================================================
        // RESPUESTA
        // =====================================================

        res.status(201).json({

            mensaje: "Mensaje enviado correctamente",

            datos: nuevoMensaje

        });


    } catch (error) {

        console.error(
            "❌ Error al crear mensaje:",
            error
        );

        res.status(500).json({

            mensaje: "Error al crear el mensaje"

        });

    }

};

// Actualizar mensaje
const actualizarMensaje = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nombre,
            email,
            mensaje,
            atendido
        } = req.body;

        const mensajeEncontrado = await MensajeContacto.findByPk(id);

        if (!mensajeEncontrado) {
            return res.status(404).json({
                mensaje: "Mensaje no encontrado"
            });
        }

        const datosActualizados = {};

        if (nombre !== undefined) {
            datosActualizados.nombre = nombre;
        }

        if (email !== undefined) {
            datosActualizados.email = email;
        }

        if (mensaje !== undefined) {
            datosActualizados.mensaje = mensaje;
        }

        if (atendido !== undefined) {
            datosActualizados.atendido = atendido;
        }

        await mensajeEncontrado.update(datosActualizados);

        res.status(200).json(mensajeEncontrado);

    } catch (error) {
        console.error("❌ Error al actualizar mensaje:", error);

        res.status(500).json({
            mensaje: "Error al actualizar el mensaje"
        });
    }
};

// Eliminar mensaje
const eliminarMensaje = async (req, res) => {
    try {
        const { id } = req.params;

        const mensaje = await MensajeContacto.findByPk(id);

        if (!mensaje) {
            return res.status(404).json({
                mensaje: "Mensaje no encontrado"
            });
        }

        await mensaje.destroy();

        res.status(200).json({
            mensaje: "Mensaje eliminado correctamente"
        });

    } catch (error) {
        console.error("❌ Error al eliminar mensaje:", error);

        res.status(500).json({
            mensaje: "Error al eliminar el mensaje"
        });
    }
};

module.exports = {
    obtenerMensajes,
    obtenerMensajePorId,
    crearMensaje,
    actualizarMensaje,
    eliminarMensaje
};