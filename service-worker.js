const CACHE_NAME = 'links-generator-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'script.js',
  'styles.css',
  'manifest.json',
  'icon.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Если ресурса нет в кэше, загружаем его из сети
        return fetch(event.request)
          .then(function(response) {
            // Проверяем, является ли ответ валидным
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Клонируем ответ, так как он может быть использован только один раз
            var responseToCache = response.clone();

            // Кэшируем загруженный ресурс
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      }
    )
  );
});