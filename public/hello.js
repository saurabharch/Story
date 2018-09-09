let notificationUrl = '';

self.addEventListener('push', function (event) {
    console.log('Push received: ', event);
    let _data = event.data ? JSON.parse(event.data.text()) : {};
    notificationUrl = _data.url;
    event.waitUntil(
        self.registration.showNotification(_data.title, {
            // body: _data.message,
            // icon: _data.icon,
            // tag: _data.tag
            body: _data.message,
            tag: _data.tag,
            image: _data.image,
            icon: _data.icon,
            // timestamp: Date.now(),
            badge: '/img/book-96X96.png'
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
