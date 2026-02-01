// =========================================================
// AFSNIT 01 – SIMPLE CACHE (PWA) – offline shell
// =========================================================
const CACHE = 'silver-neon-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './api.js',
  './utils.js',
  './colors.js',
  './manifest.json',
  './favicon.ico',
  './icon-192.png',
  './icon-512.png',
  './icon-180.png',
  './icon-32.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
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

  // API-calls skal altid i netværk (så vi får frisk pris)
  if (req.url.includes('api.metals.live') || req.url.includes('api.frankfurter.dev')){
    return; // browser fetcher normalt
  }

  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
