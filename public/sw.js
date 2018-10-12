importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');
const precacheCacheName = workbox.core.cacheNames.precache;
const runtimeCacheName = workbox.core.cacheNames.runtime;

const myPlugin = {
    cacheWillUpdate: async ({
            request,
            response
        }) => {
            // Return `response`, a different Response object or null
            return response;
        },
        cacheDidUpdate: async ({
                cacheName,
                request,
                oldResponse,
                newResponse
            }) => {
                // No return expected
                // Note: `newResponse.bodyUsed` is `true` when this is called,
                // meaning the body has already been read. If you need access to
                // the body of the fresh response, use a technique like:
                // const freshResponse = await caches.match(request, {cacheName});
            },
            cachedResponseWillBeUsed: async ({
                    cacheName,
                    request,
                    matchOptions,
                    cachedResponse
                }) => {
                    // Return `cachedResponse`, a different Response object or null
                    return cachedResponse;
                },
                requestWillFetch: async ({
                        request
                    }) => {
                        // Return `request` or a different Request
                        return request;
                    },
                    fetchDidFail: async ({
                        originalRequest,
                        request,
                        error
                    }) => {
                        // No return expected.
                        // NOTE: `originalRequest` is the browser's request, `request` is the
                        // request after being passed through plugins with
                        // `requestWillFetch` callbacks, and `error` is the exception that caused
                        // the underlying `fetch()` to fail.
                    }
};
workbox.core.setCacheNameDetails({
    prefix: 'StoryBook',
    suffix: 'v1',
    precache: 'Story-precache-name',
    runtime: 'Story-runtime-name',
    cacheId: 'StoryBook',
    clientsClaim: 'true',
    directoryIndex: '/'

});
workbox.routing.registerRoute(
    'https://new-storybook.herokuapp.com/*',
    workbox.strategies.networkFirst({
        networkTimeoutSeconds: 3,
        cacheName: 'stories',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 100,
                maxAgeSeconds: 5 * 60 * 60, // 5 minutes
            }),
        ],
    }),
);

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    }),
);
workbox.routing.registerRoute(
    new RegExp('https://new-storybook.herokuapp.com'),
    workbox.strategies.cacheFirst()
);
workbox.routing.registerRoute(
    /\.(?:js|css|json)$/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'static-resources',
    }),
);

// Call addToCache whenever you'd like. E.g. to add to cache after a page load:

workbox.routing.registerRoute(
    /.*(?:googleapis)\.com.*$/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'googleapis',
    }),
);

workbox.routing.registerRoute(
    /.*(?:gstatic)\.com.*$/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'gstatic',
    }),
);

workbox.routing.registerRoute(
    new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
    workbox.strategies.cacheFirst({
        cacheName: 'google-fonts',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 30,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            }),
        ],
    }),
);

workbox.routing.registerRoute(
    new RegExp('https://cdn.ckeditor.com/(.*)'),
    workbox.strategies.cacheFirst({
        cacheName: 'ckeditor',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            }),
        ],
    }),
);

workbox.routing.registerRoute(
    new RegExp('https://cdnjs.cloudflare.com/(.*)'),
    workbox.strategies.cacheFirst({
        cacheName: 'supportive-library',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            }),
        ],
    }),
);
workbox.routing.registerRoute(
    new RegExp('https://use.fontawesome.com/(.*)'),
    workbox.strategies.cacheFirst({
        cacheName: 'supportive-library',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 150,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            }),
        ],
    }),
);
workbox.routing.registerRoute(
    new RegExp('https://s3-us-west-2.amazonaws.com/(.*)'),
    workbox.strategies.cacheFirst({
        cacheName: 'supportive-fonts',

        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 150,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            }),
        ],
    }),
);
workbox.routing.registerRoute(
    new RegExp('https://use.typekit.net/(.*)'),
    workbox.strategies.cacheFirst({
        cacheName: 'browser-supportive',

        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 150,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            }),
        ],
    }),
);

let isSubscribed = false;
let swRegistration = null;
let applicationKey = "BCWxoXJo6AfZp5T4GOAqw9XLEgU7zXbFz2zySuUjy4sAmt7ADQ-_XDCG6qQyRGAs0x7G9W9gYNLUAaMF9BMOgdo";

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
let notificationUrl = '';

self.addEventListener('push', function (event) {
    console.log('Push received: ', event);
    let _data = event.data ? JSON.parse(event.data.text()) : {};
    notificationUrl = _data.url;
    event.waitUntil(
        self.registration.showNotification(_data.title, {
            body: _data.message,
            tag: _data.tag,
            image: _data.image,
            icon: _data.icon,
            badge: _data.badge
        })
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({
            type: "window"
        })
        .then(function (clientList) {
            if (clients.openWindow) {
                return clients.openWindow(notificationUrl);
            }
        })
    );
});

function saveSubscription(subscription) {
   let xmlHttp = new XMLHttpRequest();
   xmlHttp.open("POST", "/subscribe");
   xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
   xmlHttp.onreadystatechange = function () {
       if (xmlHttp.readyState != 4) return;
       if (xmlHttp.status != 200 && xmlHttp.status != 304) {
           console.log('HTTP error ' + xmlHttp.status, null);
       } else {
           console.log("User subscribed to server");
       }
   };

   xmlHttp.send(JSON.stringify(subscription));

}

workbox.precaching.precacheAndRoute([
  {
    "url": "404.html",
    "revision": "d717f7dab7bbbd87cdc9eb9967d10e4a"
  },
  {
    "url": "app.js",
    "revision": "e5589b2f2847d4571d78409a42b25ac6"
  },
  {
    "url": "browserconfig.xml",
    "revision": "075b86483bb8c226aa8539de2953f5ab"
  },
  {
    "url": "cache-files.json",
    "revision": "0ae60ac09d6cf30faefdaefc01a1780a"
  },
  {
    "url": "css/all.css",
    "revision": "f694534864422849744c50184cf9117f"
  },
  {
    "url": "css/fonts/fa-solid-900.woff2",
    "revision": "0ab54153eeeca0ce03978cc463b257f7"
  },
  {
    "url": "css/fonts/genericons-regular-webfont.1.woff",
    "revision": "388f97352ced79c3a2280c8de4552d15"
  },
  {
    "url": "css/fonts/genericons-regular-webfont.woff",
    "revision": "388f97352ced79c3a2280c8de4552d15"
  },
  {
    "url": "css/fonts/MaterialIcons.woff2",
    "revision": "658dde714e624426b1f0f9976f031513"
  },
  {
    "url": "css/fonts/Roboto-Regular.woff",
    "revision": "d60c6fd1200bb6fe2050f4296ace8d43"
  },
  {
    "url": "css/fonts/Roboto-Regular.woff2",
    "revision": "bde1ca6a5d7cefc8108c75fdaad29ed6"
  },
  {
    "url": "css/fonts/roboto/Roboto-Light.woff",
    "revision": "3b813c2ae0d04909a33a18d792912ee7"
  },
  {
    "url": "css/fonts/roboto/Roboto-Light.woff2",
    "revision": "69f8a0617ac472f78e45841323a3df9e"
  },
  {
    "url": "css/fonts/roboto/Roboto-Regular.woff",
    "revision": "d60c6fd1200bb6fe2050f4296ace8d43"
  },
  {
    "url": "css/fonts/roboto/Roboto-Regular.woff2",
    "revision": "bde1ca6a5d7cefc8108c75fdaad29ed6"
  },
  {
    "url": "css/materialize.min.css",
    "revision": "cdb87749442a34b463ecd91eafbe9c86"
  },
  {
    "url": "css/style.css",
    "revision": "1348922ccf7fea66f784e7bfa8d7e883"
  },
  {
    "url": "fallback.json",
    "revision": "466aaf57a2499a5612eb7e4a9fbcd4d0"
  },
  {
    "url": "fingers.mp4",
    "revision": "f328ee4e80312aa3662e6774d5641c5a"
  },
  {
    "url": "fonts/genericons-regular-webfont.woff",
    "revision": "388f97352ced79c3a2280c8de4552d15"
  },
  {
    "url": "fonts/MaterialIcons-Regular.woff2",
    "revision": "570eb83859dc23dd0eec423a49e147fe"
  },
  {
    "url": "fonts/MaterualIcons/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
    "revision": "658dde714e624426b1f0f9976f031513"
  },
  {
    "url": "fonts/Nunito/XRXV3I6Li01BKofINeaB.woff2",
    "revision": "fe67e10445323683dab69663f6a4718a"
  },
  {
    "url": "fonts/Nunito/XRXV3I6Li01BKofIO-aBXso.woff2",
    "revision": "2b9944df551d16a9b94f2d4b50ed9fc5"
  },
  {
    "url": "fonts/Nunito/XRXV3I6Li01BKofIOuaBXso.woff2",
    "revision": "6f841f92fcd4a1c1020120fe92ff983f"
  },
  {
    "url": "fonts/roboto/Roboto-Light.woff",
    "revision": "3b813c2ae0d04909a33a18d792912ee7"
  },
  {
    "url": "fonts/roboto/Roboto-Light.woff2",
    "revision": "69f8a0617ac472f78e45841323a3df9e"
  },
  {
    "url": "fonts/roboto/Roboto-Regular.woff",
    "revision": "d60c6fd1200bb6fe2050f4296ace8d43"
  },
  {
    "url": "fonts/roboto/Roboto-Regular.woff2",
    "revision": "bde1ca6a5d7cefc8108c75fdaad29ed6"
  },
  {
    "url": "images/donate.png",
    "revision": "3caa1758c3d418390583cb96883eedb1"
  },
  {
    "url": "img/1_sg-uLNm73whmdOgKlrQdZA.jpeg",
    "revision": "663471dd68560569195015e7bfcdc0e2"
  },
  {
    "url": "img/android-chrome-192x192.png",
    "revision": "653ef1923bb69fc2be7bdcdce25ebaae"
  },
  {
    "url": "img/android-chrome-512x512.png",
    "revision": "b4b8da1de9247087bf52b33844fa9953"
  },
  {
    "url": "img/Anonymous.png",
    "revision": "eec0336f3647ecbd8b9e1d1a0bcf6366"
  },
  {
    "url": "img/bluebg.svg",
    "revision": "9a0640a3925ef4f18617bab1f854e0b8"
  },
  {
    "url": "img/book-192X192.png",
    "revision": "9f9beebf288348c5909f0750fb5e36a9"
  },
  {
    "url": "img/book-256X256.png",
    "revision": "b0b1cb4f6f95d3c5e33853f903fafc44"
  },
  {
    "url": "img/book-512X512.png",
    "revision": "1017cb589cdbc3f8b0f3c1163b30619f"
  },
  {
    "url": "img/book-96X96.png",
    "revision": "74b2e113ff1a5ac6cb3b043dfc593627"
  },
  {
    "url": "img/book.png",
    "revision": "1017cb589cdbc3f8b0f3c1163b30619f"
  },
  {
    "url": "img/close.png",
    "revision": "5510725f75d3aa931b54ea985d851c64"
  },
  {
    "url": "img/donate.png",
    "revision": "4e1de6d2f093b23638b6167545d29148"
  },
  {
    "url": "img/emoji/emoji1.png",
    "revision": "69425eb206c94dc0bbbfe2bb4edbad64"
  },
  {
    "url": "img/emoji/emoji2.png",
    "revision": "289db634d48df204325724e94491113a"
  },
  {
    "url": "img/emoji/emoji3.png",
    "revision": "a384ec7e5e92d6964343e3de876e97f0"
  },
  {
    "url": "img/emoji/emoji4.png",
    "revision": "3e2eb419fe1929f7638dda1e27cfe852"
  },
  {
    "url": "img/emoji/emoji5.png",
    "revision": "90c848f4f4ac0636f5e4f1031eaff7f7"
  },
  {
    "url": "img/emoji/violin.png",
    "revision": "b5e0060305fe952f74b7c429ef79ce66"
  },
  {
    "url": "img/fevicon.ico",
    "revision": "4f62a12b239c76e146dbf616ebb5e4bd"
  },
  {
    "url": "img/footer.svg",
    "revision": "db68205d6c6a3f7d4b09ceca422ced45"
  },
  {
    "url": "img/if_bookshelf_1055107.svg",
    "revision": "3c67937710dabcdd51df4779b00180b3"
  },
  {
    "url": "img/InternetDisconnect.png",
    "revision": "fd3176e235c9c6bf49731d9692330b5d"
  },
  {
    "url": "img/mstile-150x150.png",
    "revision": "277cb5c7d1d24764eace974752164a92"
  },
  {
    "url": "img/Octicons-book.svg.png",
    "revision": "6ea6ee04f394d50a3d1818bbfde5f78d"
  },
  {
    "url": "img/screen-rotate.png",
    "revision": "e85e99c82660a0f6e47cd7990efe2eba"
  },
  {
    "url": "img/splash.svg",
    "revision": "9a0640a3925ef4f18617bab1f854e0b8"
  },
  {
    "url": "img/story-book-9-651480.png",
    "revision": "30b7b8c386bc58eade8441fc358970e7"
  },
  {
    "url": "img/WelcomeSplash.svg",
    "revision": "8a6fb04a7de46f908adbb18c2b4b776b"
  },
  {
    "url": "init.js",
    "revision": "adc1df01f640d1006a4ea7f1063734ee"
  },
  {
    "url": "js/classic/ckeditor.js",
    "revision": "1e3c17e605c48bb13f48546703d840f4"
  },
  {
    "url": "js/init.js",
    "revision": "b2ba551de7c721928b1bc89051f21b1f"
  },
  {
    "url": "js/materialize.min.js",
    "revision": "112042a4f34905104e0af0cf66b88fb8"
  },
  {
    "url": "js/rater.js",
    "revision": "a999e992b8d9471568a6a1eb25b96145"
  },
  {
    "url": "js/scroll.js",
    "revision": "062ceff7f39c7e67bf1e116ebf47f4ed"
  },
  {
    "url": "js/standard/ckeditor.js",
    "revision": "4252d3e1d8a440fabc1a9a9679eef2e6"
  },
  {
    "url": "js/sticky.js",
    "revision": "5d35ba2b8aea8db9a27b4b614a219a50"
  },
  {
    "url": "js/stripe-main.js",
    "revision": "800289c99ccb013e04d8a8f2add82622"
  },
  {
    "url": "js/stripe.js",
    "revision": "386b3ea51b86760dfb5b7c9c92de2c56"
  },
  {
    "url": "lib/helpers.js",
    "revision": "0cd89bf34cad65cf397c4df3ff30b952"
  },
  {
    "url": "lib/idb-cache-expiration.js",
    "revision": "04f87dddabf177b5777858d3bf93d519"
  },
  {
    "url": "lib/listeners.js",
    "revision": "96239c6ebbb63eb48afe209b47045995"
  },
  {
    "url": "lib/options.js",
    "revision": "1596f89daa97e175201ede34194e6e2d"
  },
  {
    "url": "lib/route.js",
    "revision": "28eb00fa3f0629f29a57cbadadb5b62e"
  },
  {
    "url": "lib/router.js",
    "revision": "bb5d878875b767dee0247e36dcabbd55"
  },
  {
    "url": "lib/strategies/cacheFirst.js",
    "revision": "98df7d0a73a09bbee8d1b94cb74a99d9"
  },
  {
    "url": "lib/strategies/cacheOnly.js",
    "revision": "ac0098e43f27253af0d19ffb0a1e8bf7"
  },
  {
    "url": "lib/strategies/fastest.js",
    "revision": "ee5f548d4b0a6740d0f58841147f289b"
  },
  {
    "url": "lib/strategies/index.js",
    "revision": "ae726b3e8a480ff20080d9525a87d4af"
  },
  {
    "url": "lib/strategies/networkFirst.js",
    "revision": "1eeb34efa5138e0ac610d6fbe32a10aa"
  },
  {
    "url": "lib/strategies/networkOnly.js",
    "revision": "d3981eb3d4f75bc428b567a39646d54d"
  },
  {
    "url": "lib/sw-toolbox.js",
    "revision": "d7ce34e1f90a0506bb11acd591b29b2d"
  },
  {
    "url": "manifest.json",
    "revision": "e44a95910055d17e52d9cdf07dbbed2c"
  },
  {
    "url": "new-install.js",
    "revision": "6091338ad5c0ea9b61306e044a9d4acb"
  },
  {
    "url": "offline.html",
    "revision": "75d2ffeccd821438e2ee7b60b2928542"
  },
  {
    "url": "sticky.js",
    "revision": "5d35ba2b8aea8db9a27b4b614a219a50"
  }
]);