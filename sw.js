// Service Worker para Charity App
const CACHE_NAME = 'charity-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/home.html',
  '/perfil.html',
  '/mensajes.html',
  '/chat.html',
  '/configuracion.html',
  '/login.html',
  '/registro.html',
  '/iniciar-sesion.html',
  '/recuperar.html',
  '/nueva-publicacion.html',
  '/style.css',
  '/script.js',
  '/images/logo.png',
  '/images/user.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devolver cache si existe
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
}); 