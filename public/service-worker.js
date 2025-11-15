/**
 * Service Worker for LevelGrit PWA
 * 
 * Enhanced offline support and caching strategies.
 * Optimized for India's intermittent connectivity.
 */

const CACHE_NAME = 'levelgrit-pwa-cache-v2';
const RUNTIME_CACHE = 'levelgrit-runtime-cache-v2';

// Core assets to cache on install
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/192.png',
  '/512.png',
  '/180.png',
  '/robots.txt'
];

// ✅ Install event - pre-cache core assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching core assets');
        return cache.addAll(urlsToCache).catch((err) => {
          console.warn('[Service Worker] Cache addAll failed:', err);
        });
      })
      .then(() => {
        console.log('[Service Worker] Installed successfully');
        return self.skipWaiting(); // Activate immediately
      })
  );
});

// ✅ Activate event - remove old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] Activated');
      return self.clients.claim(); // Take control of all pages
    })
  );
});

// ✅ Fetch event - Network first with cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Skip service worker and chrome-extension requests
  if (
    request.url.includes('/service-worker.js') ||
    request.url.includes('chrome-extension://') ||
    request.url.includes('firefox-extension://')
  ) {
    return;
  }

  // Skip Firebase/Firestore requests (they handle their own caching)
  if (request.url.includes('firebase') || request.url.includes('firestore')) {
    return;
  }

  event.respondWith(
    // Try network first
    fetch(request)
      .then((networkResponse) => {
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            // Only cache same-origin responses
            if (networkResponse.type === 'basic' || networkResponse.type === 'cors') {
              cache.put(request, responseToCache).catch((err) => {
                console.warn('[Service Worker] Cache put failed:', err);
              });
            }
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Network failed, try cache
        console.log('[Service Worker] Network failed, trying cache for:', request.url);
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // For navigation requests, return index.html for SPA routing
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          
          // Return a basic offline response for other requests
          return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain',
            }),
          });
        });
      })
  );
});

// ✅ Background sync (if supported)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-messages') {
    event.waitUntil(
      // Sync messages when connection is restored
      syncMessages()
    );
  }
});

// Helper function for background sync
async function syncMessages() {
  try {
    // This would sync pending messages when connection is restored
    console.log('[Service Worker] Syncing messages...');
    // Implementation would go here
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
  }
}

// ✅ Message event - handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});
