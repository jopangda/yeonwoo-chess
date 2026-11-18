// Keeps a copy of the game so it still opens without internet.
// Network first, so a new version shows up as soon as the tablet is online.
const CACHE = 'yeonwoo-chess-v1';
const FILES = ['./', 'manifest.webmanifest', 'img/duo.webp', 'img/grownup.webp', 'img/kid.webp', 'img/icon-192.png'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok && new URL(e.request.url).origin === location.origin) {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
