var urlsToCache_ = [
    '/',
    'storybook-sw.js',
    '/lib/sw-toolbox.js',
    'app.js',
    '/views/layout/main.handelbars',
    'sticky.js',
    '/css/style.css',
    'menifest.json',
    '/img/fevicon.ico',
    '/img/footer.svg',
    '/img/WelcomeSplash.svg',
    '/?pageNo=1&size=6',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js',
    'fallback.json',
    'fingers.mp4',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/53819/genericons-regular-webfont.woff',
    'https://use.fontawesome.com/releases/v5.0.8/css/all.css',
    'https://use.fontawesome.com/releases/v5.0.8/webfonts/fa-solid-900.woff2',
    'https://cdn-images-1.medium.com/max/1800/1*sg-uLNm73whmdOgKlrQdZA.jpeg',
    'https://cdn.ckeditor.com/4.9.0/standard/ckeditor.js',
    'https://cdn.ckeditor.com/ckeditor5/11.0.1/classic/ckeditor.js',
];

var version = 'v1';

self.addEventListener('install', function (event) {
    console.log('[ServiceWorker] Installed version', version);
    event.waitUntil(
        caches.open(version)
        .then(function (cache) {
            console.log("opened cache");
            return cache.addAll(urlsToCache_);
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});


self.addEventListener('activate', function (event) {

    var cacheWhitelist = [version];

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (version && cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deleted old cache');
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});