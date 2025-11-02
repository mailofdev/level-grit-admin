// Temporary script to unregister service worker if refresh loop occurs
// Add this to your index.html temporarily, or run in browser console

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister().then((success) => {
        if (success) {
          console.log('✅ Service Worker unregistered successfully');
          // Clear all caches
          caches.keys().then((cacheNames) => {
            cacheNames.forEach((cacheName) => {
              caches.delete(cacheName);
              console.log('🗑️ Deleted cache:', cacheName);
            });
          });
          // Reload page
          window.location.reload();
        }
      });
    }
  });
}

