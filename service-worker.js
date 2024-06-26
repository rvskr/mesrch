const CACHE_NAME = 'links-generator-cache-v1.4'; // Обновляем версию кэша
const urlsToCache = [
  '/mesrch/',
  '/mesrch/index.html',
  '/mesrch/script.js',
  '/mesrch/styles.css',
  '/mesrch/manifest.json',
];

self.addEventListener('install', function(event) {
  console.log('Service worker installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: "no-store" })))
          .then(() => console.log('Assets cached successfully'))
          .catch(error => console.error('Failed to cache assets:', error));
      })
  );
});

self.addEventListener('activate', function(event) {
  console.log('Service worker activating...');

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
    .then(function() {
      console.log('Cache cleared for old versions');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('Fetch event for ', event.request.url);

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          console.log('Found ', event.request.url, ' in cache');
          return response;
        }
        
        console.log('Network request for ', event.request.url);
        return fetch(event.request)
          .then(function(response) {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              console.log('Response not valid, returning: ', response);
              return response;
            }

            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(function(error) {
            console.error('Error fetching ', event.request.url, ': ', error);
            return caches.match(event.request);
          });
      })
  );
});

// Добавляем обработчик события установки, чтобы выводить текущую версию CACHE_NAME при загрузке страницы
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

// Добавляем обработчик события активации, чтобы выводить новую версию CACHE_NAME при обновлении
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(existingCacheName) {
          if (existingCacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', existingCacheName);
            return caches.delete(existingCacheName);
          }
        })
      );
    })
    .then(function() {
      console.log('New version is now active');
    })
  );
});
  