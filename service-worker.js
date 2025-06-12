const CACHE_NAME = 'hora-mundial-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './main.js',
  './manifest.json',
  './zonas-horarias.html',
  // Puedes añadir aquí los iconos si los tienes
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
