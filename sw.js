// =========================================================
// AFSNIT 01 – SERVICE WORKER (STABIL RELEASE)
// =========================================================
//
// - Cache-navn er versionsstyret via version.json
// - Network-first for HTML (undgår “gammel side” på mobil)
// - SkipWaiting + clientsClaim (opdater tager over hurtigt)
// - Rydder gamle caches automatisk

let CACHE = 'silver-price-unknown';

const CORE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './api.js',
  './utils.js',
  './colors.js',
  './manifest.json',
  './version.json'
];

const OPTIONAL = [
  './favicon.ico',
  './icon-32.png',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];

async function getVersionSafe(){
  try{
    const res = await fetch('./version.json', { cache: 'no-store' });
    const j = await res.json();
    const v = String(j?.version || 'unknown').replace(/[^0-9A-Za-z.\-_]/g, '');
    return v || 'unknown';
  }catch(_){
    return 'unknown';
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const v = await getVersionSafe();
    CACHE = `silver-price-${v}`;

    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    await Promise.allSettled(OPTIONAL.map((u) => cache.add(u)));

    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => (k === CACHE ? null : caches.delete(k))));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // API skal altid på net (frisk data)
  if (url.hostname.includes('api.metals.live') || url.hostname.includes('api.frankfurter.dev')) {
    return;
  }

  // HTML: network-first
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith((async () => {
      try{
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone());
        return fresh;
      }catch(_){
        const cached = await caches.match(req);
        return cached || caches.match('./index.html');
      }
    })());
    return;
  }

  // Assets: cache-first
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;

    const fresh = await fetch(req);
    const cache = await caches.open(CACHE);
    cache.put(req, fresh.clone());
    return fresh;
  })());
});
