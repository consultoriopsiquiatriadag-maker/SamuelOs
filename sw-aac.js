/* Aplicación de Samuel - Service Worker */
const CACHE_VERSION = 'samuel-app-v53-fase50';
const CACHE_NAME = CACHE_VERSION;

const ASSETS = [
  './',
  './index.html',
  './child.html',
  './adult.html',
  './juegos.html',
  './youtube.html',
  './progreso.html',
  './app.js',
  './flags-data.js',
  './manifest.webmanifest',
  './samuel-avatar.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './audio/animales/burro.mp3',
  './audio/animales/caballo.mp3',
  './audio/animales/cabra.mp3',
  './audio/animales/cerdo.mp3',
  './audio/animales/elefante.mp3',
  './audio/animales/gallina.mp3',
  './audio/animales/gallo.mp3',
  './audio/animales/gato.mp3',
  './audio/animales/grillo.mp3',
  './audio/animales/leon.mp3',
  './audio/animales/lobo.mp3',
  './audio/animales/mono.mp3',
  './audio/animales/oveja.mp3',
  './audio/animales/pajaro.mp3',
  './audio/animales/pato.mp3',
  './audio/animales/perro.mp3',
  './audio/animales/rana.mp3',
  './audio/animales/serpiente.mp3',
  './audio/animales/tigre.mp3',
  './audio/animales/vaca.mp3',
  './audio/vehiculos/ambulancia.mp3',
  './audio/vehiculos/auto.mp3',
  './audio/vehiculos/bomberos.mp3',
  './audio/vehiculos/camion.mp3',
  './audio/vehiculos/carrera.mp3',
  './audio/vehiculos/colectivo.mp3',
  './audio/vehiculos/moto.mp3',
  './audio/vehiculos/policia.mp3',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);
    // Activar lo antes posible
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => {
      if (k !== CACHE_NAME) return caches.delete(k);
    }));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const fresh = await fetch(req);
      // Cachear navegaciones y estáticos
      if (fresh && fresh.status === 200 && (req.destination === 'document' || req.destination === 'script' || req.destination === 'image' || req.destination === 'manifest' || req.destination === 'audio')) {
        cache.put(req, fresh.clone());
      }
      return fresh;
    } catch (e) {
      // Offline fallback: intentar index
      if (req.destination === 'document') {
        return (await cache.match('./child.html')) || (await cache.match('./index.html'));
      }
      throw e;
    }
  })());
});
