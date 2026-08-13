const Usuario = require("./Usuario");
const Categoria = require("./Categoria");
const Producto = require("./Producto");
const Oferta = require("./Oferta");
const Pedido = require("./Pedido");
const DetallePedido = require("./DetallePedido");

// Categoria → productos
Categoria.hasMany(Producto, {
    foreignKey: "categoria_id",
    as: "productos"
});

Producto.belongsTo(Categoria, {
    foreignKey: "categoria_id",
    as: "categoria"
});

// Productos → ofertas
Producto.hasMany(Oferta, {
    foreignKey: "producto_id",
    as: "ofertas"
});

Oferta.belongsTo(Producto, {
    foreignKey: "producto_id",
    as: "producto"
});

// Usuarios → pedidos
Usuario.hasMany(Pedido, {
    foreignKey: "usuario_id",
    as: "pedidos"
});

Pedido.belongsTo(Usuario, {
    foreignKey: "usuario_id",
    as: "usuario"
});

// Pedido → detalle de pedidos
Pedido.hasMany(DetallePedido, {
    foreignKey: "pedido_id",
    as: "detalles"
});

DetallePedido.belongsTo(Pedido, {
    foreignKey: "pedido_id",
    as: "pedido"
});

// Producto → detalle de pedidos
Producto.hasMany(DetallePedido, {
    foreignKey: "producto_id",
    as: "detallesPedido"
});

DetallePedido.belongsTo(Producto, {
    foreignKey: "producto_id",
    as: "producto"
});
module.exports = {
    Usuario,
    Categoria,
    Producto,
    Oferta,
    Pedido,
    DetallePedido,
};