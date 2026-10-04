const CACHE_NAME = "habit-tracker-v1";

const FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json"
];

self.addEventListener("install", function(event) {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(FILES);
            })
    );

});


self.addEventListener("fetch", function(event) {

    event.respondWith(

        caches.match(event.request)
            .then(function(response) {

                return response ||
                    fetch(event.request);

            })

    );

});