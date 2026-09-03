// ============================================================
// SIGE - SERVICE WORKER
// ============================================================

const CACHE_NAME = "sige-v2";

const FILES_TO_CACHE = [
    "./",
    "./index.html",

    // CSS
    "./css/style.css",

    // JavaScript SIGE
    "./js/firebase-config.js",
    "./js/parametres.js",
    "./js/auth.js",
    "./js/categories.js",
    "./js/enseignants.js",
    "./js/siad.js",
    "./js/export.js",
    "./js/app.js",

    // PWA
    "./manifest.json"
];


// ============================================================
// INSTALLATION
// ============================================================

self.addEventListener("install", function (event) {

    console.log("SIGE - Installation Service Worker");

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(function (cache) {

                return cache.addAll(FILES_TO_CACHE);

            })

            .then(function () {

                console.log("SIGE - Fichiers mis en cache");

                return self.skipWaiting();

            })

            .catch(function (error) {

                console.error(
                    "SIGE - Erreur lors de la mise en cache :",
                    error
                );

            })

    );

});


// ============================================================
// ACTIVATION
// ============================================================

self.addEventListener("activate", function (event) {

    console.log("SIGE - Service Worker activé");

    event.waitUntil(

        caches.keys().then(function (cacheNames) {

            return Promise.all(

                cacheNames

                    .filter(function (name) {

                        return name !== CACHE_NAME;

                    })

                    .map(function (name) {

                        console.log(
                            "Suppression ancien cache :",
                            name
                        );

                        return caches.delete(name);

                    })

            );

        })

        .then(function () {

            return self.clients.claim();

        })

    );

});


// ============================================================
// FETCH
// ============================================================

self.addEventListener("fetch", function (event) {

    event.respondWith(

        caches.match(event.request)

            .then(function (cachedResponse) {

                // --------------------------------------------
                // Fichier déjà dans le cache
                // --------------------------------------------

                if (cachedResponse) {

                    return cachedResponse;

                }

                // --------------------------------------------
                // Sinon essayer Internet
                // --------------------------------------------

                return fetch(event.request)

                    .catch(function () {

                        console.warn(
                            "SIGE - Ressource indisponible hors ligne :",
                            event.request.url
                        );

                        return new Response(
                            "Ressource indisponible hors connexion",
                            {
                                status: 503,
                                headers: {
                                    "Content-Type": "text/plain"
                                }
                            }
                        );

                    });

            })

    );

});
