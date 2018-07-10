if ('serviceWorker' in navigator) {
    window.addEventListener('load', () =>
        navigator.serviceWorker
            .register('sw.js')
            .then(function (registration) {
                console.log("Service Worker Registered",registration);
            }).catch(function (err) {
                console.log("Service Worker Failed to Registered", err);
            }));
}