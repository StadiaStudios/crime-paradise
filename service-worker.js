const CACHE_NAME = 'drug-lord-kingdoms-cache-v1';
const urlsToCache = [
    './', // Caches the root (index.html)
    './index.html',
    './game.js',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css',
    './icon.ico',
    // Audio assets
    './audio/bgmusic.mp3',
    './audio/docks.mp3',
    './audio/factory.mp3',
    './audio/click.mp3',
    './audio/hover.mp3',
    // Image assets (from iconUrls in game.js)
    './assets/cash.png',
    './assets/location.png',
    './assets/locations/marketval.png',
    './assets/backpack.png',
    './assets/messages.png',
    './assets/travel.png',
    './assets/locations/TheLab.png',
    'https://placehold.co/20x20/000000/FFFFFF?text=G', // Placeholder for grow_seedling
    './assets/bag-of-weed.png',
    './assets/bag-of-coke.png',
    './assets/ecstasy-pill.png',
    './assets/heroine-bag.png',
    './assets/dmt.png',
    './assets/materials/water.png',
    './assets/materials/doxycycline.png',
    './assets/icons/garage.png',
    './assets/dealership.png',
    './cars/impala.png',
    './cars/mustang-red.png',
    './cars/mustang.png',
    './cars/van.png',
    './cars/infiniti-red.png',
    './cars/infiniti.png',
    './cars/special-car.png',
    // PWA icons (placeholders)
    'https://placehold.co/192x192/1a202c/e2e8f0?text=DLK',
    'https://placehold.co/512x512/1a202c/e2e8f0?text=DLK'
];

// Install event: caches all the assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error('Failed to cache during install:', err);
            })
    );
});

// Fetch event: serves cached content first, then falls back to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache hit - fetch from network
                return fetch(event.request)
                    .then(networkResponse => {
                        // Check if we received a valid response
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and can only be consumed once. We must clone it so that
                        // we can consume one in the cache and one in the browser.
                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    })
                    .catch(error => {
                        console.error('Fetch failed:', error);
                        // You could return an offline page here if desired
                        // For example: return caches.match('/offline.html');
                    });
            })
    );
});

// Activate event: cleans up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Delete old caches
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
