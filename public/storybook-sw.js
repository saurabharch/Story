// require('./cache-manager');
// importScripts('sw-toolbox.js');
// importScripts('cache-polyfill.js');
importScripts('cache-manager.js');
const VERSION = '5.7.2';
const staticCache = `caches-v${VERSION}`;
const staticAssets = [
        '/',
        '/lib/sw-toolbox.js',
        '/app.js',
        '/sticky.js',
        '/css/style.css',
        '/menifest.json',
        '/img/fevicon.ico',
        '/img/footer.svg',
        '/img/WelcomeSplash.svg',
        '/?pageNo=1&size=6',
        '/offline.html',
        'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js',
        'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js',
        '/fallback.json',
        '/fingers.mp4',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/53819/genericons-regular-webfont.woff',
        'https://use.fontawesome.com/releases/v5.0.8/css/all.css',
        'https://use.fontawesome.com/releases/v5.0.8/webfonts/fa-solid-900.woff2',
        'https://cdn-images-1.medium.com/max/1800/1*sg-uLNm73whmdOgKlrQdZA.jpeg',
        'https://cdn.ckeditor.com/4.9.0/standard/ckeditor.js',
        'https://cdn.ckeditor.com/ckeditor5/11.0.1/classic/ckeditor.js'
        // 'https://www.google-analytics.com/analytics.js',
        // 'https://www.google-analytics.com/u/analytics_debug.js'
    ];
const dynamicCache = `StoryDynamicCache`;
let cachedAssets;

const imageTest = /^.*\.(jpg|jpeg|png|gif)$/;
const imageDb = 'image';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(staticCache)
        .then((cache) => cache.addAll(staticAssets))
        .then(() => self.skipWaiting())
        .catch(console.error)
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [staticCache, dynamicCache];
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.filter((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return true;
                    }
                    return false;
                }).map((cacheName) => {
                    return caches.delete(cacheName);
                })
            )
        )
        .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    if (url.pathname === '/') {
        caches.open(staticCache).then((cache) => {
            return cache.match('offline.html');
        })
    } else if (staticAssets.includes(url.pathname.substring(1))) {
        event.respondWith(caches.match(event.request));
    } else if (imageTest.test(url.pathname)) { // test for images
        handleImage(event);
    } else { // ¯\_(ツ)_/¯
        goToNetworkNoCache(event);
    }

     if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
         console.log('Handling fetch event for', event.request.url);
         event.respondWith(
             fetch(event.request).catch(error => {
                 // The catch is only triggered if fetch() throws an exception, which will most likely
                 // happen due to the server being unreachable.
                 // If fetch() returns a valid HTTP response with an response code in the 4xx or 5xx
                 // range, the catch() will NOT be called. If you need custom handling for 4xx or 5xx
                 // errors, see https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/fallback-response
                 console.log('Fetch failed; returning offline page instead.', error);
                 return caches.match('offline.html');
             })
         );
     }
});

function goToNetworkNoCache(event) {
    event.respondWith(fetch(event.request));
}

function handleImage(event) {
    const url = new URL(event.request.url);
    event.respondWith((async function () {
        try {
            const cacheResponse = await caches.match(event.request);
            let networkResponse;
            const db = await getDb(imageDb);

            if (cacheResponse) {
                updateUsedTimestampForUrl(db, url.href, Date.now());
            } else {
                networkResponse = await fetch(event.request);
                const cache = await caches.open(dynamicCache);
                await cache.put(event.request, networkResponse.clone());
                await setTimestampsForUrl(db, url.href, Date.now());
            }
            return cacheResponse || networkResponse;
        } catch (err) {
            console.error(err);
            return new Response(null, {
                status: 404
            });
        }
    })());

    event.waitUntil((async function () {
        let extraUrls;
        let cache;
        try {
            const db = await getDb(imageDb);
            cache = await caches.open(dynamicCache);
            extraUrls = await expireEntries(db, 10, 300, Date.now());
            if (extraUrls.length == 0) return;
        } catch (err) {
            console.log(err);
        }
        return Promise.all(extraUrls.map((url) => cache.delete(url)));
    })());
}