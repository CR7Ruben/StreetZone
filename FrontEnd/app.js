// ============================================================
// STREETZONE - APP.JS
// Frontend conectado al Backend / PostgreSQL
// ============================================================

const API_URL = "http://localhost:3000/api";

let productos = [];
let categorias = [];
let ofertas = [];
let carrito = [];
let categoriaAdminActual = "todos";
let categoriaActual = "todos";
let metodoSeleccionado = null;
let totalActual = 0;


// ============================================================
// INICIALIZACIÓN
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("=================================");
    console.log("🌟 STREETZONE INICIANDO");
    console.log("=================================");

    cargarCarritoLocal();

    actualizarContador();
    actualizarEstadoSesion();

    configurarFormularios();

    await cargarCategorias();
    await cargarProductos();
    await cargarOfertas();

    // Verificar si regresamos de Stripe
    await verificarPagoExitoso();

    console.log("=================================");
    console.log("✅ STREETZONE INICIALIZADO");
    console.log("=================================");
});


// ============================================================
// FORMULARIOS
// ============================================================

function configurarFormularios() {

    const loginForm =
        document.getElementById("inicioSesionForm");

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                await iniciarSesion();

            }
        );
    }


    const contactoForm =
        document.getElementById("contactoForm");

    if (contactoForm) {

        contactoForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                await enviarMensajeContacto();

            }
        );
    }
}


// ============================================================
// CARRITO LOCAL
// ============================================================

function cargarCarritoLocal() {

    try {

        const guardado =
            localStorage.getItem("carrito");

        carrito =
            guardado
                ? JSON.parse(guardado)
                : [];

        if (!Array.isArray(carrito)) {
            carrito = [];
        }

    } catch (error) {

        console.error(
            "❌ Error leyendo carrito:",
            error
        );

        carrito = [];
    }
}


function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );
}


// ============================================================
// PRODUCTOS
// ============================================================

async function cargarProductos() {

    try {

        const respuesta =
            await fetch(`${API_URL}/productos`);

        const datos =
            await obtenerRespuestaJSON(respuesta);

        if (!respuesta.ok) {

            throw new Error(
                datos?.mensaje ||
                "No se pudieron cargar los productos"
            );
        }

        productos =
            Array.isArray(datos)
                ? datos
                : datos.productos || [];

        console.log(
            "✅ Productos:",
            productos
        );

        mostrarProductos();

    } catch (error) {

        console.error(
            "❌ Error cargando productos:",
            error
        );

        mostrarNotificacion(
            "❌ No se pudieron cargar los productos",
            "error"
        );
    }
}


// ============================================================
// CATEGORÍAS
// ============================================================

async function cargarCategorias() {

    try {

        const respuesta =
            await fetch(`${API_URL}/categorias`);

        const datos =
            await obtenerRespuestaJSON(respuesta);

        if (!respuesta.ok) {

            throw new Error(
                datos?.mensaje ||
                "No se pudieron cargar las categorías"
            );
        }

        categorias =
            Array.isArray(datos)
                ? datos
                : datos.categorias || [];

        console.log(
            "✅ Categorías:",
            categorias
        );

    } catch (error) {

        console.error(
            "❌ Error cargando categorías:",
            error
        );

        mostrarNotificacion(
            "❌ No se pudieron cargar las categorías",
            "error"
        );
    }
}


// ============================================================
// MOSTRAR PRODUCTOS
// ============================================================

function mostrarProductos() {

    const grid =
        document.getElementById(
            "productos-grid"
        );

    if (!grid) return;


    let productosFiltrados =
        productos;


    if (categoriaActual !== "todos") {

        productosFiltrados =
            productos.filter(producto =>
                coincideCategoria(
                    producto,
                    categoriaActual
                )
            );
    }


    if (productosFiltrados.length === 0) {

        grid.innerHTML = `

            <div style="
                text-align:center;
                padding:3rem;
                grid-column:1/-1;
            ">

                <i class="fas fa-search"
                   style="
                       font-size:3rem;
                       color:#ccc;
                   ">
                </i>

                <p style="margin-top:1rem;">
                    No hay productos disponibles
                </p>

            </div>

        `;

        return;
    }


    grid.innerHTML =
        productosFiltrados
            .map(producto => {

                const stock =
                    Number(producto.stock || 0);

                const precio =
                    Number(producto.precio || 0);

                const categoria =
                    obtenerNombreCategoria(
                        producto.categoria_id
                    );

                return `

                    <div class="producto-card"
                         onclick="verProducto(${producto.id})">

                        <div class="producto-imagen"
                             style="
                                background-image:url('${escaparAtributo(
                    producto.imagen || ""
                )}');
                                background-size:cover;
                                background-position:center;
                             ">

                            <div class="producto-overlay">

                                <button
                                    class="ver-detalle"
                                    onclick="
                                        event.stopPropagation();
                                        verProducto(${producto.id});
                                    ">
                                    Ver detalles
                                </button>

                            </div>

                        </div>


                        <div class="producto-info">

                            <div class="producto-categoria">
                                ${escaparHTML(categoria)}
                            </div>

                            <h3>
                                ${escaparHTML(
                    producto.nombre ||
                    "Producto"
                )}
                            </h3>

                            <p class="precio">
                                $${precio.toFixed(2)}
                            </p>

                            <p>
                                Stock: ${stock}
                            </p>

                            <button
                                class="btn-carrito"
                                onclick="
                                    event.stopPropagation();
                                    agregarAlCarrito(${producto.id});
                                "
                                ${stock <= 0 ? "disabled" : ""}>

                                <i class="fas fa-cart-plus"></i>

                                ${stock <= 0
                        ? "Agotado"
                        : "Agregar al carrito"
                    }

                            </button>

                        </div>

                    </div>

                `;
            })
            .join("");
}


// ============================================================
// CATEGORÍAS
// ============================================================

function coincideCategoria(
    producto,
    categoria
) {

    const categoriaProducto =
        categorias.find(
            c =>
                Number(c.id) ===
                Number(producto.categoria_id)
        );

    if (!categoriaProducto) {
        return false;
    }

    const nombreCategoria =
        normalizarTexto(
            categoriaProducto.nombre
        );

    const categoriaBuscada =
        normalizarTexto(
            String(categoria)
        );

    if (
        !isNaN(Number(categoria)) &&
        Number(categoria) ===
        Number(producto.categoria_id)
    ) {

        return true;
    }

    return (
        nombreCategoria ===
        categoriaBuscada
    );
}


function obtenerNombreCategoria(
    categoriaId
) {

    const categoria =
        categorias.find(
            c =>
                Number(c.id) ===
                Number(categoriaId)
        );

    return categoria
        ? categoria.nombre
        : "Producto";
}


// ============================================================
// FILTRAR
// ============================================================

function filtrarPorCategoria(
    categoria,
    boton = null
) {

    categoriaActual =
        categoria;

    mostrarProductos();


    document
        .querySelectorAll(".filtro-btn")
        .forEach(btn => {

            btn.classList.remove(
                "active"
            );

        });


    if (boton) {

        boton.classList.add("active");

    } else {

        document
            .querySelectorAll(".filtro-btn")
            .forEach(btn => {

                const texto =
                    normalizarTexto(
                        btn.textContent
                    );

                const categoriaNormalizada =
                    normalizarTexto(
                        String(categoria)
                    );

                if (
                    texto ===
                    categoriaNormalizada
                ) {

                    btn.classList.add(
                        "active"
                    );
                }

            });
    }


    const productosSec =
        document.querySelector(".productos");

    if (productosSec) {

        productosSec.scrollIntoView({
            behavior: "smooth"
        });
    }
}


// ============================================================
// OFERTAS
// ============================================================

async function cargarOfertas() {

    try {

        const respuesta =
            await fetch(`${API_URL}/ofertas`);

        const datos =
            await obtenerRespuestaJSON(respuesta);

        if (!respuesta.ok) {

            throw new Error(
                datos?.mensaje ||
                "No se pudieron cargar las ofertas"
            );
        }

        ofertas =
            Array.isArray(datos)
                ? datos
                : datos.ofertas || [];

        console.log(
            "✅ Ofertas:",
            ofertas
        );

        mostrarOfertas();

    } catch (error) {

        console.error(
            "❌ Error cargando ofertas:",
            error
        );

        mostrarNotificacion(
            "❌ No se pudieron cargar las ofertas",
            "error"
        );
    }
}


function mostrarOfertas() {

    const grid =
        document.getElementById(
            "ofertas-grid"
        );

    if (!grid) return;


    if (
        !ofertas ||
        ofertas.length === 0
    ) {

        grid.innerHTML = `

            <div style="
                text-align:center;
                padding:3rem;
                grid-column:1/-1;
            ">

                <i class="fas fa-tags"
                   style="
                       font-size:3rem;
                       color:#ccc;
                   ">
                </i>

                <p style="margin-top:1rem;">
                    No hay ofertas disponibles
                </p>

            </div>

        `;

        return;
    }


    grid.innerHTML =
        ofertas
            .map(oferta => {

                const producto =
                    oferta.producto ||
                    oferta.Producto ||
                    buscarProducto(
                        oferta.producto_id
                    ) ||
                    {};

                const precioOriginal =
                    Number(
                        producto.precio ||
                        oferta.precio_original ||
                        0
                    );

                const precioOferta =
                    Number(
                        oferta.precio_oferta ||
                        0
                    );

                const descuento =
                    Number(
                        oferta.descuento ||
                        calcularDescuento(
                            precioOriginal,
                            precioOferta
                        )
                    );

                return `

                    <div class="oferta-card">

                        <div class="oferta-badge">
                            -${descuento.toFixed(0)}%
                        </div>

                        <div class="oferta-imagen"
                             style="
                                background-image:url('${escaparAtributo(
                    producto.imagen || ""
                )}');
                                background-size:cover;
                                background-position:center;
                             ">
                        </div>

                        <div class="oferta-info">

                            <h3>
                                ${escaparHTML(
                    producto.nombre ||
                    "Producto"
                )}
                            </h3>

                            <p>

                                <span class="precio-original">
                                    $${precioOriginal.toFixed(2)}
                                </span>

                                <span class="precio-oferta">
                                    $${precioOferta.toFixed(2)}
                                </span>

                            </p>

                            <button
                                class="btn-carrito"
                                onclick="
                                    agregarAlCarritoOferta(
                                        ${producto.id},
                                        ${precioOferta}
                                    )
                                ">

                                <i class="fas fa-cart-plus"></i>
                                Agregar al carrito

                            </button>

                        </div>

                    </div>

                `;
            })
            .join("");
}

// ============================================================
// PANEL ADMINISTRADOR - OFERTAS
// ============================================================

async function cargarOfertasAdmin() {

    const token =
        localStorage.getItem("token");

    const usuario =
        JSON.parse(
            localStorage.getItem("usuario") || "null"
        );

    if (!token || !usuario || usuario.rol !== "admin") {

        mostrarNotificacion(
            "❌ No tienes permisos de administrador",
            "error"
        );

        return;
    }

    const lista =
        document.getElementById(
            "admin-ofertas-lista"
        );

    if (!lista) return;

    lista.innerHTML = `
        <div class="pedidos-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Cargando ofertas...</p>
        </div>
    `;

    try {

        const respuesta =
            await fetch(
                `${API_URL}/ofertas`,
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const datos =
            await obtenerRespuestaJSON(
                respuesta
            );

        if (!respuesta.ok) {

            throw new Error(
                datos?.mensaje ||
                "No se pudieron cargar las ofertas"
            );
        }

        ofertas =
            Array.isArray(datos)
                ? datos
                : datos.ofertas || [];

        mostrarOfertasAdmin(ofertas);

    } catch (error) {

        console.error(
            "❌ Error cargando ofertas admin:",
            error
        );

        lista.innerHTML = `
            <div class="sin-pedidos">
                <i class="fas fa-exclamation-circle"></i>

                <h3>
                    Error cargando ofertas
                </h3>

                <p>
                    ${escaparHTML(error.message)}
                </p>
            </div>
        `;
    }
}


// ============================================================
// MOSTRAR OFERTAS ADMIN
// ============================================================

function mostrarOfertasAdmin(ofertasAdmin) {

    const lista =
        document.getElementById(
            "admin-ofertas-lista"
        );

    if (!lista) return;

    if (
        !ofertasAdmin ||
        ofertasAdmin.length === 0
    ) {

        lista.innerHTML = `
            <div class="sin-pedidos">

                <i class="fas fa-tags"></i>

                <h3>
                    No hay ofertas
                </h3>

                <p>
                    Todavía no hay ofertas registradas.
                </p>

            </div>
        `;

        return;
    }

    lista.innerHTML =
        ofertasAdmin.map(oferta => {

            const producto =
                oferta.producto ||
                oferta.Producto ||
                buscarProducto(
                    oferta.producto_id
                ) ||
                {};

            const precioOriginal =
                Number(
                    producto.precio ||
                    0
                );

            const precioOferta =
                Number(
                    oferta.precio_oferta ||
                    0
                );

            const descuento =
                Number(
                    oferta.descuento ||
                    calcularDescuento(
                        precioOriginal,
                        precioOferta
                    )
                );

            return `

                <div class="pedido-card admin-oferta-card">

                    <div class="pedido-header">

                        <div>

                            <h3>
                                ${escaparHTML(
                                    producto.nombre ||
                                    "Producto"
                                )}
                            </h3>

                            <p>
                                <i class="fas fa-tag"></i>

                                Descuento:
                                ${descuento.toFixed(0)}%
                            </p>

                        </div>

                        <div class="pedido-total">

                            $${precioOferta.toFixed(2)}

                        </div>

                    </div>


                    <div class="pedido-productos">

                        <div class="pedido-producto">

                            <div class="pedido-producto-imagen">

                                <img
                                    src="${escaparAtributo(
                                        producto.imagen || ""
                                    )}"
                                    alt="${escaparAtributo(
                                        producto.nombre ||
                                        "Producto"
                                    )}"
                                >

                            </div>


                            <div class="pedido-producto-info">

                                <strong>
                                    ${escaparHTML(
                                        producto.nombre ||
                                        "Producto"
                                    )}
                                </strong>

                                <span>

                                    Precio normal:
                                    $${precioOriginal.toFixed(2)}

                                </span>

                                <span>

                                    Precio oferta:
                                    $${precioOferta.toFixed(2)}

                                </span>

                                <span>

                                    Descuento:
                                    ${descuento.toFixed(0)}%

                                </span>

                            </div>

                        </div>

                    </div>


                    <div class="admin-producto-acciones">

                        <button
                            class="btn-admin-eliminar"
                            onclick="
                                eliminarOfertaAdmin(
                                    ${oferta.id}
                                )
                            ">

                            <i class="fas fa-trash"></i>

                            Eliminar oferta

                        </button>

                    </div>

                </div>

            `;

        }).join("");
}


// ============================================================
// ABRIR FORMULARIO DE OFERTA
// ============================================================

function abrirFormularioOferta() {

    const formulario =
        document.getElementById(
            "form-oferta-admin"
        );

    const form =
        document.getElementById(
            "formOfertaAdmin"
        );

    if (!formulario || !form) return;

    form.reset();

    const id =
        document.getElementById(
            "admin-oferta-id"
        );

    if (id) {
        id.value = "";
    }

    cargarProductosSelectOferta();

    formulario.style.display =
        "block";

    formulario.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// ============================================================
// CERRAR FORMULARIO DE OFERTA
// ============================================================

function cerrarFormularioOferta() {

    const formulario =
        document.getElementById(
            "form-oferta-admin"
        );

    const form =
        document.getElementById(
            "formOfertaAdmin"
        );

    if (form) {
        form.reset();
    }

    if (formulario) {
        formulario.style.display =
            "none";
    }
}


// ============================================================
// CARGAR PRODUCTOS EN SELECT
// ============================================================

function cargarProductosSelectOferta() {

    const select =
        document.getElementById(
            "admin-oferta-producto"
        );

    if (!select) return;

    select.innerHTML = `
        <option value="">
            Selecciona un producto
        </option>
    `;

    productos.forEach(producto => {

        const option =
            document.createElement("option");

        option.value =
            producto.id;

        option.textContent =
            `${producto.nombre} - $${Number(
                producto.precio || 0
            ).toFixed(2)}`;

        select.appendChild(option);
    });
}


// ============================================================
// CREAR OFERTA
// ============================================================

async function guardarOfertaAdmin(event) {

    event.preventDefault();

    const token = localStorage.getItem("token");

    const usuario = JSON.parse(
        localStorage.getItem("usuario") || "null"
    );

    if (
        !token ||
        !usuario ||
        usuario.rol !== "admin"
    ) {
        mostrarNotificacion(
            "❌ No tienes permisos de administrador",
            "error"
        );
        return;
    }


    // ============================================================
    // OBTENER DATOS DEL FORMULARIO
    // ============================================================

    const selectProducto =
        document.getElementById("admin-oferta-producto");

    const producto_id =
        Number(selectProducto?.value);

    const precio_oferta =
        Number(
            document.getElementById(
                "admin-precio-oferta"
            )?.value
        );

    const fecha_inicio =
        document.getElementById(
            "admin-fecha-inicio"
        )?.value;

    const fecha_fin =
        document.getElementById(
            "admin-fecha-fin"
        )?.value;

    const activo =
        document.getElementById(
            "admin-oferta-activo"
        )?.value === "true";


    // ============================================================
    // VALIDAR PRODUCTO
    // ============================================================

    if (!producto_id) {

        mostrarNotificacion(
            "⚠️ Selecciona un producto",
            "error"
        );

        return;
    }


    // ============================================================
    // OBTENER PRECIO ORIGINAL DEL PRODUCTO
    // ============================================================

    let precioOriginal = 0;

    /*
        Buscamos el producto seleccionado dentro
        del option del select.

        El option debe tener el precio guardado
        en data-precio.
    */

    const opcionSeleccionada =
        selectProducto.options[
            selectProducto.selectedIndex
        ];

    if (opcionSeleccionada) {

        precioOriginal =
            Number(
                opcionSeleccionada.dataset.precio
            );
    }


    // ============================================================
    // VALIDAR PRECIO DE OFERTA
    // ============================================================

    if (
        isNaN(precio_oferta) ||
        precio_oferta <= 0
    ) {

        mostrarNotificacion(
            "⚠️ Ingresa un precio de oferta válido",
            "error"
        );

        return;
    }


    if (
        precioOriginal > 0 &&
        precio_oferta >= precioOriginal
    ) {

        mostrarNotificacion(
            `⚠️ El precio de oferta debe ser menor al precio original ($${precioOriginal.toFixed(2)})`,
            "error"
        );

        return;
    }


    // ============================================================
    // VALIDAR FECHAS
    // ============================================================

    if (!fecha_inicio) {

        mostrarNotificacion(
            "⚠️ Selecciona la fecha de inicio",
            "error"
        );

        return;
    }


    if (!fecha_fin) {

        mostrarNotificacion(
            "⚠️ Selecciona la fecha de finalización",
            "error"
        );

        return;
    }


    if (
        new Date(fecha_fin) <=
        new Date(fecha_inicio)
    ) {

        mostrarNotificacion(
            "⚠️ La fecha final debe ser posterior a la inicial",
            "error"
        );

        return;
    }


    // ============================================================
    // CREAR OBJETO DE OFERTA
    // ============================================================

    /*
        NO enviamos descuento.

        El backend lo calcula automáticamente.
    */

    const oferta = {

        producto_id: producto_id,

        precio_oferta: precio_oferta,

        fecha_inicio: fecha_inicio,

        fecha_fin: fecha_fin,

        activo: activo

    };


    console.log(
        "📦 Oferta que se enviará:",
        oferta
    );


    // ============================================================
    // ENVIAR AL BACKEND
    // ============================================================

    try {

        const respuesta =
            await fetch(
                `${API_URL}/ofertas`,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(
                            oferta
                        )
                }
            );


        const datos =
            await obtenerRespuestaJSON(
                respuesta
            );


        if (!respuesta.ok) {

            throw new Error(
                datos?.mensaje ||
                "No se pudo crear la oferta"
            );
        }


        // ========================================================
        // ÉXITO
        // ========================================================

        console.log(
            "🔥 Oferta creada:",
            datos
        );


        mostrarNotificacion(
            "🔥 Oferta creada correctamente"
        );


        cerrarFormularioOferta();


        await cargarOfertas();

        await cargarOfertasAdmin();


    } catch (error) {

        console.error(
            "❌ Error creando oferta:",
            error
        );


        mostrarNotificacion(
            error.message ||
            "❌ No se pudo crear la oferta",
            "error"
        );
    }
}

// ============================================================
// FORMULARIO DE CONTACTO
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactoForm");

    if (form) {
        form.addEventListener("submit", enviarMensajeContacto);
    }

});


// ============================================================
// ENVIAR MENSAJE DE CONTACTO
// ============================================================

async function enviarMensajeContacto(event) {

    event.preventDefault();

    const nombre =
        document.getElementById("nombreContacto").value.trim();

    const email =
        document.getElementById("emailContacto").value.trim();

    const mensaje =
        document.getElementById("mensajeContacto").value.trim();


    // ========================================================
    // VALIDACIONES
    // ========================================================

    if (!nombre || !email || !mensaje) {

        mostrarNotificacion(
            "⚠️ Completa todos los campos",
            "error"
        );

        return;
    }


    try {

        const respuesta = await fetch(
            `${API_URL}/mensajes-contacto`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    nombre,
                    email,
                    mensaje
                })
            }
        );


        const datos =
            await obtenerRespuestaJSON(respuesta);


        if (!respuesta.ok) {

            throw new Error(
                datos?.mensaje ||
                "No se pudo enviar el mensaje"
            );

        }


        // ====================================================
        // MENSAJE ENVIADO
        // ====================================================

        mostrarNotificacion(
            "✅ Mensaje enviado correctamente"
        );


        // Limpiar formulario

        document.getElementById(
            "contactoForm"
        ).reset();


    } catch (error) {

        console.error(
            "❌ Error enviando mensaje:",
            error
        );


        mostrarNotificacion(
            error.message ||
            "❌ No se pudo enviar el mensaje",
            "error"
        );

    }

}

// ============================================================
// ELIMINAR OFERTA
// ============================================================

async function eliminarOfertaAdmin(id) {

    const token =
        localStorage.getItem("token");

    const usuario =
        JSON.parse(
            localStorage.getItem("usuario") || "null"
        );

    if (
        !token ||
        !usuario ||
        usuario.rol !== "admin"
    ) {

        mostrarNotificacion(
            "❌ No tienes permisos de administrador",
            "error"
        );

        return;
    }


    const confirmar =
        confirm(
            "¿Seguro que deseas eliminar esta oferta?"
        );


    if (!confirmar) return;


    try {

        const respuesta =
            await fetch(
                `${API_URL}/ofertas/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const datos =
            await obtenerRespuestaJSON(
                respuesta
            );


        if (!respuesta.ok) {

            throw new Error(
                datos?.mensaje ||
                "No se pudo eliminar la oferta"
            );

        }


        mostrarNotificacion(
            "✅ Oferta eliminada correctamente"
        );


        await cargarOfertas();

        await cargarOfertasAdmin();


    } catch (error) {

        console.error(
            "❌ Error eliminando oferta:",
            error
        );

        mostrarNotificacion(
            error.message ||
            "❌ No se pudo eliminar la oferta",
            "error"
        );
    }
}


// ============================================================
// FORMULARIO ADMIN OFERTA
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "formOfertaAdmin"
            );

        if (form) {

            form.addEventListener(
                "submit",
                guardarOfertaAdmin
            );

        }

    }
);

// ============================================================
// CARRITO
// ============================================================

function agregarAlCarrito(id) {

    const producto =
        buscarProducto(id);

    if (!producto) {

        mostrarNotificacion(
            "❌ Producto no encontrado",
            "error"
        );

        return;
    }

    const stock =
        Number(producto.stock || 0);

    if (stock <= 0) {

        mostrarNotificacion(
            "❌ Producto agotado",
            "error"
        );

        return;
    }

    const existe =
        carrito.find(
            item =>
                Number(item.id) ===
                Number(id)
        );

    if (existe) {

        if (
            Number(existe.cantidad) >=
            stock
        ) {

            mostrarNotificacion(
                "⚠️ No hay más unidades disponibles",
                "error"
            );

            return;
        }

        existe.cantidad++;

    } else {

        carrito.push({

            id:
                Number(producto.id),

            nombre:
                producto.nombre,

            precio:
                Number(producto.precio),

            imagen:
                producto.imagen,

            cantidad:
                1,

            enOferta:
                false

        });
    }

    guardarCarrito();
    actualizarContador();

    mostrarNotificacion(
        `${producto.nombre} agregado al carrito ✓`
    );
}


function agregarAlCarritoOferta(
    productoId,
    precioOferta
) {

    const producto =
        buscarProducto(productoId);

    if (!producto) {

        mostrarNotificacion(
            "❌ Producto no encontrado",
            "error"
        );

        return;
    }

    const stock =
        Number(producto.stock || 0);

    if (stock <= 0) {

        mostrarNotificacion(
            "❌ Producto agotado",
            "error"
        );

        return;
    }

    const existe =
        carrito.find(
            item =>
                Number(item.id) ===
                Number(productoId)
        );

    if (existe) {

        if (
            Number(existe.cantidad) >=
            stock
        ) {

            mostrarNotificacion(
                "⚠️ No hay más unidades disponibles",
                "error"
            );

            return;
        }

        existe.cantidad++;

        existe.enOferta = true;

        existe.precioOferta =
            Number(precioOferta);

    } else {

        carrito.push({

            id:
                Number(producto.id),

            nombre:
                producto.nombre,

            precio:
                Number(producto.precio),

            imagen:
                producto.imagen,

            cantidad:
                1,

            enOferta:
                true,

            precioOferta:
                Number(precioOferta)

        });
    }

    guardarCarrito();
    actualizarContador();

    mostrarNotificacion(
        `${producto.nombre} agregado al carrito ✓`
    );
}


function actualizarContador() {

    const total =
        carrito.reduce(
            (sum, item) =>
                sum +
                Number(item.cantidad || 0),
            0
        );

    const contador =
        document.getElementById(
            "contador-carrito"
        );

    if (!contador) return;

    contador.innerText =
        total;
}


function abrirCarrito() {

    const modal =
        document.getElementById(
            "carrito-modal"
        );

    const items =
        document.getElementById(
            "carrito-items"
        );

    const totalDiv =
        document.getElementById(
            "carrito-total"
        );

    if (!modal) return;


    if (carrito.length === 0) {

        items.innerHTML = `
            <p style="
                text-align:center;
                padding:2rem;
            ">
                🛒 El carrito está vacío
            </p>
        `;

        totalDiv.innerHTML =
            "Total: $0.00";

    } else {

        items.innerHTML =
            carrito.map(item => {

                const precio =
                    obtenerPrecioCarrito(item);

                const subtotal =
                    precio *
                    Number(item.cantidad);

                return `

                    <div class="carrito-item">

                        <div>

                            <strong>
                                ${escaparHTML(item.nombre)}
                            </strong>

                            <br>

                            <small>

                                ${item.enOferta
                        ? "🔥 Oferta - "
                        : ""
                    }

                                $${precio.toFixed(2)}
                                x
                                ${item.cantidad}

                            </small>

                        </div>

                        <div>

                            <strong>
                                $${subtotal.toFixed(2)}
                            </strong>

                            <button
                                onclick="
                                    eliminarDelCarrito(${item.id})
                                "
                                style="
                                    background:none;
                                    border:none;
                                    color:#e74c3c;
                                    margin-left:10px;
                                    cursor:pointer;
                                ">

                                <i class="fas fa-trash"></i>

                            </button>

                        </div>

                    </div>
                `;

            }).join("");

        totalDiv.innerHTML =
            `Total: $${calcularTotalCarrito().toFixed(2)}`;
    }

    modal.style.display =
        "flex";
}


function eliminarDelCarrito(id) {

    const index =
        carrito.findIndex(
            item =>
                Number(item.id) ===
                Number(id)
        );

    if (index === -1) return;

    if (
        Number(carrito[index].cantidad) > 1
    ) {

        carrito[index].cantidad--;

    } else {

        carrito.splice(index, 1);
    }

    guardarCarrito();
    actualizarContador();

    abrirCarrito();
}


function cerrarCarrito() {

    const modal =
        document.getElementById(
            "carrito-modal"
        );

    if (modal) {

        modal.style.display =
            "none";
    }
}


function calcularTotalCarrito() {

    return carrito.reduce(
        (total, item) => {

            const precio =
                obtenerPrecioCarrito(item);

            return total +
                precio *
                Number(item.cantidad || 0);

        },
        0
    );
}


function obtenerPrecioCarrito(item) {

    if (
        item.enOferta &&
        item.precioOferta !== undefined &&
        item.precioOferta !== null
    ) {

        return Number(
            item.precioOferta
        );
    }

    return Number(
        item.precio || 0
    );
}


// ============================================================
// NAVEGACIÓN
// ============================================================

function ocultarTodasSecciones() {

    const secciones = [

        document.getElementById("inicio"),

        document.getElementById("coleccion"),

        document.querySelector(".productos"),

        document.getElementById("ofertas"),

        document.getElementById("contacto"),

        document.getElementById("mis-pedidos"),

        document.getElementById("panel-admin")

    ];

    secciones.forEach(seccion => {

        if (seccion) {

            seccion.style.display = "none";

        }

    });
}


function irInicio() {
    const usuario =
        JSON.parse(
            localStorage.getItem("usuario") || "null"
        );

    if (usuario?.rol === "admin") {

        irPanelAdmin();

        return;
    }

    ocultarTodasSecciones();

    const inicio =
        document.getElementById("inicio");

    const coleccion =
        document.getElementById("coleccion");

    const productosSec =
        document.querySelector(".productos");

    if (inicio)
        inicio.style.display = "flex";

    if (coleccion)
        coleccion.style.display = "block";

    if (productosSec)
        productosSec.style.display = "block";

    if (inicio) {

        inicio.scrollIntoView({
            behavior: "smooth"
        });
    }
}


function irColeccion() {
    const usuario =
        JSON.parse(
            localStorage.getItem("usuario") || "null"
        );

    if (usuario?.rol === "admin") {

        irPanelAdmin();

        return;
    }
    ocultarTodasSecciones();

    const coleccion =
        document.getElementById("coleccion");

    const productosSec =
        document.querySelector(".productos");

    if (coleccion)
        coleccion.style.display = "block";

    if (productosSec)
        productosSec.style.display = "block";

    if (coleccion) {

        coleccion.scrollIntoView({
            behavior: "smooth"
        });
    }
}


function verColeccion() {

    irColeccion();
}


async function irOfertas() {
    const usuario =
        JSON.parse(
            localStorage.getItem("usuario") || "null"
        );

    if (usuario?.rol === "admin") {

        irPanelAdmin();

        return;
    }
    ocultarTodasSecciones();

    const ofertasSec =
        document.getElementById("ofertas");

    if (!ofertasSec) return;

    ofertasSec.style.display =
        "block";

    await cargarOfertas();

    ofertasSec.scrollIntoView({
        behavior: "smooth"
    });
}


function irContacto() {
    const usuario =
        JSON.parse(
            localStorage.getItem("usuario") || "null"
        );

    if (usuario?.rol === "admin") {

        irPanelAdmin();

        return;
    }
    ocultarTodasSecciones();

    const contactoSec =
        document.getElementById("contacto");

    if (!contactoSec) return;

    contactoSec.style.display =
        "block";

    contactoSec.scrollIntoView({
        behavior: "smooth"
    });
}


function toggleMenu() {

    const nav =
        document.getElementById(
            "nav-links"
        );

    if (nav) {

        nav.classList.toggle(
            "show"
        );
    }
}


// ============================================================
// LOGIN
// ============================================================

function abrirLoginModal() {

    const modal =
        document.getElementById(
            "login-modal"
        );

    if (modal) {

        modal.style.display =
            "flex";
    }
}


function cerrarLoginModal() {

    const modal =
        document.getElementById(
            "login-modal"
        );

    if (modal) {

        modal.style.display =
            "none";
    }
}


async function iniciarSesion() {

    const email =
        document
            .getElementById("emailSesion")
            ?.value
            .trim();

    const password =
        document
            .getElementById("passwordSesion")
            ?.value;

    if (!validarCorreo(email)) {

        mostrarNotificacion(
            "⚠️ Ingresa un correo electrónico válido",
            "error"
        );

        return;
    }

    if (!password) {

        mostrarNotificacion(
            "⚠️ Ingresa tu contraseña",
            "error"
        );

        return;
    }

    try {

        const respuesta =
            await fetch(
                `${API_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

        const datos =
            await obtenerRespuestaJSON(
                respuesta
            );

        if (!respuesta.ok) {

            mostrarNotificacion(
                datos?.mensaje ||
                "Correo o contraseña incorrectos",
                "error"
            );

            return;
        }

        if (datos.token) {

            localStorage.setItem(
                "token",
                datos.token
            );
        }

        const usuario =
            datos.usuario ||
            datos.user;

        if (usuario) {

            localStorage.setItem(
                "usuario",
                JSON.stringify(usuario)
            );
        }

        cerrarLoginModal();

        actualizarEstadoSesion();

        mostrarNotificacion(
            `✅ Bienvenido ${usuario?.nombre ||
            "a StreetZone"
            }`
        );


        // =====================================================
        // REDIRECCIÓN SEGÚN ROL
        // =====================================================

        if (usuario?.rol === "admin") {

            setTimeout(() => {

                irPanelAdmin();

            }, 500);

        } else {

            setTimeout(() => {

                irInicio();

            }, 500);

        }

    } catch (error) {

        console.error(
            "❌ Error iniciando sesión:",
            error
        );

        mostrarNotificacion(
            "❌ No se pudo conectar con el servidor",
            "error"
        );
    }
}


function cerrarSesion() {

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    // Ocultar panel administrativo

    const panelAdmin =
        document.getElementById(
            "panel-admin"
        );

    if (panelAdmin) {

        panelAdmin.style.display =
            "none";
    }


    actualizarEstadoSesion();


    // Regresar al inicio

    irInicio();


    mostrarNotificacion(
        "👋 Sesión cerrada correctamente"
    );
}


function actualizarEstadoSesion() {

    const btnLogin =
        document.getElementById("btn-login");

    const btnLogout =
        document.getElementById("btn-logout");

    const menuAdmin =
        document.getElementById("menu-admin");

    const menuPedidos =
        document.getElementById("menu-mis-pedidos");

    const menuCarrito =
        document.getElementById("menu-carrito");

    const token =
        localStorage.getItem("token");

    let usuario = null;

    try {

        usuario = JSON.parse(
            localStorage.getItem("usuario") || "null"
        );

    } catch (error) {

        console.error(
            "❌ Error leyendo usuario:",
            error
        );

        usuario = null;
    }


    // =====================================================
    // NO HAY SESIÓN
    // =====================================================

    if (!token || !usuario) {

        if (btnLogin)
            btnLogin.style.display = "list-item";

        if (btnLogout)
            btnLogout.style.display = "none";

        if (menuAdmin)
            menuAdmin.style.display = "none";

        if (menuPedidos)
            menuPedidos.style.display = "none";

        if (menuCarrito)
            menuCarrito.style.display = "list-item";

        return;
    }


    // =====================================================
    // ADMINISTRADOR
    // =====================================================

    if (usuario.rol === "admin") {

        // Login oculto
        if (btnLogin)
            btnLogin.style.display = "none";

        // Logout visible
        if (btnLogout)
            btnLogout.style.display = "list-item";

        // Panel admin visible
        if (menuAdmin)
            menuAdmin.style.display = "list-item";

        // Ocultar menú de cliente
        const menuInicio =
            document.getElementById("menu-inicio");

        const menuColeccion =
            document.getElementById("menu-coleccion");

        const menuOfertas =
            document.getElementById("menu-ofertas");

        const menuContacto =
            document.getElementById("menu-contacto");

        if (menuInicio)
            menuInicio.style.display = "none";

        if (menuColeccion)
            menuColeccion.style.display = "none";

        if (menuOfertas)
            menuOfertas.style.display = "none";

        if (menuContacto)
            menuContacto.style.display = "none";

        // Mis pedidos oculto
        if (menuPedidos)
            menuPedidos.style.display = "none";

        // Carrito oculto
        if (menuCarrito)
            menuCarrito.style.display = "none";

        // Ocultar contenido de cliente
        ocultarInterfazCliente();

        return;
    }


    // =====================================================
    // CLIENTE
    // =====================================================

    document.getElementById("menu-inicio").style.display = "list-item";
    document.getElementById("menu-coleccion").style.display = "list-item";
    document.getElementById("menu-ofertas").style.display = "list-item";
    document.getElementById("menu-contacto").style.display = "list-item";

    if (btnLogin)
        btnLogin.style.display = "none";

    if (btnLogout)
        btnLogout.style.display = "list-item";

    if (menuAdmin)
        menuAdmin.style.display = "none";

    if (menuPedidos)
        menuPedidos.style.display = "list-item";

    if (menuCarrito)
        menuCarrito.style.display = "list-item";


    mostrarInterfazCliente();
}

// ============================================================
// VERIFICAR REGRESO DE STRIPE
// ============================================================

async function verificarPagoExitoso() {

    console.log("🔙 URL de regreso:", window.location.href);
    console.log("📦 Parámetros:", window.location.search);

    const parametros =
        new URLSearchParams(
            window.location.search
        );

    const pago =
        parametros.get("pago");

    const pedidoId =
        parametros.get("pedido");

    console.log("💳 Pago:", pago);
    console.log("🧾 Pedido:", pedidoId);

    if (pago !== "exitoso") {
        return;
    }

    console.log("✅ Pago exitoso. Vaciando carrito...");

    carrito = [];

    localStorage.removeItem("carrito");
    localStorage.removeItem("checkout_pedido_id");

    actualizarContador();

    cerrarCarrito();
    cerrarPagoModal();

    mostrarNotificacion(
        "✅ ¡Pago realizado correctamente!"
    );

    window.history.replaceState(
        {},
        document.title,
        window.location.pathname
    );

    setTimeout(() => {
        irMisPedidos();
    }, 800);
}

// ============================================================
// OCULTAR INTERFAZ DEL CLIENTE PARA ADMIN
// ============================================================

function ocultarInterfazCliente() {

    const elementosCliente = [

        document.getElementById("inicio"),
        document.getElementById("coleccion"),
        document.querySelector(".productos"),
        document.getElementById("ofertas"),
        document.getElementById("contacto"),
        document.getElementById("mis-pedidos")

    ];

    elementosCliente.forEach(elemento => {

        if (elemento) {
            elemento.style.display = "none";
        }

    });

    // Ocultar carrito
    const carritoModal =
        document.getElementById("carrito-modal");

    if (carritoModal) {
        carritoModal.style.display = "none";
    }

    // Mostrar panel admin
    const panel =
        document.getElementById("panel-admin");

    if (panel) {
        panel.style.display = "block";
    }
}


// ============================================================
// MOSTRAR INTERFAZ DEL CLIENTE
// ============================================================

function mostrarInterfazCliente() {

    const panel =
        document.getElementById("panel-admin");

    if (panel) {

        panel.style.display = "none";

    }


    const inicio =
        document.getElementById("inicio");

    const coleccion =
        document.getElementById("coleccion");

    const productosSec =
        document.querySelector(".productos");


    if (inicio)
        inicio.style.display = "flex";

    if (coleccion)
        coleccion.style.display = "block";

    if (productosSec)
        productosSec.style.display = "block";
}

function irPanelAdmin() {

    // ========================================================
    // VERIFICAR SESIÓN
    // ========================================================

    const token =
        localStorage.getItem("token");

    let usuario = null;

    try {

        usuario = JSON.parse(
            localStorage.getItem("usuario") || "null"
        );

    } catch (error) {

        console.error(
            "❌ Error leyendo usuario:",
            error
        );

        usuario = null;
    }


    // ========================================================
    // VERIFICAR ADMINISTRADOR
    // ========================================================

    if (
        !token ||
        !usuario ||
        usuario.rol !== "admin"
    ) {

        mostrarNotificacion(
            "❌ Acceso denegado. Solo los administradores pueden acceder al panel.",
            "error"
        );

        // Asegurarnos de que el panel permanezca oculto

        const panel =
            document.getElementById(
                "panel-admin"
            );

        if (panel) {

            panel.style.display =
                "none";
        }

        return;
    }


    // ========================================================
    // OCULTAR TODAS LAS SECCIONES
    // ========================================================

    ocultarTodasSecciones();


    // ========================================================
    // MOSTRAR PANEL ADMIN
    // ========================================================

    const panel =
        document.getElementById(
            "panel-admin"
        );

    if (!panel) {

        mostrarNotificacion(
            "❌ No se encontró el panel de administración",
            "error"
        );

        return;
    }


    panel.style.display =
        "block";


    // ========================================================
    // CARGAR PRODUCTOS DEL ADMIN
    // ========================================================

    cargarProductosAdmin();


    // ========================================================
    // SCROLL AL PANEL
    // ========================================================

    panel.scrollIntoView({
        behavior: "smooth"
    });
}

// ============================================================
// PANEL ADMINISTRADOR - CRUD PRODUCTOS
// ============================================================

async function cargarProductosAdmin() {

    const usuario =
        JSON.parse(
            localStorage.getItem("usuario") || "null"
        );

    const token =
        localStorage.getItem("token");

    if (!usuario || usuario.rol !== "admin" || !token) {

        mostrarNotificacion(
            "❌ No tienes permisos de administrador",
            "error"
        );

        return;
    }

    const loading =
        document.getElementById("admin-loading");

    const lista =
        document.getElementById("admin-productos-lista");

    if (!lista) return;

    if (loading) {
        loading.style.display = "block";
    }

    lista.innerHTML = "";

    try {

        const respuesta =
            await fetch(
                `${API_URL}/productos`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const datos =
            await obtenerRespuestaJSON(
                respuesta
            );

        if (!respuesta.ok) {

            throw new Error(
                datos?.mensaje ||
                "No se pudieron cargar los productos"
            );
        }

        const productosAdmin =
            Array.isArray(datos)
                ? datos
                : datos.productos || [];
        window.productosAdmin = productosAdmin;

        mostrarProductosAdmin(
            productosAdmin
        );

        if (productosAdmin.length === 0) {

            lista.innerHTML = `

                <div class="sin-pedidos">

                    <i class="fas fa-box-open"></i>

                    <h3>
                        No hay productos
                    </h3>

                    <p>
                        Todavía no hay productos registrados.
                    </p>

                </div>

            `;

            return;
        }



    } catch (error) {

        console.error(
            "❌ Error cargando productos admin:",
            error
        );

        lista.innerHTML = `

            <div class="sin-pedidos">

                <i class="fas fa-exclamation-circle"></i>

                <h3>
                    Error cargando productos
                </h3>

                <p>
                    ${escaparHTML(error.message)}
                </p>

            </div>

        `;

    } finally {

        if (loading) {
            loading.style.display = "none";
        }

    }
}

// ============================================================
// FILTRO DE PRODUCTOS ADMIN
// ============================================================

function filtrarProductosAdmin(
    categoria,
    boton = null
) {

    categoriaAdminActual =
        categoria;


    document
        .querySelectorAll(".admin-filtro-btn")
        .forEach(btn => {

            btn.classList.remove(
                "active"
            );

        });


    if (boton) {

        boton.classList.add(
            "active"
        );

    }


    const productosAdmin =
        window.productosAdmin || [];


    let productosFiltrados =
        productosAdmin;


    if (
        categoria !== "todos"
    ) {

        productosFiltrados =
            productosAdmin.filter(
                producto =>
                    coincideCategoria(
                        producto,
                        categoria
                    )
            );

    }


    mostrarProductosAdmin(
        productosFiltrados
    );
}

// ============================================================
// MOSTRAR PRODUCTOS ADMIN
// ============================================================

function mostrarProductosAdmin(
    productosAdmin
) {

    const lista =
        document.getElementById(
            "admin-productos-lista"
        );

    if (!lista) return;


    if (
        !productosAdmin ||
        productosAdmin.length === 0
    ) {

        lista.innerHTML = `

            <div class="sin-pedidos">

                <i class="fas fa-box-open"></i>

                <h3>
                    No hay productos
                </h3>

                <p>
                    No existen productos
                    en esta categoría.
                </p>

            </div>

        `;

        return;
    }


    lista.innerHTML =
        productosAdmin
            .map(producto => {

                const categoria =
                    obtenerNombreCategoria(
                        producto.categoria_id
                    );


                const precio =
                    Number(
                        producto.precio || 0
                    );


                const stock =
                    Number(
                        producto.stock || 0
                    );


                const imagen =
                    producto.imagen ||
                    "https://via.placeholder.com/300x300?text=Sin+imagen";


                const estadoStock =
                    stock > 0
                        ? "Disponible"
                        : "Agotado";


                return `

                    <div class="pedido-card admin-producto-card">


                        <div class="pedido-header">

                            <div>

                                <h3>
                                    ${escaparHTML(
                    producto.nombre ||
                    "Producto"
                )}
                                </h3>

                                <p>

                                    <i class="fas fa-tag"></i>

                                    ${escaparHTML(
                    categoria
                )}

                                </p>

                            </div>


                            <div class="pedido-total">

                                $${precio.toFixed(2)}

                            </div>

                        </div>


                        <div class="pedido-productos">

                            <div class="pedido-producto">


                                <div class="pedido-producto-imagen">

                                    <img
                                        src="${escaparAtributo(
                    imagen
                )}"
                                        alt="${escaparAtributo(
                    producto.nombre ||
                    "Producto"
                )}"
                                    >

                                </div>


                                <div class="pedido-producto-info">

                                    <strong>
                                        ${escaparHTML(
                    producto.nombre ||
                    "Producto"
                )}
                                    </strong>


                                    <span>

                                        <i class="fas fa-box"></i>

                                        Stock:
                                        ${stock}

                                    </span>


                                    <span>

                                        <i class="fas fa-layer-group"></i>

                                        Categoría:
                                        ${escaparHTML(
                    categoria
                )}

                                    </span>


                                    <span>

                                        <i class="fas fa-circle"></i>

                                        ${estadoStock}

                                    </span>

                                </div>


                                <div class="pedido-producto-subtotal">

                                    $${precio.toFixed(2)}

                                </div>

                            </div>

                        </div>


                        <div class="pedido-footer">

                            <div>

                                <span>
                                    Descripción
                                </span>

                                <p style="
                                    margin:5px 0 0;
                                    max-width:600px;
                                ">

                                    ${escaparHTML(
                    producto.descripcion ||
                    "Sin descripción"
                )}

                                </p>

                            </div>

                        </div>


                        <div class="admin-producto-acciones">


                            <button
                                class="btn-admin-editar"
                                onclick="
                                    editarProductoAdmin(
                                        ${producto.id}
                                    )
                                ">

                                <i class="fas fa-pen"></i>

                                Editar

                            </button>


                            <button
                                class="btn-admin-eliminar"
                                onclick="
                                    eliminarProductoAdmin(
                                        ${producto.id}
                                    )
                                ">

                                <i class="fas fa-trash"></i>

                                Eliminar

                            </button>


                        </div>


                    </div>

                `;

            })
            .join("");
}

// ============================================================
// ABRIR FORMULARIO
// ============================================================

function abrirFormularioProducto() {

    const formulario =
        document.getElementById(
            "form-producto-admin"
        );

    const titulo =
        document.getElementById(
            "titulo-form-producto"
        );

    const form =
        document.getElementById(
            "formProductoAdmin"
        );

    if (!formulario || !form) return;

    form.reset();

    document.getElementById(
        "admin-producto-id"
    ).value = "";

    if (titulo) {

        titulo.textContent =
            "Nuevo producto";

    }

    formulario.style.display =
        "block";

    formulario.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// ============================================================
// CERRAR FORMULARIO
// ============================================================

function cerrarFormularioProducto() {

    const formulario =
        document.getElementById(
            "form-producto-admin"
        );

    const form =
        document.getElementById(
            "formProductoAdmin"
        );

    if (form) {
        form.reset();
    }

    document.getElementById(
        "admin-producto-id"
    ).value = "";

    if (formulario) {

        formulario.style.display =
            "none";

    }
}


// ============================================================
// CREAR / ACTUALIZAR PRODUCTO
// ============================================================

async function guardarProductoAdmin(event) {

    event.preventDefault();

    const token =
        localStorage.getItem("token");

    const usuario =
        JSON.parse(
            localStorage.getItem("usuario") || "null"
        );

    if (!token || !usuario || usuario.rol !== "admin") {

        mostrarNotificacion(
            "❌ No tienes permisos de administrador",
            "error"
        );

        return;
    }


    const id =
        document
            .getElementById("admin-producto-id")
            ?.value;


    const nombre =
        document
            .getElementById("admin-nombre")
            ?.value
            .trim();


    const precio =
        Number(
            document
                .getElementById("admin-precio")
                ?.value
        );


    const stock =
        Number(
            document
                .getElementById("admin-stock")
                ?.value
        );


    const categoria_id =
        Number(
            document
                .getElementById("admin-categoria")
                ?.value
        );


    const imagen =
        document
            .getElementById("admin-imagen")
            ?.value
            .trim();


    const descripcion =
        document
            .getElementById("admin-descripcion")
            ?.value
            .trim();


    if (!nombre) {

        mostrarNotificacion(
            "⚠️ Ingresa el nombre del producto",
            "error"
        );

        return;
    }


    if (isNaN(precio) || precio < 0) {

        mostrarNotificacion(
            "⚠️ Ingresa un precio válido",
            "error"
        );

        return;
    }


    if (isNaN(stock) || stock < 0) {

        mostrarNotificacion(
            "⚠️ Ingresa un stock válido",
            "error"
        );

        return;
    }


    if (!categoria_id) {

        mostrarNotificacion(
            "⚠️ Selecciona una categoría",
            "error"
        );

        return;
    }


    const producto = {

        nombre,

        descripcion,

        precio,

        stock,

        imagen,

        categoria_id

    };


    try {

        const metodo =
            id
                ? "PUT"
                : "POST";


        const url =
            id
                ? `${API_URL}/productos/${id}`
                : `${API_URL}/productos`;


        console.log(
            "📦 Guardando producto:",
            producto
        );


        const respuesta =
            await fetch(
                url,
                {
                    method: metodo,

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(
                            producto
                        )
                }
            );


        const datos =
            await obtenerRespuestaJSON(
                respuesta
            );


        console.log(
            "📦 Respuesta:",
            datos
        );


        if (!respuesta.ok) {

            throw new Error(
                datos?.mensaje ||
                (
                    id
                        ? "No se pudo actualizar el producto"
                        : "No se pudo crear el producto"
                )
            );

        }


        mostrarNotificacion(
            id
                ? "✅ Producto actualizado correctamente"
                : "✅ Producto creado correctamente"
        );


        cerrarFormularioProducto();


        // Actualizar catálogo principal
        await cargarProductos();


        // Actualizar productos del administrador
        await cargarProductosAdmin();


    } catch (error) {

        console.error(
            "❌ Error guardando producto:",
            error
        );

        mostrarNotificacion(
            error.message ||
            "❌ No se pudo guardar el producto",
            "error"
        );

    }

}


// ============================================================
// EDITAR PRODUCTO
// ============================================================

async function editarProductoAdmin(id) {

    const producto =
        buscarProducto(id);

    if (!producto) {

        mostrarNotificacion(
            "❌ Producto no encontrado",
            "error"
        );

        return;
    }


    const formulario =
        document.getElementById(
            "form-producto-admin"
        );

    const titulo =
        document.getElementById(
            "titulo-form-producto"
        );


    document.getElementById(
        "admin-producto-id"
    ).value =
        producto.id;


    document.getElementById(
        "admin-nombre"
    ).value =
        producto.nombre || "";


    document.getElementById(
        "admin-precio"
    ).value =
        producto.precio || 0;


    document.getElementById(
        "admin-stock"
    ).value =
        producto.stock || 0;


    document.getElementById(
        "admin-categoria"
    ).value =
        producto.categoria_id || "";


    document.getElementById(
        "admin-imagen"
    ).value =
        producto.imagen || "";


    document.getElementById(
        "admin-descripcion"
    ).value =
        producto.descripcion || "";


    if (titulo) {

        titulo.textContent =
            "Editar producto";

    }


    if (formulario) {

        formulario.style.display =
            "block";

        formulario.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

}


// ============================================================
// ELIMINAR PRODUCTO
// ============================================================

async function eliminarProductoAdmin(id) {

    const usuario =
        JSON.parse(
            localStorage.getItem("usuario") || "null"
        );

    const token =
        localStorage.getItem("token");


    if (!usuario || usuario.rol !== "admin" || !token) {

        mostrarNotificacion(
            "❌ No tienes permisos de administrador",
            "error"
        );

        return;
    }


    const producto =
        buscarProducto(id);


    const nombre =
        producto?.nombre ||
        `#${id}`;


    const confirmar =
        confirm(
            `¿Seguro que deseas eliminar el producto "${nombre}"?`
        );


    if (!confirmar) return;


    try {

        const respuesta =
            await fetch(
                `${API_URL}/productos/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const datos =
            await obtenerRespuestaJSON(
                respuesta
            );


        if (!respuesta.ok) {

            throw new Error(
                datos?.mensaje ||
                "No se pudo eliminar el producto"
            );

        }


        mostrarNotificacion(
            "✅ Producto eliminado correctamente"
        );


        await cargarProductos();


        await cargarProductosAdmin();


    } catch (error) {

        console.error(
            "❌ Error eliminando producto:",
            error
        );


        mostrarNotificacion(
            error.message ||
            "❌ No se pudo eliminar el producto",
            "error"
        );

    }

}


// ============================================================
// FORMULARIO ADMIN
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "formProductoAdmin"
            );

        if (form) {

            form.addEventListener(
                "submit",
                guardarProductoAdmin
            );

        }

    }
);

// ============================================================
// PRODUCTO INDIVIDUAL
// ============================================================

async function verProducto(id) {

    try {

        const respuesta =
            await fetch(
                `${API_URL}/productos/${id}`
            );

        const datos =
            await obtenerRespuestaJSON(
                respuesta
            );

        if (!respuesta.ok) {

            throw new Error(
                datos?.mensaje ||
                "No se pudo obtener el producto"
            );
        }

        const producto =
            datos.producto ||
            datos;

        const precio =
            Number(
                producto.precio || 0
            );

        mostrarNotificacion(
            `${producto.nombre} - $${precio.toFixed(2)}`
        );

    } catch (error) {

        console.error(
            "❌ Error obteniendo producto:",
            error
        );

        mostrarNotificacion(
            "❌ No se pudo obtener el producto",
            "error"
        );
    }
}


// ============================================================
// CONTACTO
// ============================================================

async function enviarMensajeContacto() {

    const nombre =
        document
            .getElementById("nombreContacto")
            ?.value
            .trim();

    const email =
        document
            .getElementById("emailContacto")
            ?.value
            .trim();

    const mensaje =
        document
            .getElementById("mensajeContacto")
            ?.value
            .trim();

    if (!nombre) {

        mostrarNotificacion(
            "⚠️ Ingresa tu nombre",
            "error"
        );

        return;
    }

    if (!validarCorreo(email)) {

        mostrarNotificacion(
            "⚠️ Ingresa un correo válido",
            "error"
        );

        return;
    }

    if (!mensaje) {

        mostrarNotificacion(
            "⚠️ Ingresa tu mensaje",
            "error"
        );

        return;
    }

    try {

        const respuesta =
            await fetch(
                `${API_URL}/mensajes-contacto`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        nombre,
                        email,
                        mensaje
                    })
                }
            );

        const datos =
            await obtenerRespuestaJSON(
                respuesta
            );

        if (!respuesta.ok) {

            throw new Error(
                datos?.mensaje ||
                "No se pudo enviar el mensaje"
            );
        }

        mostrarNotificacion(
            "📨 ¡Mensaje enviado correctamente!"
        );

        document
            .getElementById(
                "contactoForm"
            )
            ?.reset();

    } catch (error) {

        console.error(
            "❌ Error enviando mensaje:",
            error
        );

        mostrarNotificacion(
            error.message ||
            "❌ No se pudo enviar el mensaje",
            "error"
        );
    }
}


// ============================================================
// PEDIDOS
// ============================================================

function finalizarCompra() {

    if (
        !carrito ||
        carrito.length === 0
    ) {

        mostrarNotificacion(
            "🛒 Tu carrito está vacío",
            "error"
        );

        return;
    }

    const token =
        localStorage.getItem("token");

    if (!token) {

        mostrarNotificacion(
            "⚠️ Debes iniciar sesión para comprar",
            "error"
        );

        cerrarCarrito();
        abrirLoginModal();

        return;
    }

    cerrarCarrito();
    abrirPagoModal();
}


function abrirPagoModal() {

    const modal =
        document.getElementById(
            "pago-modal"
        );

    const resumen =
        document.getElementById(
            "resumen-compra"
        );

    if (!modal) return;

    totalActual =
        calcularTotalCarrito();

    resumen.innerHTML = `

        <h4>
            Resumen del pedido
        </h4>

        ${carrito.map(item => {

        const precio =
            obtenerPrecioCarrito(item);

        const subtotal =
            precio *
            Number(item.cantidad);

        return `

                <div class="resumen-item">

                    <span>
                        ${escaparHTML(item.nombre)}
                        x ${item.cantidad}
                    </span>

                    <span>
                        $${subtotal.toFixed(2)}
                    </span>

                </div>

            `;

    }).join("")}

        <div class="resumen-total">

            <span>
                Total
            </span>

            <span>
                $${totalActual.toFixed(2)}
            </span>

        </div>

    `;


    const btnPagar =
        document.getElementById(
            "btn-pagar"
        );

    if (btnPagar) {

        btnPagar.innerHTML =
            `<i class="fas fa-check"></i>
             Confirmar pedido $${totalActual.toFixed(2)}`;

        btnPagar.onclick =
            procesarPago;
    }

    ocultarFormulariosPago();

    limpiarEstadosPago();

    modal.style.display =
        "flex";
}


function seleccionarMetodo(
    metodo,
    elemento
) {

    metodoSeleccionado =
        metodo;

    document
        .querySelectorAll(".metodo-pago")
        .forEach(item =>
            item.classList.remove(
                "seleccionado"
            )
        );

    if (elemento) {

        elemento.classList.add(
            "seleccionado"
        );
    }

    ocultarFormulariosPago();

    limpiarEstadosPago();

    const formularios = {

        tarjeta: "form-tarjeta",

        paypal: "form-paypal",

        transferencia: "form-transferencia"

    };

    if (formularios[metodo]) {

        mostrarFormularioPago(
            formularios[metodo]
        );
    }
}


function mostrarFormularioPago(id) {

    const formulario =
        document.getElementById(id);

    if (formulario) {

        formulario.style.display =
            "block";
    }
}


function ocultarFormulariosPago() {

    [
        "form-tarjeta",
        "form-paypal",
        "form-transferencia"
    ].forEach(id => {

        const elemento =
            document.getElementById(id);

        if (elemento) {

            elemento.style.display =
                "none";
        }

    });
}


function limpiarEstadosPago() {

    [
        "tarjeta-status",
        "paypal-status",
        "transferencia-status"
    ].forEach(id => {

        const elemento =
            document.getElementById(id);

        if (elemento) {

            elemento.innerHTML = "";
        }

    });
}


async function crearPedidoDesdeCarrito() {

    const token =
        localStorage.getItem("token");

    if (!token) {

        mostrarNotificacion(
            "⚠️ Debes iniciar sesión para comprar",
            "error"
        );

        cerrarPagoModal();
        abrirLoginModal();

        return null;
    }

    if (
        !carrito ||
        carrito.length === 0
    ) {

        mostrarNotificacion(
            "🛒 Tu carrito está vacío",
            "error"
        );

        return null;
    }

    try {

        const productosPedido =
            carrito.map(item => ({

                producto_id:
                    Number(item.id),

                cantidad:
                    Number(item.cantidad)

            }));

        console.log(
            "📦 Enviando pedido:",
            productosPedido
        );


        const respuesta =
            await fetch(
                `${API_URL}/pedidos/completo`,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        productos:
                            productosPedido

                    })
                }
            );


        const datos =
            await obtenerRespuestaJSON(
                respuesta
            );


        if (!respuesta.ok) {

            throw new Error(
                datos?.mensaje ||
                "No se pudo crear el pedido"
            );
        }


        console.log(
            "✅ Pedido creado:",
            datos
        );


        return (
            datos.pedido ||
            datos.data ||
            datos
        );

    } catch (error) {

        console.error(
            "❌ Error creando pedido:",
            error
        );

        mostrarNotificacion(
            error.message ||
            "❌ No se pudo crear el pedido",
            "error"
        );

        return null;
    }
}


async function procesarPago() {

    if (
        !carrito ||
        carrito.length === 0
    ) {

        mostrarNotificacion(
            "🛒 Tu carrito está vacío",
            "error"
        );

        return;
    }


    const token =
        localStorage.getItem("token");


    if (!token) {

        cerrarPagoModal();

        abrirLoginModal();

        return;
    }


    mostrarLoading();


    try {

        // ==========================================
        // 1. CREAR PEDIDO
        // ==========================================

        const pedido =
            await crearPedidoDesdeCarrito();


        if (!pedido) {

            ocultarLoading();

            return;
        }


        console.log(
            "📦 Pedido creado:",
            pedido
        );


        // ==========================================
        // 2. OBTENER ID DEL PEDIDO
        // ==========================================

        const pedidoId =
            pedido.id ||
            pedido.pedido_id;


        if (!pedidoId) {

            throw new Error(
                "El backend no devolvió el ID del pedido"
            );

        }


        console.log(
            "🧾 ID del pedido:",
            pedidoId
        );


        // ==========================================
        // 3. CREAR CHECKOUT DE STRIPE
        // ==========================================

        const respuesta =
            await fetch(
                `${API_URL}/pagos/crear-checkout`,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        pedido_id:
                            pedidoId

                    })

                }
            );


        const datos =
            await obtenerRespuestaJSON(
                respuesta
            );


        console.log(
            "💳 Respuesta Stripe:",
            datos
        );


        if (!respuesta.ok) {

            throw new Error(
                datos?.mensaje ||
                "No se pudo crear la sesión de pago"
            );

        }


        // ==========================================
        // 4. VERIFICAR URL DE STRIPE
        // ==========================================

        if (!datos.url) {

            throw new Error(
                "Stripe no devolvió una URL de pago"
            );

        }


        console.log(
            "✅ Checkout creado correctamente"
        );


        // ==========================================
        // 5. GUARDAR CARRITO TEMPORALMENTE
        // ==========================================

        localStorage.setItem(
            "checkout_pedido_id",
            String(pedidoId)
        );


        // ==========================================
        // 6. IR A STRIPE
        // ==========================================

        window.location.href =
            datos.url;


    } catch (error) {

        console.error(
            "❌ Error procesando pago:",
            error
        );


        ocultarLoading();


        mostrarNotificacion(
            error.message ||
            "❌ No se pudo procesar el pago",
            "error"
        );

    }

}

// ============================================================
// MIS PEDIDOS
// ============================================================

async function cargarMisPedidos() {

    const token =
        localStorage.getItem("token");

    if (!token) {

        mostrarNotificacion(
            "⚠️ Debes iniciar sesión para ver tus pedidos",
            "error"
        );

        abrirLoginModal();

        return;
    }

    const contenedor =
        document.getElementById(
            "pedidos-container"
        );

    if (!contenedor) return;

    contenedor.innerHTML = `

        <div class="pedidos-loading">

            <i class="fas fa-spinner fa-spin"></i>

            <p>
                Cargando tus pedidos...
            </p>

        </div>

    `;

    try {

        const respuesta =
            await fetch(
                `${API_URL}/pedidos`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const datos =
            await obtenerRespuestaJSON(
                respuesta
            );

        console.log(
            "📦 MIS PEDIDOS:",
            datos
        );

        if (!respuesta.ok) {

            throw new Error(
                datos?.mensaje ||
                "No se pudieron obtener los pedidos"
            );
        }

        const pedidos =
            Array.isArray(datos)
                ? datos
                : datos.pedidos || [];

        mostrarMisPedidos(
            pedidos
        );

    } catch (error) {

        console.error(
            "❌ Error cargando pedidos:",
            error
        );

        contenedor.innerHTML = `

            <div class="sin-pedidos">

                <i class="fas fa-exclamation-circle"></i>

                <h3>
                    No se pudieron cargar tus pedidos
                </h3>

                <p>
                    ${escaparHTML(error.message)}
                </p>

            </div>

        `;
    }
}


function mostrarMisPedidos(
    pedidos
) {

    const contenedor =
        document.getElementById(
            "pedidos-container"
        );

    if (!contenedor) return;

    if (!Array.isArray(pedidos)) {

        pedidos = [];
    }

    if (pedidos.length === 0) {

        contenedor.innerHTML = `

            <div class="sin-pedidos">

                <i class="fas fa-shopping-bag"></i>

                <h3>
                    Todavía no tienes pedidos
                </h3>

                <p>
                    Cuando realices una compra,
                    aparecerá aquí.
                </p>

                <button
                    class="btn-primary"
                    onclick="irColeccion()">
                    Ver colección
                </button>

            </div>

        `;

        return;
    }


    contenedor.innerHTML =
        pedidos.map(pedido => {

            const fecha =
                pedido.fecha_pedido
                    ? new Date(
                        pedido.fecha_pedido
                    ).toLocaleString(
                        "es-MX",
                        {
                            dateStyle:
                                "medium",
                            timeStyle:
                                "short"
                        }
                    )
                    : "Fecha no disponible";

            const total =
                Number(
                    pedido.total || 0
                );

            const estado =
                pedido.estado ||
                "pendiente";

            const estadoPago =
                pedido.estado_pago ||
                "pendiente";

            const detalles =
                Array.isArray(
                    pedido.detalles
                )
                    ? pedido.detalles
                    : [];


            return `

                <div class="pedido-card">

                    <div class="pedido-header">

                        <div>

                            <h3>
                                Pedido #${pedido.id}
                            </h3>

                            <p>
                                <i class="far fa-calendar"></i>
                                ${fecha}
                            </p>

                        </div>

                        <div class="pedido-total">

                            $${total.toFixed(2)}

                        </div>

                    </div>


                    <div class="pedido-estados">

                        <span class="pedido-estado estado-${escaparAtributo(estado)}">

                            <i class="fas fa-box"></i>

                            ${formatearEstado(estado)}

                        </span>


                        <span class="pedido-estado pago-${escaparAtributo(estadoPago)}">

                            <i class="fas fa-credit-card"></i>

                            ${formatearEstadoPago(
                estadoPago
            )}

                        </span>

                    </div>


                    <div class="pedido-productos">

                        <h4>
                            Productos
                        </h4>

                        ${detalles.length > 0

                    ?

                    detalles.map(detalle => {

                        const producto =
                            detalle.producto ||
                            {};

                        const cantidad =
                            Number(
                                detalle.cantidad ||
                                0
                            );

                        const precio =
                            Number(
                                detalle.precio_unitario ||
                                0
                            );

                        const subtotal =
                            Number(
                                detalle.subtotal ||
                                0
                            );

                        return `

                                    <div class="pedido-producto">

                                        <div class="pedido-producto-imagen">

                                            <img
                                                src="${escaparAtributo(
                            producto.imagen ||
                            ""
                        )
                            }"
                                                alt="${escaparAtributo(
                                producto.nombre ||
                                "Producto"
                            )}"
                                            >

                                        </div>

                                        <div class="pedido-producto-info">

                                            <strong>
                                                ${escaparHTML(
                                producto.nombre ||
                                "Producto"
                            )}
                                            </strong>

                                            <span>
                                                Cantidad:
                                                ${cantidad}
                                            </span>

                                            <span>
                                                Precio:
                                                $${precio.toFixed(2)}
                                            </span>

                                        </div>

                                        <div class="pedido-producto-subtotal">

                                            $${subtotal.toFixed(2)}

                                        </div>

                                    </div>

                                `;

                    }).join("")

                    :

                    `
                                <p>
                                    No hay detalles disponibles.
                                </p>
                            `
                }

                    </div>


                    <div class="pedido-footer">

                        <span>
                            Total del pedido
                        </span>

                        <strong>
                            $${total.toFixed(2)}
                        </strong>

                    </div>

                </div>

            `;

        }).join("");
}


async function irMisPedidos() {

    const token =
        localStorage.getItem("token");

    if (!token) {

        mostrarNotificacion(
            "⚠️ Debes iniciar sesión primero",
            "error"
        );

        abrirLoginModal();

        return;
    }

    ocultarTodasSecciones();

    const pedidosSec =
        document.getElementById(
            "mis-pedidos"
        );

    if (!pedidosSec) return;

    pedidosSec.style.display =
        "block";

    await cargarMisPedidos();

    pedidosSec.scrollIntoView({
        behavior: "smooth"
    });
}


// ============================================================
// ESTADOS
// ============================================================

function formatearEstado(estado) {

    const estados = {

        pendiente:
            "Pendiente",

        confirmado:
            "Confirmado",

        preparado:
            "Preparando",

        enviado:
            "Enviado",

        entregado:
            "Entregado",

        cancelado:
            "Cancelado"

    };

    return estados[estado] ||
        String(estado)
            .charAt(0)
            .toUpperCase() +
        String(estado)
            .slice(1);
}


function formatearEstadoPago(
    estado
) {

    const estados = {

        pendiente:
            "Pago pendiente",

        pagado:
            "Pagado",

        fallido:
            "Pago fallido",

        reembolsado:
            "Reembolsado"

    };

    return estados[estado] ||
        String(estado)
            .charAt(0)
            .toUpperCase() +
        String(estado)
            .slice(1);
}


// ============================================================
// CONFIRMACIÓN
// ============================================================

function mostrarConfirmacionPedido(
    pedido
) {

    const modal =
        document.getElementById(
            "confirmacion-modal"
        );

    const mensaje =
        document.getElementById(
            "mensaje-confirmacion"
        );

    const detalle =
        document.getElementById(
            "detalle-confirmacion"
        );

    if (!modal) return;


    let usuario = {};

    try {

        usuario =
            JSON.parse(
                localStorage.getItem(
                    "usuario"
                ) || "{}"
            );

    } catch {

        usuario = {};
    }


    const nombre =
        pedido.usuario?.nombre ||
        usuario.nombre ||
        "cliente";


    const numeroPedido =
        pedido.id ||
        pedido.pedido_id ||
        "N/A";


    const total =
        Number(
            pedido.total || 0
        );


    const estado =
        pedido.estado ||
        "pendiente";


    const estadoPago =
        pedido.estado_pago ||
        "pendiente";


    if (mensaje) {

        mensaje.innerHTML =
            `¡Gracias por tu pedido, ${escaparHTML(nombre)}!`;
    }


    if (detalle) {

        detalle.innerHTML = `

            <p>
                <strong>
                    🧾 Número de pedido:
                </strong>

                #${numeroPedido}
            </p>

            <p>
                <strong>
                    📦 Total:
                </strong>

                $${total.toFixed(2)}
            </p>

            <p>
                <strong>
                    📋 Estado:
                </strong>

                ${escaparHTML(
            formatearEstado(estado)
        )}
            </p>

            <p>
                <strong>
                    💳 Estado del pago:
                </strong>

                ${escaparHTML(
            formatearEstadoPago(
                estadoPago
            )
        )}
            </p>

        `;
    }


    modal.style.display =
        "flex";
}


function cerrarConfirmacion() {

    const modal =
        document.getElementById(
            "confirmacion-modal"
        );

    if (modal) {

        modal.style.display =
            "none";
    }
}


function cerrarPagoModal() {

    const modal =
        document.getElementById(
            "pago-modal"
        );

    if (modal) {

        modal.style.display =
            "none";
    }

    metodoSeleccionado =
        null;
}


// ============================================================
// LOADING
// ============================================================

function mostrarLoading() {

    ocultarLoading();

    const loading =
        document.createElement("div");

    loading.id =
        "loadingOverlay";

    loading.className =
        "loading-overlay";

    loading.innerHTML = `

        <div class="loading-spinner"></div>

        <p>
            Registrando pedido...
        </p>

        <p style="font-size:0.8rem;">
            No cierres esta ventana
        </p>

    `;

    document.body.appendChild(
        loading
    );
}


function ocultarLoading() {

    const loading =
        document.getElementById(
            "loadingOverlay"
        );

    if (loading) {

        loading.remove();
    }
}


// ============================================================
// MODALES
// ============================================================

window.addEventListener(
    "click",
    event => {

        const carritoModal =
            document.getElementById(
                "carrito-modal"
            );

        const pagoModal =
            document.getElementById(
                "pago-modal"
            );

        const confirmacionModal =
            document.getElementById(
                "confirmacion-modal"
            );

        const loginModal =
            document.getElementById(
                "login-modal"
            );


        if (
            event.target ===
            carritoModal
        ) {

            cerrarCarrito();
        }


        if (
            event.target ===
            pagoModal
        ) {

            cerrarPagoModal();
        }


        if (
            event.target ===
            confirmacionModal
        ) {

            cerrarConfirmacion();
        }


        if (
            event.target ===
            loginModal
        ) {

            cerrarLoginModal();
        }

    }
);


// ============================================================
// UTILIDADES
// ============================================================

async function obtenerRespuestaJSON(
    respuesta
) {

    const texto =
        await respuesta.text();

    if (!texto) {

        return {};
    }

    try {

        return JSON.parse(
            texto
        );

    } catch {

        return {
            mensaje: texto
        };
    }
}


function buscarProducto(id) {

    return productos.find(
        producto =>
            Number(producto.id) ===
            Number(id)
    );
}


function calcularDescuento(
    precioOriginal,
    precioOferta
) {

    if (
        precioOriginal <= 0 ||
        precioOferta <= 0 ||
        precioOferta >= precioOriginal
    ) {

        return 0;
    }

    return (
        (
            1 -
            precioOferta /
            precioOriginal
        ) *
        100
    );
}


function validarCorreo(email) {

    if (!email) return false;

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}


function normalizarTexto(texto) {

    return String(texto || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );
}


function escaparHTML(texto) {

    return String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escaparAtributo(texto) {

    return escaparHTML(texto)
        .replace(
            /`/g,
            "&#96;"
        );
}

window.mostrarNotificacion = function (mensaje, tipo = "success") {

    const anterior =
        document.getElementById("streetzone-notificacion");

    if (anterior) {
        anterior.remove();
    }

    const notificacion =
        document.createElement("div");

    notificacion.id =
        "streetzone-notificacion";

    notificacion.innerHTML =
        escaparHTML(mensaje);

    notificacion.style.position = "fixed";
    notificacion.style.top = "20px";
    notificacion.style.right = "20px";
    notificacion.style.zIndex = "99999";
    notificacion.style.padding = "15px 20px";
    notificacion.style.borderRadius = "10px";
    notificacion.style.color = "#fff";
    notificacion.style.fontWeight = "600";
    notificacion.style.maxWidth = "350px";
    notificacion.style.boxShadow =
        "0 5px 20px rgba(0,0,0,0.25)";

    if (tipo === "error") {
        notificacion.style.background = "#e74c3c";
    } else {
        notificacion.style.background = "#27ae60";
    }

    document.body.appendChild(notificacion);

    setTimeout(() => {
        if (notificacion) {
            notificacion.remove();
        }
    }, 3000);
};