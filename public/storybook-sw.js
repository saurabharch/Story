
importScripts('cache-manager.js');

const VERSION = '1';
const staticCache = `caches-v${VERSION}`;
const staticAssets = [
        './',
        './app.js',
        './sticky.js',
        './css/style.css',
        'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js',
        'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js',
        './fallback.json',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/53819/genericons-regular-webfont.woff',
        'https://use.fontawesome.com/releases/v5.0.8/css/all.css',
        'https://use.fontawesome.com/releases/v5.0.8/webfonts/fa-solid-900.woff2',
        'https://cdn-images-1.medium.com/max/1800/1*sg-uLNm73whmdOgKlrQdZA.jpeg',
        'https://cdn.ckeditor.com/4.9.0/standard/ckeditor.js',
        'https://cdn.iconscout.com/public/images/icon/premium/png-256/story-book-open-36e6148c22052e3d-256x256.png'
    ];
const dynamicCache = `dynamicCache`;
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
            return cache.match('index.html');
        })
    } else if (staticAssets.includes(url.pathname.substring(1))) {
        event.respondWith(caches.match(event.request));
    } else if (imageTest.test(url.pathname)) { // test for images
        handleImage(event);
    } else { // ¯\_(ツ)_/¯
        goToNetworkNoCache(event);
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