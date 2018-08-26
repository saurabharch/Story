// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () =>
//         navigator.serviceWorker
//             .register('/lib/sw-toolbox.js')
//             .then(function (registration) {
//                 console.log("Service Worker Registered",registration);
//             }).catch(function (err) {
//                 console.log("Service Worker Failed to Registered", err);
//             }));
// }

// if ('serviceWorker' in navigator) {

//     navigator.serviceWorker
//         .register('./storybook-sw.js', {
//             scope: './storybook-sw.js'
//         })
//         .then(function (registration) {
//             console.log("Service Worker Registered");
//         })
//         .catch(function (err) {
//             console.log("Service Worker Failed to Register", err);
//         })

// }

// var get = function (url) {
//     return new Promise(function (resolve, reject) {

//         var xhr = new XMLHttpRequest();
//         xhr.onreadystatechange = function () {
//             if (xhr.readyState === XMLHttpRequest.DONE) {
//                 if (xhr.status === 200) {
//                     var result = xhr.responseText
//                     result = JSON.parse(result);
//                     resolve(result);
//                 } else {
//                     reject(xhr);
//                 }
//             }
//         };

//         xhr.open("GET", url, true);
//         xhr.send();

//     });
// };

/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-env browser */
// (function () {
 
//     'use strict';

//     if ('serviceWorker' in navigator) {
//         // Delay registration until after the page has loaded, to ensure that our
//         // precaching requests don't degrade the first visit experience.
//         // See https://developers.google.com/web/fundamentals/instant-and-offline/service-worker/registration
//         window.addEventListener('load', function () {
//             // Your service-worker.js *must* be located at the top-level directory relative to your site.
//             // It won't be able to control pages unless it's located at the same level or higher than them.
//             // *Don't* register service worker file in, e.g., a scripts/ sub-directory!
//             // See https://github.com/slightlyoff/ServiceWorker/issues/468
//             navigator.serviceWorker.register('storybook-sw.js').then(function (reg) {
//                 // updatefound is fired if service-worker.js changes.
//                 reg.onupdatefound = function () {
//                     // The updatefound event implies that reg.installing is set; see
//                     // https://w3c.github.io/ServiceWorker/#service-worker-registration-updatefound-event
//                     var installingWorker = reg.installing;

//                     installingWorker.onstatechange = function () {
//                         switch (installingWorker.state) {
//                             case 'installed':
//                                 if (navigator.serviceWorker.controller) {
//                                     // At this point, the old content will have been purged and the fresh content will
//                                     // have been added to the cache.
//                                     // It's the perfect time to display a "New content is available; please refresh."
//                                     // message in the page's interface.
//                                     console.log('New or updated content is available.');
//                                 } else {
//                                     // At this point, everything has been precached.
//                                     // It's the perfect time to display a "Content is cached for offline use." message.
//                                     console.log('Content is now available offline!');
//                                 }
//                                 break;

//                             case 'redundant':
//                                 console.error('The installing service worker became redundant.');
//                                 break;
//                         }
//                     };
//                 };
//             }).catch(function (e) {
//                 console.error('Error during service worker registration:', e);
//             });
//         });
//         var get = function (url) {
//             return new Promise(function (resolve, reject) {

//                 var xhr = new XMLHttpRequest();
//                 xhr.onreadystatechange = function () {
//                     if (xhr.readyState === XMLHttpRequest.DONE) {
//                         if (xhr.status === 200) {
//                             var result = xhr.responseText
//                             result = JSON.parse(result);
//                             resolve(result);
//                         } else {
//                             reject(xhr);
//                         }
//                     }
//                 };

//                 xhr.open("GET", url, true);
//                 xhr.send();

//             });
//         };
//     }
// })();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/story-sw.js').then(function (registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function (err) {
        console.log('ServiceWorker registration failed: ', err);
    });
}

if (navigator.geolocation) {
    console.log('Geolocation is supported!');
} else {
    console.log('Geolocation is not supported for this Browser/OS version yet.');
}

function get(url) {
    // alert('get url initiated');
    console.log("get url");
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();

        req.open('GET', url);
        req.onload = function () {
            if (req.status == 200) {
                resolve(req.response);
            } else {
                reject(Error(req.statusText));
            }
        };

        req.onerror = function () {
            // alert("XHR failed though!");
            connectionFail();
            reject(Error("Network Error"));
        };
        req.send();
    })
}


function emptyNone() {
    document.getElementById('empty').style.display = 'none';
}

function loaderNone() {
    document.getElementById('loader').style.display = 'none';
}

function loaderBlock() {
    document.getElementById('loader').style.display = 'block';
}

function connectionFail() {
    loaderNone();
    document.getElementById('lat').innerHTML = "Bad news! We need the internet";
    document.getElementById('no-connection').style.display = 'block';
}

function connectionFailNone() {
    document.getElementById('no-connection').style.display = 'none';
}

function findLocation() {
    // alert('findLocation initiated');
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            maximumAge: 0,
            timeout: 10000
        });
    });
};

function geoSuccess(position) {
    // alert('geoSuccess initiated');
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    var latshort = lat.toFixed(10) + ", ";
    var longshort = long.toFixed(10);

    document.getElementById('lat').innerHTML = latshort + " " + longshort;
    // document.getElementById('lat').innerHTML = "25.14071, 55.2263179999";

    var latlng = {
        lat: lat,
        long: long
    };

    return latlng;
};

function gpsFail(error) {
    // alert(error);
    document.getElementById('lat').innerHTML = "Bad news! We cannot find you";
    document.getElementById('no-location').style.display = 'block';
    if (error === 1) {
        document.getElementById('location-error').innerHTML = "Are you sure your location <br> service is switched on?";
    } else if (error === 3) {
        document.getElementById('location-error').innerHTML = "Are you moving? Hold still, <br> so we can find you!";
    }
}


function geoFailure(error) {
    emptyNone();
    if (error.code === 2) {
        // alert("geolocation Web API request failed hard!");
        connectionFail();
    } else {
        gpsFail(error.code);
    }
    return Promise.reject(error.code);
}

function searchRestaurants(latlng) {
    // alert('searchRestaurants initiated');
    emptyNone();
    connectionFailNone();
    document.getElementById('restaurants').innerHTML = '';
    loaderBlock();
    return get('/results/?lat=' + latlng.lat + '&long=' + latlng.long);
    // return get('/results/?lat=25.14071&long=55.22631799999999');
}

function showRestaurants(restaurants) {
    loaderNone();
    document.getElementById('restaurants').innerHTML = restaurants;
}

function main() {
    // alert('detect tapped');
    findLocation()
        .then(geoSuccess, geoFailure)
        .then(searchRestaurants)
        .then(showRestaurants);
}

// var detect = document.getElementById('submit');
// detect.addEventListener('click', main);