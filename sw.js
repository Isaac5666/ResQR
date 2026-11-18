// Network-first service worker: always tries the live site, falls back to cache when offline.
const V = 'resqr-v1';
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'])).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => { const copy = res.clone(); caches.open(V).then(c => c.put(r, copy)); return res; }).catch(() => caches.match(r).then(m => m || caches.match('./index.html'))));
});
