const CACHE_NAME = 'levelgrit-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/192.png',
  '/512.png',
  '/180.png'
];

// ✅ Install event - pre-cache core assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => console.error('Cache addAll error:', err))
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// ✅ Activate event - remove old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Don't call clients.claim() to prevent refresh loops
  // Service worker will take control on next page navigation
});

// ✅ Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Only handle same-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip service worker and chrome-extension requests
  if (
    event.request.url.includes('/service-worker.js') ||
    event.request.url.includes('chrome-extension://')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If network request succeeds, clone and cache it
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Only cache same-origin responses
            if (networkResponse.type === 'basic') {
              cache.put(event.request, responseToCache).catch(() => {
                // Ignore cache errors
              });
            }
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((cachedResponse) => {
          // For navigation requests, always return index.html if cache misses
          if (event.request.mode === 'navigate' && !cachedResponse) {
            return caches.match('/index.html');
          }
          return cachedResponse;
        });
      })
  );
});
