
const CACHE_NAME = "streetzone-v1";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.webmanifest"
];

// Instalar y guardar los archivos principales
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ARCHIVOS))
            .then(() => self.skipWaiting())
    );
});

// Activar y eliminar cachés anteriores
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((nombres) =>
            Promise.all(
                nombres
                    .filter((nombre) => nombre !== CACHE_NAME)
                    .map((nombre) => caches.delete(nombre))
            )
        ).then(() => self.clients.claim())
    );
});

// Consultar primero la red y utilizar caché si no hay conexión
self.addEventListener("fetch", (event) => {
    const request = event.request;
    if (request.method !== "GET") return;
    event.respondWith(
        fetch(request)
            .then((response) => {
                if (response && (response.ok || response.type === "opaque")) {
                    const copia = response.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, copia);
                    });
                }
                return response;
            })
            .catch(async () => {
                const respuestaGuardada = await caches.match(request);
                if (respuestaGuardada) {
                    return respuestaGuardada;
                }
                if (request.mode === "navigate") {
                    return caches.match("./index.html");
                }
                return Response.error();
            })
    );
});
