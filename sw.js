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

workbox.precaching.precacheAndRoute([]);