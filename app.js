// ========== DATOS DE PRODUCTOS ==========
const productos = [

    // CAMISETAS
    // CAMISETAS
    {
        id: 1,
        nombre: "Oversize Street Black",
        precio: 29.99,
        categoria: "camisetas",
        imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
    },
    {
        id: 2,
        nombre: "Urban Graphic Tee",
        precio: 34.99,
        categoria: "camisetas",
        imagen: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500"
    },
    {
        id: 3,
        nombre: "Tokyo Street Tee",
        precio: 39.99,
        categoria: "camisetas",
        imagen: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500"
    },
    {
        id: 22,
        nombre: "Graffiti Drop Tee",
        precio: 32.99,
        categoria: "camisetas",
        imagen: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500"
    },
    {
        id: 23,
        nombre: "Acid Wash Street Tee",
        precio: 36.99,
        categoria: "camisetas",
        imagen: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500"
    },

    // HOODIES
    {
        id: 4,
        nombre: "Hoodie Urban Black",
        precio: 69.99,
        categoria: "hoodies",
        imagen: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500"
    },
    {
        id: 5,
        nombre: "Oversize Hoodie Grey",
        precio: 74.99,
        categoria: "hoodies",
        imagen: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500"
    },
    {
        id: 6,
        nombre: "StreetZone Premium Hoodie",
        precio: 79.99,
        categoria: "hoodies",
        imagen: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500"
    },
    {
        id: 24,
        nombre: "Zip-Up Street Hoodie",
        precio: 84.99,
        categoria: "hoodies",
        imagen: "https://images.unsplash.com/photo-1614975059251-992f11792b9f?w=500"
    },
    {
        id: 25,
        nombre: "Cropped Urban Hoodie",
        precio: 72.99,
        categoria: "hoodies",
        imagen: "https://images.unsplash.com/photo-1631947430066-48c30d57b943?w=500"
    },

    // CHAQUETAS
    {
        id: 7,
        nombre: "Bomber Jacket Black",
        precio: 89.99,
        categoria: "chaquetas",
        imagen: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=500"
    },
    {
        id: 8,
        nombre: "Street Denim Jacket",
        precio: 94.99,
        categoria: "chaquetas",
        imagen: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500"
    },
    {
        id: 9,
        nombre: "Urban Varsity Jacket",
        precio: 99.99,
        categoria: "chaquetas",
        imagen: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500"
    },
    {
        id: 26,
        nombre: "Windbreaker Street",
        precio: 109.99,
        categoria: "chaquetas",
        imagen: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500"
    },
    {
        id: 27,
        nombre: "Coach Jacket Urban",
        precio: 95.99,
        categoria: "chaquetas",
        imagen: "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=500"
    },

    // JEANS
    {
        id: 10,
        nombre: "Baggy Denim Blue",
        precio: 54.99,
        categoria: "jeans",
        imagen: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500"
    },
    {
        id: 11,
        nombre: "Ripped Street Jeans",
        precio: 59.99,
        categoria: "jeans",
        imagen: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500"
    },
    {
        id: 12,
        nombre: "Urban Black Denim",
        precio: 61.99,
        categoria: "jeans",
        imagen: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=500"
    },
    {
        id: 28,
        nombre: "Wide Leg Street Denim",
        precio: 64.99,
        categoria: "jeans",
        imagen: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=500"
    },
    {
        id: 29,
        nombre: "Distressed Skate Jeans",
        precio: 67.99,
        categoria: "jeans",
        imagen: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=500"
    },

    // PANTALONES
    {
        id: 13,
        nombre: "Cargo Street Black",
        precio: 64.99,
        categoria: "pantalones",
        imagen: "https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=500"
    },
    {
        id: 15,
        nombre: "Jogger Urban Fit",
        precio: 59.99,
        categoria: "pantalones",
        imagen: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500"
    },
    {
        id: 30,
        nombre: "Tactical Cargo Khaki",
        precio: 69.99,
        categoria: "pantalones",
        imagen: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500"
    },

    // CALZADO
    {
        id: 17,
        nombre: "Urban Runner Black",
        precio: 94.99,
        categoria: "calzado",
        imagen: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500"
    },
    {
        id: 18,
        nombre: "Street High Top",
        precio: 99.99,
        categoria: "calzado",
        imagen: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"
    },
    {
        id: 32,
        nombre: "Chunky Sole Sneaker",
        precio: 109.99,
        categoria: "calzado",
        imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
    },
    {
        id: 33,
        nombre: "Skate Low Top White",
        precio: 89.99,
        categoria: "calzado",
        imagen: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500"
    },
    {
        id: 34,
        nombre: "Urban Boot Street",
        precio: 119.99,
        categoria: "calzado",
        imagen: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500"
    },

    // ACCESORIOS
    {
        id: 19,
        nombre: "Gorra StreetZone",
        precio: 24.99,
        categoria: "accesorios",
        imagen: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500"
    },
    {
        id: 20,
        nombre: "Mochila Urban",
        precio: 59.99,
        categoria: "accesorios",
        imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    },
    {
        id: 21,
        nombre: "Lentes Street Premium",
        precio: 39.99,
        categoria: "accesorios",
        imagen: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500"
    },
    {
        id: 35,
        nombre: "Beanie Urban Knit",
        precio: 19.99,
        categoria: "accesorios",
        imagen: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500"
    },
    {
        id: 37,
        nombre: "Bucket Hat Street",
        precio: 22.99,
        categoria: "accesorios",
        imagen: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500"
    }
];

// Para el menú móvil
function toggleMenu() {
    const nav = document.getElementById("nav-links");
    nav.classList.toggle("show");
}

// Productos en oferta (con descuento)
const ofertas = [
    { id: 1, nombre: "Camiseta Essential", precio: 29.99, oferta: 19.99, imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", descuento: "34%" },
    { id: 4, nombre: "Vestido Floral", precio: 59.99, oferta: 39.99, imagen: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500", descuento: "33%" },
    { id: 7, nombre: "Jeans Skinny", precio: 49.99, oferta: 34.99, imagen: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500", descuento: "30%" },
    { id: 10, nombre: "Zapatillas Urban", precio: 79.99, oferta: 59.99, imagen: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500", descuento: "25%" }
];

// ========== VARIABLES GLOBALES ==========
let carrito = [];
let categoriaActual = "todos";
let metodoSeleccionado = null;
let totalActual = 0;

// ========== FUNCIONES DE NAVEGACIÓN ==========
function irInicio() {
    ocultarTodasSecciones();
    const inicio = document.getElementById("inicio");
    const coleccion = document.getElementById("coleccion");
    const productosSec = document.querySelector(".productos");
    if (inicio) inicio.style.display = "flex";
    if (coleccion) coleccion.style.display = "block";
    if (productosSec) productosSec.style.display = "block";
    if (inicio) inicio.scrollIntoView({ behavior: "smooth" });
    console.log("🏠 Navegando a Inicio");
}

function irColeccion() {
    ocultarTodasSecciones();
    const coleccion = document.getElementById("coleccion");
    const productosSec = document.querySelector(".productos");
    if (coleccion) coleccion.style.display = "block";
    if (productosSec) productosSec.style.display = "block";
    if (coleccion) coleccion.scrollIntoView({ behavior: "smooth" });
    console.log("👕 Navegando a Colección");
}

function irOfertas() {
    ocultarTodasSecciones();
    const ofertasSec = document.getElementById("ofertas");
    if (ofertasSec) {
        ofertasSec.style.display = "block";
        mostrarOfertas();
        ofertasSec.scrollIntoView({ behavior: "smooth" });
    }
    console.log("🔥 Navegando a Ofertas");
}

function irContacto() {
    ocultarTodasSecciones();
    const contactoSec = document.getElementById("contacto");
    if (contactoSec) {
        contactoSec.style.display = "block";
        contactoSec.scrollIntoView({ behavior: "smooth" });
    }
    console.log("📞 Navegando a Contacto");
}

function ocultarTodasSecciones() {
    const inicio = document.getElementById("inicio");
    const coleccion = document.getElementById("coleccion");
    const productosSec = document.querySelector(".productos");
    const ofertasSec = document.getElementById("ofertas");
    const contactoSec = document.getElementById("contacto");

    if (inicio) inicio.style.display = "none";
    if (coleccion) coleccion.style.display = "none";
    if (productosSec) productosSec.style.display = "none";
    if (ofertasSec) ofertasSec.style.display = "none";
    if (contactoSec) contactoSec.style.display = "none";
}

function mostrarOfertas() {
    const grid = document.getElementById("ofertas-grid");
    if (!grid) return;

    grid.innerHTML = ofertas.map(oferta => `
        <div class="oferta-card">
            <div class="oferta-badge">-${oferta.descuento}</div>
            <div class="oferta-imagen" style="background-image: url('${oferta.imagen}'); background-size: cover; background-position: center;"></div>
            <div class="oferta-info">
                <h3>${oferta.nombre}</h3>
                <p><span class="precio-original">$${oferta.precio}</span>
                   <span class="precio-oferta">$${oferta.oferta}</span></p>
                <button class="btn-carrito" onclick="agregarAlCarritoOferta(${oferta.id})">
                    <i class="fas fa-cart-plus"></i> Agregar al carrito
                </button>
            </div>
        </div>
    `).join("");
}

// ========== MOSTRAR PRODUCTOS ==========
function mostrarProductos() {
    const grid = document.getElementById("productos-grid");
    if (!grid) return;

    let productosFiltrados = productos;
    if (categoriaActual !== "todos") {
        productosFiltrados = productos.filter(p => p.categoria === categoriaActual);
    }

    if (productosFiltrados.length === 0) {
        grid.innerHTML = `<div style="text-align:center; padding:3rem; grid-column:1/-1;">
            <i class="fas fa-search" style="font-size:3rem; color:#ccc;"></i>
            <p style="margin-top:1rem;">No hay productos en esta categoría</p>
        </div>`;
        return;
    }

    grid.innerHTML = productosFiltrados.map(producto => `
        <div class="producto-card" onclick="verProducto(${producto.id})">
            <div class="producto-imagen" style="background-image: url('${producto.imagen}'); background-size: cover; background-position: center;">
                <div class="producto-overlay">
                    <button class="ver-detalle" onclick="event.stopPropagation(); verProducto(${producto.id})">Ver detalles</button>
                </div>
            </div>
            <div class="producto-info">
                <div class="producto-categoria">${producto.categoria}</div>
                <h3>${producto.nombre}</h3>
                <p class="precio">$${producto.precio}</p>
                <button class="btn-carrito" onclick="event.stopPropagation(); agregarAlCarrito(${producto.id})">
                    <i class="fas fa-cart-plus"></i> Agregar al carrito
                </button>
            </div>
        </div>
    `).join("");
}

function filtrarPorCategoria(categoria) {
    categoriaActual = categoria;
    mostrarProductos();

    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.classList.remove('active');
        const btnTexto = btn.textContent.toLowerCase();
        if (categoria === 'todos' && btnTexto === 'todos') {
            btn.classList.add('active');
        } else if (btnTexto === categoria) {
            btn.classList.add('active');
        }
    });

    const seccionProductos = document.querySelector(".productos");
    if (seccionProductos) {
        seccionProductos.scrollIntoView({ behavior: 'smooth' });
    }

    console.log(`🔍 Filtro aplicado: ${categoria}`);
}

// ========== AGREGAR AL CARRITO ==========
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);

    if (!producto) return;

    const existe = carrito.find(item => item.id === id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    actualizarContador();
    mostrarNotificacion(`${producto.nombre} agregado al carrito ✓`);
}

function actualizarContador() {
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const contadorSpan = document.getElementById("contador-carrito");
    if (contadorSpan) {
        contadorSpan.innerText = total;
        contadorSpan.style.animation = 'none';
        setTimeout(() => contadorSpan.style.animation = 'pulse 0.5s ease', 10);
    }
}

// ========== NOTIFICACIÓN FLOTANTE ==========
function mostrarNotificacion(mensaje, tipo = "success") {
    const notificacion = document.createElement("div");
    const color = tipo === "error" ? "#e74c3c" : "#28a745";
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${color};
        color: white;
        padding: 12px 24px;
        border-radius: 40px;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: fadeOut 2s ease forwards;
    `;

    if (!document.querySelector('#notif-style')) {
        const style = document.createElement("style");
        style.id = 'notif-style';
        style.textContent = `
            @keyframes fadeOut {
                0% { opacity: 1; transform: translateY(0); }
                70% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); visibility: hidden; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notificacion);
    setTimeout(() => notificacion.remove(), 2000);
}

// ========== FUNCIONES DEL CARRITO ==========
function abrirCarrito() {
    const modal = document.getElementById("carrito-modal");
    const carritoItems = document.getElementById("carrito-items");
    const carritoTotal = document.getElementById("carrito-total");

    if (!modal) return;

    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p style="text-align:center; padding:2rem;">🛒 El carrito está vacío</p>';
        carritoTotal.innerHTML = 'Total: $0';
    } else {
        carritoItems.innerHTML = carrito.map(item => `
            <div class="carrito-item">
                <div>
                    <strong>${item.nombre}</strong><br>
                    <small>$${item.precio} x ${item.cantidad}</small>
                </div>
                <div>
                    <span style="font-weight:bold;">$${(item.precio * item.cantidad).toFixed(2)}</span>
                    <button onclick="eliminarDelCarrito(${item.id})" style="background:none; border:none; color:#e74c3c; margin-left:10px; cursor:pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join("");
        const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        carritoTotal.innerHTML = `Total: $${total.toFixed(2)}`;
    }

    modal.style.display = "flex";
}

function eliminarDelCarrito(id) {
    const index = carrito.findIndex(item => item.id === id);

    if (index !== -1) {
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad--;
        } else {
            carrito.splice(index, 1);
        }
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));

    actualizarContador();
    abrirCarrito();
}

function cerrarCarrito() {
    const modal = document.getElementById("carrito-modal");
    if (modal) modal.style.display = "none";
}

function finalizarCompra() {
    if (carrito.length === 0) {
        mostrarNotificacion("🛒 Tu carrito está vacío", "error");
        return;
    }
    cerrarCarrito();
    abrirPagoModal();
}

// ========== SISTEMA DE PAGO ==========
function abrirPagoModal() {
    const modal = document.getElementById("pago-modal");
    const resumenDiv = document.getElementById("resumen-compra");

    if (!modal) return;

    totalActual = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    // Generar referencia aleatoria
    const refNumero = Math.floor(Math.random() * 10000);
    const refSpan = document.getElementById("ref-numero");
    if (refSpan) refSpan.innerText = refNumero;

    if (resumenDiv) {
        resumenDiv.innerHTML = `
            <h4>Resumen de compra</h4>
            ${carrito.map(item => `
                <div class="resumen-item">
                    <span>${item.nombre} x ${item.cantidad}</span>
                    <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
            `).join('')}
            <div class="resumen-total">
                <span>Total</span>
                <span>$${totalActual.toFixed(2)}</span>
            </div>
        `;
    }

    // Actualizar texto del botón de pago
    const btnPagar = document.getElementById("btn-pagar");
    if (btnPagar) {
        btnPagar.innerHTML = `<i class="fas fa-lock"></i> Pagar $${totalActual.toFixed(2)}`;
        btnPagar.onclick = function () { procesarPago(); };
    }

    modal.style.display = "flex";
    metodoSeleccionado = null;

    // Ocultar todos los formularios
    const formTarjeta = document.getElementById("form-tarjeta");
    const formPaypal = document.getElementById("form-paypal");
    const formTransferencia = document.getElementById("form-transferencia");

    if (formTarjeta) formTarjeta.style.display = "none";
    if (formPaypal) formPaypal.style.display = "none";
    if (formTransferencia) formTransferencia.style.display = "none";

    // Remover selección de métodos
    document.querySelectorAll(".metodo-pago").forEach(m => m.classList.remove("seleccionado"));

    // Limpiar status
    const tarjetaStatus = document.getElementById("tarjeta-status");
    const paypalStatus = document.getElementById("paypal-status");
    const transferenciaStatus = document.getElementById("transferencia-status");

    if (tarjetaStatus) tarjetaStatus.innerHTML = "";
    if (paypalStatus) paypalStatus.innerHTML = "";
    if (transferenciaStatus) transferenciaStatus.innerHTML = "";
}

function abrirLoginModal() {
    document.getElementById("login-modal").style.display = "flex";
}

function cerrarLoginModal() {
    document.getElementById("login-modal").style.display = "none";
}

function seleccionarMetodo(metodo, elemento) {
    metodoSeleccionado = metodo;

    // Actualizar UI
    document.querySelectorAll(".metodo-pago").forEach(m => m.classList.remove("seleccionado"));
    elemento.classList.add("seleccionado");

    // Mostrar formulario correspondiente
    const formTarjeta = document.getElementById("form-tarjeta");
    const formPaypal = document.getElementById("form-paypal");
    const formTransferencia = document.getElementById("form-transferencia");

    if (formTarjeta) formTarjeta.style.display = "none";
    if (formPaypal) formPaypal.style.display = "none";
    if (formTransferencia) formTransferencia.style.display = "none";

    if (metodo === 'tarjeta' && formTarjeta) {
        formTarjeta.style.display = "block";
        const tarjetaStatus = document.getElementById("tarjeta-status");
        if (tarjetaStatus) tarjetaStatus.innerHTML = "";
    } else if (metodo === 'paypal' && formPaypal) {
        formPaypal.style.display = "block";
        const paypalStatus = document.getElementById("paypal-status");
        if (paypalStatus) paypalStatus.innerHTML = "";
    } else if (metodo === 'transferencia' && formTransferencia) {
        formTransferencia.style.display = "block";
        const transferenciaStatus = document.getElementById("transferencia-status");
        if (transferenciaStatus) transferenciaStatus.innerHTML = "";
    }
}

function validarTarjeta() {
    const nombre = document.getElementById("nombre-tarjeta");
    const numero = document.getElementById("numero-tarjeta");
    const fecha = document.getElementById("fecha-expiracion");
    const cvv = document.getElementById("cvv");
    const statusDiv = document.getElementById("tarjeta-status");
    const numeroLimpio = numero.value.replace(/\s/g, '');

    if (!nombre || !numero || !fecha || !cvv || !statusDiv) return false;

    if (!nombre.value.trim()) {
        statusDiv.innerHTML = "⚠️ Ingresa el nombre del titular";
        statusDiv.className = "payment-status error";
        return false;
    }
    if (numeroLimpio.length !== 16) {
        statusDiv.innerHTML = "⚠️ Número de tarjeta inválido (16 dígitos)";
        statusDiv.className = "payment-status error";
        return false;
    }
    if (!fecha.value.trim() || fecha.value.length < 5) {
        statusDiv.innerHTML = "⚠️ Ingresa fecha de expiración (MM/AA)";
        statusDiv.className = "payment-status error";
        return false;
    }
    if (!cvv.value.trim() || cvv.value.length < 3) {
        statusDiv.innerHTML = "⚠️ CVV inválido";
        statusDiv.className = "payment-status error";
        return false;
    }

    statusDiv.innerHTML = "✅ Tarjeta válida";
    statusDiv.className = "payment-status success";
    return true;
}

function validarPaypal() {
    const email = document.getElementById("paypal-email");
    const password = document.getElementById("paypal-password");
    const statusDiv = document.getElementById("paypal-status");

    if (!email || !password || !statusDiv) return false;

    if (!email.value.trim() || !email.value.includes('@')) {
        statusDiv.innerHTML = "⚠️ Ingresa un email válido";
        statusDiv.className = "payment-status error";
        return false;
    }
    if (!password.value.trim() || password.value.length < 4) {
        statusDiv.innerHTML = "⚠️ Contraseña incorrecta (mínimo 4 caracteres)";
        statusDiv.className = "payment-status error";
        return false;
    }

    statusDiv.innerHTML = "✅ Cuenta PayPal válida";
    statusDiv.className = "payment-status success";
    return true;
}

function validarTransferencia() {
    const statusDiv = document.getElementById("transferencia-status");
    if (!statusDiv) return true;

    statusDiv.innerHTML = "✅ Transferencia seleccionada - Realiza el depósito con la referencia";
    statusDiv.className = "payment-status success";
    return true;
}

function procesarPago() {
    if (!metodoSeleccionado) {
        mostrarNotificacion("⚠️ Selecciona un método de pago", "error");
        return;
    }

    let valido = false;
    if (metodoSeleccionado === 'tarjeta') valido = validarTarjeta();
    else if (metodoSeleccionado === 'paypal') valido = validarPaypal();
    else if (metodoSeleccionado === 'transferencia') valido = validarTransferencia();

    if (!valido) return;

    // Mostrar loading
    mostrarLoading();

    // Simular procesamiento de pago
    setTimeout(() => {
        ocultarLoading();

        const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        const fecha = new Date().toLocaleString();
        const numeroOrden = "ORD-" + Math.floor(Math.random() * 1000000);

        cerrarPagoModal();

        // Mostrar confirmación
        mostrarConfirmacion({
            numeroOrden: numeroOrden,
            total: total,
            fecha: fecha,
            productos: [...carrito],
            metodo: metodoSeleccionado
        });

        // Vaciar carrito
        carrito = [];
        localStorage.removeItem("carrito");
        actualizarContador();
        localStorage.removeItem("carrito");
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarNotificacion("🎉 Compra realizada con éxito");

    }, 2000);
}

function mostrarLoading() {
    // Eliminar loading existente
    ocultarLoading();

    const loading = document.createElement("div");
    loading.id = "loadingOverlay";
    loading.className = "loading-overlay";
    loading.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Procesando pago...</p>
        <p style="font-size:0.8rem">No cierres esta ventana</p>
    `;
    document.body.appendChild(loading);
}

function ocultarLoading() {
    const loading = document.getElementById("loadingOverlay");
    if (loading) loading.remove();
}

function mostrarConfirmacion(datos) {
    const modal = document.getElementById("confirmacion-modal");
    const mensajeDiv = document.getElementById("mensaje-confirmacion");
    const detalleDiv = document.getElementById("detalle-confirmacion");

    if (!modal) return;

    let metodoTexto = "";
    let metodoIcono = "";
    if (datos.metodo === 'tarjeta') {
        metodoTexto = "💳 Tarjeta de crédito";
        metodoIcono = "💳";
    } else if (datos.metodo === 'paypal') {
        metodoTexto = "💰 PayPal";
        metodoIcono = "💰";
    } else {
        metodoTexto = "🏦 Transferencia bancaria";
        metodoIcono = "🏦";
    }

    const nombreCliente = datos.productos[0]?.nombre?.split(' ')[0] || "cliente";
    if (mensajeDiv) mensajeDiv.innerHTML = `¡Gracias por tu compra, ${nombreCliente}!`;

    if (detalleDiv) {
        detalleDiv.innerHTML = `
            <p><strong>🧾 Número de orden:</strong> ${datos.numeroOrden}</p>
            <p><strong>📅 Fecha:</strong> ${datos.fecha}</p>
            <p><strong>${metodoIcono} Método de pago:</strong> ${metodoTexto}</p>
            <p><strong>📦 Total pagado:</strong> $${datos.total.toFixed(2)}</p>
            <p><strong>📧 Recibirás un correo con los detalles</strong></p>
            <hr>
            <p style="font-size:0.8rem; color:#666;">✨ Gracias por confiar en StreetZone</p>
        `;
    }

    modal.style.display = "flex";

    // Registrar en consola para evidencia
    console.log("✅ ===== PAGO COMPLETADO =====");
    console.log("Orden:", datos.numeroOrden);
    console.log("Total:", datos.total);
    console.log("Método:", datos.metodo);
    console.log("Productos:", datos.productos);
    console.log("Fecha:", datos.fecha);
    console.log("==============================");
}

function cerrarPagoModal() {
    const modal = document.getElementById("pago-modal");
    if (modal) modal.style.display = "none";
    metodoSeleccionado = null;
}

function cerrarConfirmacion() {
    const modal = document.getElementById("confirmacion-modal");
    if (modal) modal.style.display = "none";
    mostrarNotificacion("🎉 ¡Compra realizada con éxito!", "success");
}

// ========== VER DETALLE DEL PRODUCTO ==========
function verProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        mostrarNotificacion(`🛍️ ${producto.nombre} - $${producto.precio}`, "success");
        console.log(`📱 Viendo detalle del producto: ${producto.nombre} (ID: ${producto.id})`);
    }
}

function verColeccion() {
    irColeccion();
}

// ========== FORMULARIO CONTACTO ==========
document.addEventListener("DOMContentLoaded", () => {
    console.log("🌟 StreetZone inicializada correctamente");

    // Recuperar carrito guardado
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    actualizarContador();
    mostrarProductos();

    const contactoForm = document.getElementById("contactoForm");
    if (contactoForm) {
        contactoForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const nombre = document.getElementById("nombreContacto");
            const email = document.getElementById("emailContacto");
            const mensaje = document.getElementById("mensajeContacto");

            if (!nombre.value.trim()) {
                mostrarNotificacion("⚠️ Ingresa tu nombre", "error");
                return;
            }
            if (!email.value.trim() || !email.value.includes('@')) {
                mostrarNotificacion("⚠️ Ingresa un email válido", "error");
                return;
            }
            if (!mensaje.value.trim()) {
                mostrarNotificacion("⚠️ Ingresa un mensaje", "error");
                return;
            }

            mostrarNotificacion(`📨 ¡Mensaje enviado! Pronto te contactaremos.`, "success");
            console.log(`📧 Mensaje de contacto - Nombre: ${nombre.value}, Email: ${email.value}, Mensaje: ${mensaje.value}`);
            contactoForm.reset();
        });
    }

    // Inicializar referencia de transferencia
    const refSpan = document.getElementById("ref-numero");
    if (refSpan) {
        refSpan.innerText = Math.floor(Math.random() * 10000);
    }

    console.log(`📦 Productos disponibles: ${productos.length}`);
    console.log("📋 Categorías:", [...new Set(productos.map(p => p.categoria))]);
});

// Cerrar modal click fuera
window.onclick = function (event) {
    const carritoModal = document.getElementById("carrito-modal");
    const pagoModal = document.getElementById("pago-modal");
    const confirmacionModal = document.getElementById("confirmacion-modal");
    const loginModal = document.getElementById("login-modal");

    if (loginModal && event.target === loginModal) {
        loginModal.style.display = "none";
    }
    if (carritoModal && event.target === carritoModal) {
        carritoModal.style.display = "none";
    }
    if (pagoModal && event.target === pagoModal) {
        pagoModal.style.display = "none";
    }
    if (confirmacionModal && event.target === confirmacionModal) {
        confirmacionModal.style.display = "none";
    }
}