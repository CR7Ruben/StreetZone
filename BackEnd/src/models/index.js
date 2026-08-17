const sequelize = require("../../config/database");

const Usuario = require("./Usuario");
const Categoria = require("./Categoria");
const Producto = require("./Producto");
const Oferta = require("./Oferta");
const Pedido = require("./Pedido");
const DetallePedido = require("./DetallePedido");
const MensajeContacto = require("./MensajeContacto");

// ============================================================
// CATEGORÍAS → PRODUCTOS
// ============================================================

Categoria.hasMany(Producto, {
    foreignKey: "categoria_id",
    as: "productos"
});

Producto.belongsTo(Categoria, {
    foreignKey: "categoria_id",
    as: "categoria"
});

// ============================================================
// PRODUCTOS → OFERTAS
// ============================================================

Producto.hasMany(Oferta, {
    foreignKey: "producto_id",
    as: "ofertas"
});

Oferta.belongsTo(Producto, {
    foreignKey: "producto_id",
    as: "producto"
});

// ============================================================
// USUARIOS → PEDIDOS
// ============================================================

Usuario.hasMany(Pedido, {
    foreignKey: "usuario_id",
    as: "pedidos"
});

Pedido.belongsTo(Usuario, {
    foreignKey: "usuario_id",
    as: "usuario"
});

// ============================================================
// PEDIDOS → DETALLES
// ============================================================

Pedido.hasMany(DetallePedido, {
    foreignKey: "pedido_id",
    as: "detalles"
});

DetallePedido.belongsTo(Pedido, {
    foreignKey: "pedido_id",
    as: "pedido"
});

// ============================================================
// PRODUCTOS → DETALLES DE PEDIDO
// ============================================================

Producto.hasMany(DetallePedido, {
    foreignKey: "producto_id",
    as: "detallesPedido"
});

DetallePedido.belongsTo(Producto, {
    foreignKey: "producto_id",
    as: "producto"
});

// ============================================================
// EXPORTAR
// ============================================================

module.exports = {
    sequelize,
    Usuario,
    Categoria,
    Producto,
    Oferta,
    Pedido,
    DetallePedido,
    MensajeContacto
};