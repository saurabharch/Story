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

if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');

    window.addEventListener('load', function () {
       navigator.serviceWorker.register('/sw.js')
        .then(function (swReg) {
            console.log('service worker registered');

            swRegistration = swReg;

            swRegistration.pushManager.getSubscription()
                .then(function (subscription) {
                    isSubscribed = !(subscription === null);
                    if (isSubscribed) {
                        console.log('User is subscribed');
                    } else {
                        swRegistration.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: urlB64ToUint8Array(applicationKey)
                            })
                            .then(function (subscription) {
                                console.log(subscription);
                                console.log('User is subscribed');

                                saveSubscription(subscription);

                                isSubscribed = true;
                            })
                            .catch(function (err) {
                                console.log('Failed to subscribe user: ', err);
                            })
                    }
                })
                //    // When the user asks to refresh the UI, we'll need to reload the window
                //    var preventDevToolsReloadLoop;
                   navigator.serviceWorker.addEventListener('controllerchange', function (event) {
                       // Ensure refresh is only called once.
                       // This works around a bug in "force update on reload".
                       if (preventDevToolsReloadLoop) return;
                       preventDevToolsReloadLoop = true;
                       console.log('Controller loaded');
                       window.location.reload();
                   });

                   onNewServiceWorker(swReg, function () {
                       showRefreshUI(swReg);
                   });
        })
        .catch(function (error) {
            console.error('Service Worker Error', error);
        }); 
    });
} else {
    console.warn('Push messaging is not supported');
}

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

// function unSubscribe(subscription) {
//      let xmlHttp = new XMLHttpRequest();
//      xmlHttp.open("DELETE", "/unsubscribe");
//      xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//      xmlHttp.onreadystatechange = function () {
//          if (xmlHttp.readyState != 4) return;
//          if (xmlHttp.status != 200 && xmlHttp.status != 304) {
//              console.log('HTTP error ' + xmlHttp.status, null);
//          } else {
//              console.log("User subscribed to server");
//          }
//      };

//      xmlHttp.send(JSON.stringify(subscription));
// }

function showRefreshUI(subscription) {
    // TODO: Display a toast or refresh UI.

    // This demo creates and injects a button.

    var button = document.createElement('button');
    button.style.position = 'absolute';
    button.style.bottom = '24px';
    button.style.left = '24px';
    button.textContent = 'This site has updated. Please click to see changes.';

    button.addEventListener('click', function () {
        if (!registration.waiting) {
            // Just to ensure registration.waiting is available before
            // calling postMessage()
            return;
        }

        button.disabled = true;

        registration.waiting.postMessage('skipWaiting');
    });

    document.body.appendChild(button);
}

function onNewServiceWorker(subscription, callback) {
    if (subscription.waiting) {
        // SW is waiting to activate. Can occur if multiple clients open and
        // one of the clients is refreshed.
        return callback();
    }

    function listenInstalledStateChange() {
        subscription.installing.addEventListener('statechange', function (event) {
            if (event.target.state === 'installed') {
                // A new service worker is available, inform the user
                callback();
            }
        });
    };

    if (subscription.installing) {
        return listenInstalledStateChange();
    }

    // We are currently controlled so a new SW may be found...
    // Add a listener in case a new SW is found,
    subscription.addEventListener('updatefound', listenInstalledStateChange);
}