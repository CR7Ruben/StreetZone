const Categoria = require('./Categoria');
const Producto = require('./Producto');

// Relación Categoria → Productos
Categoria.hasMany(Producto, {
    foreignKey: 'categoria_id',
    as: 'productos'
});

// Relación Producto → Categoria
Producto.belongsTo(Categoria, {
    foreignKey: 'categoria_id',
    as: 'categoria'
});

module.exports = {
    Categoria,
    Producto
};