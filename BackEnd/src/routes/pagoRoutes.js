const express = require("express");

const {
    crearCheckout,
    webhookStripe
} = require("../controllers/pagoController");

const {
    verificarToken
} = require("../middleware.js/authMiddleware");

const router = express.Router();


// ==========================================
// Crear sesión de pago en Stripe
// ==========================================

router.post(
    "/crear-checkout",
    express.json(),
    verificarToken,
    crearCheckout
);


// ==========================================
// Webhook de Stripe
// ==========================================

router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    webhookStripe
);


module.exports = router;