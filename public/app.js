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
        })
        .catch(function (error) {
            console.error('Service Worker Error', error);
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

function unSubscribe(subscription) {
     let xmlHttp = new XMLHttpRequest();
     xmlHttp.open("DELETE", "/unsubscribe");
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