// =========================================================
// AFSNIT 01 – SIMPLE CACHE (PWA) – robust offline shell
// =========================================================
const CACHE = 'silver-neon-v2';

// Kun “skal-filer” her (må ikke fejle)
const CORE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './api.js',
  './utils.js',
  './colors.js',
  './manifest.json'
];

// “nice-to-have” (må gerne fejle uden at install dør)
const OPTIONAL = [
  './favicon.ico',
  './icon-32.png',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);

    // CORE skal lykkes
    await cache.addAll(CORE);

    // OPTIONAL må ikke vælte install
    await Promise.allSettled(OPTIONAL.map((u) => cache.add(u)));
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE ? null : caches.delete(k))))
    )
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // API-calls skal i netværk (altid frisk)
  if (req.url.includes('api.gold-api.com') || req.url.includes('api.frankfurter.dev')){
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
