const cacheName = 'StoryBook-v1';
const staticAssets = [
    './',
    './app.js',
    './sticky.js',
    './css/styles.css',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js',
    './fallback.json',
    './index',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/53819/genericons-regular-webfont.woff',
    'https://use.fontawesome.com/releases/v5.0.8/css/all.css',
    'https://use.fontawesome.com/releases/v5.0.8/webfonts/fa-solid-900.woff2',
    'https://cdn-images-1.medium.com/max/1800/1*sg-uLNm73whmdOgKlrQdZA.jpeg',
    'https://cdn.ckeditor.com/4.9.0/standard/ckeditor.js',
    'https://cdn.iconscout.com/public/images/icon/premium/png-256/story-book-open-36e6148c22052e3d-256x256.png'
];

self.addEventListener('install', async function () {
    const cache = await caches.open(cacheName);
    cache.addAll(staticAssets);
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(request));
    } else {
        event.respondWith(networkFirst(request));
    }
});

async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch(request);
}

async function networkFirst(request) {
    const dynamicCache = await caches.open('StoryBook-v1');
    try {
        const networkResponse = await fetch(request);
        dynamicCache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (err) {
        const cachedResponse = await dynamicCache.match(request);
        return cachedResponse || await caches.match('./fallback.json');
    }
}