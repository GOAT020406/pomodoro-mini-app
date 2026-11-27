// Bump CACHE_NAME whenever the files below change, so users get the update.
const CACHE_NAME = 'pomodoro-cache-v3';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './alarm.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  // Audio is requested in byte ranges (partial responses, status 206), which
  // the Cache API cannot store. Use the full file we cached at install time.
  if (request.headers.has('range')) {
    event.respondWith(
      caches.match(request.url).then((cached) => cached || fetch(request))
    );
    return;
  }

  // Network first (so updates show up), falling back to the cache when offline.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 200) {   // only cache complete responses
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
